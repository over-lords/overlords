const DEFAULT_POLL_MS = 2500;
const DEFAULT_API_BASE = "https://overlords-app-43e6e621c6d2.herokuapp.com";

let ctx = {
  key: null,
  playerId: null,
  host: null,
  heroOwners: {},
  version: 0,
  apiBase: null,
  enabled: false,
  ready: false
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

function resolveHeroOwners(heroOwners = {}, state = {}) {
  if (heroOwners && Object.keys(heroOwners).length) return heroOwners;
  const players = Array.isArray(state.playerUsernames) ? state.playerUsernames : [];
  const heroesByPlayer = Array.isArray(state.heroesByPlayer) ? state.heroesByPlayer : [];
  const derived = {};
  players.forEach((p, idx) => {
    if (!p) return;
    const list = heroesByPlayer[idx];
    if (Array.isArray(list)) {
      derived[p] = list.map(String);
    }
  });
  if (Object.keys(derived).length) return derived;
  // Fallback: if only one player known, assign all heroes
  const heroes = Array.isArray(state.heroes) ? state.heroes.map(String) : [];
  if (players.length === 1 && heroes.length) {
    derived[players[0]] = heroes;
    return derived;
  }
  return {};
}

export function playerOwnsHero(playerId, heroId, heroOwners = {}, host = null, state = {}) {
  let owners = resolveHeroOwners(heroOwners, state);
  // If still empty, assign all heroes to the provided playerId so someone can act
  if ((!owners || Object.keys(owners).length === 0) && playerId && Array.isArray(state?.heroes)) {
    owners = { [playerId]: state.heroes.map(String) };
  }
  if (!owners || Object.keys(owners).length === 0) return false;
  const pid = playerId || (Array.isArray(state.playerUsernames) ? state.playerUsernames[0] : null);
  if (!pid) return false;
  if (host && pid === host) return true;
  const owned = owners[pid] || owners[String(pid)];
  return Array.isArray(owned) && owned.some(h => String(h) === String(heroId));
}

export function isPlayersTurn(state, playerId, heroOwners = {}, host = null) {
  const heroId = getActiveHeroId(state);
  if (heroId == null) return false;
  return playerOwnsHero(playerId, heroId, heroOwners, host, state);
}

function applyIncomingState(state, version, heroOwners) {
  if (typeof version === "number") {
    ctx.version = version;
    ctx.ready = true;
    if (typeof window !== "undefined" && window.gameState) {
      try { window.gameState.serverVersion = version; } catch (_) {}
    }
  }
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
    version: typeof options.version === "number"
      ? options.version
      : (ctx.version != null ? ctx.version : ((typeof window !== "undefined" && window.gameState?.serverVersion != null) ? window.gameState.serverVersion : 0)),
    enabled: options.enabled !== false
  };
  ctx.ready = options.versionFromServer === true;
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

export function setMultiplayerVersion(version) {
  if (typeof version === "number") {
    ctx.version = version;
    ctx.ready = true;
  }
}

export function isMultiplayerReady() {
  return !!ctx.ready;
}

export async function pushGameState(state) {
  if (!ctx.enabled || !ctx.key) return null;
  if (!ctx.ready) {
    console.warn("[multiplayer] Suppressing push because sync not ready.");
    return null;
  }
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
        const newVersion = json.expected ?? json.version;
        if (typeof newVersion === "number") {
          ctx.version = newVersion;
          if (typeof window !== "undefined") {
            try { window.gameState.serverVersion = newVersion; } catch (_) {}
          }
        }
        applyIncomingState(json.state, newVersion, json.heroOwners);
        return null;
      }
      const snap = await fetchGameStateSnapshot(ctx.key);
      if (snap?.state) {
        applyIncomingState(snap.state, snap.version, snap.heroOwners);
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
