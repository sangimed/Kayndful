import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import PrimaryButton from "../../components/Button";
import BackButton from "../../components/BackButton";
import { colors, spacing, radius } from "../../theme";

const BG = "#FFF6EF";

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const [code, setCode] = useState("");

  const isValid = useMemo(() => code.replace(/\D/g, "").length === 6, [code]);

  const onVerify = () => {
    if (!isValid) return;
    // After successful verification, go to onboarding step 1
    router.push("/identity");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <BackButton style={styles.backSpacer} />

          <Text style={styles.title}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            {phone ? `We sent a 6-digit code to ${phone}.` : "We sent a 6-digit code to your phone."}
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              value={code}
              onChangeText={(t) => setCode(t.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit code"
              placeholderTextColor={colors.brand.muted}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              maxLength={6}
              autoFocus
              style={styles.input}
            />
          </View>

          <View style={{ height: spacing.lg }} />

          <PrimaryButton title="Verify Code" onPress={onVerify} disabled={!isValid} />

          <View style={{ flex: 1 }} />
          <Pressable accessibilityRole="button" onPress={() => { /* TODO: implement resend */ }}>
            <Text style={styles.resend}>Didn’t get it? Resend code</Text>
          </Pressable>
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
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  input: {
    fontSize: 20,
    letterSpacing: 6,
    color: colors.brand.text,
  },
  resend: {
    textAlign: "center",
    color: colors.brand.text,
    fontWeight: "600",
    marginTop: spacing.xl,
  },
});
