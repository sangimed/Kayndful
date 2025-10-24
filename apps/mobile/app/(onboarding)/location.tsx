import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "../../theme";
import ProgressHeader from "../../components/ProgressHeader";
import FormInput from "../../components/FormInput";
import StepFooter from "../../components/StepFooter";
import BackButton from "../../components/BackButton";
import { useOnboarding } from "../../store/onboarding";
import { useI18n } from "../../i18n";

const BG = "#FFF6EF";

export default function LocationStep() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { t } = useI18n();

  const [touched, setTouched] = useState({ address: false, zip: false, city: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const { address = "", zip = "", city = "" } = state.location;

  const hasAddress = address.trim().length > 0;
  const hasZipCity = zip.trim().length > 0 && city.trim().length > 0;
  const isValid = hasAddress || hasZipCity;

  const addressError = useMemo(() => {
    if (hasAddress) return undefined;
    if (!hasZipCity) return t("address_or_zip_city_required");
    return undefined;
  }, [hasAddress, hasZipCity, t]);

  const zipError = useMemo(() => {
    if (hasAddress) return undefined;
    return zip.trim().length === 0 ? t("zip_required_unless_address") : undefined;
  }, [hasAddress, zip, t]);

  const cityError = useMemo(() => {
    if (hasAddress) return undefined;
    return city.trim().length === 0 ? t("city_required_unless_address") : undefined;
  }, [hasAddress, city, t]);

  const onNext = () => {
    setSubmitAttempted(true);
    if (!isValid) return;
    router.push("/profile");
  };

  const onUseCurrentLocation = async () => {
    // Non-blocking placeholder: mark flag and show privacy note.
    // We can wire up expo-location later if desired.
    dispatch({ type: "location/update", payload: { usedCurrentLocation: true } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <BackButton style={{ marginBottom: spacing.lg }} />

          <ProgressHeader step={2} total={6} title={t("onboarding_step2_title")} />

          <Text style={styles.helper}>{t("location_helper")}</Text>

          <View style={{ height: spacing.md }} />

          <FormInput
            label={t("postal_address")}
            placeholder={t("postal_address")}
            value={address}
            onChangeText={(v) => dispatch({ type: "location/update", payload: { address: v } })}
            onBlur={() => setTouched((p) => ({ ...p, address: true }))}
            accessibilityLabel={t("postal_address")}
            autoCapitalize="words"
            error={touched.address || submitAttempted ? addressError : undefined}
          />

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{t("or")}</Text>
            <View style={styles.orLine} />
          </View>

          <View style={styles.rowGap}>
            <FormInput
              label={t("zip")}
              placeholder={t("zip")}
              value={zip}
              onChangeText={(v) => dispatch({ type: "location/update", payload: { zip: v } })}
              onBlur={() => setTouched((p) => ({ ...p, zip: true }))}
              keyboardType="number-pad"
              accessibilityLabel={t("zip")}
              error={touched.zip || submitAttempted ? zipError : undefined}
            />
            <FormInput
              label={t("city")}
              placeholder={t("city")}
              value={city}
              onChangeText={(v) => dispatch({ type: "location/update", payload: { city: v } })}
              onBlur={() => setTouched((p) => ({ ...p, city: true }))}
              accessibilityLabel={t("city")}
              error={touched.city || submitAttempted ? cityError : undefined}
            />
          </View>

          <View style={{ height: spacing.md }} />

          <Pressable accessibilityRole="button" onPress={onUseCurrentLocation} style={styles.locationBtn}>
            <Text style={styles.locationBtnText}>📍 {t("use_current_location")}</Text>
          </Pressable>

          {state.location.usedCurrentLocation && (
            <Text style={styles.privacyNote}>{t("location_privacy_note")}</Text>
          )}

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
  helper: { color: colors.brand.muted },
  rowGap: { gap: spacing.lg },
  orRow: { flexDirection: "row", alignItems: "center", marginVertical: spacing.md },
  orLine: { flex: 1, height: 1, backgroundColor: "#F2E7DF" },
  orText: { marginHorizontal: spacing.sm, color: colors.brand.muted },
  locationBtn: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  locationBtnText: { fontWeight: "600", color: colors.brand.text },
  privacyNote: { color: colors.brand.muted, marginTop: spacing.sm },
});
