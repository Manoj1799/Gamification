import { useState, useEffect, useMemo } from "react";
import { themes, DiyaIcon, ThemeParticles } from "../data/timeline/themes";
import { useTrading } from "./useTrading";
import { selectTheme } from "../logic/themelogic";
import { CurrentPhaseStartMonth,currentPhaseStartYear } from "../data/trading";

function getMonthAndYear(index = 0, startYear = currentPhaseStartYear, startMonth = CurrentPhaseStartMonth) {
  // startMonth is 10 (1-based October), converting to 0-based month arithmetic
  const totalMonths = (startMonth) + (index ?? 0);
  const year = startYear + Math.floor(totalMonths / 12);
  const monthIndex = totalMonths % 12; // 0-based (0 = Jan, 9 = Oct, etc.)

  return { year, monthNumber: monthIndex };
}

function resolveThemeData(currentIncompleteMission) {
  if (!currentIncompleteMission) {
    return selectTheme(2010, 9, 1);
  }

  const { monthIndex, mission } = currentIncompleteMission;
  const { year, monthNumber } = getMonthAndYear(monthIndex);

  // Clamp week to max 4 to match 4-week timeline system
  let missionWeek = mission?.week ?? 1;
  if (missionWeek >= 5) {
    missionWeek = 4;
  }

  return selectTheme(year, monthNumber, missionWeek);//year, monthNumber,missionWeek
}

export function useTheme() {
  const { currentIncompleteMission } = useTrading();

  // 1. Initialize full theme state from selectTheme
  const [themeData, setThemeData] = useState(() =>
    resolveThemeData(currentIncompleteMission)
  );

  // 2. React to async mission updates
  useEffect(() => {
    if (currentIncompleteMission) {
      setThemeData(resolveThemeData(currentIncompleteMission));
    }
  }, [currentIncompleteMission]);

  // 3. Resolve CSS styling / design tokens with fallback
  const theme = useMemo(() => {
    return themes[themeData.themeKey] || themes.default;
  }, [themeData.themeKey]);

  return {
    // Visual theme styling
    theme,
    themeKey: themeData.themeKey,
    themeSource: themeData.themeSource, // "festival" | "season"
    phase: themeData.phase,             // "pre" | "peak" | "post" | "none"

    // Strength & Particle parameters
    intensity: themeData.intensity,
    particleCountMultiplier: themeData.particleCountMultiplier,
    particleType: themeData.particleType,
    colors: themeData.colors,

    // Audio & Year Context
    audio: themeData.audio,             // { src, title, volume }
    yearContext: themeData.yearContext, // { year, vibeTagline }

    // Overlay popups / headlines (Personal & Historic events)
    notifications: themeData.notifications,
    activeFestival: themeData.activeFestival,
    hasActiveNotification: themeData.hasActiveNotification,

    // Controls & Components
    setThemeData,
    DiyaIcon,
    ThemeParticles,
  };
}