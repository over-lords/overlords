/*
MASTER TURN ORDER PSEUDO-CODE

VILLAIN DRAW
    If draw = might
        apply overlord might
        apply tactic might
    else if draw = scenario
        set atop Overlord
            add HP buffer
            suppress overlord might and other rules
            add new rule(s)
    else if draw = countdown
        shove prior countdown, if any
        destroy landing city
            villain? ko villain
            hero? deal 10 damage to hero and knock to headquarters
    else if draw = bystander
        if hench/villain on map
            rightmost hench/villain captures
        else if scenario active
            scenario captures bystander
        else
            overlord KOs bystander immediately
    else if draw = henchman || villain
        if draw has teleport
            place all unoccupied cities within an array
                choose one randomly and rather than pushing upper row, just place the teleporting villain into the city rolled
            if no unoccupied cities
                do not draw
        else if draw has charge
            is city 1 frozen?
                enter city 1, attempt charge
                    will charge encounter a frozen foe
                        yes, charge max allowed
                        no? then charge to completion
        else if draw has glide
            does city 1 have a glider inside
                yes
                    is glider frozen?
                        yes
                            do not draw, just reveal top card
                        no
                            push glider to city 2 - new draw enters city 1
                no, enter city 1
        else
            is city 1 occupied?
                is city 1 frozen?
                    yes, do not draw, but reveal the top card for everyone to see
                    no, draw and enter city 1

        if draw shoves a hench or villain off-board
            has bystanders?
                KO them
            has takeover?
                yes
                    takeover level equal or higher than overlord level && takeover villain has equal or higher HP than the current Overlord
                        KO current Overlord, they've been usurped
                        take Overlord remaining HP for self
                        Become new Overlord
                    else
                        failed takeover, increase Overlord HP by remaining HP like they didn't even have takeover
                no
                    increase Overlord HP by remaining HP


HERO STARTING TRAVEL - AFTER VILLAIN DRAW
    if multiplayer
        start Hero turn timer (3 minutes)

    if (hero not in city)
        Where are they traveling - Display banner (use might banner) asking "Where are you traveling?"
            -1 travel when they travel
                Travel resets at the start of their turns
                Travel is an aspect of each faceCard heroes item
                Minus from currentTravel and reset at start of their next turn
                When they hit 0, only allow retreat to HQ and no other travel
    else if hero in a city
        skip to next phase (hero draw)

HERO DRAW
    if deck = 2 or less cards
        shuffle discard pile and place beneath existing deck
            Reveal top 3 cards from your hero's deck, select 1, other 2 are returned and shuffled back into deck

    MODIFY IF HERO WOULD CHECK 4 OR 5 or whatever...


HERO TURN
    use 'standard speed' cards if against a foe

    at headquarters
        cards remaining - yes
            all cities with foes glowing, and the overlord
                unoccupied yellow
                    travel to X
                occupied red
                    travel to X and shove Y out of the city?
        cards remaining - no
            End Turn

    in a city
        cards remaining - yes
            all cities with foes glowing, and the overlord
                unoccupied yellow
                    travel to X
                occupied red
                    travel to X and shove Y out of the city?
                        entering hero takes foe damage immediately
                        shoved hero returns to headquarters and takes no damage
        cards remaining - no
            change highlights on screen to 'Retreat' or 'End Turn'

    travel remaining?
        1+ cards in hand?
            travel button goes live
            if in a city with a foe
                roll to retreat when traveling
                    pass retreat
                        take no damage
                            travel to desired city
                    fail retreat
                        take villain damage, if equal or higher than DT
                            travel to desired city
            else
                travel to desired city

    retreat
        pass
            take no damage
                return to watchtower
        fail
            take villain damage, if equal or higher than DT
                return to watchtower

    would draw but deck empty
        if you've drawn 5+ cards this turn
            declare 'draws exhausted'
            do no draw any cards
        else
            shuffle discard pile and replace deck
                draw

END HERO TURN
    deck empty?
        shuffle discard pile into deck
    else
        do nothing

    in a city with a foe
        take foe damage

    discard remaining cards in hand

*/

const isSinglePlayer = (window.GAME_MODE === "single");
const isMultiplayer = (window.GAME_MODE === "multi");

import { heroes } from '../data/faceCards.js';
import { heroCards } from '../data/heroCards.js';

import { henchmen } from '../data/henchmen.js';
import { villains } from '../data/villains.js';
import { overlords } from '../data/overlords.js';

import { tactics } from '../data/tactics.js';
import { scenarios } from '../data/scenarios.js';

import { renderCard, findCardInAllSources } from './cardRenderer.js';
import { placeCardIntoCitySlot, buildOverlordPanel, buildVillainPanel, buildHeroPanel, 
         buildMainCardPanel, playMightSwipeAnimation, showMightBanner, setCurrentOverlord, 
         renderHeroHandBar, applyHeroKOMarkers, clearHeroKOMarkers } from './pageSetup.js';
import { currentTurn, executeEffectSafely, handleVillainEscape, resolveExitForVillain } from './abilityExecutor.js';
import { gameState } from '../data/gameState.js';
import { loadGameState, saveGameState, clearGameState } from "./stateManager.js";

import {    CITY_EXIT_UPPER,
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
            CITY_ENTRY_GLIDE } from '../data/gameState.js';

let heroTurnIndex = 0;

const COUNTDOWN_IDS = new Set(["8001", "8002", "8003", "8004", "8005", "8006"]);

function isCountdownId(id) {
    return COUNTDOWN_IDS.has(String(id));
}

function isScenarioActive(state) {
    const stack = state.scenarioStack;
    if (!Array.isArray(stack)) return false;
    return stack.length > 0;
}

async function executeMightEffectSafe(effectString) {
    try {
        const { executeEffectSafely } = await import("./abilityExecutor.js");

        if (typeof executeEffectSafely !== "function") {
            console.warn("[MIGHT] executeEffectSafely missing in abilityExecutor.");
            return;
        }

        console.log("[MIGHT] Executing effect:", effectString);
        await executeEffectSafely(effectString, { source: "might" });
    } catch (err) {
        console.warn("[MIGHT] Could not execute effect:", effectString, err);
    }
}

function markCityDestroyed(upperIdx, gameState) {
    if (!gameState.destroyedCities) {
        gameState.destroyedCities = {};
    }
    if (gameState.destroyedCities[upperIdx]) {
        // already marked destroyed
        return;
    }
    gameState.destroyedCities[upperIdx] = true;

    const citySlots = document.querySelectorAll(".city-slot");
    const upperSlot = citySlots[upperIdx];
    const lowerSlot = citySlots[upperIdx + 1];

    [upperSlot, lowerSlot].forEach(slot => {
        if (!slot) return;

        // Kill any existing background art
        const area = slot.querySelector(".city-card-area");
        if (area) {
            area.style.backgroundColor = "black";
            area.style.backgroundImage = "none";
        }

        // Add a big red X overlay
        if (getComputedStyle(slot).position === "static") {
            slot.style.position = "relative";
        }

        let overlay = slot.querySelector(".destroyed-city-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "destroyed-city-overlay";
            overlay.style.position = "absolute";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.right = "0";
            overlay.style.bottom = "0";
            overlay.style.pointerEvents = "none";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.fontSize = "64px";
            overlay.style.fontWeight = "bold";
            overlay.style.color = "red";
            overlay.style.textShadow = "0 0 8px black";
            overlay.textContent = "X";
            slot.appendChild(overlay);
        }
    });
}

function applyCountdownLandingEffects(upperIdx, gameState) {
    const citySlots = document.querySelectorAll(".city-slot");
    const upperSlot = citySlots[upperIdx];
    const lowerIdx  = upperIdx + 1;
    const lowerSlot = citySlots[lowerIdx];

    // 1) KO henchmen/villains in the upper city
    const upperEntry = Array.isArray(gameState.cities) ? gameState.cities[upperIdx] : null;

    if (upperEntry && upperEntry.id) {
        const idStr = String(upperEntry.id);
        const isHench = henchmen.some(h => String(h.id) === idStr);
        const isVill  = villains.some(v => String(v.id) === idStr);

        if (isHench || isVill) {
            if (!Array.isArray(gameState.koVillainsAndHenchmen)) {
                gameState.koVillainsAndHenchmen = [];
            }

            gameState.koVillainsAndHenchmen.push({
                id: idStr,
                uniqueId: upperEntry.uniqueId ?? null,
                slotIndex: upperIdx,
                reason: "countdown"
            });

            console.log(`[COUNTDOWN] KO'ing ${isHench ? "Henchman" : "Villain"} ID ${idStr} at upper slot ${upperIdx}.`);
        }

        // Clear the DOM for the upper city
        if (upperSlot) {
            const area = upperSlot.querySelector(".city-card-area");
            if (area) {
                area.innerHTML = "";
            }
        }

        if (Array.isArray(gameState.cities)) {
            gameState.cities[upperIdx] = null;
        }
    }

    // 2) Damage hero in the lower city and send them to HQ
    const heroIds = gameState.heroes || [];
    let heroWasHit = false;

    heroIds.forEach(hid => {
        const hState = gameState.heroData?.[hid];
        if (!hState) return;

        if (hState.cityIndex === lowerIdx) {
            // Deal 10 damage
            if (typeof hState.hp === "number") {
                hState.hp -= 10;
                if (hState.hp < 0) hState.hp = 0;
            }

            // Move hero back to HQ (cityIndex = null)
            hState.cityIndex = null;
            heroWasHit = true;

            if (heroWasHit && hState) {
                const heroObj = heroes.find(h => String(h.id) === String(heroId));
                const dmg = 10;

                hState.hp -= dmg;
                if (hState.hp < 0) hState.hp = 0;

                updateHeroHPDisplays(heroId);
                updateBoardHeroHP(heroId);

                console.log(
                    `[COUNTDOWN] ${heroObj?.name || 'Hero'} takes ${dmg} damage `
                    + `from countdown in city ${heroIndexLower}. New HP=${hState.hp}`
                );

                if (heroWasHit && hState && hState.hp <= 0) {
                    // Countdown killed the hero → full KO behavior (hand dump, overlay, etc.)
                    handleHeroKnockout(heroId, hState, gameState, { source: "countdown" });
                }
            }
        }
    });

    // Clear hero DOM from lower city if someone was there
    if (heroWasHit && lowerSlot) {
        const area = lowerSlot.querySelector(".city-card-area");
        if (area) {
            area.innerHTML = "";
        }
    }

    // 3) Mark the city as destroyed (upper + lower)
    markCityDestroyed(upperIdx, gameState);
}

/**
 * Move a single countdown card one step LEFT along UPPER_ORDER,
 * applying landing effects at the destination.
 */
