import React, { ReactNode } from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius } from "../theme";

type CommonButtonProps = {
  title?: string;
  children?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
};

export function PrimaryButton({
  title,
  children,
  onPress,
  style,
  textStyle,
  disabled,
}: CommonButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.ctaContainer,
        pressed && { opacity: 0.95 },
        disabled && { opacity: 0.6 },
        style as any,
      ]}
    >
      <LinearGradient
        colors={[colors.brand.primaryGradient[0], colors.brand.primaryGradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryBtn}
      >
        {children ?? (
          <Text style={[styles.primaryLabel, textStyle as any]}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export function SecondaryButton({
  title,
  children,
  onPress,
  style,
  textStyle,
  disabled,
}: CommonButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.secondaryBtn,
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.6 },
        style as any,
      ]}
    >
      {children ?? (
        <Text style={[styles.secondaryLabel, textStyle as any]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ctaContainer: {
    alignSelf: "stretch",
    width: "100%",
    borderRadius: radius.lg,
    shadowColor: colors.shadow.primaryBtn.color,
    shadowOpacity: colors.shadow.primaryBtn.opacity,
    shadowRadius: colors.shadow.primaryBtn.radius,
    shadowOffset: { width: 0, height: colors.shadow.primaryBtn.offsetY },
    elevation: colors.shadow.primaryBtn.elevation,
  },
  primaryBtn: {
    alignItems: "center",
    height: 68,
    width: "100%",
    borderRadius: radius.md,
    justifyContent: "center",
    overflow: "hidden",
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  secondaryBtn: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    height: 68,
  },
  secondaryLabel: {
    textAlign: "center",
    color: colors.brand.text,
    fontSize: 20,
    fontWeight: "600",
  },
});

export default PrimaryButton;
