import { festivalTimeline, themeAssetRegistry } from "../data/timeline/festivals";
import { personalEvents } from "../data/timeline/personalEvents";
import { seasonAssetRegistry, getSeasonKeyByMonth } from "../data/timeline/seasons";
import { getYearlyVibe } from "../data/timeline/yearMusic";
import { historicEvents } from "../data/timeline/historicEvents";

const WEEKS_PER_MONTH = 4;
const MONTHS_PER_YEAR = 12;

/**
 * Calculates a linear monotonic week index for safe window and diff arithmetic.
 */
function getAbsoluteWeek(year, month, week) {
  return year * MONTHS_PER_YEAR * WEEKS_PER_MONTH + month * WEEKS_PER_MONTH + week;
}

/**
 * Checks for events inside a 1-week window:
 * diff =  0 -> peak (this week)
 * diff = -1 -> pre  (event is next week)
 * diff =  1 -> post (event was last week)
 */
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

/**
 * Selects an item at random from an array.
 */
function getRandomItem(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Master resolution function
 * 
 * Hierarchy:
 * 1. Active Festival Window (pre / peak / post) -> dictates visual theme, particle strength, and primary audio
 * 2. Fallback Season -> base ambient visual theme, ambient particles, season audio
 * 3. Audio Mix -> during season mode, randomizes between season audio and active year vibe track
 * 4. Overlay Notifications -> personal milestones & historic news surfaced as popups/headlines
 * 
 * @param {number} year - e.g. 2011
 * @param {number} month - 0 to 11
 * @param {number} week - 1 to 4
 */
export function selectTheme(year, month, week) {
  const currentAbsWeek = getAbsoluteWeek(year, month, week);

  // 1. Check window matches
  const festivalMatch = findEventInWindow(festivalTimeline, currentAbsWeek, "festival");
  const personalMatch = findEventInWindow(personalEvents, currentAbsWeek, "personal");
  const historicMatch = findEventInWindow(historicEvents, currentAbsWeek, "historic");

  // 2. Fetch baseline yearly music & ambient season
  const yearVibe = getYearlyVibe(year);
  const seasonKey = getSeasonKeyByMonth(month);
  const seasonAssets = seasonAssetRegistry[seasonKey];

  // 3. Resolve Visual & Audio Theme (Festivals > Seasons > Music Mix)
  let activeThemeKey = "default";
  let themeSource = "season"; // "festival" | "season"
  let phase = "none";         // "pre" | "peak" | "post" | "none"
  let intensity = 1.0;        // 0.0 to 1.0
  let particleCountMultiplier = 1.0;
  let musicVolume = 0.01;
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

    // Dynamic curve based on phase
    if (phase === "pre") {
      intensity = 0.45;
      particleCountMultiplier = 0.5;
      musicVolume = 0.08;
    } else if (phase === "peak") {
      intensity = 1.0;
      particleCountMultiplier = 1.0;
      musicVolume = 0.12;
    } else if (phase === "post") {
      intensity = 0.3;
      particleCountMultiplier = 0.35;
      musicVolume = 0.05;
    }
  } else {
    // Fallback to Season
    themeSource = "season";
    activeThemeKey = seasonKey;
    phase = "peak";
    intensity = 0.7;
    particleCountMultiplier = 0.06;
    visualAssets = seasonAssets;

    // Mix season audio and yearly vibe songs
    const availableYearSongs = yearVibe.songs || [];
    const useYearVibeSong = availableYearSongs.length > 0 && Math.random() > 0.9;

    if (useYearVibeSong) {
      const chosenSong = getRandomItem(availableYearSongs);
      activeAudioSrc = chosenSong.audioSrc;
      activeAudioTitle = `${chosenSong.title} (${year})`;
      musicVolume = 0.02;
    } else {
      activeAudioSrc = seasonAssets.audioSrc;
      activeAudioTitle = `${seasonAssets.name} Ambient`;
      musicVolume = 0.02;
    }
  }

  // 4. Resolve Popups / Headlines for UI overlays (Personal & Historic)
  const notifications = [];

  if (personalMatch) {
    notifications.push({
      type: "personal",
      phase: personalMatch.phase,
      title: personalMatch.headline || personalMatch.name,
      description: personalMatch.description,
      tag: personalMatch.type,
      priority: 1
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
      priority: 2
    });
  }

  return {
    // Core visual theme keys
    themeKey: activeThemeKey,
    themeSource, // "festival" | "season"
    phase,       // "pre" | "peak" | "post" | "none"

    // Strength metrics for UI and canvas particles
    intensity,               // 0.0 - 1.0
    particleCountMultiplier, // scales particle generation density
    particleType: visualAssets.particleType,
    colors: visualAssets.colors,

    // Audio metadata
    audio: {
      src: activeAudioSrc,
      title: activeAudioTitle,
      volume: musicVolume
    },

    // Contextual year metadata
    yearContext: {
      year,
      vibeTagline: yearVibe.vibeTagline
    },

    // UI overlays & popups
    notifications,
    activeFestival: matchedFestival,
    hasActiveNotification: notifications.length > 0
  };
}