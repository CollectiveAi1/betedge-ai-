import Stripe from 'stripe';

/**
 * Returns a Stripe client, or null when Stripe has not been configured yet
 * (missing key, or the placeholder value the deploy template ships with).
 *
 * No `apiVersion` is pinned on purpose: the installed SDK's request and response
 * shapes are generated against the version it ships with, and overriding that with
 * an older date silently desynchronises the two.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith('placeholder')) return null;
  return new Stripe(key);
}
