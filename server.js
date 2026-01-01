const express = require("express");
const compression = require("compression");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const lobbies = new Map(); // key -> lobby record
const LOBBY_TTL_MS = 1000 * 60 * 30; // 30 minutes

// Middleware
app.use(compression());
app.use(express.json({ limit: "1mb" }));

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

app.post("/api/lobbies/upsert", (req, res) => {
  const { key, encrypted, isPrivate = false, difficulty = "Unknown", host = "Unknown", players = [] } = req.body || {};
  if (!key || typeof key !== "string") return res.status(400).json({ error: "key is required" });
  pruneStaleLobbies();
  const playersSafe = Array.isArray(players) ? Array.from(new Set(players.filter(Boolean))) : [];
  lobbies.set(key, {
    key,
    encrypted: typeof encrypted === "string" ? encrypted : null,
    isPrivate: Boolean(isPrivate),
    difficulty,
    host,
    players: playersSafe,
    updatedAt: Date.now()
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
  if (player) {
    const set = new Set(lobby.players || []);
    set.add(player);
    lobby.players = Array.from(set);
  }
  lobby.updatedAt = Date.now();
  console.log(`[lobbies] Player join recorded ${player || "(unknown)"} for lobby ${key} | total=${lobby.players.length}`);
  return res.json({ ok: true, lobby });
});

app.get("/api/lobbies", (req, res) => {
  pruneStaleLobbies();
  const publicOnly = req.query.publicOnly !== "false";
  const list = Array.from(lobbies.values())
    .filter(l => (publicOnly ? !l.isPrivate : true))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(({ key, isPrivate, difficulty, host, players }) => ({ key, isPrivate, difficulty, host, players }));
  return res.json({ ok: true, lobbies: list });
});

app.get("/api/lobbies/:key", (req, res) => {
  pruneStaleLobbies();
  const key = req.params.key;
  const lobby = lobbies.get(key);
  if (!lobby) return res.status(404).json({ error: "Lobby not found" });
  return res.json({ ok: true, lobby });
});

// Basic health check
app.get("/health", (_req, res) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
