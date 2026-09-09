import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UpgradeContent } from './_components/upgrade-content';

export const metadata = { title: 'Upgrade' };

export default async function UpgradePage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <UpgradeContent />;
}
