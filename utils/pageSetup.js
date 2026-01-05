import { heroes } from '../data/faceCards.js';
import { heroCards } from '../data/heroCards.js';
import { overlords } from '../data/overlords.js';
import { tactics } from '../data/tactics.js';
import { enemies } from '../data/enemies.js';
import { allies } from '../data/allies.js';
import { bystanders } from '../data/bystanders.js';
import { scenarios } from '../data/scenarios.js';
import { henchmen } from '../data/henchmen.js';
import { villains } from '../data/villains.js';
import { renderCard, renderAbilityText, findCardInAllSources } from './cardRenderer.js';
import { keywords } from '../data/keywords.js';
import { runGameStartAbilities, currentTurn, onHeroCardActivated, damageFoe, 
         freezeFoe, knockbackFoe, givePassiveToEntry, refreshFrozenOverlays, runIfDiscardedEffects, 
         renderScannedPreview, processQueuedHeroDamage, getCurrentHeroDT, refreshGameModeFlags as refreshAbilityGameModeFlags } from './abilityExecutor.js';
import { gameStart, startHeroTurn, endCurrentHeroTurn, initializeTurnUI, showHeroTopPreview, 
         showRetreatButtonForCurrentHero, refreshGameModeFlags as refreshTurnGameModeFlags, resetTurnTimerForHero, updateStandardSpeedUI } from "./turnOrder.js";

import { loadGameState, saveGameState, clearGameState, restoreCapturedBystandersIntoCardData } from "./stateManager.js";
import { playSoundEffect } from "./soundHandler.js";
import { gameState } from "../data/gameState.js";

let currentOverlord = null;
let currentTactics = [];

let selectedHeroes = [];
let heroMap = new Map();

window.VILLAIN_DRAW_ENABLED = false;

import {    CITY_EXIT_UPPER,
            CITY_5_UPPER,
            CITY_4_UPPER,
            CITY_3_UPPER,
            CITY_2_UPPER,
            CITY_ENTRY_UPPER } from '../data/gameState.js';

const LOG_CONTAINER_ID = "game-log";
let logAutoScrollEnabled = true;
const heroColorCache = new Map();

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function normalizeLogEntry(entry) {
    if (entry == null) return { text: "" };
    if (typeof entry === "string") return { text: entry };
    if (typeof entry === "object") return { id: entry.id, text: entry.text ?? "" };
    return { text: String(entry) };
}

function updateDropdownTabLogSnippet(state = gameState) {
    const tab = document.getElementById("dropdown-tab");
    if (!tab) return;
    const textEl = document.getElementById("dropdown-tab-text") || tab;
    const entries = Array.isArray(state?.gameLog) ? state.gameLog : [];
    const latest = entries.length ? normalizeLogEntry(entries[entries.length - 1]).text : "Game Log Empty";
    textEl.textContent = latest || "Game Log Empty";
}

function createLogRow(entry) {
    const { text, id } = normalizeLogEntry(entry);

    const row = document.createElement("div");
    row.className = "game-log-entry";
    if (id) row.dataset.logId = id;

    if (typeof text !== "string") {
        row.textContent = "";
        return row;
    }

    const trimmed = text.trim();

    // Bold round start messages
    if (/^start of round/i.test(trimmed)) {
        row.innerHTML = `<strong>${escapeHtml(trimmed)}</strong>`;
        return row;
    }

    // Color hero names for start/end turn messages
    const heroTurnMatch = trimmed.match(/^(.+?)\s+(started|ended) their turn\.?$/i);
    if (heroTurnMatch) {
        const heroName = heroTurnMatch[1];
        const action = heroTurnMatch[2];

        let color = heroColorCache.get(heroName);
        if (!color) {
            const heroObj = heroes.find(h => h.name === heroName);
            color = heroObj?.color || null;
            if (color) heroColorCache.set(heroName, color);
        }

        const nameSpan = document.createElement("span");
        nameSpan.textContent = heroName;
        if (color) {
            nameSpan.style.color = color;
            nameSpan.style.fontWeight = "600";
        }

        const restSpan = document.createElement("span");
        restSpan.textContent = ` ${action} their turn.`;

        row.appendChild(nameSpan);
        row.appendChild(restSpan);
        return row;
    }

    row.textContent = trimmed;
    return row;
}

function getDropdown() {
    return document.getElementById("dropdown-content");
}

function bindLogScrollHandlers(logEl) {
    if (!logEl || logEl.dataset.logScrollBound) return;
    logEl.dataset.logScrollBound = "1";

    logEl.addEventListener("scroll", () => {
        const nearBottom = (logEl.scrollHeight - (logEl.scrollTop + logEl.clientHeight)) <= 12;
        logAutoScrollEnabled = nearBottom;
    });
}

function ensureGameLogContainer() {
    const dropdown = getDropdown();
    if (!dropdown) return null;

    let log = dropdown.querySelector(`#${LOG_CONTAINER_ID}`);
    if (!log) {
        log = document.createElement("div");
        log.id = LOG_CONTAINER_ID;
        log.className = "game-log";
        log.style.display = "flex";
        log.style.flexDirection = "column";
        log.style.gap = "6px";
        log.style.padding = "12px";
        log.style.fontSize = "18px";
        log.style.lineHeight = "1.4";
        log.style.overflowY = "auto";
        log.style.maxHeight = "70vh";
        log.style.background = "rgba(0,0,0,0.05)";
        log.style.borderRadius = "10px";
        log.style.textShadow = "0 0 2px rgba(0,0,0,0.18)";
        dropdown.appendChild(log);
    }

    bindLogScrollHandlers(log);
    return log;
}

function addEmptyLogPlaceholder(logEl) {
    if (!logEl) return;
    if (logEl.querySelector(".game-log-empty")) return;

    const placeholder = document.createElement("div");
    placeholder.className = "game-log-empty";
    placeholder.style.opacity = "0.6";
    placeholder.style.fontStyle = "italic";
    placeholder.textContent = "Game Log Empty";
    logEl.appendChild(placeholder);
}

export function renderGameLogFromState(state = gameState) {
    const log = ensureGameLogContainer();
    if (!log) return false;

    log.innerHTML = "";
    const entries = Array.isArray(state.gameLog) ? state.gameLog : [];

    entries.forEach(text => {
        const row = createLogRow(text);
        log.appendChild(row);
    });

    if (entries.length === 0) {
        addEmptyLogPlaceholder(log);
    }

    if (logAutoScrollEnabled) {
        log.scrollTop = log.scrollHeight;
    }

    updateDropdownTabLogSnippet(state);
    return true;
}

export function appendGameLogEntry(text, state = gameState, opts = {}) {
    if (!text) return null;
    const log = ensureGameLogContainer();
    if (!log) return null;

    const placeholder = log.querySelector(".game-log-empty");
    if (placeholder) placeholder.remove();

    if (!Array.isArray(state.gameLog)) state.gameLog = [];
    state.logEntrySeq = (state.logEntrySeq || 0) + 1;

    const id = opts.id || `log-${state.logEntrySeq}`;
    const entry = { id, text };

    state.gameLog.push(entry);

    const row = createLogRow(entry);
    log.appendChild(row);

    if (logAutoScrollEnabled) {
        log.scrollTop = log.scrollHeight;
    }

    updateDropdownTabLogSnippet(state);
    saveGameState(state);
    return id;
}

export function removeGameLogEntryById(id, state = gameState) {
    if (!id) return;
    const log = document.getElementById(LOG_CONTAINER_ID);

    if (Array.isArray(state.gameLog)) {
        const idx = state.gameLog.findIndex(e => normalizeLogEntry(e).id === id);
        if (idx !== -1) {
            state.gameLog.splice(idx, 1);
            saveGameState(state);
        }
    }

    if (log) {
        const node = log.querySelector(`[data-log-id="${id}"]`);
        if (node) node.remove();
        const hasEntries = log.querySelector(".game-log-entry");
        if (!hasEntries) addEmptyLogPlaceholder(log);
    }
    updateDropdownTabLogSnippet(state);
}

const HERO_BORDER_URLS = {
    Striker: "https://raw.githubusercontent.com/over-lords/overlords/098924d9c777517d2ee76ad17b80c5f8014f3b30/Public/Images/Site%20Assets/strikerBorder.png",
    Guardian: "https://raw.githubusercontent.com/over-lords/overlords/098924d9c777517d2ee76ad17b80c5f8014f3b30/Public/Images/Site%20Assets/guardianBorder.png",
    Tactician: "https://raw.githubusercontent.com/over-lords/overlords/098924d9c777517d2ee76ad17b80c5f8014f3b30/Public/Images/Site%20Assets/tacticianBorder.png"
};

const EMPTY_HERO_URL = "https://raw.githubusercontent.com/over-lords/overlords/098924d9c777517d2ee76ad17b80c5f8014f3b30/Public/Images/Card%20Assets/Misc/emptyHero.png";

const HERO_KO_ICON_URL = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Site%20Assets/permanentKO.png";

function buildHeroesRow(selectedHeroIds, heroMap) {
    const row = document.getElementById("heroes-row");
    if (!row) return;

    row.innerHTML = "";

    const totalSlots = 6;
    for (let i = 0; i < totalSlots; i++) {
        const slot = document.createElement("div");
        slot.className = "hero-slot";

        const id = selectedHeroIds[i];
        const hero = id != null ? heroMap.get(String(id)) : null;

        const wrapper = document.createElement("div");
        wrapper.className = "hero-border-wrapper";

        if (hero) {
            const currentHP = gameState.heroData?.[hero.id]?.hp ?? hero.currentHP ?? hero.hp;

            const hpBox = document.createElement("div");
            hpBox.className = "hero-hp-display";

            hpBox.innerHTML = `
                <img class="hero-hp-heart" src="https://raw.githubusercontent.com/over-lords/overlords/7774da0ec26845edd8dc6c07756b04e78fafcbff/Public/Images/Card%20Assets/Misc/Heart.png">
                <div class="hero-hp-text" data-hero-id="${hero.id}">${currentHP}</div>
            `;

            slot.appendChild(hpBox);
        }

        // Defaults for empty slot
        let borderImageUrl = HERO_BORDER_URLS.Guardian; // neutral default
        let borderColor = "transparent";
        let portraitSrc = EMPTY_HERO_URL;
        let portraitAlt = "Empty Hero Slot";

        if (hero) {
            // Pick frame by category
            const category = (hero.category || "").toLowerCase();
            if (category === "striker") {
                borderImageUrl = HERO_BORDER_URLS.Striker;
            } else if (category === "guardian") {
                borderImageUrl = HERO_BORDER_URLS.Guardian;
            } else if (category === "tactician") {
                borderImageUrl = HERO_BORDER_URLS.Tactician;
            }

            // Tint by hero.color, if defined
            if (hero.color) {
                borderColor = hero.color;
            }

            portraitSrc = hero.image;
            portraitAlt = hero.name || "Hero";
        }

        // Hooks for the CSS mask-based tint
        wrapper.style.setProperty("--border-image", `url('${borderImageUrl}')`);
        wrapper.style.setProperty("--border-color", borderColor);

        const img = document.createElement("img");
        img.className = "hero-portrait";
        img.src = portraitSrc;
        img.alt = portraitAlt;

        if (!hero) {
            img.style.opacity = "0.9";
            if (!hero) wrapper.classList.add("empty-slot");
        }

        const tint = document.createElement("div");
        tint.className = "hero-border-tint";

        wrapper.appendChild(img);
        wrapper.appendChild(tint);
        slot.appendChild(wrapper);
        row.appendChild(slot);
    }
}

setTimeout(attachHeroClicks, 0);

async function decryptData(cipherText, secretKey) {
    const data = atob(cipherText);
    const bytes = new Uint8Array([...data].map(c => c.charCodeAt(0)));
    const iv = bytes.slice(0, 12);
    const cipher = bytes.slice(12);

    const keyMaterial = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secretKey));
    const key = await crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
    const decoded = new TextDecoder().decode(decrypted);
    return JSON.parse(decoded);
}

/******************************************************
 * RESTORE FULL UI FROM SAVED GAME STATE
 ******************************************************/
async function restoreUIFromState(state) {

    console.log("Restoring UI from saved state…");

    /******************************************************
     * HERO RESTORATION
     ******************************************************/
    // Build hero map from master hero data
    heroMap = new Map(heroes.map(h => [String(h.id), h]));

    // Re-hydrate hero objects with dynamic fields saved in state
    const restoredHeroIds = state.heroes || [];

    restoredHeroIds.forEach(id => {
        const heroObj = heroMap.get(String(id));
        if (!heroObj) return;

        if (!state.heroData) state.heroData = {};
        if (!state.heroData[id]) {
            const heroObj = heroMap.get(String(id));
            state.heroData[id] = {
                deck: [],
                discard: [],
                hand: [],
                cityIndex: null,
                hp: heroObj.hp,
                travel: heroObj.travel || 0
            };
        }
        const saved = state.heroData[id];

        if (!state.heroData) state.heroData = {};
        if (!state.heroData[id]) {
            state.heroData[id] = {
                deck: [],
                discard: [],
                hand: [],
                cityIndex: null,
                hp: heroObj.hp,
                travel: heroObj.travel
            };
        }

        // HP
        if (saved.currentHP != null) {
            heroObj.currentHP = saved.currentHP;
        }

        // Ability uses
        if (saved.currentUses) {
            heroObj.currentUses = saved.currentUses;
        }

        // Owner assignment
        heroObj.owner = saved.owner;
    });

    // UI row
    selectedHeroes = restoredHeroIds;
    buildHeroesRow(restoredHeroIds, heroMap);

    restoredHeroIds.forEach(id => {
        const hState = state.heroData?.[id];
        if (!hState) return;

        if (hState.hp <= 0 || hState.isKO) {
            hState.hp = 0;
            hState.isKO = true;
            applyHeroKOMarkers(id);
        }
    });

    // Attach click events
    setTimeout(attachHeroClicks, 0);

        // Restore hero top-deck preview bar, if any was active when the game was saved
    if (state.heroDeckPreview && state.heroDeckPreview.heroId != null) {
        const { heroId, count } = state.heroDeckPreview;
        try {
            showHeroTopPreview(heroId, state, count || 3);
        } catch (err) {
            console.warn("[RESTORE] Failed to restore hero deck preview:", err);
        }
    } else {
        // Ensure the preview UI is hidden if there is no saved preview
        const bar      = document.getElementById("hero-deck-preview-bar");
        const backdrop = document.getElementById("hero-deck-preview-backdrop");
        if (bar)      bar.style.display = "none";
        if (backdrop) backdrop.style.display = "none";
    }

    // Restore scanned preview if present
    if (Array.isArray(state.scannedDisplay) && state.scannedDisplay.length) {
        try {
            renderScannedPreview(state.scannedDisplay, state.scannedDisplayOpts || {});
        } catch (err) {
            console.warn("[RESTORE] Failed to restore scanned preview:", err);
        }
    }

    /******************************************************
     * OVERLORD / SCENARIO RESTORATION
     ******************************************************/
    if (state.activeScenarioId != null) {
        // A Scenario is currently sitting on top of the Overlord stack
        const scenId = String(state.activeScenarioId);
        const scenarioCard = scenarios.find(s => String(s.id) === scenId);

        if (scenarioCard) {
            const baseHP   = Number(scenarioCard.hp || 0) || 0;
            const savedHP  = state.scenarioHP?.[scenId];
            const currHP   = (typeof savedHP === "number") ? Number(savedHP) : baseHP;

            // Sync runtime object + state
            scenarioCard.currentHP = currHP;
            if (!state.scenarioHP) state.scenarioHP = {};
            state.scenarioHP[scenId] = currHP;

            // Use the same helper that already knows how to handle Scenarios
            setCurrentOverlord(scenarioCard);
        }
    } else if (state.overlords?.length) {

        const ovId = String(state.overlords[0]);

        // First try to find an actual Overlord
        let restored = overlords.find(o => String(o.id) === ovId);

        // If not found, this was a VILLAIN TAKEOVER
        if (!restored) {
            restored = villains.find(v => String(v.id) === ovId);

            if (restored) {
                console.log("[RESTORE] Overlord is a villain takeover:", restored.name);
                state.overlordIsVillain = true;
            }
        } else {
            state.overlordIsVillain = false;
        }

        if (restored) {
            // Restore HP from saved state
            if (state.overlordData?.currentHP != null) {
                restored.currentHP = state.overlordData.currentHP;
            }

            // Apply as the live Overlord (non-Scenario)
            setCurrentOverlord(restored);
        }
    }

    // Restore tactics normally (unchanged)
    const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
    currentTactics = (state.tactics || []).map(id => tacticMap.get(String(id))).filter(Boolean);


    if (Array.isArray(state.cities)) {

        const heroIds = state.heroes || [];
        const citySlots = document.querySelectorAll(".city-slot");

        heroIds.forEach(hid => {
            const hState = state.heroData?.[hid];
            if (!hState) return;

            const idx = hState.cityIndex;
            if (idx === null || idx === undefined) return;   // hero is at HQ

            const slot = citySlots[idx];
            if (!slot) return;

            const area = slot.querySelector(".city-card-area");
            if (!area) return;

            // Clear old content
            area.innerHTML = "";

            // Build hero wrapper
            const wrapper = document.createElement("div");
            wrapper.className = "card-wrapper";

            const heroObj = heroMap.get(String(hid));
            if (!heroObj) return;

            const rendered = renderCard(heroObj.id, wrapper);
            wrapper.appendChild(rendered);
            area.appendChild(wrapper);

            // Allow clicking hero to open its panel
            wrapper.style.cursor = "pointer";
            wrapper.setAttribute("data-card-id", String(heroObj.id));

            // IMPORTANT: capture-phase so inner card handlers can't swallow the click
            wrapper.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const handledByShove = (typeof window.maybePromptHeroShove === "function")
                    ? window.maybePromptHeroShove(heroObj, hid, idx)
                    : false;

                if (!handledByShove) {
                    buildHeroPanel(heroObj);
                }
            }, true);
        });

        state.cities.forEach(entry => {
            if (!entry || typeof entry.slotIndex !== "number") return;

            const slot = citySlots[entry.slotIndex];
            if (!slot) return;

            const cardArea = slot.querySelector(".city-card-area");
            if (!cardArea) return;

            cardArea.innerHTML = "";

        if (!entry.id) return;   // empty slot stays empty

        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";

        const cardId = entry.baseId ?? entry.id;
        const renderCardData = findCardInAllSources(cardId);
        const prevDamage = renderCardData?.damage;
        const prevCurrent = renderCardData?.currentDamage;
        const penalty = Number(entry.damagePenalty || 0);
        if (renderCardData && penalty) {
            const baseDamage = Number(renderCardData.damage ?? renderCardData.dmg ?? 0) || 0;
            const eff = Math.max(0, baseDamage - penalty);
            renderCardData.damage = eff;
            renderCardData.currentDamage = eff;
        }

        const rendered = renderCard(cardId, wrapper);
        wrapper.appendChild(rendered);

        if (renderCardData) {
            renderCardData.damage = prevDamage;
            renderCardData.currentDamage = prevCurrent;
        }
        cardArea.appendChild(wrapper);

        // Restore clickability for villains & henchmen
            const cardData =
                henchmen.find(h => h.id === entry.id) ||
                villains.find(v => v.id === entry.id);

            if (cardData) {
                const idStr  = String(cardData.id);
                const baseHP = Number(cardData.hp || 0) || 0;

                if (!state.villainHP) state.villainHP = {};

                let currentHP = baseHP;

                if (typeof entry.currentHP === "number") {
                    currentHP = Number(entry.currentHP);
                } else if (typeof state.villainHP[idStr] === "number") {
                    currentHP = Number(state.villainHP[idStr]);
                }

                // Sync all representations
                cardData.currentHP = currentHP;
                state.villainHP[idStr] = currentHP;
                entry.maxHP = baseHP;
                entry.currentHP = currentHP;

                wrapper.style.cursor = "pointer";
                wrapper.addEventListener("click", (e) => {
                    e.stopPropagation();
                    buildVillainPanel(cardData, { instanceId: getInstanceKey(entry), slotIndex: entry.slotIndex });
                });
            }
        });
    }

    // VILLAIN DECK
    if (Array.isArray(state.villainDeck)) {
        gameState.villainDeck = [...state.villainDeck];
    }

    if (typeof state.villainDeckPointer === "number") {
        gameState.villainDeckPointer = state.villainDeckPointer;
    }


    /******************************************************
     * PLAYER / OWNERSHIP RESTORATION
     ******************************************************/
    if (Array.isArray(state.playerUsernames)) {

        const players = state.playerUsernames;
        const heroesByPlayer = state.heroesByPlayer || [state.heroes];

        heroesByPlayer.forEach((heroList, playerIndex) => {
            heroList.forEach(heroId => {
                const h = heroMap.get(String(heroId));
                if (!h) return;
                h.owner = players[playerIndex] || "Player";
            });
        });
    }

    // Re-arm pending knockback selection after refresh (if any)
    try {
        if (state.pendingKnockback) {
            window.__knockbackSelectMode = {
                heroId: state.pendingKnockback.heroId ?? null,
                flag: state.pendingKnockback.flag || "any",
                state: gameState
            };
        } else {
            window.__knockbackSelectMode = null;
        }
    } catch (e) {
        console.warn("[RESTORE] Failed to restore pending knockback selection.", e);
    }

    console.log("UI restore complete.");
    try { refreshFrozenOverlays(state); } catch (e) {}

    try {
        if (typeof window !== "undefined" && typeof window.restoreExtraTurnModalFromState === "function") {
            window.restoreExtraTurnModalFromState(state);
        }
    } catch (e) {
        console.warn("[RESTORE] Failed to restore extra turn modal.", e);
    }
}

