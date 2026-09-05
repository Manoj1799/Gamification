
/* =========================================================
   MISSION UNLOCK SYSTEM
========================================================= */

// Determine whether a Trading mission can be completed.
//
// Rules:
// 1. The first mission is available immediately.
// 2. A mission becomes available only after the
//    previous mission has been completed.
// 3. Completed missions can never be unchecked.
export function canCompleteMission(
  missions,
  index
) {
  const mission = missions[index];

  // Invalid mission.
  if (!mission) {
    return false;
  }

  // Completed missions are permanently locked as complete.
  if (mission.done) {
    return false;
  }

  // The first mission is available immediately.
  if (index === 0) {
    return true;
  }

  // Every other mission requires the previous mission
  // to have been completed first.
  return missions[index - 1].done === true;
}


/* =========================================================
   TRADING PHASE PROGRESS
========================================================= */

// Calculate how much of the current Trading Phase's time period has elapsed.
export function calculatePhaseProgress(
  startDate,
  endDate
) {
  // Convert phase dates into timestamps for comparison.
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // Calculate total phase duration and elapsed duration.
  const totalTime = end - start;
  const elapsedTime = today - start;

  // Invalid or zero-length phases are treated as complete.
  if (totalTime <= 0) return 100;

  // Convert elapsed time into a percentage.
  const progress =
    (elapsedTime / totalTime) * 100;

  // Keep the result between 0% and 100%.
  return Math.min(
    100,
    Math.max(0, Math.round(progress))
  );
}


/* =========================================================
   DAYS REMAINING
========================================================= */

// Calculate calendar days remaining until the Trading Phase ends.
export function calculateDaysRemaining(endDate) {
  // Convert both dates into Date objects.
  const end = new Date(endDate);
  const today = new Date();

  // Remove the time portion so only calendar days are compared.
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Calculate the difference between the dates.
  const difference = end - today;

  // Convert milliseconds into days and prevent negative values.
  return Math.max(
    0,
    Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  );
}

/* =========================================================
   MONTHLY MISSION GENERATOR
========================================================= */

