import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AlertsContent } from './_components/alerts-content';

export const metadata = { title: 'Alerts' };

export default async function AlertsPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <AlertsContent />;
}
