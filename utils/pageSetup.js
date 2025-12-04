import { heroes } from '../data/faceCards.js';
import { overlords } from '../data/overlords.js';
import { tactics } from '../data/tactics.js';
import { enemies } from '../data/enemies.js';
import { allies } from '../data/allies.js';
import { bystanders } from '../data/bystanders.js';
import { scenarios } from '../data/scenarios.js';
import { henchmen } from '../data/henchmen.js';
import { villains } from '../data/villains.js';
import { renderCard, renderAbilityText } from './cardRenderer.js';
import { keywords } from '../data/keywords.js';
import { runGameStartAbilities, currentTurn } from './abilityExecutor.js';
import { gameStart, startHeroTurn, endCurrentHeroTurn, initializeTurnUI } from "./turnOrder.js";

import { loadGameState, saveGameState, clearGameState } from "./stateManager.js";
import { gameState } from "../data/gameState.js";

let currentOverlord = null;
let currentTactics = [];

let selectedHeroes = [];
let heroMap = new Map();

window.VILLAIN_DRAW_ENABLED = false;

import {    CITY_EXIT_UPPER,
            CITY_5_UPPER,
            CITY_4_UPPER,
            CITY_3_UPPER,
            CITY_2_UPPER,
            CITY_ENTRY_UPPER } from '../data/gameState.js';

const HERO_BORDER_URLS = {
    Striker: "https://raw.githubusercontent.com/over-lords/overlords/098924d9c777517d2ee76ad17b80c5f8014f3b30/Public/Images/Site%20Assets/strikerBorder.png",
    Guardian: "https://raw.githubusercontent.com/over-lords/overlords/098924d9c777517d2ee76ad17b80c5f8014f3b30/Public/Images/Site%20Assets/guardianBorder.png",
    Tactician: "https://raw.githubusercontent.com/over-lords/overlords/098924d9c777517d2ee76ad17b80c5f8014f3b30/Public/Images/Site%20Assets/tacticianBorder.png"
};

const EMPTY_HERO_URL = "https://raw.githubusercontent.com/over-lords/overlords/098924d9c777517d2ee76ad17b80c5f8014f3b30/Public/Images/Card%20Assets/Misc/emptyHero.png";


function buildHeroesRow(selectedHeroIds, heroMap) {
    const row = document.getElementById("heroes-row");
    if (!row) return;

    row.innerHTML = "";

    const totalSlots = 6;
    for (let i = 0; i < totalSlots; i++) {
        const slot = document.createElement("div");
        slot.className = "hero-slot";

        const id = selectedHeroIds[i];
        const hero = id != null ? heroMap.get(String(id)) : null;

        const wrapper = document.createElement("div");
        wrapper.className = "hero-border-wrapper";

        if (hero) {
            const currentHP = gameState.heroData?.[hero.id]?.hp ?? hero.currentHP ?? hero.hp;

            const hpBox = document.createElement("div");
            hpBox.className = "hero-hp-display";

            hpBox.innerHTML = `
                <img class="hero-hp-heart" src="https://raw.githubusercontent.com/over-lords/overlords/7774da0ec26845edd8dc6c07756b04e78fafcbff/Public/Images/Card%20Assets/Misc/Heart.png">
                <div class="hero-hp-text" data-hero-id="${hero.id}">${currentHP}</div>
            `;

            slot.appendChild(hpBox);
        }

        // Defaults for empty slot
        let borderImageUrl = HERO_BORDER_URLS.Guardian; // neutral default
        let borderColor = "transparent";
        let portraitSrc = EMPTY_HERO_URL;
        let portraitAlt = "Empty Hero Slot";

        if (hero) {
            // Pick frame by category
            const category = (hero.category || "").toLowerCase();
            if (category === "striker") {
                borderImageUrl = HERO_BORDER_URLS.Striker;
            } else if (category === "guardian") {
                borderImageUrl = HERO_BORDER_URLS.Guardian;
            } else if (category === "tactician") {
                borderImageUrl = HERO_BORDER_URLS.Tactician;
            }

            // Tint by hero.color, if defined
            if (hero.color) {
                borderColor = hero.color;
            }

            portraitSrc = hero.image;
            portraitAlt = hero.name || "Hero";
        }

        // Hooks for the CSS mask-based tint
        wrapper.style.setProperty("--border-image", `url('${borderImageUrl}')`);
        wrapper.style.setProperty("--border-color", borderColor);

        const img = document.createElement("img");
        img.className = "hero-portrait";
        img.src = portraitSrc;
        img.alt = portraitAlt;

        if (!hero) {
            img.style.opacity = "0.9";
            if (!hero) wrapper.classList.add("empty-slot");
        }

        const tint = document.createElement("div");
        tint.className = "hero-border-tint";

        wrapper.appendChild(img);
        wrapper.appendChild(tint);
        slot.appendChild(wrapper);
        row.appendChild(slot);
    }
}

setTimeout(attachHeroClicks, 0);

async function decryptData(cipherText, secretKey) {
    const data = atob(cipherText);
    const bytes = new Uint8Array([...data].map(c => c.charCodeAt(0)));
    const iv = bytes.slice(0, 12);
    const cipher = bytes.slice(12);

    const keyMaterial = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secretKey));
    const key = await crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
    const decoded = new TextDecoder().decode(decrypted);
    return JSON.parse(decoded);
}

/******************************************************
 * RESTORE FULL UI FROM SAVED GAME STATE
 ******************************************************/
