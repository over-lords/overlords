// ./utils/cardRenderer.js
import { heroCards } from '../data/heroCards.js';

export function renderCard(cardId) {
  const cardData = heroCards.find(c => c.id === cardId);
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
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.alignItems = 'center';
  card.style.border = '2px solid black';
  card.style.borderRadius = '12px';
  card.style.padding = '10px';
  card.style.width = '220px';
  card.style.backgroundColor = 'white';
  card.style.boxShadow = '2px 3px 8px rgba(0, 0, 0, 0.2)';
  card.style.fontFamily = "'Racing Sans One', sans-serif";

  // Image
  const img = document.createElement('img');
  img.src = cardData.image;
  img.alt = cardData.name;
  img.style.width = '100%';
  img.style.borderRadius = '8px';
  img.style.marginBottom = '8px';
  card.appendChild(img);

  // Card name
  const name = document.createElement('div');
  name.textContent = cardData.name;
  name.style.fontSize = '18px';
  name.style.fontWeight = 'bold';
  name.style.textAlign = 'center';
  name.style.marginBottom = '6px';
  card.appendChild(name);

  // Damage
  if (cardData.damage) {
    const dmg = document.createElement('div');
    dmg.textContent = `Damage: ${cardData.damage}`;
    dmg.style.fontSize = '14px';
    dmg.style.color = '#b00000';
    dmg.style.marginBottom = '6px';
    card.appendChild(dmg);
  }

  // Abilities text
  if (cardData.abilitiesText && Array.isArray(cardData.abilitiesText)) {
    cardData.abilitiesText.forEach(a => {
      const line = document.createElement('div');
      line.textContent = a.text;
      line.style.fontSize = '13px';
      line.style.textAlign = 'center';
      line.style.marginBottom = '3px';
      card.appendChild(line);
    });
  }

  return card;
}
