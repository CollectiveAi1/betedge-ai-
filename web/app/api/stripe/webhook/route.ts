export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeKey || !webhookSecret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' as any });

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature error:', err?.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session?.metadata?.userId ?? session?.client_reference_id;
        const planId = session?.metadata?.planId ?? '';
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
              stripeCustomerId: session?.customer ?? '',
              stripeSubscriptionId: session?.subscription ?? '',
              status: 'active',
            },
            update: {
              stripeSubscriptionId: session?.subscription ?? '',
              status: 'active',
            },
          });
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription?.id },
        });
        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: {
              status: subscription?.status ?? 'active',
              cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
              currentPeriodEnd: subscription?.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : null,
            },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription?.id },
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
        const invoice = event.data.object as any;
        const sub = await prisma.subscription.findFirst({
          where: { stripeCustomerId: invoice?.customer },
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
