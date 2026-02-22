import React, { ReactNode } from 'react';
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../theme';
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
type ButtonVariant = PrimaryVariant | 'secondary';

type ButtonToken = {
  fill: string[];
  borderColor: string;
  textColor: string;
  rippleBase: string;
  shadow: {
    color: string;
    opacity: number;
    radius: number;
    offsetY: number;
    elevation: number;
  };
};

const BUTTON_VARIANTS: Record<ButtonVariant, ButtonToken> = {
  primary: {
    fill: [colors.brand.primaryGradient[0], colors.brand.primaryGradient[1]],
    borderColor: addAlphaToHex(colors.brand.primary, 0.72),
    textColor: '#F8FAFC',
    rippleBase: '#FFFFFF',
    shadow: colors.shadow.primaryBtn,
  },
  secondary: {
    fill: [colors.brand.surface, colors.brand.surface],
    borderColor: colors.brand.border,
    textColor: colors.brand.text,
    rippleBase: colors.brand.text,
    shadow: colors.shadow.softButton,
  },
  success: {
    fill: [colors.semantic.successGradient[0], colors.semantic.successGradient[1]],
    borderColor: addAlphaToHex(colors.semantic.success, 0.7),
    textColor: '#052E16',
    rippleBase: colors.semantic.success,
    shadow: colors.shadow.softButton,
  },
  danger: {
    fill: [colors.semantic.dangerGradient[0], colors.semantic.dangerGradient[1]],
    borderColor: addAlphaToHex(colors.semantic.danger, 0.7),
    textColor: '#450A0A',
    rippleBase: colors.semantic.danger,
    shadow: colors.shadow.softButton,
  },
  ghost: {
    fill: [colors.brand.surfaceMuted, colors.brand.surfaceMuted],
    borderColor: colors.brand.border,
    textColor: colors.brand.text,
    rippleBase: colors.brand.text,
    shadow: colors.shadow.softButton,
  },
};

function shadowStyle(shadow: ButtonToken['shadow']) {
  return {
    shadowColor: shadow.color,
    shadowOpacity: shadow.opacity,
    shadowRadius: shadow.radius,
    shadowOffset: { width: 0, height: shadow.offsetY },
    elevation: shadow.elevation,
  };
}

function ButtonBase({
  title,
  children,
  onPress,
  style,
  textStyle,
  disabled,
  variant,
}: CommonButtonProps & { variant: ButtonVariant }) {
  const token = BUTTON_VARIANTS[variant];
  const { animatedStyle, pressableProps } = usePressFeedback({
    androidRipple: { color: addAlphaToHex(token.rippleBase, 0.14), foreground: true },
    hitSlop: 8,
    scaleTo: 0.97,
    opacityTo: 0.9,
  });

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      {...pressableProps}
      style={[styles.ctaContainer, style as any]}
    >
      <Animated.View
        style={[
          shadowStyle(token.shadow),
          animatedStyle,
          disabled && styles.disabled,
          styles.shadowWrap,
        ]}
      >
        <LinearGradient
          colors={token.fill as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, { borderColor: token.borderColor }]}
        >
          {children ?? (
            <Text style={[styles.label, { color: token.textColor }, textStyle as any]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export function PrimaryButton({
  title,
  children,
  onPress,
  style,
  textStyle,
  disabled,
  variant = 'primary',
}: CommonButtonProps & { variant?: PrimaryVariant }) {
  return (
    <ButtonBase
      title={title}
      onPress={onPress}
      textStyle={textStyle}
      style={style}
      disabled={disabled}
      variant={variant}
    >
      {children}
    </ButtonBase>
  );
}

export function SecondaryButton(props: CommonButtonProps) {
  return <ButtonBase {...props} variant="secondary" />;
}

const styles = StyleSheet.create({
  ctaContainer: {
    alignSelf: 'stretch',
    width: '100%',
  },
  shadowWrap: {
    borderRadius: radius.lg,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    width: '100%',
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontSize: 16,
    letterSpacing: 0.15,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default PrimaryButton;
