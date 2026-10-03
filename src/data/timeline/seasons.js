// 0-indexed months:
// Summer: Mar (2), Apr (3), May (4), Jun (5)
// Rainy:  Jul (6), Aug (7), Sep (8)
// Winter: Oct (9), Nov (10), Dec (11), Jan (0), Feb (1)

export const seasonAssetRegistry = {
  summer: {
    themeKey: "summer",
    name: "Summer",
    particleType: "sun_rays_heatwave", // heat shimmer, floating dust motes, bright light rays
    audioSrc: "/audio/themes/summer.mp3",
    colors: {
      primary: "#FFB300",
      accent: "#FF7043",
      background: "#1C1400"
    }
  },
  rainy: {
    themeKey: "rainy",
    name: "Monsoon",
    particleType: "raindrops_splashes", // animated rain streaks and ground ripple particles
    audioSrc: "/audio/themes/rainy.mp3",
    colors: {
      primary: "#0288D1",
      accent: "#4FC3F7",
      background: "#08131D"
    }
  },
  winter: {
    themeKey: "winter",
    name: "Winter",
    particleType: "frost_mist", // gentle falling frost flakes, fog mist
    audioSrc: "/audio/themes/winter.mp3",
    colors: {
      primary: "#80DEEA",
      accent: "#B2EBF2",
      background: "#0B1520"
    }
  }
};

/**
 * Maps a 0-indexed month (0-11) directly to its primary Indian season key.
 * @param {number} month - 0 to 11
 * @returns {"summer" | "rainy" | "winter"}
 */
export function getSeasonKeyByMonth(month) {
  if (month >= 2 && month <= 5) {
    return "summer"; // Mar, Apr, May, Jun
  }
  if (month >= 6 && month <= 8) {
    return "rainy"; // Jul, Aug, Sep
  }
  return "winter"; // Oct, Nov, Dec, Jan, Feb
}

/**
 * Returns the season metadata, particle setup, colors, and audio for a month.
 * @param {number} month - 0 to 11
 * @returns {object}
 */
export function getSeasonAssets(month) {
  const key = getSeasonKeyByMonth(month);
  return seasonAssetRegistry[key];
}