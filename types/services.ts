export type UserRole = 'CLIENT' | 'PROVIDER';

export type Location = {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  location: Location;
  rating?: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
  color?: string;
};

export type Service = {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  price: number;
  description: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerRating: number;
  providerPhone: string;
  location: Location;
  estimatedTime: string;
  rating: number;
  distanceKm: number;
  image?: string;
};

export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ServiceRequest = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  categoryName: string;
  price: number;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientLocation: Location;
  providerId: string;
  providerName: string;
  providerPhone: string;
  providerAvatar: string;
  providerLocation: Location;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  currentProviderLocation?: Location;
  distanceKm?: number;
  notes?: string;
  serviceImage?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_change' | 'new_request' | 'system';
  requestId?: string;
};
