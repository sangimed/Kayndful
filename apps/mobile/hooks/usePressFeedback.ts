import { useMemo, useRef } from "react";
import { Animated, PressableAndroidRippleConfig, Insets } from "react-native";

type HapticsLevel = "light" | "medium" | "heavy" | "selection";

export type UsePressFeedbackOptions = {
  // Target values when pressed
  scaleTo?: number; // default 0.98
  opacityTo?: number; // default 0.9
  durationMs?: number; // default 90
  // Touch area
  hitSlop?: number | Insets; // default 8
  // Android ripple config
  androidRipple?: PressableAndroidRippleConfig;
  // Optional Expo haptics; resolved at runtime if available
  haptics?: boolean | HapticsLevel; // default false
};

export function usePressFeedback(options: UsePressFeedbackOptions = {}) {
  const {
    scaleTo = 0.98,
    opacityTo = 0.9,
    durationMs = 90,
    hitSlop = 8,
    androidRipple,
    haptics = false,
  } = options;

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const runHaptics = async () => {
    if (!haptics) return;
    try {
      const Haptics = await import("expo-haptics");
      if (haptics === true || haptics === "selection") {
        await Haptics.selectionAsync();
      } else {
        const styleMap = {
          light: Haptics.ImpactFeedbackStyle.Light,
          medium: Haptics.ImpactFeedbackStyle.Medium,
          heavy: Haptics.ImpactFeedbackStyle.Heavy,
        } as const;
        const style = styleMap[(haptics as Exclude<HapticsLevel, "selection">) || "light"];
        await Haptics.impactAsync(style);
      }
    } catch {
      // expo-haptics not installed; ignore gracefully
    }
  };

  const pressIn = () => {
    Animated.parallel([
      Animated.timing(scale, { toValue: scaleTo, duration: durationMs, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: opacityTo, duration: durationMs, useNativeDriver: true }),
    ]).start();
    // Fire haptics on press-in for immediate feedback
    // Do not await to avoid delaying UI feedback
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    runHaptics();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: durationMs, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: durationMs, useNativeDriver: true }),
    ]).start();
  };

  const animatedStyle = useMemo(
    () => ({ transform: [{ scale }], opacity }),
    [opacity, scale]
  );

  return {
    animatedStyle,
    pressableProps: {
      hitSlop,
      android_ripple: androidRipple,
      onPressIn: pressIn,
      onPressOut: pressOut,
    } as const,
  };
}

// Utility: add an alpha channel to a hex color like #RRGGBB
export function addAlphaToHex(hex: string, alpha: number) {
  // Clamp alpha [0,1]
  const a = Math.max(0, Math.min(1, alpha));
  const intA = Math.round(a * 255);
  const hexA = intA.toString(16).padStart(2, "0");
  const clean = hex.replace("#", "");
  if (clean.length === 6) return `#${clean}${hexA}`;
  if (clean.length === 8) return `#${clean.slice(0, 6)}${hexA}`;
  // Fallback: return original if format unknown
  return hex;
}

