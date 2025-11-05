import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { NEIGHBORHOODS, type Neighborhood } from '../services/mockApi';

type ZoneSelectorProps = {
  neighborhoods?: Neighborhood[];
  selectedNeighborhoodId?: string;
  selectedRadius?: number;
  onChange: (payload: { neighborhoodId: string; radiusMeters: number }) => void;
};

export function ZoneSelector({
  neighborhoods = NEIGHBORHOODS,
  selectedNeighborhoodId,
  selectedRadius,
  onChange,
}: ZoneSelectorProps) {
  const currentNeighborhood =
    neighborhoods.find((item) => item.id === selectedNeighborhoodId) ?? neighborhoods[0];
  const currentRadius = selectedRadius ?? currentNeighborhood.options[0].radiusMeters;

  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {neighborhoods.map((hood) => {
          const selected = hood.id === currentNeighborhood.id;
          return (
            <Pressable
              key={hood.id}
              onPress={() =>
                onChange({ neighborhoodId: hood.id, radiusMeters: hood.options[0].radiusMeters })
              }
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: 16,
                backgroundColor: selected ? colors.brand.surfaceStrong : colors.brand.surfaceMuted,
                borderWidth: selected ? 1 : 0,
                borderColor: selected ? colors.brand.text : 'transparent',
              }}
            >
              <Text style={{ color: colors.brand.text }}>{hood.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ fontWeight: '600', color: colors.brand.text }}>Rayon approximatif</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {currentNeighborhood.options.map((option) => {
          const selected = option.radiusMeters === currentRadius;
          return (
            <Pressable
              key={option.id}
              onPress={() =>
                onChange({
                  neighborhoodId: currentNeighborhood.id,
                  radiusMeters: option.radiusMeters,
                })
              }
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: 16,
                backgroundColor: selected ? '#dcfce7' : colors.brand.surfaceStrong,
                borderWidth: selected ? 1 : 0,
                borderColor: selected ? colors.semantic.success : 'transparent',
              }}
            >
              <Text style={{ color: selected ? colors.semantic.success : colors.brand.muted }}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={{
          backgroundColor: colors.brand.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
          borderWidth: 1,
          borderColor: colors.brand.border,
          gap: spacing.sm,
        }}
      >
        <Text style={{ fontWeight: '600', color: colors.brand.text }}>
          {currentNeighborhood.name}
        </Text>
        <Text style={{ color: colors.brand.muted }}>{currentNeighborhood.description}</Text>
        <View
          style={{
            height: 160,
            borderRadius: radius.lg,
            backgroundColor: colors.brand.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#dbeafe',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: Math.max(32, Math.min(96, (currentRadius / 800) * 120)),
                height: Math.max(32, Math.min(96, (currentRadius / 800) * 120)),
                borderRadius: 999,
                backgroundColor: colors.semantic.success,
                opacity: 0.4,
              }}
            />
          </View>
          <Text style={{ marginTop: spacing.sm, color: colors.brand.muted, fontSize: 12 }}>
            Apercu statique - {Math.round(currentRadius / 100) / 10} km
          </Text>
        </View>
      </View>
    </View>
  );
}

export default ZoneSelector;
