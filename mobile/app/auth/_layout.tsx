import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../constants/theme';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s?.isAuthenticated);
  const isLoading = useAuthStore((s) => s?.isLoading);

  if (isLoading) return null;
  if (isAuthenticated) return <Redirect href="/tabs" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
