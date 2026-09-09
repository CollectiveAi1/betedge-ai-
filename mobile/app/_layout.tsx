import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Colors } from '../constants/theme';
import { useAuthStore } from '../stores/authStore';
import { setAuthToken } from '../services/api';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const setAuth = useAuthStore((s) => s?.setAuth);
  const setHasOnboarded = useAuthStore((s) => s?.setHasOnboarded);
  const setLoading = useAuthStore((s) => s?.setLoading);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [token, userStr, onboarded] = await Promise.all([
          AsyncStorage.getItem('auth_token').catch(() => null),
          AsyncStorage.getItem('auth_user').catch(() => null),
          AsyncStorage.getItem('hasOnboarded').catch(() => null),
        ]);
        if (!mounted) return;
        if (onboarded === 'true') setHasOnboarded?.(true);
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            setAuthToken(token);
            setAuth?.(token, user);
          } catch { /* ignore parse error */ }
        }
      } finally {
        if (mounted) {
          setLoading?.(false);
          setReady(true);
          SplashScreen.hideAsync().catch(() => {});
        }
      }
    })();
    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted && !ready) {
        setLoading?.(false);
        setReady(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    }, 3000);
    return () => { mounted = false; clearTimeout(timeout); };
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <PaperProvider>
            <QueryClientProvider client={queryClient}>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: Colors.background },
                  animation: 'slide_from_right',
                }}
              />
            </QueryClientProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
