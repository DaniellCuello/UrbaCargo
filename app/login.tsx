import { IconSymbol } from '@/components/ui/icon-symbol';
import { Brand, Radius, Shadow, Spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { UserRole } from '@/types/services';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, registerUser } = useApp();

  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const cardBg = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = Brand.primary; // Vibrant Orange #EA580C
  const primarySoft = '#FFF7ED';

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<UserRole>('CLIENT');

  // Form Fields
  const [fullName, setFullName] = useState('Daniel Cuello');
  const [phoneOrEmail, setPhoneOrEmail] = useState('3122064526');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleSelectAccountType = (type: UserRole) => {
    setAccountType(type);
    if (type === 'CLIENT') {
      setFullName('Daniel Cuello');
      setPhoneOrEmail('3122064526');
      setPassword('123456');
    } else {
      setFullName('Carlos Mendoza');
      setPhoneOrEmail('3159876543');
      setPassword('123456');
    }
  };

  const handleSubmit = () => {
    // 1. Strict Terms Checkbox Validation
    if (!agreeTerms) {
      Alert.alert(
        'Términos Requeridos',
        'Debes aceptar los términos de servicio y la política de reparto ambiental para poder ingresar.'
      );
      return;
    }

    if (!phoneOrEmail.trim() || !password.trim()) {
      Alert.alert('Datos Incompletos', 'Por favor ingresa tu número de teléfono/correo y tu contraseña.');
      return;
    }

    if (activeTab === 'register') {
      if (!fullName.trim()) {
        Alert.alert('Nombre Requerido', 'Por favor ingresa tu nombre completo para registrarte.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Las contraseñas no coinciden', 'Asegúrate de que ambas contraseñas coincidan.');
        return;
      }
      const success = registerUser(fullName, phoneOrEmail, accountType);
      if (success) {
        router.replace('/(tabs)');
      }
    } else {
      const success = login(phoneOrEmail, accountType);
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'No se pudo iniciar sesión. Verifica tus datos.');
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Header Bar - Centered title & leaf icon */}
      <View style={styles.navBar}>
        <View style={{ width: 32 }} />

        <View style={styles.brandTitleRow}>
          <Text style={[styles.brandTitle, { color: text }]}>UrbaCargo</Text>
          <View style={[styles.brandDot, { backgroundColor: primary }]} />
        </View>

        <View style={styles.ecoIconBg}>
          <IconSymbol name="leaf.fill" size={16} color={primary} />
        </View>
      </View>

      {/* Main Hero Section */}
      <View style={styles.heroSection}>
        <View style={[styles.logoCard, Shadow.card]}>
          <IconSymbol name="bicycle" size={32} color="#FFFFFF" />
          <View style={styles.logoBadge}>
            <IconSymbol name="bolt.fill" size={10} color={primary} />
          </View>
        </View>

        <Text style={[styles.heroTitle, { color: text }]}>UrbaCargo</Text>
        <Text style={[styles.heroSubtitle, { color: muted }]}>
          Envíos express 100% ecológicos en tu ciudad
        </Text>

        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.activeBadgeText}>Flota 100% Eléctrica Activa</Text>
        </View>
      </View>

      {/* Main Form Container Card */}
      <View style={[styles.formCard, { backgroundColor: cardBg, borderColor: border }, Shadow.card]}>
        {/* Segmented Tabs */}
        <View style={styles.segmentedContainer}>
          <Pressable
            onPress={() => setActiveTab('login')}
            style={[
              styles.segmentTab,
              activeTab === 'login' && { backgroundColor: primary },
            ]}>
            <Text
              style={[
                styles.segmentText,
                activeTab === 'login'
                  ? { color: '#FFFFFF', fontWeight: '800' }
                  : { color: muted },
              ]}>
              Iniciar Sesión
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('register')}
            style={[
              styles.segmentTab,
              activeTab === 'register' && { backgroundColor: primary },
            ]}>
            <Text
              style={[
                styles.segmentText,
                activeTab === 'register'
                  ? { color: '#FFFFFF', fontWeight: '800' }
                  : { color: muted },
              ]}>
              Registrarse
            </Text>
          </Pressable>
        </View>

        {/* Account Type Selector */}
        <Text style={[styles.fieldLabel, { color: muted }]}>Tipo de cuenta</Text>
        <View style={styles.accountTypeGrid}>
          <Pressable
            onPress={() => handleSelectAccountType('CLIENT')}
            style={[
              styles.accountTypeBtn,
              accountType === 'CLIENT'
                ? { borderColor: primary, backgroundColor: primarySoft }
                : { borderColor: border },
            ]}>
            <IconSymbol
              name="person.fill"
              size={18}
              color={accountType === 'CLIENT' ? primary : muted}
            />
            <Text
              style={[
                styles.accountTypeText,
                { color: accountType === 'CLIENT' ? primary : text },
              ]}>
              Particular (Cliente)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleSelectAccountType('PROVIDER')}
            style={[
              styles.accountTypeBtn,
              accountType === 'PROVIDER'
                ? { borderColor: primary, backgroundColor: primarySoft }
                : { borderColor: border },
            ]}>
            <IconSymbol
              name="briefcase.fill"
              size={18}
              color={accountType === 'PROVIDER' ? primary : muted}
            />
            <Text
              style={[
                styles.accountTypeText,
                { color: accountType === 'PROVIDER' ? primary : text },
              ]}>
              Empresa / Prestador
            </Text>
          </Pressable>
        </View>

        {/* Full Name Input (Only in Register tab) */}
        {activeTab === 'register' && (
          <>
            <Text style={[styles.fieldLabel, { color: text }]}>Nombre Completo</Text>
            <View style={[styles.inputBox, { borderColor: border }]}>
              <IconSymbol name="person.fill" size={18} color={muted} style={styles.leftInputIcon} />
              <TextInput
                style={[styles.inputField, { color: text }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Ej. Daniel Cuello"
                placeholderTextColor={muted}
              />
            </View>
          </>
        )}

        {/* Phone / Email Input */}
        <Text style={[styles.fieldLabel, { color: text }]}>Número de Teléfono</Text>
        <View style={[styles.inputBox, { borderColor: border }]}>
          <View style={styles.phoneBadge}>
            <Text style={styles.flagText}>🇨🇴 +57 ▾</Text>
          </View>
          <TextInput
            style={[styles.inputField, { color: text }]}
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            placeholder="312 206 4526 o cliente@test.com"
            placeholderTextColor={muted}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.passwordHeader}>
          <Text style={[styles.fieldLabel, { color: text, marginBottom: 0 }]}>Contraseña</Text>
          {activeTab === 'login' && (
            <Pressable onPress={() => Alert.alert('Recuperar Clave', 'Ingresa con 3122064526 o cliente@test.com')}>
              <Text style={[styles.forgotText, { color: primary }]}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          )}
        </View>

        <View style={[styles.inputBox, { borderColor: border }]}>
          <IconSymbol name="lock.fill" size={18} color={muted} style={styles.leftInputIcon} />
          <TextInput
            style={[styles.inputField, { color: text }]}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••••••"
            placeholderTextColor={muted}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <IconSymbol
              name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
              size={18}
              color={muted}
            />
          </Pressable>
        </View>

        {/* Confirm Password Input (Only in Register tab) */}
        {activeTab === 'register' && (
          <>
            <Text style={[styles.fieldLabel, { color: text }]}>Confirmar Contraseña</Text>
            <View style={[styles.inputBox, { borderColor: border }]}>
              <IconSymbol name="lock.fill" size={18} color={muted} style={styles.leftInputIcon} />
              <TextInput
                style={[styles.inputField, { color: text }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••••••"
                placeholderTextColor={muted}
                secureTextEntry={!showPassword}
              />
            </View>
          </>
        )}

        {/* Terms Checkbox */}
        <Pressable
          onPress={() => setAgreeTerms(!agreeTerms)}
          style={styles.termsRow}>
          <View
            style={[
              styles.checkbox,
              agreeTerms
                ? { backgroundColor: primary, borderColor: primary }
                : { borderColor: border },
            ]}>
            {agreeTerms ? <IconSymbol name="checkmark" size={12} color="#FFFFFF" /> : null}
          </View>
          <Text style={[styles.termsText, { color: muted }]}>
            Acepto los{' '}
            <Text style={{ color: primary, textDecorationLine: 'underline' }}>
              términos de servicio
            </Text>{' '}
            y la política de reparto ambiental.
          </Text>
        </Pressable>

        {/* Main CTA Orange Button */}
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.mainCtaBtn,
            { backgroundColor: primary },
            pressed && styles.pressed,
          ]}>
          <Text style={styles.mainCtaText}>
            {activeTab === 'login' ? 'Ingresar a UrbaCargo' : 'Crear Cuenta en UrbaCargo'}
          </Text>
          <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
        </Pressable>

        {/* Social Login Options */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: border }]} />
          <Text style={[styles.dividerText, { color: muted }]}>o accede con</Text>
          <View style={[styles.dividerLine, { backgroundColor: border }]} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={[styles.socialBtn, { borderColor: border }]}>
            <Text style={styles.socialText}>G Google</Text>
          </Pressable>
          <Pressable style={[styles.socialBtn, { borderColor: border }]}>
            <IconSymbol name="apple.logo" size={18} color={text} />
          </Pressable>
          <Pressable style={[styles.socialBtn, { borderColor: border, backgroundColor: primarySoft }]}>
            <Text style={[styles.socialText, { color: primary }]}>Face ID</Text>
          </Pressable>
        </View>
      </View>

      {/* Footer Banner */}
      <View style={styles.footerBanner}>
        <IconSymbol name="bolt.fill" size={14} color={primary} />
        <Text style={[styles.footerText, { color: muted }]}>
          Operado por la red eléctrica de <Text style={{ fontWeight: '800', color: text }}>UrbaCargo</Text>
        </Text>
      </View>
      <Text style={[styles.cityList, { color: muted }]}>Riohacha • Valledupar • Barranquilla</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 50,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  navBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
  },
  ecoIconBg: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoCard: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  logoBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Brand.primary,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: '#16A34A',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  formCard: {
    width: '100%',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.pill,
    padding: 3,
    marginBottom: Spacing.lg,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.pill,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  accountTypeGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  accountTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  accountTypeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    height: 46,
    marginBottom: Spacing.md,
    backgroundColor: '#FAFAFA',
  },
  phoneBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginRight: Spacing.xs,
  },
  flagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  leftInputIcon: {
    marginRight: Spacing.xs,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    fontSize: 11,
    flex: 1,
  },
  mainCtaBtn: {
    height: 48,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  mainCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  socialBtn: {
    flex: 1,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    marginBottom: 2,
  },
  footerText: {
    fontSize: 12,
  },
  cityList: {
    fontSize: 10,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
