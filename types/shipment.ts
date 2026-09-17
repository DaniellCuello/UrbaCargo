export type ShipmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type ServiceLevel = 'same_day' | 'express' | 'standard';

export type Place = {
  name: string;
  address: string;
  city: string;
};

export type Courier = {
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  phone: string;
};

export type TimelineEvent = {
  status: ShipmentStatus;
  title: string;
  description: string;
  date: string;
  done: boolean;
};

export type Shipment = {
  id: string;
  status: ShipmentStatus;
  service: ServiceLevel;
  origin: Place;
  destination: Place;
  recipient: {
    name: string;
    phone: string;
  };
  courier?: Courier;
  packages: number;
  weightKg: number;
  price: number;
  distanceKm: number;
  progress: number;
  createdAt: string;
  eta: string;
  timeline: TimelineEvent[];
};
