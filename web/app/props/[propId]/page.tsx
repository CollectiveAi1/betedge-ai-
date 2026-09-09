import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PropDetailContent } from './_components/prop-detail-content';

export const metadata = { title: 'Prop Detail' };

export default async function PropDetailPage({ params }: { params: Promise<{ propId: string }> }) {
  const session = await auth();
  if (!session) redirect('/login');
  const { propId } = await params;
  return <PropDetailContent propId={propId} />;
}
