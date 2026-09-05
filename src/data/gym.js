
// ========================================================= 
// GYM PROGRAM CONFIGURATION 
// ========================================================= 
// This file controls the Gym program. 
// Days and exercises are intentionally NOT editable inside 
// the app. Change this file directly whenever the program 
// needs to be modified. 
// 
// IMPORTANT: 
// defaultWeight, defaultSets and defaultReps are only the 
// starting values for a new session. 
// Historical workout sessions will be stored separately. 
// ========================================================= 

const gymProgram = {
  monday: {
    name: "Monday",
    exercises: [
      {
        id: "chest-press",
        name: "Machine Chest Press",
        defaultWeight: 5,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "shoulder-press",
        name: "Machine Shoulder Press",
        defaultWeight: 2.5,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "lateral raise",
        name: "Dumbell Lateral Raise",
        defaultWeight: 5,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "triceps-pushdown",
        name: "Cable Trcieps Pushdown",
        defaultWeight: 20,
        defaultSets: 3,
        defaultReps: 10,
      },
    ],
  },

  tuesday: {
    name: "Tuesday",
    exercises: [
      {
        id: "lat-pulldown",
        name: "Lat Pulldown",
        defaultWeight: 20,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "chest-row",
        name: "Chest Supported Row",
        defaultWeight: 10,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "pec-deck",
        name: "Reverse Pec Deck",
        defaultWeight: 10,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "hammer-curl",
        name: "Hammer Curl",
        defaultWeight: 5,
        defaultSets: 3,
        defaultReps: 10,
      },
    ],
  },

  wednesday: {
    name: "Wednesday",
    exercises: [
      {
        id: "leg-press",
        name: "Leg Press",
        defaultWeight: 15,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "leg-extension",
        name: "Leg Extension",
        defaultWeight: 15,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "romanian-deadlift",
        name: "Romanian Deadlift Barbell Rod",
        defaultWeight: 5,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "calf-raise",
        name: "Calf Raise",
        defaultWeight: 30,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "abs-crunch",
        name: "Decline Abs Bench Crunch",
        defaultWeight: 1,
        defaultSets: 3,
        defaultReps: 10,
      },
    ],
  },

  thursday: {
    name: "Thursday",
    exercises: [
      {
        id: "dumbell-press",
        name: "Dumbell Bench Press",
        defaultWeight: 2.5,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "assisted-pullup",
        name: "Assisted Pull Up",
        defaultWeight: 1,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "dumbell-curl",
        name: "Dumbell Bicep Curl",
        defaultWeight: 5,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "overhead-triceps",
        name: "Overhead Cable Triceps Extension",
        defaultWeight: 20,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "lateral raise",
        name: "Dumbell Lateral Raise",
        defaultWeight: 5,
        defaultSets: 3,
        defaultReps: 10,
      },
    ],
  },

  friday: {
    name: "Friday",
    exercises: [
      {
        id: "leg-press2",
        name: "Leg Press (High and Wide Foot Placement)",
        defaultWeight: 1,
        defaultSets: 3,
        defaultReps: 10,
      },

      {
        id: "romanian-deadlift2",
        name: "Romanian Deadlift (Dumbells)",
        defaultWeight: 1,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "calf-raise",
        name: "Calf Raise",
        defaultWeight: 30,
        defaultSets: 3,
        defaultReps: 10,
      },
      {
        id: "abs-crunch",
        name: "Decline Abs Bench Crunch",
        defaultWeight: 1,
        defaultSets: 3,
        defaultReps: 10,
      },

    ],
  },
};

export default gymProgram;
