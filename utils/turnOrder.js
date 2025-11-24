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

import { findCardInAllSources } from './cardRenderer.js'; // ensure this import exists

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
