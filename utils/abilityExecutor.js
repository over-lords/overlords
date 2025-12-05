/*
RULES

Henchmen and Villains KO'd from the top of the villain deck do not grant Rewards

protect overlord if cit(ies) still occupied

*/

const isSinglePlayer = (window.GAME_MODE === "single");
const isMultiplayer = (window.GAME_MODE === "multi");

import { heroes } from '../data/faceCards.js';
import { overlords } from '../data/overlords.js';
import { tactics } from '../data/tactics.js';
import { henchmen } from "../data/henchmen.js";
import { villains } from "../data/villains.js";

import { setCurrentOverlord } from "./pageSetup.js";
import { startHeroTurn, getCurrentOverlordInfo } from "./turnOrder.js";
import { findCardInAllSources, renderCard } from './cardRenderer.js';
import { gameState } from "../data/gameState.js";
import { saveGameState } from "./stateManager.js";

import {
    CITY_EXIT_UPPER,
    CITY_5_UPPER,
    CITY_4_UPPER,
    CITY_3_UPPER,
    CITY_2_UPPER,
    CITY_ENTRY_UPPER
} from '../data/gameState.js';

const UPPER_ORDER = [
    CITY_EXIT_UPPER,
    CITY_5_UPPER,
    CITY_4_UPPER,
    CITY_3_UPPER,
    CITY_2_UPPER,
    CITY_ENTRY_UPPER
];

const EFFECT_HANDLERS = {};

EFFECT_HANDLERS.charge = function (args, card, selectedData) {
    const distance = Number(args[0]) || 1;
    runCharge(card.id, distance);
};

EFFECT_HANDLERS.addNextOverlord = function (args, card, selectedData) {

    const newOverlordId = String(args[0]);
    if (!newOverlordId) {
        //console.warn(`[addNextOverlord] Missing overlord ID argument.`);
        return;
    }

    let arr = selectedData.overlords;
    if (!Array.isArray(arr)) {
        //console.warn("[addNextOverlord] selectedData.overlords is not an array.");
        return;
    }

    const currentId = String(card.id);
    const insertIndex = arr.indexOf(currentId);

    if (insertIndex === -1) {
        //console.warn(`[addNextOverlord] Current overlord ${currentId} not found in array:`, arr);
        return;
    }

    // Already inserted? avoid duplicates
    if (arr.includes(newOverlordId)) {
        //console.log(`[addNextOverlord] ID ${newOverlordId} already present in overlord list.`);
        return;
    }

    // Insert immediately AFTER current Lex Luthor
    arr.splice(insertIndex + 1, 0, newOverlordId);
};

export function executeEffectSafely(effectString, card, selectedData) {
    if (!effectString || typeof effectString !== "string") {
        console.warn(`[executeEffectSafely] Invalid effect '${effectString}' on card '${card?.name}'.`);
        return;
    }

    //console.log(`%c[executeEffectSafely] Running: ${effectString} (from ${card?.name})`,
        //"color:#22a;font-weight:bold");

    // Some effects have MULTIPLE comma-separated calls
    const calls = effectString.split(",").map(x => x.trim()).filter(Boolean);

    for (const call of calls) {

        // Match "functionName(arg1,arg2,...)"
        const match = call.match(/^([A-Za-z0-9_]+)\((.*)\)$/);

        if (!match) {
            console.warn(`[executeEffectSafely] Could not parse effect '${call}' on ${card?.name}.`);
            continue;
        }

        const fnName = match[1];
        const rawArgs = match[2]
            .split(",")
            .map(a => a.trim())
            .filter(a => a.length > 0);

        // Resolve arguments into JS types when possible
        const parsedArgs = rawArgs.map(arg => {
            if (/^\d+$/.test(arg)) return Number(arg);
            if (arg.toLowerCase() === "true") return true;
            if (arg.toLowerCase() === "false") return false;
            return arg; // leave strings as-is
        });

        // Look up handler
        const handler = EFFECT_HANDLERS[fnName];

        if (!handler) {
            console.warn(`[executeEffectSafely] No handler for '${fnName}'. Arguments: [${rawArgs.join(",")}].`);
            continue;
        }

        try {
            handler(parsedArgs, card, selectedData);
        } catch (err) {
            console.warn(`[executeEffectSafely] Handler '${fnName}' failed: ${err.message}`);
        }
    }
}

