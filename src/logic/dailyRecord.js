export function createDailyRecord(date, dayOfWeek, data = {}) {
  return {
    date,
    dayOfWeek,

    quests: data.quests || [],
    xp: data.xp || 0,

    gym: data.gym || {},
    trading: data.trading || {},
    habits: data.habits || {},
    penalty: data.penalty || {},
    journal: data.journal || {},
  };
}