(async () => {
    const saved = loadGameState();

    if (saved) {
        console.log("=== RESUMING SAVED GAME ===");
        Object.assign(gameState, saved);
        window.GAME_MODE = saved.gameMode || window.GAME_MODE || "single";
        refreshAbilityGameModeFlags(window.GAME_MODE);
        refreshTurnGameModeFlags(window.GAME_MODE);
        window.gameState = gameState;

        restoreDropdownContentFromState(gameState);
        establishEnemyAllyDeckFromLoadout(null, gameState);

        restoreUIFromState(gameState);
        restoreCapturedBystandersIntoCardData(saved);
        try {
            if (typeof window.restoreOptionalAbilityPromptFromState === "function") {
                window.restoreOptionalAbilityPromptFromState(gameState);
            }
        } catch (e) {
            console.warn("[RESTORE] Failed to restore optional ability prompt.", e);
        }

        // IMPORTANT: Do NOT auto-start when resuming a game
        window.VILLAIN_DRAW_ENABLED = true;

        // Restore and clamp turn index from save; store ONLY on gameState
        const heroIds = gameState.heroes || [];
        const heroCount = heroIds.length;

        let restoredIndex = Number.isInteger(saved.heroTurnIndex)
            ? saved.heroTurnIndex
            : 0;

        if (heroCount === 0) {
            restoredIndex = 0;
        } else if (restoredIndex < 0 || restoredIndex >= heroCount) {
            // clamp out-of-range index if hero list changed
            restoredIndex = 0;
        }

        gameState.heroTurnIndex = restoredIndex;

        if (heroCount > 0) {
            currentTurn(restoredIndex, heroIds);
            resetTurnTimerForHero(gameState.turnTimerRemaining);
        }

        if (typeof saved.turnCounter === "number") {
            gameState.turnCounter = saved.turnCounter;
        } else {
            gameState.turnCounter = 0;
        }

        initializeTurnUI(gameState);
        showRetreatButtonForCurrentHero(gameState);
        initAndLogHeroIconAbilities(gameState);
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const encrypted = params.get('data');
    const SECRET = 'GeimonHeroKey42';  // DO NOT FUCK THIS UP

    if (!encrypted) {
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red;">No loadout data found.</p>');
        return;
    }

    try {
        const selectedData = await decryptData(encrypted, SECRET);
        selectedHeroes = selectedData.heroes || [];
        const selectedOverlords = selectedData.overlords || [];
        const selectedTactics = selectedData.tactics || [];
        window.GAME_MODE = selectedData.gameMode || window.GAME_MODE || "single";
        refreshAbilityGameModeFlags(window.GAME_MODE);
        refreshTurnGameModeFlags(window.GAME_MODE);
        console.log(`[game] Running in ${window.GAME_MODE === "single" ? "Singleplayer" : "Multiplayer"} mode`);

        heroMap = new Map(heroes.map(h => [String(h.id), h]));
        const heroList = selectedHeroes.map(id => heroMap.get(String(id)) || { name: `Unknown (ID ${id})` });

        buildHeroesRow(selectedHeroes, heroMap);

        (function configurePlayers() {
            const players = selectedData.playerUsernames || ["Player"];
            const heroesByPlayer = selectedData.heroesByPlayer || [ selectedHeroes ];

            heroesByPlayer.forEach((heroList, playerIndex) => {
                const ownerName = players[playerIndex] || `Player ${playerIndex+1}`;
                heroList.forEach(heroId => {
                    const hero = heroMap.get(String(heroId));
                    if (!hero) return;
                    hero.owner = ownerName;
                });
            });

        })();

        //console.log(">>> STARTING SINGLEPLAYER GAME <<<");
        const startResult = gameStart(selectedData);
        runGameStartAbilities(selectedData);

        Object.assign(gameState, {
            gameMode: window.GAME_MODE,
            heroes: selectedData.heroes,
            overlords: selectedData.overlords,
            tactics: selectedData.tactics,

            revealedTopVillain: false,
            heroDeckPreview: null,

            // villain deck from gameStart()
            villainDeck: startResult.villainDeck,
            villainDeckPointer: 0,

            // city grid from gameStart() (empty until you populate cities)
            cities: new Array(12).fill(null),

            heroesByPlayer: selectedData.heroesByPlayer,
            playerUsernames: selectedData.playerUsernames
        });
        window.gameState = gameState;

        console.log("=== Confirming hero decks after pageSetup ===");
        selectedData.heroes.forEach(heroId => {
            const heroObj = heroes.find(h => String(h.id) === String(heroId));
            if (!heroObj) return;

            const data = gameState.heroData[heroId];
            if (!data) return;

            console.log(`Deck for ${heroObj.name}:`, data.deck);
        });

        selectedData.heroes.forEach(id => {
            const heroObj = heroMap.get(String(id));
            if (!heroObj) return;

            gameState.heroData[id] = gameState.heroData[id] || {};

            gameState.heroData[id].deck ||= [];
            gameState.heroData[id].discard ||= [];
            gameState.heroData[id].hand ||= [];
            gameState.heroData[id].cityIndex ??= null;

            const baseHP = Number(heroObj.hp || 0);
                gameState.heroData[id].hp ??= baseHP;

            gameState.heroData[id].travel ??= (heroObj.travel || 0);
        });

        initAndLogHeroIconAbilities(gameState);

        establishEnemyAllyDeckFromLoadout(selectedData, gameState, { forceRebuild: true });
        saveGameState(gameState);

        const overlordMap = new Map(overlords.map(o => [String(o.id), o]));
        const overlordList = selectedOverlords
            .map(id => overlordMap.get(String(id)) || { name: `Unknown (ID ${id})`, hp: '?', level: '?' })
            .sort((a, b) => a.level - b.level || a.hp - b.hp);

        if (overlordList.length > 0) {
            setCurrentOverlord(overlordList[0]); // run setCurrentOverlord(newOverlordObject); whenever a takeover happens (from villains or overlord stack)
        }

        const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
        const tacticList = selectedTactics.map(id => {
            const t = tacticMap.get(String(id));
            if (!t) return { name: `Unknown (ID ${id})`, abilitiesText: [{ text: '?' }] };
            return t;
        });

        currentTactics = tacticList;

        const container = document.createElement('div');
        container.style.marginTop = '0px';
        container.style.textAlign = 'center';
        container.innerHTML = `
            <h2>Loaded Heroes (in order selected):</h2>
            <ol style="display:inline-block; text-align:left;">
                ${heroList.map(h => `<li>${h.name}</li>`).join('')}
            </ol>
            <h2 style="margin-top:30px;">Loaded Overlords (sorted by difficulty & HP):</h2>
            <ol style="display:inline-block; text-align:left;">
                ${overlordList.map(o => `<li>${o.name} — ${o.hp} HP (Difficulty ${o.level})</li>`).join('')}
            </ol>
        `;

        container.innerHTML += `
            <h2 style="margin-top:30px;">Loaded Tactics:</h2>
            <ol style="display:inline-block; text-align:left; max-width:700px;">
                ${tacticList.map(t => `
                <li style="margin-bottom:10px;">
                    <b>${t.name}</b><br>
                    ${t.abilitiesText.map(a => a.text).join('<br><br>')}
                </li>
                `).join('')}
            </ol>
        `;

        const enemiesData = selectedData.enemies || {};
        const alliesData = selectedData.allies || {};

        const selectedEnemies = Array.isArray(enemiesData.ids) ? enemiesData.ids : [];
        const selectedAllies = Array.isArray(alliesData.ids) ? alliesData.ids : [];

        const enemiesCount = typeof enemiesData.count === "number"
            ? enemiesData.count
            : selectedEnemies.length;

        const alliesCount = typeof alliesData.count === "number"
            ? alliesData.count
            : selectedAllies.length;

        const enemyMap = new Map(enemies.map(e => [String(e.id), e.name]));
        const allyMap = new Map(allies.map(a => [String(a.id), a.name]));

        container.innerHTML += `
            <h2 style="margin-top:30px;">Enemies & Allies:</h2>
            <div style="display:flex; justify-content:center; gap:60px; text-align:left;">
                <div>
                <b>Enemies (${enemiesCount} chosen)</b><br>
                <ul>${
                    selectedEnemies.length
                    ? selectedEnemies.map(id => `<li>${enemyMap.get(String(id)) || `Unknown (${id})`}</li>`).join('')
                    : '<li>None selected</li>'
                }</ul>
                </div>
                <div>
                <b>Allies (${alliesCount} chosen)</b><br>
                <ul>${
                    selectedAllies.length
                    ? selectedAllies.map(id => `<li>${allyMap.get(String(id)) || `Unknown (${id})`}</li>`).join('')
                    : '<li>None selected</li>'
                }</ul>
                </div>
            </div>
        `;

        const vdeck = selectedData.villainDeck || {};

        const vd_mights = typeof vdeck.mights === 'number' ? vdeck.mights : 0;

        const vd_bys_count = Number(vdeck.bystanders?.count) || 0;
        const vd_bys_types = Array.isArray(vdeck.bystanders?.byType) ? vdeck.bystanders.byType : [];

        const vd_scenarios = Array.isArray(vdeck.scenarios) ? vdeck.scenarios.map(String) : [];
        const scenMap = new Map(scenarios.map(s => [String(s.id), s]));

        const vd_hench_list = Array.isArray(vdeck.henchmen) ? vdeck.henchmen : [];
        const henchMap = new Map(henchmen.map(h => [String(h.id), h]));

        const vd_villain_ids = Array.isArray(vdeck.villains) ? vdeck.villains.map(String) : [];
        const villainMap = new Map(villains.map(v => [String(v.id), v]));

        const byBreakHTML = vd_bys_types.length
            ? ('<ul style="margin:0;padding-left:18px;">' + vd_bys_types.filter(x => x.count > 0).map(x => `<li>${x.count}× ${x.name || ('Type ' + x.id)}</li>`).join('') + '</ul>')
            : '<i>No bystanders</i>';

        const scenariosHTML = vd_scenarios.length
            ? ('<ul style="margin:0;padding-left:18px;">' + vd_scenarios.map(id => `<li>${scenMap.get(id)?.name || ('Unknown ' + id)}</li>`).join('') + '</ul>')
            : '<i>None selected</i>';

        const henchHTML = vd_hench_list.length
            ? ('<ul style="margin:0;padding-left:18px;">'
                + vd_hench_list.filter(x => Number(x.count) > 0).map(x => {
                    const h = henchMap.get(String(x.id));
                    return `<li>${x.count}× ${h?.name || ('Hench ' + x.id)}</li>`;
                }).join('')
                + '</ul>')
            : '<i>None selected</i>';

        const vilsHTML = vd_villain_ids.length
            ? ('<ul style="margin:0;padding-left:18px;">' + vd_villain_ids.map(id => {
                const v = villainMap.get(id);
                return `<li>${v?.name || ('Villain ' + id)}${v ? ` — ${v.hp} HP • ${v.damage} DMG` : ''}</li>`;
            }).join('') + '</ul>')
            : '<i>None selected</i>';

        container.innerHTML += `
            <h2 style="margin-top:30px;">Villain Deck</h2>
            <div style="display:grid;grid-template-columns: 1fr 1fr; gap:24px; max-width:900px; margin:0 auto; text-align:left;">
                <div>
                <b>Mights:</b> ${vd_mights}
                <br><br>
                <b>Bystanders:</b> ${vd_bys_count}
                <div style="margin-top:6px;">${byBreakHTML}</div>
                <br>
                <b>Scenarios (${vd_scenarios.length}):</b>
                <div style="margin-top:6px;">${scenariosHTML}</div>
                </div>
                <div>
                <b>Henchmen:</b>
                <div style="margin-top:6px;">${henchHTML}</div>
                <br>
                <b>Villains (${vd_villain_ids.length}):</b>
                <div style="margin-top:6px;">${vilsHTML}</div>
                </div>
            </div>
        `;

        const dropdown = document.getElementById("dropdown-content");
        if (!dropdown.querySelector(".dropdown-container")) {
            //dropdown.appendChild(container);
        }
        persistDropdownContentToState(gameState);
    } catch (e) {
        console.error('Failed to decrypt data:', e);
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red;">Invalid or corrupted data.</p>');
    }
})();

function resizeBoardToViewport() {
    const board = document.getElementById("game-board");
    const container = document.getElementById("game-board-container");

    const vh = window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight;
    const vw = window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth;

    const padding = 16;
    board.style.maxHeight = (vh - padding) + "px";
    board.style.maxWidth = (vw - padding) + "px";

    scaleGridToBoard();
}

function scaleGridToBoard() {
    const board = document.getElementById("game-board");
    const wrapper = document.getElementById("city-grid-wrapper");
    const grid = document.getElementById("city-grid");

    const gridWidth = grid.scrollWidth;
    const gridHeight = grid.scrollHeight;

    const boardRect = board.getBoundingClientRect();
    const maxW = boardRect.width * 0.90;
    const maxH = boardRect.height * 0.80;

    const scale = Math.min(maxW / gridWidth, maxH / gridHeight);

    wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("load", () => {
    resizeBoardToViewport();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scaleGridToBoard();
        });
    });
});

window.addEventListener("resize", () => {
    resizeBoardToViewport();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scaleGridToBoard();
        });
    });
});

const dropdownPanel = document.getElementById("dropdown-panel");
const dropdownTab = document.getElementById("dropdown-tab");
const dropdownClose = document.getElementById("dropdown-close");

dropdownTab.addEventListener("click", () => {
    dropdownPanel.style.maxHeight = "85vh";
    dropdownTab.style.display = "none";
    dropdownClose.style.display = "flex";
});

dropdownClose.addEventListener("click", () => {
    dropdownPanel.style.maxHeight = "0";

    dropdownClose.style.display = "none";

    setTimeout(() => {
        dropdownTab.style.display = "flex";
    }, 450);
});

const koPanel = document.getElementById("ko-panel");
const koTab = document.getElementById("ko-tab");
const koClose = document.getElementById("ko-close");

koTab.addEventListener("click", () => {
    if (typeof window !== "undefined" && typeof window.renderKOBar === "function") {
        window.renderKOBar(gameState);
    }

    koPanel.style.maxHeight = "85vh";
    koTab.style.display = "none";
    koClose.style.display = "flex";
});

koClose.addEventListener("click", () => {
    koPanel.style.maxHeight = "0";
    koClose.style.display = "none";
    setTimeout(() => {
        koTab.style.display = "flex";
    }, 450);
});

const pivotBtn   = document.getElementById("discard-pivot-button");
const slidePanel = document.getElementById("discard-slide-panel");
const closeBtn   = document.getElementById("discard-slide-close");
const cardsRow   = document.getElementById("discard-slide-cards");
const deckChooseBtn = document.createElement("button");
deckChooseBtn.textContent = "Choose";
deckChooseBtn.style.padding = "10px 16px";
deckChooseBtn.style.fontSize = "16px";
deckChooseBtn.style.display = "none";
deckChooseBtn.id = "deck-choose-button";
deckChooseBtn.style.alignSelf = "flex-end";
deckChooseBtn.style.marginLeft = "auto";
deckChooseBtn.style.marginRight = "100px";
deckChooseBtn.style.marginBottom = "6px";
if (cardsRow) cardsRow.appendChild(deckChooseBtn);

pivotBtn.onclick = () => {
  slidePanel.classList.add("open");
  renderDiscardSlide();
};

closeBtn.onclick = () => {
  slidePanel.classList.remove("open");
};