function advanceSingleCountdown(upperIdx, gameState) {
    const pos = UPPER_ORDER.indexOf(upperIdx);
    if (pos <= 0) {
        // Already at EXIT; for now, nothing beyond this (game loss logic later)
        console.log("[COUNTDOWN] Countdown reached the leftmost city; additional loss logic can plug in here.");
        return;
    }

    const destIdx = UPPER_ORDER[pos - 1];

    // Landing effects at destination city
    applyCountdownLandingEffects(destIdx, gameState);

    // Move the countdown card DOM + model
    const citySlots = document.querySelectorAll(".city-slot");
    const fromSlot  = citySlots[upperIdx];
    const toSlot    = citySlots[destIdx];

    if (!fromSlot || !toSlot) return;

    const fromArea = fromSlot.querySelector(".city-card-area");
    const toArea   = toSlot.querySelector(".city-card-area");
    if (!fromArea || !toArea) return;

    const node = fromArea.querySelector(".card-wrapper");
    if (!node) return;

    node.classList.remove("city-card-enter");
    node.classList.remove("city-card-slide-left");
    node.classList.add("city-card-slide-left");

    toArea.innerHTML = "";
    toArea.appendChild(node);
    fromArea.innerHTML = "";

    setTimeout(() => {
        node.classList.remove("city-card-slide-left");
    }, 650);

    if (!Array.isArray(gameState.cities)) {
        gameState.cities = new Array(12).fill(null);
    }

    const entry = gameState.cities[upperIdx];
    gameState.cities[destIdx] = entry || null;
    if (gameState.cities[destIdx]) {
        gameState.cities[destIdx].slotIndex = destIdx;
    }
    gameState.cities[upperIdx] = null;
}

function shovePriorCountdownIfAny(gameState) {
    if (!Array.isArray(gameState.cities)) return;

    // We expect at most one, but search in UPPER_ORDER, rightmost-first
    let existingUpperIdx = null;
    for (let i = 0; i < UPPER_ORDER.length; i++) {
        const idx   = UPPER_ORDER[i];
        const entry = gameState.cities[idx];
        if (entry && isCountdownId(entry.id)) {
            existingUpperIdx = idx;
            break;
        }
    }

    if (existingUpperIdx === null) return;

    console.log("[COUNTDOWN] Shoving prior countdown from", existingUpperIdx);
    advanceSingleCountdown(existingUpperIdx, gameState);
}

/**
 * Full handler when a COUNTDOWN card is drawn from the villain deck.
 * - Shove prior countdown (if any),
 * - Destroy the landing city at CITY_ENTRY_UPPER,
 *   KO'ing henchmen/villains and hitting any hero for 10 + HQ,
 * - Then place the new countdown card into CITY_ENTRY_UPPER.
 */
function handleCountdownDraw(villainId, gameState) {
    // 1) Shove prior countdown, if any
    shovePriorCountdownIfAny(gameState);

    // 2) Destroy the landing city where this countdown will enter
    const entryUpperIdx = CITY_ENTRY_UPPER;
    applyCountdownLandingEffects(entryUpperIdx, gameState);

    // 3) Place this countdown card into the entry city's upper slot
    placeCardInUpperCity(entryUpperIdx, villainId, gameState, "countdown");

    // NOTE: placeVillainInUpperCity will tag this as type "countdown" (see below type tweak)
}

export function gameStart(selectedData) {

    const vdeck = selectedData.villainDeck || {};

    // Build a FLAT array of villain deck IDs
    const idArray = [];

    // Mights (repeat id "MIGHT" X times or use actual id if you store one)
    for (let i = 0; i < (vdeck.mights || 0); i++) {
        idArray.push("7001");
    }

    // Bystanders
    if (Array.isArray(vdeck.bystanders?.byType)) {
        vdeck.bystanders.byType.forEach(bt => {
            for (let i = 0; i < (bt.count || 0); i++) {
                idArray.push(String(bt.id));
            }
        });
    }

    // Scenarios
    if (Array.isArray(vdeck.scenarios)) {
        vdeck.scenarios.forEach(id => idArray.push(String(id)));
    }

    // Henchmen
    if (Array.isArray(vdeck.henchmen)) {
        vdeck.henchmen.forEach(entry => {
            for (let i = 0; i < (entry.count || 0); i++) {
                idArray.push(String(entry.id));
            }
        });
    }

    // Villains
    if (Array.isArray(vdeck.villains)) {
        vdeck.villains.forEach(id => idArray.push(String(id)));
    }

    // === SHUFFLE ===
    for (let i = idArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idArray[i], idArray[j]] = [idArray[j], idArray[i]];
    }

    const countdown = ["8006", "8005", "8004", "8003", "8002", "8001"];
    idArray.push(...countdown);

    //console.log("=== SHUFFLED VILLAIN DECK IDS ===");
    //console.log(idArray);

    // === PRINT NAMES ===
    const names = idArray.map(id => {
        const c = findCardInAllSources(id);
        return c ? c.name : `Unknown (${id})`;
    });

    //console.log("=== SHUFFLED VILLAIN DECK NAMES ===");
    //console.log(names);

    gameState.heroData = gameState.heroData || {};

    console.log("=== HERO DECKS (in turn order) ===");

    if (Array.isArray(selectedData.heroes)) {
        selectedData.heroes.forEach(heroId => {
            const heroObj = heroes.find(h => String(h.id) === String(heroId));
            if (!heroObj) return;

            const deck = buildHeroDeck(heroObj.name);

            // store in backend
            gameState.heroData[heroId] = gameState.heroData[heroId] || {};
            gameState.heroData[heroId].deck = deck;

            // print
            console.log(`Deck for ${heroObj.name}:`, deck);
        });
    }

    return {
        villainDeck: idArray,
        initialCities: []  // placeholder until you track cities
    };
}

const UPPER_ORDER = [
    CITY_EXIT_UPPER,   // leftmost Star
    CITY_5_UPPER,
    CITY_4_UPPER,
    CITY_3_UPPER,
    CITY_2_UPPER,
    CITY_ENTRY_UPPER   // rightmost Gotham
];

const GLIDE_ORDER = [
  CITY_EXIT_GLIDE,
  CITY_5_GLIDE,
  CITY_4_GLIDE,
  CITY_3_GLIDE,
  CITY_2_GLIDE,
  CITY_ENTRY_GLIDE
];

// --- VILLAIN DECK HELPERS & CENTRAL VILLAIN DRAW --------------------------

/**
 * Draw and advance the villain deck pointer (internal).
 * Returns the id at the current pointer, or null if deck exhausted.
 */
function drawNextVillainId(state = gameState) {
    const deck = state.villainDeck;
    let ptr = state.villainDeckPointer ?? 0;

    if (!Array.isArray(deck) || deck.length === 0) return null;
    if (ptr >= deck.length) return null;

    const id = deck[ptr];
    state.villainDeckPointer = ptr + 1;

    return id;
}

function classifyVillainCard(villainId, cardData) {
    if (isCountdownId(villainId)) return "countdown";

    if (cardData?.type === "Might" || String(villainId) === "7001") {
        return "might";
    }

    if (cardData?.type === "Scenario") return "scenario";
    if (cardData?.type === "Bystander") return "bystander";

    const idStr = String(villainId);
    const isHench = henchmen.some(h => String(h.id) === idStr);
    const isVill  = villains.some(v => String(v.id) === idStr);

    if (isHench || isVill) return "enemy";

    return "unknown";
}

function cardHasTeleport(cardData) {
    if (!cardData) return false;

    // Keywords
    if (Array.isArray(cardData.keywords) && cardData.keywords.includes("Teleport")) {
        return true;
    }

    // AbilitiesEffects (onEntry teleport)
    if (Array.isArray(cardData.abilitiesEffects)) {
        return cardData.abilitiesEffects.some(e => {
            if (!e) return false;
            if (e.condition && e.condition !== "onEntry") return false;

            const eff = e.effect;
            if (!eff) return false;

            if (typeof eff === "string") {
                const s = eff.trim();
                return s === "teleport" || s === "teleport()";
            }

            if (Array.isArray(eff)) {
                return eff.some(x => {
                    if (typeof x !== "string") return false;
                    const s = x.trim();
                    return s === "teleport" || s === "teleport()";
                });
            }

            return false;
        });
    }

    return false;
}

function cardChargeDistance(cardData) {
    if (!cardData) return 0;

    // Keyword / data-level hint
    if (cardData.keywords?.includes("Charge") && cardData.chargeDistance) {
        const dist = Number(cardData.chargeDistance);
        if (!Number.isNaN(dist) && dist > 0) return dist;
    }

    // AbilitiesEffects (charge(N))
    if (Array.isArray(cardData.abilitiesEffects)) {
        for (const e of cardData.abilitiesEffects) {
            const eff = e?.effect;
            if (!eff) continue;

            if (typeof eff === "string" && eff.startsWith("charge(")) {
                const m = eff.match(/\((\d+)\)/);
                if (m) return Number(m[1] || 0) || 0;
            }

            if (Array.isArray(eff)) {
                const found = eff.find(x => typeof x === "string" && x.startsWith("charge("));
                if (found) {
                    const m = found.match(/\((\d+)\)/);
                    if (m) return Number(m[1] || 0) || 0;
                }
            }
        }
    }

    return 0;
}

/**
 * Centralized Might handling (Overlord Might + Tactics Might).
 * Does NOT start hero turn or increment turnCounter.
 */
async function handleMightDraw(villainId, cardData, state) {
    console.log("[MIGHT] Drawn Might of the Overlord — skip city placement.");

    // 1. Swipe animation
    await playMightSwipeAnimation();

    // 2. Main title banner
    await showMightBanner("Might of the Overlord!", 2000);

    const scenarioCurrentlyActive = isScenarioActive(state);

    // Overlord Might (suppressed if Scenario is active)
    if (String(villainId) === "7001") {
        const overlordObj = (function () {
            const ovId = state.overlords?.[0];
            return (
                overlords.find(o => String(o.id) === String(ovId)) ||
                villains.find(v => String(v.id) === String(ovId))
            );
        })();

        if (overlordObj) {
            if (!scenarioCurrentlyActive) {
                if (Array.isArray(overlordObj.mightNamePrint)) {
                    for (const line of overlordObj.mightNamePrint) {
                        await showMightBanner(line.text, 2000);
                    }
                }

                if (Array.isArray(overlordObj.mightEffects)) {
                    for (const eff of overlordObj.mightEffects) {
                        const effString = eff.effect;
                        if (typeof effString === "string") {
                            await executeMightEffectSafe(effString);
                        } else if (Array.isArray(effString)) {
                            for (const sub of effString) {
                                await executeMightEffectSafe(sub);
                            }
                        }
                    }
                }
            } else {
                console.log("[MIGHT] Overlord Might suppressed because a Scenario is active.");
            }
        }
    }

    // Tactic Might (never masked by Scenario)
    if (Array.isArray(state.tactics) && state.tactics.length > 0) {
        const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
        const currentTacticsArr = (state.tactics || [])
            .map(id => tacticMap.get(String(id)))
            .filter(Boolean);

        for (const t of currentTacticsArr) {
            if (Array.isArray(t.mightNamePrint)) {
                for (const line of t.mightNamePrint) {
                    await showMightBanner(line.text, 2000);
                }
            }

            if (Array.isArray(t.mightEffects)) {
                for (const eff of t.mightEffects) {
                    const effString = eff.effect;
                    if (typeof effString === "string") {
                        await executeMightEffectSafe(effString);
                    } else if (Array.isArray(effString)) {
                        for (const sub of effString) {
                            await executeMightEffectSafe(sub);
                        }
                    }
                }
            }
        }
    }
}

/**
 * Centralized Scenario handling.
 * Sets it atop Overlord, applies HP buffer & passive rules.
 * Does NOT start hero turn or increment turnCounter.
 */
