
export function calculatePhaseProgress(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  const totalTime = end - start;
  const elapsedTime = today - start;

  if (totalTime <= 0) return 100;

  const progress = (elapsedTime / totalTime) * 100;

  return Math.min(100, Math.max(0, Math.round(progress)));
}

export function calculateDaysRemaining(endDate) {
  const end = new Date(endDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const difference = end - today;

  return Math.max(
    0,
    Math.ceil(difference / (1000 * 60 * 60 * 24))
  );
}

export function calculateQuestProgress(quests) {
  if (!quests.length) return 0;

  const completed = quests.filter(
    (quest) => quest.done
  ).length;

  return Math.round(
    (completed / quests.length) * 100
  );
}

