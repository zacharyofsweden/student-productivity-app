import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add state for filter options
  const [filters, setFilters] = useState({
    theme: null,
    tags: [],
    urgency: null, // 'high', 'medium', 'low'
    taskType: null, // 'daily', 'weekly', 'one-time'
  });

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

  // Add a new task with enhanced fields
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
      // New fields
      theme: task.theme || null,
      tags: task.tags || [],
      taskType: task.taskType || 'one-time',
      countdownTimer: task.countdownTimer || null, // in minutes
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

  // Apply filters
  const applyFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      theme: null,
      tags: [],
      urgency: null,
      taskType: null,
    });
  };

  // Get filtered tasks
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Filter by theme if a theme filter is selected
      if (filters.theme && task.theme !== filters.theme) {
        return false;
      }
      
      // Filter by tags if tag filters are applied
      if (filters.tags.length > 0 && !filters.tags.some(tag => task.tags.includes(tag))) {
        return false;
      }
      
      // Filter by urgency/priority
      if (filters.urgency && task.priority !== filters.urgency) {
        return false;
      }
      
      // Filter by task type
      if (filters.taskType && task.taskType !== filters.taskType) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks: getFilteredTasks(),
        filters,
        loading,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        incrementPomodoroSession,
        applyFilters,
        resetFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};