async function handleScenarioDraw(villainId, cardData, state) {
    console.log("[SCENARIO] Drawn Scenario card:", villainId, cardData?.name);

    if (!Array.isArray(state.scenarioStack)) {
        state.scenarioStack = [];
    }
    if (!state.scenarioHP) {
        state.scenarioHP = {};
    }

    const scenarioId = String(cardData.id);
    const baseHP = Number(cardData.hp) || 0;

    if (typeof state.scenarioHP[scenarioId] !== "number") {
        state.scenarioHP[scenarioId] = baseHP;
    }
    cardData.currentHP = state.scenarioHP[scenarioId];

    if (!state.scenarioStack.includes(scenarioId)) {
        state.scenarioStack.push(scenarioId);
    }
    state.activeScenarioId = scenarioId;

    // Scenario overtakes Overlord UI
    setCurrentOverlord(cardData);
    //buildOverlordPanel(cardData);

    await showMightBanner("Scenario Drawn!", 2000);
    await showMightBanner(cardData.name, 2000);
    if (Array.isArray(cardData.abilitiesNamePrint)) {
        for (const line of cardData.abilitiesNamePrint) {
            await showMightBanner(line.text, 2000);
        }
    }

    if (Array.isArray(cardData.abilitiesEffects)) {
        for (const eff of cardData.abilitiesEffects) {
            if (!eff) continue;
            if (eff.type === "passive" && eff.effect && eff.condition === "none") {
                try {
                    await executeEffectSafely(eff.effect, cardData, { source: "scenario" });
                } catch (err) {
                    console.warn("[SCENARIO] Passive effect failed:", err);
                }
            }
        }
    }
}

/**
 * Internal helper to place a card in an upper city slot (no shove).
 * Used by teleport and countdown entry.
 */
function placeCardInUpperCity(slotIndex, newCardId, state, explicitType) {
    const citySlots = document.querySelectorAll(".city-slot");

    if (!Array.isArray(state.cities)) {
        state.cities = new Array(12).fill(null);
    }

    const slot = citySlots[slotIndex];
    if (!slot) {
        console.warn("[placeCardInUpperCity] No DOM slot at index", slotIndex);
        return;
    }

    const area = slot.querySelector(".city-card-area");
    if (!area) {
        console.warn("[placeCardInUpperCity] No .city-card-area at index", slotIndex);
        return;
    }

    area.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";

    const rendered = renderCard(newCardId, wrapper);
    wrapper.appendChild(rendered);

    area.appendChild(wrapper);

    const cardData =
        henchmen.find(h => h.id === newCardId) ||
        villains.find(v => v.id === newCardId);

    if (cardData) {
        wrapper.style.cursor = "pointer";
        wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("Villain/Henchmen card clicked (from upper-city placement):", {
                newCardId,
                cardName: cardData.name
            });
            buildVillainPanel(cardData);
        });
    } else {
        console.warn("No cardData found for newCardId (upper-city placement):", newCardId);
    }

    const entryType = explicitType || (isCountdownId(newCardId) ? "countdown" : "villain");
    state.cities[slotIndex] = {
        slotIndex,
        type: entryType,
        id: String(newCardId)
    };

    const baseHP = Number((cardData && cardData.hp) || 1);

    if (!state.villainHP) state.villainHP = {};
    const savedHP = state.villainHP[String(newCardId)];

    let currentHP;
    if (typeof savedHP === "number") {
        currentHP = savedHP;
    } else {
        currentHP = baseHP;
    }

    state.cities[slotIndex].maxHP = baseHP;
    state.cities[slotIndex].currentHP = currentHP;

    state.villainHP[String(newCardId)] = currentHP;

    // Keep the master card object in sync for panels / re-renders
    if (cardData) {
        cardData.currentHP = currentHP;
    }

    saveGameState(state);

    setTimeout(() => {
        wrapper.classList.remove("city-card-enter");
    }, 650);
}

/**
 * Shared henchman / villain entry logic.
 * Handles Teleport, Charge, and normal shove.
 * `fromDeck: true` means it may revert the pointer & reveal top card for Teleport.
 */
async function handleEnemyEntry(villainId, cardData, state, { fromDeck = false } = {}) {
    const hasTeleport = cardHasTeleport(cardData);
    const chargeDist = cardChargeDistance(cardData);

    if (hasTeleport) {
        const openSlots = UPPER_ORDER.filter(idx => !state.cities?.[idx]);

        if (openSlots.length === 0) {
            console.warn(
                `[TELEPORT BLOCKED] Cannot place '${cardData?.name}' (ID ${villainId}) — all upper cities occupied.`
            );

            if (fromDeck) {
                const ptr = state.villainDeckPointer ?? 0;
                if (ptr > 0) {
                    state.villainDeckPointer = ptr - 1;
                }
                state.revealedTopVillain = true;
                try {
                    await showMightBanner("Top Card Revealed", 2000);
                } catch (err) {
                    console.warn("[BANNER] Failed to show Top Card Revealed banner:", err);
                }
            }
            return;
        }

        const randomIndex = Math.floor(Math.random() * openSlots.length);
        const targetIdx = openSlots[randomIndex];

        state.revealedTopVillain = false;
        placeCardInUpperCity(targetIdx, villainId, state, "villain");
        return;
    }

    if (chargeDist > 0) {
        await executeEffectSafely(`charge(${chargeDist})`, cardData, {});
        return;
    }

    // NORMAL ENTRY: shove into city 1 using existing shoveUpper logic
    await shoveUpper(villainId);
}

/**
 * PUBLIC: Central villain-deck draw.
 * Draws `count` cards and routes each to the appropriate handler:
 *   Countdown / Might / Scenario / Bystander / Henchman+Villain.
 *
 * Does NOT increment turnCounter or start hero turn; caller does that.
 */
export async function villainDraw(count = 1) {
    const draws = Number(count) || 0;
    if (draws <= 0) return;

    if (!Array.isArray(gameState.villainDeck) || gameState.villainDeck.length === 0) {
        console.log("[VILLAIN DRAW] No villain deck present.");
        return;
    }

    for (let i = 0; i < draws; i++) {
        const villainId = drawNextVillainId(gameState);
        if (!villainId) {
            console.log("[VILLAIN DRAW] Deck exhausted; stopping draws.");
            break;
        }

        const data = findCardInAllSources(villainId);
        const kind = classifyVillainCard(villainId, data);

        switch (kind) {
            case "countdown":
                console.log("[VILLAIN DRAW] Countdown card:", villainId);
                handleCountdownDraw(villainId, gameState);
                break;
            case "might":
                console.log("[VILLAIN DRAW] Might card:", villainId);
                await handleMightDraw(villainId, data, gameState);
                break;
            case "scenario":
                console.log("[VILLAIN DRAW] Scenario card:", villainId);
                await handleScenarioDraw(villainId, data, gameState);
                break;
            case "bystander":
                console.log("[VILLAIN DRAW] Bystander card:", villainId);
                await handleBystanderDraw(villainId, data, gameState);
                break;
            case "enemy":
                console.log("[VILLAIN DRAW] Hench/Villain card:", villainId, data?.name);
                await handleEnemyEntry(villainId, data, gameState, { fromDeck: true });
                break;
            default:
                console.warn("[VILLAIN DRAW] Unknown villain deck card type:", villainId, data);
                break;
        }
    }

    gameState.isGameStarted = true;
}

/**
 * PUBLIC: Scan forward in the villain deck and return the next `count`
 * henchman/villain ids, advancing the pointer past everything scanned.
 * Used by rally effects.
 */
export function takeNextHenchVillainsFromDeck(count) {
    const deck = gameState.villainDeck;
    if (!Array.isArray(deck) || deck.length === 0) return [];

    let ptr = gameState.villainDeckPointer ?? 0;
    const collected = [];
    const target = Number(count) || 0;
    if (target <= 0) return [];

    while (ptr < deck.length && collected.length < target) {
        const id = deck[ptr];

        const idStr = String(id);
        const isHench = henchmen.some(h => String(h.id) === idStr);
        const isVill  = villains.some(v => String(v.id) === idStr);

        if (isHench || isVill) {
            collected.push(id);
        }

        ptr++;
    }

    gameState.villainDeckPointer = ptr;
    return collected;
}

/**
 * PUBLIC: Play a henchman/villain card (by id) onto the map from an effect,
 * reusing the same Teleport / Charge / normal entry logic, but without
 * touching the villain deck pointer.
 */
export async function enterVillainFromEffect(id) {
    const data = findCardInAllSources(id);
    if (!data) return;

    await handleEnemyEntry(id, data, gameState, { fromDeck: false });
}

// --- BYSTANDER HELPERS -----------------------------------------------------

function ensureKoCards(state) {
    if (!Array.isArray(state.koCards)) {
        state.koCards = [];
    }
}

function getRightmostCapturingEnemyIndex(state) {
    if (!Array.isArray(state.cities)) return null;

    let chosen = null;

    // iterate from RIGHT to LEFT (highest index → lowest index)
    for (let i = state.cities.length - 1; i >= 0; i--) {
        const entry = state.cities[i];
        if (!entry || !entry.id) continue;

        const idStr = String(entry.id);

        const isHench = henchmen.some(h => String(h.id) === idStr);
        const isVill  = villains.some(v => String(v.id) === idStr);

        if (!isHench && !isVill) continue;

        chosen = i;
        break;   // first match from the right
    }

    return chosen;
}

/**
 * Handle a BYSTANDER draw from the villain deck.
 * - If any hench/villain on map → rightmost captures.
 * - Else if scenario active      → scenario captures.
 * - Else                         → Overlord immediately KOs the bystander.
 *
 * This does NOT place anything into the upper row and does NOT shove.
 */
async function handleBystanderDraw(bystanderId, cardData, state) {
    // Ensure we have card data
    if (!cardData) {
        cardData = findCardInAllSources(bystanderId);
    }

    const byName = cardData?.name || "Bystander";

    // 1) If any hench/villain is on the map, the rightmost captures
    const enemyIdx = getRightmostCapturingEnemyIndex(state);

    if (enemyIdx !== null) {
        if (!Array.isArray(state.cities)) {
            state.cities = new Array(12).fill(null);
        }

        const entry = state.cities[enemyIdx];
        if (!entry) {
            console.warn("[BYSTANDER] Expected foe at", enemyIdx, "but none found.");
        } else {
            // Attach to city entry
            if (!Array.isArray(entry.capturedBystanders)) {
                entry.capturedBystanders = [];
            }
            entry.capturedBystanders.push({
                id: String(bystanderId),
                name: byName
            });

            // Also attach to the static card data for villain-panel display
            const foeId = String(entry.id);
            const foeCard =
                henchmen.find(h => String(h.id) === foeId) ||
                villains.find(v => String(v.id) === foeId);

            if (foeCard) {
                if (!Array.isArray(foeCard.capturedBystanders)) {
                    foeCard.capturedBystanders = [];
                }
                foeCard.capturedBystanders.push({
                    id: String(bystanderId),
                    name: byName
                });
            }

            try {
                await showMightBanner("Bystander Captured!", 2000);
            } catch (err) {
                console.warn("[BYSTANDER] Failed to show capture banner:", err);
            }

            console.log(
                `[BYSTANDER] ${byName} captured by foe in city index ${enemyIdx}.`,
                { entry, foeCard }
            );
        }

        // Draw is consumed, nothing goes to the board, no shove.
        return;
    }

    // 2) No hench/villain but a Scenario is active → Scenario captures
    if (isScenarioActive(state)) {
        const scenarioId = String(state.activeScenarioId || "");
        if (!scenarioId) {
            console.warn("[BYSTANDER] Scenario flagged active but no activeScenarioId in state.");
        }

        if (!state.scenarioCapturedBystanders) {
            state.scenarioCapturedBystanders = {};
        }
        if (!Array.isArray(state.scenarioCapturedBystanders[scenarioId])) {
            state.scenarioCapturedBystanders[scenarioId] = [];
        }

        state.scenarioCapturedBystanders[scenarioId].push({
            id: String(bystanderId),
            name: byName
        });

        console.log(
            `[BYSTANDER] ${byName} captured by active Scenario ${scenarioId}.`,
            state.scenarioCapturedBystanders[scenarioId]
        );

        return;
    }

    // 3) No foes and no Scenario → Overlord immediately KOs the bystander
    ensureKoCards(state);

    state.koCards.push({
        id: String(bystanderId),
        name: byName,
        type: "Bystander",
        source: "villainDeck"
    });

    // Count total KO'd bystanders for messaging
    const totalKOd = state.koCards.filter(c => c.type === "Bystander").length;
    const text = totalKOd === 1 ? "1 Bystander KO'd" : `${totalKOd} Bystanders KO'd`;

    // Use the existing Might banner for the announcement
    try {
        await showMightBanner(text, 2000);
    } catch (err) {
        console.warn("[BYSTANDER] Failed to show KO banner:", err);
    }

    console.log(
        `[BYSTANDER] ${byName} KO'd by Overlord. Total KO'd bystanders: ${totalKOd}.`
    );
}