async function restoreUIFromState(state) {

    console.log("Restoring UI from saved state…");

    /******************************************************
     * HERO RESTORATION
     ******************************************************/
    // Build hero map from master hero data
    heroMap = new Map(heroes.map(h => [String(h.id), h]));

    // Re-hydrate hero objects with dynamic fields saved in state
    const restoredHeroIds = state.heroes || [];

    restoredHeroIds.forEach(id => {
        const heroObj = heroMap.get(String(id));
        if (!heroObj) return;

        if (!state.heroData) state.heroData = {};
        if (!state.heroData[id]) {
            const heroObj = heroMap.get(String(id));
            state.heroData[id] = {
                deck: [],
                discard: [],
                hand: [],
                cityIndex: null,
                hp: heroObj.hp,
                travel: heroObj.travel || 0
            };
        }
        const saved = state.heroData[id];

        if (!state.heroData) state.heroData = {};
        if (!state.heroData[id]) {
            state.heroData[id] = {
                deck: [],
                discard: [],
                hand: [],
                cityIndex: null,
                hp: heroObj.hp,
                travel: heroObj.travel
            };
        }

        // HP
        if (saved.currentHP != null) {
            heroObj.currentHP = saved.currentHP;
        }

        // Ability uses
        if (saved.currentUses) {
            heroObj.currentUses = saved.currentUses;
        }

        // Owner assignment
        heroObj.owner = saved.owner;
    });

    // UI row
    selectedHeroes = restoredHeroIds;
    buildHeroesRow(restoredHeroIds, heroMap);

    // Attach click events
    setTimeout(attachHeroClicks, 0);


    /******************************************************
     * OVERLORD RESTORATION
     ******************************************************/
    if (state.overlords?.length) {
        const map = new Map(overlords.map(o => [String(o.id), o]));
        const first = map.get(String(state.overlords[0]));

        if (first) {
            // Re-apply saved HP
            if (state.overlordData?.currentHP != null) {
                first.currentHP = state.overlordData.currentHP;
            }

            setCurrentOverlord(first);
        }

        // tactics
        const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
        currentTactics = (state.tactics || []).map(id => tacticMap.get(String(id))).filter(Boolean);
    }

    if (Array.isArray(state.cities)) {

        const heroIds = state.heroes || [];
        const citySlots = document.querySelectorAll(".city-slot");

        heroIds.forEach(hid => {
            const hState = state.heroData?.[hid];
            if (!hState) return;

            const idx = hState.cityIndex;
            if (idx === null || idx === undefined) return;   // hero is at HQ

            const slot = citySlots[idx];
            if (!slot) return;

            const area = slot.querySelector(".city-card-area");
            if (!area) return;

            // Clear old content
            area.innerHTML = "";

            // Build hero wrapper
            const wrapper = document.createElement("div");
            wrapper.className = "card-wrapper";

            const heroObj = heroMap.get(String(hid));
            if (!heroObj) return;

            const rendered = renderCard(heroObj.id, wrapper);
            wrapper.appendChild(rendered);
            area.appendChild(wrapper);

            // Allow clicking hero to open its panel
            wrapper.style.cursor = "pointer";
            wrapper.addEventListener("click", (e) => {
                e.stopPropagation();
                buildHeroPanel(heroObj);
            });
        });

        state.cities.forEach(entry => {
            if (!entry || typeof entry.slotIndex !== "number") return;

            const slot = citySlots[entry.slotIndex];
            if (!slot) return;

            const cardArea = slot.querySelector(".city-card-area");
            if (!cardArea) return;

            cardArea.innerHTML = "";

            if (!entry.id) return;   // empty slot stays empty

            const wrapper = document.createElement("div");
            wrapper.className = "card-wrapper";

            const rendered = renderCard(entry.id, wrapper);
            wrapper.appendChild(rendered);
            cardArea.appendChild(wrapper);

            // Restore clickability for villains & henchmen
            const cardData =
                henchmen.find(h => h.id === entry.id) ||
                villains.find(v => v.id === entry.id);

            if (cardData) {
                wrapper.style.cursor = "pointer";
                wrapper.addEventListener("click", (e) => {
                    e.stopPropagation();
                    buildVillainPanel(cardData);
                });
            }
        });
    }

    // VILLAIN DECK
    if (Array.isArray(state.villainDeck)) {
        gameState.villainDeck = [...state.villainDeck];
    }

    if (typeof state.villainDeckPointer === "number") {
        gameState.villainDeckPointer = state.villainDeckPointer;
    }


    /******************************************************
     * PLAYER / OWNERSHIP RESTORATION
     ******************************************************/
    if (Array.isArray(state.playerUsernames)) {

        const players = state.playerUsernames;
        const heroesByPlayer = state.heroesByPlayer || [state.heroes];

        heroesByPlayer.forEach((heroList, playerIndex) => {
            heroList.forEach(heroId => {
                const h = heroMap.get(String(heroId));
                if (!h) return;
                h.owner = players[playerIndex] || "Player";
            });
        });
    }

    console.log("UI restore complete.");
}

