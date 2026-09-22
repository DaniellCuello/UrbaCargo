import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LifecycleBoard } from '@/components/lifecycle-demo';
import type { LifecyclePhase } from '@/components/lifecycle-demo';
import { Screen } from '@/components/screen';
import { Badge } from '@/components/ui/badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ThemeColor } from '@/constants/theme';

type LifecycleEvent = {
  id: string;
  phase: LifecyclePhase;
  message: string;
  time: string;
};

const PHASE_LABEL: Record<LifecyclePhase, string> = {
  mount: 'MONTAR',
  update: 'ACTUALIZAR',
  unmount: 'DESMONTAR',
};

const PHASE_COLOR: Record<LifecyclePhase, ThemeColor> = {
  mount: 'success',
  update: 'info',
  unmount: 'danger',
};

const PHASE_BACKGROUND: Record<LifecyclePhase, ThemeColor> = {
  mount: 'successSoft',
  update: 'infoSoft',
  unmount: 'dangerSoft',
};

const PHASES = [
  {
    icon: 'plus.circle.fill' as const,
    phase: 'mount' as const,
    title: 'Montaje (Mounting)',
    hook: 'useEffect([])',
    description:
      'Ocurre cuando el componente se crea por primera vez y se inserta en el DOM. El estado inicial se define con useState y el efecto con dependencias vacías [] se ejecuta justo después del primer render.',
  },
  {
    icon: 'arrow.triangle.2.circlepath' as const,
    phase: 'update' as const,
    title: 'Actualización (Updating)',
    hook: 'setState / props',
    description:
      'Sucede cuando el componente recibe nuevas props o cambia su estado interno (setState). React vuelve a renderizar y re-ejecuta los efectos cuyas dependencias cambiaron.',
  },
  {
    icon: 'xmark.circle.fill' as const,
    phase: 'unmount' as const,
    title: 'Desmontaje (Unmounting)',
    hook: 'cleanup',
    description:
      'Ocurre cuando el componente se elimina del DOM. La función de limpieza (cleanup) que retorna useEffect se ejecuta aquí, equivalente al componenteWillUnmount.',
  },
] as const;

const RULES = [
  {
    number: '1',
    title: 'Llamar Hooks solo al nivel superior',
    description:
      'Nunca dentro de condicionales, bucles ni funciones anidadas. El orden y la cantidad de llamadas deben ser idénticos en cada render, porque React asocia cada hook por posición.',
  },
  {
    number: '2',
    title: 'Llamar Hooks solo desde funciones de React',
    description:
      'Solamente desde componentes funcionales o desde hooks personalizados (custom hooks), nunca desde funciones JavaScript normales.',
  },
] as const;

const CODE_SAMPLE = `// useState → estado local
const [estado, setEstado] = useState(valorInicial);
//        ↑          ↑             ↑
//  valor actual   setter    valor inicial

// useEffect → efectos secundarios
useEffect(() => {
  // cuerpo del efecto (montaje / actualización)
  return () => { /* cleanup (desmontaje) */ };
}, [dependencias]);`;

