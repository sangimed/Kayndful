import React, { useMemo, useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../../components/Button";
import { colors, spacing, radius } from "../../theme";

// Soft warm background to match the mock
const BG = "#FFF6EF";

export default function RegisterScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const isValid = useMemo(() => phone.trim().length >= 6, [phone]);

  const onSendCode = () => {
    if (!isValid) return;
    router.push({
      pathname: "/verify-code",
      params: { phone: phone.trim() },
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          {/* Headline */}
          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.subtitle}>
            We&apos;ll send a verification code to your phone.
          </Text>

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
          <PrimaryButton
            title="Send Code"
            onPress={onSendCode}
            disabled={!isValid}
          />

          {/* Footer terms */}
          <View style={{ flex: 1 }} />
          <Text style={styles.footerText}>
            By continuing, you agree to our
            {" "}
            <Text
              onPress={() => Linking.openURL("https://example.com/terms")}
              style={styles.footerLink}
            >
              Terms of Service
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  backIcon: {
    fontSize: 32,
    color: colors.brand.text,
    lineHeight: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
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
    justifyContent: "center",
    // Soft shadow similar to the mock
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
    textAlign: "center",
    color: colors.brand.muted,
    marginTop: spacing.xl,
  },
  footerLink: {
    color: colors.brand.text,
    fontWeight: "600",
  },
});
