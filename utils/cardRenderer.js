import { heroes } from '../data/faceCards.js';
import { heroCards } from '../data/heroCards.js';
import { bystanders } from '../data/bystanders.js';
import { enemies } from '../data/enemies.js';
import { allies } from '../data/allies.js';
import { henchmen } from '../data/henchmen.js';
import { overlords } from '../data/overlords.js';
import { scenarios } from '../data/scenarios.js';
import { tactics } from '../data/tactics.js';
import { villains } from '../data/villains.js';

import { gameState } from "../data/gameState.js";

export function findCardInAllSources(id) {
  const sources = [
    heroes,
    heroCards,
    bystanders,
    enemies,
    allies,
    henchmen,
    overlords,
    scenarios,
    tactics,
    villains,
  ];

  for (const src of sources) {
    if (!Array.isArray(src)) continue;
    const card = src.find(c => String(c.id) === String(id));
    if (card) return card;
  }

  return null;
}

export function renderCard(cardId, container) {
  const cardData = findCardInAllSources(cardId);
  if (!cardData) {
    const missing = document.createElement('div');
    missing.textContent = `Card not found: ${cardId}`;
    missing.style.color = 'red';
    missing.style.fontWeight = 'bold';
    return missing;
  }

  if(cardData.type === "Main") {
    // Card container
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.position = 'relative';
    card.style.width = '230px';   // 2.3w ratio
    card.style.height = '350px';  // 3.5h ratio
    card.style.overflow = 'hidden';
    card.style.borderRadius = '8px';
    card.style.border = '2px solid black';
    card.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.3)';
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = '#000'; // black fallback

    // Image (cropped)
    const img = document.createElement('img');
    img.src = cardData.image;
    img.alt = cardData.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
    card.appendChild(img);

    // Name overlay (top)
    const nameOverlay = document.createElement('div');
    nameOverlay.style.position = 'absolute';
    nameOverlay.style.top = '0';
    nameOverlay.style.left = '0';
    nameOverlay.style.width = '100%';
    nameOverlay.style.textAlign = 'center';
    nameOverlay.style.paddingTop = '6px';
    nameOverlay.style.background = 'rgba(0,0,0,0.4)';
    nameOverlay.style.color = 'white';
    nameOverlay.style.textShadow = '1px 1px 3px black';
    nameOverlay.style.fontSize = '16px';
    nameOverlay.style.fontWeight = 'bold';
    nameOverlay.style.textDecoration = 'underline';
    nameOverlay.textContent = cardData.name;
    card.appendChild(nameOverlay);

    requestAnimationFrame(() => {
      shrinkTextToFitWidth(nameOverlay, 10); // min font 10px
    });

    // Hero name (under card name)
    if (cardData.hero) {
      const heroName = document.createElement('div');
      heroName.textContent = cardData.hero;
      heroName.style.position = 'absolute';
      heroName.style.top = '26px';
      heroName.style.width = '100%';
      heroName.style.textAlign = 'center';
      heroName.style.color = 'white';
      heroName.style.fontSize = '14px';
      heroName.style.textShadow = '1px 1px 3px black';
      //card.appendChild(heroName);
    }

    // Bottom overlay (damage + abilities)
    const bottomOverlay = document.createElement('div');
    bottomOverlay.style.position = 'absolute';
    bottomOverlay.style.bottom = '0';
    bottomOverlay.style.left = '0';
    bottomOverlay.style.width = '100%';
    bottomOverlay.style.height = '90px';
    bottomOverlay.style.background = 'rgba(0,0,0,0.65)';
    bottomOverlay.style.color = 'white';
    bottomOverlay.style.display = 'flex';
    bottomOverlay.style.alignItems = 'center';
    bottomOverlay.style.justifyContent = 'space-between';
    bottomOverlay.style.padding = '8px 10px';
    card.appendChild(bottomOverlay);

    // Abilities text (left-aligned)
    const textBox = document.createElement('div');
    textBox.style.flex = '1';
    textBox.style.fontSize = '13px';
    textBox.style.lineHeight = '1.2em';
    textBox.style.textAlign = 'left';
    textBox.style.marginRight = '10px';

    if (Array.isArray(cardData.abilitiesText)) {
      cardData.abilitiesText.forEach(a => {
        const line = document.createElement('div');
        line.innerHTML = renderAbilityText(a.text);
        textBox.appendChild(line);
      });
    }

    bottomOverlay.appendChild(textBox);
    requestAnimationFrame(() => autoShrinkTextToFit(textBox, 9));

    // Damage section (right side)
    if (cardData.damage && cardData.damage !== "0") {
      const dmgContainer = document.createElement('div');
      dmgContainer.style.position = 'relative';
      dmgContainer.style.width = '60px';
      dmgContainer.style.height = '60px';
      dmgContainer.style.flexShrink = '0';

      const dmgImg = document.createElement('img');
      dmgImg.src = "https://raw.githubusercontent.com/over-lords/overlords/a61d7fb50e273106d490476bd3c621f3a6f45047/Public/Images/Card%20Assets/Misc/Damage.png";
      dmgImg.alt = 'Damage';
      dmgImg.style.position = 'absolute';
      dmgImg.style.left = '-6px';
      dmgImg.style.width = '100%';
      dmgImg.style.height = '100%';
      dmgImg.style.objectFit = 'contain';
      dmgContainer.appendChild(dmgImg);

      const dmgNum = document.createElement('div');
      dmgNum.textContent = cardData.damage;
      dmgNum.style.position = 'absolute';
      dmgNum.style.top = '50%';
      dmgNum.style.left = 'calc(50% - 6px)';
      dmgNum.style.transform = 'translate(-50%, -50%)';
      dmgNum.style.fontSize = '22px';
      dmgNum.style.fontWeight = 'bold';
      dmgNum.style.color = 'white';
      dmgNum.style.textShadow = '2px 2px 4px black';
      dmgContainer.appendChild(dmgNum);

      bottomOverlay.appendChild(dmgContainer);
    } else {
      // No damage — expand text box fully
      textBox.style.marginRight = '0';
      textBox.style.flex = '1 1 100%';
      textBox.style.textAlign = 'center';           // center text
      bottomOverlay.style.justifyContent = 'center'; // center horizontally
      bottomOverlay.style.alignItems = 'center';     // center vertically
      bottomOverlay.style.paddingLeft = '0';
      bottomOverlay.style.paddingRight = '0';
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);
    return wrapper;
  } else if (cardData.type === "Hero") {

    const isBoardRender = !!(container?.classList?.contains("card-wrapper"));

    const card = document.createElement('div');
    card.classList.add('card');
    card.style.position = 'relative';
    card.style.width = '230px';
    card.style.height = '350px';
    card.style.overflow = 'hidden';
    card.style.borderRadius = '8px';
    card.style.border = '2px solid black';
    card.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.3)';
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = '#000';

    // Full-size hero image (no window)
    const img = document.createElement('img');
    img.src = cardData.image;
    img.alt = cardData.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    card.appendChild(img);

    // === TOP NAME STRIP ===
    const NAME_STRIP_HEIGHT = 40;  // <- hard-coded forever-safe height

    const nameStrip = document.createElement('div');
    nameStrip.classList.add('hero-name-strip');
    nameStrip.style.position = 'absolute';
    nameStrip.style.top = '0';
    nameStrip.style.left = '0';
    nameStrip.style.width = '100%';
    nameStrip.style.height = NAME_STRIP_HEIGHT + 'px';
    nameStrip.style.background = 'rgba(0,0,0,0.55)';
    nameStrip.style.display = 'flex';
    nameStrip.style.flexDirection = 'column';
    nameStrip.style.alignItems = 'center';
    nameStrip.style.justifyContent = 'center';
    nameStrip.style.overflow = 'hidden';
    card.appendChild(nameStrip);

    // Hero name
    const nameEl = document.createElement('div');
    nameEl.classList.add('hero-name');
    nameEl.textContent = cardData.name;
    nameEl.style.fontWeight = 'bold';
    nameEl.style.fontSize = '24px';
    nameEl.style.whiteSpace = "nowrap";
    nameEl.style.maxWidth = "100%";     // REQUIRED
    nameEl.style.display = "block";     // REQUIRED for correct measurement
    nameEl.style.textAlign = "center";  // still centered
    nameEl.style.color = cardData.color || 'white';
    nameEl.style.whiteSpace = 'nowrap';
    nameEl.style.webkitTextStroke = '1px rgba(211, 211, 211, 0.9)';
    nameEl.style.textStroke = '1px rgba(211, 211, 211, 0.9)';
    nameEl.style.textShadow = '1px 1px 3px black';
    nameStrip.appendChild(nameEl);

    // Shrink to fit both width AND height
    requestAnimationFrame(() => {
        shrinkToFitWidth(nameEl, 10);
        shrinkTextToFitHeight(nameEl, NAME_STRIP_HEIGHT, 10);
    });

    // === TEAM COLUMN BELOW NAME STRIP ===
    const teamColumn = document.createElement('div');
    teamColumn.style.position = 'absolute';
    teamColumn.style.top = NAME_STRIP_HEIGHT + 'px'; // <-- hard-coded start
    teamColumn.style.left = '4px';
    teamColumn.style.display = 'flex';
    teamColumn.style.flexDirection = 'column';
    teamColumn.style.alignItems = 'flex-start';
    teamColumn.style.gap = '4px';
    teamColumn.style.zIndex = '5';
    card.appendChild(teamColumn);

    if (Array.isArray(cardData.teams)) {
        cardData.teams.forEach(team => {
            const iconSrc = getTeamIcon(team);
            if (iconSrc) {
                const icon = document.createElement('img');
                icon.src = iconSrc;
                icon.alt = team;
                icon.style.width = '24px';
                icon.style.height = '24px';
                icon.style.objectFit = 'contain';
                icon.style.filter = 'drop-shadow(1px 1px 2px black)';
                teamColumn.appendChild(icon);
            }
        });
    }

    // === BOTTOM STRIP (3-column, 5-space layout) ===
    const bottomStrip = document.createElement('div');
    bottomStrip.style.position = 'absolute';
    bottomStrip.style.bottom = '0';
    bottomStrip.style.left = '0';
    bottomStrip.style.width = '100%';
    bottomStrip.style.background = 'rgba(0,0,0,0.65)';
    bottomStrip.style.color = 'white';
    bottomStrip.style.boxSizing = 'border-box';

    // Board render = enlarged stat icons, no abilities text
    if (isBoardRender) {
        bottomStrip.style.height = '120px';
        bottomStrip.style.display = 'flex';
        bottomStrip.style.alignItems = 'center';
        bottomStrip.style.justifyContent = 'space-evenly';
    } 
    // Normal (non-board) render = original grid layout
    else {
        bottomStrip.style.height = '110px';
        bottomStrip.style.display = 'grid';
        bottomStrip.style.gridTemplateColumns = '1fr 4fr 1fr';
        bottomStrip.style.gridTemplateRows = '1fr 1fr';
        bottomStrip.style.padding = '4px 6px';
    }

    card.appendChild(bottomStrip);

    // LEFT COLUMN (2 rows)
    const leftTop = document.createElement('div');
    const leftBottom = document.createElement('div');

    // CENTER COLUMN (1 tall row spanning both)
    let center = null;
    center = document.createElement('div');
    center.style.gridRow = '1 / span 2';
    center.style.gridColumn = '2';
    center.style.display = 'flex';
    center.style.alignItems = 'center';
    center.style.justifyContent = 'center';
    center.style.textAlign = 'center';
    center.style.padding = '0 3px';
    center.style.overflow = 'hidden';

    // RIGHT COLUMN (2 rows)
    const rightTop = document.createElement('div');
    const rightBottom = document.createElement('div');

    // common stat box builder
    function statBlock(imgSrc, valueText, options = {}) {
      const {
        iconSize = 32,
        iconMargin = "0px",
        textMargin = "-22px 0 0 0",
        className = "",
        wrapperStyles = {},
        textStyles = {},
        iconStyles = {}
      } = options;

      const box = document.createElement('div');
      box.style.position = 'relative';
      box.style.display = 'flex';
      box.style.alignItems = 'center';
      box.style.justifyContent = 'flex-start';
      box.style.gap = '2px';
      box.style.fontSize = '15px';
      box.style.fontWeight = 'bold';
      box.style.textShadow = '2px 2px 3px black';
      box.className = className;

      // Apply optional wrapper overrides
      Object.assign(box.style, wrapperStyles);

      const icon = document.createElement('img');
      icon.src = imgSrc;
      icon.style.width = iconSize + 'px';
      icon.style.height = iconSize + 'px';
      icon.style.objectFit = 'contain';
      icon.style.margin = iconMargin;

      // Apply optional icon overrides
      Object.assign(icon.style, iconStyles);

      const num = document.createElement('div');
      num.textContent = valueText;
      num.style.margin = textMargin;
      num.style.color = 'white';

      // Apply optional text overrides
      Object.assign(num.style, textStyles);

      box.appendChild(icon);
      box.appendChild(num);
      return box;
    }

    const assets = "https://raw.githubusercontent.com/over-lords/overlords/main/Public/Images/Card%20Assets/Misc";

    // fill the 5 spaces:
    leftTop.appendChild(
      statBlock(`${assets}/Shield.png`, cardData.damageThreshold, {
        iconSize: 34,
        iconMargin: "4px 0 0 -2px",
        textMargin: "0px 0 0 -24px",
        className: "shieldBlock",
        wrapperStyles: { justifyContent: "flex-start" },
        iconStyles: {},
        textStyles: {}
      })
    );

    const liveHP =
      (gameState.heroData?.[cardData.id]?.hp) ??
      cardData.currentHP ??
      cardData.hp;

    const hpBox = statBlock(`${assets}/Heart.png`, liveHP, {
        iconSize: 32,
        iconMargin: "0px 0 0 0px",
        textMargin: "-5px 0 0 -33px",
        className: "heartBlock"
    });

    const hpText = hpBox.querySelector("div");
    hpText.style.textAlign = "center";
    hpText.style.display = "inline-block";
    hpText.style.width = "30px";

    hpBox.classList.add("hero-board-hp");
    hpBox.dataset.heroId = cardData.id;

    leftBottom.appendChild(hpBox);

    rightTop.appendChild(
      statBlock(`${assets}/Travel.png`, cardData.travel, {
        iconSize: 30,
        iconMargin: "4px 0 0 8px",
        textMargin: "8px 0 0 -22px",
        className: "travelBlock"
      })
    );

    rightBottom.appendChild(
      statBlock(`${assets}/Retreat.png`, cardData.retreat, {
        iconSize: 36,
        iconMargin: "-4px 0 0 5px",
        textMargin: "-2px 0 0 -25px",
        className: "retreatBlock"
      })
    );

    // If NOT board render, include ability text area
    if (!isBoardRender) {
        center = document.createElement('div');
        center.style.gridRow = '1 / span 2';
        center.style.gridColumn = '2';
        center.style.display = 'flex';
        center.style.alignItems = 'center';
        center.style.justifyContent = 'center';
        center.style.textAlign = 'center';
        center.style.padding = '0 3px';
        center.style.overflow = 'hidden';

        const abilityBox = document.createElement('div');
        abilityBox.style.width = '100%';
        abilityBox.style.fontSize = '10px';
        abilityBox.style.lineHeight = '1.1em';

        if (Array.isArray(cardData.abilitiesText)) {
            cardData.abilitiesText.forEach(a => {
                const line = document.createElement('div');
                line.innerHTML = renderAbilityText(a.text);
                abilityBox.appendChild(line);
            });
        }

        center.appendChild(abilityBox);
    }

    // place in grid
    if (isBoardRender) {
        // SHIELD (Damage Threshold)
        const shield = leftTop.querySelector(".shieldBlock");
        if (shield) {
            shield.style.transform = "translate(20.5px, -25px)";
            shield.querySelector("img").style.width = "60px";
            shield.querySelector("img").style.height = "60px";
            shield.querySelector("div").style.fontSize = "32px";
            shield.querySelector("div").style.margin = "-5px 0 0 -40px";
        }

        // HEART (HP)
        const heart = leftBottom.querySelector(".heartBlock");
        if (heart) {
            heart.style.transform = "translate(-32px, 30px)";
            heart.querySelector("img").style.width = "62px";
            heart.querySelector("img").style.height = "62px";
            heart.querySelector("div").style.fontSize = "28px";
            heart.querySelector("div").style.margin = "-5px 0 0 -47px";
        }

        // TRAVEL
        const travel = rightTop.querySelector(".travelBlock");
        if (travel) {
            travel.style.transform = "translate(16px, -30px)";
            travel.querySelector("img").style.width = "58px";
            travel.querySelector("img").style.height = "58px";
            travel.querySelector("div").style.fontSize = "32px";
            travel.querySelector("div").style.margin = "17px 0 0 -41px";
        }

        // RETREAT
        const retreat = rightBottom.querySelector(".retreatBlock");
        if (retreat) {
            retreat.style.transform = "translate(-40px, 32px)";
            retreat.querySelector("img").style.width = "64px";
            retreat.querySelector("img").style.height = "64px";
            retreat.querySelector("div").style.fontSize = "28px";
            retreat.querySelector("div").style.margin = "-2px 0 0 -41px";
        }

        [leftTop, leftBottom, rightTop, rightBottom].forEach(block => {
            // Enlarge icons & numbers
            const icon = block.querySelector("img");
            const num = block.querySelector("div");

            if (icon) icon.style.width = "60px";
            if (icon) icon.style.height = "60px";
            if (num) num.style.fontSize = "26px";

            bottomStrip.appendChild(block);
        });
    } else {
        // NORMAL VIEW: full grid layout including abilities
        bottomStrip.appendChild(leftTop);
        if (center) bottomStrip.appendChild(center);
        bottomStrip.appendChild(rightTop);
        bottomStrip.appendChild(leftBottom);
        bottomStrip.appendChild(rightBottom);
    }


    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);
    return wrapper;
  } else if (cardData.type === "Might") {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.position = 'relative';
    card.style.width = '230px';
    card.style.height = '350px';
    card.style.overflow = 'hidden';
    card.style.borderRadius = '8px';
    card.style.border = '2px solid black';
    card.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.3)';
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = '#000';

    // Body image
    const img = document.createElement('img');
    img.src = "https://raw.githubusercontent.com/over-lords/overlords/d4d722dd9c416015b0aac29883ba241deea3f8d7/Public/Images/Card%20Assets/Misc/Might%20of%20the%20Overlord.jpg";
    img.alt = "Might of the Overlord";
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    card.appendChild(img);

    // Bottom label strip
    const label = document.createElement('div');
    label.textContent = "Might of the Overlord";
    label.style.position = 'absolute';
    label.style.bottom = '0';
    label.style.left = '0';
    label.style.width = '100%';
    label.style.background = 'rgba(0,0,0,0.6)';
    label.style.color = '#d0d0d0';
    label.style.textAlign = 'center';
    label.style.padding = '8px 0';
    label.style.fontSize = '18px';
    label.style.fontWeight = 'bold';
    label.style.textShadow = '1px 1px 3px black';
    card.appendChild(label);

    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);
    return wrapper;
  } else if (cardData.type === "Ally" || cardData.type === "Enemy") {
    const isAlly = cardData.type === "Ally";

    // Colors
    const overlayColor = isAlly
        ? "rgba(0, 80, 200, 0.8)"    // blue, semi-transparent
        : "rgba(200, 0, 0, 0.8)";    // red, semi-transparent

    // === CARD BASE ===
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.position = 'relative';
    card.style.width = '230px';
    card.style.height = '350px';
    card.style.overflow = 'hidden';
    card.style.borderRadius = '8px';
    card.style.border = '2px solid black';
    card.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.3)';
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = '#000';

    // === FULL IMAGE ===
    const img = document.createElement('img');
    img.src = cardData.image;
    img.alt = cardData.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    card.appendChild(img);

    // === TOP TITLE STRIP ===
    const topBar = document.createElement('div');
    topBar.style.position = 'absolute';
    topBar.style.top = '0';
    topBar.style.left = '0';
    topBar.style.width = '100%';
    topBar.style.height = '40px';
    topBar.style.background = overlayColor;
    topBar.style.display = 'flex';
    topBar.style.alignItems = 'center';
    topBar.style.justifyContent = 'center';
    topBar.style.color = '#d0d0d0';
    topBar.style.fontSize = '20px';
    topBar.style.fontWeight = 'bold';
    topBar.style.textShadow = '1px 1px 3px black';
    topBar.style.overflow = 'hidden';
    topBar.style.whiteSpace = 'nowrap';
    topBar.style.textAlign = 'center';
    topBar.textContent = cardData.name;
    card.appendChild(topBar);

    requestAnimationFrame(() => {
        shrinkToFitWidth(topBar, 10);
    });

    // === BOTTOM ABILITY STRIP ===
    const bottomBar = document.createElement('div');
    bottomBar.style.position = 'absolute';
    bottomBar.style.bottom = '0';
    bottomBar.style.left = '0';
    bottomBar.style.width = '100%';
    bottomBar.style.height = '100px';
    bottomBar.style.background = overlayColor;
    bottomBar.style.color = '#d0d0d0';
    bottomBar.style.display = 'flex';
    bottomBar.style.alignItems = 'center';
    bottomBar.style.justifyContent = 'center';
    bottomBar.style.padding = '8px';
    bottomBar.style.textAlign = 'center';
    bottomBar.style.fontSize = '14px';
    bottomBar.style.lineHeight = '1.2em';
    bottomBar.style.overflow = 'hidden';
    card.appendChild(bottomBar);

    const textBox = document.createElement('div');
    textBox.style.width = '100%';
    textBox.style.maxHeight = '100%';
    textBox.style.overflow = 'hidden';

    if (Array.isArray(cardData.abilitiesText)) {
        cardData.abilitiesText.forEach(a => {
            const line = document.createElement('div');
            line.innerHTML = renderAbilityText(a.text);
            line.style.display = "flex";
            line.style.textAlign = "center";
            line.style.width = "92.5%";
            textBox.appendChild(line);
        });
    }

    bottomBar.appendChild(textBox);

    requestAnimationFrame(() => autoShrinkTextToFit(textBox, 9));

    // === WRAP & RETURN ===
    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);
    return wrapper;
  } else if (cardData.type === "Henchman" || cardData.type === "Villain") {

    const isBoardRender = !!(
      container?.classList?.contains("card-wrapper")
    );

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.position = "relative";
    card.style.width = "230px";
    card.style.height = "350px";
    card.style.overflow = "hidden";
    card.style.borderRadius = "8px";
    card.style.border = "2px solid black";
    card.style.boxShadow = "2px 3px 8px rgba(0,0,0,0.3)";
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = "#000";

    // === BACKGROUND IMAGE ===
    const img = document.createElement("img");
    img.src = cardData.image;
    img.alt = cardData.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.objectPosition = "center";
    card.appendChild(img);

    // === TOP NAME STRIP ===
    const topStrip = document.createElement("div");
    topStrip.style.position = "absolute";
    topStrip.style.top = "0";
    topStrip.style.left = "0";
    topStrip.style.width = "100%";
    topStrip.style.height = "35px";
    topStrip.style.background = "rgba(0,0,0,0.55)";
    topStrip.style.color = "#d0d0d0";
    topStrip.style.display = "flex";
    topStrip.style.alignItems = "center";
    topStrip.style.justifyContent = "center";
    topStrip.style.fontSize = "18px";
    topStrip.style.fontWeight = "bold";
    topStrip.style.textShadow = "1px 1px 3px black";
    topStrip.style.whiteSpace = "nowrap";
    topStrip.style.overflow = "hidden";
    topStrip.textContent = cardData.name;
    card.appendChild(topStrip);

    requestAnimationFrame(() => shrinkToFitWidth(topStrip, 10));

    // === BOTTOM STRIP (same height as Scenario) ===
    const bottom = document.createElement("div");
    bottom.style.position = "absolute";
    bottom.style.bottom = "0";
    bottom.style.left = "0";
    bottom.style.width = "100%";
    bottom.style.height = "100px";
    bottom.style.background = "rgba(0,0,0,0.65)";
    bottom.style.color = "white";
    bottom.style.display = "flex";
    bottom.style.alignItems = "center";
    bottom.style.justifyContent = isBoardRender ? "space-evenly" : "space-between";
    bottom.style.padding = "8px 10px";
    card.appendChild(bottom);

    // ============================
    // LEFT SIDE DAMAGE (icon + number)
    // ============================
    const dmgContainer = document.createElement("div");
    dmgContainer.style.position = "relative";
    dmgContainer.style.width = isBoardRender ? "75px" : "45px";
    dmgContainer.style.height = isBoardRender ? "75px" : "45px";

    const dmgImg = document.createElement("img");
    dmgImg.src =
      "https://raw.githubusercontent.com/over-lords/overlords/a61d7fb50e273106d490476bd3c621f3a6f45047/Public/Images/Card%20Assets/Misc/Damage.png";
    dmgImg.alt = "Damage";
    dmgImg.style.position = "absolute";
    dmgImg.style.left = isBoardRender ? "-24px" : "-8px";
    dmgImg.style.width = isBoardRender ? "100%" : "85%";
    dmgImg.style.height = isBoardRender ? "100%" : "85%";
    dmgImg.style.objectFit = "contain";
    dmgContainer.appendChild(dmgImg);

    const dmgNum = document.createElement("div");
    dmgNum.textContent = cardData.damage ?? "0";
    dmgNum.style.position = "absolute";
    dmgNum.style.top = isBoardRender ? "53%" : "45%";
    dmgNum.style.left = isBoardRender ? "calc(50% - 24px)" : "calc(50% - 11px)";
    dmgNum.style.transform = "translate(-50%, -50%)";
    dmgNum.style.fontSize = isBoardRender ? "36px" : "20px";
    dmgNum.style.fontWeight = "bold";
    dmgNum.style.color = "white";
    dmgNum.style.textShadow = "2px 2px 4px black";
    dmgContainer.appendChild(dmgNum);

    bottom.appendChild(dmgContainer);

    if (!isBoardRender) {
      const textBox = document.createElement("div");
      textBox.style.flex = "1";
      textBox.style.margin = "0 5px 0 -14px";
      textBox.style.textAlign = "left";
      textBox.style.fontSize = "11.5px";
      textBox.style.lineHeight = "1.2em";
      textBox.style.overflow = "hidden";

      if (Array.isArray(cardData.abilitiesText)) {
          cardData.abilitiesText.forEach(a => {
              const line = document.createElement("div");
              line.innerHTML = renderAbilityText(a.text);
              textBox.appendChild(line);
          });
      }

      bottom.appendChild(textBox);
      requestAnimationFrame(() => autoShrinkTextToFit(textBox, 9));
    }

    // ============================
    // RIGHT SIDE HP (heart + number)
    // ============================
    const hpContainer = document.createElement("div");
    hpContainer.style.position = "relative";
    hpContainer.style.width = isBoardRender ? "75px" : "45px";
    hpContainer.style.height = isBoardRender ? "75px" : "45px";

    const heartImg = document.createElement("img");
    heartImg.src =
      "https://raw.githubusercontent.com/over-lords/overlords/d4d722dd9c416015b0aac29883ba241deea3f8d7/Public/Images/Card%20Assets/Misc/Heart.png";
    heartImg.alt = "HP";
    heartImg.style.position = "absolute";
    heartImg.style.left = isBoardRender ? "-6px" : "-8px";
    heartImg.style.marginTop = isBoardRender ? "4px" : "1px";
    heartImg.style.width = isBoardRender ? "100%" : "85%";
    heartImg.style.height = isBoardRender ? "100%" : "85%";
    heartImg.style.objectFit = "contain";
    hpContainer.appendChild(heartImg);

    const hpNum = document.createElement("div");
    hpNum.textContent = cardData.hp ?? "0";
    hpNum.style.position = "absolute";
    hpNum.style.top = isBoardRender ? "50%" : "41%";
    hpNum.style.left = isBoardRender ? "calc(50% - 7px)" : "calc(50% - 12px)";
    hpNum.style.transform = "translate(-50%, -50%)";
    hpNum.style.fontSize = isBoardRender ? "36px" : "20px";
    hpNum.style.fontWeight = "bold";
    hpNum.style.color = "white";
    hpNum.style.textShadow = "2px 2px 4px black";
    hpContainer.appendChild(hpNum);

    bottom.appendChild(hpContainer);

    // === WRAP & RETURN ===
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");
    wrapper.appendChild(card);
    return wrapper;
  } else if (cardData.type === "Overlord") {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.position = 'relative';
    card.style.width = '230px';
    card.style.height = '350px';
    card.style.overflow = 'hidden';
    card.style.borderRadius = '8px';
    card.style.border = '2px solid black';
    card.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.3)';
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = '#000';

    // === BACKGROUND IMAGE ===
    const img = document.createElement('img');
    img.src = cardData.image;
    img.alt = cardData.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
    card.appendChild(img);

    // === TOP NAME STRIP ===
    const nameStrip = document.createElement('div');
    nameStrip.style.position = 'absolute';
    nameStrip.style.top = '0';
    nameStrip.style.left = '0';
    nameStrip.style.width = '100%';
    nameStrip.style.height = '40px';
    nameStrip.style.background = 'rgba(0,0,0,0.55)';
    nameStrip.style.display = 'flex';
    nameStrip.style.alignItems = 'center';
    nameStrip.style.justifyContent = 'center';
    nameStrip.style.color = '#d0d0d0';
    nameStrip.style.fontSize = '20px';
    nameStrip.style.fontWeight = 'bold';
    nameStrip.style.textShadow = '1px 1px 3px black';
    nameStrip.style.whiteSpace = 'nowrap';
    nameStrip.style.overflow = 'hidden';
    nameStrip.textContent = cardData.name;
    card.appendChild(nameStrip);

    requestAnimationFrame(() => shrinkToFitWidth(nameStrip, 10));

    // === LEFT-SIDE LEVEL CIRCLE BELOW NAME ===
    const levelCircle = document.createElement('div');
    levelCircle.style.position = 'absolute';
    levelCircle.style.top = '45px';       // below the top bar
    levelCircle.style.left = '10px';
    levelCircle.style.width = '40px';
    levelCircle.style.height = '40px';
    levelCircle.style.borderRadius = '50%';
    levelCircle.style.background = 'rgba(0,0,0,0.8)';
    levelCircle.style.border = '2px solid white';
    levelCircle.style.display = 'flex';
    levelCircle.style.alignItems = 'center';
    levelCircle.style.justifyContent = 'center';
    levelCircle.style.color = 'white';
    levelCircle.style.fontWeight = 'bold';
    levelCircle.style.fontSize = '22px';
    levelCircle.style.textShadow = '1px 1px 3px black';
    levelCircle.textContent = cardData.level ?? "0";
    card.appendChild(levelCircle);

    // === BOTTOM ABILITIES STRIP (taller than Scenario) ===
    const bottom = document.createElement('div');
    bottom.style.position = 'absolute';
    bottom.style.bottom = '0';
    bottom.style.left = '0';
    bottom.style.width = '100%';
    bottom.style.height = '125px';
    bottom.style.background = 'rgba(0,0,0,0.65)';
    bottom.style.color = 'white';
    bottom.style.display = 'flex';
    bottom.style.alignItems = 'center';
    bottom.style.justifyContent = 'space-between';
    bottom.style.padding = '10px 12px';
    card.appendChild(bottom);

    // === ABILITIES TEXT (LEFT SIDE) ===
    const textBox = document.createElement('div');
    textBox.style.flex = '1';
    textBox.style.textAlign = 'left';
    textBox.style.fontSize = '10px';
    textBox.style.lineHeight = '1.15em';
    textBox.style.marginRight = '10px';
    textBox.style.overflow = 'hidden';

    if (Array.isArray(cardData.abilitiesText)) {
        cardData.abilitiesText.forEach(a => {
            const line = document.createElement('div');
            line.innerHTML = renderAbilityText(a.text);
            textBox.appendChild(line);
        });
    }

    bottom.appendChild(textBox);

    requestAnimationFrame(() => autoShrinkTextToFit(textBox, 9));

    // === HP WITH HEART ICON (RIGHT SIDE) ===
    const hpContainer = document.createElement('div');
    hpContainer.style.position = 'relative';
    hpContainer.style.width = '45px';
    hpContainer.style.height = '45px';
    hpContainer.style.flexShrink = '0';

    const hpImg = document.createElement('img');
    hpImg.src = "https://raw.githubusercontent.com/over-lords/overlords/d4d722dd9c416015b0aac29883ba241deea3f8d7/Public/Images/Card%20Assets/Misc/Heart.png";
    hpImg.style.position = 'absolute';
    hpImg.style.left = '-18px';
    hpImg.style.width = '100%';
    hpImg.style.height = '100%';
    hpImg.style.objectFit = 'contain';
    hpContainer.appendChild(hpImg);

    const hpNum = document.createElement('div');
    hpNum.textContent = cardData.hp ?? "0";
    hpNum.style.position = 'absolute';
    hpNum.style.top = '45%';
    hpNum.style.left = 'calc(50% - 18px)';
    hpNum.style.transform = 'translate(-50%, -50%)';
    hpNum.style.fontSize = '18px';    // ← smaller than scenario
    hpNum.style.fontWeight = 'bold';
    hpNum.style.color = 'white';
    hpNum.style.textShadow = '2px 2px 4px black';
    hpContainer.appendChild(hpNum);

    bottom.appendChild(hpContainer);

    // === WRAP & RETURN ===
    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);
    return wrapper;
  } else if (cardData.type === "Scenario") {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.position = 'relative';
    card.style.width = '230px';
    card.style.height = '350px';
    card.style.overflow = 'hidden';
    card.style.borderRadius = '8px';
    card.style.border = '2px solid black';
    card.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.3)';
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = '#000';

    // === BACKGROUND IMAGE ===
    const img = document.createElement('img');
    img.src = "https://raw.githubusercontent.com/over-lords/overlords/d4d722dd9c416015b0aac29883ba241deea3f8d7/Public/Images/Card%20Assets/Misc/Scenario.jpg";
    img.alt = cardData.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
    card.appendChild(img);

    // === TOP NAME STRIP ===
    const nameStrip = document.createElement('div');
    nameStrip.style.position = 'absolute';
    nameStrip.style.top = '0';
    nameStrip.style.left = '0';
    nameStrip.style.width = '100%';
    nameStrip.style.height = '32px';
    nameStrip.style.background = 'rgba(0,0,0,0.55)';
    nameStrip.style.display = 'flex';
    nameStrip.style.justifyContent = 'center';
    nameStrip.style.alignItems = 'center';
    nameStrip.style.color = '#d0d0d0';
    nameStrip.style.fontSize = '20px';
    nameStrip.style.fontWeight = 'bold';
    nameStrip.style.textShadow = '1px 1px 3px black';
    nameStrip.style.overflow = 'hidden';
    nameStrip.style.whiteSpace = 'nowrap';
    nameStrip.textContent = cardData.name;
    card.appendChild(nameStrip);

    requestAnimationFrame(() => {
        shrinkToFitWidth(nameStrip, 10);
    });

    // === BOTTOM STRIP ===
    const bottom = document.createElement('div');
    bottom.style.position = 'absolute';
    bottom.style.bottom = '0';
    bottom.style.left = '0';
    bottom.style.width = '100%';
    bottom.style.height = '100px';
    bottom.style.background = 'rgba(0,0,0,0.65)';
    bottom.style.color = 'white';
    bottom.style.display = 'flex';
    bottom.style.justifyContent = 'space-between';
    bottom.style.alignItems = 'center';
    bottom.style.padding = '8px 10px';
    card.appendChild(bottom);

    // === ABILITY TEXT (LEFT) ===
    const textBox = document.createElement('div');
    textBox.style.flex = '1';
    textBox.style.fontSize = '13px';
    textBox.style.lineHeight = '1.2em';
    textBox.style.textAlign = 'left';
    textBox.style.marginRight = '10px';
    textBox.style.overflow = 'hidden';

    if (Array.isArray(cardData.abilitiesText)) {
        cardData.abilitiesText.forEach(a => {
            const line = document.createElement('div');
            line.innerHTML = renderAbilityText(a.text);
            textBox.appendChild(line);
        });
    }

    bottom.appendChild(textBox);

    requestAnimationFrame(() => autoShrinkTextToFit(textBox, 9));

    // === HP ON HEART ICON (RIGHT) ===
    const hpContainer = document.createElement('div');
    hpContainer.style.position = 'relative';
    hpContainer.style.width = '60px';
    hpContainer.style.height = '60px';
    hpContainer.style.flexShrink = '0';

    const heartImg = document.createElement('img');
    heartImg.src = "https://raw.githubusercontent.com/over-lords/overlords/d4d722dd9c416015b0aac29883ba241deea3f8d7/Public/Images/Card%20Assets/Misc/Heart.png";
    heartImg.alt = "HP";
    heartImg.style.position = 'absolute';
    heartImg.style.left = '-8px';
    heartImg.style.width = '80%';
    heartImg.style.height = '80%';
    heartImg.style.objectFit = 'contain';
    hpContainer.appendChild(heartImg);

    const hpNum = document.createElement('div');
    hpNum.textContent = cardData.hp || "0";
    hpNum.style.position = 'absolute';
    hpNum.style.top = '37%';
    hpNum.style.left = 'calc(50% - 13px)';
    hpNum.style.transform = 'translate(-50%, -50%)';
    hpNum.style.fontSize = '21px';
    hpNum.style.fontWeight = 'bold';
    hpNum.style.color = 'white';
    hpNum.style.textShadow = '2px 2px 4px black';
    hpContainer.appendChild(hpNum);

    bottom.appendChild(hpContainer);

    // Wrap & return
    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);
    return wrapper;
  } else if (cardData.type === "Bystander") {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.position = 'relative';
    card.style.width = '230px';
    card.style.height = '350px';
    card.style.overflow = 'hidden';
    card.style.borderRadius = '8px';
    card.style.border = '2px solid black';
    card.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.3)';
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = '#000';

    // === FULL BACKGROUND IMAGE (like Main cards) ===
    const img = document.createElement('img');
    img.src = cardData.image;
    img.alt = cardData.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
    card.appendChild(img);

    // === TOP NAME STRIP ===
    const topStrip = document.createElement('div');
    topStrip.style.position = 'absolute';
    topStrip.style.top = '0';
    topStrip.style.left = '0';
    topStrip.style.width = '100%';
    topStrip.style.height = '40px';
    topStrip.style.background = 'rgba(0,0,0,0.55)';
    topStrip.style.display = 'flex';
    topStrip.style.alignItems = 'center';
    topStrip.style.justifyContent = 'center';
    topStrip.style.color = '#d0d0d0';
    topStrip.style.fontSize = '18px';
    topStrip.style.fontWeight = 'bold';
    topStrip.style.textShadow = '1px 1px 3px black';
    topStrip.style.whiteSpace = 'nowrap';
    topStrip.style.overflow = 'hidden';
    topStrip.textContent = cardData.name;
    card.appendChild(topStrip);

    requestAnimationFrame(() => shrinkToFitWidth(topStrip, 10));

    // === BOTTOM ABILITIES STRIP ===
    const bottom = document.createElement('div');
    bottom.style.position = 'absolute';
    bottom.style.bottom = '0';
    bottom.style.left = '0';
    bottom.style.width = '100%';
    bottom.style.height = '100px';
    bottom.style.background = 'rgba(0,0,0,0.65)';
    bottom.style.color = 'white';
    bottom.style.display = 'flex';
    bottom.style.alignItems = 'center';
    bottom.style.justifyContent = 'center';
    bottom.style.padding = '6px';
    bottom.style.textAlign = 'center';
    bottom.style.overflow = 'hidden';
    card.appendChild(bottom);

    const textBox = document.createElement('div');
    textBox.style.width = '100%';
    textBox.style.fontSize = '14px';
    textBox.style.lineHeight = '1.2em';
    textBox.style.textAlign = 'center';
    textBox.style.overflow = 'hidden';

    if (Array.isArray(cardData.abilitiesText)) {
        cardData.abilitiesText.forEach(a => {
            const line = document.createElement('div');
            line.innerHTML = renderAbilityText(a.text);
            textBox.appendChild(line);
        });
    }

    bottom.appendChild(textBox);

    requestAnimationFrame(() => autoShrinkTextToFit(textBox, 9));

    // === RETURN WRAPPER ===
    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);
    return wrapper;
  } else if (cardData.type === "Countdown") {
    // Ensure valid range 1–6
    const num = Math.max(1, Math.min(6, parseInt(cardData.number)));

    // Base card
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.position = 'relative';
    card.style.width = '230px';   // 2.3w ratio
    card.style.height = '350px';  // 3.5h ratio
    card.style.overflow = 'hidden';
    card.style.borderRadius = '8px';
    card.style.border = '2px solid black';
    card.style.boxShadow = '2px 3px 8px rgba(0,0,0,0.3)';
    card.style.fontFamily = "'Racing Sans One', sans-serif";
    card.style.backgroundColor = '#000';

    // Large centered number
    const numEl = document.createElement('div');
    numEl.textContent = num;
    numEl.style.position = 'absolute';
    numEl.style.top = '50%';
    numEl.style.left = '50%';
    numEl.style.transform = 'translate(-50%, -50%)';

    // big red number, padded 10% from card edges
    numEl.style.width = '90%';
    numEl.style.height = '90%';

    numEl.style.display = 'flex';
    numEl.style.alignItems = 'center';
    numEl.style.justifyContent = 'center';

    numEl.style.color = 'red';
    numEl.style.textShadow = '4px 4px 8px black';
    numEl.style.fontWeight = 'bold';

    // giant font (scaled using viewport of its container)
    numEl.style.fontSize = '16rem';

    card.appendChild(numEl);

    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);

    if (container) container.appendChild(wrapper);
    return wrapper;
  }

  // If card not found, display card type name
    const placeholder = document.createElement("div");
    placeholder.style.width = "230px";
    placeholder.style.height = "350px";
    placeholder.style.background = "white";
    placeholder.style.display = "flex";
    placeholder.style.alignItems = "center";
    placeholder.style.justifyContent = "center";
    placeholder.style.border = "2px solid black";
    placeholder.style.borderRadius = "8px";
    placeholder.textContent = `TODO: ${cardData.type}`;

    return placeholder;
}

