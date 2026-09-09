import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DashboardContent } from './_components/dashboard-content';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <DashboardContent />;
}
