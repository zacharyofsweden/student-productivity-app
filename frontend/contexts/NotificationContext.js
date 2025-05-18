import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,
    shouldPlaySound: true,
    shouldSetBadge:  false,
  }),
});

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionStatus(status);
    })();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    return status;
  };

  const scheduleTaskReminder = async (task) => { /* … */ };
  const schedulePomodoroComplete = async (title) => { /* … */ };

  return (
    <NotificationContext.Provider value={{
      permissionStatus,
      requestPermissions,
      scheduleTaskReminder,
      schedulePomodoroComplete,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};