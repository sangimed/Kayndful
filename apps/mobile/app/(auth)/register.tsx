import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../../components/Button';
import BackButton from '../../components/BackButton';
import FormInput from '../../components/FormInput';
import { colors, spacing, radius } from '../../theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const isValid = useMemo(() => phone.trim().length >= 6, [phone]);

  const onSendCode = () => {
    if (!isValid) return;
    router.push({ pathname: '/verify-code', params: { phone: phone.trim() } });
  };

  return (
    <LinearGradient colors={['#EEF2FF', '#F8FAFC', '#FFFFFF']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <BackButton style={styles.backSpacer} />

            <View style={styles.card}>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>We’ll text you a verification code.</Text>

              <FormInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                containerStyle={{ marginTop: spacing.lg }}
              />

              <View style={{ height: spacing.md }} />
              <PrimaryButton title="Send code" onPress={onSendCode} disabled={!isValid} />
            </View>

            <View style={{ flex: 1 }} />
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text
                onPress={() => Linking.openURL('https://example.com/terms')}
                style={styles.footerLink}
              >
                Terms of Service
              </Text>
              .
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  backSpacer: { marginBottom: spacing.md },
  card: {
    backgroundColor: colors.brand.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.brand.border,
    padding: spacing.lg,
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: colors.shadow.brand.opacity,
    shadowRadius: colors.shadow.brand.radius,
    shadowOffset: { width: 0, height: colors.shadow.brand.offsetY },
    elevation: colors.shadow.brand.elevation,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.brand.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 15,
    color: colors.brand.muted,
  },
  footerText: {
    textAlign: 'center',
    color: colors.brand.muted,
    marginTop: spacing.xl,
    fontSize: 13,
  },
  footerLink: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
});
