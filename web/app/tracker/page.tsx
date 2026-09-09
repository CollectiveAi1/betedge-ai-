import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { TrackerContent } from './_components/tracker-content';

export const metadata = { title: 'Pick Tracker' };

export default async function TrackerPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <TrackerContent />;
}
