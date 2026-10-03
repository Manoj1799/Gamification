// 0-indexed months:
// Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
// Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
//
// Week mapping:
// Week 1: Days 1-7 | Week 2: Days 8-14 | Week 3: Days 15-21 | Week 4: Days 22-End

export const historicEvents = [
  // ================= 2010 (Oct - Dec) =================
  {
    id: "historic_cwg_delhi_2010",
    headline: "Delhi Commonwealth Games 2010",
    shortTitle: "Delhi CWG Opening",
    description: "The 2010 Commonwealth Games opened in New Delhi at Jawaharlal Nehru Stadium, India's largest multi-sport hosting event.",
    category: "sports",
    year: 2010,
    month: 9, // Oct (Oct 3, 2010)
    week: 1
  },

  // ================= 2011 =================
  {
    id: "historic_world_cup_2011",
    headline: "India Wins the ICC Cricket World Cup",
    shortTitle: "World Cup 2011 Champions",
    description: "Dhoni finishes off in style — India lifts the ICC Cricket World Cup at Wankhede Stadium after 28 years.",
    category: "sports",
    year: 2011,
    month: 3, // Apr (Apr 2, 2011)
    week: 1
  },
  {
    id: "historic_anna_hazare_lokpal_2011",
    headline: "Anna Hazare India Against Corruption Protests",
    shortTitle: "Jan Lokpal Movement",
    description: "Mass anti-corruption protests take over Ramlila Maidan and Jantar Mantar in New Delhi, sparking nationwide civic unrest.",
    category: "civic",
    year: 2011,
    month: 7, // Aug (Aug 16, 2011)
    week: 3
  },

  // ================= 2012 =================
  {
    id: "historic_sachin_100th_century_2012",
    headline: "Sachin Tendulkar Scores 100th International Century",
    shortTitle: "Sachin's 100th Ton",
    description: "Sachin Tendulkar makes cricket history by scoring his 100th international century against Bangladesh in Mirpur.",
    category: "sports",
    year: 2012,
    month: 2, // Mar (Mar 16, 2012)
    week: 3
  },
  {
    id: "historic_northern_grid_blackout_2012",
    headline: "Northern Grid Power Collapse",
    shortTitle: "Massive 2012 India Blackout",
    description: "The largest electrical blackout in human history hits Delhi NCR and Northern India, leaving over 600 million people without power.",
    category: "national",
    year: 2012,
    month: 6, // Jul (Jul 30-31, 2012)
    week: 4
  },
  {
    id: "historic_nirbhaya_protests_2012",
    headline: "Nirbhaya Nationwide & Raisina Hill Protests",
    shortTitle: "Delhi Anti-Rape Protests",
    description: "Thousands march towards India Gate and Raisina Hill in unprecedented student-led demonstrations demanding strict anti-rape laws.",
    category: "civic",
    year: 2012,
    month: 11, // Dec (Dec 16-23, 2012)
    week: 3
  },

  // ================= 2013 =================
  {
    id: "historic_champions_trophy_2013",
    headline: "India Wins ICC Champions Trophy",
    shortTitle: "Champions Trophy 2013",
    description: "MS Dhoni becomes the first captain in world cricket history to win all three ICC white-ball trophies after defeating England.",
    category: "sports",
    year: 2013,
    month: 5, // Jun (Jun 23, 2013)
    week: 4
  },
  {
    id: "historic_mangalyaan_launch_2013",
    headline: "ISRO Launches Mars Orbiter Mission (Mangalyaan)",
    shortTitle: "Mangalyaan Launch",
    description: "ISRO successfully launches PSLV-C25 carrying India's first interplanetary mission toward Mars from Sriharikota.",
    category: "science",
    year: 2013,
    month: 10, // Nov (Nov 5, 2013)
    week: 1
  },
  {
    id: "historic_sachin_retirement_2013",
    headline: "Sachin Tendulkar Retires From International Cricket",
    shortTitle: "Sachin's Farewell",
    description: "Sachin Tendulkar delivers his iconic emotional farewell speech after playing his 200th and final Test match at Wankhede Stadium.",
    category: "sports",
    year: 2013,
    month: 10, // Nov (Nov 16, 2013)
    week: 3
  },

  // ================= 2014 =================
  {
    id: "historic_modi_election_2014",
    headline: "Narendra Modi Wins Historic Lok Sabha Mandate",
    shortTitle: "2014 Election Victory",
    description: "The BJP-led NDA wins an absolute single-party majority in the 2014 general election; Narendra Modi is sworn in as Prime Minister.",
    category: "politics",
    year: 2014,
    month: 4, // May (May 16, 2014)
    week: 3
  },
  {
    id: "historic_mangalyaan_orbit_2014",
    headline: "ISRO Enters Mars Orbit on Debut Attempt",
    shortTitle: "Mars Orbit Insertion",
    description: "India becomes the first Asian nation to reach Mars orbit, and the first nation in the world to do so on its maiden attempt.",
    category: "science",
    year: 2014,
    month: 8, // Sep (Sep 24, 2014)
    week: 4
  }
];