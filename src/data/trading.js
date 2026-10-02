/* =========================================================
   TRADING LEVEL SYSTEM
========================================================= */
export const currentPhaseStartYear = 2010;
export const CurrentPhaseStartMonth = 9; // Sep (0 Based)

export const tradingLevels = [
  {
    level: 0,
    name: "Market Beginner",
    xpRequired: 0,
    theme: "from-slate-600 via-slate-700 to-slate-800",
  },
  {
    level: 1,
    name: "Rookie Trader",
    xpRequired: 100,
    theme: "from-indigo-600 via-violet-600 to-purple-700",
  },
  {
    level: 2,
    name: "Chart Apprentice",
    xpRequired: 250,
    theme: "from-blue-600 via-indigo-600 to-violet-700",
  },
  {
    level: 3,
    name: "Data Hunter",
    xpRequired: 500,
    theme: "from-cyan-600 via-blue-600 to-indigo-700",
  },
  {
    level: 4,
    name: "Pattern Seeker",
    xpRequired: 850,
    theme: "from-teal-600 via-cyan-600 to-blue-700",
  },
  {
    level: 5,
    name: "Disciplined Trader",
    xpRequired: 1350,
    theme: "from-emerald-600 via-teal-600 to-cyan-700",
  },

  /* Major progression */

  {
    level: 6,
    name: "Market Analyst",
    xpRequired: 2000,
    theme: "from-green-600 via-emerald-600 to-teal-700",
  },
  {
    level: 7,
    name: "Strategy Builder",
    xpRequired: 2850,
    theme: "from-lime-600 via-green-600 to-emerald-700",
  },
  {
    level: 8,
    name: "Backtest Warrior",
    xpRequired: 3950,
    theme: "from-amber-500 via-orange-600 to-red-600",
  },
  {
    level: 9,
    name: "System Trader",
    xpRequired: 5350,
    theme: "from-orange-600 via-red-600 to-rose-700",
  },
  {
    level: 10,
    name: "Professional Trader",
    xpRequired: 7200,
    theme: "from-violet-600 via-purple-700 to-fuchsia-700",
  },

  /* More levels can be added later */

  {
    level: 11,
    name: "Advanced Trader",
    xpRequired: 9500,
    theme: "from-purple-700 via-fuchsia-700 to-pink-700",
  },
  {
    level: 12,
    name: "Market Specialist",
    xpRequired: 12300,
    theme: "from-sky-600 via-blue-700 to-indigo-800",
  },
  {
    level: 13,
    name: "Elite Analyst",
    xpRequired: 15700,
    theme: "from-emerald-600 via-green-700 to-teal-800",
  },
  {
    level: 14,
    name: "Master Strategist",
    xpRequired: 19800,
    theme: "from-amber-500 via-orange-600 to-red-700",
  },
  {
    level: 15,
    name: "Market Master",
    xpRequired: 25000,
    theme: "from-indigo-700 via-purple-700 to-fuchsia-800",
  },
];


/* =========================================================
   TRADING MISSION TEMPLATES
   ---------------------------------------------------------
   These are templates only.

   logic/trading.js will decide:
   - which template appears
   - its position in the month
   - its actual trading dates
   - whether it is currently available

   XP values remain here in the DATA layer.
========================================================= */

export const tradingMissionTemplates = {

  /* -------------------------
     MONDAY + TUESDAY
  ------------------------- */

  monTue: {
    id: "mon-tue",
    title:
      "⚡ The Mon-Tue Sprint: Complete Monday and Tuesday data.",
    xp: 1,
  },


  /* -------------------------
     WEDNESDAY + THURSDAY
  ------------------------- */

  wedThu: {
    id: "wed-thu",
    title:
      "⚡ Mid-Week Clearance: Complete Wednesday and Thursday chart data.",
    xp: 1,
  },


  /* -------------------------
     FRIDAY
  ------------------------- */

  friday: {
    id: "friday",
    title:
      "⚡ Friday Closer: Finish Friday's data and close trading week.",
    xp: 1,
  },


  /* -------------------------
     FIRST WEEK
  ------------------------- */

  firstWeek: {
    id: "first-week",
    title:
      "The Quarter Mile: Complete the first week.",
    xp: 2,
  },


  /* -------------------------
     SECOND WEEK
  ------------------------- */

  secondWeek: {
    id: "second-week",
    title:
      "The Mid-Month Surge: Complete the second week.",
    xp: 5,
  },


  /* -------------------------
     THIRD WEEK
  ------------------------- */

  thirdWeek: {
    id: "third-week",
    title:
      "The Final Stretch: Complete the third week.",
    xp: 7,
  },
  


  /* -------------------------
     LAST TRADING DAY
  ------------------------- */

  lastTradingDay: {
    id: "last-trading-day",
    title:
      "Last but not the Least: Complete the last trading day of month.",
    xp: 10,
  },
};