(async () => {
    const saved = loadGameState();

    if (saved) {
        console.log("=== RESUMING SAVED GAME ===");
        Object.assign(gameState, saved);
        restoreUIFromState(gameState);

        // IMPORTANT: Do NOT auto-start when resuming a game
        window.VILLAIN_DRAW_ENABLED = true;

        // Restore turn index
        window.heroTurnIndex = saved.heroTurnIndex ?? 0;
        gameState.heroTurnIndex = saved.heroTurnIndex ?? 0;

        if (typeof saved.turnCounter === "number") {
            gameState.turnCounter = saved.turnCounter;
        } else {
            gameState.turnCounter = 0;
        }

        const heroIds = gameState.heroes || [];
        if (heroIds.length > 0) {
            currentTurn(heroTurnIndex, heroIds);
        }

        initializeTurnUI(gameState);
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const encrypted = params.get('data');
    const SECRET = 'GeimonHeroKey42';  // DO NOT FUCK THIS UP

    if (!encrypted) {
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red;">No loadout data found.</p>');
        return;
    }

    try {
        const selectedData = await decryptData(encrypted, SECRET);
        selectedHeroes = selectedData.heroes || [];
        const selectedOverlords = selectedData.overlords || [];
        const selectedTactics = selectedData.tactics || [];

        heroMap = new Map(heroes.map(h => [String(h.id), h]));
        const heroList = selectedHeroes.map(id => heroMap.get(String(id)) || { name: `Unknown (ID ${id})` });

        buildHeroesRow(selectedHeroes, heroMap);

        (function configurePlayers() {
            const players = selectedData.playerUsernames || ["Player"];
            const heroesByPlayer = selectedData.heroesByPlayer || [ selectedHeroes ];

            heroesByPlayer.forEach((heroList, playerIndex) => {
                const ownerName = players[playerIndex] || `Player ${playerIndex+1}`;
                heroList.forEach(heroId => {
                    const hero = heroMap.get(String(heroId));
                    if (!hero) return;
                    hero.owner = ownerName;
                });
            });

        })();

        //console.log(">>> STARTING SINGLEPLAYER GAME <<<");
        const startResult = gameStart(selectedData);
        runGameStartAbilities(selectedData);

        Object.assign(gameState, {
            heroes: selectedData.heroes,
            overlords: selectedData.overlords,
            tactics: selectedData.tactics,

            revealedTopVillain: false,

            // villain deck from gameStart()
            villainDeck: startResult.villainDeck,
            villainDeckPointer: 0,

            // city grid from gameStart() (empty until you populate cities)
            cities: new Array(12).fill(null),

            heroesByPlayer: selectedData.heroesByPlayer,
            playerUsernames: selectedData.playerUsernames
        });

        gameState.heroData = {};

        //console.log("=== Confirming hero decks after pageSetup ===");
        if (gameState.heroData) {
            Object.entries(gameState.heroData).forEach(([heroId, data]) => {
                const heroObj = heroes.find(h => String(h.id) === heroId);
                if (!heroObj) return;
                console.log(`Deck for ${heroObj.name}:`, data.deck);
            });
        }

        selectedData.heroes.forEach(id => {
            const heroObj = heroMap.get(String(id));
            if (!heroObj) return;

            gameState.heroData[id] = gameState.heroData[id] || {};

            gameState.heroData[id].deck ||= [];
            gameState.heroData[id].discard ||= [];
            gameState.heroData[id].hand ||= [];
            gameState.heroData[id].cityIndex ??= null;
            gameState.heroData[id].hp ??= heroObj.hp;
            gameState.heroData[id].travel ??= (heroObj.travel || 0);
        });

        saveGameState(gameState);

        const overlordMap = new Map(overlords.map(o => [String(o.id), o]));
        const overlordList = selectedOverlords
            .map(id => overlordMap.get(String(id)) || { name: `Unknown (ID ${id})`, hp: '?', level: '?' })
            .sort((a, b) => a.level - b.level || a.hp - b.hp);

        if (overlordList.length > 0) {
            setCurrentOverlord(overlordList[0]); // run setCurrentOverlord(newOverlordObject); whenever a takeover happens (from villains or overlord stack)
        }

        const tacticMap = new Map(tactics.map(t => [String(t.id), t]));
        const tacticList = selectedTactics.map(id => {
            const t = tacticMap.get(String(id));
            if (!t) return { name: `Unknown (ID ${id})`, abilitiesText: [{ text: '?' }] };
            return t;
        });

        currentTactics = tacticList;

        const container = document.createElement('div');
        container.style.marginTop = '0px';
        container.style.textAlign = 'center';
        container.innerHTML = `
            <h2>Loaded Heroes (in order selected):</h2>
            <ol style="display:inline-block; text-align:left;">
                ${heroList.map(h => `<li>${h.name}</li>`).join('')}
            </ol>
            <h2 style="margin-top:30px;">Loaded Overlords (sorted by difficulty & HP):</h2>
            <ol style="display:inline-block; text-align:left;">
                ${overlordList.map(o => `<li>${o.name} — ${o.hp} HP (Difficulty ${o.level})</li>`).join('')}
            </ol>
        `;

        container.innerHTML += `
            <h2 style="margin-top:30px;">Loaded Tactics:</h2>
            <ol style="display:inline-block; text-align:left; max-width:700px;">
                ${tacticList.map(t => `
                <li style="margin-bottom:10px;">
                    <b>${t.name}</b><br>
                    ${t.abilitiesText.map(a => a.text).join('<br><br>')}
                </li>
                `).join('')}
            </ol>
        `;

        const enemiesData = selectedData.enemies || {};
        const alliesData = selectedData.allies || {};

        const selectedEnemies = Array.isArray(enemiesData.ids) ? enemiesData.ids : [];
        const selectedAllies = Array.isArray(alliesData.ids) ? alliesData.ids : [];

        const enemiesCount = typeof enemiesData.count === "number"
            ? enemiesData.count
            : selectedEnemies.length;

        const alliesCount = typeof alliesData.count === "number"
            ? alliesData.count
            : selectedAllies.length;

        const enemyMap = new Map(enemies.map(e => [String(e.id), e.name]));
        const allyMap = new Map(allies.map(a => [String(a.id), a.name]));

        container.innerHTML += `
            <h2 style="margin-top:30px;">Enemies & Allies:</h2>
            <div style="display:flex; justify-content:center; gap:60px; text-align:left;">
                <div>
                <b>Enemies (${enemiesCount} chosen)</b><br>
                <ul>${
                    selectedEnemies.length
                    ? selectedEnemies.map(id => `<li>${enemyMap.get(String(id)) || `Unknown (${id})`}</li>`).join('')
                    : '<li>None selected</li>'
                }</ul>
                </div>
                <div>
                <b>Allies (${alliesCount} chosen)</b><br>
                <ul>${
                    selectedAllies.length
                    ? selectedAllies.map(id => `<li>${allyMap.get(String(id)) || `Unknown (${id})`}</li>`).join('')
                    : '<li>None selected</li>'
                }</ul>
                </div>
            </div>
        `;

        const vdeck = selectedData.villainDeck || {};

        const vd_mights = typeof vdeck.mights === 'number' ? vdeck.mights : 0;

        const vd_bys_count = Number(vdeck.bystanders?.count) || 0;
        const vd_bys_types = Array.isArray(vdeck.bystanders?.byType) ? vdeck.bystanders.byType : [];

        const vd_scenarios = Array.isArray(vdeck.scenarios) ? vdeck.scenarios.map(String) : [];
        const scenMap = new Map(scenarios.map(s => [String(s.id), s]));

        const vd_hench_list = Array.isArray(vdeck.henchmen) ? vdeck.henchmen : [];
        const henchMap = new Map(henchmen.map(h => [String(h.id), h]));

        const vd_villain_ids = Array.isArray(vdeck.villains) ? vdeck.villains.map(String) : [];
        const villainMap = new Map(villains.map(v => [String(v.id), v]));

        const byBreakHTML = vd_bys_types.length
            ? ('<ul style="margin:0;padding-left:18px;">' + vd_bys_types.filter(x => x.count > 0).map(x => `<li>${x.count}× ${x.name || ('Type ' + x.id)}</li>`).join('') + '</ul>')
            : '<i>No bystanders</i>';

        const scenariosHTML = vd_scenarios.length
            ? ('<ul style="margin:0;padding-left:18px;">' + vd_scenarios.map(id => `<li>${scenMap.get(id)?.name || ('Unknown ' + id)}</li>`).join('') + '</ul>')
            : '<i>None selected</i>';

        const henchHTML = vd_hench_list.length
            ? ('<ul style="margin:0;padding-left:18px;">'
                + vd_hench_list.filter(x => Number(x.count) > 0).map(x => {
                    const h = henchMap.get(String(x.id));
                    return `<li>${x.count}× ${h?.name || ('Hench ' + x.id)}</li>`;
                }).join('')
                + '</ul>')
            : '<i>None selected</i>';

        const vilsHTML = vd_villain_ids.length
            ? ('<ul style="margin:0;padding-left:18px;">' + vd_villain_ids.map(id => {
                const v = villainMap.get(id);
                return `<li>${v?.name || ('Villain ' + id)}${v ? ` — ${v.hp} HP • ${v.damage} DMG` : ''}</li>`;
            }).join('') + '</ul>')
            : '<i>None selected</i>';

        container.innerHTML += `
            <h2 style="margin-top:30px;">Villain Deck</h2>
            <div style="display:grid;grid-template-columns: 1fr 1fr; gap:24px; max-width:900px; margin:0 auto; text-align:left;">
                <div>
                <b>Mights:</b> ${vd_mights}
                <br><br>
                <b>Bystanders:</b> ${vd_bys_count}
                <div style="margin-top:6px;">${byBreakHTML}</div>
                <br>
                <b>Scenarios (${vd_scenarios.length}):</b>
                <div style="margin-top:6px;">${scenariosHTML}</div>
                </div>
                <div>
                <b>Henchmen:</b>
                <div style="margin-top:6px;">${henchHTML}</div>
                <br>
                <b>Villains (${vd_villain_ids.length}):</b>
                <div style="margin-top:6px;">${vilsHTML}</div>
                </div>
            </div>
        `;

        document.getElementById("dropdown-content").appendChild(container);
    } catch (e) {
        console.error('Failed to decrypt data:', e);
        document.body.insertAdjacentHTML('beforeend', '<p style="color:red;">Invalid or corrupted data.</p>');
    }
})();

function resizeBoardToViewport() {
    const board = document.getElementById("game-board");
    const container = document.getElementById("game-board-container");

    const vh = window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight;
    const vw = window.visualViewport?.width || window.innerWidth || document.documentElement.clientWidth;

    const padding = 16;
    board.style.maxHeight = (vh - padding) + "px";
    board.style.maxWidth = (vw - padding) + "px";

    scaleGridToBoard();
}

function scaleGridToBoard() {
    const board = document.getElementById("game-board");
    const wrapper = document.getElementById("city-grid-wrapper");
    const grid = document.getElementById("city-grid");

    const gridWidth = grid.scrollWidth;
    const gridHeight = grid.scrollHeight;

    const boardRect = board.getBoundingClientRect();
    const maxW = boardRect.width * 0.90;
    const maxH = boardRect.height * 0.80;

    const scale = Math.min(maxW / gridWidth, maxH / gridHeight);

    wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("load", () => {
    resizeBoardToViewport();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scaleGridToBoard();
        });
    });
});

