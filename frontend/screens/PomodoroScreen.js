import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Modal,
  Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskContext } from '../contexts/TaskContext';
import { ZooContext } from '../contexts/ZooContext';

const PomodoroScreen = () => {
  const { tasks, incrementPomodoroSession } = useContext(TaskContext);
  const { coins, setCoins } = useContext(ZooContext);
  
  // Timer states
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [taskSelectModalVisible, setTaskSelectModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  
  // Timer settings
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(4);
  
  // Refs
  const timerRef = useRef(null);

  // Filter out completed tasks
  const incompleteTasks = tasks.filter(task => !task.completed);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer start/pause/resume
  const toggleTimer = () => {
    if (!isActive) {
      if (!selectedTask) {
        setTaskSelectModalVisible(true);
        return;
      }
      setIsActive(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setIsPaused(false);
    
    switch (mode) {
      case 'focus':
        setTimeLeft(focusDuration * 60);
        break;
      case 'shortBreak':
        setTimeLeft(shortBreakDuration * 60);
        break;
      case 'longBreak':
        setTimeLeft(longBreakDuration * 60);
        break;
    }
  };

  // Skip current interval
  const skipInterval = () => {
    if (!isActive) return;

    // Handle completion based on current mode
    handleIntervalCompletion();
  };

  // Handle what happens when an interval completes
  const handleIntervalCompletion = () => {
    Vibration.vibrate([500, 500, 500]);

    if (mode === 'focus') {
      // Increment pomodoro count for selected task
      if (selectedTask) {
        incrementPomodoroSession(selectedTask.id);
      }

      // Award coins for completed focus session
      // You can adjust the coin reward as needed
      // setCoins(prevCoins => prevCoins + 10);

      // Increment completed pomodoros
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);

      // Determine next break type
      if (newCompletedPomodoros % pomodorosUntilLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(shortBreakDuration * 60);
      }
    } else {
      // After break, switch back to focus mode
      setMode('focus');
      setTimeLeft(focusDuration * 60);
    }

    resetTimer();
  };

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            // Handle interval completion in the next tick to avoid state update issues
            setTimeout(() => handleIntervalCompletion(), 0);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused, mode]);

  // Select task handler
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setTaskSelectModalVisible(false);
  };

  // Get color based on current mode
  const getModeColor = () => {
    switch(mode) {
      case 'focus':
        return '#FF6B6B';
      case 'shortBreak':
        return '#4ECDC4';
      case 'longBreak':
        return '#3F51B5';
      default:
        return '#FF6B6B';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.timerContainer, { backgroundColor: getModeColor() }]}>
        <Text style={styles.modeText}>
          {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </Text>
        
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        
        <View style={styles.pomodoroCounter}>
          {Array(pomodorosUntilLongBreak).fill().map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.pomodoroIndicator, 
                index < (completedPomodoros % pomodorosUntilLongBreak) && { backgroundColor: 'white' }
              ]} 
            />
          ))}
        </View>

        {selectedTask ? (
          <TouchableOpacity 
            style={styles.selectedTaskButton}
            onPress={() => setTaskSelectModalVisible(true)}
          >
            <Ionicons name="list" size={16} color="white" />
            <Text style={styles.selectedTaskText} numberOfLines={1}>
              {selectedTask.title}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.selectTaskButton}
            onPress={() => setTaskSelectModalVisible(true)}
          >
            <Text style={styles.selectTaskText}>Select a Task</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, styles.secondaryButton]} 
          onPress={resetTimer}
        >
          <Ionicons name="refresh" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.primaryButton]} 
          onPress={toggleTimer}
        >
          <Ionicons 
            name={isActive && !isPaused ? "pause" : "play"} 
            size={28} 
            color="white" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.secondaryButton]} 
          onPress={skipInterval}
          disabled={!isActive}
        >
          <Ionicons 
            name="play-skip-forward" 
            size={24} 
            color={isActive ? "#666" : "#ccc"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedPomodoros}</Text>
          <Text style={styles.statLabel}>Pomodoros Today</Text>
        </View>
        
        {selectedTask && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{selectedTask.pomodoroSessions}</Text>
            <Text style={styles.statLabel}>Task Sessions</Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setSettingsModalVisible(true)}
      >
        <Ionicons name="settings-outline" size={24} color="#666" />
      </TouchableOpacity>

      {/* Task Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={taskSelectModalVisible}
        onRequestClose={() => setTaskSelectModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Task</Text>
            
            {incompleteTasks.length > 0 ? (
              <FlatList
                data={incompleteTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.taskItem}
                    onPress={() => handleTaskSelect(item)}
                  >
                    <Text style={styles.taskTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.taskPomodoroCount}>
                      <Ionicons name="timer-outline" size={14} /> {item.pomodoroSessions}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noTasksText}>
                No incomplete tasks. Add some tasks first!
              </Text>
            )}
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTaskSelectModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Timer Settings</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Focus Duration (minutes)</Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => focusDuration > 5 && setFocusDuration(focusDuration - 5)}
                >
                  <Ionicons name="remove" size={20} color="#5D8BF4" />
                </TouchableOpacity>
                
                <Text style={styles.settingValue}>{focusDuration}</Text>
                
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setFocusDuration(focusDuration + 5)}
                >
                  <Ionicons name="add" size={20} color="#5D8BF4" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Short Break (minutes)</Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => shortBreakDuration > 1 && setShortBreakDuration(shortBreakDuration - 1)}
                >
                  <Ionicons name="remove" size={20} color="#5D8BF4" />
                </TouchableOpacity>
                
                <Text style={styles.settingValue}>{shortBreakDuration}</Text>
                
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setShortBreakDuration(shortBreakDuration + 1)}
                >
                  <Ionicons name="add" size={20} color="#5D8BF4" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Long Break (minutes)</Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => longBreakDuration > 5 && setLongBreakDuration(longBreakDuration - 5)}
                >
                  <Ionicons name="remove" size={20} color="#5D8BF4" />
                </TouchableOpacity>
                
                <Text style={styles.settingValue}>{longBreakDuration}</Text>
                
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setLongBreakDuration(longBreakDuration + 5)}
                >
                  <Ionicons name="add" size={20} color="#5D8BF4" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Pomodoros until long break</Text>
              <View style={styles.settingControls}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => pomodorosUntilLongBreak > 2 && setPomodorosUntilLongBreak(pomodorosUntilLongBreak - 1)}
                >
                  <Ionicons name="remove" size={20} color="#5D8BF4" />
                </TouchableOpacity>
                
                <Text style={styles.settingValue}>{pomodorosUntilLongBreak}</Text>
                
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setPomodorosUntilLongBreak(pomodorosUntilLongBreak + 1)}
                >
                  <Ionicons name="add" size={20} color="#5D8BF4" />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                resetTimer();
                setSettingsModalVisible(false);
              }}
            >
              <Text style={styles.applyButtonText}>Apply Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  modeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 72,
    fontWeight: 'bold',
  },
  pomodoroCounter: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 20,
  },
  pomodoroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'white',
  },
  selectedTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    maxWidth: '80%',
  },
  selectedTaskText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  selectTaskButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  selectTaskText: {
    color: 'white',
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#5D8BF4',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  secondaryButton: {
    backgroundColor: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D8BF4',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
  },
  taskPomodoroCount: {
    fontSize: 14,
    color: '#888',
  },
  noTasksText: {
    textAlign: 'center',
    color: '#888',
    padding: 20,
  },
  closeButton: {
    backgroundColor: '#5D8BF4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 2,
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  settingButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#5D8BF4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PomodoroScreen;