// Restore deck-select mode after refresh if persisted
if (gameState.deckSelectContext) {
  window.__deckSelectContext = { ...gameState.deckSelectContext };

  const ensureSnapshot = () => {
    const ctx = window.__deckSelectContext || gameState.deckSelectContext || {};
    const heroId = ctx.heroId;
    if (heroId == null) return ctx;
    const heroState =
      gameState.heroData?.[heroId] ??
      gameState.heroData?.[String(heroId)] ??
      null;
    if (!heroState) return ctx;

    let snapshot = Array.isArray(ctx.deckSnapshot) ? ctx.deckSnapshot.slice() : [];
    if (!snapshot.length) {
      if (Array.isArray(heroState.deck) && heroState.deck.length) {
        snapshot = heroState.deck.slice();
      } else if (Array.isArray(heroState.discard) && heroState.discard.length) {
        snapshot = heroState.discard.slice();
      } else {
        const heroObj = heroes.find(h => String(h.id) === String(heroId));
        if (heroObj) {
          snapshot = heroCards
            .filter(c => c.hero === heroObj.name)
            .reduce((arr, card) => {
              const qty = Number(card.perDeck || 0);
              for (let i = 0; i < qty; i++) arr.push(card.id);
              return arr;
            }, []);
        }
      }
      window.__deckSelectContext = { ...ctx, deckSnapshot: snapshot };
      gameState.deckSelectContext = { ...window.__deckSelectContext };
      saveGameState(gameState);
    }
    return window.__deckSelectContext;
  };

  const restoreDeckSelect = (attempt = 0) => {
    const ctx = ensureSnapshot();
    if (!ctx || ctx.heroId == null) return;

    const panel = document.getElementById("add-slide-panel");
    const row = document.getElementById("add-slide-cards");
    if (!panel || !row) {
      if (attempt < 5) setTimeout(() => restoreDeckSelect(attempt + 1), 100);
      return;
    }
    panel.classList.add("open");
    panel.style.display = "flex";

    const maybeRender = (tries = 0) => {
      let fn = (typeof window.renderDeckSelectSlide === "function")
        ? window.renderDeckSelectSlide
        : (typeof renderDeckSelectSlide === "function" ? renderDeckSelectSlide : null);

      if (!fn && tries >= 30) {
        // As a last resort, register an inline renderer so the panel isn't blank.
        fn = function fallbackDeckSelect(st = gameState) {
          const addPanel = document.getElementById("add-slide-panel");
          const addCardsRow = document.getElementById("add-slide-cards");
          if (!addPanel || !addCardsRow) return;
          const ctxLocal = window.__deckSelectContext || st.deckSelectContext;
          if (!ctxLocal || ctxLocal.heroId == null) return;
          const heroId = ctxLocal.heroId;
        const heroObj = heroes.find(h => String(h.id) === String(heroId));
        const heroName = heroObj?.name || `Hero ${heroId}`;
        const hState = st.heroData?.[heroId] || st.heroData?.[String(heroId)] || {};
        const deckList = Array.isArray(ctxLocal.deckSnapshot) && ctxLocal.deckSnapshot.length
          ? ctxLocal.deckSnapshot.slice()
          : (Array.isArray(hState.deck) ? hState.deck.slice() : []);

        addPanel.classList.add("open");
        addPanel.style.display = "flex";
        addCardsRow.innerHTML = "";
        addCardsRow.style.display = "flex";
        addCardsRow.style.flexDirection = "column";
        addCardsRow.style.alignItems = "stretch";
        addCardsRow.style.justifyContent = "flex-start";
        addCardsRow.style.height = "100%";

        const sizeLabel = document.createElement("div");
        sizeLabel.textContent = `${heroName}'s Deck: ${deckList.length} cards`;
        sizeLabel.style.marginTop = "10px";
        sizeLabel.style.marginRight = "10px";
        sizeLabel.style.marginBottom = "0";
        sizeLabel.style.marginLeft = "10px";
        sizeLabel.style.color = "#fff";
        sizeLabel.style.fontSize = "24px";
        sizeLabel.style.fontWeight = "bold";
        sizeLabel.style.flex = "0 0 auto";
        addCardsRow.appendChild(sizeLabel);

          const bar = document.createElement("div");
          bar.style.display = "flex";
          bar.style.flexWrap = "nowrap";
          bar.style.overflowX = "auto";
          bar.style.overflowY = "hidden";
          bar.style.gap = "0";
          bar.style.marginTop = "-230px";
          bar.style.padding = "8px";
          bar.style.alignItems = "center";
          bar.style.flex = "1 1 auto";

          const maxSel = Math.max(1, Number(ctxLocal.count) || 1);
          let sel = Array.isArray(ctxLocal.selectedCardIds) ? ctxLocal.selectedCardIds : [];
          const selectedSet = new Set(sel.map(String));

          deckList.forEach(id => {
            const idStr = String(id);
            const wrap = document.createElement("div");
            wrap.style.height = "110px";
            wrap.style.marginLeft = "-30px";
            wrap.style.marginRight = "-70px";
            wrap.style.position = "relative";

            const scaleWrapper = document.createElement("div");
            scaleWrapper.style.transform = "scale(0.5)";
            scaleWrapper.style.transformOrigin = "center center";
            scaleWrapper.style.filter = "drop-shadow(0px 0px 8px rgba(0,0,0,0.8))";

            const rendered = renderCard(idStr);
            scaleWrapper.appendChild(rendered);
            wrap.appendChild(scaleWrapper);

            const applySel = (on) => {
              scaleWrapper.style.boxShadow = on ? "0 0 0 6px gold" : "";
              scaleWrapper.style.border = on ? "4px solid #000" : "";
            };
            applySel(selectedSet.has(idStr));

            wrap.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                const data = findCardInAllSources(idStr);
                if (data) buildMainCardPanel(data);
              } catch (_) {}
              if (maxSel === 1) {
                const already = sel.length === 1 && String(sel[0]) === idStr;
                sel = already ? [] : [idStr];
                bar.querySelectorAll("div").forEach(div => {
                  if (div !== wrap) {
                    div.style.boxShadow = "";
                    div.style.border = "";
                  }
                });
              } else {
                const idxSel = sel.findIndex(cid => String(cid) === idStr);
                if (idxSel >= 0) sel.splice(idxSel, 1);
                else if (sel.length < maxSel) sel.push(idStr);
              }
              applySel(sel.some(cid => String(cid) === idStr));
              window.__deckSelectContext = { ...ctxLocal, selectedCardIds: sel };
              st.deckSelectContext = { ...window.__deckSelectContext };
              saveGameState(st);
              setChooseState(chooseBtn, sel.length > 0);
            });

            bar.appendChild(wrap);
          });

        const footer = document.createElement("div");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-end";
        footer.style.alignItems = "center";
        footer.style.margin = "8px 10px 10px 10px";
        footer.style.marginTop = "auto";

        let chooseBtn = document.getElementById("add-choose-button");
        if (!chooseBtn) {
            chooseBtn = document.createElement("button");
            chooseBtn.id = "add-choose-button";
            chooseBtn.textContent = "Choose";
            chooseBtn.style.padding = "10px 16px";
            chooseBtn.style.fontSize = "16px";
          }
          const setChooseState = (btn, hasSel) => {
            btn.style.display = "inline-block";
            btn.disabled = !hasSel;
            btn.style.backgroundColor = hasSel ? "gold" : "#444";
            btn.style.color = hasSel ? "#000" : "#ddd";
          };
          setChooseState(chooseBtn, sel.length > 0);

          chooseBtn.onclick = () => {
            const picks = sel.slice(0, maxSel);
            const live = st.heroData?.[heroId];
            if (!live) return;
            if (!Array.isArray(live.hand)) live.hand = [];
            if (!Array.isArray(live.deck)) live.deck = [];
            picks.forEach(cardId => {
              const pos = live.deck.findIndex(x => String(x) === String(cardId));
              if (pos >= 0) live.deck.splice(pos, 1);
              live.hand.push(cardId);
            });
            window.__deckSelectContext = null;
            st.deckSelectContext = null;
            saveGameState(st);
            try { renderHeroHandBar(st); } catch (_) {}
            addPanel.classList.remove("open");
          };

          footer.appendChild(chooseBtn);
          addCardsRow.appendChild(bar);
          addCardsRow.appendChild(footer);
        };
        window.renderDeckSelectSlide = fn;
      }

      if (fn) {
        try { fn(gameState); } catch (e) { console.warn("[deckSelect restore] render failed", e); }
      } else if (tries < 30) {
        setTimeout(() => maybeRender(tries + 1), 100);
      }
    };
    maybeRender();
  };

  const startRestore = () => {
    restoreDeckSelect();
    setTimeout(restoreDeckSelect, 80);
    setTimeout(restoreDeckSelect, 200);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startRestore);
  } else {
    startRestore();
  }
}

const menuBtn = document.getElementById("gameMenu-box");
const sideMenu = document.getElementById("sideMenu");
const menuHeader = document.getElementById("menuHeader");

const menuMain = document.getElementById("menuMain");
const menuVolume = document.getElementById("menuVolume");
const menuHelp = document.getElementById("menuHelp");

const volSFX = document.getElementById("volSFX");
const volMusic = document.getElementById("volMusic");

const helpSearch = document.getElementById("helpSearch");
const helpList = document.getElementById("helpList");

const popup = document.getElementById("quitPopup");
const quitYes = document.getElementById("quitYes");
const quitNo = document.getElementById("quitNo");

let menuOpen = false;
let submenu = null;

const topVillainBtn = document.getElementById("top-villain-button");
const topVillainPanel = document.getElementById("top-villain-panel");
const topVillainPanelClose = document.getElementById("top-villain-panel-close");

if (topVillainBtn) {
    topVillainBtn.addEventListener("click", () => {
        if (!gameState.revealedTopVillain) {
            // If for some reason the flag cleared but the button did not, just bail.
            return;
        }
        buildTopVillainPanelFromDeckTop();
    });
}

if (topVillainPanelClose) {
    topVillainPanelClose.addEventListener("click", () => {
        topVillainPanel.classList.remove("open");
    });
}

function loadKeywords() {
    helpList.innerHTML = "";
    const entries = Object.entries(keywords).sort((a, b) => a[0].localeCompare(b[0]));
    for (let [name, text] of entries) {
        const div = document.createElement("div");
        div.className = "keyword-entry";
        div.innerHTML = `<b>${name}</b><br>${text}`;
        helpList.appendChild(div);
    }
}
loadKeywords();

helpSearch.addEventListener("input", () => {
    const query = helpSearch.value.toLowerCase();
    const entries = Object.entries(keywords).sort((a, b) => a[0].localeCompare(b[0]));

    helpList.innerHTML = "";

    for (let [name, text] of entries) {
        if (name.toLowerCase().includes(query) || text.toLowerCase().includes(query)) {
            const div = document.createElement("div");
            div.className = "keyword-entry";
            div.innerHTML = `<b>${name}</b><br>${text}`;
            helpList.appendChild(div);
        }
    }
});

menuBtn.addEventListener("click", () => {
    if (!menuOpen) {
        sideMenu.classList.add("open");
        menuBtn.style.backgroundColor = "red";
        menuBtn.textContent = "X";
        menuOpen = true;
    } else if (submenu === null) {
        sideMenu.classList.remove("open");
        menuBtn.style.backgroundColor = "rgb(79,196,255)";
        menuBtn.textContent = "≡";
        menuOpen = false;
    } else {
        submenu = null;
        menuHeader.textContent = "Menu";

        menuMain.style.display = "block";
        menuVolume.style.display = "none";
        menuHelp.style.display = "none";

        menuBtn.textContent = "X";
    }
});

document.getElementById("menuVolumeBtn").addEventListener("click", () => {
    submenu = "volume";
    menuHeader.textContent = "Volume";

    menuMain.style.display = "none";
    menuVolume.style.display = "block";
    menuHelp.style.display = "none";

    menuBtn.textContent = "←";
});

document.getElementById("menuHelpBtn").addEventListener("click", () => {
    submenu = "help";
    menuHeader.textContent = "Glossary";
    menuHeader.style.fontSize = "28px";

    menuMain.style.display = "none";
    menuVolume.style.display = "none";
    menuHelp.style.display = "block";

    menuBtn.textContent = "←";
});

document.getElementById("menuQuitBtn").addEventListener("click", () => {
    popup.style.display = "block";
});

quitNo.addEventListener("click", () => {
    popup.style.display = "none";
});

quitYes.addEventListener("click", () => {
    clearGameState();
    window.location.href = "index.html";
});

// Restore saved music volume to slider (0-1 stored)
try {
    const savedMusicVol = localStorage.getItem("gameMusicVolume");
    if (savedMusicVol != null) {
        const num = Math.max(0, Math.min(1, Number(savedMusicVol) || 0));
        volMusic.value = Math.round(num * 100);
    } else {
        volMusic.value = 20; // default to 20%
    }
} catch (_) {
    volMusic.value = 20;
}

try {
    const savedSfxVol = localStorage.getItem("gameSFXVolume");
    if (savedSfxVol != null) {
        const num = Math.max(0, Math.min(1, Number(savedSfxVol) || 0));
        volSFX.value = Math.round(num * 100);
    } else {
        volSFX.value = 50;
    }
} catch (_) {
    volSFX.value = 50;
}

volSFX.addEventListener("input", () => {
    const val = Math.max(0, Math.min(100, Number(volSFX.value) || 0));
    if (typeof window.setSFXVolume === "function") {
        window.setSFXVolume(val / 100);
    }
    try { localStorage.setItem("gameSFXVolume", String(val / 100)); } catch (_) {}
});
volMusic.addEventListener("input", () => {
    const val = Math.max(0, Math.min(100, Number(volMusic.value) || 0));
    if (typeof window.setMusicVolume === "function") {
        window.setMusicVolume(val / 100);
    }
    try { localStorage.setItem("gameMusicVolume", String(val / 100)); } catch (_) {}
});

function applyOverlordFrame(overlord) {
    if (!overlord) return;

    const imgEl   = document.getElementById("overlord-cropped");
    const frameEl = document.getElementById("overlord-frame-img");
    if (!imgEl || !frameEl) return;

    // Put the overlord/scenario portrait into the cropped square
    imgEl.src = overlord.image;

    // Scenarios: use neutral frame (no difficulty tint)
    if (overlord.type === "Scenario") {
        frameEl.style.filter = "";
        return;
    }

    // Apply color mask to frame based on level (Overlords only)
    let tint = "";

    if (overlord.level == 1) {
        tint = "brightness(1.8) sepia(1) saturate(500%) hue-rotate(10deg)";
    }
    if (overlord.level == 2) {
        tint = "brightness(1.4) sepia(1) saturate(500%) hue-rotate(-3deg)";
    }
    if (overlord.level == 3) {
        tint = "brightness(1.2) sepia(1) saturate(500%) hue-rotate(-30deg)";
    }

    frameEl.style.filter = tint;

    const box = document.getElementById("overlord-frame-box");
    if (box) {
        box.style.setProperty("--overlord-frame-filter", (tint && tint !== "none") ? tint : "none");
    }
}

export function refreshOverlordFacingGlow(state) {
    const box = document.getElementById("overlord-frame-box");
    if (!box) return;

    const anyFacing = Object.values(state?.heroData || {})
        .some(h => h && h.isFacingOverlord);

    if (anyFacing) {
        box.classList.add("overlord-facing-glow");
    } else {
        box.classList.remove("overlord-facing-glow");
    }
}

export function setCurrentOverlord(overlord) {
    if (!overlord) return;
    currentOverlord = overlord;

    applyOverlordFrame(overlord);

    const hpText = document.getElementById("overlord-hp-text");
    if (!hpText) return;

    const idStr = String(overlord.id);

    // Determine base HP of this overlord or takeover-villain
    const maxHP = Number(overlord.hp || 0);

    // Resolve current HP from object, scenario store, or overlordData
    let currentHP = overlord.currentHP;

    if (currentHP == null) {
        if (overlord.type === "Scenario") {
            // Scenario HP source
            if (gameState.scenarioHP && gameState.scenarioHP[idStr] != null) {
                currentHP = Number(gameState.scenarioHP[idStr]);
            } else {
                currentHP = maxHP;
            }
        } else {
            // Standard Overlord or Takeover-Villain
            if (gameState.overlordData && gameState.overlordData.currentHP != null) {
                currentHP = Number(gameState.overlordData.currentHP);
            } else {
                currentHP = maxHP;
            }
        }
    }

    // Sync runtime card object
    overlord.currentHP = currentHP;

    // Write back to gameState
    if (overlord.type === "Scenario") {
        if (!gameState.scenarioHP) gameState.scenarioHP = {};
        gameState.scenarioHP[idStr] = currentHP;
        gameState.activeScenarioId = idStr;
    } else {
        if (!gameState.overlordData) gameState.overlordData = {};
        gameState.overlordData.currentHP = currentHP;
    }

    const hpDisplay = `${currentHP}`;

    // Update main-page HP indicator
    hpText.textContent = hpDisplay;

    // Persist changes
    saveGameState(gameState);
}

/* === Left Panel Button (the entire overlord frame is clickable) === */
document.getElementById("overlord-frame-box").addEventListener("click", () => {
    buildOverlordPanel(currentOverlord);
});

document.getElementById("overlord-panel-close").addEventListener("click", () => {
    document.getElementById("overlord-panel").classList.remove("open");
});

function extractKeywordsFromAbilities(abilitiesTextArr) {
    if (!Array.isArray(abilitiesTextArr)) return [];

    const found = new Set();

    const keywordNames = Object.keys(keywords); // from keywords.js

    abilitiesTextArr.forEach(a => {
        if (!a || !a.text) return;

        keywordNames.forEach(kw => {
            const regex = new RegExp(`(^|[^A-Za-z0-9'])${kw}([^A-Za-z0-9']|$)`, "i");
            if (regex.test(a.text)) {
                found.add(kw);
            }
        });
    });

    return Array.from(found);
}