window.addEventListener("resize", () => {
    resizeBoardToViewport();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            scaleGridToBoard();
        });
    });
});

const dropdownPanel = document.getElementById("dropdown-panel");
const dropdownTab = document.getElementById("dropdown-tab");
const dropdownClose = document.getElementById("dropdown-close");

dropdownTab.addEventListener("click", () => {
    dropdownPanel.style.maxHeight = "85vh";
    dropdownTab.style.display = "none";
    dropdownClose.style.display = "flex";
});

dropdownClose.addEventListener("click", () => {
    dropdownPanel.style.maxHeight = "0";

    dropdownClose.style.display = "none";

    setTimeout(() => {
        dropdownTab.style.display = "flex";
    }, 450);
});

const menuBtn = document.getElementById("gameMenu-box");
const sideMenu = document.getElementById("sideMenu");
const menuHeader = document.getElementById("menuHeader");

const menuMain = document.getElementById("menuMain");
const menuVolume = document.getElementById("menuVolume");
const menuHelp = document.getElementById("menuHelp");

const volSFX = document.getElementById("volSFX");
const volMusic = document.getElementById("volMusic");

const helpSearch = document.getElementById("helpSearch");
const helpList = document.getElementById("helpList");

const popup = document.getElementById("quitPopup");
const quitYes = document.getElementById("quitYes");
const quitNo = document.getElementById("quitNo");

let menuOpen = false;
let submenu = null;

const topVillainBtn = document.getElementById("top-villain-button");
const topVillainPanel = document.getElementById("top-villain-panel");
const topVillainPanelClose = document.getElementById("top-villain-panel-close");

if (topVillainBtn) {
    topVillainBtn.addEventListener("click", () => {
        if (!gameState.revealedTopVillain) {
            // If for some reason the flag cleared but the button did not, just bail.
            return;
        }
        buildTopVillainPanelFromDeckTop();
    });
}

if (topVillainPanelClose) {
    topVillainPanelClose.addEventListener("click", () => {
        topVillainPanel.classList.remove("open");
    });
}

function loadKeywords() {
    helpList.innerHTML = "";
    const entries = Object.entries(keywords).sort((a, b) => a[0].localeCompare(b[0]));
    for (let [name, text] of entries) {
        const div = document.createElement("div");
        div.className = "keyword-entry";
        div.innerHTML = `<b>${name}</b><br>${text}`;
        helpList.appendChild(div);
    }
}
loadKeywords();

helpSearch.addEventListener("input", () => {
    const query = helpSearch.value.toLowerCase();
    const entries = Object.entries(keywords).sort((a, b) => a[0].localeCompare(b[0]));

    helpList.innerHTML = "";

    for (let [name, text] of entries) {
        if (name.toLowerCase().includes(query) || text.toLowerCase().includes(query)) {
            const div = document.createElement("div");
            div.className = "keyword-entry";
            div.innerHTML = `<b>${name}</b><br>${text}`;
            helpList.appendChild(div);
        }
    }
});

menuBtn.addEventListener("click", () => {
    if (!menuOpen) {
        sideMenu.classList.add("open");
        menuBtn.style.backgroundColor = "red";
        menuBtn.textContent = "X";
        menuOpen = true;
    } else if (submenu === null) {
        sideMenu.classList.remove("open");
        menuBtn.style.backgroundColor = "rgb(79,196,255)";
        menuBtn.textContent = "≡";
        menuOpen = false;
    } else {
        submenu = null;
        menuHeader.textContent = "Menu";

        menuMain.style.display = "block";
        menuVolume.style.display = "none";
        menuHelp.style.display = "none";

        menuBtn.textContent = "X";
    }
});

document.getElementById("menuVolumeBtn").addEventListener("click", () => {
    submenu = "volume";
    menuHeader.textContent = "Volume";

    menuMain.style.display = "none";
    menuVolume.style.display = "block";
    menuHelp.style.display = "none";

    menuBtn.textContent = "←";
});

document.getElementById("menuHelpBtn").addEventListener("click", () => {
    submenu = "help";
    menuHeader.textContent = "Glossary";
    menuHeader.style.fontSize = "28px";

    menuMain.style.display = "none";
    menuVolume.style.display = "none";
    menuHelp.style.display = "block";

    menuBtn.textContent = "←";
});

