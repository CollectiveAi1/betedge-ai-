import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { GamesContent } from './_components/games-content';

export const metadata = { title: 'Games' };

export default async function GamesPage() {
  const session = await auth();
  if (!session) redirect('/login');
  return <GamesContent />;
}
