
import { useEffect, useState } from "react";
import { loadTradingRecord } from "../services/tradingService";
import {
  calculateTradingLevel,
  calculateTradingXPProgress,
} from "../logic/trading";

/* =========================================================
   TRADING LEVEL LADDER HOOK
========================================================= */

// Loads Trading XP from IndexedDB and prepares all data
// needed by the Trading Level Ladder page.
export default function useTradingLevelLadder(
  tradingLevels
) {

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */

  const [currentXP, setCurrentXP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------------------------------------------------
     LOAD TRADING RECORD
  --------------------------------------------------------- */

  useEffect(() => {

    const loadLevelData = async () => {

      try {

        const record =
          await loadTradingRecord();

        setCurrentXP(
          record?.currentXP ?? 0
        );

      } catch (error) {

        console.error(
          "Failed to load Trading XP:",
          error
        );

      } finally {

        setIsLoading(false);

      }

    };

    loadLevelData();

  }, []);

  /* ---------------------------------------------------------
     CURRENT LEVEL
  --------------------------------------------------------- */

  const currentLevel =
    calculateTradingLevel(
      currentXP,
      tradingLevels
    );

  /* ---------------------------------------------------------
     XP PROGRESS
  --------------------------------------------------------- */

  const xpProgress =
    calculateTradingXPProgress(
      currentXP,
      tradingLevels
    );

  /* ---------------------------------------------------------
     NEXT LEVEL
  --------------------------------------------------------- */

  const currentLevelIndex =
    tradingLevels.findIndex(
      (level) =>
        level.level === currentLevel.level
    );

  const nextLevel =
    tradingLevels[
      currentLevelIndex + 1
    ] ?? null;

  const xpToNextLevel =
    nextLevel
      ? Math.max(
          0,
          nextLevel.xpRequired - currentXP
        )
      : 0;

  /* ---------------------------------------------------------
     RETURN DATA
  --------------------------------------------------------- */

  return {
    currentXP,
    currentLevel,
    currentLevelIndex,
    nextLevel,
    xpToNextLevel,
    xpProgress,
    isLoading,
  };

}