export function runGameStartAbilities(selectedData) {

    //console.log("%c[AbilityExecutor] Checking for gameStart() abilities…", "color: purple; font-weight:bold;");

    // Gather all loaded card IDs from loadout
    const heroIds      = selectedData.heroes        || [];
    const overlordIds  = selectedData.overlords     || [];
    const tacticIds    = selectedData.tactics       || [];

    // Map them to full card objects
    const loadedHeroes     = heroIds.map(id => heroes.find(h => String(h.id) === String(id))).filter(Boolean);
    const loadedOverlords  = overlordIds.map(id => overlords.find(o => String(o.id) === String(id))).filter(Boolean);
    const loadedTactics    = tacticIds.map(id => tactics.find(t => String(t.id) === String(id))).filter(Boolean);

    // Combine them;
    const allCards = [
        ...loadedHeroes,
        ...loadedOverlords,
        ...loadedTactics
    ];

    // Utility: scan effects arrays on card
    function extractAllEffects(card) {
        const buckets = [
            card.abilitiesEffects,
            card.mightEffects,
            card.bonusEffects,
            card.evilWinsEffects
        ];
        return buckets.flat().filter(Boolean);
    }

    for (const card of allCards) {
        const effects = extractAllEffects(card);

        for (const eff of effects) {
            if (!eff.condition) continue;

            // Must match EXACT condition format from your data:
            if (eff.condition.trim() === "gameStart()") {

                const effectString = eff.effect;

                //console.log(`%c[AbilityExecutor] Triggering gameStart() on ${card.name}: ${effectString}`,
                    //"color: green; font-weight:bold;");

                try {
                    // If you have an effect executor:
                    if (typeof executeEffectSafely === "function") {
                        executeEffectSafely(effectString, card, selectedData);
                    } 
                    else {
                        // TEMPORARY FALLBACK until your effect engine is built:
                        console.warn(
                            //`[AbilityExecutor] No effect execution engine configured. Effect '${effectString}' not executed.`
                        );
                    }

                } catch (err) {
                    console.warn(
                        //`[AbilityExecutor] Effect '${effectString}' on ${card.name} failed: ${err.message}`
                    );
                }
            }
        }
    }

    //console.log("%c[AbilityExecutor] Completed gameStart() ability scan.", "color: purple; font-weight:bold;");
}

export function currentTurn(turnIndex, selectedHeroIds) {
    try {
        const row = document.getElementById("heroes-row");
        if (!row) return;

        const slots = row.querySelectorAll(".hero-slot");
        if (!slots.length) return;

        // Remove any existing indicator circles
        row.querySelectorAll(".turn-indicator-circle").forEach(el => el.remove());

        // Validate index
        if (typeof turnIndex !== "number") return;
        if (turnIndex < 0 || turnIndex >= slots.length) return;

        const heroId = selectedHeroIds?.[turnIndex];
        if (!heroId) return;

        // FIND THE HERO OBJECT BY ID
        const heroObj = heroes.find(h => String(h.id) === String(heroId));
        if (!heroObj) {
            console.warn("[currentTurn] No hero found with ID:", heroId);
            return;
        }

        // EXTRACT THE COLOR
        const heroColor = heroObj.color || "white";

        // CREATE THE INDICATOR CIRCLE
        const circle = document.createElement("div");
        circle.className = "turn-indicator-circle";

        // APPLY COLOR BORDER
        circle.style.borderColor = heroColor;

        // INSERT INTO CORRECT SLOT
        slots[turnIndex].appendChild(circle);

    } catch (err) {
        console.warn("[currentTurn] Failed:", err);
    }
}

