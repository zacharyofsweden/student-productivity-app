import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const FeatureTooltip = ({ 
  id, 
  targetRef, 
  title, 
  description, 
  position = 'bottom',
  onDismiss,
  icon = 'information-circle'
}) => {
  const [visible, setVisible] = useState(false);
  const [tooltipMeasures, setTooltipMeasures] = useState({
    x: 0, y: 0, width: 0, height: 0
  });
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    checkIfSeen();
  }, []);

  const checkIfSeen = async () => {
    try {
      const seenTooltips = await AsyncStorage.getItem('@seen_tooltips');
      const seenArray = seenTooltips ? JSON.parse(seenTooltips) : [];
      
      if (!seenArray.includes(id)) {
        if (targetRef && targetRef.current) {
          targetRef.current.measure((x, y, width, height, pageX, pageY) => {
            setTooltipMeasures({ x: pageX, y: pageY, width, height });
            showTooltip();
          });
        }
      }
    } catch (error) {
      console.log('Error checking tooltip visibility:', error);
    }
  };

  const showTooltip = () => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const dismissTooltip = async () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(async () => {
      setVisible(false);
      
      try {
        const seenTooltips = await AsyncStorage.getItem('@seen_tooltips');
        const seenArray = seenTooltips ? JSON.parse(seenTooltips) : [];
        
        if (!seenArray.includes(id)) {
          seenArray.push(id);
          await AsyncStorage.setItem('@seen_tooltips', JSON.stringify(seenArray));
        }
      } catch (error) {
        console.log('Error marking tooltip as seen:', error);
      }
      
      if (onDismiss) onDismiss();
    });
  };

  const getTooltipPosition = () => {
    if (!visible) return {};
    
    const tooltipWidth = width * 0.8;
    let tooltipX = tooltipMeasures.x + tooltipMeasures.width / 2 - tooltipWidth / 2;
    
    // Ensure tooltip stays within screen bounds
    if (tooltipX < 20) tooltipX = 20;
    if (tooltipX + tooltipWidth > width - 20) tooltipX = width - tooltipWidth - 20;
    
    let tooltipY;
    let arrowPosition;
    
    if (position === 'bottom') {
      tooltipY = tooltipMeasures.y + tooltipMeasures.height + 15;
      arrowPosition = { top: -10, left: tooltipMeasures.x - tooltipX + tooltipMeasures.width / 2 - 10 };
    } else {
      tooltipY = tooltipMeasures.y - 15 - 100; // Estimated tooltip height
      arrowPosition = { bottom: -10, left: tooltipMeasures.x - tooltipX + tooltipMeasures.width / 2 - 10 };
    }
    
    return {
      left: tooltipX,
      top: tooltipY,
      width: tooltipWidth,
      arrowPosition
    };
  };

  if (!visible) return null;

  const tooltipPosition = getTooltipPosition();
  const arrowStyle = position === 'bottom' 
    ? styles.arrowUp 
    : styles.arrowDown;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { opacity: fadeAnim }
      ]}
    >
      <TouchableOpacity 
        style={styles.overlayTouch}
        activeOpacity={1}
        onPress={dismissTooltip}
      >
        <View 
          style={[
            styles.tooltipContainer,
            {
              left: tooltipPosition.left,
              top: tooltipPosition.top,
              width: tooltipPosition.width
            }
          ]}
        >
          <View 
            style={[
              arrowStyle,
              tooltipPosition.arrowPosition
            ]} 
          />
          
          <View style={styles.tooltipHeader}>
            <Ionicons name={icon} size={20} color="#5D8BF4" />
            <Text style={styles.tooltipTitle}>{title}</Text>
          </View>
          
          <Text style={styles.tooltipDescription}>{description}</Text>
          
          <TouchableOpacity 
            style={styles.gotItButton}
            onPress={dismissTooltip}
          >
            <Text style={styles.gotItText}>Got it</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  overlayTouch: {
    flex: 1,
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrowUp: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  arrowDown: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tooltipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  tooltipDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  gotItButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#5D8BF4',
    borderRadius: 5,
  },
  gotItText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default FeatureTooltip;