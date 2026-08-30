
import {
  getDailyRecord,
  saveDailyRecord,
} from "../data/database";

import { quests } from "../data/quest";

import {
  getTodayDate,
  getDayOfWeek,
} from "../logic/date";

import { calculateDailyScore } from "../logic/score";

export async function loadTodayRecord() {
  const today = getTodayDate();

  const existingRecord = await getDailyRecord(today);

  if (existingRecord) {
    return existingRecord;
  }

  const dayOfWeek = getDayOfWeek();

  const newRecord = {
    date: today,
    dayOfWeek,

    quests: quests.map((quest) => ({
      ...quest,
      done: false,
    })),

    xpEarned: 0,
    score: 0,

    gym: {},
    trading: {},
    habits: {},
    penalty: {},
    journal: {},
  };

  await saveDailyRecord(newRecord);

  return newRecord;
}

export async function saveTodayRecord(quests, xpEarned) {
  const today = getTodayDate();

  const existingRecord = await getDailyRecord(today);

  const score = calculateDailyScore(quests);

  const record = {
    ...existingRecord,

    date: today,
    dayOfWeek: getDayOfWeek(),

    quests,
    xpEarned,
    score,

    gym: existingRecord?.gym || {},
    trading: existingRecord?.trading || {},
    habits: existingRecord?.habits || {},
    penalty: existingRecord?.penalty || {},
    journal: existingRecord?.journal || {},
  };

  await saveDailyRecord(record);
}

