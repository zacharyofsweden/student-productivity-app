import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const { user, loading, signInWithGoogle, signOut } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Signed in as {user.name}</Text>
          <Button title="Disconnect Calendar" onPress={signOut} />
        </>
      ) : (
        <Button title="Connect Google Calendar" onPress={signInWithGoogle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 15,
    fontSize: 16,
  },
});