/* =========================================================
   PHASE HISTORY
   Previous completed phases will appear here.
========================================================= */


export const completedPhases = [
  {
    number: 1,
    name: "Foundation/Data Collection",
    aim: "Build the foundation.",
    startDate: "7 Sep 2026",
    completedDate: "25 Sep 2026",
    experience_collected: "Jun 2010 to Sep 2010"
  },
];




/* =========================================================
   TRADING DATA
========================================================= */

export const trading = {

  /* -------------------------
     SKILL
  ------------------------- */

  skill: {
    level: 0,
    currentXP: 0,
  },


  /* -------------------------
     CURRENT PHASE
  ------------------------- */

  phase: {
    number: 2,
    name: "BackTesting",
    aim: "1. Complete 100 Trades.\n2. Complete 500 Trades.",
    startDate: "2026-10-03",
    endDate: "2026-11-08",
  },
  /* -------------------------
     MONTHS
     -------------------------------------------------------
     Months are now configuration only.

     Monthly missions will NOT be manually written here.
     logic/trading.js will generate them from:
       - year
       - month
       - tradingMissionTemplates
       - actual trading days
  ------------------------- */

  months: [
    {
      id: "oct_10",
      name: "October 2010",
      unlocked: true,
      missions: [],
    },
     {
      id: "nov_10",
      name: "November 2010",
      unlocked: false,
      missions: [],
    },
    {
      id: "dec_10",
      name: "December 2010",
      unlocked: false,
      missions: [],
    },
    {
      id: "jan_11",
      name: "January 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "feb_11",
      name: "February 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "mar_11",
      name: "March 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "apr_11",
      name: "April 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "may_11",
      name: "May 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "jun_11",
      name: "June 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "jul_11",
      name: "July 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "aug_11",
      name: "August 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "sep_11",
      name: "September 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "oct_11",
      name: "October 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "nov_11",
      name: "November 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "dec_11",
      name: "December 2011",
      unlocked: false,
      missions: [],
    },
    {
      id: "jan_12",
      name: "January 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "feb_12",
      name: "February 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "mar_12",
      name: "March 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "apr_12",
      name: "April 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "may_12",
      name: "May 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "jun_12",
      name: "June 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "jul_12",
      name: "July 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "aug_12",
      name: "August 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "sep_12",
      name: "September 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "oct_12",
      name: "October 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "nov_12",
      name: "November 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "dec_12",
      name: "December 2012",
      unlocked: false,
      missions: [],
    },
    {
      id: "jan_13",
      name: "January 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "feb_13",
      name: "February 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "mar_13",
      name: "March 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "apr_13",
      name: "April 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "may_13",
      name: "May 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "jun_13",
      name: "June 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "jul_13",
      name: "July 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "aug_13",
      name: "August 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "sep_13",
      name: "September 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "oct_13",
      name: "October 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "nov_13",
      name: "November 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "dec_13",
      name: "December 2013",
      unlocked: false,
      missions: [],
    },
    {
      id: "jan_14",
      name: "January 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "feb_14",
      name: "February 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "mar_14",
      name: "March 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "apr_14",
      name: "April 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "may_14",
      name: "May 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "jun_14",
      name: "June 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "jul_14",
      name: "July 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "aug_14",
      name: "August 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "sep_14",
      name: "September 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "oct_14",
      name: "October 2014",
      unlocked: false,
      missions: [],
    },
    {
      id: "nov_14",
      name: "November 2014",
      unlocked: false,
      missions: [],
    },

  ],
};