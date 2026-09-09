export const dynamic = 'force-dynamic';
import { requireUserId } from '@/lib/api-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

// Stripe price IDs would be set via env vars after Stripe setup
const PRICE_MAP: Record<string, Record<string, string>> = {
  'pro-monthly': {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? '',
    annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? '',
  },
  'elite-monthly': {
    monthly: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID ?? '',
    annual: process.env.STRIPE_ELITE_ANNUAL_PRICE_ID ?? '',
  },
};

export async function POST(request: Request) {
  const userId = await requireUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured yet. Please set up Stripe API keys.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { planId, billingCycle } = body ?? {};
    const priceId = PRICE_MAP[planId ?? '']?.[billingCycle ?? 'monthly'];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Get or create Stripe customer
    const sub = await prisma.subscription.findUnique({
      where: { userId },
    });

    const origin = request.headers.get('origin') ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

    let customerId = sub?.stripeCustomerId;
    if (!customerId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      const customer = await stripe.customers.create({
        email: user?.email ?? undefined,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, stripeCustomerId: customerId },
        update: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?subscribed=true`,
      cancel_url: `${origin}/upgrade`,
      client_reference_id: userId,
      metadata: { userId, planId: planId ?? '' },
      subscription_data: {
        trial_period_days: planId?.startsWith('pro') ? 7 : undefined,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed: ' + (error?.message ?? '') }, { status: 500 });
  }
}