// === Helper: render ability text with inline icons ===
export function renderAbilityText(text) {
  const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/d4d722dd9c416015b0aac29883ba241deea3f8d7/Public/Images/Card%20Assets";

  // Define simple replacements: [ICON:Name] → <img src=".../Name.png">
  const iconMap = {
    Bat: `${cardArtFolder}/Misc/Bat.png`,
    Wonder: `${cardArtFolder}/Misc/Wonder.png`,
    Super: `${cardArtFolder}/Misc/Super.png`,
    Justice: `${cardArtFolder}/Misc/Justice.png`,
    Lantern: `${cardArtFolder}/Misc/Green Lantern.png`,
    Flash: `${cardArtFolder}/Misc/Flash.png`,
    Titans: `${cardArtFolder}/Misc/Titans.png`,
    Arrow: `${cardArtFolder}/Misc/Arrow.png`,
    Aqua: `${cardArtFolder}/Misc/Aqua.png`,
    Dark: `${cardArtFolder}/Misc/Dark.png`,
    Hawk: `${cardArtFolder}/Misc/Hawk.png`,
    Legion: `${cardArtFolder}/Misc/Legion.png`,
    Martian: `${cardArtFolder}/Misc/Martian.png`,
    Rogues: `${cardArtFolder}/Misc/Rogues.png`,
    Shazam: `${cardArtFolder}/Misc/Shazam.png`,
    Squad: `${cardArtFolder}/Misc/Squad.png`,
  };

  let html = text;

  // Replace placeholders with actual inline <img> tags
  Object.entries(iconMap).forEach(([key, url]) => {
    const pattern = new RegExp(`\\[ICON:${key}\\]`, "g");
    html = html.replace(
      pattern,
      `<img src="${url}" alt="${key}" style="width:18px; height:18px; vertical-align:middle; margin:0 2px;">`
    );
  });

  // Optional: convert \n to visual spacing if you already use that
  html = html.replace(/\n/g, '<span class="line-gap"></span>');

  return html;
}

