import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import ZooScreen from '../screens/ZooScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let name = 'ellipse';
          if (route.name === 'Home')      name = focused ? 'home' : 'home-outline';
          if (route.name === 'Tasks')     name = focused ? 'list' : 'list-outline';
          if (route.name === 'Pomodoro')  name = focused ? 'timer' : 'timer-outline';
          if (route.name === 'Zoo')       name = focused ? 'paw' : 'paw-outline';
          if (route.name === 'Help')      name = focused ? 'help-circle' : 'help-circle-outline';
          if (route.name === 'Settings')  name = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5D8BF4',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen} />
      <Tab.Screen name="Tasks"     component={TasksScreen} />
      <Tab.Screen name="Pomodoro"  component={PomodoroScreen} />
      <Tab.Screen name="Zoo"       component={ZooScreen} />
      <Tab.Screen name="Help"      component={HelpScreen} />
      <Tab.Screen name="Settings"  component={SettingsScreen} />
    </Tab.Navigator>
  );
}