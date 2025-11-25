export const gameState = {
    heroes: [],
    overlords: [],
    tactics: [],
    villainDeck: [],
    villainDeckPointer: 0,
    cities: [],         // your board state (villain positions etc.)
    heroesByPlayer: [],
    playerUsernames: [],
    turn: 1,
    phase: "start",
    rngSeed: null,
    turnCounter: 0,   // total turns elapsed since start
    heroTurnIndex: 0, // whose turn it is
};

export const CITY_EXIT_UPPER = 0; // Star
export const CITY_EXIT_LOWER = 1;

export const CITY_5_UPPER = 2; // Coast
export const CITY_5_LOWER = 3;

export const CITY_4_UPPER = 4; // Keystone
export const CITY_4_LOWER = 5;

export const CITY_3_UPPER = 6; // Central
export const CITY_3_LOWER = 7;

export const CITY_2_UPPER = 8; // Metropolis
export const CITY_2_LOWER = 9;

export const CITY_ENTRY_UPPER = 10; // Gotham
export const CITY_ENTRY_LOWER = 11;