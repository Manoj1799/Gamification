// Hook for loading, generating, updating, and calculating Trading page data.

import { useEffect, useState } from "react";

import {
  trading,
  tradingLevels,
  tradingMissionTemplates,
  currentPhaseStartYear,
  CurrentPhaseStartMonth,
} from "../data/trading";

import {
  calculateDaysRemaining,
  generateMonthlyMissions,
  calculateMonthProgress,
  calculateMonthXP,
  calculateMonthUnlocks,
  calculateTotalMissionXP,
  calculatePhaseMissionProgress,
  calculateTradingLevelData,
} from "../logic/trading";

import {
  loadTradingRecord,
  saveCurrentTradingRecord,
} from "../services/tradingService";

/* =========================================================
   HOOK
========================================================= */

export function useTrading() {
  /* =========================================================
     MONTH STATE
  ========================================================= */

  const [months, setMonths] = useState(trading.months);

  /* =========================================================
     FIRST INCOMPLETE MISSION STATE
  ========================================================= */

  const [currentIncompleteMission, setCurrentIncompleteMission] = useState(null);

  /* =========================================================
     TOTAL XP STATE
  ========================================================= */

  // Lifetime XP.
  // This never resets when the player levels up.
  const [totalXP, setTotalXP] = useState(trading.skill.currentXP);

  /* =========================================================
     EXPANDED MONTH STATE
  ========================================================= */

  const [expandedMonths, setExpandedMonths] = useState({
    june: true,
  });

  /* =========================================================
     LOADING STATE
  ========================================================= */

  const [isLoading, setIsLoading] = useState(true);

  /* =========================================================
     LOAD + GENERATE TRADING DATA
  ========================================================= */

  useEffect(() => {
    async function loadTrading() {
      try {
        const record = await loadTradingRecord();

        let savedMonths = record?.months ?? trading.months;

        // 2. Check if the last mission of the last month is completed
        const lastMonth = savedMonths[savedMonths.length - 1];
        const lastMission = lastMonth?.missions?.[lastMonth.missions.length - 1];
        const isLastMissionDone = Boolean(lastMission?.done);

        if (isLastMissionDone) {
          // Compare the recorded phase number against the default phase number
          const recordedPhaseNumber = record?.phaseNumber;
          const defaultPhaseNumber = trading.phase.number;

          if (recordedPhaseNumber !== defaultPhaseNumber) {
            savedMonths = trading.months;
          }
        }

        // Tracks the first occurrence of done: false across all months
        let firstIncomplete = null;

        const generatedMonths = savedMonths.map((month, index) => {
          const absoluteMonth = CurrentPhaseStartMonth + index;
          const currentYear =
            currentPhaseStartYear + Math.floor(absoluteMonth / 12);
          const currentMonth = absoluteMonth % 12; // Always stays within 0 to 11

          const generatedMissions = generateMonthlyMissions(
            currentYear,
            currentMonth,
            tradingMissionTemplates
          );

          const oldMissions = month.missions ?? [];

          const missions = generatedMissions.map((mission) => {
            const oldMission = oldMissions.find(
              (old) =>
                old.type === mission.type &&
                JSON.stringify(old.week) === JSON.stringify(mission.week)
            );

            const isDone = oldMission?.done ?? false;

            const updatedMission = {
              ...mission,
              done: isDone,
            };

            // Store only the first time an uncompleted mission is encountered
            if (!isDone && firstIncomplete === null) {
              firstIncomplete = {
                monthIndex: index,
                mission: updatedMission,
              };
            }

            return updatedMission;
          });

          return {
            ...month,
            missions,
          };
        });

        setMonths(generatedMonths);
        setCurrentIncompleteMission(firstIncomplete);

        /* -----------------------------------------------------
           IndexedDB currentXP = lifetime XP.
        ----------------------------------------------------- */

        if (record?.currentXP !== undefined) {
          setTotalXP(record.currentXP);
        }
      } catch (error) {
        console.error("Failed to load trading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTrading();
  }, []);

  /* =========================================================
     MONTH UNLOCK SYSTEM
  ========================================================= */

  const updatedMonths = calculateMonthUnlocks(months);

  /* =========================================================
     MISSION XP
  ========================================================= */

  // Display-only mission XP.
  // It is NOT added to totalXP here because totalXP already contains awarded mission XP.
  const earnedMissionXP = calculateTotalMissionXP(updatedMonths);

  /* =========================================================
     TRADING LEVEL
  ========================================================= */

  const levelData = calculateTradingLevelData(totalXP, tradingLevels);

  const {
    currentLevelXP,
    nextLevelTotalXP,
    xpRequiredForNextLevel,
    xpProgress,
  } = levelData;

  /* =========================================================
     FULL CURRENT LEVEL OBJECT
  ========================================================= */

  const currentLevel =
    tradingLevels.find((level) => level.level === levelData.currentLevel) ??
    tradingLevels[0];

  /* =========================================================
     PHASE PROGRESS
  ========================================================= */

  const phaseProgress = calculatePhaseMissionProgress(updatedMonths);

  /* =========================================================
     MONTH EXPAND / COLLAPSE
  ========================================================= */

  const toggleMonth = (monthId) => {
    const month = updatedMonths.find((month) => month.id === monthId);

    if (!month?.unlocked) {
      return;
    }

    setExpandedMonths((current) => ({
      ...current,
      [monthId]: !current[monthId],
    }));
  };

  /* =========================================================
     TOGGLE MONTHLY MISSION
  ========================================================= */

  const toggleMission = async (monthId, missionId) => {
    let missionXP = 0;

    const nextMonths = months.map((month) => {
      if (month.id !== monthId) {
        return month;
      }

      const missionIndex = month.missions.findIndex(
        (mission) => mission.id === missionId
      );

      if (missionIndex === -1) {
        return month;
      }

      const currentMission = month.missions[missionIndex];

      /* ---------------------------------------------------
         Completed missions are permanent.
      --------------------------------------------------- */
      if (currentMission.done) {
        return month;
      }

      /* ---------------------------------------------------
         Missions must be completed sequentially.
      --------------------------------------------------- */
      if (missionIndex > 0) {
        const previousMission = month.missions[missionIndex - 1];

        if (!previousMission.done) {
          return month;
        }
      }

      /* ---------------------------------------------------
         Award XP exactly once.
      --------------------------------------------------- */
      missionXP = currentMission.xp;

      return {
        ...month,
        missions: month.missions.map((mission, index) => {
          if (index !== missionIndex) {
            return mission;
          }

          return {
            ...mission,
            done: true,
          };
        }),
      };
    });

    if (missionXP <= 0) {
      return;
    }

    /* =======================================================
       CALCULATE NEW LIFETIME XP
    ======================================================= */

    const newTotalXP = totalXP + missionXP;

    setMonths(nextMonths);
    setTotalXP(newTotalXP);

    /* =======================================================
       SAVE LIFETIME XP
    ======================================================= */

    await saveCurrentTradingRecord(nextMonths, newTotalXP, {
      date: new Date().toISOString().split("T")[0],
    });
  };

  /* =========================================================
     DAYS REMAINING
  ========================================================= */

  const daysRemaining = calculateDaysRemaining(trading.phase.endDate);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    months: updatedMonths,
    currentXP: totalXP,
    earnedMissionXP,
    currentLevel,
    currentLevelXP,
    nextLevelTotalXP,
    xpRequiredForNextLevel,
    xpProgress,
    phaseProgress,
    expandedMonths,
    isLoading,
    daysRemaining,
    currentIncompleteMission,
    calculateMonthProgress,
    calculateMonthXP,
    toggleMonth,
    toggleMission,
  };
}