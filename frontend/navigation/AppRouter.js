// navigation/AppRouter.js
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import OnboardingScreens from '../components/OnboardingScreens';
import TabNavigator from './TabNavigator';
import HelpScreen from '../screens/HelpScreen';

const Stack = createNativeStackNavigator();

const AppRouter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      const done = await AsyncStorage.getItem('@onboarding_complete');
      setShowOnboarding(done !== 'true');
      setIsLoading(false);
    };
    checkOnboarding();
  }, []);

  if (isLoading) return null; // Optionally return splash

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showOnboarding ? (
        <Stack.Screen name="Onboarding">
          {props => <OnboardingScreens {...props} onComplete={() => setShowOnboarding(false)} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="MainApp" component={TabNavigator} />
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{ headerShown: true, title: 'Help Center' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppRouter;