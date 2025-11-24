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

    // add anything your gameplay mutates:
    // hero HP, overlord HP, scenario stack, countdown timers, villain positions, etc.
};