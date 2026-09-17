import { NotificationsButton } from '@/components/notifications-modal';
import { Screen } from '@/components/screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand, Radius, Shadow, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/mock-data';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatCurrency } from '@/lib/format';
import { Service } from '@/types/services';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type PriceFilterType = 'ALL' | 'BUDGET' | 'STANDARD' | 'PREMIUM';
type SortOrderType = 'NONE' | 'LOW_TO_HIGH' | 'HIGH_TO_LOW';

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser, services, requests, updateRequestStatus, switchRole } = useApp();

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = Brand.primary;
  const primarySoft = '#FFF7ED';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceFilterType>('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('NONE');

  // Filter services dynamically
  let filteredServices = services.filter((srv) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      srv.title.toLowerCase().includes(query) ||
      srv.providerName.toLowerCase().includes(query) ||
      srv.categoryName.toLowerCase().includes(query) ||
      srv.description.toLowerCase().includes(query) ||
      srv.price.toString().includes(query);

    const matchesCat = selectedCategory ? srv.categoryId === selectedCategory : true;

    let matchesPrice = true;
    if (priceFilter === 'BUDGET') {
      matchesPrice = srv.price <= 60000;
    } else if (priceFilter === 'STANDARD') {
      matchesPrice = srv.price > 60000 && srv.price <= 120000;
    } else if (priceFilter === 'PREMIUM') {
      matchesPrice = srv.price > 120000;
    }

    return matchesSearch && matchesCat && matchesPrice;
  });

  // Apply sorting by price if selected
  if (sortOrder === 'LOW_TO_HIGH') {
    filteredServices = [...filteredServices].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'HIGH_TO_LOW') {
    filteredServices = [...filteredServices].sort((a, b) => b.price - a.price);
  }

  // Provider metrics
  const providerRequests = requests.filter(
    (r) => r.providerId === currentUser?.id || currentUser?.role === 'PROVIDER'
  );
  const pendingRequests = providerRequests.filter((r) => r.status === 'PENDING');
  const activeRequests = providerRequests.filter(
    (r) => r.status === 'ACCEPTED' || r.status === 'ON_THE_WAY' || r.status === 'IN_PROGRESS'
  );

  const isClient = currentUser?.role === 'CLIENT' || !currentUser;

  return (
    <Screen
      header={
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.roleBadgeRow}>
              <View style={[styles.roleChip, { backgroundColor: primarySoft }]}>
                <Text style={[styles.roleChipText, { color: primary }]}>
                  {isClient ? '👤 ROL: CLIENTE' : '👷 ROL: PRESTADOR'}
                </Text>
              </View>
              {/* Only show role switch chip if provider */}
              {!isClient && (
                <Pressable onPress={switchRole} style={styles.switchChip}>
                  <Text style={styles.switchChipText}>Alternar Rol ⇄</Text>
                </Pressable>
              )}
            </View>
            <Text style={[styles.greeting, { color: muted }]}>Bienvenido de vuelta</Text>
            <Text style={[styles.name, { color: text }]}>
              {currentUser ? currentUser.name : 'Daniel Cuello'}
            </Text>
          </View>

          <View style={styles.headerRightGroup}>
            <NotificationsButton />
            <Pressable
              onPress={() => (currentUser ? router.push('/(tabs)/profile') : router.push('/login'))}
              style={[styles.avatarBtn, Shadow.card]}>
              {currentUser?.avatar ? (
                <Image source={{ uri: currentUser.avatar }} style={styles.avatarImg} />
              ) : (
                <IconSymbol name="person.circle.fill" size={36} color={primary} />
              )}
            </Pressable>
          </View>
        </View>
      }>
      {isClient ? (
        /* ================= CLIENT HOME VISTA ================= */
        <View style={styles.contentSection}>
          {/* Instant Search Bar */}
          <View style={[styles.searchBox, { borderColor: border, backgroundColor: card }]}>
            <IconSymbol name="magnifyingglass" size={18} color={primary} />
            <TextInput
              style={[styles.searchInput, { color: text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar servicio (ej. Cerrajería, Lavado, PC)..."
              placeholderTextColor={muted}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <IconSymbol name="xmark.circle.fill" size={16} color={muted} />
              </Pressable>
            ) : null}
          </View>

          {/* Categories Selector */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: text }]}>Categorías de Servicios</Text>
            {selectedCategory ? (
              <Pressable onPress={() => setSelectedCategory(null)}>
                <Text style={[styles.clearFilter, { color: primary }]}>Ver todas</Text>
              </Pressable>
            ) : null}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            <Pressable
              onPress={() => setSelectedCategory(null)}
              style={[
                styles.categoryCardPill,
                selectedCategory === null
                  ? { backgroundColor: primary, borderColor: primary }
                  : { backgroundColor: card, borderColor: border },
              ]}>
              <Text style={[styles.categoryPillText, selectedCategory === null ? { color: '#FFFFFF' } : { color: text }]}>
                Todas
              </Text>
            </Pressable>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryCardPill,
                    isSelected
                      ? { backgroundColor: primary, borderColor: primary }
                      : { backgroundColor: card, borderColor: border },
                  ]}>
                  {cat.image ? (
                    <Image source={{ uri: cat.image }} style={styles.catImageThumb} />
                  ) : null}
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected ? { color: '#FFFFFF' } : { color: text },
                    ]}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Budget & Price Range Filter Chips */}
          <View style={styles.priceFilterSection}>
            <Text style={[styles.priceFilterLabel, { color: muted }]}>💰 Filtrar por presupuesto:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.priceChipsScroll}>
              <Pressable
                onPress={() => setPriceFilter('ALL')}
                style={[
                  styles.priceChip,
                  priceFilter === 'ALL'
                    ? { backgroundColor: primary, borderColor: primary }
                    : { backgroundColor: card, borderColor: border },
                ]}>
                <Text style={[styles.priceChipText, priceFilter === 'ALL' ? { color: '#FFF' } : { color: text }]}>
                  Todos
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setPriceFilter('BUDGET')}
                style={[
                  styles.priceChip,
                  priceFilter === 'BUDGET'
                    ? { backgroundColor: primary, borderColor: primary }
                    : { backgroundColor: card, borderColor: border },
                ]}>
                <Text style={[styles.priceChipText, priceFilter === 'BUDGET' ? { color: '#FFF' } : { color: text }]}>
                  Económicos (≤ $60k)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setPriceFilter('STANDARD')}
                style={[
                  styles.priceChip,
                  priceFilter === 'STANDARD'
                    ? { backgroundColor: primary, borderColor: primary }
                    : { backgroundColor: card, borderColor: border },
                ]}>
                <Text style={[styles.priceChipText, priceFilter === 'STANDARD' ? { color: '#FFF' } : { color: text }]}>
                  Estándar ($60k - $120k)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setPriceFilter('PREMIUM')}
                style={[
                  styles.priceChip,
                  priceFilter === 'PREMIUM'
                    ? { backgroundColor: primary, borderColor: primary }
                    : { backgroundColor: card, borderColor: border },
                ]}>
                <Text style={[styles.priceChipText, priceFilter === 'PREMIUM' ? { color: '#FFF' } : { color: text }]}>
                  Premium (&gt; $120k)
                </Text>
              </Pressable>
            </ScrollView>
          </View>

          {/* Sort Order Bar */}
          <View style={styles.sortBar}>
            <Text style={[styles.sortLabel, { color: muted }]}>Ordenar precios:</Text>
            <View style={styles.sortToggleGroup}>
              <Pressable
                onPress={() => setSortOrder(sortOrder === 'LOW_TO_HIGH' ? 'NONE' : 'LOW_TO_HIGH')}
                style={[
                  styles.sortBtn,
                  sortOrder === 'LOW_TO_HIGH' ? { backgroundColor: primarySoft, borderColor: primary } : { borderColor: border },
                ]}>
                <Text style={[styles.sortBtnText, sortOrder === 'LOW_TO_HIGH' ? { color: primary, fontWeight: '800' } : { color: text }]}>
                  Menor a Mayor ⬆
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSortOrder(sortOrder === 'HIGH_TO_LOW' ? 'NONE' : 'HIGH_TO_LOW')}
                style={[
                  styles.sortBtn,
                  sortOrder === 'HIGH_TO_LOW' ? { backgroundColor: primarySoft, borderColor: primary } : { borderColor: border },
                ]}>
                <Text style={[styles.sortBtnText, sortOrder === 'HIGH_TO_LOW' ? { color: primary, fontWeight: '800' } : { color: text }]}>
                  Mayor a Menor ⬇
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Services Header */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Servicios Disponibles ({filteredServices.length})
            </Text>
          </View>

          {/* Services Grid */}
          <View style={styles.servicesGrid}>
            {filteredServices.length === 0 ? (
              <View style={[styles.emptyBox, { borderColor: border }]}>
                <IconSymbol name="magnifyingglass" size={32} color={muted} />
                <Text style={[styles.emptyTitle, { color: text }]}>No se encontraron servicios</Text>
                <Text style={[styles.emptySub, { color: muted }]}>
                  Intenta cambiar el término de búsqueda o ajusta el filtro de precios.
                </Text>
              </View>
            ) : (
              filteredServices.map((srv: Service) => (
                <Pressable
                  key={srv.id}
                  onPress={() =>
                    router.push({ pathname: '/service/[id]', params: { id: srv.id } })
                  }
                  style={({ pressed }) => [
                    styles.serviceCard,
                    { backgroundColor: card, borderColor: border },
                    Shadow.card,
                    pressed && styles.pressed,
                  ]}>
                  {srv.image ? (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: srv.image }} style={styles.serviceImage} />
                      <View style={styles.ratingOverlay}>
                        <IconSymbol name="star.fill" size={12} color="#F59E0B" />
                        <Text style={styles.ratingValue}>{srv.rating}</Text>
                      </View>
                    </View>
                  ) : null}

                  <View style={styles.serviceCardContent}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.cardCatBadge, { backgroundColor: primarySoft }]}>
                        <Text style={[styles.cardCatText, { color: primary }]}>
                          {srv.categoryName}
                        </Text>
                      </View>
                      <Text style={[styles.cardPrice, { color: primary }]}>
                        {formatCurrency(srv.price)}
                      </Text>
                    </View>

                    <Text style={[styles.serviceTitle, { color: text }]}>{srv.title}</Text>
                    <Text style={[styles.serviceDesc, { color: muted }]} numberOfLines={2}>
                      {srv.description}
                    </Text>

                    <View style={styles.providerRow}>
                      <Image source={{ uri: srv.providerAvatar }} style={styles.miniAvatar} />
                      <View style={styles.providerTextCol}>
                        <Text style={[styles.providerName, { color: text }]}>{srv.providerName}</Text>
                        <Text style={[styles.distanceText, { color: muted }]}>
                          📍 A ~{srv.distanceKm} km (Riohacha)
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.cardFooter, { borderTopColor: border }]}>
                      <Text style={[styles.timeText, { color: muted }]}>⏱️ {srv.estimatedTime}</Text>
                      <View style={[styles.solicitarBtn, { backgroundColor: primary }]}>
                        <Text style={styles.solicitarBtnText}>Solicitar ➔</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      ) : (
        /* ================= PROVIDER HOME DASHBOARD ================= */
        <View style={styles.contentSection}>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
              <IconSymbol name="briefcase.fill" size={24} color={primary} />
              <Text style={[styles.statNum, { color: text }]}>15</Text>
              <Text style={[styles.statLabel, { color: muted }]}>Publicados</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
              <IconSymbol name="clock.fill" size={24} color="#D97706" />
              <Text style={[styles.statNum, { color: '#D97706' }]}>{pendingRequests.length}</Text>
              <Text style={[styles.statLabel, { color: muted }]}>Pendientes</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
              <IconSymbol name="bolt.fill" size={24} color="#16A34A" />
              <Text style={[styles.statNum, { color: '#16A34A' }]}>{activeRequests.length}</Text>
              <Text style={[styles.statLabel, { color: muted }]}>Activos</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Solicitudes Pendientes ({pendingRequests.length})
            </Text>
          </View>

          {pendingRequests.length === 0 ? (
            <View style={[styles.emptyBox, { borderColor: border }]}>
              <IconSymbol name="checkmark.circle.fill" size={32} color="#16A34A" />
              <Text style={[styles.emptyTitle, { color: text }]}>¡Todo al día!</Text>
              <Text style={[styles.emptySub, { color: muted }]}>
                No tienes solicitudes pendientes por responder en este momento.
              </Text>
            </View>
          ) : (
            pendingRequests.map((req) => (
              <View
                key={req.id}
                style={[styles.reqCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
                <View style={styles.reqHeader}>
                  <Text style={[styles.reqTitle, { color: text }]}>{req.serviceTitle}</Text>
                  <Text style={[styles.reqPrice, { color: primary }]}>
                    {formatCurrency(req.price)}
                  </Text>
                </View>

                <Text style={[styles.reqClient, { color: muted }]}>
                  👤 Cliente: <Text style={{ color: text, fontWeight: '700' }}>{req.clientName}</Text>
                </Text>

                <Text style={[styles.reqAddress, { color: muted }]}>
                  📍 Dirección: {req.clientLocation.address} (Riohacha)
                </Text>

                {req.notes ? (
                  <Text style={[styles.reqNotes, { color: muted }]}>
                    📝 Nota: &quot;{req.notes}&quot;
                  </Text>
                ) : null}

                <View style={styles.reqActions}>
                  <Pressable
                    onPress={() => updateRequestStatus(req.id, 'ACCEPTED')}
                    style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}>
                    <IconSymbol name="checkmark" size={16} color="#FFF" />
                    <Text style={styles.actionBtnText}>Aceptar</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => updateRequestStatus(req.id, 'CANCELLED')}
                    style={[styles.actionBtn, { backgroundColor: '#DC2626' }]}>
                    <IconSymbol name="xmark" size={16} color="#FFF" />
                    <Text style={styles.actionBtnText}>Rechazar</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}

          <Pressable
            onPress={() => router.push('/(tabs)/shipments')}
            style={[styles.manageBanner, { backgroundColor: primary }]}>
            <View>
              <Text style={styles.manageTitle}>Gestionar Mis Solicitudes</Text>
              <Text style={styles.manageSub}>Cambiar estados y ver mapa de rutas</Text>
            </View>
            <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  roleChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  roleChipText: {
    fontSize: 10,
    fontWeight: '800',
  },
  switchChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  switchChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 44,
    height: 44,
  },
  contentSection: {
    gap: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  clearFilter: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScroll: {
    gap: Spacing.xs,
    paddingRight: Spacing.lg,
  },
  categoryCardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  catImageThumb: {
    width: 20,
    height: 20,
    borderRadius: Radius.pill,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceFilterSection: {
    gap: Spacing.xs,
  },
  priceFilterLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  priceChipsScroll: {
    gap: Spacing.xs,
    paddingRight: Spacing.lg,
  },
  priceChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  priceChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  sortToggleGroup: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  sortBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  sortBtnText: {
    fontSize: 11,
  },
  servicesGrid: {
    gap: Spacing.md,
  },
  serviceCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  ratingOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  serviceCardContent: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCatBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  cardCatText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  serviceDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
  },
  providerTextCol: {
    flex: 1,
  },
  providerName: {
    fontSize: 13,
    fontWeight: '700',
  },
  distanceText: {
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  solicitarBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  solicitarBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyBox: {
    padding: Spacing.xl,
    borderRadius: Radius.lg,
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
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  reqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  reqPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  reqClient: {
    fontSize: 13,
  },
  reqAddress: {
    fontSize: 12,
  },
  reqNotes: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  reqActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  manageBanner: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  manageTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  manageSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
  },
  pressed: {
    opacity: 0.9,
  },
});
