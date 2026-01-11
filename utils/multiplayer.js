const DEFAULT_POLL_MS = 1000;
const DEFAULT_API_BASE = "https://overlords-app-43e6e621c6d2.herokuapp.com";

let ctx = {
  key: null,
  playerId: null,
  host: null,
  heroOwners: {},
  version: 0,
  apiBase: null,
  enabled: false,
  ready: false,
  lastState: null,
  seeds: {}
};

let pollTimer = null;
let onStateUpdated = null;
let lastPushedState = null;
let hostCommandTimer = null;

function deepClone(obj) {
  try { return JSON.parse(JSON.stringify(obj)); } catch (_) { return null; }
}

function shallowDiff(prev = {}, next = {}) {
  const delta = {};
  const keys = new Set([...Object.keys(prev || {}), ...Object.keys(next || {})]);
  keys.forEach(k => {
    const a = prev ? prev[k] : undefined;
    const b = next ? next[k] : undefined;
    const same = JSON.stringify(a) === JSON.stringify(b);
    if (!same) delta[k] = b;
  });
  return delta;
}

function validateLocalDecksAgainstSeeds(state, seeds) {
  if (!state || !seeds || !Object.keys(seeds).length) return true;
  const decks = [
    { key: "villainDeck", seed: seeds.villainDeck, deck: state.villainDeck },
    { key: "enemyAllyDeck", seed: seeds.enemyAllyDeck, deck: state.enemyAllyDeck },
    { key: "bystanderDeck", seed: seeds.bystanderDeck, deck: state.bystanderDeck },
    { key: "mightDeck", seed: seeds.mightDeck, deck: state.mightDeck },
    { key: "scenarioDeck", seed: seeds.scenarioDeck, deck: state.scenarioDeck }
  ];
  for (const d of decks) {
    if (Array.isArray(d.seed) && Array.isArray(d.deck)) {
      const same = d.seed.length === d.deck.length && d.seed.every((v, idx) => String(v) === String(d.deck[idx]));
      if (!same) {
        console.warn(`[multiplayer] Local ${d.key} diverged from seed; requesting resync.`);
        return false;
      }
    }
  }
  return true;
}

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
  return derived;
}

