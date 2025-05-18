// zooHelpers.js

export const personalityEmojis = {
    Playful: '🎉',
    Shy: '😳',
    Lazy: '😴',
    Energetic: '⚡️',
    Curious: '🔍',
    Grumpy: '😠',
    Friendly: '😊'
  };
  
  export const personalityDialog = {
    Playful: {
      pet: "Yay! That tickles! 🐾",
      play: "Wanna play tag?",
      idle: "Bouncing around with joy!",
      sleeping: "Dreaming of jumping fences...",
    },
    Shy: {
      pet: "Oh... okay... 🫣",
      play: "Maybe just a little?",
      idle: "Hiding in a corner...",
      sleeping: "Snug and hidden away.",
    },
    Lazy: {
      pet: "Zzz... that was nice.",
      play: "Ugh... maybe later.",
      idle: "Still lying down...",
      sleeping: "Snoring happily 💤",
    },
    Energetic: {
      pet: "Let's go! Let's run!",
      play: "Zoom zoom! 🏃‍♂️",
      idle: "Can’t stay still!",
      sleeping: "Power napping for action!",
    },
    Curious: {
      pet: "What’s that? What’s this?",
      play: "Let’s explore!",
      idle: "Sniffing around...",
      sleeping: "Dreaming of new things...",
    },
    Grumpy: {
      pet: "Hmmph. Fine.",
      play: "I guess so...",
      idle: "Growling slightly.",
      sleeping: "Grumbling in sleep.",
    },
    Friendly: {
      pet: "You’re the best 🥰",
      play: "Let’s play together!",
      idle: "Waving at you!",
      sleeping: "Cuddling plushies 🧸",
    }
  };
  
  export const getRandomPersonality = () => {
    const types = Object.keys(personalityEmojis);
    return types[Math.floor(Math.random() * types.length)];
  };
  
  export const getPersonalityEffects = (personality) => {
    switch (personality) {
      case 'Playful': return { happiness: 30, energy: -10 };
      case 'Shy': return { happiness: 15, energy: -5 };
      case 'Lazy': return { happiness: 10, energy: -20 };
      case 'Energetic': return { happiness: 25, energy: -15 };
      case 'Curious': return { happiness: 20, energy: -10 };
      case 'Grumpy': return { happiness: 10, energy: -10 };
      case 'Friendly': return { happiness: 25, energy: -10 };
      default: return { happiness: 20, energy: -10 };
    }
  };
  
  export const getPetHappinessBoost = (personality) => {
    const boosts = {
      Playful: 20,
      Shy: 10,
      Lazy: 15,
      Energetic: 15,
      Curious: 15,
      Grumpy: 5,
      Friendly: 25,
    };
    return boosts[personality] || 15;
  };
  
  export const updateAnimalMood = ({ stats }) => {
    const { hunger, energy, happiness, hygiene, health } = stats;
    if (hunger < 20) return 'hungry';
    if (energy < 20) return 'sad';
    if (happiness < 30) return 'sad';
    if (hygiene < 30) return 'angry';
    if (health < 30) return 'sad';
    if (happiness > 80 && hunger > 80) return 'happy';
    return 'innocent';
  };
  
