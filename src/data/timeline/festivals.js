// 0-indexed months:
// Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
// Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
//
// Week mapping:
// Week 1: 1-7 | Week 2: 8-14 | Week 3: 15-21 | Week 4: 22-End

export const festivalTimeline = [
  // ================= 2010 (Oct - Dec) =================
  // Diwali: Nov 5, 2010 -> Month 10, Week 1
  { id: "diwali_2010", themeKey: "diwali", name: "Diwali", year: 2010, month: 10, week: 1 },

  // ================= 2011 =================
  // Republic Day: Jan 26, 2011 -> Month 0, Week 4
  { id: "republic_2011", themeKey: "republic_day", name: "Republic Day", year: 2011, month: 0, week: 4 },
  // Holi: Mar 19-20, 2011 -> Month 2, Week 3
  { id: "holi_2011", themeKey: "holi", name: "Holi", year: 2011, month: 2, week: 3 },
  // Independence Day: Aug 15, 2011 -> Month 7, Week 3
  { id: "independence_2011", themeKey: "independence_day", name: "Independence Day", year: 2011, month: 7, week: 3 },
  // Birthday: Sep 17, 2011 -> Month 8, Week 3
  { id: "birthday_2011", themeKey: "birthday", name: "Birthday", year: 2011, month: 8, week: 3 },
  // Diwali: Oct 26, 2011 -> Month 9, Week 4
  { id: "diwali_2011", themeKey: "diwali", name: "Diwali", year: 2011, month: 9, week: 4 },

  // ================= 2012 =================
  // Republic Day: Jan 26, 2012 -> Month 0, Week 4
  { id: "republic_2012", themeKey: "republic_day", name: "Republic Day", year: 2012, month: 0, week: 4 },
  // Holi: Mar 8, 2012 -> Month 2, Week 2
  { id: "holi_2012", themeKey: "holi", name: "Holi", year: 2012, month: 2, week: 2 },
  // Independence Day: Aug 15, 2012 -> Month 7, Week 3
  { id: "independence_2012", themeKey: "independence_day", name: "Independence Day", year: 2012, month: 7, week: 3 },
  // Birthday: Sep 17, 2012 -> Month 8, Week 3
  { id: "birthday_2012", themeKey: "birthday", name: "Birthday", year: 2012, month: 8, week: 3 },
  // Diwali: Nov 13, 2012 -> Month 10, Week 2
  { id: "diwali_2012", themeKey: "diwali", name: "Diwali", year: 2012, month: 10, week: 2 },

  // ================= 2013 =================
  // Republic Day: Jan 26, 2013 -> Month 0, Week 4
  { id: "republic_2013", themeKey: "republic_day", name: "Republic Day", year: 2013, month: 0, week: 4 },
  // Holi: Mar 27, 2013 -> Month 2, Week 4
  { id: "holi_2013", themeKey: "holi", name: "Holi", year: 2013, month: 2, week: 4 },
  // Independence Day: Aug 15, 2013 -> Month 7, Week 3
  { id: "independence_2013", themeKey: "independence_day", name: "Independence Day", year: 2013, month: 7, week: 3 },
  // Birthday: Sep 17, 2013 -> Month 8, Week 3
  { id: "birthday_2013", themeKey: "birthday", name: "Birthday", year: 2013, month: 8, week: 3 },
  // Diwali: Nov 3, 2013 -> Month 10, Week 1
  { id: "diwali_2013", themeKey: "diwali", name: "Diwali", year: 2013, month: 10, week: 1 },

  // ================= 2014 =================
  // Republic Day: Jan 26, 2014 -> Month 0, Week 4
  { id: "republic_2014", themeKey: "republic_day", name: "Republic Day", year: 2014, month: 0, week: 4 },
  // Holi: Mar 17, 2014 -> Month 2, Week 3
  { id: "holi_2014", themeKey: "holi", name: "Holi", year: 2014, month: 2, week: 3 },
  // Independence Day: Aug 15, 2014 -> Month 7, Week 3
  { id: "independence_2014", themeKey: "independence_day", name: "Independence Day", year: 2014, month: 7, week: 3 },
  // Birthday: Sep 17, 2014 -> Month 8, Week 3
  { id: "birthday_2014", themeKey: "birthday", name: "Birthday", year: 2014, month: 8, week: 3 },
  // Diwali: Oct 23, 2014 -> Month 9, Week 4
  { id: "diwali_2014", themeKey: "diwali", name: "Diwali", year: 2014, month: 9, week: 4 }
];

// Configuration registry for styling, particles, and audio
export const themeAssetRegistry = {
  diwali: {
    themeKey: "diwali",
    name: "Diwali",
    particleType: "diya", // or diya/gold-glitter//sparks
    audioSrc: "/audio/themes/diwali.mp3",
    colors: {
      primary: "#FF9933",
      accent: "#FFD700",
      background: "#1A0F00"
    }
  },
  holi: {
    themeKey: "holi",
    name: "Holi",
    particleType: "gulal_powder", // vibrant multi-color bursts
    audioSrc: "/audio/themes/holi.mp3",
    colors: {
      primary: "#FF1493",
      accent: "#00E5FF",
      background: "#12001F"
    }
  },
  independence_day: {
    themeKey: "independence_day",
    name: "Independence Day",
    particleType: "tricolor_confetti",
    audioSrc: "/audio/themes/independence.m4a",
    colors: {
      primary: "#FF9933",
      accent: "#138808",
      background: "#051329"
    }
  },
  republic_day: {
    themeKey: "republic_day",
    name: "Republic Day",
    particleType: "tricolor_confetti",
    audioSrc: "/audio/themes/republic.mp3",
    colors: {
      primary: "#FF9933",
      accent: "#000080",
      background: "#08101E"
    }
  },
  birthday: {
    themeKey: "birthday",
    name: "Birthday",
    particleType: "balloons_confetti",
    audioSrc: "/audio/themes/birthday.mp3",
    colors: {
      primary: "#9C27B0",
      accent: "#FF4081",
      background: "#160024"
    }
  },
  default: {
    themeKey: "default",
    name: "Standard",
    particleType: "subtle_stars",
    audioSrc: null,
    colors: {
      primary: "#3B82F6",
      accent: "#60A5FA",
      background: "#0F172A"
    }
  }
};

/**
 * Returns the theme metadata, particle configuration, and audio source for any key.
 * @param {string} themeKey 
 * @returns {object}
 */
export function getThemeAssets(themeKey) {
  return themeAssetRegistry[themeKey] || themeAssetRegistry.default;
}