import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen, ScreenHeader } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing } from '@/constants/theme';
import { SERVICE_META } from '@/constants/shipments';
import { formatCurrency, quotePrice } from '@/lib/format';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ServiceLevel } from '@/types/shipment';

const SERVICES: ServiceLevel[] = ['same_day', 'express', 'standard'];

function toNumber(value: string, fallback = 0) {
  const parsed = Number.parseFloat(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  multiline?: boolean;
};

function Field({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline }: FieldProps) {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={muted}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          { backgroundColor: card, borderColor: border, color: text },
        ]}
      />
    </View>
  );
}

export default function NewShipmentScreen() {
  const router = useRouter();
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const primarySoft = useThemeColor({}, 'primarySoft');

  const [origin, setOrigin] = useState('Av. Los Libertadores 1240, Lima');
  const [destination, setDestination] = useState('');
  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [packages, setPackages] = useState(1);
  const [weight, setWeight] = useState('3');
  const [distance, setDistance] = useState('8');
  const [notes, setNotes] = useState('');
  const [service, setService] = useState<ServiceLevel>('express');
  const [createdId, setCreatedId] = useState<string | null>(null);

  const estimate = useMemo(
    () => quotePrice(toNumber(weight, 1), toNumber(distance, 5), service),
    [weight, distance, service]
  );

  const canSubmit = destination.trim().length > 0 && recipient.trim().length > 0;

  const handleSubmit = () => {
    const suffix = Math.floor(100 + Math.random() * 899);
    setCreatedId(`UC-2026-0${suffix}`);
  };

  if (createdId) {
    return (
      <Screen header={<ScreenHeader title="Solicitud creada" showBack />}>
        <Card style={styles.successCard}>
          <View style={[styles.successIcon, { backgroundColor: primarySoft }]}>
            <IconSymbol name="checkmark.circle.fill" size={34} color={primary} />
          </View>
          <Text style={[styles.successTitle, { color: text }]}>¡Recojo programado!</Text>
          <Text style={[styles.successText, { color: muted }]}>
            Tu envío fue registrado con el código
          </Text>
          <Text style={[styles.successId, { color: text }]}>{createdId}</Text>
          <Text style={[styles.successText, { color: muted }]}>
            Un mensajero se asignará en los próximos minutos.
          </Text>
          <Button label="Ver envíos" onPress={() => router.replace('/shipments')} />
          <Button label="Cerrar" variant="ghost" onPress={() => router.back()} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen
      header={
        <ScreenHeader
          title="Nuevo envío"
          subtitle="Programa un recojo en minutos"
          showBack
        />
      }>
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>Ruta</Text>
        <Field label="ORIGEN" value={origin} onChangeText={setOrigin} placeholder="Dirección de recojo" />
        <Field
          label="DESTINO"
          value={destination}
          onChangeText={setDestination}
          placeholder="Dirección de entrega"
        />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>Destinatario</Text>
        <Field label="NOMBRE" value={recipient} onChangeText={setRecipient} placeholder="¿Quién recibe?" />
        <Field
          label="TELÉFONO"
          value={phone}
          onChangeText={setPhone}
          placeholder="+51 999 999 999"
          keyboardType="phone-pad"
        />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>Servicio</Text>
        <View style={styles.services}>
          {SERVICES.map((item) => {
            const selected = item === service;
            return (
              <Pressable
                key={item}
                onPress={() => setService(item)}
                style={[
                  styles.service,
                  {
                    backgroundColor: selected ? primarySoft : card,
                    borderColor: selected ? primary : border,
                  },
                ]}>
                <Text style={[styles.serviceLabel, { color: selected ? primary : text }]}>
                  {SERVICE_META[item].label}
                </Text>
                <Text style={[styles.serviceHint, { color: muted }]}>
                  {SERVICE_META[item].hint}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>Detalles</Text>
        <View style={styles.stepperRow}>
          <Text style={[styles.label, { color: muted }]}>PAQUETES</Text>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setPackages((value) => Math.max(1, value - 1))}
              style={[styles.stepButton, { borderColor: border, backgroundColor: card }]}>
              <Text style={[styles.stepSymbol, { color: text }]}>−</Text>
            </Pressable>
            <Text style={[styles.stepValue, { color: text }]}>{packages}</Text>
            <Pressable
              onPress={() => setPackages((value) => Math.min(20, value + 1))}
              style={[styles.stepButton, { borderColor: border, backgroundColor: card }]}>
              <Text style={[styles.stepSymbol, { color: text }]}>+</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.twoCols}>
          <View style={styles.col}>
            <Field
              label="PESO (KG)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.col}>
            <Field
              label="DISTANCIA (KM)"
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
            />
          </View>
        </View>
        <Field
          label="INSTRUCCIONES"
          value={notes}
          onChangeText={setNotes}
          placeholder="Ej. dejar en portería"
          multiline
        />
      </Card>

      <Card style={styles.quote}>
        <View>
          <Text style={[styles.quoteLabel, { color: muted }]}>Tarifa estimada</Text>
          <Text style={[styles.quoteValue, { color: text }]}>{formatCurrency(estimate)}</Text>
        </View>
        <View style={styles.quoteMeta}>
          <IconSymbol name="clock.fill" size={14} color={muted} />
          <Text style={[styles.quoteHint, { color: muted }]}>
            {SERVICE_META[service].hint}
          </Text>
        </View>
      </Card>

      <Button
        label="Solicitar recojo"
        icon="truck.box.fill"
        disabled={!canSubmit}
        onPress={handleSubmit}
      />
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
  field: {
    gap: Spacing.xs + 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  input: {
    minHeight: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: 15,
    fontWeight: '500',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  services: {
    gap: Spacing.sm,
  },
  service: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: 2,
  },
  serviceLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  serviceHint: {
    fontSize: 12,
    fontWeight: '500',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSymbol: {
    fontSize: 18,
    fontWeight: '800',
  },
  stepValue: {
    fontSize: 17,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  twoCols: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  col: {
    flex: 1,
  },
  quote: {
    gap: Spacing.sm,
  },
  quoteLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  quoteValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  quoteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  quoteHint: {
    fontSize: 12,
    fontWeight: '600',
  },
  successCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
  },
  successId: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
