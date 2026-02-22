import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { AppLogo } from '../components/Logo';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { colors, spacing, radius } from '../theme';

const BG_GRADIENT = ['#EEF2FF', '#F8FAFC', '#FFFFFF'] as const;

export default function Index() {
  return (
    <LinearGradient colors={BG_GRADIENT} style={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.heroWrap}>
        <View style={styles.logoWrap}>
          <AppLogo />
        </View>

        <Text style={styles.eyebrow}>COMMUNITY CARE</Text>
        <Text style={styles.title}>Kayndful</Text>
        <Text style={styles.subtitle}>Turn free time into meaningful acts of kindness.</Text>

        <View style={styles.actions}>
          <PrimaryButton title="Create account" onPress={() => router.push('/register')} />
          <SecondaryButton
            title="I already have an account"
            onPress={() => router.push('/login')}
          />
        </View>
      </View>

      <Text style={styles.footer}>Phone verification required for new users</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  heroWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoWrap: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.brand.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.brand.border,
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: colors.shadow.brand.opacity,
    shadowRadius: colors.shadow.brand.radius,
    shadowOffset: { width: 0, height: colors.shadow.brand.offsetY },
    elevation: colors.shadow.brand.elevation,
  },
  eyebrow: {
    alignSelf: 'center',
    color: colors.brand.accent,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.3,
    marginBottom: spacing.xs,
  },
  title: {
    alignSelf: 'center',
    fontSize: 44,
    fontWeight: '800',
    color: colors.brand.text,
    letterSpacing: -0.8,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: colors.brand.muted,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
    marginBottom: spacing.xl,
  },
  actions: {
    gap: spacing.sm,
  },
  footer: {
    textAlign: 'center',
    color: colors.brand.muted,
    marginBottom: Platform.select({ ios: 34, android: 30 }),
    fontSize: 13,
  },
});
