import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// Configure how notifications are shown when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [status, setStatus] = useState(null);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      setStatus(status);
    })();
  }, []);

  /**
   * Schedule a reminder 1 hour before task.dueDate
   * 
   */
  const scheduleTaskReminder = async (task) => {
    if (!task.dueDate) return;
    const due = new Date(task.dueDate);
    const triggerDate = new Date(due.getTime() - 60 * 60 * 1000); // 1h before

    if (triggerDate > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder: ${task.title}`,
          body: task.description || 'You have a task coming up!',
        },
        trigger: triggerDate,
      });
    }
  };

  /** 
   * Fire an immediate “Pomodoro Complete” notification 
   */
  const schedulePomodoroComplete = async (taskTitle) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Pomodoro Complete!',
        body: `Great job focusing on "${taskTitle}"!`,
      },
      trigger: null, // immediate
    });
  };

  return (
    <NotificationContext.Provider value={{
      permissionStatus: status,
      scheduleTaskReminder,
      schedulePomodoroComplete,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};