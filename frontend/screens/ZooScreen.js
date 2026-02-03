import React, { useContext, useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Modal,
  Alert,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ZooContext } from '../contexts/ZooContext';
import { personalityEmojis } from '../utils/zooHelpers';
// Make sure this path is correct and 'animalImages' is exported correctly in animalAssets.js
import { animalImages } from '../assets/animalAssets'; 
import { zooBackgrounds } from '../assets/zooAssets';

const screenWidth = Dimensions.get('window').width;

const ZooScreen = ({ navigation }) => {
  const { 
    animals, 
    coins, 
    unlockAnimal, 
    feedAnimal,
    playWithAnimal,
    cleanAnimal,
    restAnimal,
    petAnimal 
  } = useContext(ZooContext);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [animalDetailModalVisible, setAnimalDetailModalVisible] = useState(false);
  const [newlyAddedAnimalId, setNewlyAddedAnimalId] = useState(null);
  
  // Animation values
  const newAnimalScale = useRef(new Animated.Value(0)).current;
  const newAnimalOpacity = useRef(new Animated.Value(0)).current;
  
  const unlockedAnimals = animals.filter(animal => animal.unlocked);
  const lockedAnimals = animals.filter(animal => !animal.unlocked);

  // Predefined positions for animals in the zoo area
  const animalPositions = {
    0: { top: 30, left: 40, zIndex: 2 },       // Rabbit position
    1: { top: 120, left: 200, zIndex: 1 },     // Turtle position
    2: { top: 80, left: 140, zIndex: 3 },      // Fox position
    3: { top: 20, left: 260, zIndex: 2 },      // Owl position
    4: { top: 140, left: 80, zIndex: 4 },      // Lion position 
    5: { top: 100, left: 220, zIndex: 5 }      // Elephant position
  };

  // Get happiness color based on happiness level
  const getHappinessColor = (happiness) => {
    if (happiness >= 80) return '#4CAF50';
    if (happiness >= 50) return '#FFC107';
    return '#F44336';
  };

  // --- SAFE IMAGE RENDERING HELPER (FIXED) ---
  const renderSafeAnimalImage = (animalName, style) => {
    // 1. Check if the 'animalImages' object itself exists
    if (!animalImages) {
      console.warn("ZooScreen: 'animalImages' is undefined. Check your imports.");
      return (
        <View style={[style, styles.missingImagePlaceholder]}>
          <Ionicons name="alert-circle" size={24} color="#F44336" />
        </View>
      );
    }

    // 2. Try to get the specific image
    const imageSource = animalImages[animalName];
    
    // 3. Render image if found
    if (imageSource) {
      return (
        <Image 
          source={imageSource} 
          style={style}
          resizeMode="contain"
        />
      );
    }
    
    // 4. Fallback if the specific animal name isn't found in the object
    return (
      <View style={[style, styles.missingImagePlaceholder]}>
        <Ionicons name="paw" size={style.width ? style.width * 0.5 : 24} color="#ccc" />
      </View>
    );
  };

  // Handle unlock animal
  const handleUnlockAnimal = (animal) => {
    if (coins >= animal.cost) {
      const success = unlockAnimal(animal.id);
      if (success) {
        setNewlyAddedAnimalId(animal.id);
        
        // Start animation
        newAnimalScale.setValue(0);
        newAnimalOpacity.setValue(0);
        
        Animated.parallel([
          Animated.spring(newAnimalScale, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true
          }),
          Animated.timing(newAnimalOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          })
        ]).start();
        
        // Clear the newly added animal id after animation
        setTimeout(() => {
          setNewlyAddedAnimalId(null);
        }, 3000);
        
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

  // Render a locked animal item for the shop
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

  // Render the zoo area with all unlocked animals
  const renderZooArea = () => {
    return (
      <View style={styles.zooAreaContainer}>
        {/* Zoo background elements */}
        {zooBackgrounds && (
            <>
                {zooBackgrounds.grass && <Image source={zooBackgrounds.grass} style={styles.zooBackground} resizeMode="repeat" />}
                {zooBackgrounds.tree1 && <Image source={zooBackgrounds.tree1} style={styles.zooTree1} resizeMode="contain" />}
                {zooBackgrounds.tree2 && <Image source={zooBackgrounds.tree2} style={styles.zooTree2} resizeMode="contain" />}
                {zooBackgrounds.pond && <Image source={zooBackgrounds.pond} style={styles.zooPond} resizeMode="contain" />}
                {zooBackgrounds.fence && <Image source={zooBackgrounds.fence} style={styles.zooFence} resizeMode="stretch" />}
            </>
        )}
        
        {/* Render each unlocked animal */}
        {unlockedAnimals.map((animal, index) => {
          const position = animalPositions[animals.findIndex(a => a.id === animal.id)] || 
                          { top: 30 + (index * 40), left: 50 + (index * 30), zIndex: 1 };
          
          const isNewlyAdded = animal.id === newlyAddedAnimalId;
          
          // If this is a newly added animal, apply animation
          if (isNewlyAdded) {
            return (
              <Animated.View 
                key={animal.id}
                style={[
                  styles.zooAnimalContainer,
                  position,
                  {
                    transform: [{ scale: newAnimalScale }],
                    opacity: newAnimalOpacity
                  }
                ]}
              >
                <TouchableOpacity onPress={() => viewAnimalDetails(animal)}>
                  {renderSafeAnimalImage(animal.name, styles.zooAnimalImage)}
                  <View style={[
                    styles.zooHappinessIndicator, 
                    { backgroundColor: getHappinessColor(animal.happiness) }
                  ]} />
                </TouchableOpacity>
              </Animated.View>
            );
          } else {
            // Regular render for already unlocked animals
            return (
              <View 
                key={animal.id}
                style={[styles.zooAnimalContainer, position]}
              >
                <TouchableOpacity onPress={() => viewAnimalDetails(animal)}>
                  {renderSafeAnimalImage(animal.name, styles.zooAnimalImage)}
                  <View style={[
                    styles.zooHappinessIndicator, 
                    { backgroundColor: getHappinessColor(animal.happiness) }
                  ]} />
                </TouchableOpacity>
              </View>
            );
          }
        })}
        
        {/* Empty zoo message if no animals */}
        {unlockedAnimals.length === 0 && (
          <View style={styles.emptyZooMessage}>
            <Ionicons name="paw" size={40} color="#ccc" />
            <Text style={styles.emptyZooText}>Your zoo is empty! Unlock animals below.</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Zoo Sanctuary</Text>
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
      
      {/* Zoo area */}
      {renderZooArea()}
      
      {/* Animal collection list */}
      <View style={styles.collectionContainer}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="paw" size={18} color="#5D8BF4" /> Your Collection ({unlockedAnimals.length}/{animals.length})
        </Text>
        <FlatList
          data={unlockedAnimals}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.collectionItem}
              onPress={() => viewAnimalDetails(item)}
            >
              {renderSafeAnimalImage(item.name, styles.collectionImage)}
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionName}>{item.name}</Text>
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
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionList}
        />
      </View>

      {/* Animal shop */}
      <Text style={styles.sectionTitle}>
        <Ionicons name="cart" size={18} color="#5D8BF4" /> Animal Shop
      </Text>
      {lockedAnimals.length > 0 ? (
        <FlatList
          data={lockedAnimals}
          renderItem={renderLockedAnimalItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.animalList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Great job! You've unlocked all available animals.
          </Text>
        </View>
      )}

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
              
              {renderSafeAnimalImage(selectedAnimal.name, styles.detailAnimalImage)}
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Happiness:</Text>
                  <View style={styles.detailHappinessBar}>
                    <View 
                      style={[
                        styles.detailHappinessBarFill, 
                        { 
                          width: `${selectedAnimal.stats ? selectedAnimal.stats.happiness : selectedAnimal.happiness}%`,
                          backgroundColor: getHappinessColor(selectedAnimal.stats ? selectedAnimal.stats.happiness : selectedAnimal.happiness)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[
                    styles.detailValue,
                    { color: getHappinessColor(selectedAnimal.stats ? selectedAnimal.stats.happiness : selectedAnimal.happiness) }
                  ]}>
                    {`${selectedAnimal.stats ? selectedAnimal.stats.happiness : selectedAnimal.happiness}%`}
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
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Animal Info:</Text>
                  <Text style={styles.detailDescription}>
                    {getAnimalDescription(selectedAnimal.name)}
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
                <Ionicons name="fast-food-outline" size={20} color="white" style={{marginRight: 6}} />
                <Text style={styles.feedButtonText}>Feed ({coins >= 5 ? '5 coins' : 'Need 5 coins'})</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.careButton}
                onPress={() => {
                  setAnimalDetailModalVisible(false);
                  navigation.navigate('AnimalCare', { animalId: selectedAnimal.id });
                }}
              >
                <Text style={styles.careButtonText}>Take Care</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </ScrollView>
  );
};

// Helper function to get animal descriptions
const getAnimalDescription = (animalName) => {
  const descriptions = {
    'Rabbit': 'A quick and fluffy friend who loves carrots. Feeding it will make it hop with joy!',
    'Turtle': 'A slow but steady companion. It enjoys leafy greens and basking in the sun.',
    'Fox': 'A clever and curious animal with a beautiful coat. It likes to play and explore.',
    'Owl': 'A wise night bird with excellent hunting skills. Keep it happy with regular feeding.',
    'Lion': 'The king of the zoo! Majestic and powerful, it enjoys meat and afternoon naps.',
    'Elephant': 'The gentle giant of your zoo with a great memory. It loves fruits and taking baths!',
  };
  
  return descriptions[animalName] || 'A wonderful animal for your zoo!';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
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
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  // Zoo area styles
  zooAreaContainer: {
    height: 300,
    marginHorizontal: 15,
    marginVertical: 15,
    backgroundColor: '#D7F5D3',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#A3D39C',
    overflow: 'hidden',
    position: 'relative',
  },
  zooBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  zooTree1: {
    position: 'absolute',
    width: 80,
    height: 100,
    top: 10,
    left: 10,
  },
  zooTree2: {
    position: 'absolute',
    width: 70,
    height: 90,
    bottom: 20,
    right: 20,
  },
  zooPond: {
    position: 'absolute',
    width: 100,
    height: 60,
    bottom: 30,
    left: 50,
  },
  zooFence: {
    position: 'absolute',
    width: '100%',
    height: 30,
    bottom: 0,
  },
  zooAnimalContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zooAnimalImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  // ADDED: Style for the fallback placeholder
  missingImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    opacity: 0.7
  },
  zooHappinessIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  emptyZooMessage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  emptyZooText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    padding: 20,
  },
  // Collection styles
  collectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  collectionList: {
    paddingHorizontal: 10,
  },
  collectionItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    width: 170,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  collectionImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    resizeMode: 'contain',
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  // Shop styles
  animalList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  animalCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  lockedAnimalCard: {
    opacity: 0.9,
  },
  lockedImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 40,
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
  // Modal styles
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
    width: 120,
    height: 120,
    alignSelf: 'center',
    resizeMode: 'contain',
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
  detailDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  feedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  careButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  careButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailProgressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  detailProgressFill: {
    height: '100%',
    backgroundColor: '#5D8BF4',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5D8BF4',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default ZooScreen;