export async function startHeroTurn(state, opts = {}) {
    const { skipVillainDraw = false } = opts;

    const heroIds = state.heroes || [];
    if (!heroIds.length) {
        return;
    }

    // 1) VILLAIN DRAW for this "turn slot"
    if (!skipVillainDraw) {
        await villainDraw(1);
    }

    // Ensure we have a valid index
    if (typeof state.heroTurnIndex !== "number") {
        state.heroTurnIndex = 0;
    }
    heroTurnIndex = state.heroTurnIndex;

    const heroCount = heroIds.length;
    let attempts = 0;

    // 2) Find the next hero who can actually act.
    //    - Permanently KO heroes (hp <= 0) are skipped.
    //    - If a hero was KO'd but now has hp >= 1, clear their KO markers.
    while (attempts < heroCount) {
        const heroId = heroIds[heroTurnIndex];
        const heroState = state.heroData?.[heroId];

        if (!heroState) {
            heroTurnIndex = (heroTurnIndex + 1) % heroCount;
            attempts++;
            continue;
        }

        // Resurrection check: if HP has been raised to 1+, clear KO visuals.
        if (heroState.hp > 0 && heroState.isKO) {
            heroState.isKO = false;
            try {
                clearHeroKOMarkers(heroId);
            } catch (err) {
                console.warn("[startHeroTurn] Failed to clear KO markers for hero", heroId, err);
            }
        }

        // Still at 0 HP? This hero is KO'd → skip this turn slot.
        if (!heroState.hp || heroState.hp <= 0) {
            handleHeroKnockout(heroId, heroState, state, { fromTurnStart: true });

            // Move to next hero; do NOT trigger another villain draw.
            heroTurnIndex = (heroTurnIndex + 1) % heroCount;
            state.heroTurnIndex = heroTurnIndex;
            attempts++;
            continue;
        }

        // Found a live hero who can act.
        break;
    }

    // Everyone KO'd: no hero turn can be started.
    if (attempts >= heroCount) {
        console.warn("[startHeroTurn] All heroes are currently KO'd. No hero turn started.");
        saveGameState(state);
        return;
    }

    // Persist the (possibly advanced) index
    state.heroTurnIndex = heroTurnIndex;

    // 3) Normal hero turn setup for the chosen hero
    if (typeof state.turnCounter !== "number") state.turnCounter = 0;
    state.turnCounter++;

    currentTurn(heroTurnIndex, heroIds);

    resetHeroCurrentTravelAtTurnStart(state);
    showRetreatButtonForCurrentHero(state);
    resetTurnTimerForHero();

    saveGameState(state);
    initializeTurnUI(state);
    renderHeroHandBar(state);

    await startTravelPrompt(state);

    const activeHeroId = heroIds[heroTurnIndex];
    const activeHeroState = state.heroData?.[activeHeroId];

    if (activeHeroState && typeof activeHeroState.cityIndex === "number") {
        if (!activeHeroState.hasDrawnThisTurn) {
            showHeroTopPreview(activeHeroId, state);
            activeHeroState.hasDrawnThisTurn = true;
            saveGameState(state);
        }
    }
}

export async function shoveUpper(newCardId) {
    const citySlots = document.querySelectorAll(".city-slot");
    const EXIT_IDX = CITY_EXIT_UPPER;

    // Ensure cities array exists and has room
    if (!Array.isArray(gameState.cities)) {
        gameState.cities = new Array(12).fill(null);
    }

    // UPPER_ORDER is [EXIT, 5, 4, 3, 2, ENTRY]
    const ENTRY_IDX = CITY_ENTRY_UPPER;

    // Build a snapshot of current upper-row state (DOM + model)
    const snapshot = {};
    UPPER_ORDER.forEach(idx => {
        const slot = citySlots[idx];
        const area = slot ? slot.querySelector(".city-card-area") : null;
        const cardNode = area ? area.querySelector(".card-wrapper") : null;
        snapshot[idx] = {
            slot,
            area,
            cardNode,
            model: gameState.cities[idx] || null
        };
    });

    // Helper: given an upper index, get the "next left" city (towards EXIT),
    // or null if we are already at EXIT.
    function getNextLeft(idx) {
        const pos = UPPER_ORDER.indexOf(idx);
        if (pos <= 0) return null; // EXIT has no left neighbor
        return UPPER_ORDER[pos - 1];
    }

    // moveMap: fromUpperIdx -> destUpperIdx (or null for off-board)
    const moveMap = {};

    // Recursive shove, based entirely on the snapshot:
    // - We only push something if it was there at the start of the shove.
    // - Chain stops at the first empty city.
    function shoveFrom(idx) {
        const snap = snapshot[idx];
        if (!snap || !snap.cardNode) return false;

        const nextIdx = getNextLeft(idx);

        // If there is nowhere further left than this city in the track,
        // there is no shove to apply for THIS idx.
        // (We should *never* be called with idx === EXIT_IDX now.)
        if (nextIdx === null) {
            return false;
        }

        const nextSnap = snapshot[nextIdx];

        // SPECIAL: If nextIdx is the EXIT, we DO NOT recursively shove the EXIT city.
        // We only target EXIT as the *destination* for this card.
        if (nextIdx === EXIT_IDX) {
            // Move this card into EXIT.
            moveMap[idx] = EXIT_IDX;
            return true;
        }

        // For all other intermediate cities:
        // If there was a card at nextIdx in the snapshot, shove that one first.
        if (nextSnap && nextSnap.cardNode) {
            shoveFrom(nextIdx);
        }

        // Now move this card into nextIdx.
        moveMap[idx] = nextIdx;
        return true;
    }

    // --------------------------------------------------------
    // STEP 1 — Decide whether a shove chain happens this draw.
    // --------------------------------------------------------

    const entrySnap = snapshot[ENTRY_IDX];
    const entryHadCard = !!entrySnap.cardNode;

    if (entryHadCard) {
        // Deck is pushing into 10, so the card in 10 must be shoved.
        // That shove may propagate, but only through cities that had
        // cards in the snapshot; it stops at the first empty city.
        shoveFrom(ENTRY_IDX);
    }

    if (entryHadCard) {
        shoveFrom(ENTRY_IDX);

        // If the row was completely full, the shove will push something into EXIT.
        // In that case, the *original* card at EXIT escapes off-board.
        const exitSnap = snapshot[EXIT_IDX];
        const exitWasOccupied = !!(exitSnap && exitSnap.cardNode);

        const someoneMovedIntoExit = Object.values(moveMap).some(
            dest => dest === EXIT_IDX
        );

        if (exitWasOccupied && someoneMovedIntoExit) {
            moveMap[EXIT_IDX] = null;   // mark original EXIT card as escaping off-board
        }
    }

    // --------------------------------------------------------
    // STEP 2 — Apply all recorded villain moves (DOM + model)
    // --------------------------------------------------------

    // We process in UPPER_ORDER order so EXIT gets cleared first if needed.
    const lowerMap = {
        10: 8,
        8: 6,
        6: 4,
        4: 2,
        2: 0
    };

    for (const fromIdx of UPPER_ORDER) {
        if (!Object.prototype.hasOwnProperty.call(moveMap, fromIdx)) continue;

        const toIdx = moveMap[fromIdx]; // may be null (off-board)
        const snap = snapshot[fromIdx];
        const cardNode = snap.cardNode;
        if (!cardNode) continue;

        // Remove entry animation and add slide-left animation
        cardNode.classList.remove("city-card-enter");
        cardNode.classList.add("city-card-slide-left");

        if (toIdx === null) {
            // This entry is being pushed completely off-board.
            // If it's a henchman or villain, run full escape logic
            // (bystanders, takeover, Overlord HP gain with cap).
            const entry = Array.isArray(gameState.cities)
                ? gameState.cities[fromIdx]
                : null;

            if (entry) {
                const idStr = String(entry.id || "");

                const isHench = henchmen.some(h => String(h.id) === idStr);
                const isVill  = villains.some(v => String(v.id) === idStr);

                if (isHench || isVill) {
                    // Full escape consequences: KO bystanders, takeover, HP gain (2× cap)
                    await handleVillainEscape(entry, gameState);

                    // Handles hero return + DOM cleanup for an exiting villain.
                    resolveExitForVillain(entry);

                    // Do NOT run the generic DOM wipe below; resolveExitForVillain
                    // already coordinates DOM/model cleanup with a delay.
                    continue;
                }
            }

            // Fallback for non-villain entries (if ever used):
            if (snap.area) {
                snap.area.innerHTML = "";
            }
            if (Array.isArray(gameState.cities)) {
                gameState.cities[fromIdx] = null;
            }

            continue;
        } else {
            const toSlot = citySlots[toIdx];
            const toArea = toSlot ? toSlot.querySelector(".city-card-area") : null;
            if (!toArea || !snap.area) continue;

            // Move DOM
            snap.area.innerHTML = "";
            toArea.innerHTML = "";
            toArea.appendChild(cardNode);

            // Move model
            gameState.cities[toIdx] = gameState.cities[fromIdx] || null;
            if (gameState.cities[toIdx]) {
                gameState.cities[toIdx].slotIndex = toIdx;
            }
            gameState.cities[fromIdx] = null;

            // Move heroes underneath, if any, matching old behavior
            if (lowerMap.hasOwnProperty(fromIdx)) {
                const fromLower = fromIdx + 1;
                const toLower = toIdx + 1;

                const heroIds = gameState.heroes || [];
                heroIds.forEach(hid => {
                    const hState = gameState.heroData?.[hid];
                    if (!hState) return;

                    if (hState.cityIndex === fromLower) {
                        // Update model
                        hState.cityIndex = toLower;

                        const fromSlotLower = citySlots[fromLower];
                        const toSlotLower = citySlots[toLower];
                        if (!fromSlotLower || !toSlotLower) return;

                        const heroNode = fromSlotLower.querySelector(".card-wrapper");
                        if (!heroNode) return;

                        heroNode.classList.remove("city-card-enter");
                        heroNode.classList.remove("city-card-slide-left");
                        heroNode.classList.add("hero-card-slide-left");

                        setTimeout(() => {
                            const fromAreaLower = fromSlotLower.querySelector(".city-card-area");
                            const toAreaLower = toSlotLower.querySelector(".city-card-area");
                            if (fromAreaLower && toAreaLower) {
                                fromAreaLower.innerHTML = "";
                                toAreaLower.innerHTML = "";
                                toAreaLower.appendChild(heroNode);
                            }
                            heroNode.classList.remove("hero-card-slide-left");
                        }, 650);
                    }
                });
            }
        }

        // Let animation start before moving to the next one
        await new Promise(r => setTimeout(r, 20));
        setTimeout(() => cardNode.classList.remove("city-card-slide-left"), 650);
    }

    // --------------------------------------------------------
    // STEP 3 — Insert the new villain into city 10
    // --------------------------------------------------------

    const entrySlotFinal = citySlots[ENTRY_IDX];
    const entryAreaFinal = entrySlotFinal
        ? entrySlotFinal.querySelector(".city-card-area")
        : null;

    if (entryAreaFinal) {
        entryAreaFinal.innerHTML = "";
    }

    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";

    const rendered = renderCard(newCardId, wrapper);
    wrapper.appendChild(rendered);

    if (entryAreaFinal) {
        entryAreaFinal.appendChild(wrapper);
    }

    const cardData =
        henchmen.find(h => h.id === newCardId) ||
        villains.find(v => v.id === newCardId);

    if (cardData) {
        wrapper.style.cursor = "pointer";
        wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("Villain/Henchmen card clicked (from shoveUpper):", {
                newCardId,
                cardName: cardData.name
            });
            buildVillainPanel(cardData);
        });
    } else {
        console.warn("No cardData found for newCardId:", newCardId);
    }

    const entryType = isCountdownId(newCardId) ? "countdown" : "villain";
    gameState.cities[ENTRY_IDX] = {
        slotIndex: ENTRY_IDX,
        type: entryType,
        id: String(newCardId)
    };

    saveGameState(gameState);

    setTimeout(() => {
        wrapper.classList.remove("city-card-enter");
    }, 650);
}

