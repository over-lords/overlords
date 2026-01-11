const DEFAULT_POLL_MS = 2500;
const DEFAULT_API_BASE = "https://overlords-app-43e6e621c6d2.herokuapp.com";

let ctx = {
  key: null,
  playerId: null,
  host: null,
  heroOwners: {},
  version: 0,
  apiBase: null,
  enabled: false
};

let pollTimer = null;
let onStateUpdated = null;

function apiBase() {
  if (ctx.apiBase) return ctx.apiBase;
  if (typeof window !== "undefined" && window.MULTI_API_BASE) return window.MULTI_API_BASE;
  if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin !== "file://") {
    return `${window.location.origin}`;
  }
  return DEFAULT_API_BASE;
}

function getActiveHeroId(state) {
  const idx = typeof state?.heroTurnIndex === "number" ? state.heroTurnIndex : 0;
  const heroes = Array.isArray(state?.heroes) ? state.heroes : [];
  return heroes[idx] != null ? heroes[idx] : null;
}

export function playerOwnsHero(playerId, heroId, heroOwners = {}, host = null) {
  if (!playerId) return false;
  if (host && playerId === host) return true;
  const owned = heroOwners[playerId] || heroOwners[String(playerId)];
  return Array.isArray(owned) && owned.some(h => String(h) === String(heroId));
}

export function isPlayersTurn(state, playerId, heroOwners = {}, host = null) {
  const heroId = getActiveHeroId(state);
  if (heroId == null) return false;
  return playerOwnsHero(playerId, heroId, heroOwners, host);
}

function applyIncomingState(state, version, heroOwners) {
  if (version != null) ctx.version = version;
  if (heroOwners && typeof heroOwners === "object") {
    ctx.heroOwners = heroOwners;
  }
  if (typeof onStateUpdated === "function") {
    try { onStateUpdated(state, { version: ctx.version, heroOwners: ctx.heroOwners }); } catch (e) {
      console.warn("[multiplayer] onStateUpdated handler failed", e);
    }
  }
}

async function pollOnce() {
  if (!ctx.enabled || !ctx.key) return;
  const base = apiBase();
  if (!base) return;
  try {
    const res = await fetch(`${base}/api/games/${encodeURIComponent(ctx.key)}/poll?since=${encodeURIComponent(ctx.version)}`);
    const json = await res.json();
    if (!res.ok) {
      console.warn("[multiplayer] Poll failed", json || res.statusText);
      return;
    }
    if (!json.noop && json.state) {
      applyIncomingState(json.state, json.version, json.heroOwners);
    } else if (typeof json.version === "number" && json.version > ctx.version) {
      ctx.version = json.version;
    }
  } catch (e) {
    console.warn("[multiplayer] Poll error", e);
  }
}

function startPollLoop(intervalMs = DEFAULT_POLL_MS) {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(pollOnce, intervalMs);
  // Kick immediately
  pollOnce();
}

export async function fetchGameStateSnapshot(key) {
  const base = apiBase();
  if (!base || !key) return null;
  try {
    const res = await fetch(`${base}/api/games/${encodeURIComponent(key)}/state`);
    const json = await res.json();
    if (!res.ok) {
      console.warn("[multiplayer] fetchGameStateSnapshot failed", json || res.statusText);
      return null;
    }
    return json;
  } catch (e) {
    console.warn("[multiplayer] fetchGameStateSnapshot error", e);
    return null;
  }
}

export function configureMultiplayer(options = {}) {
  ctx = {
    ...ctx,
    ...options,
    heroOwners: options.heroOwners || ctx.heroOwners || {},
    version: typeof options.version === "number" ? options.version : ctx.version || 0,
    enabled: options.enabled !== false
  };
  if (!ctx.enabled) {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
    return;
  }
  startPollLoop(options.pollIntervalMs || DEFAULT_POLL_MS);
}

export function setOnStateUpdated(handler) {
  onStateUpdated = handler;
}

export async function pushGameState(state) {
  if (!ctx.enabled || !ctx.key) return null;
  const base = apiBase();
  if (!base) return null;
  const body = {
    key: ctx.key,
    playerId: ctx.playerId || ctx.host || "Unknown",
    clientVersion: ctx.version,
    state,
    heroOwners: ctx.heroOwners
  };
  try {
    const res = await fetch(`${base}/api/games/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) {
      if (res.status === 409 && json?.state) {
        // Stale client; accept server state
        applyIncomingState(json.state, json.expected ?? json.version, json.heroOwners);
      } else {
        const snap = await fetchGameStateSnapshot(ctx.key);
        if (snap?.state) {
          applyIncomingState(snap.state, snap.version, snap.heroOwners);
        }
      }
      console.warn("[multiplayer] Push failed", json || res.statusText);
      return null;
    }
    if (json.state) {
      applyIncomingState(json.state, json.version, json.heroOwners);
    } else if (typeof json.version === "number") {
      ctx.version = json.version;
    }
    return json;
  } catch (e) {
    console.warn("[multiplayer] Push error", e);
    return null;
  }
}

export function getMultiplayerContext() {
  return { ...ctx };
}
