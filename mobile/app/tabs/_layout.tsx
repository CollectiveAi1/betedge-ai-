import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { useAuthStore } from '../../stores/authStore';

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s?.isAuthenticated);
  const isLoading = useAuthStore((s) => s?.isLoading);
  const insets = useSafeAreaInsets();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" size={size} color={color} />
          ),
          tabBarButtonTestID: 'tab-today',
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-outline" size={size} color={color} />
          ),
          tabBarButtonTestID: 'tab-games',
        }}
      />
      <Tabs.Screen
        name="props"
        options={{
          title: 'Props',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
          tabBarButtonTestID: 'tab-props',
        }}
      />
      <Tabs.Screen
        name="parlay"
        options={{
          title: 'Parlay',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="layers-outline" size={size} color={color} />
          ),
          tabBarButtonTestID: 'tab-parlay',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" size={size} color={color} />
          ),
          tabBarButtonTestID: 'tab-account',
        }}
      />
    </Tabs>
  );
}
