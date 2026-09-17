import type { ServiceLevel } from '@/types/shipment';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(iso: string) {
  if (iso === '—') return iso;
  const date = new Date(iso);
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string) {
  if (iso === '—') return iso;
  const date = new Date(iso);
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Rough quote used by the "Cotizar" flow. */
export function quotePrice(weightKg: number, distanceKm: number, service: ServiceLevel) {
  const base = 8;
  const weightCost = Math.max(weightKg, 1) * 1.6;
  const distanceCost = distanceKm * 0.9;
  const multiplier = service === 'same_day' ? 2.2 : service === 'express' ? 1.4 : 1;
  return Math.round((base + weightCost + distanceCost) * multiplier * 100) / 100;
}
