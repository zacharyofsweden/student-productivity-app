import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskContext } from '../contexts/TaskContext';
import { ZooContext } from '../contexts/ZooContext';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const { tasks } = useContext(TaskContext);
  const { coins, animals } = useContext(ZooContext);

  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const totalPomodoroSessions = tasks.reduce((acc, task) => acc + task.pomodoroSessions, 0);
  const unlockedAnimals = animals.filter(animal => animal.unlocked).length;
  
  // Calculate tasks by type
  const dailyTasks = tasks.filter(task => task.taskType === 'daily').length;
  const weeklyTasks = tasks.filter(task => task.taskType === 'weekly').length;
  const oneTimeTasks = tasks.filter(task => task.taskType === 'one-time').length;
  
  // Calculate tasks by theme
  const taskThemes = {};
  tasks.forEach(task => {
    if (task.theme) {
      taskThemes[task.theme] = (taskThemes[task.theme] || 0) + 1;
    }
  });
  
  // Find most used tags
  const tagCounts = {};
  tasks.forEach(task => {
    if (task.tags && task.tags.length > 0) {
      task.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  // Get top 3 tags
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => ({ tag, count }));

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

      {/* Task Type Breakdown */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Task Types</Text>
        <View style={styles.taskTypeContainer}>
          <View style={styles.taskTypeItem}>
            <Ionicons name="today-outline" size={24} color="#5D8BF4" />
            <Text style={styles.taskTypeValue}>{dailyTasks}</Text>
            <Text style={styles.taskTypeLabel}>Daily</Text>
          </View>
          
          <View style={styles.taskTypeItem}>
            <Ionicons name="calendar-outline" size={24} color="#5D8BF4" />
            <Text style={styles.taskTypeValue}>{weeklyTasks}</Text>
            <Text style={styles.taskTypeLabel}>Weekly</Text>
          </View>
          
          <View style={styles.taskTypeItem}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#5D8BF4" />
            <Text style={styles.taskTypeValue}>{oneTimeTasks}</Text>
            <Text style={styles.taskTypeLabel}>One-time</Text>
          </View>
        </View>
      </View>

      {/* Popular Themes */}
      {Object.keys(taskThemes).length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Themes</Text>
          <View style={styles.themesContainer}>
            {Object.entries(taskThemes).map(([theme, count]) => (
              <View key={theme} style={styles.themeItem}>
                <Text style={styles.themeText}>{theme}</Text>
                <Text style={styles.themeCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Popular Tags */}
      {topTags.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular Tags</Text>
          <View style={styles.tagsContainer}>
            {topTags.map((tagInfo) => (
              <View key={tagInfo.tag} style={styles.tagItem}>
                <Text style={styles.tagText}>#{tagInfo.tag}</Text>
                <Text style={styles.tagCount}>{tagInfo.count}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to use ZooFocus</Text>
        <Text style={styles.infoText}>
          1. Create tasks in the Tasks tab with themes, tags, and due dates{'\n'}
          2. Use the Pomodoro timer to focus on your tasks{'\n'}
          3. Track your progress with countdowns for important deadlines{'\n'}
          4. Filter your tasks by theme, tags, urgency, or task type{'\n'}
          5. Earn coins for completed tasks and focus sessions{'\n'}
          6. Spend coins to unlock animals for your virtual zoo{'\n'}
          7. Take care of your animals to keep them happy
        </Text>
      </View>

      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.clear();
          console.log('AsyncStorage cleared!');
          Alert.alert('Storage Cleared', 'Restart the app to see changes.');
        }}
        style={{
          backgroundColor: '#F44336',
          padding: 12,
          margin: 20,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Reset Zoo Storage</Text>
      </TouchableOpacity>
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
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  taskTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  taskTypeItem: {
    alignItems: 'center',
  },
  taskTypeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D8BF4',
    marginTop: 5,
  },
  taskTypeLabel: {
    fontSize: 15,
    color: '#666',
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  themeItem: {
    flexDirection: 'row',
    backgroundColor: '#E1BEE7',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
    alignItems: 'center',
  },
  themeText: {
    color: '#6A1B9A',
    fontWeight: '500',
  },
  themeCount: {
    color: '#6A1B9A',
    fontWeight: 'bold',
    marginLeft: 6,
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
    alignItems: 'center',
  },
  tagText: {
    color: '#388E3C',
    fontWeight: '500',
  },
  tagCount: {
    color: '#388E3C',
    fontWeight: 'bold',
    marginLeft: 6,
    backgroundColor: 'white',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
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
    marginBottom: 30,
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