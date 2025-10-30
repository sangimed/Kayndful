import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../theme";
import ProgressHeader from "../../components/ProgressHeader";
import FormInput from "../../components/FormInput";
import StepFooter from "../../components/StepFooter";
import BackButton from "../../components/BackButton";
import { useOnboarding, formatDisplayName } from "../../store/onboarding";
import { useI18n } from "../../i18n";

const BG = "#FFF6EF";

export default function IdentityStep() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { t } = useI18n();

  const [touched, setTouched] = useState({ first: false, last: false, username: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // TODO refactor to use a custom hook for form validation
  // This is a simple validation for demonstration purposes.
  // In a real app, you might want to use a library like Formik or React Hook Form.
  const firstNameError = useMemo(() => {
    return state.identity.firstName.trim().length === 0 ? t("first_name_required") : undefined;
  }, [state.identity.firstName, t]);

  const lastNameError = useMemo(() => {
    return state.identity.lastName.trim().length === 0 ? t("last_name_required") : undefined;
  }, [state.identity.lastName, t]);

  const usernameError = useMemo(() => {
    return state.identity.username.trim().length === 0 ? t("username_required") : undefined;
  }, [state.identity.username, t]);

  const preview = useMemo(() => formatDisplayName(state.identity), [state.identity]);
  const initialsMode = state.identity.visibility === "initial";

  const isValid =
    state.identity.firstName.trim().length > 0 &&
    state.identity.lastName.trim().length > 0 &&
    state.identity.username.trim().length > 0;

  const onNext = () => {
    setSubmitAttempted(true);
    if (!isValid) return;
    router.push("/location");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <BackButton style={{ marginBottom: spacing.lg }} />

          <ProgressHeader step={1} total={6} title={t("onboarding_step1_title")} />

          <View style={styles.formGap}>
            <FormInput
              label={t("first_name")}
              placeholder={t("first_name")}
              value={state.identity.firstName}
              onChangeText={(firstName) => dispatch({ type: "identity/update", payload: { firstName } })}
              onBlur={() => setTouched((p) => ({ ...p, first: true }))}
              autoCapitalize="words"
              autoCorrect={false}
              accessibilityLabel={t("first_name")}
              error={touched.first || submitAttempted ? firstNameError : undefined}
            />

            <FormInput
              label={t("last_name")}
              placeholder={t("last_name")}
              value={state.identity.lastName}
              onChangeText={(lastName) => dispatch({ type: "identity/update", payload: { lastName } })}
              onBlur={() => setTouched((p) => ({ ...p, last: true }))}
              autoCapitalize="words"
              autoCorrect={false}
              accessibilityLabel={t("last_name")}
              error={touched.last || submitAttempted ? lastNameError : undefined}
            />

            <FormInput
              label={t("username")}
              placeholder={t("username")}
              value={state.identity.username}
              onChangeText={(username) => dispatch({ type: "identity/update", payload: { username } })}
              onBlur={() => setTouched((p) => ({ ...p, username: true }))}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={t("username")}
              error={touched.username || submitAttempted ? usernameError : undefined}
            />

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>{initialsMode ? t("toggle_initials") : t("toggle_hide_last")}</Text>
                <Text style={styles.toggleHelp}>{t("name_preview_label")}: {preview || "—"}</Text>
              </View>
              <Switch
                accessibilityLabel={initialsMode ? t("toggle_initials") : t("toggle_hide_last")}
                trackColor={{ false: "#e5e7eb", true: "#bfe0ff" }}
                thumbColor={initialsMode ? "#60A5FA" : "#9CA3AF"}
                value={initialsMode}
                onValueChange={(v) =>
                  dispatch({ type: "identity/update", payload: { visibility: v ? "initial" : "hidden" } })
                }
              />
            </View>
          </View>

          <View style={{ flex: 1 }} />

          <StepFooter
            onNext={onNext}
            onBack={router.back}
            nextLabel={t("next")}
            backLabel={t("back")}
            disabledNext={!isValid}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.xl,
  },
  formGap: { gap: spacing.lg },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  toggleTitle: { fontSize: 16, fontWeight: "600", color: colors.brand.text },
  toggleHelp: { marginTop: 4, color: colors.brand.muted },
});