export function initializeTurnUI(gameState) {
    const endTurnBtn = document.getElementById("end-turn-button");
    if (!endTurnBtn) return;

    const topVillainBtn = document.getElementById("top-villain-button");
    if (topVillainBtn) {
        topVillainBtn.style.display = gameState.revealedTopVillain ? "flex" : "none";
    }

    // 1. Who has the indicator?
    const indicator = document.querySelector(".turn-indicator-circle");
    if (!indicator) {
        endTurnBtn.style.display = "none";
        return;
    }

    // 2. Find its index in the heroes-row
    const slots = [...document.querySelectorAll("#heroes-row .hero-slot")];
    const slotIndex = slots.findIndex(slot => slot.contains(indicator));
    if (slotIndex === -1) {
        endTurnBtn.style.display = "none";
        return;
    }

    // 3. That slotIndex is the active hero index
    const heroIds = gameState.heroes || [];
    const activeHeroId = heroIds[slotIndex];
    if (!activeHeroId) {
        endTurnBtn.style.display = "none";
        return;
    }

    const heroState = gameState.heroData?.[activeHeroId];
    if (!heroState) {
        endTurnBtn.style.display = "none";
        return;
    }

    // -----------------------------
    // Restore / recompute Engage Overlord UI
    // -----------------------------
    const faceOverlordButton = document.getElementById("face-overlord-button");
    if (faceOverlordButton) {
        // Start from hidden/disabled each time we recompute UI
        let engageBtn = faceOverlordButton;
        engageBtn.style.display = "none";
        engageBtn.disabled = true;

        const currentTravel =
            (typeof heroState.currentTravel === "number")
                ? heroState.currentTravel
                : (typeof heroState.travel === "number" ? heroState.travel : 0);

        const canFaceOverlord =
            !heroState.isFacingOverlord &&
            currentTravel >= 1;

        if (canFaceOverlord) {
            // Replace the button node to clear old listeners
            const newBtn = engageBtn.cloneNode(true);
            engageBtn.parentNode.replaceChild(newBtn, engageBtn);
            engageBtn = newBtn;

            engageBtn.style.display = "inline-block";
            engageBtn.disabled = false;

            engageBtn.addEventListener("click", () => {
                showFaceOverlordPopup(gameState, activeHeroId);
            });
        }
    }

    // Rebuild hero hand + travel UI for the active hero
    renderHeroHandBar(gameState);
    setupStartingTravelOptions(gameState, activeHeroId);

    // 4. You are single-player → ALWAYS show the end-turn button
    endTurnBtn.style.display = "block";
}

export function buildHeroDeck(heroName) {
    const cardsForHero = heroCards.filter(c => c.hero === heroName);
    const deck = [];

    cardsForHero.forEach(card => {
        const qty = Number(card.perDeck || 0);
        for (let i = 0; i < qty; i++) deck.push(card.id);
    });

    // Always ensure total is exactly 20
    if (deck.length !== 20) {
        console.warn(`Deck for ${heroName} has ${deck.length} cards, expected 20.`);
    }

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

export function endCurrentHeroTurn(gameState) {

    if (turnTimerInterval) clearInterval(turnTimerInterval);
    const heroIds = gameState.heroes || [];
    const currentIdx = gameState.heroTurnIndex ?? 0;
    const heroId = heroIds[currentIdx];
    if (!heroId) return;

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.error("No heroState for heroId", heroId, gameState.heroData);
        return;
    }

    if (!heroState.deck || heroState.deck.length === 0) {
        if (heroState.discard && heroState.discard.length > 0) {
            heroState.deck = shuffle([...heroState.discard]);
            heroState.discard = [];
        }
    }

    if (typeof heroState.cityIndex === "number") {

        // Heroes are in LOWER slots; villains are in the UPPER slot above
        const heroIdx = heroState.cityIndex;
        const foeIdx = heroIdx - 1;

        const slotEntry = gameState.cities?.[foeIdx];

        if (slotEntry && slotEntry.id) {
            const foeId = String(slotEntry.id);

            // Look this foe up in your data
            const foe =
                henchmen.find(h => String(h.id) === foeId) ||
                villains.find(v => String(v.id) === foeId);

            if (foe) {
                const foeDamage = Number(foe.damage || 0);

                // HERO DAMAGE THRESHOLD
                const heroObj = heroes.find(h => String(h.id) === String(heroId));
                const dt = Number(heroObj?.damageThreshold || 0);

                // Only deal damage if foeDamage >= DT
                if (foeDamage >= dt) {
                    heroState.hp -= foeDamage;
                    flashScreenRed();

                    if (heroState.hp <= 0) {
                        heroState.hp = 0;
                        updateHeroHPDisplays(heroId);
                        updateBoardHeroHP(heroId);

                        console.log(
                            `[END TURN] ${heroObj?.name} takes ${foeDamage} damage from ${foe.name} in city ${heroState.cityIndex}.`
                            + ` (DT=${dt}) → KO!`
                        );

                        handleHeroKnockout(heroId, heroState, gameState, { source: "endTurnDamage" });
                    } else {
                        updateHeroHPDisplays(heroId);
                        updateBoardHeroHP(heroId);

                        console.log(
                            `[END TURN] ${heroObj?.name} takes ${foeDamage} damage from ${foe.name} in city ${heroState.cityIndex}.`
                            + ` (DT=${dt})`
                        );
                    }
                } else {
                    console.log(
                        `[END TURN] ${heroObj?.name} ignores ${foe.name}'s damage `
                        + `(foeDamage=${foeDamage} < DT=${dt}).`
                    );
                }
            }
        }
    }

    heroState.hasDrawnThisTurn = false;
    if (Array.isArray(heroState.hand) && heroState.hand.length > 0) {
        heroState.discard = heroState.discard || [];
        heroState.discard.push(...heroState.hand);
        heroState.hand = [];
    }

    heroState.discard = heroState.discard || [];
    console.log(
    `[END TURN] ${heroes.find(h => String(h.id)===String(heroId))?.name}'s discard pile:`,
    heroState.discard
    );

    // -------------------------------------------
    // STEP 4 — Advance to next hero
    // -------------------------------------------
    const heroCount = heroIds.length || 1;
    const nextIdx = (currentIdx + 1) % heroCount;

    gameState.heroTurnIndex = nextIdx;
    heroTurnIndex = nextIdx; // maintain your existing variable

    saveGameState(gameState);

    // -------------------------------------------
    // STEP 5 — Start next hero turn
    // -------------------------------------------
    startHeroTurn(gameState);

    // -------------------------------------------
    // STEP 6 — Reinitialize End-Turn button
    // -------------------------------------------
    initializeTurnUI(gameState);
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function setupStartingTravelOptions(gameState, heroId) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    // Start from a clean outline state; centralized refresher will redraw as needed.
    refreshAllCityOutlines(gameState, { clearOnly: true });

    if (heroState.cityIndex != null) {
        console.log(
            `[TRAVEL] ${heroName} currently in city ${heroState.cityIndex}. `
            + `Binding travel UI from existing state.`
        );
    }

    // NOTE: Facing overlord is "not in a city" but still allowed to travel.
    // We only log here; do NOT suppress highlights.
    if (heroState.isFacingOverlord) {
        console.log(
            `[TRAVEL] ${heroName} is facing the Overlord and can still ` +
            `spend travel to move to a city.`
        );
    }

    // ---------------------
    // Step 1: compute legal targets (pure helper – no DOM styling)
    // ---------------------
    const initialTargets = computeHeroTravelLegalTargets(gameState, heroId);

    // ---------------------
    // Step 2: set click handlers ONCE right now
    // ---------------------
    initialTargets.forEach(target => {
        const lowerSlot = target.lowerSlot;
        if (!lowerSlot) return;

        if (lowerSlot.dataset.travelHandlerAttached === "true") {
            return;
        }
        lowerSlot.dataset.travelHandlerAttached = "true";

        lowerSlot.addEventListener("click", () => {
            // Always consult the latest state for safety
            const latestHeroState = gameState.heroData?.[heroId];

            if (!latestHeroState || latestHeroState.currentTravel <= 0) {
                hideTravelHighlights();
                // Also clear outlines immediately via the central helper
                refreshAllCityOutlines(gameState, { clearOnly: true });
                return;
            }

            showTravelPopup(gameState, heroId, target.lowerIndex);
        });
    });

    // ---------------------
    // Step 3: initial visual draw (outlines)
    // ---------------------
    refreshAllCityOutlines(gameState);
}

window.recalculateHeroTravel = function () {
    try {
        initializeTurnUI(gameState);
        showRetreatButtonForCurrentHero(gameState);

        const destinations = recomputeCurrentHeroTravelDestinations(gameState);
        console.log("[recalculateHeroTravel] destinations:", destinations);
    } catch (err) {
        console.warn("[recalculateHeroTravel] failed to recompute travel UI:", err);
    }
};

function clearCityHighlights() {
    refreshAllCityOutlines(gameState, { clearOnly: true });
    hideFaceOverlordButton();
}

function hideTravelHighlights() {
    const slots = document.querySelectorAll(".city-slot.travel-highlight");
    slots.forEach(s => s.classList.remove("travel-highlight"));
}

