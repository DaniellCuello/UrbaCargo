import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'shippingbox.fill': 'inventory-2',
  'map.fill': 'map',
  'person.fill': 'person',
  'plus.circle.fill': 'add-circle',
  'magnifyingglass': 'search',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'clock.fill': 'schedule',
  'bell.fill': 'notifications',
  'location.fill': 'location-on',
  'checkmark.circle.fill': 'check-circle',
  'truck.box.fill': 'local-shipping',
  'arrow.right': 'arrow-forward',
  'arrow.left': 'arrow-back',
  'arrow.up.right': 'north-east',
  'phone.fill': 'phone',
  'qrcode': 'qr-code',
  'gearshape.fill': 'settings',
  'creditcard.fill': 'credit-card',
  'questionmark.circle.fill': 'help-outline',
  'xmark': 'close',
  'person.crop.circle': 'account-circle',
  'person.circle.fill': 'account-circle',
  'star.fill': 'star',
  'doc.text.fill': 'description',
  'mappin.and.ellipse': 'place',
  'square.grid.2x2.fill': 'grid-view',
  'building.2.fill': 'business',
  'shield.lefthalf.filled': 'verified-user',
  'calendar': 'event',
  'chevron.left.forwardslash.chevron.right': 'code',
  'bicycle': 'directions-bike',
  'bolt.fill': 'bolt',
  'leaf.fill': 'eco',
  'tray.fill': 'inbox',
  'desktopcomputer': 'desktop-windows',
  'wrench.and.screwdriver.fill': 'build',
  'paintbrush.fill': 'palette',
  'iphone': 'smartphone',
  'book.fill': 'book',
  'figure.walk': 'directions-walk',
  'square.and.arrow.up': 'share',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'lock.fill': 'lock',
  'checkmark': 'check',
  'xmark.circle.fill': 'cancel',
  'briefcase.fill': 'work',
  'apple.logo': 'phone-iphone',
  'checkmark.seal.fill': 'verified',
  'shield.fill': 'shield',
  'rectangle.portrait.and.arrow.right': 'logout',
  'arrow.triangle.2.circlepath': 'sync',
  'trash.fill': 'delete',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