document.getElementById("menuQuitBtn").addEventListener("click", () => {
    popup.style.display = "block";
});

quitNo.addEventListener("click", () => {
    popup.style.display = "none";
});

quitYes.addEventListener("click", () => {
    clearGameState();
    window.location.href = "index.html";
});

volSFX.addEventListener("input", () => { }); // DUMMY FOR NOW
volMusic.addEventListener("input", () => { });

function applyOverlordFrame(overlord) {
    if (!overlord) return;

    const imgEl   = document.getElementById("overlord-cropped");
    const frameEl = document.getElementById("overlord-frame-img");
    if (!imgEl || !frameEl) return;

    // Put the overlord/scenario portrait into the cropped square
    imgEl.src = overlord.image;

    // Scenarios: use neutral frame (no difficulty tint)
    if (overlord.type === "Scenario") {
        frameEl.style.filter = "";
        return;
    }

    // Apply color mask to frame based on level (Overlords only)
    let tint = "";

    if (overlord.level == 1) {
        tint = "brightness(1.8) sepia(1) saturate(500%) hue-rotate(10deg)";
    }
    if (overlord.level == 2) {
        tint = "brightness(1.4) sepia(1) saturate(500%) hue-rotate(-3deg)";
    }
    if (overlord.level == 3) {
        tint = "brightness(1.2) sepia(1) saturate(500%) hue-rotate(-30deg)";
    }

    frameEl.style.filter = tint;
}

export function setCurrentOverlord(overlord) {
    if (!overlord) return;
    currentOverlord = overlord;

    applyOverlordFrame(overlord);

    const hpText = document.getElementById("overlord-hp-text");
    if (!hpText) return;

    const maxHP = Number(overlord.hp) || 0;
    const idStr = String(overlord.id);

    // Resolve current HP:
    // prefer overlord.currentHP, then gameState containers, then printed hp
    let currentHP = overlord.currentHP;

    if (currentHP == null) {
        if (overlord.type === "Scenario" && gameState.scenarioHP && gameState.scenarioHP[idStr] != null) {
            currentHP = Number(gameState.scenarioHP[idStr]);
        } else if (overlord.type !== "Scenario" && gameState.overlordData && gameState.overlordData.currentHP != null) {
            currentHP = Number(gameState.overlordData.currentHP);
        } else {
            currentHP = maxHP;
        }
    }

    // Sync object + gameState
    overlord.currentHP = currentHP;

    if (overlord.type === "Scenario") {
        if (!gameState.scenarioHP) gameState.scenarioHP = {};
        gameState.scenarioHP[idStr] = currentHP;
        gameState.activeScenarioId = idStr;
    } else {
        if (!gameState.overlordData) gameState.overlordData = {};
        gameState.overlordData.currentHP = currentHP;
    }

    // Display: full = "10", damaged = "6 / 10"
    const hpDisplay =
        maxHP && currentHP < maxHP
            ? `${currentHP} / ${maxHP}`
            : `${maxHP}`;

    hpText.textContent = hpDisplay;
}

/* === Left Panel Button (the entire overlord frame is clickable) === */
document.getElementById("overlord-frame-box").addEventListener("click", () => {
    buildOverlordPanel(currentOverlord);
});

document.getElementById("overlord-panel-close").addEventListener("click", () => {
    document.getElementById("overlord-panel").classList.remove("open");
});

function extractKeywordsFromAbilities(abilitiesTextArr) {
    if (!Array.isArray(abilitiesTextArr)) return [];

    const found = new Set();

    const keywordNames = Object.keys(keywords); // from keywords.js

    abilitiesTextArr.forEach(a => {
        if (!a || !a.text) return;

        keywordNames.forEach(kw => {
            const regex = new RegExp(`(^|[^A-Za-z0-9'])${kw}([^A-Za-z0-9']|$)`, "i");
            if (regex.test(a.text)) {
                found.add(kw);
            }
        });
    });

    return Array.from(found);
}