function performHeroStartingTravel(gameState, heroId, cityIndex) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    if (heroState.currentTravel <= 0) {
        console.log(`[TRAVEL] ${heroName} has no travel left. Travel blocked.`);
        hideTravelHighlights();
        clearCityHighlights();
        return;
    }

    // --- Spend 1 from currentTravel (per-turn mutable budget) ---
    let beforeTravel =
        (typeof heroState.currentTravel === "number")
            ? heroState.currentTravel
            : (typeof heroState.travel === "number" ? heroState.travel : 0);

    if (beforeTravel > 0) {
        heroState.currentTravel = beforeTravel - 1;
    } else {
        // No travel left; we still allow this to go through for now but log that it hit zero
        heroState.currentTravel = beforeTravel;
    }

    const afterTravel = heroState.currentTravel;

    console.log(
        `[TRAVEL] ${heroName} traveling to city ${cityIndex}. `
        + `currentTravel before=${beforeTravel}, after=${afterTravel}.`
    );

    // Remember where they were before this travel (if anywhere)
    const previousIndex = heroState.cityIndex ?? null;

    // Record hero location in the model
    heroState.cityIndex = cityIndex;

    // === CLEAN UP ANY EXISTING COPIES OF THIS HERO ON THE BOARD ===
    const citySlots = document.querySelectorAll(".city-slot");

    // 1) Clear the old city slot (if they were in one)
    if (previousIndex !== null && citySlots[previousIndex]) {
        const prevArea = citySlots[previousIndex].querySelector(".city-card-area");
        if (prevArea) {
            prevArea.innerHTML = "";
        }
    }

    // 2) Brute-force remove any wrapper in any city whose card id matches this hero
    const allWrappers = document.querySelectorAll(".city-slot .card-wrapper");

    allWrappers.forEach(wrapper => {
        // try on the wrapper first
        const wrapperId =
            wrapper.getAttribute("data-card-id") ||
            wrapper.dataset.cardId ||
            wrapper.getAttribute("data-id") ||
            wrapper.dataset.id;

        // then look inside for a .card element in case renderCard attached it there
        const innerCard = wrapper.querySelector(".card");
        const innerId = innerCard
            ? (
                innerCard.getAttribute("data-card-id") ||
                innerCard.dataset.cardId ||
                innerCard.getAttribute("data-id") ||
                innerCard.dataset.id
              )
            : null;

        const foundId = wrapperId || innerId;

        if (foundId === String(heroId)) {
            wrapper.remove();
        }
    });

    // === RENDER HERO FACE CARD INTO THE NEW CITY ===
    const slot = citySlots[cityIndex];
    if (!slot) return;

    const area = slot.querySelector(".city-card-area");
    if (!area) return;

    // Remove anything already inside this destination (just in case)
    area.innerHTML = "";

    // Build wrapper for hero card
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");
    wrapper.style.cursor = "pointer";

    // Render hero
    const rendered = renderCard(heroId, wrapper);
    wrapper.appendChild(rendered);

    // Optionally set the id on the wrapper, so future cleanup is trivial
    wrapper.setAttribute("data-card-id", String(heroId));

    // Insert into DOM
    area.appendChild(wrapper);

    // Optional: hero click = open hero panel (matches villain behavior)
    const heroData = heroes.find(h => h.id === heroId);
    if (heroData) {
        wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            buildHeroPanel(heroData);
        });
    }

    showRetreatButtonForCurrentHero(gameState);

    if (!heroState.hasDrawnThisTurn) {
        showHeroTopPreview(heroId, gameState);
        heroState.hasDrawnThisTurn = true;
    }
    renderHeroHandBar(gameState);

    // After spending travel and moving, recompute destinations for the CURRENT hero.
    // If they are out of travel, this returns null and clears highlights.
    const remainingDestinations = recomputeCurrentHeroTravelDestinations(gameState);
    console.log(
        "[performHeroStartingTravel] remaining destinations after move:",
        remainingDestinations
    );

    // Persist travel + location changes
    saveGameState(gameState);
}

let turnTimerInterval = null;

function resetTurnTimerForHero() {
    const timerBox = document.getElementById("bottom-turn-timer");
    if (!timerBox) return;

    if (isSinglePlayer) {
        timerBox.style.display = "none";
        if (turnTimerInterval) clearInterval(turnTimerInterval);
        return;
    }
    else if (isMultiplayer) {
        timerBox.style.display = "block";

        let remaining = 180; // 3 minutes in seconds
        timerBox.textContent = formatTimer(remaining);

        if (turnTimerInterval) clearInterval(turnTimerInterval);

        turnTimerInterval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(turnTimerInterval);
                timerBox.textContent = "00:00";
                autoEndTurnDueToTimeout();
                return;
            }
            timerBox.textContent = formatTimer(remaining);
        }, 1000);
    }
}

function formatTimer(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function autoEndTurnDueToTimeout() {
    const gs = window.gameState;
    endCurrentHeroTurn(gs);
}

function showTravelPopup(gameState, heroId, cityIndex) {
    const overlay = document.getElementById("travel-popup-overlay");
    const text = document.getElementById("travel-popup-text");
    const yesBtn = document.getElementById("travel-popup-yes");
    const noBtn = document.getElementById("travel-popup-no");

    const cityName = getCityNameFromIndex(cityIndex);

    text.textContent = `Travel to ${cityName}?`;

    overlay.style.display = "flex";

    // Replace old YES listener
    const newYes = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYes, yesBtn);

    newYes.addEventListener("click", () => {
        overlay.style.display = "none";
        performHeroStartingTravel(gameState, heroId, cityIndex);
    });

    // Replace old NO listener
    const newNo = noBtn.cloneNode(true);
    noBtn.parentNode.replaceChild(newNo, noBtn);

    // Simply close the popup — cancel travel
    newNo.addEventListener("click", () => {
        overlay.style.display = "none";

        // Do NOT travel — do NOT clear highlights
        // Player may click another city or proceed normally
    });
}

function showFaceOverlordPopup(gameState, heroId) {
    const overlay = document.getElementById("face-overlord-popup-overlay");
    if (!overlay) {
        console.warn("[OVERLORD] face-overlord-popup-overlay not found; falling back to direct travel.");
        performHeroTravelToOverlord(gameState, heroId);
        return;
    }

    overlay.style.display = "flex";

    const yesBtn = overlay.querySelector(".face-overlord-popup-yes");
    const noBtn  = overlay.querySelector(".face-overlord-popup-no");

    if (yesBtn) {
        const newYes = yesBtn.cloneNode(true);
        yesBtn.parentNode.replaceChild(newYes, yesBtn);

        newYes.addEventListener("click", () => {
            performHeroTravelToOverlord(gameState, heroId);
            overlay.style.display = "none";
        });
    }

    if (noBtn) {
        const newNo = noBtn.cloneNode(true);
        noBtn.parentNode.replaceChild(newNo, noBtn);

        newNo.addEventListener("click", () => {
            overlay.style.display = "none";
        });
    }
}

function getCityNameFromIndex(idx) {
    switch (idx) {
        case 1: return "Star City";
        case 3: return "Coast City";
        case 5: return "Keystone City";
        case 7: return "Central City";
        case 9: return "Metropolis";
        case 11: return "Gotham City";
        default: return "Unknown City";
    }
}

function updateHeroHPDisplays(heroId) {
    const hState = gameState.heroData?.[heroId];
    if (!hState) return;

    // Ensure HP isn't negative
    const hp = Math.max(0, hState.hp);

    /**********************************************
     * 1. UPDATE HEROES ROW ("heroes-row")
     **********************************************/
    const heroIds = gameState.heroes || [];
    const rowIndex = heroIds.indexOf(heroId);

    if (rowIndex !== -1) {
        const row = document.getElementById("heroes-row");
        const slots = row?.querySelectorAll(".hero-slot") || [];
        const slot = slots[rowIndex];
        const hpText = slot?.querySelector(".hero-hp-text");
        if (hpText) hpText.textContent = hp;
    }

    /**********************************************
     * 2. UPDATE HERO PANEL (if open)
     **********************************************/
    const heroPanel = document.getElementById("hero-panel-content");
    if (heroPanel && heroPanel.dataset?.heroId === String(heroId)) {
        const panelHP = heroPanel.querySelector(".hero-panel-hp-value");
        if (panelHP) panelHP.textContent = hp;
    }

    /**********************************************
     * 3. UPDATE HERO CARD ON BOARD (if in city)
     **********************************************/
    if (typeof hState.cityIndex === "number") {
        const citySlots = document.querySelectorAll(".city-slot");
        const slot = citySlots[hState.cityIndex];
        if (slot) {
            const wrapper = slot.querySelector(".card-wrapper");
            if (wrapper) {
                const hpBadge = wrapper.querySelector(".hero-card-hp");
                if (hpBadge) hpBadge.textContent = hp;
            }
        }
    }

    /**********************************************
     * 4. SAVE STATE
     **********************************************/
    saveGameState(gameState);
}

export function updateBoardHeroHP(heroId) {
    const hp = gameState.heroData?.[heroId]?.hp;
    if (hp == null) return;

    // Update every HP node on board with matching heroId
    document.querySelectorAll(`.hero-board-hp[data-hero-id="${heroId}"]`)
        .forEach(el => {
            const num = el.querySelector("div") || el; // depending on structure
            num.textContent = hp;
        });
}

export function flashScreenRed() {
    const flash = document.getElementById("damage-flash");
    if (!flash) return;

    flash.style.opacity = "1";

    setTimeout(() => {
        flash.style.opacity = "0";
    }, 120); // quick pulse
}

export function getCurrentOverlordInfo(state) {
    if (!Array.isArray(state.overlords) || state.overlords.length === 0) {
        return null;
    }

    const ovId = String(state.overlords[0]);

    // Overlord may be an Overlord card *or* a Villain (after takeover)
    let card =
        overlords.find(o => String(o.id) === ovId) ||
        villains.find(v => String(v.id) === ovId);

    if (!card) return null;

    const baseHP = Number(card.hp || 0);
    if (!state.overlordHP) {
        state.overlordHP = {};
    }

    let currentHP = state.overlordHP[ovId];
    if (typeof currentHP !== "number") {
        currentHP = baseHP;
        state.overlordHP[ovId] = currentHP;
    }

    // Cap is always double the base HP of whoever is currently the Overlord
    const cap = baseHP * 2;

    // Keep the runtime card object in sync
    card.currentHP = currentHP;

    return {
        id: ovId,
        card,
        baseHP,
        currentHP,
        cap
    };
}

export async function startTravelPrompt(gameState) {
    const heroIds = gameState.heroes || [];
    const activeIdx = gameState.heroTurnIndex ?? 0;
    const heroId = heroIds[activeIdx];

    if (!heroId) {
        console.warn("[TRAVEL] startTravelPrompt: no active hero id.");
        return;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.warn("[TRAVEL] startTravelPrompt: no heroState for heroId", heroId);
        return;
    }

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    // If the hero is already in a city, skip this starting travel prompt
    if (heroState.cityIndex !== null && heroState.cityIndex !== undefined) {
        console.log(
            `[TRAVEL] ${heroName} already in city ${heroState.cityIndex}. `
            + `Skipping 'Where are you traveling?' banner.`
        );
        return;
    }

    // Pull currentTravel from gameState (mutable per turn), with fallback to travel
    const currentTravel =
        (typeof heroState.currentTravel === "number")
            ? heroState.currentTravel
            : (typeof heroState.travel === "number" ? heroState.travel : 0);

    if (currentTravel <= 0) {
        console.log(
            `[TRAVEL] ${heroName} has no currentTravel remaining (=${currentTravel}). `
            + `Cannot travel from HQ this turn.`
        );
        return;
    }

    // Show a "Where are you traveling?" banner
    showMightBanner("Travel Where?");

    console.log(
        `[TRAVEL] Prompting ${heroName} to choose a travel destination. `
        + `currentTravel=${currentTravel}.`
    );

    // No await here: actual travel happens when a city is clicked,
    // via setupStartingTravelOptions → showTravelPopup → performHeroStartingTravel.
}

