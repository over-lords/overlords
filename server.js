const express = require("express");
const compression = require("compression");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const lobbies = new Map(); // key -> lobby record
const games = new Map();   // key -> in-progress game record
const LOBBY_TTL_MS = 1000 * 60 * 30; // 30 minutes
const LOBBY_STALE_MS = 1000 * 2; // 2 seconds without lobby heartbeat
const LOBBY_PLAYER_STALE_MS = 1000 * 2; // 2 seconds without player poll/heartbeat
const GAME_TTL_MS = 1000 * 60 * 60 * 3; // 3 hours
const GAME_STALE_MS = 1000 * 2; // 2 seconds without poll/heartbeat

// Middleware
app.use(compression());
app.use(express.json({ limit: "1mb" }));

const ALLOWED_ORIGINS = new Set([
  "https://overlords.app",
  "https://over-lords.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:5500"
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Static assets
app.use("/Public", express.static(path.join(__dirname, "Public"), {
  maxAge: "1y",
  immutable: true
}));
app.use(express.static(__dirname, { maxAge: "1h" }));

function pruneStaleLobbies() {
  const now = Date.now();
  for (const [key, lobby] of lobbies.entries()) {
    if (now - lobby.updatedAt > LOBBY_TTL_MS) {
      console.log(`[lobbies] Pruning stale lobby ${key}`);
      lobbies.delete(key);
    }
  }
}

function pruneStalePlayers(lobby) {
  if (!lobby || !Array.isArray(lobby.players)) return;
  const now = Date.now();
  lobby.playerLastSeen = lobby.playerLastSeen || {};
  const keep = [];
  for (const p of lobby.players) {
    const last = lobby.playerLastSeen[p];
    if (last && now - last <= LOBBY_PLAYER_STALE_MS) {
      keep.push(p);
    } else {
      delete lobby.playerLastSeen[p];
    }
  }
  lobby.players = keep;
}

function pruneStaleGames() {
  const now = Date.now();
  for (const [key, game] of games.entries()) {
    if (!game || now - (game.updatedAt || 0) > GAME_TTL_MS) {
      console.log(`[games] Pruning stale game ${key}`);
      games.delete(key);
    }
  }
}

function getActiveHeroId(state) {
  if (!state) return null;
  const idx = typeof state.heroTurnIndex === "number" ? state.heroTurnIndex : 0;
  const heroes = Array.isArray(state.heroes) ? state.heroes : [];
  return heroes[idx] != null ? heroes[idx] : null;
}

function playerOwnsHero(playerId, heroId, heroOwners = {}, host = null) {
  if (!playerId) return false;
  if (host && playerId === host) return true;
  const owned = heroOwners[playerId] || heroOwners[String(playerId)];
  if (Array.isArray(owned)) {
    return owned.some(h => String(h) === String(heroId));
  }
  return false;
}

app.post("/api/lobbies/upsert", (req, res) => {
  const {
    key,
    encrypted,
    isPrivate = false,
    difficulty = "Unknown",
    host = "Unknown",
    players = [],
    readyState = null,
    launchUrl = null
  } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  pruneStaleLobbies();
  const existing = lobbies.get(key) || {};
  const playersSafe = Array.isArray(players) ? Array.from(new Set(players.filter(Boolean))) : [];
  const now = Date.now();
  const playerLastSeen = existing.playerLastSeen || {};
  playersSafe.forEach(p => { playerLastSeen[p] = now; });
  lobbies.set(key, {
    key,
    encrypted: typeof encrypted === "string" ? encrypted : existing.encrypted || null,
    isPrivate: Boolean(isPrivate),
    difficulty,
    host,
    players: playersSafe,
    playerLastSeen,
    started: existing.started || false,
    launchUrl: typeof launchUrl === "string" ? launchUrl : existing.launchUrl || null,
    launchedAt: existing.launchedAt || null,
    readyState: readyState && typeof readyState === "object" ? readyState : existing.readyState || {},
    updatedAt: now,
    lastSeenAt: now
  });
  console.log(`[lobbies] Upsert lobby ${key} | private=${!!isPrivate} | host=${host} | players=${playersSafe.length}`);
  return res.json({ ok: true });
});

app.post("/api/lobbies/join", (req, res) => {
  const { key, player } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  pruneStaleLobbies();
  const lobby = lobbies.get(key);
  if (!lobby) return res.status(404).json({ error: "Lobby not found" });
  const set = new Set(lobby.players || []);
  if (lobby.host) set.add(lobby.host);
  if (player) set.add(player);
  lobby.players = Array.from(set);
  const now = Date.now();
  lobby.playerLastSeen = lobby.playerLastSeen || {};
  lobby.playerLastSeen[player || lobby.host] = now;
  lobby.updatedAt = now;
  lobby.lastSeenAt = now;
  pruneStalePlayers(lobby);
  console.log(`[lobbies] Player join recorded ${player || "(unknown)"} for lobby ${key} | total=${lobby.players.length}`);
  return res.json({ ok: true, lobby });
});

// Heartbeat to keep lobby active
app.post("/api/lobbies/heartbeat", (req, res) => {
  const { key, player } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  const lobby = lobbies.get(key);
  if (!lobby) return res.status(404).json({ error: "Lobby not found" });
  const now = Date.now();
  lobby.lastSeenAt = now;
  lobby.updatedAt = now;
  if (player) {
    lobby.playerLastSeen = lobby.playerLastSeen || {};
    lobby.playerLastSeen[player] = now;
  }
  pruneStalePlayers(lobby);
  return res.json({ ok: true });
});

// Mark lobby started (and optionally provide a launch URL)
app.post("/api/lobbies/start", (req, res) => {
  const { key, launchUrl, encrypted } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  const lobby = lobbies.get(key);
  if (!lobby) return res.status(404).json({ error: "Lobby not found" });
  lobby.started = true;
  if (typeof launchUrl === "string") {
    lobby.launchUrl = launchUrl;
    lobby.launchedAt = Date.now();
  }
  if (typeof encrypted === "string") {
    lobby.encrypted = encrypted;
  }
  lobby.updatedAt = Date.now();
  lobby.lastSeenAt = Date.now();
  console.log(`[lobbies] Lobby started ${key}`);
  return res.json({ ok: true, lobby });
});

app.get("/api/lobbies", (req, res) => {
  pruneStaleLobbies();
  const publicOnly = req.query.publicOnly !== "false";
  const now = Date.now();
  const list = Array.from(lobbies.values())
    .map(l => {
      pruneStalePlayers(l);
      return l;
    })
    .filter(l => (publicOnly ? !l.isPrivate : true))
    .filter(l => !l.started)
    .filter(l => (Array.isArray(l.players) ? l.players.length : 0) < 6)
    .filter(l => !l.lastSeenAt || now - l.lastSeenAt <= LOBBY_STALE_MS)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(({ key, isPrivate, difficulty, host, players, lastSeenAt, started }) => ({ key, isPrivate, difficulty, host, players, lastSeenAt, started }));
  return res.json({ ok: true, lobbies: list });
});

app.get("/api/lobbies/:key", (req, res) => {
  pruneStaleLobbies();
  const key = req.params.key;
  const lobby = lobbies.get(key);
  if (!lobby) return res.status(404).json({ error: "Lobby not found" });
  const playerParam = req.query.player;
  if (playerParam) {
    lobby.playerLastSeen = lobby.playerLastSeen || {};
    lobby.playerLastSeen[playerParam] = Date.now();
  }
  pruneStalePlayers(lobby);
  return res.json({ ok: true, lobby });
});

// Create or replace a multiplayer game state
app.post("/api/games/create", (req, res) => {
  const {
    key,
    state,
    heroOwners = {},
    host = null,
    players = []
  } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  if (!state || typeof state !== "object") return res.status(400).json({ error: "state is required" });
  pruneStaleGames();
  const now = Date.now();
  const playersSafe = Array.isArray(players) ? Array.from(new Set(players.filter(Boolean))) : [];
  const ownersSafe = typeof heroOwners === "object" && heroOwners !== null ? heroOwners : {};
  games.set(key, {
    key,
    state,
    heroOwners: ownersSafe,
    host: host || null,
    players: playersSafe,
    version: 1,
    updatedAt: now,
    lastSeenAt: now
  });
  console.log(`[games] Created game ${key} | players=${playersSafe.length}`);
  return res.json({ ok: true, version: 1, state, heroOwners: ownersSafe, players: playersSafe });
});

// Fetch current game snapshot
app.get("/api/games/:key/state", (req, res) => {
  pruneStaleGames();
  const key = req.params.key;
  const game = games.get(key);
  if (!game) return res.status(404).json({ error: "Game not found" });
  game.lastSeenAt = Date.now();
  return res.json({
    ok: true,
    state: game.state,
    version: game.version,
    heroOwners: game.heroOwners,
    players: game.players,
    host: game.host
  });
});

// Apply a client mutation and bump version
app.post("/api/games/apply", (req, res) => {
  const {
    key,
    playerId,
    clientVersion,
    state
  } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  if (!playerId || typeof playerId !== "string") return res.status(400).json({ error: "playerId is required" });
  if (!state || typeof state !== "object") return res.status(400).json({ error: "state is required" });
  const expectedVersion = typeof clientVersion === "number" ? clientVersion : null;
  pruneStaleGames();
  const game = games.get(key);
  if (!game) return res.status(404).json({ error: "Game not found" });
  if (expectedVersion === null || expectedVersion !== game.version) {
    return res.status(409).json({ error: "version mismatch", expected: game.version, state: game.state });
  }

  const activeHeroId = getActiveHeroId(game.state);
  const heroOwnersSafe = game.heroOwners || {};
  const owns = playerOwnsHero(playerId, activeHeroId, heroOwnersSafe, game.host);
  if (activeHeroId != null && !owns) {
    return res.status(403).json({ error: "not your turn" });
  }

  game.state = state;
  game.version = game.version + 1;
  game.updatedAt = Date.now();
  game.lastSeenAt = Date.now();
  console.log(`[games] Applied update for ${key} | version=${game.version} | player=${playerId}`);
  return res.json({
    ok: true,
    state: game.state,
    version: game.version,
    heroOwners: game.heroOwners
  });
});

// Poll for updates since a version
app.get("/api/games/:key/poll", (req, res) => {
  pruneStaleGames();
  const key = req.params.key;
  const since = Number(req.query.since || "0");
  const game = games.get(key);
  if (!game) return res.status(404).json({ error: "Game not found" });
  game.lastSeenAt = Date.now();
  if (Number.isFinite(since) && since < game.version) {
    return res.json({
      ok: true,
      state: game.state,
      version: game.version,
      heroOwners: game.heroOwners,
      players: game.players
    });
  }
  return res.json({ ok: true, noop: true, version: game.version });
});

// Basic health check
app.get("/health", (_req, res) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
