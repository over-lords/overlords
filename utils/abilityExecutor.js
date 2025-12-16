/*
RULES

Henchmen and Villains KO'd from the top of the villain deck do not grant Rewards

protect overlord if cit(ies) still occupied

*/

const isSinglePlayer = (window.GAME_MODE === "single");
const isMultiplayer = (window.GAME_MODE === "multi");

import { heroes } from '../data/faceCards.js';
import { overlords } from '../data/overlords.js';
import { scenarios } from "../data/scenarios.js";
import { tactics } from '../data/tactics.js';
import { henchmen } from "../data/henchmen.js";
import { villains } from "../data/villains.js";

import { setCurrentOverlord, buildOverlordPanel, showMightBanner, renderHeroHandBar, placeCardIntoCitySlot } from "./pageSetup.js";
import { getCurrentOverlordInfo, takeNextHenchVillainsFromDeck,
         enterVillainFromEffect, checkGameEndConditions, villainDraw } from "./turnOrder.js";
import { findCardInAllSources, renderCard } from './cardRenderer.js';
import { gameState } from "../data/gameState.js";
import { saveGameState } from "./stateManager.js";

import {
    CITY_EXIT_UPPER,
    CITY_5_UPPER,
    CITY_4_UPPER,
    CITY_3_UPPER,
    CITY_2_UPPER,
    CITY_ENTRY_UPPER,
    CITY_EXIT_GLIDE,
    CITY_5_GLIDE,
    CITY_4_GLIDE,
    CITY_3_GLIDE,
    CITY_2_GLIDE,
    CITY_ENTRY_GLIDE
} from '../data/gameState.js';

const UPPER_ORDER = [
    CITY_EXIT_UPPER,
    CITY_5_UPPER,
    CITY_4_UPPER,
    CITY_3_UPPER,
    CITY_2_UPPER,
    CITY_ENTRY_UPPER
];

const GLIDE_ORDER = [
  CITY_EXIT_GLIDE,
  CITY_5_GLIDE,
  CITY_4_GLIDE,
  CITY_3_GLIDE,
  CITY_2_GLIDE,
  CITY_ENTRY_GLIDE
];

const EFFECT_HANDLERS = {};

EFFECT_HANDLERS.charge = function (args, card, selectedData) {
    const distance = Number(args[0]) || 1;
    runCharge(card.id, distance);
};

EFFECT_HANDLERS.draw = function(args, card, selectedData) {
    const count = Number(args?.[0]) || 1;

    const heroId = selectedData?.currentHeroId ?? null;
    if (!heroId) {
        console.warn("[draw] No currentHeroId available.");
        return;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.warn("[draw] No heroState for heroId:", heroId);
        return;
    }

    if (!Array.isArray(heroState.deck))   heroState.deck = [];
    if (!Array.isArray(heroState.hand))   heroState.hand = [];

    console.log(`[draw] ${count} card(s) for hero ${heroId}.`);

    for (let i = 0; i < count; i++) {
        if (heroState.deck.length === 0) {
            console.log("[draw] Deck empty – cannot draw further.");
            break;
        }

        const cardId = heroState.deck.shift();
        heroState.hand.push(cardId);
        console.log(`[draw] → Drawn card ID ${cardId}`);
    }

    saveGameState(gameState);
    renderHeroHandBar(gameState);
};

EFFECT_HANDLERS.enemyDraw = function(args, card, selectedData) {
    const count = Number(args?.[0]) || 1;
    const limit = args?.[1] ?? null;
    return enemyDraw(count, limit);
};

EFFECT_HANDLERS.regainLife = function(args, card, selectedData) {
    const amount = Number(args?.[0]) || 1;

    const heroId = selectedData?.currentHeroId ?? null;
    if (!heroId) {
        console.warn("[regainLife] No currentHeroId available.");
        return;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.warn("[regainLife] No heroState found for heroId:", heroId);
        return;
    }

    const heroCard = heroes.find(h => String(h.id) === String(heroId));
    if (!heroCard) {
        console.warn("[regainLife] Could not find hero card for heroId:", heroId);
        return;
    }

    const baseHP = Number(heroCard.hp || heroCard.baseHP || 0);
    if (!heroState.hp && heroState.hp !== 0) {
        heroState.hp = baseHP; // initialize if missing
    }

    const before = heroState.hp;
    heroState.hp = Math.min(baseHP, heroState.hp + amount);

    console.log(
        `[regainLife] ${heroCard.name} regains ${amount} HP (${before} → ${heroState.hp}).`
    );

    saveGameState(gameState);
};

