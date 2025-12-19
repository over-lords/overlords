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
import { bystanders } from "../data/bystanders.js";

import { setCurrentOverlord, buildOverlordPanel, showMightBanner, renderHeroHandBar, placeCardIntoCitySlot } from "./pageSetup.js";

import { getCurrentOverlordInfo, takeNextHenchVillainsFromDeck, showRetreatButtonForCurrentHero,
         enterVillainFromEffect, checkGameEndConditions, villainDraw, updateHeroHPDisplays, updateBoardHeroHP, checkCoastalCities } from "./turnOrder.js";

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

function findKOdHeroes(state = gameState) {
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    if (!heroIds.length || !s.heroData) return 0;
    const count = heroIds.reduce((acc, hid) => {
        const h = s.heroData[hid];
        if (!h) return acc;
        return acc + ((h.hp != null && h.hp <= 0) || h.isKO ? 1 : 0);
    }, 0);
    console.log(`[findKOdHeroes] Found ${count} KO'd heroes.`);
    return count;
}

function heroMatchesTeam(heroObj, teamNameRaw) {
    if (!heroObj || !teamNameRaw) return false;
    const teamName = String(teamNameRaw).toLowerCase();
    const props = [
        heroObj.team,
        heroObj.heroTeam,
        heroObj.faction
    ].filter(Boolean).map(v => String(v).toLowerCase());
    const list = Array.isArray(heroObj.teams) ? heroObj.teams.map(t => String(t).toLowerCase()) : [];
    const all = props.concat(list);
    return all.some(t => t === teamName);
}

function getActiveTeamCount(teamName, heroId = null, state = gameState) {
    if (!teamName) return 0;
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    let count = 0;

    heroIds.forEach(id => {
        if (heroId != null && String(id) === String(heroId)) return; // exclude activating hero
        const hObj = heroes.find(h => String(h.id) === String(id));
        if (!hObj) return;
        const hState = s.heroData?.[id];
        const alive = hState ? (typeof hState.hp === "number" ? hState.hp > 0 : true) : true;
        if (!alive) return;
        if (heroMatchesTeam(hObj, teamName)) count += 1;
    });

    console.log(`[getActiveTeamCount] Team ${teamName} active count (excluding hero ${heroId ?? "n/a"}): ${count}`);
    return count;
}

function getKOdTeamCount(teamName, heroId = null, state = gameState) {
    if (!teamName) return 0;
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    let count = 0;

    heroIds.forEach(id => {
        if (heroId != null && String(id) === String(heroId)) return; // exclude activating hero
        const hObj = heroes.find(h => String(h.id) === String(id));
        if (!hObj) return;
        const hState = s.heroData?.[id];
        const isKO = hState ? ((typeof hState.hp === "number" && hState.hp <= 0) || hState.isKO) : false;
        if (!isKO) return;
        if (heroMatchesTeam(hObj, teamName)) count += 1;
    });

    console.log(`[getKOdTeamCount] Team ${teamName} KO count (excluding hero ${heroId ?? "n/a"}): ${count}`);
    return count;
}

function resolveNumericValue(raw, heroId = null, state = gameState) {
    if (typeof raw === "number") return raw;
    if (typeof raw !== "string") return 0;

    const val = raw.trim();
    const lower = val.toLowerCase();

    if (lower === "getcardsdiscarded") {
        return getCardsDiscarded(heroId, state);
    }
    if (lower === "findkodheroes") {
        return findKOdHeroes(state);
    }

    const activeMatch = val.match(/^getactiveteamcount\(([^)]+)\)$/i);
    if (activeMatch) {
        return getActiveTeamCount(activeMatch[1], heroId, state);
    }

    const koMatch = val.match(/^getkodteamcount\(([^)]+)\)$/i);
    if (koMatch) {
        return getKOdTeamCount(koMatch[1], heroId, state);
    }

    const num = Number(raw);
    return Number.isFinite(num) ? num : 0;
}

function evaluateCondition(condStr, heroId, state = gameState) {
    if (!condStr || condStr.toLowerCase() === "none") return true;
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];

    // atXorLessHP(n) / atXorGreaterHP(n) — apply to current hero
    const hpMatch = condStr.match(/^atxor(less|greater)hp\((\d+)\)$/i);
    if (hpMatch) {
        const dir = hpMatch[1].toLowerCase();
        const threshold = Number(hpMatch[2]);
        if (heroId == null) return false;
        const hState = s.heroData?.[heroId];
        if (!hState || typeof hState.hp !== "number") return false;
        return dir === "less" ? hState.hp <= threshold : hState.hp >= threshold;
    }

    const activeHeroMatch = condStr.match(/^activehero\(([^)]+)\)$/i);
    if (activeHeroMatch) {
        const teamName = activeHeroMatch[1];
        let activeTeams = new Set();

        heroIds.forEach(id => {
            const hObj = heroes.find(h => String(h.id) === String(id));
            if (!hObj) return;

            const hState = s.heroData?.[id];
            const alive = hState ? (hState.hp == null ? true : hState.hp > 0) : true;
            if (!alive) return;

            // Exclude the activating hero from counting toward activeHero(team)
            if (heroId != null && String(heroId) === String(id)) return;

            const teams = [
                hObj.team,
                hObj.heroTeam,
                hObj.faction
            ].filter(Boolean).map(v => String(v).toLowerCase());
            const list = Array.isArray(hObj.teams) ? hObj.teams.map(t => String(t).toLowerCase()) : [];
            teams.concat(list).forEach(t => activeTeams.add(t));
        });

        return activeTeams.has(String(teamName).toLowerCase());
    }

    // Fallback: unknown condition -> false
    return false;
}

// Shared helper to get per-instance key
function getEntryKey(obj) {
    const k = obj?.instanceId ?? obj?.uniqueId ?? null;
    return (k == null) ? null : String(k);
}

function ensureFrozenOverlay(slotIndex) {
    const citySlots = document.querySelectorAll(".city-slot");
    const slot = citySlots?.[slotIndex];
    if (!slot) return;
    const area = slot.querySelector(".city-card-area");
    if (!area) return;
    if (area.querySelector(".frozen-overlay")) return;

    const img = document.createElement("img");
    img.src = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Site%20Assets/locked.png";
    img.className = "frozen-overlay";
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.right = "0";
    img.style.bottom = "0";
    img.style.margin = "auto";
    img.style.pointerEvents = "none";
    img.style.zIndex = "50";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.opacity = "0.92";

    // Make sure area can host overlay
    if (getComputedStyle(area).position === "static") {
        area.style.position = "relative";
    }

    area.appendChild(img);
}

function removeFrozenOverlay(slotIndex) {
    const citySlots = document.querySelectorAll(".city-slot");
    const slot = citySlots?.[slotIndex];
    if (!slot) return;
    const area = slot.querySelector(".city-card-area");
    if (!area) return;
    const img = area.querySelector(".frozen-overlay");
    if (img) img.remove();
}

function applyFreezeToEntry(entry, slotIndex, state = gameState, opts = {}) {
    if (!entry || slotIndex == null) return;

    entry.isFrozen = true;
    ensureFrozenOverlay(slotIndex);

    const s = state || gameState;
    if (!s.tempFrozen) s.tempFrozen = {};

    const key = getEntryKey(entry) || String(entry.id || slotIndex);

    const howLong = String(opts.howLong || "forever").toLowerCase();
    const heroId = opts.heroId ?? null;

    if (howLong === "next" && heroId != null) {
        s.tempFrozen[key] = {
            heroId,
            armed: false
        };
    } else {
        // forever: ensure any temp marker cleared
        delete s.tempFrozen[key];
    }

    // Also mirror on the base card for panels if desired
    const foeCard =
        henchmen.find(h => String(h.id) === String(entry.id)) ||
        villains.find(v => String(v.id) === String(entry.id));
    if (foeCard) foeCard.isFrozen = true;
}

function unfreezeByKey(key, state = gameState) {
    if (!key) return;
    const s = state || gameState;
    if (!Array.isArray(s.cities)) return;

    for (let i = 0; i < s.cities.length; i++) {
        const e = s.cities[i];
        if (!e) continue;
        const ek = getEntryKey(e);
        if (ek && ek === key) {
            e.isFrozen = false;
            removeFrozenOverlay(i);
            break;
        }
    }
    delete s.tempFrozen?.[key];
}

