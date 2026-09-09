import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from './_components/login-form';

export const metadata = { title: 'Log In' };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect('/dashboard');
  // The Google button is only rendered when the provider is actually configured.
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  return <LoginForm googleEnabled={googleEnabled} />;
}
