import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius, Typography, FontSize } from '../../constants/theme';
import { ResponsibleGamblingFooter } from '../../components/ResponsibleGamblingFooter';
import { useAuthStore } from '../../stores/authStore';
import { demoSignIn, isDemoMode, loginUser, setAuthToken } from '../../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s?.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const persistSession = async (token: string, user: Parameters<NonNullable<typeof setAuth>>[1]) => {
    setAuthToken(token);
    await AsyncStorage.setItem('auth_token', token).catch(() => {});
    await AsyncStorage.setItem('auth_user', JSON.stringify(user)).catch(() => {});
    setAuth?.(token, user);
  };

  const handleDemo = async () => {
    const { token, user } = demoSignIn();
    await persistSession(token, user);
  };

  const handleLogin = async () => {
    if (!email?.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(email.trim(), password);
      const token = res?.token ?? '';
      const user = res?.user;
      if (token && user) {
        await persistSession(token, user);
      }
    } catch (err) {
      // The API client throws AuthError with the server's own message, so a bad
      // password now reads as "Invalid email or password" instead of succeeding.
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="shield-check" size={56} color={Colors.accent} />
          <Text style={styles.appTitle}>BetEdge AI</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={Colors.textDisabled}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email input"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={Colors.textDisabled}
                secureTextEntry={!showPw}
                accessibilityLabel="Password input"
              />
              <Pressable style={styles.eyeBtn} onPress={() => setShowPw(!showPw)}>
                <MaterialCommunityIcons
                  name={showPw ? 'eye-off' : 'eye'}
                  size={22}
                  color={Colors.textMuted}
                />
              </Pressable>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.loginBtn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.loginBtnText}>Log In</Text>
            )}
          </Pressable>

          {isDemoMode() && (
            <Pressable style={styles.demoBtn} onPress={handleDemo}>
              <MaterialCommunityIcons name="flask-outline" size={18} color={Colors.textPrimary} />
              <Text style={styles.demoBtnText}>Explore demo data</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/auth/signup')}>
            <Text style={styles.linkText}>Sign Up</Text>
          </Pressable>
        </View>

        <ResponsibleGamblingFooter />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 80, paddingBottom: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  appTitle: { ...Typography.display, marginTop: Spacing.sm },
  form: { gap: Spacing.md },
  inputContainer: { gap: Spacing.xs },
  label: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
  },
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: 'absolute', right: Spacing.md, top: 12 },
  error: { color: Colors.danger, fontSize: FontSize.sm },
  loginBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 4,
  },
  demoBtnText: { ...Typography.body },
  loginBtnText: { ...Typography.body, fontWeight: '700', color: Colors.white },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  bottomText: { ...Typography.body, color: Colors.textMuted },
  linkText: { ...Typography.body, color: Colors.accent, fontWeight: '700' },
});
