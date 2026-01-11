// Multiplayer stubs removed. Lobby creation/join can still use server endpoints,
// but all gameplay sync is disabled. This intentionally returns minimal defaults.

export function configureMultiplayer() { return; }
export function setOnStateUpdated() { return; }
export function isPlayersTurn() { return false; }
export function playerOwnsHero() { return false; }
export async function fetchGameStateSnapshot() { return null; }
export function setMultiplayerVersion() { return; }
export function isMultiplayerReady() { return false; }
export async function pushGameState() { return null; }
export async function forceServerResync() { return null; }
export function getMultiplayerContext() { return {}; }
