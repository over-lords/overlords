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

import { setCurrentOverlord, buildOverlordPanel, showMightBanner, renderHeroHandBar, placeCardIntoCitySlot, buildVillainPanel, buildMainCardPanel, appendGameLogEntry, removeGameLogEntryById } from "./pageSetup.js";

import { getCurrentOverlordInfo, takeNextHenchVillainsFromDeck, showRetreatButtonForCurrentHero,
         enterVillainFromEffect, checkGameEndConditions, villainDraw, updateHeroHPDisplays, updateBoardHeroHP, checkCoastalCities, getCityNameFromIndex, flagPendingHeroDamage, tryBlockPendingHeroDamage, flashScreenRed, handleHeroKnockout, destroyCitiesByCount, restoreCitiesByCount } from "./turnOrder.js";

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

const HERO_TEAM_SET = (() => {
    const set = new Set();
    heroes.forEach(h => {
        getHeroTeamsForCard(h).forEach(t => set.add(t));
    });
    return set;
})();

const EFFECT_HANDLERS = {};

const CITY_NAME_BY_LOWER_INDEX = {
    [CITY_EXIT_UPPER + 1]: "Star",
    [CITY_5_UPPER + 1]: "Coast",
    [CITY_4_UPPER + 1]: "Keystone",
    [CITY_3_UPPER + 1]: "Central",
    [CITY_2_UPPER + 1]: "Metropolis",
    [CITY_ENTRY_UPPER + 1]: "Gotham"
};

// Helpers to highlight and clear special target outlines (used by damageFoe selection UIs)
function clearDamageFoeTargetHighlights() {
    try {
        const slots = document.querySelectorAll(".city-slot.bystander-target-highlight");
        slots.forEach(slot => {
            slot.classList.remove("bystander-target-highlight");
            slot.style.outline = "";
        });
    } catch (e) {
        // Ignore DOM errors (e.g., SSR/no window)
    }
}

function highlightBystanderTargetSlots(state = gameState) {
    clearDamageFoeTargetHighlights();

    if (typeof document === "undefined") return;

    const citySlots = document.querySelectorAll(".city-slot");
    if (!citySlots.length || !Array.isArray(state.cities)) return;

    state.cities.forEach((entry, idx) => {
        if (!entry) return;
        const hasBystanders =
            (Array.isArray(entry.capturedBystanders) && entry.capturedBystanders.length > 0) ||
            (Number(entry.capturedBystanders) > 0);

        if (!hasBystanders) return;

        const slot = citySlots[idx];
        if (!slot) return;
        slot.classList.add("bystander-target-highlight");
        slot.style.outline = "4px solid yellow";
    });
}

if (typeof window !== "undefined") {
    window.__clearDamageFoeHighlights = clearDamageFoeTargetHighlights;
}

function getHeroTeamsForCard(heroObj) {
    if (!heroObj) return [];
    const base = [
        heroObj.team,
        heroObj.heroTeam,
        heroObj.faction
    ].filter(Boolean).map(v => String(v).toLowerCase());
    const list = Array.isArray(heroObj.teams) ? heroObj.teams.map(t => String(t).toLowerCase()) : [];
    return Array.from(new Set([...base, ...list]));
}

function getActiveTeammates(heroId, state = gameState, opts = {}) {
    const { includeId = false } = opts;
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    if (heroId == null || !heroIds.length) return [];

    const me = heroes.find(h => String(h.id) === String(heroId));
    if (!me) return [];
    const myTeams = getHeroTeamsForCard(me);
    if (!myTeams.length) return [];

    return heroIds.reduce((acc, otherId) => {
        if (String(otherId) === String(heroId)) return acc;
        const otherState = s.heroData?.[otherId];
        const otherHp = typeof otherState?.hp === "number" ? otherState.hp : 1;
        if (otherHp <= 0) return acc;
        const otherCard = heroes.find(h => String(h.id) === String(otherId));
        if (!otherCard) return acc;
        const otherTeams = getHeroTeamsForCard(otherCard);
        const sharesTeam = otherTeams.some(t => myTeams.includes(t));
        if (sharesTeam) {
            const otherName = otherCard.name || `Hero ${otherId}`;
            acc.push(includeId ? { id: otherId, name: otherName } : otherName);
        }
        return acc;
    }, []);
}

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
    const teamName = String(teamNameRaw).toLowerCase().trim();
    const props = [
        heroObj.team,
        heroObj.heroTeam,
        heroObj.faction
    ].filter(Boolean).map(v => String(v).toLowerCase());
    const list = Array.isArray(heroObj.teams) ? heroObj.teams.map(t => String(t).toLowerCase()) : [];
    const all = props.concat(list);
    return all.some(t => t === teamName);
}

