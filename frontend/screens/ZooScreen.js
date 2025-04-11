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
  'Rabbit': require('../assets/placeholder-rabbit.png'),
  'Turtle': require('../assets/placeholder-turtle.png'),
  'Fox': require('../assets/placeholder-fox.png'),
  'Owl': require('../assets/placeholder-owl.png'),
  'Lion': require('../assets/placeholder-lion.png'),
  'Elephant': require('../assets/placeholder-elephant.png'),
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