// Generate Trading missions from the actual weekdays in a month.
//
// Weeks 1-3 use the existing weekly milestone missions.
//
// If the month contains 5 trading weeks, the remaining
// progression is:
//
//   Mon-Tue
//   Wed-Thu
//   Friday
//   Last Trading Day
//
// Titles and XP always come from missionTemplates.
export function generateMonthlyMissions(
  year,
  month,
  missionTemplates
) {
  /* ---------------------------------------------------------
     GET ALL TRADING DAYS
  --------------------------------------------------------- */

  const tradingDays = [];

  const date = new Date(
    year,
    month,
    1
  );

  // Collect Monday-Friday dates for this month.
  while (date.getMonth() === month) {
    const dayOfWeek = date.getDay();

    if (
      dayOfWeek >= 1 &&
      dayOfWeek <= 5
    ) {
      tradingDays.push(
        new Date(date)
      );
    }

    date.setDate(
      date.getDate() + 1
    );
  }

  if (!tradingDays.length) {
    return [];
  }


  /* ---------------------------------------------------------
     FORMAT DATE
  --------------------------------------------------------- */

  // Convert Date into YYYY-MM-DD.
  const formatDate = (date) =>
    date.toISOString().split("T")[0];


  /* ---------------------------------------------------------
     GROUP TRADING DAYS INTO CALENDAR WEEKS
  --------------------------------------------------------- */

  const weeks = [];
  let currentWeek = [];

  for (const tradingDay of tradingDays) {
    // Monday starts a new trading week.
    if (
      tradingDay.getDay() === 1 &&
      currentWeek.length
    ) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(tradingDay);
  }

  // Add the final week.
  if (currentWeek.length) {
    weeks.push(currentWeek);
  }


  /* ---------------------------------------------------------
     CREATE MISSION
  --------------------------------------------------------- */

  const missions = [];
  let missionNumber = 1;

  const addMission = (
    template,
    week,
    dates
  ) => {
    if (!template || !dates.length) {
      return;
    }

    missions.push({
      id:
        `${ year } -${ String(month + 1).padStart(2, "0") } -mission - ${ missionNumber } `,

      title: template.title,

      // XP remains controlled by data/trading.js.
      xp: template.xp,

      // Template ID allows Journey Map and UI logic
      // to understand the mission type.
      type: template.id,

      week,

      done: false,
    });

    missionNumber++;
  };


  /* ---------------------------------------------------------
     WEEKS 1-3
  --------------------------------------------------------- */

  const weeklyTemplates = [
    missionTemplates.firstWeek,
    missionTemplates.secondWeek,
    missionTemplates.thirdWeek,
  ];

  /*
    Process the first three trading weeks.

    Their order is always:

      Mon-Tue
      Wed-Thu
      Complete Week

    If the month starts Wednesday/Thursday/Friday,
    the unavailable earlier patterns simply do not exist.
  */

  weeks
    .slice(0, 3)
    .forEach(
      (weekDates, index) => {
        const weekNumber =
          index + 1;

        // Monday + Tuesday.
        const mondayTuesday =
          weekDates.filter(
            (day) =>
              day.getDay() === 1 ||
              day.getDay() === 2
          );

        addMission(
          missionTemplates.monTue,
          weekNumber,
          mondayTuesday
        );


        // Wednesday + Thursday.
        const wedThursday =
          weekDates.filter(
            (day) =>
              day.getDay() === 3 ||
              day.getDay() === 4
          );

        addMission(
          missionTemplates.wedThu,
          weekNumber,
          wedThursday
        );


        // Complete the week.
        addMission(
          weeklyTemplates[index],
          weekNumber,
          weekDates
        );
      }
    );


  /* ---------------------------------------------------------
     5-WEEK MONTH
  --------------------------------------------------------- */

  if (weeks.length === 5) {
    /*
      After the first three weeks, do NOT create another
      "Complete Week" mission.

      Instead, all remaining trading days are grouped into:

        Mon-Tue
        Wed-Thu
        Friday
        Last Trading Day
    */

    const remainingWeeks =
      weeks.slice(3);

    const remainingTradingDays =
      remainingWeeks.flat();

    // -----------------------------------------------
    // MONDAY + TUESDAY
    // -----------------------------------------------

    const mondayTuesday =
      remainingTradingDays.filter(
        (day) =>
          day.getDay() === 1 ||
          day.getDay() === 2
      );

    addMission(
      missionTemplates.monTue,
      4,
      mondayTuesday
    );


    // -----------------------------------------------
    // WEDNESDAY + THURSDAY
    // -----------------------------------------------

    const wedThursday =
      remainingTradingDays.filter(
        (day) =>
          day.getDay() === 3 ||
          day.getDay() === 4
      );

    addMission(
      missionTemplates.wedThu,
      4,
      wedThursday
    );


    // -----------------------------------------------
    // FRIDAY
    // -----------------------------------------------

    const fridays =
      remainingTradingDays.filter(
        (day) =>
          day.getDay() === 5
      );

    addMission(
      missionTemplates.friday,
      4,
      fridays
    );


    // -----------------------------------------------
    // LAST TRADING DAY
    // -----------------------------------------------

    const lastTradingDay =
      tradingDays[
        tradingDays.length - 1
      ];

    addMission(
      missionTemplates.lastTradingDay,
      5,
      [lastTradingDay]
    );

  } else {
    /* -------------------------------------------------------
       NORMAL MONTH
       -------------------------------------------------------

       For months with fewer than 5 trading weeks, finish
       with the final trading day mission.
    */

    const lastTradingDay =
      tradingDays[
        tradingDays.length - 1
      ];

    addMission(
      missionTemplates.lastTradingDay,
      weeks.length,
      [lastTradingDay]
    );
  }


  return missions;
}

/* =========================================================
   MONTHLY PROGRESS
========================================================= */

// Calculate completion percentage for all missions in a month.
export function calculateMonthProgress(
  missions
) {
  // A month without missions has no measurable progress.
  if (!missions.length) return 0;

  // Count completed missions.
  const completed =
    missions.filter(
      (mission) => mission.done
    ).length;

  // Return completion percentage.
  return Math.round(
    (completed / missions.length) * 100
  );
}


/* =========================================================
   MONTH XP
========================================================= */

// Calculate XP earned from completed missions in a month.
export function calculateMonthXP(
  missions
) {
  // Add XP only from completed missions.
  return missions
    .filter(
      (mission) => mission.done
    )
    .reduce(
      (total, mission) =>
        total + mission.xp,
      0
    );
}


/* =========================================================
   TOTAL MISSION XP
========================================================= */

// Calculate XP earned from completed missions across all months.
export function calculateTotalMissionXP(
  months
) {
  return months.reduce(
    (total, month) =>
      total +
      calculateMonthXP(
        month.missions
      ),
    0
  );
}


/* =========================================================
   MONTH COMPLETION
========================================================= */

// Determine whether every mission in a month is complete.
export function isMonthComplete(
  missions
) {
  // An empty month is not considered complete.
  if (!missions.length) return false;

  return missions.every(
    (mission) =>
      mission.done
  );
}


/* =========================================================
   MONTH UNLOCK SYSTEM
========================================================= */

// Determine which Trading months are unlocked.
export function calculateMonthUnlocks(
  months
) {
  return months.map(
    (month, index) => {

      // The first month is always unlocked.
      if (index === 0) {
        return {
          ...month,
          unlocked: true,
        };
      }

      // Every later month depends on the previous month.
      const previousMonth =
        months[index - 1];

      const previousComplete =
        isMonthComplete(
          previousMonth.missions
        );

      return {
        ...month,
        unlocked:
          previousComplete,
      };
    }
  );
}


