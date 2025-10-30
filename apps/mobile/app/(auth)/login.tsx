import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '../../components/Button';
import BackButton from '../../components/BackButton';
import { colors, spacing, radius } from '../../theme';
import { useAuthStore } from '../../store/auth';

// Keep visuals consistent with register/verify screens
const BG = '#FFF6EF';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const isValid = useMemo(() => phone.trim().length >= 6, [phone]);

  const onSendCode = () => {
    if (!isValid) return;
    // TODO(dev): Temporary mocked auth. Bypass verification and mark user as authenticated with mocked profile.
    // Replace with real auth flow when backend/session is ready.
    useAuthStore.getState().loginWithMock();
    router.replace('/feed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Back button */}
          <BackButton style={styles.backSpacer} />

          {/* Headline */}
          <Text style={styles.title}>Log in</Text>
          <Text style={styles.subtitle}>We’ll send a login code to your phone.</Text>

          {/* Phone input */}
          <View style={styles.inputWrapper}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone Number"
              placeholderTextColor={colors.brand.muted}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              style={styles.input}
            />
          </View>

          <View style={{ height: spacing.lg }} />

          {/* CTA */}
          <PrimaryButton title="Send Code" onPress={onSendCode} disabled={!isValid} />

          {/* Footer help */}
          <View style={{ flex: 1 }} />
          <Text style={styles.footerText}>
            Trouble logging in?{' '}
            <Text
              onPress={() => Linking.openURL('https://example.com/help')}
              style={styles.footerLink}
            >
              Get help
            </Text>
            .
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.xl,
  },
  backSpacer: { marginBottom: spacing.lg },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.brand.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: colors.brand.muted,
  },
  inputWrapper: {
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 64,
    justifyContent: 'center',
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  input: {
    fontSize: 18,
    color: colors.brand.text,
  },
  footerText: {
    textAlign: 'center',
    color: colors.brand.muted,
    marginTop: spacing.xl,
  },
  footerLink: {
    color: colors.brand.text,
    fontWeight: '600',
  },
});