/* === Build the entire left panel === */
export function buildOverlordPanel(overlord) {
    if (!overlord) return;

    const panel = document.getElementById("overlord-panel");
    const content = document.getElementById("overlord-panel-content");
    content.innerHTML = "";

    /* === Set panel color based on overlord.level === */
    if (overlord.level == 1) {
        panel.style.backgroundColor = "rgba(255, 255, 0, 0.85)";
        panel.style.borderRight = "4px solid #997700";
    } else if (overlord.level == 2) {
        panel.style.backgroundColor = "rgba(255, 140, 0, 0.85)";
        panel.style.borderRight = "4px solid #663300";
    } else {
        panel.style.backgroundColor = "rgba(255, 0, 0, 0.85)";
        panel.style.borderRight = "4px solid #550000";
    }

    /* === Overlord Card === */
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("overlord-card-scale");
    cardContainer.style.margin = "0 auto";
    const rendered = renderCard(overlord.id, cardContainer);
    cardContainer.appendChild(rendered);

    /* === Overlord Stats === */
    const statsBox = document.createElement("div");

    // Resolve max HP
    const maxHP = Number(overlord.hp) || 0;

    // Resolve current HP with preference order:
    // 1) overlord.currentHP if already set
    // 2) gameState.scenarioHP[id] for Scenarios
    // 3) gameState.overlordData.currentHP for Overlords
    // 4) fall back to printed hp
    let currentHP = overlord.currentHP;
    const idStr = String(overlord.id);

    if (currentHP == null) {
        if (overlord.type === "Scenario" && gameState.scenarioHP && gameState.scenarioHP[idStr] != null) {
            currentHP = Number(gameState.scenarioHP[idStr]);
        } else if (overlord.type !== "Scenario" && gameState.overlordData && gameState.overlordData.currentHP != null) {
            currentHP = Number(gameState.overlordData.currentHP);
        } else {
            currentHP = maxHP;
        }
    }

    // Keep object + gameState in sync
    overlord.currentHP = currentHP;

    if (overlord.type === "Scenario") {
        if (!gameState.scenarioHP) gameState.scenarioHP = {};
        gameState.scenarioHP[idStr] = currentHP;
    } else {
        if (!gameState.overlordData) gameState.overlordData = {};
        gameState.overlordData.currentHP = currentHP;
    }

    // Display: full = "10", damaged = "6 / 10"
    const hpDisplay =
        maxHP && currentHP < maxHP
            ? `${currentHP} / ${maxHP}`
            : `${maxHP}`;

    statsBox.innerHTML = `
        <h2 style="margin: 4px 0;">${overlord.name}</h2>
        <div><strong>HP:</strong> ${hpDisplay}</div>
    `;


    /* === Overlord Abilities === */
    const abilBox = document.createElement("div");
    abilBox.innerHTML = `<h3>Abilities</h3>`;
    overlord.abilitiesText.forEach(a => {
        const line = document.createElement("div");
        line.innerHTML = renderAbilityText(a.text);
        abilBox.appendChild(line);
    });

    const topRow = document.createElement("div");
    topRow.classList.add("overlord-top-row");

    const rightColumn = document.createElement("div");
    rightColumn.classList.add("overlord-right-column");

    rightColumn.appendChild(statsBox);
    rightColumn.appendChild(abilBox);

    topRow.appendChild(cardContainer);
    topRow.appendChild(rightColumn);

    content.appendChild(topRow);

    /* === Tactics List (alphabetical) === */
    const tacticNames = currentTactics
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));

    const tacticBox = document.createElement("div");
    tacticBox.innerHTML = `<h3>Tactics</h3>`;
    tacticNames.forEach(t => {
        const tDiv = document.createElement("div");
        tDiv.innerHTML = `<strong>${t.name}</strong><br>`;
        t.abilitiesText.forEach(a => {
            const line = document.createElement("div");
            line.innerHTML = renderAbilityText(a.text);
            tDiv.appendChild(line);
        });
        tDiv.style.marginBottom = "8px";
        tacticBox.appendChild(tDiv);
    });
    content.appendChild(tacticBox);

    /* === Keyword Extraction === */
    const extractedOverlordKeys = extractKeywordsFromAbilities(overlord.abilitiesText);
    const extractedTacticKeys = currentTactics.flatMap(t => extractKeywordsFromAbilities(t.abilitiesText));

    const allKeywords = [...extractedOverlordKeys, ...extractedTacticKeys];

    // Unique & alphabetized
    const deduped = Array.from(new Set(allKeywords)).sort((a, b) => a.localeCompare(b));

    const keyBox = document.createElement("div");
    keyBox.innerHTML = `<h3>Keywords</h3>`;

    if (deduped.length === 0) {
        const none = document.createElement("div");
        none.style.fontStyle = "italic";
        none.style.color = "#222";
        none.textContent = "No Keywords Found";
        keyBox.appendChild(none);
        content.appendChild(keyBox);
        const spacer = document.createElement("div");
        spacer.style.height = "50px";
        content.appendChild(spacer);
        panel.classList.add("open");
        return;
    }

    deduped.forEach(k => {
        const line = document.createElement("div");
        line.style.marginBottom = "6px";

        const definition = keywords[k] || "<i>No definition found.</i>";

        line.innerHTML = `
            <div style="font-weight:bold;">${k}</div>
            <div style="margin-left:8px;">${definition}</div>
        `;
        keyBox.appendChild(line);
    });

    content.appendChild(keyBox);

    const spacer = document.createElement("div");
    spacer.style.height = "50px";
    content.appendChild(spacer);

    panel.classList.add("open");
}

document.getElementById("hero-panel-close").addEventListener("click", () => {
    document.getElementById("hero-panel").classList.remove("open");
});

document.getElementById("villain-panel-close").addEventListener("click", () => {
        document.getElementById("villain-panel").classList.remove("open");
});

export function buildVillainPanel(villainCard) {
    if (!villainCard) return;

    const panel = document.getElementById("villain-panel");
    const content = document.getElementById("villain-panel-content");
    content.innerHTML = "";

    // Left-side rendered card
    const leftCol = document.createElement("div");
    leftCol.className = "villain-card-scale";
    leftCol.appendChild(renderCard(villainCard.id, leftCol));

    // Right-side stats/text
    const rightCol = document.createElement("div");
    rightCol.className = "villain-right-column";

    rightCol.innerHTML = `
        <h2>${villainCard.name}</h2>
        <div><strong>${villainCard.type}</strong></div>
        <div><strong>HP:</strong> ${villainCard.hp}</div>
        <div><strong>Damage:</strong> ${villainCard.damage}</div>
        <h3>Abilities</h3>
    `;

    if (villainCard.abilitiesText?.length) {
        villainCard.abilitiesText.forEach(a => {
            const line = document.createElement("div");
            line.innerHTML = renderAbilityText(a.text);
            rightCol.appendChild(line);
        });
    }

    // Final assembly
    const topRow = document.createElement("div");
    topRow.className = "villain-top-row";
    topRow.appendChild(leftCol);
    topRow.appendChild(rightCol);

    content.appendChild(topRow);

    const captured = document.createElement("div");
    captured.innerHTML = `
        <h3>Captured Bystanders</h3>
        <div>${villainCard.capturedBystanders || 0}</div>
    `;
    content.appendChild(captured);

    const foundKeys = extractKeywordsFromAbilities(villainCard.abilitiesText).sort((a, b) => a.localeCompare(b));

    const keyBox = document.createElement("div");
    keyBox.innerHTML = `<h3>Keywords</h3>`;

    if (foundKeys.length === 0) {
        const none = document.createElement("div");
        none.style.fontStyle = "italic";
        none.textContent = "No Keywords Found";
        keyBox.appendChild(none);
    } else {
        foundKeys.forEach(k => {
            const line = document.createElement("div");
            line.style.marginBottom = "6px";
            line.innerHTML = `
                <div style="font-weight:bold;">${k}</div>
                <div style="margin-left:8px;">${keywords[k] || "No definition found."}</div>
            `;
            keyBox.appendChild(line);
        });
    }

    content.appendChild(keyBox);

    // Slide panel open
    panel.classList.add("open");
}
window.buildVillainPanel = buildVillainPanel;

/* Keyword extraction reused for heroes */
function extractHeroKeywords(abilitiesTextArr) {
    if (!Array.isArray(abilitiesTextArr)) return [];
    const found = new Set();
    const keywordNames = Object.keys(keywords);

    abilitiesTextArr.forEach(a => {
        if (!a || !a.text) return;
        keywordNames.forEach(kw => {
            const regex = new RegExp(`(^|[^A-Za-z0-9'])${kw}([^A-Za-z0-9']|$)`, "i");
            if (regex.test(a.text)) found.add(kw);
        });
    });

    return Array.from(found);
}

function getRGB(color) {
    const d = document.createElement("div");
    d.style.color = color;
    document.body.appendChild(d);

    const rgb = window.getComputedStyle(d).color;
    document.body.removeChild(d);

    return rgb; // returns "rgb(r, g, b)"
}

