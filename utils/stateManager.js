// stateManager.js
const STORAGE_KEY = "overlordsGameState_v1";

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
    localStorage.removeItem(STORAGE_KEY);
}
