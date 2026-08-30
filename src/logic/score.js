export function calculateDailyScore(quests) {
  if (quests.length === 0) return 0;

  const completed = quests.filter((quest) => quest.done).length;

  return Math.round((completed / quests.length) * 100);
}