function resetHeroCurrentTravelAtTurnStart(gameState) {
    const heroIds = gameState.heroes || [];
    const activeHeroId = heroIds[gameState.heroTurnIndex];
    if (activeHeroId == null) return;

    gameState.heroData = gameState.heroData || {};
    const heroState = gameState.heroData[activeHeroId] || (gameState.heroData[activeHeroId] = {});

    // travel originates from faceCard (heroes)
    const heroObj = heroes.find(h => String(h.id) === String(activeHeroId));
    const faceTravel = Number(heroObj?.travel || 0);

    // fallback: use heroState.travel only if the game mutates it somewhere
    const baseTravel = (typeof heroState.travel === "number")
        ? heroState.travel
        : faceTravel;

    heroState.currentTravel = baseTravel;
    heroState.isFacingOverlord = false;

    heroState.hasDrawnThisTurn = false;
    const heroName = heroObj?.name || `Hero ${activeHeroId}`;

    console.log(
        `[TRAVEL] Start of turn for ${heroName}. `
        + `baseTravel=${baseTravel}, currentTravel reset to ${heroState.currentTravel}.`
    );
}

export function showRetreatButtonForCurrentHero(gameState) {
    const btn = document.getElementById("retreat-button");
    if (!btn) {
        console.warn("[RETREAT] retreat-button element not found in DOM.");
        return;
    }

    const heroIds = gameState.heroes || [];
    const activeHeroId = heroIds[gameState.heroTurnIndex];
    if (activeHeroId == null) {
        console.log("[RETREAT] No active hero id (cannot evaluate retreat button).");
        btn.style.display = "none";
        return;
    }

    const heroState = gameState.heroData?.[activeHeroId];
    if (!heroState) {
        console.log("[RETREAT] No heroState for active hero (cannot evaluate retreat button).");
        btn.style.display = "none";
        return;
    }

    const heroObj = heroes.find(h => String(h.id) === String(activeHeroId));
    const heroName = heroObj?.name || `Hero ${activeHeroId}`;

    // CASE 1: Facing Overlord → retreat is allowed
    if (heroState.isFacingOverlord) {
        btn.style.display = "block";
        btn.onclick = () => {
            openRetreatConfirm(gameState, activeHeroId);
        };
        console.log(`[RETREAT] ${heroName} is facing the Overlord. Retreat option shown.`);
        return;
    }

    // CASE 2: At HQ (not in city, not facing Overlord) → hide retreat
    if (heroState.cityIndex === null || heroState.cityIndex === undefined) {
        btn.style.display = "none";
        console.log(`[RETREAT] ${heroName} is at HQ. Retreat option hidden.`);
        return;
    }

    // CASE 3: In a city → retreat shown
    btn.style.display = "block";
    btn.onclick = () => {
        openRetreatConfirm(gameState, activeHeroId);
    };

    console.log(`[RETREAT] ${heroName} is in city ${heroState.cityIndex}. Retreat option shown.`);
}

function retreatHeroToHQ(gameState, heroId) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    const currentIdx = heroState.cityIndex;

    // ------------------------------------------------------
    // RETREAT ROLL — ONLY when:
    //   - hero is NOT facing the Overlord
    //   - hero is in a city (lower row)
    //   - there is a Henchman/Villain in the upper slot above them
    // ------------------------------------------------------
    if (!heroState.isFacingOverlord && typeof currentIdx === "number") {

        const heroIdx = currentIdx;       // lower slot index
        const foeIdx  = heroIdx - 1;      // upper slot above hero
        const slotEntry = gameState.cities?.[foeIdx];

        if (slotEntry && slotEntry.id) {
            const foeId = String(slotEntry.id);

            // Look up the foe in Henchmen/Villains data
            const foe =
                henchmen.find(h => String(h.id) === foeId) ||
                villains.find(v => String(v.id) === foeId);

            if (foe) {
                const retreatTarget = Number(heroObj?.retreat || 0);
                const roll = Math.floor(Math.random() * 6) + 1; // 1–6

                console.log(
                    `[RETREAT] ${heroName} attempts to retreat from ${foe.name} `
                    + `in city ${heroIdx}. Roll=${roll}, needs >= ${retreatTarget}.`
                );

                // Only do anything special on a FAILED roll
                if (roll < retreatTarget) {
                    const foeDamage = Number(foe.damage || 0);
                    const dt = Number(heroObj?.damageThreshold || 0);

                    // Match end-of-turn damage behavior: only if foeDamage >= DT
                    if (foeDamage >= dt) {
                        heroState.hp -= foeDamage;
                        flashScreenRed();

                        if (heroState.hp <= 0) {
                            heroState.hp = 0;
                            updateHeroHPDisplays(heroId);
                            updateBoardHeroHP(heroId);

                            console.log(
                                `[RETREAT] ${heroName} FAILS retreat roll `
                                + `and takes ${foeDamage} damage from ${foe.name}. `
                                + `(DT=${dt}, new HP=${heroState.hp}) → KO!`
                            );

                            handleHeroKnockout(heroId, heroState, gameState, { source: "retreatFail" });
                        } else {
                            updateHeroHPDisplays(heroId);
                            updateBoardHeroHP(heroId);

                            console.log(
                                `[RETREAT] ${heroName} FAILS retreat roll `
                                + `and takes ${foeDamage} damage from ${foe.name}. `
                                + `(DT=${dt}, new HP=${heroState.hp})`
                            );
                        }
                    } else {
                        console.log(
                            `[RETREAT] ${heroName} FAILS retreat roll but ignores `
                            + `${foe.name}'s damage (foeDamage=${foeDamage} < DT=${dt}).`
                        );
                    }
                } else {
                    console.log(
                        `[RETREAT] ${heroName} SUCCEEDS retreat roll `
                        + `and takes no damage from ${foe.name}.`
                    );
                }
            }
        }
    }

    // ------------------------------------------------------
    // Move hero to HQ (null) and clear overlord state
    // (Overlord retreat behavior remains unchanged; we just
    //  did extra work above for city + hench/villain case.)
    // ------------------------------------------------------
    heroState.cityIndex = null;
    heroState.isFacingOverlord = false;

    // Remove hero DOM from the previous city slot if any
    if (typeof currentIdx === "number") {
        const citySlots = document.querySelectorAll(".city-slot");
        const slot = citySlots[currentIdx];
        if (slot) {
            const area = slot.querySelector(".city-card-area");
            if (area) {
                area.innerHTML = "";
            }
        }
    }

    console.log(`[RETREAT] ${heroName} retreats to HQ.`);

    saveGameState(gameState);

    // Optional: recompute UI after retreat
    if (typeof window.recalculateHeroTravel === "function") {
        window.recalculateHeroTravel();
    }
}

function openRetreatConfirm(gameState, heroId) {
    const overlay = document.getElementById("retreat-popup-overlay");
    if (!overlay) return;

    overlay.style.display = "flex";

    const yesBtn = document.getElementById("retreat-popup-yes");
    const noBtn  = document.getElementById("retreat-popup-no");

    // remove old listeners if any
    yesBtn.onclick = null;
    noBtn.onclick  = null;

    yesBtn.onclick = () => {
        retreatHeroToHQ(gameState, heroId);

        // hide retreat button as the hero has left the city
        const retreatBtn = document.getElementById("retreat-button");
        if (retreatBtn) retreatBtn.style.display = "none";

        overlay.style.display = "none";
    };

    noBtn.onclick = () => {
        overlay.style.display = "none";
    };
}

function performHeroTravelToOverlord(gameState, heroId) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return;

    const heroObj  = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    // Already facing the overlord, nothing to do
    if (heroState.isFacingOverlord) {
        console.log(`[OVERLORD] ${heroName} is already facing the Overlord.`);
        return;
    }

    // Compute current travel
    const currentTravel = typeof heroState.currentTravel === "number"
        ? heroState.currentTravel
        : (typeof heroState.travel === "number" ? heroState.travel : 0);

    if (currentTravel <= 0) {
        console.log(`[OVERLORD] ${heroName} has no travel remaining and cannot face the Overlord.`);
        hideTravelHighlights();
        clearCityHighlights();
        return;
    }

    // If they are currently in a city, remove them from that city (DOM + model)
    const prevCityIndex = heroState.cityIndex;
    if (typeof prevCityIndex === "number") {
        const citySlots = document.querySelectorAll(".city-slot");
        const slot      = citySlots[prevCityIndex];

        if (slot) {
            const area = slot.querySelector(".city-card-area");
            if (area) {
                area.innerHTML = "";   // remove hero card DOM
            }
        }

        heroState.cityIndex = null;     // hero leaves the city
        console.log(
            `[OVERLORD] ${heroName} leaves city index ${prevCityIndex} and travels to face the Overlord.`
        );
    }

    // Spend 1 travel
    const newTravel = currentTravel - 1;
    heroState.currentTravel = newTravel;

    console.log(
        `[OVERLORD] ${heroName} spends 1 travel to face the Overlord. `
        + `currentTravel ${currentTravel} → ${newTravel}.`,
        { heroId, heroState }
    );

    // Mark them as facing the overlord
    heroState.isFacingOverlord = true;

    // Clean up travel UI
    hideTravelHighlights();
    clearCityHighlights();

    // Rebuild turn UI and travel UI as usual
    if (typeof window.recalculateHeroTravel === "function") {
        try {
            window.recalculateHeroTravel(gameState);
        } catch (e) {
            console.warn("[OVERLORD] recalculateHeroTravel threw:", e);
        }
    }

    // Explicitly recompute travel destinations for the CURRENT turn hero.
    // Since we just spent 1 travel to face the Overlord, this will either:
    //   - return null and clear highlights if travel is now 0, OR
    //   - keep the travel highlights in sync if there's still travel.
    const remainingDestinations = recomputeCurrentHeroTravelDestinations(gameState);
    console.log(
        "[performHeroTravelToOverlord] remaining destinations after move:",
        remainingDestinations
    );

    if (!heroState.hasDrawnThisTurn) {
        showHeroTopPreview(heroId, gameState);
        heroState.hasDrawnThisTurn = true;
    }
    renderHeroHandBar(gameState);
    saveGameState(gameState);
}

