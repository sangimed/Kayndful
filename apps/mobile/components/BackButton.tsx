import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../theme";
import { addAlphaToHex, usePressFeedback } from "../hooks/usePressFeedback";

type Props = {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
};

export default function BackButton({ onPress, style, accessibilityLabel }: Props) {
  const router = useRouter();
  const rippleColor = addAlphaToHex(colors.brand.text, 0.16);
  const { animatedStyle, pressableProps } = usePressFeedback({
    androidRipple: { color: rippleColor, foreground: true },
    hitSlop: 8,
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || "Go back"}
      onPress={onPress || router.back}
      style={[styles.container, style as any]}
      {...pressableProps}
    >
      <Text style={styles.icon}>←</Text>
    </Pressable>
  );
}

const SIZE = 40;

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 28,
    lineHeight: 28,
    color: colors.brand.text,
  },
});

