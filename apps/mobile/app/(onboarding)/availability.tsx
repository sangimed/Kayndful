import React, { useMemo } from "react";
import { SafeAreaView, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing } from "../../theme";
import ProgressHeader from "../../components/ProgressHeader";
import StepFooter from "../../components/StepFooter";
import BackButton from "../../components/BackButton";
import Chip from "../../components/Chip";
import { useOnboarding } from "../../store/onboarding";
import { useI18n } from "../../i18n";

const BG = "#FFF6EF";

const TIMES = ["mornings", "afternoons", "evenings", "weekends"] as const;
type TimeId = typeof TIMES[number];

const RADII = [1, 5, 10, 20] as const;
type RadiusKm = typeof RADII[number];

const MODES = ["in_person", "remote", "both"] as const;
type ModeId = typeof MODES[number];

export default function AvailabilityStep() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { t } = useI18n();

  const timeLabels: Record<TimeId, string> = useMemo(
    () => ({
      mornings: t("time_mornings"),
      afternoons: t("time_afternoons"),
      evenings: t("time_evenings"),
      weekends: t("time_weekends"),
    }),
    [t]
  );

  const modeLabels: Record<ModeId, string> = useMemo(
    () => ({ in_person: t("mode_in_person"), remote: t("mode_remote"), both: t("mode_both") }),
    [t]
  );

  const toggleTime = (id: TimeId) => {
    const set = new Set(state.availability.times);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    dispatch({ type: "availability/update", payload: { times: Array.from(set) as any } });
  };

  const setRadius = (km: RadiusKm) => {
    dispatch({ type: "availability/update", payload: { radiusKm: km } });
  };

  const setMode = (m: ModeId) => {
    dispatch({ type: "availability/update", payload: { mode: m } });
  };

  const onNext = () => {
    router.push("/summary");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <BackButton style={{ marginBottom: spacing.lg }} />

          <ProgressHeader step={5} total={6} title={t("onboarding_step5_title")} />

          <Text style={styles.helper}>{t("availability_helper")}</Text>

          <View style={{ height: spacing.md }} />

          <Text style={styles.sectionTitle}>{t("availability_times")}</Text>
          <View style={styles.rowWrap}>
            {TIMES.map((id) => (
              <Chip key={id} label={timeLabels[id]} selected={state.availability.times.includes(id)} onPress={() => toggleTime(id)} />
            ))}
          </View>

          <View style={{ height: spacing.lg }} />

          <Text style={styles.sectionTitle}>{t("availability_radius")}</Text>
          <View style={styles.rowWrap}>
            {RADII.map((km) => (
              <Chip key={km} label={`${km} ${t("km")}`} selected={state.availability.radiusKm === km} onPress={() => setRadius(km)} />
            ))}
          </View>

          <View style={{ height: spacing.lg }} />

          <Text style={styles.sectionTitle}>{t("availability_mode")}</Text>
          <View style={styles.rowWrap}>
            {MODES.map((m) => (
              <Chip key={m} label={modeLabels[m]} selected={state.availability.mode === m} onPress={() => setMode(m)} />
            ))}
          </View>

          <View style={{ flex: 1 }} />

          <StepFooter onNext={onNext} onBack={router.back} nextLabel={t("next")} backLabel={t("back")} onSkip={onNext} skipLabel={t("skip_for_now")} />
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
  sectionTitle: { marginBottom: spacing.sm, marginTop: spacing.md, fontWeight: "700", color: colors.brand.text },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
