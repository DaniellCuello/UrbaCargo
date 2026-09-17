import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ThemeColor } from '@/constants/theme';

type BadgeProps = {
  label: string;
  color?: ThemeColor;
  background?: ThemeColor;
  style?: ViewStyle;
};

export function Badge({ label, color = 'textMuted', background = 'primarySoft', style }: BadgeProps) {
  const textColor = useThemeColor({}, color);
  const backgroundColor = useThemeColor({}, background);

  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
