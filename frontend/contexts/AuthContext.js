import React, { createContext, useState, useEffect } from 'react';
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const IOS_CLIENT_ID    = '<TempIosClientD>.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '<TempAndriodClienD>.apps.googleusercontent.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token/user from storage on mount
  useEffect(() => {
    (async () => {
      const storedToken = await AsyncStorage.getItem('@google_token');
      const storedUser  = await AsyncStorage.getItem('@google_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    })();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId: IOS_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        scopes: [
          'profile',
          'email',
          'https://www.googleapis.com/auth/calendar.events'
        ],
      });

      if (result.type === 'success') {
        setUser(result.user);
        setToken(result.accessToken);

        await AsyncStorage.setItem('@google_token', result.accessToken);
        await AsyncStorage.setItem('@google_user', JSON.stringify(result.user));
      } else {
        // Cancelled
        console.log('Google sign-in cancelled');
      }
    } catch (e) {
      console.error('Google sign-in error:', e);
    }
  };

  // Sign out
  const signOut = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('@google_token');
    await AsyncStorage.removeItem('@google_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};