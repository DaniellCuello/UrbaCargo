import { Screen } from '@/components/screen';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { Brand, Radius, Shadow, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { RequestStatus, ServiceRequest } from '@/types/services';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; bg: string; text: string; icon: IconSymbolName }
> = {
  PENDING: { label: 'PENDIENTE', bg: '#FEF3C7', text: '#92400E', icon: 'clock.fill' },
  ACCEPTED: { label: 'ACEPTADO', bg: '#DBEAFE', text: '#1E40AF', icon: 'checkmark.circle.fill' },
  ON_THE_WAY: { label: 'EN CAMINO', bg: '#FFF7ED', text: '#C2410C', icon: 'figure.walk' },
  IN_PROGRESS: { label: 'EN PROCESO', bg: '#F3E8FF', text: '#6B21A8', icon: 'gearshape.fill' },
  COMPLETED: { label: 'COMPLETADO', bg: '#DCFCE7', text: '#166534', icon: 'checkmark.seal.fill' },
  CANCELLED: { label: 'CANCELADO', bg: '#FEE2E2', text: '#991B1B', icon: 'xmark.circle.fill' },
};

export default function RequestsScreen() {
  const router = useRouter();
  const { currentUser, requests, updateRequestStatus, cancelRequest } = useApp();

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = Brand.primary;

  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const isProvider = currentUser?.role === 'PROVIDER';

  // Filter requests for current user
  const userRequests = requests.filter((r) => {
    if (isProvider) {
      return r.providerId === currentUser?.id || true;
    }
    return r.clientId === currentUser?.id || true;
  });

  const filteredRequests = userRequests.filter((r) =>
    filterStatus ? r.status === filterStatus : true
  );

  return (
    <Screen
      header={
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: text }]}>
              {isProvider ? 'Solicitudes de Clientes' : 'Mis Solicitudes'}
            </Text>
            <Text style={[styles.subtitle, { color: muted }]}>
              {isProvider
                ? 'Gestiona y actualiza los estados de tus servicios'
                : 'Historial y estado en tiempo real de tus servicios'}
            </Text>
          </View>
        </View>
      }>
      <View style={styles.container}>
        {/* Status Filter Scrollbar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <Pressable
            onPress={() => setFilterStatus(null)}
            style={[
              styles.filterChip,
              filterStatus === null
                ? { backgroundColor: primary, borderColor: primary }
                : { backgroundColor: card, borderColor: border },
            ]}>
            <Text
              style={[
                styles.filterChipText,
                filterStatus === null ? { color: '#FFF' } : { color: text },
              ]}>
              Todas ({userRequests.length})
            </Text>
          </Pressable>

          {(['PENDING', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as RequestStatus[]).map(
            (st) => {
              const cfg = STATUS_CONFIG[st];
              const isSelected = filterStatus === st;
              const count = userRequests.filter((r) => r.status === st).length;
              return (
                <Pressable
                  key={st}
                  onPress={() => setFilterStatus(st)}
                  style={[
                    styles.filterChip,
                    isSelected
                      ? { backgroundColor: primary, borderColor: primary }
                      : { backgroundColor: card, borderColor: border },
                  ]}>
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected ? { color: '#FFF' } : { color: text },
                    ]}>
                    {cfg.label} ({count})
                  </Text>
                </Pressable>
              );
            }
          )}
        </ScrollView>

        {/* Requests List */}
        <View style={styles.list}>
          {filteredRequests.length === 0 ? (
            <View style={[styles.emptyBox, { borderColor: border }]}>
              <IconSymbol name="tray.fill" size={32} color={muted} />
              <Text style={[styles.emptyTitle, { color: text }]}>No hay solicitudes</Text>
              <Text style={[styles.emptySub, { color: muted }]}>
                No se encontraron solicitudes registradas con este filtro.
              </Text>
            </View>
          ) : (
            filteredRequests.map((req: ServiceRequest) => {
              const cfg = STATUS_CONFIG[req.status];
              return (
                <View
                  key={req.id}
                  style={[
                    styles.reqCard,
                    { backgroundColor: card, borderColor: border },
                    Shadow.card,
                  ]}>
                  {/* Card Header: Service Title & Status Badge */}
                  <View style={styles.cardTop}>
                    <View style={styles.serviceTitleCol}>
                      <Text style={[styles.reqCategory, { color: primary }]}>
                        {req.categoryName}
                      </Text>
                      <Text style={[styles.reqTitle, { color: text }]}>{req.serviceTitle}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                      <IconSymbol name={cfg.icon} size={12} color={cfg.text} />
                      <Text style={[styles.statusText, { color: cfg.text }]}>{cfg.label}</Text>
                    </View>
                  </View>

                  {/* Details Grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.personRow}>
                      <Image source={{ uri: req.providerAvatar }} style={styles.avatarMini} />
                      <View>
                        <Text style={[styles.personLabel, { color: muted }]}>
                          {isProvider ? 'Cliente' : 'Prestador'}
                        </Text>
                        <Text style={[styles.personName, { color: text }]}>
                          {isProvider ? req.clientName : req.providerName}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.priceCol}>
                      <Text style={[styles.personLabel, { color: muted }]}>Precio</Text>
                      <Text style={[styles.priceVal, { color: primary }]}>
                        {formatCurrency(req.price)}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.addressLine, { color: muted }]}>
                    📍 Riohacha: {req.clientLocation.address}
                  </Text>
                  <Text style={[styles.dateLine, { color: muted }]}>
                    🕒 Solicitado: {formatDateTime(req.createdAt)}
                  </Text>

                  {/* Action Buttons depending on Role and Current Status */}
                  <View style={[styles.actionsContainer, { borderTopColor: border }]}>
                    {isProvider ? (
                      /* PROVIDER ACTIONS */
                      <>
                        {req.status === 'PENDING' && (
                          <View style={styles.btnRow}>
                            <Pressable
                              onPress={() => updateRequestStatus(req.id, 'ACCEPTED')}
                              style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}>
                              <IconSymbol name="checkmark" size={16} color="#FFF" />
                              <Text style={styles.btnText}>Aceptar Solicitud</Text>
                            </Pressable>
                            <Pressable
                              onPress={() => updateRequestStatus(req.id, 'CANCELLED')}
                              style={[styles.actionBtn, { backgroundColor: '#DC2626' }]}>
                              <IconSymbol name="xmark" size={16} color="#FFF" />
                              <Text style={styles.btnText}>Rechazar</Text>
                            </Pressable>
                          </View>
                        )}

                        {req.status === 'ACCEPTED' && (
                          <Pressable
                            onPress={() => updateRequestStatus(req.id, 'ON_THE_WAY')}
                            style={[styles.actionBtn, { backgroundColor: primary }]}>
                            <IconSymbol name="figure.walk" size={16} color="#FFF" />
                            <Text style={styles.btnText}>Iniciar Desplazamiento (En camino)</Text>
                          </Pressable>
                        )}

                        {req.status === 'ON_THE_WAY' && (
                          <Pressable
                            onPress={() => updateRequestStatus(req.id, 'IN_PROGRESS')}
                            style={[styles.actionBtn, { backgroundColor: '#8B5CF6' }]}>
                            <IconSymbol name="gearshape.fill" size={16} color="#FFF" />
                            <Text style={styles.btnText}>Iniciar Servicio en Sitio</Text>
                          </Pressable>
                        )}

                        {req.status === 'IN_PROGRESS' && (
                          <Pressable
                            onPress={() => updateRequestStatus(req.id, 'COMPLETED')}
                            style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}>
                            <IconSymbol name="checkmark.seal.fill" size={16} color="#FFF" />
                            <Text style={styles.btnText}>Finalizar Servicio</Text>
                          </Pressable>
                        )}
                      </>
                    ) : (
                      /* CLIENT ACTIONS */
                      <>
                        {req.status === 'PENDING' && (
                          <Pressable
                            onPress={() => cancelRequest(req.id)}
                            style={[styles.actionBtn, { backgroundColor: '#DC2626' }]}>
                            <IconSymbol name="xmark" size={16} color="#FFF" />
                            <Text style={styles.btnText}>Cancelar Solicitud</Text>
                          </Pressable>
                        )}

                        {req.status === 'ON_THE_WAY' && (
                          <Pressable
                            onPress={() => router.push('/(tabs)/track')}
                            style={[styles.actionBtn, { backgroundColor: primary }]}>
                            <IconSymbol name="map.fill" size={16} color="#FFF" />
                            <Text style={styles.btnText}>Rastrear Prestador en Vivo ➔</Text>
                          </Pressable>
                        )}
                      </>
                    )}

                    {/* Common detail view button */}
                    <Pressable
                      onPress={() => router.push('/(tabs)/track')}
                      style={[styles.secondaryBtn, { borderColor: border }]}>
                      <Text style={[styles.secondaryText, { color: text }]}>
                        Ver Mapa & Seguimiento
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  container: {
    gap: Spacing.md,
  },
  filterScroll: {
    gap: Spacing.xs,
    paddingRight: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    gap: Spacing.md,
  },
  emptyBox: {
    padding: Spacing.xxl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
  reqCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  serviceTitleCol: {
    flex: 1,
  },
  reqCategory: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  reqTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  detailsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    padding: Spacing.sm,
    borderRadius: Radius.lg,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
  },
  personLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  personName: {
    fontSize: 13,
    fontWeight: '700',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceVal: {
    fontSize: 16,
    fontWeight: '800',
  },
  addressLine: {
    fontSize: 12,
  },
  dateLine: {
    fontSize: 11,
  },
  actionsContainer: {
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.xs,
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryBtn: {
    height: 36,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
