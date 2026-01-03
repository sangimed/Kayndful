import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { AppLogo } from '../components/Logo';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { colors, spacing } from '../theme';
import { addAlphaToHex } from '../hooks/usePressFeedback';

const HERO_GRADIENT = [
  colors.brand.surfaceMuted,
  addAlphaToHex(colors.brand.accent, 0.08),
  colors.brand.surfaceStrong,
] as const;

export default function Index() {
  const goSignUp = () => router.push('/register');
  const goLogin = () => router.push('/login');

  return (
    <LinearGradient
      colors={HERO_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <StatusBar style="dark" />

      <View style={styles.centerBlock}>
        <AppLogo />

        <Text style={styles.title}>Kayndful</Text>
        <Text style={styles.subtitle}>Turns free time into acts of kindness.</Text>

        <View style={styles.actions}>
          <PrimaryButton title="Sign Up" onPress={goSignUp} />
          <SecondaryButton title="Log In" onPress={goLogin} />
        </View>
      </View>

      <Text style={styles.footer}>New users require phone verification.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    // Reduce side padding so buttons get wider.
    paddingHorizontal: spacing.lg,
  },
  title: {
    alignSelf: 'center',
    fontSize: 48,
    fontWeight: '800',
    color: colors.brand.text,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    alignItems: 'center',
    fontSize: 20,
    lineHeight: 28,
    color: colors.brand.muted,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
    marginBottom: spacing.xl,
  },
  actions: {
    alignItems: 'stretch',
    gap: spacing.md,
  },
  footer: {
    textAlign: 'center',
    color: colors.brand.muted,
    marginBottom: Platform.select({ ios: 34, android: 42 }),
    fontSize: 17,
  },
});
