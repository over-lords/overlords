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

function findCardInAllSources(id) {
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
    const card = src.find(c => c.id === id);
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
    bottomStrip.style.height = '110px';
    bottomStrip.style.background = 'rgba(0,0,0,0.65)';
    bottomStrip.style.color = 'white';
    bottomStrip.style.display = 'grid';
    bottomStrip.style.gridTemplateColumns = '1fr 4fr 1fr'; // left - center (wide) - right
    bottomStrip.style.gridTemplateRows = '1fr 1fr'; // two rows
    bottomStrip.style.boxSizing = 'border-box';
    bottomStrip.style.padding = '4px 6px';
    card.appendChild(bottomStrip);

    // LEFT COLUMN (2 rows)
    const leftTop = document.createElement('div');
    const leftBottom = document.createElement('div');

    // CENTER COLUMN (1 tall row spanning both)
    const center = document.createElement('div');
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

    leftBottom.appendChild(
      statBlock(`${assets}/Heart.png`, cardData.hp, {
        iconSize: 32,
        iconMargin: "0px 0 0 0px",
        textMargin: "-5px 0 0 -26px",
        className: "heartBlock"
      })
    );

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

    // center abilities (tall middle area)
    const abilityBox = document.createElement('div');
    abilityBox.style.width = '100%';
    abilityBox.style.fontSize = '10px';
    abilityBox.style.lineHeight = '1.1em';
    abilityBox.style.textAlign = 'center';

    if (Array.isArray(cardData.abilitiesText)) {
      cardData.abilitiesText.forEach(a => {
        const line = document.createElement('div');
        line.innerHTML = renderAbilityText(a.text);
        abilityBox.appendChild(line);
      });
    }

    center.appendChild(abilityBox);

    // place in grid
    bottomStrip.appendChild(leftTop);
    bottomStrip.appendChild(center);
    bottomStrip.appendChild(rightTop);
    bottomStrip.appendChild(leftBottom);
    bottomStrip.appendChild(rightBottom);

    const wrapper = document.createElement('div');
    wrapper.classList.add('card-wrapper');
    wrapper.appendChild(card);
    return wrapper;
  }
}

// === Helper: render ability text with inline icons ===
export function renderAbilityText(text) {
  const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/a61d7fb50e273106d490476bd3c621f3a6f45047/Public/Images/Card%20Assets";

  // Define simple replacements: [ICON:Name] → <img src=".../Name.png">
  const iconMap = {
    Bat: `${cardArtFolder}/Misc/Bat.png`,
    Wonder: `${cardArtFolder}/Misc/Wonder.png`,
    Super: `${cardArtFolder}/Misc/Super.png`,
    Justice: `${cardArtFolder}/Misc/Justice League.png`,
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
    "https://raw.githubusercontent.com/over-lords/overlords/a61d7fb50e273106d490476bd3c621f3a6f45047/Public/Images/Card%20Assets/Misc";

  const map = {
    Bat: `${cardArtFolder}/Bat.png`,
    Wonder: `${cardArtFolder}/Wonder.png`,
    Super: `${cardArtFolder}/Super.png`,
    Justice: `${cardArtFolder}/Justice League.png`,
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