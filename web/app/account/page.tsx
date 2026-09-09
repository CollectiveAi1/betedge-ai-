import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AccountContent } from './_components/account-content';

export const metadata = { title: 'Account' };

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <AccountContent />;
}