export function playerOwnsHero(playerId, heroId, heroOwners = {}, host = null, state = {}) {
  const owners = resolveHeroOwners(heroOwners, state);
  const pid = playerId || host || (Array.isArray(state.playerUsernames) ? state.playerUsernames[0] : null);
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

function applyIncomingState(state, version, heroOwners, host) {
  if (typeof version === "number") {
    ctx.version = version;
    ctx.ready = true;
    if (typeof window !== "undefined" && window.gameState) {
      try { window.gameState.serverVersion = version; } catch (_) {}
    }
  }
  if (heroOwners && typeof heroOwners === "object") {
    ctx.heroOwners = heroOwners;
  }
  if (host) {
    ctx.host = host;
    if (typeof window !== "undefined") window.MULTI_HOST = host;
  }
  if (state && state.seeds) {
    ctx.seeds = state.seeds;
  }
  if (state) {
    try { ctx.lastState = JSON.parse(JSON.stringify(state)); } catch (_) { ctx.lastState = null; }
  }
  if (typeof onStateUpdated === "function") {
    try { onStateUpdated(state, { version: ctx.version, heroOwners: ctx.heroOwners, host: ctx.host }); } catch (e) {
      console.warn("[multiplayer] onStateUpdated handler failed", e);
    }
  }
}

async function pollOnce() {
  if (!ctx.enabled || !ctx.key) return;
  const base = apiBase();
  if (!base) return;
  try {
    const player = ctx.playerId || ctx.host || null;
    const res = await fetch(`${base}/api/games/${encodeURIComponent(ctx.key)}/poll?since=${encodeURIComponent(ctx.version)}${player ? `&player=${encodeURIComponent(player)}` : ""}`);
    const json = await res.json();
    if (!res.ok) {
      console.warn("[multiplayer] Poll failed", json || res.statusText);
      return;
    }
    if (!json.noop && json.state) {
      applyIncomingState({ ...json.state, seeds: json.seeds }, json.version, json.heroOwners, json.host);
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
  pollOnce();
}

export async function fetchGameStateSnapshot(key) {
  const base = apiBase();
  if (!base || !key) return null;
  try {
    const ctx = getMultiplayerContext ? getMultiplayerContext() : null;
    const player = ctx?.playerId || ctx?.host || null;
    const res = await fetch(`${base}/api/games/${encodeURIComponent(key)}/state${player ? `?player=${encodeURIComponent(player)}` : ""}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`status ${res.status}`);
    const json = await res.json();
    return json;
  } catch (e) {
    // Swallow transient errors; caller can retry
    return null;
  }
}

export function configureMultiplayer(options = {}) {
  ctx = {
    ...ctx,
    ...options,
    heroOwners: options.heroOwners || ctx.heroOwners || {},
    host: options.host || ctx.host || null,
    playerId: options.playerId || ctx.playerId || null,
    version: typeof options.version === "number"
      ? options.version
      : (ctx.version != null ? ctx.version : ((typeof window !== "undefined" && window.gameState?.serverVersion != null) ? window.gameState.serverVersion : 0)),
    apiBase: options.apiBase || ctx.apiBase || null,
    seeds: options.seeds || ctx.seeds || {},
    enabled: options.enabled !== false
  };
  ctx.ready = options.versionFromServer === true;
  if (options.state) {
    try { ctx.lastState = JSON.parse(JSON.stringify(options.state)); } catch (_) { ctx.lastState = null; }
    if (options.state.seeds && !Object.keys(ctx.seeds || {}).length) {
      ctx.seeds = options.state.seeds;
    }
  }
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

export async function enqueueCommand(action, payload = {}) {
  if (!ctx.enabled || !ctx.key || !action) return null;
  const base = apiBase();
  if (!base) return null;
  const body = {
    playerId: ctx.playerId || ctx.host || "Unknown",
    action,
    payload
  };
  try {
    const res = await fetch(`${base}/api/games/${encodeURIComponent(ctx.key)}/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) {
      console.warn("[multiplayer] enqueueCommand failed", json || res.statusText);
      return null;
    }
    return json;
  } catch (e) {
    console.warn("[multiplayer] enqueueCommand error", e);
    return null;
  }
}

export async function pushGameState(state) {
  if (!ctx.enabled || !ctx.key) return null;
  if (!ctx.ready) {
    console.warn("[multiplayer] Suppressing push because sync not ready.");
    return null;
  }
  const base = apiBase();
  if (!base) return null;

  // Validate against seeds if present (avoid pushing diverged decks)
  const seeds = ctx.seeds || {};
  const seedsMissing = !seeds || !Object.keys(seeds).length;
  // If server has no seeds yet and we are host, attach current deck order as seeds to establish authority
  const seedsToAttach = seedsMissing ? {
    villainDeck: Array.isArray(state?.villainDeck) ? state.villainDeck : undefined,
    enemyAllyDeck: Array.isArray(state?.enemyAllyDeck) ? state.enemyAllyDeck : undefined,
    bystanderDeck: Array.isArray(state?.bystanderDeck) ? state.bystanderDeck : undefined,
    mightDeck: Array.isArray(state?.mightDeck) ? state.mightDeck : undefined,
    scenarioDeck: Array.isArray(state?.scenarioDeck) ? state.scenarioDeck : undefined
  } : null;

  if (seeds && Object.keys(seeds).length) {
    const decksToCheck = [
      { key: "villainDeck", seed: seeds.villainDeck, incoming: Array.isArray(state?.villainDeck) ? state.villainDeck : null },
      { key: "enemyAllyDeck", seed: seeds.enemyAllyDeck, incoming: Array.isArray(state?.enemyAllyDeck) ? state.enemyAllyDeck : null },
      { key: "bystanderDeck", seed: seeds.bystanderDeck, incoming: Array.isArray(state?.bystanderDeck) ? state.bystanderDeck : null },
      { key: "mightDeck", seed: seeds.mightDeck, incoming: Array.isArray(state?.mightDeck) ? state.mightDeck : null },
      { key: "scenarioDeck", seed: seeds.scenarioDeck, incoming: Array.isArray(state?.scenarioDeck) ? state.scenarioDeck : null }
    ];
    for (const deck of decksToCheck) {
      const { seed, incoming, key } = deck;
      if (seed && incoming) {
        const same = seed.length === incoming.length && seed.every((v, idx) => String(v) === String(incoming[idx]));
        if (!same) {
          console.warn(`[multiplayer] Local ${key} diverged from seed; forcing resync instead of push.`);
          await forceServerResync(ctx.key);
          return null;
        }
      }
    }
  }

  // Ensure pointers do not rewind
  if (ctx.lastState) {
    const ptrChecks = [
      { field: "villainDeckPointer", prev: ctx.lastState.villainDeckPointer, next: state.villainDeckPointer, len: state.villainDeck?.length, name: "villain deck" },
      { field: "enemyAllyDeckPointer", prev: ctx.lastState.enemyAllyDeckPointer, next: state.enemyAllyDeckPointer, len: state.enemyAllyDeck?.length, name: "enemy/ally deck" },
      { field: "bystanderDeckPointer", prev: ctx.lastState.bystanderDeckPointer, next: state.bystanderDeckPointer, len: state.bystanderDeck?.length, name: "bystander deck" },
      { field: "mightDeckPointer", prev: ctx.lastState.mightDeckPointer, next: state.mightDeckPointer, len: state.mightDeck?.length, name: "might deck" },
      { field: "scenarioDeckPointer", prev: ctx.lastState.scenarioDeckPointer, next: state.scenarioDeckPointer, len: state.scenarioDeck?.length, name: "scenario deck" }
    ];
    for (const p of ptrChecks) {
      const prevVal = Number.isFinite(p.prev) ? p.prev : 0;
      const nextVal = Number.isFinite(p.next) ? p.next : prevVal;
      const len = Number.isFinite(p.len) ? p.len : null;
      if (nextVal < prevVal) {
        console.warn(`[multiplayer] Pointer rewind detected on ${p.name}; clamping to prev (${prevVal}).`);
        state[p.field] = prevVal;
      }
      if (len != null && nextVal > len) {
        console.warn(`[multiplayer] Pointer overflow detected on ${p.name}; clamping to len (${len}).`);
        state[p.field] = len;
      }
    }
  }

  // Ensure turn timer deadline exists when pushing in multiplayer
  if (state && typeof state.turnTimerDeadline !== "number" && Number.isFinite(state.turnTimerRemaining)) {
    state.turnTimerDeadline = Date.now() + Math.max(0, state.turnTimerRemaining) * 1000;
  }

   const prior = ctx.lastState || lastPushedState || null;
   const delta = prior ? shallowDiff(prior, state) : state;

  const body = {
    key: ctx.key,
    playerId: ctx.playerId || ctx.host || "Unknown",
    clientVersion: ctx.version,
    stateDelta: delta,
    fullState: state,
    heroOwners: ctx.heroOwners,
    seeds: seedsMissing ? seedsToAttach : undefined
  };
  try {
    const res = await fetch(`${base}/api/games/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) {
      const snap = await fetchGameStateSnapshot(ctx.key);
      if (snap?.state) {
        applyIncomingState(snap.state, snap.version, snap.heroOwners, snap.host);
      }
      console.warn("[multiplayer] Push failed", json || res.statusText);
      return null;
    }
    if (json.state) {
      applyIncomingState(json.state, json.version, json.heroOwners, json.host);
    } else if (typeof json.version === "number") {
      ctx.version = json.version;
    }
    try { lastPushedState = deepClone(state); ctx.lastState = deepClone(state); } catch (_) {}
    return json;
  } catch (e) {
    console.warn("[multiplayer] Push error", e);
    return null;
  }
}

export async function forceServerResync(key = ctx.key) {
  if (!key) return null;
  const snap = await fetchGameStateSnapshot(key);
  if (snap && snap.state) {
    applyIncomingState(snap.state, snap.version, snap.heroOwners, snap.host);
  }
  return snap;
}

export function getMultiplayerContext() {
  return { ...ctx };
}

export async function pollHostCommands(handler) {
  if (!ctx.enabled || !ctx.key) return;
  const base = apiBase();
  if (!base) return;
  if (!ctx.host || !ctx.playerId || String(ctx.playerId) !== String(ctx.host)) return;
  try {
    const res = await fetch(`${base}/api/games/${encodeURIComponent(ctx.key)}/commands?playerId=${encodeURIComponent(ctx.playerId)}`);
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      console.warn("[multiplayer] command poll failed", json || res.statusText);
      return;
    }
    const json = await res.json();
    const commands = Array.isArray(json.commands) ? json.commands : [];
    for (const cmd of commands) {
      try {
        if (typeof handler === "function") {
          await handler(cmd);
        }
      } catch (e) {
        console.warn("[multiplayer] command handler failed", e);
      }
    }
  } catch (e) {
    console.warn("[multiplayer] command poll error", e);
  }
}

export function startHostCommandLoop(handler, intervalMs = 750) {
  if (hostCommandTimer) clearInterval(hostCommandTimer);
  hostCommandTimer = setInterval(() => pollHostCommands(handler), intervalMs);
}
