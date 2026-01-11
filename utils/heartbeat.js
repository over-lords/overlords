// Simple game heartbeat ping for multiplayer
import { getMultiplayerContext, forceServerResync } from "./multiplayer.js";

export async function sendGameHeartbeat() {
  try {
    const ctx = getMultiplayerContext();
    if (!ctx?.key || !ctx.enabled) return;
    const base = (typeof window !== "undefined" && window.MULTI_API_BASE) || (typeof window !== "undefined" && window.location?.origin) || "";
    if (!base) return;
    const url = `${base}/api/games/heartbeat`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: ctx.key, playerId: ctx.playerId || ctx.host || "Unknown" })
    });
    if (!res.ok) {
      console.warn("[heartbeat] Failed", res.status);
      if (res.status === 404) {
        await forceServerResync(ctx.key);
      }
    }
  } catch (err) {
    console.warn("[heartbeat] Error", err);
  }
}

// Auto-ping every 5s in multiplayer
if (typeof window !== "undefined") {
  try {
    if (window.__GAME_HEARTBEAT_TIMER) clearInterval(window.__GAME_HEARTBEAT_TIMER);
  } catch (_) {}
  window.__GAME_HEARTBEAT_TIMER = setInterval(sendGameHeartbeat, 3000);
}
