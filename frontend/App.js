import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { TaskProvider } from './contexts/TaskContext';
import { ZooProvider } from './contexts/ZooContext';

import AppRouter from './navigation/AppRouter'; // 👈 NEW

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <ZooProvider>
          <NavigationContainer>
            <AppRouter />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ZooProvider>
      </TaskProvider>
    </SafeAreaProvider>
  );
}