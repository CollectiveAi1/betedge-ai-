import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PropsContent } from './_components/props-content';

export const metadata = { title: 'Player Props' };

export default async function PropsPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <PropsContent />;
}
