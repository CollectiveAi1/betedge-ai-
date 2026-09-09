export const dynamic = 'force-dynamic';
import type Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

// Statuses under which the user still gets what they paid for. Anything else
// (canceled, unpaid, incomplete_expired, paused, ...) drops them back to FREE.
const ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due']);

/** Stripe fields are `string | {id} | null` depending on expansion. */
function idOf(value: string | { id: string } | null | undefined): string {
  if (!value) return '';
  return typeof value === 'string' ? value : value.id;
}

/**
 * `current_period_end` sits on the subscription in older API versions and on each
 * subscription item in newer ones. Read whichever this account's version sends.
 */
function periodEnd(subscription: Stripe.Subscription): Date | null {
  const legacy = (subscription as unknown as { current_period_end?: number }).current_period_end;
  const fromItem = subscription.items?.data?.[0]?.current_period_end;
  const seconds = legacy ?? fromItem;
  return typeof seconds === 'number' ? new Date(seconds * 1000) : null;
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = getStripe();

    if (!stripe || !webhookSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature error:', err?.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId ?? session.client_reference_id;
        const planId = session.metadata?.planId ?? '';
        if (userId) {
          const tier = planId.startsWith('elite') ? 'ELITE' : 'PRO';
          await prisma.user.update({
            where: { id: userId },
            data: { subscriptionTier: tier },
          });
          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: idOf(session.customer),
              stripeSubscriptionId: idOf(session.subscription),
              status: 'active',
            },
            update: {
              stripeSubscriptionId: idOf(session.subscription),
              status: 'active',
            },
          });
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (sub) {
          const status = subscription.status ?? 'active';
          await prisma.subscription.update({
            where: { id: sub.id },
            data: {
              status,
              cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
              currentPeriodEnd: periodEnd(subscription),
            },
          });
          // A subscription that is no longer being paid for must not keep premium access.
          if (!ACTIVE_STATUSES.has(status)) {
            await prisma.user.update({
              where: { id: sub.userId },
              data: { subscriptionTier: 'FREE' },
            });
          }
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: 'canceled' },
          });
          await prisma.user.update({
            where: { id: sub.userId },
            data: { subscriptionTier: 'FREE' },
          });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
        if (!customerId) break;
        const sub = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: 'past_due' },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
