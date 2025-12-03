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
        // Rush-line visual on City 1 to emphasize the forward motion
        addChargeRushLines(entryIndex);

        // Same charge movement logic you already had
        let fromPos = UPPER_ORDER.indexOf(entryIndex);

        for (let step = 0; step < distance; step++) {
            if (!attemptSingleLeftShift(fromPos)) break;
            fromPos -= 1;
        }

        saveGameState(gameState);
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
    const area = slot.querySelector(".city-card-area");

    // Clear old content
    area.innerHTML = "";

    // Render the new card
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";
    wrapper.appendChild(renderCard(cardId, wrapper));
    area.appendChild(wrapper);

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

function pushChain(targetIndex) {

    const pos = UPPER_ORDER.indexOf(targetIndex);
    if (pos <= 0) {
        // Off-board push occurs here
        const exiting = gameState.cities[targetIndex];
        if (!exiting) return;
        resolveExitForVillain(exiting);
        gameState.cities[targetIndex] = null;
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

    // DOM
    const fromSlot = citySlots[fromIndex];
    const toSlot = citySlots[toIndex];
    const fromArea = fromSlot.querySelector(".city-card-area");
    const toArea = toSlot.querySelector(".city-card-area");

    const node = fromArea.querySelector(".card-wrapper");
    if (!node) return;

    node.classList.add("city-card-slide-left");

    toArea.innerHTML = "";
    toArea.appendChild(node);
    fromArea.innerHTML = "";

    setTimeout(() => node.classList.remove("city-card-slide-left"), 650);

    // MODEL
    gameState.cities[toIndex] = gameState.cities[fromIndex];
    if (gameState.cities[toIndex]) {
        gameState.cities[toIndex].slotIndex = toIndex;
    }
    gameState.cities[fromIndex] = null;
}

function isFrozen(cardId) {
    // Expand this if your freeze rules differ
    const data =
        henchmen.find(h => h.id === cardId) ||
        villains.find(v => v.id === cardId);

    return data?.isFrozen === true;
}

function resolveExitForVillain(entry) {
    // Your existing shoveUpper exit logic applies:
    // KO villains, handle bystanders, takeover rules, etc.
    console.warn("Villain exited via Charge push:", entry);
}