function lightenRGB(rgbString, factor = 0.65) {
    // rgbString is like "rgb(255, 0, 0)"
    const nums = rgbString.match(/\d+/g).map(Number);
    const [r, g, b] = nums;

    // Move the color toward white by the given factor
    const nr = Math.round(r + (255 - r) * factor);
    const ng = Math.round(g + (255 - g) * factor);
    const nb = Math.round(b + (255 - b) * factor);

    return `rgb(${nr}, ${ng}, ${nb})`;
}

export function buildHeroPanel(hero) {
    if (!hero) return;

    const panel = document.getElementById("hero-panel");
    const content = document.getElementById("hero-panel-content");
    content.innerHTML = "";

    /* HERO PANEL COLORING */
    const rgb = getRGB(hero.color || "white");
    const light = lightenRGB(rgb, 0.35);
    panel.style.backgroundColor = light.replace("rgb", "rgba").replace(")", ", 0.85)");
    panel.style.borderRight = `4px solid ${hero.color || "black"}`;

    /* CARD */
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("hero-card-scale");
    const rendered = renderCard(hero.id, cardContainer);
    cardContainer.appendChild(rendered);

    /* STATS */
    const liveHP =
        (gameState.heroData?.[hero.id]?.hp) ??
        hero.currentHP ??
        hero.hp;

    hero.currentHP = liveHP ?? hero.hp;

    const statsBox = document.createElement("div");
    statsBox.innerHTML = `
        <h2 style="margin:4px 0;">${hero.name}</h2>
        <div><strong>HP:</strong> ${
            (hero.currentHP === hero.hp)
                ? hero.hp                      // show only HP if full
                : `${hero.currentHP} / ${hero.hp}`  // otherwise show current/max
        }</div>
        <div><strong>Damage Threshold:</strong> ${hero.damageThreshold}</div>
        <div><strong>Travel Budget:</strong> ${hero.travel}</div>
        <div><strong>Retreat Requirement:</strong> ${hero.retreat}</div>
    `;

    /* ABILITIES */
    const abilBox = document.createElement("div");
    abilBox.innerHTML = `<h3 style="margin-bottom:0; padding-bottom:0;">Abilities</h3>`;

    hero.abilitiesText.forEach((a, i) => {
        const block = document.createElement("div");
        block.innerHTML = renderAbilityText(a.text);
        abilBox.appendChild(block);
    });

    /* Top row: card left, text right */
    const topRow = document.createElement("div");
    topRow.classList.add("hero-top-row");

    const rightColumn = document.createElement("div");
    rightColumn.classList.add("hero-right-column");

    rightColumn.appendChild(statsBox);
    rightColumn.appendChild(abilBox);

    topRow.appendChild(cardContainer);
    topRow.appendChild(rightColumn);

    content.appendChild(topRow);

    const usesList = document.createElement("div");
    usesList.innerHTML = `<h3 style="margin-bottom:4px;">Ability Uses</h3>`;

    // Ensure currentUses exists
    hero.currentUses = hero.currentUses || {};

    hero.abilitiesNamePrint.forEach((nameObj, i) => {
        const effect = hero.abilitiesEffects[i] || {};
        const maxUses = Number(effect.uses || 0);

        // Initialize remaining uses
        if (hero.currentUses[i] == null) {
            hero.currentUses[i] = maxUses;
        }

        const remaining = hero.currentUses[i];

        const line = document.createElement("div");
        line.style.display = "flex";
        line.style.flexDirection = "row";
        line.style.alignItems = "center";
        line.style.fontSize = "12px";
        line.style.margin = "3px 0";

        // Number + "x"
        const count = document.createElement("div");
        if (effect.type === "passive") {
            count.textContent = "-";
        } else {
            count.textContent = `${remaining}x`;
        }
        count.style.fontWeight = "bold";
        count.style.marginRight = "6px";
        count.style.width = "24px";  // keeps alignment consistent

        const label = document.createElement("div");
        label.textContent = nameObj.text;

        line.appendChild(count);
        line.appendChild(label);
        usesList.appendChild(line);
    });

    content.appendChild(usesList);

    /* KEYWORDS */
    const foundKeys = extractHeroKeywords(hero.abilitiesText).sort((a, b) => a.localeCompare(b));

    const keyBox = document.createElement("div");
    keyBox.innerHTML = `<h3>Keywords</h3>`;

    if (foundKeys.length === 0) {
        const none = document.createElement("div");
        none.style.fontStyle = "italic";
        none.textContent = "No Keywords Found";
        keyBox.appendChild(none);
    } else {
        foundKeys.forEach(k => {
            const line = document.createElement("div");
            line.style.marginBottom = "6px";
            line.innerHTML = `
                <div style="font-weight:bold;">${k}</div>
                <div style="margin-left:8px;">${keywords[k] || "No definition found."}</div>
            `;
            keyBox.appendChild(line);
        });
    }

    content.appendChild(keyBox);

    /* Open panel */
    panel.classList.add("open");
}

/* === Make Hero Portraits Clickable === */
function attachHeroClicks() {
    const row = document.getElementById("heroes-row");
    const wrappers = row.querySelectorAll(".hero-border-wrapper");

    wrappers.forEach((wrap, index) => {
        wrap.style.cursor = "pointer";

        wrap.addEventListener("click", () => {
            const id = selectedHeroes[index];
            if (!id) return;
            const hero = heroMap.get(String(id));
            if (!hero) return;
            buildHeroPanel(hero);
        });
    });
}

const isSinglePlayer = (window.GAME_MODE === "single");
const isMultiplayer = (window.GAME_MODE === "multi");

setInterval(() => {
    saveGameState(gameState);
}, 5000);

export function placeCardIntoCitySlot(cardId, slotIndex) {
    const citySlots = document.querySelectorAll(".city-slot");
    const slot = citySlots[slotIndex];
    if (!slot) return;

    const cardArea = slot.querySelector(".city-card-area");
    if (!cardArea) return;

    // Remove previous card
    cardArea.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const rendered = renderCard(cardId, wrapper);
    wrapper.appendChild(rendered);

    // Attach click AFTER animation settles
    setTimeout(() => {
        const finalWrapper = slot.querySelector(".card-wrapper");
        if (!finalWrapper) {
            console.warn("No finalWrapper found after animation for slot", slotIndex);
            return;
        }

        const cardData =
            henchmen.find(h => h.id === cardId) ||
            villains.find(v => v.id === cardId);

        console.log("Detected card placed into slot:", {
            slotIndex,
            cardId,
            cardData,
            finalWrapper
        });

        if (cardData) {
            finalWrapper.style.cursor = "pointer";
            finalWrapper.addEventListener("click", (e) => {
                e.stopPropagation();
                console.log("Villain/Henchmen card clicked:", {
                    slotIndex,
                    cardId,
                    cardName: cardData.name,
                    wrapper: finalWrapper
                });

                buildVillainPanel(cardData);
            });
        } else {
            console.warn("cardData NOT FOUND for id:", cardId);
        }
    }, 650); // matches your card-enter animation duration


    const isUpperRow = (
        slotIndex === CITY_EXIT_UPPER ||
        slotIndex === CITY_5_UPPER ||
        slotIndex === CITY_4_UPPER ||
        slotIndex === CITY_3_UPPER ||
        slotIndex === CITY_2_UPPER ||
        slotIndex === CITY_ENTRY_UPPER
    );

    if (isUpperRow) {
        wrapper.classList.add("city-card-enter");

        // Remove animation class when finished
        setTimeout(() => {
            wrapper.classList.remove("city-card-enter");
        }, 650); // a little longer than 0.6s
    }

    cardArea.appendChild(wrapper);

    // Update game state
    if (!Array.isArray(gameState.cities)) gameState.cities = [];
    gameState.cities[slotIndex] = {
        slotIndex,
        type: "villain",
        id: String(cardId)
    };

    saveGameState(gameState);
}

