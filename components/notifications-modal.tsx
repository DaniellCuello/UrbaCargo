import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand, Radius, Shadow, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export function NotificationsButton() {
  const { notifications, markNotificationsAsRead } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = Brand.primary;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = () => {
    setModalVisible(true);
    markNotificationsAsRead();
  };

  return (
    <>
      <Pressable
        accessibilityLabel="Notificaciones"
        onPress={handleOpen}
        style={({ pressed }) => [
          styles.iconButton,
          { backgroundColor: card, borderColor: border },
          pressed && styles.pressed,
        ]}>
        <IconSymbol name="bell.fill" size={20} color={text} />
        {unreadCount > 0 ? (
          <View style={[styles.badgeDot, { backgroundColor: primary }]}>
            <Text style={styles.badgeCount}>{unreadCount}</Text>
          </View>
        ) : null}
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: card, borderColor: border },
              Shadow.card,
            ]}
            onStartShouldSetResponder={() => true}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: border }]}>
              <View style={styles.headerTitleRow}>
                <IconSymbol name="bell.fill" size={20} color={primary} />
                <Text style={[styles.modalTitle, { color: text }]}>Notificaciones</Text>
              </View>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}>
                <IconSymbol name="xmark" size={18} color={muted} />
              </Pressable>
            </View>

            {/* Notifications List */}
            <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <IconSymbol name="bell.fill" size={32} color={muted} />
                  <Text style={[styles.emptyText, { color: muted }]}>
                    No tienes notificaciones por ahora
                  </Text>
                </View>
              ) : (
                notifications.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.notifItem,
                      { borderBottomColor: border },
                      !item.read && { backgroundColor: '#FFF7ED' },
                    ]}>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemTitle, { color: text }]}>{item.title}</Text>
                      <Text style={[styles.itemTime, { color: muted }]}>{item.timestamp}</Text>
                    </View>
                    <Text style={[styles.itemMessage, { color: muted }]}>{item.message}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCount: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxHeight: 420,
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  listScroll: {
    maxHeight: 340,
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  emptyText: {
    fontSize: 13,
  },
  notifItem: {
    padding: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  itemTime: {
    fontSize: 10,
  },
  itemMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.85,
  },
});

