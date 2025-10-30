import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, radius, spacing } from "../theme";
import { addAlphaToHex, usePressFeedback } from "../hooks/usePressFeedback";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
};

export default function Chip({ label, selected, onPress, style }: Props) {
  const ripple = addAlphaToHex(colors.brand.text, 0.12);
  const { animatedStyle, pressableProps } = usePressFeedback({
    androidRipple: { color: ripple, foreground: true },
    hitSlop: 6,
  });
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      {...pressableProps}
      style={[styles.base, selected ? styles.selected : styles.unselected, style as any]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : undefined]}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  unselected: {
    backgroundColor: colors.white,
    borderColor: "#E5E7EB",
  },
  selected: {
    backgroundColor: colors.brand.primaryGradient[0],
    borderColor: "#60A5FA",
  },
  label: {
    color: colors.brand.text,
    fontWeight: "600",
  },
  labelSelected: {
    color: colors.brand.text,
    fontWeight: "700",
  },
});