function runCharge(cardId, distance) {

    const entryIndex = CITY_ENTRY_UPPER;

    // STEP 1 — Simulate a blank shove (shift all villains left one)
    // (exactly what you had before)
    pushChain(entryIndex);

    // STEP 2 — Now place the new villain into City 1 AFTER pushing
    // (exactly what you had before)
    placeCardIntoUpperSlot(entryIndex, cardId);

    // STEP 3 — After a short delay, visually "charge" left
    setTimeout(() => {
        addChargeRushLines(entryIndex);

        let fromPos = UPPER_ORDER.indexOf(entryIndex);

        for (let step = 0; step < distance; step++) {
            if (!attemptSingleLeftShift(fromPos)) break;
            fromPos -= 1;
        }

        saveGameState(gameState);

        //
        // NEW FIX — Clear the cities behind the charging villain
        //
        (function clearCitiesBehindCharge() {
            const citySlots = document.querySelectorAll(".city-slot");

            // The destination position is the last value of fromPos + 1 after the loop.
            // But since fromPos was decremented after shifts, the destination city is:
            const destinationPos = fromPos + 1;
            const destIndex = UPPER_ORDER[destinationPos];

            // Clear all cities *between entryIndex and the destination*, EXCLUDING the destination itself.
            // entryIndex is CITY_ENTRY_UPPER.
            const entryPos = UPPER_ORDER.indexOf(entryIndex);

            for (let pos = entryPos; pos > destinationPos; pos--) {
                const idx = UPPER_ORDER[pos];

                // 1. Clear DOM
                const slot = citySlots[idx];
                if (slot) {
                    const area = slot.querySelector(".city-card-area");
                    if (area) area.innerHTML = "";
                }

                // 2. Clear gamestate entry
                if (Array.isArray(gameState.cities)) {
                    gameState.cities[idx] = null;
                }
            }
        })();


        // === NEW: FIX TRAVEL OFFSET AFTER CHARGE ===
        // Force hero travel UI to recalculate AFTER all villain movement is done.
        setTimeout(() => {
            if (typeof window.recalculateHeroTravel === "function") {
                window.recalculateHeroTravel();
            }
        }, distance * 700);
    }, 1500);
}

function addChargeRushLines(slotIndex) {
    const citySlots = document.querySelectorAll(".city-slot");
    const slot = citySlots[slotIndex];
    if (!slot) return;

    // Ensure the slot can host an absolutely-positioned overlay
    if (getComputedStyle(slot).position === "static") {
        slot.style.position = "relative";
    }

    const overlay = document.createElement("div");
    overlay.className = "charge-rush-lines";

    slot.appendChild(overlay);

    // Clean up after the animation
    setTimeout(() => {
        overlay.remove();
    }, 250);
}

function placeCardIntoUpperSlot(slotIndex, cardId) {
    const citySlots = document.querySelectorAll(".city-slot");
    const slot = citySlots[slotIndex];
    if (!slot) return;

    const area = slot.querySelector(".city-card-area");
    if (!area) return;

    // Clear old content
    area.innerHTML = "";

    // Render the new card
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";
    wrapper.appendChild(renderCard(cardId, wrapper));
    area.appendChild(wrapper);

    const cardData =
        henchmen.find(h => String(h.id) === String(cardId)) ||
        villains.find(v => String(v.id) === String(cardId));

    if (cardData) {
        wrapper.style.cursor = "pointer";
        wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("Villain/Henchmen card clicked (from Charge):", {
                cardId,
                cardName: cardData.name
            });

            // Prefer global buildVillainPanel, which you exposed in pageSetup.js
            if (typeof window !== "undefined" &&
                typeof window.buildVillainPanel === "function") {
                window.buildVillainPanel(cardData);
            } else {
                console.warn("[Charge] buildVillainPanel not available on window.");
            }
        });
    }

    if (!Array.isArray(gameState.cities)) {
        gameState.cities = new Array(12).fill(null);
    }

    // Update gameState
    gameState.cities[slotIndex] = {
        slotIndex,
        type: "villain",
        id: String(cardId)
    };

    // Remove animation afterwards
    setTimeout(() => wrapper.classList.remove("city-card-enter"), 650);
}

