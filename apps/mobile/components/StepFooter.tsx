import React from "react";
import { View, Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";
import { PrimaryButton } from "./Button";

type Props = {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  disabledNext?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
  style?: ViewStyle | ViewStyle[];
};

export default function StepFooter({
  onNext,
  onBack,
  nextLabel = "Next",
  backLabel = "Back",
  disabledNext,
  skipLabel,
  onSkip,
  style,
}: Props) {
  return (
    <View style={[styles.container, style as any]}>
      <PrimaryButton title={nextLabel} onPress={onNext} disabled={disabledNext} />
      {!!onBack && (
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>{backLabel}</Text>
        </Pressable>
      )}
      {!!onSkip && !!skipLabel && (
        <Pressable accessibilityRole="button" onPress={onSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>{skipLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  backBtn: { alignSelf: "center", padding: spacing.xs },
  backText: { color: colors.brand.text, fontWeight: "600" },
  skipBtn: { alignSelf: "center", padding: spacing.xs },
  skipText: { color: colors.brand.muted },
});

