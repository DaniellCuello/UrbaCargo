import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatDateTime } from '@/lib/format';
import type { TimelineEvent } from '@/types/shipment';

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');

  return (
    <View>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const color = event.done ? primary : border;
        return (
          <View key={`${event.status}-${index}`} style={styles.row}>
            <View style={styles.marker}>
              <View
                style={[
                  styles.dot,
                  { borderColor: color, backgroundColor: event.done ? color : 'transparent' },
                ]}
              />
              {!isLast ? <View style={[styles.line, { backgroundColor: color }]} /> : null}
            </View>
            <View style={[styles.content, !isLast && styles.contentSpacing]}>
              <Text style={[styles.title, { color: event.done ? text : muted }]}>{event.title}</Text>
              <Text style={[styles.description, { color: muted }]}>{event.description}</Text>
              <Text style={[styles.date, { color: muted }]}>{formatDateTime(event.date)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  marker: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: Radius.pill,
    borderWidth: 2,
    marginTop: 2,
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 2,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  contentSpacing: {
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
  },
});
