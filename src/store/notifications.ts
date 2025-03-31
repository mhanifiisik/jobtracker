import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>(set => ({
  notifications: [],
  addNotification: notification => {
    set(state => ({ notifications: [...state.notifications, notification] }));
  },
  removeNotification: id => {
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id),
    }));
  },
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
