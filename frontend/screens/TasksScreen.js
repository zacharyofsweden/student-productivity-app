import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskContext } from '../contexts/TaskContext';

const TasksScreen = () => {
  const { 
    tasks, 
    filteredTasks,
    filters,
    addTask, 
    updateTask, 
    deleteTask, 
    completeTask, 
    applyFilters,
    resetFilters 
  } = useContext(TaskContext);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Task form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [taskTheme, setTaskTheme] = useState('');
  const [taskTags, setTaskTags] = useState('');
  const [taskType, setTaskType] = useState('one-time');
  const [countdownTimer, setCountdownTimer] = useState('');
  
  // Filter states
  const [filterTheme, setFilterTheme] = useState(filters.theme || '');
  const [filterTags, setFilterTags] = useState(filters.tags.join(', ') || '');
  const [filterUrgency, setFilterUrgency] = useState(filters.urgency || '');
  const [filterTaskType, setFilterTaskType] = useState(filters.taskType || '');

  // All available themes for dropdown
  const themes = ['Work', 'Personal', 'Health', 'Education', 'Errands', 'Other'];
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'No due date';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  // Format remaining time for countdown
  const formatRemainingTime = (dueDate, countdownMinutes) => {
    if (!dueDate) return null;
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    
    if (diffMs <= 0) return 'Overdue';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h left`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours}h ${diffMinutes}m left`;
    }
  };

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      const taskData = {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        dueDate: taskDueDate,
        theme: taskTheme,
        tags: taskTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        taskType: taskType,
        countdownTimer: countdownTimer ? parseInt(countdownTimer) : null,
      };
      
      if (editingTask) {
        updateTask(editingTask.id, taskData);
      } else {
        addTask(taskData);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskDueDate(null);
    setTaskTheme('');
    setTaskTags('');
    setTaskType('one-time');
    setCountdownTimer('');
    setEditingTask(null);
    setModalVisible(false);
  };

  const handleEditTask = (task) => {
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskPriority(task.priority || 'medium');
    setTaskDueDate(task.dueDate);
    setTaskTheme(task.theme || '');
    setTaskTags((task.tags || []).join(', '));
    setTaskType(task.taskType || 'one-time');
    setCountdownTimer(task.countdownTimer ? task.countdownTimer.toString() : '');
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTaskDueDate(selectedDate.toISOString());
    }
  };

  const applyTaskFilters = () => {
    applyFilters({
      theme: filterTheme || null,
      tags: filterTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      urgency: filterUrgency || null,
      taskType: filterTaskType || null,
    });
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    resetFilters();
    setFilterTheme('');
    setFilterTags('');
    setFilterUrgency('');
    setFilterTaskType('');
    setFilterModalVisible(false);
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
        
        <View style={styles.taskMetaContainer}>
          {item.theme && (
            <View style={styles.tagContainer}>
              <Text style={styles.themeTag}>{item.theme}</Text>
            </View>
          )}
          
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>#{tag}</Text>
              ))}
            </View>
          )}
          
          {item.dueDate && (
            <View style={styles.dueDateContainer}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={styles.dueDateText}>{formatDate(item.dueDate)}</Text>
            </View>
          )}
          
          {item.dueDate && (
            <View style={styles.countdownContainer}>
              <Ionicons name="time-outline" size={14} color="#888" />
              <Text style={styles.countdownText}>
                {formatRemainingTime(item.dueDate, item.countdownTimer)}
              </Text>
            </View>
          )}
          
          <View style={styles.taskMeta}>
            <Text style={styles.taskPomodoroCount}>
              <Ionicons name="timer-outline" size={14} /> {item.pomodoroSessions}
            </Text>
          </View>
          
          <Text style={styles.taskTypeLabel}>{item.taskType}</Text>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="#5D8BF4" />
          {Object.values(filters).some(f => f !== null && (Array.isArray(f) ? f.length > 0 : true)) && (
            <View style={styles.filterActiveDot} />
          )}
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredTasks.sort((a, b) => a.completed - b.completed)}
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

      {/* Task Add/Edit Modal */}
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
          <ScrollView style={styles.modalContent}>
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
            
            <Text style={styles.label}>Theme:</Text>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {themes.map((theme) => (
                  <TouchableOpacity
                    key={theme}
                    style={[
                      styles.themeOption,
                      taskTheme === theme && styles.selectedTheme
                    ]}
                    onPress={() => setTaskTheme(theme)}
                  >
                    <Text style={styles.themeText}>{theme}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <Text style={styles.label}>Tags (comma separated):</Text>
            <TextInput
              style={styles.input}
              placeholder="work, important, meeting"
              value={taskTags}
              onChangeText={setTaskTags}
            />
            
            <Text style={styles.label}>Task Type:</Text>
            <View style={styles.taskTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  taskType === 'daily' && styles.selectedType
                ]}
                onPress={() => setTaskType('daily')}
              >
                <Text style={styles.typeText}>Daily</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  taskType === 'weekly' && styles.selectedType
                ]}
                onPress={() => setTaskType('weekly')}
              >
                <Text style={styles.typeText}>Weekly</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  taskType === 'one-time' && styles.selectedType
                ]}
                onPress={() => setTaskType('one-time')}
              >
                <Text style={styles.typeText}>One-time</Text>
              </TouchableOpacity>
            </View>
            
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
            
            <Text style={styles.label}>Due Date:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {taskDueDate ? formatDate(taskDueDate) : 'Select a due date'}
              </Text>
              <Ionicons name="calendar" size={20} color="#5D8BF4" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={taskDueDate ? new Date(taskDueDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            
            <Text style={styles.label}>Countdown Timer (minutes):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter minutes"
              value={countdownTimer}
              onChangeText={setCountdownTimer}
              keyboardType="numeric"
            />
            
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
                <Text style={[styles.buttonText, styles.saveButtonText]}>
                  {editingTask ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Tasks</Text>
            
            <Text style={styles.label}>Theme:</Text>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['', ...themes].map((theme) => (
                  <TouchableOpacity
                    key={theme || 'all'}
                    style={[
                      styles.themeOption,
                      filterTheme === theme && styles.selectedTheme
                    ]}
                    onPress={() => setFilterTheme(theme)}
                  >
                    <Text style={styles.themeText}>{theme || 'All'}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <Text style={styles.label}>Tags (comma separated):</Text>
            <TextInput
              style={styles.input}
              placeholder="Filter by tags"
              value={filterTags}
              onChangeText={setFilterTags}
            />
            
            <Text style={styles.label}>Urgency:</Text>
            <View style={styles.prioritySelector}>
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  filterUrgency === '' && styles.selectedPriority,
                  { backgroundColor: '#ccc' }
                ]}
                onPress={() => setFilterUrgency('')}
              >
                <Text style={styles.priorityText}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  filterUrgency === 'low' && styles.selectedPriority,
                  { backgroundColor: getPriorityColor('low') }
                ]}
                onPress={() => setFilterUrgency('low')}
              >
                <Text style={styles.priorityText}>Low</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  filterUrgency === 'medium' && styles.selectedPriority,
                  { backgroundColor: getPriorityColor('medium') }
                ]}
                onPress={() => setFilterUrgency('medium')}
              >
                <Text style={styles.priorityText}>Medium</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.priorityOption,
                  filterUrgency === 'high' && styles.selectedPriority,
                  { backgroundColor: getPriorityColor('high') }
                ]}
                onPress={() => setFilterUrgency('high')}
              >
                <Text style={styles.priorityText}>High</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.label}>Task Type:</Text>
            <View style={styles.taskTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  filterTaskType === '' && styles.selectedType
                ]}
                onPress={() => setFilterTaskType('')}
              >
                <Text style={styles.typeText}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  filterTaskType === 'daily' && styles.selectedType
                ]}
                onPress={() => setFilterTaskType('daily')}
              >
                <Text style={styles.typeText}>Daily</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  filterTaskType === 'weekly' && styles.selectedType
                ]}
                onPress={() => setFilterTaskType('weekly')}
              >
                <Text style={styles.typeText}>Weekly</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  filterTaskType === 'one-time' && styles.selectedType
                ]}
                onPress={() => setFilterTaskType('one-time')}
              >
                <Text style={styles.typeText}>One-time</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={clearFilters}
              >
                <Text style={styles.buttonText}>Clear Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={applyTaskFilters}
              >
                <Text style={[styles.buttonText, styles.saveButtonText]}>Apply</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    padding: 5,
    position: 'relative',
  },
  filterActiveDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E57373',
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
  taskMetaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 5,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  taskPomodoroCount: {
    fontSize: 12,
    color: '#888',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 6,
    marginBottom: 5,
  },
  dueDateText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 3,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1f5fe',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 6,
    marginBottom: 5,
  },
  countdownText: {
    fontSize: 11,
    color: '#0288d1',
    marginLeft: 3,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  themeTag: {
    fontSize: 11,
    backgroundColor: '#E1BEE7',
    color: '#6A1B9A',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  tag: {
    fontSize: 11,
    backgroundColor: '#E8F5E9',
    color: '#388E3C',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 6,
  },
  taskTypeLabel: {
    fontSize: 11,
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 6,
    marginBottom: 5,
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
    maxHeight: '80%',
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
  pickerContainer: {
    marginBottom: 15,
  },
  themeOption: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
  },
  selectedTheme: {
    backgroundColor: '#D1C4E9',
    borderWidth: 1,
    borderColor: '#7E57C2',
  },
  themeText: {
    fontWeight: '500',
    color: '#333',
  },
  taskTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeOption: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedType: {
    backgroundColor: '#BBDEFB',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  typeText: {
    fontWeight: '500',
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
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#555',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  clearButton: {
    backgroundColor: '#FFCDD2',
  },
  saveButton: {
    backgroundColor: '#5D8BF4',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  saveButtonText: {
    color: 'white',
  }
});

export default TasksScreen;