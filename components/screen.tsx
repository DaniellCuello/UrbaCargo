import { useRouter } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type ScreenProps = PropsWithChildren<{
  /** Rendered above the scrollable content, below the safe area. */
  header?: ReactNode;
  /** Set to false for screens that render their own scrollable list. */
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, header, scroll = true, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const background = useThemeColor({}, 'background');
  const paddingBottom = Spacing.xxl + insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: background, paddingTop: insets.top }]}>
      {header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.content, { paddingBottom }, contentStyle]}>
          {children}
        </View>
      )}
    </View>
  );
}

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenHeader({ title, subtitle, showBack = false, right, style }: ScreenHeaderProps) {
  const router = useRouter();
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');

  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerRow}>
        {showBack ? (
          <Pressable
            accessibilityLabel="Volver"
            hitSlop={12}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            style={styles.back}>
            <IconSymbol name="arrow.left" size={22} color={text} />
          </Pressable>
        ) : null}
        <View style={styles.heading}>
          <Text style={[styles.title, { color: text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: muted }]}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -Spacing.sm,
  },
  heading: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontFamily: Platform.select({ ios: 'ui-rounded', default: undefined }),
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});
