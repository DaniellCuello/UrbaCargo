import type { ShipmentStatus, ServiceLevel } from '@/types/shipment';
import type { ThemeColor } from '@/constants/theme';
import type { IconSymbolName } from '@/components/ui/icon-symbol';

type StatusMeta = {
  label: string;
  shortLabel: string;
  icon: IconSymbolName;
  /** Theme token used for the badge foreground. */
  color: ThemeColor;
  /** Theme token used for the badge background. */
  background: ThemeColor;
};

export const STATUS_META: Record<ShipmentStatus, StatusMeta> = {
  pending: {
    label: 'Pendiente de confirmación',
    shortLabel: 'Pendiente',
    icon: 'clock.fill',
    color: 'warning',
    background: 'warningSoft',
  },
  confirmed: {
    label: 'Confirmado',
    shortLabel: 'Confirmado',
    icon: 'doc.text.fill',
    color: 'info',
    background: 'infoSoft',
  },
  in_transit: {
    label: 'En tránsito',
    shortLabel: 'En tránsito',
    icon: 'truck.box.fill',
    color: 'primary',
    background: 'primarySoft',
  },
  out_for_delivery: {
    label: 'En reparto',
    shortLabel: 'En reparto',
    icon: 'location.fill',
    color: 'info',
    background: 'infoSoft',
  },
  delivered: {
    label: 'Entregado',
    shortLabel: 'Entregado',
    icon: 'checkmark.circle.fill',
    color: 'success',
    background: 'successSoft',
  },
  cancelled: {
    label: 'Cancelado',
    shortLabel: 'Cancelado',
    icon: 'xmark',
    color: 'danger',
    background: 'dangerSoft',
  },
};

export const SERVICE_META: Record<ServiceLevel, { label: string; hint: string; multiplier: number }> =
  {
    same_day: { label: 'Mismo día', hint: 'Entrega en pocas horas', multiplier: 2.2 },
    express: { label: 'Express', hint: 'Entrega en 24 h', multiplier: 1.4 },
    standard: { label: 'Estándar', hint: 'Entrega en 48-72 h', multiplier: 1 },
  };

export const ACTIVE_STATUSES: ShipmentStatus[] = [
  'pending',
  'confirmed',
  'in_transit',
  'out_for_delivery',
];