/* =========================================================
   PHASE MISSION PROGRESS
========================================================= */

// Calculate completion percentage across all Trading missions.
export function calculatePhaseMissionProgress(
  months
) {
  const allMissions =
    months.flatMap(
      (month) =>
        month.missions
    );

  // No missions means no progress.
  if (!allMissions.length) {
    return 0;
  }

  const completedMissions =
    allMissions.filter(
      (mission) =>
        mission.done
    ).length;

  return Math.round(
    (
      completedMissions /
      allMissions.length
    ) * 100
  );
}

/* =========================================================
   TRADING LEVEL
========================================================= */

// Determine the current Trading level from TOTAL XP.
//
// Total XP is lifetime XP and never resets.
//
// Example:
// Total XP = 110
// Level 1 starts at 0
// Level 2 starts at 100
// Result = Level 2
export function calculateTradingLevel(
  totalXP,
  tradingLevels
) {
  // Start at the first defined level.
  let currentLevel =
    tradingLevels[0];

  // Find the highest level whose XP requirement
  // has been reached by the player's total XP.
  for (const level of tradingLevels) {
    if (
      totalXP >=
      level.xpRequired
    ) {
      currentLevel = level;
    } else {
      break;
    }
  }

  return currentLevel;
}


/* =========================================================
   TRADING LEVEL PROGRESS
========================================================= */

// Calculate XP progress INSIDE the current level.
//
// Total XP is compared against the XP threshold
// where the current level began.
//
// Example:
//
// Level 2 starts at 100 XP.
// Total XP = 110.
//
// Current Level XP = 110 - 100 = 10.
export function calculateTradingXPProgress(
  totalXP,
  tradingLevels
) {
  const currentLevel =
    calculateTradingLevel(
      totalXP,
      tradingLevels
    );

  const currentLevelIndex =
    tradingLevels.findIndex(
      (level) =>
        level.level ===
        currentLevel.level
    );

  const nextLevel =
    tradingLevels[
    currentLevelIndex + 1
    ];

  // The highest level has no next level.
  if (!nextLevel) {
    return 100;
  }

  // Total XP required when the current level begins.
  const currentLevelStartXP =
    currentLevel.xpRequired;

  // Total XP required to enter the next level.
  const nextLevelStartXP =
    nextLevel.xpRequired;

  // XP required within this level.
  const levelXPRange =
    nextLevelStartXP -
    currentLevelStartXP;

  // XP earned since entering this level.
  const currentLevelXP =
    totalXP -
    currentLevelStartXP;

  // Protect against invalid level data.
  if (levelXPRange <= 0) {
    return 100;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (
          currentLevelXP /
          levelXPRange
        ) * 100
      )
    )
  );
}


/* =========================================================
   COMPLETE TRADING LEVEL INFORMATION
========================================================= */

// Calculate every XP/Level value required by the UI.
//
// IMPORTANT:
//
// totalXP
//     = lifetime XP
//
// currentLevelXP
//     = XP earned inside the current level
//
// xpRequiredForNextLevel
//     = XP still needed from the current level's start
//       to reach the next level
//
// xpProgress
//     = currentLevelXP / xpRequiredForNextLevel
export function calculateTradingLevelData(
  totalXP,
  tradingLevels
) {
  const currentTradingLevel =
    calculateTradingLevel(
      totalXP,
      tradingLevels
    );

  const currentLevel =
    currentTradingLevel.level;

  const currentLevelIndex =
    tradingLevels.findIndex(
      (level) =>
        level.level ===
        currentLevel
    );

  const nextTradingLevel =
    tradingLevels[
    currentLevelIndex + 1
    ];

  // Total XP required to enter the current level.
  const currentLevelStartXP =
    currentTradingLevel.xpRequired;

  // XP earned since entering the current level.
  //
  // Example:
  // Total XP = 110
  // Level 2 starts at 100
  // Current Level XP = 10
  const currentLevelXP =
    Math.max(
      0,
      totalXP -
      currentLevelStartXP
    );

  // Total XP required to enter the next level.
  const nextLevelTotalXP =
    nextTradingLevel?.xpRequired ??
    totalXP;

  // XP required INSIDE the current level
  // to reach the next level.
  const xpRequiredForNextLevel =
    nextTradingLevel
      ? nextTradingLevel.xpRequired -
      currentLevelStartXP
      : 0;

  // Calculate progress within the current level.
  const xpProgress =
    calculateTradingXPProgress(
      totalXP,
      tradingLevels
    );

  return {
    // Lifetime XP.
    totalXP,

    // Current level number.
    currentLevel,

    // XP earned since entering this level.
    currentLevelXP,

    // Total XP threshold of the next level.
    nextLevelTotalXP,

    // XP needed within this level to reach next level.
    xpRequiredForNextLevel,

    // Percentage progress through current level.
    xpProgress,
  };
}