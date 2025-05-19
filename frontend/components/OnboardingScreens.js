import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GirlIntroImage from '../assets/Test.png';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to ZooFocus!',
    description: 'Boost your productivity while building a virtual zoo of adorable animals.',
    primaryColor: '#5D8BF4',
  },
  {
    id: '2',
    title: 'Manage Your Tasks',
    description: 'Create and organize tasks. Complete them to earn coins for your zoo!',
    primaryColor: '#FF6B6B',
  },
  {
    id: '3',
    title: 'Stay Focused with Pomodoro',
    description: 'Use the Pomodoro technique to boost your productivity and earn more coins.',
    primaryColor: '#4ECDC4',
  },
  {
    id: '4',
    title: 'Build Your Zoo',
    description: 'Spend your hard-earned coins to unlock new animals and take care of them!',
    primaryColor: '#FFD54F',
  },
];

const OnboardingScreens = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  /* ------------------------- helpers -------------------------- */
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

  /* ------------------------- render --------------------------- */
  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.primaryColor }]}>      
      {/* ---------- speech bubble ---------- */}
      <View style={styles.speechBubbleContainer}>
        <View style={styles.speechBubble}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.speechTail} />
        </View>
      </View>

      {/* ---------- zookeeper image ---------- */}
      <Image
        source={GirlIntroImage}
        style={styles.girlImage}
        resizeMode="contain"
      />
    </View>
  );

  const renderDotIndicators = () => {
    return onboardingData.map((_, index) => {
      const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [10, 24, 10],
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
          style={[styles.dot, { width: dotWidth, opacity }]} />
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

      {/* ---------------- bottom controls ---------------- */}
      <View style={styles.bottomContainer}>
        <View style={styles.dotContainer}>{renderDotIndicators()}</View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: onboardingData[currentIndex].primaryColor }]}
          onPress={goToNextSlide}
        >
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={currentIndex === onboardingData.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={20}
            color="white"
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        {currentIndex < onboardingData.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/* ======================== styles =========================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  /** Slide now uses flexbox column with tighter spacing **/
  slide: {
    flex: 1,
    width,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 120,
  },
  /** MUCH bigger image (≈3× previous size) **/
  girlImage: {
    width: width * 0.85,
    height: height * 0.7,
  },
  /** Bubble lowered—slight negative margin so it kisses the image **/
  speechBubbleContainer: {
    width: width * 0.85,
    marginBottom: -30, // pulls bubble closer to the image
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#eee',
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    alignItems: 'center',
  },
  /** Tail still points downward **/
  speechTail: {
    position: 'absolute',
    bottom: -18,
    left: '50%',
    marginLeft: -16,
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderLeftColor: 'transparent',
    borderRightWidth: 16,
    borderRightColor: 'transparent',
    borderTopWidth: 18,
    borderTopColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D8BF4',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingTop: 2,
  },
  /* -------- bottom controls -------- */
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
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
    top: -36,
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