function autoShrinkTextToFit(element, minSize = 8) {
  // Guard: skip if no parent
  if (!element || !element.parentElement) return;

  // Get parent height limit
  const parent = element.parentElement;
  const parentHeight = parent.clientHeight;

  // Start with the current computed font size
  const style = window.getComputedStyle(element);
  let fontSize = parseFloat(style.fontSize);

  // Reduce until it fits or hits minimum size
  while (element.scrollHeight > parentHeight && fontSize > minSize) {
    fontSize -= 1;
    element.style.fontSize = fontSize + 'px';
  }
}

function shrinkToFitWidth(el, minSize = 10) {
    let size = parseFloat(window.getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth && size > minSize) {
        size -= 1;
        el.style.fontSize = size + "px";
    }
}

function shrinkTextToFitHeight(el, maxHeight, minSize) {
    let size = parseFloat(window.getComputedStyle(el).fontSize);
    while (el.scrollHeight > maxHeight && size > minSize) {
        size -= 1;
        el.style.fontSize = size + "px";
    }
}

function shrinkTextToFitWidth(element, minFontSize = 8) {
  if (!element) return;

  // Ensure the element is measured properly
  element.style.whiteSpace = 'nowrap';
  element.style.display = 'inline-block';

  // Store original font size if not stored
  if (!element.dataset.originalFontSize) {
    const computed = window.getComputedStyle(element);
    element.dataset.originalFontSize = parseFloat(computed.fontSize);
  }

  let fontSize = parseFloat(element.dataset.originalFontSize);

  // Reset font size in case it was shrunk before
  element.style.fontSize = fontSize + 'px';

  const parentWidth = element.parentElement.clientWidth;

  // Only shrink if it actually overflows
  if (element.scrollWidth <= parentWidth) return;

  while (element.scrollWidth > parentWidth && fontSize > minFontSize) {
    fontSize -= 1;
    element.style.fontSize = fontSize + 'px';
  }
}

