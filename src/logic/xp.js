export function calculateXP(currentXP, questXP, completed) {
  if (completed) {
    return currentXP + questXP;
  }

  return Math.max(0, currentXP - questXP);
}

export function getLevelXP(level) {
  return level * 500;
}

export function calculateLevel(currentXP) {
  return Math.floor(currentXP / 500) + 1;
}

export function calculateXPProgress(currentXP) {
  const level = calculateLevel(currentXP);
  const currentLevelXP = (level - 1) * 500;
  const nextLevelXP = level * 500;

  const progress =
    ((currentXP - currentLevelXP) /
      (nextLevelXP - currentLevelXP)) *
    100;

  return Math.min(Math.max(progress, 0), 100);
}