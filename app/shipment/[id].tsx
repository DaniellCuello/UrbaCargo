import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { MapPreview } from '@/components/map-preview';
import { Screen, ScreenHeader } from '@/components/screen';
import { Timeline } from '@/components/timeline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Radius, Spacing } from '@/constants/theme';
import { SERVICE_META } from '@/constants/shipments';
import { getShipmentById } from '@/data/shipments';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ShipmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const shipment = getShipmentById(id ?? '');

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const primarySoft = useThemeColor({}, 'primarySoft');
  const success = useThemeColor({}, 'success');

  if (!shipment) {
    return (
      <Screen header={<ScreenHeader title="Envío" showBack />}>
        <Card style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: text }]}>Envío no encontrado</Text>
          <Text style={[styles.emptyText, { color: muted }]}>
            El código {id ?? ''} no existe o fue eliminado.
          </Text>
          <Button label="Volver" variant="outline" onPress={() => router.back()} />
        </Card>
      </Screen>
    );
  }

  const details = [
    { label: 'Servicio', value: SERVICE_META[shipment.service].label },
    { label: 'Paquetes', value: `${shipment.packages}` },
    { label: 'Peso', value: `${shipment.weightKg} kg` },
    { label: 'Distancia', value: `${shipment.distanceKm} km` },
  ];

  return (
    <Screen
      header={<ScreenHeader title={shipment.id} subtitle={SERVICE_META[shipment.service].label} showBack />}>
      <View style={styles.statusRow}>
        <StatusBadge status={shipment.status} />
        <Text style={[styles.price, { color: text }]}>{formatCurrency(shipment.price)}</Text>
      </View>

      <Card style={styles.section}>
        <MapPreview
          progress={shipment.progress}
          origin={shipment.origin.city}
          destination={shipment.destination.city}
          active={shipment.progress > 0 && shipment.progress < 1}
        />
        <ProgressBar progress={shipment.progress} />
        <View style={styles.etaRow}>
          <Text style={[styles.metaLabel, { color: muted }]}>Llegada estimada</Text>
          <Text style={[styles.metaValue, { color: text }]}>{formatDateTime(shipment.eta)}</Text>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>Ruta</Text>
        <View style={styles.routeRow}>
          <View style={[styles.routeIcon, { backgroundColor: primarySoft }]}>
            <IconSymbol name="building.2.fill" size={16} color={primary} />
          </View>
          <View style={styles.routeInfo}>
            <Text style={[styles.routeName, { color: text }]}>{shipment.origin.name}</Text>
            <Text style={[styles.routeAddress, { color: muted }]}>
              {shipment.origin.address} · {shipment.origin.city}
            </Text>
          </View>
        </View>
        <View style={[styles.connector, { borderColor: border }]} />
        <View style={styles.routeRow}>
          <View style={[styles.routeIcon, { backgroundColor: primarySoft }]}>
            <IconSymbol name="mappin.and.ellipse" size={16} color={primary} />
          </View>
          <View style={styles.routeInfo}>
            <Text style={[styles.routeName, { color: text }]}>{shipment.destination.name}</Text>
            <Text style={[styles.routeAddress, { color: muted }]}>
              {shipment.destination.address} · {shipment.destination.city}
            </Text>
          </View>
        </View>
      </Card>

      {shipment.courier ? (
        <Card style={styles.courierCard}>
          <View style={[styles.avatar, { backgroundColor: primarySoft }]}>
            <IconSymbol name="person.fill" size={22} color={primary} />
          </View>
          <View style={styles.courierInfo}>
            <Text style={[styles.courierName, { color: text }]}>{shipment.courier.name}</Text>
            <Text style={[styles.courierMeta, { color: muted }]}>
              {shipment.courier.vehicle} · {shipment.courier.plate}
            </Text>
          </View>
          <View style={styles.rating}>
            <IconSymbol name="star.fill" size={14} color={success} />
            <Text style={[styles.ratingValue, { color: text }]}>{shipment.courier.rating}</Text>
          </View>
        </Card>
      ) : null}

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>Detalles del paquete</Text>
        <View style={styles.detailGrid}>
          {details.map((detail) => (
            <View key={detail.label} style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: muted }]}>{detail.label}</Text>
              <Text style={[styles.detailValue, { color: text }]}>{detail.value}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>Seguimiento</Text>
        <Card>
          <Timeline events={shipment.timeline} />
        </Card>
      </View>

      <Button label="Contactar soporte" icon="questionmark.circle.fill" variant="outline" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  routeIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeInfo: {
    flex: 1,
    gap: 2,
  },
  routeName: {
    fontSize: 15,
    fontWeight: '700',
  },
  routeAddress: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  connector: {
    height: 22,
    marginLeft: 17,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
  },
  courierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courierInfo: {
    flex: 1,
    gap: 2,
  },
  courierName: {
    fontSize: 15,
    fontWeight: '700',
  },
  courierMeta: {
    fontSize: 12,
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.lg,
  },
  detailItem: {
    width: '50%',
    gap: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