function applyHalfDamageModifier(amount, heroId, state = gameState) {
    if (!amount || amount <= 0) return amount;
    if (!heroId) return amount;
    const s = state || gameState;
    const mods = Array.isArray(s.halfDamageModifiers) ? s.halfDamageModifiers : [];
    if (!mods.length) return amount;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return amount;

    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    let dmg = amount;

    mods.forEach(mod => {
        if (!mod) return;
        if (typeof mod.expiresAtTurnCounter === "number" && turn >= mod.expiresAtTurnCounter) return;
        const teamKey = String(mod.team || "").toLowerCase().trim();
        const applies =
            teamKey === "current"
                ? heroId != null
                : heroMatchesTeam(heroObj, teamKey);
        if (!applies) return;
        // Round up to keep at least half, minimum 1
        dmg = Math.max(1, Math.ceil(dmg / 2));
    });

    return dmg;
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

function getTotalRescuedBystanders(state = gameState) {
    const rescues = state?.heroBystandersRescued;
    if (!rescues || typeof rescues !== "object") return 0;
    return Object.values(rescues).reduce((acc, entry) => {
        const n = typeof entry?.count === "number" ? entry.count : 0;
        return acc + n;
    }, 0);
}

function incrementRescuedBystanders(heroId, count, state = gameState) {
    if (!heroId || !Number.isFinite(count) || count <= 0) return;
    const s = state || gameState;
    if (!s.heroBystandersRescued) s.heroBystandersRescued = {};
    const key = String(heroId);
    const current = s.heroBystandersRescued[key] || { count: 0, slotIndex: null };
    s.heroBystandersRescued[key] = {
        count: (current.count || 0) + count,
        slotIndex: current.slotIndex
    };
}

function resolveNumericValue(raw, heroId = null, state = gameState) {
    if (typeof raw === "number") return raw;
    if (typeof raw !== "string") return 0;

    const val = raw.trim();
    const lower = val.toLowerCase();

    // Simple multiplier support, e.g., "3*findKOdHeroes"
    const multMatch = val.match(/^(\d+)\s*\*\s*([A-Za-z0-9_()]+)$/);
    if (multMatch) {
        const factor = Number(multMatch[1]) || 0;
        const rhsRaw = multMatch[2];
        const rhsVal = resolveNumericValue(rhsRaw, heroId, state);
        return factor * rhsVal;
    }

    if (lower === "getcardsdiscarded") {
        return getCardsDiscarded(heroId, state);
    }
    if (lower === "gettravelused") {
        return getTravelUsed(heroId, state);
    }
    if (lower === "getlastdamageamount") {
        return getLastDamageAmount(heroId, state);
    }
    if (lower === "getherodamage") {
        return getHeroDamage(heroId, state);
    }
    if (lower === "rescuedbystanderscount") {
        return getTotalRescuedBystanders(state);
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
    const getActiveTeammatesForCond = (hid) => getActiveTeammates(hid, s);

    // atXorLessHP(n) / atXorGreaterHP(n) - apply to current hero
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

    const lowerCond = condStr.toLowerCase();

    if (lowerCond === "confirmactiveteammates") {
        const teammates = getActiveTeammatesForCond(heroId);
        const hasTeammates = teammates.length > 0;
        console.log(`[confirmActiveTeammates] ${hasTeammates ? `true, heroes found: ${teammates.join(", ")}` : "false, no active teammates found."}`);
        return hasTeammates;
    }

    if (lowerCond === "confirmnoactiveteammates") {
        const teammates = getActiveTeammatesForCond(heroId);
        const none = teammates.length === 0;
        console.log(`[confirmNoActiveTeammates] ${none ? "true, no active teammates found." : `false, heroes found: ${teammates.join(", ")}`}`);
        return none;
    }

    if (lowerCond === "facingoverlord") {
        if (heroId == null) return false;
        const hState = s.heroData?.[heroId];
        return !!hState?.isFacingOverlord;
    }

    if (lowerCond === "damagedatturnend") {
        // Always allow registration; actual firing happens when end-of-turn damage occurs
        return true;
    }

    if (lowerCond === "onlyonshove") {
        return !!state?.lastShovedVillainDestination;
    }

    if (lowerCond === "damagehero") {
        const pending = s.pendingDamageHero;
        const matchesHero = heroId == null || (pending && String(pending.heroId) === String(heroId));
        const result = !!pending && matchesHero;
        console.log(`[damageHero condition] ${result ? "true" : "false"}${pending ? ` (hero=${pending.heroId}, amount=${pending.amount}, source=${pending.sourceName || "unknown"})` : ""}`);
        return result;
    }

    if (lowerCond === "beforedraw") {
        const pendingHero = s._pendingBeforeDrawHero;
        const matchesHero = heroId == null || (pendingHero != null && String(pendingHero) === String(heroId));
        const result = pendingHero != null && matchesHero;
        console.log(`[beforeDraw] ${result ? "true" : "false"} — pendingHero=${pendingHero ?? "none"}`);
        return result;
    }

    const targetCityMatch = condStr.match(/^checkDamageTargetCity\((\d+)\)$/i);
    if (targetCityMatch) {
        const targetIdx = Number(targetCityMatch[1]);
        const pending = s._pendingDamageTarget;
        let pass = false;
        let details = "";

        if (!pending || typeof pending.slotIndex !== "number") {
            details = "no pending damage target";
        } else if (pending.source !== "city-foe") {
            details = `pending target type ${pending.source || "unknown"} not city foe`;
        } else {
            pass = (pending.slotIndex === targetIdx);
            details = `pending slot=${pending.slotIndex}, targetIdx=${targetIdx}`;
        }

        console.log(`[checkDamageTargetCity(${targetIdx})] ${pass ? "true" : "false"} — ${details}`);
        return pass;
    }

    if (lowerCond === "wouldusedamagecard") {
        const base = Number(s._pendingCardBaseDamage || 0);
        const result = base >= 1;
        console.log(`[wouldUseDamageCard] ${result ? "true" : "false"} — baseDamage=${base}`);
        return result;
    }

    // Fallback: unknown condition -> false
    return false;
}

function normalizeConditionString(cond) {
    if (!cond) return "";
    let s = String(cond).trim().toLowerCase();
    if (s.endsWith("()")) {
        s = s.slice(0, -2).trim();
    }
    return s;
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

    // Log the freeze event
    try {
        const heroName = heroId != null
            ? (heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`)
            : "A hero";
        const foeName = foeCard?.name || `Enemy ${entry.id ?? ""}`.trim();
        const lowerIdx = Number.isInteger(slotIndex) ? slotIndex + 1 : null;
        const cityName = getCityNameFromIndex(lowerIdx ?? slotIndex);
        const durationText = (howLong === "next")
            ? "until the end of their next turn"
            : "permanently";
        appendGameLogEntry(`${heroName} froze ${foeName} in ${cityName} ${durationText}.`, s);
    } catch (err) {
        console.warn("[applyFreezeToEntry] Failed to append freeze log", err);
    }
}

function unfreezeByKey(key, state = gameState) {
    if (!key) return;
    const s = state || gameState;
    if (!Array.isArray(s.cities)) return;

    let logged = false;
    let foeIdForBase = null;

    for (let i = 0; i < s.cities.length; i++) {
        const e = s.cities[i];
        if (!e) continue;
        const ek = getEntryKey(e);
        if (ek && ek === key) {
            if (!logged) {
                try {
                    const foeName =
                        henchmen.find(h => String(h.id) === String(e.id))?.name ||
                        villains.find(v => String(v.id) === String(e.id))?.name ||
                        `Enemy ${e.id ?? ""}`.trim();
                    appendGameLogEntry(`${foeName} has been unfrozen.`, s);
                } catch (err) {
                    console.warn("[unfreezeByKey] Failed to append unfreeze log", err);
                }
                logged = true;
                foeIdForBase = e.id ?? e.baseId ?? e.foeId ?? null;
            }
            e.isFrozen = false;
            if (typeof s.tempFrozen === "object") {
                delete s.tempFrozen[ek];
            }
            removeFrozenOverlay(i);
        }
    }
    delete s.tempFrozen?.[key];

    if (foeIdForBase != null) {
        const baseCard =
            henchmen.find(h => String(h.id) === String(foeIdForBase)) ||
            villains.find(v => String(v.id) === String(foeIdForBase));
        if (baseCard && baseCard.isFrozen) {
            baseCard.isFrozen = false;
        }
    }
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

// =========================================================
// PASSIVE HELPERS (e.g., Curse)
// =========================================================
function getFoeCardFromEntry(entry) {
    const cardId = entry?.baseId ?? entry?.id ?? entry?.foeId;
    if (cardId == null) return null;
    const idStr = String(cardId);
    return henchmen.find(h => String(h.id) === idStr) || villains.find(v => String(v.id) === idStr) || null;
}

function getBaseFoeDamage(entry) {
    const card = getFoeCardFromEntry(entry);
    return Number(card?.damage ?? card?.dmg ?? 0) || 0;
}

export function getEffectiveFoeDamage(entry) {
    if (!entry) return 0;
    const card = getFoeCardFromEntry(entry);
    const base = getBaseFoeDamage(entry);
    const penalty = Number(entry.damagePenalty || 0);
    const current = Math.max(0, base - penalty);
    entry.currentDamage = current;
    if (card) card.currentDamage = current;
    console.log("[getEffectiveFoeDamage]", { base, penalty, current, entryKey: getEntryKey(entry), slotIndex: entry.slotIndex });
    return current;
}

function refreshFoeCardUI(slotIndex, entry) {
    if (typeof document === "undefined") return;
    try {
        const citySlots = document.querySelectorAll(".city-slot");
        const slot = citySlots?.[slotIndex];
        const area = slot?.querySelector(".city-card-area");
        if (!area) return;
        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";
        const cardId = entry.baseId ?? entry.id;
        const cardData = findCardInAllSources(cardId);
        const prevDamage = cardData?.damage;
        const prevCurrent = cardData?.currentDamage;
        const effDmg = getEffectiveFoeDamage(entry);
        if (cardData) {
            cardData.damage = effDmg;
            cardData.currentDamage = effDmg;
        }
        const rendered = renderCard(cardId, wrapper);
        wrapper.appendChild(rendered);
        if (cardData) {
            cardData.damage = prevDamage;
            cardData.currentDamage = prevCurrent;
        }
        wrapper.style.cursor = "pointer";
        wrapper.setAttribute("data-card-id", String(cardId));
        wrapper.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = findCardInAllSources(cardId);
            if (card) buildVillainPanel(card, { instanceId: getEntryKey(entry), slotIndex: entry.slotIndex });
        }, true);
        area.innerHTML = "";
        area.appendChild(wrapper);
    } catch (err) {
        console.warn("[refreshFoeCardUI] Failed to refresh foe card UI.", err);
    }
}

function applyCurseToEntry(entry, amount, howLong, state = gameState, heroId = null) {
    if (!entry) return;
    const s = state || gameState;
    console.log("[applyCurseToEntry] Applying Curse", { amount, howLong, entryKey: getEntryKey(entry), slotIndex: entry.slotIndex, id: entry.id });
    entry.damagePenalty = (Number(entry.damagePenalty) || 0) + Math.max(0, Number(amount) || 0);
    getEffectiveFoeDamage(entry);

    const slotIdx = typeof entry.slotIndex === "number" ? entry.slotIndex : null;
    if (slotIdx != null) refreshFoeCardUI(slotIdx, entry);

    if (String(howLong || "forever").toLowerCase() === "next") {
        if (!s.tempPassives) s.tempPassives = {};
        const key = getEntryKey(entry) || String(entry.id || slotIdx);
        s.tempPassives[key] = {
            heroId,
            kind: "curse",
            amount: Number(amount) || 0,
            armed: false
        };
        console.log("[applyCurseToEntry] Temp passive stored for next turn", { key, meta: s.tempPassives[key] });
    }
}

export function processTempPassivesForHero(heroId, state = gameState) {
    const s = state || gameState;
    if (!s.tempPassives) return;

    Object.entries({ ...s.tempPassives }).forEach(([key, meta]) => {
        if (!meta || meta.heroId == null) return;
        if (String(meta.heroId) !== String(heroId)) return;

        if (meta.armed) {
            if (Array.isArray(s.cities)) {
                const entry = s.cities.find(e => e && (getEntryKey(e) === key || String(e.id) === key));
                if (entry) {
                    if (meta.kind === "curse") {
                        entry.damagePenalty = Math.max(0, Number(entry.damagePenalty || 0) - Number(meta.amount || 0));
                        getEffectiveFoeDamage(entry);
                        if (typeof entry.slotIndex === "number") refreshFoeCardUI(entry.slotIndex, entry);
                    }
                }
            }
            delete s.tempPassives[key];
        } else {
            s.tempPassives[key] = { ...meta, armed: true };
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
    const flag = (args?.[1] ?? '').toString().toLowerCase();

    const clampDrawForHero = (hid, desired) => {
        const damp = gameState.extraDrawDampener;
        if (damp?.active) {
            const target = String(damp.target || "").toLowerCase();
            const hState = gameState.heroData?.[hid];
            const already = typeof hState?.drawnThisTurn === "number" ? hState.drawnThisTurn : 0;
            if (target === "all") {
                const remaining = Math.max(0, 1 - already);
                return Math.min(desired, remaining);
            }
        }
        return desired;
    };

    const logDraw = (hid, drew) => {
        if (!hid || drew <= 0) return;
        const heroName = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;
        const noun = drew === 1 ? 'a card' : `${drew} cards`;
        appendGameLogEntry(`${heroName} drew ${noun}.`, gameState);
    };

    if (!heroId) {
        console.warn('[draw] No currentHeroId available.');
        return;
    }

    const heroState = gameState.heroData?.[heroId];
    if (!heroState) {
        console.warn('[draw] No heroState for heroId:', heroId);
        return;
    }

    if (count <= 0) {
        console.log('[draw] Count resolved to 0; no cards drawn.');
        return;
    }

    // Special flag: all -> every active hero (including current) draws `count`
    if (flag === 'all') {
        const heroIds = gameState.heroes || [];
        heroIds.forEach(hid => {
            const hState = gameState.heroData?.[hid];
            if (!hState) return;
            const hp = typeof hState.hp === 'number' ? hState.hp : 1;
            if (hp <= 0) return; // only active (non-KO) heroes

            if (!Array.isArray(hState.deck)) hState.deck = [];
            if (!Array.isArray(hState.hand)) hState.hand = [];

            const allowed = clampDrawForHero(hid, count);
            if (allowed <= 0) return;

            console.log(`[draw] ${allowed} card(s) for hero ${hid} (all flag).`);

            let drew = 0;
            for (let i = 0; i < allowed; i++) {
                if (hState.deck.length === 0) {
                    console.log('[draw] Deck empty - cannot draw further.', { heroId: hid });
                    break;
                }

                const cardId = hState.deck.shift();
                hState.hand.push(cardId);
                console.log(`[draw] Drawn card ID ${cardId} for hero ${hid}`);
                drew++;
            }
            logDraw(hid, drew);
        });

        saveGameState(gameState);
        renderHeroHandBar(gameState);
        return;
    }

    // Special flag: allOtherHeroes -> every other active hero draws `count`
    if (flag === 'allotherheroes') {
        const heroIds = gameState.heroes || [];
        heroIds.forEach(hid => {
            if (String(hid) === String(heroId)) return;

            const hState = gameState.heroData?.[hid];
            if (!hState) return;
            const hp = typeof hState.hp === 'number' ? hState.hp : 1;
            if (hp <= 0) return; // only active (non-KO) heroes

            if (!Array.isArray(hState.deck)) hState.deck = [];
            if (!Array.isArray(hState.hand)) hState.hand = [];

            const allowed = clampDrawForHero(hid, count);
            if (allowed <= 0) return;

            console.log(`[draw] ${allowed} card(s) for hero ${hid} (allOtherHeroes flag).`);

            let drew = 0;
            for (let i = 0; i < allowed; i++) {
                if (hState.deck.length === 0) {
                    console.log('[draw] Deck empty - cannot draw further.', { heroId: hid });
                    break;
                }

                const cardId = hState.deck.shift();
                hState.hand.push(cardId);
                console.log(`[draw] Drawn card ID ${cardId} for hero ${hid}`);
                drew++;
            }
            logDraw(hid, drew);
        });

        saveGameState(gameState);
        renderHeroHandBar(gameState);
        return;
    }

    if (!Array.isArray(heroState.deck))   heroState.deck = [];
    if (!Array.isArray(heroState.hand))   heroState.hand = [];
    if (!Array.isArray(heroState.discard)) heroState.discard = [];
    if (typeof heroState.drawnThisTurn !== 'number') heroState.drawnThisTurn = 0;

    const allowedCount = clampDrawForHero(heroId, count);
    if (allowedCount <= 0) {
        console.log('[draw] Draw dampener: no draws allowed for this hero right now.');
        return;
    }

    console.log(`[draw] ${allowedCount} card(s) for hero ${heroId}.`);

    let drew = 0;
    for (let i = 0; i < allowedCount; i++) {
        if (heroState.deck.length === 0) {
            if (heroState.drawnThisTurn >= 5) {
                console.log('[draw] Deck empty and 5+ cards already drawn this turn; no reshuffle.');
                break;
            }

            if (heroState.discard.length > 0) {
                console.log('[draw] Deck empty, shuffling discard under deck.');
                const shuffled = [...heroState.discard];
                for (let j = shuffled.length - 1; j > 0; j--) {
                    const k = Math.floor(Math.random() * (j + 1));
                    [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
                }
                heroState.deck.push(...shuffled);
                heroState.discard = [];
            } else {
                console.log('[draw] Deck empty - cannot draw further (no discard).');
                break;
            }
        }

        const cardId = heroState.deck.shift();
        heroState.hand.push(cardId);
        heroState.drawnThisTurn = (heroState.drawnThisTurn || 0) + 1;
        console.log(`[draw] Drawn card ID ${cardId}`);
        drew++;
    }

    logDraw(heroId, drew);
    saveGameState(gameState);
    renderHeroHandBar(gameState);
};

EFFECT_HANDLERS.enemyDraw = function(args, card, selectedData) {
    const count = Number(args?.[0]) || 1;
    const limit = args?.[1] ?? null;
    return enemyDraw(count, limit, selectedData);
};

EFFECT_HANDLERS.travelTo = function(args, card, selectedData) {
    const dest = args?.[0] ?? null;
    const heroId = selectedData?.currentHeroId ?? null;
    travelHeroToDestination(dest, heroId, gameState);
};

EFFECT_HANDLERS.shoveVillain = function(args = [], card, selectedData = {}) {
    const target = args?.[0] ?? "any";
    const count = Number(args?.[1]) || 0;
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    if (count === 0) {
        console.warn("[shoveVillain] Count is 0; nothing to do.");
        return;
    }

    shoveVillain(target, count, state, heroId);
};

EFFECT_HANDLERS.retreatHeroToHQ = function(args = [], card, selectedData = {}) {
    const heroId = selectedData?.currentHeroId ?? null;
    retreatHeroToHQSafe(heroId, gameState);
};

EFFECT_HANDLERS.damageFoe = function (args, card, selectedData) {
    const heroId =
        selectedData?.currentHeroId
        ?? gameState.heroes?.[gameState.heroTurnIndex ?? 0]
        ?? null;
    let amount = Number(args?.[0]) || 0;
    if (amount <= 0) {
        console.warn("[damageFoe] Invalid damage amount:", args);
        return;
    }
    amount = applyHalfDamageModifier(amount, heroId, gameState);

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
        } else if (typeof raw === "string" && raw.toLowerCase() === "adjacentfoes") {
            flag = "adjacentFoes";
        } else if (typeof raw === "string" && raw.toLowerCase() === "lastdamagecauser") {
            flag = "lastDamageCauser";
        } else if (!Number.isNaN(Number(raw))) {
            flag = Number(raw);
        }
    }

    // Selected foe (only required for true single-target damage)
    let foeSummary = selectedData?.selectedFoeSummary ?? null;

    // If no foe was captured (or it is stale), derive the current foe at call time.
    if (!foeSummary && flag === "single") {
        const hState = gameState.heroData?.[heroId];
        if (hState) {
            if (hState.isFacingOverlord) {
                const ovInfo = getCurrentOverlordInfo(gameState);
                if (ovInfo?.card) {
                    const ovHP =
                        typeof ovInfo.currentHP === "number"
                            ? ovInfo.currentHP
                            : (typeof gameState.currentOverlordHP === "number"
                                ? gameState.currentOverlordHP
                                : ovInfo.card.hp);

                    foeSummary = {
                        foeType: ovInfo.card.type || "Overlord",
                        foeId: ovInfo.id,
                        foeName: ovInfo.card.name || `Overlord ${ovInfo.id}`,
                        currentHP: ovHP,
                        source: "overlord"
                    };
                }
            } else if (typeof hState.cityIndex === "number") {
                const upperIdx = hState.cityIndex - 1;
                const entry = Array.isArray(gameState.cities) ? gameState.cities[upperIdx] : null;
                if (entry && entry.id != null) {
                    const foeIdStr = String(entry.id);
                    const foeCard =
                        henchmen.find(h => String(h.id) === foeIdStr) ||
                        villains.find(v => String(v.id) === foeIdStr);

                    if (foeCard) {
                        const hp = (typeof entry.currentHP === "number") ? entry.currentHP : foeCard.hp;
                        foeSummary = {
                            foeType: foeCard.type || "Enemy",
                            foeId: foeIdStr,
                            instanceId: entry.instanceId,
                            foeName: foeCard.name || `Enemy ${foeIdStr}`,
                            currentHP: hp,
                            slotIndex: upperIdx,
                            source: "city-upper"
                        };
                    }
                }
            }
        }
    }

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
  const flagRaw = args?.[1] ?? "";
  const flag = typeof flagRaw === "string" ? flagRaw.toLowerCase() : "";

  const heroId = selectedData?.currentHeroId ?? null;
  if (!heroId) {
    console.warn("[regainLife] No currentHeroId available.");
    return;
  }

  // Helper to heal a specific hero id
  const healHero = (hid) => {
    const hState = gameState.heroData?.[hid];
    if (!hState) return;
    const hCard = heroes.find(h => String(h.id) === String(hid));
    if (!hCard) return;

    const baseHP = Number(hCard.hp || hCard.baseHP || 0);
    if (hState.hp == null) hState.hp = baseHP;

    const before = hState.hp;
    hState.hp = Math.min(baseHP, hState.hp + amount);
    hCard.currentHP = hState.hp;

    console.log(`[regainLife] ${hCard.name} regains ${amount} HP (${before} → ${hState.hp}).`);
    appendGameLogEntry(`${hCard.name} gained ${hState.hp - before} HP.`, gameState);

    try { updateHeroHPDisplays(hid); } catch (e) { console.warn("[regainLife] updateHeroHPDisplays failed", e); }
    try { updateBoardHeroHP(hid); } catch (e) { console.warn("[regainLife] updateBoardHeroHP failed", e); }
  };

  if (flag === "all") {
    const heroIds = gameState.heroes || [];
    heroIds.forEach(healHero);
  } else {
    healHero(heroId);
  }

  saveGameState(gameState);
};

EFFECT_HANDLERS.damageOverlord = function (args, card, selectedData) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;
    let amount = Number(args?.[0]) || 1;
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

EFFECT_HANDLERS.travelPlus = function(args = [], card, selectedData = {}) {
    const delta = Number(args?.[0]) || 0;
    const flag = args?.[1] ?? "";

    const heroId = selectedData?.currentHeroId ?? null;
    adjustHeroTravelDelta(delta, { flag }, heroId, gameState);
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

    const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
    console.log(`[rescueBystander] Rescuing ${count} bystander(s) for hero ${heroId}.`);

    const rescuedNames = [];
    for (let i = 0; i < count; i++) {
        const picked = bystanders[Math.floor(Math.random() * bystanders.length)];

        if (!picked?.id) {
            console.warn("[rescueBystander] Picked invalid bystander:", picked);
            continue;
        }

        heroState.hand.push(String(picked.id));
        rescuedNames.push(picked.name ?? picked.id);

        console.log(
            `[rescueBystander] → Rescued bystander '${picked.name ?? picked.id}'.`
        );
    }

    if (rescuedNames.length) {
        const nameList = rescuedNames.join(", ");
        const msg = rescuedNames.length === 1
            ? `${nameList} was rescued by ${heroName}.`
            : `Bystanders: ${nameList} were rescued by ${heroName}.`;
        appendGameLogEntry(msg, gameState);
    }

    saveGameState(gameState);
    renderHeroHandBar(gameState);
};

EFFECT_HANDLERS.koBystander = function(args = [], cardData, selectedData = {}) {
    const count = Math.max(1, Number(args?.[0]) || 1);
    const state = selectedData?.state || gameState;

    if (!Array.isArray(bystanders) || bystanders.length === 0) {
        console.warn("[koBystander] No bystanders available to KO.");
        return;
    }

    if (!Array.isArray(state.koCards)) state.koCards = [];

    const names = [];
    for (let i = 0; i < count; i++) {
        const picked = bystanders[Math.floor(Math.random() * bystanders.length)];
        if (!picked?.id) {
            console.warn("[koBystander] Picked invalid bystander:", picked);
            continue;
        }
        state.koCards.push({
            id: picked.id,
            name: picked.name,
            type: "Bystander",
            source: "koBystander"
        });
        names.push(picked.name || `Bystander ${picked.id}`);
    }

    if (names.length) {
        const msg = names.length === 1
            ? `${names[0]} was KO'd.`
            : `Bystanders KO'd: ${names.join(", ")}`;
        appendGameLogEntry(msg, state);
    }

    try {
        if (typeof window !== "undefined" && typeof window.renderKOBar === "function") {
            window.renderKOBar(state);
        }
    } catch (e) {
        console.warn("[koBystander] Failed to render KO bar", e);
    }

    saveGameState(state);
};

function rescueCapturedBystander(flag = "all", heroId = null, state = gameState) {
    const s = state || gameState;
    const hid = heroId ?? s.heroes?.[s.heroTurnIndex ?? 0];
    if (!hid) {
        console.warn("[rescueCapturedBystander] No heroId available.");
        return;
    }

    const normFlag = String(flag || "").toLowerCase();
    if (normFlag !== "all") {
        console.warn("[rescueCapturedBystander] Unknown flag; only 'all' is supported. Received:", flag);
        return;
    }

    const heroState = s.heroData?.[hid];
    if (!heroState) {
        console.warn("[rescueCapturedBystander] No heroState for heroId:", hid);
        return;
    }
    if (!Array.isArray(heroState.hand)) heroState.hand = [];

    if (!Array.isArray(s.cities)) {
        console.warn("[rescueCapturedBystander] No cities array.");
        return;
    }

    let rescuedCount = 0;
    const rescuedNames = [];

    s.cities.forEach((entry, idx) => {
        if (!entry) return;

        const captured = entry.capturedBystanders;

        if (Array.isArray(captured) && captured.length > 0) {
            captured.forEach(b => {
                const idStr = b?.id != null ? String(b.id) : null;
                if (idStr) {
                    heroState.hand.push(idStr);
                    rescuedCount += 1;
                    if (b?.name) rescuedNames.push(String(b.name));
                }
            });
            entry.capturedBystanders = [];
        } else if (Number(captured) > 0) {
            // If stored as a number with no detail, log and clear
            console.warn(`[rescueCapturedBystander] Captured bystanders stored as count (${captured}) in city ${idx}; clearing without card ids.`);
            entry.capturedBystanders = [];
        }
    });

    if (rescuedCount > 0) {
        const heroName = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;
        console.log(`[rescueCapturedBystander] Hero ${hid} rescued ${rescuedCount} captured bystander(s).`);
        const nameList = rescuedNames.length ? rescuedNames.join(", ") : `${rescuedCount} bystander(s)`;
        const msg = rescuedNames.length === 1
            ? `${nameList} was rescued by ${heroName}.`
            : `Bystanders: ${nameList} were rescued by ${heroName}.`;
        appendGameLogEntry(msg, s);
        incrementRescuedBystanders(hid, rescuedCount, s);
        saveGameState(s);
        renderHeroHandBar(s);
    } else {
        console.log("[rescueCapturedBystander] No captured bystanders found to rescue.");
    }
}

EFFECT_HANDLERS.rescueCapturedBystander = function(args = [], card, selectedData = {}) {
    const flag = args?.[0] ?? "all";
    const heroId = selectedData?.currentHeroId ?? null;
    rescueCapturedBystander(flag, heroId, gameState);
};

EFFECT_HANDLERS.disableExtraTravel = function(args = [], card, selectedData = {}) {
    // Signature: disableExtraTravel(all,next)
    const target = args?.[0] ?? "all";
    const duration = String(args?.[1] ?? "next").toLowerCase();
    const state = selectedData?.state || gameState;
    if (!state) return;

    const turns = duration === "next" ? 1 : 0;
    if (typeof state.turnCounter !== "number") state.turnCounter = 0;

    state.extraTravelDampener = {
        target: String(target || "all").toLowerCase(),
        expiresAtTurnCounter: state.turnCounter + turns,
        active: true
    };

    appendGameLogEntry(`Travel Dampened: All Heroes are limited to 1 Travel until after this Hero's next turn.`, state);
    saveGameState(state);
};

EFFECT_HANDLERS.disableExtraDraw = function(args = [], card, selectedData = {}) {
    // Signature: disableExtraDraw(all,next)
    const target = args?.[0] ?? "all";
    const duration = String(args?.[1] ?? "next").toLowerCase();
    const state = selectedData?.state || gameState;
    if (!state) return;

    const turns = duration === "next" ? 1 : 0;
    if (typeof state.turnCounter !== "number") state.turnCounter = 0;

    state.extraDrawDampener = {
        target: String(target || "all").toLowerCase(),
        expiresAtTurnCounter: state.turnCounter + turns,
        active: true
    };

    appendGameLogEntry(`Draws Dampened: All Heroes will only be able to draw 1 card until after this Hero's next turn.`, state);
    saveGameState(state);
};

EFFECT_HANDLERS.halfDamage = function(args = [], card, selectedData = {}) {
    const team = args?.[0];
    if (!team) return;

    const durationRaw = String(args?.[1] ?? "").toLowerCase();
    const state = selectedData?.state || gameState;
    if (!state) return;

    const turns = durationRaw === "next" ? 1 : 0;
    if (typeof state.turnCounter !== "number") state.turnCounter = 0;

    const sourceType = selectedData.source || (card?.type === "Scenario" ? "scenario" : "effect");
    const sourceId = selectedData.scenarioId || card?.id || null;
    const teamKey = String(team).toLowerCase().trim();

    // Remove prior entries from same source/team to avoid duplicates
    if (!Array.isArray(state.halfDamageModifiers)) state.halfDamageModifiers = [];
    state.halfDamageModifiers = state.halfDamageModifiers.filter(mod => {
        if (!mod) return false;
        const sameSource = (sourceId != null && String(mod.sourceId) === String(sourceId)) && mod.sourceType === sourceType;
        const sameTeam = String(mod.team || "").toLowerCase().trim() === teamKey;
        return !(sameSource && sameTeam);
    });

    state.halfDamageModifiers.push({
        team: teamKey,
        expiresAtTurnCounter: turns > 0 ? state.turnCounter + turns : null,
        sourceType,
        sourceId
    });

    saveGameState(state);
};

EFFECT_HANDLERS.destroyCity = function(args = [], card, selectedData = {}) {
    const heroId = selectedData?.currentHeroId ?? null;
    const state = selectedData?.state || gameState;
    const count = Math.max(1, resolveNumericValue(args?.[0] ?? 1, heroId, state));
    destroyCitiesByCount(count, state);
};

EFFECT_HANDLERS.restoreCity = function(args = [], card, selectedData = {}) {
    const heroId = selectedData?.currentHeroId ?? null;
    const state = selectedData?.state || gameState;
    const count = Math.max(1, resolveNumericValue(args?.[0] ?? 1, heroId, state));
    restoreCitiesByCount(count, state);
};

function giveTeammateExtraTurn(heroId = null, state = gameState) {
    const s = state || gameState;
    const hid = heroId ?? s.heroes?.[s.heroTurnIndex ?? 0];
    if (!hid) {
        console.warn("[giveTeammateExtraTurn] No heroId available.");
        return [];
    }

    const teammates = getActiveTeammates(hid, s, { includeId: true });
    console.log(`[giveTeammateExtraTurn] Active teammates for hero ${hid}: ${teammates.length ? teammates.map(t => t.name).join(", ") : "none"}.`);

    if (!teammates.length) return [];

    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    const sourceIdx = heroIds.findIndex(id => String(id) === String(hid));
    const fallbackIdx = Number.isInteger(s.heroTurnIndex) ? s.heroTurnIndex : 0;
    const resumeIndex = heroIds.length
        ? ((sourceIdx >= 0 ? sourceIdx : fallbackIdx) + 1) % heroIds.length
        : 0;

    const modalData = {
        header: "Choose a teammate to take an extra turn after yours.",
        options: teammates,
        selectedId: teammates[0]?.id ?? null,
        sourceHeroId: hid,
        resumeIndex
    };

    try {
        s.pendingExtraTurnModal = { ...modalData };
        saveGameState(s);
    } catch (err) {
        console.warn("[giveTeammateExtraTurn] Failed to persist modal state before showing.", err);
    }

    showTeammateExtraTurnModal(modalData).then(chosen => {
        if (!chosen) return;

        s.pendingExtraTurn = {
            sourceHeroId: hid,
            targetHeroId: chosen.id,
            resumeIndex,
            consumed: false
        };

        try { saveGameState(s); } catch (err) {
            console.warn("[giveTeammateExtraTurn] Failed to save state after queueing extra turn.", err);
        }

        console.log(`[giveTeammateExtraTurn] Pending extra turn queued for ${chosen.name || chosen.id}.`);
    }).catch(err => {
        console.warn("[giveTeammateExtraTurn] Failed to show teammate modal.", err);
    });

    return teammates.map(t => t.name || t.id);
}

EFFECT_HANDLERS.giveTeammateExtraTurn = function(args = [], card, selectedData = {}) {
    const heroId = selectedData?.currentHeroId ?? null;
    return giveTeammateExtraTurn(heroId, gameState);
};

function blockDamage(state = gameState) {
    const s = state || gameState;
    if (!s.pendingDamageHero) {
        console.log("[blockDamage] No pending damage to block.");
        return false;
    }
    const targetId = s.pendingDamageHero.heroId;
    const heroName = heroes.find(h => String(h.id) === String(targetId))?.name || `Hero ${targetId}`;
    console.log(`[blockDamage] Blocking all pending damage to ${heroName}.`, s.pendingDamageHero);
    s.pendingDamageHero = null;
    return true;
}

EFFECT_HANDLERS.blockDamage = function(args = [], card, selectedData = {}) {
    return blockDamage(gameState);
};

function isHeroSelectorValue(val) {
    if (val == null) return false;
    if (typeof val === "number" || /^\d+$/.test(String(val))) {
        return heroes.some(h => String(h.id) === String(val));
    }
    const lower = String(val).toLowerCase();
    if (["random", "all", "current", "coastal"].includes(lower)) return true;
    return HERO_TEAM_SET.has(lower);
}

function resolveHeroTargets(selectorRaw, state = gameState, defaultHeroId = null) {
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    const activeHeroes = heroIds.filter(hid => {
        const hp = s.heroData?.[hid]?.hp;
        return hp == null ? true : hp > 0;
    });

    const selector = selectorRaw == null ? "current" : selectorRaw;
    const lower = String(selector).toLowerCase();

    if (lower === "all") {
        return activeHeroes;
    }

    if (lower === "random") {
        if (!activeHeroes.length) return [];
        const picked = activeHeroes[Math.floor(Math.random() * activeHeroes.length)];
        return [picked];
    }

    if (lower === "current") {
        const idx = Number.isInteger(s.heroTurnIndex) ? s.heroTurnIndex : 0;
        const hid = heroIds[idx];
        if (hid == null) return [];
        const hp = s.heroData?.[hid]?.hp;
        return hp == null || hp > 0 ? [hid] : [];
    }

    if (lower === "coastal") {
        const { left, right } = checkCoastalCities(s);
        if (left == null && right == null) return [];
        return activeHeroes.filter(hid => {
            const hState = s.heroData?.[hid];
            if (!hState) return false;
            const cityIdx = hState.cityIndex;
            if (!Number.isInteger(cityIdx)) return false;
            return (left != null && cityIdx === left + 1) || (right != null && cityIdx === right + 1);
        });
    }

    if (lower === "leftmostengaged") {
        let bestId = null;
        let bestCity = null;

        activeHeroes.forEach(hid => {
            const hState = s.heroData?.[hid];
            if (!hState) return;
            if (hState.isFacingOverlord) return;
            if (!Number.isInteger(hState.cityIndex)) return;
            const cityIdx = Number(hState.cityIndex);
            if (bestCity == null || cityIdx < bestCity) {
                bestCity = cityIdx;
                bestId = hid;
            }
        });

        return bestId != null ? [bestId] : [];
    }

    // Target a specific hero id
    const matchId = heroIds.find(hid => String(hid) === String(selector));
    if (matchId != null) {
        const hp = s.heroData?.[matchId]?.hp;
        return hp == null || hp > 0 ? [matchId] : [];
    }

    // Team target
    const teamTargets = activeHeroes.filter(hid => {
        const heroObj = heroes.find(h => String(h.id) === String(hid));
        return heroMatchesTeam(heroObj, selector);
    });
    if (teamTargets.length) return teamTargets;

    // Fallback to default/current hero
    if (defaultHeroId != null) {
        const hp = s.heroData?.[defaultHeroId]?.hp;
        return hp == null || hp > 0 ? [defaultHeroId] : [];
    }

    return [];
}

function resolveDamageFromLastDamagedFoe(heroId, state = gameState) {
    const s = state || gameState;

    const ctx = s._lastDamageContext;
    if (ctx && (ctx.target === "overlord" || ctx.target === "none")) {
        return 0;
    }

    const info =
        s.heroData?.[heroId]?.lastDamagedFoe ||
        ((s.lastDamagedFoe && (s.lastDamagedFoe.heroId == null || String(s.lastDamagedFoe.heroId) === String(heroId)))
            ? s.lastDamagedFoe
            : null);

    if (!info) {
        const snap = s._lastHeroDamageSnapshot;
        if (snap && (snap.heroId == null || String(snap.heroId) === String(heroId))) {
            return Math.max(0, Number(snap.amount) || 0);
        }
        return 0;
    }

    if (typeof info.foeDamageSnapshot === "number") {
        return Math.max(0, Number(info.foeDamageSnapshot) || 0);
    }

    const fromInstance = Array.isArray(s.cities)
        ? s.cities.find(e => e && getEntryKey(e) === info.instanceId)
        : null;

    const entry =
        fromInstance ||
        (Number.isInteger(info.slotIndex) && Array.isArray(s.cities) ? s.cities[info.slotIndex] : null) ||
        (Array.isArray(s.cities) ? s.cities.find(e => e && String(e.id) === String(info.foeId)) : null);

    if (!entry) return 0;

    return getEffectiveFoeDamage(entry);
}

function resolveDamageHeroAmount(rawAmount, heroId, state = gameState) {
    if (typeof rawAmount === "string" && rawAmount.toLowerCase() === "lastdamagedfoe") {
        return resolveDamageFromLastDamagedFoe(heroId, state);
    }
    return resolveNumericValue(rawAmount ?? 0, heroId, state);
}

function normalizeDamageHeroOptions(rawOptions, card = null, selectedData = {}) {
    const opt = {};

    if (rawOptions && typeof rawOptions === "object" && !Array.isArray(rawOptions)) {
        Object.assign(opt, rawOptions);
    }

    const text = typeof rawOptions === "string" ? rawOptions.toLowerCase() : "";
    opt.ignoreDT = opt.ignoreDT || text.includes("ignoredt");
    opt.state = opt.state || selectedData.state || gameState;
    opt.currentHeroId = opt.currentHeroId ?? selectedData.currentHeroId ?? null;
    opt.sourceName = opt.sourceName || card?.name || "effect";
    opt.cardId = opt.cardId || card?.id || null;

    return opt;
}

function enqueueHeroDamage(targets, amountArg, opts = {}, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(targets) || !targets.length) return;

    // Strip circular references before queuing
    const cleanOpts = { ...opts };
    delete cleanOpts.state;
    delete cleanOpts.selectedData;

    if (!s._pendingHeroDamageQueue) s._pendingHeroDamageQueue = [];
    s._pendingHeroDamageQueue.push({
        targets: [...targets],
        amountArg,
        opts: cleanOpts
    });
    console.log("[damageHero] Queued hero damage until foe selection resolves.", { count: targets.length });
}

export async function processQueuedHeroDamage(state = gameState) {
    const s = state || gameState;
    const queue = Array.isArray(s._pendingHeroDamageQueue) ? s._pendingHeroDamageQueue.slice() : [];
    s._pendingHeroDamageQueue = [];
    for (const entry of queue) {
        const { targets, amountArg, opts } = entry || {};
        if (!Array.isArray(targets)) continue;
        for (const hid of targets) {
            let dmg;
            if (typeof amountArg === "string" && amountArg.toLowerCase() === "lastdamagedfoe") {
                const snap = s._lastHeroDamageSnapshot;
                const allowSnap = snap && (snap.heroId == null || String(snap.heroId) === String(hid));
                dmg = allowSnap ? Math.max(0, Number(snap.amount) || 0) : resolveDamageHeroAmount(amountArg, hid, s);
            } else {
                dmg = resolveDamageHeroAmount(amountArg, hid, s);
            }
            await applyDamageToHero(hid, dmg, opts);
        }
    }
}

async function applyDamageToHero(heroId, amount, options = {}) {
    const s = options.state || gameState;
    if (!s || heroId == null) return;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) {
        console.warn("[damageHero] Unknown hero id:", heroId);
        return;
    }

    if (!s.heroData) s.heroData = {};
    const heroState = s.heroData[heroId] || (s.heroData[heroId] = {});

    const baseHP = Number(heroObj.hp || heroObj.baseHP || 0);
    if (typeof heroState.hp !== "number") heroState.hp = baseHP;

    if (heroState.hp <= 0) {
        console.log(`[damageHero] ${heroObj.name} is already KO'd; skipping damage.`);
        return;
    }

    const amt = Math.max(0, Number(amount) || 0);
    const dt = Number(heroObj.damageThreshold || 0);

    if (!options.ignoreDT && amt < dt) {
        console.log(`[damageHero] ${heroObj.name} ignores ${amt} damage (DT=${dt}).`);
        return;
    }

    // Clear any stale causer metadata so KO effects don't attribute to the wrong foe
    s.lastDamageCauser = null;

    flagPendingHeroDamage(heroId, amt, options.sourceName || "effect", s);
    const blocked = await tryBlockPendingHeroDamage(s);
    const pending = s.pendingDamageHero;

    if (blocked || !pending) {
        s.pendingDamageHero = null;
        return;
    }

    const before = heroState.hp;
    heroState.hp = Math.max(0, before - amt);
    heroObj.currentHP = heroState.hp;
    heroState.lastDamageAmount = amt;

    if (typeof flashScreenRed === "function") {
        try { flashScreenRed(); } catch (e) { console.warn("[damageHero] flashScreenRed failed", e); }
    }

    appendGameLogEntry(`${heroObj.name} took ${amt} damage from ${options.sourceName || "effect"}.`, s);

    try { updateHeroHPDisplays(heroId); } catch (e) { console.warn("[damageHero] updateHeroHPDisplays failed", e); }
    try { updateBoardHeroHP(heroId); } catch (e) { console.warn("[damageHero] updateBoardHeroHP failed", e); }

    if (heroState.hp <= 0) {
        handleHeroKnockout(heroId, heroState, s, { source: "damageHero", sourceName: options.sourceName || "effect" });
    }

    s.pendingDamageHero = null;
    saveGameState(s);
}

export async function damageHero(count, whichHero = "current", options = {}) {
    const opts = normalizeDamageHeroOptions(options, options.card || null, options.selectedData || {});
    const state = opts.state || gameState;

    let amountArg = count;
    let targetArg = whichHero;

    // Support legacy ordering: damageHero(target, amount) only when the first arg is a non-numeric selector.
    if (typeof count === "string" && !/^\d+$/.test(count) && isHeroSelectorValue(count) && whichHero !== undefined) {
        targetArg = count;
        amountArg = whichHero;
    }

    const defaultHeroId = opts.currentHeroId ?? (Array.isArray(state.heroes) ? state.heroes[state.heroTurnIndex ?? 0] : null);
    const targets = resolveHeroTargets(targetArg, state, defaultHeroId);

    const selectionPending =
        (typeof window !== "undefined") &&
        window.__damageFoeSelectMode &&
        typeof window.__damageFoeSelectMode.amount === "number";

    if (
        selectionPending &&
        typeof amountArg === "string" &&
        amountArg.toLowerCase() === "lastdamagedfoe"
    ) {
        enqueueHeroDamage(targets, amountArg, opts, state);
        return;
    }

    if (!targets.length) {
        console.log("[damageHero] No valid hero targets found for selector:", targetArg);
        return;
    }

    for (const hid of targets) {
        const dmg = resolveDamageHeroAmount(amountArg, hid, state);
        await applyDamageToHero(hid, dmg, opts);
    }
}

EFFECT_HANDLERS.damageHero = function(args = [], card, selectedData = {}) {
    const [rawCount, rawTarget, rawOptions] = Array.isArray(args) ? args : [];
    const opts = normalizeDamageHeroOptions(rawOptions, card, selectedData);
    opts.selectedData = selectedData;
    opts.card = card;
    damageHero(rawCount, rawTarget, opts);
};

EFFECT_HANDLERS.doubleDamage = function(args = [], card, selectedData = {}) {
    const flagsRaw = args?.[0] || "";
    const flags = String(flagsRaw || "").toLowerCase();
    const ignoreText = flags.includes("ignoreeffecttext");
    gameState._pendingCardDamageMultiplier = (gameState._pendingCardDamageMultiplier || 1) * 2;
    if (ignoreText) {
        gameState._pendingIgnoreEffectText = true;
        console.log("[doubleDamage] Applied ignoreEffectText; remaining card effects will be skipped.");
    }
    console.log("[doubleDamage] Pending card damage multiplier now", gameState._pendingCardDamageMultiplier);
};

function extendDrawView(target = "self", count = 3, state = gameState, selectedData = {}) {
    const s = state || gameState;
    const currentHeroId = selectedData?.currentHeroId ?? null;
    const heroIds = s.heroes || [];
    let targetId = null;

    if (String(target).toLowerCase() === "self") {
        targetId = currentHeroId ?? heroIds[s.heroTurnIndex ?? 0] ?? null;
    } else {
        targetId = target;
    }

    if (targetId == null) {
        console.warn("[extendDrawView] No target hero resolved.");
        return;
    }

    if (!s.heroData) s.heroData = {};
    if (!s.heroData[targetId]) s.heroData[targetId] = {};

    const amt = Number(count) || 0;
    s.heroData[targetId].pendingDrawPreviewCount = amt;

    const heroName = heroes.find(h => String(h.id) === String(targetId))?.name || `Hero ${targetId}`;
    console.log(`[extendDrawView] Set draw preview size to ${amt} for ${heroName}.`);
}

EFFECT_HANDLERS.extendDrawView = function(args = [], card, selectedData = {}) {
    const target = args?.[0] ?? "self";
    const count = args?.[1] ?? 3;
    extendDrawView(target, count, gameState, selectedData);
};

function restoreExtraTurnModalFromState(state = gameState) {
    const modalData = state?.pendingExtraTurnModal;
    if (!modalData || !Array.isArray(modalData.options) || !modalData.options.length) return;
    showTeammateExtraTurnModal(modalData);
}

if (typeof window !== "undefined") {
    window.restoreExtraTurnModalFromState = restoreExtraTurnModalFromState;
}

export async function maybeRunHeroIconBeforeDrawOptionals(heroId) {
    if (heroId == null) return;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return;

    const effs = Array.isArray(heroObj.abilitiesEffects) ? heroObj.abilitiesEffects : [];
    const names = Array.isArray(heroObj.abilitiesNamePrint) ? heroObj.abilitiesNamePrint : [];
    const hState = gameState.heroData?.[heroId] || {};

    for (let i = 0; i < effs.length; i++) {
        const eff = effs[i];
        if (!eff || (eff.type || "").toLowerCase() !== "optional") continue;
        const cond = eff.condition;
        if (!cond || String(cond).toLowerCase() !== "beforedraw") continue;

        const usesMax = Number(eff.uses || 0);
        const currentUses = hState.currentUses?.[i];
        const remaining = currentUses == null ? usesMax : currentUses;
        if (remaining <= 0) {
            console.log(`[maybeRunHeroIconBeforeDrawOptionals] No uses left for icon optional idx ${i} on hero ${heroObj.name}.`);
            continue;
        }

        const condOk = evaluateCondition(String(cond), heroId, gameState);
        if (!condOk) continue;

        const promptText =
            names[i]?.text
                ? `${names[i].text}?`
                : "Use optional ability?";

        let allow = true;
        if (typeof window !== "undefined" && typeof window.showOptionalAbilityPrompt === "function") {
            allow = await window.showOptionalAbilityPrompt(promptText);
        }

        if (!allow) {
            console.log(`[maybeRunHeroIconBeforeDrawOptionals] Optional icon ability declined for ${heroObj.name}.`);
            continue;
        }

        if (!hState.currentUses) hState.currentUses = {};
        const nextUses = remaining - 1;
        hState.currentUses[i] = Math.max(0, nextUses);
        if (!heroObj.currentUses) heroObj.currentUses = {};
        heroObj.currentUses[i] = hState.currentUses[i];

        executeEffectSafely(eff.effect, heroObj, { currentHeroId: heroId, state: gameState });
        console.log(`[maybeRunHeroIconBeforeDrawOptionals] Applied icon optional for ${heroObj.name}. Uses left: ${hState.currentUses[i]} / ${usesMax}`);
    }
}

async function maybeRunHeroIconDamageOptionals(heroId) {
    if (heroId == null) return;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return;

    const effs = Array.isArray(heroObj.abilitiesEffects) ? heroObj.abilitiesEffects : [];
    const names = Array.isArray(heroObj.abilitiesNamePrint) ? heroObj.abilitiesNamePrint : [];
    const hState = gameState.heroData?.[heroId] || {};
    const base = Number(gameState._pendingCardBaseDamage || 0);

    for (let i = 0; i < effs.length; i++) {
        const eff = effs[i];
        if (!eff || (eff.type || "").toLowerCase() !== "optional") continue;
        const cond = eff.condition;
        if (!cond || String(cond).toLowerCase() !== "wouldusedamagecard") continue;

        const usesMax = Number(eff.uses || 0);
        const currentUses = hState.currentUses?.[i];
        const remaining = currentUses == null ? usesMax : currentUses;
        if (remaining <= 0) {
            console.log(`[maybeRunHeroIconDamageOptionals] No uses left for icon optional idx ${i} on hero ${heroObj.name}.`);
            continue;
        }

        const condOk = evaluateCondition(String(cond), heroId, gameState);
        if (!condOk) continue;

        const promptText =
            names[i]?.text
                ? `${names[i].text}?`
                : "Use optional ability?";

        let allow = true;
        if (typeof window !== "undefined" && typeof window.showOptionalAbilityPrompt === "function") {
            allow = await window.showOptionalAbilityPrompt(promptText);
        }

        if (!allow) {
            console.log(`[maybeRunHeroIconDamageOptionals] Optional icon ability declined for ${heroObj.name}.`);
            continue;
        }

        // Consume use
        if (!hState.currentUses) hState.currentUses = {};
        const nextUses = remaining - 1;
        hState.currentUses[i] = Math.max(0, nextUses);
        if (!heroObj.currentUses) heroObj.currentUses = {};
        heroObj.currentUses[i] = hState.currentUses[i];

        // Apply the effect
        executeEffectSafely(eff.effect, heroObj, { currentHeroId: heroId, state: gameState });
        console.log(`[maybeRunHeroIconDamageOptionals] Applied icon optional for ${heroObj.name}. Uses left: ${hState.currentUses[i]} / ${usesMax}`);
    }
}

function scanDeck(whichRaw, howMany = 1, selectedData = {}) {
    const which = String(whichRaw || "").toLowerCase();
    const count = Math.max(1, Number(howMany) || 1);

    let deck = [];
    let ptr = 0;
    let label = which;

    if (which === "villain") {
        deck = Array.isArray(gameState.villainDeck) ? gameState.villainDeck : [];
        ptr = typeof gameState.villainDeckPointer === "number" ? gameState.villainDeckPointer : 0;
        label = "Villain deck";
    } else if (which === "enemy") {
        deck = Array.isArray(gameState.enemyAllyDeck) ? gameState.enemyAllyDeck : [];
        ptr = typeof gameState.enemyAllyDeckPointer === "number" ? gameState.enemyAllyDeckPointer : 0;
        label = "Enemy/Ally deck";
    } else if (which === "self") {
        const heroId = selectedData?.currentHeroId ?? (gameState.heroes?.[gameState.heroTurnIndex ?? 0]);
        const heroState = heroId ? gameState.heroData?.[heroId] : null;
        deck = (heroState && Array.isArray(heroState.deck)) ? heroState.deck : [];
        ptr = 0;
        label = `Hero ${heroId} deck`;
    } else {
        console.warn("[scanDeck] Unknown deck type:", whichRaw);
        return;
    }

    if (!deck.length || ptr >= deck.length) {
        console.log(`[scanDeck] ${label} is empty or pointer at end (ptr=${ptr}, len=${deck.length}).`);
        return;
    }

    const slice = deck.slice(ptr, ptr + count);
    const annotated = slice.map(id => {
        const card = findCardInAllSources(id);
        return {
            id: String(id),
            name: card?.name || `Card ${id}`,
            type: card?.type || "",
            source: which,
            heroId: which === "self" ? (selectedData?.currentHeroId ?? (gameState.heroes?.[gameState.heroTurnIndex ?? 0])) : null
        };
    });

    // Populate shared buffer for later reference and persist
    gameState.scannedBuffer = annotated;
    saveGameState(gameState);

    console.log(
        `[scanDeck] ${label} next ${annotated.length} from ptr ${ptr}:`,
        annotated.map(c => `${c.id} (${c.name})`)
    );
}

EFFECT_HANDLERS.scanDeck = function(args = [], card, selectedData = {}) {
    const which = args?.[0] ?? "";
    const howMany = args?.[1] ?? 1;
    scanDeck(which, howMany, selectedData);
};

function scanBuffer() {
    const buf = Array.isArray(gameState.scannedBuffer) ? gameState.scannedBuffer : [];
    console.log("[scanBuffer] Current scannedBuffer contents:", buf);
}

EFFECT_HANDLERS.scanBuffer = function(args = [], card, selectedData = {}) {
    scanBuffer();
};

// Template stub for future scan effect application.
// Accepts an options object (e.g., { activate: true, ko: false }) and returns
// the cards currently in scannedBuffer in the order found.
function applyScanEffects(opts = {}) {
    const activate = !!opts.activate;
    const ko = !!opts.ko;
    const buf = Array.isArray(gameState.scannedBuffer) ? [...gameState.scannedBuffer] : [];

    console.log("[applyScanEffects] Called with options", { activate, ko, raw: opts });
    console.log("[applyScanEffects] scannedBuffer contents before clearing:", buf);

    // Render the scanned cards using hero preview styling (no buttons)
    renderScannedPreview(buf, { activate, ko });

    // Persist the displayed set so it survives refresh
    gameState.scannedDisplay = buf;
    gameState.scannedDisplayOpts = { activate, ko };
    saveGameState(gameState);

    // Clear the buffer after reporting
    gameState.scannedBuffer = [];

    return buf;
}

EFFECT_HANDLERS.applyScanEffects = function(args = [], card, selectedData = {}) {
    // Support call shapes like:
    //   applyScanEffects(ko)
    //   applyScanEffects(activate,ko)
    //   applyScanEffects(true,false)
    const opts = { activate: false, ko: false };

    args.forEach((arg, idx) => {
        if (typeof arg === "string") {
            const lower = arg.toLowerCase();
            if (lower === "activate") opts.activate = true;
            if (lower === "ko") opts.ko = true;
        } else if (typeof arg === "boolean") {
            if (idx === 0) opts.activate = arg;
            if (idx === 1) opts.ko = arg;
        }
    });

    applyScanEffects(opts);
};

function handleScanKo(cardInfo) {
    if (!cardInfo || !cardInfo.id) {
        console.warn("[handleScanKo] No card info provided.");
        return;
    }

    const source = (cardInfo.source || "").toLowerCase();
    const cardId = String(cardInfo.id);
    let removed = false;

    if (source === "villain") {
        const deck = Array.isArray(gameState.villainDeck) ? gameState.villainDeck : [];
        const ptr = typeof gameState.villainDeckPointer === "number" ? gameState.villainDeckPointer : 0;
        let idx = deck.indexOf(cardId, ptr);
        if (idx === -1) idx = deck.indexOf(cardId);
        if (idx >= 0) {
            deck.splice(idx, 1);
            if (gameState.villainDeckPointer != null && idx < gameState.villainDeckPointer) {
                gameState.villainDeckPointer = Math.max(0, gameState.villainDeckPointer - 1);
            }
            removed = true;
            if (!Array.isArray(gameState.koCards)) gameState.koCards = [];
            const cardData = findCardInAllSources(cardId);
            gameState.koCards.push({
                id: cardId,
                name: cardData?.name || `Card ${cardId}`,
                type: cardData?.type || "Villain",
                source: "scan-ko"
            });
        }
    } else if (source === "enemy") {
        const deck = Array.isArray(gameState.enemyAllyDeck) ? gameState.enemyAllyDeck : [];
        const ptr = typeof gameState.enemyAllyDeckPointer === "number" ? gameState.enemyAllyDeckPointer : 0;
        let idx = deck.indexOf(cardId, ptr);
        if (idx === -1) idx = deck.indexOf(cardId);
        if (idx >= 0) {
            deck.splice(idx, 1);
            if (gameState.enemyAllyDeckPointer != null && idx < gameState.enemyAllyDeckPointer) {
                gameState.enemyAllyDeckPointer = Math.max(0, gameState.enemyAllyDeckPointer - 1);
            }
            removed = true;
            if (!Array.isArray(gameState.enemyAllyDiscard)) gameState.enemyAllyDiscard = [];
            gameState.enemyAllyDiscard.push(cardId);
        }
    } else if (source === "self") {
        const heroId = cardInfo.heroId ?? (gameState.heroes?.[gameState.heroTurnIndex ?? 0]);
        const heroState = heroId ? gameState.heroData?.[heroId] : null;
        if (heroState && Array.isArray(heroState.deck)) {
            let idx = heroState.deck.indexOf(cardId);
            if (idx >= 0) {
                heroState.deck.splice(idx, 1);
                removed = true;
                if (!Array.isArray(heroState.discard)) heroState.discard = [];
                heroState.discard.push(cardId);
            }
        }
    } else {
        console.warn("[handleScanKo] Unknown source for card:", cardInfo);
    }

    // Always remove the card from the scanned display
    const currentDisplay = Array.isArray(gameState.scannedDisplay) ? gameState.scannedDisplay : [];
    const filteredDisplay = [];
    let removedFromDisplay = false;
    for (const entry of currentDisplay) {
        if (!removedFromDisplay && entry && String(entry.id) === cardId) {
            removedFromDisplay = true;
            continue;
        }
        filteredDisplay.push(entry);
    }
    gameState.scannedDisplay = filteredDisplay;

    if (removed) {
        console.log(`[handleScanKo] Removed ${cardId} from ${source} deck.`);
    } else {
        console.log("[handleScanKo] Could not find card to remove in deck; removed from preview only:", cardInfo);
    }

    // Re-render or close preview based on remaining cards
    const opts = gameState.scannedDisplayOpts || {};
    renderScannedPreview(filteredDisplay, opts);

    saveGameState(gameState);
}

function closeScanPreview() {
    const bar = document.getElementById("scan-preview-bar");
    const backdrop = document.getElementById("scan-preview-backdrop");
    const inner = document.getElementById("scan-preview-inner");

    if (bar) bar.style.display = "none";
    if (backdrop) backdrop.style.display = "none";
    if (inner) inner.innerHTML = "";

    // Reset persisted preview state
    gameState.scannedDisplay = [];
    gameState.scannedDisplayOpts = {};
    gameState.scannedBuffer = [];
    saveGameState(gameState);
}

async function handleScanActivate(cardInfo = {}) {
    const cardId = cardInfo?.id ? String(cardInfo.id) : null;
    if (!cardId) {
        console.warn("[handleScanActivate] No card id provided.", cardInfo);
        return;
    }

    const source = (cardInfo.source || "").toLowerCase();
    console.log("[handleScanActivate] Handling activate for", cardId, "from", source);

    const currentHeroId = cardInfo.heroId ?? (gameState.heroes?.[gameState.heroTurnIndex ?? 0]);
    let removedFromPreview = false;

    const removeFromPreview = () => {
        const currentDisplay = Array.isArray(gameState.scannedDisplay) ? gameState.scannedDisplay : [];
        const filtered = [];
        let removed = false;
        for (const entry of currentDisplay) {
            if (!removed && entry && String(entry.id) === cardId) {
                removed = true;
                continue;
            }
            filtered.push(entry);
        }
        if (removed) removedFromPreview = true;
        gameState.scannedDisplay = filtered;
        const opts = gameState.scannedDisplayOpts || {};
        renderScannedPreview(filtered, opts);
        saveGameState(gameState);
    };

    try {
        if (source === "self") {
            const heroState = currentHeroId ? gameState.heroData?.[currentHeroId] : null;
            if (!heroState) {
                console.warn("[handleScanActivate] No heroState for hero", currentHeroId);
            } else {
                if (!Array.isArray(heroState.deck)) heroState.deck = [];
                if (!Array.isArray(heroState.hand)) heroState.hand = [];

                // Remove one instance from the deck (preferring top)
                let idx = heroState.deck.indexOf(cardId);
                if (idx === -1 && heroState.deck.length > 0 && typeof heroState.deck[0] !== "string") {
                    idx = heroState.deck.findIndex(c => String(c) === cardId);
                }
                if (idx >= 0) {
                    heroState.deck.splice(idx, 1);
                }

                heroState.hand.push(cardId);
                console.log(`[handleScanActivate] Added card ${cardId} to hero ${currentHeroId}'s hand.`);
                renderHeroHandBar(gameState);
                saveGameState(gameState);
            }
        } else if (source === "villain") {
            await Promise.resolve(villainDraw(1));
        } else if (source === "enemy") {
            await enemyDraw(1, null, { currentHeroId });
        } else {
            console.warn("[handleScanActivate] Unknown source", source, cardInfo);
        }
    } catch (err) {
        console.warn("[handleScanActivate] Failed to process activation for", cardId, err);
    }

    removeFromPreview();
    if (!removedFromPreview) {
        console.log("[handleScanActivate] Card not found in preview; state left unchanged.");
    }
}

export function renderScannedPreview(cards = [], opts = {}) {
    if (typeof document === "undefined") return;

    const activateFlag = !!opts.activate;
    const koFlag = !!opts.ko;

    // Ensure container elements exist (similar styling to hero top preview)
    let bar = document.getElementById("scan-preview-bar");
    let inner = document.getElementById("scan-preview-inner");
    let backdrop = document.getElementById("scan-preview-backdrop");
    let closeBtn = document.getElementById("scan-preview-close");

    if (!bar) {
        bar = document.createElement("div");
        bar.id = "scan-preview-bar";
        bar.style.display = "none";
        bar.className = "hero-deck-preview-bar";
        document.body.appendChild(bar);
    }
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "scan-preview-backdrop";
        backdrop.className = "hero-deck-preview-backdrop";
        backdrop.style.display = "none";
        document.body.appendChild(backdrop);
    }
    if (!inner) {
        inner = document.createElement("div");
        inner.id = "scan-preview-inner";
        inner.className = "hero-deck-preview-inner";
        bar.appendChild(inner);
    }
    if (!closeBtn) {
        closeBtn = document.createElement("div");
        closeBtn.id = "scan-preview-close";
        closeBtn.textContent = "X";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "16px";
        closeBtn.style.right = "-160px";
        closeBtn.style.width = "52px";
        closeBtn.style.height = "52px";
        closeBtn.style.borderRadius = "50%";
        closeBtn.style.background = "red";
        closeBtn.style.border = "4px solid black";
        closeBtn.style.display = "flex";
        closeBtn.style.alignItems = "center";
        closeBtn.style.justifyContent = "center";
        closeBtn.style.color = "white";
        closeBtn.style.fontFamily = "'Racing Sans One', sans-serif";
        closeBtn.style.fontSize = "28px";
        closeBtn.style.fontWeight = "bold";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.zIndex = "3";
        closeBtn.style.pointerEvents = "auto";
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("[scan preview] Close clicked.");
            closeScanPreview();
        }, true);
        bar.appendChild(closeBtn);
    }
    // Ensure delegated click handler for activate/KO buttons is registered once
    if (!inner._scanDelegatedHandler) {
        inner._scanDelegatedHandler = async (e) => {
            const koEl = e.target.closest("[data-scan-ko]");
            if (koEl) {
                e.stopPropagation();
                const info = {
                    id: koEl.dataset.cardId,
                    source: koEl.dataset.cardSource,
                    heroId: koEl.dataset.cardHeroId || null
                };
                console.log(`[scan preview] ko clicked (delegate): ${koEl.dataset.cardName || info.id}`);
                handleScanKo(info);
                return;
            }
            const actEl = e.target.closest("[data-scan-activate]");
            if (actEl) {
                e.stopPropagation();
                const info = {
                    id: actEl.dataset.cardId,
                    source: actEl.dataset.cardSource,
                    heroId: actEl.dataset.cardHeroId || null,
                    name: actEl.dataset.cardName || actEl.dataset.cardId
                };
                console.log(`[scan preview] activate clicked (delegate): ${info.name}`);
                await handleScanActivate(info);
                return;
            }
        };
        inner.addEventListener("click", inner._scanDelegatedHandler, true);
    }

    // Fallback styling to mirror hero preview (centered, dim backdrop, small cards)
    bar.style.position = "fixed";
    bar.style.left = "50%";
    bar.style.transform = "translate(-50%, 30px)";
    bar.style.bottom = "20px";
    bar.style.zIndex = "9500"; // keep below panels (~10000) but above most UI
    bar.style.display = "flex";
    bar.style.alignItems = "center";
    bar.style.justifyContent = "center";
    bar.style.gap = "10px";
    bar.style.padding = "8px 12px";
    bar.style.borderRadius = "10px";
    bar.style.overflow = "visible";
    bar.style.pointerEvents = "auto";

    backdrop.style.position = "fixed";
    backdrop.style.inset = "0";
    backdrop.style.background = "rgba(0,0,0,0.55)";
    backdrop.style.backdropFilter = "blur(1px)";
    backdrop.style.zIndex = "9490";
    backdrop.style.pointerEvents = "none";

    inner.innerHTML = "";
    inner.style.pointerEvents = "auto";
    inner.style.display = "flex";
    inner.style.flexDirection = "row";
    inner.style.alignItems = "center";
    inner.style.gap = "12px";

    cards.forEach(cardInfo => {
        const cardId = cardInfo?.id ?? cardInfo;
        if (!cardId) return;
        const cardData = findCardInAllSources(cardId);

        const outer = document.createElement("div");
        outer.className = "hero-preview-outer";
        outer.style.position = "relative";
        outer.style.display = "flex";
        outer.style.flexDirection = "column";
        outer.style.alignItems = "center";
        outer.style.justifyContent = "center";
        outer.style.gap = "0px";
        outer.style.margin = "0 -90px";

        const cardWrap = document.createElement("div");
        cardWrap.className = "hero-preview-card";
        cardWrap.appendChild(renderCard(cardId, cardWrap));
        cardWrap.style.transform = "scale(0.45)";
        cardWrap.style.transformOrigin = "center center";
        cardWrap.style.marginTop = "0px";
        cardWrap.style.pointerEvents = "auto";

        // Click: open appropriate panel for supported types
        cardWrap.style.cursor = "pointer";
        cardWrap.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!cardData) return;
            const typeLower = (cardData.type || "").toLowerCase();
            if (typeLower === "villain" || typeLower === "henchman") {
                try { buildVillainPanel(cardData); } catch (err) { console.warn("[scan preview] buildVillainPanel failed", err); }
            } else if (typeLower === "main" || typeLower === "bystander") {
                try { buildMainCardPanel(cardData); } catch (err) { console.warn("[scan preview] buildMainCardPanel failed", err); }
            }
        }, true);

        // Optional top/bottom action icons
        if (activateFlag) {
            const actBtn = document.createElement("img");
            const sourceLower = (cardInfo?.source || "").toLowerCase();
            if (sourceLower === "self") {
                actBtn.src = "https://raw.githubusercontent.com/over-lords/overlords/929e24644681d3c05e38bfc769b04b0e22e072c6/Public/Images/Site%20Assets/drawCard.png";
                actBtn.alt = "Draw to hand";
            } else {
                actBtn.src = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Site%20Assets/activate.png";
                actBtn.alt = "Activate";
            }
            actBtn.style.width = "70px";
            actBtn.style.height = "70px";
            actBtn.style.cursor = "pointer";
            actBtn.style.display = "block";
            actBtn.style.position = "absolute";
            actBtn.style.top = "20px";
            actBtn.style.left = "50%";
            actBtn.style.transform = "translateX(-50%)";
            actBtn.style.zIndex = "2";
            actBtn.style.pointerEvents = "auto";
            actBtn.dataset.scanActivate = "1";
            actBtn.dataset.cardId = cardId;
            actBtn.dataset.cardSource = cardInfo?.source || "";
            actBtn.dataset.cardHeroId = cardInfo?.heroId ?? "";
            actBtn.dataset.cardName = cardData?.name || cardId;
            actBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log(`[scan preview] activate clicked: ${cardData?.name || cardId}`);
                handleScanActivate({
                    id: cardId,
                    source: cardInfo?.source || "",
                    heroId: cardInfo?.heroId ?? "",
                    name: cardData?.name || cardId
                });
            }, true);
            outer.appendChild(actBtn);
        }

        // Insert card in the middle
        outer.appendChild(cardWrap);

        if (koFlag) {
            const koBtn = document.createElement("img");
            koBtn.src = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Site%20Assets/permanentKO.png";
            koBtn.alt = "KO";
            koBtn.style.width = "48px";
            koBtn.style.height = "48px";
            koBtn.style.cursor = "pointer";
            koBtn.style.display = "block";
            koBtn.style.objectFit = "contain";
            koBtn.style.flexShrink = "0";
            koBtn.style.pointerEvents = "auto";
            koBtn.dataset.scanKo = "1";
            koBtn.dataset.cardId = cardId;
            koBtn.dataset.cardSource = cardInfo?.source || "";
            koBtn.dataset.cardHeroId = cardInfo?.heroId ?? "";
            koBtn.dataset.cardName = cardData?.name || cardId;
            koBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log(`[scan preview] ko clicked: ${cardData?.name || cardId}`);
                handleScanKo(cardInfo);
            }, true);
            // wrap in a badge for styling
            const badge = document.createElement("div");
            badge.style.width = "60px";
            badge.style.height = "60px";
            badge.style.borderRadius = "50%";
            badge.style.background = "red";
            badge.style.border = "4px solid black";
            badge.style.display = "flex";
            badge.style.alignItems = "center";
            badge.style.justifyContent = "center";
            badge.style.position = "absolute";
            badge.style.bottom = "24px";
            badge.style.left = "50%";
            badge.style.transform = "translateX(-50%)";
            badge.style.zIndex = "2";
            badge.style.boxSizing = "border-box";
            badge.style.cursor = "pointer";
            badge.style.pointerEvents = "auto";
            badge.addEventListener("click", (e) => {
                e.stopPropagation();
                koBtn.click();
            }, true);
            badge.appendChild(koBtn);
            outer.appendChild(badge);
        }

        inner.appendChild(outer);
    });

    if (inner.children.length === 0) {
        bar.style.display = "none";
        backdrop.style.display = "none";
    } else {
        bar.style.display = "flex";
        backdrop.style.display = "block";
    }
}

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