export function showHeroTopPreview(heroId, state, count = 3) {
    try {
        const inner    = document.getElementById("hero-deck-preview-inner");
        const bar      = document.getElementById("hero-deck-preview-bar");
        const backdrop = document.getElementById("hero-deck-preview-backdrop");

        if (!inner) {
            console.warn("[HERO PREVIEW] #hero-deck-preview-inner not found in DOM.");
            return;
        }

        // Clear any previous hero’s preview UI
        inner.innerHTML = "";

        // Default: clear any previously remembered preview
        if (state) {
            state.heroDeckPreview = null;
        }

        if (!state || !state.heroData) {
            if (bar)      bar.style.display = "none";
            if (backdrop) backdrop.style.display = "none";
            return;
        }

        const heroState = state.heroData[heroId];
        if (!heroState || !Array.isArray(heroState.deck) || heroState.deck.length === 0) {
            console.log("[HERO PREVIEW] No deck found for hero id", heroId);
            if (bar)      bar.style.display = "none";
            if (backdrop) backdrop.style.display = "none";
            return;
        }

        const heroObj    = heroes.find(h => String(h.id) === String(heroId));
        const heroName   = heroObj?.name  || `Hero ${heroId}`;
        const glowColor  = heroObj?.color || "#ffffff";

        const safeCount  = Number.isFinite(Number(count)) ? Number(count) : 3;
        const topCards   = heroState.deck.slice(0, safeCount);

        console.log(
            `[HERO PREVIEW] Top ${topCards.length} cards for ${heroName}:`,
            topCards
        );

        // Persist preview metadata into state so we can restore it after a refresh
        state.heroDeckPreview = {
            heroId: String(heroId),
            count : safeCount
        };

        topCards.forEach(cardId => {
            const cardData = findCardInAllSources(cardId);
            const cardName = cardData?.name || `Card ${cardId}`;

            // OUTER container – NOT SCALED
            const outer = document.createElement("div");
            outer.className = "hero-preview-outer";

            // BUTTON lives in the non-scaled outer container
            const activateBtn = document.createElement("button");
            activateBtn.className = "hero-preview-activate-btn";

            const activateImg = document.createElement("img");
            activateImg.src = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Site%20Assets/activate.png";

            activateBtn.appendChild(activateImg);
            activateBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                try {
                    const heroData = state.heroData?.[heroId];
                    if (!heroData) {
                        console.warn("[HERO DRAW] No heroData for heroId", heroId);
                        return;
                    }

                    const deck = heroData.deck || [];
                    heroData.hand = heroData.hand || [];

                    // How many we actually showed (usually = safeCount, but clamp to deck length)
                    const shownCount = Math.min(deck.length, safeCount);

                    // Exactly the cards we revealed at top-of-deck
                    const shownCards = deck.slice(0, shownCount);

                    // Everything below those shown cards
                    const rest = deck.slice(shownCount);

                    const chosenId = cardId;

                    // 1) Chosen card goes to hand
                    heroData.hand.push(chosenId);

                    // 2) Compute unchosen by removing *one instance* of chosen from shownCards
                    const unchosen = [...shownCards]; // shallow copy
                    const idxToRemove = unchosen.findIndex(id => String(id) === String(chosenId));
                    if (idxToRemove !== -1) {
                        unchosen.splice(idxToRemove, 1); // remove exactly one copy
                    } else {
                        console.warn(
                            "[HERO DRAW] Chosen card not found in shownCards (unexpected)",
                            { chosenId, shownCards }
                        );
                    }

                    // 3) Put the unchosen cards back on top of the remaining deck and shuffle
                    rest.push(...unchosen);

                    // Fisher–Yates shuffle
                    for (let i = rest.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [rest[i], rest[j]] = [rest[j], rest[i]];
                    }

                    // 4) Commit new deck
                    heroData.deck = rest;

                    // 5) Close preview UI
                    const bar      = document.getElementById("hero-deck-preview-bar");
                    const inner    = document.getElementById("hero-deck-preview-inner");
                    const backdrop = document.getElementById("hero-deck-preview-backdrop");

                    if (inner) inner.innerHTML = "";
                    if (bar) bar.style.display = "none";
                    if (backdrop) backdrop.style.display = "none";

                    // Clear persisted preview so it doesn’t reappear after refresh
                    state.heroDeckPreview = null;

                    // Persist
                    if (typeof saveGameState === "function") {
                        saveGameState(state);
                    }

                    console.log(`Chose ${cardName}.`);
                    console.log(
                        "New deck after returning the other revealed and shuffling:",
                        heroData.deck
                    );
                    console.log("Hero hand:", heroData.hand);
                    renderHeroHandBar(gameState);
                } catch (err) {
                    console.warn("[HERO DRAW] Failed to resolve hero draw/choice:", err);
                }
            });

            // INNER SCALED card wrapper FIRST
            const wrapper = document.createElement("div");
            wrapper.className = "card-wrapper hero-preview-card"; 
            wrapper.style.setProperty("--hero-preview-color", glowColor);

            wrapper.addEventListener("click", e => {
                e.stopPropagation();
                if (cardData) buildMainCardPanel(cardData);
            });

            const rendered = renderCard(cardId, wrapper);
            wrapper.appendChild(rendered);

            // append CARD first
            outer.appendChild(wrapper);

            // then append BUTTON below
            outer.appendChild(activateBtn);

            // finally to outer row
            inner.appendChild(outer);
        });

        if (bar) {
            bar.style.display = "block";
        }
        if (backdrop) {
            backdrop.style.display = "block";
        }
    } catch (err) {
        console.warn("[HERO PREVIEW] Failed to render preview:", err);
    }
}

// ============================================================================
// CENTRALIZED CITY OUTLINE HANDLING
// ============================================================================

/**
 * Pure helper: compute the list of "lower" city slots that are valid starting
 * travel destinations for the given hero.
 *
 * This does NOT touch DOM styling – it only returns references/indices.
 */
function computeHeroTravelLegalTargets(gameState, heroId) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return [];

    const citySlots = document.querySelectorAll(".city-slot");
    if (!citySlots.length) return [];

    const upperIndices = [0, 2, 4, 6, 8, 10];
    const lowerIndices = [1, 3, 5, 7, 9, 11];

    const results = [];

    for (let i = 0; i < upperIndices.length; i++) {
        const upperIdx = upperIndices[i];
        const lowerIdx = lowerIndices[i];

        const upperSlot = citySlots[upperIdx];
        const lowerSlot = citySlots[lowerIdx];
        if (!upperSlot || !lowerSlot) continue;

        const foePresent = !!upperSlot.querySelector(".card-wrapper");

        // Is any hero already in this lower city?
        const heroAlreadyHere = (gameState.heroes || []).some(hid => {
            const hState = gameState.heroData?.[hid];
            return hState && hState.cityIndex === lowerIdx;
        });

        if (foePresent && !heroAlreadyHere) {
            results.push({
                upperSlot,
                lowerSlot,
                lowerIndex: lowerIdx
            });
        }
    }

    return results;
}

/**
 * Single centralized place that is allowed to put an outline/cursor on
 * .city-slot elements.
 *
 * - Safe to call as often as you like.
 * - Always clears existing outlines before applying new ones.
 * - If options.clearOnly === true, it will only clear and then return.
 */
function refreshAllCityOutlines(gameState, options = {}) {
    const clearOnly = options.clearOnly === true;

    const citySlots = document.querySelectorAll(".city-slot");
    if (!citySlots.length) return;

    // 1) Clear everything first
    citySlots.forEach(slot => {
        slot.style.outline = "";
        slot.style.cursor = "default";
    });

    if (clearOnly) {
        return;
    }

    // 2) Figure out the active hero
    const heroIds = gameState.heroes || [];
    const activeIdx = gameState.heroTurnIndex ?? 0;
    const heroId = heroIds[activeIdx];

    if (heroId == null) {
        return;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        return;
    }

    // If the hero is already in a city, no starting-travel outlines.
    //if (heroState.cityIndex !== null && heroState.cityIndex !== undefined) {
        //return;
    //}

    // Compute their current travel pool
    const currentTravel =
        typeof heroState.currentTravel === "number"
            ? heroState.currentTravel
            : (typeof heroState.travel === "number" ? heroState.travel : 0);

    if (currentTravel <= 0) {
        return;
    }

    // Facing the Overlord is still allowed to travel; we just treat it
    // as "not in a city" above.

    const targets = computeHeroTravelLegalTargets(gameState, heroId);
    targets.forEach(target => {
        const lowerSlot = target.lowerSlot;
        if (!lowerSlot) return;

        lowerSlot.style.outline = "4px solid yellow";
        lowerSlot.style.cursor = "pointer";
    });
}

setInterval(() => {
    try {
        // This both refreshes the outlines and enforces "no travel when out".
        recomputeCurrentHeroTravelDestinations(gameState);
    } catch (e) {
        console.warn("[OUTLINES] periodic travel-destination refresh failed:", e);
    }
}, 1000);

function recomputeCurrentHeroTravelDestinations(gameState) {
    const heroIds  = gameState.heroes || [];
    const activeIx = gameState.heroTurnIndex ?? 0;
    const heroId   = heroIds[activeIx];

    if (heroId == null) {
        // No current hero – wipe travel UI and block travel
        clearCityHighlights();
        hideTravelHighlights();
        return null;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        clearCityHighlights();
        hideTravelHighlights();
        return null;
    }

    const heroObj  = Array.isArray(heroes)
        ? heroes.find(h => String(h.id) === String(heroId))
        : null;
    const heroName = heroObj?.name || `Hero ${heroId}`;

    const currentTravel =
        typeof heroState.currentTravel === "number"
            ? heroState.currentTravel
            : (typeof heroState.travel === "number" ? heroState.travel : 0);

    // OUT OF TRAVEL → clear outlines, no destinations, no travel
    if (currentTravel <= 0) {
        console.log(
            `[TRAVEL] ${heroName} has run out of travel. ` +
            `Clearing travel destinations and disabling travel.`
        );
        clearCityHighlights();    // removes outlines / pointer cursors
        hideTravelHighlights();   // removes any .travel-highlight classes
        return null;
    }

    // STILL HAS TRAVEL → recompute / redraw outlines via the centralized helper
    if (typeof refreshAllCityOutlines === "function") {
        refreshAllCityOutlines(gameState);
    }

    // Return the up-to-date legal destinations for the active hero
    if (typeof computeHeroTravelLegalTargets === "function") {
        const targets = computeHeroTravelLegalTargets(gameState, heroId) || [];
        return targets;
    }

    // Fallback: if for some reason the helper isn't present, just say "no info"
    return [];
}

function hideFaceOverlordButton() {
    const btn = document.getElementById("face-overlord-button");
    if (btn) {
        btn.style.display = "none";
        btn.disabled = true;
    }
}

// ================================================================
// HERO KO HANDLER
// ================================================================
function handleHeroKnockout(heroId, heroState, state, options = {}) {
    if (!heroState || !state) return;

    // Normalize HP
    if (heroState.hp == null || heroState.hp > 0) {
        heroState.hp = 0;
    }

    const alreadyKO = !!heroState.isKO;
    heroState.isKO = true;

    // 1) Move entire hand into discard
    if (Array.isArray(heroState.hand) && heroState.hand.length) {
        if (!Array.isArray(heroState.discard)) {
            heroState.discard = [];
        }
        heroState.discard.push(...heroState.hand);
        heroState.hand = [];
    }

    // 2) Remove hero from board / city
    if (!alreadyKO && typeof heroState.cityIndex === "number") {
        const citySlots = document.querySelectorAll(".city-slot");
        const idx = heroState.cityIndex;
        const slot = citySlots?.[idx];
        if (slot) {
            const area = slot.querySelector(".city-card-area");
            if (area) {
                area.innerHTML = "";
            }
        }

        heroState.cityIndex = null;
        heroState.isFacingOverlord = false;
    }

    // 3) Update HP UI
    try {
        updateHeroHPDisplays(heroId);
        updateBoardHeroHP(heroId);
    } catch (err) {
        console.warn("[handleHeroKnockout] HP UI update failed", err);
    }

    // 4) Apply heroes-row KO overlay + icon
    try {
        applyHeroKOMarkers(heroId);
    } catch (err) {
        console.warn("[handleHeroKnockout] KO markers failed", err);
    }

    saveGameState(state || gameState);
}