EFFECT_HANDLERS.gainSidekick = function(args, card, selectedData) {
    const count = Number(args?.[0]) || 1;

    const heroId = selectedData?.currentHeroId ?? null;
    if (!heroId) {
        console.warn("[gainSidekick] No currentHeroId available.");
        return;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.warn("[gainSidekick] No heroState for heroId:", heroId);
        return;
    }

    if (!Array.isArray(heroState.discard)) heroState.discard = [];

    console.log(`[gainSidekick] Adding ${count} Sidekick(s) to hero ${heroId}'s discard pile.`);

    for (let i = 0; i < count; i++) {
        heroState.discard.push("0"); // Sidekick card ID = "0"
        console.log("[gainSidekick] → Sidekick added.");
    }

    saveGameState(gameState);
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

EFFECT_HANDLERS.rallyNextHenchVillains = function(args) {
    const count = Number(args[0]) || 1;
    rallyNextHenchVillains(count);
};

EFFECT_HANDLERS.villainDraw = function(args) {
    const count = Number(args[0]) || 1;
    villainDraw(count);
};

// END OF EFFECT HANDLERS

export function executeEffectSafely(effectString, card, selectedData) {
    if (!effectString || typeof effectString !== "string") {
        console.warn(`[executeEffectSafely] Invalid effect '${effectString}' on card '${card?.name}'.`);
        return;
    }

    //console.log(`%c[executeEffectSafely] Running: ${effectString} (from ${card?.name})`,
        //"color:#22a;font-weight:bold");

    // Some effects have MULTIPLE comma-separated calls
    const calls = [];
    let depth = 0;
    let current = "";

    for (const ch of effectString) {
        if (ch === "(") depth++;
        if (ch === ")") depth--;

        if (ch === "," && depth === 0) {
            if (current.trim()) calls.push(current.trim());
            current = "";
        } else {
            current += ch;
        }
    }

    if (current.trim()) calls.push(current.trim());

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
            handler(parsedArgs, card, { ...selectedData });
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

async function runCharge(cardId, distance) {

    const entryIndex = CITY_ENTRY_UPPER;

    // STEP 1 — Simulate a blank shove (shift all villains left one)
    // (exactly what you had before)
    await pushChain(entryIndex);

    // STEP 2 — Now place the new villain into City 1 AFTER pushing
    // (exactly what you had before)
    placeCardIntoCitySlot(cardId, entryIndex);

    // STEP 3 — After a short delay, visually "charge" left
    setTimeout(async () => {
        addChargeRushLines(entryIndex);

        let fromPos = UPPER_ORDER.indexOf(entryIndex);

        for (let step = 0; step < distance; step++) {
            const moved = await attemptSingleLeftShift(fromPos);
            if (!moved) break;
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

async function attemptSingleLeftShift(fromPos) {

    if (fromPos <= 0) return false;

    const fromIndex = UPPER_ORDER[fromPos];
    const toIndex   = UPPER_ORDER[fromPos - 1];

    // frozen check
    const leftEntry = gameState.cities[toIndex];
    if (leftEntry && isFrozen(leftEntry.id)) {
        return false;
    }

    await pushChain(toIndex);
    moveCardModelAndDOM(fromIndex, toIndex);

    return true;
}

export async function handleVillainEscape(entry, state) {
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
    // 3. SCENARIO BRANCH:
    //    If a Scenario is on top, it gains HP with NO CAP and no takeover
    // ---------------------------------------------------------------------
    if (state.activeScenarioId != null) {
        const scenId = String(state.activeScenarioId);
        const scenarioCard = scenarios.find(s => String(s.id) === scenId);

        if (scenarioCard) {
            if (!state.scenarioHP) state.scenarioHP = {};

            // Resolve prior HP: prefer stored scenarioHP, then currentHP, then baseHP
            let prevHP = state.scenarioHP[scenId];
            if (typeof prevHP !== "number") {
                if (typeof scenarioCard.currentHP === "number") {
                    prevHP = Number(scenarioCard.currentHP);
                } else {
                    const baseHP = Number(scenarioCard.hp || 0) || 0;
                    prevHP = baseHP;
                }
            }

            // Scenarios have NO MAX HP: simply add vCur
            const newHP = prevHP + vCur;

            state.scenarioHP[scenId] = newHP;
            scenarioCard.currentHP = newHP;

            console.log(
                `[ESCAPE] ${foeCard.name} escaped → Scenario ${scenarioCard.name} gains `
                + `${vCur} HP (${prevHP} → ${newHP}).`
            );

            try {
                // Keep the Scenario on top of the frame; do NOT bring back the Overlord
                setCurrentOverlord(scenarioCard);
                // We intentionally do NOT call buildOverlordPanel(overlord) here.
            } catch (e) {
                console.warn("[ESCAPE] Failed to refresh Scenario panel after escape.", e);
            }

            saveGameState(state);
        }

        // IMPORTANT: when a Scenario is active,
        // takeover can never occur and Overlord HP should not change.
        return;
    }

    // ---------------------------------------------------------------------
    // 4. Retrieve current Overlord + ensure overlord.currentHP exists
    //    (original behavior for when NO Scenario is present)
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
    // 5. Determine takeover(N)  (unchanged)
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
    // 6. Evaluate takeover conditions (ONLY when no Scenario is active)
    // ---------------------------------------------------------------------
    const qualifiesLevel = hasTakeover && takeoverLevel >= ovLevel;
    const qualifiesHP = hasTakeover && vCur >= ovCur;

    if (qualifiesLevel && qualifiesHP) {
        // =============================================================
        // SUCCESSFUL TAKEOVER (original behavior)
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

        // REQUIRED FOR REFRESH RESTORATION
        state.overlordIsVillain = true;  

        // This is the structure restoreUIFromState() actually reads
        state.overlordData = {
            currentHP: newHP
        };

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

        state.currentOverlordCard = {
            id: foeCard.id,
            name: foeCard.name,
            image: foeCard.image,
            hp: newHP
        };

        saveGameState(state);
        return;
    }

    // ---------------------------------------------------------------------
    // 7. FAILED TAKEOVER OR NO TAKEOVER → Overlord gains HP (capped)
    //    (original behavior)
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
        //buildOverlordPanel(overlord);
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
        await pushChain(nextLeft);
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

export function resolveExitForVillain(entry) {
    if (!entry) return;

    const upperIdx = Number(entry.slotIndex);
    if (Number.isNaN(upperIdx)) {
        console.warn("[resolveExitForVillain] Invalid slotIndex on entry:", entry);
        return;
    }

    const lowerIdx = upperIdx + 1;
    console.warn("[resolveExitForVillain] Villain exited:", entry);

    const citySlots = document.querySelectorAll(".city-slot");
    const upperSlot = citySlots[upperIdx];
    const lowerSlot = citySlots[lowerIdx];

    // ---------------------------------------------------------------------
    // 1) Update MODEL immediately so other moves see the city as empty
    // ---------------------------------------------------------------------
    if (Array.isArray(gameState.cities)) {
        const current = gameState.cities[upperIdx];

        // Only clear if the exiting villain is still there in the model
        if (current && String(current.id) === String(entry.id)) {
            gameState.cities[upperIdx] = null;
        }
    }

    // ---------------------------------------------------------------------
    // 2) If a hero is beneath the exiting villain, send them home (MODEL)
    // ---------------------------------------------------------------------
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

    // Persist model changes now
    saveGameState(gameState);

    // ---------------------------------------------------------------------
    // 3) DELAYED VISUAL CLEANUP ONLY
    //    - Do NOT wipe the slot if a different villain moved in.
    // ---------------------------------------------------------------------
    setTimeout(() => {
        const freshSlots = document.querySelectorAll(".city-slot");
        const freshUpperSlot = freshSlots[upperIdx];
        const freshLowerSlot = freshSlots[lowerIdx];

        // Re-check what's in the model for this city
        const current = Array.isArray(gameState.cities)
            ? gameState.cities[upperIdx]
            : null;

        // Only clear the upper slot if:
        //  - it's still empty in the model (stale DOM),
        //  - OR it still belongs to the same exiting villain id.
        // If a new villain (e.g., from city 2) has been moved into 0,
        // current.id !== entry.id and we skip clearing DOM.
        if (!current || String(current.id) === String(entry.id)) {
            if (freshUpperSlot) {
                const upperArea = freshUpperSlot.querySelector(".city-card-area");
                if (upperArea) upperArea.innerHTML = "";
            }
        }

        // Clear hero DOM if we returned someone from the lower city
        if (heroReturned && freshLowerSlot) {
            const lowerArea = freshLowerSlot.querySelector(".city-card-area");
            if (lowerArea) lowerArea.innerHTML = "";
        }
    }, 650);
}

// 5) Delegate ALL escape consequences (HP gain, takeover, KO bystanders, etc.)
// //handleVillainEscape(entry, gameState);
// Removed because this doubled the HP the overlord got when escaping


// START OF ACTUAL EFFECTS HANDLING HOLY SHIT

export async function rallyNextHenchVillains(count) {
    if (!count || count <= 0) return;

    const collected = takeNextHenchVillainsFromDeck(count);
    if (!Array.isArray(collected) || collected.length === 0) return;

    for (const id of collected) {
        await enterVillainFromEffect(id);
    }

    saveGameState(gameState);
}

export function onHeroCardActivated(cardId, meta = {}) {
    if (gameState.gameOver) {
        console.log("[GameOver] Ignoring hero card activation; game is already over.");
        return;
    }

    const idStr    = String(cardId);
    const action   = meta.action || "activated";
    const heroId   = meta.heroId ?? null;

    const cardData = findCardInAllSources(cardId);
    const cardName = cardData?.name || `Card ${idStr}`;

    const heroObj  = heroId != null
        ? heroes.find(h => String(h.id) === String(heroId))
        : null;
    const heroName = heroObj?.name || (heroId != null ? `Hero ${heroId}` : "Unknown hero");

    console.log(
        `[AbilityExecutor] Hero card ${action}: ${cardName} (ID ${idStr})`,
        {
            heroId,
            heroName,
            meta,
            cardData
        }
    );

    // ------------------------------------------------------
    // NEW: Print discarded card + damage
    // (Even though activation != discard, user requested this log here)
    // ------------------------------------------------------
    const dmgValue = cardData?.damage ?? cardData?.dmg ?? "Unknown";
    console.log(
        `[AbilityExecutor] Discarded ${cardName} - Card Damage is ${dmgValue}`
    );

    // ------------------------------------------------------
    //  Log the hero's current foe (Overlord or upper-city enemy)
    // ------------------------------------------------------
    let foeSummary = null;

    if (heroId != null && gameState.heroData) {
        const heroState = gameState.heroData[heroId];

        if (heroState && typeof heroState === "object") {

            // Case 1: Hero is facing the Overlord
            if (heroState.isFacingOverlord) {
                const ovInfo = getCurrentOverlordInfo(gameState);
                if (ovInfo && ovInfo.card) {
                    const ovHP =
                        typeof ovInfo.currentHP === "number"
                            ? ovInfo.currentHP
                            : (typeof gameState.currentOverlordHP === "number"
                                ? gameState.currentOverlordHP
                                : ovInfo.card.hp);

                    foeSummary = {
                        foeType: ovInfo.card.type || "Overlord",
                        foeId:   ovInfo.id,
                        foeName: ovInfo.card.name || `Overlord ${ovInfo.id}`,
                        currentHP: ovHP,
                        source:  "overlord"
                    };
                }
            }

            // Case 2: Hero is in a city – check the upper slot above
            else if (typeof heroState.cityIndex === "number") {
                const heroIdx = heroState.cityIndex;
                const upperIdx = heroIdx - 1;
                const cities   = Array.isArray(gameState.cities) ? gameState.cities : null;
                const entry    = cities ? cities[upperIdx] : null;

                if (entry && entry.id != null) {
                    const foeIdStr = String(entry.id);

                    const foeCard =
                        henchmen.find(h => String(h.id) === foeIdStr) ||
                        villains.find(v => String(v.id) === foeIdStr);

                    if (foeCard) {
                        const instance = entry;
                        const hp =
                            typeof instance.currentHP === "number"
                                ? instance.currentHP
                                : foeCard.hp;

                        foeSummary = {
                            foeType: foeCard.type || "Enemy",
                            foeId:   foeIdStr,
                            instanceId: foeCard.instanceId,
                            foeName: foeCard.name || `Enemy ${foeIdStr}`,
                            currentHP: hp,
                            slotIndex: upperIdx,
                            source:  "city-upper"
                        };
                    }
                }
            }
        }
    }

    if (foeSummary) {
        console.log(
            `[AbilityExecutor] ${heroName}'s current foe: `
            + `${foeSummary.foeName} (${foeSummary.foeType}) `
            + `[ID ${foeSummary.foeId}] HP: ${foeSummary.currentHP}`,
            { heroId, heroName, foe: foeSummary }
        );
    } else {
        console.log(
            `[AbilityExecutor] ${heroName} currently has no engaged foe `
            + `(not facing Overlord and no henchman/villain in the upper city slot).`,
            {
                heroId,
                heroName
            }
        );
    }

    const rawDamage =
        (cardData && (cardData.damage ?? cardData.dmg ?? cardData.attack)) ?? 0;
    const damageAmount = Number(rawDamage) || 0;

    if (foeSummary && damageAmount > 0) {
        console.log(
            `[AbilityExecutor] ${heroName} is dealing ${damageAmount} damage to ${foeSummary.foeName}.`
        );

        if (foeSummary.source === "overlord") {
            // Overlord damage uses the existing damageOverlord helper
            damageOverlord(damageAmount, gameState);
        } else if (foeSummary.source === "city-upper") {
            // Henchmen / Villain damage goes through the new damageFoe helper
            damageFoe(damageAmount, foeSummary, heroId, gameState);
        } else {
            console.log(
                "[AbilityExecutor] Foe summary has unknown source; no damage applied.",
                foeSummary
            );
        }
    } else {
        if (!foeSummary) {
            console.log("[AbilityExecutor] No foe to damage for this hero activation.");
        } else {
            console.log(
                "[AbilityExecutor] Hero card has no positive damage value; skipping damage.",
                { rawDamage, damageAmount }
            );
        }
    }

    if (Array.isArray(cardData?.abilitiesEffects) && cardData.abilitiesEffects.length > 0) {
        console.log(`[AbilityExecutor] Abilities Effects for ${cardName}:`);

        cardData.abilitiesEffects.forEach((eff, index) => {
            // Normalize effect field: can be string OR array
            let effectsList = [];

            if (Array.isArray(eff.effect)) {
                effectsList = eff.effect;
            } else if (typeof eff.effect === "string") {
                effectsList = [eff.effect];
            } else {
                effectsList = ["<No valid effect>"];
            }

            console.log(
                `  [Effect ${index + 1}]`,
                {
                    type: eff.type ?? "none",
                    condition: eff.condition ?? "none",
                    uses: eff.uses ?? "n/a",
                    shared: eff.shared ?? "n/a",
                    effects: effectsList
                }
            );
        });
    } else {
        console.log(
            `[AbilityExecutor] ${cardName} has no abilitiesEffects array or it is empty.`,
            cardData
        );
    }

    // ------------------------------------------------------
    // EFFECT EXECUTION PIPELINE
    // ------------------------------------------------------
    console.log(`[AbilityExecutor] Beginning effect execution for ${cardName}.`);

    if (Array.isArray(cardData?.abilitiesEffects)) {

        for (const eff of cardData.abilitiesEffects) {

            // 1. CONDITION CHECK
            const cond = eff.condition?.trim() || "none";
            let allow = false;

            if (cond === "none") {
                allow = true;
            } else {
                // This is where additional conditions will go later.
                console.log(`[AbilityExecutor] Condition '${cond}' not yet implemented, skipping.`);
                continue;
            }

            if (!allow) {
                console.log(`[AbilityExecutor] Condition '${cond}' failed for ${cardName}, skipping effect.`);
                continue;
            }

            // 2. NORMALIZE effect field
            let effectsArray = [];
            if (Array.isArray(eff.effect)) {
                effectsArray = eff.effect;
            } else if (typeof eff.effect === "string") {
                effectsArray = [eff.effect];
            } else {
                console.warn("[AbilityExecutor] Invalid effect field:", eff.effect);
                continue;
            }

            // 3. EXECUTE EACH EFFECT
            for (const effectString of effectsArray) {
                if (typeof effectString !== "string") {
                    console.warn("[AbilityExecutor] Skipping invalid effect value:", effectString);
                    continue;
                }

                // Parse functionName(args)
                const match = effectString.match(/^([A-Za-z0-9_]+)\((.*)\)$/);
                if (!match) {
                    console.warn(`[AbilityExecutor] Could not parse effect '${effectString}' on ${cardName}.`);
                    continue;
                }

                const fnName = match[1];
                const argsRaw = match[2]
                    .split(",")
                    .map(x => x.trim())
                    .filter(x => x.length > 0);

                console.log(`[AbilityExecutor] → Found effect '${fnName}' on ${cardName}. Args:`, argsRaw);

                const handler = EFFECT_HANDLERS[fnName];

                if (!handler) {
                    console.warn(`[AbilityExecutor] No EFFECT_HANDLERS entry for '${fnName}'.`);
                    continue;
                }

                // Convert args
                const parsedArgs = argsRaw.map(a => {
                    if (/^\d+$/.test(a)) return Number(a);
                    if (a.toLowerCase() === "true") return true;
                    if (a.toLowerCase() === "false") return false;
                    return a;
                });

                console.log(`[AbilityExecutor] Executing effect handler '${fnName}'…`);

                try {
                    handler(parsedArgs, cardData, { currentHeroId: heroId, state: gameState });
                    console.log(`[AbilityExecutor] '${fnName}' executed successfully.`);
                } catch (err) {
                    console.warn(`[AbilityExecutor] Handler '${fnName}' failed: ${err.message}`);
                }
            }
        }
    }

    console.log(`[AbilityExecutor] Completed effect execution for ${cardName}.`);
}

// =======================================================================
// DAMAGE THE CURRENT OVERLORD
// =======================================================================
export function damageOverlord(amount, state = gameState) {
    const s = state;

    // If game is over, ignore further damage
    if (s.gameOver) {
        console.log("[damageOverlord] Ignored because game is already over.");
        return;
    }

    const info = getCurrentOverlordInfo(s);
    if (!info) {
        console.warn("[damageOverlord] No current overlord found.");
        return;
    }

    const ovId      = info.id;
    const ovCard    = info.card;
    const currentHP = info.currentHP;
    const newHP     = Math.max(0, currentHP - amount);

    // ===================================================================
    // SCENARIO BRANCH: damage active Scenario HP, do NOT touch overlordHP
    // ===================================================================
    if (info.kind === "scenario" || (ovCard && ovCard.type === "Scenario")) {

        if (!s.scenarioHP) s.scenarioHP = {};
        s.scenarioHP[ovId] = newHP;

        // Keep the scenario card in sync for panels/restore
        if (ovCard && typeof ovCard === "object") {
            ovCard.currentHP = newHP;
        }

        console.log(`Scenario ${ovId} took ${amount} damage -> ${newHP} HP`);

        // If Scenario not dead, update panel + persist and return
        if (newHP > 0) {
            try {
                if (ovCard) {
                    setCurrentOverlord(ovCard);
                    //buildOverlordPanel(ovCard);
                }
            } catch (e) {
                console.warn("[damageOverlord] Failed to update scenario panel after damage.", e);
            }

            saveGameState(s);
            return;
        }

        // ===============================================================
        // Scenario reduced to 0 HP → remove from stack, reveal what's under
        // ===============================================================
        console.log(`Scenario ${ovId} has been defeated.`);

        if (!Array.isArray(s.koCards)) {
            s.koCards = [];
        }
        s.koCards.push({
            id: ovId,
            name: ovCard?.name || `Scenario ${ovId}`,
            type: "Scenario",
            source: "hp-zero"
        });

        // Remove this Scenario from stack + HP map
        if (Array.isArray(s.scenarioStack)) {
            s.scenarioStack = s.scenarioStack.filter(id => String(id) !== String(ovId));
        }
        if (s.scenarioHP) {
            delete s.scenarioHP[ovId];
        }

        // Determine what sits on top now: another Scenario or the real Overlord
        if (Array.isArray(s.scenarioStack) && s.scenarioStack.length > 0) {
            const nextScenarioId = String(s.scenarioStack[s.scenarioStack.length - 1]);
            s.activeScenarioId = nextScenarioId;
        } else {
            s.activeScenarioId = null;
        }

        // Re-resolve "current overlord-ish thing" (either Scenario or Overlord)
        const nextInfo = getCurrentOverlordInfo(s);

        try {
            if (nextInfo && nextInfo.card) {
                setCurrentOverlord(nextInfo.card);
                if (nextInfo.kind !== "scenario") {
                    // For non-Scenario, keep existing behavior of rebuilding the panel
                    buildOverlordPanel(nextInfo.card);
                }
            }
        } catch (e) {
            console.warn("[damageOverlord] Failed to update panel after Scenario KO.", e);
        }

        // Do NOT return here: we still want to hit the SAVE + CHECK block below

    } else {
        // ===================================================================
        // ORIGINAL OVERLORD BRANCH (unchanged behavior)
        // ===================================================================

        if (!s.overlordHP) s.overlordHP = {};
        s.overlordHP[ovId] = newHP;

        // Keep the overlord card & overlordData in sync for panels/restore
        if (ovCard && typeof ovCard === "object") {
            ovCard.currentHP = newHP;
        }
        if (!s.overlordData) {
            s.overlordData = {};
        }
        s.overlordData.currentHP = newHP;

        console.log(`Overlord ${ovId} took ${amount} damage -> ${newHP} HP`);

        // If not dead, update panel + persist and return
        if (newHP > 0) {
            try {
                if (ovCard) {
                    setCurrentOverlord(ovCard);
                    //buildOverlordPanel(ovCard);
                }
            } catch (e) {
                console.warn("[damageOverlord] Failed to update overlord panel after damage.", e);
            }

            saveGameState(s);
            return;
        }

        // ===================================================================
        // OVERLORD KO'D — REMOVE FROM INDEX & LOG INTO KO ARRAY
        // ===================================================================
        console.log(`Overlord ${ovId} has been defeated.`);

        if (!Array.isArray(s.koCards)) {
            s.koCards = [];
        }
        s.koCards.push({
            id: ovId,
            name: ovCard?.name || `Overlord ${ovId}`,
            type: "Overlord",
            source: "hp-zero"
        });

        // Remove current overlord from the index (slides the others down)
        if (Array.isArray(s.overlords)) {
            s.overlords.shift();
        }

        // Remove HP entry so it's clean on next load
        delete s.overlordHP[ovId];

        // ===================================================================
        // INITIALIZE NEXT OVERLORD (if any remain) and update UI/state
        // ===================================================================
        const nextInfo = getCurrentOverlordInfo(s);

        if (nextInfo) {
            const nextId   = nextInfo.id;
            const nextCard = nextInfo.card;
            const baseHP   = nextInfo.baseHP;

            if (!s.overlordHP) s.overlordHP = {};
            s.overlordHP[nextId] = baseHP;

            if (nextCard && typeof nextCard === "object") {
                nextCard.currentHP = baseHP;
            }
            if (!s.overlordData) {
                s.overlordData = {};
            }
            s.overlordData.currentHP = baseHP;

            if (!s.currentOverlordCard) {
                s.currentOverlordCard = {};
            }
            s.currentOverlordCard.id    = nextCard?.id ?? nextId;
            s.currentOverlordCard.name  = nextCard?.name ?? `Overlord ${nextId}`;
            s.currentOverlordCard.image = nextCard?.image ?? "";
            s.currentOverlordCard.hp    = baseHP;

            console.log(`Next Overlord is now ${nextId} with HP ${baseHP}.`);

            try {
                if (nextCard) {
                    setCurrentOverlord(nextCard);
                    buildOverlordPanel(nextCard);
                }
            } catch (e) {
                console.warn("[damageOverlord] Failed to build panel for next overlord.", e);
            }
        } else {
            console.log("No Overlords remain after KO.");
            // checkGameEndConditions will detect the win
        }
    }

    // ===================================================================
    // SAVE + CHECK WIN/LOSS  (unchanged)
    // ===================================================================
    saveGameState(s);
    checkGameEndConditions(s);
}


// =======================================================================
// DAMAGE A HENCHMAN / VILLAIN IN THE CITY
// =======================================================================
export function damageFoe(amount, foeSummary, heroId = null, state = gameState) {
    const s = state;

    if (!foeSummary) {
        console.warn("[damageFoe] Called with no foeSummary.");
        return;
    }

    const foeIdStr = String(foeSummary.foeId || "");
    if (!foeIdStr) {
        console.warn("[damageFoe] foeSummary.foeId missing.", foeSummary);
        return;
    }

    if (!Array.isArray(s.cities)) {
        console.warn("[damageFoe] No cities array on state; cannot locate foe.");
        return;
    }

    // Locate the city entry for this foe
    let slotIndex = (typeof foeSummary.slotIndex === "number")
        ? foeSummary.slotIndex
        : null;

    let entry = s.cities.find(e =>
        e && e.instanceId === foeSummary.instanceId
    );
    if (!entry || String(entry.id) !== foeIdStr) {
        // Fallback: search city entries by id
        entry = null;
        for (let i = 0; i < s.cities.length; i++) {
            const e = s.cities[i];
            if (e && String(e.id) === foeIdStr) {
                entry = e;
                slotIndex = i;
                break;
            }
        }
    }

    if (!entry) {
        console.warn("[damageFoe] Could not find city entry for foe id:", foeIdStr);
        return;
    }

    // Lookup the full card data
    const foeCard =
        villains.find(v => String(v.id) === foeIdStr) ||
        henchmen.find(h => String(h.id) === foeIdStr);

    if (!foeCard) {
        console.warn("[damageFoe] No card data found for foe id:", foeIdStr);
        return;
    }

    const baseHP = Number(foeCard.hp || 0) || 0;

    if (!s.villainHP) {
        s.villainHP = {};
    }

    let currentHP = entry.currentHP;
    const savedHP = s.villainHP[foeIdStr];

    if (typeof currentHP !== "number") {
        if (typeof savedHP === "number") {
            currentHP = savedHP;
        } else if (typeof foeCard.currentHP === "number") {
            currentHP = foeCard.currentHP;
        } else {
            currentHP = baseHP;
        }
    }

    const newHP = Math.max(0, currentHP - amount);

    // Sync all representations
    entry.maxHP     = baseHP;
    entry.currentHP = newHP;

    const instId = entry.instanceId;
    if (instId) s.villainHP[instId] = newHP;

    console.log(
        `[damageFoe] ${foeCard.name} took ${amount} damage `
        + `(${currentHP} -> ${newHP}).`
    );

    // Re-render the foe card in its city slot so board shows updated HP
    try {
        const citySlots = document.querySelectorAll(".city-slot");
        if (slotIndex != null && citySlots[slotIndex]) {
            const slot = citySlots[slotIndex];
            const area = slot.querySelector(".city-card-area");
            if (area) {
                area.innerHTML = "";
                const wrapper = document.createElement("div");
                wrapper.className = "card-wrapper";
                wrapper.appendChild(renderCard(foeIdStr, wrapper));
                area.appendChild(wrapper);

                // Keep villain clickable for the panel
                wrapper.style.cursor = "pointer";
                wrapper.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (typeof window !== "undefined" &&
                        typeof window.buildVillainPanel === "function") {
                        window.buildVillainPanel(foeCard);
                    }
                });
            }
        }
    } catch (err) {
        console.warn("[damageFoe] Failed to re-render foe card on board.", err);
    }

    // If the foe is not KO'd, just persist and exit
    if (newHP > 0) {
        saveGameState(s);
        return;
    }

    // ===================================================================
    // FOE KO'D
    // ===================================================================
    console.log(`[damageFoe] ${foeCard.name} has been KO'd.`);
    showMightBanner(`${foeCard.name} has been KO'd.`, 2000);

    // ===================================================================
    // 1) RESCUE CAPTURED BYSTANDERS (NEW LOGIC)
    // ===================================================================
    if (Array.isArray(entry.capturedBystanders) && entry.capturedBystanders.length > 0) {
        const captured = entry.capturedBystanders;

        if (heroId != null && s.heroData && s.heroData[heroId]) {
            // Give to the hero who KO'd the foe
            const heroState = s.heroData[heroId];
            if (!Array.isArray(heroState.hand)) heroState.hand = [];

            captured.forEach(b => {
                // b is a full card object
                heroState.hand.push(String(b.id));
            });

            console.log(
                `[damageFoe] Hero ${heroId} rescues bystanders:`,
                captured.map(b => b.name)
            );
        } else {
            // No hero credited: KO them so they don't vanish
            if (!Array.isArray(s.koCards)) s.koCards = [];
            captured.forEach(b => {
                s.koCards.push({
                    id: b.id,
                    name: b.name,
                    type: "Bystander",
                    source: "foe-ko-no-hero"
                });
            });
        }

        // Clear captured bystanders on the city entry
        entry.capturedBystanders = [];
    }

    // ===================================================================
    // 2) REMOVE FOE FROM MODEL AND DOM
    // ===================================================================
    if (slotIndex != null && Array.isArray(s.cities)) {
        const e = s.cities[slotIndex];
        if (e && e.instanceId === foeSummary.instanceId) {
            s.cities[slotIndex] = null;
        }
    }

    try {
        const citySlots = document.querySelectorAll(".city-slot");
        if (slotIndex != null && citySlots[slotIndex]) {
            const slot = citySlots[slotIndex];
            const area = slot.querySelector(".city-card-area");
            if (area) area.innerHTML = "";
        }
    } catch (err) {
        console.warn("[damageFoe] Failed to clear foe card from DOM.", err);
    }

    // ===================================================================
    // 3) APPEND FOE TO KO ARRAY
    // ===================================================================
    if (!Array.isArray(s.koCards)) {
        s.koCards = [];
    }
    s.koCards.push({
        id: foeCard.id,
        name: foeCard.name,
        type: foeCard.type || "Enemy",
        source: "hero-attack"
    });

    // Clean up villainHP entry
    delete s.villainHP[foeSummary.instanceId];

    // ===================================================================
    // 4) RETURN HERO TO HQ
    // ===================================================================
    if (heroId != null) {
        sendHeroHomeFromBoard(heroId, s);
    }

    renderHeroHandBar(s);
    saveGameState(s);
}

// =======================================================================
// HELPER: SEND A HERO BACK TO HQ (REMOVE FROM BOARD)
// =======================================================================
function sendHeroHomeFromBoard(heroId, state = gameState) {
    if (!state.heroData) return;

    const heroState = state.heroData[heroId];
    if (!heroState || typeof heroState !== "object") return;

    const cityIndex = heroState.cityIndex;

    // Clear board position
    if (typeof cityIndex === "number") {
        try {
            const citySlots = document.querySelectorAll(".city-slot");
            if (citySlots[cityIndex]) {
                const slot = citySlots[cityIndex];
                const area = slot.querySelector(".city-card-area");
                if (area) {
                    area.innerHTML = "";
                }
            }
        } catch (err) {
            console.warn("[sendHeroHomeFromBoard] Failed to clear hero card from DOM.", err);
        }
    }

    // Reset hero's city position and facing
    heroState.cityIndex = null;
    heroState.isFacingOverlord = false;
}

export async function enemyDraw(count = 1, limit = null) {
    if (!Array.isArray(gameState.enemyAllyDeck)) {
        console.warn("[enemyDraw] enemyAllyDeck missing or invalid.");
        return;
    }

    if (!Array.isArray(gameState.enemyAllyDiscard)) {
        gameState.enemyAllyDiscard = [];
    }

    const deck = gameState.enemyAllyDeck;
    const discard = gameState.enemyAllyDiscard;

    const drawnCards = [];

    // Local Fisher–Yates shuffle for reshuffling the discard into a new deck
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Ensure there is at least one card available in the deck.
    // If the deck is empty but there is a discard pile, reshuffle it into the deck.
    function ensureDeckHasCards() {
        if (deck.length > 0) return true;

        if (!discard.length) {
            console.warn("[enemyDraw] Deck and discard exhausted.");
            return false;
        }

        // Move all discard cards back into the deck and shuffle
        while (discard.length) {
            deck.push(discard.pop());
        }
        shuffleArray(deck);

        // Reset pointer to top-of-deck semantics
        gameState.enemyAllyDeckPointer = 0;

        console.log("[enemyDraw] Reshuffled enemy+ally discard into deck:", deck);
        return true;
    }

    for (let n = 0; n < count; n++) {
        let cardId = null;
        let deckIndexUsed = null;

        // Make sure we have cards to draw (may reshuffle from discard)
        if (!ensureDeckHasCards()) {
            break;
        }

        // -------------------------------------------------
        // NORMAL DRAW – draw the top card and remove it
        // -------------------------------------------------
        if (!limit || (limit !== "nextEnemy" && limit !== "nextAlly")) {
            cardId = deck.shift();   // remove top-of-deck
            deckIndexUsed = 0;
        }

        // -------------------------------------------------
        // FILTERED DRAW (nextEnemy / nextAlly) – scan from top and remove match
        // -------------------------------------------------
        else {
            const wantType = limit === "nextEnemy" ? "Enemy" : "Ally";

            let foundIndex = -1;

            for (let i = 0; i < deck.length; i++) {
                const id = deck[i];
                const card = findCardInAllSources(id);

                if (card?.type === wantType) {
                    foundIndex = i;
                    cardId = id;
                    break;
                }
            }

            if (foundIndex === -1 || !cardId) {
                console.warn(`[enemyDraw] No ${wantType} found in remaining deck.`);
                break;
            }

            // Remove the found card from the deck so it cannot be drawn again
            deck.splice(foundIndex, 1);
            deckIndexUsed = foundIndex;
        }

        // Keep pointer consistent with "top-of-deck at index 0" semantics
        gameState.enemyAllyDeckPointer = 0;

        if (!cardId) continue;

        const cardData = findCardInAllSources(cardId);
        if (!cardData) {
            console.warn("[enemyDraw] Card data not found for ID:", cardId);
            continue;
        }

        // -------------------------------------------------
        // DISCARD HANDLING – every path moves drawn card to discard pile
        // -------------------------------------------------
        discard.push(cardId);

        drawnCards.push(cardData);

        console.log(
            `[enemyDraw] Drew ${cardData.type}: ${cardData.name} (ID ${cardId})`,
            {
                index: deckIndexUsed,
                effects: (cardData.abilitiesEffects || []).map(e => e.effect)
            }
        );

        // -------------------------------------------------
        // VISUAL RENDER
        // -------------------------------------------------
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.left = "50%";
        overlay.style.top = "50%";
        overlay.style.transform = "translate(-50%, 120%) scale(0.7)";
        overlay.style.zIndex = "9999";
        overlay.style.transition = "transform 0.35s ease, opacity 0.35s ease";

        const rendered = renderCard(cardId);
        overlay.appendChild(rendered);
        document.body.appendChild(overlay);

        // slide up to true center
        requestAnimationFrame(() => {
            overlay.style.transform = "translate(-50%, -50%) scale(0.7)";
        });

        // hold, then fade
        await new Promise(r => setTimeout(r, 1500));
        overlay.style.opacity = "0";

        setTimeout(() => overlay.remove(), 400);

        // -------------------------------------------------
        // MIGHT BANNER
        // -------------------------------------------------
        const bannerText =
            cardData?.abilitiesNamePrint?.[0]?.text ||
            cardData.name ||
            "Enemy / Ally Effect";

        try {
            await showMightBanner(bannerText, 1800);
        } catch (e) {
            console.warn("[enemyDraw] Might banner failed:", e);
        }

        // -------------------------------------------------
        // SAFE EFFECT EXECUTION
        // -------------------------------------------------
        if (Array.isArray(cardData.abilitiesEffects)) {
            for (const eff of cardData.abilitiesEffects) {
                if (!eff?.effect) continue;

                console.log(
                    `[enemyDraw] Executing effect '${eff.effect}' from ${cardData.name}`
                );

                try {
                    executeEffectSafely(eff.effect, cardData, {});
                } catch (err) {
                    console.warn(
                        `[enemyDraw] Effect failed on ${cardData.name}:`,
                        err
                    );
                }
            }
        }
    }

    saveGameState(gameState);
}
