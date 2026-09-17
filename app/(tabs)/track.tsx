import { InteractiveMap } from '@/components/interactive-map';
import { Screen } from '@/components/screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand, Radius, Shadow, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatCurrency } from '@/lib/format';
import { RequestStatus } from '@/types/services';
import React, { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const STEPS: { status: RequestStatus; title: string }[] = [
  { status: 'PENDING', title: 'Solicitado' },
  { status: 'ACCEPTED', title: 'Aceptado' },
  { status: 'ON_THE_WAY', title: 'En Camino' },
  { status: 'IN_PROGRESS', title: 'En Proceso' },
  { status: 'COMPLETED', title: 'Completado' },
];

export default function TrackScreen() {
  const { requests, currentUser, updateRequestStatus } = useApp();

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = Brand.primary;

  const isProvider = currentUser?.role === 'PROVIDER';

  // Filter requests
  const activeRequests = requests.filter((r) => r.status !== 'CANCELLED');
  const [selectedReqId, setSelectedReqId] = useState<string>(
    activeRequests[0]?.id || ''
  );

  const activeReq =
    activeRequests.find((r) => r.id === selectedReqId) || activeRequests[0];

  const getStepIndex = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'ACCEPTED':
        return 1;
      case 'ON_THE_WAY':
        return 2;
      case 'IN_PROGRESS':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = activeReq ? getStepIndex(activeReq.status) : 0;

  return (
    <Screen
      header={
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>Mapa & Seguimiento</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            Ubicación en tiempo real en Riohacha, Colombia
          </Text>
        </View>
      }>
      <View style={styles.container}>
        {/* Active Request Switcher Chips */}
        {activeRequests.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reqChipsScroll}>
            {activeRequests.map((r) => {
              const isSelected = r.id === (activeReq?.id || '');
              return (
                <Pressable
                  key={r.id}
                  onPress={() => setSelectedReqId(r.id)}
                  style={[
                    styles.reqChip,
                    isSelected
                      ? { backgroundColor: primary, borderColor: primary }
                      : { backgroundColor: card, borderColor: border },
                  ]}>
                  <Text style={[styles.reqChipText, isSelected ? { color: '#FFF' } : { color: text }]}>
                    {r.serviceTitle.slice(0, 20)}...
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}

        {!activeReq ? (
          <View style={[styles.emptyCard, { borderColor: border }]}>
            <IconSymbol name="map.fill" size={36} color={muted} />
            <Text style={[styles.emptyText, { color: text }]}>
              No hay solicitudes activas para monitorear.
            </Text>
          </View>
        ) : (
          <View style={styles.trackingCardWrapper}>
            {/* Status Timeline Progress Bar */}
            <View style={[styles.timelineCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
              <View style={styles.statusHeader}>
                <View style={styles.statusLiveBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.statusLiveText}>ESTADO: {activeReq.status}</Text>
                </View>
                <Text style={[styles.reqPrice, { color: primary }]}>
                  {formatCurrency(activeReq.price)}
                </Text>
              </View>

              <Text style={[styles.serviceTitle, { color: text }]}>
                {activeReq.serviceTitle}
              </Text>

              {/* Steps Progress Row */}
              <View style={styles.stepsRow}>
                {STEPS.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  return (
                    <View key={step.status} style={styles.stepItem}>
                      <View
                        style={[
                          styles.stepDot,
                          isDone
                            ? { backgroundColor: primary, borderColor: primary }
                            : { backgroundColor: '#E2E8F0', borderColor: border },
                        ]}>
                        {isDone ? <IconSymbol name="checkmark" size={10} color="#FFF" /> : null}
                      </View>
                      <Text
                        style={[
                          styles.stepText,
                          isDone ? { color: primary, fontWeight: '700' } : { color: muted },
                        ]}
                        numberOfLines={1}>
                        {step.title}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Interactive Riohacha Map with Live Movement */}
            <View style={[styles.mapWrapper, Shadow.card]}>
              <InteractiveMap
                clientLocation={activeReq.clientLocation}
                providerLocation={activeReq.providerLocation}
                currentProviderLocation={activeReq.currentProviderLocation}
                distanceKm={activeReq.distanceKm}
                status={activeReq.status}
                height={260}
              />
            </View>

            {/* People & Info Card */}
            <View style={[styles.infoCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
              <View style={styles.peopleRow}>
                <View style={styles.personCol}>
                  <Text style={[styles.roleLabel, { color: muted }]}>CLIENTE</Text>
                  <Text style={[styles.personName, { color: text }]}>
                    {activeReq.clientName}
                  </Text>
                  <Text style={[styles.personPhone, { color: muted }]}>
                    📞 {activeReq.clientPhone}
                  </Text>
                  <Text style={[styles.addressText, { color: muted }]}>
                    📍 {activeReq.clientLocation.address}
                  </Text>
                </View>

                <View style={[styles.dividerVertical, { backgroundColor: border }]} />

                <View style={styles.personCol}>
                  <Text style={[styles.roleLabel, { color: primary }]}>PRESTADOR</Text>
                  <View style={styles.providerHeader}>
                    <Image source={{ uri: activeReq.providerAvatar }} style={styles.miniAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.personName, { color: text }]}>
                        {activeReq.providerName}
                      </Text>
                      <Text style={[styles.personPhone, { color: muted }]}>
                        📞 {activeReq.providerPhone}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.addressText, { color: muted }]}>
                    📍 {activeReq.providerLocation.address}
                  </Text>
                </View>
              </View>

              {/* Provider Quick Actions directly from Map screen */}
              {isProvider && (
                <View style={[styles.providerActions, { borderTopColor: border }]}>
                  {activeReq.status === 'ACCEPTED' && (
                    <Pressable
                      onPress={() => updateRequestStatus(activeReq.id, 'ON_THE_WAY')}
                      style={[styles.ctaBtn, { backgroundColor: primary }]}>
                      <IconSymbol name="figure.walk" size={16} color="#FFF" />
                      <Text style={styles.ctaBtnText}>Iniciar Desplazamiento (En Camino)</Text>
                    </Pressable>
                  )}

                  {activeReq.status === 'ON_THE_WAY' && (
                    <Pressable
                      onPress={() => updateRequestStatus(activeReq.id, 'IN_PROGRESS')}
                      style={[styles.ctaBtn, { backgroundColor: '#8B5CF6' }]}>
                      <IconSymbol name="gearshape.fill" size={16} color="#FFF" />
                      <Text style={styles.ctaBtnText}>Marcar Iniciar Servicio</Text>
                    </Pressable>
                  )}

                  {activeReq.status === 'IN_PROGRESS' && (
                    <Pressable
                      onPress={() => updateRequestStatus(activeReq.id, 'COMPLETED')}
                      style={[styles.ctaBtn, { backgroundColor: '#16A34A' }]}>
                      <IconSymbol name="checkmark.seal.fill" size={16} color="#FFF" />
                      <Text style={styles.ctaBtnText}>Marcar Finalizar Servicio</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          </View>
        )}
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
  reqChipsScroll: {
    gap: Spacing.xs,
    paddingRight: Spacing.lg,
  },
  reqChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  reqChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    padding: Spacing.xxl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trackingCardWrapper: {
    gap: Spacing.md,
  },
  timelineCard: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: Brand.primary,
  },
  statusLiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: Brand.primary,
  },
  reqPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  serviceTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stepText: {
    fontSize: 9,
    textAlign: 'center',
  },
  mapWrapper: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: Spacing.md,
  },
  peopleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  personCol: {
    flex: 1,
    gap: 2,
  },
  dividerVertical: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  personName: {
    fontSize: 14,
    fontWeight: '700',
  },
  personPhone: {
    fontSize: 11,
  },
  addressText: {
    fontSize: 11,
    marginTop: 2,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
  },
  providerActions: {
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ctaBtn: {
    height: 44,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
