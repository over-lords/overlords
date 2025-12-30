const MUSIC_API = "https://api.github.com/repos/over-lords/overlords/contents/Public/Sounds/Music/standard_game_music/";
const STORAGE_KEY = "gameMusicState";
const VOLUME_KEY = "gameMusicVolume";
const LOW_HP_URL = "https://raw.githubusercontent.com/over-lords/overlords/main/Public/Sounds/Music/low_hp_epic_music.mp3";
const BASE_GAIN = 0.1; // global attenuation (2%)
const SAVE_INTERVAL_MS = 2000;

let audioEl = null;
let saveTimer = null;
let currentState = null;
let currentVolume = 0.2;
let pendingPosition = 0;
let lowHpAudio = null;
let lowHpActive = false;
let normalWasPlaying = false;

function getGameKey() {
    try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get("data") || "";
        return dataParam ? `game-${dataParam}` : `game-${window.location.pathname}`;
    } catch (_) {
        return "game-default";
    }
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed;
    } catch (_) {
        return null;
    }
}

function saveState() {
    if (!currentState) return;
    try {
        const payload = {
            ...currentState,
            position: audioEl ? audioEl.currentTime : 0
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {
        // ignore
    }
}

function loadVolume() {
    try {
        const raw = localStorage.getItem(VOLUME_KEY);
        const num = Number(raw);
        if (Number.isFinite(num) && num >= 0 && num <= 1) {
            currentVolume = num;
        } else {
            currentVolume = 0.2;
        }
    } catch (_) {
        // ignore
    }
}

function saveVolume(vol) {
    try { localStorage.setItem(VOLUME_KEY, String(vol)); } catch (_) {}
}

async function fetchTracks() {
    try {
        const res = await fetch(MUSIC_API);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("invalid data");
        const tracks = data
            .filter(item => item.type === "file" && item.name.match(/\.(mp3|ogg|wav|m4a|flac)$/i))
            .map(item => ({
                name: item.name,
                url: item.download_url
            }));
        return tracks;
    } catch (err) {
        console.warn("[soundHandler] Failed to fetch tracks", err);
        return [];
    }
}

function setupAudio() {
    if (audioEl) return;
    audioEl = new Audio();
    audioEl.loop = false;
    loadVolume();
    audioEl.volume = currentVolume * BASE_GAIN;
    audioEl.addEventListener("ended", handleTrackEnded);
    audioEl.addEventListener("loadedmetadata", () => {
        if (pendingPosition > 0 && Number.isFinite(audioEl.duration)) {
            const pos = Math.min(pendingPosition, Math.max(0, audioEl.duration - 0.25));
            try { audioEl.currentTime = pos; } catch (_) {}
        }
        pendingPosition = 0;
    });
    audioEl.addEventListener("play", () => {
        if (saveTimer) clearInterval(saveTimer);
        saveTimer = setInterval(saveState, SAVE_INTERVAL_MS);
    });
    audioEl.addEventListener("pause", () => {
        if (saveTimer) {
            clearInterval(saveTimer);
            saveTimer = null;
        }
        saveState();
    });
}

function playCurrent() {
    if (!audioEl || !currentState || !currentState.queue.length) return;
    const idx = Math.max(0, Math.min(currentState.index, currentState.queue.length - 1));
    const track = currentState.queue[idx];
    if (!track) return;
    audioEl.src = track.url;
    pendingPosition = currentState.position || 0;
    audioEl.volume = currentVolume * BASE_GAIN;
    audioEl.play().catch(err => {
        console.warn("[soundHandler] play failed", err);
    });
}

function setLowHpMode(isLow) {
    if (isLow && !lowHpActive) {
        normalWasPlaying = audioEl && !audioEl.paused;
        if (audioEl) audioEl.pause();
        if (!lowHpAudio) {
            lowHpAudio = new Audio(LOW_HP_URL);
            lowHpAudio.loop = true;
        }
        lowHpAudio.volume = currentVolume * BASE_GAIN;
        lowHpAudio.currentTime = 0;
        lowHpAudio.play().catch(err => console.warn("[soundHandler] low HP play failed", err));
        lowHpActive = true;
    } else if (!isLow && lowHpActive) {
        if (lowHpAudio) {
            lowHpAudio.pause();
            lowHpAudio.currentTime = 0;
        }
        lowHpActive = false;
        if (normalWasPlaying !== false) {
            playCurrent();
        }
    }
}

function handleTrackEnded() {
    if (!currentState) return;
    currentState.position = 0;
    currentState.index = (currentState.index + 1) % currentState.queue.length;
    saveState();
    playCurrent();
}

async function initSound() {
    setupAudio();
    const stored = loadState();
    const gameKey = getGameKey();
    const tracks = await fetchTracks();
    if (!tracks.length) return;

    if (stored && stored.gameKey === gameKey && Array.isArray(stored.queue) && stored.queue.length) {
        currentState = {
            gameKey,
            queue: stored.queue,
            index: stored.index ?? 0,
            position: stored.position ?? 0
        };
    } else {
        const shuffled = shuffle(tracks);
        currentState = {
            gameKey,
            queue: shuffled,
            index: 0,
            position: 0
        };
        saveState();
    }
    playCurrent();
}

if (typeof window !== "undefined") {
    window.setMusicVolume = (val) => {
        const clamped = Math.max(0, Math.min(1, Number(val) || 0));
        currentVolume = clamped;
        if (audioEl) audioEl.volume = clamped * BASE_GAIN;
        if (lowHpAudio) lowHpAudio.volume = clamped * BASE_GAIN;
        saveVolume(clamped);
    };

    window.setLowHpMode = setLowHpMode;

    window.addEventListener("load", () => {
        initSound();
    });

    window.addEventListener("beforeunload", () => {
        saveState();
        if (saveTimer) clearInterval(saveTimer);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            saveState();
        }
    });
}