export function processTempFreezesForHero(heroId, state = gameState) {
    const s = state || gameState;
    if (!s.tempFrozen) return;

    Object.entries({ ...s.tempFrozen }).forEach(([k, meta]) => {
        if (!meta || meta.heroId == null) return;
        if (String(meta.heroId) !== String(heroId)) return;

        if (meta.armed) {
            unfreezeByKey(k, s);
        } else {
            s.tempFrozen[k] = { ...meta, armed: true };
        }
    });
}

EFFECT_HANDLERS.charge = function (args, card, selectedData) {
    const distance = Number(args[0]) || 1;
    runCharge(card.id, distance);
};

EFFECT_HANDLERS.draw = function(args, card, selectedData) {
    const heroId = selectedData?.currentHeroId ?? null;
    const rawCount = resolveNumericValue(args?.[0] ?? 1, heroId, gameState);
    const count = Math.max(0, Number(rawCount) || 0);

    if (!heroId) {
        console.warn("[draw] No currentHeroId available.");
        return;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.warn("[draw] No heroState for heroId:", heroId);
        return;
    }

    if (count <= 0) {
        console.log("[draw] Count resolved to 0; no cards drawn.");
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
    return enemyDraw(count, limit, selectedData);
};

EFFECT_HANDLERS.damageFoe = function (args, card, selectedData) {
    const amount = Number(args?.[0]) || 0;
    if (amount <= 0) {
        console.warn("[damageFoe] Invalid damage amount:", args);
        return;
    }

    // Optional second argument:
    //  - "all"
    //  - numeric city index (0,2,4,6,8,10)
    //  - omitted → normal single-target (selected foe)
    let flag = "single";

    if (args?.length > 1) {
        const raw = args[1];

        if (raw === "all") {
            flag = "all";
        } else if (typeof raw === "string" && raw.toLowerCase() === "allhenchmen") {
            flag = "allHenchmen";
        } else if (typeof raw === "string" && raw.toLowerCase() === "any") {
            flag = "any";
        } else if (typeof raw === "string" && raw.toLowerCase() === "anyhenchman") {
            flag = "anyHenchman";
        } else if (typeof raw === "string" && raw.toLowerCase() === "anycoastal") {
            flag = "anyCoastal";
        } else if (typeof raw === "string" && raw.toLowerCase() === "anywithbystander") {
            flag = "anyWithBystander";
        } else if (!Number.isNaN(Number(raw))) {
            flag = Number(raw);
        }
    }

    const heroId = selectedData?.currentHeroId ?? null;

    // Selected foe (only required for true single-target damage)
    const foeSummary = selectedData?.selectedFoeSummary ?? null;

    damageFoe(
        amount,
        foeSummary,
        heroId,
        gameState,
        { flag }
    );
};

EFFECT_HANDLERS.chooseYourEffect = async function (cardData, context = {}) {
  const { currentHeroId, state } = context;
  console.log(`[chooseYourEffect] Resolving CHOOSE block for ${cardData.name}`);
  await runAbilitiesEffectsByCondition(cardData, currentHeroId, state, "none", context);
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
  if (heroState.hp == null) heroState.hp = baseHP;

  const before = heroState.hp;
  heroState.hp = Math.min(baseHP, heroState.hp + amount);

  // Optional but helpful: keep runtime hero object in sync for any renderers that read it
  heroCard.currentHP = heroState.hp;

  console.log(`[regainLife] ${heroCard.name} regains ${amount} HP (${before} → ${heroState.hp}).`);

  saveGameState(gameState);

  // IMPORTANT: refresh the other two UI locations
  try { updateHeroHPDisplays(heroId); } catch (e) { console.warn("[regainLife] updateHeroHPDisplays failed", e); }
  try { updateBoardHeroHP(heroId); } catch (e) { console.warn("[regainLife] updateBoardHeroHP failed", e); }
};

EFFECT_HANDLERS.damageOverlord = function (args, card, selectedData) {
    const amount = Number(args?.[0]) || 1;

    // Prefer the passed state (consistent with other handlers), fall back to global.
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    damageOverlord(amount, state, heroId);
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

EFFECT_HANDLERS.rescueBystander = function(args, cardData, selectedData) {
    const count = Math.max(1, Number(args?.[0]) || 1);

    const heroId = selectedData?.currentHeroId ?? null;
    if (!heroId) {
        console.warn("[rescueBystander] No currentHeroId available.");
        return;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.warn("[rescueBystander] No heroState for heroId:", heroId);
        return;
    }

    if (!Array.isArray(heroState.hand)) heroState.hand = [];

    if (!Array.isArray(bystanders) || bystanders.length === 0) {
        console.warn("[rescueBystander] No bystanders available.");
        return;
    }

    console.log(`[rescueBystander] Rescuing ${count} bystander(s) for hero ${heroId}.`);

    for (let i = 0; i < count; i++) {
        const picked = bystanders[Math.floor(Math.random() * bystanders.length)];

        if (!picked?.id) {
            console.warn("[rescueBystander] Picked invalid bystander:", picked);
            continue;
        }

        heroState.hand.push(String(picked.id));

        console.log(
            `[rescueBystander] → Rescued bystander '${picked.name ?? picked.id}'.`
        );
    }

    saveGameState(gameState);
    renderHeroHandBar(gameState);
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

EFFECT_HANDLERS.setCardDamageTo = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    const raw = args?.[0];
    const val = resolveNumericValue(raw, heroId, state);

    if (!state._pendingSetDamage) state._pendingSetDamage = null;
    state._pendingSetDamage = Number(val) || 0;
};

EFFECT_HANDLERS.increaseCardDamage = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    const raw = args?.[0];
    const delta = resolveNumericValue(raw, heroId, state);

    if (!state._pendingDamage) state._pendingDamage = 0;
    state._pendingDamage += Number(delta) || 0;
};

EFFECT_HANDLERS.discard = function(args = [], card, selectedData = {}) {
    const count = Math.max(1, Number(args?.[0]) || 1);
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    if (!heroId) {
        console.warn("[discard] No currentHeroId available.");
        return;
    }

    const heroState = state.heroData?.[heroId];
    if (!heroState || !Array.isArray(heroState.hand)) {
        console.warn("[discard] No heroState/hand for heroId:", heroId);
        return;
    }

    state.discardMode = {
        heroId,
        remaining: count
    };

    try {
        showMightBanner(`Discard ${count} card(s)`, 1500);
    } catch (e) {
        console.warn("[discard] Could not show discard banner.", e);
    }

    renderHeroHandBar(state);
    saveGameState(state);
};

EFFECT_HANDLERS.freezeVillain = function(args = [], card, selectedData = {}) {
    const who = (args?.[0] ?? "any") || "any";
    const howLong = (args?.[1] ?? "forever") || "forever";

    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    // lastDamagedFoe
    if (String(who).toLowerCase() === "lastdamagedfoe") {
        const info = state.lastDamagedFoe;
        if (!info) {
            console.warn("[freezeVillain] No lastDamagedFoe recorded.");
            return;
        }
        const instId = info.instanceId;
        if (!instId) {
            console.warn("[freezeVillain] lastDamagedFoe missing instanceId; skipping.");
            return;
        }
        const entry = Array.isArray(state.cities)
            ? state.cities.find(e => e && getEntryKey(e) === instId)
            : null;
        if (!entry || typeof entry.slotIndex !== "number") {
            console.warn("[freezeVillain] Could not locate lastDamagedFoe entry.");
            return;
        }
        applyFreezeToEntry(entry, entry.slotIndex, state, { howLong, heroId });
        return;
    }

    // default: any (selection)
    if (String(who).toLowerCase() === "any") {
        if (typeof window === "undefined") {
            console.warn("[freezeVillain] 'any' selection requires browser UI.");
            return;
        }
        window.__freezeSelectMode = {
            state,
            heroId,
            howLong
        };
        try {
            showMightBanner("Choose a foe to freeze", 1800);
        } catch (err) {
            console.warn("[freezeVillain] Could not show selection banner.", err);
        }
        return;
    }

    // fallback: if a foe summary is provided in selectedData, freeze that
    const foeSummary = selectedData?.selectedFoeSummary ?? null;
    if (foeSummary && Array.isArray(state.cities)) {
        const idx = (typeof foeSummary.slotIndex === "number") ? foeSummary.slotIndex : null;
        const entry = (idx != null) ? state.cities[idx] : null;
        if (entry && String(entry.id) === String(foeSummary.foeId || foeSummary.id)) {
            const slotIndex = idx != null ? idx : entry.slotIndex;
            applyFreezeToEntry(entry, slotIndex, state, { howLong, heroId });
        }
    }
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

    //console.log("%c[AbilityExecutor] Checking for gameStart abilities…", "color: purple; font-weight:bold;");

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
            if (eff.condition.trim() === "gameStart") {

                const effectString = eff.effect;

                //console.log(`%c[AbilityExecutor] Triggering gameStart on ${card.name}: ${effectString}`,
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

    //console.log("%c[AbilityExecutor] Completed gameStart ability scan.", "color: purple; font-weight:bold;");
}

export function currentTurn(turnIndex, selectedHeroIds) {
    try {
        const row = document.getElementById("heroes-row");
        if (!row) return;

        const slots = row.querySelectorAll(".hero-slot");
        if (!slots.length) return;

        // Remove any existing active-turn styling
        slots.forEach(slot => {
            slot.classList.remove("active-turn-slot");
            slot.style.removeProperty("--turn-glow-color");
        });

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

        // APPLY ACTIVE TURN STYLING TO THE SLOT
        const activeSlot = slots[turnIndex];
        activeSlot.classList.add("active-turn-slot");
        activeSlot.style.setProperty("--turn-glow-color", heroColor);

    } catch (err) {
        console.warn("[currentTurn] Failed:", err);
    }
}

async function runCharge(cardId, distance) {

    const entryIndex = CITY_ENTRY_UPPER;

    const shoveResult = await pushChain(entryIndex);
    if (shoveResult?.blockedFrozen) {
        console.log("[runCharge] Charge blocked by frozen foe in shove path; aborting placement.");
        return;
    }

    placeCardIntoCitySlot(cardId, entryIndex);

    try {
        const cardData = findCardInAllSources(cardId);

        const bannerText =
            cardData?.abilitiesNamePrint?.[0]?.text ||
            "Charge!";

        showMightBanner(bannerText, 1200);
    } catch (e) {
        console.warn("[runCharge] Could not show Charge banner:", e);
    }

    setTimeout(async () => {
        addChargeRushLines(entryIndex);

        let fromPos = UPPER_ORDER.indexOf(entryIndex);

        for (let step = 0; step < distance; step++) {
            const moved = await attemptSingleLeftShift(fromPos);
            if (!moved) break;
            fromPos -= 1;
        }

        saveGameState(gameState);

        (function clearCitiesBehindCharge() {
            const citySlots = document.querySelectorAll(".city-slot");

            const destinationPos = fromPos + 1;
            const destIndex = UPPER_ORDER[destinationPos];

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

    // frozen check (per-instance first, then template flag)
    const leftEntry = gameState.cities[toIndex];
    if (leftEntry && isFrozen(leftEntry)) {
        return false;
    }

    const result = await pushChain(toIndex);
    if (result?.blockedFrozen) return false;
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

        let nameList = captured
        .map(b => (b && b.name ? String(b.name) : "Bystander"))
        .join(", ");

        if (!nameList) nameList = "Bystander";

        const msg =
        total === 1
            ? `${nameList} KO'd`
            : `Bystanders KO'd: ${nameList}`;

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

    // Pull per-instance HP first; fall back to tracked villainHP or base card HP
    const getInstanceKey = (obj) => {
        const k = obj?.instanceId ?? obj?.uniqueId ?? null;
        return (k == null) ? null : String(k);
    };

    const vMax = Number(entry?.maxHP ?? foeCard.hp ?? 0);
    const entryKey = getInstanceKey(entry);
    const storedHP =
        (entryKey && state.villainHP && typeof state.villainHP[entryKey] === "number")
            ? state.villainHP[entryKey]
            : null;

    let vCur = entry && typeof entry.currentHP === "number"
        ? entry.currentHP
        : (storedHP != null ? storedHP : vMax);

    // Keep the card's currentHP in sync for any UI that still reads it
    foeCard.currentHP = vCur;

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
        if (!exiting) return { blockedFrozen: false };
        // Only block if we would actually move a frozen foe off the board
        if (isFrozen(exiting)) {
            console.log("[pushChain] Blocked by frozen foe at exit.", exiting);
            return { blockedFrozen: true };
        }

        await handleVillainEscape(exiting, gameState);
        resolveExitForVillain(exiting);
        return { blockedFrozen: false };
    }

    const nextLeft = UPPER_ORDER[pos - 1];

    // If occupied, push that one further left (recursively)
    if (gameState.cities[targetIndex]) {
        // Only block if we need to move a frozen foe
        const occupant = gameState.cities[targetIndex];
        if (isFrozen(occupant)) {
            console.log("[pushChain] Blocked by frozen foe; cannot shove.", occupant);
            return { blockedFrozen: true };
        }
        const result = await pushChain(nextLeft);
        if (result?.blockedFrozen) {
            return { blockedFrozen: true };
        }
        moveCardModelAndDOM(targetIndex, nextLeft);
    }

    return { blockedFrozen: false };
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
        if (gameState.cities[toIndex].isFrozen) {
            ensureFrozenOverlay(toIndex);
        }
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

function isFrozen(entryOrId) {
    // Per-instance flag wins if present
    if (entryOrId && typeof entryOrId === "object") {
        if (entryOrId.isFrozen === true) {
            ensureFrozenOverlay(entryOrId.slotIndex);
            return true;
        }

        // Clash: foe is frozen only while a hero is in the lower slot beneath it
        const clashId = entryOrId.id ?? entryOrId.baseId ?? entryOrId.foeId;
        if (clashId != null && cardHasClash(clashId)) {
            // Find this foe's upper slot index
            let upperIdx = (typeof entryOrId.slotIndex === "number") ? entryOrId.slotIndex : null;
            if (upperIdx == null && Array.isArray(gameState.cities)) {
                // Try to locate by object reference first, then by id
                const byRef = gameState.cities.findIndex(e => e === entryOrId);
                if (byRef !== -1) upperIdx = byRef;
                if (upperIdx == null || upperIdx === -1) {
                    const byId = gameState.cities.findIndex(e => e && String(e.id) === String(clashId));
                    if (byId !== -1) upperIdx = byId;
                }
            }

            if (typeof upperIdx === "number") {
                const lowerIdx = upperIdx + 1;
                const heroIds = gameState.heroes || [];
                const engaged = heroIds.some(hid => gameState.heroData?.[hid]?.cityIndex === lowerIdx);
                if (engaged) {
                    ensureFrozenOverlay(upperIdx);
                    return true;
                } else {
                    removeFrozenOverlay(upperIdx);
                }
            }
        }

        // Some callers might still pass the id property; fall through to template check
        const id = entryOrId.id ?? entryOrId.baseId ?? entryOrId.foeId;
        if (id != null) {
            entryOrId = id;
        }
    }

    const cardId = entryOrId;
    const data =
        henchmen.find(h => h.id === cardId) ||
        villains.find(v => v.id === cardId);

    // Template-level frozen flag
    const frozen = data?.isFrozen === true;
    if (frozen && typeof entryOrId === "object" && entryOrId.slotIndex != null) {
        ensureFrozenOverlay(entryOrId.slotIndex);
    } else if (!frozen && typeof entryOrId === "object" && entryOrId.slotIndex != null) {
        removeFrozenOverlay(entryOrId.slotIndex);
    }
    return frozen;
}

function cardHasClash(cardId) {
    const card =
        henchmen.find(h => String(h.id) === String(cardId)) ||
        villains.find(v => String(v.id) === String(cardId));
    if (!card) return false;

    if (card.hasClash === true) return true;

    const effects = Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : [];
    for (const eff of effects) {
        const raw = eff?.effect;
        const list = Array.isArray(raw) ? raw : [raw];
        for (const e of list) {
            if (typeof e !== "string") continue;
            if (e.trim().toLowerCase() === "hasclash") return true;
        }
    }
    return false;
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

export async function onHeroCardActivated(cardId, meta = {}) {
    if (gameState.gameOver) {
        console.log("[GameOver] Ignoring hero card activation; game is already over.");
        return;
    }

    // Reset pending damage accumulator for this activation
    gameState._pendingDamage = 0;

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
                            instanceId: entry.instanceId,
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
    const baseDamageAmount = Number(rawDamage) || 0;

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
    // EFFECT EXECUTION PIPELINE (WITH OPTIONAL SUPPORT)
    // ------------------------------------------------------
    console.log(`[AbilityExecutor] Beginning effect execution for ${cardName}.`);

    const postEffects = [];

    async function executeEffectBlock(eff, i, { skipCondition = false } = {}) {
        // ---------- CONDITION ----------
        if (!skipCondition) {
            let cond = "none";
            let condList = [];

            if (eff.condition != null) {
                if (typeof eff.condition === "string") {
                    cond = eff.condition.trim();
                } else if (Array.isArray(eff.condition)) {
                    condList = eff.condition.map(c => String(c).trim());
                } else {
                    console.warn(
                        "[AbilityExecutor] Invalid condition type:",
                        eff.condition,
                        "on effect",
                        eff
                    );
                }
            }

            const allConds = condList.length ? condList : (cond !== "none" ? [cond] : []);
            let condFailed = false;
            for (const c of allConds) {
                if (!evaluateCondition(c, heroId, gameState)) {
                    condFailed = true;
                    break;
                }
            }
            if (condFailed) {
                console.log(`[AbilityExecutor] Condition failed; skipping effect.`, { effect: eff });
                return;
            }
        }

        // ---------- OPTIONAL ----------
        if (eff.type === "optional") {

            const promptText =
                cardData.abilitiesNamePrint?.[i]?.text
                    ? `${cardData.abilitiesNamePrint[i].text}?`
                    : "Use optional ability?";

            const allow = await window.showOptionalAbilityPrompt(promptText);

            if (!allow) {
                console.log(`[AbilityExecutor] Optional ability declined.`);
                return;
            }

            console.log(`[AbilityExecutor] Optional ability accepted.`);
        }

        // ------------------------------------------------------
        // CHOOSE OPTION HANDLING
        // ------------------------------------------------------
        if (eff.type === "chooseOption") {

            const headerText =
                cardData.abilitiesNamePrint?.[i]?.text || "Choose";

            const options = [];
            const optionEffects = [];

            let j = i + 1;

            while (
                j < cardData.abilitiesEffects.length &&
                /^chooseOption\(\d+\)$/.test(cardData.abilitiesEffects[j].type)
            ) {
                const m = cardData.abilitiesEffects[j].type.match(/^chooseOption\((\d+)\)$/);
                const optionNumber = m ? Number(m[1]) : null;

                const label =
                    cardData.abilitiesNamePrint?.[j]?.text ||
                    `Option ${options.length + 1}`;

                options.push({ label });
                optionEffects.push(cardData.abilitiesEffects[j]);
                j++;
            }

            if (options.length === 0) {
                console.warn("[AbilityExecutor] chooseOption has no options.");
                return;
            }

            const chosenIndex = await window.showChooseAbilityPrompt({
                header: headerText,
                options
            });

            const chosenEffectBlock = optionEffects[chosenIndex];

            console.log(`[AbilityExecutor] Chose option ${chosenIndex + 1}.`);

            // Execute ONLY the chosen option’s effects
            const effectsArray = Array.isArray(chosenEffectBlock.effect)
                ? chosenEffectBlock.effect
                : [chosenEffectBlock.effect];

            for (const effectString of effectsArray) {
                await executeParsedEffect(effectString, cardData, heroId, gameState);
            }

            // Skip past all chooseOption(n) entries
            return { skipTo: j - 1 };
        }

        // ---------- NORMALIZE EFFECT LIST ----------
        const effectsArray = Array.isArray(eff.effect)
            ? eff.effect
            : [eff.effect];

        for (const effectString of effectsArray) {

            if (typeof effectString !== "string") continue;

            const match = effectString.match(/^([A-Za-z0-9_]+)\((.*)\)$/);
            if (!match) {
                console.warn(`[AbilityExecutor] Could not parse effect '${effectString}'.`);
                continue;
            }

            const fnName = match[1];
            const argsRaw = match[2]
                .split(",")
                .map(x => x.trim())
                .filter(Boolean);

            const handler = EFFECT_HANDLERS[fnName];
            if (!handler) {
                console.warn(`[AbilityExecutor] No handler for '${fnName}'.`);
                continue;
            }

            const parsedArgs = argsRaw.map(a => {
                if (/^\d+$/.test(a)) return Number(a);
                if (a === "true") return true;
                if (a === "false") return false;
                // Allow nested numeric helpers
                const val = a.trim().toLowerCase();
                if (val === "getcardsdiscarded") return getCardsDiscarded(heroId, gameState);
                if (val === "findkodheroes") return findKOdHeroes(gameState);
                return a;
            });

            console.log(`[AbilityExecutor] Executing '${fnName}'`, parsedArgs);

            try {
                handler(parsedArgs, cardData, { currentHeroId: heroId, state: gameState });
            } catch (err) {
                console.warn(`[AbilityExecutor] Effect '${fnName}' failed:`, err);
            }
        }

        return {};
    }

    if (Array.isArray(cardData?.abilitiesEffects)) {

        for (let i = 0; i < cardData.abilitiesEffects.length; i++) {

            const eff = cardData.abilitiesEffects[i];

            // ---------- CONDITION ----------
            let cond = "none";
            let condList = [];

            if (eff.condition != null) {
                if (typeof eff.condition === "string") {
                    cond = eff.condition.trim();
                } else if (Array.isArray(eff.condition)) {
                    condList = eff.condition.map(c => String(c).trim());
                } else {
                    console.warn(
                        "[AbilityExecutor] Invalid condition type:",
                        eff.condition,
                        "on effect",
                        eff
                    );
                }
            }

            const allConds = condList.length ? condList : (cond !== "none" ? [cond] : []);
            const isAfterDamage = allConds.some(c => c.toLowerCase() === "afterdamage");
            if (isAfterDamage) {
                postEffects.push({ eff, index: i });
                continue;
            }

            let condFailed = false;
            for (const c of allConds) {
                if (!evaluateCondition(c, heroId, gameState)) {
                    condFailed = true;
                    break;
                }
            }
            if (condFailed) {
                console.log(`[AbilityExecutor] Condition failed; skipping effect.`, { effect: eff });
                continue;
            }

            const res = await executeEffectBlock(eff, i, { skipCondition: true });
            if (res && res.skipTo != null) {
                i = res.skipTo;
            }
        }
    }

    // ------------------------------------------------------
    // APPLY BASE DAMAGE AFTER EFFECTS
    // ------------------------------------------------------
    const bonusDamage = Number(gameState._pendingDamage || 0);
    let damageAmount = baseDamageAmount + bonusDamage;
    if (gameState._pendingSetDamage != null) {
        damageAmount = Number(gameState._pendingSetDamage) || 0;
    }
    gameState._pendingDamage = 0;
    gameState._pendingSetDamage = null;

    if (foeSummary && damageAmount > 0) {
        console.log(
            `[AbilityExecutor] ${heroName} is dealing ${damageAmount} damage to ${foeSummary.foeName}.`
        );

        if (foeSummary.source === "overlord") {
            damageOverlord(damageAmount, gameState, heroId);
        } else if (foeSummary.source === "city-upper") {
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

    // ------------------------------------------------------
    // POST-DAMAGE EFFECTS (e.g., afterDamage)
    // ------------------------------------------------------
    if (postEffects.length) {
        for (let k = 0; k < postEffects.length; k++) {
            const { eff, index } = postEffects[k];
            const res = await executeEffectBlock(eff, index, { skipCondition: true });
            if (res && res.skipTo != null) {
                k = res.skipTo;
            }
        }
    }

    console.log(`[AbilityExecutor] Completed effect execution for ${cardName}.`);
}

async function executeParsedEffect(effectString, cardData, heroId, gameState) {
    const match = effectString.match(/^([A-Za-z0-9_]+)\((.*)\)$/);
    if (!match) return;

    const fnName = match[1];
    const argsRaw = match[2].split(",").map(x => x.trim()).filter(Boolean);

    const handler = EFFECT_HANDLERS[fnName];
    if (!handler) return;

    const parsedArgs = argsRaw.map(a => {
        if (/^\d+$/.test(a)) return Number(a);
        if (a === "true") return true;
        if (a === "false") return false;
        return a;
    });

    executeEffectSafely(effectString, cardData, { currentHeroId: heroId, state: gameState });
}

// =======================================================================
// DAMAGE THE CURRENT OVERLORD
// =======================================================================
export function damageOverlord(amount, state = gameState, heroId = null) {
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
    const actualDamage = Math.max(0, Math.min(amount, currentHP));
    const newHP     = Math.max(0, currentHP - amount);

    if (heroId != null) {
        if (!s.heroDamageToOverlord) s.heroDamageToOverlord = {};
        s.heroDamageToOverlord[heroId] = (s.heroDamageToOverlord[heroId] || 0) + actualDamage;
    }

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
// DAMAGE A HENCHMAN / VILLAIN IN THE CITY (PER-INSTANCE SAFE)
// =======================================================================
export function damageFoe(amount, foeSummary, heroId = null, state = gameState, options = {}) {
    const s = state;

    const { flag = "single", fromAny = false, fromAll = false } = options;

    // ============================================================
    // FLAG: "any" — enable UI target selection via villain panel
    // ============================================================
    if (flag === "any") {
        if (typeof window === "undefined") {
            console.warn("[damageFoe] 'any' flag requires the browser UI; no window found.");
            return;
        }

        // Store the pending selection info for buildVillainPanel to consume once the player clicks a foe.
        window.__damageFoeSelectMode = {
            amount,
            heroId,
            state: s,
            fromAny: true
        };

        try {
            const isKO = Number(amount) === 999;
            const text = isKO
                ? "Choose a foe to KO"
                : `Choose a foe to take ${amount} damage`;
            showMightBanner(text, 1800);
        } catch (err) {
            console.warn("[damageFoe] Could not show selection banner.", err);
        }

        return;
    }

    // ------------------------------------------------------------
    // Ensure any pending selection is cleared at hero end-of-turn
    // ------------------------------------------------------------
    if (typeof window !== "undefined") {
        window.__damageFoeSelectCleanupHero = heroId ?? null;
    }

    // ============================================================
    // FLAG: "anyWithBystander" — like "any" but only foes holding bystanders
    // ============================================================
    if (flag === "anyWithBystander") {
        if (typeof window === "undefined") {
            console.warn("[damageFoe] 'anyWithBystander' flag requires the browser UI; no window found.");
            return;
        }

        // If no foes currently have captured bystanders, bail out immediately.
        const hasCaptured = Array.isArray(s.cities) && s.cities.some(e =>
            e &&
            (
                (Array.isArray(e.capturedBystanders) && e.capturedBystanders.length > 0) ||
                (Number(e.capturedBystanders) > 0)
            )
        );
        if (!hasCaptured) {
            console.log("[damageFoe] No foes with captured bystanders; skipping anyWithBystander selection.");
            return;
        }

        window.__damageFoeSelectMode = {
            amount,
            heroId,
            state: s,
            fromAny: true,
            requireBystanders: true
        };

        try {
            const isKO = Number(amount) === 999;
            const text = isKO
                ? "Choose a foe with a bystander to KO"
                : `Choose a foe with a bystander to take ${amount} damage`;
            showMightBanner(text, 1800);
        } catch (err) {
            console.warn("[damageFoe] Could not show selection banner.", err);
        }

        return;
    }

    // ============================================================
    // FLAG: "anyHenchman" — enable UI selection limited to Henchmen
    // ============================================================
    if (flag === "anyHenchman") {
        if (typeof window === "undefined") {
            console.warn("[damageFoe] 'anyHenchman' flag requires the browser UI; no window found.");
            return;
        }

        window.__damageFoeSelectMode = {
            amount,
            heroId,
            state: s,
            fromAny: true,
            allowedTypes: ["Henchman"]
        };

        try {
            const isKO = Number(amount) === 999;
            const text = isKO
                ? "Choose a Henchman to KO"
                : `Choose a Henchman to take ${amount} damage`;
            showMightBanner(text, 1800);
        } catch (err) {
            console.warn("[damageFoe] Could not show selection banner.", err);
        }

        return;
    }

    // ============================================================
    // FLAG: "anyCoastal" — like "any" but limited to coastal cities
    // ============================================================
    if (flag === "anyCoastal") {
        if (typeof window === "undefined") {
            console.warn("[damageFoe] 'anyCoastal' flag requires the browser UI; no window found.");
            return;
        }

        const { left, right } = checkCoastalCities(s);
        const allowedSlots = [left, right].filter(v => Number.isInteger(v));

        if (!allowedSlots.length || !Array.isArray(s.cities)) {
            console.log("[damageFoe] No coastal cities available for selection; skipping.");
            return;
        }

        const hasTarget = allowedSlots.some(idx => {
            const entry = s.cities[idx];
            return entry && entry.id != null;
        });

        if (!hasTarget) {
            console.log("[damageFoe] No foes in coastal cities; skipping selection.");
            return;
        }

        window.__damageFoeSelectMode = {
            amount,
            heroId,
            state: s,
            fromAny: true,
            allowedSlots
        };

        try {
            showMightBanner(`Choose a COASTAL foe to take ${amount} damage`, 1800);
        } catch (err) {
            console.warn("[damageFoe] Could not show selection banner.", err);
        }

        return;
    }

    // Helper: unified per-instance key (supports either property name)
    const getInstanceKey = (obj) => {
        const k = obj?.instanceId ?? obj?.uniqueId ?? null;
        return (k == null) ? null : String(k);
    };

    // ============================================================
    // FLAG: 0/2/4/6/8/10 → damage the foe in that UPPER city index
    // ============================================================
    const flagNum =
        (typeof flag === "number")
            ? flag
            : (typeof flag === "string" && flag.trim() !== "" && !Number.isNaN(Number(flag)))
                ? Number(flag)
                : null;

    const UPPER_CITY_TARGETS = new Set([0, 2, 4, 6, 8, 10]);

    if (Number.isInteger(flagNum) && UPPER_CITY_TARGETS.has(flagNum)) {
        if (!Array.isArray(s.cities)) {
            console.warn("[damageFoe] No cities array; cannot apply numeric city flag damage.");
            return;
        }

        const slotIndex = flagNum;
        const entry = s.cities[slotIndex];

        if (!entry || entry.id == null) {
            console.log(`[damageFoe] No foe in city slot ${slotIndex}; no damage applied.`);
            return;
        }

        const foeIdStr = String(entry.id);

        const foeCard =
            villains.find(v => String(v.id) === foeIdStr) ||
            henchmen.find(h => String(h.id) === foeIdStr);

        if (!foeCard) {
            console.warn("[damageFoe] No card data found for foe id at slot:", slotIndex, foeIdStr);
            return;
        }

        const cityFoeSummary = {
            foeType: foeCard.type || "Enemy",
            foeId: foeIdStr,

            // IMPORTANT: take instance key from the ENTRY
            instanceId: getInstanceKey(entry),

            foeName: foeCard.name,
            currentHP: entry.currentHP ?? foeCard.hp,
            slotIndex,
            source: "city-upper"
        };

        damageFoe(amount, cityFoeSummary, heroId, s, { flag: "single" }); // prevent recursion
        return;
    }

    // ============================================================
    // FLAG: "all" → damage ALL active henchmen & villains in cities
    // ============================================================
    if (flag === "all") {
        if (!Array.isArray(s.cities)) {
            console.warn("[damageFoe] No cities array; cannot apply 'all' damage.");
            return;
        }

        console.log(`[damageFoe] Applying ${amount} damage to ALL city foes.`);

        const allFoes = [];

        for (let slotIndex = 0; slotIndex < s.cities.length; slotIndex++) {
            const entry = s.cities[slotIndex];
            if (!entry || entry.id == null) continue;

            const foeIdStr = String(entry.id);

            const foeCard =
                villains.find(v => String(v.id) === foeIdStr) ||
                henchmen.find(h => String(h.id) === foeIdStr);

            if (!foeCard) continue;

            allFoes.push({
                foeType: foeCard.type || "Enemy",
                foeId: foeIdStr,
                instanceId: getInstanceKey(entry),
                foeName: foeCard.name,
                currentHP: entry.currentHP ?? foeCard.hp,
                slotIndex,
                source: "city-upper"
            });
        }

        if (!allFoes.length) {
            console.log("[damageFoe] No active city foes to damage.");
            return;
        }

        for (const foe of allFoes) {
            damageFoe(amount, foe, heroId, s, { flag: "single", fromAll: true }); // prevent recursion
        }

        return;
    }

    // ============================================================
    // FLAG: "allHenchmen" — damage ALL Henchmen in cities
    // ============================================================
    if (flag === "allHenchmen") {
        if (!Array.isArray(s.cities)) {
            console.warn("[damageFoe] No cities array; cannot apply 'allHenchmen' damage.");
            return;
        }

        console.log(`[damageFoe] Applying ${amount} damage to ALL Henchmen in cities.`);

        const allH = [];

        for (let slotIndex = 0; slotIndex < s.cities.length; slotIndex++) {
            const entry = s.cities[slotIndex];
            if (!entry || entry.id == null) continue;

            const foeIdStr = String(entry.id);
            const foeCard =
                henchmen.find(h => String(h.id) === foeIdStr) ||
                null;

            if (!foeCard || (foeCard.type && foeCard.type !== "Henchman")) continue;

            allH.push({
                foeType: foeCard.type || "Enemy",
                foeId: foeIdStr,
                instanceId: getInstanceKey(entry),
                foeName: foeCard.name,
                currentHP: entry.currentHP ?? foeCard.hp,
                slotIndex,
                source: "city-upper"
            });
        }

        if (!allH.length) {
            console.log("[damageFoe] No Henchmen in cities to damage.");
            return;
        }

        for (const foe of allH) {
            damageFoe(amount, foe, heroId, s, { flag: "single", fromAll: true });
        }

        return;
    }

    // ------------------------------------------------------------
    // Validation / input normalization
    // ------------------------------------------------------------
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

    // If caller provides slotIndex, trust it as the primary disambiguator
    let slotIndex = (typeof foeSummary.slotIndex === "number") ? foeSummary.slotIndex : null;

    // Fast safety check (prevents damaging a slot that no longer contains that foe)
    if (slotIndex != null) {
        const e = s.cities[slotIndex];
        if (!e || String(e.id) !== foeIdStr) {
            return;
        }
    }

    // ------------------------------------------------------------
    // Locate the exact city entry
    // Priority: slotIndex -> instanceId/uniqueId -> fallback by id
    // ------------------------------------------------------------
    let entry = null;

    if (slotIndex != null) {
        entry = s.cities[slotIndex];
    }

    const wantedKey = getInstanceKey(foeSummary);

    if (!entry && wantedKey != null) {
        entry = s.cities.find(e => e && getInstanceKey(e) === wantedKey) || null;
        if (entry) slotIndex = entry.slotIndex ?? slotIndex;
    }

    if (!entry) {
        // Fallback: find by id (ambiguous if duplicates exist)
        let found = null;
        let count = 0;

        for (let i = 0; i < s.cities.length; i++) {
            const e = s.cities[i];
            if (e && String(e.id) === foeIdStr) {
                found = e;
                slotIndex = i;
                count++;
            }
        }

        if (count > 1) {
            console.warn(
                "[damageFoe] Multiple copies found for foe id; per-instance key missing. " +
                "Damage may target the wrong copy. Ensure foeSummary.instanceId is set from the city entry.",
                { foeIdStr, count, foeSummary }
            );
        }

        entry = found;
    }

    if (!entry) {
        console.warn("[damageFoe] Could not find city entry for foe id:", foeIdStr, foeSummary);
        return;
    }

    // Lookup immutable template card data
    const foeCard =
        villains.find(v => String(v.id) === foeIdStr) ||
        henchmen.find(h => String(h.id) === foeIdStr);

    if (!foeCard) {
        console.warn("[damageFoe] No card data found for foe id:", foeIdStr);
        return;
    }

    const baseHP = Number(foeCard.hp || 0) || 0;

    if (!s.villainHP) s.villainHP = {};

    // Ensure the entry has an instance key. If you already store uniqueId, we mirror it into instanceId.
    let entryKey = getInstanceKey(entry);
    if (entryKey == null) {
        // Last resort: generate a key (better than collapsing copies onto base id)
        const gen = `inst_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        entry.instanceId = gen;
        entryKey = String(gen);
    } else {
        // Normalize: if entry used uniqueId only, also set instanceId so other code can rely on it
        if (entry.instanceId == null && entry.uniqueId != null) {
            entry.instanceId = entry.uniqueId;
        }
    }

    // Pull current HP strictly from per-instance storage (entry -> villainHP -> base)
    let currentHP = entry.currentHP;
    const savedHP = s.villainHP[entryKey];

    if (typeof currentHP !== "number") {
        if (typeof savedHP === "number") currentHP = savedHP;
        else currentHP = baseHP;
    }

    // Track last damaged foe for follow-up effects (only if we have a stable instance key)
    if (entryKey) {
        s.lastDamagedFoe = {
            foeId: foeIdStr,
            instanceId: entryKey,
            slotIndex
        };
    }

    const newHP = Math.max(0, currentHP - amount);

    // Sync per-instance representations (DO NOT mutate foeCard.currentHP)
    entry.maxHP = baseHP;
    entry.currentHP = newHP;
    s.villainHP[entryKey] = newHP;

    console.log(`[damageFoe] ${foeCard.name} took ${amount} damage (${currentHP} -> ${newHP}).`);

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

                wrapper.style.cursor = "pointer";
                wrapper.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (typeof window !== "undefined" && typeof window.buildVillainPanel === "function") {
                        window.buildVillainPanel(foeCard);
                    }
                });

                // Re-apply freeze overlay if this entry is frozen (including clash-engaged)
                if (entry.isFrozen || isFrozen({ ...entry, slotIndex })) {
                    ensureFrozenOverlay(slotIndex);
                } else {
                    removeFrozenOverlay(slotIndex);
                }
            }
        }
    } catch (err) {
        console.warn("[damageFoe] Failed to re-render foe card on board.", err);
    }

    // If not KO'd, persist and exit
    if (newHP > 0) {
        saveGameState(s);
        return;
    }

    // ===================================================================
    // FOE KO'D
    // ===================================================================
    console.log(`[damageFoe] ${foeCard.name} has been KO'd.`);
    if (heroId != null) {
        if (!s.heroFoesKOd) s.heroFoesKOd = {};
        const heroSlot = s.heroData?.[heroId]?.cityIndex ?? null;
        const current = s.heroFoesKOd[heroId] || { count: 0, slotIndex: heroSlot };
        s.heroFoesKOd[heroId] = {
            count: (current.count || 0) + 1,
            slotIndex: heroSlot
        };
    }
    showMightBanner(`${foeCard.name} has been KO'd.`, 2000);

    // 1) REMOVE FOE FROM MODEL AND DOM IMMEDIATELY (prevents ghost foes)
    if (slotIndex != null && Array.isArray(s.cities)) {
        const e = s.cities[slotIndex];
        if (e && String(e.id) === foeIdStr) {
            s.cities[slotIndex] = null;
        }
    }

    // If a hero was engaged beneath this foe, send them back to HQ (cityIndex -> null)
    if (Number.isInteger(slotIndex) && Array.isArray(s.heroes) && s.heroData) {
        const lowerSlot = slotIndex + 1;
        s.heroes.forEach(hid => {
            const hState = s.heroData[hid];
            if (!hState) return;
            if (hState.cityIndex === lowerSlot) {
                hState.cityIndex = null;
                try {
                    const citySlots = document.querySelectorAll(".city-slot");
                    const slot = citySlots?.[lowerSlot];
                    const area = slot?.querySelector(".city-card-area");
                    if (area) area.innerHTML = "";
                } catch (err) {
                    console.warn("[damageFoe] Failed to clear engaged hero UI after foe KO.", err);
                }
            }
        });
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

    // Clean per-instance HP entry
    delete s.villainHP[entryKey];

    // 2) RESCUE CAPTURED BYSTANDERS
    if (Array.isArray(entry.capturedBystanders) && entry.capturedBystanders.length > 0) {
        const captured = entry.capturedBystanders;

        if (heroId != null && s.heroData && s.heroData[heroId]) {
            const heroState = s.heroData[heroId];
            if (!Array.isArray(heroState.hand)) heroState.hand = [];

            captured.forEach(b => heroState.hand.push(String(b.id)));

            console.log(`[damageFoe] Hero ${heroId} rescues bystanders:`, captured.map(b => b.name));
        } else {
            if (!Array.isArray(s.koCards)) s.koCards = [];

            captured.forEach(b => {
                s.koCards.push({
                    id: b.id,
                    name: b.name,
                    type: b.type || "Bystander",
                    source: "rescued-none"
                });
            });

            if (typeof window !== "undefined" && typeof window.renderKOBar === "function") {
                window.renderKOBar(s);
            }
        }

        entry.capturedBystanders = [];
    }

    // 3) RUN uponDefeat (after removal so other systems can't see the foe)
    runUponDefeatEffects(foeCard, heroId, s, { selectedFoeSummary: foeSummary });

    // 4) APPEND FOE TO KO ARRAY
    if (!Array.isArray(s.koCards)) s.koCards = [];
    s.koCards.push({
        id: foeCard.id,
        name: foeCard.name,
        type: foeCard.type || "Enemy",
        source: "hero-attack"
    });

    // 5) RETURN HERO TO HQ (if applicable)
    if (fromAny || fromAll) {
        // Prefer the acting hero when provided
        if (heroId != null) {
            maybeSendHeroHomeAfterLaneClears(heroId, slotIndex, s);
        } else if (slotIndex != null && s.heroData) {
            // Fallback: check all heroes to see whose lane just cleared
            Object.keys(s.heroData).forEach(hId => {
                maybeSendHeroHomeAfterLaneClears(hId, slotIndex, s);
            });
        }
    } else if (heroId != null) {
        maybeSendHeroHomeAfterLaneClears(heroId, slotIndex, s);
    }

    renderHeroHandBar(s);
    saveGameState(s);
}

export function freezeFoe(entry, slotIndex, state = gameState, options = {}) {
    applyFreezeToEntry(entry, slotIndex, state, options);
}

export function refreshFrozenOverlays(state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.cities)) return;

    s.cities.forEach((entry, idx) => {
        if (!entry) {
            removeFrozenOverlay(idx);
            return;
        }

        if (isFrozen({ ...entry, slotIndex: idx })) {
            ensureFrozenOverlay(idx);
        } else {
            removeFrozenOverlay(idx);
        }
    });
}

export function getCardsDiscarded(heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId) return 0;
    const hState = s.heroData?.[heroId];
    if (!hState) return 0;
    return Number(hState.discardedThisTurn || 0);
}

export function runIfDiscardedEffects(cardData, heroId, state) {
    if (!cardData) return;
    const effects = Array.isArray(cardData.abilitiesEffects) ? cardData.abilitiesEffects : [];
    if (!effects.length) return;

    const abilityNames = Array.isArray(cardData.abilitiesNamePrint) ? cardData.abilitiesNamePrint : [];

    for (let i = 0; i < effects.length; i++) {
        const eff = effects[i];
        const cond = String(eff?.condition || "").trim().toLowerCase();
        if (cond !== "ifdiscarded") continue;

        const effType = String(eff?.type || "").toLowerCase();
        const effVal = eff?.effect;

        // OPTIONAL
        if (effType === "optional") {
            const label =
                abilityNames[i]?.text
                    ? `${abilityNames[i].text}?`
                    : "Use optional ability?";

            window.showOptionalAbilityPrompt(label).then(allow => {
                if (!allow) return;
                const list = Array.isArray(effVal) ? effVal : [effVal];
                list.forEach(effectString => {
                    if (typeof effectString !== "string") return;
                    executeEffectSafely(effectString, cardData, { currentHeroId: heroId, state });
                });
            });
            continue;
        }

        // CHOOSE (basic support: treat as normal effects)
        const list = Array.isArray(effVal) ? effVal : [effVal];
        list.forEach(effectString => {
            if (typeof effectString !== "string") return;
            executeEffectSafely(effectString, cardData, { currentHeroId: heroId, state });
        });
    }
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
    try {
        showRetreatButtonForCurrentHero(state);
    } catch (err) {
        console.warn("[sendHeroHomeFromBoard] Failed to refresh Retreat button UI.", err);
    }
}

export async function enemyDraw(count = 1, limit = null, selectedData = {}) {
    const heroId = selectedData?.currentHeroId ?? null;
    const state = selectedData?.state ?? gameState;

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
        // SAFE EFFECT EXECUTION (OPTIONAL + CHOOSE SUPPORT)
        // Mirrors hero-card choose/optional handling.
        // -------------------------------------------------
        if (Array.isArray(cardData.abilitiesEffects)) {

            for (let i = 0; i < cardData.abilitiesEffects.length; i++) {

                const eff = cardData.abilitiesEffects[i];
                if (!eff) continue;

                // ---------- OPTIONAL ----------
                if (eff.type === "optional") {

                    const promptText =
                        cardData.abilitiesNamePrint?.[i]?.text
                            ? `${cardData.abilitiesNamePrint[i].text}?`
                            : "Use optional ability?";

                    const allow = await window.showOptionalAbilityPrompt(promptText);

                    if (!allow) {
                        console.log(`[enemyDraw] Optional ability declined for ${cardData.name}.`);
                        continue;
                    }

                    console.log(`[enemyDraw] Optional ability accepted for ${cardData.name}.`);
                }

                // ---------- CHOOSE OPTION ----------
                if (eff.type === "chooseOption") {

                    const headerText =
                        cardData.abilitiesNamePrint?.[i]?.text || "Choose";

                    const options = [];
                    const optionEffects = [];

                    let j = i + 1;

                    while (
                        j < cardData.abilitiesEffects.length &&
                        /^chooseOption\(\d+\)$/.test(cardData.abilitiesEffects[j].type)
                    ) {
                        const label =
                            cardData.abilitiesNamePrint?.[j]?.text ||
                            `Option ${options.length + 1}`;

                        options.push({ label });
                        optionEffects.push(cardData.abilitiesEffects[j]);
                        j++;
                    }

                    if (options.length === 0) {
                        console.warn(`[enemyDraw] chooseOption has no options on ${cardData.name}.`);
                        continue;
                    }

                    const chosenIndex = await window.showChooseAbilityPrompt({
                        header: headerText,
                        options
                    });

                    const chosenEffectBlock = optionEffects[chosenIndex];
                    if (!chosenEffectBlock) {
                        console.warn(`[enemyDraw] Invalid chosen option index ${chosenIndex} on ${cardData.name}.`);
                        i = j - 1;
                        continue;
                    }

                    console.log(`[enemyDraw] Chose option ${chosenIndex + 1} for ${cardData.name}.`);

                    const effectsArray = Array.isArray(chosenEffectBlock.effect)
                        ? chosenEffectBlock.effect
                        : [chosenEffectBlock.effect];

                    for (const effectString of effectsArray) {
                        if (typeof effectString !== "string") continue;

                        console.log(
                            `[enemyDraw] Executing effect '${effectString}' from ${cardData.name}`
                        );

                        try {
                            executeEffectSafely(effectString, cardData, { ...selectedData, currentHeroId: heroId, state });
                        } catch (err) {
                            console.warn(
                                `[enemyDraw] Effect failed on ${cardData.name}:`,
                                err
                            );
                        }
                    }

                    // Skip past all chooseOption(n) entries we consumed
                    i = j - 1;
                    continue;
                }

                // ---------- NORMAL EFFECTS ----------
                const effectsArray = Array.isArray(eff.effect)
                    ? eff.effect
                    : [eff.effect];

                for (const effectString of effectsArray) {
                    if (typeof effectString !== "string") continue;

                    console.log(
                        `[enemyDraw] Executing effect '${effectString}' from ${cardData.name}`
                    );

                    try {
                        executeEffectSafely(effectString, cardData, { ...selectedData, currentHeroId: heroId, state });
                    } catch (err) {
                        console.warn(
                            `[enemyDraw] Effect failed on ${cardData.name}:`,
                            err
                        );
                    }
                }
            }
        }
    }

    saveGameState(gameState);
}

window.showOptionalAbilityPrompt = function (questionText) {
    return new Promise(resolve => {
        const overlay = document.getElementById("optional-ability-overlay");
        const textEl  = document.getElementById("optional-ability-text");
        const yesBtn  = document.getElementById("optional-ability-yes");
        const noBtn   = document.getElementById("optional-ability-no");

        if (!overlay || !textEl || !yesBtn || !noBtn) {
            console.warn("[OptionalAbility] Modal elements missing.");
            resolve(false);
            return;
        }

        textEl.innerHTML = questionText;
        overlay.style.display = "flex";

        const cleanup = (result) => {
            overlay.style.display = "none";
            yesBtn.onclick = null;
            noBtn.onclick = null;
            resolve(result);
        };

        yesBtn.onclick = () => cleanup(true);
        noBtn.onclick  = () => cleanup(false);
    });
};

window.showChooseAbilityPrompt = function ({ header, options }) {
    return new Promise(resolve => {
        const overlay = document.getElementById("choose-ability-overlay");
        const headerEl = document.getElementById("choose-ability-header");
        const tabsEl = document.getElementById("choose-ability-tabs");
        const confirmBtn = document.getElementById("choose-ability-confirm");

        if (!overlay || !headerEl || !tabsEl || !confirmBtn) {
            console.warn("[ChooseAbility] Modal elements missing.");
            resolve(0);
            return;
        }

        let selectedIndex = 0;

        headerEl.innerHTML = header;
        tabsEl.innerHTML = "";

        options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.textContent = opt.label;
            btn.style.cssText = `
                padding:8px 10px;
                font-weight:bold;
                border:none;
                border-radius:10px;
                border:4px solid black;
                background:${idx === 0 ? "#ffd800" : "#ddd"};
                color:black;
                cursor:pointer;

                flex: 1 1 0;
                min-width: 0;

                white-space: nowrap;
                overflow: hidden;
                text-align: center;
            `;

            btn.onclick = () => {
                selectedIndex = idx;
                [...tabsEl.children].forEach(b => b.style.background = "#ddd");
                btn.style.background = "#ffd800";
            };

            tabsEl.appendChild(btn);
            overlay.style.display = "flex";
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const buttons = tabsEl.querySelectorAll("button");

                    buttons.forEach(btn => {
                        let size = 22;
                        btn.style.fontSize = size + "px";

                        while (btn.scrollWidth > btn.clientWidth && size > 8) {
                            size -= 1;
                            btn.style.fontSize = size + "px";
                        }
                    });
                });
            });
        });

        overlay.style.display = "flex";

        confirmBtn.onclick = () => {
            overlay.style.display = "none";
            confirmBtn.onclick = null;
            resolve(selectedIndex);
        };
    });
};

function collectUponDefeatEffects(cardData) {
  const out = [];

  const list = Array.isArray(cardData?.abilitiesEffects)
    ? cardData.abilitiesEffects
    : [];

  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    const cond = String(entry?.condition || "").trim().toLowerCase();
    if (cond !== "upondefeat") continue;

    const eff = entry?.effect;

    // OPTIONAL
    if (entry.type === "optional") {
      out.push({
        type: "optional",
        effect: eff,
        abilityIndex: i
      });
      continue;
    }

    // CHOOSE
    if (entry.type === "chooseOption") {
      out.push({
        kind: "choose",
        abilityIndex: i
      });
      continue;
    }

    // NON-OPTIONAL
    if (Array.isArray(eff)) {
      for (const e of eff) {
        if (typeof e === "string" && e.trim()) out.push(e.trim());
      }
    } else if (typeof eff === "string" && eff.trim()) {
      out.push(eff.trim());
    }
  }

  return out;
}

function runUponDefeatEffects(cardData, heroId, state, extraSelectedData = {}) {
  if (!cardData) return;
  if (heroId == null) return;

  const heroState = state?.heroData?.[heroId];
  if (!heroState) return;

  const effects = collectUponDefeatEffects(cardData);
  if (!effects.length) return;

  console.log(
    `[uponDefeat] Running ${effects.length} reward effect(s) for ${cardData.name}.`,
    effects
  );

  for (const eff of effects) {
    try {

      // OPTIONAL uponDefeat effect
      if (typeof eff === "object" && eff.type === "optional") {

            const label =
            cardData.abilitiesNamePrint?.[eff.abilityIndex]?.text
                ? `${cardData.abilitiesNamePrint[eff.abilityIndex].text}?`
                : "Use optional ability?";

            window.showOptionalAbilityPrompt(label).then(allow => {
                if (!allow) return;

                executeEffectSafely(eff.effect, cardData, {
                    ...extraSelectedData,
                    currentHeroId: heroId,
                    state
                });
            });

            continue; // 🔴 REQUIRED
        }

    if (eff?.kind === "choose") {

        const header =
            cardData.abilitiesNamePrint?.[eff.abilityIndex]?.text || "Choose";

        const options = [];
        const optionEffects = [];

        let j = eff.abilityIndex + 1;

        while (
            j < cardData.abilitiesEffects.length &&
            /^chooseOption\(\d+\)$/.test(cardData.abilitiesEffects[j].type)
        ) {
            const label =
            cardData.abilitiesNamePrint?.[j]?.text ||
            `Option ${options.length + 1}`;

            options.push({ label });
            optionEffects.push(cardData.abilitiesEffects[j]);
            j++;
        }

        window.showChooseAbilityPrompt({
            header,
            options
        }).then(chosenIndex => {

            const chosen = optionEffects[chosenIndex];
            if (!chosen) return;

            const effectsArray = Array.isArray(chosen.effect)
            ? chosen.effect
            : [chosen.effect];

            for (const effectString of effectsArray) {
            executeEffectSafely(effectString, cardData, {
                ...extraSelectedData,
                currentHeroId: heroId,
                state
            });
            }
        });

        continue;
        }

      // NON-OPTIONAL uponDefeat effect
      else {
        executeEffectSafely(eff, cardData, {
          ...extraSelectedData,
          currentHeroId: heroId,
          state
        });
      }

    } catch (err) {
      console.warn(
        `[uponDefeat] Effect failed on ${cardData.name}:`,
        err
      );
    }
  }
}

function isCityOccupied(state, idx) {
  const e = Array.isArray(state.cities) ? state.cities[idx] : null;
  return !!(e && e.id != null);
}

function maybeSendHeroHomeAfterLaneClears(heroId, defeatedSlotIndex, state = gameState) {
  const heroState = state.heroData?.[heroId];
  if (!heroState) return;

  // If facing the Overlord, do not apply “city lane clears → go home” logic
  if (heroState.isFacingOverlord) return;

  const heroLower = heroState.cityIndex;
  if (typeof heroLower !== "number") return;

  // Heroes stand in LOWER slots; their lane’s UPPER slot is directly above
  const heroUpper = heroLower - 1;

  // Map that upper slot to the corresponding glide slot via your existing order arrays
  const pos = UPPER_ORDER.indexOf(heroUpper);
  const heroGlide = (pos >= 0) ? GLIDE_ORDER[pos] : null;

  // Only send this hero home if the KO happened in THEIR lane (upper or glide)
  const koInMyLane =
    defeatedSlotIndex === heroUpper ||
    (heroGlide != null && defeatedSlotIndex === heroGlide);

  if (!koInMyLane) return;

  // Lane is “clear” only when BOTH upper and glide are empty
  const upperEmpty = !isCityOccupied(state, heroUpper);
  const glideEmpty = (heroGlide == null) ? true : !isCityOccupied(state, heroGlide);

  if (upperEmpty && glideEmpty) {
    sendHeroHomeFromBoard(heroId, state);
  }
}
