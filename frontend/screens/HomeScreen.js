import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TaskContext } from '../contexts/TaskContext';
import { ZooContext } from '../contexts/ZooContext';

const HomeScreen = () => {
  const { tasks } = useContext(TaskContext);
  const { coins, animals } = useContext(ZooContext);

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const totalPomodoroSessions = tasks.reduce((acc, task) => acc + task.pomodoroSessions, 0);
  const unlockedAnimals = animals.filter(animal => animal.unlocked).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to ZooFocus</Text>
        <Text style={styles.subtitle}>Your productivity companion</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending Tasks</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed Tasks</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalPomodoroSessions}</Text>
          <Text style={styles.statLabel}>Pomodoro Sessions</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{unlockedAnimals}</Text>
          <Text style={styles.statLabel}>Zoo Animals</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to use ZooFocus</Text>
        <Text style={styles.infoText}>
          1. Create tasks in the Tasks tab{'\n'}
          2. Use the Pomodoro timer to focus on your tasks{'\n'}
          3. Earn coins for completed tasks and focus sessions{'\n'}
          4. Spend coins to unlock animals for your virtual zoo{'\n'}
          5. Take care of your animals to keep them happy
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#5D8BF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D8BF4',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#666',
  },
});

export default HomeScreen;