export const yearlyVibeMusic = {
    2010: {
      year: 2010,
      vibeTagline: "The Era of Item Anthems & Soulful Bollywood",
      songs: [
        {
          id: "song_2010_1",
          title: "Sheila Ki Jawani",
          artist: "Sunidhi Chauhan, Vishal Dadlani",
          movie: "Tees Maar Khan",
          audioSrc: "/audio/themes/2010_sheila_ki_jawani.mp3",
          vibeDescription: "The absolute dance floor explosion across Delhi clubs and wedding seasons late 2010."
        },
        {
          id: "song_2010_2",
          title: "Pee Loon",
          artist: "Mohit Chauhan",
          movie: "Once Upon a Time in Mumbaai",
          audioSrc: "/audio/themes/2010_pee_loon.mp3",
          vibeDescription: "The definitive romantic loop on Delhi NCR radio channels and ringtones."
        }
      ]
    },
  
    2011: {
      year: 2011,
      vibeTagline: "North Campus Rock & Punjabi Pop Invasion",
      songs: [
        {
          id: "song_2011_1",
          title: "Sadda Haq",
          artist: "Mohit Chauhan, A.R. Rahman",
          movie: "Rockstar",
          audioSrc: "/audio/themes/2011_sadda_haq.mp3",
          vibeDescription: "Shot right at DU North Campus; the raw youth and rebellion anthem of 2011 in Delhi."
        },
        {
          id: "song_2011_2",
          title: "Brown Rang",
          artist: "Yo Yo Honey Singh",
          album: "International Villager",
          audioSrc: "/audio/themes/2011_brown_rang.mp3",
          vibeDescription: "The birth of the modern NCR car-stereo culture — blasted from every Swift and Scorpio."
        }
      ]
    },
  
    2012: {
      year: 2012,
      vibeTagline: "Cocktail Nights & Funky Beats",
      songs: [
        {
          id: "song_2012_1",
          title: "Tumhi Ho Bandhu",
          artist: "Neeraj Shridhar, Kavita Seth",
          movie: "Cocktail",
          audioSrc: "/audio/themes/2012_tumhi_ho_bandhu.mp3",
          vibeDescription: "The friendship and party anthem that dominated every college trip and fest."
        },
        {
          id: "song_2012_2",
          title: "Angreji Beat",
          artist: "Yo Yo Honey Singh, Gippy Grewal",
          movie: "Cocktail / International Villager",
          audioSrc: "/audio/themes/2012_angreji_beat.mp3",
          vibeDescription: "Unmatched club frenzy that defined Delhi-NCR nightlife through 2012."
        }
      ]
    },
  
    2013: {
      year: 2013,
      vibeTagline: "The Golden Year: Aashiqui Fever & YJHD Madness",
      songs: [
        {
          id: "song_2013_1",
          title: "Badtameez Dil",
          artist: "Benny Dayal, Shefali Alvares",
          movie: "Yeh Jawaani Hai Deewani",
          audioSrc: "/audio/themes/2013_badtameez_dil.mp3",
          vibeDescription: "The peak youthful energy anthem; impossible to attend any event without this playing."
        },
        {
          id: "song_2013_2",
          title: "Tum Hi Ho",
          artist: "Arijit Singh, Mithoon",
          movie: "Aashiqui 2",
          audioSrc: "/audio/themes/2013_tum_hi_ho.mp3",
          vibeDescription: "The song that introduced the Arijit Singh era; played constantly on every speaker."
        }
      ]
    },
  
    2014: {
      year: 2014,
      vibeTagline: "Acoustic Melodies & Commercial Club Hits",
      songs: [
        {
          id: "song_2014_1",
          title: "Galliyan",
          artist: "Ankit Tiwari",
          movie: "Ek Villain",
          audioSrc: "/audio/themes/2014_galliyan.mp3",
          vibeDescription: "The runaway melodic hit of the monsoon and late year across all radio stations."
        },
        {
          id: "song_2014_2",
          title: "Baby Doll",
          artist: "Kanika Kapoor, Meet Bros Anjjan",
          movie: "Ragini MMS 2",
          audioSrc: "/audio/themes/2014_baby_doll.mp3",
          vibeDescription: "The biggest viral dance hit of 2014, owning wedding seasons and dancefloors."
        }
      ]
    }
  };
  
  /**
   * Returns the yearly songs and vibe tagline for a specific year.
   * @param {number} year - e.g. 2011
   * @returns {object}
   */
  export function getYearlyVibe(year) {
    return yearlyVibeMusic[year] || {
      year,
      vibeTagline: "Standard Timeline Vibe",
      songs: []
    };
  }