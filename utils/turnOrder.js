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

let isSinglePlayer = (window.GAME_MODE === "single");
let isMultiplayer = (window.GAME_MODE === "multi");
export function refreshGameModeFlags(mode = window.GAME_MODE) {
    window.GAME_MODE = mode || window.GAME_MODE || "single";
    isSinglePlayer = (window.GAME_MODE === "single");
    isMultiplayer = (window.GAME_MODE === "multi");
}

import { heroes } from '../data/faceCards.js';
import { heroCards } from '../data/heroCards.js';

import { henchmen } from '../data/henchmen.js';
import { villains } from '../data/villains.js';
import { recordCampaignWin } from './campaignProgress.js';
import { playSoundEffect } from './soundHandler.js';
import { overlords } from '../data/overlords.js';

import { tactics } from '../data/tactics.js';
import { scenarios } from '../data/scenarios.js';

import { renderCard, findCardInAllSources } from './cardRenderer.js';
import { placeCardIntoCitySlot, buildOverlordPanel, buildVillainPanel, buildHeroPanel, 
         buildMainCardPanel, playMightSwipeAnimation, showMightBanner, setCurrentOverlord, 
         renderHeroHandBar, applyHeroKOMarkers, clearHeroKOMarkers, refreshOverlordFacingGlow,
         appendGameLogEntry, removeGameLogEntryById } from './pageSetup.js';
import { currentTurn, executeEffectSafely, handleVillainEscape, resolveExitForVillain, 
         processTempFreezesForHero, processTempPassivesForHero, getEffectiveFoeDamage, refreshFrozenOverlays, 
         maybeRunHeroIconBeforeDrawOptionals, triggerKOHeroEffects, triggerRuleEffects, runTurnEndDamageTriggers, 
         runOverlordTurnEndAttackedTriggers, runTurnEndNotEngagedTriggers, maybeTriggerEvilWinsConditions, 
         getHeroAbilitiesWithTemp, cleanupExpiredHeroPassives, ejectHeroIfCauserHasEject, iconAbilitiesDisabledForHero, 
         retreatDisabledForHero, getCurrentHeroDT, consumeHeroProtectionIfAny, buildPermanentKOCountMap, pruneFoeDoubleDamage, 
         pruneHeroProtections, playDamageSfx, isProtectionDisabledForHero, applyNextTurnDoubleDamageIfAny } from './abilityExecutor.js';
import { gameState } from '../data/gameState.js';
import { loadGameState, saveGameState, clearGameState } from "./stateManager.js";

import {    CITY_EXIT_UPPER,
            CITY_5_UPPER,
            CITY_4_UPPER,
            CITY_3_UPPER,
            CITY_2_UPPER,
            CITY_ENTRY_UPPER } from '../data/gameState.js';

const COUNTDOWN_IDS = new Set(["8001", "8002", "8003", "8004", "8005", "8006"]);

function isCountdownId(id) {
    return COUNTDOWN_IDS.has(String(id));
}

function hasUpperRowFoe(state = gameState) {
    const s = state || gameState;
    const cities = Array.isArray(s.cities) ? s.cities : [];
    const upperSlots = [CITY_EXIT_UPPER, CITY_5_UPPER, CITY_4_UPPER, CITY_3_UPPER, CITY_2_UPPER, CITY_ENTRY_UPPER];
    return upperSlots.some(idx => {
        const entry = cities[idx];
        return entry && entry.id != null;
    });
}

function isHeroEngagedWithFoe(heroId, state = gameState) {
    const s = state || gameState;
    const heroState = s.heroData?.[heroId];
    if (!heroState) return false;
    if (heroState.isFacingOverlord) return false;
    if (typeof heroState.cityIndex !== "number") return false;
    const upperIdx = heroState.cityIndex - 1;
    if (upperIdx < 0) return false;
    const cities = Array.isArray(s.cities) ? s.cities : [];
    const entry = cities[upperIdx];
    return !!(entry && entry.id != null);
}

function isStandardEffectLive(effectVal, heroId, state = gameState) {
    const list = Array.isArray(effectVal) ? effectVal : [effectVal];
    const strings = list.filter(e => typeof e === "string");
    const hasFreezeAny = strings.some(e => /freezeVillain\s*\(any\)/i.test(String(e)));
    if (hasFreezeAny) {
        return hasUpperRowFoe(state);
    }

    const hasRetreatHQ = strings.some(e => /retreatHeroToHQ\s*\(\s*\)/i.test(String(e)));
    if (hasRetreatHQ) {
        return isHeroEngagedWithFoe(heroId, state);
    }

    return true;
}

function hasUsedStandardThisTurn(heroState, abilityIndex, turnCounter) {
    if (!heroState || typeof abilityIndex !== "number") return false;
    const usedTurn = heroState.standardTurnUsed?.[abilityIndex];
    return typeof usedTurn === "number" && usedTurn === turnCounter;
}

function markStandardUsedThisTurn(heroState, abilityIndex, turnCounter) {
    if (!heroState || typeof abilityIndex !== "number") return;
    if (!heroState.standardTurnUsed) heroState.standardTurnUsed = {};
    heroState.standardTurnUsed[abilityIndex] = turnCounter;
}

function getHeroStandardEffects(heroId, state = gameState) {
    if (iconAbilitiesDisabledForHero(heroId, state)) return [];

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return [];

    const { effects, names } = getHeroAbilitiesWithTemp(heroId, state);
    const hState = state.heroData?.[heroId] || {};
    const turnCounter = typeof state.turnCounter === "number" ? state.turnCounter : 0;

    const results = [];

    effects.forEach((eff, i) => {
        if (!eff || (eff.type || "").toLowerCase() !== "standard") return;
        const maxUses = Number(eff.uses || 0);
        const remaining = hState.currentUses?.[i] == null ? maxUses : hState.currentUses[i];
        if (remaining <= 0) return;

        const normHowOften = String(eff.howOften || "").toLowerCase();
        if (normHowOften === "opt" && hasUsedStandardThisTurn(hState, i, turnCounter)) {
            return; // once per turn enforcement
        }

        const live = isStandardEffectLive(eff.effect, heroId, state);
        if (!live) return;

        const label = names[i]?.text || `Ability ${i + 1}`;
        results.push({
            index: i,
            label,
            usesLeft: remaining,
            usesMax: maxUses,
            effect: eff.effect,
            howOften: normHowOften
        });
    });

    return results;
}

let currentStandardOptions = [];
let currentStandardHeroId = null;
let selectedStandardOption = null;

function closeStandardAbilityOverlay() {
    const overlay = document.getElementById("standard-ability-overlay");
    const optionsBox = document.getElementById("standard-ability-options");
    const msg = document.getElementById("standard-ability-message");
    const activateBtn = document.getElementById("standard-ability-activate");

    if (optionsBox) optionsBox.innerHTML = "";
    if (msg) msg.textContent = "";
    if (activateBtn) activateBtn.disabled = true;
    selectedStandardOption = null;
    currentStandardOptions = [];
    currentStandardHeroId = null;
    if (overlay) overlay.style.display = "none";
}

async function runStandardAbility(option, heroId, state = gameState) {
    if (!option || heroId == null) return;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const hState = state.heroData?.[heroId];
    if (!heroObj || !hState) return;
    const turnCounter = typeof state.turnCounter === "number" ? state.turnCounter : 0;

    const effectsArray = Array.isArray(option.effect) ? option.effect : [option.effect];
    const skipUseDecrement = effectsArray.some(eff => typeof eff === "string" && /^discardCardsAtWill/i.test(eff));

    for (const eff of effectsArray) {
        if (typeof eff !== "string") continue;
        try {
            await executeEffectSafely(eff, heroObj, { currentHeroId: heroId, state });
        } catch (err) {
            console.warn("[StandardAbility] Failed to execute effect", eff, err);
        }
    }

    const max = Number(option.usesMax || option.usesLeft || 0);
    if (!hState.currentUses) hState.currentUses = {};
    const before = hState.currentUses[option.index];
    const remaining = before == null ? max : before;
    hState.currentUses[option.index] = skipUseDecrement
        ? remaining
        : Math.max(0, remaining - 1);
    heroObj.currentUses = heroObj.currentUses || {};
    heroObj.currentUses[option.index] = hState.currentUses[option.index];

    if (String(option.howOften || "").toLowerCase() === "opt") {
        markStandardUsedThisTurn(hState, option.index, turnCounter);
    }

    const heroName = heroObj.name || `Hero ${heroId}`;
    appendGameLogEntry(`${heroName} used ${option.label}.`, state);
    saveGameState(state);
}

function openStandardAbilityMenu(heroId, state = gameState) {
    const overlay = document.getElementById("standard-ability-overlay");
    const optionsBox = document.getElementById("standard-ability-options");
    const msg = document.getElementById("standard-ability-message");
    const activateBtn = document.getElementById("standard-ability-activate");
    if (!overlay || !optionsBox || !msg || !activateBtn) return;

    const options = getHeroStandardEffects(heroId, state);
    currentStandardOptions = options;
    currentStandardHeroId = heroId;
    selectedStandardOption = null;

    optionsBox.innerHTML = "";
    activateBtn.disabled = true;

    if (!options.length) {
        msg.textContent = "No live standard-speed effects available.";
        overlay.style.display = "flex";
        return;
    }

    msg.textContent = "";

    options.forEach((opt, idx) => {
        const row = document.createElement("div");
        row.className = "standard-ability-option";
        row.innerHTML = `
            <div style="flex:1 1 auto;">${opt.label}</div>
            <div style="font-weight:bold;">${opt.usesLeft}x</div>
        `;
        row.addEventListener("click", () => {
            selectedStandardOption = idx;
            optionsBox.querySelectorAll(".standard-ability-option").forEach(el => el.classList.remove("selected"));
            row.classList.add("selected");
            activateBtn.disabled = false;
        });
        optionsBox.appendChild(row);
    });

    overlay.style.display = "flex";
}

function updateStandardSpeedUI(state = gameState, heroId = null) {
    const btn = document.getElementById("standard-activate-btn");
    if (!btn) return;

    const heroIds = state.heroes || [];
    const activeHeroId = heroId ?? heroIds[state.heroTurnIndex ?? 0];

    if (!activeHeroId || !state.heroData?.[activeHeroId]) {
        btn.style.display = "none";
        closeStandardAbilityOverlay();
        return;
    }

    const options = getHeroStandardEffects(activeHeroId, state);
    if (!options.length) {
        btn.style.display = "none";
        closeStandardAbilityOverlay();
        return;
    }

    btn.style.display = "block";
    btn.onclick = () => openStandardAbilityMenu(activeHeroId, state);
}

const standardAbilityClose = document.getElementById("standard-ability-close");
if (standardAbilityClose) {
    standardAbilityClose.addEventListener("click", () => closeStandardAbilityOverlay());
}

const standardAbilityActivateBtn = document.getElementById("standard-ability-activate");
if (standardAbilityActivateBtn) {
    standardAbilityActivateBtn.addEventListener("click", async () => {
        if (selectedStandardOption == null) return;
        const option = currentStandardOptions[selectedStandardOption];
        if (!option || currentStandardHeroId == null) {
            closeStandardAbilityOverlay();
            return;
        }
        await runStandardAbility(option, currentStandardHeroId, gameState);
        closeStandardAbilityOverlay();
        updateStandardSpeedUI(gameState, currentStandardHeroId);
    });
}

function getActiveUpperOrder(state = gameState) {
    const s = state || gameState;
    const destroyed = s?.destroyedCities || {};
    return UPPER_ORDER.filter(idx => !destroyed[idx]);
}

function isScenarioActive(state) {
    const stack = state.scenarioStack;
    if (!Array.isArray(stack)) return false;
    return stack.length > 0;
}