EFFECT_HANDLERS.henchEntryBonusHp = function(args = [], card, selectedData = {}) {
    const amount = Number(args[0]) || 0;
    if (!amount) return;

    const state = selectedData.state || gameState;
    const entry =
        selectedData.entry ||
        (typeof selectedData.entryIndex === "number" && state?.cities?.[selectedData.entryIndex])
            || null;

    if (!entry) {
        console.warn("[henchEntryBonusHp] No entry provided for henchman HP bonus.");
        return;
    }

    const foeId = entry.id ?? null;
    const cardData =
        selectedData.cardData ||
        (foeId != null ? findCardInAllSources(foeId) : null);
    const isHench =
        (cardData?.type || "").toLowerCase() === "henchman" ||
        (foeId != null && henchmen.some(h => String(h.id) === String(foeId)));

    if (!isHench) return;

    if (!state.villainHP) state.villainHP = {};

    const entryKey = entry.instanceId ?? entry.uniqueId ?? (foeId != null ? String(foeId) : null);
    const baseHP = Number(entry.maxHP ?? cardData?.hp ?? 0) || 0;
    const currentHP = Number(entry.currentHP ?? (entryKey ? state.villainHP[entryKey] : null) ?? baseHP) || 0;

    const nextMax = baseHP + amount;
    const nextCurrent = currentHP + amount;

    entry.maxHP = nextMax;
    entry.currentHP = nextCurrent;

    if (entryKey) state.villainHP[entryKey] = nextCurrent;
    if (cardData) cardData.currentHP = nextCurrent;
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
        const ctx = state?._lastDamageContext;
        if (ctx && (ctx.target === "overlord" || ctx.target === "none")) {
            console.warn("[freezeVillain] Guard hit: lastDamagedFoe blocked because last damage target was not a city foe.", {
                context: ctx,
                heroId,
                cardId: card?.id,
                cardName: card?.name,
                lastDamagedFoe: state?.lastDamagedFoe
            });
            return;
        }
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

function parsePassiveSpec(specRaw) {
    if (typeof specRaw !== "string") return null;
    const m = specRaw.trim().match(/^([a-zA-Z]+)\((\d+)\)$/);
    if (!m) return null;
    return { kind: m[1].toLowerCase(), amount: Number(m[2]) || 0 };
}

function applyPassiveToEntry(entry, passive, howLong, state, heroId) {
    if (!passive || !entry) return;
    const s = state || gameState;
    console.log("[applyPassiveToEntry] Applying passive", { passive, howLong, entryKey: getEntryKey(entry), slotIndex: entry.slotIndex, id: entry.id });
    if (passive.kind === "curse") {
        applyCurseToEntry(entry, passive.amount, howLong, s, heroId);
    }

    const foeCard = getFoeCardFromEntry(entry);
    const foeName = foeCard?.name || `Enemy ${entry.id ?? ""}`.trim();
    const heroName = heroId != null
        ? (heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`)
        : "A hero";
    const durationText = String(howLong || "forever").toLowerCase() === "next"
        ? "until the end of their next turn"
        : "permanently";
    const passiveLabel = passive.amount != null
        ? `${passive.kind.charAt(0).toUpperCase()}${passive.kind.slice(1)} ${passive.amount}`
        : passive.kind;
    try {
        appendGameLogEntry(`${heroName} gave ${foeName} ${passiveLabel} ${durationText}.`, s);
    } catch (err) {
        console.warn("[giveVillainPassive] Failed to append log entry.", err);
    }
}

export function givePassiveToEntry(entry, passive, howLong, state = gameState, heroId = null) {
    applyPassiveToEntry(entry, passive, howLong, state, heroId);
}

function applyPassiveToTarget(targetMode, passive, howLong, state = gameState, heroId = null) {
    const s = state || gameState;
    const mode = String(targetMode || "any").toLowerCase();

    if (mode === "lastdamagedfoe") {
        const info = s.lastDamagedFoe;
        console.log("[giveVillainPassive] lastDamagedFoe info", info);
        const ctx = s._lastDamageContext;
        if (ctx && (ctx.target === "overlord" || ctx.target === "none")) {
            console.warn("[giveVillainPassive] Guard hit: lastDamagedFoe blocked because last damage target was not a city foe.", {
                context: ctx,
                heroId,
                passive,
                howLong,
                lastDamagedFoe: s?.lastDamagedFoe
            });
            return;
        }
        if (!info || !Array.isArray(s.cities)) {
            console.warn("[giveVillainPassive] No lastDamagedFoe available.");
            return;
        }
        const entry = s.cities.find(e => e && (getEntryKey(e) === info.instanceId || String(e.id) === String(info.foeId)));
        if (!entry) {
            console.warn("[giveVillainPassive] Could not locate lastDamagedFoe entry.");
            return;
        }
        console.log("[giveVillainPassive] Found entry for lastDamagedFoe", { entryKey: getEntryKey(entry), slotIndex: entry.slotIndex, id: entry.id });
        applyPassiveToEntry(entry, passive, howLong, s, heroId);
        saveGameState(s);
        return;
    }

    if (mode === "any") {
        if (typeof window === "undefined") {
            console.warn("[giveVillainPassive] 'any' selection requires the browser UI.");
            return;
        }
        window.__givePassiveSelectMode = { passive, howLong, heroId, state: s };
        try {
            showMightBanner("Choose a foe to give a passive", 1800);
        } catch (err) {
            console.warn("[giveVillainPassive] Could not show selection banner.", err);
        }
        return;
    }

    console.warn("[giveVillainPassive] Unknown target mode:", targetMode);
}

EFFECT_HANDLERS.giveVillainPassive = function(args = [], card, selectedData = {}) {
    const passiveSpec = args?.[0] ?? "";
    const who = args?.[1] ?? "any";
    const howLong = args?.[2] ?? "forever";

    const passive = parsePassiveSpec(String(passiveSpec));
    if (!passive) {
        console.warn("[giveVillainPassive] Invalid passive spec:", passiveSpec);
        return;
    }

    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    applyPassiveToTarget(who, passive, howLong, state, heroId);
};

function normalizeVillainDeckPointer(state) {
    const ptr = typeof state.villainDeckPointer === "number" ? state.villainDeckPointer : 0;
    return Math.max(0, ptr);
}

function pushCardToVillainDeckTop(cardId, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.villainDeck)) {
        s.villainDeck = [];
    }
    const ptr = normalizeVillainDeckPointer(s);
    s.villainDeck.splice(ptr, 0, String(cardId));
    s.villainDeckPointer = ptr;
}

function isHenchmanOrVillainId(id) {
    const idStr = String(id);
    return henchmen.some(h => String(h.id) === idStr) || villains.some(v => String(v.id) === idStr);
}

export function knockbackFoe(entry, slotIndex, state = gameState, heroId = null) {
    const s = state || gameState;
    if (!entry) return;

    const upperIdx = (typeof slotIndex === "number") ? slotIndex : entry.slotIndex;
    const cardId = entry.id ?? entry.baseId ?? entry.foeId;
    const foeCard = cardId != null ? findCardInAllSources(cardId) : null;

    if (typeof upperIdx !== "number" || cardId == null) {
        console.warn("[knockbackFoe] Invalid target or slot index.", { entry, slotIndex });
        return;
    }

    // Clear model entry
    if (Array.isArray(s.cities)) {
        const existing = s.cities[upperIdx];
        const matchesKey = getEntryKey(existing) && getEntryKey(existing) === getEntryKey(entry);
        const matchesId = existing && String(existing.id) === String(cardId);
        if (matchesKey || matchesId) {
            s.cities[upperIdx] = null;
        }
    }

    // Clear per-instance HP and overlays
    const entryKey = getEntryKey(entry);
    if (entryKey && s.villainHP) delete s.villainHP[entryKey];
    if (s.villainHP && s.villainHP[String(cardId)] != null) {
        delete s.villainHP[String(cardId)];
    }
    if (entryKey && s.tempFrozen) {
        delete s.tempFrozen[entryKey];
    }
    removeFrozenOverlay(upperIdx);

    // Rescue captured bystanders for the acting hero
    if (Array.isArray(entry.capturedBystanders) && entry.capturedBystanders.length > 0) {
        const captured = entry.capturedBystanders;
        if (heroId != null && s.heroData && s.heroData[heroId]) {
            const heroState = s.heroData[heroId];
            if (!Array.isArray(heroState.hand)) heroState.hand = [];
            captured.forEach(b => heroState.hand.push(String(b.id)));

            const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
            const names = captured.map(b => b?.name || "Bystander").join(", ");
            const msg = captured.length === 1
                ? `${names} was rescued by ${heroName}.`
                : `Bystanders: ${names} were rescued by ${heroName}.`;
            appendGameLogEntry(msg, s);
            try { renderHeroHandBar(s); } catch (err) { console.warn("[knockbackFoe] Failed to refresh hero hand UI.", err); }
        }
        entry.capturedBystanders = [];
    }

    // Send any engaged hero beneath this city back to HQ
    const lowerIdx = upperIdx + 1;
    (s.heroes || []).forEach(hid => {
        const hState = s.heroData?.[hid];
        if (hState && hState.cityIndex === lowerIdx) {
            hState.cityIndex = null;
            try {
                const citySlots = document.querySelectorAll(".city-slot");
                const slot = citySlots?.[lowerIdx];
                const area = slot?.querySelector(".city-card-area");
                if (area) area.innerHTML = "";
            } catch (err) {
                console.warn("[knockbackFoe] Failed to clear engaged hero UI.", err);
            }
        }
    });

    // Clear foe UI from the city
    try {
        const citySlots = document.querySelectorAll(".city-slot");
        const upperSlot = citySlots?.[upperIdx];
        const area = upperSlot?.querySelector(".city-card-area");
        if (area) area.innerHTML = "";
    } catch (err) {
        console.warn("[knockbackFoe] Failed to clear foe UI.", err);
    }

    // Reset card status and place on top of the villain deck
    if (foeCard) {
        foeCard.currentHP = Number(foeCard.hp) || Number(foeCard.hp?.valueOf?.()) || foeCard.hp;
        if (foeCard.isFrozen) foeCard.isFrozen = false;
    }
    pushCardToVillainDeckTop(cardId, s);
    s.revealedTopVillain = true;
    try {
        const btn = document.getElementById("top-villain-button");
        if (btn) btn.style.display = "flex";
    } catch (err) {
        console.warn("[knockbackFoe] Failed to refresh top-villain button.", err);
    }

    const heroName = heroId != null
        ? (heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`)
        : "A hero";
    const foeName = foeCard?.name || `Enemy ${cardId}`;
    appendGameLogEntry(`${heroName} knocked ${foeName} back to the top of the Villain Deck.`, s);

    // Clear pending knockback trackers
    s.pendingKnockback = null;
    try { if (typeof window !== "undefined") window.__knockbackSelectMode = null; } catch (err) {}

    saveGameState(s);
}

function queueKnockbackSelection(flag = "any", heroId = null, state = gameState) {
    const s = state || gameState;
    const normalized = String(flag || "any").toLowerCase();
    if (normalized !== "any") {
        console.warn("[knockback] Unsupported flag; only 'any' is implemented.", flag);
        return;
    }

    const hasTargets = Array.isArray(s.cities) && s.cities.some(entry => entry && isHenchmanOrVillainId(entry.id));
    if (!hasTargets) {
        console.log("[knockback] No valid henchmen or villains to target.");
        return;
    }

    if (typeof window !== "undefined") {
        window.__knockbackSelectMode = { heroId, flag: "any", state: s };
    }
    s.pendingKnockback = { heroId, flag: "any" };
    saveGameState(s);

    try {
        showMightBanner("Choose a foe to Knockback", 1800);
    } catch (err) {
        console.warn("[knockback] Could not show selection banner.", err);
    }
}

EFFECT_HANDLERS.knockback = function(args = [], card, selectedData = {}) {
    const flag = (args?.[0] ?? "any") || "any";
    const heroId = selectedData?.currentHeroId ?? null;
    const state = selectedData?.state || gameState;

    queueKnockbackSelection(flag, heroId, state);
};

EFFECT_HANDLERS.returnHeroAsVillain = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.targetHeroId ?? selectedData?.currentHeroId ?? null;
    const foeName = card?.name || "Unknown foe";

    if (!heroId) {
        console.warn("[returnHeroAsVillain] No heroId provided; skipping.");
        return;
    }

    const heroCard = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroCard?.name || `Hero ${heroId}`;

    console.log(`[returnHeroAsVillain] KOHero triggered by ${foeName} on ${heroName} (${heroId}).`);

    const match = villains.find(v => String(v.name).toLowerCase() === String(heroName).toLowerCase());
    if (!match) {
        console.log(`[returnHeroAsVillain] No villain with matching name for ${heroName}; skipping deck insert.`);
        return;
    }

    console.log(`[returnHeroAsVillain] Found villain match ${match.name} (${match.id}); placing on top of villain deck.`);
    pushCardToVillainDeckTop(match.id, state);

    const logMsg = `${foeName} KO'd ${heroName} and they've been turned!`;
    appendGameLogEntry(logMsg, state);
    console.log(`[returnHeroAsVillain] ${logMsg}`);

    try { saveGameState(state); } catch (err) {
        console.warn("[returnHeroAsVillain] Failed to save game state after inserting villain.", err);
    }
};

