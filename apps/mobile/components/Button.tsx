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

type ShadowPreset = {
  color: string;
  opacity: number;
  radius: number;
  offsetY: number;
  elevation: number;
};

type ButtonToken = {
  fill: string[];
  gloss?: string[];
  borderColor: string;
  textColor: string;
  fontWeight?: TextStyle['fontWeight'];
  rippleBase: string;
  shadow: ShadowPreset;
};

const toneShadow = (color: string): ShadowPreset => ({
  color,
  opacity: 0.26,
  radius: 14,
  offsetY: 8,
  elevation: 7,
});

const BUTTON_VARIANTS: Record<ButtonVariant, ButtonToken> = {
  primary: {
    fill: [colors.brand.primaryGradient[0], colors.brand.primary, colors.brand.primaryGradient[1]],
    gloss: [
      addAlphaToHex('#FFFFFF', 0.22),
      addAlphaToHex(colors.brand.accent, 0.08),
      'transparent',
    ],
    borderColor: addAlphaToHex(colors.brand.accent, 0.55),
    textColor: '#F8FAFC',
    fontWeight: '800',
    rippleBase: colors.brand.accent,
    shadow: colors.shadow.primaryBtn,
  },
  secondary: {
    fill: ['#E2E8F0', '#CBD5E1', '#CBD5E1'],
    borderColor: addAlphaToHex(colors.brand.text, 0.18),
    textColor: colors.brand.text,
    fontWeight: '700',
    rippleBase: colors.brand.text,
    shadow: colors.shadow.softButton,
  },
  success: {
    fill: [colors.semantic.success, '#15803D', '#22C55E'],
    gloss: [
      addAlphaToHex('#FFFFFF', 0.16),
      addAlphaToHex(colors.semantic.success, 0.08),
      'transparent',
    ],
    borderColor: addAlphaToHex(colors.semantic.success, 0.55),
    textColor: '#F0FDF4',
    fontWeight: '800',
    rippleBase: colors.semantic.success,
    shadow: toneShadow('#15803D'),
  },
  danger: {
    fill: [colors.semantic.danger, '#B91C1C', '#F87171'],
    gloss: [
      addAlphaToHex('#FFFFFF', 0.14),
      addAlphaToHex(colors.semantic.danger, 0.08),
      'transparent',
    ],
    borderColor: addAlphaToHex(colors.semantic.danger, 0.5),
    textColor: '#FEF2F2',
    fontWeight: '800',
    rippleBase: colors.semantic.danger,
    shadow: toneShadow('#B91C1C'),
  },
  ghost: {
    fill: [
      colors.brand.surface,
      colors.brand.surfaceStrong,
      addAlphaToHex(colors.brand.border, 0.12),
    ],
    gloss: [addAlphaToHex(colors.brand.surfaceMuted, 0.6), 'transparent'],
    borderColor: colors.brand.border,
    textColor: colors.brand.text,
    fontWeight: '700',
    rippleBase: colors.brand.text,
    shadow: colors.shadow.softButton,
  },
};

function shadowStyle(preset: ShadowPreset) {
  return {
    shadowColor: preset.color,
    shadowOpacity: preset.opacity,
    shadowRadius: preset.radius,
    shadowOffset: { width: 0, height: preset.offsetY },
    elevation: preset.elevation,
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
  const rippleColor = addAlphaToHex(token.rippleBase, 0.18);
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
      style={[styles.ctaContainer, style as any]}
    >
      <Animated.View
        style={[
          styles.shadowWrap,
          shadowStyle(token.shadow),
          animatedStyle,
          disabled && styles.disabled,
        ]}
      >
        <LinearGradient
          colors={token.fill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, { borderColor: token.borderColor }]}
        >
          {token.gloss ? (
            <LinearGradient
              colors={token.gloss}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gloss}
              pointerEvents="none"
            />
          ) : null}
          {children ?? (
            <Text
              style={[
                styles.label,
                { color: token.textColor, fontWeight: token.fontWeight ?? '700' },
                textStyle as any,
              ]}
            >
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

export function SecondaryButton({
  title,
  children,
  onPress,
  style,
  textStyle,
  disabled,
}: CommonButtonProps) {
  return (
    <ButtonBase
      title={title}
      onPress={onPress}
      textStyle={textStyle}
      style={style}
      disabled={disabled}
      variant="secondary"
    >
      {children}
    </ButtonBase>
  );
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
    height: 60,
    width: '100%',
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
  },
  gloss: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  label: {
    fontSize: 18,
    letterSpacing: 0.1,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default PrimaryButton;
