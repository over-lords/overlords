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
const COMMAND_TTL_MS = 1000 * 60 * 10; // keep queued commands for up to 10 minutes

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

function reassignHeroesToHost(game) {
  if (!game) return;
  const host = game.host;
  if (!host) return;
  const owners = game.heroOwners && typeof game.heroOwners === "object" ? game.heroOwners : {};
  const players = Array.isArray(game.players) ? game.players : [];
  const heroIds = Array.isArray(game.state?.heroes) ? game.state.heroes.map(String) : [];
  const reassigned = [];

  // Collect heroes currently unowned or owned by missing players
  const currentOwned = new Set();
  Object.entries(owners).forEach(([pid, list]) => {
    if (!Array.isArray(list)) return;
    const validPlayer = players.includes(pid) || pid === host;
    list.forEach(h => {
      const hid = String(h);
      if (!validPlayer) {
        reassigned.push(hid);
        return;
      }
      currentOwned.add(hid);
    });
    if (!validPlayer) {
      delete owners[pid];
    }
  });

  heroIds.forEach(hid => {
    if (!currentOwned.has(hid)) {
      reassigned.push(hid);
    }
  });

  if (!owners[host]) owners[host] = [];
  reassigned.forEach(hid => {
    if (!owners[host].includes(hid)) owners[host].push(hid);
  });

  game.heroOwners = owners;
  if (reassigned.length) {
    console.log(`[games] Reassigned ${reassigned.length} heroes to host ${host} due to missing ownership.`);
  }
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
  let ownersSafe = {};
  if (heroOwners && typeof heroOwners === "object") ownersSafe = heroOwners;
  if ((!ownersSafe || !Object.keys(ownersSafe).length) && Array.isArray(state.heroesByPlayer) && Array.isArray(state.playerUsernames)) {
    const derived = {};
    state.heroesByPlayer.forEach((heroList, idx) => {
      const p = state.playerUsernames[idx];
      if (!p) return;
      derived[p] = Array.isArray(heroList) ? heroList.map(String) : [];
    });
    ownersSafe = derived;
  }
  games.set(key, {
    key,
    state,
    heroOwners: ownersSafe,
    host: host || null,
    players: playersSafe,
    commands: [],
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

// Queue a command (full proposed state) from a non-host player.
app.post("/api/games/:key/command", (req, res) => {
  const key = req.params.key;
  const { playerId, state, heroOwners = {} } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  if (!playerId || typeof playerId !== "string") return res.status(400).json({ error: "playerId is required" });
  if (!state || typeof state !== "object") return res.status(400).json({ error: "state is required" });
  pruneStaleGames();
  const game = games.get(key);
  if (!game) return res.status(404).json({ error: "Game not found" });

  // If host missing, promote this player to host
  if (!game.host) {
    game.host = playerId;
    console.log(`[games] Host was missing; promoted ${playerId} as host for game ${key}`);
  }

  // Validate ownership: allow only the active hero owner to submit a command unless host
  const activeHeroId = getActiveHeroId(game.state);
  const owns = playerOwnsHero(playerId, activeHeroId, game.heroOwners, game.host);
  if (activeHeroId != null && !owns && playerId !== game.host) {
    return res.status(403).json({ error: "not your turn" });
  }

  const now = Date.now();
  game.commands = Array.isArray(game.commands) ? game.commands : [];
  game.commands.push({
    playerId,
    state,
    heroOwners,
    ts: now
  });
  game.updatedAt = now;
  game.lastSeenAt = now;
  console.log(`[games] Queued command for ${key} by ${playerId} | queue length=${game.commands.length}`);
  return res.json({ ok: true, queued: game.commands.length });
});

// Host (or newly promoted host) fetches and drains command queue
app.get("/api/games/:key/commands", (req, res) => {
  const key = req.params.key;
  const playerId = req.query.playerId || req.query.player || null;
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  pruneStaleGames();
  const game = games.get(key);
  if (!game) return res.status(404).json({ error: "Game not found" });

  // Promote new host if missing
  if (!game.host && playerId) {
    game.host = playerId;
    console.log(`[games] Host was missing; promoted ${playerId} as host when fetching commands for ${key}`);
  }

  if (game.host && playerId && String(playerId) !== String(game.host)) {
    return res.status(403).json({ error: "only host may fetch commands", host: game.host });
  }

  const now = Date.now();
  game.updatedAt = now;
  game.lastSeenAt = now;
  const commands = Array.isArray(game.commands) ? game.commands : [];
  game.commands = [];
  // prune old commands just in case
  const filtered = commands.filter(c => c && c.ts && now - c.ts <= COMMAND_TTL_MS);
  console.log(`[games] Host fetched ${filtered.length} commands for ${key}`);
  return res.json({ ok: true, commands: filtered, host: game.host });
});

// Apply a client mutation and bump version
app.post("/api/games/apply", (req, res) => {
  const {
    key,
    playerId,
    state
  } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  if (!playerId || typeof playerId !== "string") return res.status(400).json({ error: "playerId is required" });
  if (!state || typeof state !== "object") return res.status(400).json({ error: "state is required" });
  pruneStaleGames();
  const game = games.get(key);
  if (!game) return res.status(404).json({ error: "Game not found" });

  // Promote host if missing
  if (!game.host) {
    game.host = playerId;
    console.log(`[games] Host was missing; promoted ${playerId} as host for game ${key}`);
  }
  // Only host may apply state
  if (String(playerId) !== String(game.host)) {
    return res.status(403).json({ error: "only host may apply updates", host: game.host });
  }

  // Derive heroOwners if missing
  if ((!game.heroOwners || !Object.keys(game.heroOwners).length) && Array.isArray(game.state?.heroesByPlayer) && Array.isArray(game.state?.playerUsernames)) {
    const derived = {};
    game.state.heroesByPlayer.forEach((heroList, idx) => {
      const p = game.state.playerUsernames[idx];
      if (!p) return;
      derived[p] = Array.isArray(heroList) ? heroList.map(String) : [];
    });
    game.heroOwners = derived;
  }

  // Reassign abandoned heroes to host
  reassignHeroesToHost(game);

  game.state = state;
  game.version = game.version + 1;
  game.updatedAt = Date.now();
  game.lastSeenAt = Date.now();
  console.log(`[games] Applied update for ${key} | version=${game.version} | player=${playerId}`);
  return res.json({
    ok: true,
    state: game.state,
    version: game.version,
    heroOwners: game.heroOwners,
    host: game.host
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
      players: game.players,
      host: game.host
    });
  }
  return res.json({ ok: true, noop: true, version: game.version, host: game.host });
});

// Basic health check
app.get("/health", (_req, res) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
