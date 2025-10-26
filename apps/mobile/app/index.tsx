import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { AppLogo } from '../components/Logo';
import { PrimaryButton, SecondaryButton } from '../components/Button';

export default function Index() {
  const goSignUp = () => router.push('/register');
  const goLogin = () => router.push('/login');

  return (
    <LinearGradient
      colors={['#ede0ff', '#ece4f7', '#f7f2ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <StatusBar style="dark" />

      <View style={styles.centerBlock}>
        <AppLogo />

        <Text style={styles.title}>Kayndful</Text>
        <Text style={styles.subtitle}>Turns free time into acts of kindness 🫶</Text>

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
    paddingHorizontal: 16,
  },
  title: {
    alignSelf: 'center',
    fontSize: 48,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    alignItems: 'center',
    fontSize: 20,
    lineHeight: 28,
    color: '#6B7280',
    textAlign: 'center',
    marginHorizontal: 8,
    marginBottom: 28,
  },
  actions: {
    alignItems: 'stretch',
    gap: 16,
  },
  footer: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginBottom: Platform.select({ ios: 34, android: 42 }),
    fontSize: 17,
  },
});
