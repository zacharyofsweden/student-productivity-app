// frontend/assets/animalAssets.js

// 1. THE MISSING EXPORT: Map animal names to your specific image files
// Note: I matched the upper/lowercase exactly to your file list.
export const animalImages = {
  // Capitalized matches (Common in data)
  Rabbit: require('./Rabbit.png'),     // You have Rabbit.png
  Elephant: require('./Elephant.png'), // You have Elephant.png
  Turtle: require('./turtle.png'),     // You have turtle.png
  Fox:    require('./fox.png'),        // You have fox.png
  Owl:    require('./owl.png'),        // You have owl.png
  Lion:   require('./lion.png'),       // You have lion.png

  // Lowercase fallbacks (Just in case your data uses lowercase 'rabbit')
  rabbit: require('./Rabbit.png'),
  elephant: require('./Elephant.png'),
  turtle: require('./turtle.png'),
  fox:    require('./fox.png'),
  owl:    require('./owl.png'),
  lion:   require('./lion.png'),
};

// 2. Define Rarities
export const RARITY_LEVELS = {
  COMMON: { id: 'common', name: 'Normal', color: '#B0BEC5', probability: 0.95 },
  UNCOMMON: { id: 'uncommon', name: 'Uncommon', color: '#4CAF50', probability: 0.04 },
  LEGENDARY: { id: 'legendary', name: 'Legendary', color: '#FFD700', probability: 0.009 },
  EPIC: { id: 'epic', name: 'Epic', color: '#9C27B0', probability: 0.001 },
};

// 3. Define Packs
export const PACK_TYPES = {
  RODENT_PACK: { id: 'rodent', name: 'Rodent Pack', cost: 100 },
  FARM_PACK: { id: 'farm', name: 'Farm Pack', cost: 150 },
  PREMIUM_PACK: { id: 'premium', name: 'Mythical Pack', cost: 500 },
};

// 4. Define Gacha Animals
// I updated the images here to point to files you actually have so it doesn't crash.
export const ANIMALS = [
  // Rodents
  { id: 'rat', name: 'Rat', pack: 'rodent', rarity: 'common', image: require('./Rabbit.png') }, 
  { id: 'hamster', name: 'Hamster', pack: 'rodent', rarity: 'uncommon', image: require('./Rabbit.png') },
  
  // Farm (Changed image to Elephant because you have Elephant.png, but not fence.png)
  { id: 'cow', name: 'Cow', pack: 'farm', rarity: 'common', image: require('./Elephant.png') }, 
  
  // Mythical / Premium
  { id: 'dragon', name: 'Dragon', pack: 'premium', rarity: 'legendary', image: require('./lion.png') },
  { id: 'phoenix', name: 'Phoenix', pack: 'premium', rarity: 'epic', image: require('./owl.png') },
];