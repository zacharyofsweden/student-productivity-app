import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ZooContext } from '../contexts/ZooContext';
import { personalityDialog, personalityEmojis } from '../utils/zooHelpers';
import { animalImages } from '../assets/animalAssets';
const { width, height } = Dimensions.get('window');


const AnimalCareScreen = ({ route }) => {
  const { animalId } = route.params;
  const {
    animals,
    coins,
    feedAnimal,
    playWithAnimal,
    cleanAnimal,
    restAnimal,
    petAnimal
  } = useContext(ZooContext);

  const animal = animals.find(a => a.id === animalId);

  const getStatColor = (value) => {
    if (value >= 80) return '#4CAF50';
    if (value >= 50) return '#FFC107';
    if (value >= 30) return '#FF9800';
    return '#F44336';
  };

  const getTimeSince = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  const getCountdown = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Done';

    const mins = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
  };

  const handleFeed = () => {
    if (coins >= 5) {
      feedAnimal(animal.id);
    } else {
      Alert.alert('Not Enough Coins', 'You need 5 coins to feed your animal.');
    }
  };

  const handlePlay = () => {
    if (coins >= 3) {
      playWithAnimal(animal.id);
    } else {
      Alert.alert('Not Enough Coins', 'You need 3 coins to play with your animal.');
    }
  };

  const handleClean = () => {
    if (coins >= 4) {
      cleanAnimal(animal.id);
    } else {
      Alert.alert('Not Enough Coins', 'You need 4 coins to clean your animal.');
    }
  };

  const handleRest = () => {
    restAnimal(animal.id);
  };

  const handlePet = () => {
    petAnimal(animal.id);
  };

  if (!animal || !animal.stats || !animal.personality) {
    return (
      <View style={styles.container}>
        <Text>Loading animal data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.animalName}>{animal.name}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {animal.level}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>Personality: </Text>
          <Text style={{ fontSize: 18 }}>
            {animal.personality} {personalityEmojis[animal.personality]}
          </Text>
        </View>
      </View>

      <View style={styles.coinContainer}>
        <Ionicons name="cash-outline" size={20} color="#FFD700" />
        <Text style={styles.coinText}>{coins} coins</Text>
      </View>

      <TouchableOpacity onPress={handlePet} style={styles.animalImageWrapper}>
        <Image
          source={animalImages[animal.name]}
          style={styles.animalImage}
        />
        <Text style={styles.tapToPet}>Tap to pet!</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Stats</Text>

      <View style={styles.statBlock}>
        <Text>Hunger</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${animal.stats.hunger}%`, backgroundColor: getStatColor(animal.stats.hunger) }]} />
        </View>
        <Text>{animal.stats.hunger}%</Text>
      </View>

      <View style={styles.statBlock}>
        <Text>Energy</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${animal.stats.energy}%`, backgroundColor: getStatColor(animal.stats.energy) }]} />
        </View>
        <Text>{animal.stats.energy}%</Text>
      </View>

      <View style={styles.statBlock}>
        <Text>Happiness</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${animal.stats.happiness}%`, backgroundColor: getStatColor(animal.stats.happiness) }]} />
        </View>
        <Text>{animal.stats.happiness}%</Text>
      </View>

      <Text style={{ fontSize: 16, marginTop: 10 }}>
        Status: {animal.status} {animal.animation === 'zzz' ? '💤' : animal.animation === 'sitting' ? '🪑' : ''}
      </Text>
      {animal.statusEndTime && (
        <Text style={{ fontSize: 14, color: '#666' }}>
          Ends in: {getCountdown(animal.statusEndTime)}
        </Text>
      )}
      <Text style={{ fontStyle: 'italic', fontSize: 14, marginTop: 6 }}>
        {personalityDialog[animal.personality]?.[animal.status] || "Just hanging out..."}
      </Text>

      <Text style={styles.sectionTitle}>Last Activity</Text>
      <Text>Fed: {getTimeSince(animal.lastFed)}</Text>
      <Text>Cleaned: {getTimeSince(animal.lastCleaned)}</Text>
      <Text>Played: {getTimeSince(animal.lastPlayed)}</Text>
      <Text>Rested: {getTimeSince(animal.lastSlept)}</Text>

      <Text style={styles.sectionTitle}>Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={handleFeed}>
          <Text style={styles.actionText}>Feed (5)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handlePlay}>
          <Text style={styles.actionText}>Play (3)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleClean}>
          <Text style={styles.actionText}>Clean (4)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleRest}>
          <Text style={styles.actionText}>Rest</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  animalName: { fontSize: 24, fontWeight: 'bold' },
  levelBadge: { backgroundColor: '#5D8BF4', padding: 6, borderRadius: 12 },
  levelText: { color: 'white', fontWeight: 'bold' },
  coinContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  coinText: { marginLeft: 8, fontSize: 16 },
  animalImageWrapper: { alignItems: 'center', marginVertical: 20 },
  animalImage: { width: 120, height: 120, resizeMode: 'contain' },
  tapToPet: { marginTop: 6, fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  statBlock: { marginVertical: 10 },
  progressBar: { height: 10, width: '100%', backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%' },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 10 },
  actionButton: { backgroundColor: '#5D8BF4', padding: 10, borderRadius: 8, margin: 5 },
  actionText: { color: 'white', fontWeight: 'bold' },
});

export default AnimalCareScreen;