export function getTeamIcon(teamName) {
  const cardArtFolder =
    "https://raw.githubusercontent.com/over-lords/overlords/d4d722dd9c416015b0aac29883ba241deea3f8d7/Public/Images/Card%20Assets/Misc";

  const map = {
    Bat: `${cardArtFolder}/Bat.png`,
    Wonder: `${cardArtFolder}/Wonder.png`,
    Super: `${cardArtFolder}/Super.png`,
    Justice: `${cardArtFolder}/Justice.png`,
    Lantern: `${cardArtFolder}/Green Lantern.png`,
    Flash: `${cardArtFolder}/Flash.png`,
    Titans: `${cardArtFolder}/Titans.png`,
    Arrow: `${cardArtFolder}/Arrow.png`,
    Aqua: `${cardArtFolder}/Aqua.png`,
    Dark: `${cardArtFolder}/Dark.png`,
    Hawk: `${cardArtFolder}/Hawk.png`,
    Legion: `${cardArtFolder}/Legion.png`,
    Martian: `${cardArtFolder}/Martian.png`,
    Rogues: `${cardArtFolder}/Rogues.png`,
    Shazam: `${cardArtFolder}/Shazam.png`,
    Squad: `${cardArtFolder}/Squad.png`,
  };

  return map[teamName] || null;
}