
import {
  getTradingRecord,
  saveTradingRecord,
} from "../data/database";

import { trading } from "../data/trading";

export async function loadTradingRecord() {
  const existingRecord = await getTradingRecord();

  if (existingRecord) {
    return existingRecord;
  }

  const newRecord = {
    id: "current",

    phaseNumber: trading.phase.number,

    quests: trading.quests.map((quest) => ({
      ...quest,
      done: false,
    })),

    currentXP: trading.skill.currentXP,
  };

  await saveTradingRecord(newRecord);

  return newRecord;
}

export async function saveCurrentTradingRecord(
  quests,
  currentXP
) {
  const record = {
    id: "current",

    phaseNumber: trading.phase.number,

    quests,

    currentXP,
  };

  await saveTradingRecord(record);
}