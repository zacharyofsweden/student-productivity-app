import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// FAQ data
const faqData = [
  {
    id: '1',
    question: 'What is the Pomodoro Technique?',
    answer: 'The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are called "pomodoros". After completing a set number of pomodoros, you take a longer break. In ZooFocus, you earn coins for completed pomodoros which you can use to build your virtual zoo!'
  },
  {
    id: '2',
    question: 'How do I earn coins?',
    answer: 'You earn coins by completing tasks and finishing Pomodoro sessions. Each completed task earns you 5 coins, and each completed Pomodoro session earns you 3 coins. You can use these coins to unlock new animals for your zoo.'
  },
  {
    id: '3',
    question: 'How do I keep my animals happy?',
    answer: 'Animals need to be fed regularly to maintain their happiness. You can feed an animal for 5 coins. If you neglect your animals for too long, their happiness will decrease over time.'
  },
  {
    id: '4',
    question: 'How do I customize my Pomodoro timer?',
    answer: 'You can customize your Pomodoro timer by going to the Pomodoro screen and tapping the settings icon in the top right corner. From there, you can adjust the focus duration, short break duration, long break duration, and the number of pomodoros until a long break.'
  },
  {
    id: '5',
    question: 'Can I reset my progress?',
    answer: 'Currently, there\'s no built-in option to reset all progress. However, you can delete individual tasks and your coins will accumulate over time for new animal purchases.'
  },
];

// Help categories
const helpCategories = [
  {
    id: 'basics',
    title: 'App Basics',
    icon: 'information-circle',
    topics: [
      {
        id: 'navigation',
        title: 'Navigating the App',
        content: 'ZooFocus has four main tabs: Home, Tasks, Pomodoro, and Zoo.\n\n• Home: Displays your productivity summary and app information.\n• Tasks: Manage your to-do list with priorities and descriptions.\n• Pomodoro: Use the timer to focus on tasks and earn coins.\n• Zoo: Spend your earned coins on virtual animals and take care of them.'
      },
      {
        id: 'getting-started',
        title: 'Getting Started',
        content: '1. Create tasks in the Tasks tab\n2. Select a task and start a Pomodoro timer\n3. Complete tasks to earn coins\n4. Spend coins in the Zoo tab to unlock animals\n5. Feed your animals to keep them happy'
      }
    ]
  },
  {
    id: 'tasks',
    title: 'Tasks',
    icon: 'list',
    topics: [
      {
        id: 'creating-tasks',
        title: 'Creating Tasks',
        content: 'To create a new task:\n\n1. Go to the Tasks tab\n2. Tap the + button in the bottom right\n3. Enter a task title (required)\n4. Add an optional description\n5. Select a priority level (Low, Medium, High)\n6. Tap "Add" to save your task'
      },
      {
        id: 'managing-tasks',
        title: 'Managing Tasks',
        content: 'Task Management:\n\n• Complete a task by tapping the circle next to the task title\n• Edit a task by tapping the pencil icon\n• Delete a task by tapping the trash icon\n• Tasks are sorted with incomplete tasks at the top'
      }
    ]
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro Timer',
    icon: 'timer',
    topics: [
      {
        id: 'using-pomodoro',
        title: 'Using the Pomodoro Timer',
        content: 'To use the Pomodoro timer:\n\n1. Go to the Pomodoro tab\n2. Select a task to focus on\n3. Tap the play button to start the timer\n4. Work until the timer ends\n5. Take a break when prompted\n6. Repeat the cycle'
      },
      {
        id: 'timer-settings',
        title: 'Timer Settings',
        content: 'You can customize the timer settings by tapping the gear icon in the top right corner of the Pomodoro screen. Adjustable settings include:\n\n• Focus Duration: Length of focus sessions (default 25 minutes)\n• Short Break: Length of short breaks (default 5 minutes)\n• Long Break: Length of longer breaks (default 15 minutes)\n• Pomodoros until long break: Number of focus sessions before a long break (default 4)'
      }
    ]
  },
  {
    id: 'zoo',
    title: 'Virtual Zoo',
    icon: 'paw',
    topics: [
      {
        id: 'unlocking-animals',
        title: 'Unlocking Animals',
        content: 'To unlock new animals:\n\n1. Go to the Zoo tab\n2. Browse the available animals\n3. When you have enough coins, tap "Unlock" on the animal you want\n4. The animal will be added to your zoo collection'
      },
      {
        id: 'animal-care',
        title: 'Taking Care of Animals',
        content: 'Animal care:\n\n1. Tap on an unlocked animal to view details\n2. Monitor its happiness level (shown as a percentage)\n3. Feed the animal using the "Feed" button (costs 5 coins)\n4. Animals need regular feeding to maintain happiness\n5. Higher happiness is indicated by green, medium by yellow, and low by red colors'
      }
    ]
  }
];

const HelpScreen = ({ navigation }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicModalVisible, setTopicModalVisible] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('basics');

  const toggleFaqExpand = (id) => {
    setExpandedFaqs(prevState => 
      prevState.includes(id) 
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const openTopic = (topic) => {
    setSelectedTopic(topic);
    setTopicModalVisible(true);
  };

  const renderCategories = () => {
    return helpCategories.map(category => (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryTab,
          activeCategory === category.id && styles.activeCategory
        ]}
        onPress={() => setActiveCategory(category.id)}
      >
        <Ionicons 
          name={category.icon} 
          size={20} 
          color={activeCategory === category.id ? '#5D8BF4' : '#666'} 
        />
        <Text style={[
          styles.categoryText,
          activeCategory === category.id && styles.activeCategoryText
        ]}>
          {category.title}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderTopics = () => {
    const activeTopics = helpCategories.find(cat => cat.id === activeCategory)?.topics || [];
    
    return activeTopics.map(topic => (
      <TouchableOpacity
        key={topic.id}
        style={styles.topicItem}
        onPress={() => openTopic(topic)}
      >
        <Text style={styles.topicTitle}>{topic.title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>How can we help you?</Text>
        
        <View style={styles.categoryContainer}>
          {renderCategories()}
        </View>
        
        <View style={styles.topicsContainer}>
          <Text style={styles.topicsTitle}>
            {helpCategories.find(cat => cat.id === activeCategory)?.title || ''} Topics
          </Text>
          {renderTopics()}
        </View>
        
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {faqData.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.faqItem}
            onPress={() => toggleFaqExpand(item.id)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Ionicons 
                name={expandedFaqs.includes(item.id) ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            
            {expandedFaqs.includes(item.id) && (
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
        
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="mail" size={20} color="white" />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Topic Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={topicModalVisible}
        onRequestClose={() => setTopicModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTopic?.title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setTopicModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.topicContent}>{selectedTopic?.content}</Text>
            </ScrollView>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setTopicModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activeCategory: {
    backgroundColor: '#E3F2FD',
    borderColor: '#5D8BF4',
  },
  categoryText: {
    marginLeft: 5,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#5D8BF4',
  },
  topicsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  topicsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  topicTitle: {
    fontSize: 15,
    color: '#333',
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  supportSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5D8BF4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  supportButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    marginBottom: 15,
  },
  topicContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  modalButton: {
    alignSelf: 'center',
    backgroundColor: '#5D8BF4',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpScreen;