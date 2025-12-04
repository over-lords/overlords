// stateManager.js
const STORAGE_KEY = "overlordsGameState_v1";

import { henchmen } from '../data/henchmen.js';
import { villains } from '../data/villains.js';

// Save entire game state object
export function saveGameState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn("Failed to save game state", e);
    }
}

// Load if it exists
export function loadGameState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn("Failed to load game state", e);
        return null;
    }
}

// Wipe save
export function clearGameState() {

    const keysToClear = [
        STORAGE_KEY,              // main saved blob
        "villainDeck",
        "villainDeckPointer",
        "heroTurnIndex",
        "turnCounter",
        "revealedTopVillain",
        "cities",
        "heroData",
        "heroesByPlayer",
        "playerUsernames"
    ];

    keysToClear.forEach(k => localStorage.removeItem(k));
}

export function restoreCapturedBystandersIntoCardData(gameState) {
    if (!Array.isArray(gameState.cities)) return;

    // Clear all dynamic captures from cardData (henchmen/villains)
    henchmen.forEach(h => delete h.capturedBystanders);
    villains.forEach(v => delete v.capturedBystanders);

    // Re-apply captured bystanders from state.cities
    gameState.cities.forEach(entry => {
        if (!entry || !Array.isArray(entry.capturedBystanders)) return;

        const foeId = String(entry.id);
        const foeCard =
            henchmen.find(h => String(h.id) === foeId) ||
            villains.find(v => String(v.id) === foeId);

        if (!foeCard) return;

        // Restore the list on the cardData object
        foeCard.capturedBystanders = entry.capturedBystanders.map(b => ({
            id: b.id,
            name: b.name
        }));
    });
}