import { useNotificationStore } from '@/store/notifications';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    if (notifications.length > 0) {
      const notification = notifications[0];

      if (notification.type === 'success') {
        toast.success(notification.message, {
          duration: notification.duration,
          id: notification.id,
        });
      } else if (notification.type === 'error') {
        toast.error(notification.message, {
          duration: notification.duration,
          id: notification.id,
        });
      } else if (notification.type === 'info') {
        toast.custom(notification.message, {
          duration: notification.duration,
          id: notification.id,
        });
      } else {
        toast.custom(notification.message, {
          duration: notification.duration,
          id: notification.id,
        });
      }

      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);

      return () => {
        clearTimeout(timer);
        removeNotification(notification.id);
      };
    }
  }, [notifications, removeNotification]);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default NotificationProvider;
