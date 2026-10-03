import { festivalTimeline, themeAssetRegistry } from "../data/timeline/festivals";
import { personalEvents } from "../data/timeline/personalEvents";
import { seasonAssetRegistry, getSeasonKeyByMonth } from "../data/timeline/seasons";
import { getYearlyVibe } from "../data/timeline/yearMusic";
import { historicEvents } from "../data/timeline/historicEvents";
import { themes } from "../data/timeline/themes";

const WEEKS_PER_MONTH = 4;
const MONTHS_PER_YEAR = 12;

function getAbsoluteWeek(year, month, week) {
  return year * MONTHS_PER_YEAR * WEEKS_PER_MONTH + month * WEEKS_PER_MONTH + week;
}

function findEventInWindow(dataset, currentAbsWeek, category) {
  for (const item of dataset) {
    const eventAbsWeek = getAbsoluteWeek(item.year, item.month, item.week);
    const diff = currentAbsWeek - eventAbsWeek;

    if (diff === 0) return { ...item, category, phase: "peak" };
    if (diff === -1) return { ...item, category, phase: "pre" };
    if (diff === 1) return { ...item, category, phase: "post" };
  }
  return null;
}

function getRandomItem(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

export function selectTheme(year, month, week) {
  const currentAbsWeek = getAbsoluteWeek(year, month, week);

  // 1. Check window matches
  const festivalMatch = findEventInWindow(festivalTimeline, currentAbsWeek, "festival");
  const personalMatch = findEventInWindow(personalEvents, currentAbsWeek, "personal");
  const historicMatch = findEventInWindow(historicEvents, currentAbsWeek, "historic");

  // 2. Baseline yearly vibe & season
  const yearVibe = getYearlyVibe(year);
  const seasonKey = getSeasonKeyByMonth(month);
  const seasonAssets = seasonAssetRegistry[seasonKey];

  let activeThemeKey = "default";
  let themeSource = "season";
  let phase = "none";
  let intensity = 1.0;
  let particleCountMultiplier = 1.0;
  let activeAudioSrc = null;
  let activeAudioTitle = "";
  let matchedFestival = null;
  let visualAssets = null;

  if (festivalMatch) {
    themeSource = "festival";
    matchedFestival = festivalMatch;
    activeThemeKey = festivalMatch.themeKey;
    phase = festivalMatch.phase;

    visualAssets = themeAssetRegistry[activeThemeKey] || themeAssetRegistry.default;
    activeAudioSrc = visualAssets.audioSrc;
    activeAudioTitle = `${matchedFestival.name} Theme`;

    if (phase === "pre") {
      intensity = 0.45;
      particleCountMultiplier = 0.5;
    } else if (phase === "peak") {
      intensity = 1.0;
      particleCountMultiplier = 1.0;
    } else if (phase === "post") {
      intensity = 0.3;
      particleCountMultiplier = 0.35;
    }
  } else {
    themeSource = "season";
    activeThemeKey = seasonKey;
    phase = "peak";
    intensity = 0.7;
    particleCountMultiplier = 0.06;
    visualAssets = seasonAssets;

    const availableYearSongs = yearVibe.songs || [];
    const useYearVibeSong = availableYearSongs.length > 0 && Math.random() > 0.9;

    if (useYearVibeSong) {
      const chosenSong = getRandomItem(availableYearSongs);
      activeAudioSrc = chosenSong.audioSrc;
      activeAudioTitle = `${chosenSong.title} (${year})`;
    } else {
      activeAudioSrc = seasonAssets.audioSrc;
      activeAudioTitle = `${seasonAssets.name} Ambient`;
    }
  }

  // Volume from theme config (defaulting to low 0.004)
  const activeThemeConfig = themes[activeThemeKey] || themes.default;
  const musicVolume = typeof activeThemeConfig.volume === "number" ? activeThemeConfig.volume : 0.004;

  const notifications = [];

  if (personalMatch) {
    notifications.push({
      type: "personal",
      phase: personalMatch.phase,
      title: personalMatch.headline || personalMatch.name,
      description: personalMatch.description,
      tag: personalMatch.type,
      priority: 1,
    });
  }

  if (historicMatch) {
    notifications.push({
      type: "historic",
      phase: historicMatch.phase,
      title: historicMatch.headline,
      shortTitle: historicMatch.shortTitle,
      description: historicMatch.description,
      tag: historicMatch.category,
      priority: 2,
    });
  }

  return {
    themeKey: activeThemeKey,
    themeSource,
    phase,
    intensity,
    particleCountMultiplier,
    particleType: visualAssets.particleType,
    colors: visualAssets.colors,
    audio: {
      src: activeAudioSrc,
      title: activeAudioTitle,
      volume: musicVolume,
    },
    yearContext: {
      year,
      vibeTagline: yearVibe.vibeTagline,
    },
    notifications,
    activeFestival: matchedFestival,
    hasActiveNotification: notifications.length > 0,
  };
}