import { InteractiveMap } from '@/components/interactive-map';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand, Radius, Shadow, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatCurrency } from '@/lib/format';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { services, currentUser, createRequest } = useApp();

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = Brand.primary;

  const [notes, setNotes] = useState('');
  const service = services.find((s) => s.id === id) || services[0];

  const handleRequestService = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    const newReq = createRequest(service.id, notes);
    if (newReq) {
      Alert.alert(
        '¡Solicitud Creada!',
        `Tu solicitud para "${service.title}" ha sido enviada al prestador en estado PENDING.`,
        [
          {
            text: 'Ver Seguimiento',
            onPress: () => router.push('/(tabs)/track'),
          },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: card }]}>
      {/* Header Bar */}
      <View style={[styles.header, { borderBottomColor: border }]}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <IconSymbol name="arrow.left" size={20} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]} numberOfLines={1}>
          Detalle del Servicio
        </Text>
        <Pressable style={styles.iconBtn}>
          <IconSymbol name="square.and.arrow.up" size={20} color={text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Pill */}
        <View style={[styles.categoryBadge, { backgroundColor: '#FFF7ED' }]}>
          <Text style={[styles.categoryText, { color: primary }]}>
            {service.categoryName}
          </Text>
        </View>

        {/* Title & Price */}
        <Text style={[styles.title, { color: text }]}>{service.title}</Text>
        <Text style={[styles.price, { color: primary }]}>
          {formatCurrency(service.price)}
          <Text style={[styles.priceUnit, { color: muted }]}> / servicio</Text>
        </Text>

        {/* Provider Profile Card */}
        <View style={[styles.providerCard, { backgroundColor: '#F8FAFC', borderColor: border }]}>
          <Image source={{ uri: service.providerAvatar }} style={styles.providerAvatar} />
          <View style={styles.providerInfo}>
            <Text style={[styles.providerName, { color: text }]}>{service.providerName}</Text>
            <View style={styles.ratingRow}>
              <IconSymbol name="star.fill" size={14} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: text }]}>{service.providerRating}</Text>
              <Text style={[styles.distText, { color: muted }]}>
                • A ~{service.distanceKm} km (Riohacha)
              </Text>
            </View>
            <Text style={[styles.phoneText, { color: muted }]}>{service.providerPhone}</Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Descripción del Servicio</Text>
          <Text style={[styles.descriptionText, { color: muted }]}>{service.description}</Text>
        </View>

        {/* Details Grid */}
        <View style={styles.gridRow}>
          <View style={[styles.gridCard, { borderColor: border }]}>
            <IconSymbol name="clock.fill" size={20} color={primary} />
            <Text style={[styles.gridLabel, { color: muted }]}>Tiempo Estimado</Text>
            <Text style={[styles.gridValue, { color: text }]}>{service.estimatedTime}</Text>
          </View>

          <View style={[styles.gridCard, { borderColor: border }]}>
            <IconSymbol name="location.fill" size={20} color={primary} />
            <Text style={[styles.gridLabel, { color: muted }]}>Ubicación Base</Text>
            <Text style={[styles.gridValue, { color: text }]}>Riohacha, Centro</Text>
          </View>
        </View>

        {/* Location & Interactive Map Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Ubicación en Riohacha</Text>
          <Text style={[styles.addressText, { color: muted }]}>
            {service.location.address}
          </Text>
          <View style={{ marginTop: Spacing.sm }}>
            <InteractiveMap
              clientLocation={currentUser?.location || { latitude: 11.5435, longitude: -72.9065, address: 'Cliente Centro', city: 'Riohacha' }}
              providerLocation={service.location}
              distanceKm={service.distanceKm}
              status="PENDING"
              height={180}
            />
          </View>
        </View>

        {/* Notes Input for Order */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: text }]}>Notas adicionales (Opcional)</Text>
          <TextInput
            style={[styles.notesInput, { borderColor: border, color: text }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Escribe instrucciones o detalles específicos para el prestador..."
            placeholderTextColor={muted}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* Bottom CTA Bar */}
      <View style={[styles.bottomBar, { borderTopColor: border }, Shadow.card]}>
        <View>
          <Text style={[styles.totalLabel, { color: muted }]}>Total a pagar</Text>
          <Text style={[styles.totalPrice, { color: primary }]}>
            {formatCurrency(service.price)}
          </Text>
        </View>

        <Pressable
          onPress={handleRequestService}
          style={({ pressed }) => [
            styles.ctaBtn,
            { backgroundColor: primary },
            pressed && styles.pressed,
          ]}>
          <Text style={styles.ctaText}>Solicitar Servicio</Text>
          <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: 100,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '500',
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: Radius.pill,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
  },
  distText: {
    fontSize: 12,
  },
  phoneText: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gridCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 4,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  addressText: {
    fontSize: 13,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
  },
  ctaBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
  },
});

