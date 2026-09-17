import { NotificationsButton } from '@/components/notifications-modal';
import { Screen } from '@/components/screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand, Radius, Shadow, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, switchRole, logout } = useApp();

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = Brand.primary;

  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const isProvider = currentUser?.role === 'PROVIDER';

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleChangePassword = () => {
    if (!newPass.trim()) {
      Alert.alert('Atención', 'Por favor ingresa tu nueva contraseña.');
      return;
    }
    Alert.alert('Éxito', 'Tu contraseña ha sido actualizada correctamente.');
    setSecurityModalVisible(false);
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <Screen
      header={
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>Mi Perfil</Text>
          <NotificationsButton />
        </View>
      }>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!currentUser ? (
          <View style={[styles.guestCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
            <IconSymbol name="person.circle.fill" size={48} color={primary} />
            <Text style={[styles.guestTitle, { color: text }]}>Sesión no iniciada</Text>
            <Text style={[styles.guestSub, { color: muted }]}>
              Inicia sesión para acceder a tu perfil y servicios.
            </Text>
            <Pressable
              onPress={() => router.push('/login')}
              style={[styles.loginBtn, { backgroundColor: primary }]}>
              <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* User Profile Card */}
            <View style={[styles.profileCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
              <Image source={{ uri: currentUser.avatar }} style={styles.avatarImg} />
              <View style={styles.profileTextCol}>
                <Text style={[styles.userName, { color: text }]}>{currentUser.name}</Text>
                <Text style={[styles.userEmail, { color: muted }]}>{currentUser.email}</Text>
                <Text style={[styles.userPhone, { color: primary, fontWeight: '700' }]}>
                  📞 {currentUser.phone}
                </Text>

                <View style={[styles.roleChip, { backgroundColor: '#FFF7ED' }]}>
                  <View style={styles.pulseDot} />
                  <Text style={[styles.roleText, { color: primary }]}>
                    {isProvider ? 'PRESTADOR DE SERVICIOS (EMPLEADO)' : 'CLIENTE'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Role Switch Banner - ONLY visible for Provider / Empleado role */}
            {isProvider && (
              <View style={[styles.roleSwitchCard, { backgroundColor: '#FFF7ED', borderColor: primary }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.switchTitle, { color: primary }]}>
                    Modo Activo: Prestador (Empleado)
                  </Text>
                  <Text style={[styles.switchSub, { color: text }]}>
                    Estás en la vista de atención y gestión de solicitudes.
                  </Text>
                </View>

                <Pressable
                  onPress={switchRole}
                  style={[styles.switchBtn, { backgroundColor: primary }]}>
                  <Text style={styles.switchBtnText}>Cambiar Rol ⇄</Text>
                </Pressable>
              </View>
            )}

            {/* Profile Information Data (No password displayed) */}
            <View style={[styles.demoBox, { backgroundColor: card, borderColor: border }]}>
              <Text style={[styles.demoTitle, { color: text }]}>
                👤 Información de la Cuenta:
              </Text>
              <Text style={[styles.demoText, { color: muted }]}>
                • <Text style={{ fontWeight: '700', color: text }}>Titular:</Text> {currentUser.name}
              </Text>
              <Text style={[styles.demoText, { color: muted }]}>
                • <Text style={{ fontWeight: '700', color: text }}>Teléfono:</Text> {currentUser.phone}
              </Text>
              <Text style={[styles.demoText, { color: muted }]}>
                • <Text style={{ fontWeight: '700', color: text }}>Correo:</Text> {currentUser.email}
              </Text>
              <Text style={[styles.demoText, { color: muted }]}>
                • <Text style={{ fontWeight: '700', color: text }}>Ubicación:</Text> {currentUser.location.address}, {currentUser.location.city}
              </Text>
            </View>

            {/* Interactive Options */}
            <View style={[styles.optionsCard, { backgroundColor: card, borderColor: border }, Shadow.card]}>
              <Pressable style={styles.optionRow}>
                <IconSymbol name="location.fill" size={20} color={primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionTitle, { color: text }]}>Ubicación Principal</Text>
                  <Text style={[styles.optionSub, { color: muted }]}>
                    {currentUser.location.address} (Riohacha)
                  </Text>
                </View>
              </Pressable>

              <View style={[styles.divider, { backgroundColor: border }]} />

              {/* Notificaciones Option */}
              <Pressable
                style={styles.optionRow}
                onPress={() => Alert.alert('Notificaciones', 'Toca la campana 🔔 en el encabezado superior para revisar tus notificaciones en vivo.')}>
                <IconSymbol name="bell.fill" size={20} color={primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionTitle, { color: text }]}>Notificaciones</Text>
                  <Text style={[styles.optionSub, { color: muted }]}>Alertas activadas para cambios de estado</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={muted} />
              </Pressable>

              <View style={[styles.divider, { backgroundColor: border }]} />

              {/* Seguridad y Privacidad Option */}
              <Pressable
                style={styles.optionRow}
                onPress={() => setSecurityModalVisible(true)}>
                <IconSymbol name="shield.fill" size={20} color={primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionTitle, { color: text }]}>Seguridad y Privacidad</Text>
                  <Text style={[styles.optionSub, { color: muted }]}>Cambio de clave y autenticación</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color={muted} />
              </Pressable>
            </View>

            {/* Logout Button */}
            <Pressable
              onPress={handleLogout}
              style={[styles.logoutBtn, { borderColor: '#DC2626' }]}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color="#DC2626" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      {/* Security & Privacy Modal */}
      <Modal
        visible={securityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSecurityModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSecurityModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: card, borderColor: border }]} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitleText, { color: text }]}>Seguridad & Privacidad</Text>
              <Pressable onPress={() => setSecurityModalVisible(false)}>
                <IconSymbol name="xmark" size={20} color={muted} />
              </Pressable>
            </View>

            <Text style={[styles.modalSubText, { color: muted }]}>
              Actualiza la contraseña de tu cuenta de UrbaCargo.
            </Text>

            <Text style={[styles.inputLabel, { color: text }]}>Contraseña Actual</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: border, color: text }]}
              value={currentPass}
              onChangeText={setCurrentPass}
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor={muted}
            />

            <Text style={[styles.inputLabel, { color: text }]}>Nueva Contraseña</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: border, color: text }]}
              value={newPass}
              onChangeText={setNewPass}
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor={muted}
            />

            <Pressable
              onPress={handleChangePassword}
              style={[styles.savePassBtn, { backgroundColor: primary }]}>
              <Text style={styles.savePassText}>Guardar Nueva Contraseña</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  guestCard: {
    padding: Spacing.xxl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.md,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  guestSub: {
    fontSize: 13,
    textAlign: 'center',
  },
  loginBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  avatarImg: {
    width: 68,
    height: 68,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Brand.primary,
  },
  profileTextCol: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 13,
  },
  userPhone: {
    fontSize: 12,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    marginTop: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Brand.primary,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  roleSwitchCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  switchSub: {
    fontSize: 11,
    marginTop: 2,
  },
  switchBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  demoBox: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 4,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  demoText: {
    fontSize: 12,
  },
  optionsCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionSub: {
    fontSize: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 48,
  },
  logoutBtn: {
    height: 46,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubText: {
    fontSize: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 42,
    fontSize: 14,
  },
  savePassBtn: {
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  savePassText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
