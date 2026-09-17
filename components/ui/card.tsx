import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type CardProps = ViewProps & {
  /** Adds the default inner padding. Defaults to true. */
  padded?: boolean;
  /** Disables the card shadow (useful for nested surfaces). */
  flat?: boolean;
};

export function Card({ style, padded = true, flat = false, ...rest }: CardProps) {
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View
      style={[
        styles.card,
        { backgroundColor, borderColor },
        !flat && Shadow.card,
        padded && styles.padded,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  padded: {
    padding: Spacing.lg,
  },
});
