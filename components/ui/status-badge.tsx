import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { STATUS_META } from '@/constants/shipments';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ShipmentStatus } from '@/types/shipment';

export function StatusBadge({ status, size = 'md' }: { status: ShipmentStatus; size?: 'sm' | 'md' }) {
  const meta = STATUS_META[status];
  const color = useThemeColor({}, meta.color);
  const backgroundColor = useThemeColor({}, meta.background);
  const compact = size === 'sm';

  return (
    <View style={[styles.badge, compact && styles.badgeCompact, { backgroundColor }]}>
      <IconSymbol name={meta.icon} size={compact ? 12 : 14} color={color} />
      <Text style={[styles.label, compact && styles.labelCompact, { color }]}>
        {compact ? meta.shortLabel : meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
  },
  badgeCompact: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  labelCompact: {
    fontSize: 11,
  },
});
