import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from storage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks', error);
      }
    };

    if (!loading) {
      saveTasks();
    }
  }, [tasks, loading]);

  // Add a new task
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate || null,
      priority: task.priority || 'medium',
      completed: false,
      pomodoroSessions: 0,
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTask]);
  };

  // Update a task
  const updateTask = (taskId, updatedFields) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Complete a task
  const completeTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
  };

  // Increment pomodoro sessions for a task
  const incrementPomodoroSession = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, pomodoroSessions: task.pomodoroSessions + 1 }
          : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        incrementPomodoroSession,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};