function attemptSingleLeftShift(fromPos) {

    if (fromPos <= 0) return false;

    const fromIndex = UPPER_ORDER[fromPos];
    const toIndex   = UPPER_ORDER[fromPos - 1];

    // frozen check
    const leftEntry = gameState.cities[toIndex];
    if (leftEntry && isFrozen(leftEntry.id)) {
        return false;
    }

    pushChain(toIndex);
    moveCardModelAndDOM(fromIndex, toIndex);

    return true;
}

async function handleVillainEscape(entry, state) {
    if (!entry || !state) return;

    const foeId = String(entry.id || "");
    if (!foeId) return;

    // ---------------------------------------------------------------------
    // 1. KO CAPTURED BYSTANDERS (existing behavior)
    // ---------------------------------------------------------------------
    const captured = Array.isArray(entry.capturedBystanders)
        ? entry.capturedBystanders
        : [];

    if (captured.length > 0) {
        if (!Array.isArray(state.koCards)) {
            state.koCards = [];
        }

        for (const b of captured) {
            state.koCards.push({
                id: b.id,
                name: b.name,
                type: "Bystander",
                source: "escape"
            });
        }

        const total = captured.length;
        const msg = total === 1 ? "1 Bystander KO'd" : `${total} Bystanders KO'd`;

        try {
            await showMightBanner(msg, 2000);
        } catch (e) {
            console.warn("[BYSTANDER KO BANNER FAILED]", e);
        }

        console.log(`[ESCAPE] KO’d ${total} bystanders:`, captured);
    }

    // ---------------------------------------------------------------------
    // 2. Identify villain or henchman object for HP/takeover
    // ---------------------------------------------------------------------
    const foeCard =
        villains.find(v => String(v.id) === foeId) ||
        henchmen.find(h => String(h.id) === foeId);

    if (!foeCard) {
        console.warn("[handleVillainEscape] No foe card found for id:", foeId);
        return;
    }

    // Establish villain.currentHP if missing
    const vMax = Number(foeCard.hp || 0);
    if (typeof foeCard.currentHP !== "number") {
        foeCard.currentHP = vMax;
    }
    const vCur = foeCard.currentHP;

    // ---------------------------------------------------------------------
    // 3. Retrieve current Overlord + ensure overlord.currentHP exists
    // ---------------------------------------------------------------------
    const ovId = state.overlords?.[0];
    if (!ovId) return;

    let overlord =
        overlords.find(o => String(o.id) === String(ovId)) ||
        villains.find(v => String(v.id) === String(ovId));

    if (!overlord) return;

    const ovBaseHP = Number(overlord.hp || 0);

    if (!state.overlordHP) state.overlordHP = {};
    if (typeof state.overlordHP[ovId] !== "number") {
        state.overlordHP[ovId] = ovBaseHP;
    }
    overlord.currentHP = state.overlordHP[ovId];

    const ovCur = overlord.currentHP;
    const ovLevel = Number(overlord.level || 0);

    // ---------------------------------------------------------------------
    // 4. Determine takeover(N)
    // ---------------------------------------------------------------------
    let takeoverLevel = 0;

    if (Array.isArray(foeCard.abilitiesEffects)) {
        for (const eff of foeCard.abilitiesEffects) {
            const raw = eff?.effect;
            const list = Array.isArray(raw) ? raw : [raw];

            for (const x of list) {
                if (typeof x !== "string") continue;
                const m = x.match(/^takeover\((\d+)\)/i);
                if (m) {
                    takeoverLevel = Number(m[1]);
                }
            }
        }
    }

    const hasTakeover = takeoverLevel > 0;

    // ---------------------------------------------------------------------
    // 5. Evaluate takeover conditions
    // ---------------------------------------------------------------------
    const qualifiesLevel = hasTakeover && takeoverLevel >= ovLevel;
    const qualifiesHP = hasTakeover && vCur >= ovCur;

    if (qualifiesLevel && qualifiesHP) {
        // =============================================================
        // SUCCESSFUL TAKEOVER
        // =============================================================

        console.log(
            `[TAKEOVER SUCCESS] ${foeCard.name} overthrows ${overlord.name}.`
        );

        // KO old overlord
        if (!Array.isArray(state.koCards)) state.koCards = [];
        state.koCards.push({
            id: ovId,
            name: overlord.name,
            type: "Overlord",
            reason: "takeover"
        });

        // New Overlord HP = overlord.currentHP + villain.currentHP
        let newHP = ovCur + vCur;
        const takeoverCap = vMax * 2;
        if (newHP > takeoverCap) newHP = takeoverCap;

        // Replace Overlord
        state.overlords[0] = foeId;
        state.overlordHP[foeId] = newHP;
        foeCard.currentHP = newHP;

        // Update UI
        try {
            setCurrentOverlord(foeCard);
            buildOverlordPanel(foeCard);
        } catch (e) {
            console.warn("[TAKEOVER PANEL ERROR]", e);
        }

        console.log(
            `[TAKEOVER] New Overlord: ${foeCard.name} (${newHP}/${takeoverCap})`
        );

        saveGameState(state);
        return;
    }

    // ---------------------------------------------------------------------
    // 6. FAILED TAKEOVER OR NO TAKEOVER → Overlord gains HP
    // ---------------------------------------------------------------------
    const hpGain = vCur;
    let updatedHP = ovCur + hpGain;
    const overCap = ovBaseHP * 2;

    if (updatedHP > overCap) updatedHP = overCap;

    state.overlordHP[ovId] = updatedHP;
    overlord.currentHP = updatedHP;

    console.log(
        `[ESCAPE] ${foeCard.name} escaped → Overlord gains ${hpGain} HP `
        + `(${updatedHP}/${overCap}).`
    );

    try {
        setCurrentOverlord(overlord);
        buildOverlordPanel(overlord);
    } catch (e) {
        console.warn("[OVERLORD PANEL REFRESH ERROR]", e);
    }

    saveGameState(state);
}

