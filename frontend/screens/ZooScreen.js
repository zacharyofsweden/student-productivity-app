import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ZooContext } from '../contexts/ZooContext';

// Placeholder images for animals
const animalImages = {
  'Rabbit': require('../assets/8-rabbit-png-image-190242412.png'),
  'Turtle': require('../assets/purepng.com-turtleshellanimalseaoceanreptileturtletortoise-981524667121fvwwy-498712893.png'),
  'Fox': require('../assets/purepng.com-foxanimalsfox-9815246712019smh9-1625913908.png'),
  'Owl': require('../assets/owl-png-eagle-owl-png-transparent-image-950-2742925125.png'),
  'Lion': require('../assets/lion_PNG23270-175017349.png'),
  'Elephant': require('../assets/African-Elephant-PNG-File-668663986.png'),
};


const ZooScreen = () => {
  const { animals, coins, unlockAnimal, feedAnimal } = useContext(ZooContext);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [animalDetailModalVisible, setAnimalDetailModalVisible] = useState(false);

  const unlockedAnimals = animals.filter(animal => animal.unlocked);
  const lockedAnimals = animals.filter(animal => !animal.unlocked);

  // Get happiness color based on happiness level
  const getHappinessColor = (happiness) => {
    if (happiness >= 80) return '#4CAF50';
    if (happiness >= 50) return '#FFC107';
    return '#F44336';
  };

  // Handle unlock animal
  const handleUnlockAnimal = (animal) => {
    if (coins >= animal.cost) {
      const success = unlockAnimal(animal.id);
      if (success) {
        Alert.alert(
          'Animal Unlocked!',
          `You've unlocked a ${animal.name} for your zoo!`,
          [{ text: 'Great!', style: 'default' }]
        );
      }
    } else {
      Alert.alert(
        'Not Enough Coins',
        `You need ${animal.cost - coins} more coins to unlock this animal.`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // Handle feed animal
  const handleFeedAnimal = (animal) => {
    if (coins >= 5) {
      const success = feedAnimal(animal.id);
      if (!success) {
        Alert.alert(
          'Not Enough Coins',
          'You need 5 coins to feed an animal.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } else {
      Alert.alert(
        'Not Enough Coins',
        'You need 5 coins to feed an animal.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // View animal details
  const viewAnimalDetails = (animal) => {
    setSelectedAnimal(animal);
    setAnimalDetailModalVisible(true);
  };

  // Render an unlocked animal item
  const renderUnlockedAnimalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.animalCard}
      onPress={() => viewAnimalDetails(item)}
    >
      <View style={styles.animalImageContainer}>
        <Image 
          source={animalImages[item.name]} 
          style={styles.animalImage}
          resizeMode="contain"
        />
        <View style={[
          styles.happinessIndicator, 
          { backgroundColor: getHappinessColor(item.happiness) }
        ]} />
      </View>
      <Text style={styles.animalName}>{item.name}</Text>
      <View style={styles.happinessBar}>
        <View 
          style={[
            styles.happinessBarFill, 
            { 
              width: `${item.happiness}%`,
              backgroundColor: getHappinessColor(item.happiness)
            }
          ]} 
        />
      </View>
      <Text style={styles.happinessText}>{`Happiness: ${item.happiness}%`}</Text>
    </TouchableOpacity>
  );

  // Render a locked animal item
  const renderLockedAnimalItem = ({ item }) => (
    <View style={[styles.animalCard, styles.lockedAnimalCard]}>
      <View style={styles.lockedImageContainer}>
        <Ionicons name="lock-closed" size={40} color="#ccc" />
      </View>
      <Text style={styles.animalName}>{item.name}</Text>
      <Text style={styles.costText}>{`${item.cost} coins`}</Text>
      <TouchableOpacity 
        style={[
          styles.unlockButton,
          coins < item.cost && styles.disabledButton
        ]}
        onPress={() => handleUnlockAnimal(item)}
        disabled={coins < item.cost}
      >
        <Text style={styles.unlockButtonText}>Unlock</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Zoo</Text>
        <View style={styles.coinContainer}>
          <Ionicons name="cash-outline" size={20} color="#FFD700" />
          <Text style={styles.coinText}>{coins}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Complete tasks and focus sessions to earn coins.
          Unlock animals for your zoo and keep them happy by feeding them!
        </Text>
      </View>
      
      {unlockedAnimals.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Your Animals</Text>
          <FlatList
            data={unlockedAnimals}
            renderItem={renderUnlockedAnimalItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.animalList}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="paw" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            No animals yet! Unlock your first animal below.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Available Animals</Text>
      <FlatList
        data={lockedAnimals}
        renderItem={renderLockedAnimalItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.animalList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Great job! You've unlocked all available animals.
            </Text>
          </View>
        }
      />

      {/* Animal Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={animalDetailModalVisible}
        onRequestClose={() => setAnimalDetailModalVisible(false)}
      >
        {selectedAnimal && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedAnimal.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setAnimalDetailModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <Image 
                source={animalImages[selectedAnimal.name]} 
                style={styles.detailAnimalImage}
                resizeMode="contain"
              />
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Happiness:</Text>
                  <View style={styles.detailHappinessBar}>
                    <View 
                      style={[
                        styles.detailHappinessBarFill, 
                        { 
                          width: `${selectedAnimal.happiness}%`,
                          backgroundColor: getHappinessColor(selectedAnimal.happiness)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[
                    styles.detailValue,
                    { color: getHappinessColor(selectedAnimal.happiness) }
                  ]}>
                    {`${selectedAnimal.happiness}%`}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Last Fed:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAnimal.lastFed 
                      ? new Date(selectedAnimal.lastFed).toLocaleString() 
                      : 'Never'}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.feedButton,
                  coins < 5 && styles.disabledButton
                ]}
                onPress={() => {
                  handleFeedAnimal(selectedAnimal);
                  setAnimalDetailModalVisible(false);
                }}
                disabled={coins < 5}
              >
                <Text style={styles.feedButtonText}>Feed ({coins >= 5 ? '5 coins' : 'Need 5 coins'})</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  coinText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  animalList: {
    paddingBottom: 15,
  },
  animalCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lockedAnimalCard: {
    opacity: 0.7,
  },
  animalImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animalImage: {
    width: '100%',
    height: '100%',
  },
  happinessIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  lockedImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  animalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  happinessBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  happinessBarFill: {
    height: '100%',
  },
  happinessText: {
    fontSize: 12,
    color: '#666',
  },
  costText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  unlockButton: {
    backgroundColor: '#5D8BF4',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  unlockButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  detailAnimalImage: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
  detailHappinessBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  detailHappinessBarFill: {
    height: '100%',
  },
  feedButton: {
    backgroundColor: '#5D8BF4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  feedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default ZooScreen;