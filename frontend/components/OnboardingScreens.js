import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  FlatList,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to ZooFocus!',
    description: 'Boost your productivity while building a virtual zoo of adorable animals.',
    //image: require('../assets/welcome.png'), // You'll need to add this image
    primaryColor: '#5D8BF4',
  },
  {
    id: '2',
    title: 'Manage Your Tasks',
    description: 'Create and organize tasks. Complete them to earn coins for your zoo!',
    //image: require('../assets/tasks.png'), // You'll need to add this image
    primaryColor: '#FF6B6B',
  },
  {
    id: '3',
    title: 'Stay Focused with Pomodoro',
    description: 'Use the Pomodoro technique to boost your productivity and earn more coins.',
    //image: require('../assets/pomodoro.png'), // You'll need to add this image
    primaryColor: '#4ECDC4',
  },
  {
    id: '4',
    title: 'Build Your Zoo',
    description: 'Spend your hard-earned coins to unlock new animals and take care of them!',
    //image: require('../assets/zoo.png'), // You'll need to add this image
    primaryColor: '#FFD54F',
  }
];

const OnboardingScreens = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_complete', 'true');
      onComplete();
    } catch (error) {
      console.log('Error saving onboarding status:', error);
    }
  };

  const goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.primaryColor }]}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderDotIndicators = () => {
    return onboardingData.map((_, index) => {
      const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
      
      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [10, 20, 10],
        extrapolate: 'clamp',
      });
      
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });
      
      return (
        <Animated.View 
          key={index} 
          style={[
            styles.dot, 
            { width: dotWidth, opacity }
          ]} 
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
      
      <View style={styles.bottomContainer}>
        <View style={styles.dotContainer}>
          {renderDotIndicators()}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            { backgroundColor: onboardingData[currentIndex].primaryColor }
          ]} 
          onPress={goToNextSlide}
        >
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons 
            name={currentIndex === onboardingData.length - 1 ? "checkmark" : "arrow-forward"} 
            size={20} 
            color="white" 
            style={styles.buttonIcon} 
          />
        </TouchableOpacity>
        
        {currentIndex < onboardingData.length - 1 && (
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={completeOnboarding}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  slide: {
    flex: 1,
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  skipButton: {
    position: 'absolute',
    top: -40,
    right: 20,
    padding: 10,
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OnboardingScreens;