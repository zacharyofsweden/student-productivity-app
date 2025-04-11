import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import contexts
import { TaskProvider } from './contexts/TaskContext';
import { ZooProvider } from './contexts/ZooContext';

// Import navigation
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <ZooProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </ZooProvider>
      </TaskProvider>
    </SafeAreaProvider>
  );
}