import {
    INITIAL_NOTIFICATIONS,
    INITIAL_REQUESTS,
    MOCK_CLIENT,
    MOCK_PROVIDER,
    SERVICES,
} from '@/data/mock-data';
import {
    NotificationItem,
    RequestStatus,
    Service,
    ServiceRequest,
    User,
    UserRole,
} from '@/types/services';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AppContextType = {
  currentUser: User | null;
  login: (email: string, role: UserRole) => boolean;
  registerUser: (name: string, phoneOrEmail: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: () => void;
  services: Service[];
  requests: ServiceRequest[];
  notifications: NotificationItem[];
  markNotificationsAsRead: () => void;
  createRequest: (serviceId: string, notes?: string) => ServiceRequest | null;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  cancelRequest: (requestId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [services] = useState<Service[]>(SERVICES);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const login = (email: string, role: UserRole): boolean => {
    if (role === 'PROVIDER' || email.toLowerCase().includes('prestador') || email === '3159876543') {
      setCurrentUser({ ...MOCK_PROVIDER, role: 'PROVIDER' });
      return true;
    }
    setCurrentUser({ ...MOCK_CLIENT, role: 'CLIENT' });
    return true;
  };

  const registerUser = (name: string, phoneOrEmail: string, role: UserRole): boolean => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'Daniel Cuello',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@test.com`,
      role,
      phone: phoneOrEmail.startsWith('+') ? phoneOrEmail : `+57 ${phoneOrEmail}`,
      avatar: role === 'CLIENT'
        ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      location: {
        latitude: 11.5435,
        longitude: -72.9065,
        address: 'Calle 15 #12-45, Centro',
        city: 'Riohacha',
      },
    };
    setCurrentUser(newUser);
    addNotification('🎉 Cuenta Creada', `Bienvenido a UrbaCargo, ${newUser.name}.`, undefined);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = () => {
    if (!currentUser) {
      setCurrentUser(MOCK_CLIENT);
      return;
    }
    if (currentUser.role === 'CLIENT') {
      setCurrentUser(MOCK_PROVIDER);
    } else {
      setCurrentUser(MOCK_CLIENT);
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (title: string, message: string, requestId?: string) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: 'Justo ahora',
      read: false,
      type: 'status_change',
      requestId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const createRequest = (serviceId: string, notes?: string): ServiceRequest | null => {
    const service = services.find((s) => s.id === serviceId);
    if (!service || !currentUser) return null;

    const newReq: ServiceRequest = {
      id: `req_${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      categoryName: service.categoryName,
      price: service.price,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientPhone: currentUser.phone,
      clientLocation: currentUser.location,
      providerId: service.providerId,
      providerName: service.providerName,
      providerPhone: service.providerPhone,
      providerAvatar: service.providerAvatar,
      providerLocation: service.location,
      currentProviderLocation: { ...service.location },
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      distanceKm: service.distanceKm,
      notes: notes || 'Solicitud de servicio estándar',
      serviceImage: service.image,
    };

    setRequests((prev) => [newReq, ...prev]);
    addNotification(
      '📝 Solicitud Creada',
      `Has solicitado "${service.title}". El prestador responderá pronto.`,
      newReq.id
    );
    return newReq;
  };

  const updateRequestStatus = (requestId: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updated = {
            ...req,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
          if (newStatus === 'ON_THE_WAY' && !updated.currentProviderLocation) {
            updated.currentProviderLocation = { ...req.providerLocation };
          }

          let notifTitle = '';
          let notifMsg = '';
          switch (newStatus) {
            case 'ACCEPTED':
              notifTitle = '✅ Solicitud Aceptada';
              notifMsg = `${req.providerName} ha aceptado tu servicio "${req.serviceTitle}".`;
              break;
            case 'ON_THE_WAY':
              notifTitle = '🚀 Prestador En Camino';
              notifMsg = `${req.providerName} está en camino hacia tu ubicación en Riohacha.`;
              break;
            case 'IN_PROGRESS':
              notifTitle = '⚙️ Servicio En Proceso';
              notifMsg = `${req.providerName} ha iniciado la prestación de tu servicio.`;
              break;
            case 'COMPLETED':
              notifTitle = '🎉 Servicio Completado';
              notifMsg = `El servicio "${req.serviceTitle}" ha sido finalizado exitosamente.`;
              break;
            case 'CANCELLED':
              notifTitle = '❌ Solicitud Cancelada';
              notifMsg = `La solicitud de "${req.serviceTitle}" ha sido cancelada.`;
              break;
          }
          if (notifTitle) {
            addNotification(notifTitle, notifMsg, req.id);
          }

          return updated;
        }
        return req;
      })
    );
  };

  const cancelRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'CANCELLED');
  };

  // Real-time animated movement simulation for ON_THE_WAY status
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prevRequests) =>
        prevRequests.map((req) => {
          if (req.status === 'ON_THE_WAY') {
            const currentLoc = req.currentProviderLocation || req.providerLocation;
            const clientLoc = req.clientLocation;

            const latDiff = clientLoc.latitude - currentLoc.latitude;
            const lngDiff = clientLoc.longitude - currentLoc.longitude;

            const distanceSq = latDiff * latDiff + lngDiff * lngDiff;

            if (distanceSq < 0.0000005) {
              return {
                ...req,
                currentProviderLocation: { ...clientLoc, address: '¡Prestador llegó a tu ubicación!' },
                distanceKm: 0.0,
              };
            }

            const newLat = currentLoc.latitude + latDiff * 0.15;
            const newLng = currentLoc.longitude + lngDiff * 0.15;

            const approxKm = Math.max(
              0.1,
              Number((Math.sqrt(distanceSq) * 111).toFixed(1))
            );

            return {
              ...req,
              currentProviderLocation: {
                ...currentLoc,
                latitude: newLat,
                longitude: newLng,
                address: `Aproximándose por Riohacha (~${approxKm} km)`,
              },
              distanceKm: approxKm,
            };
          }
          return req;
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        registerUser,
        logout,
        switchRole,
        services,
        requests,
        notifications,
        markNotificationsAsRead,
        createRequest,
        updateRequestStatus,
        cancelRequest,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
