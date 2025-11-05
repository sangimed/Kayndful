import React, { ReactNode } from 'react';
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius } from '../theme';
import { usePressFeedback, addAlphaToHex } from '../hooks/usePressFeedback';

type CommonButtonProps = {
  title?: string;
  children?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
};

type PrimaryVariant = 'primary' | 'success' | 'danger' | 'ghost';

export function PrimaryButton({
  title,
  children,
  onPress,
  style,
  textStyle,
  disabled,
  // variant option kept lightweight and backward-compatible
  variant = 'primary',
}: CommonButtonProps & { variant?: PrimaryVariant }) {
  // Android ripple derived from theme, using foreground overlay
  const rippleColor = addAlphaToHex(colors.brand.text, 0.16);
  const { animatedStyle, pressableProps } = usePressFeedback({
    androidRipple: { color: rippleColor, foreground: true },
    hitSlop: 8,
  });
  const isGhost = variant === 'ghost';

  // Choose gradient or plain background based on variant
  const gradientColors =
    variant === 'success'
      ? colors.semantic.successGradient
      : variant === 'danger'
        ? colors.semantic.dangerGradient
        : colors.brand.primaryGradient;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      {...pressableProps}
      style={[styles.ctaContainer, disabled && { opacity: 0.6 }, style as any]}
    >
      <Animated.View style={animatedStyle}>
        {isGhost ? (
          <Animated.View
            style={[
              styles.primaryBtn,
              {
                backgroundColor: colors.brand.surface,
                borderWidth: 1,
                borderColor: colors.brand.border,
                shadowOpacity: 0,
              },
            ]}
          >
            {children ?? <Text style={[styles.secondaryLabel, textStyle as any]}>{title}</Text>}
          </Animated.View>
        ) : (
          <LinearGradient
            colors={[gradientColors[0], gradientColors[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryBtn}
          >
            {children ?? <Text style={[styles.primaryLabel, textStyle as any]}>{title}</Text>}
          </LinearGradient>
        )}
      </Animated.View>
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
  // Same ripple for secondary, kept consistent across buttons
  const rippleColor = addAlphaToHex(colors.brand.text, 0.16);
  const { animatedStyle, pressableProps } = usePressFeedback({
    androidRipple: { color: rippleColor, foreground: true },
    hitSlop: 8,
  });
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      {...pressableProps}
      style={[styles.secondaryBtn, disabled && { opacity: 0.6 }, style as any]}
    >
      {/* Animated wrapper provides subtle scale and opacity on press */}
      <Animated.View style={animatedStyle}>
        {children ?? <Text style={[styles.secondaryLabel, textStyle as any]}>{title}</Text>}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ctaContainer: {
    alignSelf: 'stretch',
    width: '100%',
    borderRadius: radius.lg,
    shadowColor: colors.shadow.primaryBtn.color,
    shadowOpacity: colors.shadow.primaryBtn.opacity,
    shadowRadius: colors.shadow.primaryBtn.radius,
    shadowOffset: { width: 0, height: colors.shadow.primaryBtn.offsetY },
    elevation: colors.shadow.primaryBtn.elevation,
  },
  primaryBtn: {
    alignItems: 'center',
    height: 68,
    width: '100%',
    borderRadius: radius.md,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primaryLabel: {
    // Use a mid-contrast label so text doesn't overpower the light gradient
    color: addAlphaToHex(colors.brand.text, 0.85),
    fontSize: 20,
    fontWeight: '700',
  },
  secondaryBtn: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 68,
  },
  secondaryLabel: {
    textAlign: 'center',
    color: colors.brand.text,
    fontSize: 20,
    fontWeight: '600',
  },
});

export default PrimaryButton;
