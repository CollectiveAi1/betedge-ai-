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
import { signupUser, setAuthToken } from '../../services/api';

export default function SignupScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s?.setAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pwStrength = (password?.length ?? 0) >= 8 ? 'strong' : (password?.length ?? 0) >= 6 ? 'medium' : 'weak';
  const pwColor = pwStrength === 'strong' ? Colors.accent : pwStrength === 'medium' ? Colors.warning : Colors.danger;
  const canSubmit = name?.trim() && email?.trim() && (password?.length ?? 0) >= 6 && ageConfirmed;

  const handleSignup = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const res = await signupUser(name.trim(), email.trim(), password);
      const token = res?.token ?? '';
      const user = res?.user;
      if (token && user) {
        setAuthToken(token);
        await AsyncStorage.setItem('auth_token', token).catch(() => {});
        await AsyncStorage.setItem('auth_user', JSON.stringify(user)).catch(() => {});
        setAuth?.(token, user);
      }
    } catch {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create Account</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={Colors.textDisabled} accessibilityLabel="Name input" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="your@email.com" placeholderTextColor={Colors.textDisabled} keyboardType="email-address" autoCapitalize="none" accessibilityLabel="Email input" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Min 6 characters" placeholderTextColor={Colors.textDisabled} secureTextEntry accessibilityLabel="Password input" />
            {(password?.length ?? 0) > 0 && (
              <View style={styles.strengthRow}>
                <View style={[styles.strengthBar, { backgroundColor: pwColor, width: pwStrength === 'strong' ? '100%' : pwStrength === 'medium' ? '66%' : '33%' }]} />
              </View>
            )}
          </View>

          <Pressable style={styles.checkRow} onPress={() => setAgeConfirmed(!ageConfirmed)}>
            <MaterialCommunityIcons
              name={ageConfirmed ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={ageConfirmed ? Colors.accent : Colors.textMuted}
            />
            <Text style={styles.checkText}>I confirm I am 21 years of age or older</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.submitBtn, !canSubmit && styles.btnDisabled]}
            onPress={handleSignup}
            disabled={!canSubmit || loading}
          >
            {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitBtnText}>Create Account</Text>}
          </Pressable>

          <Pressable style={styles.googleBtn}>
            <MaterialCommunityIcons name="google" size={20} color={Colors.textPrimary} />
            <Text style={styles.googleBtnText}>Sign in with Google</Text>
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.linkText}>Log In</Text>
          </Pressable>
        </View>

        <ResponsibleGamblingFooter />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.xl },
  heading: { ...Typography.display, marginBottom: Spacing.lg },
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
  strengthRow: { height: 4, backgroundColor: Colors.surfaceLight, borderRadius: 2, marginTop: Spacing.xs, overflow: 'hidden' },
  strengthBar: { height: '100%', borderRadius: 2 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  checkText: { ...Typography.body, color: Colors.textSecondary, flex: 1 },
  error: { color: Colors.danger, fontSize: FontSize.sm },
  submitBtn: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  submitBtnText: { ...Typography.body, fontWeight: '700', color: Colors.white },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 4,
  },
  googleBtnText: { ...Typography.body },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  bottomText: { ...Typography.body, color: Colors.textMuted },
  linkText: { ...Typography.body, color: Colors.accent, fontWeight: '700' },
});