/* === Build the entire left panel === */
export function buildOverlordPanel(overlord) {
    if (!overlord) return;

    const panel = document.getElementById("overlord-panel");
    const content = document.getElementById("overlord-panel-content");
    content.innerHTML = "";

    /* === Set panel color based on overlord.level === */
    if (overlord.level == 1) {
        panel.style.backgroundColor = "rgba(255, 255, 0, 0.85)";
        panel.style.borderRight = "4px solid #997700";
    } else if (overlord.level == 2) {
        panel.style.backgroundColor = "rgba(255, 140, 0, 0.85)";
        panel.style.borderRight = "4px solid #663300";
    } else {
        panel.style.backgroundColor = "rgba(255, 0, 0, 0.85)";
        panel.style.borderRight = "4px solid #550000";
    }

    /* === Overlord Card === */
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("overlord-card-scale");
    cardContainer.style.margin = "0 auto";
    const rendered = renderCard(overlord.id, cardContainer);
    cardContainer.appendChild(rendered);

    /* === Overlord Stats === */
    const statsBox = document.createElement("div");

    // Resolve max HP
    const maxHP = Number(overlord.hp) || 0;

    // Resolve current HP with preference order:
    // 1) overlord.currentHP if already set
    // 2) gameState.scenarioHP[id] for Scenarios
    // 3) gameState.overlordData.currentHP for Overlords
    // 4) fall back to printed hp
    let currentHP = overlord.currentHP;
    const idStr = String(overlord.id);

    if (currentHP == null) {
        if (overlord.type === "Scenario" && gameState.scenarioHP && gameState.scenarioHP[idStr] != null) {
            currentHP = Number(gameState.scenarioHP[idStr]);
        } else if (overlord.type !== "Scenario" && gameState.overlordData && gameState.overlordData.currentHP != null) {
            currentHP = Number(gameState.overlordData.currentHP);
        } else {
            currentHP = maxHP;
        }
    }

    // Keep object + gameState in sync
    overlord.currentHP = currentHP;

    if (overlord.type === "Scenario") {
        if (!gameState.scenarioHP) gameState.scenarioHP = {};
        gameState.scenarioHP[idStr] = currentHP;
    } else {
        if (!gameState.overlordData) gameState.overlordData = {};
        gameState.overlordData.currentHP = currentHP;
    }

    const baseHP = Number(overlord.hp || 0);
    if (typeof currentHP !== "number") {
        currentHP = baseHP;
    }

    const hpDisplay = (currentHP === baseHP)
        ? `${baseHP}`
        : `${currentHP} / ${baseHP}`;

    statsBox.innerHTML = `
        <h2 style="margin: 4px 0;">${overlord.name}</h2>
        <div><strong>HP:</strong> ${hpDisplay}</div>
    `;


    /* === Overlord Abilities === */
    const abilBox = document.createElement("div");
    abilBox.innerHTML = `<h3>Abilities</h3>`;
    overlord.abilitiesText.forEach(a => {
        const line = document.createElement("div");
        line.innerHTML = renderAbilityText(a.text);
        abilBox.appendChild(line);
    });

    const topRow = document.createElement("div");
    topRow.classList.add("overlord-top-row");

    const rightColumn = document.createElement("div");
    rightColumn.classList.add("overlord-right-column");

    rightColumn.appendChild(statsBox);
    rightColumn.appendChild(abilBox);

    topRow.appendChild(cardContainer);
    topRow.appendChild(rightColumn);

    content.appendChild(topRow);

    /* === Tactics List (alphabetical) === */
    const tacticNames = currentTactics
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

    const tacticBox = document.createElement("div");
    tacticBox.innerHTML = `<h3>Tactics</h3>`;
    tacticNames.forEach(t => {
        const tDiv = document.createElement("div");
        tDiv.innerHTML = `<strong>${t.name}</strong><br>`;
        t.abilitiesText.forEach(a => {
            const line = document.createElement("div");
            line.innerHTML = renderAbilityText(a.text);
            tDiv.appendChild(line);
        });
        tDiv.style.marginBottom = "8px";
        tacticBox.appendChild(tDiv);
    });
    content.appendChild(tacticBox);

    /* === Keyword Extraction === */
    const extractedOverlordKeys = extractKeywordsFromAbilities(overlord.abilitiesText);
    const extractedTacticKeys = currentTactics.flatMap(t => extractKeywordsFromAbilities(t.abilitiesText));

    const allKeywords = [...extractedOverlordKeys, ...extractedTacticKeys];

    // Unique & alphabetized
    const deduped = Array.from(new Set(allKeywords)).sort((a, b) => a.localeCompare(b));

    const keyBox = document.createElement("div");
    keyBox.innerHTML = `<h3>Keywords</h3>`;

    if (deduped.length === 0) {
        const none = document.createElement("div");
        none.style.fontStyle = "italic";
        none.style.color = "#222";
        none.textContent = "No Keywords Found";
        keyBox.appendChild(none);
        content.appendChild(keyBox);
        const spacer = document.createElement("div");
        spacer.style.height = "50px";
        content.appendChild(spacer);
        panel.classList.add("open");
        return;
    }

    deduped.forEach(k => {
        const line = document.createElement("div");
        line.style.marginBottom = "6px";

        const definition = keywords[k] || "<i>No definition found.</i>";

        line.innerHTML = `
            <div style="font-weight:bold;">${k}</div>
            <div style="margin-left:8px;">${definition}</div>
        `;
        keyBox.appendChild(line);
    });

    content.appendChild(keyBox);

    const spacer = document.createElement("div");
    spacer.style.height = "50px";
    content.appendChild(spacer);

    panel.classList.add("open");
}

document.getElementById("hero-panel-close").addEventListener("click", () => {
    document.getElementById("hero-panel").classList.remove("open");
});

document.getElementById("villain-panel-close").addEventListener("click", () => {
        document.getElementById("villain-panel").classList.remove("open");
});

function getFoeCurrentAndMaxHP(foeCard, opts = {}) {
    if (!foeCard) {
        return { currentHP: 0, maxHP: 0 };
    }

    const maxHP = Number(foeCard.hp) || 0;
    const idStr = String(foeCard.id);
    const instRaw = opts.instanceId ?? foeCard.instanceId ?? null;
    const instKey = instRaw != null ? String(instRaw) : null;
    const entry = opts.entry || null;

    let currentHP = null;

    // 0) If an entry is provided, prefer its currentHP
    if (entry && typeof entry.currentHP === "number") {
        currentHP = Number(entry.currentHP);
    }

    // 1) If we don't have a runtime currentHP, try gameState
    if (currentHP == null) {
        // Prefer villainHP map by instance, then by id
        if (instKey && gameState.villainHP && typeof gameState.villainHP[instKey] === "number") {
            currentHP = Number(gameState.villainHP[instKey]);
        } else if (gameState.villainHP && typeof gameState.villainHP[idStr] === "number") {
            currentHP = Number(gameState.villainHP[idStr]);
        } else if (Array.isArray(gameState.cities)) {
            // Fallback: look at any city entry with matching instance or id
            const cityEntry = gameState.cities.find(c =>
                c &&
                (
                    (instKey && getInstanceKey(c) === instKey) ||
                    String(c.id) === idStr
                )
            );
            if (cityEntry && typeof cityEntry.currentHP === "number") {
                currentHP = Number(cityEntry.currentHP);
            }
        }
    }

    // 1b) If the card itself carries a runtime currentHP (e.g., override object), use it next
    if (currentHP == null && typeof foeCard.currentHP === "number") {
        currentHP = Number(foeCard.currentHP);
    }

    // 2) If still null, just use full HP
    if (currentHP == null) {
        currentHP = maxHP;
    }

    // 3) Sync back into card object & state
    foeCard.currentHP = currentHP;

    if (!gameState.villainHP) gameState.villainHP = {};
    gameState.villainHP[idStr] = currentHP;
    if (instKey) gameState.villainHP[instKey] = currentHP;

    return { currentHP, maxHP };
}

const getInstanceKey = (obj) => {
    const k = obj?.instanceId ?? obj?.uniqueId ?? null;
    return (k == null) ? null : String(k);
};

