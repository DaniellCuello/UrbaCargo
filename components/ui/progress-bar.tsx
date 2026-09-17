import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ProgressBar({
  progress,
  color,
  trackColor,
}: {
  progress: number;
  color?: string;
  trackColor?: string;
}) {
  const track = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={[styles.track, { backgroundColor: trackColor ?? track }]}>
      <View
        style={[
          styles.fill,
          { backgroundColor: color ?? primary, width: `${clamped * 100}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