// END OF EFFECT HANDLERS

export function triggerKOHeroEffects(foeCard, state = gameState, heroId = null, context = {}) {
    if (!foeCard) return;
    const effects = Array.isArray(foeCard.abilitiesEffects) ? foeCard.abilitiesEffects : [];
    if (!effects.length) return;

    effects.forEach((eff, idx) => {
        if (!eff) return;
        const cond = String(eff.condition || "").toLowerCase();
        if (cond !== "kohero") return;
        try {
            executeEffectSafely(eff.effect, foeCard, {
                ...context,
                currentHeroId: heroId,
                targetHeroId: heroId,
                state
            });
            console.log(`[triggerKOHeroEffects] Ran KOHero effect #${idx + 1} for ${foeCard.name || foeCard.id}.`);
        } catch (err) {
            console.warn("[triggerKOHeroEffects] Failed to run KOHero effect", err);
        }
    });
}

export function executeEffectSafely(effectString, card, selectedData) {
    if (Array.isArray(effectString)) {
        effectString.forEach(eff => executeEffectSafely(eff, card, selectedData));
        return;
    }
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

export function triggerRuleEffects(condition, payload = {}, state = gameState) {
    const s = state || gameState;
    const condNorm = normalizeConditionString(condition);
    if (!condNorm) return;

    const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
    const activeTactics = (s.tactics || [])
        .map(id => tacticMap.get(String(id)))
        .filter(Boolean);

    activeTactics.forEach(tacticCard => {
        const effects = Array.isArray(tacticCard.abilitiesEffects) ? tacticCard.abilitiesEffects : [];

        effects.forEach((eff, idx) => {
            const effCond = normalizeConditionString(eff?.condition);
            if (!effCond || effCond !== condNorm) return;
            if (!eff?.effect) return;

            try {
                executeEffectSafely(eff.effect, tacticCard, { ...payload, state: s, tacticId: tacticCard.id });
            } catch (err) {
                console.warn(`[triggerRuleEffects] Failed to run effect ${idx} on ${tacticCard.name}:`, err);
            }
        });
    });
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
        let stepsMoved = 0;

        for (let step = 0; step < distance; step++) {
            const moved = await attemptSingleLeftShift(fromPos);
            if (!moved) break;
            fromPos -= 1;
            stepsMoved += 1;
        }

        if (stepsMoved > 0) {
            try {
                const cardData = findCardInAllSources(cardId);
                const foeName = cardData?.name || `Enemy ${cardId}`;
                const label = stepsMoved === 1 ? "space" : "spaces";
                appendGameLogEntry(`${foeName} charged ${stepsMoved} ${label}!`, gameState);
            } catch (err) {
                console.warn("[runCharge] Failed to append charge log", err);
            }
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
    if (captured.length > 0) {
        const foeName = foeCard?.name || "Enemy";
        const names = captured.map(b => b?.name || "Bystander").join(", ");
        const msg = captured.length === 1
            ? `${names} was KO'd by ${foeName}.`
            : `Bystanders: ${names} were KO'd by ${foeName}.`;
        appendGameLogEntry(msg, state);
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
    const exitKey = getEntryKey(entry);

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

        const currentKey = getEntryKey(current);
        const sameInstance = exitKey && currentKey && currentKey === exitKey;
        const sameIdNoKey =
            !currentKey && !exitKey && current && String(current.id) === String(entry.id);

        // Only clear if this exact instance (or keyless same-id) is still there
        if (current && (sameInstance || sameIdNoKey)) {
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
        const currentKey = getEntryKey(current);
        const sameInstance = exitKey && currentKey && currentKey === exitKey;
        const sameIdNoKey =
            !currentKey && !exitKey && current && String(current.id) === String(entry.id);

        // Only clear the upper slot if:
        //  - it's still empty in the model (stale DOM),
        //  - OR it still belongs to the same exiting villain id.
        // If a new villain (e.g., from city 2) has been moved into 0,
        // current.id !== entry.id and we skip clearing DOM.
        if (!current || sameInstance || sameIdNoKey) {
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
        try {
            const cardData = findCardInAllSources(id);
            const cardName = cardData?.name || `Card ${id}`;
            appendGameLogEntry(`Villain Deck Draw: ${cardName}`, gameState);
        } catch (err) {
            console.warn("[rallyNextHenchVillains] Failed to append game log entry", err);
        }
    }

    saveGameState(gameState);
}

export async function onHeroCardActivated(cardId, meta = {}) {
    if (gameState.gameOver) {
        console.log("[GameOver] Ignoring hero card activation; game is already over.");
        return;
    }

    // Reset damage context for this activation (used by afterDamage effects)
    gameState._lastDamageContext = null;
    // Reset pending damage accumulator for this activation
    gameState._pendingDamage = 0;
    gameState._pendingCardDamageMultiplier = 1;

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
    gameState._pendingCardBaseDamage = baseDamageAmount;
    gameState._pendingCardDamageMultiplier = 1;
    gameState._pendingIgnoreEffectText = false;

    await maybeRunHeroIconDamageOptionals(heroId);

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
        // Pre-read raw condition
        const rawCond = eff?.condition;
        const rawCondStr = typeof rawCond === "string" ? rawCond.trim() : "";

        // Special-case: damagedAtTurnEnd should always register and defer execution
        if (rawCondStr.toLowerCase() === "damagedatturnend") {
            const hState = gameState.heroData?.[heroId];
            if (!hState) {
                console.warn("[AbilityExecutor] damagedAtTurnEnd condition with no hero state.");
                return;
            }
            if (!Array.isArray(hState.pendingEndTurnDamageEffects)) {
                hState.pendingEndTurnDamageEffects = [];
            }
            const payload = {
                effect: eff.effect,
                sourceCardId: cardData?.id,
                sourceCardName: cardData?.name
            };
            hState.pendingEndTurnDamageEffects.push(payload);
            console.log("[AbilityExecutor] Registered damagedAtTurnEnd watcher", {
                heroId,
                heroName: heroes.find(h => String(h.id) === String(heroId))?.name,
                effect: payload
            });
            return;
        }

        // ---------- CONDITION ----------
        let cond = "none";
        let condList = [];

        if (!skipCondition) {

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
        // SPECIAL CONDITION: damagedAtTurnEnd
        // Register the effect to fire later if the hero takes end-of-turn damage.
        // ------------------------------------------------------
        if (typeof cond === "string" && cond.toLowerCase() === "damagedatturnend") {
            const hState = gameState.heroData?.[heroId];
            if (!hState) {
                console.warn("[AbilityExecutor] damagedAtTurnEnd condition with no hero state.");
                return;
            }
            if (!Array.isArray(hState.pendingEndTurnDamageEffects)) {
                hState.pendingEndTurnDamageEffects = [];
            }
            const payload = {
                effect: eff.effect,
                sourceCardId: cardData?.id,
                sourceCardName: cardData?.name
            };
            hState.pendingEndTurnDamageEffects.push(payload);
            console.log("[AbilityExecutor] Registered damagedAtTurnEnd watcher", {
                heroId,
                heroName: heroes.find(h => String(h.id) === String(heroId))?.name,
                effect: payload
            });
            return;
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
                // Defer to post-damage queue, but remember non-afterDamage conditions.
                postEffects.push({ eff, index: i, conds: allConds });
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

            if (gameState._pendingIgnoreEffectText && !(eff.effect && String(eff.effect).toLowerCase().startsWith("doubledamage"))) {
                console.log("[AbilityExecutor] Ignoring remaining effects due to ignoreEffectText flag.");
                break;
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
    const multiplier = Number(gameState._pendingCardDamageMultiplier || 1) || 1;
    let damageAmount = (baseDamageAmount * multiplier) + bonusDamage;
    if (gameState._pendingSetDamage != null) {
        damageAmount = Number(gameState._pendingSetDamage) || 0;
    }
    gameState._pendingDamage = 0;
    gameState._pendingSetDamage = null;
    gameState._pendingCardDamageMultiplier = 1;
    gameState._pendingIgnoreEffectText = false;
    gameState._pendingCardDamageMultiplier = 1;
    gameState._pendingIgnoreEffectText = false;

    // Default: assume nothing valid was damaged until we confirm otherwise
    gameState._lastDamageContext = {
        target: "none",
        reason: (!foeSummary ? "no foeSummary" : "damageAmount<=0"),
        heroId,
        heroName,
        cardId: idStr,
        cardName
    };

    if (foeSummary && damageAmount > 0) {
        console.log(
            `[AbilityExecutor] ${heroName} is dealing ${damageAmount} damage to ${foeSummary.foeName}.`
        );

        if (foeSummary.source === "overlord") {
            damageOverlord(damageAmount, gameState, heroId);
            gameState._lastDamageContext = {
                target: "overlord",
                heroId,
                heroName,
                cardId: idStr,
                cardName,
                foeId: foeSummary.foeId,
                foeName: foeSummary.foeName
            };
        } else if (foeSummary.source === "city-upper") {
            damageAmount = applyHalfDamageModifier(damageAmount, heroId, gameState);
            damageFoe(damageAmount, foeSummary, heroId, gameState);
            gameState._lastDamageContext = {
                target: "city-foe",
                heroId,
                heroName,
                cardId: idStr,
                cardName,
                foeId: foeSummary.foeId,
                foeName: foeSummary.foeName,
                slotIndex: foeSummary.slotIndex
            };
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
        let skipOptionBlocks = false;

        for (let k = 0; k < postEffects.length; k++) {
            const { eff, index, conds = [] } = postEffects[k];

            // Reset option skipping when we encounter non-option entries.
            const isOptionBlock = typeof eff?.type === "string" && /^chooseOption\(\d+\)$/.test(eff.type);
            const isChooseRoot = eff?.type === "chooseOption";
            if (!isOptionBlock && !isChooseRoot) {
                skipOptionBlocks = false;
            }

            // Evaluate any non-afterDamage conditions now (e.g., onlyOnShove).
            const extraConds = conds.filter(c => c && c.toLowerCase() !== "afterdamage");
            let condFailed = false;
            for (const c of extraConds) {
                if (!evaluateCondition(c, heroId, gameState)) {
                    condFailed = true;
                    break;
                }
            }

            // If the choose root fails its condition, skip its option blocks.
            if (condFailed && isChooseRoot) {
                skipOptionBlocks = true;
            }

            // Skip orphaned option blocks when their choose root did not run.
            if (isOptionBlock && skipOptionBlocks) {
                console.log("[AbilityExecutor] Skipping choose option block because choose root was not executed.", eff);
                continue;
            }

            if (condFailed) {
                console.log("[AbilityExecutor] Post-damage condition failed; skipping effect.", eff);
                continue;
            }

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

    amount = applyHalfDamageModifier(amount, heroId, s);

    const info = getCurrentOverlordInfo(s);
    if (!info) {
        console.warn("[damageOverlord] No current overlord found.");
        return;
    }

    const ovId      = info.id;
    const ovCard    = info.card;
    const currentHP = info.currentHP;
    let actualDamage = Math.max(0, Math.min(amount, currentHP));
    let newHP     = Math.max(0, currentHP - amount);
    const heroName  = heroId != null
        ? (heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`)
        : "Hero";
    const overlordName = ovCard?.name || "Overlord";
    const isFinalOverlord = info.kind !== "scenario" && Array.isArray(s.overlords) && s.overlords.length === 1;
    const upperRowOccupied = isFinalOverlord && UPPER_ORDER.some(idx => isCityOccupied(s, idx));

    if (isFinalOverlord && upperRowOccupied && newHP <= 0) {
        newHP = 1;
        actualDamage = Math.max(0, currentHP - newHP);
    }

    if (heroId != null) {
        if (!s.heroDamageToOverlord) s.heroDamageToOverlord = {};
        s.heroDamageToOverlord[heroId] = (s.heroDamageToOverlord[heroId] || 0) + actualDamage;
        if (s.heroData?.[heroId]) {
            s.heroData[heroId].lastDamageAmount = Number(actualDamage) || 0;
        }
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
            appendGameLogEntry(`${heroName} dealt ${actualDamage} damage to ${overlordName}.`, s);
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
        appendGameLogEntry(`${heroName} KO'd ${overlordName}.`, s);

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
        if (Array.isArray(s.halfDamageModifiers)) {
            s.halfDamageModifiers = s.halfDamageModifiers.filter(mod => !(mod && mod.sourceType === "scenario" && String(mod.sourceId) === String(ovId)));
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
        appendGameLogEntry(`${heroName} dealt ${actualDamage} damage to ${overlordName}.`, s);

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
        appendGameLogEntry(`${heroName} KO'd ${overlordName}.`, s);

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
    let effectiveAmount = amount;

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

    // ============================================================
    // FLAG: "adjacentFoes" ƒ?" like "any" but limited to upper cities
    // adjacent to the hero's lower-row slot (center/left/right)
    // ============================================================
    if (flag === "adjacentFoes") {
        if (typeof window === "undefined") {
            console.warn("[damageFoe] 'adjacentFoes' flag requires the browser UI; no window found.");
            return;
        }

        if (!heroId || !s.heroData?.[heroId]) {
            console.warn("[damageFoe] 'adjacentFoes' flag needs a valid heroId with cityIndex.");
            return;
        }

        const hState = s.heroData[heroId];
        if (hState.isFacingOverlord) {
            console.log("[damageFoe] Hero is facing overlord; no adjacent city targets.");
            return;
        }

        const lowerIdx = hState.cityIndex;
        if (typeof lowerIdx !== "number") {
            console.warn("[damageFoe] Hero is not in a city; cannot target adjacent foes.");
            return;
        }

        const upperCenter = lowerIdx - 1;
        const upperLeft   = upperCenter - 2;
        const upperRight  = upperCenter + 2;
        const allowedSlots = [upperCenter, upperLeft, upperRight]
            .filter(idx => Number.isInteger(idx) && idx >= 0 && idx <= 10);

        if (!allowedSlots.length || !Array.isArray(s.cities)) {
            console.log("[damageFoe] No adjacent slots available for selection.");
            return;
        }

        const hasTarget = allowedSlots.some(idx => {
            const entry = s.cities[idx];
            return entry && entry.id != null;
        });

        if (!hasTarget) {
            console.log("[damageFoe] No foes in adjacent slots; skipping selection.");
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
            const isKO = Number(amount) === 999;
            const text = isKO
                ? "Choose an adjacent foe to KO"
                : `Choose an adjacent foe to take ${amount} damage`;
            showMightBanner(text, 1800);
        } catch (err) {
            console.warn("[damageFoe] Could not show selection banner.", err);
        }

        return;
    }

    if (flag === "lastDamageCauser") {
        const info = s.lastDamageCauser;
        if (!info) {
            console.warn("[damageFoe] No lastDamageCauser recorded.");
            return;
        }

        const instKey = info.instanceId ?? null;
        const entry = Array.isArray(s.cities)
            ? s.cities.find(e => e && (getEntryKey(e) === instKey || String(e.id) === String(info.foeId)))
            : null;
        const slotIndex = entry?.slotIndex ?? (Array.isArray(s.cities) ? s.cities.indexOf(entry) : null);

        if (!entry || slotIndex == null) {
            console.warn("[damageFoe] Could not locate lastDamageCauser entry.");
            return;
        }

        const foeIdStr = String(entry.id);
        const foeCard =
            villains.find(v => String(v.id) === foeIdStr) ||
            henchmen.find(h => String(h.id) === foeIdStr);

        if (!foeCard) {
            console.warn("[damageFoe] No card data for lastDamageCauser id:", foeIdStr);
            return;
        }

        const summary = {
            foeType: foeCard.type || "Enemy",
            foeId: foeIdStr,
            instanceId: getEntryKey(entry),
            foeName: foeCard.name || `Enemy ${foeIdStr}`,
            currentHP: entry.currentHP ?? foeCard.hp,
            slotIndex,
            source: "city-upper"
        };

        damageFoe(amount, summary, heroId, s, { flag: "single" });
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

        // Visually mark foes that have captured bystanders
        highlightBystanderTargetSlots(s);

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

    // Track pending damage target for pre-damage conditions
    if (slotIndex != null && slotIndex >= 0) {
        s._pendingDamageTarget = {
            slotIndex,
            foeId: foeIdStr,
            source: "city-foe"
        };
    } else {
        s._pendingDamageTarget = null;
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
        const info = {
            foeId: foeIdStr,
            instanceId: entryKey,
            slotIndex,
            heroId: heroId ?? null,
            foeDamageSnapshot: getEffectiveFoeDamage(entry)
        };
        s.lastDamagedFoe = info;
        if (heroId != null) {
            if (!s.heroData) s.heroData = {};
            if (!s.heroData[heroId]) s.heroData[heroId] = {};
            s.heroData[heroId].lastDamagedFoe = info;
        }
        s._lastHeroDamageSnapshot = {
            heroId: heroId ?? null,
            amount: info.foeDamageSnapshot ?? 0
        };
    }

    // Apply passive city-targeted double damage (e.g., Batman)
    if (heroId != null) {
        const heroObj = heroes.find(h => String(h.id) === String(heroId));
        const effs = Array.isArray(heroObj?.abilitiesEffects) ? heroObj.abilitiesEffects : [];
        effs.forEach(eff => {
            if (!eff || (eff.type || "").toLowerCase() !== "passive") return;
            const effStr = Array.isArray(eff.effect) ? eff.effect.join(",") : (eff.effect || "");
            if (!/^doubleDamage/i.test(String(effStr || ""))) return;
            const cond = eff.condition;
            if (!cond) return;
            const ok = evaluateCondition(String(cond), heroId, s);
            console.log(`[damageFoe][doubleDamage check] hero=${heroObj?.name || heroId}, cond=${cond}, result=${ok}`);
            if (ok) {
                effectiveAmount *= 2;
                console.log(`[damageFoe] Applying double damage: ${amount} -> ${effectiveAmount} (slot ${slotIndex})`);
            }
        });
    }

    const newHP = Math.max(0, currentHP - effectiveAmount);
    const heroName = heroId != null
        ? (heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`)
        : "Hero";
    const appliedDamage = Math.max(0, Math.min(effectiveAmount, currentHP));

    // Sync per-instance representations (DO NOT mutate foeCard.currentHP)
    entry.maxHP = baseHP;
    entry.currentHP = newHP;
    s.villainHP[entryKey] = newHP;

    console.log(`[damageFoe] ${foeCard.name} took ${effectiveAmount} damage (${currentHP} -> ${newHP}).`);
    appendGameLogEntry(`${heroName} dealt ${appliedDamage} damage to ${foeCard.name}.`, s);

    // Track last damage dealt by the acting hero (post-modifier amount)
    if (heroId && s.heroData?.[heroId]) {
        s.heroData[heroId].lastDamageAmount = Number(effectiveAmount) || 0;
    }

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
                // Preserve per-entry runtime damage (e.g., curses)
                const baseDmg = Number(foeCard.damage ?? foeCard.dmg ?? foeCard.currentDamage ?? 0) || 0;
                const effectiveDamage =
                    (typeof entry.currentDamage === "number")
                        ? entry.currentDamage
                        : (typeof entry.damagePenalty === "number"
                            ? Math.max(0, baseDmg - Number(entry.damagePenalty || 0))
                            : baseDmg);
                const effectiveCard = {
                    ...foeCard,
                    damage: effectiveDamage,
                    currentDamage: effectiveDamage
                };

                wrapper.appendChild(renderCard(foeIdStr, wrapper, { cardDataOverride: effectiveCard }));
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
        s._pendingDamageTarget = null;
        saveGameState(s);
        return;
    }

    // ===================================================================
    // FOE KO'D
    // ===================================================================
    console.log(`[damageFoe] ${foeCard.name} has been KO'd.`);
    s._pendingDamageTarget = null;
    if (heroId != null) {
        const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
        appendGameLogEntry(`${heroName} KO'd ${foeCard.name}.`, s);
    }
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
            const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
            const names = captured.map(b => b?.name || "Bystander").join(", ");
            const msg = captured.length === 1
                ? `${names} was rescued by ${heroName}.`
                : `Bystanders: ${names} were rescued by ${heroName}.`;
            appendGameLogEntry(msg, s);
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
            const foeName = foeCard?.name || "Enemy";
            const names = captured.map(b => b?.name || "Bystander").join(", ");
            const msg = captured.length === 1
                ? `${names} was KO'd by ${foeName}.`
                : `Bystanders: ${names} were KO'd by ${foeName}.`;
            appendGameLogEntry(msg, s);
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

export function getTravelUsed(heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId) return 0;
    const hState = s.heroData?.[heroId];
    if (!hState) return 0;
    const used = Number(hState.travelUsedThisTurn || 0);
    try {
        console.log(`[getTravelUsed] Hero ${heroId} travel used this turn: ${used}`);
    } catch (e) {}
    return used;
}

export function getLastDamageAmount(heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId) return 0;
    const hState = s.heroData?.[heroId];
    if (!hState) return 0;
    return Number(hState.lastDamageAmount || 0);
}

export function getHeroDamage(heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId) return 0;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const baseHP = Number(heroObj?.hp || heroObj?.baseHP || 0);
    if (!baseHP || baseHP <= 0) return 0;

    const hState = s.heroData?.[heroId];
    const currentHP = typeof hState?.hp === "number" ? hState.hp : baseHP;
    const lost = Math.max(0, baseHP - currentHP);

    try {
        console.log(`[getHeroDamage] Hero ${heroId} HP lost: ${lost} (base ${baseHP}, current ${currentHP}).`);
    } catch (e) {}

    return lost;
}

function travelHeroToDestination(destRaw, heroId = null, state = gameState) {
    const s = state || gameState;
    const heroIds = s.heroes || [];
    const resolvedHeroId = heroId ?? heroIds[s.heroTurnIndex ?? 0];
    if (resolvedHeroId == null) {
        console.warn("[travelTo] No heroId available for travel.");
        return;
    }

    const heroState = s.heroData?.[resolvedHeroId];
    const heroCard = heroes.find(h => String(h.id) === String(resolvedHeroId));
    if (!heroState || !heroCard) {
        console.warn("[travelTo] Missing hero state or card for", resolvedHeroId);
        return;
    }
    const heroName = heroCard.name || `Hero ${resolvedHeroId}`;

    const clearPendingTravelLog = () => {
        const pending = s.pendingTravelLog;
        if (pending && String(pending.heroId) === String(resolvedHeroId)) {
            removeGameLogEntryById(pending.id, s);
            s.pendingTravelLog = null;
        }
    };

    const destStr = String(destRaw).toLowerCase();
    const toOverlord = destStr === "overlord";
    let destIndex = null;

    if (!toOverlord) {
        if (destStr === "lastshovedvillaindestination") {
            const upper = s.lastShovedVillainDestination;
            if (typeof upper === "number") {
                const lowerIdx = upper + 1; // lower row directly beneath
                if (Number.isInteger(lowerIdx) && lowerIdx >= 1 && lowerIdx <= 11 && lowerIdx % 2 === 1) {
                    destIndex = lowerIdx;
                } else {
                    console.warn("[travelTo] lastShovedVillainDestination did not map to a valid lower city:", upper);
                    clearPendingTravelLog();
                    return;
                }
            } else {
                console.warn("[travelTo] No lastShovedVillainDestination recorded.");
                clearPendingTravelLog();
                return;
            }
        } else {
            const num = Number(destRaw);
            if (!Number.isInteger(num) || num < 1 || num > 11 || num % 2 === 0) {
                console.warn("[travelTo] Invalid city index:", destRaw);
                clearPendingTravelLog();
                return;
            }
            destIndex = num;
        }
    }

    const citySlots = (typeof document !== "undefined") ? document.querySelectorAll(".city-slot") : [];

    const prevIdx = heroState.cityIndex;

    // Avoid no-op travel requests that would leave the hero in place.
    if (!toOverlord && typeof prevIdx === "number" && prevIdx === destIndex) {
        console.log("[travelTo] Hero already at destination; skipping travel.");
        clearPendingTravelLog();
        return;
    }

    // If already facing the Overlord, skip redundant travel.
    if (toOverlord && heroState.isFacingOverlord) {
        console.log("[travelTo] Hero already facing Overlord; skipping travel.");
        clearPendingTravelLog();
        return;
    }

    // Clear previous city DOM if any
    if (typeof prevIdx === "number" && citySlots[prevIdx]) {
        const prevArea = citySlots[prevIdx].querySelector(".city-card-area");
        if (prevArea) prevArea.innerHTML = "";
    }

    if (toOverlord) {
        heroState.cityIndex = null;
        heroState.isFacingOverlord = true;
        clearPendingTravelLog();
    const ovInfo = getCurrentOverlordInfo(s);
    const ovName =
        ovInfo?.card?.name ||
        ovInfo?.name ||
        s.currentOverlord?.name ||
        s.currentOverlordCard?.name ||
        overlords.find(o => String(o.id) === String(s.overlordId))?.name ||
        "the Overlord";
    appendGameLogEntry(`${heroName} traveled to face the Overlord, ${ovName}.`, s);
        showRetreatButtonForCurrentHero(s);
        try {
            const btn = document.getElementById("face-overlord-button");
            if (btn) {
                btn.style.display = "none";
                btn.disabled = true;
            }
        } catch (e) {}
        renderHeroHandBar(s);
        saveGameState(s);
        return;
    }

    heroState.cityIndex = destIndex;
    heroState.isFacingOverlord = false;
    clearPendingTravelLog();
    const cityName = CITY_NAME_BY_LOWER_INDEX[destIndex] || `City ${destIndex}`;
    const foeSlotIdx = destIndex - 1;
    const foeEntry = Array.isArray(s.cities) ? s.cities[foeSlotIdx] : null;
    const foeName = foeEntry
        ? (henchmen.find(h => String(h.id) === String(foeEntry.id))?.name
            || villains.find(v => String(v.id) === String(foeEntry.id))?.name
            || `Enemy ${foeEntry.id}`)
        : "no foe";
    appendGameLogEntry(`${heroName} traveled to ${cityName} to engage ${foeName}.`, s);

    const slot = citySlots[destIndex];
    const area = slot?.querySelector(".city-card-area");
    if (area) {
        area.innerHTML = "";
        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";
        const rendered = renderCard(resolvedHeroId, wrapper);
        wrapper.appendChild(rendered);
        area.appendChild(wrapper);
    }

    showRetreatButtonForCurrentHero(s);
    renderHeroHandBar(s);
    saveGameState(s);
}

function retreatHeroToHQSafe(heroId = null, state = gameState) {
    const s = state || gameState;
    const heroIds = s.heroes || [];
    const resolvedHeroId = heroId ?? heroIds[s.heroTurnIndex ?? 0];
    if (resolvedHeroId == null) {
        console.warn("[retreatHeroToHQ] No heroId available.");
        return;
    }

    const heroState = s.heroData?.[resolvedHeroId];
    if (!heroState) return;

    const prevIdx = heroState.cityIndex;
    heroState.cityIndex = null;
    heroState.isFacingOverlord = false;
    try { refreshOverlordFacingGlow(s); } catch (e) {}

    if (typeof prevIdx === "number" && typeof document !== "undefined") {
        const citySlots = document.querySelectorAll(".city-slot");
        const slot = citySlots[prevIdx];
        const area = slot?.querySelector(".city-card-area");
        if (area) area.innerHTML = "";
    }

    showRetreatButtonForCurrentHero(s);
    renderHeroHandBar(s);
    saveGameState(s);
}

function shoveVillain(targetRaw, count, state = gameState, heroId = null) {
    const s = state || gameState;
    if (!Array.isArray(s.cities)) {
        console.warn("[shoveVillain] No cities array.");
        return;
    }

    // Clear previous shove destination; it will only be set when a move succeeds.
    s.lastShovedVillainDestination = null;

    const dir = count > 0 ? 2 : -2;
    const steps = Math.abs(count);
    if (steps === 0 || dir === 0) return;

    const heroIds = s.heroes || [];

    const disengageHeroBelow = (slotIndex) => {
        const lowerIdx = slotIndex + 1;
        const heroIdBelow = heroIds.find(hid => {
            const hState = s.heroData?.[hid];
            return hState && hState.cityIndex === lowerIdx;
        });
        if (heroIdBelow == null) return;
        const hState = s.heroData?.[heroIdBelow];
        if (hState) {
            hState.cityIndex = null;
            hState.isFacingOverlord = false;
        }
        if (typeof document !== "undefined") {
            const citySlots = document.querySelectorAll(".city-slot");
            const slot = citySlots[lowerIdx];
            const area = slot?.querySelector(".city-card-area");
            if (area) area.innerHTML = "";
        }
    };

    const moveEntry = (entry, fromIdx, toIdx) => {
        const citySlots = (typeof document !== "undefined") ? document.querySelectorAll(".city-slot") : [];

        if (typeof fromIdx === "number" && citySlots[fromIdx]) {
            const prevArea = citySlots[fromIdx].querySelector(".city-card-area");
            if (prevArea) prevArea.innerHTML = "";
        }

        if (toIdx != null && typeof toIdx === "number") {
            s.cities[fromIdx] = null;
            s.cities[toIdx] = entry;
            entry.slotIndex = toIdx;

            const slot = citySlots[toIdx];
            const area = slot?.querySelector(".city-card-area");
            if (area) {
                area.innerHTML = "";
                const wrap = document.createElement("div");
                wrap.className = "card-wrapper";
                const rendered = renderCard(entry.id, wrap);
                wrap.appendChild(rendered);
                area.appendChild(wrap);
            }
            s.lastShovedVillainDestination = toIdx;
        } else {
            s.cities[fromIdx] = null;
        }
    };

    const performShove = (entry, startIdx) => {
        if (!entry || typeof startIdx !== "number") return false;

        let current = startIdx;
        let remaining = steps;
        let finalSlot = startIdx;
        let moved = false;

        while (remaining > 0) {
            const next = current + dir;
            if (next < 0) {
                // Off the board to the left -> escape
                try { handleVillainEscape(entry, s); } catch (e) { console.warn("[shoveVillain] escape failed", e); }
                moveEntry(entry, current, null);
                s.lastShovedVillainDestination = null;
                return true;
            }
            if (next > 10) {
                // Clamp at the far right; cannot go past 10
                break;
            }
            const blocker = s.cities[next];
            if (blocker && blocker.id != null) {
                break;
            }

            current = next;
            finalSlot = current;
            moved = true;
            remaining = Math.max(0, remaining - Math.abs(dir));
            // Stop if we've reached the far right boundary
            if (current === 10) break;
        }

        // No available movement; leave state untouched.
        if (!moved) {
            return false;
        }

        // Disengage any hero below the original slot
        disengageHeroBelow(startIdx);
        moveEntry(entry, startIdx, current);
        s.lastShovedVillainDestination = finalSlot;
        return true;
    };

    const addTarget = (list, entry, slotIndex) => {
        if (!entry || entry.id == null || typeof slotIndex !== "number") return;
        list.push({ entry, slotIndex });
    };

    const targets = [];
    const targetStr = typeof targetRaw === "string" ? targetRaw.toLowerCase() : null;

    if (targetStr === "all") {
        s.cities.forEach((entry, idx) => addTarget(targets, entry, idx));
    } else if (targetStr === "allunengaged") {
        s.cities.forEach((entry, idx) => {
            if (!entry) return;
            const heroBelow = heroIds.some(hid => s.heroData?.[hid]?.cityIndex === idx + 1);
            if (!heroBelow) addTarget(targets, entry, idx);
        });
    } else if (targetStr === "lastdamagedfoe") {
        const info = s.lastDamagedFoe;
        const instId = info?.instanceId;
        if (!instId) {
            console.warn("[shoveVillain] No lastDamagedFoe recorded.");
        } else {
            const entry = s.cities.find(e => e && getEntryKey(e) === instId);
            const slotIndex = entry?.slotIndex ?? s.cities.indexOf(entry);
            addTarget(targets, entry, slotIndex);
        }
    } else if (targetStr === "any") {
        if (typeof window === "undefined") {
            console.warn("[shoveVillain] 'any' selection requires browser UI.");
            return;
        }
        window.__shoveVillainSelectMode = { count, heroId, state: s };
        try { showMightBanner("Choose a foe to shove", 1800); } catch (e) {}
        return;
    } else if (targetRaw && typeof targetRaw === "object" && targetRaw.entry) {
        addTarget(targets, targetRaw.entry, targetRaw.slotIndex);
    } else {
        console.warn("[shoveVillain] Unknown target:", targetRaw);
    }

    let anyMoved = false;
    targets.forEach(t => {
        if (performShove(t.entry, t.slotIndex)) anyMoved = true;
    });

    if (!anyMoved) {
        console.log("[shoveVillain] No foes could be moved; effect skipped.");
        s.lastShovedVillainDestination = null;
    }
    saveGameState(s);
}

if (typeof window !== "undefined") {
    window.__shoveVillainEffect = shoveVillain;
}

function adjustHeroTravelDelta(delta, opts = {}, heroId = null, state = gameState) {
    const s = state || gameState;
    const heroIds = s.heroes || [];
    const resolvedHeroId = heroId ?? heroIds[s.heroTurnIndex ?? 0];
    if (resolvedHeroId == null) {
        console.warn("[travelPlus] No heroId available.");
        return;
    }

    const heroState = s.heroData?.[resolvedHeroId];
    const heroCard = heroes.find(h => String(h.id) === String(resolvedHeroId));
    if (!heroState || !heroCard) {
        console.warn("[travelPlus] Missing hero state or card for", resolvedHeroId);
        return;
    }

    const permanent = String(opts.flag || "").toLowerCase() === "permanent";

    const printedBase = Number(heroCard.travel ?? 0) || 0;
    const storedBase = Number(heroState.travel);

    // Base travel (max) comes from heroState.travel if set; otherwise heroCard.travel
    const base = Number.isFinite(storedBase)
        ? storedBase
        : printedBase;

    // Current travel is the mutable per-turn budget
    const storedCurrent = Number(heroState.currentTravel);
    const current = Number.isFinite(storedCurrent)
        ? storedCurrent
        : base;

    let newCurrent = current + delta;
    if (newCurrent < 0) newCurrent = 0;

    heroState.currentTravel = newCurrent;

    if (permanent) {
        // When permanently bumping, use at least the printed base as the starting point
        const baseline = (Number.isFinite(storedBase) && storedBase >= printedBase)
            ? storedBase
            : printedBase;

        let newBase = baseline + delta;
        if (newBase < 0) newBase = 0;
        heroState.travel = newBase;
    }

    console.log(
        `[travelPlus] Hero ${resolvedHeroId} travel adjusted by ${delta} ` +
        `(current: ${current} -> ${heroState.currentTravel}` +
        (permanent ? `, base: ${base} -> ${heroState.travel}` : "") + ")."
    );

    saveGameState(s);
    renderHeroHandBar(s);

    // Refresh travel UI (includes engage Overlord button visibility)
    try {
        if (typeof window !== "undefined" && typeof window.recalculateHeroTravel === "function") {
            window.recalculateHeroTravel(s);
        }
    } catch (e) {
        console.warn("[travelPlus] recalculateHeroTravel failed", e);
    }
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
        try {
            appendGameLogEntry(`Enemies and Allies Draw: ${cardData.name}`, state);
        } catch (err) {
            console.warn("[enemyDraw] Failed to append game log entry for draw", err);
        }

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

let extraTurnModalRefs = null;

function ensureExtraTurnModal() {
    if (extraTurnModalRefs) return extraTurnModalRefs;
    if (typeof document === "undefined") return null;

    const overlay = document.createElement("div");
    overlay.id = "extra-turn-overlay";
    overlay.style.cssText = `
        display:none;
        position:fixed;
        top:0; left:0;
        width:100vw; height:100vh;
        background:rgba(0,0,0,0.6);
        z-index:999999;
        justify-content:center;
        align-items:center;
        padding:16px;
        box-sizing:border-box;
    `;

    const box = document.createElement("div");
    box.id = "extra-turn-box";
    box.style.cssText = `
        width:100%;
        max-width:380px;
        background:white;
        border-radius:12px;
        padding:20px;
        font-family:'Racing Sans One', sans-serif;
        text-align:center;
        box-shadow:0 4px 12px rgba(0,0,0,0.4);
        display:flex;
        flex-direction:column;
        gap:16px;
    `;

    const headerEl = document.createElement("div");
    headerEl.id = "extra-turn-header";
    headerEl.style.cssText = `
        font-size:26px;
        line-height:1.2;
    `;
    headerEl.textContent = "Choose a teammate to take an extra turn after yours.";

    const list = document.createElement("div");
    list.id = "extra-turn-list";
    list.style.cssText = `
        display:flex;
        flex-direction:column;
        gap:10px;
        width:100%;
        max-height:60vh;
        overflow-y:auto;
    `;

    const confirmRow = document.createElement("div");
    confirmRow.style.cssText = `
        display:flex;
        margin-top:8px;
    `;

    const confirmBtn = document.createElement("button");
    confirmBtn.id = "extra-turn-confirm";
    confirmBtn.textContent = "Confirm";
    confirmBtn.style.cssText = `
        flex:1;
        padding:14px 18px;
        font-size:20px;
        font-weight:bold;
        border:none;
        border-radius:10px;
        background:#26a626;
        border:4px solid black;
        color:black;
        cursor:pointer;
    `;

    confirmRow.appendChild(confirmBtn);
    box.appendChild(headerEl);
    box.appendChild(list);
    box.appendChild(confirmRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    extraTurnModalRefs = { overlay, headerEl, list, confirmBtn };
    return extraTurnModalRefs;
}

function showTeammateExtraTurnModal({ header, options, selectedId: selectedIdInit = null, sourceHeroId = null, resumeIndex = null }) {
    return new Promise(resolve => {
        const refs = ensureExtraTurnModal();
        if (!refs) {
            console.warn("[ExtraTurnModal] Unable to render modal.");
            resolve(null);
            return;
        }

        const { overlay, headerEl, list, confirmBtn } = refs;
        let selectedId = selectedIdInit ?? (options?.[0]?.id ?? null);

        headerEl.textContent = header || "Choose a teammate to take an extra turn after yours.";
        list.innerHTML = "";

        options.forEach((opt, idx) => {
            const isSelected = selectedId != null
                ? String(opt.id) === String(selectedId)
                : idx === 0;
            const btn = document.createElement("button");
            btn.textContent = opt.name || opt.label || `Option ${idx + 1}`;
            btn.style.cssText = `
                width:100%;
                padding:12px 14px;
                font-size:20px;
                font-weight:bold;
                border:none;
                border-radius:10px;
                border:4px solid black;
                background:${isSelected ? "#ffd800" : "#ddd"};
                color:black;
                cursor:pointer;
                text-align:center;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            `;

            btn.onclick = () => {
                selectedId = opt.id;
                [...list.children].forEach(child => child.style.background = "#ddd");
                btn.style.background = "#ffd800";

                try {
                    if (gameState && gameState.pendingExtraTurnModal) {
                        gameState.pendingExtraTurnModal.selectedId = selectedId;
                        saveGameState(gameState);
                    }
                } catch (err) {
                    console.warn("[ExtraTurnModal] Failed to persist selection.", err);
                }
            };

            list.appendChild(btn);
        });

        overlay.style.display = "flex";

        confirmBtn.onclick = () => {
            overlay.style.display = "none";
            confirmBtn.onclick = null;
            try {
                if (gameState) {
                    const chosen = options.find(o => String(o.id) === String(selectedId)) || null;
                    // If we have source/resume info, set pendingExtraTurn here as well (helps on refresh restore)
                    if (chosen && sourceHeroId != null) {
                        gameState.pendingExtraTurn = {
                            sourceHeroId,
                            targetHeroId: chosen.id,
                            resumeIndex: Number.isInteger(resumeIndex) ? resumeIndex : null,
                            consumed: false
                        };
                    }
                    gameState.pendingExtraTurnModal = null;
                    saveGameState(gameState);
                }
            } catch (err) {
                console.warn("[ExtraTurnModal] Failed to clear modal state on confirm.", err);
            }
            const chosen = options.find(o => String(o.id) === String(selectedId)) || null;
            if (chosen) {
                console.log(`[ExtraTurnModal] Selected teammate: ${chosen.name || chosen.id}`);
            } else {
                console.log("[ExtraTurnModal] No teammate selected.");
            }
            resolve(chosen);
        };
    });
}

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

