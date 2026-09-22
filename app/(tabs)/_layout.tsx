import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TabLayout() {
  const { currentUser } = useApp();
  const primary = Brand.primary;
  const inactive = useThemeColor({}, 'tabIconDefault');
  const background = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');

  // Strict authentication guard: Redirect to login if unauthenticated
  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: inactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: background,
            borderTopColor: border,
            height: Platform.select({ ios: 84, default: 64 }),
            paddingTop: Spacing.sm,
          },
        ],
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="shipments"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="tray.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="track"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="map.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="hooks"
        options={{
          title: 'Hooks',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="arrow.triangle.2.circlepath" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});
