import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s?.isAuthenticated);
  const isLoading = useAuthStore((s) => s?.isLoading);
  const hasOnboarded = useAuthStore((s) => s?.hasOnboarded);

  if (isLoading) return null;
  if (!hasOnboarded) return <Redirect href="/onboarding" />;
  if (isAuthenticated) return <Redirect href="/tabs" />;
  return <Redirect href="/auth/login" />;
}
