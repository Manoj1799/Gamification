
import { useEffect, useState } from "react";

import { quests } from "../data/quest";
import { player } from "../data/player";

import { calculateXP } from "../logic/xp";
import { toggleQuest as updateQuests } from "../logic/quests";

import {
  loadTodayRecord,
  saveTodayRecord,
} from "../services/dailyRecordService";

export function useDashboard() {
  const [questList, setQuestList] = useState([]);
  const [currentXP, setCurrentXP] = useState(player.currentXP);
  const [dailyXP, setDailyXP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadToday() {
      const record = await loadTodayRecord();

      if (record) {
        setQuestList(record.quests);
        setDailyXP(record.xpEarned || 0);
      }

      setIsLoading(false);
    }

    loadToday();
  }, []);

  const toggleQuest = async (id) => {
    const quest = questList.find(
      (quest) => quest.id === id
    );

    if (!quest) return;

    const newDone = !quest.done;

    const updatedQuests = updateQuests(
      questList,
      id
    );

    const updatedTotalXP = calculateXP(
      currentXP,
      quest.xp,
      newDone
    );

    const updatedDailyXP = calculateXP(
      dailyXP,
      quest.xp,
      newDone
    );

    setQuestList(updatedQuests);
    setCurrentXP(updatedTotalXP);
    setDailyXP(updatedDailyXP);

    await saveTodayRecord(
      updatedQuests,
      updatedDailyXP
    );
  };

  return {
    questList,
    currentXP,
    dailyXP,
    isLoading,
    toggleQuest,
  };
}

