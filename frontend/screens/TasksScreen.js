import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskContext } from '../contexts/TaskContext';

const TasksScreen = () => {
  const { tasks, addTask, updateTask, deleteTask, completeTask } = useContext(TaskContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      if (editingTask) {
        updateTask(editingTask.id, {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
        });
      } else {
        addTask({
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
        });
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setEditingTask(null);
    setModalVisible(false);
  };

  const handleEditTask = (task) => {
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskPriority(task.priority || 'medium');
    setEditingTask(task);
    setModalVisible(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#E57373';
      case 'medium':
        return '#FFD54F';
      case 'low':
        return '#81C784';
      default:
        return '#FFD54F';
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.completedTask]}>
      <TouchableOpacity 
        style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} 
        onPress={() => completeTask(item.id)}
      >
        {item.completed && <Ionicons name="checkmark" size={18} color="white" />}
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={[styles.taskDescription, item.completed && styles.completedText]}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.taskMeta}>
          <Text style={styles.taskPomodoroCount}>
            <Ionicons name="timer-outline" size={14} /> {item.pomodoroSessions}
          </Text>
        </View>
      </View>
      
      <View style={styles.taskActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleEditTask(item)}
          disabled={item.completed}
        >
          <Ionicons name="pencil-outline" size={20} color={item.completed ? '#ccc' : '#5D8BF4'} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => deleteTask(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#E57373" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks.sort((a, b) => a.completed - b.completed)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
            />
            
            <Text style={styles.label}>Priority:</Text>
            <View style={styles.prioritySelector}>
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  taskPriority === 'low' && styles.selectedPriority,
                  { backgroundColor: getPriorityColor('low') }
                ]}
                onPress={() => setTaskPriority('low')}
              >
                <Text style={styles.priorityText}>Low</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  taskPriority === 'medium' && styles.selectedPriority,
                  { backgroundColor: getPriorityColor('medium') }
                ]}
                onPress={() => setTaskPriority('medium')}
              >
                <Text style={styles.priorityText}>Medium</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  taskPriority === 'high' && styles.selectedPriority,
                  { backgroundColor: getPriorityColor('high') }
                ]}
                onPress={() => setTaskPriority('high')}
              >
                <Text style={styles.priorityText}>High</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddTask}
              >
                <Text style={styles.buttonText}>
                  {editingTask ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    opacity: 0.7,
  },
  priorityIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskPomodoroCount: {
    fontSize: 12,
    color: '#888',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#5D8BF4',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priorityOption: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedPriority: {
    borderWidth: 2,
    borderColor: '#333',
  },
  priorityText: {
    fontWeight: '500',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#5D8BF4',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  }
});

export default TasksScreen;