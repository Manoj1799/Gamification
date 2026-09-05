// Trading persistence service.
// This file only loads and saves Trading data.
// Dynamic mission generation is handled by useTrading/logic.

// Import IndexedDB functions.
import {
  getTradingRecord,
  saveTradingRecord,
} from "../data/database";

// Import static Trading configuration.
import { trading } from "../data/trading";


/* =========================================================
   DATE HELPER
========================================================= */

// Return today's date in YYYY-MM-DD format.
function getToday() {
  return new Date()
    .toISOString()
    .split("T")[0];
}


/* =========================================================
   LOAD TRADING RECORD
========================================================= */
// Creates the Trading record only when one does not exist.

export async function loadTradingRecord() {
  const existingRecord =
    await getTradingRecord();

  if (existingRecord) {
    return existingRecord;
  }

  const newRecord = {
    id: "current",
    phaseNumber: trading.phase.number,
    months: trading.months.map((month) => ({
      ...month,
      missions: [],
    })),
    currentXP: trading.skill.currentXP,

    journey: {
      completedDates: [],
    },
  };

  await saveTradingRecord(newRecord);

  return newRecord;
}


/* =========================================================
   SAVE TRADING RECORD
========================================================= */

// Saves Trading data while preserving Journey progress.

export async function saveCurrentTradingRecord(
  months,
  currentXP
) {
  // Load the existing record first so we don't overwrite
  // Journey data when Trading missions are saved.
  const existingRecord =
    await getTradingRecord();

  const record = {
    ...existingRecord,

    id: "current",
    phaseNumber: trading.phase.number,
    months,
    currentXP,

    // Explicitly preserve Journey progress.
    journey: existingRecord?.journey ?? {
      completedDates: [],
    },
  };

  await saveTradingRecord(record);
}