window.addEventListener("load", () => {
    const btn = document.getElementById("start-game-btn");
    if (!btn) return;

    // Keep the button invisible
    btn.style.display = "none";

    btn.addEventListener("click", () => {
        window.VILLAIN_DRAW_ENABLED = true;
        startHeroTurn(gameState);
        gameState.isGameStarted = true;
        saveGameState(gameState);
    });

    const saved = loadGameState();

    // Auto start ONLY if new game or saved game never started
    if (!saved || !saved.isGameStarted) {
        setTimeout(() => btn.click(), 2000);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("end-turn-button");
    if (!btn) {
        console.error("End turn button not found at DOMContentLoaded");
        return;
    }

    btn.addEventListener("click", () => {
        //console.log("End turn clicked.");
        endCurrentHeroTurn(gameState);
    });
});

function buildTopVillainPanelFromDeckTop() {
    const panel = document.getElementById("top-villain-panel");
    const content = document.getElementById("top-villain-panel-content");

    if (!panel || !content) return;
    if (!gameState.revealedTopVillain) return;

    const deck = gameState.villainDeck || [];
    let ptr = gameState.villainDeckPointer ?? 0;

    if (!Array.isArray(deck) || deck.length === 0) return;
    if (ptr >= deck.length) {
        ptr = deck.length - 1;
    }

    const topId = deck[ptr];
    const cardData =
        henchmen.find(h => String(h.id) === String(topId)) ||
        villains.find(v => String(v.id) === String(topId));

    if (!cardData) {
        console.warn("[TOP VILLAIN PANEL] No card data for deck top id:", topId);
        return;
    }

    content.innerHTML = "";

    const rightPanelTitle = document.createElement("div");
    rightPanelTitle.innerHTML = `
        <h4>Revealed Top Card of Villain Deck</h4>
    `;
    content.appendChild(rightPanelTitle);

    // Left-side rendered card
    const leftCol = document.createElement("div");
    leftCol.className = "villain-card-scale";
    leftCol.appendChild(renderCard(cardData.id, leftCol));

    // Right-side stats/text
    const rightCol = document.createElement("div");
    rightCol.className = "villain-right-column";

    rightCol.innerHTML = `
        <h2>${cardData.name}</h2>
        <div><strong>${cardData.type}</strong></div>
        <div><strong>HP:</strong> ${cardData.hp}</div>
        <div><strong>Damage:</strong> ${cardData.damage}</div>
        <h3>Abilities</h3>
    `;

    if (cardData.abilitiesText?.length) {
        cardData.abilitiesText.forEach(a => {
            const line = document.createElement("div");
            // IMPORTANT: pass the text string into renderAbilityText,
            // same as the left villain panel, so html.replace works.
            line.innerHTML = renderAbilityText(a.text);
            rightCol.appendChild(line);
        });
    }

    // Top row: card + stats/abilities
    const topRow = document.createElement("div");
    topRow.className = "villain-top-row";
    topRow.appendChild(leftCol);
    topRow.appendChild(rightCol);

    content.appendChild(topRow);

    // Keyword definitions (mirrors left panel)
    const foundKeys = extractKeywordsFromAbilities(cardData.abilitiesText)
        .sort((a, b) => a.localeCompare(b));

    const keyBox = document.createElement("div");
    keyBox.innerHTML = `<h3>Keywords</h3>`;

    if (foundKeys.length === 0) {
        const none = document.createElement("div");
        none.style.fontStyle = "italic";
        none.textContent = "No Keywords Found";
        keyBox.appendChild(none);
    } else {
        foundKeys.forEach(k => {
            const line = document.createElement("div");
            line.style.marginBottom = "6px";
            line.innerHTML = `
                <div style="font-weight:bold;">${k}</div>
                <div style="margin-left:8px;">${keywords[k] || "No definition found."}</div>
            `;
            keyBox.appendChild(line);
        });
    }

    content.appendChild(keyBox);

    // Slide panel open
    panel.classList.add("open");
}

export function playMightSwipeAnimation() {
    return new Promise(resolve => {

        // Wrapper to hold the rendered card
        const wrapper = document.createElement("div");
        wrapper.className = "might-swipe-wrapper";

        // Position on top of all UI
        wrapper.style.position = "fixed";
        wrapper.style.top = "50%";
        wrapper.style.left = "0";
        wrapper.style.transform = "translateY(-50%) translateX(100vw)";
        wrapper.style.transition = "transform 2.5s ease-out";
        wrapper.style.zIndex = "999999";  // above everything
        wrapper.style.pointerEvents = "none";

        // Create the actual card using your renderer
        const cardNode = renderCard("7001", wrapper);  
        wrapper.appendChild(cardNode);

        document.body.appendChild(wrapper);

        // Kick off animation on next frame
        requestAnimationFrame(() => {
            wrapper.style.transform = "translateY(-50%) translateX(-120vw)";
        });

        // Remove after full sweep
        setTimeout(() => {
            wrapper.remove();
            resolve();
        }, 1500); // Adjust timing if needed
    });
}

export function showMightBanner(text, duration = 1400) {
    return new Promise(resolve => {
        const banner = document.createElement("div");
        banner.className = "might-banner";
        banner.textContent = text;

        document.body.appendChild(banner);
        banner.classList.add("fade-in");

        setTimeout(() => {
            banner.classList.remove("fade-in");
            banner.classList.add("fade-out");

            setTimeout(() => {
                banner.remove();
                resolve();
            }, 800);
        }, duration);
    });
}