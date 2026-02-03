import { ANIMALS, RARITY_LEVELS } from '../assets/animalAssets';

export const pullAnimal = (packId) => {
  
  const packAnimals = ANIMALS.filter(a => a.pack === packId);
  
  const roll = Math.random(); 
  
  // 3. Determine Rarity based on the percentages
  // Cumulative checks: 
  // 0 - 0.95 = Common
  // 0.95 - 0.99 = Uncommon
  // 0.99 - 0.999 = Legendary
  // 0.999 - 1.0 = Epic
  
  let selectedRarity = 'common';
  let cumulative = RARITY_LEVELS.COMMON.probability;
  
  if (roll > cumulative) {
    cumulative += RARITY_LEVELS.UNCOMMON.probability;
    selectedRarity = 'uncommon';
  }
  if (roll > cumulative) {
    cumulative += RARITY_LEVELS.LEGENDARY.probability;
    selectedRarity = 'legendary';
  }
  if (roll > cumulative) {
    selectedRarity = 'epic';
  }

  
  const winningPool = packAnimals.filter(a => a.rarity === selectedRarity);

  // Fallback: If no animal exists of that rarity in this pack (e.g. Rodent pack has no dragons),
  // give a Common one.
  if (winningPool.length === 0) {
    const commonPool = packAnimals.filter(a => a.rarity === 'common');
    return commonPool[Math.floor(Math.random() * commonPool.length)];
  }

  
  const winner = winningPool[Math.floor(Math.random() * winningPool.length)];
  
  return winner;
};