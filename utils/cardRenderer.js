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

export function renderCard(cardId, container) {
  const cardData = (heroCards || heroCards).find(c => c.id === cardId);
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
      dmgImg.src = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Misc/Damage.png";
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
  }
}

// === Helper: render ability text with inline icons ===
export function renderAbilityText(text) {
  const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets";

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