function showDamageSelectConfirm({ amount, foeName }) {
    return new Promise(resolve => {
        // If a damage confirm overlay is already open, remove it before creating a new one
        try {
            const existing = document.querySelectorAll('[data-damage-confirm-overlay="1"]');
            existing.forEach(el => { try { el.remove(); } catch (e) {} });
        } catch (e) {
            console.warn("[damageConfirm] Failed to clear existing overlays", e);
        }

        const overlay = document.createElement("div");
        overlay.dataset.damageConfirmOverlay = "1";
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 16px;
        `;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #fff;
            color: #111;
            border-radius: 14px;
            border: 4px solid #000;
            width: min(420px, 100%);
            box-shadow: 0 10px 24px rgba(0,0,0,0.35);
            padding: 18px;
            text-align: center;
            font-family: 'Racing Sans One', 'Montserrat', 'Helvetica', sans-serif;
        `;

        const title = document.createElement("div");
        title.style.cssText = "font-size: 28px; font-weight: 800; margin-bottom: 10px;";
        title.textContent = "Confirm Damage";

        const msg = document.createElement("div");
        msg.style.cssText = "font-size: 22px; line-height: 1.35; margin-bottom: 16px;";
        const isKO = Number(amount) === 999;
        msg.textContent = isKO
            ? `KO ${foeName}?`
            : `Deal ${amount} damage to ${foeName}?`;

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex; gap:10px; justify-content:center; flex-wrap:wrap;";

        const makeBtn = (label, bg, fg) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = label;
            b.style.cssText = `
                flex: 1 1 120px;
                padding: 12px 14px;
                font-size: 16px;
                font-weight: 800;
                border: 3px solid #000;
                border-radius: 12px;
                background: ${bg};
                color: ${fg};
                cursor: pointer;
            `;
            return b;
        };

        const yesBtn = makeBtn("Yes", "#ffd800", "#000");
        const noBtn  = makeBtn("No", "#e3e3e3", "#000");

        const cleanup = (result) => {
            try { overlay.remove(); } catch (e) {}
            resolve(result);
        };

        yesBtn.onclick = () => cleanup(true);
        noBtn.onclick  = () => cleanup(false);

        btnRow.appendChild(yesBtn);
        btnRow.appendChild(noBtn);

        box.appendChild(title);
        box.appendChild(msg);
        box.appendChild(btnRow);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

function showRescueSelectConfirm({ foeName }) {
    return new Promise(resolve => {
        try {
            const existing = document.querySelectorAll('[data-rescue-confirm-overlay="1"]');
            existing.forEach(el => { try { el.remove(); } catch (e) {} });
        } catch (e) {
            console.warn("[rescueConfirm] Failed to clear existing overlays", e);
        }

        const overlay = document.createElement("div");
        overlay.dataset.rescueConfirmOverlay = "1";
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 16px;
        `;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #fff;
            color: #111;
            border-radius: 14px;
            border: 4px solid #000;
            width: min(420px, 100%);
            box-shadow: 0 10px 24px rgba(0,0,0,0.35);
            padding: 18px;
            text-align: center;
            font-family: 'Racing Sans One', 'Montserrat', 'Helvetica', sans-serif;
        `;

        const title = document.createElement("div");
        title.style.cssText = "font-size: 28px; font-weight: 800; margin-bottom: 10px;";
        title.textContent = "Rescue Bystanders";

        const msg = document.createElement("div");
        msg.style.cssText = "font-size: 22px; line-height: 1.35; margin-bottom: 16px;";
        msg.textContent = `Rescue captured bystanders from ${foeName}?`;

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex; gap:10px; justify-content:center; flex-wrap:wrap;";

        const makeBtn = (label, bg, fg) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = label;
            b.style.cssText = `
                flex: 1 1 120px;
                padding: 12px 14px;
                font-size: 16px;
                font-weight: 800;
                border: 3px solid #000;
                border-radius: 12px;
                background: ${bg};
                color: ${fg};
                cursor: pointer;
            `;
            return b;
        };

        const yesBtn = makeBtn("Yes", "#ffd800", "#000");
        const noBtn  = makeBtn("No", "#e3e3e3", "#000");

        const cleanup = (result) => {
            try { overlay.remove(); } catch (e) {}
            resolve(result);
        };

        yesBtn.onclick = () => cleanup(true);
        noBtn.onclick  = () => cleanup(false);

        btnRow.appendChild(yesBtn);
        btnRow.appendChild(noBtn);

        box.appendChild(title);
        box.appendChild(msg);
        box.appendChild(btnRow);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

function showFreezeSelectConfirm({ foeName }) {
    return new Promise(resolve => {
        // If a freeze confirm overlay is already open, remove it before creating a new one
        try {
            const existing = document.querySelectorAll('[data-freeze-confirm-overlay="1"]');
            existing.forEach(el => { try { el.remove(); } catch (e) {} });
        } catch (e) {
            console.warn("[freezeConfirm] Failed to clear existing overlays", e);
        }

        const overlay = document.createElement("div");
        overlay.dataset.freezeConfirmOverlay = "1";
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 16px;
        `;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #fff;
            color: #111;
            border-radius: 14px;
            border: 4px solid #000;
            width: min(420px, 100%);
            box-shadow: 0 10px 24px rgba(0,0,0,0.35);
            padding: 18px;
            text-align: center;
            font-family: 'Racing Sans One', 'Montserrat', 'Helvetica', sans-serif;
        `;

        const title = document.createElement("div");
        title.style.cssText = "font-size: 22px; font-weight: 800; margin-bottom: 10px;";
        title.textContent = "Freeze Foe";

        const msg = document.createElement("div");
        msg.style.cssText = "font-size: 18px; line-height: 1.35; margin-bottom: 16px;";
        msg.textContent = `Freeze ${foeName}?`;

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex; gap:10px; justify-content:center; flex-wrap:wrap;";

        const makeBtn = (label, bg, fg) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = label;
            b.style.cssText = `
                flex: 1 1 120px;
                padding: 12px 14px;
                font-size: 16px;
                font-weight: 800;
                border: 3px solid #000;
                border-radius: 12px;
                background: ${bg};
                color: ${fg};
                cursor: pointer;
            `;
            return b;
        };

        const yesBtn = makeBtn("Yes", "#ffd800", "#000");
        const noBtn  = makeBtn("No", "#e3e3e3", "#000");

        const cleanup = (result) => {
            try { overlay.remove(); } catch (e) {}
            resolve(result);
        };

        yesBtn.onclick = () => cleanup(true);
        noBtn.onclick  = () => cleanup(false);

        btnRow.appendChild(yesBtn);
        btnRow.appendChild(noBtn);

        box.appendChild(title);
        box.appendChild(msg);
        box.appendChild(btnRow);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

function showShoveSelectConfirm({ foeName }) {
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 16px;
        `;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #fff;
            color: #111;
            border-radius: 14px;
            border: 4px solid #000;
            width: min(420px, 100%);
            box-shadow: 0 10px 24px rgba(0,0,0,0.35);
            padding: 18px;
            text-align: center;
            font-family: 'Racing Sans One', 'Montserrat', 'Helvetica', sans-serif;
        `;

        const title = document.createElement("div");
        title.style.cssText = "font-size: 22px; font-weight: 800; margin-bottom: 10px;";
        title.textContent = "Shove Foe";

        const msg = document.createElement("div");
        msg.style.cssText = "font-size: 18px; line-height: 1.35; margin-bottom: 16px;";
        msg.textContent = `Shove ${foeName}?`;

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex; gap:10px; justify-content:center; flex-wrap:wrap;";

        const makeBtn = (label, bg, fg) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = label;
            b.style.cssText = `
                flex: 1 1 120px;
                padding: 12px 14px;
                font-size: 16px;
                font-weight: 800;
                border: 3px solid #000;
                border-radius: 12px;
                background: ${bg};
                color: ${fg};
                cursor: pointer;
            `;
            return b;
        };

        const yesBtn = makeBtn("Yes", "#ffd800", "#000");
        const noBtn  = makeBtn("No", "#e3e3e3", "#000");

        const cleanup = (result) => {
            try { overlay.remove(); } catch (e) {}
            resolve(result);
        };

        yesBtn.onclick = () => cleanup(true);
        noBtn.onclick  = () => cleanup(false);

        btnRow.appendChild(yesBtn);
        btnRow.appendChild(noBtn);

        box.appendChild(title);
        box.appendChild(msg);
        box.appendChild(btnRow);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

function showKnockbackSelectConfirm({ foeName }) {
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 16px;
        `;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #fff;
            color: #111;
            border-radius: 14px;
            border: 4px solid #000;
            width: min(420px, 100%);
            box-shadow: 0 10px 24px rgba(0,0,0,0.35);
            padding: 18px;
            text-align: center;
            font-family: 'Racing Sans One', 'Montserrat', 'Helvetica', sans-serif;
        `;

        const title = document.createElement("div");
        title.style.cssText = "font-size: 22px; font-weight: 800; margin-bottom: 10px;";
        title.textContent = "Knockback";

        const msg = document.createElement("div");
        msg.style.cssText = "font-size: 18px; line-height: 1.35; margin-bottom: 16px;";
        msg.textContent = `Return ${foeName} to the top of the villain deck?`;

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex; gap:10px; justify-content:center; flex-wrap:wrap;";

        const makeBtn = (label, bg, fg) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = label;
            b.style.cssText = `
                flex: 1 1 120px;
                padding: 12px 14px;
                font-size: 16px;
                font-weight: 800;
                border: 3px solid #000;
                border-radius: 12px;
                background: ${bg};
                color: ${fg};
                cursor: pointer;
            `;
            return b;
        };

        const yesBtn = makeBtn("Yes", "#ffd800", "#000");
        const noBtn  = makeBtn("No", "#e3e3e3", "#000");

        const cleanup = (result) => {
            try { overlay.remove(); } catch (e) {}
            resolve(result);
        };

        yesBtn.onclick = () => cleanup(true);
        noBtn.onclick  = () => cleanup(false);

        btnRow.appendChild(yesBtn);
        btnRow.appendChild(noBtn);

        box.appendChild(title);
        box.appendChild(msg);
        box.appendChild(btnRow);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

function showGivePassiveSelectConfirm({ foeName, label = "Apply Passive" }) {
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 16px;
        `;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #fff;
            color: #111;
            border-radius: 14px;
            border: 4px solid #000;
            width: min(420px, 100%);
            box-shadow: 0 10px 24px rgba(0,0,0,0.35);
            padding: 18px;
            text-align: center;
            font-family: 'Racing Sans One', 'Montserrat', 'Helvetica', sans-serif;
        `;

        const title = document.createElement("div");
        title.style.cssText = "font-size: 22px; font-weight: 800; margin-bottom: 10px;";
        title.textContent = label;

        const msg = document.createElement("div");
        msg.style.cssText = "font-size: 18px; line-height: 1.35; margin-bottom: 16px;";
        msg.textContent = `Apply to ${foeName}?`;

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex; gap:10px; justify-content:center; flex-wrap:wrap;";

        const makeBtn = (label, bg, fg) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = label;
            b.style.cssText = `
                flex: 1 1 120px;
                padding: 12px 14px;
                font-size: 16px;
                font-weight: 800;
                border: 3px solid #000;
                border-radius: 12px;
                background: ${bg};
                color: ${fg};
                cursor: pointer;
            `;
            return b;
        };

        const yesBtn = makeBtn("Yes", "#ffd800", "#000");
        const noBtn  = makeBtn("No", "#e3e3e3", "#000");

        const cleanup = (result) => {
            try { overlay.remove(); } catch (e) {}
            resolve(result);
        };

        yesBtn.onclick = () => cleanup(true);
        noBtn.onclick  = () => cleanup(false);

        btnRow.appendChild(yesBtn);
        btnRow.appendChild(noBtn);

        box.appendChild(title);
        box.appendChild(msg);
        box.appendChild(btnRow);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}

function findCityEntryForVillainCard(villainCard, state = gameState, opts = {}) {
    const cities = state?.cities;
    if (!Array.isArray(cities)) return { entry: null, slotIndex: null };

    const idStr = String(villainCard.baseId ?? villainCard.id ?? "");
    const key = opts.instanceId ?? getInstanceKey(villainCard);
    const preferredSlot = Number.isInteger(opts.slotIndex) ? opts.slotIndex : null;

    // 0) Direct slot hint
    if (preferredSlot != null && cities[preferredSlot]) {
        const e = cities[preferredSlot];
        if (String(e.id) === idStr || (key && getInstanceKey(e) === key)) {
            return { entry: e, slotIndex: preferredSlot };
        }
    }

    // 1) Prefer a direct instanceId/uniqueId match
    if (key) {
        const idx = cities.findIndex(c => c && getInstanceKey(c) === key);
        if (idx !== -1) {
            return { entry: cities[idx], slotIndex: idx };
        }
    }

    // 2) Fallback by base id (ambiguous if multiple copies exist)
    let found = null;
    let foundIndex = null;
    let count = 0;

    cities.forEach((c, i) => {
        if (c && String(c.id) === idStr) {
            found = c;
            foundIndex = i;
            count += 1;
        }
    });

    if (count > 1) {
        console.warn(
            "[buildVillainPanel] Multiple city entries share this foe id; selection may target the first match.",
            { idStr, count }
        );
    }

    return { entry: found, slotIndex: foundIndex };
}

export function buildVillainPanel(villainCard, opts = {}) {
    if (!villainCard) return;

    // If a shoveVillain(any) is pending, hijack the click to a confirm modal instead of opening the panel UI.
    const pendingShove = (typeof window !== "undefined") ? window.__shoveVillainSelectMode : null;
    if (pendingShove && typeof window !== "undefined" && typeof window.__shoveVillainEffect === "function") {
        const stateForShove = pendingShove.state || gameState;
        const { entry, slotIndex } = findCityEntryForVillainCard(villainCard, stateForShove, opts);

        if (entry) {
            showShoveSelectConfirm({ foeName: villainCard.name }).then(allow => {
                if (!allow) return;
                window.__shoveVillainEffect({ entry, slotIndex }, pendingShove.count, stateForShove, pendingShove.heroId);
                window.__shoveVillainSelectMode = null;
            });
            return;
        }
    }

    // If a freezeVillain(any) is pending, hijack the click to a confirm modal instead of opening the panel UI.
    const pendingFreeze = (typeof window !== "undefined") ? window.__freezeSelectMode : null;
    if (pendingFreeze) {
        const stateForFreeze = pendingFreeze.state || gameState;
        const { entry, slotIndex } = findCityEntryForVillainCard(villainCard, stateForFreeze, opts);

        if (!entry) {
            console.warn("[buildVillainPanel] No matching city entry found for freeze target.");
        } else {
            showFreezeSelectConfirm({
                foeName: villainCard.name
            }).then(allow => {
                if (!allow) return;

                freezeFoe(entry, slotIndex, stateForFreeze, {
                    howLong: pendingFreeze.howLong,
                    heroId: pendingFreeze.heroId ?? null
                });

                window.__freezeSelectMode = null;
                try {
                    if (Array.isArray(window.__afterFreezeCallbacks)) {
                        const cbs = window.__afterFreezeCallbacks.splice(0);
                        cbs.forEach(cb => { try { cb(); } catch (err) { console.warn("[freeze] afterFreeze callback failed", err); } });
                    }
                } catch (e) {
                    console.warn("[freeze] Failed to run afterFreeze callbacks", e);
                }
                try { if (typeof window !== "undefined" && typeof window.__clearDamageFoeHighlights === "function") window.__clearDamageFoeHighlights(); } catch (e) {}
            });
            return;
        }
    }

    // If a knockback(any) is pending, hijack the click to a confirm modal instead of opening the panel UI.
    const pendingKnockback = (typeof window !== "undefined") ? window.__knockbackSelectMode : null;
    if (pendingKnockback) {
        const stateForKnockback = pendingKnockback.state || gameState;

        // Guard against multiple open popups: clear prior pending selection if another is active
        if (pendingKnockback.active) {
            try { window.__knockbackSelectMode = null; } catch (e) {}
        } else {
            const { entry, slotIndex } = findCityEntryForVillainCard(villainCard, stateForKnockback, opts);
            const type = (villainCard.type || "").toLowerCase();

            if (!entry) {
                console.warn("[buildVillainPanel] No matching city entry found for knockback target.");
            } else if (type !== "henchman" && type !== "villain") {
                console.log("[buildVillainPanel] Knockback requires a Henchman or Villain; ignoring selection.");
            } else {
                window.__knockbackSelectMode.active = true;
                showKnockbackSelectConfirm({ foeName: villainCard.name }).then(allow => {
                    try { window.__knockbackSelectMode = null; } catch (e) {}
                    if (!allow) return;

                    knockbackFoe(entry, slotIndex, stateForKnockback, pendingKnockback.heroId ?? null);
                    stateForKnockback.pendingKnockback = null;
                    saveGameState(stateForKnockback);
                });
                return;
            }
        }
    }

    // If a giveVillainPassive(any) is pending, hijack the click to a confirm modal instead of opening the panel UI.
    const pendingPassive = (typeof window !== "undefined") ? window.__givePassiveSelectMode : null;
    if (pendingPassive) {
        const stateForPassive = pendingPassive.state || gameState;
        const { entry, slotIndex } = findCityEntryForVillainCard(villainCard, stateForPassive, opts);
        const type = (villainCard.type || "").toLowerCase();

        if (!entry) {
            console.warn("[buildVillainPanel] No matching city entry found for passive target.");
        } else if (type !== "henchman" && type !== "villain") {
            console.log("[buildVillainPanel] Passives require a Henchman or Villain; ignoring selection.");
        } else {
            showGivePassiveSelectConfirm({ foeName: villainCard.name, label: "Give Passive" }).then(allow => {
                if (!allow) return;
                givePassiveToEntry(entry, pendingPassive.passive, pendingPassive.howLong, stateForPassive, pendingPassive.heroId ?? null);
                saveGameState(stateForPassive);
                try { if (typeof window !== "undefined") window.__givePassiveSelectMode = null; } catch (e) {}
            });
            return;
        }
    }

    // If a rescueCapturedBystander(any) is pending, hijack click to rescue instead of opening panel.
    const pendingRescue = (typeof window !== "undefined") ? window.__rescueCapturedSelectMode : null;
    if (pendingRescue) {
        const stateForRescue = pendingRescue.state || gameState;
        const { entry, slotIndex } = findCityEntryForVillainCard(villainCard, stateForRescue);

        if (!entry) {
            console.warn("[buildVillainPanel] No matching city entry found for rescue target.");
            return;
        }

        if (Array.isArray(pendingRescue.allowedSlots) && pendingRescue.allowedSlots.length && !pendingRescue.allowedSlots.includes(slotIndex)) {
            console.log("[buildVillainPanel] Rescue selection active but this foe is not in an allowed slot; ignoring.");
            return;
        }

        const hasCaptured =
            (Array.isArray(entry.capturedBystanders) && entry.capturedBystanders.length > 0) ||
            (Number(entry.capturedBystanders) > 0);
        if (pendingRescue.requireBystanders && !hasCaptured) {
            console.log("[buildVillainPanel] Rescue selection requires a foe with captured bystander(s); ignoring.");
            return;
        }

        const proceed = () => {
            const foeName = villainCard.name || "Enemy";
            if (pendingRescue.requireConfirm) {
                showRescueSelectConfirm({ foeName }).then(allow => {
                    if (!allow) return;
                    pendingRescue.customHandler({ entry, slotIndex, state: stateForRescue });
                    try { window.__rescueCapturedSelectMode = null; } catch (e) {}
                });
            } else {
                pendingRescue.customHandler({ entry, slotIndex, state: stateForRescue });
                try { window.__rescueCapturedSelectMode = null; } catch (e) {}
            }
        };

        proceed();
        return;
    }

    // If a damageFoe(any/anyCoastal) is pending, hijack the click to a confirm modal instead of opening the panel UI.
    const pendingSelect = (typeof window !== "undefined") ? window.__damageFoeSelectMode : null;
    if (pendingSelect && (typeof pendingSelect.amount === "number" || typeof pendingSelect.customHandler === "function")) {
        const stateForDamage = pendingSelect.state || gameState;
        const { entry, slotIndex } = findCityEntryForVillainCard(villainCard, stateForDamage);

        if (!entry) {
            console.warn("[buildVillainPanel] No matching city entry found for selection target.");
            return;
        }

        // If selection is restricted to certain slots, ignore foes outside that set.
        if (Array.isArray(pendingSelect.allowedSlots) && !pendingSelect.allowedSlots.includes(slotIndex)) {
            console.log("[buildVillainPanel] Selection mode active but this foe is not in an allowed slot; ignoring.");
            return;
        }

        // If selection is restricted to certain types, ignore foes outside that set.
        if (Array.isArray(pendingSelect.allowedTypes) && pendingSelect.allowedTypes.length) {
            if (!pendingSelect.allowedTypes.includes(villainCard.type)) {
                console.log("[buildVillainPanel] Selection mode active but this foe is not an allowed type; ignoring.");
                return;
            }
        }

        // If selection requires captured bystanders, ensure this foe has any.
        if (pendingSelect.requireBystanders) {
            const hasCaptured =
                (Array.isArray(entry.capturedBystanders) && entry.capturedBystanders.length > 0) ||
                (Number(entry.capturedBystanders) > 0);
            if (!hasCaptured) {
                console.log("[buildVillainPanel] Selection mode requires a foe with captured bystander(s); ignoring.");
                return;
            }
        }

        const proceed = () => {
            const summary = {
                foeType: villainCard.type || "Enemy",
                foeId: String(villainCard.baseId ?? villainCard.id ?? ""),
                instanceId: getInstanceKey(entry) || getInstanceKey(villainCard),
                foeName: villainCard.name,
                currentHP: entry.currentHP ?? villainCard.currentHP ?? villainCard.hp,
                slotIndex,
                source: "city-upper"
            };

            if (typeof pendingSelect.customHandler === "function") {
                if (pendingSelect.requireConfirm) {
                    showDisableVillainConfirm({
                        foeName: villainCard.name,
                        message: pendingSelect.confirmMessage
                    }).then(allow => {
                        if (!allow) return;
                        pendingSelect.customHandler({ entry, slotIndex, state: stateForDamage, summary });
                        window.__damageFoeSelectMode = null;
                    });
                    return;
                } else {
                    pendingSelect.customHandler({ entry, slotIndex, state: stateForDamage, summary });
                    window.__damageFoeSelectMode = null;
                    return;
                }
            }

            showDamageSelectConfirm({
                amount: pendingSelect.amount,
                foeName: villainCard.name
            }).then(allow => {
                if (!allow) return;

                damageFoe(
                    pendingSelect.amount,
                    summary,
                    pendingSelect.heroId ?? null,
                    stateForDamage,
                    { flag: "single", fromAny: true }
                );

                processQueuedHeroDamage(stateForDamage);
                window.__damageFoeSelectMode = null;
            });
        };

        proceed();

        return;
    }

    const panel = document.getElementById("villain-panel");
    const content = document.getElementById("villain-panel-content");
    content.innerHTML = "";

    // Left-side rendered card
    const leftCol = document.createElement("div");
    leftCol.className = "villain-card-scale";
    leftCol.appendChild(renderCard(villainCard.id, leftCol));

    // Locate current board entry for live stats
    const { entry: villainEntry } = findCityEntryForVillainCard(villainCard, gameState, opts);

    // Right-side stats/text
    const rightCol = document.createElement("div");
    rightCol.className = "villain-right-column";
    const { currentHP, maxHP } = getFoeCurrentAndMaxHP(villainCard, {
        instanceId: opts.instanceId,
        entry: villainEntry
    });
    const hpDisplay = (currentHP === maxHP)
        ? `${maxHP}`
        : `${currentHP} / ${maxHP}`;

    // Effective damage (respect per-instance damagePenalty/currentDamage)
    let effectiveDamage = (typeof villainCard.currentDamage === "number")
        ? villainCard.currentDamage
        : Number(villainCard.damage ?? villainCard.dmg ?? 0) || 0;
    if (villainEntry) {
        if (typeof villainEntry.currentDamage === "number") {
            effectiveDamage = villainEntry.currentDamage;
        } else {
            const base = Number(villainCard.damage ?? villainCard.dmg ?? 0) || 0;
            const penalty = Number(villainEntry.damagePenalty || 0);
            effectiveDamage = Math.max(0, base - penalty);
        }
    }

    panel.dataset.villainId = String(villainCard.id);

    rightCol.innerHTML = `
        <h2>${villainCard.name}</h2>
        <div><strong>${villainCard.type}</strong></div>
        <div><strong>HP:</strong> <span id="villain-panel-hp">${hpDisplay}</span></div>
        <div><strong>Damage:</strong> ${effectiveDamage}</div>
        <h3>Abilities</h3>
    `;

    if (villainCard.abilitiesText?.length) {
        villainCard.abilitiesText.forEach(a => {
            const line = document.createElement("div");
            line.innerHTML = renderAbilityText(a.text);
            rightCol.appendChild(line);
        });
    }

    // Final assembly
    const topRow = document.createElement("div");
    topRow.className = "villain-top-row";
    topRow.appendChild(leftCol);
    topRow.appendChild(rightCol);

    content.appendChild(topRow);

    const captured = document.createElement("div");

    const capturedList = Array.isArray(villainCard.capturedBystanders)
        ? villainCard.capturedBystanders
        : [];

    const capturedCount =
        capturedList.length ||
        Number(villainCard.capturedBystanders) ||
        0;

    captured.innerHTML = `
        <h3>Captured Bystanders</h3>
        ${
            capturedList.length
                ? (() => {
                    const counts = capturedList.reduce((map, b) => {
                        const key = b.name || "Unknown";
                        map[key] = (map[key] || 0) + 1;
                        return map;
                    }, {});

                    const lines = Object.entries(counts)
                        .map(([name, count]) => `${count}x ${name}`)
                        .join("<br>");

                    return `<div style="margin-top:4px; font-size:0.9em;">${lines}</div>`;
                })()
                : `<div style="margin-top:4px; font-size:0.9em; opacity:0.6;">None</div>`
        }
    `;
    content.appendChild(captured);


    const foundKeys = extractKeywordsFromAbilities(villainCard.abilitiesText).sort((a, b) => a.localeCompare(b));

    const keyBox = document.createElement("div");
    keyBox.innerHTML = `<h3>Keywords</h3>`;

    if (foundKeys.length === 0) {
        const none = document.createElement("div");
        none.style.fontStyle = "italic";
        none.textContent = "No Keywords Found";
        keyBox.appendChild(none);
    } else {
        foundKeys.forEach(k => {
            const line = document.createElement("div");
            line.style.marginBottom = "6px";
            line.innerHTML = `
                <div style="font-weight:bold;">${k}</div>
                <div style="margin-left:8px;">${keywords[k] || "No definition found."}</div>
            `;
            keyBox.appendChild(line);
        });
    }

    content.appendChild(keyBox);

    // Slide panel open
    panel.classList.add("open");
}
window.buildVillainPanel = buildVillainPanel;

/* Keyword extraction reused for heroes */
function extractHeroKeywords(abilitiesTextArr) {
    if (!Array.isArray(abilitiesTextArr)) return [];
    const found = new Set();
    const keywordNames = Object.keys(keywords);

    abilitiesTextArr.forEach(a => {
        if (!a || !a.text) return;
        keywordNames.forEach(kw => {
            const regex = new RegExp(`(^|[^A-Za-z0-9'])${kw}([^A-Za-z0-9']|$)`, "i");
            if (regex.test(a.text)) found.add(kw);
        });
    });

    return Array.from(found);
}

function getRGB(color) {
    const d = document.createElement("div");
    d.style.color = color;
    document.body.appendChild(d);

    const rgb = window.getComputedStyle(d).color;
    document.body.removeChild(d);

    return rgb; // returns "rgb(r, g, b)"
}

function lightenRGB(rgbString, factor = 0.65) {
    // rgbString is like "rgb(255, 0, 0)"
    const nums = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = nums;

    // Move the color toward white by the given factor
    const nr = Math.round(r + (255 - r) * factor);
    const ng = Math.round(g + (255 - g) * factor);
    const nb = Math.round(b + (255 - b) * factor);

    return `rgb(${nr}, ${ng}, ${nb})`;
}

function initAndLogHeroIconAbilities(state = gameState) {
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    if (!heroIds.length) return;

    if (!s.heroData) s.heroData = {};

    console.log("=== HERO ICON ABILITIES ===");

    heroIds.forEach(id => {
        const heroObj = heroes.find(h => String(h.id) === String(id));
        if (!heroObj) return;

        const effects = Array.isArray(heroObj.abilitiesEffects) ? heroObj.abilitiesEffects : [];
        const names = Array.isArray(heroObj.abilitiesNamePrint) ? heroObj.abilitiesNamePrint : [];

        const hState = s.heroData[id] = s.heroData[id] || {};
        hState.baseUses = hState.baseUses || {};
        hState.currentUses = hState.currentUses || {};
        const baseUsesRef = hState.baseUses;
        const currentUsesRef = hState.currentUses;

        // Sync uses into heroObj for UI panel consumption
        heroObj.currentUses = heroObj.currentUses || {};
        heroObj.baseUses = heroObj.baseUses || {};

        if (!effects.length) {
            console.log(`[ICON] ${heroObj.name}: (no icon abilities found)`);
            return;
        }

        effects.forEach((eff, i) => {
            const label = names[i]?.text || `Ability ${i + 1}`;
            const maxUses = Number(eff?.uses ?? 0);

            // Initialize base uses
            if (baseUsesRef[i] == null) {
                baseUsesRef[i] = maxUses;
            }

            // Initialize remaining uses if not set (skip passives, which are tracked as "-")
            if (eff?.type !== "passive") {
                if (currentUsesRef[i] == null) {
                    currentUsesRef[i] = maxUses;
                }
            } else {
                currentUsesRef[i] = null;
            }

            heroObj.currentUses[i] = currentUsesRef[i];
            heroObj.baseUses[i] = baseUsesRef[i];

            const effectText = Array.isArray(eff?.effect)
                ? eff.effect.join(", ")
                : (eff?.effect || "none");
            const usesText = (eff?.type === "passive")
                ? "passive"
                : `${currentUsesRef[i] ?? maxUses} / ${baseUsesRef[i] ?? maxUses}`;
            const condText = eff?.condition || "none";
            const typeText = eff?.type || "unknown";

            console.log(
                `[ICON] ${heroObj.name}: ${label} — type:${typeText}, condition:${condText}, uses:${usesText}, effect:${effectText}`
            );
        });
    });
}

export function buildHeroPanel(hero) {
    if (!hero) return;

    const panel = document.getElementById("hero-panel");
    const content = document.getElementById("hero-panel-content");
    content.innerHTML = "";

    /* HERO PANEL COLORING */
    const rgb = getRGB(hero.color || "white");
    const light = lightenRGB(rgb, 0.35);
    panel.style.backgroundColor = light.replace("rgb", "rgba").replace(")", ", 0.85)");
    panel.style.borderRight = `4px solid ${hero.color || "black"}`;

    /* CARD */
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("hero-card-scale");
    const rendered = renderCard(hero.id, cardContainer);
    cardContainer.appendChild(rendered);

    /* STATS */
    const liveHP =
        (gameState.heroData?.[hero.id]?.hp) ??
        hero.currentHP ??
        hero.hp;

    hero.currentHP = liveHP ?? hero.hp;

    const statsBox = document.createElement("div");
    statsBox.innerHTML = `
        <h2 style="margin:4px 0;">${hero.name}</h2>
        <div><strong>HP:</strong> ${
            (hero.currentHP === hero.hp)
                ? hero.hp                      // show only HP if full
                : `${hero.currentHP} / ${hero.hp}`  // otherwise show current/max
        }</div>
        <div><strong>Damage Threshold:</strong> ${getCurrentHeroDT(hero.id, gameState)}</div>
        <div><strong>Travel Budget:</strong> ${
            (() => {
                const heroState = gameState.heroData?.[hero.id];
                const base = Number(hero.travel || 0);

                // If we have a currentTravel value, use it; otherwise fall back to base.
                const curr = (heroState && typeof heroState.currentTravel === "number")
                    ? heroState.currentTravel
                    : base;

                // If different, show "current/base", else just base.
                return (curr !== base)
                    ? `${curr} / ${base}`
                    : `${base}`;
            })()
        }</div>
        <div><strong>Retreat Requirement:</strong> ${hero.retreat}</div>
    `;

    /* ABILITIES */
    const abilBox = document.createElement("div");
    abilBox.innerHTML = `<h3 style="margin-bottom:0; padding-bottom:0;">Abilities</h3>`;

    hero.abilitiesText.forEach((a, i) => {
        const block = document.createElement("div");
        block.innerHTML = renderAbilityText(a.text);
        abilBox.appendChild(block);
    });

    /* Top row: card left, text right */
    const topRow = document.createElement("div");
    topRow.classList.add("hero-top-row");

    const rightColumn = document.createElement("div");
    rightColumn.classList.add("hero-right-column");

    rightColumn.appendChild(statsBox);
    rightColumn.appendChild(abilBox);

    topRow.appendChild(cardContainer);
    topRow.appendChild(rightColumn);

    content.appendChild(topRow);

    const usesList = document.createElement("div");
    usesList.innerHTML = `<h3 style="margin-bottom:4px;">Ability Uses</h3>`;

    // Ensure currentUses exists
    hero.currentUses = hero.currentUses || {};

    hero.abilitiesNamePrint.forEach((nameObj, i) => {
        const effect = hero.abilitiesEffects[i] || {};
        const maxUses = Number(effect.uses || 0);

        // Initialize remaining uses
        if (hero.currentUses[i] == null) {
            hero.currentUses[i] = maxUses;
        }

        const remaining = hero.currentUses[i];

        const line = document.createElement("div");
        line.style.display = "flex";
        line.style.flexDirection = "row";
        line.style.alignItems = "center";
        line.style.fontSize = "12px";
        line.style.margin = "3px 0";

        // Number + "x"
        const count = document.createElement("div");
        if (effect.type === "passive") {
            count.textContent = "-";
        } else {
            count.textContent = `${remaining}x`;
        }
        count.style.fontWeight = "bold";
        count.style.marginRight = "6px";
        count.style.width = "24px";  // keeps alignment consistent

        const label = document.createElement("div");
        label.textContent = nameObj.text;

        line.appendChild(count);
        line.appendChild(label);
        usesList.appendChild(line);
    });

    content.appendChild(usesList);

    /* KEYWORDS */
    const foundKeys = extractHeroKeywords(hero.abilitiesText).sort((a, b) => a.localeCompare(b));

    const keyBox = document.createElement("div");
    keyBox.innerHTML = `<h3>Keywords</h3>`;

    if (foundKeys.length === 0) {
        const none = document.createElement("div");
        none.style.fontStyle = "italic";
        none.textContent = "No Keywords Found";
        keyBox.appendChild(none);
    } else {
        foundKeys.forEach(k => {
            const line = document.createElement("div");
            line.style.marginBottom = "6px";
            line.innerHTML = `
                <div style="font-weight:bold;">${k}</div>
                <div style="margin-left:8px;">${keywords[k] || "No definition found."}</div>
            `;
            keyBox.appendChild(line);
        });
    }

    content.appendChild(keyBox);

    /* Open panel */
    panel.classList.add("open");
}

/* === Make Hero Portraits Clickable === */
function attachHeroClicks() {
    const row = document.getElementById("heroes-row");
    const wrappers = row.querySelectorAll(".hero-border-wrapper");

    wrappers.forEach((wrap, index) => {
        wrap.style.cursor = "pointer";

        wrap.addEventListener("click", () => {
            const id = selectedHeroes[index];
            if (!id) return;
            const hero = heroMap.get(String(id));
            if (!hero) return;
            buildHeroPanel(hero);
        });
    });
}

const isSinglePlayer = (window.GAME_MODE === "single");
const isMultiplayer = (window.GAME_MODE === "multi");

setInterval(() => {
    saveGameState(gameState);
}, 5000);

export function placeCardIntoCitySlot(cardId, slotIndex) {
    const citySlots = document.querySelectorAll(".city-slot");
    const slot = citySlots[slotIndex];
    if (!slot) return;

    const cardArea = slot.querySelector(".city-card-area");
    if (!cardArea) return;

    // Clear old content
    cardArea.innerHTML = "";

    // Resolve base ID (string-safe)
    const baseId = String(cardId);

    // Resolve immutable template (NEVER MUTATE THIS)
    const cardTemplate =
        henchmen.find(h => String(h.id) === baseId) ||
        villains.find(v => String(v.id) === baseId) ||
        null;

    if (!cardTemplate) {
        console.warn("[CitySlot] No card template found for", baseId);
        return;
    }

    // Generate instance ID FIRST (critical)
    const uuid =
        (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const instanceId = `${baseId}#${uuid}`;

    // Build wrapper + render using BASE ID (renderCard expects base card)
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const rendered = renderCard(baseId, wrapper);
    wrapper.appendChild(rendered);
    cardArea.appendChild(wrapper);

    // Upper-row entry animation
    const isUpperRow = (
        slotIndex === CITY_EXIT_UPPER ||
        slotIndex === CITY_5_UPPER ||
        slotIndex === CITY_4_UPPER ||
        slotIndex === CITY_3_UPPER ||
        slotIndex === CITY_2_UPPER ||
        slotIndex === CITY_ENTRY_UPPER
    );

    if (isUpperRow) {
        wrapper.classList.add("city-card-enter");
        setTimeout(() => wrapper.classList.remove("city-card-enter"), 650);
    }

    // -----------------------------
    // GAME STATE + HP (INSTANCE SAFE)
    // -----------------------------
    if (!Array.isArray(gameState.cities)) {
        gameState.cities = new Array(12).fill(null);
    } else if (gameState.cities.length < 12) {
        const old = gameState.cities.slice();
        gameState.cities = new Array(12).fill(null);
        for (let i = 0; i < Math.min(old.length, 12); i++) {
            gameState.cities[i] = old[i];
        }
    }

    if (!gameState.villainHP) {
        gameState.villainHP = {};
    }

    // ALWAYS derive HP from immutable template
    const baseHP = Number(cardTemplate.hp) || 1;
    const currentHP = baseHP;

    gameState.cities[slotIndex] = {
        slotIndex,
        type: "villain",
        id: baseId,        // legacy compatibility
        baseId: baseId,
        instanceId,
        maxHP: baseHP,
        currentHP
    };

    // Track HP ONLY by instance ID
    gameState.villainHP[instanceId] = currentHP;

    // -----------------------------
    // Click-to-open panel (INSTANCE COPY)
    // -----------------------------
    wrapper.style.cursor = "pointer";
    wrapper.addEventListener("click", (e) => {
        e.stopPropagation();

        const panelFn =
            (typeof window !== "undefined" && typeof window.buildVillainPanel === "function")
                ? window.buildVillainPanel
                : (typeof buildVillainPanel === "function" ? buildVillainPanel : null);

        if (!panelFn) {
            console.warn("[CitySlot] buildVillainPanel not available.");
            return;
        }

        // Pass a SAFE per-instance object
        panelFn({
            ...cardTemplate,
            baseId,
            instanceId,
            currentHP,
            maxHP: baseHP
        });
    });

    saveGameState(gameState);
}

window.addEventListener("load", () => {
    const btn = document.getElementById("start-game-btn");
    if (!btn) return;

    // Keep the button invisible
    btn.style.display = "none";

    btn.addEventListener("click", () => {
        window.VILLAIN_DRAW_ENABLED = true;
        startHeroTurn(gameState);
        gameState.isGameStarted = true;
        saveGameState(gameState);
    });

    const saved = loadGameState();

    // Auto start ONLY if new game or saved game never started
    if (!saved || !saved.isGameStarted) {
        setTimeout(() => btn.click(), 2000);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("end-turn-button");
    if (!btn) {
        console.error("End turn button not found at DOMContentLoaded");
        return;
    }

    btn.addEventListener("click", async () => {
        //console.log("End turn clicked.");
        await endCurrentHeroTurn(gameState);
    });
});

function buildTopVillainPanelFromDeckTop() {
    const panel = document.getElementById("top-villain-panel");
    const content = document.getElementById("top-villain-panel-content");

    if (!panel || !content) return;
    if (!gameState.revealedTopVillain) return;

    const deck = gameState.villainDeck || [];
    let ptr = gameState.villainDeckPointer ?? 0;

    if (!Array.isArray(deck) || deck.length === 0) return;
    if (ptr >= deck.length) {
        ptr = deck.length - 1;
    }

    const topId = deck[ptr];
    const cardData =
        henchmen.find(h => String(h.id) === String(topId)) ||
        villains.find(v => String(v.id) === String(topId));

    if (!cardData) {
        console.warn("[TOP VILLAIN PANEL] No card data for deck top id:", topId);
        return;
    }

    content.innerHTML = "";

    const rightPanelTitle = document.createElement("div");
    rightPanelTitle.innerHTML = `
        <h4>Revealed Top Card of Villain Deck</h4>
    `;
    content.appendChild(rightPanelTitle);

    // Left-side rendered card
    const leftCol = document.createElement("div");
    leftCol.className = "villain-card-scale";
    leftCol.appendChild(renderCard(cardData.id, leftCol));

    // Right-side stats/text
    const rightCol = document.createElement("div");
    rightCol.className = "villain-right-column";

    rightCol.innerHTML = `
        <h2>${cardData.name}</h2>
        <div><strong>${cardData.type}</strong></div>
        <div><strong>HP:</strong> ${cardData.hp}</div>
        <div><strong>Damage:</strong> ${cardData.damage}</div>
        <h3>Abilities</h3>
    `;

    if (cardData.abilitiesText?.length) {
        cardData.abilitiesText.forEach(a => {
            const line = document.createElement("div");
            // IMPORTANT: pass the text string into renderAbilityText,
            // same as the left villain panel, so html.replace works.
            line.innerHTML = renderAbilityText(a.text);
            rightCol.appendChild(line);
        });
    }

    // Top row: card + stats/abilities
    const topRow = document.createElement("div");
    topRow.className = "villain-top-row";
    topRow.appendChild(leftCol);
    topRow.appendChild(rightCol);

    content.appendChild(topRow);

    // Keyword definitions (mirrors left panel)
    const foundKeys = extractKeywordsFromAbilities(cardData.abilitiesText)
        .sort((a, b) => a.localeCompare(b));

    const keyBox = document.createElement("div");
    keyBox.innerHTML = `<h3>Keywords</h3>`;

    if (foundKeys.length === 0) {
        const none = document.createElement("div");
        none.style.fontStyle = "italic";
        none.textContent = "No Keywords Found";
        keyBox.appendChild(none);
    } else {
        foundKeys.forEach(k => {
            const line = document.createElement("div");
            line.style.marginBottom = "6px";
            line.innerHTML = `
                <div style="font-weight:bold;">${k}</div>
                <div style="margin-left:8px;">${keywords[k] || "No definition found."}</div>
            `;
            keyBox.appendChild(line);
        });
    }

    content.appendChild(keyBox);

    // Slide panel open
    panel.classList.add("open");
}

export function playMightSwipeAnimation() {
    return new Promise(resolve => {

        // Wrapper to hold the rendered card
        const wrapper = document.createElement("div");
        wrapper.className = "might-swipe-wrapper";

        // Position on top of all UI
        wrapper.style.position = "fixed";
        wrapper.style.top = "50%";
        wrapper.style.left = "0";
        wrapper.style.transform = "translateY(-50%) translateX(100vw)";
        wrapper.style.transition = "transform 2.5s ease-out";
        wrapper.style.zIndex = "999999";  // above everything
        wrapper.style.pointerEvents = "none";

        // Create the actual card using your renderer
        const cardNode = renderCard("7001", wrapper);  
        wrapper.appendChild(cardNode);

        document.body.appendChild(wrapper);

        // Kick off animation on next frame
        requestAnimationFrame(() => {
            wrapper.style.transform = "translateY(-50%) translateX(-120vw)";
        });

        // Remove after full sweep
        setTimeout(() => {
            wrapper.remove();
            resolve();
        }, 1500); // Adjust timing if needed
    });
}

export function showMightBanner(text, duration = 1400) {
    document.querySelectorAll(".might-banner").forEach(banner => {
        banner.remove();
    });

    return new Promise(resolve => {
        const banner = document.createElement("div");
        banner.className = "might-banner";
        banner.innerHTML = text;

        document.body.appendChild(banner);
        banner.classList.add("fade-in");

        setTimeout(() => {
            banner.classList.remove("fade-in");
            banner.classList.add("fade-out");

            setTimeout(() => {
                banner.remove();
                resolve();
            }, 800);
        }, duration);
    });
}


// === MAIN CARD PANEL (name, damage, abilities in top row; villain-style keywords under row) ===
export function buildMainCardPanel(cardData) {
    if (!cardData) return;

    const panel   = document.getElementById("main-card-panel");
    const content = document.getElementById("main-card-panel-content");
    if (!panel || !content) return;

    // Clear previous
    content.innerHTML = "";

    /* === MAIN PANEL COLORING from card's hero === */
    let panelColor = "white";

    // if this card lists a hero name, match it in heroes[]
    if (cardData.hero) {
        const heroObj = heroes.find(h =>
            h.name && h.name.toLowerCase() === cardData.hero.toLowerCase()
        );
        if (heroObj && heroObj.color) {
            panelColor = heroObj.color;
        }
    }

    // now mirror buildHeroPanel
    const rgb   = getRGB(panelColor);
    const light = lightenRGB(rgb, 0.35);

    panel.style.backgroundColor = light
        .replace("rgb", "rgba")
        .replace(")", ", 0.85)");

    panel.style.borderRight = `4px solid ${panelColor}`;

    // ------------------------------------------------------------
    // LEFT column (big card) – same scale class as villain
    // ------------------------------------------------------------
    const leftCol = document.createElement("div");
    leftCol.className = "villain-card-scale";
    leftCol.appendChild(renderCard(cardData.id, leftCol));

    // ------------------------------------------------------------
    // RIGHT column – name, damage, abilities only
    // ------------------------------------------------------------
    const rightCol = document.createElement("div");
    rightCol.className = "villain-right-column";

    // Name
    const h2 = document.createElement("h2");
    h2.textContent = cardData.name || "(Unnamed Card)";
    rightCol.appendChild(h2);

    // Damage (optional)
    if (typeof cardData.damage !== "undefined") {
        const dmg = document.createElement("div");
        dmg.innerHTML = `<strong>Damage:</strong> ${cardData.damage}`;
        rightCol.appendChild(dmg);
    }

    // Abilities (abilitiesText)
    if (Array.isArray(cardData.abilitiesText) && cardData.abilitiesText.length > 0) {
        const h3 = document.createElement("h3");
        h3.textContent = "Abilities";
        rightCol.appendChild(h3);

        cardData.abilitiesText.forEach(a => {
            const line = document.createElement("div");
            line.innerHTML = renderAbilityText(a.text);
            rightCol.appendChild(line);
        });
    }

    // ------------------------------------------------------------
    // TOP ROW (same structure as villain)
    // ------------------------------------------------------------
    const topRow = document.createElement("div");
    topRow.className = "villain-top-row";
    topRow.appendChild(leftCol);
    topRow.appendChild(rightCol);

    content.appendChild(topRow);

    // ------------------------------------------------------------
    // KEYWORDS AND DEFINITIONS (villain style, below the top row)
    // ------------------------------------------------------------
    // collect keywords exactly like villain
    const foundKeys = extractKeywordsFromAbilities(cardData.abilitiesText || [])
        .sort((a,b)=> a.localeCompare(b));

    if (foundKeys.length > 0) {
        const keyBox = document.createElement("div");
        keyBox.innerHTML = `<h3>Keywords</h3>`;

        foundKeys.forEach(k => {
            const def = keywords[k] || "No definition found.";
            const line = document.createElement("div");
            line.style.marginBottom = "6px";
            line.innerHTML = `
                <div style="font-weight:bold;">${k}</div>
                <div style="margin-left:8px;">${def}</div>
            `;
            keyBox.appendChild(line);
        });

        content.appendChild(keyBox);
    }


    // ------------------------------------------------------------
    // Close button (same behavior as villain)
    // ------------------------------------------------------------
    const closeBtn = document.getElementById("main-card-panel-close");
    if (closeBtn) {
        closeBtn.onclick = () => {
            panel.classList.remove("open");
            setTimeout(() => {
                panel.style.display = "none";
            }, 350);
        };
    }

    // ------------------------------------------------------------
    // OPEN panel (same behavior as villain)
    // ------------------------------------------------------------
    // Make it visible
    panel.style.display = "flex";

    // Reset to closed state
    panel.classList.remove("open");

    // Force a layout flush so browser acknowledges left:-40vw
    panel.offsetWidth; 

    // Now animate to open
    panel.classList.add("open");
}

window.buildMainCardPanel = buildMainCardPanel;

export function renderHeroHandBar(state) {
        console.log("[renderHeroHandBar] called", {
            heroTurnIndex: state.heroTurnIndex,
            heroes: state.heroes,
            hand: state.heroData?.[state.heroes?.[state.heroTurnIndex ?? 0]]?.hand
        });

        const handBar = document.getElementById("hero-hand-bar");
        if (!handBar) {
            console.warn("No hand div found.");
            return;
        }

        const heroIds = state.heroes || [];
        const hIndex  = state.heroTurnIndex ?? 0;
        const heroId  = heroIds[hIndex];
        if (!heroId) {
            console.warn("No hero id found.");
            return;
        }

        const heroState = state.heroData?.[heroId];
        if (!heroState) {
            console.warn("No hero state found.");
            return;
        }

        const inCity           = (typeof heroState.cityIndex === "number");
        const isFacingOverlord = !!heroState.isFacingOverlord;

        // Show button when hero is in a city OR is facing the overlord
        const canShowActivateButtons = inCity || isFacingOverlord;

        const discardMode = state.discardMode;
        const discardActive =
            discardMode &&
            String(discardMode.heroId) === String(heroId) &&
            discardMode.remaining > 0;

        // Clear old cards
        handBar.innerHTML = "";

        // Draw cards in the hand
        const hand = heroState.hand || [];
        hand.forEach(cardId => {
            const cardData = findCardInAllSources(cardId);
            console.log("[renderHeroHandBar] card:", {
                id: cardId,
                name: cardData?.name
            });

            const wrap = renderCard(cardId);
            if (!wrap) return;

            const activateBtn = document.createElement("button");

            const isBystanderCard =
                cardData && String(cardData.type || "").toLowerCase() === "bystander";

            const shouldShowActivateButton =
                discardActive || isBystanderCard || canShowActivateButtons;

            if (shouldShowActivateButton) {
                activateBtn.className = "hero-hand-activate-btn";
                activateBtn.type = "button";

                const icon = document.createElement("img");
                if (discardActive) {
                    icon.src = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Site%20Assets/discardPivotLeft.png";
                    icon.alt = "Discard";
                } else {
                    icon.src = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Site%20Assets/activate.png";
                    icon.alt = "Activate";
                }
                activateBtn.appendChild(icon);

                activateBtn.addEventListener("click", (e) => {
                    e.stopPropagation();

                    const cardName = cardData?.name || `Card ${cardId}`;

                    // Resolve the active hero correctly
                    const heroIds       = state.heroes || [];
                    const activeIndex   = state.heroTurnIndex ?? 0;
                    const activeHeroId  = heroIds[activeIndex];

                    if (!activeHeroId) {
                        console.error("No activeHeroId found in state.heroes/heroTurnIndex", {
                            heroIds,
                            activeIndex,
                            state
                        });
                        return;
                    }

                    const heroState = state.heroData?.[activeHeroId];

                    // SAFETY CHECK: must be an object
                    if (!heroState || typeof heroState !== "object") {
                        console.error("No heroState found for activeHeroId", {
                            activeHeroId,
                            heroState,
                            state
                        });
                        return;
                    }

                    const discardMode = state.discardMode;
                    const discardActive =
                        discardMode &&
                        String(discardMode.heroId) === String(activeHeroId) &&
                        discardMode.remaining > 0;

                    if (discardActive) {
                        if (!Array.isArray(heroState.hand)) heroState.hand = [];
                        if (!Array.isArray(heroState.discard)) heroState.discard = [];

                        // Remove this card from hand
                        const handIndex = heroState.hand.indexOf(cardId);
                        if (handIndex !== -1) {
                            heroState.hand.splice(handIndex, 1);
                        }

                        // Always discard (do not remove from game for bystanders here)
                        heroState.discard.push(cardId);

                        // Trigger any ifDiscarded effects on this card
                        if (cardData) {
                            try {
                                if (typeof runIfDiscardedEffects === "function") {
                                    runIfDiscardedEffects(cardData, activeHeroId, state);
                                }
                            } catch (err) {
                                console.warn("[discard] Failed to run ifDiscarded effects.", err);
                            }
                        }

                        // Count toward "discarded this turn"
                        heroState.discardedThisTurn = (heroState.discardedThisTurn || 0) + 1;

                        // Decrement remaining discards
                        discardMode.remaining = Math.max(0, (discardMode.remaining || 0) - 1);
                        if (discardMode.remaining <= 0) {
                            state.discardMode = null;
                        }

                        saveGameState(state || gameState);
                        renderHeroHandBar(state);
                        return;
                    }

                    // SEND TO abilityExecutor.js
                    try {
                        onHeroCardActivated(cardId, {
                            action: "activated",
                            heroId: activeHeroId
                        });
                    } catch (err) {
                        console.warn("[HeroActivate] onHeroCardActivated failed:", err);
                    }

                    // Ensure arrays exist
                    if (!Array.isArray(heroState.hand))    heroState.hand    = [];
                    if (!Array.isArray(heroState.discard)) heroState.discard = [];

                    // Remove this card from hand
                    const handIndex = heroState.hand.indexOf(cardId);
                    if (handIndex !== -1) {
                        heroState.hand.splice(handIndex, 1);
                    }

                    // Add it to discard (unless it should be removed from the game)
                    const shouldRemoveFromGame =
                        (String(cardId) === "0") ||
                        (cardData && String(cardData.type || "").toLowerCase() === "bystander");

                    if (!shouldRemoveFromGame) {
                        heroState.discard.push(cardId);
                    } else {
                        if (cardData && String(cardData.type || "").toLowerCase() === "bystander") {
                            if (!gameState.heroBystandersRescued) gameState.heroBystandersRescued = {};
                            const rescues = gameState.heroBystandersRescued;
                            const key = String(activeHeroId);
                            const current = rescues[key] || { count: 0, slotIndex: activeIndex };
                            rescues[key] = {
                                count: (current.count || 0) + 1,
                                slotIndex: activeIndex
                            };
                        }
                        console.log(`[HeroActivate] Removed ${cardName} (ID ${cardId}) from the game instead of discarding.`);
                        try { wrap.remove(); } catch (err) {}
                    }

                    saveGameState(state || gameState);

                    //console.log(`[pageSetup.js] Discarded ${cardName}`);
                    console.log("Current discard pile:", heroState.discard);

                    renderHeroHandBar(state);
                });

                // Put button first so it appears above the card
                wrap.insertBefore(activateBtn, wrap.firstChild);
            }

            // click opens the full panel
            wrap.addEventListener("click", (e)=>{
                e.stopPropagation();
                const cardData = findCardInAllSources(cardId);
                if (cardData) buildMainCardPanel(cardData);
            });

            handBar.appendChild(wrap);
        });

        try {
            updateStandardSpeedUI(state, heroId);
        } catch (err) {
            console.warn("[renderHeroHandBar] updateStandardSpeedUI failed", err);
        }
}

// === HERO KO OVERLAY HELPERS =====================================

export function applyHeroKOMarkers(heroId) {
    try {
        const row = document.getElementById("heroes-row");
        if (!row) return;

        const heroIds = gameState.heroes || [];
        const index = heroIds.findIndex(id => String(id) === String(heroId));
        if (index === -1) return;

        const slots = row.querySelectorAll(".hero-slot");
        const slot = slots[index];
        if (!slot) return;

        // Ensure the slot can host absolutely-positioned children
        if (getComputedStyle(slot).position === "static") {
            slot.style.position = "relative";
        }

        // 50% black overlay
        if (!slot.querySelector(".hero-ko-overlay")) {
            const overlay = document.createElement("div");
            overlay.className = "hero-ko-overlay";
            slot.appendChild(overlay);
        }

        // Permanent KO icon
        if (!slot.querySelector(".hero-ko-icon")) {
            const icon = document.createElement("img");
            icon.className = "hero-ko-icon";
            icon.src = HERO_KO_ICON_URL;
            icon.alt = "KO";
            slot.appendChild(icon);
        }
    } catch (err) {
        console.warn("[applyHeroKOMarkers] Failed for hero", heroId, err);
    }
}

export function clearHeroKOMarkers(heroId) {
    try {
        const row = document.getElementById("heroes-row");
        if (!row) return;

        const heroIds = gameState.heroes || [];
        const index = heroIds.findIndex(id => String(id) === String(heroId));
        if (index === -1) return;

        const slots = row.querySelectorAll(".hero-slot");
        const slot = slots[index];
        if (!slot) return;

        slot.querySelectorAll(".hero-ko-overlay, .hero-ko-icon").forEach(el => el.remove());
    } catch (err) {
        console.warn("[clearHeroKOMarkers] Failed for hero", heroId, err);
    }
}

function persistDropdownContentToState(state = gameState) {
    const dropdown = document.getElementById("dropdown-content");
    if (!dropdown) return;

    state.dropdownContentHTML = dropdown.innerHTML;
    saveGameState(state);
}

function restoreDropdownContentFromState(state = gameState) {
    const dropdown = document.getElementById("dropdown-content");
    if (!dropdown) return;

    // Prefer rebuilding from structured log data
    const hasLog = Array.isArray(state.gameLog) && state.gameLog.length > 0;
    renderGameLogFromState(state);

    // Fallback to stored HTML if no log data existed
    if (!hasLog && typeof state.dropdownContentHTML === "string") {
        dropdown.innerHTML = state.dropdownContentHTML;
    }
}

// === Establish Enemies + Allies Deck ===
export function establishEnemyAllyDeckFromLoadout(selectedData, state = gameState, opts = {}) {
    try {
        if (!state) return;

        // If a saved deck exists, reuse it unless explicitly rebuilding
        if (!opts.forceRebuild && Array.isArray(state.enemyAllyDeck) && state.enemyAllyDeck.length > 0) {
            console.log("Loaded existing enemy+ally deck:", state.enemyAllyDeck);
            window.ENEMY_ALLY_DECK = state.enemyAllyDeck;
            return state.enemyAllyDeck;
        }

        const enemyIds = selectedData?.enemies?.ids || [];
        const allyIds  = selectedData?.allies?.ids || [];
        const combined = [...enemyIds, ...allyIds];

        // Fisher-Yates shuffle
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }

        state.enemyAllyDeck = combined;
        state.enemyAllyDeckPointer = 0;
        state.enemyAllyDiscard = [];

        saveGameState(state);
        window.ENEMY_ALLY_DECK = combined;
        console.log("New shuffled enemy+ally deck:", combined);

        return combined;
    } catch (err) {
        console.error("Error establishing enemy+ally deck:", err);
    }
}

// ================================================================
// RENDER KO'D FOES BAR (HENCHMEN & VILLAINS)
// ================================================================
export function renderKOBar(state = gameState) {
    //console.log("[renderKOBar] called", state);

    const panel = document.getElementById("ko-content");
    //console.log("[renderKOBar] ko-content element:", panel);

    if (!panel) {
        console.warn("[renderKOBar] ABORT: #ko-content not found in DOM");
        return;
    }

    //console.log("[renderKOBar] clearing panel");
    panel.innerHTML = "";

    const bar = document.createElement("div");
    bar.style.display = "flex";
    bar.style.flexWrap = "nowrap";
    bar.style.overflowX = "auto";
    bar.style.gap = "0";
    bar.style.padding = "8px";
    bar.style.alignItems = "center";

    const hasKoArray = Array.isArray(state.koCards);
    //console.log("[renderKOBar] state.koCards exists:", hasKoArray, state.koCards);

    const koList = hasKoArray ? [...state.koCards].reverse() : [];
    //console.log("[renderKOBar] koList (after reverse):", koList);

    if (!koList.length) {
        console.warn("[renderKOBar] koList EMPTY — rendering placeholder");

        const emptyMsg = document.createElement("div");
        emptyMsg.textContent = "No KO'd foes.";
        emptyMsg.style.padding = "16px";
        bar.appendChild(emptyMsg);
        panel.appendChild(bar);

        //console.log("[renderKOBar] placeholder appended");
        return;
    }

    //console.log("[renderKOBar] renderCard typeof:", typeof renderCard);

    for (const cardInfo of koList) {
        //console.log("[renderKOBar] processing cardInfo:", cardInfo);

        const { id, name } = cardInfo;
        const isPerma = cardInfo.permanentKO === true;

        const cardDiv = document.createElement("div");
        cardDiv.className = "ko-card";
        cardDiv.style.minWidth = "0px";
        cardDiv.style.height = "160px";
        cardDiv.style.flex = "0 0 auto";
        cardDiv.style.marginRight = "-60px";
        cardDiv.style.marginLeft = "-60px";
        cardDiv.style.display = "flex";
        cardDiv.style.justifyContent = "center";
        cardDiv.style.alignItems = "center";

        if (typeof renderCard === "function") {
            try {
                //console.log("[renderKOBar] calling renderCard with id:", id);

                const scaleWrapper = document.createElement("div");
                scaleWrapper.style.transform = "scale(0.48)";
                scaleWrapper.style.transformOrigin = "center";
                scaleWrapper.style.cursor = "pointer";
                scaleWrapper.style.position = "relative";

                const card = renderCard(String(id));
                //console.log("[renderKOBar] renderCard returned:", card);

                const fullCardData = findCardInAllSources(String(id));

                scaleWrapper.appendChild(card);

                if (isPerma) {
                    const tint = document.createElement("div");
                    tint.style.position = "absolute";
                    tint.style.top = "0";
                    tint.style.left = "0";
                    tint.style.right = "0";
                    tint.style.bottom = "0";
                    tint.style.background = "rgba(180,0,0,0.35)";
                    tint.style.pointerEvents = "none";

                    const koIcon = document.createElement("img");
                    koIcon.src = HERO_KO_ICON_URL;
                    koIcon.style.position = "absolute";
                    koIcon.style.width = "100%";
                    koIcon.style.height = "100%";
                    koIcon.style.objectFit = "contain";
                    koIcon.style.top = "50%";
                    koIcon.style.left = "50%";
                    koIcon.style.transform = "translate(-50%, -50%)";
                    koIcon.style.pointerEvents = "none";

                    scaleWrapper.appendChild(tint);
                    scaleWrapper.appendChild(koIcon);
                }

                scaleWrapper.addEventListener("click", (e) => {
                    e.stopPropagation();
                    //console.log("[KO click] opening panel for:", fullCardData);
                    openPanelForCard(fullCardData);
                });

                cardDiv.appendChild(scaleWrapper);

            } catch (e) {
                console.error("[renderKOBar] renderCard threw error for", name, e);
                cardDiv.textContent = name;
            }
        } else {
            console.warn("[renderKOBar] renderCard is NOT a function");
            cardDiv.textContent = name;
        }

        bar.appendChild(cardDiv);
        //console.log("[renderKOBar] appended cardDiv for:", name);
    }

    panel.appendChild(bar);
    //console.log("[renderKOBar] bar appended to panel");

    const label = document.createElement("div");
    label.textContent = "KO'd cards in order. Left is latest.";
    label.style.marginTop = "12px";
    label.style.marginLeft = "30px";
    label.style.fontSize = "24px";
    label.style.fontStyle = "italic";
    label.style.color = "#000";
    label.style.textAlign = "left";
    label.style.pointerEvents = "none";

    panel.appendChild(label);
}

window.renderKOBar = renderKOBar;

function openPanelForCard(cardData) {
    if (!cardData || !cardData.type) return;

    switch (cardData.type) {
        case "Villain":
        case "Henchman":
            if (typeof window.buildVillainPanel === "function") {
                window.buildVillainPanel(cardData);
            }
            break;

        case "Overlord":
            if (typeof window.buildOverlordPanel === "function") {
                window.buildOverlordPanel(cardData);
            }
            break;

        case "Main":
        case "Bystander":
            if (typeof window.buildMainCardPanel === "function") {
                window.buildMainCardPanel(cardData);
            }
            break;

        case "Hero":
            if (typeof window.buildHeroPanel === "function") {
                window.buildHeroPanel(cardData);
            }
            break;

        default:
            console.warn("[KO click] No panel handler for type:", cardData.type);
    }
}

function renderDiscardSlide(state = gameState) {
  const heroIds     = state.heroes || [];
  const activeIndex = state.heroTurnIndex ?? 0;
  const heroId      = heroIds[activeIndex];
  if (!heroId) return;

  const heroObj  = (typeof heroes !== "undefined" && Array.isArray(heroes))
    ? heroes.find(h => String(h.id) === String(heroId))
    : null;
  const heroName = heroObj?.name || `Hero ${heroId}`;

  const heroState = state.heroData?.[heroId];
  if (!heroState || !Array.isArray(heroState.discard)) return;

  if (!cardsRow) return;
  cardsRow.innerHTML = "";
  const isDeckSelect = false;
  const setChooseState = () => {};
  deckChooseBtn.style.display = "none";
  closeBtn.style.display = "block";

  // Layout container so we can put a label under the horizontal scroller
  cardsRow.style.display = "flex";
  cardsRow.style.flexDirection = "column";
  cardsRow.style.alignItems = "stretch";
  cardsRow.style.justifyContent = "flex-start";
  cardsRow.style.overflow = "hidden";

  // Horizontal scroll row (KO-bar style)
  const bar = document.createElement("div");
  bar.style.display = "flex";
  bar.style.flexWrap = "nowrap";
  bar.style.overflowX = "auto";
  bar.style.overflowY = "hidden";
  bar.style.gap = "0";
  bar.style.marginTop = "24px";
  bar.style.padding = "8px";
  bar.style.alignItems = "center";
  bar.style.pointerEvents = "auto";

  let deckList = Array.isArray(heroState.deck) ? heroState.deck.slice() : [];
  const discardList = [...heroState.discard].reverse(); // left is latest
  const cardList = isDeckSelect ? deckList : discardList;
  const selectedSet = new Set(isDeckSelect && deckSelectCtx?.selectedCardIds ? deckSelectCtx.selectedCardIds.map(String) : []);
  const permaMap = (() => {
    const map = {};
    const list = Array.isArray(heroState.permanentKO) ? heroState.permanentKO : [];
    list.forEach(id => {
      const key = String(id);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  })();

  // Empty placeholder (KO style)
  if (!cardList.length) {
    const emptyMsg = document.createElement("div");
    emptyMsg.textContent = isDeckSelect ? `${heroName} has no cards in deck.` : `${heroName} has no discarded cards.`;
    emptyMsg.style.marginTop = "80px";
    emptyMsg.style.padding = "16px";
    emptyMsg.style.fontSize = "24px";
    emptyMsg.style.fontStyle = "italic";
    emptyMsg.style.color = "#fff";
    bar.appendChild(emptyMsg);

    cardsRow.appendChild(bar);
    return;
  }

  const sizeLabel = document.createElement("div");
  sizeLabel.textContent = isDeckSelect
    ? `${heroName}'s Deck: ${cardList.length} cards`
    : `${heroName}'s Discard Pile: ${cardList.length} cards`;
  sizeLabel.style.marginTop = "14px";
  sizeLabel.style.marginRight = "10px";
  sizeLabel.style.marginBottom = "-4px";
  sizeLabel.style.marginLeft = "10px";
  sizeLabel.style.color = "#fff";
  sizeLabel.style.fontSize = "26px";
  sizeLabel.style.fontWeight = "bold";
  sizeLabel.style.textAlign = "left";
  cardsRow.appendChild(sizeLabel);

  // Render cards + click-to-open panel (inline, no wireCardToMainPanel)
  for (const id of cardList) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "ko-card";
    cardDiv.style.height = "160px";
    cardDiv.style.marginRight = "-80px";
    cardDiv.style.marginLeft = "-40px";
    cardDiv.style.flex = "0 0 auto";

    const scaleWrapper = document.createElement("div");
    const scale = isDeckSelect ? 0.4 : 0.45;
    scaleWrapper.style.transform = `scale(${scale})`;
    scaleWrapper.style.transformOrigin = "top center";
    if (isDeckSelect) {
      scaleWrapper.style.marginTop = "10px";
      scaleWrapper.style.marginRight = "0px";
      scaleWrapper.style.marginLeft = "-15px";
    }
    scaleWrapper.style.cursor = "pointer";
    scaleWrapper.style.position = "relative";

    const idStr = String(id);

    // Render the card
    const cardEl = renderCard(idStr);
    scaleWrapper.appendChild(cardEl);

    const applySelectionStyle = (isSelected) => {
      if (isSelected) {
        scaleWrapper.style.boxShadow = "0 0 16px 6px rgba(255, 215, 0, 0.8)";
        scaleWrapper.style.border = "2px solid gold";
      } else {
        scaleWrapper.style.boxShadow = "";
        scaleWrapper.style.border = "";
      }
    };
    applySelectionStyle(selectedSet.has(idStr));

    // Permanent KO overlay if applicable
    if (permaMap[idStr] > 0) {
      permaMap[idStr] = permaMap[idStr] - 1;
      const tint = document.createElement("div");
      tint.style.position = "absolute";
      tint.style.top = "0";
      tint.style.left = "0";
      tint.style.right = "0";
      tint.style.bottom = "0";
      tint.style.background = "rgba(120, 0, 0, 0.45)";
      tint.style.zIndex = "15";
      tint.style.pointerEvents = "none";

      const overlay = document.createElement("img");
      overlay.src = HERO_KO_ICON_URL;
      overlay.alt = "Permanently KO'd";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.right = "0";
      overlay.style.bottom = "0";
      overlay.style.margin = "auto";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.objectFit = "contain";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "20";
      scaleWrapper.appendChild(tint);
      scaleWrapper.appendChild(overlay);
    }

    if (isDeckSelect) {
      deckChooseBtn.onclick = () => {
        const ctx = window.__deckSelectContext;
        if (!ctx || ctx.heroId == null) return;
        const selectedIds = Array.isArray(ctx.selectedCardIds) ? ctx.selectedCardIds : [];
        if (!selectedIds.length) return; // no-op unless something is selected
        const maxSel = Math.max(1, Number(ctx.count) || 1);
        const pickIds = selectedIds.slice(0, maxSel);
        const hState = gameState.heroData?.[ctx.heroId];
        if (!hState || !Array.isArray(hState.deck)) return;
        if (!Array.isArray(hState.hand)) hState.hand = [];

        pickIds.forEach(cardId => {
          const pos = hState.deck.findIndex(id => String(id) === String(cardId));
          if (pos >= 0) {
            hState.deck.splice(pos, 1);
          }
          hState.hand.push(cardId);
          const heroName = heroes.find(h => String(h.id) === String(ctx.heroId))?.name || `Hero ${ctx.heroId}`;
          const cardName = findCardInAllSources(cardId)?.name || `Card ${cardId}`;
          appendGameLogEntry(`${heroName} drew ${cardName} from their deck.`, gameState);
        });
        saveGameState(gameState);
        window.__deckSelectContext = null;
        gameState.deckSelectContext = null;
        deckChooseBtn.style.display = "none";
        try {
          const closeBtnEl = document.getElementById("discard-slide-close");
          if (closeBtnEl) closeBtnEl.click();
          const panel = document.getElementById("discard-slide-panel");
          if (panel) panel.style.display = "none";
        } catch (e) {
          // ignore
        }
        renderDiscardSlide(gameState);
        renderHeroHandBar(gameState);
      };
    }

    // Resolve full card data once, then open correct panel on click (KO-bar style)
    const fullCardData =
      (typeof findCardInAllSources === "function") ? findCardInAllSources(idStr) : null;

    scaleWrapper.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // fall back: if lookup failed, try again at click-time
      const data = fullCardData || (
        (typeof findCardInAllSources === "function") ? findCardInAllSources(idStr) : null
      );

      openPanelForCard(data);

      if (isDeckSelect) {
        if (!window.__deckSelectContext) window.__deckSelectContext = { selectedCardIds: [] };
        const maxSel = Math.max(1, Number(deckSelectCtx.count) || 1);
        // Single-select: clicking another card replaces the previous selection.
        let currentSel = window.__deckSelectContext.selectedCardIds || [];
        if (maxSel === 1) {
          const isSelectedAlready = currentSel.length === 1 && String(currentSel[0]) === idStr;
          if (isSelectedAlready) {
            currentSel = [];
            applySelectionStyle(false);
            // Clear all highlights
            if (bar) {
              const wrappers = bar.querySelectorAll(".ko-card > div");
              wrappers.forEach(w => {
                w.style.boxShadow = "";
                w.style.border = "";
              });
            }
          } else {
            currentSel = [idStr];
            applySelectionStyle(true);
            // Clear highlights from siblings
            if (bar) {
              const wrappers = bar.querySelectorAll(".ko-card > div");
              wrappers.forEach(w => {
                if (w !== scaleWrapper) {
                  w.style.boxShadow = "";
                  w.style.border = "";
                }
              });
  }
}

function renderDeckSelectSlide(state = gameState) {
  const addPanel = document.getElementById("add-slide-panel");
  const addCardsRow = document.getElementById("add-slide-cards");
  if (!addCardsRow || !addPanel) return;
  console.log("[DeckSelectRender] entry", {
    hasPanel: !!addPanel,
    hasRow: !!addCardsRow
  });
  let ctx = (typeof window !== "undefined" && window.__deckSelectContext)
    ? window.__deckSelectContext
    : state.deckSelectContext;

  // Fallback: build a context from the active hero if missing
  if ((!ctx || ctx.heroId == null) && state?.heroes?.length) {
    const heroIds = state.heroes || [];
    const activeIndex = state.heroTurnIndex ?? 0;
    const activeHeroId = heroIds[activeIndex];
    if (activeHeroId != null) {
      ctx = {
        heroId: activeHeroId,
        count: 1,
        selectedCardIds: [],
        deckSnapshot: []
      };
      window.__deckSelectContext = ctx;
      state.deckSelectContext = { ...ctx };
    }
  }
  if (!ctx || ctx.heroId == null) return;

  const heroId = ctx.heroId;
  const heroObj = heroes.find(h => String(h.id) === String(heroId));
  const heroName = heroObj?.name || `Hero ${heroId}`;
  const s = state || gameState;
  if (!s.heroData) s.heroData = {};
  let heroState =
    s.heroData?.[heroId] ??
    s.heroData?.[String(heroId)] ??
    null;
  if (!heroState && heroId != null) {
    heroState = s.heroData[heroId] = {};
  }
  if (!heroState) return;
  if (!Array.isArray(heroState.deck)) heroState.deck = [];
  if (!Array.isArray(heroState.discard)) heroState.discard = [];

  const shuffleInPlace = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  let deckList = [];
  if (Array.isArray(ctx.deckSnapshot) && ctx.deckSnapshot.length) {
    deckList = ctx.deckSnapshot.slice();
  } else if (heroState.deck.length) {
    deckList = heroState.deck.slice();
  }
  if (!deckList.length && heroState.discard.length) {
    shuffleInPlace(heroState.discard);
    heroState.deck = heroState.discard.splice(0, heroState.discard.length);
    deckList = heroState.deck.slice();
  }
  if (!deckList.length && heroObj?.name) {
    const rebuilt = heroCards
      .filter(c => c.hero === heroObj.name)
      .reduce((arr, card) => {
        const qty = Number(card.perDeck || 0);
        for (let i = 0; i < qty; i++) arr.push(card.id);
        return arr;
      }, []);
    shuffleInPlace(rebuilt);
    heroState.deck = Array.isArray(rebuilt) ? [...rebuilt] : [];
    deckList = heroState.deck.slice();
  }

  // Persist snapshot so refresh keeps the same list
  window.__deckSelectContext = {
    heroId,
    count: ctx.count,
    selectedCardIds: ctx.selectedCardIds || [],
    deckSnapshot: deckList.slice()
  };
  s.deckSelectContext = { ...window.__deckSelectContext };
  saveGameState(s);

  try {
    console.log("[DeckSelectRender]", {
      heroId,
      deckLen: deckList.length,
      liveDeck: heroState.deck?.length || 0,
      discardLen: heroState.discard?.length || 0
    });
  } catch (_) {}

  // Ensure panel is visible
  addPanel.style.display = "flex";
  addPanel.classList.add("open");

  try {
    const liveDeckLen = Array.isArray(heroState?.deck) ? heroState.deck.length : "n/a";
    const ctxLen = Array.isArray(ctx.deckSnapshot) ? ctx.deckSnapshot.length : "n/a";
    console.log("[DeckSelect] heroId", heroId, "deck len (ctx)", ctxLen, "deck len (state)", liveDeckLen);
  } catch (_) {}

  addCardsRow.innerHTML = "";

  let addChooseBtn = document.getElementById("add-choose-button");
  if (!addChooseBtn) {
    addChooseBtn = document.createElement("button");
    addChooseBtn.id = "add-choose-button";
    addChooseBtn.textContent = "Choose";
  }
  // Normalize button styling every render to match fallback
  addChooseBtn.style.padding = "10px 16px";
  addChooseBtn.style.fontSize = "16px";
  addChooseBtn.style.display = "inline-block";
  addChooseBtn.style.margin = "0";
  addChooseBtn.style.alignSelf = "auto";

  const footer = document.createElement("div");
  footer.style.display = "flex";
  footer.style.justifyContent = "flex-end";
  footer.style.alignItems = "center";
  footer.style.margin = "8px 10px 10px 10px";
  footer.style.marginTop = "auto";

  footer.appendChild(addChooseBtn);

  const setChooseState = (hasSelection) => {
    addChooseBtn.style.backgroundColor = hasSelection ? "gold" : "#444";
    addChooseBtn.style.color = hasSelection ? "#000" : "#ddd";
    addChooseBtn.style.cursor = hasSelection ? "pointer" : "not-allowed";
    addChooseBtn.disabled = !hasSelection;
  };

  const currentSel = Array.isArray(ctx.selectedCardIds) ? ctx.selectedCardIds : [];
  addChooseBtn.style.display = "inline-block";
  setChooseState(currentSel.length > 0);

  // Layout container
  addCardsRow.style.display = "flex";
  addCardsRow.style.flexDirection = "column";
  addCardsRow.style.alignItems = "stretch";
  addCardsRow.style.justifyContent = "flex-start";
  addCardsRow.style.height = "100%";
  addCardsRow.style.overflow = "hidden";

  const bar = document.createElement("div");
  bar.style.display = "flex";
  bar.style.flexWrap = "nowrap";
  bar.style.overflowX = "auto";
  bar.style.overflowY = "hidden"; // remove vertical scrolling entirely
  bar.style.gap = "0";
  bar.style.marginTop = "-230px"; // adjust card row position
  bar.style.padding = "8px";
  bar.style.alignItems = "center";
  bar.style.pointerEvents = "auto";
  bar.style.flex = "1 1 auto";

  const cardList = deckList;
  const selectedSet = new Set(currentSel.map(String));

  if (!cardList.length) {
    const emptyMsg = document.createElement("div");
    emptyMsg.textContent = `${heroName} has no cards in deck.`;
    emptyMsg.style.marginTop = "80px";
    emptyMsg.style.padding = "16px";
    emptyMsg.style.fontSize = "24px";
    emptyMsg.style.fontStyle = "italic";
    emptyMsg.style.color = "#fff";
    bar.appendChild(emptyMsg);
    addCardsRow.appendChild(bar);
    addCardsRow.appendChild(footer);
    return;
  }

  const sizeLabel = document.createElement("div");
  sizeLabel.textContent = `${heroName}'s Deck: ${cardList.length} cards`;
  sizeLabel.style.marginTop = "10px";
  sizeLabel.style.marginRight = "10px";
  sizeLabel.style.marginBottom = "0";
  sizeLabel.style.marginLeft = "10px";
  sizeLabel.style.color = "#fff";
  sizeLabel.style.fontSize = "24px";
  sizeLabel.style.fontWeight = "bold";
  sizeLabel.style.textAlign = "left";
  sizeLabel.style.flex = "0 0 auto";
  addCardsRow.appendChild(sizeLabel);

  const maxSel = Math.max(1, Number(ctx.count) || 1);

  for (const id of cardList) {
    const idStr = String(id);
    const cardDiv = document.createElement("div");
    cardDiv.className = "ko-card";
    cardDiv.style.height = "110px";
    cardDiv.style.marginLeft = "-30px";
    cardDiv.style.marginRight = "-70px";
    cardDiv.style.position = "relative";

    const scaleWrapper = document.createElement("div");
    // Clamp to 50% scale so visuals and spacing both shrink
    scaleWrapper.style.transform = "scale(0.5)";
    scaleWrapper.style.transformOrigin = "center center";
    scaleWrapper.style.filter = "drop-shadow(0px 0px 8px rgba(0,0,0,0.8))";
    scaleWrapper.style.transition = "box-shadow 0.2s ease, border 0.2s ease";

    const rendered = renderCard(idStr);
    scaleWrapper.appendChild(rendered);
    cardDiv.appendChild(scaleWrapper);
    bar.appendChild(cardDiv);

    const applySelectionStyle = (selected) => {
      scaleWrapper.style.boxShadow = selected ? "0 0 0 6px gold" : "";
      scaleWrapper.style.border = selected ? "4px solid #000" : "";
    };
    applySelectionStyle(selectedSet.has(idStr));

    scaleWrapper.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      try {
        const data = findCardInAllSources(idStr);
        if (data) buildMainCardPanel(data);
      } catch (_) {}

      let sel = Array.isArray(window.__deckSelectContext?.selectedCardIds)
        ? [...window.__deckSelectContext.selectedCardIds]
        : [];

      if (maxSel === 1) {
        const already = sel.length === 1 && String(sel[0]) === idStr;
        if (already) {
          sel = [];
          applySelectionStyle(false);
        } else {
          sel = [idStr];
          applySelectionStyle(true);
          if (bar) {
            const wrappers = bar.querySelectorAll(".ko-card > div");
            wrappers.forEach(w => {
              if (w !== scaleWrapper) {
                w.style.boxShadow = "";
                w.style.border = "";
              }
            });
          }
        }
      } else {
        const idxSel = sel.findIndex(cid => String(cid) === idStr);
        if (idxSel >= 0) {
          sel.splice(idxSel, 1);
          applySelectionStyle(false);
        } else if (sel.length < maxSel) {
          sel.push(idStr);
          applySelectionStyle(true);
        }
      }

      window.__deckSelectContext = { ...ctx, selectedCardIds: sel };
      gameState.deckSelectContext = { heroId: ctx.heroId, count: ctx.count, selectedCardIds: sel, deckSnapshot: deckList };
      saveGameState(gameState);
      setChooseState(sel.length > 0);
    });
  }

  addChooseBtn.onclick = () => {
    const ctxNow = window.__deckSelectContext || { ...ctx };
    const selIds = Array.isArray(ctxNow.selectedCardIds) ? ctxNow.selectedCardIds : [];
    if (!selIds.length) return;
    const maxPick = Math.max(1, Number(ctxNow.count) || 1);
    const picks = selIds.slice(0, maxPick);
    const hState = gameState.heroData?.[heroId];
    if (!hState || !Array.isArray(hState.deck)) return;
    if (!Array.isArray(hState.hand)) hState.hand = [];

    picks.forEach(cardId => {
      const pos = hState.deck.findIndex(id => String(id) === String(cardId));
      if (pos >= 0) hState.deck.splice(pos, 1);
      hState.hand.push(cardId);
      const cardName = findCardInAllSources(cardId)?.name || `Card ${cardId}`;
      appendGameLogEntry(`${heroName} drew ${cardName} from their deck.`, gameState);
    });

    window.__deckSelectContext = null;
    gameState.deckSelectContext = null;
    saveGameState(gameState);
    renderHeroHandBar(gameState);
    addChooseBtn.style.display = "none";
    try {
      addPanel.classList.remove("open");
    } catch (e) {}
  };

  addCardsRow.appendChild(bar);
  footer.style.marginTop = "auto";
  addCardsRow.appendChild(footer);
}

if (typeof window !== "undefined") {
  window.renderDeckSelectSlide = renderDeckSelectSlide;
  // If a deck-select context exists (e.g., after refresh), rerender with the full renderer
  try {
    if (gameState.deckSelectContext) {
      setTimeout(() => {
        try { renderDeckSelectSlide(gameState); } catch (_) {}
      }, 0);
    }
  } catch (_) {}
}
        } else {
          const idxSel = currentSel.findIndex(cid => String(cid) === idStr);
          if (idxSel >= 0) {
            currentSel.splice(idxSel, 1);
            applySelectionStyle(false);
          } else if (currentSel.length < maxSel) {
            currentSel.push(idStr);
            applySelectionStyle(true);
          }
        }
        window.__deckSelectContext.selectedCardIds = currentSel;
        gameState.deckSelectContext = {
          heroId: deckSelectCtx.heroId,
          count: deckSelectCtx.count,
          selectedCardIds: [...currentSel]
        };
        setChooseState(currentSel.length > 0);
        saveGameState(gameState);
      }
    }, true); // capture-phase to prevent inner handlers swallowing it

    cardDiv.appendChild(scaleWrapper);
    bar.appendChild(cardDiv);
  }

  cardsRow.appendChild(bar);

  // Footer row: label + (optional) deck choose button
  const footer = document.createElement("div");
  footer.style.display = "flex";
  footer.style.alignItems = "center";
  footer.style.justifyContent = "space-between";
  footer.style.marginTop = "12px";
  footer.style.marginBottom = "10px";
  footer.style.marginLeft = "30px";
  footer.style.marginRight = "12px";

  const label = document.createElement("div");
  label.textContent = `Left is latest.`;
  label.style.fontSize = "20px";
  label.style.fontStyle = "italic";
  label.style.color = "#fff";
  label.style.textAlign = "left";
  label.style.pointerEvents = "none";
  label.style.flex = "1";

  footer.appendChild(label);
  if (deckChooseBtn.parentElement !== footer) {
    if (deckChooseBtn.parentElement) {
      try { deckChooseBtn.parentElement.removeChild(deckChooseBtn); } catch (e) {}
    }
    footer.appendChild(deckChooseBtn);
  }

  cardsRow.appendChild(footer);
}

function showDisableVillainConfirm({ foeName, message }) {
    return new Promise(resolve => {
        try {
            const existing = document.querySelectorAll('[data-disable-confirm-overlay="1"]');
            existing.forEach(el => { try { el.remove(); } catch (e) {} });
        } catch (e) {
            console.warn("[disableConfirm] Failed to clear existing overlays", e);
        }

        const overlay = document.createElement("div");
        overlay.dataset.disableConfirmOverlay = "1";
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 16px;
        `;

        const box = document.createElement("div");
        box.style.cssText = `
            background: #fff;
            color: #111;
            border-radius: 14px;
            border: 4px solid #000;
            width: min(420px, 100%);
            box-shadow: 0 10px 24px rgba(0,0,0,0.35);
            padding: 18px;
            text-align: center;
            font-family: 'Racing Sans One', 'Montserrat', 'Helvetica', sans-serif;
        `;

        const title = document.createElement("div");
        title.style.cssText = "font-size: 28px; font-weight: 800; margin-bottom: 10px;";
        title.textContent = "Confirm Disable";

        const msg = document.createElement("div");
        msg.style.cssText = "font-size: 22px; line-height: 1.35; margin-bottom: 16px;";
        msg.textContent = message || `Disable ${foeName}? (0 damage, abilities negated)`;

        const btnRow = document.createElement("div");
        btnRow.style.cssText = "display:flex; gap:10px; justify-content:center; flex-wrap:wrap;";

        const makeBtn = (label, bg, fg) => {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = label;
            b.style.cssText = `
                flex: 1 1 120px;
                padding: 12px 14px;
                font-size: 16px;
                font-weight: 800;
                border: 3px solid #000;
                border-radius: 12px;
                background: ${bg};
                color: ${fg};
                cursor: pointer;
            `;
            return b;
        };

        const yesBtn = makeBtn("Yes", "#ffd800", "#000");
        const noBtn  = makeBtn("No", "#e3e3e3", "#000");

        const cleanup = (result) => {
            try { overlay.remove(); } catch (e) {}
            resolve(result);
        };

        yesBtn.onclick = () => cleanup(true);
        noBtn.onclick  = () => cleanup(false);

        btnRow.appendChild(yesBtn);
        btnRow.appendChild(noBtn);

        box.appendChild(title);
        box.appendChild(msg);
        box.appendChild(btnRow);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    });
}
