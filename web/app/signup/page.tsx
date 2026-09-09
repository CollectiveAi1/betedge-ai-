import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { SignupForm } from './_components/signup-form';

export const metadata = { title: 'Sign Up' };

export default async function SignupPage() {
  const session = await auth();
  if (session) redirect('/dashboard');
  // The Google button is only rendered when the provider is actually configured.
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <SignupForm googleEnabled={googleEnabled} />;
}
