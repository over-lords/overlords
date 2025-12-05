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


HERO STARTING TRAVEL
    if multiplayer
        start Hero turn timer (3 minutes)

    if (hero not in city)
        Where are they traveling
            -1 travel
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
import { placeCardIntoCitySlot, buildOverlordPanel, buildVillainPanel, buildHeroPanel, playMightSwipeAnimation, showMightBanner, setCurrentOverlord } from './pageSetup.js';
import { currentTurn, executeEffectSafely } from './abilityExecutor.js';
import { gameState } from '../data/gameState.js';
import { loadGameState, saveGameState, clearGameState } from "./stateManager.js";

import {    CITY_EXIT_UPPER,
            CITY_5_UPPER,
            CITY_4_UPPER,
            CITY_3_UPPER,
            CITY_2_UPPER,
            CITY_ENTRY_UPPER } from '../data/gameState.js';

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

            const heroObj = heroes.find(h => String(h.id) === String(hid));
            const heroName = heroObj?.name || `Hero ${hid}`;
            console.log(`[COUNTDOWN] ${heroName} takes 10 damage in city index ${lowerIdx} and is forced back to HQ.`);
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
    placeVillainInUpperCity(entryUpperIdx, villainId, gameState);

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

    //console.log("=== HERO DECKS (in turn order) ===");

    if (Array.isArray(selectedData.heroes)) {
        selectedData.heroes.forEach(heroId => {
            const heroObj = heroes.find(h => String(h.id) === String(heroId));
            if (!heroObj) return;

            const deck = buildHeroDeck(heroObj.name);

            // store in backend
            gameState.heroData[heroId] = gameState.heroData[heroId] || {};
            gameState.heroData[heroId].deck = deck;

            // print
            //console.log(`Deck for ${heroObj.name}:`, deck);
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

export function drawNextVillainCard(gameState) {
    const deck = gameState.villainDeck;
    let ptr = gameState.villainDeckPointer ?? 0;

    if (!Array.isArray(deck) || deck.length === 0) return null;
    if (ptr >= deck.length) return null;

    const id = deck[ptr];
    gameState.villainDeckPointer = ptr + 1;

    return id;
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

export async function startHeroTurn(gameState, { skipVillainDraw = false } = {}) {

    if (!skipVillainDraw && window.VILLAIN_DRAW_ENABLED) {
        const villainId = drawNextVillainCard(gameState);
        if (villainId) {
            const data = findCardInAllSources(villainId);

            if (isCountdownId(villainId)) {
                console.log("[COUNTDOWN] Drawing countdown card", villainId);
                handleCountdownDraw(villainId, gameState);
            } else if (data?.type === "Might" || villainId === "7001") {

                console.log("[MIGHT] Drawn Might of the Overlord — skip city placement.");

                // 1. Swipe animation
                await playMightSwipeAnimation();

                // 2. Main title banner
                await showMightBanner("Might of the Overlord!", 2000);

                const scenarioCurrentlyActive = isScenarioActive(gameState);

                if (villainId === "7001") {
                    const overlordObj = (function () {
                        const ovId = gameState.overlords?.[0];
                        return (
                            overlords.find(o => String(o.id) === String(ovId)) ||
                            villains.find(v => String(v.id) === String(ovId))
                        );
                    })();

                    if (overlordObj) {
                        if (!scenarioCurrentlyActive) {
                            // 3a. Overlord name banners
                            if (Array.isArray(overlordObj.mightNamePrint)) {
                                for (const line of overlordObj.mightNamePrint) {
                                    await showMightBanner(line.text, 2000);
                                }
                            }

                            // 3b. Overlord effects
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

                // 4. Tactic Might – NEVER masked by Scenario
                if (Array.isArray(gameState.tactics) && gameState.tactics.length > 0) {

                    const tacticMap = new Map(
                        tactics.map(t => [String(t.id), t])
                    );
                    const currentTacticsArr = (gameState.tactics || [])
                        .map(id => tacticMap.get(String(id)))
                        .filter(Boolean);

                    for (const t of currentTacticsArr) {
                        // name prints
                        if (Array.isArray(t.mightNamePrint)) {
                            for (const line of t.mightNamePrint) {
                                await showMightBanner(line.text, 2000);
                            }
                        }

                        // effects
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

                if (typeof gameState.turnCounter !== "number") gameState.turnCounter = 0;
                gameState.turnCounter++;

                const heroIds = gameState.heroes || [];
                if (heroIds.length > 0) {
                    currentTurn(heroTurnIndex, heroIds);
                }

                gameState.heroTurnIndex = heroTurnIndex;

                resetTurnTimerForHero();
                saveGameState(gameState);
                initializeTurnUI(gameState);
                return;
            } else if (data?.type === "Scenario") {

                console.log("[SCENARIO] Drawn Scenario card:", villainId, data?.name);

                // Ensure Scenario state containers exist
                if (!Array.isArray(gameState.scenarioStack)) {
                    gameState.scenarioStack = [];
                }
                if (!gameState.scenarioHP) {
                    gameState.scenarioHP = {};
                }

                const scenarioId = String(data.id);
                const baseHP = Number(data.hp) || 0;

                // Track Scenario HP in gameState so it persists and can be modified by damage logic
                if (typeof gameState.scenarioHP[scenarioId] !== "number") {
                    gameState.scenarioHP[scenarioId] = baseHP;
                }
                data.currentHP = gameState.scenarioHP[scenarioId];

                // Mark this as the active Scenario, on top of the stack
                if (!gameState.scenarioStack.includes(scenarioId)) {
                    gameState.scenarioStack.push(scenarioId);
                }
                gameState.activeScenarioId = scenarioId;

                // Scenario "overtakes" Overlord UI: reuse overlord frame/panel, but with Scenario data
                setCurrentOverlord(data);
                buildOverlordPanel(data);

                // Announce its name and abilitiesNamePrint
                await showMightBanner(data.name, 2000);
                if (Array.isArray(data.abilitiesNamePrint)) {
                    for (const line of data.abilitiesNamePrint) {
                        await showMightBanner(line.text, 2000);
                    }
                }

                // Execute passive abilitiesEffects safely (usually condition: 'none')
                if (Array.isArray(data.abilitiesEffects)) {
                    for (const eff of data.abilitiesEffects) {
                        if (!eff) continue;
                        if (eff.type === "passive" && eff.effect && eff.condition === "none") {
                            try {
                                await executeEffectSafely(eff.effect, data, { source: "scenario" });
                            } catch (err) {
                                console.warn("[SCENARIO] Passive effect failed:", err);
                            }
                        }
                    }
                }

                // IMPORTANT: do NOT place a villain on the board, do NOT shove the upper row.
                // This behaves like Might — the draw is "consumed", but no city movement occurs.

                if (typeof gameState.turnCounter !== "number") gameState.turnCounter = 0;
                gameState.turnCounter++;

                const heroIds = gameState.heroes || [];
                if (heroIds.length > 0) {
                    currentTurn(heroTurnIndex, heroIds);
                }

                gameState.heroTurnIndex = heroTurnIndex;

                resetTurnTimerForHero();
                saveGameState(gameState);
                initializeTurnUI(gameState);
                return;

            } else if (data?.type === "Bystander") {
                await handleBystanderDraw(villainId, data, gameState);
            } else {
                const hasTeleport = data?.abilitiesEffects?.some(e => {
                    if (!e) return false;
                    // must be an onEntry effect
                    if (e.condition && e.condition !== "onEntry") return false;

                    const eff = e.effect;
                    if (!eff) return false;

                    // Single string
                    if (typeof eff === "string") {
                        const s = eff.trim();
                        return s === "teleport" || s === "teleport()";
                    }

                    // Array of effects
                    if (Array.isArray(eff)) {
                        return eff.some(x => {
                            if (typeof x !== "string") return false;
                            const s = x.trim();
                            return s === "teleport" || s === "teleport()";
                        });
                    }

                    return false;
                });

                const hasCharge = data?.abilitiesEffects?.some(e => {
                    const eff = e.effect;

                    if (!eff) return false;

                    // Single string
                    if (typeof eff === "string") {
                        return eff.trim().startsWith("charge(");
                    }

                    // Array of effects
                    if (Array.isArray(eff)) {
                        return eff.some(x =>
                            typeof x === "string" &&
                            x.trim().startsWith("charge(")
                        );
                    }

                    return false;
                });

                if (hasTeleport) {
                    // Gather all unoccupied UPPER city indices
                    const openSlots = UPPER_ORDER.filter(idx => !gameState.cities[idx]);

                    if (openSlots.length === 0) {
                        console.warn(
                            `[TELEPORT BLOCKED] Cannot place '${data?.name}' (ID ${villainId}) — all upper cities are occupied. ` +
                            `Teleporting henchman/villain will remain on top of the villain deck until a city becomes empty.`
                        );
                        // No unoccupied cities: DO NOT DRAW.
                        // Rewind the deck pointer so this card stays on top.
                        const ptr = gameState.villainDeckPointer ?? 0;
                        if (ptr > 0) {
                            gameState.villainDeckPointer = ptr - 1;
                        }
                        // Reveal top card of the villain deck
                        gameState.revealedTopVillain = true;
                        // Nothing enters the map this villain phase.

                        try {
                            await showMightBanner("Top Card Revealed", 2000);
                        } catch (err) {
                            console.warn("[BANNER] Failed to show Top Card Revealed banner:", err);
                        }
                    } else {
                        const randomIndex = Math.floor(Math.random() * openSlots.length);
                        const targetIdx = openSlots[randomIndex];

                        gameState.revealedTopVillain = false;
                        placeVillainInUpperCity(targetIdx, villainId, gameState);
                    }
                } else if (hasCharge) {
                    // Find the *first* charge(N) to extract N
                    let dist = 1;

                    for (const e of data.abilitiesEffects) {
                        const eff = e.effect;
                        if (typeof eff === "string" && eff.startsWith("charge(")) {
                            dist = Number(eff.match(/\((\d+)\)/)?.[1] ?? 1);
                            break;
                        }
                        if (Array.isArray(eff)) {
                            const found = eff.find(x => typeof x === "string" && x.startsWith("charge("));
                            if (found) {
                                dist = Number(found.match(/\((\d+)\)/)?.[1] ?? 1);
                                break;
                            }
                        }
                    }

                    // Run through the ability engine
                    executeEffectSafely(`charge(${dist})`, data, {});
                } else {
                    await shoveUpper(villainId);
                }
            }
        }
        gameState.isGameStarted = true;
    }

    if (typeof gameState.turnCounter !== "number") gameState.turnCounter = 0;
    gameState.turnCounter++;

    const heroIds = gameState.heroes || [];
    if (heroIds.length > 0) {
        currentTurn(heroTurnIndex, heroIds);
    }

    gameState.heroTurnIndex = heroTurnIndex;

    resetTurnTimerForHero();
    saveGameState(gameState);
    initializeTurnUI(gameState);
}

function placeVillainInUpperCity(slotIndex, newCardId, gameState) {

    const citySlots = document.querySelectorAll(".city-slot");

    if (!Array.isArray(gameState.cities)) {
        gameState.cities = new Array(12).fill(null);
    }

    const slot = citySlots[slotIndex];
    if (!slot) return;

    const area = slot.querySelector(".city-card-area");
    if (!area) return;

    // Clear existing content in that upper city
    area.innerHTML = "";

    // Build wrapper for the villain
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";

    const rendered = renderCard(newCardId, wrapper);
    wrapper.appendChild(rendered);

    area.appendChild(wrapper);

    // Hook up panel click behavior (same as shoveUpper)
    const cardData =
        henchmen.find(h => h.id === newCardId) ||
        villains.find(v => v.id === newCardId);

    if (cardData) {
        wrapper.style.cursor = "pointer";
        wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("Villain/Henchmen card clicked (from teleport):", {
                newCardId,
                cardName: cardData.name
            });
            buildVillainPanel(cardData);
        });
    } else {
        console.warn("No cardData found for newCardId (teleport):", newCardId);
    }

    const entryType = isCountdownId(newCardId) ? "countdown" : "villain";
    gameState.cities[slotIndex] = {
        slotIndex,
        type: entryType,
        id: String(newCardId)
    };

    const baseHP = Number((cardData && cardData.hp) || 1);

    // If this villain/henchman has been seen before (persistent HP), restore it
    if (!gameState.villainHP) gameState.villainHP = {};
    const savedHP = gameState.villainHP[String(newCardId)];

    let currentHP;
    if (typeof savedHP === "number") {
        currentHP = savedHP;
    } else {
        currentHP = baseHP;
    }

    // Assign runtime HP to entry stored in gameState
    gameState.cities[slotIndex].maxHP = baseHP;
    gameState.cities[slotIndex].currentHP = currentHP;

    // Persist to global villainHP map so reloads preserve wounds
    gameState.villainHP[String(newCardId)] = currentHP;

    saveGameState(gameState);

    // Remove entry animation class after it finishes
    setTimeout(() => {
        wrapper.classList.remove("city-card-enter");
    }, 650);
}

export async function shoveUpper(newCardId) {

    const citySlots = document.querySelectorAll(".city-slot");

    // Ensure cities array exists and has room
    if (!Array.isArray(gameState.cities)) {
        gameState.cities = new Array(12).fill(null);
    }

    // Collect which upper slots are filled (DOM)
    const slotInfo = UPPER_ORDER.map(idx => ({
        idx,
        slot: citySlots[idx],
        hasCard: citySlots[idx].querySelector(".card-wrapper")
    }));

    // Find FIRST empty city in the upper row (left → right in UPPER_ORDER)
    let firstEmptyPos = -1;
    for (let i = 0; i < slotInfo.length; i++) {
        if (!slotInfo[i].hasCard) {
            firstEmptyPos = i;
            break;
        }
    }

    // === STEP 1 — SHIFT EXISTING CARDS LEFT (DOM + MODEL), GAP-AWARE ===

    // CASE A: NO EMPTY CITY — perform the original full shove
    if (firstEmptyPos === -1) {
        for (let i = 0; i < slotInfo.length - 1; i++) {
            const curr = slotInfo[i];
            const next = slotInfo[i + 1];

            if (!next.hasCard) continue;

            const cardNode = next.hasCard;

            // 1. REMOVE any "enter-from-right" animation for existing cards
            cardNode.classList.remove("city-card-enter");

            // 2. Add a SLIDE-LEFT animation class instead
            cardNode.classList.add("city-card-slide-left");

            const currArea = curr.slot.querySelector(".city-card-area");
            const nextArea = next.slot.querySelector(".city-card-area");

            if (!currArea || !nextArea) continue;

            currArea.innerHTML = "";
            currArea.appendChild(cardNode);

            nextArea.innerHTML = "";

            // Update bookkeeping
            curr.hasCard = cardNode;
            next.hasCard = null;

            gameState.cities[curr.idx] = gameState.cities[next.idx] || null;
            if (gameState.cities[curr.idx]) {
                gameState.cities[curr.idx].slotIndex = curr.idx;
            }
            gameState.cities[next.idx] = null;

            // Let animation play
            await new Promise(r => setTimeout(r, 20));
            setTimeout(() => cardNode.classList.remove("city-card-slide-left"), 650);

            // -----------------------------
            // MOVE HEROES WHO WERE IN NEXT → CURR (with animation)
            // -----------------------------
            const lowerMap = {
                10: 8,   // Gotham Upper → Metropolis Lower moves lower(11→9)
                8: 6,    // Metropolis Upper → Central Lower moves lower(9→7)
                6: 4,    // Central → Keystone
                4: 2,    // Keystone → Coast
                2: 0,    // Coast → Star
            };

            if (lowerMap.hasOwnProperty(next.idx)) {

                const fromLower = next.idx + 1;
                const toLower   = curr.idx + 1;

                const heroIds = gameState.heroes || [];

                heroIds.forEach(hid => {
                    const hState = gameState.heroData?.[hid];
                    if (!hState) return;

                    if (hState.cityIndex === fromLower) {

                        // Move model immediately
                        hState.cityIndex = toLower;

                        // DOM nodes
                        const citySlots = document.querySelectorAll(".city-slot");
                        const fromSlot  = citySlots[fromLower];
                        const toSlot    = citySlots[toLower];
                        if (!fromSlot || !toSlot) return;

                        const heroNode = fromSlot.querySelector(".card-wrapper");
                        if (!heroNode) return;

                        // Add the same slide-left animation as villains
                        heroNode.classList.remove("city-card-enter");
                        heroNode.classList.remove("city-card-slide-left");
                        heroNode.classList.add("hero-card-slide-left");

                        // After animation completes, physically move hero DOM into new city
                        setTimeout(() => {
                            const fromArea = fromSlot.querySelector(".city-card-area");
                            const toArea   = toSlot.querySelector(".city-card-area");

                            if (fromArea && toArea) {
                                fromArea.innerHTML = "";
                                toArea.innerHTML = "";
                                toArea.appendChild(heroNode);
                            }

                            heroNode.classList.remove("hero-card-slide-left");
                        }, 650); // same timing as villain slide
                    }
                });
            }
        }
    }

    // CASE B: AT LEAST ONE EMPTY CITY AND THE GAP IS NOT AT THE RIGHTMOST SLOT
    // (i.e., there is a gap somewhere between Exit and City 2)
    else if (firstEmptyPos < slotInfo.length - 1) {

        // Slide only cards to the RIGHT of the first empty slot into the gap
        for (let i = firstEmptyPos + 1; i < slotInfo.length; i++) {

            const next = slotInfo[i];      // slot to the right
            const curr = slotInfo[i - 1];  // empty or earlier slot

            if (!next.hasCard) continue;

            const cardNode = next.hasCard;

            // 1. REMOVE any "enter-from-right" animation for existing cards
            cardNode.classList.remove("city-card-enter");

            // 2. Add a SLIDE-LEFT animation class instead
            cardNode.classList.add("city-card-slide-left");

            const currArea = curr.slot.querySelector(".city-card-area");
            const nextArea = next.slot.querySelector(".city-card-area");

            if (!currArea || !nextArea) continue;

            currArea.innerHTML = "";
            currArea.appendChild(cardNode);

            nextArea.innerHTML = "";

            // Update bookkeeping
            curr.hasCard = cardNode;
            next.hasCard = null;

            gameState.cities[curr.idx] = gameState.cities[next.idx] || null;
            if (gameState.cities[curr.idx]) {
                gameState.cities[curr.idx].slotIndex = curr.idx;
            }
            gameState.cities[next.idx] = null;

            // Let animation play
            await new Promise(r => setTimeout(r, 20));
            setTimeout(() => cardNode.classList.remove("city-card-slide-left"), 650);

            // -----------------------------
            // MOVE HEROES WHO WERE IN NEXT → CURR (with animation)
            // -----------------------------
            const lowerMap = {
                10: 8,   // Gotham Upper → Metropolis Lower moves lower(11→9)
                8: 6,    // Metropolis Upper → Central Lower moves lower(9→7)
                6: 4,    // Central → Keystone
                4: 2,    // Keystone → Coast
                2: 0,    // Coast → Star
            };

            if (lowerMap.hasOwnProperty(next.idx)) {

                const fromLower = next.idx + 1;
                const toLower   = curr.idx + 1;

                const heroIds = gameState.heroes || [];

                heroIds.forEach(hid => {
                    const hState = gameState.heroData?.[hid];
                    if (!hState) return;

                    if (hState.cityIndex === fromLower) {

                        // Move model immediately
                        hState.cityIndex = toLower;

                        // DOM nodes
                        const citySlots = document.querySelectorAll(".city-slot");
                        const fromSlot  = citySlots[fromLower];
                        const toSlot    = citySlots[toLower];
                        if (!fromSlot || !toSlot) return;

                        const heroNode = fromSlot.querySelector(".card-wrapper");
                        if (!heroNode) return;

                        // Add the same slide-left animation as villains
                        heroNode.classList.remove("city-card-enter");
                        heroNode.classList.remove("city-card-slide-left");
                        heroNode.classList.add("hero-card-slide-left");

                        // After animation completes, physically move hero DOM into new city
                        setTimeout(() => {
                            const fromArea = fromSlot.querySelector(".city-card-area");
                            const toArea   = toSlot.querySelector(".city-card-area");

                            if (fromArea && toArea) {
                                fromArea.innerHTML = "";
                                toArea.innerHTML = "";
                                toArea.appendChild(heroNode);
                            }

                            heroNode.classList.remove("hero-card-slide-left");
                        }, 650); // same timing as villain slide
                    }
                });
            }
        }
    }
    // CASE C: firstEmptyPos === slotInfo.length - 1
    // Gap is at rightmost city (City 1) → do not shift anything

    // The rightmost slot (UPPER_ORDER[last]) is now empty (or already was).
    const rightmost = slotInfo[slotInfo.length - 1];
    const rightmostArea = rightmost.slot.querySelector(".city-card-area");
    rightmostArea.innerHTML = "";

    // === STEP 2 — WAIT FOR SHIFT ANIMATIONS TO FINISH ===
    await new Promise(r => setTimeout(r, 600));

    // === STEP 3 — INSERT THE NEW CARD (slide-in from the right) ===
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";

    const rendered = renderCard(newCardId, wrapper);
    wrapper.appendChild(rendered);

    rightmost.slot.querySelector(".city-card-area").appendChild(wrapper);

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
    gameState.cities[rightmost.idx] = {
        slotIndex: rightmost.idx,
        type: entryType,
        id: String(newCardId)
    };

    // Persist everything (including cities + deck pointer + turnCounter etc.)
    saveGameState(gameState);

    // Remove animation class after animation ends
    setTimeout(() => {
        wrapper.classList.remove("city-card-enter");
    }, 650);
}

export function initializeTurnUI(gameState) {
    const btn = document.getElementById("end-turn-button");
    if (!btn) return;

    const topVillainBtn = document.getElementById("top-villain-button");
    if (topVillainBtn) {
        topVillainBtn.style.display = gameState.revealedTopVillain ? "flex" : "none";
    }

    // 1. Who has the indicator?
    const indicator = document.querySelector(".turn-indicator-circle");
    if (!indicator) {
        btn.style.display = "none";
        return;
    }

    // 2. Find its index in the heroes-row
    const slots = [...document.querySelectorAll("#heroes-row .hero-slot")];
    const slotIndex = slots.findIndex(slot => slot.contains(indicator));
    if (slotIndex === -1) {
        btn.style.display = "none";
        return;
    }

    // 3. That slotIndex is the active hero index
    const heroId = gameState.heroes?.[slotIndex];
    if (!heroId) {
        btn.style.display = "none";
        return;
    }

    setupStartingTravelOptions(gameState, heroId);

    // 4. You are single-player → ALWAYS show the button
    btn.style.display = "block";
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

                    if (heroState.hp < 0) heroState.hp = 0;
                    updateHeroHPDisplays(heroId);
                    updateBoardHeroHP(heroId);

                    console.log(
                        `[END TURN] ${heroObj?.name} takes ${foeDamage} damage from ${foe.name} in city ${heroState.cityIndex}.`
                        + ` (DT=${dt})`
                    );
                } else {
                    console.log(
                        `[END TURN] ${heroObj?.name} ignores ${foe.name}'s damage `
                        + `(foeDamage=${foeDamage} < DT=${dt}).`
                    );
                }
            }
        }
    }

    if (Array.isArray(heroState.hand) && heroState.hand.length > 0) {
        heroState.discard = heroState.discard || [];
        heroState.discard.push(...heroState.hand);
        heroState.hand = [];
    }

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

    // Clear any previous glow
    clearCityHighlights();

    // Only if hero is NOT in a city
    if (heroState.cityIndex !== null && heroState.cityIndex !== undefined) {
        return; // Already on map → skip to hero draw normally
    }

    // Hero is at HQ
    const citySlots = document.querySelectorAll(".city-slot");
    const upperIndices = [0, 2, 4, 6, 8, 10];
    const lowerIndices = [1, 3, 5, 7, 9, 11];

    const legalTargets = [];

    for (let i = 0; i < 6; i++) {
        const upperSlot = citySlots[upperIndices[i]];
        const lowerSlot = citySlots[lowerIndices[i]];

        const foePresent = !!upperSlot.querySelector(".card-wrapper");

        // NEW: is any hero already in this lower city?
        const heroAlreadyHere = (gameState.heroes || []).some(hid => {
            const hState = gameState.heroData?.[hid];
            return hState && hState.cityIndex === lowerIndices[i];
        });

        // Only highlight if foe exists AND no hero is there already
        if (foePresent && !heroAlreadyHere) {
            legalTargets.push({ lowerSlot, lowerIndex: lowerIndices[i] });
        }
    }

    // Highlight and activate yellow travel cities
    legalTargets.forEach(target => {
        target.lowerSlot.style.outline = "4px solid yellow";
        target.lowerSlot.style.cursor = "pointer";
        target.lowerSlot.addEventListener("click", () => {
            showTravelPopup(gameState, heroId, target.lowerIndex);
        });
    });
}

window.recalculateHeroTravel = function () {
    try {
        initializeTurnUI(gameState);
    } catch (err) {
        console.warn("[recalculateHeroTravel] failed to recompute travel UI:", err);
    }
};

function clearCityHighlights() {
    const citySlots = document.querySelectorAll(".city-slot");
    citySlots.forEach(slot => {
        slot.style.outline = "";
        slot.style.cursor = "default";
    });
}

function performHeroStartingTravel(gameState, heroId, cityIndex) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return;

    // Spend 1 travel
    if (heroState.travel > 0) {
        heroState.travel -= 1;
    }

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

    saveGameState(gameState);

    clearCityHighlights();
    initializeTurnUI(gameState);
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
