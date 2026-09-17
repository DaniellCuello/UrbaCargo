import { ComponentProps } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: ComponentProps<typeof IconSymbol>['name'];
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const textColor = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const danger = useThemeColor({}, 'danger');
  const card = useThemeColor({}, 'card');

  const palette: Record<ButtonVariant, { bg: string; fg: string; border: string }> = {
    primary: { bg: Brand.primary, fg: '#FFFFFF', border: Brand.primary },
    danger: { bg: danger, fg: '#FFFFFF', border: danger },
    outline: { bg: 'transparent', fg: textColor, border: borderColor },
    ghost: { bg: 'transparent', fg: primary, border: 'transparent' },
  };

  const colors = palette[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: variant === 'ghost' ? 'transparent' : colors.bg,
          borderColor: colors.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        variant === 'ghost' && { backgroundColor: card },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.fg} />
      ) : (
        <>
          {icon ? <IconSymbol name={icon} size={18} color={colors.fg} /> : null}
          <Text style={[styles.label, { color: colors.fg }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.lg,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
