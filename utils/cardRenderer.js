// ./utils/cardRenderer.js
import { heroCards } from '../data/heroCards.js';

export function renderCard(cardId) {
  const cardData = (heroCards || heroCards).find(c => c.id === cardId);
  if (!cardData) {
    const missing = document.createElement('div');
    missing.textContent = `Card not found: ${cardId}`;
    missing.style.color = 'red';
    missing.style.fontWeight = 'bold';
    return missing;
  }

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
    card.appendChild(heroName);
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

    // Replace \n or desired newline markers with <span class="line-gap"></span>
    const htmlWithGaps = a.text.replace(/\n/g, '<span class="line-gap"></span>');

    line.innerHTML = htmlWithGaps; // Use innerHTML to render the span
    textBox.appendChild(line);
  });
}

  bottomOverlay.appendChild(textBox);

  // Damage section (right side)
  if (cardData.damage) {
    const dmgContainer = document.createElement('div');
    dmgContainer.style.position = 'relative';
    dmgContainer.style.width = '60px';
    dmgContainer.style.height = '60px';
    dmgContainer.style.flexShrink = '0';

    const dmgImg = document.createElement('img');
    dmgImg.src = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Misc/Damage.png";
    dmgImg.alt = 'Damage';
    dmgImg.style.width = '100%';
    dmgImg.style.height = '100%';
    dmgImg.style.objectFit = 'contain';
    dmgContainer.appendChild(dmgImg);

    const dmgNum = document.createElement('div');
    dmgNum.textContent = cardData.damage;
    dmgNum.style.position = 'absolute';
    dmgNum.style.top = '50%';
    dmgNum.style.left = '50%';
    dmgNum.style.transform = 'translate(-50%, -50%)';
    dmgNum.style.fontSize = '22px';
    dmgNum.style.fontWeight = 'bold';
    dmgNum.style.color = 'white';
    dmgNum.style.textShadow = '2px 2px 4px black';
    dmgContainer.appendChild(dmgNum);

    bottomOverlay.appendChild(dmgContainer);
  }

  return card;
}