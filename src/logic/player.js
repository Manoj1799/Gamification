export function calculateLevel(currentXP, nextLevelXP, currentLevel) {
  if (currentXP >= nextLevelXP) {
    return currentLevel + 1;
  }

  return currentLevel;
}