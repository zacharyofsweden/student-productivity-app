import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskContext } from './TaskContext';

export const ZooContext = createContext();

export const ZooProvider = ({ children }) => {
  const [animals, setAnimals] = useState([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const { tasks } = useContext(TaskContext);

  // Sample animal data
  const availableAnimals = [
    { id: '1', name: 'Rabbit', cost: 50, unlocked: false, happiness: 100, lastFed: null },
    { id: '2', name: 'Turtle', cost: 100, unlocked: false, happiness: 100, lastFed: null },
    { id: '3', name: 'Fox', cost: 150, unlocked: false, happiness: 100, lastFed: null },
    { id: '4', name: 'Owl', cost: 200, unlocked: false, happiness: 100, lastFed: null },
    { id: '5', name: 'Lion', cost: 300, unlocked: false, happiness: 100, lastFed: null },
    { id: '6', name: 'Elephant', cost: 400, unlocked: false, happiness: 100, lastFed: null },
  ];

  // Load zoo data from storage on mount
  useEffect(() => {
    const loadZoo = async () => {
      try {
        const storedAnimals = await AsyncStorage.getItem('animals');
        const storedCoins = await AsyncStorage.getItem('coins');
        
        if (storedAnimals) {
          setAnimals(JSON.parse(storedAnimals));
        } else {
          setAnimals(availableAnimals);
        }
        
        if (storedCoins) {
          setCoins(parseInt(storedCoins, 10));
        }
      } catch (error) {
        console.error('Failed to load zoo data', error);
        setAnimals(availableAnimals);
      } finally {
        setLoading(false);
      }
    };

    loadZoo();
  }, []);

  // Save zoo data to storage whenever they change
  useEffect(() => {
    const saveZoo = async () => {
      try {
        await AsyncStorage.setItem('animals', JSON.stringify(animals));
        await AsyncStorage.setItem('coins', coins.toString());
      } catch (error) {
        console.error('Failed to save zoo data', error);
      }
    };

    if (!loading) {
      saveZoo();
    }
  }, [animals, coins, loading]);

  // Award coins for completed tasks and pomodoro sessions
  useEffect(() => {
    const completedTasks = tasks.filter(task => task.completed);
    const totalSessions = tasks.reduce((acc, task) => acc + task.pomodoroSessions, 0);
    
    // Calculate how many coins to award based on completed tasks and pomodoro sessions
    // This is a simplified example - you might want a more sophisticated approach
    const earnedCoins = completedTasks.length * 10 + totalSessions * 5;
    
    setCoins(prevCoins => prevCoins + earnedCoins);
  }, [tasks]);

  // Unlock an animal
  const unlockAnimal = (animalId) => {
    const animal = animals.find(a => a.id === animalId);
    
    if (animal && !animal.unlocked && coins >= animal.cost) {
      setCoins(prevCoins => prevCoins - animal.cost);
      setAnimals(
        animals.map(a =>
          a.id === animalId 
            ? { ...a, unlocked: true, lastFed: new Date().toISOString() } 
            : a
        )
      );
      return true;
    }
    return false;
  };

  // Feed an animal
  const feedAnimal = (animalId) => {
    if (coins >= 5) {
      setCoins(prevCoins => prevCoins - 5);
      setAnimals(
        animals.map(a =>
          a.id === animalId
            ? { 
                ...a, 
                happiness: Math.min(a.happiness + 10, 100), 
                lastFed: new Date().toISOString() 
              }
            : a
        )
      );
      return true;
    }
    return false;
  };

  // Decrease animal happiness over time
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimals(
        animals.map(animal => {
          if (animal.unlocked) {
            const lastFed = animal.lastFed ? new Date(animal.lastFed) : null;
            const now = new Date();
            const hoursSinceLastFed = lastFed 
              ? (now - lastFed) / (1000 * 60 * 60) 
              : 24;
            
            // Decrease happiness based on time since last fed
            let happiness = animal.happiness;
            if (hoursSinceLastFed > 6) {
              happiness = Math.max(0, happiness - 5);
            }
            
            return { ...animal, happiness };
          }
          return animal;
        })
      );
    }, 1000 * 60 * 30); // Check every 30 minutes
    
    return () => clearInterval(interval);
  }, [animals]);

  return (
    <ZooContext.Provider
      value={{
        animals,
        coins,
        loading,
        unlockAnimal,
        feedAnimal,
      }}
    >
      {children}
    </ZooContext.Provider>
  );
};