import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskContext } from './TaskContext';

export const ZooContext = createContext();

export const ZooProvider = ({ children }) => {
  const [animals, setAnimals] = useState([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const { tasks } = useContext(TaskContext);

  // Sample animal data with Tamagotchi-style attributes
  const availableAnimals = [
    { 
      id: '1', 
      name: 'Rabbit', 
      cost: 50, 
      unlocked: false, 
      stats: {
        hunger: 100,      // 100 is full, 0 is starving
        energy: 100,      // 100 is fully rested, 0 is exhausted
        happiness: 100,   // 100 is very happy, 0 is sad
        hygiene: 100,     // 100 is clean, 0 is dirty
        health: 100,      // 100 is healthy, 0 is sick
      },
      age: 0,             // Days since unlocked
      lastInteraction: null,
      lastFed: null,
      lastPlayed: null,
      lastCleaned: null,
      lastSlept: null,
      mood: 'happy',      // Current mood/animation state
      level: 1,           // Level increases with age and care
    },
    { 
      id: '2', 
      name: 'Turtle', 
      cost: 100, 
      unlocked: false, 
      stats: {
        hunger: 100,
        energy: 100,
        happiness: 100,
        hygiene: 100,
        health: 100,
      },
      age: 0,
      lastInteraction: null,
      lastFed: null,
      lastPlayed: null,
      lastCleaned: null,
      lastSlept: null,
      mood: 'happy',
      level: 1,
    },
    { 
      id: '3', 
      name: 'Fox', 
      cost: 150, 
      unlocked: false, 
      stats: {
        hunger: 100,
        energy: 100,
        happiness: 100,
        hygiene: 100,
        health: 100,
      },
      age: 0,
      lastInteraction: null,
      lastFed: null,
      lastPlayed: null,
      lastCleaned: null,
      lastSlept: null,
      mood: 'happy',
      level: 1,
    },
    { 
      id: '4', 
      name: 'Owl', 
      cost: 200, 
      unlocked: false, 
      stats: {
        hunger: 100,
        energy: 100,
        happiness: 100,
        hygiene: 100,
        health: 100,
      },
      age: 0,
      lastInteraction: null,
      lastFed: null,
      lastPlayed: null,
      lastCleaned: null,
      lastSlept: null,
      mood: 'happy',
      level: 1,
    },
    { 
      id: '5', 
      name: 'Lion', 
      cost: 300, 
      unlocked: false, 
      stats: {
        hunger: 100,
        energy: 100,
        happiness: 100,
        hygiene: 100,
        health: 100,
      },
      age: 0,
      lastInteraction: null,
      lastFed: null,
      lastPlayed: null,
      lastCleaned: null,
      lastSlept: null,
      mood: 'happy',
      level: 1,
    },
    { 
      id: '6', 
      name: 'Elephant', 
      cost: 400, 
      unlocked: false, 
      stats: {
        hunger: 100,
        energy: 100,
        happiness: 100,
        hygiene: 100,
        health: 100,
      },
      age: 0,
      lastInteraction: null,
      lastFed: null,
      lastPlayed: null,
      lastCleaned: null,
      lastSlept: null,
      mood: 'happy',
      level: 1,
    },
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
            ? { 
                ...a, 
                unlocked: true, 
                lastInteraction: new Date().toISOString(),
                lastFed: new Date().toISOString(),
                lastPlayed: new Date().toISOString(),
                lastCleaned: new Date().toISOString(),
                lastSlept: new Date().toISOString(),
              } 
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
                stats: {
                  ...a.stats,
                  hunger: Math.min(a.stats.hunger + 30, 100),
                  health: Math.min(a.stats.health + 5, 100),
                },
                lastFed: new Date().toISOString(),
                lastInteraction: new Date().toISOString(),
                mood: 'happy'
              }
            : a
        )
      );
      return true;
    }
    return false;
  };

  // Play with an animal
  const playWithAnimal = (animalId) => {
    if (coins >= 3) {
      setCoins(prevCoins => prevCoins - 3);
      setAnimals(
        animals.map(a =>
          a.id === animalId
            ? { 
                ...a, 
                stats: {
                  ...a.stats,
                  happiness: Math.min(a.stats.happiness + 30, 100),
                  energy: Math.max(a.stats.energy - 10, 0),
                  hunger: Math.max(a.stats.hunger - 10, 0),
                },
                lastPlayed: new Date().toISOString(),
                lastInteraction: new Date().toISOString(),
                mood: 'curious'
              }
            : a
        )
      );
      return true;
    }
    return false;
  };

  // Clean an animal
  const cleanAnimal = (animalId) => {
    if (coins >= 4) {
      setCoins(prevCoins => prevCoins - 4);
      setAnimals(
        animals.map(a =>
          a.id === animalId
            ? { 
                ...a, 
                stats: {
                  ...a.stats,
                  hygiene: 100,
                  happiness: Math.min(a.stats.happiness + 10, 100),
                },
                lastCleaned: new Date().toISOString(),
                lastInteraction: new Date().toISOString(),
                mood: 'cute'
              }
            : a
        )
      );
      return true;
    }
    return false;
  };

  // Let animal sleep/rest
  const restAnimal = (animalId) => {
    setAnimals(
      animals.map(a =>
        a.id === animalId
          ? { 
              ...a, 
              stats: {
                ...a.stats,
                energy: 100,
                health: Math.min(a.stats.health + 10, 100),
              },
              lastSlept: new Date().toISOString(),
              lastInteraction: new Date().toISOString(),
              mood: 'innocent'
            }
          : a
      )
    );
    return true;
  };

  // Pet/love the animal
  const petAnimal = (animalId) => {
    setAnimals(
      animals.map(a =>
        a.id === animalId
          ? { 
              ...a, 
              stats: {
                ...a.stats,
                happiness: Math.min(a.stats.happiness + 15, 100),
              },
              lastInteraction: new Date().toISOString(),
              mood: 'cute'
            }
          : a
      )
    );
    return true;
  };

  // Update animal mood based on stats
  const updateAnimalMood = (animal) => {
    const { hunger, energy, happiness, hygiene, health } = animal.stats;
    
    if (hunger < 20) return 'hungry';
    if (energy < 20) return 'sad';
    if (happiness < 30) return 'sad';
    if (hygiene < 30) return 'angry';
    if (health < 30) return 'sad';
    if (happiness > 80 && hunger > 80) return 'happy';
    return 'innocent';
  };

  // Update animal stats and age over time
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimals(
        animals.map(animal => {
          if (animal.unlocked) {
            const now = new Date();
            
            // Check time since last interaction
            const lastInteraction = animal.lastInteraction ? new Date(animal.lastInteraction) : null;
            const hoursSinceInteraction = lastInteraction 
              ? (now - lastInteraction) / (1000 * 60 * 60) 
              : 24;
            
            // Decrease stats based on time
            let newStats = { ...animal.stats };
            
            // Decrease hunger over time
            if (hoursSinceInteraction > 2) {
              newStats.hunger = Math.max(0, newStats.hunger - 5);
            }
            
            // Decrease energy over time when awake
            if (hoursSinceInteraction > 3) {
              newStats.energy = Math.max(0, newStats.energy - 3);
            }
            
            // Decrease happiness over time
            if (hoursSinceInteraction > 4) {
              newStats.happiness = Math.max(0, newStats.happiness - 4);
            }
            
            // Decrease hygiene over time
            if (hoursSinceInteraction > 8) {
              newStats.hygiene = Math.max(0, newStats.hygiene - 5);
            }
            
            // Health affected by other stats
            if (newStats.hunger < 30 || newStats.energy < 20 || newStats.hygiene < 30) {
              newStats.health = Math.max(0, newStats.health - 3);
            } else if (newStats.happiness > 80 && newStats.hunger > 80 && newStats.energy > 80) {
              newStats.health = Math.min(100, newStats.health + 1);
            }
            
            // Age the animal (1 day = 24 real hours)
            const daysSinceUnlocked = animal.lastInteraction 
              ? Math.floor((now - new Date(animal.lastInteraction)) / (1000 * 60 * 60 * 24))
              : 0;
            
            const newAge = Math.max(animal.age, daysSinceUnlocked);
            
            // Calculate level based on age and care
            const avgStats = Object.values(newStats).reduce((sum, stat) => sum + stat, 0) / 5;
            const newLevel = Math.max(1, Math.floor(newAge / 5) + Math.floor(avgStats / 20));
            
            // Update mood based on stats
            const newMood = updateAnimalMood({ ...animal, stats: newStats });
            
            return { 
              ...animal, 
              stats: newStats,
              age: newAge,
              level: newLevel,
              mood: newMood
            };
          }
          return animal;
        })
      );
    }, 1000 * 60 * 10); // Update every 10 minutes
    
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
        playWithAnimal,
        cleanAnimal,
        restAnimal,
        petAnimal,
      }}
    >
      {children}
    </ZooContext.Provider>
  );
};