async function pushChain(targetIndex) {

    const pos = UPPER_ORDER.indexOf(targetIndex);
    if (pos <= 0) {
        const exiting = gameState.cities[targetIndex];
        if (!exiting) return;

        await handleVillainEscape(exiting, gameState);
        resolveExitForVillain(exiting);
        return;
    }

    const nextLeft = UPPER_ORDER[pos - 1];

    // If occupied, push that one further left (recursively)
    if (gameState.cities[targetIndex]) {
        pushChain(nextLeft);
        moveCardModelAndDOM(targetIndex, nextLeft);
    }
}

function moveCardModelAndDOM(fromIndex, toIndex) {

    const citySlots = document.querySelectorAll(".city-slot");
    if (!citySlots || !citySlots.length) return;

    // --- VILLAIN DOM ---
    const fromSlot = citySlots[fromIndex];
    const toSlot   = citySlots[toIndex];
    if (!fromSlot || !toSlot) return;

    const fromArea = fromSlot.querySelector(".city-card-area");
    const toArea   = toSlot.querySelector(".city-card-area");
    if (!fromArea || !toArea) return;

    const node = fromArea.querySelector(".card-wrapper");
    if (!node) return;

    node.classList.add("city-card-slide-left");

    toArea.innerHTML = "";
    toArea.appendChild(node);
    fromArea.innerHTML = "";

    setTimeout(() => node.classList.remove("city-card-slide-left"), 650);

    // --- VILLAIN MODEL ---
    if (!Array.isArray(gameState.cities)) {
        gameState.cities = new Array(12).fill(null);
    }

    gameState.cities[toIndex] = gameState.cities[fromIndex];
    if (gameState.cities[toIndex]) {
        gameState.cities[toIndex].slotIndex = toIndex;
    }
    gameState.cities[fromIndex] = null;

    // --- HERO FOLLOW LOGIC (for Charge, etc.) ---
    moveHeroesWithVillain(fromIndex, toIndex);
}

