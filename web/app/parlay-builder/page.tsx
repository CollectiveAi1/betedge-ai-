import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ParlayBuilderContent } from './_components/parlay-builder-content';

export const metadata = { title: 'Parlay Builder' };

export default async function ParlayBuilderPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <ParlayBuilderContent />;
}
