import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card } from '@/components/ui/card';
import { Radius, Spacing } from '@/constants/theme';
import { SERVICE_META, ACTIVE_STATUSES } from '@/constants/shipments';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Shipment } from '@/types/shipment';

export function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const router = useRouter();
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const isActive = ACTIVE_STATUSES.includes(shipment.status);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/shipment/[id]', params: { id: shipment.id } })}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.idRow}>
            <IconSymbol name="shippingbox.fill" size={18} color={text} />
            <Text style={[styles.id, { color: text }]}>{shipment.id}</Text>
          </View>
          <StatusBadge status={shipment.status} size="sm" />
        </View>

        <View style={styles.route}>
          <View style={styles.routePoint}>
            <View style={[styles.dot, { backgroundColor: muted }]} />
            <Text style={[styles.city, { color: text }]} numberOfLines={1}>
              {shipment.origin.city}
            </Text>
          </View>
          <IconSymbol name="arrow.right" size={16} color={muted} />
          <View style={styles.routePoint}>
            <View style={[styles.dot, { backgroundColor: muted }]} />
            <Text style={[styles.city, { color: text }]} numberOfLines={1}>
              {shipment.destination.city}
            </Text>
          </View>
        </View>

        <View style={[styles.metaRow, { borderTopColor: border }]}>
          <Text style={[styles.meta, { color: muted }]}>
            {SERVICE_META[shipment.service].label} · {shipment.packages}{' '}
            {shipment.packages === 1 ? 'paquete' : 'paquetes'} · {shipment.weightKg} kg
          </Text>
          <Text style={[styles.price, { color: text }]}>{formatCurrency(shipment.price)}</Text>
        </View>

        {isActive ? (
          <View style={styles.progress}>
            <ProgressBar progress={shipment.progress} />
            <View style={styles.etaRow}>
              <Text style={[styles.eta, { color: muted }]}>Llegada estimada</Text>
              <Text style={[styles.eta, { color: text }]}>{formatDateTime(shipment.eta)}</Text>
            </View>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  id: {
    fontSize: 15,
    fontWeight: '700',
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    flexShrink: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
  },
  city: {
    fontSize: 15,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  meta: {
    fontSize: 13,
    flexShrink: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
  },
  progress: {
    gap: Spacing.sm,
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eta: {
    fontSize: 12,
    fontWeight: '600',
  },
});
