import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { GameDetailContent } from './_components/game-detail-content';

export const metadata = { title: 'Game Detail' };

export default async function GameDetailPage({ params }: { params: Promise<{ gameId: string }> }) {
  const session = await auth();
  if (!session) redirect('/login');
  const { gameId } = await params;
  return <GameDetailContent gameId={gameId} />;
}
