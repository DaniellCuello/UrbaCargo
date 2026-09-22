import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type LifecyclePhase = 'mount' | 'update' | 'unmount';

type LifecycleBoardProps = {
  parentCount: number;
  onEvent: (phase: LifecyclePhase, message: string) => void;
};

export function LifecycleBoard({ parentCount, onEvent }: LifecycleBoardProps) {
  const [count, setCount] = useState(0);
  const [auto, setAuto] = useState(false);
  const rendersRef = useRef(0);
  rendersRef.current += 1;

  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  });

  // MOUNTING + UNMOUNTING
  useEffect(() => {
    onEventRef.current('mount', 'useEffect([]) → componente montado en el DOM');
    return () => {
      onEventRef.current('unmount', 'cleanup de useEffect → componente fuera del DOM');
    };
  }, []);

  // UPDATING: cambios en props
  useEffect(() => {
    if (parentCount === 0) return;
    onEventRef.current('update', `useEffect([parentCount]) → prop cambiada a ${parentCount}`);
  }, [parentCount]);

  // UPDATING: cambios en estado con temporizador
  useEffect(() => {
    if (!auto) return;
    onEventRef.current('update', 'useEffect([auto]) → temporizador iniciado');
    const id = setInterval(() => setCount((c) => c + 1), 1200);
    return () => {
      clearInterval(id);
      onEventRef.current('update', 'cleanup → temporizador detenido');
    };
  }, [auto]);

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const info = useThemeColor({}, 'info');
  const success = useThemeColor({}, 'success');

  return (
    <View style={[styles.board, { backgroundColor: card, borderColor: border }]}>
      <View style={styles.boardHeader}>
        <View style={[styles.statusDot, { backgroundColor: success }]} />
        <Text style={[styles.boardTitle, { color: text }]}>
          {'<LifecycleBoard />'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: muted }]}>Estado (count)</Text>
          <Text style={[styles.statValue, { color: text }]}>{count}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: muted }]}>Renders</Text>
          <Text style={[styles.statValue, { color: text }]}>{rendersRef.current}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: muted }]}>Prop padre</Text>
          <Text style={[styles.statValue, { color: text }]}>{parentCount}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => setCount((c) => c + 1)} style={[styles.smallBtn, { backgroundColor: primary }]}>
          <Text style={styles.smallBtnText}>+1 Estado</Text>
        </Pressable>
        <Pressable onPress={() => setAuto((a) => !a)} style={[styles.smallBtn, { backgroundColor: info }]}>
          <Text style={styles.smallBtnText}>{auto ? 'Detener auto' : 'Auto +1'}</Text>
        </Pressable>
      </View>

      <Text style={[styles.hint, { color: muted }]}>
        {auto
          ? 'El efecto [auto] actualiza el estado cada 1.2s.'
          : 'Presiona "Cambiar props" en el panel inferior para actualizar por props.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  boardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
  },
  boardTitle: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Fonts.mono,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  stat: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  smallBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  hint: {
    fontSize: 11,
  },
});