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
    const nameStrip = document.createElement('div');
    nameStrip.style.position = 'absolute';
    nameStrip.style.top = '0';
    nameStrip.style.left = '0';
    nameStrip.style.width = '100%';
    nameStrip.style.background = 'rgba(0,0,0,0.55)';
    nameStrip.style.borderBottom = '1px solid lightgray';
    nameStrip.style.textAlign = 'center';
    nameStrip.style.padding = '6px 0 2px 0';
    card.appendChild(nameStrip);

    const nameEl = document.createElement('div');
    nameEl.textContent = cardData.name;
    nameEl.style.fontWeight = 'bold';
    nameEl.style.fontSize = '18px';
    nameEl.style.color = cardData.color || 'white';
    nameEl.style.textShadow = '1px 1px 3px black';
    nameStrip.appendChild(nameEl);

    requestAnimationFrame(() => shrinkTextToFitWidth(nameEl, 10));

    // === TEAM ICON ROW ===
    const teamRow = document.createElement('div');
    teamRow.style.display = 'flex';
    teamRow.style.justifyContent = 'center';
    teamRow.style.gap = '6px';
    teamRow.style.marginTop = '2px';
    nameStrip.appendChild(teamRow);

    if (Array.isArray(cardData.teams)) {
      cardData.teams.forEach(team => {
        const iconSrc = getTeamIcon(team);
        if (iconSrc) {
          const icon = document.createElement('img');
          icon.src = iconSrc;
          icon.alt = team;
          icon.style.width = '26px';
          icon.style.height = '26px';
          icon.style.objectFit = 'contain';
          teamRow.appendChild(icon);
        }
      });
    }

    // === BOTTOM STRIP (HP, Threshold, Travel, Retreat, Abilities) ===
    const bottomStrip = document.createElement('div');
    bottomStrip.style.position = 'absolute';
    bottomStrip.style.bottom = '0';
    bottomStrip.style.left = '0';
    bottomStrip.style.width = '100%';
    bottomStrip.style.height = '110px';
    bottomStrip.style.background = 'rgba(0,0,0,0.65)';
    bottomStrip.style.color = 'white';
    bottomStrip.style.display = 'flex';
    bottomStrip.style.flexDirection = 'column';
    bottomStrip.style.alignItems = 'center';
    bottomStrip.style.justifyContent = 'flex-start';
    bottomStrip.style.paddingTop = '4px';
    bottomStrip.style.boxSizing = 'border-box';
    card.appendChild(bottomStrip);

    // === STATS GRID (Shield / Heart / Travel / Retreat) ===
    const statGrid = document.createElement('div');
    statGrid.style.width = '100%';
    statGrid.style.display = 'grid';
    statGrid.style.gridTemplateColumns = '1fr 1fr';
    statGrid.style.gridTemplateRows = '1fr 1fr';
    statGrid.style.padding = '0 8px';
    statGrid.style.boxSizing = 'border-box';
    bottomStrip.appendChild(statGrid);

    // Helper to build a stat block
    function statBlock(imgSrc, valueText) {
      const box = document.createElement('div');
      box.style.position = 'relative';
      box.style.display = 'flex';
      box.style.alignItems = 'center';
      box.style.justifyContent = 'flex-start';
      box.style.gap = '2px';
      box.style.fontSize = '16px';
      box.style.fontWeight = 'bold';
      box.style.textShadow = '2px 2px 3px black';

      const icon = document.createElement('img');
      icon.src = imgSrc;
      icon.style.width = '30px';
      icon.style.height = '30px';
      icon.style.objectFit = 'contain';

      const num = document.createElement('div');
      num.textContent = valueText;
      num.style.marginLeft = '-24px';
      num.style.color = 'white';

      box.appendChild(icon);
      box.appendChild(num);
      return box;
    }

    const assets = "https://raw.githubusercontent.com/over-lords/overlords/main/Public/Images/Card%20Assets/Misc";

    statGrid.appendChild(statBlock(`${assets}/Shield.png`, cardData.damageThreshold));
    statGrid.appendChild(statBlock(`${assets}/Travel.png`, cardData.travel));
    statGrid.appendChild(statBlock(`${assets}/Heart.png`, cardData.hp));
    statGrid.appendChild(statBlock(`${assets}/Retreat.png`, cardData.retreat));

    // === ABILITIES TEXT CENTERED ===
    const abilityBox = document.createElement('div');
    abilityBox.style.width = '96%';
    abilityBox.style.fontSize = '12px';
    abilityBox.style.lineHeight = '1.1em';
    abilityBox.style.textAlign = 'center';
    abilityBox.style.marginTop = '2px';

    if (Array.isArray(cardData.abilitiesText)) {
      cardData.abilitiesText.forEach(a => {
        const line = document.createElement('div');
        line.innerHTML = renderAbilityText(a.text);
        abilityBox.appendChild(line);
      });
    }

    bottomStrip.appendChild(abilityBox);

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