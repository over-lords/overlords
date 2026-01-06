let isSinglePlayer = (window.GAME_MODE === "single");
let isMultiplayer = (window.GAME_MODE === "multi");
export function refreshGameModeFlags(mode = window.GAME_MODE) {
    window.GAME_MODE = mode || window.GAME_MODE || "single";
    isSinglePlayer = (window.GAME_MODE === "single");
    isMultiplayer = (window.GAME_MODE === "multi");
}

import { heroes } from '../data/faceCards.js';
import { heroCards } from '../data/heroCards.js';
import { overlords } from '../data/overlords.js';
import { scenarios } from "../data/scenarios.js";
import { tactics } from '../data/tactics.js';
import { henchmen } from "../data/henchmen.js";
import { villains } from "../data/villains.js";
import { bystanders } from "../data/bystanders.js";

import { setCurrentOverlord, buildOverlordPanel, showMightBanner, renderHeroHandBar, placeCardIntoCitySlot, buildVillainPanel, buildMainCardPanel, appendGameLogEntry, removeGameLogEntryById, clearHeroKOMarkers } from "./pageSetup.js";

import { getCurrentOverlordInfo, takeNextHenchVillainsFromDeck, showRetreatButtonForCurrentHero,
         enterVillainFromEffect, checkGameEndConditions, villainDraw, updateHeroHPDisplays, updateBoardHeroHP, checkCoastalCities, getCityNameFromIndex, flagPendingHeroDamage, tryBlockPendingHeroDamage, flashScreenRed, handleHeroKnockout, destroyCitiesByCount, restoreCitiesByCount, resumeHeroTurnAfterVillainDraw } from "./turnOrder.js";

import { findCardInAllSources, renderCard } from './cardRenderer.js';
import { playSoundEffect } from './soundHandler.js';
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

const HERO_TEAM_SET = (() => {
    const set = new Set();
    heroes.forEach(h => {
        getHeroTeamsForCard(h).forEach(t => set.add(t));
    });
    return set;
})();

// Lightweight fallback renderer for deck select; ensures add() works even immediately after refresh
function ensureDeckSelectRenderer() {
    if (typeof window === "undefined") return;
    if (typeof window.renderDeckSelectSlide === "function") return;

    window.renderDeckSelectSlide = function fallbackRenderDeckSelectSlide(st = gameState) {
        const addPanel = document.getElementById("add-slide-panel");
        const addCardsRow = document.getElementById("add-slide-cards");
        if (!addPanel || !addCardsRow) return;

        const ctx = window.__deckSelectContext || st.deckSelectContext;
        if (!ctx || ctx.heroId == null) return;

        const heroId = ctx.heroId;
        const heroObj = heroes.find(h => String(h.id) === String(heroId));
        const heroName = heroObj?.name || `Hero ${heroId}`;
        const hState = st.heroData?.[heroId] || st.heroData?.[String(heroId)] || {};
        const deckList = Array.isArray(ctx.deckSnapshot) && ctx.deckSnapshot.length
            ? ctx.deckSnapshot.slice()
            : (Array.isArray(hState.deck) ? hState.deck.slice() : []);

        addPanel.style.display = "flex";
        addPanel.classList.add("open");
        addCardsRow.innerHTML = "";

        // Label at top (match main renderer)
        const sizeLabel = document.createElement("div");
        sizeLabel.textContent = `${heroName}'s Deck: ${deckList.length} cards`;
        sizeLabel.style.marginTop = "10px";
        sizeLabel.style.marginRight = "10px";
        sizeLabel.style.marginBottom = "0";
        sizeLabel.style.marginLeft = "10px";
        sizeLabel.style.color = "#fff";
        sizeLabel.style.fontSize = "24px";
        sizeLabel.style.fontWeight = "bold";
        sizeLabel.style.flex = "0 0 auto";
        addCardsRow.style.display = "flex";
        addCardsRow.style.flexDirection = "column";
        addCardsRow.style.alignItems = "stretch";
        addCardsRow.style.justifyContent = "flex-start";
        addCardsRow.style.height = "100%";
        addCardsRow.appendChild(sizeLabel);

        const bar = document.createElement("div");
        bar.style.display = "flex";
        bar.style.flexWrap = "nowrap";
        bar.style.overflowX = "auto";
        bar.style.overflowY = "hidden";
        bar.style.gap = "0";
        bar.style.marginTop = "-230px";
        bar.style.padding = "8px";
        bar.style.alignItems = "center";
        bar.style.flex = "1 1 auto";

        const maxSel = Math.max(1, Number(ctx.count) || 1);
        let currentSel = Array.isArray(ctx.selectedCardIds) ? ctx.selectedCardIds : [];
        const selectedSet = new Set(currentSel.map(String));

        const applyChooseState = (btn, hasSel) => {
            btn.style.display = "inline-block";
            btn.disabled = !hasSel;
            btn.style.backgroundColor = hasSel ? "gold" : "#444";
            btn.style.color = hasSel ? "#000" : "#ddd";
        };

        if (!deckList.length) {
            const emptyMsg = document.createElement("div");
            emptyMsg.textContent = `${heroName} has no cards in deck.`;
            emptyMsg.style.color = "#fff";
            emptyMsg.style.fontSize = "22px";
            emptyMsg.style.padding = "16px";
            bar.appendChild(emptyMsg);
            addCardsRow.appendChild(bar);
            return;
        }

        deckList.forEach(id => {
            const idStr = String(id);
            const wrap = document.createElement("div");
            wrap.style.height = "110px";
            wrap.style.marginLeft = "-30px";
            wrap.style.marginRight = "-70px";
            wrap.style.position = "relative";

            const scaleWrapper = document.createElement("div");
            scaleWrapper.style.transform = "scale(0.5)";
            scaleWrapper.style.transformOrigin = "center center";
            scaleWrapper.style.filter = "drop-shadow(0px 0px 8px rgba(0,0,0,0.8))";

            const rendered = renderCard(idStr);
            scaleWrapper.appendChild(rendered);
            wrap.appendChild(scaleWrapper);

            const applySel = (on) => {
                scaleWrapper.style.boxShadow = on ? "0 0 0 6px gold" : "";
                scaleWrapper.style.border = on ? "4px solid #000" : "";
            };
            applySel(selectedSet.has(idStr));

            wrap.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    const data = findCardInAllSources(idStr);
                    if (data) buildMainCardPanel(data);
                } catch (_) {}

                let sel = Array.isArray(window.__deckSelectContext?.selectedCardIds)
                    ? [...window.__deckSelectContext.selectedCardIds]
                    : [...currentSel];

                if (maxSel === 1) {
                    const already = sel.length === 1 && String(sel[0]) === idStr;
                    sel = already ? [] : [idStr];
                    // Clear siblings
                    bar.querySelectorAll("div").forEach(div => {
                        if (div !== wrap) {
                            div.style.boxShadow = "";
                            div.style.border = "";
                        }
                    });
                } else {
                    const idxSel = sel.findIndex(cid => String(cid) === idStr);
                    if (idxSel >= 0) sel.splice(idxSel, 1);
                    else if (sel.length < maxSel) sel.push(idStr);
                }

                currentSel = sel;
                window.__deckSelectContext = { ...ctx, selectedCardIds: sel };
                st.deckSelectContext = { ...window.__deckSelectContext };
                saveGameState(st);
                applySel(sel.some(cid => String(cid) === idStr));
                applyChooseState(chooseBtn, sel.length > 0);
            });

            bar.appendChild(wrap);
        });

        // Footer + choose button pinned to bottom
        const footer = document.createElement("div");
        footer.style.display = "flex";
        footer.style.justifyContent = "flex-end";
        footer.style.alignItems = "center";
        footer.style.margin = "8px 10px 10px 10px";
        footer.style.marginTop = "auto";
        footer.style.marginTop = "auto";

        let chooseBtn = document.getElementById("add-choose-button");
        if (!chooseBtn) {
            chooseBtn = document.createElement("button");
            chooseBtn.id = "add-choose-button";
            chooseBtn.textContent = "Choose";
            chooseBtn.style.padding = "10px 16px";
            chooseBtn.style.fontSize = "16px";
        }
        applyChooseState(chooseBtn, currentSel.length > 0);
        footer.appendChild(chooseBtn);

        chooseBtn.onclick = () => {
            const ctxNow = window.__deckSelectContext || ctx;
            const selIds = Array.isArray(ctxNow.selectedCardIds) ? ctxNow.selectedCardIds : [];
            if (!selIds.length) return;
            const picks = selIds.slice(0, Math.max(1, Number(ctxNow.count) || 1));
            const liveState = st.heroData?.[heroId];
            if (!liveState) return;
            if (!Array.isArray(liveState.hand)) liveState.hand = [];
            if (!Array.isArray(liveState.deck)) liveState.deck = [];
            picks.forEach(cardId => {
                const pos = liveState.deck.findIndex(x => String(x) === String(cardId));
                if (pos >= 0) liveState.deck.splice(pos, 1);
                liveState.hand.push(cardId);
            });
            window.__deckSelectContext = null;
            st.deckSelectContext = null;
            saveGameState(st);
            try { renderHeroHandBar(st); } catch (_) {}
            addPanel.classList.remove("open");
        };

        addCardsRow.appendChild(bar);
        addCardsRow.appendChild(footer);
    };
}


function createDeferred() {
    let resolveFn;
    let rejectFn;
    const p = new Promise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
    });
    return {
        promise: p,
        resolve: (v) => resolveFn && resolveFn(v),
        reject: (e) => rejectFn && rejectFn(e),
        used: false,
        resolved: false
    };
}

function getActiveTacticsFromState(state = gameState) {
    const s = state || gameState;
    const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
    const tacticIdSet = new Set();
    const sources = [
        s.tactics,
        s.activeTactics,
        s.tacticsInPlay,
        s.selectedTactics,
        s.tacticsInDeck,
        s.tacticStack
    ];
    sources.forEach(list => {
        if (!Array.isArray(list)) return;
        list.forEach(entry => {
            let id = entry;
            if (entry && typeof entry === "object") {
                if (entry.id != null) id = entry.id;
                else if (entry.tacticId != null) id = entry.tacticId;
                else if (entry.cardId != null) id = entry.cardId;
            }
            if (id == null) return;
            tacticIdSet.add(String(id));
        });
    });
    return Array.from(tacticIdSet)
        .map(id => tacticMap.get(id))
        .filter(Boolean);
}

function collectOverlordReductionSteps(state = gameState) {
    const s = state || gameState;
    const steps = new Set();
    const cards = [];

    const ovInfo = getCurrentOverlordInfo(s);
    if (ovInfo?.card) cards.push(ovInfo.card);

    if (Array.isArray(s.scenarioStack) && s.scenarioStack.length > 0) {
        const scenarioId = String(s.scenarioStack[s.scenarioStack.length - 1]);
        const scenarioCard = scenarios.find(sc => String(sc.id) === scenarioId);
        if (scenarioCard) cards.push(scenarioCard);
    }

    const activeTactics = getActiveTacticsFromState(s);
    cards.push(...activeTactics);

    const scanConds = (condVal) => {
        const rawList = Array.isArray(condVal) ? condVal : [condVal];
        rawList.forEach(c => {
            if (!c) return;
            const match = String(c).match(/overlordreducedbyxfrommax\s*\(\s*([^)]+)\s*\)/i);
            if (!match) return;
            const stepVal = Number(match[1]);
            if (!Number.isNaN(stepVal) && stepVal > 0) {
                steps.add(stepVal);
            }
        });
    };

    cards.forEach(card => {
        if (!card) return;
        const effects = [
            ...(Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : []),
            ...(Array.isArray(card.mightEffects) ? card.mightEffects : []),
            ...(Array.isArray(card.bonusEffects) ? card.bonusEffects : []),
            ...(Array.isArray(card.evilWinsEffects) ? card.evilWinsEffects : [])
        ];
        effects.forEach(eff => scanConds(eff?.condition));
    });

    return Array.from(steps);
}

function getOverlordReductionThresholdsCrossed(prevHP, newHP, baseHP, step) {
    const list = [];
    const base = Number(baseHP) || 0;
    const inc = Number(step) || 0;
    if (inc <= 0 || base <= 0) return list;
    if (prevHP <= newHP) return list; // only when HP decreases

    for (let t = base - inc; t >= 0; t -= inc) {
        if (prevHP > t && newHP <= t) {
            list.push(t);
        }
    }

    return list;
}

export function playDamageSfx(amount) {
    const dmg = Math.max(0, Number(amount) || 0);
    if (dmg <= 0) return;
    const clip = dmg >= 3 ? "highDamage" : "lowDamage";
    try { playSoundEffect(clip); } catch (e) { /* ignore */ }
}

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

function isHeroInCoastalCity(heroId, state = gameState) {
    const s = state || gameState;
    if (heroId == null) return false;
    const heroState = s.heroData?.[heroId];
    if (!heroState) return false;
    const lowerIdx = Number(heroState.cityIndex);
    if (!Number.isInteger(lowerIdx)) return false;
    const { left, right } = checkCoastalCities(s);
    const upperIdx = lowerIdx - 1;
    return (upperIdx === left) || (upperIdx === right);
}

function isCoastalBonusSuppressed(heroId, state = gameState) {
    const s = state || gameState;
    if (heroId == null) return false;
    const list = Array.isArray(s.coastalBonusSuppression) ? s.coastalBonusSuppression : [];
    if (!list.length) return false;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return false;
    const teams = getHeroTeamsForCard(heroObj);

    return list.some(entry => {
        if (!entry || !entry.team) return false;
        const key = String(entry.team).toLowerCase();
        if (key === "all") return true;
        return teams.includes(key);
    });
}

function isTeamBonusSuppressed(teamName, state = gameState) {
    if (!teamName) return false;
    const s = state || gameState;
    const key = String(teamName).toLowerCase().trim();
    const list = Array.isArray(s.teamBonusSuppression) ? s.teamBonusSuppression : [];
    if (!list.length) return false;

    return list.some(entry => {
        if (!entry || !entry.team) return false;
        const target = String(entry.team).toLowerCase().trim();
        if (target === "all") return true;
        return target === key;
    });
}

function clearCoastalBonusSuppressionForSource(sourceType, sourceId, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.coastalBonusSuppression)) return;
    const before = s.coastalBonusSuppression.length;
    s.coastalBonusSuppression = s.coastalBonusSuppression.filter(entry => {
        if (!entry) return false;
        const typeMatch = !sourceType || entry.sourceType === sourceType;
        const idMatch = sourceId == null || String(entry.sourceId) === String(sourceId);
        return !(typeMatch && idMatch);
    });
    const removed = before - s.coastalBonusSuppression.length;
    if (removed > 0) {
        console.log(`[coastalBonus] Cleared ${removed} suppression entries for ${sourceType || "any-source"} ${sourceId != null ? sourceId : ""}.`);
    }
}

function clearTeamBonusSuppressionForSource(sourceType, sourceId, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.teamBonusSuppression)) return;
    const before = s.teamBonusSuppression.length;
    s.teamBonusSuppression = s.teamBonusSuppression.filter(entry => {
        if (!entry) return false;
        const typeMatch = !sourceType || entry.sourceType === sourceType;
        const idMatch = sourceId == null || String(entry.sourceId) === String(sourceId);
        return !(typeMatch && idMatch);
    });
    const removed = before - s.teamBonusSuppression.length;
    if (removed > 0) {
        console.log(`[teamBonus] Cleared ${removed} suppression entries for ${sourceType || "any-source"} ${sourceId != null ? sourceId : ""}.`);
    }
}

export function pruneTeamBonusSuppressionOnHeroStart(activeHeroId, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.teamBonusSuppression) || activeHeroId == null) return;
    const before = s.teamBonusSuppression.length;
    s.teamBonusSuppression = s.teamBonusSuppression.filter(entry => {
        if (!entry) return false;
        if (entry.expireOnHeroId != null && String(entry.expireOnHeroId) === String(activeHeroId)) {
            return false;
        }
        return true;
    });
    const removed = before - s.teamBonusSuppression.length;
    if (removed > 0) {
        console.log(`[teamBonus] Cleared ${removed} suppression entries at start of hero ${activeHeroId}'s turn.`);
    }
}

function heroOccupiesLowerIndex(lowerIdx, state = gameState) {
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    return heroIds.some(hid => {
        const hState = s.heroData?.[hid];
        if (!hState) return false;
        if (typeof hState.hp === "number" && hState.hp <= 0) return false;
        return Number(hState.cityIndex) === Number(lowerIdx);
    });
}

function healFoeEntry(entry, amount = 0, state = gameState) {
    const s = state || gameState;
    if (!entry || amount <= 0) return 0;

    const key = getEntryKey(entry) || String(entry.id || "");
    const foeCard = findCardInAllSources(entry.id);
    const baseHP = Number(entry.maxHP ?? foeCard?.hp ?? foeCard?.baseHP ?? 0);

    if (!s.villainHP) s.villainHP = {};
    let current = typeof entry.currentHP === "number"
        ? entry.currentHP
        : (key && typeof s.villainHP[key] === "number" ? s.villainHP[key] : baseHP);

    const maxHP = Math.max(Number(entry.maxHP || 0), baseHP);
    const healAmt = Math.max(0, Math.min(amount, maxHP - current));
    const newHP = current + healAmt;

    entry.currentHP = newHP;
    entry.maxHP = maxHP;
    if (key) s.villainHP[key] = newHP;
    if (foeCard) foeCard.currentHP = newHP;

    return healAmt;
}

function koTopCardForHero(heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId) return;
    const hState = s.heroData?.[heroId];
    if (!hState || !Array.isArray(hState.deck)) return;
    if (!Array.isArray(hState.discard)) hState.discard = [];

    if (!hState.deck.length) return;

    const cardId = hState.deck.shift();
    const cardData = findCardInAllSources(cardId);
    const cardName = cardData?.name || `Card ${cardId}`;
    const cardType = cardData?.type || "";
    const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;

    // Move to discard first to mirror existing KO flow
    hState.discard.push(cardId);

    if (String(cardType).toLowerCase() === "main") {
        addPermanentKOTag(hState, cardId);
        appendGameLogEntry(`${cardName} is permanently KO'd for ${heroName}.`, s);
    } else {
        // Remove from discard and add to KO pile
        hState.discard.pop();
        if (!Array.isArray(s.koCards)) s.koCards = [];
        s.koCards.push({
            id: cardId,
            name: cardName,
            type: cardType || "Hero Card",
            source: "corruption",
            heroId
        });
        appendGameLogEntry(`${cardName} was KO'd from ${heroName}'s deck.`, s);
        try {
            if (typeof window !== "undefined" && typeof window.renderKOBar === "function") {
                window.renderKOBar(s);
            }
        } catch (err) {
            console.warn("[corruption] Failed to render KO bar.", err);
        }
    }

    saveGameState(s);
}

function addCorruptionCounters(heroId, amount = 1, state = gameState) {
    const s = state || gameState;
    if (!heroId || !s) return;
    if (!s.heroData || !s.heroData[heroId]) return;
    const hState = s.heroData[heroId];
    const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;

    const current = Number(hState.corruptionCounters || 0);
    const next = current + Math.max(0, Number(amount) || 0);
    hState.corruptionCounters = next;
    appendGameLogEntry(`${heroName} gains ${amount} Corruption counter${amount === 1 ? "" : "s"} (total: ${next}).`, s);

    if (next >= 3) {
        appendGameLogEntry(`${heroName} reached 3 Corruption counters and loses the top card of their deck.`, s);
        hState.corruptionCounters = 0;
        koTopCardForHero(heroId, s);
    }

    saveGameState(s);
}

function clearRetreatBonusForSource(sourceType, sourceId, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.retreatBonusEntries)) return;
    s.retreatBonusEntries = s.retreatBonusEntries.filter(entry => {
        if (!entry) return false;
        const typeMatch = !sourceType || entry.sourceType === sourceType;
        const idMatch = sourceId == null || String(entry.sourceId) === String(sourceId);
        return !(typeMatch && idMatch);
    });
}

function clearRetreatBonusForCity(cityIndex, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.retreatBonusEntries)) return;
    s.retreatBonusEntries = s.retreatBonusEntries.filter(entry => {
        if (!entry) return false;
        return entry.cityIndex == null || Number(entry.cityIndex) !== Number(cityIndex);
    });
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

function foeHasHalfDamageModifierAgainstHero(entry, heroId, state = gameState) {
    const s = state || gameState;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return false;
    const heroTeams = getHeroTeamsForCard(heroObj);
    if (!heroTeams.length) return false;

    const foeCard = findCardInAllSources(entry.id);
    const effects = Array.isArray(foeCard?.abilitiesEffects) ? foeCard.abilitiesEffects : [];

    for (const eff of effects) {
        if (!eff || (eff.type || "").toLowerCase() !== "passive") continue;
        const raw = eff.effect;
        const list = Array.isArray(raw) ? raw : [raw];
        for (const e of list) {
            if (typeof e !== "string") continue;
            const m = e.trim().match(/^halveincomingdamagefrom\(([^)]+)\)$/i);
            if (!m) continue;
            const teamKey = m[1].trim().toLowerCase();
            if (!teamKey) continue;
            if (heroTeams.some(t => t === teamKey)) {
                return true;
            }
        }
    }
    return false;
}

function markFoeDamagedThisTurn(entry, state = gameState) {
    const s = state || gameState;
    if (!entry) return;
    const key = getEntryKey(entry);
    if (!key) return;
    if (!s.foeDamagedThisTurn) s.foeDamagedThisTurn = {};
    s.foeDamagedThisTurn[key] = true;
}

function getActiveTeamCount(teamName, heroId = null, state = gameState) {
    if (!teamName) return 0;
    const teamKey = String(teamName).toLowerCase().trim();
    const s = state || gameState;
    if (isTeamBonusSuppressed(teamKey, s)) {
        console.log(`[getActiveTeamCount] Team bonuses suppressed for ${teamKey}; returning 0.`);
        return 0;
    }
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    let count = 0;
    const excludeSelf = teamKey !== "all";

    heroIds.forEach(id => {
        if (excludeSelf && heroId != null && String(id) === String(heroId)) return; // exclude activating hero unless counting all
        const hObj = heroes.find(h => String(h.id) === String(id));
        if (!hObj) return;
        const hState = s.heroData?.[id];
        const alive = hState ? (typeof hState.hp === "number" ? hState.hp > 0 : true) : true;
        if (!alive) return;
        if (teamKey === "all" || heroMatchesTeam(hObj, teamName)) count += 1;
    });

    const label = teamKey === "all" ? "all heroes" : `Team ${teamName}`;
    console.log(`[getActiveTeamCount] ${label} active count (excluding hero ${heroId ?? "n/a"}): ${count}`);
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

function getBystandersKOdCount(state = gameState) {
    const s = state || gameState;
    const koList = Array.isArray(s.koCards) ? s.koCards : [];
    return koList.filter(entry => entry && String(entry.type || "").toLowerCase() === "bystander").length;
}

export function isProtectionDisabledForHero(heroId, state = gameState) {
    const s = state || gameState;
    const disableList = Array.isArray(s.disableProtectTeams) ? s.disableProtectTeams : [];
    if (!disableList.length || heroId == null) return false;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return false;

    return disableList.some(team => heroMatchesTeam(heroObj, team));
}

function cardDisablesScan(card, state = gameState) {
    if (!card) return false;
    const effects = Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : [];

    for (const eff of effects) {
        if (!eff || (String(eff.type || "").toLowerCase() !== "passive")) continue;

        const cond = String(eff.condition || "none").trim();
        if (cond && cond.toLowerCase() !== "none") {
            // If the condition isn't met, skip this passive.
            if (!evaluateCondition(cond, null, state)) continue;
        }

        const effList = Array.isArray(eff.effect) ? eff.effect : [eff.effect];
        if (effList.some(e => typeof e === "string" && /^disablescan/i.test(e.trim()))) {
            return true;
        }
    }

    return false;
}

function isScanBlocked(state = gameState) {
    const s = state || gameState;
    if (s.scanDisabled) return true;

    // Active Overlord/Scenario
    try {
        const info = getCurrentOverlordInfo(s);
        if (info?.card && cardDisablesScan(info.card, s)) return true;
    } catch (err) {
        console.warn("[isScanBlocked] getCurrentOverlordInfo failed", err);
    }

    // Active Tactics
    const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
    const activeTactics = (s.tactics || [])
        .map(id => tacticMap.get(String(id)))
        .filter(Boolean);
    for (const t of activeTactics) {
        if (cardDisablesScan(t, s)) return true;
    }

    return false;
}

export function maybeTriggerEvilWinsConditions(state = gameState) {
    const s = state || gameState;
    if (s._evilWinsProcessing) {
        console.warn("[maybeTriggerEvilWinsConditions] Re-entrant call detected; skipping to avoid recursion.");
        return;
    }
    s._evilWinsProcessing = true;
    try {
        const totalKOd = getBystandersKOdCount(s);

        if (totalKOd <= 0) return;

        const cardsToCheck = [];

    // Current Overlord (only the active one matters)
    const ovId = Array.isArray(s.overlords) ? s.overlords[0] : null;
    if (ovId != null) {
        const ovCard = findCardInAllSources(ovId);
        if (ovCard) cardsToCheck.push(ovCard);
    }

    // Active tactics
    const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
    const activeTactics = (s.tactics || [])
        .map(id => tacticMap.get(String(id)))
        .filter(Boolean);
    cardsToCheck.push(...activeTactics);

    cardsToCheck.forEach(card => {
        const effects = Array.isArray(card?.evilWinsEffects) ? card.evilWinsEffects : [];
        effects.forEach((eff, idx) => {
            if (!eff || !eff.effect) return;
            const cond = String(eff.condition || "").trim().toLowerCase();
            const match = cond.match(/^bystanderskod\((\d+)\)$/);
            if (!match) return;
            const threshold = Number(match[1]);
            if (!Number.isFinite(threshold) || totalKOd < threshold) return;

            const hasFiniteUses = eff.uses != null && eff.uses !== "" && Number.isFinite(Number(eff.uses));
            const usesMax = hasFiniteUses ? Number(eff.uses) : Number.POSITIVE_INFINITY;

            if (!s.evilWinsAbilityUses) s.evilWinsAbilityUses = {};
            const key = `${card.type || card.cardType || "Card"}:${card.id ?? card.name ?? "unknown"}::${idx}`;
            const remaining = s.evilWinsAbilityUses[key] == null ? usesMax : s.evilWinsAbilityUses[key];
            if (remaining <= 0) return;

            s.evilWinsAbilityUses[key] = hasFiniteUses
                ? Math.max(0, remaining - 1)
                : usesMax;

            const effectsArr = Array.isArray(eff.effect) ? eff.effect : [eff.effect];
            effectsArr.forEach(effectString => {
                try {
                    executeEffectSafely(effectString, card, { state: s });
                } catch (err) {
                    console.warn("[maybeTriggerEvilWinsConditions] Failed to execute evilWins effect", err);
                }
            });
        });
    });
    } finally {
        s._evilWinsProcessing = false;
    }
}

function getOverlordLevel(state = gameState) {
    const s = state || gameState;
    try {
        const info = getCurrentOverlordInfo(s);
        const lvl =
            Number(info?.card?.level) ||
            Number(info?.level) ||
            Number(info?.overlord?.level) ||
            null;
        if (lvl != null && !Number.isNaN(lvl)) return lvl;
    } catch (err) {
        console.warn("[getOverlordLevel] getCurrentOverlordInfo failed", err);
    }

    const ovId = Array.isArray(s.overlords) ? s.overlords[0] : null;
    if (ovId != null) {
        const ovCard = overlords.find(o => String(o.id) === String(ovId));
        const lvl = Number(ovCard?.level);
        if (!Number.isNaN(lvl)) return lvl;
    }

    return 0;
}

function getCurrentCityIndex(state = gameState) {
    const s = state || gameState;
    if (typeof s._activeEffectFoeSlot === "number") return s._activeEffectFoeSlot;
    if (typeof s._evaluatingFoeSlot === "number") return s._evaluatingFoeSlot;
    const last = s.lastDamagedFoe;
    if (typeof last?.slotIndex === "number") return last.slotIndex;
    if (last?.instanceId && Array.isArray(s.cities)) {
        const foundIdx = s.cities.findIndex(e => e && getEntryKey(e) === String(last.instanceId));
        if (foundIdx >= 0) return foundIdx;
    }
    return null;
}

function resolveNumericValue(raw, heroId = null, state = gameState) {
    if (typeof raw === "number") return raw;
    if (typeof raw !== "string") return 0;

    const val = raw.trim();
    const lower = val.toLowerCase();

    // Simple multiplier support, e.g., "3*findKOdHeroes"
    const multMatch = val.match(/^([+-]?\d+)\s*\*\s*([A-Za-z0-9_()]+)$/);
    if (multMatch) {
        const factor = Number(multMatch[1]) || 0;
        const rhsRaw = multMatch[2];
        const rhsVal = resolveNumericValue(rhsRaw, heroId, state);
        return factor * rhsVal;
    }

    if (lower === "getcardsdiscarded") {
        return getCardsDiscarded(heroId, state);
    }
    if (lower === "hastraveled") {
        return hasTraveled(heroId, state);
    }
    if (lower === "gettravelused") {
        return getTravelUsed(heroId, state);
    }
    if (lower === "getlastdamageamount") {
        return getLastDamageAmount(heroId, state);
    }
    if (lower === "getdamagelost") {
        return getDamageLost(heroId, state);
    }
    if (lower === "getherodamage") {
        return getHeroDamage(heroId, state);
    }
    if (lower === "gethandcount") {
        return getHandCount(heroId, state);
    }
    if (lower === "getdividedmonth") {
        return getDividedMonth(heroId, state);
    }
    if (lower === "getsumvillaindamage") {
        return getSumVillainDamage(state);
    }
    if (lower === "getoverlordlevel") {
        return getOverlordLevel(state);
    }
    if (lower === "getcurrentcityindex") {
        const idx = getCurrentCityIndex(state);
        return Number.isInteger(idx) ? idx : 0;
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

function getHandCount(heroId = null, state = gameState) {
    const s = state || gameState;
    let hid = heroId;
    if (hid == null && Array.isArray(s.heroes)) {
        const idx = Number.isInteger(s.heroTurnIndex) ? s.heroTurnIndex : 0;
        hid = s.heroes[idx];
    }
    if (hid == null) return 0;
    const hand = s.heroData?.[hid]?.hand;
    return Array.isArray(hand) ? hand.length : 0;
}

function getDividedMonth(heroId = null, state = gameState) {
    const s = state || gameState;
    const month = new Date().getMonth() + 1; // 1-12
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    const activeCount = heroIds.filter(hid => {
        const hp = s.heroData?.[hid]?.hp;
        return hp == null ? true : hp > 0;
    }).length;
    const divisor = Math.max(1, activeCount);
    return Math.max(1, Math.floor(month / divisor));
}

function getSumVillainDamage(state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s?.cities)) return 0;
    return s.cities.reduce((total, entry) => {
        if (!entry || entry.id == null) return total;
        const card = findCardInAllSources(entry.id);
        const t = String(card?.type || "").toLowerCase();
        if (t !== "henchman" && t !== "villain") return total;
        const dmg = getEffectiveFoeDamage(entry) || 0;
        return total + dmg;
    }, 0);
}

export function evaluateCondition(condStr, heroId, state = gameState) {
    if (!condStr || condStr.toLowerCase() === "none") return true;
    const s = state || gameState;
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    const getActiveTeammatesForCond = (hid) => getActiveTeammates(hid, s);

    if (condStr.includes(",")) {
        const parts = condStr.split(",").map(p => p.trim()).filter(Boolean);
        if (parts.length > 1) {
            return parts.every(part => evaluateCondition(part, heroId, s));
        }
    }

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

    const handCountMatch = condStr.match(/^hasxpluscardsinhand\((\d+)\)$/i);
    if (handCountMatch) {
        const min = Number(handCountMatch[1]) || 0;
        if (heroId == null) return false;
        const hand = s.heroData?.[heroId]?.hand;
        const count = Array.isArray(hand) ? hand.length : Number(hand) || 0;
        return count >= min;
    }

    const greaterThanMatch = condStr.match(/^isgreaterthanx\(\s*([+-]?\d+)\s*,\s*([^)]+)\)$/i);
    if (greaterThanMatch) {
        const threshold = Number(greaterThanMatch[1]) || 0;
        const helperRaw = greaterThanMatch[2].trim();
        const helperVal = resolveNumericValue(helperRaw, heroId, s);
        const pass = helperVal >= threshold;
        console.log(`[isGreaterThanX] helper=${helperRaw} value=${helperVal} threshold=${threshold} -> ${pass}`);
        return pass;
    }

    const activeHeroMatch = condStr.match(/^activehero\(([^)]+)\)$/i);
    if (activeHeroMatch) {
        const teamName = activeHeroMatch[1];
        if (isTeamBonusSuppressed(teamName, s)) {
            console.log(`[activeHero(${teamName})] Team bonuses suppressed; returning false.`);
            return false;
        }
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

    const noActiveMatch = condStr.match(/^noactive\(([^)]+)\)$/i);
    if (noActiveMatch) {
        const teamName = noActiveMatch[1];
        const count = getActiveTeamCount(teamName, heroId, s);
        const none = count === 0;
        console.log(`[noActive(${teamName})] active count=${count} -> ${none}`);
        return none;
    }

    const inMatch = condStr.match(/^in\(([^)]+)\)$/i);
    if (inMatch) {
        if (heroId == null) return false;
        const place = inMatch[1].trim().toLowerCase();
        if (place === "coastal" || place === "coast") {
            const atCoastal = isHeroInCoastalCity(heroId, s);
            if (!atCoastal) return false;
            return !isCoastalBonusSuppressed(heroId, s);
        }
        return false;
    }

    const cityHeroOccMatch = condStr.match(/^cityoccupiedbyhero\(([^)]+)\)$/i);
    if (cityHeroOccMatch) {
        const targetRaw = cityHeroOccMatch[1].trim().toLowerCase();
        const { left, right } = checkCoastalCities(s);
        if (targetRaw === "coastal" || targetRaw === "coast") {
            const leftLower = left != null ? left + 1 : null;
            const rightLower = right != null ? right + 1 : null;
            const result = (leftLower != null && heroOccupiesLowerIndex(leftLower, s)) ||
                           (rightLower != null && heroOccupiesLowerIndex(rightLower, s));
            console.log(`[cityOccupiedByHero(coastal)] ${result ? "true" : "false"} - leftLower=${leftLower ?? "none"}, rightLower=${rightLower ?? "none"}`);
            return result;
        }
        if (/^\d+$/.test(targetRaw)) {
            const idx = Number(targetRaw);
            const result = heroOccupiesLowerIndex(idx, s) || heroOccupiesLowerIndex(idx + 1, s);
            console.log(`[cityOccupiedByHero(${targetRaw})] ${result ? "true" : "false"}`);
            return result;
        }
        console.log(`[cityOccupiedByHero] Unsupported target '${targetRaw}'.`);
        return false;
    }

    const cityHeroEmptyMatch = condStr.match(/^cityemptyofhero\(([^)]+)\)$/i);
    if (cityHeroEmptyMatch) {
        const targetRaw = cityHeroEmptyMatch[1].trim().toLowerCase();
        const { left, right } = checkCoastalCities(s);
        if (targetRaw === "coastal" || targetRaw === "coast") {
            const leftLower = left != null ? left + 1 : null;
            const rightLower = right != null ? right + 1 : null;
            const leftOcc = leftLower != null && heroOccupiesLowerIndex(leftLower, s);
            const rightOcc = rightLower != null && heroOccupiesLowerIndex(rightLower, s);
            const result = !leftOcc && !rightOcc;
            console.log(`[cityEmptyOfHero(coastal)] ${result ? "true" : "false"} - leftOcc=${leftOcc}, rightOcc=${rightOcc}`);
            return result;
        }
        if (/^\d+$/.test(targetRaw)) {
            const idx = Number(targetRaw);
            const occ = heroOccupiesLowerIndex(idx, s) || heroOccupiesLowerIndex(idx + 1, s);
            const result = !occ;
            console.log(`[cityEmptyOfHero(${targetRaw})] ${result ? "true" : "false"}`);
            return result;
        }
        console.log(`[cityEmptyOfHero] Unsupported target '${targetRaw}'.`);
        return false;
    }

    const leavesCityMatch = condStr.match(/^leavescity\(([^)]+)\)$/i);
    if (leavesCityMatch) {
        const targetRaw = leavesCityMatch[1].trim().toLowerCase();
        const last = s._lastFoeLeftCity || {};
        const slot = typeof last.slotIndex === "number" ? last.slotIndex : null;
        let pass = false;
        let details = "";
        if (slot == null) {
            details = "no recorded foe departure";
        } else if (/^\d+$/.test(targetRaw)) {
            const idx = Number(targetRaw);
            pass = slot === idx;
            details = `slot=${slot}, target=${idx}`;
        } else if (targetRaw === "coastal" || targetRaw === "coast") {
            const { left, right } = checkCoastalCities(s);
            pass = slot === left || slot === right;
            details = `slot=${slot}, coastal left=${left ?? "none"}, right=${right ?? "none"}`;
        } else {
            details = `unsupported target '${targetRaw}'`;
        }
        console.log(`[leavesCity(${targetRaw})] ${pass ? "true" : "false"} - ${details}`);
        return pass;
    }

    const destroyedMatch = condStr.match(/^iscitydestroyed\(([^)]+)\)$/i);
    if (destroyedMatch) {
        const idxRaw = destroyedMatch[1].trim();
        if (/^\d+$/.test(idxRaw)) {
            const idx = Number(idxRaw);
            const destroyed = !!s?.destroyedCities?.[idx];
            console.log(`[isCityDestroyed(${idx})] ${destroyed ? "true" : "false"}`);
            return destroyed;
        }
        console.log(`[isCityDestroyed] Unsupported target '${idxRaw}'.`);
        return false;
    }

    const lowerCond = condStr.toLowerCase();

    if (lowerCond === "capturedbystanderactive") {
        const hasCaptured = Array.isArray(s.cities) && s.cities.some(e =>
            e &&
            (
                (Array.isArray(e.capturedBystanders) && e.capturedBystanders.length > 0) ||
                (Number(e.capturedBystanders) > 0)
            )
        );
        console.log(`[capturedBystanderActive] ${hasCaptured ? "true" : "false"}`);
        return hasCaptured;
    }

    if (lowerCond === "heroblocks") {
        return !!s._heroJustBlocked;
    }

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

    if (lowerCond === "damaged") {
        // For foe triggers, damage handler invokes directly; allow registration
        return true;
    }

    if (lowerCond === "firstattackperturn") {
        // For foe triggers, damage handler invokes directly; allow registration
        return true;
    }

    if (lowerCond === "turnendnotengaged") {
        // Always register; actual trigger handled at end of turn when foe not engaged
        return true;
    }

    if (lowerCond === "turnstart") {
        // Registration allowed; actual firing handled in turn order
        return true;
    }

    if (lowerCond === "turnend") {
        // Registration allowed; actual firing handled in turn order
        return true;
    }

    if (lowerCond === "rescuebystander") {
        const pending = state?._pendingRescueBystanderHero;
        const matchesHero = heroId == null || (pending != null && String(pending) === String(heroId));
        const result = pending != null && matchesHero;
        console.log(`[rescueBystander condition] ${result ? "true" : "false"}${pending != null ? ` (hero=${pending})` : ""}`);
        return result;
    }

    if (lowerCond === "bystanderkod") {
        const pending = state?._pendingBystanderKO;
        const matchesHero = heroId == null || (pending != null && String(pending) === String(heroId));
        const result = !!pending && matchesHero;
        console.log(`[bystanderKod condition] ${result ? "true" : "false"}${pending ? ` (hero=${pending})` : ""}`);
        return result;
    }

    if (lowerCond === "overlordkosbystander") {
        const flag = state?._overlordKOdBystander === true;
        if (flag && state) state._overlordKOdBystander = false;
        console.log(`[overlordKosBystander] ${flag ? "true" : "false"}`);
        return flag;
    }

    if (lowerCond === "kodhenchman") {
        const last = state?._lastKOdHenchman;
        const matchesHero = heroId == null || (last && String(last.heroId) === String(heroId));
        const result = !!last && matchesHero;
        console.log(`[kodHenchman condition] ${result ? "true" : "false"}${last ? ` (hero=${last.heroId}, foe=${last.foeId}, inst=${last.instanceId})` : ""}`);
        return result;
    }
    if (lowerCond === "foekod") {
        const last = state?._lastKOdFoe;
        const matchesHero = heroId == null || (last && String(last.heroId) === String(heroId));
        const result = !!last && matchesHero;
        console.log(`[foeKOd condition] ${result ? "true" : "false"}${last ? ` (hero=${last.heroId}, foe=${last.foeId}, inst=${last.instanceId})` : ""}`);
        return result;
    }

    const teamEndMatch = condStr.match(/^teamheroendturn\(([^)]+)\)$/i);
    if (teamEndMatch) {
        const teamName = teamEndMatch[1];
        if (!teamName) return false;
        const heroObj = heroes.find(h => String(h.id) === String(heroId));
        if (!heroObj) return false;
        return heroMatchesTeam(heroObj, teamName);
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

    const targetCityMatch = condStr.match(/^checkDamageTargetCity\(([^)]+)\)$/i);
    if (targetCityMatch) {
        const targetRaw = targetCityMatch[1].trim();
        let slotIndex = null;
        let source = "";
        const pending = s._pendingDamageTarget;

        // Prefer a live pending damage target from the current context
        if (
            pending &&
            typeof pending.slotIndex === "number" &&
            pending.contextId != null &&
            pending.contextId === s._activeDamageContextId &&
            pending.source === "city-foe"
        ) {
            slotIndex = pending.slotIndex;
            source = "pending";
        }

        // Fallback: if evaluating for a hero, use their engaged foe (upper slot)
        if (slotIndex == null && heroId != null) {
            const hState = s.heroData?.[heroId];
            const lowerIdx = hState?.cityIndex;
            const upperIdx = Number.isInteger(lowerIdx) ? lowerIdx - 1 : null;
            if (Number.isInteger(upperIdx) && upperIdx >= 0) {
                const entry = Array.isArray(s.cities) ? s.cities[upperIdx] : null;
                if (entry && entry.id != null) {
                    slotIndex = upperIdx;
                    source = "hero-engaged";
                }
            }
        }

        let pass = false;
        let details = "";
        const lower = targetRaw.toLowerCase();

        if (!Number.isInteger(slotIndex)) {
            details = "no pending damage target";
        } else if (/^\d+$/.test(targetRaw)) {
            const targetIdx = Number(targetRaw);
            pass = (slotIndex === targetIdx);
            details = `slot=${slotIndex}, targetIdx=${targetIdx}, source=${source}`;
        } else if (lower === "coastal") {
            const { left, right } = checkCoastalCities(s);
            pass = (slotIndex === left) || (slotIndex === right);
            details = `slot=${slotIndex}, coastal slots=${[left, right].filter(v => v != null).join(",") || "none"}, source=${source}`;
        } else {
            details = `unsupported target '${targetRaw}'`;
        }

        console.log(`[checkDamageTargetCity(${targetRaw})] ${pass ? "true" : "false"} - ${details}`);
        return pass;
    }

    const villCityMatch = condStr.match(/^checkVillainCity\(([^)]+)\)$/i);
    if (villCityMatch) {
        const targetRaw = villCityMatch[1].trim();
        const { left, right } = checkCoastalCities(s);
        const pending = s._pendingDamageTarget;
        let slotIndex = null;

        if (pending && pending.source === "city-foe" && typeof pending.slotIndex === "number") {
            slotIndex = pending.slotIndex;
        } else if (typeof s._evaluatingFoeSlot === "number") {
            slotIndex = s._evaluatingFoeSlot;
        }

        if (slotIndex == null) {
            console.log(`[checkVillainCity(${targetRaw})] false - no slot context available`);
            return false;
        }

        const lower = targetRaw.toLowerCase();
        const matches = /^\d+$/.test(targetRaw)
            ? slotIndex === Number(targetRaw)
            : (lower === "coastal" && ((slotIndex === left) || (slotIndex === right)));

        console.log(`[checkVillainCity(${targetRaw})] ${matches ? "true" : "false"} - slot=${slotIndex}, coastal=${[left, right].filter(v => v != null).join(",") || "none"}`);
        return matches;
    }

    if (lowerCond === "wouldusedamagecard") {
        const base = Number(s._pendingCardBaseDamage || 0);
        const result = base >= 1;
        console.log(`[wouldUseDamageCard] ${result ? "true" : "false"} — baseDamage=${base}`);
        return result;
    }

    const usedAbilitiesMatch = lowerCond.match(/^used_abilitieseffects\(\s*(\d+)\s*\)$/i);
    if (usedAbilitiesMatch) {
        const idx = Math.max(0, Number(usedAbilitiesMatch[1]) - 1); // 1-based in data -> 0-based internally
        const ovInfo = getCurrentOverlordInfo(s);
        const ovId = ovInfo?.id ?? "overlord";
        const key = `${ovId}::${idx}`;
        const remaining = s.overlordAbilityUses?.[key];
        const result = remaining === 0;
        console.log(`[used_abilitiesEffects] key=${key} remaining=${remaining ?? "n/a"} -> ${result}`);
        return result;
    }

    const byKodMatch = condStr.match(/^bystanderskod\((\d+)\)$/i);
    if (byKodMatch) {
        const threshold = Number(byKodMatch[1]);
        const total = getBystandersKOdCount(s);
        const pass = total >= threshold;
        console.log(`[bystandersKOD] total=${total} threshold=${threshold} -> ${pass}`);
        return pass;
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

export async function runTurnEndDamageTriggers(state = gameState) {
    const s = state || gameState;
    const map = s.foeDamagedThisTurn;
    if (!map || typeof map !== "object") return;

    const cities = Array.isArray(s.cities) ? s.cities : [];

    for (let idx = 0; idx < cities.length; idx++) {
        const entry = cities[idx];
        if (!entry) continue;
        const key = getEntryKey(entry);
        if (!key || !map[key]) continue;

        const cardData = findCardInAllSources(entry.id);
        if (!cardData || !Array.isArray(cardData.abilitiesEffects)) continue;

        for (const eff of cardData.abilitiesEffects) {
            if (!eff || !eff.effect) continue;
            const condNorm = normalizeConditionString(eff.condition || "none");
            if (condNorm !== "turnendwasdamaged") continue;
            try {
                await executeEffectSafely(eff.effect, cardData, { state: s, slotIndex: idx, foeEntry: entry });
            } catch (err) {
                console.warn("[runTurnEndDamageTriggers] Failed to run effect for foe", entry.id, err);
            }
        }
    }

    s.foeDamagedThisTurn = {};
}

export async function runOverlordTurnEndAttackedTriggers(heroId, state = gameState) {
    const s = state || gameState;
    if (heroId == null) return;

    const info = getCurrentOverlordInfo(s);
    const currentOvId = info?.id != null ? String(info.id) : null;
    if (!currentOvId) return;

    const turnCount = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    const record = s.overlordWasAttackedThisTurn?.[heroId];

    const sameTurn = record && record.turn === turnCount;
    const sameOverlord = record && (!record.overlordId || String(record.overlordId) === currentOvId);

    if (!sameTurn || !sameOverlord) {
        if (record && s.overlordWasAttackedThisTurn) delete s.overlordWasAttackedThisTurn[heroId];
        return;
    }

    const cardData = info.card;
    const effects = Array.isArray(cardData?.abilitiesEffects) ? cardData.abilitiesEffects : [];

    for (let i = 0; i < effects.length; i++) {
        const eff = effects[i];
        if (!eff || !eff.effect) continue;
        const condNorm = normalizeConditionString(eff.condition || "none");
        if (condNorm !== "turnendwasattacked") continue;

        const hasFiniteUses = eff.uses != null && eff.uses !== "" && Number.isFinite(Number(eff.uses));
        const usesMax = hasFiniteUses ? Number(eff.uses) : Number.POSITIVE_INFINITY;

        if (!s.overlordAbilityUses) s.overlordAbilityUses = {};
        const key = `${currentOvId}::${i}`;
        const remaining = s.overlordAbilityUses[key] == null ? usesMax : s.overlordAbilityUses[key];
        if (remaining <= 0) continue;

        if (hasFiniteUses) {
            s.overlordAbilityUses[key] = Math.max(0, remaining - 1);
        } else {
            s.overlordAbilityUses[key] = usesMax;
        }

        try {
            executeEffectSafely(eff.effect, cardData, { state: s, currentHeroId: heroId, target: "overlord" });
        } catch (err) {
            console.warn("[runOverlordTurnEndAttackedTriggers] Failed to run turnEndWasAttacked effect", err);
        }
    }

    if (s.overlordWasAttackedThisTurn) {
        delete s.overlordWasAttackedThisTurn[heroId];
    }
}

export async function runTurnEndNotEngagedTriggers(state = gameState) {
    const s = state || gameState;
    const cities = Array.isArray(s.cities) ? s.cities : [];
    const heroIds = s.heroes || [];

    for (let idx = 0; idx < cities.length; idx++) {
        const entry = cities[idx];
        if (!entry || entry.id == null) continue;
        if (foeAbilitiesDisabled(entry)) continue;
        const lowerIdx = idx + 1;
        const engaged = heroIds.some(hid => s.heroData?.[hid]?.cityIndex === lowerIdx);
        if (engaged) continue;

        const cardData = findCardInAllSources(entry.id);
        if (!cardData || !Array.isArray(cardData.abilitiesEffects)) continue;

        for (const eff of cardData.abilitiesEffects) {
            if (!eff || !eff.effect) continue;
            const condNorm = normalizeConditionString(eff.condition || "none");
            if (condNorm !== "turnendnotengaged") continue;
            try {
                await executeEffectSafely(eff.effect, cardData, { state: s, slotIndex: idx, foeEntry: entry });
            } catch (err) {
                console.warn("[runTurnEndNotEngagedTriggers] Failed to run effect for foe", entry.id, err);
            }
        }
    }
}

// Shared helper to get per-instance key
export function getEntryKey(obj) {
    const k = obj?.instanceId ?? obj?.uniqueId ?? null;
    return (k == null) ? null : String(k);
}

// Simple Fisher–Yates shuffle that returns a new array
function shuffle(arr) {
    if (!Array.isArray(arr)) return [];
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function triggerTravelsTo(entry, slotIndex, state = gameState) {
    if (!entry || typeof slotIndex !== "number") return;
    const s = state || gameState;
    const cardData = findCardInAllSources(entry.id);
    if (!cardData || !Array.isArray(cardData.abilitiesEffects)) return;
    if (foeAbilitiesDisabled(entry)) return;

    const effects = cardData.abilitiesEffects;
    effects.forEach((eff, idx) => {
        if (!eff || !eff.condition) return;
        const cond = String(eff.condition).trim().toLowerCase();
        const match = cond.match(/^travelsto\((\d+)\)$/);
        if (!match) return;

        const targetIdx = Number(match[1]);
        if (targetIdx !== slotIndex) return;

        const usesMax = Number(eff.uses || 1);
        if (!entry.abilityUses) entry.abilityUses = {};
        const remaining = entry.abilityUses[idx] == null ? usesMax : entry.abilityUses[idx];
        if (remaining <= 0) return;

        entry.abilityUses[idx] = Math.max(0, remaining - 1);

        try {
            executeEffectSafely(eff.effect, cardData, { state: s, slotIndex, foeEntry: entry });
        } catch (err) {
            console.warn("[triggerTravelsTo] Failed to execute effect", eff.effect, err);
        }
    });

    saveGameState(s);
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

    // Track last frozen foe for follow-up effects
    try {
        if (!s.lastFrozenFoe) s.lastFrozenFoe = {};
        s.lastFrozenFoe = {
            instanceId: key,
            foeId: String(entry.id ?? ""),
            slotIndex,
            heroId
        };
    } catch (err) {
        console.warn("[applyFreezeToEntry] Failed to set lastFrozenFoe", err);
    }

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
    const bonus = Number(entry.currentDamageBonus || 0);

    // Back-compat: only use legacy overrides if no explicit bonus is tracked.
    let legacyBonus = 0;
    if (!entry.currentDamageBonus) {
        const legacyDiffs = [];
        if (typeof entry.currentDamage === "number") {
            legacyDiffs.push(Number(entry.currentDamage) - base);
        }
        if (typeof entry.damage === "number") {
            legacyDiffs.push(Number(entry.damage) - base);
        }
        legacyBonus = legacyDiffs.length
            ? Math.max(0, ...legacyDiffs.filter(Number.isFinite))
            : 0;
    }

    const penalty = Number(entry.damagePenalty || 0);
    const current = Math.max(0, base + bonus + legacyBonus - penalty);
    entry.currentDamage = current;
    console.log("[getEffectiveFoeDamage]", { base, bonus, penalty, current, entryKey: getEntryKey(entry), slotIndex: entry.slotIndex });
    return current;
}

export function recomputeLocationBasedVillainDamage(state = gameState) {
    const s = state || gameState;
    const cities = Array.isArray(s.cities) ? s.cities : [];

    cities.forEach((entry, idx) => {
        if (!entry) return;

        const cardData = findCardInAllSources(entry.id);
        const effects = Array.isArray(cardData?.abilitiesEffects) ? cardData.abilitiesEffects : [];

        let locBonus = 0;
        effects.forEach(eff => {
            if (!eff || (eff.type || "").toLowerCase() !== "passive") return;
            const condRaw = eff.condition || "none";
            const condNorm = String(condRaw).toLowerCase();
            if (condNorm === "none" || !condRaw) return;

            // Temporarily expose slot for condition evaluation
            s._evaluatingFoeSlot = idx;
            const matches = evaluateCondition(String(condRaw), null, s);
            s._evaluatingFoeSlot = undefined;
            if (!matches) return;

            const effList = Array.isArray(eff.effect) ? eff.effect : [eff.effect];
            effList.forEach(val => {
                if (typeof val !== "string") return;
                const m = val.match(/^increaseVillainDamage\(([-+]?\d+)\)$/i);
                if (m) locBonus += Number(m[1]) || 0;
            });
        });

        const prevLoc = Number(entry._locationDamageBonus || 0);
        if (locBonus !== prevLoc) {
            const otherBonus = Number(entry.currentDamageBonus || 0) - prevLoc;
            entry._locationDamageBonus = locBonus;
            entry.currentDamageBonus = otherBonus + locBonus;
            entry.currentDamage = getEffectiveFoeDamage(entry);
            try { refreshFoeCardUI(idx, entry); } catch (err) { console.warn("[recomputeLocationBasedVillainDamage] refresh failed", err); }
        }
    });

    try { saveGameState(s); } catch (_) {}
}

function runFoeDamagedTriggers(entry, slotIndex, state = gameState) {
    const s = state || gameState;
    if (foeAbilitiesDisabled(entry)) return;
    const cardData = findCardInAllSources(entry.id);
    if (!cardData || !Array.isArray(cardData.abilitiesEffects)) return;

    const effects = cardData.abilitiesEffects;
    for (let i = 0; i < effects.length; i++) {
        const eff = effects[i];
        if (!eff || !eff.effect) continue;
        const condNorm = normalizeConditionString(eff.condition || "none");
        if (condNorm !== "damaged") continue;

        const hasFiniteUses = eff.uses != null && eff.uses !== "" && Number.isFinite(Number(eff.uses));
        const usesMax = hasFiniteUses ? Number(eff.uses) : Number.POSITIVE_INFINITY;
        if (!entry.abilityUses) entry.abilityUses = {};
        const remaining = entry.abilityUses[i] == null ? usesMax : entry.abilityUses[i];
        if (remaining <= 0) continue;
        if (hasFiniteUses) {
            entry.abilityUses[i] = Math.max(0, remaining - 1);
        } else {
            entry.abilityUses[i] = usesMax;
        }

        try {
            executeEffectSafely(eff.effect, cardData, { state: s, slotIndex, foeEntry: entry });
        } catch (err) {
            console.warn("[runFoeDamagedTriggers] Failed to run damaged effect", err);
        }
    }
    saveGameState(s);
}

function findHeroEngagedWithFoe(slotIndex, state = gameState) {
    const s = state || gameState;
    const lowerIdx = Number(slotIndex) + 1;
    if (!Array.isArray(s.heroes) || !s.heroData) return null;
    const heroId = s.heroes.find(hid => s.heroData?.[hid]?.cityIndex === lowerIdx) || null;
    return heroId ?? null;
}

function runFoeFirstAttackPerTurnTriggers(entry, slotIndex, state = gameState) {
    const s = state || gameState;
    if (foeAbilitiesDisabled(entry)) return;
    const cardData = findCardInAllSources(entry.id);
    if (!cardData || !Array.isArray(cardData.abilitiesEffects)) return;

    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    if (entry.lastDamagedTurnCounter === turn) return;

    const engagedHeroId = findHeroEngagedWithFoe(slotIndex, s);

    const effects = cardData.abilitiesEffects;
    let fired = false;

    for (let i = 0; i < effects.length; i++) {
        const eff = effects[i];
        if (!eff || !eff.effect) continue;
        const condNorm = normalizeConditionString(eff.condition || "none");
        if (condNorm !== "firstattackperturn") continue;

        const hasFiniteUses = eff.uses != null && eff.uses !== "" && Number.isFinite(Number(eff.uses));
        const usesMax = hasFiniteUses ? Number(eff.uses) : Number.POSITIVE_INFINITY;
        if (!entry.abilityUses) entry.abilityUses = {};
        const remaining = entry.abilityUses[i] == null ? usesMax : entry.abilityUses[i];
        if (remaining <= 0) continue;

        if (hasFiniteUses) {
            entry.abilityUses[i] = Math.max(0, remaining - 1);
        } else {
            entry.abilityUses[i] = usesMax;
        }

        try {
            executeEffectSafely(eff.effect, cardData, { state: s, slotIndex, foeEntry: entry, currentHeroId: engagedHeroId });
            fired = true;
        } catch (err) {
            console.warn("[runFoeFirstAttackPerTurnTriggers] Failed to run firstAttackPerTurn effect", err);
        }
    }

    if (fired) {
        entry.lastDamagedTurnCounter = turn;
    }

    saveGameState(s);
}

function runOverlordFirstAttackPerTurnTriggers(state = gameState, heroId = null) {
    const s = state || gameState;
    const info = getCurrentOverlordInfo(s);
    const cardData = info?.card;
    if (!cardData || !Array.isArray(cardData.abilitiesEffects)) return;

    const effects = cardData.abilitiesEffects;
    for (let i = 0; i < effects.length; i++) {
        const eff = effects[i];
        if (!eff || !eff.effect) continue;
        const condNorm = normalizeConditionString(eff.condition || "none");
        if (condNorm !== "firstattackperturn") continue;

        const hasFiniteUses = eff.uses != null && eff.uses !== "" && Number.isFinite(Number(eff.uses));
        const usesMax = hasFiniteUses ? Number(eff.uses) : Number.POSITIVE_INFINITY;

        if (!s.overlordAbilityUses) s.overlordAbilityUses = {};
        const key = `${info.id ?? "overlord"}::${i}`;
        const remaining = s.overlordAbilityUses[key] == null ? usesMax : s.overlordAbilityUses[key];
        if (remaining <= 0) continue;

        if (hasFiniteUses) {
            s.overlordAbilityUses[key] = Math.max(0, remaining - 1);
        } else {
            s.overlordAbilityUses[key] = usesMax;
        }

        try {
            executeEffectSafely(eff.effect, cardData, { state: s, currentHeroId: heroId, target: "overlord" });
        } catch (err) {
            console.warn("[runOverlordFirstAttackPerTurnTriggers] Failed to run firstAttackPerTurn effect", err);
        }
    }

    // Allow tactics (rule effects) to react to the Overlord's first attack trigger as well
    try {
        triggerRuleEffects("overlordFirstAttackPerTurn", { currentHeroId: heroId, target: "overlord" }, s);
    } catch (err) {
        console.warn("[runOverlordFirstAttackPerTurnTriggers] Failed to run tactic rule effects", err);
    }
}

function runOverlordReducedToHPTriggers(postDamageHP, state = gameState) {
    const s = state || gameState;
    const info = getCurrentOverlordInfo(s);
    const cardData = info?.card;
    const ovId = info?.id;
    const hpVal = Number(postDamageHP);

    if (!cardData || !Array.isArray(cardData.abilitiesEffects)) return false;
    if (!Number.isFinite(hpVal)) return false;

    let fired = false;
    const effects = cardData.abilitiesEffects;

    for (let i = 0; i < effects.length; i++) {
        const eff = effects[i];
        if (!eff || !eff.effect) continue;
        const condStr = String(eff.condition || "");
        const match = condStr.match(/^overlordreducedtohp\(\s*([+-]?\d+)\s*\)$/i);
        if (!match) continue;
        const threshold = Number(match[1]);
        if (!Number.isFinite(threshold)) continue;
        if (hpVal > threshold) continue;

        const hasFiniteUses = eff.uses != null && eff.uses !== "" && Number.isFinite(Number(eff.uses));
        const usesMax = hasFiniteUses ? Number(eff.uses) : Number.POSITIVE_INFINITY;

        if (!s.overlordAbilityUses) s.overlordAbilityUses = {};
        const key = `${ovId ?? cardData.id ?? cardData.name ?? "Overlord"}::${i}`;
        const remaining = s.overlordAbilityUses[key] == null ? usesMax : s.overlordAbilityUses[key];
        if (remaining <= 0) continue;
        s.overlordAbilityUses[key] = hasFiniteUses ? Math.max(0, remaining - 1) : usesMax;
        console.log("[runOverlordReducedToHPTriggers] Triggered", {
            key,
            threshold,
            postDamageHP: hpVal,
            remaining: s.overlordAbilityUses[key]
        });

        try {
            executeEffectSafely(eff.effect, cardData, { state: s });
            fired = true;
        } catch (err) {
            console.warn("[runOverlordReducedToHPTriggers] Failed to run effect", err);
        }
    }

    return fired;
}

function shouldIgnoreDamageFromCard(entry, cardId) {
    if (!entry || !cardId) return false;
    if (!Array.isArray(entry.damagedByCardIds)) {
        entry.damagedByCardIds = [];
    }
    if (entry.damagedByCardIds.includes(cardId)) {
        return true;
    }
    entry.damagedByCardIds.push(cardId);
    return false;
}

function hasCardDamagedEntry(entry, cardId) {
    if (!entry || !cardId) return false;
    return Array.isArray(entry.damagedByCardIds) && entry.damagedByCardIds.includes(cardId);
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

// ---------------------------------------------------------
// HERO TEMP PASSIVES / ABILITIES
// ---------------------------------------------------------
function normalizeHeroPassiveDuration(raw) {
    const val = String(raw ?? "").toLowerCase();
    if (!val || ["current", "turn", "currentturn", "thisturn"].includes(val)) return "current";
    if (["next", "nextturn"].includes(val)) return "next";
    if (["forever", "permanent", "always", "perma"].includes(val)) return "forever";
    return "current";
}

function buildHeroPassiveAbility(effectSpec, opts = {}) {
    if (effectSpec == null) return null;
    const raw = String(effectSpec).trim();
    if (!raw) return null;

    const fnMatch = raw.match(/^([A-Za-z0-9_]+)\s*(\((.*)\))?/);
    const fnName = fnMatch ? fnMatch[1].toLowerCase() : "";
    const argSection = fnMatch && fnMatch[3] != null ? fnMatch[3] : "";

    let effectText = raw;
    let type = opts.typeHint || null;
    let uses = opts.usesOverride;
    let label = opts.label || raw;

    const cityLabel = () => {
        const idx = Number(argSection);
        const name = Number.isFinite(idx) ? getCityNameFromIndex(idx) : null;
        return name ? `Travel to ${name}` : "Travel";
    };

    if (fnName === "atwilltravelto") {
        effectText = `travelTo(${argSection})`;
        type = type || "standard";
        uses = uses ?? 1;
        if (!opts.label) label = cityLabel();
    } else if (fnName === "blockdamage") {
        effectText = "blockDamage()";
        type = type || "optional";
        uses = uses ?? (Number(argSection) || 1);
        if (!opts.label) label = "Block damage";
    } else if (fnName === "retreatherotohq") {
        type = type || "standard";
        uses = uses ?? 1;
        if (!opts.label) label = "Withdraw";
    } else if (fnName === "travelto") {
        type = type || "standard";
        uses = uses ?? 1;
        if (!opts.label) label = cityLabel();
    } else if (fnName === "discardcardsatwill") {
        type = type || "standard";
        uses = uses ?? 999;
        effectText = "discardCardsAtWill()";
        if (!opts.label) label = "Discard cards at will";
    } else if (fnName === "ignoreshovedamage") {
        effectText = `ignoreShoveDamage(${argSection || "currentHero,endOfTurn"})`;
        type = type || "passive";
        uses = uses ?? 0;
        if (!opts.label) label = "Ignore shove damage";
    }

    if (!type) type = "passive";
    if (uses == null) {
        uses = (type === "standard" || type === "optional") ? 1 : 0;
    }

    const abilityEntry = {
        type,
        condition: "none",
        uses,
        effect: effectText
    };

    if (type === "optional" && !abilityEntry.howOften) {
        abilityEntry.howOften = "OPT";
    }

    return { abilityEntry, label };
}


export function getCurrentHeroDT(heroId, state = gameState) {
    const s = state || gameState;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return 0;
    const heroState = s.heroData?.[heroId];
    const turnCount = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    if (heroState && heroState.tempDT) {
        const expired = typeof heroState.tempDT.expiresAtTurnCounter === "number" && turnCount >= heroState.tempDT.expiresAtTurnCounter;
        if (!expired) {
            return Number(heroState.tempDT.value) || 0;
        }
        delete heroState.tempDT;
    }
    return Number(heroObj.damageThreshold || 0);
}

function getAbilityKey(ability) {
    if (!ability) return null;
    const type = String(ability.type || "").toLowerCase();
    const eff = Array.isArray(ability.effect) ? ability.effect.join("|") : String(ability.effect || "");
    return `${type}::${eff}`;
}

function damageHeroAtCity(cityLowerIndex, amount, state = gameState) {
    const s = state || gameState;
    const lowerIdx = Number(cityLowerIndex);
    const dmg = Number(amount) || 0;
    if (!Number.isInteger(lowerIdx)) {
        console.warn("[damageHeroAtCity] Invalid city index:", cityLowerIndex);
        return;
    }
    const targetLower = lowerIdx + 1; // heroData.cityIndex uses lower slot (1-based)
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    for (const hid of heroIds) {
        const hState = s.heroData?.[hid];
        if (!hState) continue;
        if (Number(hState.cityIndex) === targetLower) {
            damageHero(dmg, hid, s);
            return;
        }
    }
    console.log("[damageHeroAtCity] No hero found at lower index", lowerIdx);
}

function addTempHeroAbility(heroId, abilityEntry, meta = {}, state = gameState) {
    const s = state || gameState;
    if (!heroId || !abilityEntry) return null;
    if (!s.heroData) s.heroData = {};
    const heroState = s.heroData[heroId] || (s.heroData[heroId] = {});
    if (!Array.isArray(heroState.tempAbilities)) heroState.tempAbilities = [];

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const baseLen = Array.isArray(heroObj?.abilitiesEffects) ? heroObj.abilitiesEffects.length : 0;
    const incomingKey = getAbilityKey(abilityEntry);
    const existingIndex = heroState.tempAbilities.findIndex(entry => entry && getAbilityKey(entry.ability) === incomingKey);

    if (existingIndex !== -1) {
        const existing = heroState.tempAbilities[existingIndex];
        const incomingUses = Math.max(0, Number(abilityEntry.uses || 0));
        const oldMax = Math.max(0, Number(existing.ability?.uses || 0));
        const newMax = Math.min(999, oldMax + incomingUses);
        existing.ability.uses = newMax;

        const idx = baseLen + existingIndex;
        if (!heroState.currentUses) heroState.currentUses = {};
        const oldRemaining = heroState.currentUses[idx];
        const newRemaining = oldRemaining == null
            ? newMax
            : Math.min(999, Math.max(0, oldRemaining) + incomingUses);
        heroState.currentUses[idx] = newRemaining;
        if (heroObj) {
            heroObj.currentUses = heroObj.currentUses || {};
            heroObj.currentUses[idx] = heroState.currentUses[idx];
        }
        return existingIndex;
    }

    let slot = heroState.tempAbilities.findIndex(entry => !entry);
    if (slot === -1) {
        heroState.tempAbilities.push(null);
        slot = heroState.tempAbilities.length - 1;
    }

    heroState.tempAbilities[slot] = {
        ability: abilityEntry,
        label: meta.label || null,
        expiresAtTurnCounter: meta.expiresAtTurnCounter ?? null,
        source: meta.source || null,
        createdTurnCounter: meta.createdTurnCounter ?? null
    };

    // Initialize uses for new temp ability
    if (abilityEntry.type && abilityEntry.type.toLowerCase() !== "passive") {
        const idx = baseLen + slot;
        if (!heroState.currentUses) heroState.currentUses = {};
        heroState.currentUses[idx] = Math.max(0, Number(abilityEntry.uses || 0));
        if (heroObj) {
            heroObj.currentUses = heroObj.currentUses || {};
            heroObj.currentUses[idx] = heroState.currentUses[idx];
        }
    }

    return slot;
}

export function cleanupExpiredHeroPassives(heroId, state = gameState, opts = {}) {
    const s = state || gameState;
    if (!heroId || !s.heroData?.[heroId]) return;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const baseLen = Array.isArray(heroObj?.abilitiesEffects) ? heroObj.abilitiesEffects.length : 0;
    const heroState = s.heroData[heroId];
    if (!Array.isArray(heroState.tempAbilities)) return;

    const turnCount = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    let changed = false;

    heroState.tempAbilities = heroState.tempAbilities.map((entry, idx) => {
        if (!entry) return null;
        const expiresAt = entry.expiresAtTurnCounter;
        const shouldExpire = typeof expiresAt === "number" ? (turnCount >= expiresAt) : false;
        if (shouldExpire) {
            if (heroState.currentUses && (baseLen + idx) in heroState.currentUses) {
                delete heroState.currentUses[baseLen + idx];
            }
            if (heroObj?.currentUses && (baseLen + idx) in heroObj.currentUses) {
                delete heroObj.currentUses[baseLen + idx];
            }
            changed = true;
            return null;
        }
        return entry;
    });

    if (changed && opts.save !== false) {
        saveGameState(s);
    }
}

export function getHeroAbilitiesWithTemp(heroId, state = gameState) {
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const baseEffects = Array.isArray(heroObj?.abilitiesEffects) ? heroObj.abilitiesEffects : [];
    const baseNames = Array.isArray(heroObj?.abilitiesNamePrint) ? heroObj.abilitiesNamePrint : [];
    const heroState = state?.heroData?.[heroId] || {};
    const tempList = Array.isArray(heroState.tempAbilities) ? heroState.tempAbilities : [];

    const tempEffects = tempList.map(entry => entry?.ability || null);
    const tempNames = tempList.map(entry => entry
        ? { text: entry.label || (entry.ability?.effect ? String(entry.ability.effect) : "Temporary Ability") }
        : null
    );

    return {
        effects: baseEffects.concat(tempEffects),
        names: baseNames.concat(tempNames),
        baseLength: baseEffects.length,
        tempAbilities: tempList
    };
}

EFFECT_HANDLERS.charge = function (args, card, selectedData) {
    const distance = Number(args[0]) || 1;
    runCharge(card.id, distance);
};

EFFECT_HANDLERS.draw = function(args, card, selectedData) {
    const heroId = selectedData?.currentHeroId ?? null;

    let count = 0;
    let rawFlag = args?.[1] ?? "";

    // Special placeholder: draw(cardsNotRetrieved) uses counts from previous retrieve call
    if (typeof args?.[0] === "string" && args[0].toLowerCase() === "cardsnotretrieved") {
        const retrieved = Number(selectedData?._retrievedCount);
        const target = Number(selectedData?._requestedRetrieve);
        const targetSafe = Number.isFinite(target) ? target : 0;
        const retrievedSafe = Number.isFinite(retrieved) ? retrieved : 0;
        count = Math.max(0, targetSafe - retrievedSafe);
    } else {
        const rawCount = resolveNumericValue(args?.[0] ?? 1, heroId, gameState);
        count = Math.max(0, Number(rawCount) || 0);
    }

    const flag = rawFlag.toString().toLowerCase();

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

    if (flag === 'startnextturn') {
        heroState.pendingStartTurnDraw = Math.max(0, Number(heroState.pendingStartTurnDraw) || 0) + count;
        heroState.skipTopPreviewNextTurn = true;
        console.log(`[draw] Scheduled ${count} card(s) to draw at start of next turn for hero ${heroId}.`);
        saveGameState(gameState);
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
    // Optional team filter: allOtherHeroes(teamName)
    if (flag === 'allotherheroes' || /^allotherheroes\([^)]*\)$/.test(flag)) {
        const heroIds = gameState.heroes || [];
        const teamMatch = flag.match(/^allotherheroes\(([^)]*)\)$/);
        const teamFilterRaw = teamMatch ? teamMatch[1] : null;
        const teamFilter = teamFilterRaw ? teamFilterRaw.trim().toLowerCase() : null;
        heroIds.forEach(hid => {
            if (String(hid) === String(heroId)) return;

            const hState = gameState.heroData?.[hid];
            if (!hState) return;
            const hp = typeof hState.hp === 'number' ? hState.hp : 1;
            if (hp <= 0) return; // only active (non-KO) heroes

            if (teamFilter) {
                const hCard = heroes.find(h => String(h.id) === String(hid));
                if (!heroMatchesTeam(hCard, teamFilter)) return;
            }

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

// Marker handler; global damage bonus applied during card damage resolution.
EFFECT_HANDLERS.increaseAllCardDamage = function() {};

EFFECT_HANDLERS.skipSelectionDraw = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;
    const countRaw = resolveNumericValue(args?.[0] ?? 1, heroId, state);
    const count = Math.max(1, Number(countRaw) || 0);

    if (heroId == null) {
        console.warn("[skipSelectionDraw] No heroId available.");
        return;
    }

    if (!state.heroData) state.heroData = {};
    if (!state.heroData[heroId]) state.heroData[heroId] = {};

    state.heroData[heroId].skipSelectionDraw = count;

    try {
        console.log(`[skipSelectionDraw] Hero ${heroId} will skip preview and draw ${count} card(s).`);
    } catch (e) {}
};

EFFECT_HANDLERS.enemyDraw = function(args, card, selectedData) {
    const count = Number(args?.[0]) || 1;
    const limit = args?.[1] ?? null;
    return enemyDraw(count, limit, selectedData);
};

EFFECT_HANDLERS.takeNextHenchVillainsFromDeck = async function(args = [], card, selectedData = {}) {
    const depth = Math.max(0, Number(args?.[0]) || 0);
    const flagRaw = args?.[1];
    const flag = typeof flagRaw === "string" ? flagRaw.toLowerCase() : "";
    const opts = {
        henchmenOnly: flag === "henchmenonly" || flag === "henchmen",
        villainsOnly: flag === "villainsonly" || flag === "villains"
    };
    await takeNextHenchVillainsFromDeck(depth, opts);
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

EFFECT_HANDLERS.teleportFoeElsewhere = function(args = [], card, selectedData = {}) {
    const targetRaw = args?.[0] ?? "rightmost";
    const destRaw = args?.[1] ?? null;
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.cities)) return;

    // pick foe
    const normTarget = String(targetRaw || "rightmost").toLowerCase();
    const foes = s.cities
        .map((entry, idx) => ({ entry, idx }))
        .filter(({ entry, idx }) => entry && !s.destroyedCities?.[idx]);
    if (!foes.length) {
        console.log("[teleportFoeElsewhere] No foes to teleport.");
        return;
    }
    let picked = null;
    if (normTarget === "leftmost") {
        picked = foes.reduce((best, cur) => (best == null || cur.idx < best.idx ? cur : best), null);
    } else if (normTarget === "rightmost") {
        picked = foes.reduce((best, cur) => (best == null || cur.idx > best.idx ? cur : best), null);
    } else if (normTarget === "random") {
        picked = foes[Math.floor(Math.random() * foes.length)];
    } else {
        const asNum = Number(normTarget);
        if (Number.isInteger(asNum) && asNum >= 0 && asNum < s.cities.length && s.cities[asNum]) {
            picked = { entry: s.cities[asNum], idx: asNum };
        } else {
            // default rightmost
            picked = foes.reduce((best, cur) => (best == null || cur.idx > best.idx ? cur : best), null);
        }
    }
    if (!picked || !picked.entry) {
        console.log("[teleportFoeElsewhere] No matching foe found.");
        return;
    }

    // pick destination (empty upper slot, not destroyed)
    let openSlots = s.cities
        .map((entry, idx) => ({ entry, idx }))
        .filter(({ entry, idx }) => !entry && !s.destroyedCities?.[idx]);
    if (!openSlots.length) {
        console.log("[teleportFoeElsewhere] No open city slots to teleport into.");
        return;
    }
    let destIdx = null;
    if (destRaw != null && !Number.isNaN(Number(destRaw))) {
        const num = Number(destRaw);
        if (Number.isInteger(num) && num >= 0 && num < s.cities.length && !s.cities[num] && !s.destroyedCities?.[num]) {
            destIdx = num;
        }
    }
    if (destIdx == null) {
        const choice = openSlots[Math.floor(Math.random() * openSlots.length)];
        destIdx = choice?.idx;
    }
    if (destIdx == null) {
        console.log("[teleportFoeElsewhere] Could not resolve destination slot.");
        return;
    }

    const { entry, idx: fromIdx } = picked;

    // send engaged hero back to HQ (lower slot is +1)
    const lowerIdx = fromIdx + 1;
    if (Array.isArray(s.heroes)) {
        s.heroes.forEach(hid => {
            const hState = s.heroData?.[hid];
            if (hState && Number(hState.cityIndex) === lowerIdx) {
                retreatHeroToHQSafe(hid, s);
            }
        });
    }

    // clear UI for old slot
    try {
        const citySlots = document.querySelectorAll(".city-slot");
        const slot = citySlots?.[fromIdx];
        const area = slot?.querySelector(".city-card-area");
        if (area) area.innerHTML = "";
    } catch (_) {}

    s.cities[fromIdx] = null;

    // place into new slot
    entry.slotIndex = destIdx;
    s.cities[destIdx] = entry;

    try { refreshFoeCardUI(destIdx, entry); } catch (_) {}
    saveGameState(s);
};

EFFECT_HANDLERS.clickEndTurn = function(args = [], card, selectedData = {}) {
    if (typeof document === "undefined") {
        console.warn("[clickEndTurn] No document available.");
        return;
    }

    const btn = document.getElementById("end-turn-button");
    if (!btn) {
        console.warn("[clickEndTurn] End-turn button not found.");
        return;
    }

    try {
        btn.click();
    } catch (err) {
        console.warn("[clickEndTurn] Failed to click end turn:", err);
    }
};

EFFECT_HANDLERS.damageFoe = function (args, card, selectedData) {
    const heroId =
        selectedData?.currentHeroId
        ?? gameState.heroes?.[gameState.heroTurnIndex ?? 0]
        ?? null;
    let amount = Number(args?.[0]);
    let flag = "single";

    // Support (flag, amount) ordering as well as (amount, flag)
    if (!Number.isFinite(amount) || amount === 0) {
        if (args?.length > 1 && Number.isFinite(Number(args[1]))) {
            flag = args[0];
            amount = Number(args[1]);
        } else {
            amount = Number(args?.[0]) || 0;
        }
    }
    if (amount > 0) {
        amount = applyHalfDamageModifier(amount, heroId, gameState);
    }

    // Optional second argument:
    //  - "all"
    //  - numeric city index (0,2,4,6,8,10)
    //  - omitted → normal single-target (selected foe)
    if (flag === "single" && args?.length > 1) {
        const raw = args[1];

        if (raw === "all") {
            flag = "all";
        } else if (typeof raw === "string" && raw.toLowerCase() === "allhenchmen") {
            flag = "allHenchmen";
        } else if (typeof raw === "string" && raw.toLowerCase() === "allvillains") {
            flag = "allVillains";
        } else if (typeof raw === "string" && raw.toLowerCase() === "allothers") {
            flag = "allothers";
        } else if (typeof raw === "string" && raw.toLowerCase() === "any") {
            flag = "any";
        } else if (typeof raw === "string" && raw.toLowerCase() === "anyhenchman") {
            flag = "anyHenchman";
        } else if (typeof raw === "string" && raw.toLowerCase() === "anycoastal") {
            flag = "anyCoastal";
        } else if (typeof raw === "string" && raw.toLowerCase() === "anywithbystander") {
            flag = "anyWithBystander";
        } else if (typeof raw === "string" && raw.toLowerCase() === "allwithbystander") {
            flag = "allWithBystander";
        } else if (typeof raw === "string" && raw.toLowerCase() === "adjacentfoes") {
            flag = "adjacentFoes";
        } else if (typeof raw === "string" && raw.toLowerCase() === "alladjacentfoes") {
            flag = "allAdjacentFoes";
        } else if (typeof raw === "string" && raw.toLowerCase() === "lastdamagecauser") {
            flag = "lastDamageCauser";
        } else if (typeof raw === "string" && raw.toLowerCase() === "lastrescuedfrom") {
            flag = "lastRescuedFrom";
        } else if (typeof raw === "string" && raw.toLowerCase() === "leftcoastal") {
            flag = "leftCoastal";
        } else if (typeof raw === "string" && raw.toLowerCase() === "rightcoastal") {
            flag = "rightCoastal";
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
    const raw = args?.[0];
    let amount = resolveNumericValue(raw, heroId, state);
    if (!Number.isFinite(amount)) {
        amount = Number(raw) || 0;
    }
    damageOverlord(amount, state, heroId);
};

function resurrectHeroById(heroId, amount, state = gameState) {
    const s = state || gameState;
    if (!heroId || !s || !s.heroData) return;
    const heroState = s.heroData[heroId];
    const heroCard = heroes.find(h => String(h.id) === String(heroId));
    if (!heroState || !heroCard) return;

    const baseHP = Number(heroCard.hp || heroCard.baseHP || 0) || 0;
    let target = Number(amount) || 0;
    if (target >= 999 || target >= baseHP) target = baseHP;
    if (target <= 0) target = Math.max(1, baseHP);

    heroState.hp = Math.min(baseHP, target);
    heroState.isKO = false;
    heroCard.currentHP = heroState.hp;

    try { clearHeroKOMarkers(heroId); } catch (_) {}
    try { updateHeroHPDisplays(heroId); updateBoardHeroHP(heroId); } catch (err) {
        console.warn("[resurrectHero] Failed to update hero HP UI.", err);
    }

    try {
        const heroName = heroCard.name || `Hero ${heroId}`;
        appendGameLogEntry(`${heroName} was resurrected to ${heroState.hp} HP.`, s);
    } catch (err) {
        console.warn("[resurrectHero] Failed to log resurrection.", err);
    }
}

EFFECT_HANDLERS.resurrectHero = function(args = [], card, selectedData = {}) {
    const whoRaw = args?.[0] ?? "current";
    const amountRaw = args?.[1] ?? 1;
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;

    const koHeroes = s.heroes.filter(hid => {
        const hs = s.heroData?.[hid];
        return hs && (hs.hp == null || hs.hp <= 0 || hs.isKO);
    });

    if (!koHeroes.length) return;

    const amount = Number(amountRaw) || 0;
    const normWho = String(whoRaw || "current").toLowerCase();

    const reviveList = [];

    if (normWho === "choice" || normWho === "choose") {
        if (typeof window === "undefined") {
            console.warn("[resurrectHero] 'choice' selection requires browser UI.");
            return;
        }

        const options = koHeroes.map(hid => {
            const hCard = heroes.find(h => String(h.id) === String(hid));
            return { id: hid, name: hCard?.name || `Hero ${hid}` };
        });

        if (!options.length) return;

        showResurrectHeroModal({
            header: "Choose a hero to resurrect",
            options,
            selectedId: options[0]?.id ?? null
        }).then(chosen => {
            if (!chosen || chosen.id == null) return;
            resurrectHeroById(chosen.id, amount, s);
            saveGameState(s);
        }).catch(err => console.warn("[resurrectHero] Failed to show resurrection modal.", err));
        return;
    }

    if (normWho === "all") {
        reviveList.push(...koHeroes);
    } else if (!Number.isNaN(Number(whoRaw))) {
        const count = Math.max(1, Number(whoRaw));
        const shuffled = [...koHeroes].sort(() => Math.random() - 0.5);
        reviveList.push(...shuffled.slice(0, count));
    } else if (normWho === "random") {
        const pick = koHeroes[Math.floor(Math.random() * koHeroes.length)];
        reviveList.push(pick);
    } else {
        let target = selectedData?.currentHeroId;
        if (target == null) {
            const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
            target = s.heroes[idx];
        }
        if (target != null && koHeroes.includes(target)) reviveList.push(target);
    }

    if (!reviveList.length) return;

    reviveList.forEach(hid => resurrectHeroById(hid, amount, s));
    saveGameState(s);
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
    let who = "current";
    let deltaRaw = args?.[0];
    let flag = args?.[1] ?? "";

    // Allow signature travelPlus(who, delta, flag)
    const firstIsNumber = Number.isFinite(Number(deltaRaw));
    if (!firstIsNumber && typeof deltaRaw === "string") {
        who = String(deltaRaw).toLowerCase();
        deltaRaw = args?.[1];
        flag = args?.[2] ?? "";
    }

    const delta = Number(deltaRaw) || 0;
    const state = selectedData?.state || gameState;
    const heroIds = Array.isArray(state?.heroes) ? state.heroes : [];

    const applyToHero = (hid) => {
        if (hid == null) return;
        adjustHeroTravelDelta(delta, { flag }, hid, state);
    };

    if (who === "all") {
        heroIds.forEach(hid => {
            if (state?.heroData?.[hid]) applyToHero(hid);
        });
        return;
    }

    if (who === "random") {
        const alive = heroIds.filter(hid => state?.heroData?.[hid]);
        if (alive.length) {
            const pick = alive[Math.floor(Math.random() * alive.length)];
            applyToHero(pick);
        }
        return;
    }

    // Team match
    const teamKey = String(who || "").toLowerCase();
    if (who !== "current" && who !== "currenthero") {
        const matched = heroIds.filter(hid => {
            const hObj = heroes.find(h => String(h.id) === String(hid));
            return hObj && heroMatchesTeam(hObj, teamKey);
        });
        if (matched.length) {
            matched.forEach(hid => applyToHero(hid));
            return;
        }
    }

    const heroId = selectedData?.currentHeroId ?? (heroIds[state?.heroTurnIndex ?? 0]);
    applyToHero(heroId);
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

    incrementRescuedBystanders(heroId, count, gameState);
    gameState._pendingRescueBystanderHero = heroId;
    try {
        triggerRuleEffects("rescueBystander", { currentHeroId: heroId, state: gameState });
    } catch (err) {
        console.warn("[rescueBystander] Failed to trigger rescueBystander effects", err);
    }
    gameState._pendingRescueBystanderHero = null;

    saveGameState(gameState);
    renderHeroHandBar(gameState);
};

EFFECT_HANDLERS.koBystander = function(args = [], cardData, selectedData = {}) {
    const count = Math.max(1, Number(args?.[0]) || 1);
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? (Array.isArray(state.heroes) ? state.heroes[state.heroTurnIndex ?? 0] : null);

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

    state._pendingBystanderKO = heroId ?? true;
    try {
        triggerRuleEffects("bystanderKod", { currentHeroId: heroId, state });
    } catch (err) {
        console.warn("[koBystander] Failed to trigger bystanderKod effects", err);
    }
    state._pendingBystanderKO = null;

    maybeTriggerEvilWinsConditions(state);

    try {
        if (typeof window !== "undefined" && typeof window.renderKOBar === "function") {
            window.renderKOBar(state);
        }
    } catch (e) {
        console.warn("[koBystander] Failed to render KO bar", e);
    }

    saveGameState(state);
};

EFFECT_HANDLERS.koRescuedBystander = function(args = [], cardData, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? (Array.isArray(state.heroes) ? state.heroes[state.heroTurnIndex ?? 0] : null);
    if (!heroId) {
        console.warn("[koRescuedBystander] No heroId available.");
        return;
    }

    const heroState = state.heroData?.[heroId];
    if (!heroState) {
        console.warn("[koRescuedBystander] No heroState for heroId:", heroId);
        return;
    }

    if (!Array.isArray(heroState.hand)) heroState.hand = [];
    if (!Array.isArray(state.koCards)) state.koCards = [];

    const remainingHand = [];
    const koList = [];

    heroState.hand.forEach(cardId => {
        if (isBystanderId(cardId)) {
            const cardData = bystanders.find(b => String(b.id) === String(cardId));
            koList.push({
                id: cardId,
                name: cardData?.name || `Bystander ${cardId}`,
                type: "Bystander",
                source: "koRescuedBystander"
            });
        } else {
            remainingHand.push(cardId);
        }
    });

    heroState.hand = remainingHand;
    if (koList.length) {
        state.koCards.push(...koList);
        const names = koList.map(k => k.name).join(", ");
        appendGameLogEntry(
            koList.length === 1
                ? `${names} was KO'd from ${heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`}'s hand.`
                : `Bystanders: ${names} were KO'd from ${heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`}'s hand.`,
            state
        );
    }

    state._pendingBystanderKO = heroId;
    try {
        triggerRuleEffects("bystanderKod", { currentHeroId: heroId, state });
    } catch (err) {
        console.warn("[koRescuedBystander] Failed to trigger bystanderKod effects", err);
    }
    state._pendingBystanderKO = null;

    maybeTriggerEvilWinsConditions(state);
    try { if (typeof window !== "undefined" && typeof window.renderHeroHandBar === "function") window.renderHeroHandBar(state); } catch (e) { /* ignore */ }
    try { if (typeof window !== "undefined" && typeof window.renderKOBar === "function") window.renderKOBar(state); } catch (e) { /* ignore */ }
    saveGameState(state);
};

function rescueCapturedBystander(flag = "all", heroId = null, state = gameState, selectedData = {}) {
    const s = state || gameState;
    s.lastRescuedFrom = null;
    const hid = heroId ?? s.heroes?.[s.heroTurnIndex ?? 0];
    if (!hid) {
        console.warn("[rescueCapturedBystander] No heroId available.");
        return;
    }

    const normFlag = String(flag || "").toLowerCase();
    if (normFlag !== "all" && normFlag !== "any") {
        console.warn("[rescueCapturedBystander] Unknown flag; only 'all' or 'any' are supported. Received:", flag);
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
    let lastRescuedFrom = null;

    const finalizeRescue = () => {
        if (lastRescuedFrom) {
            s.lastRescuedFrom = lastRescuedFrom;
        }

        if (rescuedCount > 0) {
            const heroName = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;
            console.log(`[rescueCapturedBystander] Hero ${hid} rescued ${rescuedCount} captured bystander(s).`);
            const nameList = rescuedNames.length ? rescuedNames.join(", ") : `${rescuedCount} bystander(s)`;
            const msg = rescuedNames.length === 1
                ? `${nameList} was rescued by ${heroName}.`
                : `Bystanders: ${nameList} were rescued by ${heroName}.`;
            appendGameLogEntry(msg, s);
            incrementRescuedBystanders(hid, rescuedCount, s);
            s._pendingRescueBystanderHero = hid;
            try {
                triggerRuleEffects("rescueBystander", { currentHeroId: hid, state: s });
            } catch (err) {
                console.warn("[rescueCapturedBystander] Failed to trigger rescueBystander effects", err);
            }
            s._pendingRescueBystanderHero = null;
            saveGameState(s);
            renderHeroHandBar(s);
        } else {
            console.log("[rescueCapturedBystander] No captured bystanders found to rescue.");
        }
    };

    const recordSource = (entry, slotIndex) => {
        if (!entry || entry.id == null) return;
        lastRescuedFrom = {
            foeId: String(entry.id),
            instanceId: getEntryKey(entry),
            slotIndex
        };
    };

    const rescueFromEntry = (entry, idx) => {
        if (!entry) return;

        const captured = entry.capturedBystanders;
        const slotIndex = typeof entry.slotIndex === "number" ? entry.slotIndex : idx;
        let rescuedHere = 0;

        if (Array.isArray(captured) && captured.length > 0) {
            captured.forEach(b => {
                const idStr = b?.id != null ? String(b.id) : null;
                if (idStr) {
                    heroState.hand.push(idStr);
                    rescuedCount += 1;
                    rescuedHere += 1;
                    if (b?.name) rescuedNames.push(String(b.name));
                }
            });
            entry.capturedBystanders = [];
        } else if (Number(captured) > 0) {
            // If stored as a number with no detail, log and clear
            console.warn(`[rescueCapturedBystander] Captured bystanders stored as count (${captured}) in city ${idx}; clearing without card ids.`);
            entry.capturedBystanders = [];
            rescuedCount += Number(captured);
            rescuedHere += Number(captured);
        }

        if (rescuedHere > 0) {
            recordSource(entry, slotIndex);
        }
    };

    const findEntryForSummary = (summary) => {
        if (!summary || !Array.isArray(s.cities)) return null;
        const slot = typeof summary.slotIndex === "number" ? summary.slotIndex : null;
        if (slot != null) {
            const entry = s.cities[slot];
            if (entry && entry.id != null && String(entry.id) === String(summary.foeId || summary.id)) {
                return { entry, slotIndex: slot };
            }
        }
        const key = summary.instanceId != null ? String(summary.instanceId) : null;
        const entry = s.cities.find(e => e && ((key && getEntryKey(e) === key) || String(e.id) === String(summary.foeId || summary.id)));
        return entry ? { entry, slotIndex: entry.slotIndex ?? s.cities.indexOf(entry) } : null;
    };

    if (normFlag === "any") {
        const targetSummary =
            selectedData?.selectedFoeSummary ||
            (selectedData?.foeEntry ? { foeId: selectedData.foeEntry.id, slotIndex: selectedData.slotIndex, instanceId: getEntryKey(selectedData.foeEntry) } : null);

        const candidates = Array.isArray(s.cities)
            ? s.cities
                .map((e, idx) => ({ entry: e, slotIndex: typeof e?.slotIndex === "number" ? e.slotIndex : idx }))
                .filter(({ entry }) =>
                    entry &&
                    (
                        (Array.isArray(entry.capturedBystanders) && entry.capturedBystanders.length > 0) ||
                        (Number(entry.capturedBystanders) > 0)
                    )
                )
            : [];

        let target = findEntryForSummary(targetSummary);

        if (!target && candidates.length) {
            target = candidates[0];
        }

        if (!candidates.length) {
            console.log("[rescueCapturedBystander] No foes with captured bystanders found for 'any' selection.");
            return;
        }

        if (typeof window !== "undefined") {
            window.__rescueCapturedSelectMode = {
                customHandler: ({ entry, slotIndex, state }) => {
                    const pending = (typeof window !== "undefined") ? window.__rescueCapturedSelectMode : null;
                    rescueFromEntry(entry, slotIndex);
                    finalizeRescue();
                    try { if (typeof window.__clearDamageFoeHighlights === "function") window.__clearDamageFoeHighlights(); } catch (e) {}
                    try { window.__rescueCapturedSelectMode = null; } catch (e) {}
                    saveGameState(state || s);

                    const callbacks = Array.isArray(pending?.afterResolve)
                        ? [...pending.afterResolve]
                        : [];
                    callbacks.forEach(cb => {
                        try { cb?.(); } catch (err) { console.warn("[rescueCapturedBystander] afterResolve callback failed", err); }
                    });
                },
                state: s,
                heroId: hid,
                requireBystanders: true,
                requireConfirm: true,
                confirmTitle: "Rescue Captured Bystanders",
                confirmMessage: "Rescue this foe's captured bystanders?",
                allowedSlots: candidates.map(c => c.slotIndex),
                afterResolve: []
            };
            highlightBystanderTargetSlots(s);
            try { showMightBanner("Choose a foe with captured bystanders to rescue them", 1800); } catch (e) {}
            return;
        }

        if (target) {
            rescueFromEntry(target.entry, target.slotIndex);
        } else {
            console.log("[rescueCapturedBystander] No foes with captured bystanders found for 'any' selection.");
        }
        finalizeRescue();
        return;
    }

    s.cities.forEach((entry, idx) => rescueFromEntry(entry, idx));
    finalizeRescue();
}

EFFECT_HANDLERS.rescueCapturedBystander = function(args = [], card, selectedData = {}) {
    const flag = args?.[0] ?? "all";
    const heroId = selectedData?.currentHeroId ?? null;
    rescueCapturedBystander(flag, heroId, gameState, selectedData);
};

function foeCaptureBystander(cityIndex, count = 1, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.cities)) {
        console.warn("[foeCaptureBystander] No cities array.");
        return;
    }

    const amt = Math.max(0, Number(count) || 0);
    if (amt <= 0) {
        console.warn("[foeCaptureBystander] Invalid count", count);
        return;
    }

    const applyToEntry = (entry, idx) => {
        if (!entry || entry.id == null) return;
        if (!Array.isArray(entry.capturedBystanders)) {
            const prevCount = Math.max(0, Number(entry.capturedBystanders) || 0);
            entry.capturedBystanders = [];
            for (let i = 0; i < prevCount; i++) {
                entry.capturedBystanders.push({
                    id: `bystander_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                    name: "Bystander",
                    type: "Bystander"
                });
            }
        }

        const foeCard = findCardInAllSources(entry.id);
        if (foeCard && !Array.isArray(foeCard.capturedBystanders)) {
            foeCard.capturedBystanders = [];
        }

        const addedNames = [];

        for (let i = 0; i < amt; i++) {
            const pick = bystanders[Math.floor(Math.random() * bystanders.length)] || {};
            const payload = {
                id: pick.id ?? `bystander_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                name: pick.name || "Bystander",
                type: pick.type || "Bystander"
            };
            entry.capturedBystanders.push(payload);
            if (foeCard && Array.isArray(foeCard.capturedBystanders)) {
                foeCard.capturedBystanders.push({ ...payload });
            }
            addedNames.push(payload.name || "Bystander");
        }

        const cityName = getCityNameFromIndex(idx + 1) || `city ${idx}`;
        const foeName = foeCard?.name || `Foe ${entry.id}`;
        const nameList = addedNames.join(", ");
        appendGameLogEntry(
            addedNames.length === 1
                ? `${foeName} captured ${nameList} in ${cityName}.`
                : `${foeName} captured bystanders (${nameList}) in ${cityName}.`,
            s
        );
    };

    const norm = String(cityIndex).toLowerCase();

    if (norm === "all" || norm === "allhenchmen" || norm === "allvillains") {
        const targetVillains = norm === "allvillains";
        const targetHench = norm === "allhenchmen";

        s.cities.forEach((entry, idx) => {
            if (!entry || entry.id == null) return;
            const card =
                villains.find(v => String(v.id) === String(entry.id)) ||
                henchmen.find(h => String(h.id) === String(entry.id));
            if (!card) return;
            const typeLower = String(card.type || "").toLowerCase();
            if (targetVillains && typeLower !== "villain") return;
            if (targetHench && typeLower !== "henchman") return;
            applyToEntry(entry, idx);
        });
        saveGameState(s);
        return;
    }

    const resolveCityIdx = (val) => {
        if (Number.isInteger(val)) return val;
        const asNum = Number(val);
        if (Number.isInteger(asNum)) return asNum;
        if (typeof val === "string") {
            const resolved = resolveNumericValue(val, null, s);
            if (Number.isInteger(resolved)) return resolved;
        }
        return null;
    };

    const idx = resolveCityIdx(cityIndex);
    if (!Number.isInteger(idx)) {
        console.warn("[foeCaptureBystander] Invalid arguments", { cityIndex, count });
        return;
    }

    if (!s.cities[idx] || s.cities[idx].id == null) {
        console.log("[foeCaptureBystander] No foe present at city slot", idx);
        return;
    }

    applyToEntry(s.cities[idx], idx);
    saveGameState(s);
}

EFFECT_HANDLERS.foeCaptureBystander = function(args = [], card, selectedData = {}) {
    const [cityIdx, count] = args;
    const s = selectedData?.state || gameState;

    // Expose current foe slot so numeric helper getCurrentCityIndex can resolve.
    const prevSlot = s._activeEffectFoeSlot;
    const hasPrev = Object.prototype.hasOwnProperty.call(s, "_activeEffectFoeSlot");
    let derivedSlot = undefined;
    if (typeof selectedData?.slotIndex === "number") {
        derivedSlot = selectedData.slotIndex;
    } else if (selectedData?.foeEntry && Array.isArray(s.cities)) {
        const key = getEntryKey(selectedData.foeEntry);
        const found = s.cities.findIndex(e => e && getEntryKey(e) === key);
        if (found >= 0) derivedSlot = found;
    }
    if (typeof derivedSlot === "number") {
        s._activeEffectFoeSlot = derivedSlot;
    }

    try {
        foeCaptureBystander(cityIdx, count ?? 1, s);
    } finally {
        if (typeof derivedSlot === "number" || hasPrev) {
            if (hasPrev) s._activeEffectFoeSlot = prevSlot;
            else delete s._activeEffectFoeSlot;
        }
    }
};

EFFECT_HANDLERS.damageHeroAtCity = function(args = [], card, selectedData = {}) {
    let cityIdx = args?.[0] ?? null;
    const amount = args?.[1] ?? 0;
    const s = selectedData?.state || gameState;

    if (typeof cityIdx === "string") {
        const lower = cityIdx.toLowerCase();
        const { left, right } = checkCoastalCities(s);
        if (lower === "leftcoastal") cityIdx = left;
        if (lower === "rightcoastal") cityIdx = right;
    }

    damageHeroAtCity(cityIdx, amount, s);
};

EFFECT_HANDLERS.setRevealedTopCardTrue = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    s.revealedTopVillain = true;
    try { saveGameState(s); } catch (_) {}
    try { showMightBanner("Top Card Revealed", 2000); } catch (err) { console.warn("[setRevealedTopCardTrue] Failed to show banner", err); }
};

function removeScanDisableSource(state, sourceKey) {
    if (!sourceKey) return;
    if (!Array.isArray(state.scanDisabledSources)) return;
    state.scanDisabledSources = state.scanDisabledSources.filter(k => k !== sourceKey);
    recomputeScanDisabled(state);
}

function ensureScanSourceSet(state) {
    if (!state.scanDisabledSources) state.scanDisabledSources = [];
    if (!Array.isArray(state.scanDisabledSources)) {
        state.scanDisabledSources = Array.from(new Set([String(state.scanDisabledSources)]));
    }
    return state.scanDisabledSources;
}

function recomputeScanDisabled(state) {
    const sources = Array.isArray(state.scanDisabledSources) ? state.scanDisabledSources : [];
    state.scanDisabled = !!(state.scanDisabledPermanent || sources.length > 0 || state.scanDisabledTemp);
}

EFFECT_HANDLERS.disableScan = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? (Array.isArray(s.heroes) ? s.heroes[s.heroTurnIndex ?? 0] : null);
    const modeRaw = args?.[0];
    const mode = typeof modeRaw === "string" ? modeRaw.toLowerCase() : modeRaw;
    const cardType = String(card?.type || "").toLowerCase();
    const sourceKey = card && card.id != null ? 'card-' + card.id : null;

    // Temporary: until end of this hero's next turn
    if (mode === "next" || mode === "nextround" || mode === "nextturn") {
        s.scanDisabledTemp = {
            expiresHeroId: heroId != null ? String(heroId) : null,
            armed: false
        };
        recomputeScanDisabled(s);
        appendGameLogEntry("Scanning is disabled until the end of this hero's next turn.", s);
        console.log("[disableScan] Scanning disabled temporarily (next turn).");
        saveGameState(s);
        return;
    }

    // Default path:
    // - Overlords stay permanent (matching existing behavior)
    // - Other sources track by id so they can be cleared when that source leaves play
    if (!mode || mode === "true" || mode === true) {
        if (cardType === "overlord") {
            s.scanDisabledPermanent = true;
            s.scanDisabled = true;
            appendGameLogEntry("Scanning is disabled.", s);
            console.log("[disableScan] Scanning disabled via effect (permanent overlord).");
            saveGameState(s);
            return;
        }

        const sources = ensureScanSourceSet(s);
        if (sourceKey && !sources.includes(sourceKey)) sources.push(sourceKey);
        recomputeScanDisabled(s);
        appendGameLogEntry("Scanning is disabled.", s);
        console.log("[disableScan] Scanning disabled via effect (tracked source).");
        saveGameState(s);
        return;
    }

    // Fallback: treat unknown args as tracked (non-permanent) to avoid locking forever
    const sources = ensureScanSourceSet(s);
    if (sourceKey && !sources.includes(sourceKey)) sources.push(sourceKey);
    recomputeScanDisabled(s);
    appendGameLogEntry("Scanning is disabled.", s);
    console.log("[disableScan] Scanning disabled via effect (fallback tracked).");
    saveGameState(s);
};

EFFECT_HANDLERS.gainMaxHPonFoeEscape = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    s._foeEscapeUseMaxHP = true;
    console.log("[gainMaxHPonFoeEscape] Flag set for next escape HP gain (max instead of current).");
};

function koCapturedBystander(flag = "all", state = gameState) {
    const s = state || gameState;
    const norm = String(flag || "all").toLowerCase();
    const koList = [];

    const addKo = (b, source) => {
        koList.push({
            id: b?.id,
            name: b?.name || "Bystander",
            type: b?.type || "Bystander",
            source
        });
    };

    const clearCapturedOnCard = (entry) => {
        if (!entry) return;
        const foeId = entry.id;
        if (foeId == null) return;
        const foeCard = findCardInAllSources(foeId);
        if (foeCard && Array.isArray(foeCard.capturedBystanders)) {
            foeCard.capturedBystanders = [];
        }
    };

    const entries = Array.isArray(s.cities) ? s.cities : [];

    if (norm === "all") {
        entries.forEach((entry, idx) => {
            if (!entry) return;
            const captured = entry.capturedBystanders;
            if (Array.isArray(captured) && captured.length > 0) {
                captured.forEach(b => addKo(b, `city-${idx}`));
                entry.capturedBystanders = [];
                clearCapturedOnCard(entry);
            } else if (Number(captured) > 0) {
                for (let i = 0; i < Number(captured); i++) addKo({ name: "Bystander" }, `city-${idx}`);
                entry.capturedBystanders = [];
                clearCapturedOnCard(entry);
            }
        });
    } else if (norm === "random") {
        const pool = [];
        entries.forEach((entry, idx) => {
            if (!entry) return;
            const captured = entry.capturedBystanders;
            if (Array.isArray(captured)) {
                captured.forEach((b, i) => pool.push({ entry, idx, bIndex: i, b }));
            } else if (Number(captured) > 0) {
                pool.push({ entry, idx, bIndex: -1, b: { name: "Bystander" } });
            }
        });
        if (pool.length) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            addKo(pick.b, `city-${pick.idx}`);
            if (Array.isArray(pick.entry.capturedBystanders)) {
                pick.entry.capturedBystanders.splice(pick.bIndex, 1);
            } else {
                pick.entry.capturedBystanders = Math.max(0, Number(pick.entry.capturedBystanders || 1) - 1);
            }
            clearCapturedOnCard(pick.entry);
        }
    } else {
        console.warn("[koCapturedBystander] Unknown flag:", flag);
        return;
    }

    if (!koList.length) {
        console.log("[koCapturedBystander] No captured bystanders found.");
        return;
    }

    if (!Array.isArray(s.koCards)) s.koCards = [];
    s.koCards.push(...koList);

    try {
        if (typeof window !== "undefined" && typeof window.renderKOBar === "function") {
            window.renderKOBar(s);
        }
    } catch (err) {
        console.warn("[koCapturedBystander] Failed to render KO bar", err);
    }

    maybeTriggerEvilWinsConditions(s);

    const total = koList.length;
    const names = koList.map(k => k.name || "Bystander").join(", ");
    appendGameLogEntry(
        total === 1
            ? `${names} was KO'd.`
            : `Bystanders KO'd: ${names}.`,
        s
    );

    saveGameState(s);
}

EFFECT_HANDLERS.koCapturedBystander = function(args = [], card, selectedData = {}) {
    const flag = args?.[0] ?? "all";
    koCapturedBystander(flag, selectedData?.state || gameState);
};

EFFECT_HANDLERS.evilWins = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    const reason = selectedData?.reason || `Evil Wins condition triggered by ${card?.name || "a card"}.`;
    s.forcedOutcome = { outcome: "loss", reason };
    try {
        checkGameEndConditions(s);
    } catch (err) {
        console.warn("[evilWins] Failed to process game over", err);
    }
};

// Looping variant: repeat a damageFoe selection multiple times (only supports "any" flag for now)
EFFECT_HANDLERS.damageFoeMulti = function (args = [], card, selectedData = {}) {
    const heroId =
        selectedData?.currentHeroId
        ?? gameState.heroes?.[gameState.heroTurnIndex ?? 0]
        ?? null;
    const state = selectedData?.state || gameState;
    const amount = Number(args?.[0]) || 0;
    const times = Math.max(1, Number(args?.[1]) || 1);
    const flag = (args?.[2] ?? "any").toString().toLowerCase();

    if (flag !== "any") {
        console.warn("[damageFoeMulti] Only 'any' flag is supported currently.");
        return;
    }
    if (typeof window === "undefined") {
        console.warn("[damageFoeMulti] Requires browser UI for selection.");
        return;
    }

    let remaining = times;

    const runNext = () => {
        if (remaining <= 0) return;
        remaining -= 1;

        // Queue the single selection
        damageFoe(amount, flag, heroId, state, { flag: "any" });

        // Wait for the selection flow to clear before starting another
        const waitForClear = () => {
            if (window.__damageFoeSelectMode) {
                setTimeout(waitForClear, 60);
            } else {
                runNext();
            }
        };
        waitForClear();
    };

    runNext();
};

function addPermanentKOTag(heroState, cardId) {
    if (!heroState) return;
    if (!Array.isArray(heroState.permanentKO)) heroState.permanentKO = [];
    heroState.permanentKO.push(String(cardId));
}

export function buildPermanentKOCountMap(heroState) {
    const map = {};
    const list = Array.isArray(heroState?.permanentKO) ? heroState.permanentKO : [];
    list.forEach(id => {
        const key = String(id);
        map[key] = (map[key] || 0) + 1;
    });
    return map;
}

function koTopHeroDiscard(countOrFlag = "all", who = "all", state = gameState) {
    const s = state || gameState;
    const heroesArr = Array.isArray(s.heroes) ? s.heroes : [];
    if (!heroesArr.length) return;

    let count = 1;
    let targetSpec = who;

    if (Number.isFinite(Number(countOrFlag))) {
        count = Math.max(1, Number(countOrFlag) || 1);
    } else {
        targetSpec = countOrFlag;
    }

    const norm = String(targetSpec || "all").toLowerCase();
    const pickHeroes = () => {
        const withDiscard = heroesArr.filter(hid => (s.heroData?.[hid]?.discard || []).length > 0);
        if (!withDiscard.length) return [];
        if (norm === "current") {
            const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
            const hid = heroesArr[idx];
            return hid ? [hid] : [];
        }
        if (norm === "random") {
            const pick = withDiscard[Math.floor(Math.random() * withDiscard.length)];
            return [pick];
        }
        return withDiscard;
    };

    const targets = pickHeroes();
    if (!targets.length) {
        console.log("[koTopHeroDiscard] No hero discard piles with cards.");
        return;
    }

    const koList = [];

    targets.forEach(hid => {
        const hState = s.heroData?.[hid];
        if (!hState || !Array.isArray(hState.discard) || !hState.discard.length) return;
        const heroName = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;
        const storedMainCards = [];
        for (let i = 0; i < count; i++) {
            if (!hState.discard.length) break;
            const cardId = hState.discard.pop();
            const cardData = findCardInAllSources(cardId);
            const cardName = cardData?.name || `Card ${cardId}`;
            const cardType = cardData?.type || "";

            if (String(cardType).toLowerCase() === "main") {
                // Permanently KO main cards stay in discard and are never drawn again.
                addPermanentKOTag(hState, cardId);
                storedMainCards.push(cardId);
                try {
                    appendGameLogEntry(`${cardName} is permanently KO'd for ${heroName}.`, s);
                } catch (err) {
                    console.warn("[koTopHeroDiscard] Failed to log permanent KO.", err);
                }
            } else {
                koList.push({
                    id: cardId,
                    name: cardName,
                    type: cardType || "Hero Card",
                    source: "koTopHeroDiscard",
                    heroId: hid
                });
            }
        }
        if (storedMainCards.length) {
            for (let i = storedMainCards.length - 1; i >= 0; i--) {
                // Place main cards at the bottom so multiple KO counts don't keep hitting the same top card.
                hState.discard.unshift(storedMainCards[i]);
            }
        }
    });

    if (koList.length) {
        if (!Array.isArray(s.koCards)) s.koCards = [];
        s.koCards.push(...koList);
        try {
            if (typeof window !== "undefined" && typeof window.renderKOBar === "function") {
                window.renderKOBar(s);
            }
        } catch (err) {
            console.warn("[koTopHeroDiscard] Failed to render KO bar.", err);
        }
        const names = koList.map(k => k.name || "Card").join(", ");
        appendGameLogEntry(
            koList.length === 1
                ? `${names} was KO'd from a discard pile.`
                : `Cards KO'd from discard: ${names}.`,
            s
        );
    }

    saveGameState(s);
}

EFFECT_HANDLERS.koTopHeroDiscard = function(args = [], card, selectedData = {}) {
    const a0 = args?.[0];
    const a1 = args?.[1];
    const count = Number.isFinite(Number(a0)) ? a0 : 1;
    const who = Number.isFinite(Number(a0)) ? (a1 ?? "all") : (a0 ?? "all");
    koTopHeroDiscard(count, who, selectedData?.state || gameState);
};

function koTopHeroCard(count = 1, who = "current", state = gameState) {
    const s = state || gameState;
    const heroesArr = Array.isArray(s.heroes) ? s.heroes : [];
    if (!heroesArr.length) return;

    const num = Math.max(1, Number(count) || 1);
    const norm = String(who || "current").toLowerCase();
    const targetHeroes = norm === "all"
        ? heroesArr
        : (() => {
            const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
            const hid = heroesArr[idx];
            return hid ? [hid] : [];
        })();

    const koList = [];

    targetHeroes.forEach(hid => {
        const hState = s.heroData?.[hid];
        if (!hState || !Array.isArray(hState.deck)) return;
        if (!Array.isArray(hState.discard)) hState.discard = [];
        const heroName = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;

        for (let i = 0; i < num; i++) {
            if (!hState.deck.length) break;
            const cardId = hState.deck.shift();
            const cardData = findCardInAllSources(cardId);
            const cardName = cardData?.name || `Card ${cardId}`;
            const cardType = cardData?.type || "";

            // Move to discard first
            hState.discard.push(cardId);

            if (String(cardType).toLowerCase() === "main") {
                addPermanentKOTag(hState, cardId);
                try {
                    appendGameLogEntry(`${cardName} is permanently KO'd for ${heroName}.`, s);
                } catch (err) {
                    console.warn("[koTopHeroCard] Failed to log permanent KO.", err);
                }
            } else {
                // Remove from discard and add to KO pile
                hState.discard.pop();
                koList.push({
                    id: cardId,
                    name: cardName,
                    type: cardType || "Hero Card",
                    source: "koTopHeroCard",
                    heroId: hid
                });
            }
        }
    });

    if (koList.length) {
        if (!Array.isArray(s.koCards)) s.koCards = [];
        s.koCards.push(...koList);
        try {
            if (typeof window !== "undefined" && typeof window.renderKOBar === "function") {
                window.renderKOBar(s);
            }
        } catch (err) {
            console.warn("[koTopHeroCard] Failed to render KO bar.", err);
        }
        const names = koList.map(k => k.name || "Card").join(", ");
        appendGameLogEntry(
            koList.length === 1
                ? `${names} was KO'd from the top of a deck.`
                : `Cards KO'd from decks: ${names}.`,
            s
        );
    }

    saveGameState(s);
}

EFFECT_HANDLERS.koTopHeroCard = function(args = [], card, selectedData = {}) {
    const count = args?.[0] ?? 1;
    const who = args?.[1] ?? "current";
    koTopHeroCard(count, who, selectedData?.state || gameState);
};

function shuffleHeroDeck(who = "current", state = gameState) {
    const s = state || gameState;
    const heroesArr = Array.isArray(s.heroes) ? s.heroes : [];
    if (!heroesArr.length) return;

    const norm = String(who || "current").toLowerCase();
    const targetHeroes = norm === "all"
        ? heroesArr
        : (() => {
            const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
            const hid = heroesArr[idx];
            return hid ? [hid] : [];
        })();

    targetHeroes.forEach(hid => {
        const hState = s.heroData?.[hid];
        if (!hState) return;
        const discard = Array.isArray(hState.discard) ? hState.discard : [];
        if (!discard.length) return;

        const permaMap = buildPermanentKOCountMap(hState);
        const stayInDiscard = [];
        const toDeck = [];

        discard.forEach(id => {
            const key = String(id);
            const remain = permaMap[key] || 0;
            if (remain > 0) {
                permaMap[key] = remain - 1;
                stayInDiscard.push(id);
            } else {
                toDeck.push(id);
            }
        });

        if (!toDeck.length) return;

        const deckArr = Array.isArray(hState.deck) ? hState.deck : [];
        hState.deck = shuffle([...deckArr, ...toDeck]);
        hState.discard = stayInDiscard;

        const heroName = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;
        appendGameLogEntry(`${heroName}'s discard was shuffled into their deck.`, s);
    });

    saveGameState(s);
}

EFFECT_HANDLERS.shuffleHeroDeck = function(args = [], card, selectedData = {}) {
    const who = args?.[0] ?? "current";
    shuffleHeroDeck(who, selectedData?.state || gameState);
};

EFFECT_HANDLERS.disableExtraTravel = function(args = [], card, selectedData = {}) {
    // Signature: disableExtraTravel(all,next)
    const target = args?.[0] ?? "all";
    const duration = String(args?.[1] ?? "next").toLowerCase();
    const state = selectedData?.state || gameState;
    if (!state) return;

    const heroCount = Array.isArray(state.heroes) && state.heroes.length ? state.heroes.length : 1;
    const turns = duration === "next" ? heroCount : 0; // lasts until end of this hero's next turn
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

    const heroCount = Array.isArray(state.heroes) && state.heroes.length ? state.heroes.length : 1;
    const turns = duration === "next" ? heroCount : 0; // lasts until end of this hero's next turn
    if (typeof state.turnCounter !== "number") state.turnCounter = 0;

    state.extraDrawDampener = {
        target: String(target || "all").toLowerCase(),
        expiresAtTurnCounter: state.turnCounter + turns,
        active: true
    };

    appendGameLogEntry(`Draws Dampened: All Heroes will only be able to draw 1 card until after this Hero's next turn.`, state);
    saveGameState(state);
};

function setIconAbilityDampener(target = "current", duration = "next", state = gameState) {
    const s = state || gameState;
    if (!s) return;
    if (typeof s.turnCounter !== "number") s.turnCounter = 0;

    const normTarget = String(target || "current").toLowerCase();
    const normDuration = String(duration || "next").toLowerCase();
    let expiresAtTurnCounter = null;
    if (normDuration === "current") {
        expiresAtTurnCounter = s.turnCounter;
    } else if (normDuration === "next") {
        expiresAtTurnCounter = s.turnCounter + 1;
    } else if (normDuration === "nextend" || normDuration === "endnext") {
        // Lasts through the end of the hero's next turn
        expiresAtTurnCounter = s.turnCounter + 2;
    } else if (normDuration === "permanent") {
        expiresAtTurnCounter = null;
    }

    let heroId = null;
    if (normTarget === "current") {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        heroId = Array.isArray(s.heroes) ? s.heroes[idx] : null;
    }

    s.iconAbilityDampener = {
        target: normTarget,
        heroId,
        expiresAtTurnCounter,
        active: true
    };

    let whoText = "All Heroes";
    if (normTarget === "current" && heroId != null) {
        const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
        whoText = heroName;
    }

    const durationText =
        normDuration === "permanent"
            ? "for the rest of the game"
            : (normDuration === "next" ? "until the end of this Hero's next turn" : "for this turn");

    appendGameLogEntry(`${whoText} cannot use icon abilities ${durationText}.`, s);
    saveGameState(s);
}

EFFECT_HANDLERS.disableIconAbilities = function(args = [], card, selectedData = {}) {
    const who = args?.[0] ?? "current";
    const howLong = args?.[1] ?? "next";
    setIconAbilityDampener(who, howLong, selectedData?.state || gameState);
};

function setRetreatDampener(target = "current", duration = "next", state = gameState) {
    const s = state || gameState;
    if (!s) return;
    if (typeof s.turnCounter !== "number") s.turnCounter = 0;
    const heroCount = Array.isArray(s.heroes) && s.heroes.length ? s.heroes.length : 1;

    const normTarget = String(target || "current").toLowerCase();
    const normDuration = String(duration || "next").toLowerCase();
    let expiresAtTurnCounter = null;
    if (normDuration === "current") expiresAtTurnCounter = s.turnCounter + 1;
    else if (normDuration === "next") expiresAtTurnCounter = s.turnCounter + heroCount;
    else if (normDuration === "permanent") expiresAtTurnCounter = null;

    let heroId = null;
    if (normTarget === "current") {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        heroId = Array.isArray(s.heroes) ? s.heroes[idx] : null;
    }

    s.retreatDampener = {
        target: normTarget,
        heroId,
        expiresAtTurnCounter,
        active: true
    };

    let whoText = "All Heroes";
    if (normTarget === "current" && heroId != null) {
        const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
        whoText = heroName;
    }

    const durationText =
        normDuration === "permanent"
            ? "for the rest of the game"
            : (normDuration === "next" ? "until the end of their next turn" : "for this turn");

    appendGameLogEntry(`${whoText} cannot retreat ${durationText}.`, s);
    saveGameState(s);
}

EFFECT_HANDLERS.disableRetreat = function(args = [], card, selectedData = {}) {
    const who = args?.[0] ?? "current";
    const howLong = args?.[1] ?? "next";
    setRetreatDampener(who, howLong, selectedData?.state || gameState);
};

function setHeroDTforHero(heroId, value, duration = "next", state = gameState, meta = {}) {
    const s = state || gameState;
    if (!heroId || s == null) return;
    if (typeof s.turnCounter !== "number") s.turnCounter = 0;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroState = s.heroData?.[heroId];
    if (!heroObj || !heroState) return;

    const normDuration = String(duration || "next").toLowerCase();
    const isEndNext = ["endnext", "endnextturn", "nextend", "end_of_next", "end_of_next_turn"].includes(normDuration);
    let expiresAtTurnCounter = null;
    if (normDuration === "current") expiresAtTurnCounter = s.turnCounter;
    else if (normDuration === "next") expiresAtTurnCounter = s.turnCounter + 1;
    else if (isEndNext) expiresAtTurnCounter = s.turnCounter + 2;
    else if (normDuration === "permanent") expiresAtTurnCounter = null;

    heroState.tempDT = {
        value: Number(value) || 0,
        expiresAtTurnCounter,
        sourceType: meta.sourceType || null,
        sourceId: meta.sourceId || null
    };

    const durationText =
        normDuration === "permanent"
            ? "for the rest of the game"
            : (isEndNext
                ? "until the end of their next turn"
                : (normDuration === "next" ? "until the start of their next turn" : "for this turn"));
    appendGameLogEntry(`${heroObj.name}'s Damage Threshold is now ${Number(value) || 0} ${durationText}.`, s);
    try { updateBoardHeroHP(heroId); } catch (e) {}
}

EFFECT_HANDLERS.setHeroDTtoX = function(args = [], card, selectedData = {}) {
    const whoRaw = args?.[0] ?? "current";
    const who = String(whoRaw).toLowerCase();
    const val = Number(args?.[1] ?? 0) || 0;
    const duration = args?.[2] ?? "next";
    const sourceIdArg = args?.[3] ?? null;
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;

    const meta = {
        sourceType: selectedData?.source || (card?.type === "Scenario" ? "scenario" : "effect"),
        sourceId: selectedData?.scenarioId || card?.id || sourceIdArg || null
    };

    const heroIds = s.heroes;
    if (who === "all") {
        heroIds.forEach(hid => setHeroDTforHero(hid, val, duration, s, meta));
    } else if (who === "random") {
        const alive = heroIds.filter(hid => s.heroData?.[hid]);
        if (!alive.length) return;
        const pick = alive[Math.floor(Math.random() * alive.length)];
        setHeroDTforHero(pick, val, duration, s, meta);
    } else if (who === "current") {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        const currentId = heroIds[idx];
        if (currentId != null) setHeroDTforHero(currentId, val, duration, s, meta);
    } else {
        // Team handling: apply to all heroes matching the provided team key
        const teamKey = String(whoRaw || "").toLowerCase();
        heroIds.forEach(hid => {
            const hObj = heroes.find(h => String(h.id) === String(hid));
            if (!hObj) return;
            if (heroMatchesTeam(hObj, teamKey)) {
                setHeroDTforHero(hid, val, duration, s, meta);
            }
        });
    }
    saveGameState(s);
};

EFFECT_HANDLERS.decreaseHeroDT = function(args = [], card, selectedData = {}) {
    const targetRaw = args?.[0] ?? "current";
    const amount = Math.max(0, Number(args?.[1] ?? 0) || 0);
    let duration = args?.[2] ?? "permanent";
    const sourceIdArg = args?.[3] ?? null;
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;

    // Normalize duration aliases
    const durLower = String(duration || "").toLowerCase();
    if (durLower === "currentturn") duration = "current";

    const meta = {
        sourceType: selectedData?.source || (card?.type === "Scenario" ? "scenario" : "effect"),
        sourceId: selectedData?.scenarioId || card?.id || sourceIdArg || null
    };

    const heroIds = s.heroes;
    const norm = String(targetRaw || "").toLowerCase();

    const applyToHero = (hid) => {
        const hObj = heroes.find(h => String(h.id) === String(hid));
        if (!hObj) return;
        const baseDT = Number(hObj.damageThreshold || 1) || 1;
        const newVal = Math.max(1, baseDT - amount);
        setHeroDTforHero(hid, newVal, duration || "permanent", s, meta);
    };

    if (norm === "all") {
        heroIds.forEach(applyToHero);
    } else if (norm === "random") {
        const alive = heroIds.filter(hid => s.heroData?.[hid]);
        if (!alive.length) return;
        const pick = alive[Math.floor(Math.random() * alive.length)];
        applyToHero(pick);
    } else if (norm === "current" || norm === "currenthero") {
        let target = selectedData?.currentHeroId;
        if (target == null) {
            const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
            target = heroIds[idx];
        }
        if (target != null) applyToHero(target);
    } else {
        // Treat as explicit hero id or team key
        const asHero = heroIds.find(hid => String(hid) === String(targetRaw));
        if (asHero != null) {
            applyToHero(asHero);
        } else {
            heroIds.forEach(hid => {
                const hObj = heroes.find(h => String(h.id) === String(hid));
                if (!hObj) return;
                if (heroMatchesTeam(hObj, norm)) {
                    applyToHero(hid);
                }
            });
        }
    }

    saveGameState(s);
};

EFFECT_HANDLERS.increaseHeroDT = function(args = [], card, selectedData = {}) {
    const whoRaw = args?.[0] ?? "current";
    const amount = Math.max(0, Number(args?.[1] ?? 0) || 0);
    const duration = args?.[2] ?? "permanent";
    const sourceIdArg = args?.[3] ?? null;
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;

    const meta = {
        sourceType: selectedData?.source || (card?.type === "Scenario" ? "scenario" : "effect"),
        sourceId: selectedData?.scenarioId || card?.id || sourceIdArg || null
    };

    const heroIds = s.heroes;
    const normWho = String(whoRaw || "current").toLowerCase();

    const applyToHero = (hid) => {
        const hObj = heroes.find(h => String(h.id) === String(hid));
        if (!hObj) return;
        const baseDT = Number(hObj.damageThreshold || 1) || 1;
        const newVal = Math.max(1, baseDT + amount);
        setHeroDTforHero(hid, newVal, duration || "permanent", s, meta);
    };

    if (normWho === "all") {
        heroIds.forEach(applyToHero);
    } else if (normWho === "random") {
        const alive = heroIds.filter(hid => s.heroData?.[hid]);
        if (!alive.length) return;
        const pick = alive[Math.floor(Math.random() * alive.length)];
        applyToHero(pick);
    } else if (normWho === "current" || normWho === "currenthero") {
        let target = selectedData?.currentHeroId;
        if (target == null) {
            const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
            target = heroIds[idx];
        }
        if (target != null) applyToHero(target);
    } else {
        // Team key support
        heroIds.forEach(hid => {
            const hObj = heroes.find(h => String(h.id) === String(hid));
            if (!hObj) return;
            if (heroMatchesTeam(hObj, normWho)) {
                applyToHero(hid);
            }
        });
    }

    saveGameState(s);
};

EFFECT_HANDLERS.koMightFromVD = function(args = [], card, selectedData = {}) {
    const count = Math.max(1, Number(args?.[0] ?? 1) || 1);
    const state = selectedData?.state || gameState;
    if (!state || !Array.isArray(state.villainDeck)) return;

    let ptr = Number.isInteger(state.villainDeckPointer) ? state.villainDeckPointer : 0;
    let removed = 0;
    let idx = Math.max(0, ptr);

    while (idx < state.villainDeck.length && removed < count) {
        const id = state.villainDeck[idx];
        const data = findCardInAllSources(id);
        const isMight = (String(id) === "7001") || (String(data?.type || "").toLowerCase() === "might");
        if (isMight) {
            const name = data?.name || "Might of the Overlord";
            state.villainDeck.splice(idx, 1);
            if (!Array.isArray(state.koCards)) state.koCards = [];
            state.koCards.push({
                id: String(id),
                name,
                type: "Might",
                source: "koMightFromVD",
                permanentKO: true
            });
            removed++;
            try { appendGameLogEntry(`KO'd ${name} from the Villain Deck.`, state); } catch (_) {}
            continue;
        }
        idx++;
    }

    if (!Number.isInteger(state.villainDeckPointer)) {
        state.villainDeckPointer = ptr;
    } else {
        state.villainDeckPointer = Math.min(state.villainDeckPointer, state.villainDeck.length);
    }

    if (removed === 0) {
        try { appendGameLogEntry("No Might of the Overlord card found to KO in the Villain Deck.", state); } catch (_) {}
    }

    saveGameState(state);
};

EFFECT_HANDLERS.skipVillainDeckDraw = function(args = [], card, selectedData = {}) {
    const count = Math.max(1, Number(args?.[0] ?? 1) || 1);
    const state = selectedData?.state || gameState;
    if (!state) return;
    const prior = Number(state.villainDrawSkipCount) || 0;
    state.villainDrawSkipCount = prior + count;
};

EFFECT_HANDLERS.koTopVillainDeck = function(args = [], card, selectedData = {}) {
    const count = Math.max(1, Number(args?.[0] ?? 1) || 1);
    const state = selectedData?.state || gameState;
    if (!state || !Array.isArray(state.villainDeck)) return;

    if (!Array.isArray(state.koCards)) state.koCards = [];
    const ptr = Number.isInteger(state.villainDeckPointer) ? state.villainDeckPointer : 0;

    const removed = state.villainDeck.splice(ptr, count);
    removed.forEach(id => {
        const data = findCardInAllSources(id);
        state.koCards.push({
            id: String(id),
            name: data?.name || `Card ${id}`,
            type: data?.type || "Villain",
            source: "koTopVillainDeck"
        });
    });

    state.villainDeckPointer = Math.min(ptr, state.villainDeck.length);

    try {
        if (removed.length) {
            const names = removed
                .map(id => findCardInAllSources(id)?.name || `Card ${id}`)
                .join(", ");
            appendGameLogEntry(`KO'd from top of Villain Deck: ${names}.`, state);
        } else {
            appendGameLogEntry("No cards to KO from the Villain Deck.", state);
        }
    } catch (_) {}

    saveGameState(state);
};

EFFECT_HANDLERS.mill = function(args = [], card, selectedData = {}) {
    const count = Math.max(1, Number(args?.[0] ?? 1) || 1);
    const whoRaw = args?.[1] ?? "current";
    const state = selectedData?.state || gameState;
    if (!state || !Array.isArray(state.heroes)) return;

    const heroIds = state.heroes;
    const normWho = String(whoRaw || "current").toLowerCase();

    const applyToHero = (hid) => {
        const hState = state.heroData?.[hid];
        if (!hState) return;
        if (!Array.isArray(hState.deck)) hState.deck = [];
        if (!Array.isArray(hState.discard)) hState.discard = [];
        for (let i = 0; i < count; i++) {
            if (!hState.deck.length) break;
            const cardId = hState.deck.shift();
            hState.discard.push(cardId);
        }
    };

    if (normWho === "all") {
        heroIds.forEach(hid => applyToHero(hid));
    } else {
        let target = selectedData?.currentHeroId;
        if (target == null) {
            const idx = typeof state.heroTurnIndex === "number" ? state.heroTurnIndex : 0;
            target = heroIds[idx];
        }
        if (target != null) applyToHero(target);
    }

    saveGameState(state);
};

EFFECT_HANDLERS.dismissTempPassives = function(args = [], card, selectedData = {}) {
    const whoRaw = args?.[0] ?? "current";
    const state = selectedData?.state || gameState;
    if (!state || !Array.isArray(state.heroes)) return;

    const heroIds = state.heroes;
    const normWho = String(whoRaw || "current").toLowerCase();

    const clearForHero = (hid) => {
        const hState = state.heroData?.[hid];
        if (!hState || !Array.isArray(hState.tempAbilities)) return;
        const heroObj = heroes.find(h => String(h.id) === String(hid));
        const baseLen = Array.isArray(heroObj?.abilitiesEffects) ? heroObj.abilitiesEffects.length : 0;

        hState.tempAbilities = [];
        if (hState.currentUses) {
            Object.keys(hState.currentUses).forEach(key => {
                const idxNum = Number(key);
                if (idxNum >= baseLen) delete hState.currentUses[key];
            });
        }
        if (heroObj?.currentUses) {
            Object.keys(heroObj.currentUses).forEach(key => {
                const idxNum = Number(key);
                if (idxNum >= baseLen) delete heroObj.currentUses[key];
            });
        }
    };

    if (normWho === "all") {
        heroIds.forEach(hid => clearForHero(hid));
    } else {
        let target = selectedData?.currentHeroId;
        if (target == null) {
            const idx = typeof state.heroTurnIndex === "number" ? state.heroTurnIndex : 0;
            target = heroIds[idx];
        }
        if (target != null) clearForHero(target);
    }

    saveGameState(state);
};

function loseIconUseForHero(heroId, count = 1, mode = "random", state = gameState) {
    const s = state || gameState;
    if (!heroId) return;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const hState = s.heroData?.[heroId];
    if (!heroObj || !hState) return;

    const { effects, names } = getHeroAbilitiesWithTemp(heroId, s);
    const candidates = [];

    effects.forEach((eff, idx) => {
        if (!eff || (eff.type || "").toLowerCase() === "passive") return;
        const usesMax = Number(eff.uses || 0);
        if (!Number.isFinite(usesMax) || usesMax <= 0) return;
        const remaining = hState.currentUses?.[idx] == null ? usesMax : Number(hState.currentUses[idx]);
        if (remaining <= 0) return;
        candidates.push({ idx, remaining, usesMax, name: names?.[idx]?.text || `Ability ${idx + 1}` });
    });

    if (!candidates.length) return;

    let picked;
    const normMode = String(mode || "random").toLowerCase();
    if (normMode === "highest") {
        const maxRemain = Math.max(...candidates.map(c => c.remaining));
        const tops = candidates.filter(c => c.remaining === maxRemain);
        picked = tops[Math.floor(Math.random() * tops.length)];
    } else {
        picked = candidates[Math.floor(Math.random() * candidates.length)];
    }

    if (!picked) return;

    const newRemaining = Math.max(0, picked.remaining - Math.max(1, Number(count) || 0));
    if (!hState.currentUses) hState.currentUses = {};
    hState.currentUses[picked.idx] = newRemaining;
    heroObj.currentUses = heroObj.currentUses || {};
    heroObj.currentUses[picked.idx] = newRemaining;

    const heroName = heroObj.name || `Hero ${heroId}`;
    appendGameLogEntry(`${heroName} lost ${Math.max(1, Number(count) || 0)} use(s) of ${picked.name}.`, s);
}

EFFECT_HANDLERS.loseIconUse = function(args = [], card, selectedData = {}) {
    const who = String(args?.[0] ?? "current").toLowerCase();
    const amount = Math.max(1, Number(args?.[1] ?? 1) || 1);
    const mode = args?.[2] ?? "random";
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;

    const heroIds = s.heroes;

    if (who === "all") {
        heroIds.forEach(hid => loseIconUseForHero(hid, amount, mode, s));
    } else if (who === "random") {
        const alive = heroIds.filter(hid => s.heroData?.[hid]);
        if (!alive.length) return;
        const pick = alive[Math.floor(Math.random() * alive.length)];
        loseIconUseForHero(pick, amount, mode, s);
    } else {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        const currentId = heroIds[idx];
        if (currentId != null) {
            loseIconUseForHero(currentId, amount, mode, s);
        }
    }

    saveGameState(s);
};

function pruneDoubleDamageMods(state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.doubleDamageHeroModifiers)) return;
    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    s.doubleDamageHeroModifiers = s.doubleDamageHeroModifiers.filter(mod => {
        if (!mod) return false;
        if (typeof mod.expiresAtTurnCounter === "number" && turn >= mod.expiresAtTurnCounter) return false;
        return true;
    });
}

function addDoubleDamageModifier(whoRaw = "current", duration = "next", state = gameState, meta = {}) {
    const s = state || gameState;
    if (!s) return;
    if (typeof s.turnCounter !== "number") s.turnCounter = 0;
    if (!Array.isArray(s.doubleDamageHeroModifiers)) s.doubleDamageHeroModifiers = [];
    pruneDoubleDamageMods(s);

    const normWho = String(whoRaw || "current").toLowerCase();
    const normDuration = String(duration || "next").toLowerCase();
    const heroCount = Array.isArray(s.heroes) && s.heroes.length ? s.heroes.length : 1;
    let expiresAtTurnCounter = null;
    if (normDuration === "current") expiresAtTurnCounter = s.turnCounter + 1;
    else if (normDuration === "next") expiresAtTurnCounter = s.turnCounter + heroCount;
    else if (normDuration === "permanent") expiresAtTurnCounter = null;

    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    const modsToAdd = [];

    if (normWho === "all") {
        modsToAdd.push({ type: "all" });
    } else if (normWho === "random") {
        const alive = heroIds.filter(hid => s.heroData?.[hid]);
        if (alive.length) {
            const pick = alive[Math.floor(Math.random() * alive.length)];
            modsToAdd.push({ type: "hero", heroId: pick });
        }
    } else if (normWho === "current") {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        const hid = heroIds[idx];
        if (hid != null) modsToAdd.push({ type: "hero", heroId: hid });
    } else {
        modsToAdd.push({ type: "team", team: normWho });
    }

    modsToAdd.forEach(mod => {
        s.doubleDamageHeroModifiers.push({
            ...mod,
            expiresAtTurnCounter,
            active: true,
            sourceType: meta.sourceType || null,
            sourceId: meta.sourceId || null
        });
    });

    let desc = "";
    if (modsToAdd.some(m => m.type === "all")) desc = "All Heroes";
    else if (modsToAdd.some(m => m.type === "team")) desc = `${whoRaw} Heroes`;
    else if (modsToAdd.length === 1 && modsToAdd[0].type === "hero") {
        const hid = modsToAdd[0].heroId;
        const name = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;
        desc = name;
    } else {
        desc = "Selected heroes";
    }

    const durationText =
        normDuration === "permanent"
            ? "for the rest of the game"
            : (normDuration === "next" ? "until the end of this Hero's next turn" : "for this turn");
    appendGameLogEntry(`${desc} take double damage ${durationText}.`, s);
    saveGameState(s);
}

function applyIncomingDoubleDamage(amount, heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId || amount <= 0) return amount;
    pruneDoubleDamageMods(s);
    const mods = Array.isArray(s.doubleDamageHeroModifiers) ? s.doubleDamageHeroModifiers : [];
    if (!mods.length) return amount;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) return amount;

    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    const match = mods.some(mod => {
        if (!mod || !mod.active) return false;
        if (typeof mod.expiresAtTurnCounter === "number" && turn >= mod.expiresAtTurnCounter) return false;
        if (mod.type === "all") return true;
        if (mod.type === "hero" && mod.heroId != null && String(mod.heroId) === String(heroId)) return true;
        if (mod.type === "team" && mod.team) return heroMatchesTeam(heroObj, mod.team);
        return false;
    });

    return match ? amount * 2 : amount;
}

// Outgoing (hero deals double damage to foes/overlord)
function pruneHeroOutgoingDoubleDamageMods(state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.doubleDamageHeroOutgoingMods)) return;
    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    s.doubleDamageHeroOutgoingMods = s.doubleDamageHeroOutgoingMods.filter(mod => {
        if (!mod) return false;
        if (typeof mod.expiresAtTurnCounter === "number" && turn >= mod.expiresAtTurnCounter) return false;
        return true;
    });
}

function addHeroOutgoingDoubleDamage(heroId, duration = "next", state = gameState) {
    const s = state || gameState;
    if (!s || heroId == null) return;
    if (typeof s.turnCounter !== "number") s.turnCounter = 0;
    if (!Array.isArray(s.doubleDamageHeroOutgoingMods)) s.doubleDamageHeroOutgoingMods = [];
    pruneHeroOutgoingDoubleDamageMods(s);

    const normDuration = String(duration || "next").toLowerCase();
    let expiresAtTurnCounter = null;
    if (normDuration === "current") expiresAtTurnCounter = s.turnCounter + 1;
    else if (normDuration === "next") expiresAtTurnCounter = s.turnCounter + 2;
    else if (normDuration === "permanent") expiresAtTurnCounter = null;

    s.doubleDamageHeroOutgoingMods.push({
        heroId,
        expiresAtTurnCounter
    });

    const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
    const durationText =
        normDuration === "permanent"
            ? "for the rest of the game"
            : (normDuration === "next" ? "until the end of their next turn" : "for this turn");
    appendGameLogEntry(`${heroName} deals double damage ${durationText}.`, s);
    saveGameState(s);
}

function applyHeroOutgoingDoubleDamage(amount, heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId || amount <= 0) return amount;
    pruneHeroOutgoingDoubleDamageMods(s);
    const mods = Array.isArray(s.doubleDamageHeroOutgoingMods) ? s.doubleDamageHeroOutgoingMods : [];
    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    const active = mods.some(mod => {
        if (!mod) return false;
        if (typeof mod.expiresAtTurnCounter === "number" && turn >= mod.expiresAtTurnCounter) return false;
        return String(mod.heroId) === String(heroId);
    });
    return active ? amount * 2 : amount;
}

export function applyNextTurnDoubleDamageIfAny(heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId || !s.heroData?.[heroId]) return;
    const hState = s.heroData[heroId];
    const pending = Number(hState.pendingNextTurnDoubleDamage || 0);
    if (pending > 0) {
        hState.pendingNextTurnDoubleDamage = Math.max(0, pending - 1);
        addHeroOutgoingDoubleDamage(heroId, "current", s);
        const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
        appendGameLogEntry(`${heroName}'s damage is doubled this turn.`, s);
        saveGameState(s);
    }
}

function getHeroGlobalDamageBonus(heroId, baseDamage, state = gameState) {
    const s = state || gameState;
    if (!heroId || baseDamage <= 0) return 0;

    const { effects } = getHeroAbilitiesWithTemp(heroId, s);
    let bonus = 0;

    effects.forEach(eff => {
        if (!eff || (String(eff.type || "").toLowerCase() !== "passive")) return;
        const condRaw = eff.condition;
        if (condRaw && String(condRaw).toLowerCase() !== "none") {
            const ok = evaluateCondition(String(condRaw), heroId, s);
            if (!ok) return;
        }
        const effList = Array.isArray(eff.effect) ? eff.effect : [eff.effect];
        effList.forEach(spec => {
            if (typeof spec !== "string") return;
            const match = spec.trim().match(/^increaseallcarddamage\(([^)]+)\)$/i);
            if (!match) return;
            const val = resolveNumericValue(match[1], heroId, s);
            if (val > 0) bonus += val;
        });
    });

    if (bonus > 0) {
        try {
            console.log(`[increaseAllCardDamage] Applying +${bonus} damage bonus for hero ${heroId}.`);
        } catch (e) {}
    }

    return bonus;
}

EFFECT_HANDLERS.doubleDamageAgainst = function(args = [], card, selectedData = {}) {
    const who = args?.[0] ?? "current";
    const duration = args?.[1] ?? "next";
    const sourceIdArg = args?.[2] ?? null;
    const meta = {
        sourceType: selectedData?.source || (card?.type === "Scenario" ? "scenario" : "effect"),
        sourceId: selectedData?.scenarioId || card?.id || sourceIdArg || null
    };
    addDoubleDamageModifier(who, duration, selectedData?.state || gameState, meta);
};

export function pruneFoeDoubleDamage(state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.doubleDamageFoeModifiers)) return;
    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    s.doubleDamageFoeModifiers = s.doubleDamageFoeModifiers.filter(mod => {
        if (!mod) return false;
        if (typeof mod.expiresAtTurnCounter === "number" && turn >= mod.expiresAtTurnCounter) return false;
        return true;
    });
}

function addDoubleDamageAgainstFoe(targetRaw = "all", duration = "next", state = gameState) {
    const s = state || gameState;
    if (!s) return;
    if (typeof s.turnCounter !== "number") s.turnCounter = 0;
    if (!Array.isArray(s.doubleDamageFoeModifiers)) s.doubleDamageFoeModifiers = [];
    pruneFoeDoubleDamage(s);

    const normDur = String(duration || "next").toLowerCase();
    let expiresAtTurnCounter = null;
    if (normDur === "current") expiresAtTurnCounter = s.turnCounter + 1;
    else if (normDur === "next") expiresAtTurnCounter = s.turnCounter + 2;
    else if (normDur === "permanent") expiresAtTurnCounter = null;

    const mods = [];
    if (String(targetRaw).toLowerCase() === "overlord") {
        mods.push({ type: "overlord" });
    } else if (String(targetRaw).toLowerCase() === "all") {
        mods.push({ type: "all" });
    } else {
        const arr = Array.isArray(targetRaw) ? targetRaw : [targetRaw];
        const slots = arr
            .map(n => Number(n))
            .filter(n => Number.isInteger(n) && n >= 0);
        if (slots.length) {
            mods.push({ type: "slots", slots });
        }
    }

    mods.forEach(mod => {
        s.doubleDamageFoeModifiers.push({
            ...mod,
            expiresAtTurnCounter,
            active: true
        });
    });

    if (mods.length) {
        const durationText =
            normDur === "permanent"
                ? "for the rest of the game"
                : (normDur === "next" ? "until the end of the next turn" : "for this turn");
        let desc = "All foes";
        if (mods.some(m => m.type === "overlord")) desc = "The Overlord";
        else if (mods.some(m => m.type === "slots")) {
            const names = mods
                .flatMap(m => m.type === "slots" ? m.slots : [])
                .map(idx => getCityNameFromIndex(idx + 1) || `City ${idx}`)
                .join(", ");
            desc = `Foes in ${names}`;
        }
        appendGameLogEntry(`${desc} take double damage ${durationText}.`, s);
    }
    saveGameState(s);
}

function applyDoubleDamageAgainstFoe(amount, opts = {}, state = gameState) {
    const s = state || gameState;
    if (amount <= 0) return amount;
    pruneFoeDoubleDamage(s);
    const mods = Array.isArray(s.doubleDamageFoeModifiers) ? s.doubleDamageFoeModifiers : [];
    if (!mods.length) return amount;
    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    const slotIndex = typeof opts.slotIndex === "number" ? opts.slotIndex : null;
    const isOverlord = !!opts.isOverlord;

    const match = mods.some(mod => {
        if (!mod || !mod.active) return false;
        if (typeof mod.expiresAtTurnCounter === "number" && turn >= mod.expiresAtTurnCounter) return false;
        if (mod.type === "all") return true;
        if (mod.type === "overlord") return isOverlord;
        if (mod.type === "slots" && slotIndex != null) {
            return Array.isArray(mod.slots) && mod.slots.includes(slotIndex);
        }
        return false;
    });

    return match ? amount * 2 : amount;
}

EFFECT_HANDLERS.doubleDamageAgainstVillain = function(args = [], card, selectedData = {}) {
    const targetRaw = args?.[0] ?? "all";
    const duration = args?.[1] ?? "next";
    const state = selectedData?.state || gameState;
    if (!state) return;

    const norm = String(targetRaw || "all").toLowerCase();

    if (norm === "lastfrozen") {
        const info = state.lastFrozenFoe;
        if (!info && typeof window !== "undefined" && window.__freezeSelectMode && !selectedData?._afterFreeze) {
            if (!Array.isArray(window.__afterFreezeCallbacks)) window.__afterFreezeCallbacks = [];
            window.__afterFreezeCallbacks.push(() => {
                try {
                    EFFECT_HANDLERS.doubleDamageAgainstVillain(args, card, { ...selectedData, _afterFreeze: true });
                } catch (err) {
                    console.warn("[doubleDamageAgainstVillain] Deferred lastFrozen handling failed", err);
                }
            });
            console.log("[doubleDamageAgainstVillain] Deferring lastFrozen until freeze selection resolves.");
            return;
        }

        if (!info) {
            console.warn("[doubleDamageAgainstVillain] No lastFrozenFoe recorded.");
            return;
        }

        const cities = Array.isArray(state.cities) ? state.cities : [];
        let slotIdx = Number.isInteger(info.slotIndex) ? info.slotIndex : null;

        if (slotIdx == null && info.instanceId) {
            const found = cities.findIndex(e => e && getEntryKey(e) === info.instanceId);
            if (found !== -1) slotIdx = found;
        }

        if (slotIdx == null && info.foeId) {
            const found = cities.findIndex(e => e && String(e.id) === String(info.foeId));
            if (found !== -1) slotIdx = found;
        }

        if (slotIdx != null) {
            addDoubleDamageAgainstFoe([slotIdx], duration, state);
        } else {
            console.warn("[doubleDamageAgainstVillain] lastFrozenFoe not found on board.");
        }
        return;
    }

    addDoubleDamageAgainstFoe(targetRaw, duration, state);
};

function reduceFoeTo(entry, slotIndex, targetHP, state = gameState) {
    const s = state || gameState;
    if (!entry) return false;
    const foeIdStr = String(entry.id ?? entry.baseId ?? "");
    if (!foeIdStr) return false;
    const card =
        henchmen.find(h => String(h.id) === foeIdStr) ||
        villains.find(v => String(v.id) === foeIdStr);
    if (!card) return false;

    const baseHP = Number(card.hp || 0) || 0;
    const entryKey = getEntryKey(entry);
    let currentHP = entry.currentHP;
    if (typeof currentHP !== "number" && entryKey && s.villainHP) {
        const savedHP = s.villainHP[entryKey];
        if (typeof savedHP === "number") currentHP = savedHP;
    }
    if (typeof currentHP !== "number") currentHP = baseHP;

    const targetVal = Math.max(0, Number(targetHP) || 0);
    if (currentHP <= targetVal) return false;

    entry.currentHP = targetVal;
    if (!s.villainHP) s.villainHP = {};
    if (entryKey) s.villainHP[entryKey] = targetVal;

    if (typeof slotIndex === "number") {
        try { refreshFoeCardUI(slotIndex, entry); } catch (e) {}
    }

    const foeName = card.name || `Enemy ${foeIdStr}`;
    const cityName = typeof slotIndex === "number" ? (getCityNameFromIndex(slotIndex + 1) || `City ${slotIndex}`) : null;
    const msg = cityName
        ? `${foeName} in ${cityName} was reduced to ${targetVal} HP.`
        : `${foeName} was reduced to ${targetVal} HP.`;
    appendGameLogEntry(msg, s);
    return true;
}

function reduceToHandler(targetHP, targetSpec = "all", state = gameState) {
    const s = state || gameState;
    const cities = Array.isArray(s.cities) ? s.cities : [];
    const hpVal = Math.max(0, Number(targetHP) || 0);
    const spec = targetSpec;
    let changed = false;

    const applyToSlots = (slots) => {
        slots.forEach(idx => {
            if (!Number.isInteger(idx) || idx < 0 || idx >= cities.length) return;
            const entry = cities[idx];
            if (!entry || entry.id == null) return;
            if (reduceFoeTo(entry, idx, hpVal, s)) changed = true;
        });
    };

    if (String(spec).toLowerCase() === "all") {
        cities.forEach((entry, idx) => {
            if (!entry || entry.id == null) return;
            if (reduceFoeTo(entry, idx, hpVal, s)) changed = true;
        });
    } else if (String(spec).toLowerCase() === "any") {
        if (typeof window !== "undefined") {
            window.__damageFoeSelectMode = {
                customHandler: ({ entry, slotIndex, state }) => {
                    if (reduceFoeTo(entry, slotIndex, hpVal, state)) saveGameState(state);
                },
                state: s,
                fromAny: true,
                requireConfirm: true,
                confirmMessage: `Reduce this foe to ${hpVal} HP?`
            };
            try { showMightBanner(`Choose a foe to reduce to ${hpVal} HP`, 1800); } catch (e) {}
            return;
        } else {
            const foes = cities
                .map((entry, idx) => ({ entry, idx }))
                .filter(e => e.entry && e.entry.id != null);
            if (!foes.length) {
                console.log("[reduceTo] No foes available for selection.");
            } else {
                const pick = foes[Math.floor(Math.random() * foes.length)];
                if (reduceFoeTo(pick.entry, pick.idx, hpVal, s)) changed = true;
            }
        }
    } else if (Array.isArray(spec)) {
        applyToSlots(spec.map(Number));
    } else if (Number.isInteger(Number(spec))) {
        applyToSlots([Number(spec)]);
    }

    if (changed) saveGameState(s);
}

EFFECT_HANDLERS.reduceTo = function(args = [], card, selectedData = {}) {
    const targetHP = args?.[0] ?? 0;
    const targetSpec = args?.[1] ?? "all";
    reduceToHandler(targetHP, targetSpec, selectedData?.state || gameState);
};

function restoreKOdCardsForHero(heroId, state = gameState) {
    const s = state || gameState;
    if (!s || !heroId) return;
    const hState = s.heroData?.[heroId];
    if (!hState) return;
    if (Array.isArray(hState.permanentKO) && hState.permanentKO.length) {
        hState.permanentKO = [];
    }
}


function heroRetrieveFromDiscard(count = 1, who = "current", state = gameState, excludeCardId = null) {
    const s = state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;
    let totalRetrieved = 0;

    const getEligible = (hid) => {
        const hState = s.heroData?.[hid];
        if (!hState || !Array.isArray(hState.discard)) return [];
        const perma = Array.isArray(hState.permanentKO) ? hState.permanentKO.map(String) : [];
        return hState.discard.filter(id => {
            const idStr = String(id);
            if (excludeCardId != null && idStr === String(excludeCardId)) return false;
            return !perma.includes(idStr);
        });
    };

    const takeFrom = (hid) => {
        const eligible = getEligible(hid);
        if (!eligible.length) return;
        const hState = s.heroData?.[hid];
        const perma = Array.isArray(hState?.permanentKO) ? hState.permanentKO.map(String) : [];
        const toTake = Math.min(Number(count) || 1, eligible.length);
        for (let i = 0; i < toTake; i++) {
            const idx = Math.floor(Math.random() * eligible.length);
            const cardId = eligible.splice(idx, 1)[0];
            // remove one instance from discard (first matching occurrence)
            const pos = hState.discard.findIndex(id => String(id) === String(cardId) && !perma.includes(String(id)));
            if (pos >= 0) hState.discard.splice(pos, 1);
            if (!Array.isArray(hState.hand)) hState.hand = [];
            hState.hand.push(cardId);
            const heroName = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;
            const cardName = findCardInAllSources(cardId)?.name || `Card ${cardId}`;
            appendGameLogEntry(`${heroName} retrieved ${cardName} from discard.`, s);
            totalRetrieved++;
        }
    };

    const normWho = String(who || "current").toLowerCase();
    if (normWho === "all") {
        s.heroes.forEach(hid => takeFrom(hid));
    } else {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        const hid = s.heroes[idx];
        if (hid != null) takeFrom(hid);
    }

    // Refresh hero hands so newly retrieved cards appear immediately
    try {
        if (typeof renderHeroHandBar === "function") {
            s.heroes.forEach(hid => renderHeroHandBar(s, hid));
        }
    } catch (e) {
        console.warn("[heroRetrieveFromDiscard] Failed to refresh hero hand bars", e);
    }

    saveGameState(s);
    return totalRetrieved;
}

EFFECT_HANDLERS.heroRetrieveFromDiscard = function(args = [], card, selectedData = {}) {
    const count = args?.[0] ?? 1;
    const who = args?.[1] ?? "current";
    const retrieved = heroRetrieveFromDiscard(
        count,
        who,
        selectedData?.state || gameState,
        card?.id
    );
    try {
        console.log(`[heroRetrieveFromDiscard] Retrieved ${retrieved} of requested ${count} for hero=${who}`);
    } catch (_) {}
    if (selectedData) {
        selectedData._retrievedCount = retrieved;
        selectedData._requestedRetrieve = count;
    }
    return retrieved;
};

EFFECT_HANDLERS.selfRepairChoice = async function(_args = [], card, selectedData = {}) {
    const heroId = selectedData.currentHeroId ?? null;
    const state = selectedData.state || gameState;
    const options = ["Regain 3 HP Now", "Draw 3 Next Turn"];

    let choice = 0;
    try {
        if (typeof window !== "undefined" && typeof window.showChooseAbilityPrompt === "function") {
            const idx = await window.showChooseAbilityPrompt({
                header: "Self-Repair",
                options: options.map(label => ({ label }))
            });
            if (typeof idx === "number" && idx >= 0 && idx < options.length) {
                choice = idx;
            }
        } else if (typeof window !== "undefined" && typeof window.confirm === "function") {
            // confirm -> true means first option, false means second
            choice = window.confirm("Regain 3 HP now? Cancel = Draw 3 next turn") ? 0 : 1;
        }
    } catch (err) {
        console.warn("[selfRepairChoice] Prompt failed", err);
    }

    if (choice === 0) {
        EFFECT_HANDLERS.regainLife?.([3], card, selectedData);
    } else {
        EFFECT_HANDLERS.draw?.([3, "startNextTurn"], card, selectedData);
    }
};

function openDeckSelectUI(heroId, count = 1, state = gameState) {
    const s = state || gameState;
    if (typeof window === "undefined") return;
    ensureDeckSelectRenderer();
    if (!s.heroData) s.heroData = {};
    let hState =
        s.heroData?.[heroId] ??
        s.heroData?.[String(heroId)] ??
        null;
    if (!hState && heroId != null) {
        hState = s.heroData[heroId] = {};
    }
    if (!s || !hState) return;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;
    // Ensure arrays exist
    if (!Array.isArray(hState.deck)) hState.deck = [];
    if (!Array.isArray(hState.hand)) hState.hand = [];
    if (!Array.isArray(hState.discard)) hState.discard = [];

    const shuffleInPlace = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    };

    const buildDeckForHero = (heroObjLocal) => {
        if (!heroObjLocal) return [];
        const cards = heroCards.filter(c => c.hero === heroObjLocal.name);
        const deck = [];
        cards.forEach(card => {
            const qty = Number(card.perDeck || 0);
            for (let i = 0; i < qty; i++) deck.push(card.id);
        });
        shuffleInPlace(deck);
        return deck;
    };

    let deckArr = hState.deck;
    if ((!deckArr.length) && hState.discard.length) {
        const pool = [...hState.discard];
        shuffleInPlace(pool);
        hState.deck = pool;
        hState.discard = [];
        deckArr = hState.deck;
    }
    if (!deckArr.length && heroObj?.name) {
        const rebuilt = buildDeckForHero(heroObj);
        hState.deck = Array.isArray(rebuilt) ? [...rebuilt] : [];
        shuffleInPlace(hState.deck);
        deckArr = hState.deck;
    }
    if (!deckArr.length) {
        console.log("[addFromDeck] No cards in deck to select for hero", heroId);
        return;
    }
    try { saveGameState(s); } catch (_) {}
    const ctx = {
        heroId,
        count: Math.max(1, Number(count) || 1),
        selectedCardIds: [],
        deckSnapshot: deckArr.slice()
    };
    window.__deckSelectContext = ctx;
    s.deckSelectContext = {
        heroId: ctx.heroId,
        count: ctx.count,
        selectedCardIds: [],
        deckSnapshot: ctx.deckSnapshot
    };
    saveGameState(s);

    // Fallback inline renderer if the main pageSetup hook is unavailable
    if (typeof window.renderDeckSelectSlide !== "function") {
        window.renderDeckSelectSlide = function fallbackRenderDeckSelectSlide(st = gameState) {
            const addPanel = document.getElementById("add-slide-panel");
            const addCardsRow = document.getElementById("add-slide-cards");
            if (!addPanel || !addCardsRow) return;
            const localCtx = window.__deckSelectContext || st.deckSelectContext;
            if (!localCtx || localCtx.heroId == null) return;
            const hid = localCtx.heroId;
            const heroObjLocal = heroes.find(h => String(h.id) === String(hid));
            const heroNameLocal = heroObjLocal?.name || `Hero ${hid}`;
            const hStateLocal = st.heroData?.[hid] || {};
            const deckListLocal = Array.isArray(localCtx.deckSnapshot) && localCtx.deckSnapshot.length
                ? localCtx.deckSnapshot.slice()
                : (Array.isArray(hStateLocal.deck) ? hStateLocal.deck.slice() : []);

            addPanel.style.display = "flex";
            addPanel.classList.add("open");
            addCardsRow.innerHTML = "";

            const footer = document.createElement("div");
            footer.style.display = "flex";
            footer.style.justifyContent = "space-between";
            footer.style.alignItems = "center";
            footer.style.margin = "8px 10px 0 10px";

            let chooseBtn = document.getElementById("add-choose-button");
            if (!chooseBtn) {
                chooseBtn = document.createElement("button");
                chooseBtn.id = "add-choose-button";
                chooseBtn.textContent = "Choose";
                chooseBtn.style.padding = "10px 16px";
                chooseBtn.style.fontSize = "16px";
                chooseBtn.style.display = "none";
            }
            footer.appendChild(chooseBtn);

            const setChooseState = (has) => {
                chooseBtn.style.display = "inline-block";
                chooseBtn.disabled = !has;
                chooseBtn.style.backgroundColor = has ? "gold" : "#444";
                chooseBtn.style.color = has ? "#000" : "#ddd";
            };

            const currentSel = Array.isArray(localCtx.selectedCardIds) ? localCtx.selectedCardIds : [];
            setChooseState(currentSel.length > 0);

            const bar = document.createElement("div");
            bar.style.display = "flex";
            bar.style.flexWrap = "nowrap";
            bar.style.overflowX = "auto";
            bar.style.gap = "0";
            bar.style.marginTop = "24px";
            bar.style.padding = "8px";
            bar.style.alignItems = "center";

            if (!deckListLocal.length) {
                const emptyMsg = document.createElement("div");
                emptyMsg.textContent = `${heroNameLocal} has no cards in deck.`;
                emptyMsg.style.color = "#fff";
                emptyMsg.style.fontSize = "24px";
                emptyMsg.style.padding = "16px";
                bar.appendChild(emptyMsg);
                addCardsRow.appendChild(bar);
                addCardsRow.appendChild(footer);
                return;
            }

            const sizeLabel = document.createElement("div");
            sizeLabel.textContent = `${heroNameLocal}'s Deck: ${deckListLocal.length} cards`;
            sizeLabel.style.color = "#fff";
            sizeLabel.style.fontSize = "24px";
            sizeLabel.style.marginLeft = "10px";
            addCardsRow.appendChild(sizeLabel);

            const maxSel = Math.max(1, Number(localCtx.count) || 1);
            const selectedSet = new Set(currentSel.map(String));

            deckListLocal.forEach(id => {
                const idStr = String(id);
                const wrap = document.createElement("div");
                wrap.style.transform = "scale(0.8)";
                wrap.style.marginRight = "-60px";
                wrap.style.marginLeft = "-30px";
                wrap.style.cursor = "pointer";

                const cardNode = renderCard(idStr);
                wrap.appendChild(cardNode);
                const applySel = (on) => {
                    wrap.style.boxShadow = on ? "0 0 0 6px gold" : "";
                    wrap.style.border = on ? "4px solid #000" : "";
                };
                applySel(selectedSet.has(idStr));

                wrap.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let sel = Array.isArray(window.__deckSelectContext?.selectedCardIds)
                        ? [...window.__deckSelectContext.selectedCardIds]
                        : [];
                    if (maxSel === 1) {
                        const already = sel.length === 1 && String(sel[0]) === idStr;
                        sel = already ? [] : [idStr];
                        // clear siblings
                        bar.querySelectorAll("div").forEach(div => {
                            if (div !== wrap) {
                                div.style.boxShadow = "";
                                div.style.border = "";
                            }
                        });
                    } else {
                        const idxSel = sel.findIndex(cid => String(cid) === idStr);
                        if (idxSel >= 0) sel.splice(idxSel, 1);
                        else if (sel.length < maxSel) sel.push(idStr);
                    }
                    applySel(sel.some(cid => String(cid) === idStr));
                    window.__deckSelectContext = { ...localCtx, selectedCardIds: sel };
                    st.deckSelectContext = { ...window.__deckSelectContext };
                    saveGameState(st);
                    setChooseState(sel.length > 0);
                });

                bar.appendChild(wrap);
            });

            chooseBtn.onclick = () => {
                const ctxNow = window.__deckSelectContext || localCtx;
                const selIds = Array.isArray(ctxNow.selectedCardIds) ? ctxNow.selectedCardIds : [];
                if (!selIds.length) return;
                const picks = selIds.slice(0, Math.max(1, Number(ctxNow.count) || 1));
                const hStateLive = st.heroData?.[hid];
                if (!hStateLive) return;
                if (!Array.isArray(hStateLive.hand)) hStateLive.hand = [];
                if (!Array.isArray(hStateLive.deck)) hStateLive.deck = [];

                picks.forEach(cardId => {
                    const pos = hStateLive.deck.findIndex(x => String(x) === String(cardId));
                    if (pos >= 0) hStateLive.deck.splice(pos, 1);
                    hStateLive.hand.push(cardId);
                });
                window.__deckSelectContext = null;
                st.deckSelectContext = null;
                saveGameState(st);
                try { renderHeroHandBar(st); } catch (_) {}
                addPanel.classList.remove("open");
            };

            addCardsRow.appendChild(bar);
            addCardsRow.appendChild(footer);
        };
    }

    const renderDeckSelect = () => {
        try {
            if (typeof window !== "undefined" && typeof window.renderDeckSelectSlide === "function") {
                console.log("[addFromDeck] Rendering deck select via window.renderDeckSelectSlide", {
                    heroId,
                    deckLen: deckArr.length,
                    count
                });
                window.renderDeckSelectSlide(s);
            } else if (typeof renderDeckSelectSlide === "function") {
                console.log("[addFromDeck] Rendering deck select via global renderDeckSelectSlide", {
                    heroId,
                    deckLen: deckArr.length,
                    count
                });
                renderDeckSelectSlide(s);
            } else {
                console.warn("[addFromDeck] No renderDeckSelectSlide available on window or global.", {
                    heroId,
                    deckLen: deckArr.length
                });
            }
        } catch (err) {
            console.warn("[openDeckSelectUI] Render deck select failed", err);
        }
    };

    try {
        const panel = document.getElementById("add-slide-panel");
        if (panel) {
            panel.style.display = "flex";
            panel.classList.add("open");
        } else {
            console.warn("[addFromDeck] add-slide-panel not found in DOM.");
        }
    } catch (e) {
        console.warn("[openDeckSelectUI] Failed to open add panel for deck select", e);
    }

    renderDeckSelect();
    setTimeout(renderDeckSelect, 50);
    setTimeout(renderDeckSelect, 150);
    setTimeout(renderDeckSelect, 300);
    setTimeout(renderDeckSelect, 600);

    try { showMightBanner(`Choose ${count} card(s) from ${heroName}'s deck`, 1800); } catch (e) {}
}

function addFromDeck(count = 1, who = "current", state = gameState) {
    const s = state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;
    const norm = String(who || "current").toLowerCase();
    if (norm === "all") {
        s.heroes.forEach(hid => openDeckSelectUI(hid, count, s));
    } else {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        const hid = s.heroes[idx];
        if (hid != null) openDeckSelectUI(hid, count, s);
    }
}

EFFECT_HANDLERS.add = function(args = [], card, selectedData = {}) {
    const count = args?.[0] ?? 1;
    const who = args?.[1] ?? "current";
    addFromDeck(count, who, selectedData?.state || gameState);
};
EFFECT_HANDLERS.restoreKOdHeroCards = function(args = [], card, selectedData = {}) {
    const who = String(args?.[0] ?? "current").toLowerCase();
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;

    if (who === "all") {
        s.heroes.forEach(hid => restoreKOdCardsForHero(hid, s));
        appendGameLogEntry(`All Heroes' KO'd Action Cards are restored to their discard piles.`, s);
    } else {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        const hid = s.heroes[idx];
        if (hid != null) {
            restoreKOdCardsForHero(hid, s);
            const name = heroes.find(h => String(h.id) === String(hid))?.name || `Hero ${hid}`;
            appendGameLogEntry(`${name}'s KO'd action cards are restored to their discard pile.`, s);
        }
    }
    saveGameState(s);
};

EFFECT_HANDLERS.disableVillainDraw = function(args = [], card, selectedData = {}) {
    const count = Math.max(1, Number(args?.[0] ?? 1) || 1);
    const s = selectedData?.state || gameState;
    if (!s) return;
    s.villainDrawSkipCount = Math.max(0, Number(s.villainDrawSkipCount) || 0) + count;
    appendGameLogEntry(`Villain draw will be skipped for the next ${count} turn(s).`, s);
    saveGameState(s);
};

export function pruneHeroProtections(state = gameState) {
    const s = state || gameState;
    if (!s?.heroData) return;
    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    Object.keys(s.heroData).forEach(hid => {
        const hState = s.heroData[hid];
        if (!hState || !Array.isArray(hState.protections)) return;
        hState.protections = hState.protections.filter(p => {
            if (!p) return false;
            if (typeof p.expiresAtTurnCounter === "number" && turn >= p.expiresAtTurnCounter) return false;
            return true;
        });
    });
}

function addHeroProtection(heroId, type = "nextattack", duration = "next", state = gameState) {
    const s = state || gameState;
    if (!heroId || !s) return;
    if (!s.heroData) s.heroData = {};
    const heroState = s.heroData[heroId] || (s.heroData[heroId] = {});
    if (!Array.isArray(heroState.protections)) heroState.protections = [];
    if (typeof s.turnCounter !== "number") s.turnCounter = 0;
    const normType = String(type || "nextattack").toLowerCase();
    const normDur = String(duration || "next").toLowerCase();
    let expiresAtTurnCounter = null;
    // For next-attack protection, keep until consumed (no expiry)
    if (normType === "nextattack") {
        expiresAtTurnCounter = null;
    } else if (normDur === "current") {
        expiresAtTurnCounter = s.turnCounter + 1;
    } else if (normDur === "next") {
        expiresAtTurnCounter = s.turnCounter + 2;
    } else if (normDur === "restofturn") {
        expiresAtTurnCounter = s.turnCounter + 1;
    } else if (normDur === "permanent") {
        expiresAtTurnCounter = null;
    }
    heroState.protections.push({
        type: normType,
        expiresAtTurnCounter
    });
    const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
    let durText;
    if (normType === "nextattack") {
        durText = "The next incoming damage is blocked.";
    } else if (normDur === "permanent") {
        durText = "for the rest of the game";
    } else if (normDur === "restofturn" || normDur === "current") {
        durText = "for the rest of this turn";
    } else {
        durText = "until the end of their next turn";
    }
    appendGameLogEntry(`${heroName} has the next damage against them blocked.`, s);
}

export function consumeHeroProtectionIfAny(heroId, state = gameState) {
    const s = state || gameState;
    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    const heroState = s.heroData?.[heroId];
    if (!heroState || !Array.isArray(heroState.protections) || !heroState.protections.length) return false;
    let blocked = false;
    heroState.protections = heroState.protections.filter(p => {
        if (!p) return false;
        if (typeof p.expiresAtTurnCounter === "number" && turn >= p.expiresAtTurnCounter) return false;
        const isRest = p.type === "restofturn";
        const isNext = p.type === "nextattack";
        if (isNext && !blocked) {
            blocked = true;
            return false; // consume
        }
        if (isRest) {
            blocked = true;
            return true; // keep until expiry
        }
        return true;
    });
    if (blocked) {
        const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
        appendGameLogEntry(`${heroName} blocked incoming damage.`, s);
        applyBlockAppendEffects(heroId, s);
        try { triggerRuleEffects("heroBlocks", { state: s, currentHeroId: heroId }); } catch (_) {}
    }
    return blocked;
}

EFFECT_HANDLERS.protectHero = function(args = [], card, selectedData = {}) {
    const typeRaw = args?.[0] ?? "nextAttack";
    const whoRaw = args?.[1] ?? "current";
    const durationRaw = args?.[2] ?? "next";
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;
    pruneHeroProtections(s);
    const type = String(typeRaw || "nextAttack").toLowerCase();
    const who = String(whoRaw || "current").toLowerCase();
    const duration = durationRaw;
    const heroIds = s.heroes;

    if (who === "all") {
        heroIds.forEach(hid => addHeroProtection(hid, type, duration, s));
    } else if (who === "random") {
        const alive = heroIds.filter(hid => s.heroData?.[hid]);
        if (!alive.length) return;
        const pick = alive[Math.floor(Math.random() * alive.length)];
        addHeroProtection(pick, type, duration, s);
    } else {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        const hid = heroIds[idx];
        if (hid != null) addHeroProtection(hid, type, duration, s);
    }
    saveGameState(s);
};

function addRetreatSave(heroId, state = gameState) {
    const s = state || gameState;
    if (!s) return;
    if (!s.heroData) s.heroData = {};
    const hState = s.heroData[heroId] || (s.heroData[heroId] = {});
    hState.succeedNextRetreat = true;
    const name = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
    appendGameLogEntry(`${name} will automatically succeed their next failed retreat.`, s);
    saveGameState(s);
}

EFFECT_HANDLERS.succeedNextFailedRetreat = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.heroes)) return;
    const who = String(args?.[0] ?? "current").toLowerCase();
    if (who === "all") {
        s.heroes.forEach(hid => addRetreatSave(hid, s));
    } else {
        const idx = typeof s.heroTurnIndex === "number" ? s.heroTurnIndex : 0;
        const hid = s.heroes[idx];
        if (hid != null) addRetreatSave(hid, s);
    }
};

function pruneExpiredFoeProtections(state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.foeProtections)) return;
    const turn = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    s.foeProtections = s.foeProtections.filter(p => {
        if (!p) return false;
        if (typeof p.expiresAtTurnCounter === "number" && turn >= p.expiresAtTurnCounter) return false;
        return true;
    });
}

function setFoeProtection(who = "any", where = [], duration = "next", state = gameState) {
    const s = state || gameState;
    if (!s) return;
    pruneExpiredFoeProtections(s);
    if (!Array.isArray(s.foeProtections)) s.foeProtections = [];
    if (typeof s.turnCounter !== "number") s.turnCounter = 0;

    const normTarget = String(who || "any").toLowerCase();
    const normDuration = String(duration || "next").toLowerCase();
    const slotsArr = Array.isArray(where) ? where : [where];
    const slotNums = slotsArr
        .map(n => Number(n))
        .filter(n => Number.isInteger(n) && n >= 0);
    if (!slotNums.length) return;

    let expiresAtTurnCounter = null;
    if (normDuration === "current") expiresAtTurnCounter = s.turnCounter;
    else if (normDuration === "next") expiresAtTurnCounter = s.turnCounter + 1;
    else if (normDuration === "permanent") expiresAtTurnCounter = null;

    slotNums.forEach(slot => {
        s.foeProtections.push({
            target: normTarget,
            slotIndex: slot,
            expiresAtTurnCounter,
            active: true
        });
    });

    const durationText =
        normDuration === "permanent"
            ? "for the rest of the game"
            : (normDuration === "next" ? "until the start of your next turn" : "for this turn");

    const cityNames = slotNums.map(idx => getCityNameFromIndex(idx + 1) || `City ${idx}`).join(", ");
    appendGameLogEntry(`Protection applied: ${who} in ${cityNames} are immune to damage ${durationText}.`, s);
    saveGameState(s);
}

function foeIsProtected(entry, slotIndex, state = gameState) {
    const s = state || gameState;
    pruneExpiredFoeProtections(s);
    if (!Array.isArray(s.foeProtections)) return false;
    const card =
        henchmen.find(h => String(h.id) === String(entry?.id)) ||
        villains.find(v => String(v.id) === String(entry?.id));
    const type = (card?.type || "").toLowerCase();
    return s.foeProtections.some(p => {
        if (!p || !p.active) return false;
        if (p.slotIndex !== slotIndex) return false;
        const tgt = String(p.target || "").toLowerCase();
        if (tgt === "any") return true;
        if (tgt === "henchmen" && type === "henchman") return true;
        if (tgt === "villains" && type === "villain") return true;
        return false;
    });
}

EFFECT_HANDLERS.protectFoe = function(args = [], card, selectedData = {}) {
    const who = args?.[0] ?? "any";
    const where = args?.[1] ?? [];
    const duration = args?.[2] ?? "next";
    setFoeProtection(who, where, duration, selectedData?.state || gameState);
};

function foeAbilitiesDisabled(entry) {
    return !!entry?.disableAbilities;
}

function disableFoe(entry, slotIndex, state = gameState) {
    if (!entry) return false;
    const s = state || gameState;
    const cardId = entry.id ?? entry.baseId ?? null;
    if (cardId == null) return false;
    const card =
        henchmen.find(h => String(h.id) === String(cardId)) ||
        villains.find(v => String(v.id) === String(cardId));
    if (!card) return false;

    const effDmg = getEffectiveFoeDamage(entry);
    entry.damagePenalty = (Number(entry.damagePenalty) || 0) + effDmg;
    entry.currentDamageBonus = 0;
    entry.currentDamage = 0;
    entry.disableAbilities = true;

    if (typeof slotIndex === "number") {
        try { refreshFoeCardUI(slotIndex, entry); } catch (e) {}
    }

    const cityName = typeof slotIndex === "number"
        ? (getCityNameFromIndex(slotIndex + 1) || `City ${slotIndex}`)
        : null;
    const foeName = card.name || `Enemy ${cardId}`;
    const msg = cityName
        ? `${foeName} in ${cityName} is disabled (0 damage, abilities negated).`
        : `${foeName} is disabled (0 damage, abilities negated).`;
    appendGameLogEntry(msg, s);
    return true;
}

EFFECT_HANDLERS.disableVillain = function(args = [], card, selectedData = {}) {
    const whoRaw = args?.[0] ?? "all";
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.cities)) return;
    const cities = s.cities;
    const norm = String(whoRaw || "all").toLowerCase();
    let applied = false;

    if (norm === "all") {
        cities.forEach((entry, idx) => {
            if (!entry || entry.id == null) return;
            if (disableFoe(entry, idx, s)) applied = true;
        });
    } else if (norm === "any") {
        if (typeof window !== "undefined") {
            window.__damageFoeSelectMode = {
                customHandler: ({ entry, slotIndex, state }) => {
                    if (disableFoe(entry, slotIndex, state)) saveGameState(state);
                },
                state: s,
                fromAny: true,
                requireConfirm: true,
                confirmTitle: "Disable Foe",
                confirmMessage: "Set this foe to 0 damage and negate its abilities?"
            };
            try { showMightBanner("Choose a foe to disable", 1800); } catch (e) {}
            return;
        } else {
            const foes = cities
                .map((entry, idx) => ({ entry, idx }))
                .filter(e => e.entry && e.entry.id != null);
            if (foes.length) {
                const pick = foes[Math.floor(Math.random() * foes.length)];
                applied = disableFoe(pick.entry, pick.idx, s) || applied;
            } else {
                console.log("[disableVillain] No foes available to disable.");
            }
        }
    } else if (norm === "lastfrozen") {
        const info = s.lastFrozenFoe;
        if (!info && typeof window !== "undefined" && window.__freezeSelectMode && !selectedData?._afterFreeze) {
            // Freeze selection pending; defer disable until freeze completes
            if (!Array.isArray(window.__afterFreezeCallbacks)) window.__afterFreezeCallbacks = [];
            window.__afterFreezeCallbacks.push(() => {
                try {
                    EFFECT_HANDLERS.disableVillain(args, card, { ...selectedData, _afterFreeze: true });
                } catch (err) {
                    console.warn("[disableVillain] Deferred lastFrozen handling failed", err);
                }
            });
            console.log("[disableVillain] Deferring lastFrozen until freeze selection resolves.");
            return;
        }

        if (info && Array.isArray(cities)) {
            const key = info.instanceId ?? null;
            let entry = null;
            let idx = null;

            if (key) {
                const foundIdx = cities.findIndex(e => e && getEntryKey(e) === key);
                if (foundIdx !== -1) {
                    entry = cities[foundIdx];
                    idx = foundIdx;
                }
            }
            if (!entry && Number.isInteger(info.slotIndex)) {
                idx = info.slotIndex;
                entry = cities[idx] || null;
            }
            if (!entry && info.foeId) {
                for (let i = 0; i < cities.length; i++) {
                    const e = cities[i];
                    if (e && String(e.id) === String(info.foeId)) {
                        entry = e;
                        idx = i;
                        break;
                    }
                }
            }

            if (entry && entry.id != null) {
                applied = disableFoe(entry, idx, s) || applied;
            } else {
                console.warn("[disableVillain] lastFrozen not found on board.");
            }
        } else {
            console.warn("[disableVillain] No lastFrozenFoe recorded.");
        }
    } else {
        const idx = Number(whoRaw);
        if (Number.isInteger(idx) && idx >= 0 && idx < cities.length) {
            const entry = cities[idx];
            if (entry && entry.id != null) {
                applied = disableFoe(entry, idx, s) || applied;
            }
        }
    }

    if (applied) saveGameState(s);
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

function giveCurrentHeroExtraTurn(heroId = null, state = gameState) {
    const s = state || gameState;
    const hid = heroId ?? s.heroes?.[s.heroTurnIndex ?? 0];
    if (!hid) {
        console.warn("[giveCurrentHeroExtraTurn] No heroId available.");
        return null;
    }

    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    const sourceIdx = heroIds.findIndex(id => String(id) === String(hid));
    const fallbackIdx = Number.isInteger(s.heroTurnIndex) ? s.heroTurnIndex : 0;
    const resumeIndex = heroIds.length
        ? ((sourceIdx >= 0 ? sourceIdx : fallbackIdx) + 1) % heroIds.length
        : 0;

    s.pendingExtraTurn = {
        sourceHeroId: hid,
        targetHeroId: hid,
        resumeIndex,
        consumed: false
    };

    try { saveGameState(s); } catch (err) {
        console.warn("[giveCurrentHeroExtraTurn] Failed to save state after queueing extra turn.", err);
    }

    console.log(`[giveCurrentHeroExtraTurn] Pending extra turn queued for ${hid}.`);
    return hid;
}

EFFECT_HANDLERS.giveCurrentHeroExtraTurn = function(args = [], card, selectedData = {}) {
    const heroId = selectedData?.currentHeroId ?? null;
    return giveCurrentHeroExtraTurn(heroId, gameState);
};

function blockDamage(state = gameState) {
    const s = state || gameState;
    if (!s.pendingDamageHero) {
        console.log("[blockDamage] No pending damage to block.");
        return false;
    }
    const targetId = s.pendingDamageHero.heroId;
    if (isProtectionDisabledForHero(targetId, s)) {
        console.log("[blockDamage] Protection is disabled for this hero; block ignored.");
        return false;
    }
    const heroName = heroes.find(h => String(h.id) === String(targetId))?.name || `Hero ${targetId}`;
    console.log(`[blockDamage] Blocking all pending damage to ${heroName}.`, s.pendingDamageHero);
    s.pendingDamageHero = null;
    applyBlockAppendEffects(targetId, s);
    try { triggerRuleEffects("heroBlocks", { state: s, currentHeroId: targetId }); } catch (_) {}
    return true;
}

EFFECT_HANDLERS.blockDamage = function(args = [], card, selectedData = {}) {
    return blockDamage(gameState);
};

EFFECT_HANDLERS.ignoreShoveDamage = function(args = [], card, selectedData = {}) {
    const targetRaw = args?.[0] ?? "current";
    const durationRaw = String(args?.[1] ?? "current").toLowerCase();
    const state = selectedData?.state || gameState;
    const heroIds = state?.heroes || [];
    const heroId =
        String(targetRaw).toLowerCase() === "current"
            ? (selectedData?.currentHeroId ?? heroIds[state.heroTurnIndex ?? 0] ?? null)
            : targetRaw;

    if (heroId == null) {
        console.warn("[ignoreShoveDamage] No heroId resolved.");
        return;
    }

    if (!state.heroData) state.heroData = {};
    if (!state.heroData[heroId]) state.heroData[heroId] = {};

    const turn = typeof state.turnCounter === "number" ? state.turnCounter : 0;
    let expiresAt = turn;
    if (durationRaw === "next" || durationRaw === "nextturn") {
        expiresAt = turn + 1;
    } else if (durationRaw.includes("endofturn") || durationRaw === "current" || durationRaw === "thisturn") {
        expiresAt = turn;
    }

    state.heroData[heroId].ignoreShoveDamageUntilTurn = expiresAt;

    const heroName = heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`;
    appendGameLogEntry(`${heroName} will ignore shove damage until end of this turn.`, state);
    saveGameState(state);
};

EFFECT_HANDLERS.disableCoastalBonus = function(args = [], card, selectedData = {}) {
    const teamRaw = args?.[0] ?? "all";
    const teamKey = String(teamRaw || "all").toLowerCase().trim() || "all";
    const s = selectedData?.state || gameState;
    if (!s) return;

    if (!Array.isArray(s.coastalBonusSuppression)) s.coastalBonusSuppression = [];

    const sourceType = selectedData?.source || (card?.type === "Scenario" ? "scenario" : "effect");
    const sourceId = selectedData?.scenarioId || card?.id || null;

    s.coastalBonusSuppression = s.coastalBonusSuppression.filter(entry => {
        if (!entry) return false;
        const sameTeam = String(entry.team || "").toLowerCase().trim() === teamKey;
        const sameSourceType = entry.sourceType === sourceType;
        const sameSourceId = sourceId != null ? String(entry.sourceId) === String(sourceId) : false;
        return !(sameTeam && sameSourceType && sameSourceId);
    });

    s.coastalBonusSuppression.push({
        team: teamKey || "all",
        sourceType,
        sourceId
    });

    const whoText = teamKey === "all" ? "All heroes" : `${teamKey} heroes`;
    appendGameLogEntry(`${whoText} lose coastal city bonuses while this effect is active.`, s);
    saveGameState(s);
};

EFFECT_HANDLERS.disableTeamBonus = function(args = [], card, selectedData = {}) {
    const teamRaw = args?.[0] ?? "all";
    const teamKey = String(teamRaw || "all").toLowerCase().trim() || "all";
    const durationRaw = args?.[1] ?? null;
    const s = selectedData?.state || gameState;
    if (!s) return;
    if (!Array.isArray(s.teamBonusSuppression)) s.teamBonusSuppression = [];

    const sourceType = selectedData?.source || (card?.type === "Scenario" ? "scenario" : "effect");
    const sourceId = selectedData?.scenarioId || card?.id || null;
    const heroIdForExpiry =
        selectedData?.currentHeroId ??
        (Array.isArray(s.heroes) ? s.heroes[s.heroTurnIndex ?? 0] : null);
    const duration =
        typeof durationRaw === "string" ? durationRaw.toLowerCase() : null;
    const expireOnHeroId =
        duration && ["nextround", "nextturn", "next"].includes(duration)
            ? heroIdForExpiry
            : null;

    s.teamBonusSuppression = s.teamBonusSuppression.filter(entry => {
        if (!entry) return false;
        const sameTeam = String(entry.team || "").toLowerCase().trim() === teamKey;
        const sameSourceType = entry.sourceType === sourceType;
        const sameSourceId = sourceId != null ? String(entry.sourceId) === String(sourceId) : false;
        return !(sameTeam && sameSourceType && sameSourceId);
    });

    s.teamBonusSuppression.push({
        team: teamKey || "all",
        sourceType,
        sourceId,
        expireOnHeroId: expireOnHeroId != null ? String(expireOnHeroId) : null
    });

    const whoText = teamKey === "all" ? "All heroes" : `${teamKey} heroes`;
    appendGameLogEntry(`${whoText} lose team-based bonuses while this effect is active.`, s);
    saveGameState(s);
};

EFFECT_HANDLERS.attackerGainCorruptionCounter = function(args = [], card, selectedData = {}) {
    const amt = Number(args?.[0] ?? 1) || 0;
    if (amt === 0) return;
    const heroId = selectedData?.currentHeroId ?? null;
    if (heroId == null) {
        console.warn("[attackerGainCorruptionCounter] No currentHeroId provided.");
        return;
    }
    addCorruptionCounters(heroId, amt, selectedData?.state || gameState);
};

EFFECT_HANDLERS.appendToBlock = function(args = [], card, selectedData = {}) {
    const eff = args?.[0];
    const s = selectedData?.state || gameState;
    if (!s || !eff) return;
    if (!Array.isArray(s.blockAppendEffects)) s.blockAppendEffects = [];
    if (!s.blockAppendEffects.includes(eff)) s.blockAppendEffects.push(eff);
};

function applyBlockAppendEffects(heroId, state = gameState) {
    const s = state || gameState;
    if (!Array.isArray(s.blockAppendEffects) || !s.blockAppendEffects.length) return;
    s.blockAppendEffects.forEach(eff => {
        try {
            executeEffectSafely(eff, null, { state: s, currentHeroId: heroId });
        } catch (err) {
            console.warn("[applyBlockAppendEffects] Failed to run appended block effect", err);
        }
    });
    s._heroJustBlocked = true;
}

function swapBoardSlots(state = gameState, pairs = []) {
    const s = state || gameState;
    if (!Array.isArray(s.cities)) s.cities = new Array(12).fill(null);
    const cities = s.cities;

    const allowedPairs = pairs.filter(([a, b]) => {
        const destroyedA = !!s.destroyedCities?.[a];
        const destroyedB = !!s.destroyedCities?.[b];
        return !destroyedA && !destroyedB;
    });

    // Swap entries in the cities array and update slotIndex
    allowedPairs.forEach(([a, b]) => {
        const temp = cities[a];
        cities[a] = cities[b];
        cities[b] = temp;
        if (cities[a]) cities[a].slotIndex = a;
        if (cities[b]) cities[b].slotIndex = b;
    });

    // Swap hero positions (lower row indices)
    const heroIds = s.heroes || [];
    const heroSwapMap = new Map();
    allowedPairs.forEach(([a, b]) => {
        // lower indices are +1 for heroes under these upper slots
        heroSwapMap.set(a + 1, b + 1);
        heroSwapMap.set(b + 1, a + 1);
    });
    heroIds.forEach(hid => {
        const hState = s.heroData?.[hid];
        if (!hState) return;
        const idx = hState.cityIndex;
        if (heroSwapMap.has(idx)) {
            hState.cityIndex = heroSwapMap.get(idx);
        }
    });

    // Re-render board if DOM is available
    if (typeof document !== "undefined") {
        const citySlots = document.querySelectorAll(".city-slot");
        const renderEntry = (entry, idx) => {
            const slot = citySlots[idx];
            const area = slot?.querySelector(".city-card-area");
            if (!area) return;
            area.innerHTML = "";
            if (!entry) return;
            const wrapper = document.createElement("div");
            wrapper.className = "card-wrapper";
            const cardData = findCardInAllSources(entry.id);
            wrapper.appendChild(renderCard(entry.id, wrapper, { cardDataOverride: cardData }));
            area.appendChild(wrapper);
            wrapper.style.cursor = "pointer";
            wrapper.addEventListener("click", (e) => {
                e.stopPropagation();
                const panelCard = findCardInAllSources(entry.id);
                if (panelCard) buildVillainPanel(panelCard, { instanceId: getEntryKey(entry), slotIndex: idx });
            });
        };

        // Upper slots
        cities.forEach((entry, idx) => {
            if (idx % 2 === 0) {
                renderEntry(entry, idx);
            }
        });

        // Lower slots: render heroes in their new positions
        const heroIdsList = s.heroes || [];
        heroIdsList.forEach(hid => {
            const hState = s.heroData?.[hid];
            if (!hState) return;
            const lowerIdx = hState.cityIndex;
            if (!Number.isInteger(lowerIdx)) return;
            const slot = citySlots[lowerIdx];
            const area = slot?.querySelector(".city-card-area");
            if (!area) return;
            area.innerHTML = "";
            const wrapper = document.createElement("div");
            wrapper.className = "card-wrapper";
            wrapper.style.cursor = "pointer";
            const rendered = renderCard(hid, wrapper);
            wrapper.appendChild(rendered);
            wrapper.setAttribute("data-card-id", String(hid));
            area.appendChild(wrapper);
            const heroData = heroes.find(h => String(h.id) === String(hid));
            if (heroData) {
                wrapper.addEventListener("click", () => {
                    buildHeroPanel(heroData, { slotIndex: lowerIdx });
                });
            }
        });
    }
}

EFFECT_HANDLERS.guardOverlord = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    if (!s) return;
    s.overlordGuardEnabled = true;
};

EFFECT_HANDLERS.increaseRetreat = function(args = [], card, selectedData = {}) {
    const whoRaw = args?.[0] ?? "all";
    const amtRaw = args?.[1] ?? 0;
    const s = selectedData?.state || gameState;
    if (!s) return;
    const amount = Number(amtRaw) || 0;
    if (amount === 0) return;

    if (!Array.isArray(s.retreatBonusEntries)) s.retreatBonusEntries = [];

    const targetKey = String(whoRaw || "all").toLowerCase().trim() || "all";
    const sourceType = selectedData?.source || (card?.type === "Scenario" ? "scenario" : "effect");
    const sourceId = selectedData?.scenarioId || card?.id || null;
    const cityIndex = selectedData?.cityIndex ?? null;

    s.retreatBonusEntries = s.retreatBonusEntries.filter(entry => {
        if (!entry) return false;
        const sameTarget = String(entry.target || "").toLowerCase().trim() === targetKey;
        const sameSourceType = entry.sourceType === sourceType;
        const sameSourceId = sourceId != null ? String(entry.sourceId) === String(sourceId) : false;
        const sameCity = cityIndex == null ? entry.cityIndex == null : Number(entry.cityIndex) === Number(cityIndex);
        return !(sameTarget && sameSourceType && sameSourceId && sameCity);
    });

    s.retreatBonusEntries.push({
        target: targetKey,
        amount,
        sourceType,
        sourceId,
        cityIndex
    });

    appendGameLogEntry(`Retreat requirement increased by ${amount} for ${targetKey} heroes.`, s);
    saveGameState(s);
};

EFFECT_HANDLERS.disableProtectOn = function(args = [], card, selectedData = {}) {
    const team = args?.[0];
    if (!team) return;
    const s = selectedData?.state || gameState;
    if (!Array.isArray(s.disableProtectTeams)) s.disableProtectTeams = [];
    const key = String(team).toLowerCase().trim();
    if (!s.disableProtectTeams.includes(key)) {
        s.disableProtectTeams.push(key);
    }
    appendGameLogEntry(`Damage blocks are disabled for ${team} heroes.`, s);
    saveGameState(s);
};

EFFECT_HANDLERS.reviveKodFoe = function(args = [], card, selectedData = {}) {
    const count = args?.[0] ?? 1;
    const flag = args?.[1] ?? null;
    reviveKodFoe(count, selectedData?.state || gameState, flag);
};

function isHeroSelectorValue(val) {
    if (val == null) return false;
    if (typeof val === "number" || /^\d+$/.test(String(val))) {
        return heroes.some(h => String(h.id) === String(val));
    }
    const lower = String(val).toLowerCase();
    if (["random", "all", "current", "notcurrent", "coastal", "highesthp", "allengaged"].includes(lower)) return true;
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

    if (lower === "notcurrent") {
        const idx = Number.isInteger(s.heroTurnIndex) ? s.heroTurnIndex : 0;
        const currentId = heroIds[idx];
        return activeHeroes.filter(hid => String(hid) !== String(currentId));
    }

    if (lower === "allengaged") {
        const engaged = activeHeroes.filter(hid => {
            const hState = s.heroData?.[hid];
            if (!hState) return false;
            if (hState.isFacingOverlord) return false;
            return Number.isInteger(hState.cityIndex);
        });
        return engaged;
    }

    if (lower === "highesthp") {
        if (!activeHeroes.length) return [];
        let maxHp = -Infinity;
        activeHeroes.forEach(hid => {
            const hp = typeof s.heroData?.[hid]?.hp === "number" ? s.heroData[hid].hp : 1;
            if (hp > maxHp) maxHp = hp;
        });
        const top = activeHeroes.filter(hid => {
            const hp = typeof s.heroData?.[hid]?.hp === "number" ? s.heroData[hid].hp : 1;
            return hp === maxHp;
        });
        if (!top.length) return [];
        const pick = top[Math.floor(Math.random() * top.length)];
        return [pick];
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

    const isTeamSelector = HERO_TEAM_SET.has(lower);
    // Team target
    const teamTargets = activeHeroes.filter(hid => {
        const heroObj = heroes.find(h => String(h.id) === String(hid));
        return heroMatchesTeam(heroObj, selector);
    });
    if (teamTargets.length) return teamTargets;
    if (isTeamSelector) return [];

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
    if (typeof rawAmount === "string" && rawAmount.toLowerCase() === "engagedfoedamage") {
        const s = state || gameState;
        const heroState = s.heroData?.[heroId];
        if (!heroState) return 0;
        const upperIdx = typeof heroState.cityIndex === "number" ? heroState.cityIndex - 1 : null;
        const entry = Number.isInteger(upperIdx) && Array.isArray(s.cities) ? s.cities[upperIdx] : null;
        if (!entry) return 0;
        return getEffectiveFoeDamage(entry);
    }
    if (typeof rawAmount === "string" && rawAmount.toLowerCase() === "rescuedbystanderscount") {
        return getTotalRescuedBystanders(state);
    }
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

    const amtPre = Math.max(0, Number(amount) || 0);
    if (consumeHeroProtectionIfAny(heroId, s)) {
        s.pendingDamageHero = null;
        return;
    }
    const amt = applyIncomingDoubleDamage(amtPre, heroId, s);
    const dt = getCurrentHeroDT(heroId, s);

    if (!options.ignoreDT && amt < dt) {
        console.log(`[damageHero] ${heroObj.name} ignores ${amt} damage (DT=${dt}).`);
        return;
    }

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
    const appliedDamage = Math.max(0, Math.min(amt, before));
    playDamageSfx(appliedDamage);

    // Low HP music toggle if this is the active hero
    try {
        const activeHeroId = s.heroes?.[s.heroTurnIndex ?? 0];
        if (typeof window !== "undefined" && typeof window.setLowHpMode === "function" && String(activeHeroId) === String(heroId)) {
            window.setLowHpMode(heroState.hp > 0 && heroState.hp <= 3);
        }
    } catch (e) {
        // ignore
    }

    if (typeof flashScreenRed === "function") {
        try { flashScreenRed(); } catch (e) { console.warn("[damageHero] flashScreenRed failed", e); }
    }

    appendGameLogEntry(`${heroObj.name} took ${amt} damage from ${options.sourceName || "effect"}.`, s);

    try { updateHeroHPDisplays(heroId); } catch (e) { console.warn("[damageHero] updateHeroHPDisplays failed", e); }
    try { updateBoardHeroHP(heroId); } catch (e) { console.warn("[damageHero] updateBoardHeroHP failed", e); }

    if (heroState.hp <= 0) {
        handleHeroKnockout(heroId, heroState, s, { source: "damageHero", sourceName: options.sourceName || "effect" });
    } else {
        // Handle Eject passive on damaging foe (send hero back to HQ)
        try { ejectHeroIfCauserHasEject(heroId, s); } catch (err) { console.warn("[damageHero] Eject handling failed", err); }
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
    const arg0 = args?.[0];
    const arg1 = args?.[1];
    const flagsRaw = [arg0, arg1].filter(a => typeof a === "string").join(",").toLowerCase();
    const ignoreText = flagsRaw.includes("ignoreeffecttext");
    const nextCardOnly = flagsRaw.includes("nextcardonly");
    const nextTurnOnly = flagsRaw.includes("nextturnonly");
    const normDuration = String(arg1 || "").toLowerCase();

    // Resolve hero target (for nextCardOnly support)
    const s = selectedData?.state || gameState;
    const heroIds = s?.heroes || [];
    const resolvedHeroId =
        String(arg0 || "").toLowerCase() === "current"
            ? (heroIds[s.heroTurnIndex ?? 0] ?? null)
            : (selectedData?.currentHeroId ?? heroIds[s.heroTurnIndex ?? 0] ?? null);

    if (nextCardOnly && resolvedHeroId != null) {
        if (!s.heroData) s.heroData = {};
        if (!s.heroData[resolvedHeroId]) s.heroData[resolvedHeroId] = {};
        const prev = Number(s.heroData[resolvedHeroId].nextCardDamageMultiplier || 1) || 1;
        s.heroData[resolvedHeroId].nextCardDamageMultiplier = prev * 2;
        const heroName = heroes.find(h => String(h.id) === String(resolvedHeroId))?.name || `Hero ${resolvedHeroId}`;
        appendGameLogEntry(`${heroName}'s next card deals double damage.`, s);
        saveGameState(s);
        return;
    }

    if (nextTurnOnly && resolvedHeroId != null) {
        if (!s.heroData) s.heroData = {};
        if (!s.heroData[resolvedHeroId]) s.heroData[resolvedHeroId] = {};
        const heroName = heroes.find(h => String(h.id) === String(resolvedHeroId))?.name || `Hero ${resolvedHeroId}`;
        const currentPending = Number(s.heroData[resolvedHeroId].pendingNextTurnDoubleDamage || 0);
        s.heroData[resolvedHeroId].pendingNextTurnDoubleDamage = currentPending + 1;
        appendGameLogEntry(`${heroName}'s next turn damage will be doubled.`, s);
        saveGameState(s);
        return;
    }

    // Hero-wide outgoing double damage for this/next turn
    if ((normDuration === "next" || normDuration === "current" || normDuration === "permanent") && resolvedHeroId != null) {
        addHeroOutgoingDoubleDamage(resolvedHeroId, normDuration, s);
        return;
    }

    // Default behavior: apply immediately to this card being played
    s._pendingCardDamageMultiplier = (s._pendingCardDamageMultiplier || 1) * 2;
    if (ignoreText) {
        s._pendingIgnoreEffectText = true;
        console.log("[doubleDamage] Applied ignoreEffectText; remaining card effects will be skipped.");
    }
    console.log("[doubleDamage] Pending card damage multiplier now", s._pendingCardDamageMultiplier);
};

EFFECT_HANDLERS.ignoreRewardDamageOverlord = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    const rawArg = Array.isArray(args) ? args[0] : args;
    const last = s?._lastKOdHenchman || {};

    const foeId =
        selectedData?.foeId ??
        selectedData?.foeID ??
        selectedData?.selectedFoeSummary?.foeId ??
        selectedData?.selectedFoeSummary?.id ??
        last.foeId ??
        null;

    const instanceId =
        selectedData?.instanceId ??
        selectedData?.foeInstanceId ??
        selectedData?.selectedFoeSummary?.instanceId ??
        last.instanceId ??
        null;

    // Mark reward suppression for the targeted foe instance
    if (foeId != null) {
        s._suppressRewardFor = { foeId: String(foeId), instanceId: instanceId ?? null };
    }

    const dmgFromArg = (rawArg != null && String(rawArg).toLowerCase() !== "henchmandamage")
        ? Number(rawArg)
        : NaN;
    const resolvedDamage =
        Number.isFinite(dmgFromArg)
            ? Math.max(0, dmgFromArg)
            : Math.max(0, Number(selectedData?.henchmanDamage ?? last.damage ?? 0) || 0);

    const heroId = selectedData?.currentHeroId ?? null;

    if (resolvedDamage > 0) {
        damageOverlord(resolvedDamage, s, heroId);
    } else {
        console.log("[ignoreRewardDamageOverlord] No damage resolved; reward still suppressed.", {
            foeId,
            instanceId,
            rawArg,
            last
        });
    }

    saveGameState(s);
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

EFFECT_HANDLERS.drawSpecificVillain = function(args = [], card, selectedData = {}) {
    const id = args?.[0];
    const s = selectedData?.state || gameState;
    if (!id || !s) return;

    if (!Array.isArray(s.villainDeck)) {
        console.warn("[drawSpecificVillain] No villain deck available.");
        return;
    }

    const ptr = Number.isInteger(s.villainDeckPointer) ? s.villainDeckPointer : 0;
    const insertAt = Math.max(0, Math.min(ptr, s.villainDeck.length));
    const idStr = String(id);

    s.villainDeck.splice(insertAt, 0, idStr);

    try { saveGameState(s); } catch (_) {}

    try {
        villainDraw(1);
    } catch (err) {
        console.warn("[drawSpecificVillain] villainDraw failed after inserting card", err);
    }
};

EFFECT_HANDLERS.healAbandonedFoe = function(args = [], card, selectedData = {}) {
    const amt = Number(args?.[0] ?? 0) || 0;
    const s = selectedData?.state || gameState;
    if (!s || amt <= 0) return;
    s.healAbandonedFoeAmount = amt;
};

EFFECT_HANDLERS.doubleVillainLife = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    let slotIndex = selectedData?.slotIndex;
    let entry = selectedData?.foeEntry || null;

    const targetRaw = args?.[0];
    const selector = String(targetRaw || "").toLowerCase().trim();

    const applyToEntry = (foeEntry, idx) => {
        if (!foeEntry) return;
        const key = getEntryKey(foeEntry) || String(foeEntry.id || "");
        const foeCard = findCardInAllSources(foeEntry.id);
        const baseHP = Number(foeEntry.maxHP ?? foeCard?.hp ?? foeCard?.baseHP ?? 0);

        if (!state.villainHP) state.villainHP = {};
        let current = typeof foeEntry.currentHP === "number"
            ? foeEntry.currentHP
            : (key && typeof state.villainHP[key] === "number" ? state.villainHP[key] : baseHP);

        if (!Number.isFinite(current)) current = baseHP;

        const newHP = current * 2;
        foeEntry.currentHP = newHP;
        foeEntry.maxHP = Math.max(foeEntry.maxHP || baseHP, newHP);
        if (key) state.villainHP[key] = newHP;
        if (foeCard) foeCard.currentHP = newHP;

        if (typeof idx === "number") {
            try { refreshFoeCardUI(idx, foeEntry); } catch (err) { console.warn("[doubleVillainLife] Failed to refresh UI.", err); }
        }

        try {
            const name = foeCard?.name || `Enemy ${foeEntry.id ?? ""}`.trim();
            appendGameLogEntry(`${name} doubled its HP to ${newHP}.`, state);
        } catch (err) {
            console.warn("[doubleVillainLife] Failed to log HP change.", err);
        }
    };

    if (selector === "all" || selector === "any" || selector === "everyone") {
        const cities = Array.isArray(state?.cities) ? state.cities : [];
        cities.forEach((e, idx) => {
            if (!e || e.id == null) return;
            applyToEntry(e, idx);
        });
        saveGameState(state);
        return;
    }

    if (!entry && typeof slotIndex === "number" && Array.isArray(state?.cities)) {
        entry = state.cities[slotIndex];
    }

    if (!entry && Array.isArray(state?.cities)) {
        entry = state.cities.find(e => e && String(e.id) === String(card?.id));
        slotIndex = entry ? entry.slotIndex : slotIndex;
    }

    if (!entry) {
        console.warn("[doubleVillainLife] No foe entry available.");
        return;
    }

applyToEntry(entry, slotIndex);
    saveGameState(state);
};

EFFECT_HANDLERS.giveVillainHP = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    let amt = resolveNumericValue(args?.[0], heroId, state);
    if (!Number.isFinite(amt)) amt = Number(args?.[0]) || 0;
    if (!amt) return;

    const whoRaw = args?.[1] ?? "all";
    const who = String(whoRaw || "").toLowerCase().trim();

    const cities = Array.isArray(state?.cities) ? state.cities : [];
    if (!cities.length) return;

    const isVillainEntry = (entry) => {
        if (!entry || entry.id == null) return false;
        const cardData = findCardInAllSources(entry.id);
        return String(cardData?.type || "").toLowerCase() === "villain";
    };

    const applyHP = (entry, idx) => {
        if (!entry || entry.id == null) return;
        const key = getEntryKey(entry) || String(entry.id || "");
        const cardData = findCardInAllSources(entry.id);
        const baseHP = Number(entry.maxHP ?? cardData?.hp ?? cardData?.baseHP ?? 0) || 0;
        const current = Number(entry.currentHP ?? (key && state.villainHP?.[key]) ?? baseHP) || 0;
        const next = current + amt;

        entry.currentHP = next;
        entry.maxHP = Math.max(entry.maxHP || baseHP, next); // allow overheal to extend max for future heals

        if (!state.villainHP) state.villainHP = {};
        if (key) state.villainHP[key] = next;
        state.villainHP[String(entry.id)] = next;
        if (cardData) cardData.currentHP = next;

        if (typeof idx === "number") {
            try { refreshFoeCardUI(idx, entry); } catch (err) { console.warn("[giveVillainHP] Failed to refresh UI", err); }
        }

        try {
            const name = cardData?.name || `Enemy ${entry.id}`;
            const verb = amt >= 0 ? "gained" : "lost";
            appendGameLogEntry(`${name} ${verb} ${Math.abs(amt)} HP.`, state);
        } catch (err) {
            console.warn("[giveVillainHP] Failed to log HP change", err);
        }
    };

    const pickEdge = (villainOnly, fromLeft) => {
        let chosen = null;
        cities.forEach((entry, idx) => {
            if (!entry || entry.id == null) return;
            if (villainOnly && !isVillainEntry(entry)) return;
            if (!chosen || (fromLeft ? idx < chosen.idx : idx > chosen.idx)) {
                chosen = { entry, idx };
            }
        });
        return chosen;
    };

    if (who === "leftmostvillain" || who === "rightmostvillain") {
        const target = pickEdge(true, who === "leftmostvillain");
        if (!target) {
            console.warn(`[giveVillainHP] No ${who} target found.`);
            return;
        }
        applyHP(target.entry, target.idx);
        saveGameState(state);
        return;
    }

    if (who === "leftmost" || who === "rightmost") {
        const target = pickEdge(false, who === "leftmost");
        if (!target) {
            console.warn(`[giveVillainHP] No ${who} target found.`);
            return;
        }
        applyHP(target.entry, target.idx);
        saveGameState(state);
        return;
    }

    if (who === "all") {
        cities.forEach((entry, idx) => {
            if (!entry || entry.id == null) return;
            applyHP(entry, idx);
        });
        saveGameState(state);
        return;
    }

    // Fallback: try to treat unknown selectors as a direct slot index
    const idx = Number(whoRaw);
    if (Number.isInteger(idx) && idx >= 0 && idx < cities.length) {
        const entry = cities[idx];
        if (!entry || entry.id == null) {
            console.warn(`[giveVillainHP] No foe at slot ${idx}.`);
            return;
        }
        applyHP(entry, idx);
        saveGameState(state);
        return;
    }

    console.warn(`[giveVillainHP] Unknown target '${whoRaw}'.`);
};

EFFECT_HANDLERS.enaDrawsExtra = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    if (!s) return;
    s.enemyDrawExtra = Math.max(1, Number(s.enemyDrawExtra) || 0);
};

EFFECT_HANDLERS.endAllTemporaryDampeners = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    if (!s) return;

    const logs = [];

    if (s.extraTravelDampener) {
        s.extraTravelDampener = null;
        logs.push("Travel dampener ended.");
    }
    if (s.extraDrawDampener) {
        s.extraDrawDampener = null;
        logs.push("Draw dampener ended.");
    }
    if (s.iconAbilityDampener) {
        s.iconAbilityDampener = null;
        logs.push("Icon ability dampener ended.");
    }
    if (s.retreatDampener) {
        s.retreatDampener = null;
        logs.push("Retreat dampener ended.");
    }

    if (Array.isArray(s.halfDamageModifiers)) {
        const before = s.halfDamageModifiers.length;
        s.halfDamageModifiers = s.halfDamageModifiers.filter(mod => {
            if (!mod) return false;
            return mod.expiresAtTurnCounter == null; // keep only permanent entries
        });
        if (before !== s.halfDamageModifiers.length) {
            logs.push("Half-damage effects ended.");
        }
    }

    pruneFoeDoubleDamage(s);

    logs.forEach(msg => appendGameLogEntry(msg, s));
    saveGameState(s);
};

EFFECT_HANDLERS.disableCityRestoration = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    if (!s) return;
    s.cityRestorationDisabled = true;
};

EFFECT_HANDLERS.reverseBoardPositions = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    if (!s) return;

    const pairs = [
        [0, 10], [1, 11],
        [2, 8],  [3, 9],
        [4, 6],  [5, 7]
    ];

    swapBoardSlots(s, pairs);
    saveGameState(s);
};

EFFECT_HANDLERS.doubleVillainHPandDamage = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.cities)) return;

    const targetRaw = args?.[0] ?? "all";
    const typeRaw = args?.[1] ?? "any";

    const typeKey = String(typeRaw || "any").toLowerCase().trim();
    const matchesType = (entry) => {
        const cardData = findCardInAllSources(entry.id);
        const t = String(cardData?.type || "").toLowerCase();
        if (typeKey === "any" || typeKey === "all") return true;
        if (typeKey === "enemy") return t === "villain" || t === "henchman";
        return t === typeKey;
    };

    const pickTargets = () => {
        const list = [];
        const lower = String(targetRaw || "all").toLowerCase().trim();

        if (lower === "all") {
            s.cities.forEach((entry, idx) => {
                if (!entry || entry.id == null) return;
                if (!matchesType(entry)) return;
                list.push({ entry, slotIndex: idx });
            });
            return list;
        }

        if (lower === "leftmost") {
            for (let idx = 0; idx < s.cities.length; idx++) {
                const entry = s.cities[idx];
                if (!entry || entry.id == null) continue;
                if (!matchesType(entry)) continue;
                return [{ entry, slotIndex: idx }];
            }
            return [];
        }

        if (lower === "rightmost") {
            for (let idx = s.cities.length - 1; idx >= 0; idx--) {
                const entry = s.cities[idx];
                if (!entry || entry.id == null) continue;
                if (!matchesType(entry)) continue;
                return [{ entry, slotIndex: idx }];
            }
            return [];
        }

        if (/^\d+$/.test(lower)) {
            const idx = Number(lower);
            const entry = s.cities[idx];
            if (entry && matchesType(entry)) return [{ entry, slotIndex: idx }];
            return [];
        }

        return [];
    };

    const targets = pickTargets();
    if (!targets.length) {
        console.log("[doubleVillainHPandDamage] No matching targets found.");
        return;
    }

    targets.forEach(({ entry, slotIndex }) => {
        const key = getEntryKey(entry) || String(entry.id || "");
        const foeCard = findCardInAllSources(entry.id);
        const baseHP = Number(entry.maxHP ?? foeCard?.hp ?? foeCard?.baseHP ?? 0);

        if (!s.villainHP) s.villainHP = {};
        let currentHP = typeof entry.currentHP === "number"
            ? entry.currentHP
            : (key && typeof s.villainHP[key] === "number" ? s.villainHP[key] : baseHP);

        if (!Number.isFinite(currentHP)) currentHP = baseHP;

        const newHP = currentHP * 2;
        entry.currentHP = newHP;
        entry.maxHP = Math.max(entry.maxHP || baseHP, newHP);
        if (key) s.villainHP[key] = newHP;
        if (foeCard) foeCard.currentHP = newHP;

        const currentDmg = getEffectiveFoeDamage(entry);
        const bonus = Number(entry.currentDamageBonus || 0);
        entry.currentDamageBonus = bonus + currentDmg;
        const newDamage = getEffectiveFoeDamage(entry);

        if (typeof slotIndex === "number") {
            try { refreshFoeCardUI(slotIndex, entry); } catch (err) { console.warn("[doubleVillainHPandDamage] Failed to refresh UI.", err); }
        }

        try {
            const name = foeCard?.name || `Enemy ${entry.id ?? ""}`.trim();
            appendGameLogEntry(`${name} doubled its HP to ${newHP} and damage to ${newDamage}.`, s);
        } catch (err) {
            console.warn("[doubleVillainHPandDamage] Failed to log HP/damage change.", err);
        }
    });

    saveGameState(s);
};

EFFECT_HANDLERS.halveVillainHPDoubleDamage = function(args = [], card, selectedData = {}) {
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.cities)) return;

    const targetRaw = args?.[0] ?? "all";
    const lower = String(targetRaw || "all").toLowerCase().trim();

    const targets = [];
    s.cities.forEach((entry, idx) => {
        if (!entry || entry.id == null) return;
        const foeCard = findCardInAllSources(entry.id);
        const t = String(foeCard?.type || "").toLowerCase();
        const isEnemy = t === "villain" || t === "henchman";
        if (!isEnemy) return;
        if (lower === "all" || lower === "any") {
            targets.push({ entry, slotIndex: idx, card: foeCard });
        }
    });

    if (!targets.length) {
        console.log("[halveVillainHPDoubleDamage] No enemies on board to affect.");
        return;
    }

    targets.forEach(({ entry, slotIndex, card }) => {
        const key = getEntryKey(entry) || String(entry.id || "");
        const baseHP = Number(entry.maxHP ?? card?.hp ?? card?.baseHP ?? 0);
        if (!s.villainHP) s.villainHP = {};
        let currentHP = typeof entry.currentHP === "number"
            ? entry.currentHP
            : (key && typeof s.villainHP[key] === "number" ? s.villainHP[key] : baseHP);
        if (!Number.isFinite(currentHP)) currentHP = baseHP;

        const halvedHP = Math.max(1, Math.ceil(currentHP / 2));
        entry.currentHP = halvedHP;
        entry.maxHP = Math.max(entry.maxHP || baseHP, baseHP);
        if (key) s.villainHP[key] = halvedHP;
        if (card) card.currentHP = halvedHP;

        const currentDmg = getEffectiveFoeDamage(entry);
        entry.currentDamageBonus = Number(entry.currentDamageBonus || 0) + currentDmg;
        const newDamage = getEffectiveFoeDamage(entry);

        if (typeof slotIndex === "number") {
            try { refreshFoeCardUI(slotIndex, entry); } catch (_) {}
        }

        try {
            const name = card?.name || `Enemy ${entry.id}`;
            appendGameLogEntry(`${name} HP reduced to ${halvedHP} and damage doubled to ${newDamage}.`, s);
        } catch (err) {
            console.warn("[halveVillainHPDoubleDamage] Failed to log change.", err);
        }
    });

    saveGameState(s);
};

function halveFoeHP(entry, slotIndex, state = gameState) {
    const s = state || gameState;
    if (!entry || !s) return;

    const key = getEntryKey(entry) || String(entry.id || "");
    const foeCard = findCardInAllSources(entry.id);
    const baseHP = Number(entry.maxHP ?? foeCard?.hp ?? foeCard?.baseHP ?? 0) || 0;
    if (!s.villainHP) s.villainHP = {};
    let currentHP = typeof entry.currentHP === "number"
        ? entry.currentHP
        : (key && typeof s.villainHP[key] === "number" ? s.villainHP[key] : baseHP);
    if (!Number.isFinite(currentHP)) currentHP = baseHP;

    const halvedHP = Math.max(1, Math.ceil(currentHP / 2));
    entry.currentHP = halvedHP;
    entry.maxHP = Math.max(entry.maxHP || baseHP, baseHP);
    if (key) s.villainHP[key] = halvedHP;
    if (foeCard) foeCard.currentHP = halvedHP;

    if (typeof slotIndex === "number") {
        try { refreshFoeCardUI(slotIndex, entry); } catch (_) {}
    }

    try {
        const name = foeCard?.name || `Enemy ${entry.id ?? ""}`.trim();
        appendGameLogEntry(`${name}'s HP was reduced to ${halvedHP}.`, s);
    } catch (err) {
        console.warn("[halveFoeHP] Failed to log change.", err);
    }
}

EFFECT_HANDLERS.halveVillainHP = function(args = [], card, selectedData = {}) {
    const targetRaw = args?.[0] ?? "any";
    const s = selectedData?.state || gameState;
    if (!s || !Array.isArray(s.cities)) return;

    const norm = String(targetRaw || "any").toLowerCase();

    // UI selection (click-to-confirm)
    if (norm === "any") {
        if (typeof window === "undefined") {
            console.warn("[halveVillainHP] 'any' selection requires browser UI.");
            return;
        }

        const heroId = selectedData?.currentHeroId ?? null;
        window.__damageFoeSelectMode = {
            heroId,
            state: s,
            allowedTypes: ["Henchman", "Villain"],
            requireConfirm: true,
            confirmMessage: "Halve this foe's HP?",
            customHandler: ({ entry, slotIndex, state: st }) => {
                halveFoeHP(entry, slotIndex, st);
                processQueuedHeroDamage(st);
            }
        };

        try { showMightBanner("Choose a foe to halve their HP", 1800); } catch (err) {
            console.warn("[halveVillainHP] Could not show selection banner.", err);
        }
        return;
    }

    // Direct targeting by slot index
    const idx = Number(norm);
    if (Number.isInteger(idx) && idx >= 0 && idx < s.cities.length) {
        const entry = s.cities[idx];
        if (entry && entry.id != null) {
            halveFoeHP(entry, idx, s);
            saveGameState(s);
        }
        return;
    }

    // All foes
    if (norm === "all") {
        s.cities.forEach((entry, idx) => {
            if (!entry || entry.id == null) return;
            const cardData = findCardInAllSources(entry.id);
            const t = String(cardData?.type || "").toLowerCase();
            if (t === "henchman" || t === "villain") {
                halveFoeHP(entry, idx, s);
            }
        });
        saveGameState(s);
        return;
    }

    console.warn("[halveVillainHP] Unsupported target:", targetRaw);
};

EFFECT_HANDLERS.overlordRegainLife = function(args = [], card, selectedData = {}) {
    const amt = Number(args?.[0] ?? 0) || 0;
    if (amt <= 0) return;

    const s = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;
    const info = getCurrentOverlordInfo(s);
    if (!info || info.kind === "scenario") return;

    const baseHP = Number(info.baseHP || info.card?.hp || 0) || 0;
    const current = Number(info.currentHP || 0) || 0;
    const heal = Math.max(0, Math.min(amt, baseHP - current));
    if (heal <= 0) return;

    damageOverlord(-heal, s, heroId);
};

// No-op handler for passive marker; logic handled via foeDisablesIconAbilities
EFFECT_HANDLERS.disableIconAbilitiesAgainst = function() {};
// No-op handler for passive marker; logic handled via foeDisablesRetreat
EFFECT_HANDLERS.disableRetreatAgainst = function() {};
EFFECT_HANDLERS.koFromKO = function(args = [], card, selectedData = {}) {
    const count = Number(args?.[0]) || 0;
    const mode = args?.[1] ?? "random";
    koFromKO(count, selectedData?.state || gameState, mode);
};

EFFECT_HANDLERS.logDamageCheckDamage = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    let entry = selectedData?.foeEntry || null;
    let slotIndex = selectedData?.slotIndex;

    if (!entry && typeof slotIndex === "number" && Array.isArray(state?.cities)) {
        entry = state.cities[slotIndex];
    }

    if (!entry) return;

    const cardId = state?._lastDamageContext?.cardId || null;
    if (!cardId) return;

    const alreadyHad = hasCardDamagedEntry(entry, cardId);
    if (!alreadyHad) {
        if (!Array.isArray(entry.damagedByCardIds)) entry.damagedByCardIds = [];
        entry.damagedByCardIds.push(cardId);
        try {
            console.log("[logDamageCheckDamage] Recorded new damaging card id", cardId, "Current list:", entry.damagedByCardIds);
        } catch (err) {
            // ignore logging failures
        }
    }
    saveGameState(state);
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

    if (iconAbilitiesDisabledForHero(heroId, gameState)) {
        console.log(`[beforeDraw] Icon abilities disabled for ${heroObj.name} (engaged with foe).`);
        return;
    }

    const { effects: effs, names } = getHeroAbilitiesWithTemp(heroId, gameState);
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

    if (iconAbilitiesDisabledForHero(heroId, gameState)) {
        console.log(`[wouldUseDamageCard] Icon abilities disabled for ${heroObj.name} (engaged with foe).`);
        return;
    }

    const { effects: effs, names } = getHeroAbilitiesWithTemp(heroId, gameState);
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

    if (isScanBlocked(gameState)) {
        const turn = typeof gameState.turnCounter === "number" ? gameState.turnCounter : null;
        const shouldLog = turn == null || gameState._scanBlockLogTurn !== turn;
        if (shouldLog) {
            appendGameLogEntry("Scanning is disabled.", gameState);
            gameState._scanBlockLogTurn = turn;
        }
        console.log("[scanDeck] Scanning is currently disabled.");
        return;
    }

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
// Accepts an options object (e.g., { activate: true, ko: false, draw: false, discard: false, closeAfter: null }) and returns
// the cards currently in scannedBuffer in the order found.
function applyScanEffects(opts = {}) {
    const activate = !!opts.activate;
    const ko = !!opts.ko;
    const draw = !!opts.draw;
    const discard = !!opts.discard;
    const closeAfter = Number.isFinite(Number(opts.closeAfter)) ? Number(opts.closeAfter) : null;
    const buf = Array.isArray(gameState.scannedBuffer) ? [...gameState.scannedBuffer] : [];

    console.log("[applyScanEffects] Called with options", { activate, ko, draw, discard, closeAfter, raw: opts });
    console.log("[applyScanEffects] scannedBuffer contents before clearing:", buf);

    // Top-of-page banner to indicate which buttons are enabled for the shown scans
    try {
        if (typeof document !== "undefined" && document.body) {
            const existing = document.getElementById("scan-banner");
            // If scanning is blocked, remove any existing banner and skip rendering a new one
            if (isScanBlocked(gameState)) {
                if (existing) existing.remove();
            } else {
                if (existing) existing.remove();

                const flags = [
                    { key: "Activate", enabled: activate },
                    { key: "Discard",  enabled: discard },
                    { key: "Draw",     enabled: draw },
                    { key: "KO",       enabled: ko }
                ]
                .filter(f => f.enabled)
                .map(f => f.key)
                .sort((a, b) => a.localeCompare(b));

                const label = flags.length ? flags.join(", ") : "None";
                const banner = document.createElement("div");
                banner.id = "scan-banner";
                banner.textContent = `${label} shown cards Left to Right. ➡`;
                banner.style.position = "fixed";
                banner.style.top = "0";
                banner.style.left = "0";
                banner.style.width = "100%";
                banner.style.padding = "10px 8px";
                banner.style.textAlign = "center";
                banner.style.fontFamily = "'Racing Sans One', 'Montserrat', 'Helvetica', sans-serif";
                banner.style.fontSize = "24px";
                banner.style.fontWeight = "800";
                banner.style.color = "#fff";
                banner.style.textShadow = "1px 1px 4px rgba(0,0,0,0.7)";
                banner.style.background = "linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4), rgba(0,0,0,0.7))";
                banner.style.zIndex = "12000";
                banner.style.pointerEvents = "none";

                document.body.appendChild(banner);
            }
        }
    } catch (err) {
        console.warn("[applyScanEffects] Failed to render scan banner", err);
    }

    // Render the scanned cards using hero preview styling (no buttons)
    renderScannedPreview(buf, { activate, ko, draw, discard });

    // Persist the displayed set so it survives refresh
    gameState.scannedDisplay = buf;
    gameState.scannedDisplayOpts = { activate, ko, draw, discard };

    // Only track closeAfter when explicitly provided; otherwise clear it
    gameState.scannedCloseAfterRemaining = Number.isFinite(closeAfter) ? closeAfter : null;
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
    //   applyScanEffects(draw,discard)
    //   applyScanEffects(draw,closeAfter(1))
    const opts = { activate: false, ko: false, draw: false, discard: false, closeAfter: null };

    args.forEach((arg, idx) => {
        if (typeof arg === "string") {
            const lower = arg.toLowerCase();
            if (lower === "activate") opts.activate = true;
            if (lower === "ko") opts.ko = true;
            if (lower === "draw") opts.draw = true;
            if (lower === "discard") opts.discard = true;
            const m = lower.match(/^closeafter\((\d+)\)$/);
            if (m) opts.closeAfter = Number(m[1]);
        } else if (typeof arg === "boolean") {
            if (idx === 0) opts.activate = arg;
            if (idx === 1) opts.ko = arg;
            if (idx === 0) opts.draw = arg;
            if (idx === 1) opts.discard = arg;
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
    maybeCloseScanPreview();
    decrementScanCloseAfter();
}

function closeScanPreview() {
    const bar = document.getElementById("scan-preview-bar");
    const backdrop = document.getElementById("scan-preview-backdrop");
    const inner = document.getElementById("scan-preview-inner");
    const banner = document.getElementById("scan-banner");

    if (bar) bar.style.display = "none";
    if (backdrop) backdrop.style.display = "none";
    if (inner) inner.innerHTML = "";
    if (banner) banner.remove();

    // Reset persisted preview state
    gameState.scannedDisplay = [];
    gameState.scannedDisplayOpts = {};
    gameState.scannedBuffer = [];
    gameState.scannedCloseAfterRemaining = null;
    saveGameState(gameState);
}

function maybeCloseScanPreview() {
    // If no explicit closeAfter was set and nothing remains to show, close the preview
    const hasExplicitCloseAfter = Number.isFinite(Number(gameState.scannedCloseAfterRemaining));
    const display = Array.isArray(gameState.scannedDisplay) ? gameState.scannedDisplay : [];
    if (!hasExplicitCloseAfter && display.length === 0) {
        closeScanPreview();
    }
}

function decrementScanCloseAfter() {
    const remainingRaw = gameState.scannedCloseAfterRemaining;
    if (remainingRaw === null || remainingRaw === undefined) return;
    const remaining = Number(remainingRaw);
    if (!Number.isFinite(remaining)) return;
    const next = remaining - 1;
    gameState.scannedCloseAfterRemaining = next;
    if (next <= 0) {
        closeScanPreview();
    } else {
        saveGameState(gameState);
    }
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
    maybeCloseScanPreview();
    decrementScanCloseAfter();
}

function removeScannedCardFromPreview(cardId) {
    const currentDisplay = Array.isArray(gameState.scannedDisplay) ? gameState.scannedDisplay : [];
    const filtered = [];
    let removed = false;
    for (const entry of currentDisplay) {
        if (!removed && entry && String(entry.id) === String(cardId)) {
            removed = true;
            continue;
        }
        filtered.push(entry);
    }
    gameState.scannedDisplay = filtered;
    const opts = gameState.scannedDisplayOpts || {};
    renderScannedPreview(filtered, opts);
    saveGameState(gameState);
    return removed;
}

function removeCardFromHeroDeck(cardId, heroState) {
    if (!heroState) return false;
    if (!Array.isArray(heroState.deck)) heroState.deck = [];
    let idx = heroState.deck.indexOf(cardId);
    if (idx === -1 && heroState.deck.length > 0 && typeof heroState.deck[0] !== "string") {
        idx = heroState.deck.findIndex(c => String(c) === cardId);
    }
    if (idx >= 0) {
        heroState.deck.splice(idx, 1);
        return true;
    }
    return false;
}

function handleScanDraw(cardInfo = {}) {
    const cardId = cardInfo?.id ? String(cardInfo.id) : null;
    if (!cardId) {
        console.warn("[handleScanDraw] No card id provided.", cardInfo);
        return;
    }
    const heroId = cardInfo.heroId ?? (gameState.heroes?.[gameState.heroTurnIndex ?? 0]);
    const heroState = heroId ? gameState.heroData?.[heroId] : null;
    if (!heroState) {
        console.warn("[handleScanDraw] No heroState for hero", heroId);
        return;
    }
    if (!Array.isArray(heroState.hand)) heroState.hand = [];

    const removedDeck = removeCardFromHeroDeck(cardId, heroState);
    heroState.hand.push(cardId);
    renderHeroHandBar(gameState);
    saveGameState(gameState);
    const removedPreview = removeScannedCardFromPreview(cardId);
    if (!removedDeck && !removedPreview) {
        console.log("[handleScanDraw] Card not found in deck/preview; state left unchanged.");
    }
    maybeCloseScanPreview();
    decrementScanCloseAfter();
}

function handleScanDiscard(cardInfo = {}) {
    const cardId = cardInfo?.id ? String(cardInfo.id) : null;
    if (!cardId) {
        console.warn("[handleScanDiscard] No card id provided.", cardInfo);
        return;
    }
    const heroId = cardInfo.heroId ?? (gameState.heroes?.[gameState.heroTurnIndex ?? 0]);
    const heroState = heroId ? gameState.heroData?.[heroId] : null;
    if (!heroState) {
        console.warn("[handleScanDiscard] No heroState for hero", heroId);
        return;
    }
    if (!Array.isArray(heroState.discard)) heroState.discard = [];

    const removedDeck = removeCardFromHeroDeck(cardId, heroState);
    heroState.discard.push(cardId);
    saveGameState(gameState);
    const removedPreview = removeScannedCardFromPreview(cardId);
    if (!removedDeck && !removedPreview) {
        console.log("[handleScanDiscard] Card not found in deck/preview; state left unchanged.");
    }
    maybeCloseScanPreview();
    decrementScanCloseAfter();
}

export function renderScannedPreview(cards = [], opts = {}) {
    if (typeof document === "undefined") return;

    const activateFlag = !!opts.activate;
    const koFlag = !!opts.ko;
    const drawFlag = !!opts.draw;
    const discardFlag = !!opts.discard;

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
        closeBtn.style.zIndex = "12050";
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
            const discardEl = e.target.closest("[data-scan-discard]");
            if (discardEl) {
                e.stopPropagation();
                const info = {
                    id: discardEl.dataset.cardId,
                    source: discardEl.dataset.cardSource,
                    heroId: discardEl.dataset.cardHeroId || null,
                    name: discardEl.dataset.cardName || discardEl.dataset.cardId
                };
                console.log(`[scan preview] discard clicked (delegate): ${info.name}`);
                handleScanDiscard(info);
                return;
            }
            const drawEl = e.target.closest("[data-scan-draw]");
            if (drawEl) {
                e.stopPropagation();
                const info = {
                    id: drawEl.dataset.cardId,
                    source: drawEl.dataset.cardSource,
                    heroId: drawEl.dataset.cardHeroId || null,
                    name: drawEl.dataset.cardName || drawEl.dataset.cardId
                };
                console.log(`[scan preview] draw clicked (delegate): ${info.name}`);
                handleScanDraw(info);
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
                actBtn.src = "https://raw.githubusercontent.com/over-lords/overlords/9f43e31dbcb6c27a33f79e1ddf8c60f1044fe2b6/Public/Images/Site%20Assets/drawCard.png";
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

        if (discardFlag) {
            const discardBtn = document.createElement("img");
            discardBtn.src = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Site%20Assets/discardPivotRight.png";
            discardBtn.alt = "Discard";
            discardBtn.style.width = "70px";
            discardBtn.style.height = "70px";
            discardBtn.style.cursor = "pointer";
            discardBtn.style.display = "block";
            discardBtn.style.position = "absolute";
            discardBtn.style.top = "20px";
            discardBtn.style.left = "50%";
            discardBtn.style.transform = "translateX(-50%)";
            discardBtn.style.zIndex = "2";
            discardBtn.style.pointerEvents = "auto";
            discardBtn.dataset.scanDiscard = "1";
            discardBtn.dataset.cardId = cardId;
            discardBtn.dataset.cardSource = cardInfo?.source || "";
            discardBtn.dataset.cardHeroId = cardInfo?.heroId ?? "";
            discardBtn.dataset.cardName = cardData?.name || cardId;
            discardBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                handleScanDiscard(cardInfo);
            }, true);

            const badge = document.createElement("div");
            badge.style.width = "84px";
            badge.style.height = "84px";
            badge.style.borderRadius = "50%";
            badge.style.background = "tranparent";
            badge.style.display = "flex";
            badge.style.alignItems = "center";
            badge.style.justifyContent = "center";
            badge.style.position = "absolute";
            badge.style.top = "12px";
            badge.style.left = "50%";
            badge.style.transform = "translateX(-50%)";
            badge.style.zIndex = "2";
            badge.style.boxSizing = "border-box";
            badge.style.cursor = "pointer";
            badge.style.pointerEvents = "auto";
            badge.addEventListener("click", (e) => {
                e.stopPropagation();
                discardBtn.click();
            }, true);
            badge.appendChild(discardBtn);
            outer.appendChild(badge);
        }

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

        if (drawFlag) {
            const drawBtn = document.createElement("img");
            drawBtn.src = "https://raw.githubusercontent.com/over-lords/overlords/9f43e31dbcb6c27a33f79e1ddf8c60f1044fe2b6/Public/Images/Site%20Assets/drawCard.png";
            drawBtn.alt = "Draw";
            drawBtn.style.width = "70px";
            drawBtn.style.height = "70px";
            drawBtn.style.cursor = "pointer";
            drawBtn.style.display = "block";
            drawBtn.style.position = "absolute";
            drawBtn.style.bottom = "10px";
            drawBtn.style.left = "50%";
            drawBtn.style.transform = "translateX(-50%)";
            drawBtn.style.zIndex = "2";
            drawBtn.style.pointerEvents = "auto";
            drawBtn.dataset.scanDraw = "1";
            drawBtn.dataset.cardId = cardId;
            drawBtn.dataset.cardSource = cardInfo?.source || "";
            drawBtn.dataset.cardHeroId = cardInfo?.heroId ?? "";
            drawBtn.dataset.cardName = cardData?.name || cardId;
            drawBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                handleScanDraw(cardInfo);
            }, true);

            const badge = document.createElement("div");
            badge.style.width = "84px";
            badge.style.height = "84px";
            badge.style.borderRadius = "50%";
            badge.style.background = "transparent";
            badge.style.display = "flex";
            badge.style.alignItems = "center";
            badge.style.justifyContent = "center";
            badge.style.position = "absolute";
            badge.style.bottom = "0";
            badge.style.left = "50%";
            badge.style.transform = "translateX(-50%)";
            badge.style.zIndex = "2";
            badge.style.boxSizing = "border-box";
            badge.style.cursor = "pointer";
            badge.style.pointerEvents = "auto";
            badge.addEventListener("click", (e) => {
                e.stopPropagation();
                drawBtn.click();
            }, true);
            badge.appendChild(drawBtn);
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
    const flag = args?.[1] || "";
    rallyNextHenchVillains(count, { flag });
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

EFFECT_HANDLERS.villainDraw = function(args, card, selectedData) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;
    const raw = args?.[0];
    let count = resolveNumericValue(raw, heroId, state);
    if (!Number.isFinite(count)) {
        count = Number(raw);
    }
    if (!Number.isFinite(count)) {
        count = 1;
    }
    villainDraw(Math.max(0, count));
};

EFFECT_HANDLERS.villainTeleports = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const mode = String(args?.[0] ?? "").toLowerCase();

    // Default: apply to the current villain draw only
    const cardData = selectedData?.cardData || null;
    const cardId = selectedData?.cardId ?? selectedData?.villainId ?? cardData?.id ?? null;
    const typeStr = String(cardData?.type || "").toLowerCase();

    if (typeStr !== "villain") return;

    if (mode === "turn") {
        const heroId = selectedData?.currentHeroId ?? (Array.isArray(state.heroes) ? state.heroes[state.heroTurnIndex ?? 0] : null);
        state._forceTeleportPersistent = true;
        state._forceTeleportPersistentHeroId = heroId != null ? String(heroId) : null;
        // Also apply to this immediate draw if any
        state._forceTeleportNextVillain = true;
        state._forceTeleportVillainId = cardId != null ? String(cardId) : null;
        return;
    }

    state._forceTeleportNextVillain = true;
    state._forceTeleportVillainId = cardId != null ? String(cardId) : null;
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

EFFECT_HANDLERS.increaseVillainDamage = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const slotIndex = selectedData?.slotIndex;
    const entry = selectedData?.foeEntry ?? (typeof slotIndex === "number" ? state?.cities?.[slotIndex] : null);

    const applyToEntry = (foeEntry, idx) => {
        if (!foeEntry) return;
        const raw = args?.[0];
        const delta = Number(raw) || 0;
        if (!delta) return;

        const currentBonus = Number(foeEntry.currentDamageBonus || 0);
        const nextBonus = currentBonus + delta;
        foeEntry.currentDamageBonus = nextBonus;

        const effectiveDmg = getEffectiveFoeDamage(foeEntry);
        foeEntry.currentDamage = effectiveDmg;

        // Re-render the foe on board if possible
        try {
            const citySlots = document.querySelectorAll(".city-slot");
            if (typeof idx === "number" && citySlots[idx]) {
                const slot = citySlots[idx];
                const area = slot.querySelector(".city-card-area");
                if (area) {
                    area.innerHTML = "";
                    const wrapper = document.createElement("div");
                    wrapper.className = "card-wrapper";
                    const cardData = findCardInAllSources(foeEntry.id);
                    const override = cardData
                        ? { ...cardData, damage: effectiveDmg, currentDamage: effectiveDmg }
                        : { damage: effectiveDmg, currentDamage: effectiveDmg };
                    wrapper.appendChild(renderCard(foeEntry.id, wrapper, { cardDataOverride: override }));
                    area.appendChild(wrapper);
                    wrapper.style.cursor = "pointer";
                    wrapper.addEventListener("click", (e) => {
                        e.stopPropagation();
                        const panelCard = findCardInAllSources(foeEntry.id);
                        if (panelCard) {
                            buildVillainPanel(panelCard, { instanceId: getEntryKey(foeEntry), slotIndex: idx });
                        }
                    });
                }
            }
        } catch (err) {
            console.warn("[increaseVillainDamage] Failed to re-render foe card", err);
        }
    };

    const targetRaw = args?.[1];
    const selector = String(targetRaw || "").toLowerCase().trim();

    if (selector === "all" || selector === "any" || selector === "everyone") {
        const cities = Array.isArray(state?.cities) ? state.cities : [];
        cities.forEach((entry, idx) => {
            if (!entry || entry.id == null) return;
            applyToEntry(entry, idx);
        });
        saveGameState(state);
        return;
    }

    if (!entry) {
        console.warn("[increaseVillainDamage] No foe entry provided.");
        return;
    }

    applyToEntry(entry, slotIndex);
    saveGameState(state);
};

EFFECT_HANDLERS.discard = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const heroId = selectedData?.currentHeroId ?? null;

    const rawCount = args?.[0];
    const resolvedCount = resolveNumericValue(rawCount, heroId, state);
    const count = Math.max(1, Number.isFinite(resolvedCount) ? resolvedCount : (Number(rawCount) || 1));

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

function toggleDiscardAtWill(heroId, state = gameState) {
    if (!heroId || !state) return;
    const s = state || gameState;
    const current = s.discardMode;
    const isActive =
        current &&
        String(current.heroId) === String(heroId) &&
        current.mode === "atWill" &&
        (current.remaining == null || current.remaining > 0);

    if (isActive) {
        s.discardMode = null;
        return false;
    }

    s.discardMode = {
        heroId,
        remaining: Number.MAX_SAFE_INTEGER,
        mode: "atWill"
    };
    return true;
}

EFFECT_HANDLERS.discardCardsAtWill = function(args = [], card, selectedData = {}) {
    const state = selectedData?.state || gameState;
    const heroId =
        selectedData?.currentHeroId ??
        (Array.isArray(state.heroes) ? state.heroes[state.heroTurnIndex ?? 0] : null);

    if (heroId == null) {
        console.warn("[discardCardsAtWill] No heroId resolved.");
        return;
    }

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const heroName = heroObj?.name || `Hero ${heroId}`;

    const enabled = toggleDiscardAtWill(heroId, state);
    try {
        appendGameLogEntry(
            enabled
                ? `${heroName} can now discard cards at will.`
                : `${heroName} disabled discard at will.`,
            state
        );
    } catch (err) {
        console.warn("[discardCardsAtWill] Failed to append log entry.", err);
    }

    try { renderHeroHandBar(state); } catch (err) { console.warn("[discardCardsAtWill] Failed to refresh hand bar.", err); }
    try {
        if (typeof window !== "undefined" && typeof window.updateStandardSpeedUI === "function") {
            window.updateStandardSpeedUI(state, heroId);
        }
    } catch (err) {
        console.warn("[discardCardsAtWill] Failed to refresh standard ability UI.", err);
    }
    try { saveGameState(state); } catch (err) { console.warn("[discardCardsAtWill] Failed to save state after toggle.", err); }
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

    const normWho = String(who).toLowerCase();

    if (normWho === "leftmost" || normWho === "rightmost") {
        const cities = Array.isArray(state.cities) ? state.cities : [];
        const entries = cities
            .map((entry, idx) => ({ entry, idx }))
            .filter(({ entry }) => entry && entry.id != null);

        if (!entries.length) {
            console.warn("[freezeVillain] No foes found for leftmost/rightmost.");
            return;
        }

        const target = normWho === "leftmost"
            ? entries.reduce((best, cur) => (best == null || cur.idx < best.idx ? cur : best), null)
            : entries.reduce((best, cur) => (best == null || cur.idx > best.idx ? cur : best), null);

        if (target && target.entry) {
            applyFreezeToEntry(target.entry, target.idx, state, { howLong, heroId });
        }
        return;
    }

    if (normWho === "allhenchmen") {
        const cities = Array.isArray(state.cities) ? state.cities : [];
        let applied = false;
        cities.forEach((entry, idx) => {
            if (!entry || entry.id == null) return;
            const card = findCardInAllSources(entry.id);
            if (String(card?.type || "").toLowerCase() !== "henchman") return;
            applyFreezeToEntry(entry, idx, state, { howLong, heroId });
            applied = true;
        });
        if (!applied) console.log("[freezeVillain] No henchmen found for allHenchmen.");
        return;
    }

    // default: any (selection)
    if (normWho === "any") {
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

    if (mode === "lastfrozen") {
        const info = s.lastFrozenFoe;
        if (!info && typeof window !== "undefined" && window.__freezeSelectMode && !selectedData?._afterFreeze) {
            if (!Array.isArray(window.__afterFreezeCallbacks)) window.__afterFreezeCallbacks = [];
            window.__afterFreezeCallbacks.push(() => {
                try {
                    applyPassiveToTarget(targetMode, passive, howLong, s, heroId, { _afterFreeze: true });
                } catch (err) {
                    console.warn("[giveVillainPassive] Deferred lastFrozen handling failed", err);
                }
            });
            console.log("[giveVillainPassive] Deferring lastFrozen until freeze selection resolves.");
            return;
        }

        if (!info || !Array.isArray(s.cities)) {
            console.warn("[giveVillainPassive] No lastFrozenFoe available.");
            return;
        }

        let entry = null;
        let slotIndex = Number.isInteger(info.slotIndex) ? info.slotIndex : null;

        if (info.instanceId) {
            const foundIdx = s.cities.findIndex(e => e && getEntryKey(e) === info.instanceId);
            if (foundIdx !== -1) {
                entry = s.cities[foundIdx];
                slotIndex = foundIdx;
            }
        }

        if (!entry && info.foeId) {
            for (let i = 0; i < s.cities.length; i++) {
                const e = s.cities[i];
                if (e && String(e.id) === String(info.foeId)) {
                    entry = e;
                    slotIndex = i;
                    break;
                }
            }
        }

        if (!entry && slotIndex != null) {
            entry = s.cities[slotIndex] || null;
        }

        if (!entry) {
            console.warn("[giveVillainPassive] lastFrozen not found on board.");
            return;
        }

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

EFFECT_HANDLERS.giveHeroPassive = function(args = [], card, selectedData = {}) {
    const effectSpec = args?.[0];
    if (effectSpec == null) {
        console.warn("[giveHeroPassive] No effect specified.");
        return;
    }

    const heroId =
        selectedData?.currentHeroId ??
        (Array.isArray(gameState.heroes) ? gameState.heroes[gameState.heroTurnIndex ?? 0] : null);

    if (heroId == null) {
        console.warn("[giveHeroPassive] No heroId resolved.");
        return;
    }

    const state = selectedData?.state || gameState;
    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    if (!heroObj) {
        console.warn("[giveHeroPassive] Hero not found for id:", heroId);
        return;
    }

    let duration = "current";
    let typeHint = null;
    let usesOverride = null;
    let labelHint = null;

    (args.slice(1) || []).forEach(arg => {
        if (typeof arg === "number" && !Number.isNaN(arg)) {
            usesOverride = Number(arg);
            return;
        }
        const val = String(arg ?? "").toLowerCase();
        if (["current", "turn", "currentturn", "thisturn"].includes(val)) {
            duration = "current";
            return;
        }
        if (["next", "nextturn"].includes(val)) {
            duration = "next";
            return;
        }
        if (["forever", "permanent", "always", "perma"].includes(val)) {
            duration = "forever";
            return;
        }
        if (["standard", "optional", "passive", "quick"].includes(val)) {
            typeHint = val;
            return;
        }
        if (!labelHint) {
            labelHint = String(arg);
        }
    });

    const built = buildHeroPassiveAbility(effectSpec, { typeHint, usesOverride, label: labelHint });
    if (!built || !built.abilityEntry) {
        console.warn("[giveHeroPassive] Could not build temp ability from spec:", effectSpec);
        return;
    }

    const durationNorm = normalizeHeroPassiveDuration(duration);
    const turnCount = typeof state.turnCounter === "number" ? state.turnCounter : 0;
    let expiresAtTurnCounter = null;
    if (durationNorm === "current") expiresAtTurnCounter = turnCount;
    else if (durationNorm === "next") expiresAtTurnCounter = turnCount + 1;

    const slot = addTempHeroAbility(heroId, built.abilityEntry, {
        label: built.label,
        expiresAtTurnCounter,
        source: card?.name || card?.id || null,
        createdTurnCounter: turnCount
    }, state);

    const heroName = heroObj?.name || `Hero ${heroId}`;
    const durationText =
        durationNorm === "forever"
            ? "for the rest of the game"
            : (durationNorm === "next" ? "through next turn" : "for this turn");
    if (slot != null) {
        try {
            appendGameLogEntry(`${heroName} gained ${built.label} ${durationText}.`, state);
        } catch (err) {
            console.warn("[giveHeroPassive] Failed to log passive gain.", err);
        }
        try {
            if (typeof window !== "undefined" && typeof window.updateStandardSpeedUI === "function") {
                window.updateStandardSpeedUI(state, heroId);
            }
        } catch (err) {
            console.warn("[giveHeroPassive] Failed to refresh standard ability UI.", err);
        }
        try { saveGameState(state); } catch (err) { console.warn("[giveHeroPassive] Failed to save state after granting passive.", err); }
    }
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

function isBystanderId(id) {
    const idStr = String(id);
    return bystanders.some(b => String(b.id) === idStr);
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

    const hasTargets = Array.isArray(s.cities) && s.cities.some(entry => entry && isHenchmanOrVillainId(entry.id));
    if (!hasTargets) {
        console.log("[knockback] No valid henchmen or villains to target.");
        return;
    }

    if (normalized === "allhenchmen") {
        const toKnock = s.cities
            .map((entry, idx) => ({ entry, idx }))
            .filter(({ entry }) => entry && henchmen.some(h => String(h.id) === String(entry.id)));

        if (!toKnock.length) {
            console.log("[knockback] No henchmen to target for allHenchmen.");
            return;
        }

        toKnock.forEach(({ entry, idx }) => knockbackFoe(entry, idx, s, heroId));
        return;
    }

    if (normalized !== "any") {
        console.warn("[knockback] Unsupported flag; only 'any' or 'allHenchmen' are implemented.", flag);
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
    const sharedData = selectedData || {};
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
                const bareHandler = EFFECT_HANDLERS[call];
                if (bareHandler) {
                    try {
                        bareHandler([], card, sharedData);
                    } catch (err) {
                        console.warn(`[executeEffectSafely] Handler '${call}' failed: ${err.message}`);
                    }
                } else {
                    console.warn(`[executeEffectSafely] Could not parse effect '${call}' on ${card?.name}.`);
                }
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
            handler(parsedArgs, card, sharedData);
        } catch (err) {
            console.warn(`[executeEffectSafely] Handler '${fnName}' failed: ${err.message}`);
        }
    }
}

export async function triggerRuleEffects(condition, payload = {}, state = gameState) {
    const s = state || gameState;
    const condNorm = normalizeConditionString(condition);
    if (!condNorm) return;

    const cardsToCheck = [];

    // Active tactics (accept several state slots to be resilient)
    const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
    const tacticIdSet = new Set();
    const tacticSources = [
        s.tactics,
        s.activeTactics,
        s.tacticsInPlay,
        s.selectedTactics,
        s.tacticsInDeck,
        s.tacticStack
    ];
    tacticSources.forEach(list => {
        if (!Array.isArray(list)) return;
        list.forEach(entry => {
            let id = entry;
            if (entry && typeof entry === "object") {
                if (entry.id != null) id = entry.id;
                else if (entry.tacticId != null) id = entry.tacticId;
                else if (entry.cardId != null) id = entry.cardId;
            }
            if (id == null) return;
            tacticIdSet.add(String(id));
        });
    });
    const activeTactics = Array.from(tacticIdSet)
        .map(id => tacticMap.get(id))
        .filter(Boolean);
    cardsToCheck.push(...activeTactics);

    // Active heroes (face cards)
    const heroIds = Array.isArray(s.heroes) ? s.heroes : [];
    heroIds.forEach(hid => {
        const heroCard = heroes.find(h => String(h.id) === String(hid));
        if (heroCard) cardsToCheck.push(heroCard);
    });

    // Active scenario (top of stack)
    if (Array.isArray(s.scenarioStack) && s.scenarioStack.length > 0) {
        const scenarioId = String(s.scenarioStack[s.scenarioStack.length - 1]);
        const scenarioCard = scenarios.find(sc => String(sc.id) === scenarioId);
        if (scenarioCard) cardsToCheck.push(scenarioCard);
    }

    // Current overlord (supports conditions like turnStart/turnEnd on overlords)
    const currentOv = getCurrentOverlordInfo(s);
    if (currentOv?.card) cardsToCheck.push(currentOv.card);

    for (const card of cardsToCheck) {
        const effects = [
            ...(Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : []),
            ...(Array.isArray(card.mightEffects) ? card.mightEffects : []),
            ...(Array.isArray(card.bonusEffects) ? card.bonusEffects : []),
            ...(Array.isArray(card.evilWinsEffects) ? card.evilWinsEffects : [])
        ];

        for (let idx = 0; idx < effects.length; idx++) {
            const eff = effects[idx];
            if (!eff || !eff.effect) continue;

            const rawCond = eff.condition;
            let matchesEvent = false;
            let extraConds = [];

            if (Array.isArray(rawCond)) {
                const condList = rawCond.map(c => normalizeConditionString(c)).filter(Boolean);
                matchesEvent = condList.includes(condNorm);
                extraConds = condList.filter(c => c !== condNorm);
            } else {
                const effCond = normalizeConditionString(rawCond);
                matchesEvent = !!effCond && effCond === condNorm;
            }

            // Special-case heroKod(team) with team filter
            if (!matchesEvent && condNorm === "herokod" && typeof rawCond === "string") {
                const m = rawCond.trim().toLowerCase().match(/^herokod\(([^)]+)\)$/);
                if (m) {
                    const teamKey = m[1].trim();
                    const targetHeroId = payload?.targetHeroId ?? null;
                    const targetHeroObj = heroes.find(h => String(h.id) === String(targetHeroId));
                    if (targetHeroObj && heroMatchesTeam(targetHeroObj, teamKey)) {
                        matchesEvent = true;
                        extraConds = [];
                    }
                }
            }

            if (!matchesEvent) continue;

            // All other conditions must pass
            const heroIdForCond = payload?.currentHeroId ?? null;
            let extraPass = true;
            for (const c of extraConds) {
                if (!evaluateCondition(c, heroIdForCond, s)) {
                    extraPass = false;
                    break;
                }
            }
            if (!extraPass) continue;

            const typeNorm = String(eff.type || "").toLowerCase();
            console.log(`[triggerRuleEffects] Matched condition '${condNorm}' on ${card.name} (type=${typeNorm})`);
            const runEffect = async () => {
                try {
                    await executeEffectSafely(eff.effect, card, { ...payload, state: s, tacticId: card.id });
                } catch (err) {
                    console.warn(`[triggerRuleEffects] Failed to run effect ${idx} on ${card.name}:`, err);
                }
            };

            if (typeNorm === "optional") {
                // Uses gating: align with existing hero optional handling
                const hasFiniteUses = eff.uses != null && eff.uses !== "" && Number.isFinite(Number(eff.uses));
                const usesMax = hasFiniteUses ? Number(eff.uses) : Number.POSITIVE_INFINITY;
                let remaining = usesMax;

                // If this is a hero face card, track uses on heroState.currentUses like other hero optionals
                const heroIdx = Array.isArray(s.heroes)
                    ? s.heroes.findIndex(hid => String(hid) === String(card.id))
                    : -1;
                let heroState = null;
                if (heroIdx >= 0 && s.heroData && s.heroData[s.heroes[heroIdx]]) {
                    heroState = s.heroData[s.heroes[heroIdx]];
                }
                if (heroState && hasFiniteUses) {
                    const cur = heroState.currentUses?.[idx];
                    remaining = cur == null ? usesMax : Number(cur);
                }

                if (hasFiniteUses && remaining <= 0) {
                    console.log(`[triggerRuleEffects] No uses left for optional ability on ${card.name} (idx=${idx}). Skipping prompt.`);
                    continue;
                }

                if (payload?.allowOptional === false) {
                    console.log("[triggerRuleEffects] Skipping optional effect because allowOptional=false.");
                    continue;
                }
                const label = card.abilitiesNamePrint?.[idx]?.text || "Use optional ability?";
                // Persist this prompt so a refresh can resume and resolve it
                if (condNorm === "villaindeckwoulddraw" && s) {
                    try {
                        s.pendingOptionalPrompt = {
                            text: label,
                            source: "triggerRule",
                            cond: condNorm,
                            cardId: card?.id ?? null,
                            effectIndex: idx
                        };
                        saveGameState(s);
                    } catch (err) {
                        console.warn("[triggerRuleEffects] Failed to persist optional prompt.", err);
                    }
                }
                if (payload?.rewardDeferred) payload.rewardDeferred.used = true;
                try {
                    const allow =
                        (typeof window !== "undefined" && typeof window.showOptionalAbilityPrompt === "function")
                            ? await window.showOptionalAbilityPrompt(label)
                            : (typeof window !== "undefined" && typeof window.confirm === "function")
                                ? window.confirm(label)
                                : false;
                    if (allow) {
                        if (heroState && hasFiniteUses) {
                            if (!heroState.currentUses) heroState.currentUses = {};
                            const nextUses = Math.max(0, remaining - 1);
                            heroState.currentUses[idx] = nextUses;

                            // Keep hero face-card object in sync so UI updates without refresh
                            if (!card.currentUses) card.currentUses = {};
                            card.currentUses[idx] = nextUses;
                            try { saveGameState(s); } catch (_) {}
                        }
                        await runEffect();
                    }
                    if (s?.pendingOptionalPrompt) {
                        s.pendingOptionalPrompt = null;
                        try { saveGameState(s); } catch (_) {}
                    }
                    if (payload?.rewardDeferred && typeof payload.rewardDeferred.resolve === "function") {
                        payload.rewardDeferred.resolve(allow);
                    }
                } catch (err) {
                    console.warn("[triggerRuleEffects] Optional prompt failed", err);
                    if (payload?.rewardDeferred && typeof payload.rewardDeferred.resolve === "function") {
                        payload.rewardDeferred.resolve(false);
                    }
                }
                continue;
            }

            await runEffect();
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

            const condList = Array.isArray(eff.condition) ? eff.condition : [eff.condition];
            const hasGameStart = condList.some(c => typeof c === "string" && normalizeConditionString(c) === "gamestart");
            if (hasGameStart) {

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

function getActiveUpperOrderLocal(state = gameState) {
    const s = state || gameState;
    const destroyed = s?.destroyedCities || {};
    return UPPER_ORDER.filter(idx => !destroyed[idx]);
}

async function runCharge(cardId, distance) {

    const activeUpper = getActiveUpperOrderLocal(gameState);
    if (!activeUpper.length) {
        console.warn("[runCharge] No active upper cities available for Charge entry.");
        return;
    }

    const entryIndex = activeUpper[activeUpper.length - 1];

    const shoveResult = await pushChain(entryIndex, activeUpper);
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

        let activeOrder = getActiveUpperOrderLocal(gameState);
        let fromPos = activeOrder.indexOf(entryIndex);
        if (fromPos < 0) {
            // Fallback: assume rightmost active city.
            fromPos = activeOrder.length - 1;
        }
        let stepsMoved = 0;

        for (let step = 0; step < distance; step++) {
            const moved = await attemptSingleLeftShift(fromPos, activeOrder);
            if (!moved) break;
            fromPos -= 1;
            stepsMoved += 1;
        }

        if (stepsMoved > 0) {
            try { playSoundEffect("charge"); } catch (_) {}
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

async function attemptSingleLeftShift(fromPos, activeUpperOrder = getActiveUpperOrderLocal(gameState)) {

    if (!activeUpperOrder || fromPos <= 0) return false;

    const fromIndex = activeUpperOrder[fromPos];
    const toIndex   = activeUpperOrder[fromPos - 1];

    // frozen check (per-instance first, then template flag)
    const leftEntry = gameState.cities[toIndex];
    if (leftEntry && isFrozen(leftEntry)) {
        return false;
    }

    const result = await pushChain(toIndex, activeUpperOrder);
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

        maybeTriggerEvilWinsConditions(state);

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

    // Run onEscape effects (non-takeover) safely before HP/overlord resolution
    try {
        const effects = Array.isArray(foeCard.abilitiesEffects) ? foeCard.abilitiesEffects : [];
        for (let i = 0; i < effects.length; i++) {
            const eff = effects[i];
            if (!eff || !eff.effect) continue;
            const cond = String(eff.condition || "").trim().toLowerCase();
            if (cond !== "onescape") continue;
            if (foeAbilitiesDisabled(entry)) continue;
            try {
                executeEffectSafely(eff.effect, foeCard, { state, slotIndex: entry.slotIndex, foeEntry: entry });
            } catch (err) {
                console.warn("[handleVillainEscape] onEscape effect failed", err);
            }
        }
    } catch (err) {
        console.warn("[handleVillainEscape] Failed to process onEscape effects.", err);
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

    // Allow rules/overlord effects to react to an escape (e.g., switch to max HP gain)
    try {
        triggerRuleEffects("foeEscapes", {
            state,
            escapedEntry: entry,
            escapedCard: foeCard,
            hpCurrent: vCur,
            hpMax: vMax
        }, state);
    } catch (err) {
        console.warn("[handleVillainEscape] foeEscapes triggers failed", err);
    }

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
    const useMaxHpGain = !!state._foeEscapeUseMaxHP;
    state._foeEscapeUseMaxHP = false; // one-shot
    const hpGain = useMaxHpGain ? vMax : vCur;
    console.log("[handleVillainEscape] HP gain source", {
        useMaxHpGain,
        hpGain,
        currentHP: vCur,
        maxHP: vMax
    });
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

async function pushChain(targetIndex, activeUpperOrder = getActiveUpperOrderLocal(gameState)) {

    const activeOrder = (activeUpperOrder && activeUpperOrder.length)
        ? activeUpperOrder
        : getActiveUpperOrderLocal(gameState);
    const pos = activeOrder.indexOf(targetIndex);
    if (pos < 0) {
        console.warn("[pushChain] Target index not in active upper order:", targetIndex);
        return { blockedFrozen: false };
    }
    if (pos <= 0) {
        const exiting = gameState.cities[targetIndex];
        if (!exiting) return { blockedFrozen: false };
        // Only block if we would actually move a frozen foe off the board
        if (isFrozen(exiting)) {
            console.log("[pushChain] Blocked by frozen foe at exit.", exiting);
            return { blockedFrozen: true };
        }

        gameState._lastFoeLeftCity = {
            slotIndex: targetIndex,
            instanceId: getEntryKey(exiting),
            id: exiting.id
        };

        await handleVillainEscape(exiting, gameState);
        resolveExitForVillain(exiting);
        return { blockedFrozen: false };
    }

    const nextLeft = activeOrder[pos - 1];

    // If occupied, push that one further left (recursively)
    if (gameState.cities[targetIndex]) {
        // Only block if we need to move a frozen foe
        const occupant = gameState.cities[targetIndex];
        if (isFrozen(occupant)) {
            console.log("[pushChain] Blocked by frozen foe; cannot shove.", occupant);
            return { blockedFrozen: true };
        }
        const result = await pushChain(nextLeft, activeOrder);
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

    const movingEntry = Array.isArray(gameState.cities) ? gameState.cities[fromIndex] : null;

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

    if (movingEntry) {
        gameState._lastFoeLeftCity = {
            slotIndex: fromIndex,
            instanceId: getEntryKey(movingEntry),
            id: movingEntry.id
        };
    }

    gameState.cities[toIndex] = movingEntry;
    if (gameState.cities[toIndex]) {
        gameState.cities[toIndex].slotIndex = toIndex;
        if (gameState.cities[toIndex].isFrozen) {
            ensureFrozenOverlay(toIndex);
        }
        triggerTravelsTo(gameState.cities[toIndex], toIndex, gameState);
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

function foeHasEject(entry) {
    if (!entry) return false;
    const card =
        henchmen.find(h => String(h.id) === String(entry.id)) ||
        villains.find(v => String(v.id) === String(entry.id));
    if (!card) return false;

    if (card.hasEject === true) return true;

    const effects = Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : [];
    for (const eff of effects) {
        if (!eff || (eff.type || "").toLowerCase() !== "passive") continue;
        const raw = eff.effect;
        const list = Array.isArray(raw) ? raw : [raw];
        for (const e of list) {
            if (typeof e !== "string") continue;
            if (e.trim().toLowerCase() === "haseject") return true;
        }
    }
    return false;
}

function foeDisablesIconAbilities(entry) {
    if (!entry) return false;
    const card =
        henchmen.find(h => String(h.id) === String(entry.id)) ||
        villains.find(v => String(v.id) === String(entry.id));
    if (!card) return false;

    if (card.disableIconAbilitiesAgainst === true) return true;

    const effects = Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : [];
    for (const eff of effects) {
        if (!eff || (eff.type || "").toLowerCase() !== "passive") continue;
        const raw = eff.effect;
        const list = Array.isArray(raw) ? raw : [raw];
        for (const e of list) {
            if (typeof e !== "string") continue;
            const val = e.trim().toLowerCase();
            if (val.startsWith("disableiconabilitiesagainst")) return true;
        }
    }
    return false;
}

function foeDisablesRetreat(entry) {
    if (!entry) return false;
    const card =
        henchmen.find(h => String(h.id) === String(entry.id)) ||
        villains.find(v => String(v.id) === String(entry.id));
    if (!card) return false;

    if (card.disableRetreatAgainst === true) return true;

    const effects = Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : [];
    for (const eff of effects) {
        if (!eff || (eff.type || "").toLowerCase() !== "passive") continue;
        const raw = eff.effect;
        const list = Array.isArray(raw) ? raw : [raw];
        for (const e of list) {
            if (typeof e !== "string") continue;
            const val = e.trim().toLowerCase();
            if (val.startsWith("disableretreatagainst")) return true;
        }
    }
    return false;
}

function markFoePermanentKO(entry, cardData, state = gameState) {
    if (!entry || !cardData) return;
    if (!Array.isArray(state.permanentKOFoes)) state.permanentKOFoes = [];
    const key = entry?.instanceId ?? entry?.uniqueId ?? (typeof entry?.id !== "undefined" ? String(entry.id) : null);
    const record = {
        id: entry.id,
        instanceId: key,
        name: cardData.name || `Foe ${entry.id}`,
        type: cardData.type || "Enemy",
        source: "perma-ko"
    };
    state.permanentKOFoes.push(record);
}

function isFoePermanentlyKO(entry, state = gameState) {
    if (!entry) return false;
    const key = entry?.instanceId ?? entry?.uniqueId ?? (typeof entry?.id !== "undefined" ? String(entry.id) : null);
    const list = Array.isArray(state?.permanentKOFoes) ? state.permanentKOFoes : [];
    return list.some(k => {
        const recKey = k.instanceId || k.id;
        return String(recKey) === String(key);
    });
}

async function reviveKodFoe(count = 1, state = gameState, flag = null) {
    const s = state || gameState;
    if (!s) return;
    const pool = Array.isArray(s.koCards) ? s.koCards : [];
    if (!pool.length) return;

    const permaList = Array.isArray(s.permanentKOFoes) ? s.permanentKOFoes : [];
    const eligible = pool
        .map((card, idx) => ({ card, idx }))
        .filter(({ card }) => {
            if (!card) return false;
            const type = String(card.type || "").toLowerCase();
            const henchOnly = String(flag || "").toLowerCase() === "henchmenonly";
            if (henchOnly && type !== "henchman") return false;
            if (!henchOnly && type !== "henchman" && type !== "villain") return false;
            if (card.permanentKO === true) return false;
            const recKey = card.instanceId || card.uniqueId || card.id;
            return !permaList.some(k => String(k.instanceId || k.id) === String(recKey));
        });

    if (!eligible.length) return;

    const toRevive = Math.min(Math.max(0, Number(count) || 0), eligible.length);
    let revived = 0;

    for (const { card, idx } of eligible) {
        if (revived >= toRevive) break;
        // Remove from KO pile
        pool.splice(idx - revived, 1); // adjust for prior splices
        revived += 1;

        const cardData =
            villains.find(v => String(v.id) === String(card.id)) ||
            henchmen.find(h => String(h.id) === String(card.id)) ||
            null;

        try {
            await enterVillainFromEffect(card.id);
            const name = cardData?.name || card.name || `Foe ${card.id}`;
            appendGameLogEntry(`${name} was revived from the KO pile.`, s);
        } catch (err) {
            console.warn("[reviveKodFoe] Failed to enter foe from KO pile", err);
        }
    }

    saveGameState(s);
}

function koFromKO(count = 1, state = gameState, mode = "random") {
    const s = state || gameState;
    if (!s) return;
    const pool = Array.isArray(s.koCards) ? s.koCards : [];
    if (!pool.length) return;

    const permaList = Array.isArray(s.permanentKOFoes) ? s.permanentKOFoes : [];
    const eligible = pool
        .map((card, idx) => ({ card, idx }))
        .filter(({ card }) => {
            if (!card) return false;
            const type = String(card.type || "").toLowerCase();
            if (type !== "henchman" && type !== "villain") return false;
            // Skip if already permanently KO'd
            if (card.permanentKO === true) return false;
            const recKey = card.instanceId || card.uniqueId || card.id;
            return !permaList.some(k => String(k.instanceId || k.id) === String(recKey));
        });

    const total = eligible.length;
    if (!total) return;

    const picks = Math.min(Math.max(0, Number(count) || 0), total);
    const chosen = [];
    const modeNorm = String(mode || "random").toLowerCase();

    if (modeNorm === "latest") {
        const sorted = eligible.slice().sort((a, b) => b.idx - a.idx);
        for (let i = 0; i < picks && i < sorted.length; i++) {
            chosen.push(sorted[i]);
        }
    } else {
        const poolCopy = [...eligible];
        for (let i = 0; i < picks; i++) {
            const idx = Math.floor(Math.random() * poolCopy.length);
            chosen.push(poolCopy.splice(idx, 1)[0]);
        }
    }

    chosen.forEach(({ card }) => {
        card.permanentKO = true;
        const data =
            villains.find(v => String(v.id) === String(card.id)) ||
            henchmen.find(h => String(h.id) === String(card.id)) ||
            {};
        const entry = { id: card.id, instanceId: card.instanceId || card.uniqueId || card.id };
        markFoePermanentKO(entry, data, s);
        try {
            if (typeof renderKOBar === "function") renderKOBar(s);
        } catch (e) {
            console.warn("[koFromKO] Failed to render KO bar for permanent KO foe", e);
        }
    });

    if (chosen.length) {
        const names = chosen.map(({ card }) => card.name || `Foe ${card.id}`).join(", ");
        appendGameLogEntry(
            chosen.length === 1
                ? `${names} was permanently KO'd.`
                : `Permanently KO'd: ${names}.`,
            s
        );
    }

    saveGameState(s);
}

export function iconAbilitiesDisabledForHero(heroId, state = gameState) {
    const s = state || gameState;
    const heroState = s.heroData?.[heroId];
    if (!heroState) return false;

    // Global dampener check
    const damp = s.iconAbilityDampener;
    const turnCount = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    if (damp && damp.active) {
        const expired = typeof damp.expiresAtTurnCounter === "number" && turnCount >= damp.expiresAtTurnCounter;
        if (!expired) {
            const targetAll = String(damp.target || "").toLowerCase() === "all";
            const targetCurrent = String(damp.target || "").toLowerCase() === "current";
            if (targetAll || (targetCurrent && damp.heroId != null && String(damp.heroId) === String(heroId))) {
                return true;
            }
        }
    }

    const lowerIdx = heroState.cityIndex;
    if (!Number.isInteger(lowerIdx)) return false;
    const upperIdx = lowerIdx - 1;
    if (upperIdx < 0) return false;
    const entry = Array.isArray(s.cities) ? s.cities[upperIdx] : null;
    if (!entry) return false;
    return foeDisablesIconAbilities(entry);
}

export function retreatDisabledForHero(heroId, state = gameState) {
    const s = state || gameState;
    const damp = s?.retreatDampener;
    if (damp && damp.active) {
        const turnCount = typeof s.turnCounter === "number" ? s.turnCounter : 0;
        const expired = typeof damp.expiresAtTurnCounter === "number" && turnCount >= damp.expiresAtTurnCounter;
        if (!expired) {
            const normTarget = String(damp.target || "").toLowerCase();
            if (normTarget === "all") return true;
            if (normTarget === "current" && damp.heroId != null && String(damp.heroId) === String(heroId)) return true;
        }
    }
    // If in a city, check foe-specific retreat lock
    const heroState = s.heroData?.[heroId];
    if (!heroState) return false;
    const lowerIdx = heroState.cityIndex;
    if (!Number.isInteger(lowerIdx)) return false;
    const upperIdx = lowerIdx - 1;
    if (upperIdx < 0) return false;
    const entry = Array.isArray(s.cities) ? s.cities[upperIdx] : null;
    if (!entry) return false;
    return foeDisablesRetreat(entry);
}

export function ejectHeroIfCauserHasEject(heroId, state = gameState) {
    const s = state || gameState;
    if (heroId == null) return false;

    const causer = s.lastDamageCauser;
    const slotIdx = causer?.slotIndex;
    let foeEntry = null;
    if (typeof slotIdx === "number" && Array.isArray(s.cities)) {
        foeEntry = s.cities[slotIdx];
    }
    if (!foeEntry && causer?.instanceId && Array.isArray(s.cities)) {
        foeEntry = s.cities.find(e => e && getEntryKey(e) === causer.instanceId) || null;
    }
    if (!foeEntry || !foeHasEject(foeEntry)) return false;

    const heroObj = heroes.find(h => String(h.id) === String(heroId));
    const foeCard = findCardInAllSources(foeEntry.id);
    const foeName = foeCard?.name || `Enemy ${foeEntry.id ?? ""}`.trim();
    const heroName = heroObj?.name || `Hero ${heroId}`;

    console.log(`[Eject] ${foeName} ejected ${heroName} back to HQ.`);
    appendGameLogEntry(`${heroName} was ejected to HQ by ${foeName}.`, s);
    sendHeroHomeFromBoard(heroId, s);
    saveGameState(s);
    return true;
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

export async function rallyNextHenchVillains(count, opts = {}) {
    if (!count || count <= 0) return;

    const flag = String(opts?.flag || "").toLowerCase();
    const henchmenOnly = flag === "henchmenonly";
    const villainsOnly = flag === "villainsonly";
    const deck = gameState.villainDeck;
    if (!Array.isArray(deck) || deck.length === 0) return;

    const target = Number(count) || 0;
    const ptr = gameState.villainDeckPointer ?? 0;
    const collected = [];
    const removeIdx = [];

    for (let i = ptr; i < deck.length && collected.length < target; i++) {
        const id = deck[i];
        const idStr = String(id);
        const isHench = henchmen.some(h => String(h.id) === idStr);
        const isVill = villains.some(v => String(v.id) === idStr);

        if ((henchmenOnly && isHench) || (villainsOnly && isVill) || (!henchmenOnly && !villainsOnly && (isHench || isVill))) {
            collected.push(id);
            removeIdx.push(i);
        }
    }

    // Remove collected cards without advancing pointer
    removeIdx.sort((a, b) => b - a).forEach(idx => deck.splice(idx, 1));
    gameState.villainDeckPointer = Math.min(ptr, deck.length);

    if (!collected.length) return;

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

    try { playSoundEffect("activate"); } catch (_) {}

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
        gameState._currentFoeForCard = foeSummary;
    } else {
        console.log(
            `[AbilityExecutor] ${heroName} currently has no engaged foe `
            + `(not facing Overlord and no henchman/villain in the upper city slot).`,
            {
                heroId,
                heroName
            }
        );
        gameState._currentFoeForCard = null;
    }

    const rawDamage =
        (cardData && (cardData.damage ?? cardData.dmg ?? cardData.attack)) ?? 0;
    const baseDamageAmount = Number(rawDamage) || 0;
    gameState._pendingCardBaseDamage = baseDamageAmount;
    // If a hero has a stored "next card only" damage multiplier, consume it now.
    let nextCardMult = 1;
    const heroStateForMult = heroId != null ? gameState.heroData?.[heroId] : null;
    if (heroStateForMult && typeof heroStateForMult.nextCardDamageMultiplier === "number") {
        nextCardMult = Math.max(1, Number(heroStateForMult.nextCardDamageMultiplier) || 1);
        // Consume the one-time bonus
        heroStateForMult.nextCardDamageMultiplier = 1;
        saveGameState(gameState);
    }
    gameState._pendingCardDamageMultiplier = nextCardMult;
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
            const sharedData = { currentHeroId: heroId, state: gameState };

            for (const effectString of effectsArray) {
                await executeParsedEffect(effectString, cardData, heroId, gameState, sharedData);
            }

            // Skip past all chooseOption(n) entries
            return { skipTo: j - 1 };
        }

        // ---------- NORMALIZE EFFECT LIST ----------
        const effectsArray = Array.isArray(eff.effect)
            ? eff.effect
            : [eff.effect];
        const sharedData = { currentHeroId: heroId, state: gameState };

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
                handler(parsedArgs, cardData, sharedData);
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
    const travelDamageBonus = getHeroGlobalDamageBonus(heroId, baseDamageAmount, gameState);
    if (travelDamageBonus > 0 && damageAmount > 0) {
        damageAmount += travelDamageBonus;
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
            const baseCtx = gameState._lastDamageContext || {};
            gameState._lastDamageContext = {
                ...baseCtx,
                target: "overlord",
                heroId,
                heroName,
                cardId: idStr,
                cardName,
                foeId: foeSummary.foeId,
                foeName: foeSummary.foeName,
                damageLost: 0,
                appliedDamage: damageAmount,
                intendedDamage: damageAmount
            };
        } else if (foeSummary.source === "city-upper") {
            damageAmount = applyHalfDamageModifier(damageAmount, heroId, gameState);
            damageFoe(damageAmount, foeSummary, heroId, gameState);
            const baseCtx = (gameState._lastDamageContext && gameState._lastDamageContext.cardId === idStr)
                ? gameState._lastDamageContext
                : {};
            gameState._lastDamageContext = {
                ...baseCtx,
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

    // Clear current foe cache for this card
    gameState._currentFoeForCard = null;

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

async function executeParsedEffect(effectString, cardData, heroId, gameState, sharedData = null) {
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

    const data = sharedData || { currentHeroId: heroId, state: gameState };
    executeEffectSafely(effectString, cardData, data);
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
    amount = applyHeroOutgoingDoubleDamage(amount, heroId, s);
    amount = applyDoubleDamageAgainstFoe(amount, { isOverlord: true }, s);

    const info = getCurrentOverlordInfo(s);
    if (!info) {
        console.warn("[damageOverlord] No current overlord found.");
        return;
    }

    const ovId      = info.id;
    const ovCard    = info.card;
    const prevHP    = info.currentHP;
    const currentHP = info.currentHP;
    let actualDamage = Math.max(0, Math.min(amount, currentHP));
    let newHP     = Math.max(0, currentHP - amount);
    let healed = Math.max(0, newHP - currentHP);
    let isHeal = amount < 0 && healed > 0;
    let suppressHealLog = false;
    const guardActive =
        (s.overlordGuardEnabled === true) &&
        evaluateCondition("capturedBystanderActive", null, s);
    const heroName  = heroId != null
        ? (heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`)
        : "Hero";
    const overlordName = ovCard?.name || "Overlord";
    const isFinalOverlord = info.kind !== "scenario" && Array.isArray(s.overlords) && s.overlords.length === 1;
    const upperRowOccupied = isFinalOverlord && UPPER_ORDER.some(idx => isCityOccupied(s, idx));
    const reductionSteps = (!isHeal && info.kind !== "scenario") ? collectOverlordReductionSteps(s) : [];

    if (isFinalOverlord && upperRowOccupied && newHP <= 0) {
        newHP = 1;
        actualDamage = Math.max(0, currentHP - newHP);
    } else if (guardActive && newHP <= 0) {
        newHP = 1;
        actualDamage = Math.max(0, currentHP - newHP);
    }

    playDamageSfx(actualDamage);

    const turnCount = typeof s.turnCounter === "number" ? s.turnCounter : 0;
    const ovIdStr = ovId != null ? String(ovId) : null;

    if (actualDamage > 0) {
        if (ovIdStr) {
            if (!s.overlordLastDamagedTurn) s.overlordLastDamagedTurn = {};
            if (s.overlordLastDamagedTurn[ovIdStr] !== turnCount) {
                try {
                    runOverlordFirstAttackPerTurnTriggers(s, heroId);
                } catch (err) {
                    console.warn("[damageOverlord] Failed to run firstAttackPerTurn triggers for Overlord.", err);
                }
                s.overlordLastDamagedTurn[ovIdStr] = turnCount;
            }
        }

        if (heroId != null) {
            if (!s.overlordWasAttackedThisTurn) s.overlordWasAttackedThisTurn = {};
            s.overlordWasAttackedThisTurn[heroId] = {
                turn: turnCount,
                overlordId: ovIdStr
            };
        }
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
            if (isHeal && healed > 0) {
                appendGameLogEntry(`${overlordName} gained ${healed} HP.`, s);
            } else {
                appendGameLogEntry(`${heroName} dealt ${actualDamage} damage to ${overlordName}.`, s);
            }
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
        // Clear any temp DT and damage modifiers sourced from this scenario
        if (s.heroData) {
            Object.keys(s.heroData).forEach(hid => {
                const hState = s.heroData?.[hid];
                if (!hState || !hState.tempDT) return;
                if (hState.tempDT.sourceType === "scenario" && String(hState.tempDT.sourceId) === String(ovId)) {
                    delete hState.tempDT;
                }
            });
        }
        if (Array.isArray(s.doubleDamageHeroModifiers)) {
            s.doubleDamageHeroModifiers = s.doubleDamageHeroModifiers.filter(mod => !(mod && mod.sourceType === "scenario" && String(mod.sourceId) === String(ovId)));
        }
        if (Array.isArray(s.halfDamageModifiers)) {
            s.halfDamageModifiers = s.halfDamageModifiers.filter(mod => !(mod && mod.sourceType === "scenario" && String(mod.sourceId) === String(ovId)));
        }
        clearCoastalBonusSuppressionForSource("scenario", ovId, s);
        clearTeamBonusSuppressionForSource("scenario", ovId, s);
        removeScanDisableSource(s, `card-${ovId}`);

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

        if (!isHeal && reductionSteps.length) {
            reductionSteps.forEach(step => {
                const crossed = getOverlordReductionThresholdsCrossed(prevHP, newHP, info.baseHP, step);
                crossed.forEach(threshold => {
                    try {
                        triggerRuleEffects(`overlordReducedByXFromMax(${step})`, {
                            state: s,
                            baseHP: info.baseHP,
                            threshold,
                            currentHP: newHP
                        });
                    } catch (err) {
                        console.warn("[damageOverlord] Failed to trigger overlordReducedByXFromMax", err);
                    }
                });
            });
        }

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

        // Check for "would be KO'd" triggers that can save the overlord
        if (newHP <= 0) {
            const triggered = runOverlordReducedToHPTriggers(newHP, s);
            if (triggered) {
                const latestHP = typeof s.overlordHP?.[ovId] === "number"
                    ? s.overlordHP[ovId]
                    : getCurrentOverlordInfo(s)?.currentHP;
                if (typeof latestHP === "number") {
                    newHP = latestHP;
                    if (ovCard && typeof ovCard === "object") ovCard.currentHP = latestHP;
                    s.overlordData.currentHP = latestHP;
                    suppressHealLog = true;
                }
            }
        }

        // Recompute damage/heal deltas after any trigger-based changes
        const netDelta = currentHP - newHP;
        actualDamage = Math.max(0, netDelta);
        healed = Math.max(0, -netDelta);
        isHeal = healed > 0;

        if (isHeal && healed > 0 && !suppressHealLog) {
            console.log(`Overlord ${ovId} gained ${healed} HP -> ${newHP} HP`);
            appendGameLogEntry(`${overlordName} gained ${healed} HP.`, s);
        } else {
            console.log(`Overlord ${ovId} took ${amount} damage -> ${newHP} HP`);
            appendGameLogEntry(`${heroName} dealt ${actualDamage} damage to ${overlordName}.`, s);
        }

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
    // Allow handlers that pass the flag as the second argument (string) without an options object
    if (typeof foeSummary === "string" && (!options || Object.keys(options).length === 0)) {
        options = { flag: foeSummary };
        foeSummary = null;
    }

    const s = state;

    const { flag = "single", fromAny = false, fromAll = false } = options;

    // New damage context to prevent stale pending targets from leaking between effects
    const ctxId = s._damageContextId = (Number(s._damageContextId) || 0) + 1;
    s._activeDamageContextId = ctxId;
    s._pendingDamageTarget = null;
    let effectiveAmount = amount;
    const lastCtx = s?._lastDamageContext;
    const incomingCardId = lastCtx?.cardId || null;

    // ============================================================
    // FLAG: "any" – enable UI target selection via villain panel
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

    if (flag === "lastRescuedFrom") {
        const info = s?.lastRescuedFrom;
        if (!info || !info.foeId) {
            // If a rescue selection is pending, queue this damage until rescue finishes.
            if (typeof window !== "undefined" && window.__rescueCapturedSelectMode) {
                if (!Array.isArray(window.__rescueCapturedSelectMode.afterResolve)) {
                    window.__rescueCapturedSelectMode.afterResolve = [];
                }
                const amountCopy = amount;
                const heroCopy = heroId;
                const foeCopy = foeSummary;
                const stateCopy = s;
                window.__rescueCapturedSelectMode.afterResolve.push(() => {
                    if (!stateCopy.lastRescuedFrom) {
                        console.log("[damageFoe] lastRescuedFrom still missing after rescue; skipping.");
                        return;
                    }
                    damageFoe(amountCopy, foeCopy, heroCopy, stateCopy, { flag: "lastRescuedFrom" });
                });
                console.log("[damageFoe] Queued lastRescuedFrom damage until rescue completes.");
            } else {
                console.log("[damageFoe] No lastRescuedFrom recorded.");
            }
            return;
        }

        const wantedKey = info.instanceId != null ? String(info.instanceId) : null;
        let entry = null;
        let slotIndex = null;

        if (Array.isArray(s.cities)) {
            if (Number.isInteger(info.slotIndex)) {
                const cand = s.cities[info.slotIndex];
                if (cand && cand.id != null) {
                    const candKey = getEntryKey(cand);
                    const matchesKey = wantedKey && candKey === wantedKey;
                    const matchesId = String(cand.id) === String(info.foeId);
                    if (matchesKey || matchesId) {
                        entry = cand;
                        slotIndex = info.slotIndex;
                    }
                }
            }

            if (!entry) {
                entry = s.cities.find(e => {
                    if (!e || e.id == null) return false;
                    if (wantedKey && getEntryKey(e) === wantedKey) return true;
                    return String(e.id) === String(info.foeId);
                }) || null;
                slotIndex = entry ? (entry.slotIndex ?? s.cities.indexOf(entry)) : null;
            }
        }

        if (!entry || slotIndex == null) {
            console.log("[damageFoe] lastRescuedFrom target not found; skipping damage.");
            return;
        }

        const foeIdStr = String(entry.id);
        const foeCard =
            villains.find(v => String(v.id) === foeIdStr) ||
            henchmen.find(h => String(h.id) === foeIdStr);

        if (!foeCard) {
            console.warn("[damageFoe] No card data for lastRescuedFrom id:", foeIdStr);
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
    // FLAG: "allAdjacentFoes" — auto-hit adjacent (left/right/center) foes, skipping engaged foe
    // ============================================================
    if (flag === "allAdjacentFoes") {
        const hState = heroId ? s.heroData?.[heroId] : null;
        if (!hState) {
            console.warn("[damageFoe] 'allAdjacentFoes' needs a valid heroId.");
            return;
        }
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
        let allowedSlots = [upperCenter, upperLeft, upperRight]
            .filter(idx => Number.isInteger(idx) && idx >= 0 && idx <= 10);

        // Skip the engaged foe (center) if present
        if (Array.isArray(s.cities)) {
            const engagedEntry = s.cities[upperCenter];
            if (engagedEntry && engagedEntry.id != null) {
                allowedSlots = allowedSlots.filter(idx => idx !== upperCenter);
            }
        }

        if (!allowedSlots.length || !Array.isArray(s.cities)) {
            console.log("[damageFoe] No adjacent slots available for selection.");
            return;
        }

        const targets = allowedSlots
            .map(idx => ({ idx, entry: s.cities[idx] }))
            .filter(({ entry }) => entry && entry.id != null);

        if (!targets.length) {
            console.log("[damageFoe] No foes in adjacent slots; skipping.");
            return;
        }

        targets.forEach(({ idx, entry }) => {
            const foeIdStr = String(entry.id);
            const foeCard =
                villains.find(v => String(v.id) === foeIdStr) ||
                henchmen.find(h => String(h.id) === foeIdStr);
            if (!foeCard) return;

            const summary = {
                foeType: foeCard.type || "Enemy",
                foeId: foeIdStr,
                foeName: foeCard.name || `Enemy ${foeIdStr}`,
                currentHP: entry.currentHP ?? foeCard.hp,
                slotIndex: idx,
                source: "city-upper",
                instanceId: entry.instanceId ?? entry.uniqueId ?? null
            };

            damageFoe(amount, summary, heroId, s, { flag: "single", fromAll: true });
        });

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
    // Support coastal aliases for numeric slot flags
    let coastalFlag = null;
    if (typeof flag === "string") {
        const lowerFlag = flag.toLowerCase();
        const { left, right } = checkCoastalCities(s);
        if (lowerFlag === "leftcoastal") coastalFlag = left;
        if (lowerFlag === "rightcoastal") coastalFlag = right;
    }

    const flagNum =
        coastalFlag != null
            ? coastalFlag
            : (typeof flag === "number")
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

    if (flag === "allWithBystander") {
        if (!Array.isArray(s.cities)) {
            console.warn("[damageFoe] No cities array; cannot apply 'allWithBystander' damage.");
            return;
        }

        const targets = [];

        for (let slotIndex = 0; slotIndex < s.cities.length; slotIndex++) {
            const entry = s.cities[slotIndex];
            if (!entry || entry.id == null) continue;
            const hasCaptured =
                (Array.isArray(entry.capturedBystanders) && entry.capturedBystanders.length > 0) ||
                (Number(entry.capturedBystanders) > 0);
            if (!hasCaptured) continue;

            const foeIdStr = String(entry.id);
            const foeCard =
                villains.find(v => String(v.id) === foeIdStr) ||
                henchmen.find(h => String(h.id) === foeIdStr);
            if (!foeCard) continue;

            targets.push({
                foeType: foeCard.type || "Enemy",
                foeId: foeIdStr,
                instanceId: getInstanceKey(entry),
                foeName: foeCard.name,
                currentHP: entry.currentHP ?? foeCard.hp,
                slotIndex,
                source: "city-upper"
            });
        }

        if (!targets.length) {
            console.log("[damageFoe] No foes with captured bystanders to damage.");
            return;
        }

        for (const foe of targets) {
            damageFoe(amount, foe, heroId, s, { flag: "single", fromAll: true });
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

    // ============================================================
    // FLAG: "allVillains" — damage ALL Villains in cities
    // ============================================================
    if (flag === "allVillains") {
        if (!Array.isArray(s.cities)) {
            console.warn("[damageFoe] No cities array; cannot apply 'allVillains' damage.");
            return;
        }

        console.log(`[damageFoe] Applying ${amount} damage to ALL Villains in cities.`);

        const allV = [];

        for (let slotIndex = 0; slotIndex < s.cities.length; slotIndex++) {
            const entry = s.cities[slotIndex];
            if (!entry || entry.id == null) continue;

            const foeIdStr = String(entry.id);
            const foeCard =
                villains.find(v => String(v.id) === foeIdStr) ||
                null;

            if (!foeCard || (foeCard.type && foeCard.type !== "Villain")) continue;

            allV.push({
                foeType: foeCard.type || "Enemy",
                foeId: foeIdStr,
                instanceId: getEntryKey(entry),
                foeName: foeCard.name,
                currentHP: entry.currentHP ?? foeCard.hp,
                slotIndex,
                source: "city-upper"
            });
        }

        if (!allV.length) {
            console.log("[damageFoe] No Villains in cities to damage.");
            return;
        }

        for (const foe of allV) {
            damageFoe(amount, foe, heroId, s, { flag: "single", fromAll: true });
        }

        return;
    }

    // ============================================================
    // FLAG: "allOthers" — damage all city foes except the one the hero is facing
    // If hero is facing the Overlord, hit all city foes.
    // ============================================================
    if (flag === "allothers") {
        if (!Array.isArray(s.cities)) {
            console.warn("[damageFoe] No cities array; cannot apply 'allOthers' damage.");
            return;
        }

        const heroState = heroId && s.heroData ? s.heroData[heroId] : null;
        const isFacingOverlord = !!heroState?.isFacingOverlord;
        // Determine the engaged foe and slot: prefer cached foe summary
        let engagedUpperSlot = null;
        const currentFoe = s?._currentFoeForCard;
        const engagedInstanceId = currentFoe?.instanceId ?? null;
        if (currentFoe && currentFoe.source === "city-upper" && Number.isInteger(currentFoe.slotIndex)) {
            engagedUpperSlot = currentFoe.slotIndex;
        } else if (!isFacingOverlord && Number.isInteger(Number(heroState?.cityIndex))) {
            engagedUpperSlot = Number(heroState.cityIndex) - 1; // lower index maps to upper slot
        }

        // If we lack a valid engaged slot (hero not in a city), skip the AoE entirely
        if (engagedUpperSlot == null || engagedUpperSlot < 0) {
            console.log("[damageFoe][allOthers] No engaged slot found; skipping AoE.");
            return;
        }

        console.log("[damageFoe][allOthers] debug", {
            heroId,
            engagedUpperSlot,
            engagedInstanceId,
            engagedFoeId: currentFoe?.foeId
        });

        const targets = [];

        for (let slotIndex = 0; slotIndex < s.cities.length; slotIndex++) {
            const entry = s.cities[slotIndex];
            if (!entry || entry.id == null) continue;
            // Skip the engaged foe by slot or instance match
            if (slotIndex === engagedUpperSlot) continue;
            if (engagedInstanceId && getEntryKey(entry) === String(engagedInstanceId)) continue;
            if (currentFoe && String(currentFoe.foeId || "") === String(entry.id)) continue;

            const foeIdStr = String(entry.id);
            const foeCard =
                villains.find(v => String(v.id) === foeIdStr) ||
                henchmen.find(h => String(h.id) === foeIdStr);

            if (!foeCard) continue;
            if (String(foeCard.type || "").toLowerCase() === "overlord") continue; // never include overlord in allOthers sweep

            targets.push({
                foeType: foeCard.type || "Enemy",
                foeId: foeIdStr,
                instanceId: getInstanceKey(entry),
                foeName: foeCard.name,
                currentHP: entry.currentHP ?? foeCard.hp,
                slotIndex,
                source: "city-upper"
            });
        }

        if (!targets.length) {
            console.log("[damageFoe] No qualifying foes for 'allOthers'.");
            return;
        }

        console.log("[damageFoe][allOthers] targets", targets.map(t => ({ foeId: t.foeId, slotIndex: t.slotIndex, instanceId: t.instanceId })));

        for (const foe of targets) {
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
            source: "city-foe",
            contextId: ctxId
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

    // Guard: ignore damage from the same hero card instance if already applied
    if (incomingCardId && hasCardDamagedEntry(entry, incomingCardId)) {
        console.log(`[damageFoe] Ignoring damage from card ${incomingCardId}; already damaged this foe instance.`);
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

    const isHeal = effectiveAmount < 0;

    if (!isHeal) {
        markFoeDamagedThisTurn(entry, s);
        runFoeFirstAttackPerTurnTriggers(entry, slotIndex, s);
    }

    // Apply protection check (immunity) only for damage
    if (!isHeal && foeIsProtected(entry, slotIndex, s)) {
        const cityName = getCityNameFromIndex(slotIndex + 1) || `City ${slotIndex}`;
        console.log(`[damageFoe] Damage prevented: protected foe in ${cityName}.`);
        appendGameLogEntry(`Damage prevented: protected foe in ${cityName}.`, s);
        return;
    }

    if (!isHeal) {
        // Apply passive city-targeted double damage (e.g., Batman)
        if (heroId != null) {
            const heroObj = heroes.find(h => String(h.id) === String(heroId));
            const { effects: effs } = getHeroAbilitiesWithTemp(heroId, s);
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

        // Apply foe-side half-damage vs team (halveIncomingDamageFrom)
        if (heroId != null && foeHasHalfDamageModifierAgainstHero(entry, heroId, s)) {
            effectiveAmount = Math.max(1, Math.ceil(effectiveAmount / 2));
            console.log(`[damageFoe] halveIncomingDamageFrom applied: hero ${heroId} damage halved to ${effectiveAmount}.`);
        }

        effectiveAmount = applyHeroOutgoingDoubleDamage(effectiveAmount, heroId, s);
    }

    const effWithFoeMods = isHeal
        ? Math.abs(effectiveAmount)
        : applyDoubleDamageAgainstFoe(effectiveAmount, { slotIndex }, s);

    const heroName = heroId != null
        ? (heroes.find(h => String(h.id) === String(heroId))?.name || `Hero ${heroId}`)
        : "Hero";

    let newHP;
    let appliedDamage = 0;
    let appliedHeal = 0;

    if (isHeal) {
        newHP = Math.min(baseHP, currentHP + effWithFoeMods);
        appliedHeal = Math.max(0, newHP - currentHP);
    } else {
        newHP = Math.max(0, currentHP - effWithFoeMods);
        appliedDamage = Math.max(0, Math.min(effWithFoeMods, currentHP));
        playDamageSfx(appliedDamage);
    }

    // Sync per-instance representations (DO NOT mutate foeCard.currentHP on the template)
    entry.maxHP = baseHP;
    entry.currentHP = newHP;
    s.villainHP[entryKey] = newHP;
    s.villainHP[String(entry.id)] = newHP; // also track by base id for panels that key on id

    // If the villain panel for this foe is open, refresh it to show updated HP
    try {
        const panel = (typeof document !== "undefined") ? document.getElementById("villain-panel") : null;
        if (panel && panel.classList.contains("open") && String(panel.dataset.villainId || "") === foeIdStr) {
            const builder = (typeof window !== "undefined" && typeof window.buildVillainPanel === "function")
                ? window.buildVillainPanel
                : (typeof buildVillainPanel === "function" ? buildVillainPanel : null);
            if (builder) {
                // Pass a live copy with currentHP and instanceId from the board entry
                const liveCard = { ...foeCard, currentHP: newHP, instanceId: entryKey };
                builder(liveCard, { instanceId: entryKey, slotIndex, entry });
            }
        }
    } catch (err) {
        console.warn("[damageFoe] Failed to refresh villain panel", err);
    }

    if (isHeal) {
        console.log(`[damageFoe] ${foeCard.name} healed ${appliedHeal} (${currentHP} -> ${newHP}).`);
        appendGameLogEntry(`${foeCard.name} gained ${appliedHeal} HP.`, s);
    } else {
        console.log(`[damageFoe] ${foeCard.name} took ${effWithFoeMods} damage (${currentHP} -> ${newHP}).`);
        appendGameLogEntry(`${heroName} dealt ${appliedDamage} damage to ${foeCard.name}.`, s);

        // Record detailed damage context for afterDamage effects
        const baseCtx = s._lastDamageContext || {};
        const cardIdCtx = baseCtx.cardId ?? incomingCardId ?? null;
        const damageLost = Math.max(0, effWithFoeMods - appliedDamage);
        s._lastDamageContext = {
            ...baseCtx,
            target: "city-foe",
            heroId: heroId ?? baseCtx.heroId ?? null,
            heroName: heroName ?? baseCtx.heroName,
            cardId: cardIdCtx,
            cardName: baseCtx.cardName,
            foeId: foeIdStr,
            foeName: foeCard.name || `Enemy ${foeIdStr}`,
            slotIndex,
            intendedDamage: effWithFoeMods,
            appliedDamage,
            damageLost
        };

        // Track last damage dealt by the acting hero (post-modifier amount)
        if (heroId && s.heroData?.[heroId]) {
            s.heroData[heroId].lastDamageAmount = Number(appliedDamage) || 0;
        }

        // Trigger damaged condition effects on this foe
        try { runFoeDamagedTriggers(entry, slotIndex, s); } catch (err) { console.warn("[damageFoe] runFoeDamagedTriggers failed", err); }
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
                    currentDamage: effectiveDamage,
                    // Ensure HP displayed matches the current instance HP (including buffs/debuffs)
                    currentHP: newHP,
                    maxHP: baseHP
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
        if (s._pendingDamageTarget?.contextId === ctxId) s._pendingDamageTarget = null;
        if (s._activeDamageContextId === ctxId) s._activeDamageContextId = null;
        saveGameState(s);
        return;
    }

    // ===================================================================
    // FOE KO'D
    // ===================================================================
    const effectiveHenchDamage = getEffectiveFoeDamage(entry);

    // Track last KO'd henchman for downstream effects (e.g., ignore reward -> deal damage)
    if (String(foeCard.type || "").toLowerCase() === "henchman") {
        s._lastKOdHenchman = {
            foeId: foeIdStr,
            instanceId: entryKey,
            heroId: heroId ?? null,
            damage: effectiveHenchDamage
        };

    }
    s._lastKOdFoe = {
        foeId: foeIdStr,
        instanceId: entryKey,
        heroId: heroId ?? null,
        type: String(foeCard.type || "").toLowerCase()
    };

    try {
        triggerRuleEffects("foeKOd", { currentHeroId: heroId }, s);
    } catch (err) {
        console.warn("[damageFoe] foeKOd trigger failed", err);
    }

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
    // Henchman-only deferral: villains should not be blocked or prompted.
    const foeType = String(foeCard.type || "").toLowerCase();
    if (foeType !== "henchman") {
        runUponDefeatEffects(foeCard, heroId, s, {
            selectedFoeSummary: { ...foeSummary, instanceId: entryKey },
            foeInstanceId: entryKey
        });
    } else {
        // If a kodHenchman optional might defer the reward decision, wait for it.
        const rewardDeferred = createDeferred();

        // First, check for optional kodHenchman effects on active tactics and run the prompt ourselves.
        const activeTactics = getActiveTacticsFromState(s);
        const matchingKodOptionals = activeTactics
            .flatMap(card => {
                const effects = Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : [];
                return effects.map((eff, idx) => ({ card, eff, idx }));
            })
            .filter(({ eff }) => normalizeConditionString(eff?.condition) === "kodhenchman" && String(eff?.type || "").toLowerCase() === "optional");

        if (matchingKodOptionals.length > 0) {
            const { card, eff, idx } = matchingKodOptionals[0]; // assume one relevant optional
            const label = card.abilitiesNamePrint?.[idx]?.text || "Use optional ability?";
            rewardDeferred.used = true;
            const promptPromise =
                (typeof window !== "undefined" && typeof window.showOptionalAbilityPrompt === "function")
                    ? window.showOptionalAbilityPrompt(label)
                    : (typeof window !== "undefined" && typeof window.confirm === "function")
                        ? Promise.resolve(window.confirm(label))
                        : Promise.resolve(false);

            promptPromise.then(allow => {
                if (allow) {
                    try {
                        executeEffectSafely(eff.effect, card, {
                            currentHeroId: heroId ?? null,
                            state: s,
                            foeId: foeIdStr,
                            instanceId: entryKey,
                            henchmanDamage: effectiveHenchDamage
                        });
                    } catch (err) {
                        console.warn("[damageFoe] Failed to run kodHenchman optional handler", err);
                    }
                }
                if (typeof rewardDeferred.resolve === "function") rewardDeferred.resolve(allow);
            }).catch(err => {
                console.warn("[damageFoe] kodHenchman optional prompt failed", err);
                if (typeof rewardDeferred.resolve === "function") rewardDeferred.resolve(false);
            });
        }

        // Run non-optional kodHenchman effects (skip optionals we've already handled)
        try {
            triggerRuleEffects("kodHenchman", {
                currentHeroId: heroId ?? null,
                state: s,
                foeId: foeIdStr,
                instanceId: entryKey,
                henchmanDamage: effectiveHenchDamage,
                rewardDeferred,
                allowOptional: false
            });
        } catch (err) {
            console.warn("[damageFoe] Failed to trigger kodHenchman effects", err);
        }

        const runDefeat = () => {
            runUponDefeatEffects(foeCard, heroId, s, {
                selectedFoeSummary: { ...foeSummary, instanceId: entryKey },
                foeInstanceId: entryKey
            });
        };

        rewardDeferred.promise.then(() => {
            runDefeat();
        }).catch(() => {
            runDefeat();
        });

        // If nothing consumed the deferred (no optional prompt and no effects), resolve immediately
        setTimeout(() => {
            if (!rewardDeferred.used && typeof rewardDeferred.resolve === "function") {
                rewardDeferred.resolve();
            }
        }, 0);
    }

    // Clear the last KO tracking after defeat effects resolve to avoid stale triggers
    if (s._lastKOdHenchman && s._lastKOdHenchman.instanceId === entryKey) {
        s._lastKOdHenchman = null;
    }
    if (s._lastKOdFoe && s._lastKOdFoe.instanceId === entryKey) {
        s._lastKOdFoe = null;
    }

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

    if (s._pendingDamageTarget?.contextId === ctxId) s._pendingDamageTarget = null;
    if (s._activeDamageContextId === ctxId) s._activeDamageContextId = null;

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

export function hasTraveled(heroId, state = gameState) {
    const used = getTravelUsed(heroId, state);
    const traveled = used >= 1 ? 1 : 0;
    try {
        console.log(`[hasTraveled] Hero ${heroId} traveled this turn: ${traveled ? "yes" : "no"} (raw: ${used})`);
    } catch (e) {}
    return traveled;
}

export function getLastDamageAmount(heroId, state = gameState) {
    const s = state || gameState;
    if (!heroId) return 0;
    const hState = s.heroData?.[heroId];
    if (!hState) return 0;
    return Number(hState.lastDamageAmount || 0);
}

export function getDamageLost(heroId, state = gameState) {
    const s = state || gameState;
    const ctx = s?._lastDamageContext;
    if (!ctx) return 0;
    if (heroId != null && ctx.heroId != null && String(ctx.heroId) !== String(heroId)) return 0;
    const lost = Number(ctx.damageLost);
    return Number.isFinite(lost) ? Math.max(0, lost) : 0;
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

    // If another hero is already in the destination city, send them back to HQ (no damage).
    if (Array.isArray(heroIds)) {
        heroIds.forEach(hid => {
            if (String(hid) === String(resolvedHeroId)) return;
            const otherState = s.heroData?.[hid];
            if (otherState && otherState.cityIndex === destIndex) {
                sendHeroHomeFromBoard(hid, s);
            }
        });
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
    try {
        if (typeof window !== "undefined" && typeof window.recomputeCurrentHeroTravelDestinations === "function") {
            window.recomputeCurrentHeroTravelDestinations(s);
        }
    } catch (err) {
        console.warn("[travelTo] Failed to recompute travel destinations.", err);
    }
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
    try {
        if (typeof window !== "undefined" && typeof window.recomputeCurrentHeroTravelDestinations === "function") {
            window.recomputeCurrentHeroTravelDestinations(s);
        }
    } catch (err) {
        console.warn("[retreatHeroToHQ] Failed to recompute travel destinations.", err);
    }
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
            s._lastFoeLeftCity = {
                slotIndex: fromIdx,
                instanceId: getEntryKey(entry),
                id: entry?.id
            };
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
                s._lastFoeLeftCity = {
                    slotIndex: current,
                    instanceId: getEntryKey(entry),
                    id: entry?.id
                };
                try { handleVillainEscape(entry, s); } catch (e) { console.warn("[shoveVillain] escape failed", e); }
                moveEntry(entry, current, null);
                s.lastShovedVillainDestination = null;
                return true;
            }
            if (next > 10) {
                // Clamp at the far right; cannot go past 10
                break;
            }

            if (s.destroyedCities?.[next]) {
                // Cannot enter a destroyed city
                break;
            }

            const blocker = s.cities[next];
            if (blocker && blocker.id != null) {
                // Stop at any blocker; frozen foes explicitly stop shoves
                if (isFrozen(blocker)) {
                    break;
                }
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

    const isVillainEntry = (entry) => {
        if (!entry) return false;
        const card = findCardInAllSources(entry.id);
        return String(card?.type || "").toLowerCase() === "villain";
    };

    if (targetStr === "all") {
        s.cities.forEach((entry, idx) => addTarget(targets, entry, idx));
    } else if (targetStr === "allunengaged") {
        s.cities.forEach((entry, idx) => {
            if (!entry) return;
            const heroBelow = heroIds.some(hid => s.heroData?.[hid]?.cityIndex === idx + 1);
            if (!heroBelow) addTarget(targets, entry, idx);
        });
    } else if (targetStr === "leftmostvillain") {
        let best = null;
        s.cities.forEach((entry, idx) => {
            if (!entry || !isVillainEntry(entry)) return;
            if (best == null || idx < best.slotIndex) {
                best = { entry, slotIndex: idx };
            }
        });
        if (best) addTarget(targets, best.entry, best.slotIndex);
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
    } else {
        try { recomputeLocationBasedVillainDamage(s); } catch (err) { console.warn("[shoveVillain] Failed to recompute villain location passives.", err); }
        try {
            if (typeof window !== "undefined" && typeof window.recomputeCurrentHeroTravelDestinations === "function") {
                window.recomputeCurrentHeroTravelDestinations(s);
            }
        } catch (err) {
            console.warn("[shoveVillain] Failed to recompute travel destinations.", err);
        }
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
    const extra = Number(state?.enemyDrawExtra || 0) || 0;
    count = count + (extra > 0 ? extra : 0);

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

// When resolving a previously-persisted optional prompt (e.g., after refresh),
// re-run the associated effect and then resume flow as needed.
window.handlePendingOptionalPromptChoice = async function (result, state = gameState) {
    const pending = state?.pendingOptionalPrompt;
    if (!pending) return;

    // Currently only villain deck draw optionals are persisted
    const { source, cond, cardId, effectIndex } = pending;
    const isVillainDrawOptional = source === "triggerRule" && cond === "villaindeckwoulddraw";

    if (isVillainDrawOptional) {
        const card = findCardInAllSources(cardId);
        const effects = card ? [
            ...(Array.isArray(card.abilitiesEffects) ? card.abilitiesEffects : []),
            ...(Array.isArray(card.mightEffects) ? card.mightEffects : []),
            ...(Array.isArray(card.bonusEffects) ? card.bonusEffects : []),
            ...(Array.isArray(card.evilWinsEffects) ? card.evilWinsEffects : [])
        ] : [];
        const eff = effects[effectIndex] || null;

        if (result && eff) {
            const hasFiniteUses = eff.uses != null && eff.uses !== "" && Number.isFinite(Number(eff.uses));
            const usesMax = hasFiniteUses ? Number(eff.uses) : Number.POSITIVE_INFINITY;
            let remaining = usesMax;

            // Hero face-card usage tracking
            const heroState = state.heroData?.[cardId];
            if (heroState && hasFiniteUses) {
                const cur = heroState.currentUses?.[effectIndex];
                remaining = cur == null ? usesMax : Number(cur);
            }

            if (hasFiniteUses && heroState) {
                if (!heroState.currentUses) heroState.currentUses = {};
                const nextUses = Math.max(0, remaining - 1);
                heroState.currentUses[effectIndex] = nextUses;
                const cardObj = heroes.find(h => String(h.id) === String(cardId));
                if (cardObj) {
                    if (!cardObj.currentUses) cardObj.currentUses = {};
                    cardObj.currentUses[effectIndex] = nextUses;
                }
            }

            try {
                await executeEffectSafely(eff.effect, card, { state });
            } catch (err) {
                console.warn("[OptionalAbility] Failed to resume effect after refresh.", err);
            }
        }
    }

    // Clear pending prompt and persist
    state.pendingOptionalPrompt = null;
    try { saveGameState(state); } catch (_) {}

    // Resume villain draw flow if this was from that trigger
    if (isVillainDrawOptional) {
        if (!result) {
            state._suppressVillainDrawOptionalOnce = true;
        }
        try {
            await villainDraw(1);
        } catch (err) {
            console.warn("[OptionalAbility] Failed to resume villain draw after prompt.", err);
        }

        // If this villain draw was part of a hero turn start, continue the turn setup
        const resumeInfo = state._pendingHeroTurnResume;
        if (resumeInfo?.resumeFrom === "villainDraw") {
            state._pendingHeroTurnResume = null;
            try { saveGameState(state); } catch (_) {}
            try {
                await resumeHeroTurnAfterVillainDraw(state, resumeInfo.heroId, resumeInfo.heroTurnIndex);
            } catch (err) {
                console.warn("[OptionalAbility] Failed to resume hero turn after villain draw prompt.", err);
            }
        }
    }
};

// Re-show any pending optional prompt saved in gameState (e.g., after refresh)
window.restoreOptionalAbilityPromptFromState = function (state = gameState) {
    const pending = state?.pendingOptionalPrompt;
    if (pending?.text) {
        window.showOptionalAbilityPrompt(pending.text).then(result => {
            try {
                window.handlePendingOptionalPromptChoice(result, state);
            } catch (err) {
                console.warn("[OptionalAbility] Failed to resolve pending prompt after refresh.", err);
            }
        });
    }
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
        max-height:120px;
        overflow-y:auto;
        overflow-x:hidden;
    `;

    const confirmRow = document.createElement("div");
    confirmRow.style.cssText = `
        display:flex;
        margin-top:4px;
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
                min-height:40px;
                padding:10px 14px;
                box-sizing:border-box;
                display:flex;
                align-items:center;
                justify-content:center;
                line-height:1.2;
                font-size:20px;
                font-weight:bold;
                border:none;
                border-radius:10px;
                border:4px solid black;
                background:${isSelected ? "#ffd800" : "#ddd"};
                color:black;
                cursor:pointer;
                text-align:center;
                white-space:normal;
                word-break:break-word;
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

let resurrectModalRefs = null;

function ensureResurrectHeroModal() {
    if (resurrectModalRefs) return resurrectModalRefs;
    if (typeof document === "undefined") return null;

    const overlay = document.createElement("div");
    overlay.id = "resurrect-hero-overlay";
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
    box.id = "resurrect-hero-box";
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
    headerEl.id = "resurrect-hero-header";
    headerEl.style.cssText = `
        font-size:26px;
        line-height:1.2;
    `;
    headerEl.textContent = "Choose a hero to resurrect.";

    const list = document.createElement("div");
    list.id = "resurrect-hero-list";
    list.style.cssText = `
        display:flex;
        flex-direction:column;
        gap:10px;
        width:100%;
        max-height:140px;
        overflow-y:auto;
        overflow-x:hidden;
    `;

    const confirmRow = document.createElement("div");
    confirmRow.style.cssText = `
        display:flex;
        margin-top:4px;
    `;

    const confirmBtn = document.createElement("button");
    confirmBtn.id = "resurrect-hero-confirm";
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

    resurrectModalRefs = { overlay, headerEl, list, confirmBtn };
    return resurrectModalRefs;
}

function showResurrectHeroModal({ header, options, selectedId: selectedIdInit = null }) {
    return new Promise(resolve => {
        const refs = ensureResurrectHeroModal();
        if (!refs) {
            console.warn("[ResurrectHeroModal] Unable to render modal.");
            resolve(null);
            return;
        }

        const { overlay, headerEl, list, confirmBtn } = refs;
        let selectedId = selectedIdInit ?? (options?.[0]?.id ?? null);

        headerEl.textContent = header || "Choose a hero to resurrect.";
        list.innerHTML = "";

        options.forEach((opt, idx) => {
            const isSelected = selectedId != null
                ? String(opt.id) === String(selectedId)
                : idx === 0;
            const btn = document.createElement("button");
            btn.textContent = opt.name || opt.label || `Option ${idx + 1}`;
            btn.style.cssText = `
                width:100%;
                min-height:40px;
                padding:10px 14px;
                box-sizing:border-box;
                display:flex;
                align-items:center;
                justify-content:center;
                line-height:1.2;
                font-size:20px;
                font-weight:bold;
                border:none;
                border-radius:10px;
                border:4px solid black;
                background:${isSelected ? "#ffd800" : "#ddd"};
                color:black;
                cursor:pointer;
                text-align:center;
                white-space:normal;
                word-break:break-word;
            `;
            btn.onclick = () => {
                selectedId = opt.id;
                [...list.children].forEach(child => child.style.background = "#ddd");
                btn.style.background = "#ffd800";
            };
            list.appendChild(btn);
        });

        overlay.style.display = "flex";

        confirmBtn.onclick = () => {
            overlay.style.display = "none";
            confirmBtn.onclick = null;
            const chosen = options.find(o => String(o.id) === String(selectedId)) || null;
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

  const s = state || gameState;
  const effectiveHeroId =
    heroId ??
    extraSelectedData?.currentHeroId ??
    (Array.isArray(s?.heroes) ? s.heroes[s.heroTurnIndex ?? 0] : null);

  // If reward is being intentionally bypassed (e.g., ignoreRewardDamageOverlord), skip the effects
  const suppress = s?._suppressRewardFor;
  const suppressMatch =
      suppress &&
      String(suppress.foeId ?? "") === String(cardData.id ?? "") &&
      (
          suppress.instanceId == null ||
          suppress.instanceId === extraSelectedData.foeInstanceId ||
          suppress.instanceId === extraSelectedData?.selectedFoeSummary?.instanceId
      );
  if (suppressMatch) {
    console.log(`[uponDefeat] Reward suppressed for ${cardData.name} (instance ${extraSelectedData.foeInstanceId || "unknown"}).`);
    s._suppressRewardFor = null;
    return;
  }

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

            const promptPromise =
                (typeof window !== "undefined" && typeof window.showOptionalAbilityPrompt === "function")
                    ? window.showOptionalAbilityPrompt(label)
                    : (typeof window !== "undefined" && typeof window.confirm === "function")
                        ? Promise.resolve(window.confirm(label))
                        : Promise.resolve(false);

            promptPromise.then(allow => {
                if (!allow) return;

                executeEffectSafely(eff.effect, cardData, {
                    ...extraSelectedData,
                    currentHeroId: effectiveHeroId,
                    state: s
                });
            }).catch(err => console.warn("[uponDefeat] Optional prompt failed", err));

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
                currentHeroId: effectiveHeroId,
                state: s
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

  // If facing the Overlord, do not apply city lane clears -> go home logic
  if (heroState.isFacingOverlord) return;

  const heroLower = heroState.cityIndex;
  if (typeof heroLower !== "number") return;

  // Heroes stand in LOWER slots; their lane?s UPPER slot is directly above
  const heroUpper = heroLower - 1;

  // Only send this hero home if the KO happened in THEIR lane (upper slot)
  if (defeatedSlotIndex !== heroUpper) return;

  // Lane is clear when the upper slot above them is empty
  const upperEmpty = !isCityOccupied(state, heroUpper);

  if (upperEmpty) {
    sendHeroHomeFromBoard(heroId, state);
  }
}

