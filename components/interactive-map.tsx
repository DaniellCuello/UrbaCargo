import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { Location } from '@/types/services';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type InteractiveMapProps = {
  clientLocation: Location;
  providerLocation: Location;
  currentProviderLocation?: Location;
  providerAvatar?: string;
  providerName?: string;
  distanceKm?: number;
  status?: string;
  height?: number;
};

export function InteractiveMap({
  clientLocation,
  providerLocation,
  currentProviderLocation,
  providerAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  providerName = 'Prestador',
  distanceKm = 1.2,
  status = 'ON_THE_WAY',
  height = 260,
}: InteractiveMapProps) {
  // Map Riohacha coordinates to SVG percentage coordinates (0 - 100)
  const minLat = 11.536;
  const maxLat = 11.554;
  const minLng = -72.920;
  const maxLng = -72.900;

  const getPercentPos = (loc: Location) => {
    const x = Math.min(Math.max(((loc.longitude - minLng) / (maxLng - minLng)) * 100, 12), 88);
    const y = Math.min(Math.max((1 - (loc.latitude - minLat) / (maxLat - minLat)) * 100, 12), 88);
    return { x, y };
  };

  const clientPos = getPercentPos(clientLocation);
  const activeProviderLoc = currentProviderLocation || providerLocation;
  const providerPos = getPercentPos(activeProviderLoc);

  return (
    <View style={[styles.container, { height }]}>
      {/* Riohacha Visual Canvas */}
      <View style={styles.mapCanvas}>
        {/* Mar Caribe / Caribbean Sea Coast Line */}
        <View style={styles.seaBorder}>
          <Text style={styles.seaText}>🌊 MAR CARIBE (RIOHACHA)</Text>
        </View>

        {/* City Street Grid */}
        <View style={[styles.roadHorizontal, { top: '32%' }]} />
        <View style={[styles.roadHorizontal, { top: '60%' }]} />
        <View style={[styles.roadVertical, { left: '28%' }]} />
        <View style={[styles.roadVertical, { left: '68%' }]} />

        {/* Street & Landmark Labels */}
        <Text style={[styles.landmarkText, { top: '22%', left: '10%' }]}>Malecón de Riohacha</Text>
        <Text style={[styles.landmarkText, { top: '45%', left: '40%' }]}>Plaza de Padilla</Text>
        <Text style={[styles.landmarkText, { top: '70%', left: '55%' }]}>Calle 15</Text>
        <Text style={[styles.landmarkText, { top: '82%', left: '15%' }]}>Carrera 7</Text>

        {/* Connecting Polyline Route SVG */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <svg width="100%" height="100%" style={{ position: 'absolute' }}>
            <line
              x1={`${providerPos.x}%`}
              y1={`${providerPos.y}%`}
              x2={`${clientPos.x}%`}
              y2={`${clientPos.y}%`}
              stroke="#EA580C"
              strokeWidth="5"
              strokeDasharray="8 5"
            />
          </svg>
        </View>

        {/* Client Pin */}
        <View
          style={[
            styles.marker,
            styles.clientMarker,
            { left: `${clientPos.x}%`, top: `${clientPos.y}%` },
          ]}>
          <IconSymbol name="house.fill" size={14} color="#FFFFFF" />
          <View style={styles.pinCallout}>
            <Text style={styles.calloutText} numberOfLines={1}>
              Daniel Cuello (Cliente)
            </Text>
          </View>
        </View>

        {/* Provider Live Moving Pin with Avatar & Pulse */}
        <View
          style={[
            styles.marker,
            styles.providerMarkerContainer,
            { left: `${providerPos.x}%`, top: `${providerPos.y}%` },
          ]}>
          {status === 'ON_THE_WAY' && <View style={styles.pulseRing} />}
          <Image source={{ uri: providerAvatar }} style={styles.providerMarkerAvatar} />
          <View style={[styles.pinCallout, styles.providerCallout]}>
            <Text style={styles.calloutText} numberOfLines={1}>
              {providerName} {status === 'ON_THE_WAY' ? '🚗' : ''}
            </Text>
          </View>
        </View>

        {/* Live Distance & Movement Meter Overlay */}
        <View style={[styles.distanceBadge, Shadow.card]}>
          <View style={styles.liveIndicator}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveStatusText}>
              {status === 'ON_THE_WAY' ? 'EN MOVIMIENTO EN VIVO' : 'UBICACIÓN EN RIOHACHA'}
            </Text>
          </View>
          <Text style={styles.distanceText}>
            {status === 'ON_THE_WAY'
              ? `Distancia: ~${distanceKm} km • ETA: ~${Math.max(1, Math.round(distanceKm * 3))} min`
              : `Ubicación Base: ~${distanceKm} km`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
    overflow: 'hidden',
  },
  seaBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 38,
    backgroundColor: '#BAE6FD',
    justifyContent: 'center',
    paddingLeft: Spacing.md,
  },
  seaText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369A1',
    letterSpacing: 0.5,
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#E2E8F0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CBD5E1',
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: '#E2E8F0',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CBD5E1',
  },
  landmarkText: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    zIndex: 10,
  },
  clientMarker: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  providerMarkerContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: 3,
    borderColor: '#EA580C',
    backgroundColor: '#FFFFFF',
  },
  providerMarkerAvatar: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
  },
  pulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(234, 88, 12, 0.25)',
    borderWidth: 1,
    borderColor: '#EA580C',
  },
  pinCallout: {
    position: 'absolute',
    bottom: 38,
    backgroundColor: '#0F172A',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  providerCallout: {
    backgroundColor: '#EA580C',
  },
  calloutText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: '#EA580C',
  },
  liveStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.5,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
});
