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
        start Hero turn timer
    if (hero not in city)
        Where are they traveling
            -1 travel
    else
        skip to next phase

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

import { findCardInAllSources } from './cardRenderer.js';
import { placeCardIntoCitySlot } from './pageSetup.js';
import { currentTurn } from './abilityExecutor.js';
import { gameState } from '../data/gameState.js';

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

export function startHeroTurn(gameState, { skipVillainDraw = false } = {}) {

    // STEP 1 — VILLAIN DRAW
    if (!skipVillainDraw && window.VILLAIN_DRAW_ENABLED) {
        const villainId = drawNextVillainCard(gameState);
        if (villainId) {
            placeCardIntoCitySlot(villainId, CITY_ENTRY_UPPER);
        }
        gameState.isGameStarted = true;
    }

    // STEP 2 — HIGHLIGHT ACTIVE HERO PORTRAIT
    const heroIds = gameState.heroes || [];
    if (heroIds.length > 0) {
        currentTurn(heroTurnIndex, heroIds);
    }

    // SAVE THE ACTIVE HERO (BEFORE ADVANCING)
    gameState.heroTurnIndex = heroTurnIndex;

    // STEP 3 — Advance turn counter for NEXT CALL
    heroTurnIndex = (heroTurnIndex + 1) % (heroIds.length || 1);
}

export async function shoveUpper(newCardId) {

    const citySlots = document.querySelectorAll(".city-slot");

    // Collect which upper slots are filled
    const slotInfo = UPPER_ORDER.map(idx => ({
        idx,
        slot: citySlots[idx],
        hasCard: citySlots[idx].querySelector(".card-wrapper")
    }));

    // === STEP 1 — SHIFT EXISTING CARDS LEFT ===
    for (let i = 0; i < slotInfo.length - 1; i++) {
        const curr = slotInfo[i];
        const next = slotInfo[i + 1];

        if (next.hasCard) {
            const cardNode = next.hasCard;

            // Add animation class
            cardNode.classList.add("city-card-enter");

            // Move DOM node to the left slot
            const currArea = curr.slot.querySelector(".city-card-area");
            const nextArea = next.slot.querySelector(".city-card-area");

            if (!currArea || !nextArea) continue;

            // move only the card wrapper
            currArea.innerHTML = "";
            currArea.appendChild(cardNode);

            nextArea.innerHTML = "";

            // The node has now moved from next→curr, so update the model
            curr.hasCard = cardNode;
            next.hasCard = null;

            // allow CSS animation to visibly play
            await new Promise(r => setTimeout(r, 20));
            // remove animation class after complete
            setTimeout(() => cardNode.classList.remove("city-card-enter"), 650);
        }
    }

    // The rightmost slot (UPPER_ORDER[last]) is now empty (or emptied by shove).
    const rightmost = slotInfo[slotInfo.length - 1];
    rightmost.slot.innerHTML = "";

    // === STEP 2 — WAIT FOR SHIFT ANIMATIONS TO FINISH ===
    await new Promise(r => setTimeout(r, 600));

    // === STEP 3 — INSERT THE NEW CARD (slide-in from the right) ===
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";

    const rendered = renderCard(newCardId, wrapper);
    wrapper.appendChild(rendered);

    rightmost.slot.querySelector(".city-card-area").appendChild(wrapper);

    // Remove animation class after animation ends
    setTimeout(() => {
        wrapper.classList.remove("city-card-enter");
    }, 650);
}