export default function HooksScreen() {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const primarySoft = useThemeColor({}, 'primarySoft');

  const [mounted, setMounted] = useState(true);
  const [parentCount, setParentCount] = useState(0);
  const [events, setEvents] = useState<LifecycleEvent[]>([]);

  const addEvent = (phase: LifecyclePhase, message: string) => {
    const newEvent: LifecycleEvent = {
      id: `${Date.now()}-${Math.random()}`,
      phase,
      message,
      time: new Date().toLocaleTimeString('es-CO', { hour12: false }),
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleMount = () => {
    setMounted(true);
    addEvent('mount', 'Se presionó "Montar demo" → el componente se inserta');
  };

  const handleUnmount = () => {
    setMounted(false);
    addEvent('unmount', 'Se presionó "Desmontar demo" → orden de desmontaje');
  };

  const activePhase = events[0]?.phase;
  const activeColor = activePhase ? PHASE_COLOR[activePhase] : 'textMuted';

  return (
    <Screen
      header={
        <View style={styles.header}>
          <View style={styles.heading}>
            <Text style={[styles.title, { color: text }]}>Hooks & Ciclo de Vida</Text>
            <Text style={[styles.subtitle, { color: muted }]}>
              Anatomía y reglas de los Hooks en React
            </Text>
          </View>
          <Badge label={PHASE_LABEL[activePhase ?? 'mount']} color={activeColor} background="primarySoft" />
        </View>
      }>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.sectionTitle, { gap: Spacing.xs }]}>
          <Text style={[styles.sectionHeading, { color: text }]}>Fases del Ciclo de Vida</Text>
          <Text style={[styles.sectionSub, { color: muted }]}>
            Los componentes pasan por 3 fases desde que aparecen hasta que se eliminan.
          </Text>
        </View>

        {PHASES.map((p) => (
          <View key={p.phase} style={[styles.phaseCard, { backgroundColor: card, borderColor: border }]}>
            <IconSymbol name={p.icon} size={22} color={primary} />
            <View style={styles.phaseBody}>
              <View style={styles.phaseHeader}>
                <Text style={[styles.phaseTitle, { color: text }]}>{p.title}</Text>
                <Badge label={p.hook} color="primary" background="primarySoft" />
              </View>
              <Text style={[styles.phaseDesc, { color: muted }]}>{p.description}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.sectionTitle, { gap: Spacing.xs }]}>
          <Text style={[styles.sectionHeading, { color: text }]}>Anatomía de un Hook</Text>
          <Text style={[styles.sectionSub, { color: muted }]}>
            Un hook es una funci&oacute;n cuyo nombre empieza con &quot;use&quot;. Se &quot;engancha&quot; a la instancia del
            componente y puede devolver datos, funciones o nada.
          </Text>
        </View>

        <View style={[styles.codeBox, { borderColor: border }]}>
          <Text style={styles.codeText}>{CODE_SAMPLE}</Text>
        </View>

        <View style={[styles.sectionTitle, { gap: Spacing.xs }]}>
          <Text style={[styles.sectionHeading, { color: text }]}>Reglas de los Hooks</Text>
          <Text style={[styles.sectionSub, { color: muted }]}>
            Reglas oficiales que permiten a React preservar el estado entre renders.
          </Text>
        </View>

        {RULES.map((r) => (
          <View key={r.number} style={[styles.ruleCard, { backgroundColor: card, borderColor: border }]}>
            <View style={[styles.ruleNumber, { backgroundColor: primarySoft }]}>
              <Text style={[styles.ruleNumberText, { color: primary }]}>{r.number}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.ruleTitle, { color: text }]}>{r.title}</Text>
              <Text style={[styles.ruleDesc, { color: muted }]}>{r.description}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.noteBox, { backgroundColor: primarySoft, borderColor: primary }]}>
          <IconSymbol name="shield.fill" size={16} color={primary} />
          <Text style={[styles.noteText, { color: text }]}>
            React detecta automáticamente las violaciones con el plugin eslint-plugin-react-hooks
            (regla rules-of-hooks).
          </Text>
        </View>

        <View style={[styles.sectionTitle, { gap: Spacing.xs }]}>
          <Text style={[styles.sectionHeading, { color: text }]}>Demo Interactivo</Text>
          <Text style={[styles.sectionSub, { color: muted }]}>
            Observa en vivo cómo se registra cada fase del ciclo de vida al interactuar.
          </Text>
        </View>

        <View style={[styles.demoCard, { backgroundColor: card, borderColor: border }]}>
          <View style={styles.controls}>
            {!mounted ? (
              <Pressable onPress={handleMount} style={[styles.control, { backgroundColor: primary }]}>
                <IconSymbol name="plus.circle.fill" size={16} color="#FFFFFF" />
                <Text style={styles.controlText}>Montar Demo</Text>
              </Pressable>
            ) : (
              <Pressable onPress={handleUnmount} style={[styles.control, { backgroundColor: primary }]}>
                <IconSymbol name="xmark.circle.fill" size={16} color="#FFFFFF" />
                <Text style={styles.controlText}>Desmontar Demo</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => setParentCount((c) => c + 1)}
              disabled={!mounted}
              style={[styles.control, styles.controlOutline, { borderColor: border }, !mounted && styles.disabled]}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={16} color={primary} />
              <Text style={[styles.controlOutlineText, { color: primary }]}>Cambiar props</Text>
            </Pressable>

            <Pressable onPress={() => setEvents([])} style={[styles.control, styles.controlOutline, { borderColor: border }]}>
              <IconSymbol name="trash.fill" size={16} color={muted} />
              <Text style={[styles.controlOutlineText, { color: muted }]}>Limpiar log</Text>
            </Pressable>
          </View>

          {mounted ? (
            <LifecycleBoard parentCount={parentCount} onEvent={addEvent} />
          ) : (
            <View style={styles.placeholder}>
              <IconSymbol name="eye.slash.fill" size={28} color={muted} />
              <Text style={[styles.placeholderText, { color: muted }]}>
                Componente desmontado. Presiona &quot;Montar Demo&quot; para observar el mounting.
              </Text>
            </View>
          )}

          <View style={styles.logHeader}>
            <Text style={[styles.logTitle, { color: text }]}>Registro de eventos</Text>
            <Badge label={`${events.length} eventos`} color="textMuted" background="primarySoft" />
          </View>

          {events.length === 0 ? (
            <Text style={[styles.logEmpty, { color: muted }]}>
              Sin eventos todavía. El componente se monta al iniciar esta pantalla.
            </Text>
          ) : (
            events.slice(0, 50).map((e) => {
              const color = PHASE_COLOR[e.phase];
              return (
                <View key={e.id} style={[styles.logRow, { borderLeftColor: color }]}>
                  <View style={styles.logMeta}>
                    <Text style={[styles.logTime, { color: muted }]}>{e.time}</Text>
                    <Badge label={PHASE_LABEL[e.phase]} color={color} background={PHASE_BACKGROUND[e.phase]} />
                  </View>
                  <Text style={[styles.logMsg, { color: text }]}>{e.message}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  heading: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
  },
  content: {
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    marginTop: Spacing.sm,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 13,
  },
  phaseCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  phaseBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  phaseTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  phaseDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  codeBox: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    backgroundColor: '#0F172A',
    padding: Spacing.md,
  },
  codeText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontFamily: Fonts.mono,
    lineHeight: 18,
  },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumberText: {
    fontSize: 14,
    fontWeight: '800',
  },
  ruleTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  ruleDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  demoCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  controlOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  controlOutlineText: {
    fontSize: 12,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.4,
  },
  placeholder: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  placeholderText: {
    fontSize: 12,
    textAlign: 'center',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  logEmpty: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  logRow: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    gap: Spacing.xs,
  },
  logMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logTime: {
    fontSize: 10,
    fontFamily: Fonts.mono,
  },
  logMsg: {
    fontSize: 12,
    lineHeight: 16,
  },
});