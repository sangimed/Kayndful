import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme';
import type { Coordinates, Request } from '../services/mockApi';
import { NEIGHBORHOODS } from '../services/mockApi';

type MapPreviewProps = {
  requests: Request[];
  neighborhoodId?: string;
  radiusMeters?: number;
  onSelectRequest?: (requestId: string) => void;
};

const MAP_WIDTH = 320;
const MAP_HEIGHT = 240;

export function MapPreview({
  requests,
  neighborhoodId,
  radiusMeters,
  onSelectRequest,
}: MapPreviewProps) {
  if (!requests.length) {
    return (
      <View
        style={{
          height: MAP_HEIGHT,
          width: MAP_WIDTH,
          alignSelf: 'center',
          borderRadius: radius.lg,
          backgroundColor: colors.brand.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.brand.muted }}>Aucune demande dans cette zone.</Text>
      </View>
    );
  }

  const hood = neighborhoodId
    ? NEIGHBORHOODS.find((item) => item.id === neighborhoodId)
    : undefined;
  const center = hood?.center ?? averageCoordinates(requests.map((item) => item.coordinates));
  const radius = radiusMeters ?? hood?.options[hood.options.length - 1].radiusMeters ?? 800;

  const bounds = computeBounds(
    requests.map((item) => item.coordinates),
    hood?.center,
  );

  return (
    <View
      style={{
        height: MAP_HEIGHT,
        width: MAP_WIDTH,
        alignSelf: 'center',
        borderRadius: radius.lg,
        backgroundColor: colors.brand.surfaceStrong,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.brand.border,
      }}
    >
      <View style={{ flex: 1, padding: spacing.md }}>
        <View style={{ flex: 1 }}>
          {requests.map((request) => {
            const point = projectPoint(request.coordinates, bounds);
            return (
              <Pressable
                key={request.id}
                onPress={() => onSelectRequest?.(request.id)}
                style={{
                  position: 'absolute',
                  top: point.y - 12,
                  left: point.x - 12,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.semantic.success,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.brand.surface,
                  }}
                />
              </Pressable>
            );
          })}

          <View
            style={{
              position: 'absolute',
              top: MAP_HEIGHT / 2 - 40,
              left: MAP_WIDTH / 2 - 40,
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 1,
              borderColor: '#60a5fa',
              opacity: 0.6,
            }}
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: spacing.sm,
          left: spacing.sm,
          backgroundColor: colors.brand.surface,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: radius.md,
        }}
      >
        <Text style={{ color: colors.brand.muted, fontSize: 12 }}>
          Rayon ~ {Math.round(radius / 100) / 10} km
        </Text>
      </View>
    </View>
  );
}

const averageCoordinates = (points: Coordinates[]) => {
  const total = points.reduce(
    (acc, point) => ({ lat: acc.lat + point.lat, lng: acc.lng + point.lng }),
    { lat: 0, lng: 0 },
  );
  return { lat: total.lat / points.length, lng: total.lng / points.length };
};

const computeBounds = (points: Coordinates[], focus?: Coordinates) => {
  if (!points.length) {
    const base = focus ?? { lat: 48.872, lng: 2.37 };
    return {
      minLat: base.lat - 0.01,
      maxLat: base.lat + 0.01,
      minLng: base.lng - 0.01,
      maxLng: base.lng + 0.01,
    };
  }
  const basePoints = focus ? [...points, focus] : [...points];
  return {
    minLat: Math.min(...basePoints.map((p) => p.lat)) - 0.002,
    maxLat: Math.max(...basePoints.map((p) => p.lat)) + 0.002,
    minLng: Math.min(...basePoints.map((p) => p.lng)) - 0.002,
    maxLng: Math.max(...basePoints.map((p) => p.lng)) + 0.002,
  };
};

const projectPoint = (point: Coordinates, bounds: ReturnType<typeof computeBounds>) => {
  const { minLat, maxLat, minLng, maxLng } = bounds;
  const x =
    ((point.lng - minLng) / (maxLng - minLng || 0.0001)) * (MAP_WIDTH - spacing.md * 2) +
    spacing.md;
  const y =
    ((maxLat - point.lat) / (maxLat - minLat || 0.0001)) * (MAP_HEIGHT - spacing.md * 2) +
    spacing.md;
  return { x, y };
};

export default MapPreview;
