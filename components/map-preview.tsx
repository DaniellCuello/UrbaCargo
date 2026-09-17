import { StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

const GRID_ROWS = ['30%', '55%', '80%'] as const;
const GRID_COLS = ['22%', '44%', '66%', '88%'] as const;

export function MapPreview({
  progress,
  origin,
  destination,
  active = true,
}: {
  progress: number;
  origin: string;
  destination: string;
  active?: boolean;
}) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const success = useThemeColor({}, 'success');
  const muted = useThemeColor({}, 'textMuted');
  const text = useThemeColor({}, 'text');

  const clamped = active ? Math.min(1, Math.max(0.05, progress)) : 1;
  const courierLeft = `${10 + clamped * 66}%` as const;
  const courierBottom = `${12 + clamped * 58}%` as const;

  return (
    <View style={[styles.map, { backgroundColor: card, borderColor: border }]}>
      {GRID_COLS.map((left) => (
        <View key={`col-${left}`} style={[styles.gridCol, { left, backgroundColor: border }]} />
      ))}
      {GRID_ROWS.map((top) => (
        <View key={`row-${top}`} style={[styles.gridRow, { top, backgroundColor: border }]} />
      ))}

      <View style={[styles.route, { backgroundColor: primary, bottom: '36%' }]} />

      <View style={[styles.marker, styles.origin, { backgroundColor: success }]}>
        <IconSymbol name="building.2.fill" size={14} color="#FFFFFF" />
      </View>
      <View style={[styles.marker, styles.destination, { backgroundColor: primary }]}>
        <IconSymbol name="mappin.and.ellipse" size={14} color="#FFFFFF" />
      </View>

      {active ? (
        <View style={[styles.courier, { backgroundColor: text, left: courierLeft, bottom: courierBottom }]}>
          <IconSymbol name="truck.box.fill" size={16} color={card} />
        </View>
      ) : null}

      <View style={[styles.labels, { backgroundColor: card, borderColor: border }]}>
        <Text style={[styles.label, { color: muted }]} numberOfLines={1}>
          {origin}
        </Text>
        <IconSymbol name="arrow.right" size={14} color={muted} />
        <Text style={[styles.label, styles.labelRight, { color: muted }]} numberOfLines={1}>
          {destination}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  gridCol: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
  },
  gridRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  route: {
    position: 'absolute',
    left: '10%',
    width: '70%',
    height: 3,
    borderRadius: Radius.pill,
    transform: [{ rotate: '-28deg' }],
    opacity: 0.9,
  },
  marker: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  origin: {
    left: Spacing.sm,
    bottom: Spacing.sm,
  },
  destination: {
    right: Spacing.sm,
    top: Spacing.sm,
  },
  courier: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  labels: {
    position: 'absolute',
    left: Spacing.sm,
    right: Spacing.sm,
    bottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  labelRight: {
    textAlign: 'right',
  },
});
