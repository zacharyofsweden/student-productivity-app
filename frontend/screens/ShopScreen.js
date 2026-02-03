import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { ZooContext } from '../contexts/ZooContext';
import { PACK_TYPES } from '../assets/animalAssets';
import GachaRevealModal from '../components/GachaRevealModal';
import { Ionicons } from '@expo/vector-icons';

const ShopScreen = () => {
  const { coins, buyPack } = useContext(ZooContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [wonAnimal, setWonAnimal] = useState(null);

  const handleBuy = async (packId) => {
    // 1. Attempt to buy
    const animal = await buyPack(packId); // Make sure buyPack is updated in ZooContext to return the animal!
    
    // 2. If successful, trigger animation
    if (animal) {
      setWonAnimal(animal);
      setModalVisible(true);
    }
  };

  const renderPack = ({ item }) => {
    const pack = item; // item is the value object from PACK_TYPES
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleBuy(pack.id)}>
        <View style={styles.iconContainer}>
            {/* You can replace this with different colored icons based on pack type */}
            <Ionicons name="cube" size={60} color={pack.id === 'premium' ? '#FFD700' : '#8D6E63'} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.packName}>{pack.name}</Text>
          <Text style={styles.packDesc}>Contains random {pack.id} animals</Text>
          <View style={styles.priceTag}>
             <Ionicons name="logo-bitcoin" size={16} color="#FFD700" />
             <Text style={styles.priceText}>{pack.cost}</Text>
          </View>
        </View>
        <View style={styles.buyButton}>
          <Text style={styles.buyText}>BUY</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Animal Shop</Text>
        <View style={styles.coinDisplay}>
          <Ionicons name="logo-bitcoin" size={20} color="#FFD700" />
          <Text style={styles.coinText}>{coins}</Text>
        </View>
      </View>

      <FlatList
        data={Object.values(PACK_TYPES)}
        keyExtractor={(item) => item.id}
        renderItem={renderPack}
        contentContainerStyle={styles.listContent}
      />

      <GachaRevealModal 
        visible={modalVisible} 
        animal={wonAnimal} 
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  packName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  packDesc: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#555',
  },
  buyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buyText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ShopScreen;