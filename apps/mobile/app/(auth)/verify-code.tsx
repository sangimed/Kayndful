import React, { useMemo, useRef, useState } from "react";
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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton, { SecondaryButton } from "../../components/Button";
import { colors, spacing, radius } from "../../theme";

const BG = "#FFF6EF";
const CODE_LENGTH = 6;

function maskPhone(value?: string) {
  if (!value) return undefined;
  const trimmed = value.replace(/\s+/g, "");
  if (trimmed.length < 4) return trimmed;
  const lastFour = trimmed.slice(-4);
  return `*** ${lastFour}`;
}

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [isFocused, setFocused] = useState(false);

  const displayPhone = useMemo(() => maskPhone(phone), [phone]);
  const digits = useMemo(
    () => code.replace(/\D/g, "").slice(0, CODE_LENGTH),
    [code]
  );
  const isComplete = digits.length === CODE_LENGTH;

  const handleChange = (value: string) => {
    setCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH));
  };

  const handleVerify = () => {
    if (!isComplete) return;
    // TODO: invoke verification API once backend is ready
  };

  const handleResend = () => {
    // TODO: hook into resend code endpoint
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>
            {displayPhone
              ? `We texted a ${CODE_LENGTH}-digit code to ${displayPhone}.`
              : `Check your messages for the ${CODE_LENGTH}-digit code.`}
          </Text>

          <Pressable
            onPress={() => inputRef.current?.focus()}
            style={styles.otpContainer}
            accessibilityRole="button"
            accessibilityLabel="Enter verification code"
          >
            {Array.from({ length: CODE_LENGTH }).map((_, index) => {
              const char = digits[index] ?? "";
              const showCursor =
                isFocused && index === digits.length && digits.length < CODE_LENGTH;
              return (
                <View
                  key={index}
                  style={[
                    styles.otpCell,
                    showCursor && styles.otpCellFocused,
                  ]}
                >
                  <Text style={styles.otpDigit}>{char || (showCursor ? "|" : "")}</Text>
                </View>
              );
            })}
          </Pressable>
          <TextInput
            ref={inputRef}
            value={digits}
            onChangeText={handleChange}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            maxLength={CODE_LENGTH}
            autoFocus
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={styles.hiddenInput}
          />

          <View style={{ height: spacing.lg }} />

          <PrimaryButton
            title="Verify Code"
            onPress={handleVerify}
            disabled={!isComplete}
          />

          <SecondaryButton
            title="Resend Code"
            onPress={handleResend}
            style={styles.resendBtn}
          />
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.xl,
  },
  otpCell: {
    width: 48,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  otpCellFocused: {
    borderWidth: 1.5,
    borderColor: colors.brand.text,
  },
  otpDigit: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.brand.text,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
  resendBtn: {
    marginTop: spacing.md,
  },
});
