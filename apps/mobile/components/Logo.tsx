import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, type Gradient } from '../theme';

type AppLogoProps = {
  size?: number;
  iconSize?: number;
  gradient?: Gradient;
  style?: ViewStyle | ViewStyle[];
  iconColor?: string;
};

export function AppLogo({
  size = 160,
  iconSize = 72,
  gradient = colors.brand.iconGradient,
  iconColor = '#fff',
  style,
}: AppLogoProps) {
  return (
    <LinearGradient
      colors={[gradient[0], gradient[1]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: radius.xl,
          shadowColor: colors.shadow.brand.color,
          shadowOpacity: colors.shadow.brand.opacity,
          shadowRadius: colors.shadow.brand.radius,
          shadowOffset: { width: 0, height: colors.shadow.brand.offsetY },
          elevation: colors.shadow.brand.elevation,
        },
        style as any,
      ]}
    >
      <MaterialCommunityIcons name="hand-heart-outline" size={iconSize} color={iconColor} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
});

export default AppLogo;
