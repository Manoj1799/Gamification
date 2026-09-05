/* =========================================================
   TRADING LEVEL SYSTEM
========================================================= */

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

export const completedPhases = [];


/*
Example for later:

{
  number: 0,
  name: "Foundation",
  aim: "Build the foundation.",
  startDate: "2026-07-01",
  completedDate: "2026-08-30",
}
*/


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
    number: 1,
    name: "Data Collection",

    aim: "Build database and skeleton before backtesting.",

    startDate: "2026-08-31",
    endDate: "2026-09-15",
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
      id: "june",
      name: "June",
      unlocked: true,
      missions: [],
    },

    {
      id: "july",
      name: "July",
      unlocked: false,
      missions: [],
    },

    {
      id: "august",
      name: "August",
      unlocked: false,
      missions: [],
    },

    {
      id: "september",
      name: "September",
      unlocked: false,
      missions: [],
    },
  ],
};