function getSlotFoeDamage(slotEntry, fallbackCard = null) {
    if (slotEntry) {
        return getEffectiveFoeDamage(slotEntry);
    }
    if (fallbackCard) {
        const raw = fallbackCard.currentDamage ?? fallbackCard.damage ?? fallbackCard.dmg ?? 0;
        return Number(raw) || 0;
    }
    return 0;
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

async function runMightEffectsList(effects = [], names = []) {
    for (let i = 0; i < effects.length; i++) {
        const eff = effects[i];
        if (!eff) continue;

        const typeStr = String(eff.type || "").toLowerCase();

        // ---------- CHOOSE OPTION ----------
        if (typeStr === "chooseoption") {
            const header = names?.[i]?.text || "Choose";
            const options = [];
            const optionEffects = [];
            let j = i + 1;

            while (
                j < effects.length &&
                /^chooseoption\(\d+\)$/i.test(String(effects[j]?.type || ""))
            ) {
                const label =
                    names?.[j]?.text ||
                    `Option ${options.length + 1}`;

                options.push({ label });
                optionEffects.push(effects[j]);
                j++;
            }

            if (!options.length) {
                console.warn("[MIGHT] chooseOption has no options; skipping.");
                continue;
            }

            let chosenIndex = 0;
            try {
                if (typeof window !== "undefined" && typeof window.showChooseAbilityPrompt === "function") {
                    chosenIndex = await window.showChooseAbilityPrompt({ header, options });
                }
            } catch (err) {
                console.warn("[MIGHT] choose prompt failed; defaulting to first option.", err);
            }

            const chosen = optionEffects[chosenIndex];
            if (chosen) {
                const arr = Array.isArray(chosen.effect) ? chosen.effect : [chosen.effect];
                for (const sub of arr) {
                    if (typeof sub !== "string") continue;
                    await executeMightEffectSafe(sub);
                }
            } else {
                console.warn("[MIGHT] Invalid chosen option index:", chosenIndex);
            }

            i = j - 1; // skip consumed option blocks
            continue;
        }

        // ---------- NORMAL EFFECT ----------
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

function markCityDestroyed(upperIdx, gameState, opts = {}) {
    if (!gameState.destroyedCities) {
        gameState.destroyedCities = {};
    }
    if (gameState.destroyedCities[upperIdx]) {
        // already marked destroyed
        return;
    }
    gameState.destroyedCities[upperIdx] = true;
    if (opts.by === "countdown") {
        if (!gameState.destroyedByCountdown) gameState.destroyedByCountdown = {};
        gameState.destroyedByCountdown[upperIdx] = true;
    }
    try {
        triggerRuleEffects("cityDestroyed", { state: gameState, cityIndex: upperIdx, reason: opts.by || null });
    } catch (err) {
        console.warn("[markCityDestroyed] cityDestroyed trigger failed", err);
    }

    const citySlots = document.querySelectorAll(".city-slot");
    const upperSlot = citySlots[upperIdx];
    const lowerSlot = citySlots[upperIdx + 1];

        [upperSlot, lowerSlot].forEach(slot => {
        if (!slot) return;

        // Background black
        slot.style.backgroundColor = "black";

        // Ensure relative position so overlay can be absolutely placed
        if (getComputedStyle(slot).position === "static") {
            slot.style.position = "relative";
        }

        // Keep the card area above the destruction overlay so cards stay visible
        const area = slot.querySelector(".city-card-area");
        if (area) {
            if (getComputedStyle(area).position === "static") {
                area.style.position = "relative";
            }
            area.style.zIndex = "2";
        }

        let dimmer = slot.querySelector(".destroyed-city-dimmer");
        if (!dimmer) {
            dimmer = document.createElement("div");
            dimmer.className = "destroyed-city-dimmer";
            dimmer.style.position = "absolute";
            dimmer.style.top = "0";
            dimmer.style.left = "0";
            dimmer.style.right = "0";
            dimmer.style.bottom = "0";
            dimmer.style.background = "rgba(0,0,0,0.5)";
            dimmer.style.pointerEvents = "none";
            dimmer.style.zIndex = "0";
            slot.appendChild(dimmer);
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
            overlay.style.zIndex = "3";
            overlay.textContent = "X";
            slot.appendChild(overlay);
        }
    });

    // Check for "all 6 cities destroyed" loss condition
    checkGameEndConditions(gameState);
}

function unmarkCityDestroyed(upperIdx, gameState) {
    if (!gameState?.destroyedCities) return;
    delete gameState.destroyedCities[upperIdx];

    const citySlots = document.querySelectorAll(".city-slot");
    const upperSlot = citySlots[upperIdx];
    const lowerSlot = citySlots[upperIdx + 1];

    [upperSlot, lowerSlot].forEach(slot => {
        if (!slot) return;
        slot.style.backgroundColor = "";
        const overlay = slot.querySelector(".destroyed-city-overlay");
        if (overlay) overlay.remove();
        const dimmer = slot.querySelector(".destroyed-city-dimmer");
        if (dimmer) dimmer.remove();
        const area = slot.querySelector(".city-card-area");
        if (area) area.style.zIndex = "";
    });
}

// ---------------------------------------------------------------------------
// Coastal city helper: returns current left/right non-destroyed upper indices
// ---------------------------------------------------------------------------
export function checkCoastalCities(state = gameState) {
    const s = state || gameState;
    const destroyed = s?.destroyedCities || {};

    const UPPER_ORDER = [
        CITY_EXIT_UPPER,
        CITY_5_UPPER,
        CITY_4_UPPER,
        CITY_3_UPPER,
        CITY_2_UPPER,
        CITY_ENTRY_UPPER
    ];

    const remaining = UPPER_ORDER.filter(idx => !destroyed[idx]);

    if (remaining.length === 0) {
        console.log("[Coastal] Left coastal city: none, Right coastal city: none");
        return { left: null, right: null };
    }

    const left = remaining[0];
    const right = remaining[remaining.length - 1];

    console.log(`[Coastal] Left coastal city: ${left}, Right coastal city: ${right}`);

    return { left, right };
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
            const heroId = hid;
            const heroObj = heroes.find(h => String(h.id) === String(heroId));
            const heroName = heroObj?.name || `Hero ${heroId}`;
            const dmg = 10;

            const currentHP = (typeof hState.hp === "number") ? hState.hp : 0;
            hState.hp = Math.max(0, currentHP - dmg);
            playDamageSfx(Math.max(0, Math.min(dmg, currentHP)));

            // Move hero back to HQ (cityIndex = null)
            hState.cityIndex = null;
            heroWasHit = true;

            appendGameLogEntry(`${heroName} took ${dmg} damage from Countdown.`, gameState);

            try { updateHeroHPDisplays(heroId); } catch (err) { console.warn("[COUNTDOWN] updateHeroHPDisplays failed", err); }
            try { updateBoardHeroHP(heroId); } catch (err) { console.warn("[COUNTDOWN] updateBoardHeroHP failed", err); }

            console.log(
                `[COUNTDOWN] ${heroName} takes ${dmg} damage `
                + `from countdown in city ${lowerIdx}. New HP=${hState.hp}`
            );

            if (hState.hp <= 0) {
                // Countdown killed the hero -- full KO behavior (hand dump, overlay, etc.)
                handleHeroKnockout(heroId, hState, gameState, { source: "countdown", sourceName: "Countdown" });
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
    markCityDestroyed(upperIdx, gameState, { by: "countdown" });
}

function applyDestroyCity(upperIdx, state = gameState) {
    if (upperIdx == null) return;
    const s = state || gameState;
    applyCountdownLandingEffects(upperIdx, s);
    const cityName = getCityNameFromIndex(upperIdx + 1);
    appendGameLogEntry(`${cityName} was destroyed.`, s);
}

function applyRestoreCity(upperIdx, state = gameState) {
    if (upperIdx == null) return;
    const s = state || gameState;
    if (s.destroyedByCountdown?.[upperIdx]) {
        console.log("[restoreCity] Cannot restore a city destroyed by a Countdown.");
        return;
    }
    unmarkCityDestroyed(upperIdx, s);
    const cityName = getCityNameFromIndex(upperIdx + 1);
    appendGameLogEntry(`${cityName} was restored.`, s);
    refreshFrozenOverlays(s);
    refreshAllCityOutlines(s);
}

export function destroyCitiesByCount(count = 1, state = gameState) {
    const s = state || gameState;
    const num = Math.max(0, Number(count) || 0);
    for (let i = 0; i < num; i++) {
        const active = getActiveUpperOrder(s);
        const target = active.length ? active[active.length - 1] : null;
        if (target == null) break;
        applyDestroyCity(target, s);
    }
    saveGameState(s);
}

export function restoreCitiesByCount(count = 1, state = gameState) {
    const s = state || gameState;
    const num = Math.max(0, Number(count) || 0);
    for (let i = 0; i < num; i++) {
        const destroyedMap = s.destroyedCities || {};
        const destroyedList = Object.keys(destroyedMap)
            .map(k => Number(k))
            .filter(n => !Number.isNaN(n))
            .filter(n => !(s.destroyedByCountdown?.[n]))
            .sort((a, b) => a - b);
        const target = destroyedList.length ? destroyedList[0] : null;
        if (target == null) break;
        applyRestoreCity(target, s);
    }
    saveGameState(s);
}

/**
 * Move a single countdown card one step LEFT along UPPER_ORDER,
 * applying landing effects at the destination.
 */
function advanceSingleCountdown(upperIdx, gameState) {
    // Push a countdown one step left, cascading any countdowns ahead of it.
    const pos = UPPER_ORDER.indexOf(upperIdx);
    if (pos <= 0) {
        // Already at EXIT; nothing further left to move to.
        return;
    }

    const destIdx = UPPER_ORDER[pos - 1];

    // If another countdown is already in the destination, push it further left first.
    const destEntry = gameState.cities?.[destIdx];
    if (destEntry && isCountdownId(destEntry.id)) {
        advanceSingleCountdown(destIdx, gameState);
    }

    // Apply landing effects only once per new city (dest might already be destroyed).
    if (!gameState.destroyedCities || !gameState.destroyedCities[destIdx]) {
        applyCountdownLandingEffects(destIdx, gameState);
    }

    // Move the countdown card DOM + model
    const citySlots = document.querySelectorAll(".city-slot");
    const fromSlot  = citySlots[upperIdx];
    const toSlot    = citySlots[destIdx];

    const fromArea = fromSlot?.querySelector(".city-card-area");
    const toArea   = toSlot?.querySelector(".city-card-area");
    const node = fromArea?.querySelector(".card-wrapper");

    if (node && toArea && fromArea) {
        node.classList.remove("city-card-enter");
        node.classList.remove("city-card-slide-left");
        node.classList.add("city-card-slide-left");

        toArea.innerHTML = "";
        toArea.appendChild(node);
        fromArea.innerHTML = "";

        setTimeout(() => node.classList.remove("city-card-slide-left"), 650);
    }

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

    // Move the rightmost countdown left to make room for the new one.
    const countdownIdx = UPPER_ORDER.slice().reverse().find(idx => {
        const entry = gameState.cities[idx];
        return entry && isCountdownId(entry.id);
    });

    if (countdownIdx == null) return;

    console.log("[COUNTDOWN] Shoving prior countdown from", countdownIdx);
    advanceSingleCountdown(countdownIdx, gameState);
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

export function flagPendingHeroDamage(heroId, amount, sourceName = "unknown", state = gameState) {
    const s = state || gameState;
    s.pendingDamageHero = {
        heroId,
        amount,
        sourceName
    };
    const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
    console.log(`[damageHero] Pending damage to ${heroName}: ${amount} from ${sourceName}.`);
}

export async function tryBlockPendingHeroDamage(state = gameState) {
    const s = state || gameState;
    const pending = s.pendingDamageHero;
    if (!pending) return false;

    if (isProtectionDisabledForHero(pending.heroId, s)) {
        console.log("[damageHero] Damage block prevented due to protection disable flag.");
        return false;
    }

    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    for (const hid of heroIds) {
        const heroObj = heroes.find(h => String(h.id) === String(hid));
        if (!heroObj) continue;

        const effects = Array.isArray(heroObj.abilitiesEffects) ? heroObj.abilitiesEffects : [];
        const names = Array.isArray(heroObj.abilitiesNamePrint) ? heroObj.abilitiesNamePrint : [];
        const hState = s.heroData?.[hid] || {};

        const turnUsed = hState.damageHeroBlockTurnUsed;
        if (typeof s.turnCounter === "number" && turnUsed === s.turnCounter) {
            continue; // already used this turn
        }

        for (let i = 0; i < effects.length; i++) {
            const eff = effects[i];
            if (!eff) continue;
            const type = (eff.type || "").toLowerCase();
            const cond = (eff.condition || "").toLowerCase();
            const effectStr = Array.isArray(eff.effect) ? eff.effect.join(",") : (eff.effect || "");
            const usesMax = Number(eff.uses || 0);

            const usesLeft = hState.currentUses?.[i];

            const matches =
                type === "optional" &&
                cond === "damagehero" &&
                effectStr.toLowerCase().includes("blockdamage") &&
                (eff.howOften || "").toLowerCase() === "opt" &&
                (usesLeft == null ? usesMax : usesLeft) > 0;

            if (!matches) continue;

            const targetName = heroes.find(h => String(h.id) === String(pending.heroId))?.name || `Hero ${pending.heroId}`;
            const promptText = `${heroObj.name}: Block incoming Damage to ${targetName}?`;
            let allow = true;

            if (typeof window !== "undefined") {
                if (typeof window.showOptionalAbilityPrompt === "function") {
                    allow = await window.showOptionalAbilityPrompt(promptText);
                } else if (typeof window.confirm === "function") {
                    allow = window.confirm(promptText);
                }
            }

            if (!allow) {
                continue;
            }

            // Consume use
            if (!hState.currentUses) hState.currentUses = {};
            const current = hState.currentUses[i];
            const max = usesMax;
            const nextUses = (current == null ? max : current) - 1;
            hState.currentUses[i] = Math.max(0, nextUses);
            if (!heroObj.currentUses) heroObj.currentUses = {};
            heroObj.currentUses[i] = hState.currentUses[i];

            hState.damageHeroBlockTurnUsed = s.turnCounter;
            s.pendingDamageHero = null;
            console.log(`[damageHero] ${heroObj.name} blocked all incoming damage to ${targetName}. Uses left: ${hState.currentUses[i]} / ${max}`);
            return true;
        }
    }

    return false;
}

const UPPER_ORDER = [
    CITY_EXIT_UPPER,   // leftmost Star
    CITY_5_UPPER,
    CITY_4_UPPER,
    CITY_3_UPPER,
    CITY_2_UPPER,
    CITY_ENTRY_UPPER   // rightmost Gotham
];

function entryIsFrozen(entry, upperIdx = null, state = gameState) {
    if (!entry) return false;
    if (entry.isFrozen === true) return true;

    const id = entry.id ?? entry.baseId ?? entry.foeId;
    if (id == null) return false;

    const data =
        henchmen.find(h => String(h.id) === String(id)) ||
        villains.find(v => String(v.id) === String(id));

    // Clash: frozen only while a hero is in the lower slot
    const hasClash =
        data?.hasClash === true ||
        (Array.isArray(data?.abilitiesEffects) &&
            data.abilitiesEffects.some(eff => {
                const raw = eff?.effect;
                const list = Array.isArray(raw) ? raw : [raw];
                return list.some(txt => typeof txt === "string" && txt.trim().toLowerCase() === "hasclash");
            }));

    if (hasClash && typeof upperIdx === "number") {
        const lowerIdx = upperIdx + 1;
        const heroesArr = state?.heroes || [];
        if (heroesArr.some(hid => state?.heroData?.[hid]?.cityIndex === lowerIdx)) {
            return true;
        }
    }

    return data?.isFrozen === true;
}

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

function getTeleportBannerText(cardData, { forcedTeleport = false } = {}) {
    if (forcedTeleport) return "Teleport!";
    if (!cardData) return null;

    const effects = Array.isArray(cardData.abilitiesEffects) ? cardData.abilitiesEffects : [];
    for (let i = 0; i < effects.length; i++) {
        const eff = effects[i];
        if (!eff) continue;

        const raw = eff.effect;
        const list = Array.isArray(raw) ? raw : [raw];
        const hasTeleport = list.some(x => typeof x === "string" && (x.trim() === "teleport" || x.trim() === "teleport()"));
        if (!hasTeleport) continue;

        const name = cardData.abilitiesNamePrint?.[i]?.text;
        return name || "Teleport!";
    }
    return "Teleport!";
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
                if (Array.isArray(overlordObj.mightNamePrint) && overlordObj.mightNamePrint[0]) {
                    await showMightBanner(overlordObj.mightNamePrint[0].text, 2000);
                }

                if (Array.isArray(overlordObj.mightEffects)) {
                    await runMightEffectsList(overlordObj.mightEffects, overlordObj.mightNamePrint || []);
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
            if (Array.isArray(t.mightNamePrint) && t.mightNamePrint[0]) {
                await showMightBanner(t.mightNamePrint[0].text, 2000);
            }

            if (Array.isArray(t.mightEffects)) {
                await runMightEffectsList(t.mightEffects, t.mightNamePrint || []);
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
            const cond = eff?.condition == null ? "none" : eff.condition;
            if (eff.type === "passive" && eff.effect && cond === "none") {
                try {
                    await executeEffectSafely(eff.effect, cardData, { source: "scenario", scenarioId, state });
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

    if (state.destroyedCities?.[slotIndex]) {
        const isCountdown = explicitType === "countdown" || isCountdownId(newCardId);
        if (!isCountdown) {
            console.warn("[placeCardInUpperCity] Target city is destroyed; skipping placement.", slotIndex);
            return;
        }
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

    // Use the shared resolver so Countdown (tactics) cards are found reliably
    const cardData = findCardInAllSources(newCardId);

    const entryType = explicitType || (isCountdownId(newCardId) ? "countdown" : "villain");
    const entryInst = `inst_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    state.cities[slotIndex] = {
        slotIndex,
        type: entryType,
        id: String(newCardId),
        instanceId: entryInst,
        uniqueId: entryInst
    };

    const entry = state.cities[slotIndex];
    const baseHP = Number((cardData && cardData.hp) || 1);

    if (!state.villainHP) state.villainHP = {};
    const savedHP = state.villainHP[entryInst];
    const currentHP = (typeof savedHP === "number") ? savedHP : baseHP;

    entry.maxHP = baseHP;
    entry.currentHP = currentHP;

    state.villainHP[entryInst] = currentHP;

    // Keep the master card object in sync for panels / re-renders
    if (cardData) {
        cardData.currentHP = currentHP;
    }

    try {
        triggerRuleEffects("henchmanEntered", { entryIndex: slotIndex, entry, cardData, state });
        const syncedHP = entry.currentHP ?? currentHP;
        state.villainHP[entryInst] = syncedHP;
        if (cardData) {
            cardData.currentHP = syncedHP;
        }
    } catch (err) {
        console.warn("[placeCardInUpperCity] Failed to trigger rule effects:", err);
    }

    const effDamage = getEffectiveFoeDamage(entry);

    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";
    wrapper.style.position = "relative";
    wrapper.style.zIndex = "2"; // ensure card sits above destroyed-city overlay

    const renderOverride = cardData
        ? { cardDataOverride: { ...cardData, hp: entry.maxHP, currentHP: entry.currentHP, damage: effDamage, currentDamage: effDamage } }
        : undefined;
    const rendered = renderCard(newCardId, wrapper, renderOverride);
    wrapper.appendChild(rendered);

    area.appendChild(wrapper);

    if (cardData) {
        wrapper.style.cursor = "pointer";
        wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("Villain/Henchmen card clicked (from upper-city placement):", {
                newCardId,
                cardName: cardData.name
            });
            buildVillainPanel(cardData, { instanceId: entryInst, slotIndex });
        });
    } else {
        console.warn("No cardData found for newCardId (upper-city placement):", newCardId);
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
async function handleEnemyEntry(villainId, cardData, state, { fromDeck = false, bonusCharge = 0, forcedTeleport = false } = {}) {
    const hasTeleport = forcedTeleport || cardHasTeleport(cardData);
    const chargeDist = forcedTeleport ? 0 : cardChargeDistance(cardData) + (Number(bonusCharge) || 0);

    if (hasTeleport) {
        const bannerText = getTeleportBannerText(cardData, { forcedTeleport });
        if (bannerText) {
            try { await showMightBanner(bannerText, 2000); } catch (err) { console.warn("[TELEPORT] Failed to show banner", err); }
        }

        const activeOrder = getActiveUpperOrder(state);
        const openSlots = activeOrder.filter(idx => !state.cities?.[idx]);

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
            return { blocked: true, reason: "Teleporter cannot find an open city" };
        }

        const randomIndex = Math.floor(Math.random() * openSlots.length);
        const targetIdx = openSlots[randomIndex];

        state.revealedTopVillain = false;
        placeCardInUpperCity(targetIdx, villainId, state, "villain");
        return { placed: true, blocked: false, teleportTargetIdx: targetIdx };
    }

    if (chargeDist > 0) {
        if (fromDeck) {
            const blocked = isChargeBlockedByFrozen(chargeDist, state);
            if (blocked) {
                console.warn("[VILLAIN DRAW] Charge blocked by frozen foe; revealing top card instead.");
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
                return { blocked: true, reason: "Frozen foe blocking entry" };
            }
        }

        await executeEffectSafely(`charge(${chargeDist})`, cardData, {});
        return { placed: true, blocked: false };
    }

    // NORMAL ENTRY: shove into city 1 using existing shoveUpper logic
    const shoveResult = await shoveUpper(villainId);

    if (shoveResult && shoveResult.blockedFrozen) {
        console.warn("[VILLAIN DRAW] Shove blocked by frozen foe; revealing top card instead.");
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
        return { blocked: true, reason: "Frozen foe blocking entry" };
    }

    return { placed: true, blocked: false };
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

        // Any successful draw should clear prior "top card revealed" state
        gameState.revealedTopVillain = false;

        const data = findCardInAllSources(villainId);
        try {
            triggerRuleEffects("villainDrawn", { state: gameState, cardId: villainId, cardData: data });
        } catch (err) {
            console.warn("[VILLAIN DRAW] villainDrawn trigger failed", err);
        }
        const kind = classifyVillainCard(villainId, data);
        const cardName = data?.name || `Card ${villainId}`;
        let blockedReason = null;
        let handlerResult = null;

        try {
            appendGameLogEntry(`Villain Deck Draw: ${cardName}.`, gameState);
        } catch (err) {
            console.warn("[VILLAIN DRAW] Failed to append game log entry", err);
        }

        try { playSoundEffect("enter"); } catch (_) {}

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
                handlerResult = await handleBystanderDraw(villainId, data, gameState);
                break;
            case "enemy":
                console.log("[VILLAIN DRAW] Hench/Villain card:", villainId, data?.name);
                const hasChargeTactic =
                    Array.isArray(gameState.tactics) &&
                    gameState.tactics.some(id => String(id) === "5409");
                const isVillainCard = String(data?.type || "").toLowerCase() === "villain";
                const forcedTeleport =
                    isVillainCard &&
                    gameState._forceTeleportNextVillain === true &&
                    (!gameState._forceTeleportVillainId || String(gameState._forceTeleportVillainId) === String(villainId));
                gameState._forceTeleportNextVillain = false;
                gameState._forceTeleportVillainId = null;
                const baseCharge = cardChargeDistance(data);
                const bonusCharge = (!forcedTeleport && hasChargeTactic && isVillainCard && baseCharge === 0) ? 1 : 0;
                handlerResult = await handleEnemyEntry(villainId, data, gameState, { fromDeck: true, bonusCharge, forcedTeleport });
                if (handlerResult?.blocked) {
                    blockedReason = handlerResult.reason || "Blocked";
                }
                break;
            default:
                console.warn("[VILLAIN DRAW] Unknown villain deck card type:", villainId, data);
                break;
        }

        if (blockedReason) {
            try {
                appendGameLogEntry(`Villain Deck Blocked: ${blockedReason}.`, gameState);
            } catch (err) {
                console.warn("[VILLAIN DRAW] Failed to append blocked log entry", err);
            }
            break; // stop drawing further cards when the current draw is blocked
        }

        // Post-draw logs for specific behaviors
        if (kind === "bystander" && handlerResult?.captureLog) {
            try {
                appendGameLogEntry(handlerResult.captureLog, gameState);
            } catch (err) {
                console.warn("[BYSTANDER] Failed to append capture log", err);
            }
        }

        if (kind === "enemy" && handlerResult?.teleportTargetIdx != null) {
            try {
                const cityName = getCityNameFromIndex(handlerResult.teleportTargetIdx + 1);
                appendGameLogEntry(`${cardName} teleported to ${cityName}!`, gameState);
            } catch (err) {
                console.warn("[VILLAIN DRAW] Failed to append teleport log", err);
            }
        }
    }

    gameState.isGameStarted = true;
}

/**
 * PUBLIC: Scan forward in the villain deck and return the next `count`
 * henchman/villain ids, advancing the pointer past everything scanned.
 * Used by rally effects.
 */
export function takeNextHenchVillainsFromDeck(count, opts = {}) {
    const { henchmenOnly = false } = opts;
    const deck = gameState.villainDeck;
    if (!Array.isArray(deck) || deck.length === 0) return [];

    let ptr = gameState.villainDeckPointer ?? 0;
    const collected = [];
    const target = Number(count) || 0;
    if (target <= 0) return [];

    while (ptr < deck.length && collected.length < target) {
        const id = deck[ptr];

        // Never skip over countdown cards; stop scanning so villainDraw can pick them up
        if (isCountdownId(id)) {
            break;
        }

        const idStr = String(id);
        const isHench = henchmen.some(h => String(h.id) === idStr);
        const isVill  = villains.some(v => String(v.id) === idStr);

        if (isHench || (!henchmenOnly && isVill)) {
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
    const getOverlordName = () => {
        const ovId = state.currentOverlordId ?? state.overlordId ?? null;
        return state.currentOverlordCard?.name
            || overlords.find(o => String(o.id) === String(ovId))?.name
            || "Overlord";
    };

    // 1) If any hench/villain is on the map, the rightmost captures
    const enemyIdx = getRightmostCapturingEnemyIndex(state);

    if (enemyIdx !== null) {
        if (!Array.isArray(state.cities)) {
            state.cities = new Array(12).fill(null);
        }

        const entry = state.cities[enemyIdx];
        let foeCard = null;
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
            foeCard =
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

        if (entry || foeCard) {
            const foeName = foeCard?.name || entry?.name || "Foe";
            const cityName = getCityNameFromIndex(enemyIdx + 1);
            return { captureLog: `${byName} captured by ${foeName} in ${cityName}.` };
        }

        // Draw is consumed, nothing goes to the board, no shove.
        return { captureLog: null };
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

        return { captureLog: `${byName} captured by ${getOverlordName()}.` };
    }

    // 3) No foes and no Scenario → Overlord immediately KOs the bystander
    ensureKoCards(state);

    // Track only the bystanders KO'd in this resolution for messaging
    const newlyKOd = [{
        id: String(bystanderId),
        name: byName,
        type: "Bystander",
        source: "villainDeck"
    }];

    state.koCards.push(...newlyKOd);
    const totalKOd = state.koCards.filter(c => c && c.type === "Bystander").length;

    try { maybeTriggerEvilWinsConditions(state); } catch (err) { console.warn("[BYSTANDER] Evil Wins check failed", err); }

    let nameList = newlyKOd
        .map(c => (c && c.name ? String(c.name) : "Bystander"))
        .join(", ");

    if (!nameList) nameList = byName;

    const text =
        newlyKOd.length === 1
            ? `${nameList} KO'd`
            : `Bystanders KO'd: ${nameList}`;

    // Use the existing Might banner for the announcement
    try {
        await showMightBanner(text, 2000);
    } catch (err) {
        console.warn("[BYSTANDER] Failed to show KO banner:", err);
    }

    console.log(
        `[BYSTANDER] ${byName} KO'd by Overlord. Total KO'd bystanders: ${totalKOd}.`
    );

    try {
        const ovId = state.currentOverlordId ?? state.overlordId ?? null;
        const ovName = state.currentOverlordCard?.name
            || overlords.find(o => String(o.id) === String(ovId))?.name
            || "Overlord";
        const nameList = newlyKOd.map(c => c?.name || "Bystander").join(", ");
        const logMsg = newlyKOd.length === 1
            ? `${nameList} was KO'd by ${ovName}.`
            : `Bystanders: ${nameList} were KO'd by ${ovName}.`;
        appendGameLogEntry(logMsg, state);
    } catch (err) {
        console.warn("[BYSTANDER] Failed to append KO log", err);
    }

    // Notify rule/overlord listeners that the Overlord directly KO'd a bystander
    try {
        triggerRuleEffects("overlordKosBystander", { state });
    } catch (err) {
        console.warn("[BYSTANDER] overlordKosBystander trigger failed", err);
    }
    // One-shot flag for condition checks
    state._overlordKOdBystander = true;

    return { captureLog: null };
}

export async function startHeroTurn(state, opts = {}) {
    const { skipVillainDraw = false, suppressRoundAdvance = false } = opts;

    if (state.gameOver) {
        console.log("[startHeroTurn] Game is already over; no new hero turn will start.");
        return;
    }

    try {
        triggerRuleEffects("turnStart", { state });
    } catch (err) {
        console.warn("[startHeroTurn] turnStart triggers failed", err);
    }

    // Clear any lingering discard requests from prior turns
    if (state.discardMode) {
        state.discardMode = null;
    }

    const heroIds = state.heroes || [];
    if (!heroIds.length) {
        return;
    }

    // Reset per-turn discard counter for the active hero (will be re-resolved below if index changes)
    let activeHeroId = heroIds[state.heroTurnIndex ?? 0];
    if (activeHeroId && state.heroData?.[activeHeroId]) {
        state.heroData[activeHeroId].discardedThisTurn = 0;
        state.heroData[activeHeroId].drawnThisTurn = 0;
    }

    try { refreshFrozenOverlays(state); } catch (e) {}

    // Update coastal city tracking at the start of each hero turn
    checkCoastalCities(state);

    // Ensure we have a valid index (store ONLY on state)
    const heroCount = heroIds.length;

    if (!Number.isInteger(state.heroTurnIndex)) {
        state.heroTurnIndex = 0;
    }
    if (state.heroTurnIndex < 0 || state.heroTurnIndex >= heroCount) {
        state.heroTurnIndex = 0;
    }

    let heroTurnIndex = state.heroTurnIndex; // local working copy
    const startedAtIndexZero = heroTurnIndex === 0;
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
        checkGameEndConditions(state);
        return;
    }

    // Persist the (possibly advanced) index
    state.heroTurnIndex = heroTurnIndex;
    activeHeroId = heroIds[heroTurnIndex]; // ensure active hero reflects any index skips
    const activeHeroName = heroes.find(h => String(h.id) === String(activeHeroId))?.name || `Hero ${activeHeroId}`;

    if (typeof state.roundNumber !== "number") state.roundNumber = 1;
    if (startedAtIndexZero && !suppressRoundAdvance) {
        appendGameLogEntry(`Start of Round ${state.roundNumber}`, state);
        state.roundNumber += 1;
    }

    appendGameLogEntry(`${activeHeroName} started their turn.`, state);

    try {
        applyNextTurnDoubleDamageIfAny(activeHeroId, state);
    } catch (err) {
        console.warn("[startHeroTurn] Failed to apply pending next-turn double damage.", err);
    }

    // Refresh standard-speed UI immediately when turn starts
    try {
        updateStandardSpeedUI(state, activeHeroId);
    } catch (err) {
        console.warn("[startHeroTurn] updateStandardSpeedUI failed", err);
    }

    // VILLAIN DRAW for this "turn slot" (after logging turn start for ordering)
    if (!skipVillainDraw) {
        const skipCount = Number(state.villainDrawSkipCount) || 0;
        if (skipCount > 0) {
            state.villainDrawSkipCount = Math.max(0, skipCount - 1);
            appendGameLogEntry(`Villain draw skipped. Remaining skips: ${state.villainDrawSkipCount}.`, state);
        } else {
            await villainDraw(1);
        }
    }

    // 3) Normal hero turn setup for the chosen hero
    if (typeof state.turnCounter !== "number") state.turnCounter = 0;
    state.turnCounter++;

    // Reset once-per-turn damage blocks
    if (state.heroData) {
        Object.keys(state.heroData).forEach(hid => {
            if (!state.heroData[hid]) return;
            state.heroData[hid].damageHeroBlockTurnUsed = null;
        });
    }

    currentTurn(heroTurnIndex, heroIds);

    resetHeroCurrentTravelAtTurnStart(state);
    showRetreatButtonForCurrentHero(state);
    resetTurnTimerForHero();

    saveGameState(state);
    initializeTurnUI(state);
    renderHeroHandBar(state);

    await startTravelPrompt(state);

    const activeHeroState = state.heroData?.[activeHeroId];

    // Low HP music toggle for the active hero
    if (activeHeroState) {
        const hpNum = Number(activeHeroState.hp || 0);
        if (typeof window !== "undefined" && typeof window.setLowHpMode === "function") {
            window.setLowHpMode(hpNum > 0 && hpNum <= 3);
        }
    }

    if (activeHeroState && typeof activeHeroState.cityIndex === "number") {
        if (!activeHeroState.hasDrawnThisTurn) {
            const previewCount = Number(activeHeroState.pendingDrawPreviewCount ?? 3) || 3;
            await maybeShowHeroTopPreviewWithBeforeDraw(state, activeHeroId, previewCount);
            activeHeroState.hasDrawnThisTurn = true;
            activeHeroState.pendingDrawPreviewCount = null;
            saveGameState(state);
        }
    }
}

export async function shoveUpper(newCardId) {
    const citySlots = document.querySelectorAll(".city-slot");
    const ACTIVE_UPPER = getActiveUpperOrder(gameState);
    const EXIT_IDX = ACTIVE_UPPER.length ? ACTIVE_UPPER[0] : CITY_EXIT_UPPER;
    if (ACTIVE_UPPER.length === 0) {
        console.warn("[shoveUpper] No active cities available to place foe.");
        return { placed: false, blockedFrozen: false };
    }

    // Ensure cities array exists and has room
    if (!Array.isArray(gameState.cities)) {
        gameState.cities = new Array(12).fill(null);
    }

    // UPPER_ORDER is [EXIT, 5, 4, 3, 2, ENTRY]
    const ENTRY_IDX = ACTIVE_UPPER.length ? ACTIVE_UPPER[ACTIVE_UPPER.length - 1] : CITY_ENTRY_UPPER;

    // Build a snapshot of current upper-row state (DOM + model)
    const snapshot = {};
    ACTIVE_UPPER.forEach(idx => {
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
        const pos = ACTIVE_UPPER.indexOf(idx);
        if (pos <= 0) return null; // EXIT has no left neighbor
        return ACTIVE_UPPER[pos - 1];
    }

    // moveMap: fromUpperIdx -> destUpperIdx (or null for off-board)
    const moveMap = {};
    let blockedFrozen = false;

    // Recursive shove, based entirely on the snapshot:
    // - We only push something if it was there at the start of the shove.
    // - Chain stops at the first empty city.
    function shoveFrom(idx) {
        const snap = snapshot[idx];
        if (!snap || !snap.cardNode) return false;

        if (entryIsFrozen(snap.model, idx, gameState)) {
            blockedFrozen = true;
            return false;
        }

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
            const exitSnap = snapshot[EXIT_IDX];
            if (exitSnap && exitSnap.cardNode && entryIsFrozen(exitSnap.model, EXIT_IDX, gameState)) {
                blockedFrozen = true;
                return false;
            }
        // Move this card into EXIT.
        moveMap[idx] = EXIT_IDX;
        return true;
    }

        // For all other intermediate cities:
        // If there was a card at nextIdx in the snapshot, shove that one first.
        if (nextSnap && nextSnap.cardNode) {
            const ok = shoveFrom(nextIdx);
            if (!ok && blockedFrozen) return false;
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

    // If frozen blockage detected, abort the shove and signal up.
    if (blockedFrozen) {
        return { placed: false, blockedFrozen: true };
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

    for (const fromIdx of ACTIVE_UPPER) {
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
                if (!gameState.cities[toIdx].instanceId) {
                    const genInst = `inst_${Date.now()}_${Math.random().toString(16).slice(2)}`;
                    gameState.cities[toIdx].instanceId = genInst;
                    if (!gameState.cities[toIdx].uniqueId) {
                        gameState.cities[toIdx].uniqueId = genInst;
                    }
                }
                try {
                    const cardId = gameState.cities[toIdx].baseId ?? gameState.cities[toIdx].id;
                    const cardData = findCardInAllSources(cardId);
                    cardNode.style.cursor = "pointer";
                    cardNode.addEventListener("click", (e) => {
                        e.stopPropagation();
                        if (cardData) {
                            buildVillainPanel(cardData, { instanceId: gameState.cities[toIdx].instanceId, slotIndex: toIdx });
                        }
                    });
                } catch (err) {
                    console.warn("[shoveUpper] Failed to rebind villain click after move.", err);
                }
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

    const entryType = isCountdownId(newCardId) ? "countdown" : "villain";
    const entryInst = `inst_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    gameState.cities[ENTRY_IDX] = {
        slotIndex: ENTRY_IDX,
        type: entryType,
        id: String(newCardId),
        instanceId: entryInst,
        uniqueId: entryInst
    };

    const entry = gameState.cities[ENTRY_IDX];

    const cardData =
        henchmen.find(h => h.id === newCardId) ||
        villains.find(v => v.id === newCardId);

    const baseHP = Number((cardData && cardData.hp) || 1);
    if (!gameState.villainHP) gameState.villainHP = {};
    const savedHP = gameState.villainHP[entryInst];
    let currentHP = typeof savedHP === "number" ? savedHP : baseHP;

    entry.maxHP = baseHP;
    entry.currentHP = currentHP;

    gameState.villainHP[entryInst] = currentHP;
    if (cardData) cardData.currentHP = currentHP;

    try {
        triggerRuleEffects("henchmanEntered", { entryIndex: ENTRY_IDX, entry, cardData, state: gameState });
        const syncedHP = entry.currentHP ?? currentHP;
        gameState.villainHP[entryInst] = syncedHP;
        if (cardData) {
            cardData.currentHP = syncedHP;
        }
    } catch (err) {
        console.warn("[shoveUpper] Failed to trigger rule effects:", err);
    }

    const effDamage = getEffectiveFoeDamage(entry);

    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper city-card-enter";

    const renderOverride = cardData
        ? { cardDataOverride: { ...cardData, hp: entry.maxHP, currentHP: entry.currentHP, damage: effDamage, currentDamage: effDamage } }
        : undefined;
    const rendered = renderCard(newCardId, wrapper, renderOverride);
    wrapper.appendChild(rendered);

    if (entryAreaFinal) {
        entryAreaFinal.appendChild(wrapper);
    }

    if (cardData) {
        wrapper.style.cursor = "pointer";
        wrapper.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("Villain/Henchmen card clicked (from shoveUpper):", {
                newCardId,
                cardName: cardData.name
            });
            buildVillainPanel(cardData, { instanceId: entryInst, slotIndex: ENTRY_IDX });
        });
    } else {
        console.warn("No cardData found for newCardId:", newCardId);
    }

    saveGameState(gameState);

    setTimeout(() => {
        wrapper.classList.remove("city-card-enter");
    }, 650);

    return { placed: true, blockedFrozen: false };
}

// Check if a charge draw from the deck would be blocked by a frozen foe.
function isChargeBlockedByFrozen(distance, state = gameState) {
    const cities = Array.isArray(state.cities) ? state.cities : [];
    const entryIdx = CITY_ENTRY_UPPER;

    // Simulate the shove needed to clear ENTRY
    const snapshot = {};
    UPPER_ORDER.forEach(idx => snapshot[idx] = cities[idx] || null);

    // First, see if we can make room in ENTRY without moving a frozen card
    if (snapshot[entryIdx]) {
        if (entryIsFrozen(snapshot[entryIdx], entryIdx, state)) return true;

        // Walk left until an empty slot; block if any frozen is encountered on the way
        const entryPos = UPPER_ORDER.indexOf(entryIdx);
        let emptyPos = -1;
        for (let pos = entryPos - 1; pos >= 0; pos--) {
            const idx = UPPER_ORDER[pos];
            const occ = snapshot[idx];
            if (!occ) { emptyPos = pos; break; }
            if (entryIsFrozen(occ, idx, state)) return true;
        }
        if (emptyPos === -1) {
            // No empties; shove would push off EXIT; if EXIT is frozen, blocked
            const exitOcc = snapshot[CITY_EXIT_UPPER];
            if (entryIsFrozen(exitOcc, CITY_EXIT_UPPER, state)) return true;
        }
    }

    return false;
}

export function initializeTurnUI(gameState) {
    const endTurnBtn = document.getElementById("end-turn-button");
    if (!endTurnBtn) return;

    const topVillainBtn = document.getElementById("top-villain-button");
    if (topVillainBtn) {
        topVillainBtn.style.display = gameState.revealedTopVillain ? "flex" : "none";
    }

    // 1. Find the active turn slot
    const activeSlot = document.querySelector("#heroes-row .hero-slot.active-turn-slot");
    if (!activeSlot) {
        endTurnBtn.style.display = "none";
        return;
    }

    // 2. Find its index in the heroes-row
    const slots = [...document.querySelectorAll("#heroes-row .hero-slot")];
    const slotIndex = slots.indexOf(activeSlot);
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

    updateStandardSpeedUI(gameState, activeHeroId);

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

export async function endCurrentHeroTurn(gameState) {
    if (gameState.gameOver) {
        console.log("[endCurrentHeroTurn] Game is already over; ignoring end-turn.");
        return;
    }

    if (turnTimerInterval) clearInterval(turnTimerInterval);

    // Clear any pending forced discards so they don't carry into the next hero's turn
    if (gameState.discardMode) {
        gameState.discardMode = null;
    }
    const heroIds = gameState.heroes || [];
    const heroCount = heroIds.length;
    if (!heroCount) return;

    let currentIdx = Number.isInteger(gameState.heroTurnIndex)
        ? gameState.heroTurnIndex
        : 0;

    if (currentIdx < 0 || currentIdx >= heroCount) {
        currentIdx = 0;
    }

    const heroId = heroIds[currentIdx];
    if (!heroId) return;

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.error("No heroState for heroId", heroId, gameState.heroData);
        return;
    }
    const heroObj = heroes.find(h => String(h.id) === String(heroId)) || {};

    const clearDampenersIfExpired = () => {
        const turnCount = typeof gameState.turnCounter === "number" ? gameState.turnCounter : 0;
        if (gameState.extraTravelDampener?.active) {
            const expiresAt = gameState.extraTravelDampener.expiresAtTurnCounter;
            if (typeof expiresAt === "number" && turnCount >= expiresAt) {
                gameState.extraTravelDampener = null;
                appendGameLogEntry(`Travel dampener ended.`, gameState);
            }
        }
        if (gameState.extraDrawDampener?.active) {
            const expiresAt = gameState.extraDrawDampener.expiresAtTurnCounter;
            if (typeof expiresAt === "number" && turnCount >= expiresAt) {
                gameState.extraDrawDampener = null;
                appendGameLogEntry(`Draw dampener ended.`, gameState);
            }
        }
        if (gameState.iconAbilityDampener?.active) {
            const expiresAt = gameState.iconAbilityDampener.expiresAtTurnCounter;
            if (typeof expiresAt === "number" && turnCount >= expiresAt) {
                gameState.iconAbilityDampener = null;
                appendGameLogEntry(`Icon ability dampener ended.`, gameState);
            }
        }
        if (gameState.retreatDampener?.active) {
            const expiresAt = gameState.retreatDampener.expiresAtTurnCounter;
            if (typeof expiresAt === "number" && turnCount >= expiresAt) {
                gameState.retreatDampener = null;
                appendGameLogEntry(`Retreat dampener ended.`, gameState);
            }
        }
        pruneHeroProtections(gameState);
        if (Array.isArray(gameState.doubleDamageHeroModifiers)) {
            const before = gameState.doubleDamageHeroModifiers.length;
            const filtered = gameState.doubleDamageHeroModifiers.filter(mod => {
                if (!mod) return false;
                if (typeof mod.expiresAtTurnCounter === "number" && turnCount >= mod.expiresAtTurnCounter) return false;
                return true;
            });
            const removed = before - filtered.length;
            gameState.doubleDamageHeroModifiers = filtered;
            if (removed > 0) {
                appendGameLogEntry(`Double-damage effects expired.`, gameState);
            }
        }
        pruneFoeDoubleDamage(gameState);
        if (Array.isArray(gameState.halfDamageModifiers)) {
            const before = gameState.halfDamageModifiers.length;
            gameState.halfDamageModifiers = gameState.halfDamageModifiers.filter(mod => {
                if (!mod) return false;
                if (typeof mod.expiresAtTurnCounter === "number" && turnCount >= mod.expiresAtTurnCounter) {
                    return false;
                }
                return true;
            });
            const removed = before - gameState.halfDamageModifiers.length;
            if (removed > 0) {
                appendGameLogEntry(`Half-damage effects expired.`, gameState);
            }
        }
    };

    if (!heroState.deck || heroState.deck.length === 0) {
        if (heroState.discard && heroState.discard.length > 0) {
            const permaCountMap = buildPermanentKOCountMap(heroState);
            const toDeck = [];
            const remainDiscard = [];

            heroState.discard.forEach(id => {
                const key = String(id);
                const remain = permaCountMap[key] || 0;
                if (remain > 0) {
                    permaCountMap[key] = remain - 1;
                    remainDiscard.push(id);
                } else {
                    toDeck.push(id);
                }
            });

            heroState.deck = shuffle(toDeck);
            heroState.discard = remainDiscard;
        }
    }

    // Clear any pending damageFoe selection at end of turn
    try { if (typeof window !== "undefined") window.__damageFoeSelectMode = null; } catch (e) {}
    // Clear any pending freezeVillain(any) selection at end of turn
    try { if (typeof window !== "undefined") window.__freezeSelectMode = null; } catch (e) {}
    // Clear any pending knockback selection at end of turn
    try { if (typeof window !== "undefined") window.__knockbackSelectMode = null; } catch (e) {}
    // Clear any pending givePassive selection at end of turn
    try { if (typeof window !== "undefined") window.__givePassiveSelectMode = null; } catch (e) {}
    gameState.pendingKnockback = null;
    // Clear any target highlights for damage selection
    try { if (typeof window !== "undefined" && typeof window.__clearDamageFoeHighlights === "function") window.__clearDamageFoeHighlights(); } catch (e) {}

    // Reset last damage causer at start of end-turn damage check
    gameState.lastDamageCauser = null;

    // Run team-specific end-turn triggers (e.g., teamHeroEndTurn(Bat))
    try {
        triggerRuleEffects(`teamHeroEndTurn(${heroObj.team || heroObj.heroTeam || heroObj.faction || ""})`, { currentHeroId: heroId, state: gameState });
    } catch (err) {
        console.warn("[endCurrentHeroTurn] teamHeroEndTurn triggers failed", err);
    }

    // Clear travel/draw dampeners if expiring after this turn
    clearDampenersIfExpired();
    try { await runTurnEndDamageTriggers(gameState); } catch (e) { console.warn("[endCurrentHeroTurn] turnEndWasDamaged triggers failed", e); }
    try { await runOverlordTurnEndAttackedTriggers(heroId, gameState); } catch (e) { console.warn("[endCurrentHeroTurn] overlord turnEndWasAttacked triggers failed", e); }
    try { await runTurnEndNotEngagedTriggers(gameState); } catch (e) { console.warn("[endCurrentHeroTurn] turnEndNotEngaged triggers failed", e); }
    try { triggerRuleEffects("turnEnd", { state: gameState }); } catch (e) { console.warn("[endCurrentHeroTurn] turnEnd triggers failed", e); }

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
                const foeDamage = getSlotFoeDamage(slotEntry, foe);
                console.log("[RETREAT FAIL] Effective foe damage (after passives)", { foeDamage, foeId, entryKey: slotEntry?.instanceId ?? slotEntry?.uniqueId ?? null, damagePenalty: slotEntry?.damagePenalty, currentDamage: slotEntry?.currentDamage });
                console.log("[END TURN DAMAGE] Effective foe damage (after passives)", { foeDamage, foeId, entryKey: slotEntry?.instanceId ?? slotEntry?.uniqueId ?? null, damagePenalty: slotEntry?.damagePenalty, currentDamage: slotEntry?.currentDamage });

                // HERO DAMAGE THRESHOLD
                const heroObj = heroes.find(h => String(h.id) === String(heroId));
                const heroName = heroObj?.name || `Hero ${heroId}`;
                const dt = getCurrentHeroDT(heroId, gameState);

                // Only deal damage if foeDamage >= DT
                if (foeDamage >= dt) {
                    let blockedByProtection = false;
                    if (consumeHeroProtectionIfAny(heroId, gameState)) {
                        gameState.pendingDamageHero = null;
                        blockedByProtection = true;
                    }
                    if (blockedByProtection) {
                        // skip damage application
                    } else {
                    const entryKey = slotEntry?.instanceId ?? slotEntry?.uniqueId ?? null;
                    gameState.lastDamageCauser = {
                        foeId,
                        slotIndex: foeIdx,
                        instanceId: entryKey
                    };
                    console.log("[END TURN DAMAGE] Recorded lastDamageCauser", gameState.lastDamageCauser);

                    flagPendingHeroDamage(heroId, foeDamage, foe.name, gameState);
                    const blocked = await tryBlockPendingHeroDamage(gameState);
                    const pending = gameState.pendingDamageHero;

                    if (!blocked && pending) {
                        const beforeHP = heroState.hp;
                        heroState.hp = Math.max(0, heroState.hp - foeDamage);
                        const applied = Math.max(0, Math.min(foeDamage, beforeHP));
                        playDamageSfx(applied);
                        flashScreenRed();
                        appendGameLogEntry(`${heroName} took ${foeDamage} damage from ${foe.name}.`, gameState);
                    } else {
                        // Cleared by block
                        gameState.pendingDamageHero = null;
                    }

                    if (heroState.hp <= 0) {
                        heroState.hp = 0;
                        updateHeroHPDisplays(heroId);
                        updateBoardHeroHP(heroId);

                        console.log(
                            `[END TURN] ${heroObj?.name} takes ${foeDamage} damage from ${foe.name} in city ${heroState.cityIndex}.`
                            + ` (DT=${dt}) → KO!`
                        );

                        handleHeroKnockout(heroId, heroState, gameState, { source: "endTurnDamage", sourceName: foe.name });
                    } else {
                        try { ejectHeroIfCauserHasEject(heroId, gameState); } catch (err) { console.warn("[endCurrentHeroTurn] Eject handling failed", err); }
                        updateHeroHPDisplays(heroId);
                        updateBoardHeroHP(heroId);

                        console.log(
                            `[END TURN] ${heroObj?.name} takes ${foeDamage} damage from ${foe.name} in city ${heroState.cityIndex}.`
                            + ` (DT=${dt})`
                        );
                    }

                    }

                    // Fire any pending end-of-turn damage triggers for this hero
                    if (Array.isArray(heroState.pendingEndTurnDamageEffects) && heroState.pendingEndTurnDamageEffects.length) {
                        console.log("[END TURN DAMAGE] Firing pending damagedAtTurnEnd effects", heroState.pendingEndTurnDamageEffects);
                        const effectsToRun = [...heroState.pendingEndTurnDamageEffects];
                        heroState.pendingEndTurnDamageEffects = [];
                        effectsToRun.forEach(eff => {
                            try {
                                executeEffectSafely(eff.effect, heroes.find(h => String(h.id) === String(heroId)), {
                                    currentHeroId: heroId,
                                    state: gameState,
                                    selectedFoeSummary: {
                                        foeId,
                                        slotIndex: foeIdx,
                                        instanceId: entryKey,
                                        foeName: foe?.name || `Enemy ${foeId}`,
                                        foeType: foe?.type || "Enemy",
                                        source: "city-upper"
                                    }
                                });
                                console.log("[END TURN DAMAGE] Executed pending effect", eff);
                            } catch (e) {
                                console.warn("[END TURN DAMAGE] Failed to run pending damage effect", e);
                            }
                        });
                    }

                    gameState.pendingDamageHero = null;
                } else {
                    console.log(
                        `[END TURN] ${heroObj?.name} ignores ${foe.name}'s damage `
                        + `(foeDamage=${foeDamage} < DT=${dt}).`
                    );
                }
            } else {
                gameState.lastDamageCauser = null;
            }
        }
    }

    // Clear any pending end-of-turn damage hooks if no damage was applied
    if (Array.isArray(heroState.pendingEndTurnDamageEffects)) {
        if (heroState.pendingEndTurnDamageEffects.length) {
            console.log("[END TURN DAMAGE] Clearing pending end-of-turn damage effects without firing", heroState.pendingEndTurnDamageEffects);
        }
        heroState.pendingEndTurnDamageEffects = [];
    }

    heroState.hasDrawnThisTurn = false;

    if (Array.isArray(heroState.hand) && heroState.hand.length > 0) {
        heroState.discard = heroState.discard || [];

        const newHand = [];
        heroState.hand.forEach(cardId => {
            const cardData = findCardInAllSources(cardId);
            // Any card with type === "Bystander" stays in hand
            if (cardData && cardData.type === "Bystander") {
                newHand.push(cardId);
            } else {
                heroState.discard.push(cardId);
            }
        });

        heroState.hand = newHand;
    }

    heroState.discard = heroState.discard || [];
    console.log(
        `[END TURN] ${heroes.find(h => String(h.id) === String(heroId))?.name}'s discard pile:`,
        heroState.discard
    );

    const endTurnHeroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
    appendGameLogEntry(`${endTurnHeroName} ended their turn.`, gameState);

    // Handle temporary freezes tied to this hero (remove after their next turn)
    processTempFreezesForHero(heroId, gameState);
    processTempPassivesForHero(heroId, gameState);
    cleanupExpiredHeroPassives(heroId, gameState);

    const pendingExtra = gameState.pendingExtraTurn;
    const targetIdx = pendingExtra
        ? heroIds.findIndex(id => String(id) === String(pendingExtra.targetHeroId))
        : -1;

    // If the triggering hero just ended their turn, insert the pending extra turn next.
    if (pendingExtra && !pendingExtra.consumed && String(pendingExtra.sourceHeroId) === String(heroId)) {
        if (targetIdx === -1) {
            console.warn("[endCurrentHeroTurn] Pending extra turn target not found; clearing.");
            gameState.pendingExtraTurn = null;
        } else {
            const resumeIndex = Number.isInteger(pendingExtra.resumeIndex)
                ? pendingExtra.resumeIndex
                : ((currentIdx + 1) % heroCount);
            gameState.pendingExtraTurn = {
                ...pendingExtra,
                consumed: true,
                resumeIndex
            };
            gameState.heroTurnIndex = targetIdx;
            saveGameState(gameState);
            startHeroTurn(gameState, { skipVillainDraw: true, suppressRoundAdvance: true });
            initializeTurnUI(gameState);
            return;
        }
    }

    // If the extra turn hero just ended their bonus turn, resume normal order.
    if (pendingExtra && pendingExtra.consumed && String(pendingExtra.targetHeroId) === String(heroId)) {
        const resumeIndex = Number.isInteger(pendingExtra.resumeIndex)
            ? pendingExtra.resumeIndex
            : ((currentIdx + 1) % heroCount);
        gameState.pendingExtraTurn = null;
        gameState.heroTurnIndex = resumeIndex;
        saveGameState(gameState);
        startHeroTurn(gameState);
        initializeTurnUI(gameState);
        return;
    }
    // If pending extra turn exists but was never consumed (e.g., restored mid-flow) and we're at the target hero,
    // honor it now but still skip villain draw.
    if (pendingExtra && !pendingExtra.consumed && String(pendingExtra.targetHeroId) === String(heroId)) {
        const resumeIndex = Number.isInteger(pendingExtra.resumeIndex)
            ? pendingExtra.resumeIndex
            : ((currentIdx + 1) % heroCount);
        gameState.pendingExtraTurn = { ...pendingExtra, consumed: true, resumeIndex };
        saveGameState(gameState);
        startHeroTurn(gameState, { skipVillainDraw: true, suppressRoundAdvance: true });
        initializeTurnUI(gameState);
        return;
    }

    const nextIdx = (currentIdx + 1) % heroCount;

    gameState.heroTurnIndex = nextIdx;

    saveGameState(gameState);

    try { refreshFrozenOverlays(gameState); } catch (e) {}

    if (!gameState.gameOver) {
        startHeroTurn(gameState);
        initializeTurnUI(gameState);
    }
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

    const heroObj  = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    // Always start from a clean outline state; centralized refresher will redraw as needed.
    refreshAllCityOutlines(gameState, { clearOnly: true });

    if (heroState.cityIndex != null) {
        console.log(
            `[TRAVEL] ${heroName} currently in city ${heroState.cityIndex}. `
            + `Binding travel UI from existing state.`
        );
    }

    // NOTE: Facing overlord is "not in a city" but still allowed to travel.
    if (heroState.isFacingOverlord) {
        console.log(
            `[TRAVEL] ${heroName} is facing the Overlord and can still `
            + `spend travel to move to a city.`
        );
    }

    // ----------------------------------------------------------------
    // Ensure every .city-slot knows its numeric index (used later in clicks)
    // ----------------------------------------------------------------
    const citySlots = document.querySelectorAll(".city-slot");
    citySlots.forEach((slot, idx) => {
        if (slot.dataset.cityIndex == null) {
            slot.dataset.cityIndex = String(idx);
        }
    });

    // ----------------------------------------------------------------
    // Step 1: compute legal targets for the *current* hero (for highlights)
    // ----------------------------------------------------------------
    const initialTargets = computeHeroTravelLegalTargets(gameState, heroId) || [];

    // ----------------------------------------------------------------
    // Step 2: attach a generic click handler ONCE per lower slot
    //         The handler always uses the *currently active* hero.
    // ----------------------------------------------------------------
    initialTargets.forEach(target => {
        const lowerSlot = target.lowerSlot;
        if (!lowerSlot) return;

        // Only attach once per DOM element
        if (lowerSlot.dataset.travelHandlerAttached === "true") {
            return;
        }
        lowerSlot.dataset.travelHandlerAttached = "true";

        lowerSlot.addEventListener("click", () => {
            // Figure out who is active *right now*
            const heroIds = gameState.heroes || [];
            const activeIdx = gameState.heroTurnIndex ?? 0;
            const activeHeroId = heroIds[activeIdx];

            if (activeHeroId == null) {
                console.warn("[TRAVEL] Click on city but no active hero.");
                return;
            }

            const latestHeroState = gameState.heroData?.[activeHeroId];
            if (!latestHeroState) {
                console.warn("[TRAVEL] Click on city but no heroState for active hero", activeHeroId);
                return;
            }

            const lowerIndex = Number(lowerSlot.dataset.cityIndex);

            // Recompute legal targets for the ACTIVE hero and confirm this city is legal
            const legalTargets = computeHeroTravelLegalTargets(gameState, activeHeroId) || [];
            const isLegal = legalTargets.some(t => t.lowerIndex === lowerIndex);

            if (!isLegal) {
                console.log("[TRAVEL] Clicked city", lowerIndex,
                    "is not a legal destination for hero", activeHeroId);
                return;
            }

            // Enforce travel budget from the *current* hero
            const currentTravel =
                typeof latestHeroState.currentTravel === "number"
                    ? latestHeroState.currentTravel
                    : (typeof latestHeroState.travel === "number"
                        ? latestHeroState.travel
                        : 0);

            if (currentTravel <= 0) {
                const activeHeroObj  = heroes.find(h => String(h.id) === String(activeHeroId));
                const activeHeroName = activeHeroObj?.name || `Hero ${activeHeroId}`;

                console.log(
                    `[TRAVEL] ${activeHeroName} has no travel left (currentTravel=${currentTravel}). `
                    + "Click ignored."
                );

                hideTravelHighlights();
                refreshAllCityOutlines(gameState, { clearOnly: true });
                return;
            }

            // Now open the confirmation popup for the *current* hero
            showTravelPopup(gameState, activeHeroId, lowerIndex);
        });
    });

    // ----------------------------------------------------------------
    // Step 3: redraw outlines for the current hero
    // ----------------------------------------------------------------
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

async function performHeroStartingTravel(gameState, heroId, cityIndex) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    // Clear only this hero's pending travel decision log if present
    if (gameState.pendingTravelLog && String(gameState.pendingTravelLog.heroId) === String(heroId)) {
        removeGameLogEntryById(gameState.pendingTravelLog.id, gameState);
        gameState.pendingTravelLog = null;
    }

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
        heroState.currentTravel = beforeTravel;
    }
    heroState.travelUsedThisTurn = (heroState.travelUsedThisTurn || 0) + 1;

    const afterTravel = heroState.currentTravel;

    console.log(
        `[TRAVEL] ${heroName} traveling to city ${cityIndex}. ` +
        `currentTravel before=${beforeTravel}, after=${afterTravel}.`
    );

    try { playSoundEffect("enter"); } catch (_) {}

    initializeTurnUI(gameState);

    // Remember where they were before this travel
    const previousIndex = heroState.cityIndex ?? null;

    // =========================================================
    // EXITING A CITY COUNTS AS A RETREAT — MAY TAKE DAMAGE
    // =========================================================
    if (typeof previousIndex === "number" && previousIndex !== cityIndex) {
        console.log(
            `[EXIT-RETREAT] ${heroName} is leaving city ${previousIndex} to travel to city ${cityIndex}.`
        );

        const okToLeave = await attemptLeaveCityAsRetreat(
            gameState,
            heroId,
            previousIndex,
            "travel->city"
        );

        if (!okToLeave) {
            console.log(
                `[EXIT-RETREAT] ${heroName} was KO'd while attempting to leave city ${previousIndex}. Travel aborted.`
            );
            hideTravelHighlights();
            clearCityHighlights();
            renderHeroHandBar(gameState);
            saveGameState(gameState);
            return;
        }
    }

    // Record hero location in the model
    heroState.cityIndex = cityIndex;

    // === CLEAN UP ANY EXISTING COPIES OF THIS HERO ON THE BOARD ===
    const citySlots = document.querySelectorAll(".city-slot");

    if (previousIndex !== null && citySlots[previousIndex]) {
        const prevArea = citySlots[previousIndex].querySelector(".city-card-area");
        if (prevArea) prevArea.innerHTML = "";
    }

    const allWrappers = document.querySelectorAll(".city-slot .card-wrapper");

    allWrappers.forEach(wrapper => {
        const wrapperId =
            wrapper.getAttribute("data-card-id") ||
            wrapper.dataset.cardId ||
            wrapper.getAttribute("data-id") ||
            wrapper.dataset.id;

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

    area.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");
    wrapper.style.cursor = "pointer";

    const rendered = renderCard(heroId, wrapper);
    wrapper.appendChild(rendered);
    wrapper.setAttribute("data-card-id", String(heroId));
    area.appendChild(wrapper);

    const heroData = heroes.find(h => String(h.id) === String(heroId));
    if (heroData) {
        bindCityHeroClick(wrapper, heroData, heroId, cityIndex);
    }

    showRetreatButtonForCurrentHero(gameState);

    if (!heroState.hasDrawnThisTurn) {
        const previewCount = Number(heroState.pendingDrawPreviewCount ?? 3) || 3;
        await maybeShowHeroTopPreviewWithBeforeDraw(gameState, heroId, previewCount);
        heroState.hasDrawnThisTurn = true;
        heroState.pendingDrawPreviewCount = null;
    }

    renderHeroHandBar(gameState);

    const remainingDestinations = recomputeCurrentHeroTravelDestinations(gameState);
    console.log(
        "[performHeroStartingTravel] remaining destinations after move:",
        remainingDestinations
    );

    try { refreshFrozenOverlays(gameState); } catch (e) {}
    try { updateStandardSpeedUI(gameState, heroId); } catch (e) { console.warn("[TRAVEL] updateStandardSpeedUI failed", e); }

    const cityName = getCityNameFromIndex(cityIndex);
    const foeSlotIdx = cityIndex - 1;
    const foeEntry = Array.isArray(gameState.cities) ? gameState.cities[foeSlotIdx] : null;
    const foeName = foeEntry
        ? (henchmen.find(h => String(h.id) === String(foeEntry.id))?.name
            || villains.find(v => String(v.id) === String(foeEntry.id))?.name
            || `Enemy ${foeEntry.id}`)
        : "no foe";
    appendGameLogEntry(`${heroName} traveled to ${cityName} to engage ${foeName}.`, gameState);

    saveGameState(gameState);
}


let turnTimerInterval = null;

export function resetTurnTimerForHero(overrideSeconds = null) {
    const timerBox = document.getElementById("bottom-turn-timer");
    if (!timerBox) return;

    if (isSinglePlayer) {
        timerBox.style.display = "none";
        if (turnTimerInterval) clearInterval(turnTimerInterval);
        gameState.turnTimerRemaining = null;
        return;
    }
    else if (isMultiplayer) {
        timerBox.style.display = "block";

        let remaining = Number.isFinite(overrideSeconds)
            ? Math.max(0, overrideSeconds)
            : (Number.isFinite(gameState.turnTimerRemaining) ? Math.max(0, gameState.turnTimerRemaining) : 180); // 3 minutes in seconds
        timerBox.textContent = formatTimer(remaining);
        gameState.turnTimerRemaining = remaining;

        if (turnTimerInterval) clearInterval(turnTimerInterval);

        turnTimerInterval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(turnTimerInterval);
                timerBox.textContent = "00:00";
                gameState.turnTimerRemaining = 0;
                autoEndTurnDueToTimeout();
                return;
            }
            timerBox.textContent = formatTimer(remaining);
            gameState.turnTimerRemaining = remaining;
        }, 1000);
    }
}

function formatTimer(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

async function autoEndTurnDueToTimeout() {
    const gs = window.gameState;
    await endCurrentHeroTurn(gs);
    gameState.turnTimerRemaining = null;
}

function showTravelPopup(gameState, heroId, cityIndex) {
    const overlay = document.getElementById("travel-popup-overlay");
    const text = document.getElementById("travel-popup-text");
    const yesBtn = document.getElementById("travel-popup-yes");
    const noBtn = document.getElementById("travel-popup-no");

    const cityName = getCityNameFromIndex(cityIndex);

    const heroObj  = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    text.textContent = `${heroName}: Travel to ${cityName}?`;

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

    const heroList = (typeof window !== "undefined" && Array.isArray(window.heroes))
        ? window.heroes
        : (typeof heroes !== "undefined" ? heroes : []);

    const heroObj  = heroList.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    const titleEl = overlay.querySelector("#face-overlord-popup-box > div");
    if (titleEl) {
        titleEl.textContent = `${heroName}: Engage the Overlord?`;
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

export function getCityNameFromIndex(idx) {
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

export function updateHeroHPDisplays(heroId) {
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
    const s = state || gameState;

    // --------------------------------------------------------
    // 1) If a Scenario is active, treat it as the current target
    // --------------------------------------------------------
    if (s && s.activeScenarioId != null && Array.isArray(s.scenarioStack) && s.scenarioStack.length > 0) {
        const scenId = String(s.activeScenarioId);

        // Make sure the activeScenarioId is actually in the stack
        if (s.scenarioStack.some(id => String(id) === scenId)) {
            const scenarioCard = scenarios.find(sc => String(sc.id) === scenId);
            if (scenarioCard) {
                const baseHP = Number(scenarioCard.hp || 0) || 0;

                if (!s.scenarioHP) {
                    s.scenarioHP = {};
                }

                let currentHP = s.scenarioHP[scenId];
                if (typeof currentHP !== "number") {
                    currentHP = baseHP;
                    s.scenarioHP[scenId] = currentHP;
                }

                // Same semantics as Overlord cap: 2x base HP (if you ever need it)
                const cap = baseHP * 2;

                // Keep the runtime card object in sync
                scenarioCard.currentHP = currentHP;

                return {
                    id: scenId,
                    card: scenarioCard,
                    baseHP,
                    currentHP,
                    cap,
                    kind: "scenario"
                };
            }
        }
    }

    // --------------------------------------------------------
    // 2) No active Scenario → original Overlord logic
    // --------------------------------------------------------
    if (!Array.isArray(s.overlords) || s.overlords.length === 0) {
        return null;
    }

    const ovId = String(s.overlords[0]);

    // Overlord may be an Overlord card *or* a Villain (after takeover)
    let card =
        overlords.find(o => String(o.id) === ovId) ||
        villains.find(v => String(v.id) === ovId);

    if (!card) return null;

    const baseHP = Number(card.hp || 0);
    if (!s.overlordHP) {
        s.overlordHP = {};
    }

    let currentHP = s.overlordHP[ovId];
    if (typeof currentHP !== "number") {
        currentHP = baseHP;
        s.overlordHP[ovId] = currentHP;
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
        cap,
        kind: "overlord"
    };
}


function freezeGameAndSetupQuitButton(state) {
    const s = state || gameState;

    // 1) Disable board interactions
    try {
        const board = document.getElementById("game-board");
        if (board) {
            board.style.pointerEvents = "none";
        }

        const grid = document.getElementById("city-grid");
        if (grid) {
            grid.style.pointerEvents = "none";
        }
    } catch (err) {
        console.warn("[GameOver] Failed to disable board interactions", err);
    }

    // 2) Disable End Turn button
    try {
        const endTurnBtn = document.getElementById("end-turn-button");
        if (endTurnBtn) {
            endTurnBtn.disabled = true;
        }
    } catch (err) {
        console.warn("[GameOver] Failed to disable end-turn button", err);
    }

    // 3) Collapse side menu and turn hamburger into a single X that quits
    try {
        const menuBtn = document.getElementById("gameMenu-box");
        if (menuBtn && menuBtn.parentNode) {
            const sideMenu = document.getElementById("sideMenu");
            if (sideMenu) {
                sideMenu.classList.remove("open");
            }

            // Clone node to strip existing listeners (menuOpen logic, etc.)
            const newBtn = menuBtn.cloneNode(true);
            menuBtn.parentNode.replaceChild(newBtn, menuBtn);

            newBtn.style.backgroundColor = "red";
            newBtn.textContent = "X";

            newBtn.addEventListener("click", () => {
                clearGameState();
                window.location.href = "index.html";
            });
        }
    } catch (err) {
        console.warn("[GameOver] Failed to set up game-over menu button", err);
    }
}

// Centralized win/loss check
export function checkGameEndConditions(state) {
    const s = state || gameState;
    if (!s) return;

    // Already handled
    if (s.gameOver) {
        return;
    }

    try {
        maybeTriggerEvilWinsConditions(s);
    } catch (err) {
        console.warn("[checkGameEndConditions] Evil Wins check failed", err);
    }

    if (s.gameOver) {
        return;
    }

    let outcome = null;   // "win" | "loss"
    let reason = "";

    if (s.forcedOutcome && s.forcedOutcome.outcome) {
        outcome = s.forcedOutcome.outcome;
        reason = s.forcedOutcome.reason || "";
    }

    // ------------------------------------------------------------
    // WIN CONDITION:
    // Players win when the Overlord index runs dry (no overlords left)
    // ------------------------------------------------------------
    if (Array.isArray(s.overlords) && s.overlords.length === 0) {
        outcome = "win";
        reason = "All Overlords were defeated.";
    }

    // ------------------------------------------------------------
    // LOSS CONDITION #1:
    // All 6 cities are destroyed
    // ------------------------------------------------------------
    if (!outcome) {
        const destroyedMap = s.destroyedCities || {};
        const destroyedCount = Object.keys(destroyedMap).length;

        if (destroyedCount >= 6) {
            outcome = "loss";
            reason = "All 6 cities were destroyed.";
        }
    }

    // ------------------------------------------------------------
    // LOSS CONDITION #2:
    // All heroes are KO'd (hp <= 0 or isKO)
    // ------------------------------------------------------------
    if (!outcome) {
        const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
        if (heroIds.length > 0 && s.heroData) {
            const allKO = heroIds.every(hid => {
                const hState = s.heroData[hid];
                if (!hState || typeof hState !== "object") return false;

                // OLD:
                // const hp = (typeof hState.hp === "number") ? hState.hp : 0;

                // NEW: Coerce to a number, treating invalid/missing as 0
                let hp = 0;
                if (hState.hp != null) {
                    const parsed = Number(hState.hp);
                    hp = Number.isNaN(parsed) ? 0 : parsed;
                }

                // Optionally normalize back into state (helps long-term consistency)
                hState.hp = hp;

                return hp <= 0 || !!hState.isKO;
            });

            if (allKO) {
                outcome = "loss";
                reason  = "All heroes were KO'd.";
            }
        }
    }

    // No end state reached
    if (!outcome) {
        return;
    }

    if (!reason) {
        reason = outcome === "win" ? "All Overlords were defeated." : "Loss condition met.";
    }

    // ------------------------------------------------------------
    // Finalize game over
    // ------------------------------------------------------------
    s.gameOver = true;

    try {
        saveGameState(s);
    } catch (err) {
        console.warn("[GameOver] Failed to save game state", err);
    }

    const outcomeText = (outcome === "win") ? "You Won!" : "You Lost!";

    const heroNameForId = (hid) => {
        const h = heroes.find(x => String(x.id) === String(hid));
        return h?.name || `Hero ${hid}`;
    };

    const getTopStat = (map, getter) => {
        if (!map || typeof map !== "object") return null;
        let topId = null;
        let topVal = -Infinity;
        for (const [hid, val] of Object.entries(map)) {
            const c = getter(val);
            if (typeof c !== "number") continue;
            if (c > topVal) {
                topVal = c;
                topId = hid;
            }
        }
        if (topId == null || topVal < 0) return null;
        return { id: topId, count: topVal };
    };

    const bystanderLeader = getTopStat(s.heroBystandersRescued, v => (v && typeof v.count === "number") ? v.count : 0);
    const koLeader        = getTopStat(s.heroFoesKOd,          v => (v && typeof v.count === "number") ? v.count : 0);
    const dmgLeader       = getTopStat(s.heroDamageToOverlord, v => (typeof v === "number") ? v : 0);

    const bystanderLine = bystanderLeader && bystanderLeader.count > 0
        ? `${heroNameForId(bystanderLeader.id)} rescued the most Bystanders!`
        : "No Bystanders were rescued.";

    const koLine = koLeader && koLeader.count > 0
        ? `${heroNameForId(koLeader.id)} KO'd the most Henchmen and Villains!`
        : "No Henchmen or Villains were KO'd.";

    const dmgLine = dmgLeader && dmgLeader.count > 0
        ? `${heroNameForId(dmgLeader.id)} dealt the most Damage to the Overlord!`
        : "No damage was dealt to the Overlord.";

    const bannerText = `
        <div class="might-banner-main">${outcomeText} - ${reason}</div>
        <div class="might-banner-sub">${bystanderLine}</div>
        <div class="might-banner-sub">${koLine}</div>
        <div class="might-banner-sub">${dmgLine}</div>
    `;

    try {
        // Very long duration as requested
        showMightBanner(bannerText, 999999);
    } catch (err) {
        console.warn("[GameOver] Failed to show game-over banner", err);
    }

    // Campaign progression (only on win)
    if (outcome === "win") {
        try {
            const flag = (typeof localStorage !== "undefined") ? localStorage.getItem("campaignCurrentFlag") : null;
            if (flag) {
                recordCampaignWin(flag);
                try { localStorage.removeItem("campaignCurrentFlag"); } catch (_) {}
            }
        } catch (err) {
            console.warn("[GameOver] Failed to record campaign progression", err);
        }
    }

    freezeGameAndSetupQuitButton(s);
}

export async function startTravelPrompt(gameState) {
    if (gameState?.gameOver) {
        console.log("[TRAVEL] Game is over; suppressing 'Travel Where?' prompt.");
        return;
    }

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
        // Clear any stale pending travel log for this hero.
        if (gameState.pendingTravelLog && String(gameState.pendingTravelLog.heroId) === String(heroId)) {
            gameState.pendingTravelLog = null;
        }
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

    setTimeout(() => {
        showMightBanner("Travel Where?");
    }, 700);

    const pendingId = appendGameLogEntry(
        `${heroName} is deciding where to travel.`,
        gameState,
        { id: `travel-${heroId}` }
    );
    gameState.pendingTravelLog = { id: pendingId, heroId };

    console.log(
        `[TRAVEL] Prompting ${heroName} to choose a travel destination. `
        + `currentTravel=${currentTravel}.`
    );
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
    heroState.travelUsedThisTurn = 0;
    heroState.isFacingOverlord = false;
    refreshOverlordFacingGlow(gameState);

    if (gameState.extraTravelDampener?.active) {
        const flag = String(gameState.extraTravelDampener.target || "").toLowerCase();
        if (flag === "all") {
            heroState.currentTravel = Math.min(heroState.currentTravel, 1);
        }
    }

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

    // If retreat is disabled for this hero, hide the button
    if (retreatDisabledForHero(activeHeroId, gameState)) {
        btn.style.display = 'none';
        console.log(`[RETREAT] ${heroName} cannot retreat (disabled). Button hidden.`);
        return;
    }

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

async function retreatHeroToHQ(gameState, heroId) {
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
                const roll = Math.floor(Math.random() * 6) + 1; // 1-6

                console.log(
                    `[RETREAT] ${heroName} attempts to retreat from ${foe.name} `
                    + `in city ${heroIdx}. Roll=${roll}, needs >= ${retreatTarget}.`
                );

                let success = roll >= retreatTarget;
                if (!success && heroState.succeedNextRetreat) {
                    console.log(`[RETREAT] ${heroName} would fail retreat, but auto-succeeds due to protection.`);
                    heroState.succeedNextRetreat = false;
                    success = true;
                }

                // Only do anything special on a FAILED roll
                if (!success) {
                const foeDamage = getSlotFoeDamage(slotEntry, foe);
                    const dt = getCurrentHeroDT(heroId, gameState);

                    // Match end-of-turn damage behavior: only if foeDamage >= DT
                    if (foeDamage >= dt) {
                        if (consumeHeroProtectionIfAny(heroId, gameState)) {
                            gameState.pendingDamageHero = null;
                            return;
                        }
                        flagPendingHeroDamage(heroId, foeDamage, foe.name, gameState);
                        const blocked = await tryBlockPendingHeroDamage(gameState);
                        const pending = gameState.pendingDamageHero;

                        if (!blocked && pending) {
                            const beforeHP = heroState.hp;
                            heroState.hp = Math.max(0, heroState.hp - foeDamage);
                            const applied = Math.max(0, Math.min(foeDamage, beforeHP));
                            playDamageSfx(applied);
                            flashScreenRed();
                            appendGameLogEntry(`${heroName} took ${foeDamage} damage from ${foe.name}.`, gameState);
                        } else {
                            gameState.pendingDamageHero = null;
                        }

                        if (heroState.hp <= 0) {
                            heroState.hp = 0;
                            updateHeroHPDisplays(heroId);
                            updateBoardHeroHP(heroId);

                            console.log(
                                `[RETREAT] ${heroName} FAILS retreat roll `
                                + `and takes ${foeDamage} damage from ${foe.name}. `
                                + `(DT=${dt}, new HP=${heroState.hp}) → KO!`
                            );

                            handleHeroKnockout(heroId, heroState, gameState, { source: "retreatFail", sourceName: foe.name });
                        } else {
                            updateHeroHPDisplays(heroId);
                            updateBoardHeroHP(heroId);

                            console.log(
                                `[RETREAT] ${heroName} FAILS retreat roll `
                                + `and takes ${foeDamage} damage from ${foe.name}. `
                                + `(DT=${dt}, new HP=${heroState.hp})`
                            );
                        }
                        gameState.pendingDamageHero = null;
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
    refreshOverlordFacingGlow(gameState);

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

    try { refreshFrozenOverlays(gameState); } catch (e) {}
}

function openRetreatConfirm(gameState, heroId) {
    const overlay = document.getElementById("retreat-popup-overlay");
    if (!overlay) return;
    if (overlay.style.display === "flex" || overlay.dataset.open === "true" || window.__retreatConfirmOpen) return;
    overlay.dataset.open = "true";
    window.__retreatConfirmOpen = true;

    const heroList = (typeof window !== "undefined" && Array.isArray(window.heroes))
        ? window.heroes
        : (typeof heroes !== "undefined" ? heroes : []);

    const heroObj  = heroList.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    const textEl = document.getElementById("retreat-popup-text");
    if (textEl) {
        textEl.textContent = `${heroName}: Retreat back to HQ?`;
    }

    overlay.style.display = "flex";

    const yesBtn = document.getElementById("retreat-popup-yes");
    const noBtn  = document.getElementById("retreat-popup-no");

    // remove old listeners if any
    yesBtn.onclick = null;
    noBtn.onclick  = null;

    yesBtn.onclick = async () => {
        await retreatHeroToHQ(gameState, heroId);

        // hide retreat button as the hero has left the city
        const retreatBtn = document.getElementById("retreat-button");
        if (retreatBtn) retreatBtn.style.display = "none";

        overlay.style.display = "none";
        overlay.dataset.open = "false";
        window.__retreatConfirmOpen = false;
    };

    noBtn.onclick = () => {
        overlay.style.display = "none";
        overlay.dataset.open = "false";
        window.__retreatConfirmOpen = false;
    };
}

async function performHeroTravelToOverlord(gameState, heroId) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return;

    const heroObj  = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    if (gameState.pendingTravelLog && String(gameState.pendingTravelLog.heroId) === String(heroId)) {
        removeGameLogEntryById(gameState.pendingTravelLog.id, gameState);
        gameState.pendingTravelLog = null;
    }

    if (heroState.isFacingOverlord) {
        console.log(`[OVERLORD] ${heroName} is already facing the Overlord.`);
        return;
    }

    const currentTravel = typeof heroState.currentTravel === "number"
        ? heroState.currentTravel
        : (typeof heroState.travel === "number" ? heroState.travel : 0);

    if (currentTravel <= 0) {
        console.log(`[OVERLORD] ${heroName} has no travel remaining and cannot face the Overlord.`);
        hideTravelHighlights();
        clearCityHighlights();
        return;
    }

    const prevCityIndex = heroState.cityIndex;

    // =========================================================
    // EXITING A CITY TO FACE THE OVERLORD COUNTS AS A RETREAT
    // =========================================================
    if (typeof prevCityIndex === "number") {
        console.log(
            `[EXIT-RETREAT] ${heroName} is leaving city ${prevCityIndex} to face the Overlord.`
        );

        const okToLeave = await attemptLeaveCityAsRetreat(
            gameState,
            heroId,
            prevCityIndex,
            "travel->overlord"
        );

        if (!okToLeave) {
            console.log(
                `[EXIT-RETREAT] ${heroName} was KO'd while attempting to leave city ${prevCityIndex}. Overlord travel aborted.`
            );
            hideTravelHighlights();
            clearCityHighlights();
            renderHeroHandBar(gameState);
            saveGameState(gameState);
            return;
        }
    }

    // Remove hero from the city (DOM + model)
    if (typeof prevCityIndex === "number") {
        const citySlots = document.querySelectorAll(".city-slot");
        const slot = citySlots[prevCityIndex];

        if (slot) {
            const area = slot.querySelector(".city-card-area");
            if (area) area.innerHTML = "";
        }

        heroState.cityIndex = null;
        console.log(
            `[OVERLORD] ${heroName} leaves city index ${prevCityIndex} and travels to face the Overlord.`
        );
    }

    heroState.currentTravel = currentTravel - 1;
    heroState.travelUsedThisTurn = (heroState.travelUsedThisTurn || 0) + 1;

    console.log(
        `[OVERLORD] ${heroName} spends 1 travel to face the Overlord. ` +
        `currentTravel ${currentTravel} → ${heroState.currentTravel}.`
    );

    try { playSoundEffect("enter"); } catch (_) {}

    heroState.isFacingOverlord = true;
    refreshOverlordFacingGlow(gameState);

    initializeTurnUI(gameState);

    hideTravelHighlights();
    clearCityHighlights();

    if (typeof window.recalculateHeroTravel === "function") {
        try {
            window.recalculateHeroTravel(gameState);
        } catch (e) {
            console.warn("[OVERLORD] recalculateHeroTravel threw:", e);
        }
    }

    const remainingDestinations = recomputeCurrentHeroTravelDestinations(gameState);
    console.log(
        "[performHeroTravelToOverlord] remaining destinations after move:",
        remainingDestinations
    );

    const ovInfo = getCurrentOverlordInfo(gameState);
    const ovName =
        ovInfo?.card?.name ||
        ovInfo?.name ||
        gameState.currentOverlord?.name ||
        gameState.currentOverlordCard?.name ||
        overlords.find(o => String(o.id) === String(gameState.overlordId))?.name ||
        "the Overlord";
    appendGameLogEntry(`${heroName} traveled to face the Overlord, ${ovName}.`, gameState);

    if (!heroState.hasDrawnThisTurn) {
        const previewCount = Number(heroState.pendingDrawPreviewCount ?? 3) || 3;
        await maybeShowHeroTopPreviewWithBeforeDraw(gameState, heroId, previewCount);
        heroState.hasDrawnThisTurn = true;
        heroState.pendingDrawPreviewCount = null;
    }

    renderHeroHandBar(gameState);
    try { updateStandardSpeedUI(gameState, heroId); } catch (e) { console.warn("[OVERLORD] updateStandardSpeedUI failed", e); }
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
        if (!heroState || !Array.isArray(heroState.deck)) {
            console.log("[HERO PREVIEW] No deck found for hero id", heroId);
            if (bar)      bar.style.display = "none";
            if (backdrop) backdrop.style.display = "none";
            return;
        }

        heroState.discard = Array.isArray(heroState.discard)
            ? heroState.discard
            : [];

        const safeCount = Number.isFinite(Number(count)) ? Number(count) : 3;

        // If deck is short, extend it by shuffling discard underneath
        if (heroState.deck.length < safeCount && heroState.discard.length > 0) {

            console.log(
                `[HERO PREVIEW] Deck short (${heroState.deck.length}/${safeCount}). ` +
                `Shuffling discard (${heroState.discard.length}) underneath deck.`
            );

            // Shuffle discard (Fisher–Yates)
            const shuffledDiscard = [...heroState.discard];
            for (let i = shuffledDiscard.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledDiscard[i], shuffledDiscard[j]] = [shuffledDiscard[j], shuffledDiscard[i]];
            }

            // Append underneath deck (preserve existing top order)
            heroState.deck.push(...shuffledDiscard);

            // Clear discard
            heroState.discard = [];

            // Persist immediately so refresh doesn’t revert deck shape
            if (typeof saveGameState === "function") {
                saveGameState(state);
            }
        }


        const heroObj    = heroes.find(h => String(h.id) === String(heroId));
        const heroName   = heroObj?.name  || `Hero ${heroId}`;
        const glowColor  = heroObj?.color || "#ffffff";

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
            activateImg.src = "https://raw.githubusercontent.com/over-lords/overlords/929e24644681d3c05e38bfc769b04b0e22e072c6/Public/Images/Site%20Assets/drawCard.png";

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

                    try {
                        const heroObj = heroes.find(h => String(h.id) === String(heroId));
                        const heroName = heroObj?.name || `Hero ${heroId}`;
                        appendGameLogEntry(`${heroName} drew a card.`, state);
                    } catch (e) {
                        console.warn("[HERO DRAW] Failed to append draw log:", e);
                    }
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

function computeHeroTravelLegalTargets(gameState, heroId) {
    const heroState = gameState.heroData?.[heroId];
    if (!heroState) return [];

    const citySlots = document.querySelectorAll(".city-slot");
    if (!citySlots.length) return [];

    const destroyed = gameState.destroyedCities || {};
    const upperIndices = [0, 2, 4, 6, 8, 10];
    const lowerIndices = [1, 3, 5, 7, 9, 11];

    const results = [];

    for (let i = 0; i < upperIndices.length; i++) {
        const upperIdx = upperIndices[i];
        const lowerIdx = lowerIndices[i];

        // Skip destroyed cities entirely
        if (destroyed[upperIdx]) continue;

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

function refreshAllCityOutlines(gameState, options = {}) {
    const clearOnly = options.clearOnly === true;

    const citySlots = document.querySelectorAll(".city-slot");
    if (!citySlots.length) return;

    // 1) Clear everything first
    citySlots.forEach(slot => {
        slot.style.outline = "";
        slot.style.cursor = "default";
    });

    if (clearOnly) return;

    // 2) Determine the active (turn) hero
    const heroIds = Array.isArray(gameState.heroes) ? gameState.heroes : [];
    const activeIdx = gameState.heroTurnIndex ?? 0;
    const activeHeroId = heroIds[activeIdx];

    if (activeHeroId == null) return;

    const activeHeroState = gameState.heroData?.[activeHeroId];
    if (!activeHeroState) return;

    // ------------------------------------------------------------
    // A) Outline occupied cities (by OTHER heroes) in RED
    // ------------------------------------------------------------
    const occupiedByOther = new Set();
    for (const hid of heroIds) {
        if (String(hid) === String(activeHeroId)) continue;

        const hs = gameState.heroData?.[hid];
        const idx = hs?.cityIndex;

        if (typeof idx === "number") occupiedByOther.add(idx);
    }

    occupiedByOther.forEach(idx => {
        const slot = citySlots[idx];
        if (!slot) return;
        slot.style.outline = "4px solid red";
        // cursor stays default unless it is also a legal target (set below)
    });

    // ------------------------------------------------------------
    // B) Outline the TURN HERO’S current city in BLUE
    // ------------------------------------------------------------
    const activeCityIdx = activeHeroState.cityIndex;
    if (typeof activeCityIdx === "number") {
        const slot = citySlots[activeCityIdx];
        if (slot) {
            slot.style.outline = "4px solid blue";
        }
    }

    // ------------------------------------------------------------
    // C) If the hero can travel, outline legal targets in YELLOW
    //    (but do NOT override red/blue)
    // ------------------------------------------------------------
    const currentTravel =
        typeof activeHeroState.currentTravel === "number"
            ? activeHeroState.currentTravel
            : (typeof activeHeroState.travel === "number" ? activeHeroState.travel : 0);

    if (currentTravel <= 0) {
        // Keep red/blue informational outlines, but no travel targets
        return;
    }

    const targets = computeHeroTravelLegalTargets(gameState, activeHeroId) || [];
    targets.forEach(target => {
        const lowerSlot = target?.lowerSlot;
        const lowerIdx = Number(target?.lowerIndex);

        if (!lowerSlot) return;

        // If this target is occupied by another hero, keep it RED.
        // If it's the active hero’s city, keep it BLUE.
        // Otherwise, make it YELLOW.
        const isActiveCity = (typeof activeCityIdx === "number" && lowerIdx === activeCityIdx);
        const isOccupiedByOther = occupiedByOther.has(lowerIdx);

        if (!isActiveCity && !isOccupiedByOther) {
            lowerSlot.style.outline = "4px solid yellow";
        }

        // Still clickable if it's a legal target (your travel click handler decides what happens)
        lowerSlot.style.cursor = "pointer";
    });
}

setInterval(() => {
    try {
        // This both refreshes the outlines and enforces "no travel when out".
        recomputeCurrentHeroTravelDestinations(gameState);
    } catch (e) {
        console.warn("[turnOrder] periodic travel-destination refresh failed:", e);
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
        hideTravelHighlights();
        refreshAllCityOutlines(gameState);
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
// SHOVE TRAVEL
// ================================================================
async function performHeroShoveTravel(state, activeHeroId, targetHeroId, destinationLowerIndex) {
  const activeState = state.heroData?.[activeHeroId];
  const targetState = state.heroData?.[targetHeroId];
  if (!activeState || !targetState) return;

  if (state.pendingTravelLog && String(state.pendingTravelLog.heroId) === String(activeHeroId)) {
    removeGameLogEntryById(state.pendingTravelLog.id, state);
    state.pendingTravelLog = null;
  }

  const dest = Number(destinationLowerIndex);
  if (!Number.isFinite(dest)) return;

  // Validate target is actually in that city
  if (typeof targetState.cityIndex !== "number" || Number(targetState.cityIndex) !== dest) {
    console.warn("[SHOVE] Blocked: target hero is not in the clicked city.");
    return;
  }

  // Travel budget check for active hero
  const currentTravel =
    (typeof activeState.currentTravel === "number")
      ? activeState.currentTravel
      : (typeof activeState.travel === "number" ? activeState.travel : 0);

  if (currentTravel <= 0) {
    console.log("[SHOVE] Blocked: no travel remaining for active hero.");
    return;
  }

  // Spend 1 travel (counts as travel for the shover only)
  activeState.currentTravel = currentTravel - 1;
  activeState.travelUsedThisTurn = (activeState.travelUsedThisTurn || 0) + 1;

  // Remember where the active hero was (if any)
  const previousIndex = (typeof activeState.cityIndex === "number") ? activeState.cityIndex : null;

  try { playSoundEffect("enter"); } catch (_) {}

  initializeTurnUI(state);

  // =========================================================
  // EXITING A CITY VIA SHOVE COUNTS AS A RETREAT
  // =========================================================
  if (typeof previousIndex === "number") {
    const heroObj = heroes.find(h => String(h.id) === String(activeHeroId));
    const heroName = heroObj?.name || `Hero ${activeHeroId}`;

    console.log(
      `[EXIT-RETREAT] ${heroName} is leaving city ${previousIndex} to shove another hero.`
    );

    const okToLeave = await attemptLeaveCityAsRetreat(
      state,
      activeHeroId,
      previousIndex,
      "shove->city"
    );

    if (!okToLeave) {
      console.log(
        `[EXIT-RETREAT] ${heroName} was KO'd while attempting to leave city ${previousIndex}. Shove aborted.`
      );
      renderHeroHandBar(state);
      saveGameState(state);
      return;
    }
  }

  // Shoved hero goes to HQ; this does NOT spend their travel
  targetState.cityIndex = null;
  targetState.isFacingOverlord = false;

  // Active hero enters the city
  activeState.cityIndex = dest;
  activeState.isFacingOverlord = false;

  // DOM updates
  const citySlots = document.querySelectorAll(".city-slot");

  if (previousIndex !== null && citySlots[previousIndex]) {
    const prevArea = citySlots[previousIndex].querySelector(".city-card-area");
    if (prevArea) prevArea.innerHTML = "";
  }

  if (citySlots[dest]) {
    const destArea = citySlots[dest].querySelector(".city-card-area");
    if (destArea) destArea.innerHTML = "";
  }

  // Render active hero into destination
  const destSlot = citySlots[dest];
  const destArea = destSlot?.querySelector(".city-card-area");
  if (destArea) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");

    const rendered = renderCard(activeHeroId, wrapper);
    wrapper.appendChild(rendered);
    destArea.appendChild(wrapper);

    const heroData = heroes.find(h => String(h.id) === String(activeHeroId));
    if (heroData) {
      bindCityHeroClick(wrapper, heroData, activeHeroId, dest);
    }
  }

  // Immediate city-entry damage from the villain/henchman in the upper slot above this city (DT applies)
  try {
    const heroObj = heroes.find(h => String(h.id) === String(activeHeroId));
    const foeEntry = state.cities?.[dest - 1];
    const foeId = foeEntry?.id != null ? String(foeEntry.id) : null;

    const foe = foeId
      ? (henchmen.find(h => String(h.id) === foeId) || villains.find(v => String(v.id) === foeId))
      : null;

    if (foe && heroObj) {
      const heroName = heroObj?.name || `Hero ${activeHeroId}`;
      const foeDamage = getSlotFoeDamage(foeEntry, foe);
      console.log("[SHOVE ENTRY] Effective foe damage (after passives)", { foeDamage, foeId, entryKey: foeEntry?.instanceId ?? foeEntry?.uniqueId ?? null, damagePenalty: foeEntry?.damagePenalty, currentDamage: foeEntry?.currentDamage });
      const dt = getCurrentHeroDT(heroId, gameState);

      const turn = typeof state.turnCounter === "number" ? state.turnCounter : 0;
      const ignoreShoveDamage =
        typeof activeState.ignoreShoveDamageUntilTurn === "number" &&
        turn <= activeState.ignoreShoveDamageUntilTurn;

      if (ignoreShoveDamage) {
        state.pendingDamageHero = null;
        appendGameLogEntry(`${heroName} ignores shove damage this turn.`, state);
      } else if (foeDamage >= dt && foeDamage > 0) {
        if (consumeHeroProtectionIfAny(activeHeroId, state)) {
          state.pendingDamageHero = null;
          return;
        }
        flagPendingHeroDamage(activeHeroId, foeDamage, foe.name, state);
        const blocked = await tryBlockPendingHeroDamage(state);
        const pending = state.pendingDamageHero;

        if (!blocked && pending) {
          const beforeHP = Number(activeState.hp || 0);
          activeState.hp = Math.max(0, beforeHP - foeDamage);
          const applied = Math.max(0, Math.min(foeDamage, beforeHP));
          playDamageSfx(applied);
          console.log(
            `[SHOVE-ENTRY] ${heroName} took ${foeDamage} damage for forcing a hero from the fight.`
          );
          flashScreenRed();
          appendGameLogEntry(`${heroName} took ${foeDamage} damage from ${foe.name}.`, state);

          updateHeroHPDisplays(activeHeroId);
          updateBoardHeroHP(activeHeroId);

          if (activeState.hp <= 0) {
            activeState.hp = 0;
            handleHeroKnockout(activeHeroId, activeState, state, { source: "shoveEntry", sourceName: foe.name });
          }
        } else {
          state.pendingDamageHero = null;
        }
      }
    }
  } catch (err) {
    console.warn("[SHOVE] entry damage calculation failed", err);
  }

  showRetreatButtonForCurrentHero(state);

  if (!activeState.hasDrawnThisTurn) {
    const previewCount = Number(activeState.pendingDrawPreviewCount ?? 3) || 3;
    await maybeShowHeroTopPreviewWithBeforeDraw(state, activeHeroId, previewCount);
    activeState.hasDrawnThisTurn = true;
    activeState.pendingDrawPreviewCount = null;
  }

  renderHeroHandBar(state);
  recomputeCurrentHeroTravelDestinations(state);
  refreshAllCityOutlines(state);
  try { refreshFrozenOverlays(state); } catch (e) {}
  try { updateStandardSpeedUI(state, activeHeroId); } catch (e) { console.warn("[SHOVE] updateStandardSpeedUI failed", e); }

  const heroObj = heroes.find(h => String(h.id) === String(activeHeroId));
  const heroName = heroObj?.name || `Hero ${activeHeroId}`;
  const shovedHeroObj = heroes.find(h => String(h.id) === String(targetHeroId));
  const shovedHeroName = shovedHeroObj?.name || `Hero ${targetHeroId}`;
  const cityName = getCityNameFromIndex(dest);
  const foeEntry = state.cities?.[dest - 1];
  const foeName = foeEntry
    ? (henchmen.find(h => String(h.id) === String(foeEntry.id))?.name
        || villains.find(v => String(v.id) === String(foeEntry.id))?.name
        || `Enemy ${foeEntry.id}`)
    : "no foe";
  appendGameLogEntry(`${heroName} traveled to ${cityName} to engage ${foeName}, shoving ${shovedHeroName} back to HQ.`, state);

  saveGameState(state);
}

// Allow other modules (pageSetup, etc.) to call shove directly if desired.
window.performHeroShoveTravel = performHeroShoveTravel;

// ================================================================
// CLICK-TO-SHOVE CONTROLLER
// ================================================================

window.maybePromptHeroShove = function (clickedHeroObj, clickedHeroId, clickedCityIndex) {
    try {
        const state = window.gameState;
        if (!state) return false;

        const heroIds = Array.isArray(state.heroes) ? state.heroes : [];
        const activeIdx = state.heroTurnIndex ?? 0;
        const activeHeroId = heroIds[activeIdx];
        if (activeHeroId == null) return false;

        // Only shove OTHER heroes that are in a city
        if (clickedHeroId == null) return false;
        if (String(clickedHeroId) === String(activeHeroId)) return false;

        const activeState = state.heroData?.[activeHeroId];
        const targetState = state.heroData?.[clickedHeroId];
        if (!activeState || !targetState) return false;

        if (activeState.isKO) return false;
        if (typeof targetState.cityIndex !== "number") return false;

        const dest = Number.isFinite(Number(clickedCityIndex))
            ? Number(clickedCityIndex)
            : Number(targetState.cityIndex);

        if (!Number.isFinite(dest)) return false;

        // Must have travel remaining
        const currentTravel =
            typeof activeState.currentTravel === "number"
                ? activeState.currentTravel
                : (typeof activeState.travel === "number" ? activeState.travel : 0);

        if (currentTravel <= 0) return false;

        // Shove modal elements
        const overlay = document.getElementById("shove-popup-overlay");
        const text = document.getElementById("shove-popup-text");
        const yesBtn = document.getElementById("shove-popup-yes");
        const noBtn = document.getElementById("shove-popup-no");

        if (!overlay || !text || !yesBtn || !noBtn) {
            console.warn("[SHOVE] shove popup elements not found in DOM.");
            return false;
        }

        const targetName = clickedHeroObj?.name || `Hero ${clickedHeroId}`;
        const cityName = getCityNameFromIndex(dest);

        text.textContent = `Shove ${targetName} back to HQ and enter ${cityName}?`;
        overlay.style.display = "flex";

        // Replace old YES listener
        const newYes = yesBtn.cloneNode(true);
        yesBtn.parentNode.replaceChild(newYes, yesBtn);

        newYes.addEventListener("click", () => {
            overlay.style.display = "none";
            performHeroShoveTravel(state, activeHeroId, clickedHeroId, dest);
        });

        // Replace old NO listener
        const newNo = noBtn.cloneNode(true);
        noBtn.parentNode.replaceChild(newNo, noBtn);

        // If they cancel shove, fall back to normal hero panel
        newNo.addEventListener("click", () => {
            overlay.style.display = "none";
            if (clickedHeroObj) {
                buildHeroPanel(clickedHeroObj);
            }
        });

        return true;
    } catch (err) {
        console.warn("[SHOVE] maybePromptHeroShove failed", err);
        return false;
    }
};

function bindCityHeroClick(wrapper, heroData, heroId, cityIndex) {
    if (!wrapper || !heroData) return;

    wrapper.style.cursor = "pointer";
    wrapper.setAttribute("data-card-id", String(heroId));

    // Capture-phase is critical; the inner .card often has its own click handler.
     if (wrapper.__cityHeroClickBound) return; // prevent duplicate listeners on re-renders
     wrapper.__cityHeroClickBound = true;

     wrapper.addEventListener("click", (e) => {
         e.preventDefault();
         e.stopPropagation();
         e.stopImmediatePropagation();

         const shoveFn =
             (typeof window !== "undefined" && typeof window.maybePromptHeroShove === "function")
                 ? window.maybePromptHeroShove
                 : (typeof maybePromptHeroShove === "function" ? maybePromptHeroShove : null);

         const handledByShove = shoveFn ? shoveFn(heroData, heroId, cityIndex) : false;
         if (!handledByShove) {
             buildHeroPanel(heroData);
         }
     }, true);
}

const CITY_LOWER_INDEX_TO_NAME = {
  1:  "Star City",
  3:  "Coast City",
  5:  "Keystone City",
  7:  "Central City",
  9:  "Metropolis",
  11: "Gotham City"
};

function getCityNameFromLowerIndex(cityIndex) {
  return CITY_LOWER_INDEX_TO_NAME[cityIndex] || "Unknown City";
}

function showShoveConfirm({ activeHeroName, targetHeroName, cityIndex, onYes, onNo }) {
  const overlay = document.getElementById("shove-popup-overlay");
  const text    = document.getElementById("shove-popup-text");
  const yesBtn  = document.getElementById("shove-popup-yes");
  const noBtn   = document.getElementById("shove-popup-no");

  if (!overlay || !text || !yesBtn || !noBtn) {
    console.warn("[SHOVE] shove modal elements missing in game.html");
    // Fallback: treat as "No"
    if (typeof onNo === "function") onNo();
    return;
  }

  const cityName = getCityNameFromLowerIndex(cityIndex);

  text.textContent = `${activeHeroName}: Shove ${targetHeroName} out of ${cityName}?`;

  // Clear previous handlers
  yesBtn.onclick = null;
  noBtn.onclick  = null;

  yesBtn.onclick = () => {
    overlay.style.display = "none";
    if (typeof onYes === "function") onYes();
  };

  noBtn.onclick = () => {
    overlay.style.display = "none";
    if (typeof onNo === "function") onNo();
  };

  overlay.style.display = "flex";
}

function maybePromptHeroShove(targetHeroData, targetHeroId, targetCityIndex) {
    const state = window.gameState || gameState;   // fallback to module gameState
    window.gameState = state;                     // re-sync the alias
    if (!state) return false;

    const heroIds = state.heroes || [];
    const activeIdx = state.heroTurnIndex ?? 0;
    const activeHeroId = heroIds[activeIdx];

    // Only meaningful if there is an active hero
    if (activeHeroId == null) return false;

    // You cannot shove yourself
    if (String(activeHeroId) === String(targetHeroId)) return false;

    const activeState = state.heroData?.[activeHeroId];
    const targetState = state.heroData?.[targetHeroId];
    if (!activeState || !targetState) return false;

    // Target must actually be in a city (red-outline case)
    const dest = (typeof targetState.cityIndex === "number")
        ? Number(targetState.cityIndex)
        : NaN;

    if (!Number.isFinite(dest)) return false;

    // Active hero must have travel remaining
    const currentTravel =
        (typeof activeState.currentTravel === "number")
        ? activeState.currentTravel
        : (typeof activeState.travel === "number" ? activeState.travel : 0);

    if (currentTravel <= 0) return false;

    const activeHeroObj  = heroes.find(h => String(h.id) === String(activeHeroId));
    const targetHeroObj  = heroes.find(h => String(h.id) === String(targetHeroId));

    const activeName = activeHeroObj?.name || `Hero ${activeHeroId}`;
    const targetName = targetHeroObj?.name || `Hero ${targetHeroId}`;

    // Show mobile-friendly shove modal
    showShoveConfirm({
        activeHeroName: activeName,
        targetHeroName: targetName,
        cityIndex: dest,
        onYes: () => {
        performHeroShoveTravel(state, activeHeroId, targetHeroId, dest);
        },
        onNo: () => {
        // If they click No, behave exactly like a normal click
        if (targetHeroObj) buildHeroPanel(targetHeroObj);
        }
    });

    return true;
}

async function maybeShowHeroTopPreviewWithBeforeDraw(state, heroId, previewCount = 3) {
    if (!state || heroId == null) return;
    state._pendingBeforeDrawHero = heroId;
    console.log("[beforeDraw] checking icon optionals for hero", heroId);
    try {
        if (typeof maybeRunHeroIconBeforeDrawOptionals === "function") {
            await maybeRunHeroIconBeforeDrawOptionals(heroId);
        } else {
            console.log("[beforeDraw] handler not available; skipping optional checks.");
        }
    } catch (e) {
        console.warn("[beforeDraw] icon optionals failed", e);
    }
    const heroState = state.heroData?.[heroId];
    const skipCount = heroState ? Number(heroState.skipSelectionDraw || 0) : 0;
    if (skipCount > 0) {
        heroState.skipSelectionDraw = 0;
        try {
            await executeEffectSafely(`draw(${skipCount})`, null, { currentHeroId: heroId, state });
        } catch (err) {
            console.warn("[beforeDraw] Failed to execute skipSelectionDraw effect.", err);
        }
        state._pendingBeforeDrawHero = null;
        return;
    }
    const desiredPreview = Number(state.heroData?.[heroId]?.pendingDrawPreviewCount ?? previewCount ?? 3) || 3;
    showHeroTopPreview(heroId, state, desiredPreview);
    state._pendingBeforeDrawHero = null;
}

window.maybePromptHeroShove = maybePromptHeroShove;

// ================================================================
// HERO KO HANDLER
// ================================================================
export function handleHeroKnockout(heroId, heroState, state, options = {}) {
    if (!heroState || !state) return;

    // Normalize HP
    if (heroState.hp == null || heroState.hp > 0) {
        heroState.hp = 0;
    }

    const alreadyKO = !!heroState.isKO;
    // If already marked KO (e.g., skipping KO heroes at turn start), avoid re-logging/spamming.
    if (alreadyKO && options?.fromTurnStart) {
        return;
    }

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
        refreshOverlordFacingGlow(gameState);
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

    if (!alreadyKO) {
        try { playSoundEffect("heroKOd"); } catch (_) {}
        try {
            const heroObj = heroes.find(h => String(h.id) === String(heroId));
            const heroName = heroObj?.name || `Hero ${heroId}`;
            const sourceName = options?.sourceName || "damage";
            appendGameLogEntry(`${heroName} was KO'd by ${sourceName}.`, state);
        } catch (err) {
            console.warn("[handleHeroKnockout] Failed to append KO log.", err);
        }
    }

    const effectiveState = state || gameState;

    try {
        triggerRuleEffects("heroKod", { state: effectiveState, currentHeroId: heroId, targetHeroId: heroId });
    } catch (err) {
        console.warn("[handleHeroKnockout] heroKod triggers failed", err);
    }

    // Trigger KOHero effects for the foe that caused this KO (if known)
    try {
        const lastCauser = effectiveState.lastDamageCauser;
        const foeId = lastCauser?.foeId;
        if (foeId) {
            const foeCard =
                henchmen.find(h => String(h.id) === String(foeId)) ||
                villains.find(v => String(v.id) === String(foeId));
            if (foeCard) {
                triggerKOHeroEffects(foeCard, effectiveState, heroId, {
                    foeInstanceId: lastCauser.instanceId ?? null,
                    slotIndex: lastCauser.slotIndex ?? null,
                    source: options?.source || null
                });
            }
        }
    } catch (err) {
        console.warn("[handleHeroKnockout] Failed to trigger KOHero effects.", err);
    }

    saveGameState(effectiveState);

    // Check "all heroes KO'd" loss condition (and any others)
    checkGameEndConditions(effectiveState);
}

// ================================================================
// CITY EXIT "RETREAT" CHECK (used when leaving a city via travel)
// ================================================================
async function attemptLeaveCityAsRetreat(gameState, heroId, fromCityIndex, contextLabel = "") {
    const heroState = gameState?.heroData?.[heroId];
    if (!heroState) return true;

    // Only applies when leaving a city and NOT when already facing the Overlord
    if (heroState.isFacingOverlord) {
        console.log(
            `[EXIT-RETREAT] Skipping exit-retreat check (already facing Overlord).`,
            { heroId, fromCityIndex, contextLabel }
        );
        return true;
    }

    if (typeof fromCityIndex !== "number") {
        console.log(
            `[EXIT-RETREAT] Skipping exit-retreat check (not in a city).`,
            { heroId, fromCityIndex, contextLabel }
        );
        return true;
    }

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    // City layout: foe is in the upper slot immediately above the hero slot
    const heroIdx = fromCityIndex;
    const foeIdx  = heroIdx - 1;

    if (foeIdx < 0) {
        console.log(
            `[EXIT-RETREAT] ${heroName} is leaving city ${heroIdx} (${contextLabel}). No upper foe slot exists; no roll.`
        );
        return true;
    }

    const slotEntry = gameState.cities?.[foeIdx];
    if (!slotEntry || !slotEntry.id) {
        console.log(
            `[EXIT-RETREAT] ${heroName} is leaving city ${heroIdx} (${contextLabel}). No foe above; no roll.`
        );
        return true;
    }

    const foeId = String(slotEntry.id);
    const foe =
        henchmen.find(h => String(h.id) === foeId) ||
        villains.find(v => String(v.id) === foeId);

    if (!foe) {
        console.log(
            `[EXIT-RETREAT] ${heroName} is leaving city ${heroIdx} (${contextLabel}). Found foe id=${foeId} but could not resolve to Henchman/Villain; no roll.`
        );
        return true;
    }

    const retreatTarget = Number(heroObj?.retreat || 0);
    const roll = Math.floor(Math.random() * 6) + 1; // 1–6

    console.log(
        `[EXIT-RETREAT] ${heroName} attempts to leave city ${heroIdx} (${contextLabel}) while ${foe.name} is above them. `
        + `Roll=${roll}, needs >= ${retreatTarget}.`
    );

    // Only do anything special on a FAILED roll
    if (roll < retreatTarget) {
        const foeDamage = getSlotFoeDamage(slotEntry, foe);
                    const dt = getCurrentHeroDT(heroId, gameState);

                    // Match end-of-turn damage behavior: only if foeDamage >= DT
                    if (foeDamage >= dt) {
                        flagPendingHeroDamage(heroId, foeDamage, foe.name, gameState);
                        const blockedByAbility = await tryBlockPendingHeroDamage(gameState);
                        const pending = gameState.pendingDamageHero;

                        if (!blockedByAbility && pending) {
                            const blockedByProtection = consumeHeroProtectionIfAny(heroId, gameState);
                            if (!blockedByProtection) {
                                const beforeHP = heroState.hp;
                                heroState.hp = Math.max(0, heroState.hp - foeDamage);
                                const applied = Math.max(0, Math.min(foeDamage, beforeHP));
                                playDamageSfx(applied);
                                flashScreenRed();
                                appendGameLogEntry(`${heroName} took ${foeDamage} damage from ${foe.name}.`, gameState);
                            } else {
                                appendGameLogEntry(`${heroName} avoids damage from ${foe.name}.`, gameState);
                            }
                        }
                        gameState.pendingDamageHero = null;

            if (heroState.hp <= 0) {
                heroState.hp = 0;
                updateHeroHPDisplays(heroId);
                updateBoardHeroHP(heroId);

                console.log(
                    `[EXIT-RETREAT] ${heroName} FAILS exit roll and takes ${foeDamage} damage from ${foe.name}. `
                    + `(DT=${dt}, new HP=${heroState.hp}) → KO!`
                );

                handleHeroKnockout(heroId, heroState, gameState, { source: "exitRetreatFail", sourceName: foe.name });
                return false; // abort whatever action was trying to leave the city
            }

            updateHeroHPDisplays(heroId);
            updateBoardHeroHP(heroId);

            console.log(
                `[EXIT-RETREAT] ${heroName} FAILS exit roll and takes ${foeDamage} damage from ${foe.name}. `
                + `(DT=${dt}, new HP=${heroState.hp}).`
            );
            gameState.pendingDamageHero = null;
        } else {
            console.log(
                `[EXIT-RETREAT] ${heroName} FAILS exit roll but ignores `
                + `${foe.name}'s damage (foeDamage=${foeDamage} < DT=${dt}).`
            );
        }
    } else {
        console.log(
            `[EXIT-RETREAT] ${heroName} SUCCEEDS exit roll and takes no damage from ${foe.name}.`
        );
    }

    return true;
}
