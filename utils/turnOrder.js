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
            roll a d6
                if unoccupied, teleport to city
                else, teleport to next unoccupied
                    if would immediately escape, teleport to any unoccupied city
                    if all are occupied, remain on top of villain deck
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
import { henchmen } from '../data/henchmen.js';
import { villains } from '../data/villains.js';
import { renderCard, findCardInAllSources } from './cardRenderer.js';
import { placeCardIntoCitySlot, buildVillainPanel, buildHeroPanel } from './pageSetup.js';
import { currentTurn } from './abilityExecutor.js';
import { gameState } from '../data/gameState.js';
import { loadGameState, saveGameState, clearGameState } from "./stateManager.js";


import {    CITY_EXIT_UPPER,
            CITY_5_UPPER,
            CITY_4_UPPER,
            CITY_3_UPPER,
            CITY_2_UPPER,
            CITY_ENTRY_UPPER } from '../data/gameState.js';

let heroTurnIndex = 0;



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

    // continue into actual gameplay setup...

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

export async function startHeroTurn(gameState, { skipVillainDraw = false } = {}) {

    if (!skipVillainDraw && window.VILLAIN_DRAW_ENABLED) {
        const villainId = drawNextVillainCard(gameState);
        if (villainId) {
            await shoveUpper(villainId);
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

    // === STEP 1 — SHIFT EXISTING CARDS LEFT (DOM + MODEL) ===
    for (let i = 0; i < slotInfo.length - 1; i++) {
        const curr = slotInfo[i];
        const next = slotInfo[i + 1];

        if (next.hasCard) {if (next.hasCard) {
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
    }

    // The rightmost slot (UPPER_ORDER[last]) is now empty (or emptied by shove).
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

    // === UPDATE MODEL for the newly entered card ===
    gameState.cities[rightmost.idx] = {
        slotIndex: rightmost.idx,
        type: "villain",
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
        const slot = gameState.cities?.[heroState.cityIndex];
        if (slot && slot.foe) {
            const foe = slot.foe;
            const dmg = foe.attack || 1;
            heroState.hp -= dmg;
            if (heroState.hp < 0) heroState.hp = 0;
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