function moveHeroesWithVillain(fromUpperIndex, toUpperIndex) {
    // Heroes follow villains from lower city under FROM to lower city under TO
    // Only applies to valid city indices; HQ heroes (cityIndex === null) are unaffected.

    if (!Array.isArray(gameState.heroes) || !gameState.heroData) return;

    const fromLowerIndex = fromUpperIndex + 1;
    const toLowerIndex   = toUpperIndex + 1;

    const heroIds = gameState.heroes || [];
    if (!heroIds.length) return;

    const citySlots = document.querySelectorAll(".city-slot");
    if (!citySlots || !citySlots.length) return;

    const fromSlot = citySlots[fromLowerIndex];
    const toSlot   = citySlots[toLowerIndex];
    if (!fromSlot || !toSlot) return;

    const fromArea = fromSlot.querySelector(".city-card-area");
    const toArea   = toSlot.querySelector(".city-card-area");
    if (!fromArea || !toArea) return;

    heroIds.forEach(hid => {
        const hState = gameState.heroData?.[hid];
        if (!hState) return;

        // Only heroes currently in the lower city under the FROM upper index should move
        if (hState.cityIndex !== fromLowerIndex) return;

        // Update model first
        hState.cityIndex = toLowerIndex;

        const heroNode = fromArea.querySelector(".card-wrapper");
        if (!heroNode) return;

        // Match the animation behavior from shoveUpper
        heroNode.classList.remove("city-card-enter");
        heroNode.classList.remove("city-card-slide-left");
        heroNode.classList.add("hero-card-slide-left");

        setTimeout(() => {
            const freshFromArea = fromSlot.querySelector(".city-card-area");
            const freshToArea   = toSlot.querySelector(".city-card-area");
            if (freshFromArea && freshToArea) {
                freshFromArea.innerHTML = "";
                freshToArea.innerHTML   = "";
                freshToArea.appendChild(heroNode);
            }

            heroNode.classList.remove("hero-card-slide-left");
        }, 650); // same timing as villains
    });
}

function isFrozen(cardId) {
    // Expand this if your freeze rules differ
    const data =
        henchmen.find(h => h.id === cardId) ||
        villains.find(v => v.id === cardId);

    return data?.isFrozen === true;
}

function resolveExitForVillain(entry) {
    if (!entry) return;

    const upperIdx = Number(entry.slotIndex);
    if (Number.isNaN(upperIdx)) {
        console.warn("[resolveExitForVillain] Invalid slotIndex on entry:", entry);
        return;
    }

    const lowerIdx = upperIdx + 1;
    console.warn("[resolveExitForVillain] Villain exited:", entry);

    // 1) Remove villain from DOM
    const citySlots = document.querySelectorAll(".city-slot");
    const upperSlot = citySlots[upperIdx];
    const lowerSlot = citySlots[lowerIdx];

    if (upperSlot) {
        const upperArea = upperSlot.querySelector(".city-card-area");
        if (upperArea) upperArea.innerHTML = "";
    }

    // 2) Remove from gameState
    if (Array.isArray(gameState.cities)) {
        gameState.cities[upperIdx] = null;
    }

    // 3) If a hero is beneath the exiting villain, send them home
    let heroReturned = false;

    for (const hid of gameState.heroes || []) {
        const hState = gameState.heroData?.[hid];
        if (!hState) continue;

        if (hState.cityIndex === lowerIdx) {
            hState.cityIndex = null;
            heroReturned = true;

            const heroObj = heroes.find(h => String(h.id) === String(hid));
            console.log(
                `[resolveExitForVillain] ${heroObj?.name || hid} returned to HQ.`
            );
        }
    }

    // Clear hero DOM
    if (heroReturned && lowerSlot) {
        const lowerArea = lowerSlot.querySelector(".city-card-area");
        if (lowerArea) lowerArea.innerHTML = "";
    }

    // 4) Save state of city changes
    saveGameState(gameState);

    // 5) Delegate ALL escape consequences (HP gain, takeover, KO bystanders, etc.)
    //handleVillainEscape(entry, gameState);
}