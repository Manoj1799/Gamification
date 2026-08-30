export function toggleQuest(quests, id) {
  return quests.map((quest) => {
    if (quest.id !== id) return quest;

    return {
      ...quest,
      done: !quest.done,
    };
  });
}

export function getCompletedQuestCount(quests) {
  return quests.filter((quest) => quest.done).length;
}