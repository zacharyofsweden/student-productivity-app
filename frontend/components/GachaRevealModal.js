import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RARITY_LEVELS } from '../assets/animalAssets';

const GachaRevealModal = ({ visible, animal, onClose }) => {
  const [phase, setPhase] = useState('shaking'); // phases: shaking, revealed
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setPhase('shaking');
      startShake();
    }
  }, [visible]);

  const startShake = () => {
    // Shake loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]),
      { iterations: 10 } // Shake for about 3 seconds (10 * 300ms)
    ).start(() => revealAnimal());
  };

  const revealAnimal = () => {
    setPhase('revealed');
    // Pop up animation for the animal
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getRarityColor = () => {
    if (!animal) return '#fff';
    // Find the color from your constants
    const rarity = Object.values(RARITY_LEVELS).find(r => r.id === animal.rarity);
    return rarity ? rarity.color : '#ccc';
  };

  if (!visible || !animal) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          
          {phase === 'shaking' && (
            <View>
              <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <Ionicons name="gift" size={120} color="#FFD700" />
              </Animated.View>
              <Text style={styles.openingText}>Opening Pack...</Text>
            </View>
          )}

          {phase === 'revealed' && (
            <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
              <Text style={styles.congratsText}>NEW COMPANION!</Text>
              
              {/* Rarity Glow Background */}
              <View style={[styles.glow, { backgroundColor: getRarityColor() }]}>
                <Image source={animal.image} style={styles.animalImage} />
              </View>

              <Text style={styles.animalName}>{animal.name}</Text>
              <Text style={[styles.rarityBadge, { color: getRarityColor() }]}>
                {animal.rarity.toUpperCase()}
              </Text>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Keep!</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: 300,
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 20,
    alignItems: 'center',
  },
  openingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  congratsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  glow: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  animalImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  animalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  rarityBadge: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GachaRevealModal;