const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/cebac8837b04b1d16a5bbd9e2864d0acf77ca10f/Public/Images/Card%20Assets";

export const heroCards = [
  {
    id: "0",
    type: "Main",
    name: "Sidekick",
    image: `${cardArtFolder}/Misc/Sidekick.jpg`,
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 2`
      }
    ],
    abilitiesEffects: [
      {
        effect: `draw(2)`
      }
    ]
  },
  {
    id: "1",
    type: "Main",
    name: "World of Cardboard",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/World Made of Cardboard.jpg`,
    perDeck: "1",
    damage: "5",
    abilitiesText: [
      {
        text: `Increase this card's Damage by 1 for every KO'd Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Boost card damage`
      }
    ],
    abilitiesEffects: [
      {
        effect: `boostCardDamage(findKOdHeroes)`
      }
    ]
  },
  {
    id: "2",
    type: "Main",
    name: "Super Flare",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Super Flare.jpg`,
    perDeck: "2",
    damage: "4",
    abilitiesText: [
      {
        text: `CHOOSE: This card deals 8 Damage and Superman cannot deal Damage on his next turn. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw a card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "3",
    type: "Main",
    name: "Man of Steel",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Man of Steel.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `CHOOSE: This card deals no Damage. Superman takes any one engaged Henchman or Villain's Damage, ignoring his Damage Threshold, then KO's them. <span class="line-gap"></span> OR <span class="line-gap"></span> After using this card, Superman can Travel an additional time this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "4",
    type: "Main",
    name: "Against All Odds",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Against All Odds.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `Increase this card's Damage by 3 if Superman is at, or below, 5 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "5",
    type: "Main",
    name: "Trinity",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Trinity.jpg`,
    perDeck: "1",
    damage: "2",
    abilitiesText: [
      {
        text: `[ICON:Bat] : Draw 2 cards. <span class="line-gap"></span> [ICON:Wonder] : Increase this card’s Damage by 2. <span class="line-gap"></span> [ICON:Bat] + [ICON:Wonder] : You may draw from the Enemies and Allies Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "6",
    type: "Main",
    name: "Heat Vision",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Heat Vision.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `This card can be used against a Henchman or Villain in an adjacent city.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "7",
    type: "Main",
    name: "Head of the Family",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Family.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Gain a Sidekick. <span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span> [ICON:Super]: Draw a card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "8",
    type: "Main",
    name: "Freeze Breath",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Freeze Breath.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `A Henchman or Villain Damaged by this card cannot move until the end of Superman’s next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "9",
    type: "Main",
    name: "Beacon of Hope",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Beacon.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `All other active Heroes draw a card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "10",
    type: "Main",
    name: "Damsel in Distress",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Damsel in Distress.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `CHOOSE: Rescue a Bystander. <span class="line-gap"></span> OR <span class="line-gap"></span> KO a Henchman or Villain that has a captured Bystander.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "11",
    type: "Main",
    name: "Faster than a Speeding Bullet",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Faster.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2 cards.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "441",
    type: "Main",
    name: "Goddess of War",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman a.jpg`,
    perDeck: "1",
    damage: "5",
    abilitiesText: [
      {
        text: `CHOOSE: Deal 3 Damage to the Overlord. <span class="line-gap"></span> OR <span class="line-gap"></span> KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "442",
    type: "Main",
    name: "Daughter of Zeus",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman i.jpg`,
    perDeck: "2",
    damage: "4",
    abilitiesText: [
      {
        text: `After taking this card's Damage, Henchmen and Villains are shoved as far right as possible. <span class="line-gap"></span> CHOOSE: Wonder Woman can follow them. <span class="line-gap"></span> OR <span class="line-gap"></span> Retreat to Headquarters.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "443",
    type: "Main",
    name: "Monster Slayer",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman d.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `At the end of Wonder Woman's turn, if she takes Damage from a Villain, they take 2 Damage in return.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "444",
    type: "Main",
    name: "To the End and Back",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman G.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `Increase this card's Damage by 1 for every time Wonder Woman has Traveled this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "445",
    type: "Main",
    name: "Relentless",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman f.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Increase this card's Damage by 1 for every 2 HP Wonder Woman has lost.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "446",
    type: "Main",
    name: "Lasso of Truth",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman b.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `A Henchman or Villain Damaged by this card cannot move until the end of Wonder Woman's next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "447",
    type: "Main",
    name: "Princess of the Amazons",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman c.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `CHOOSE: Increase this card's Damage by 1 for every active [ICON:Wonder] Hero. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw a card for every KO'd [ICON:Wonder] Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "448",
    type: "Main",
    name: "Immortal",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman h.jpg`,
    perDeck: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `If Wonder Woman is at 5 or less HP, deal 5 damage to the Overlord. <span class="line-gap"></span> Otherwise, draw a card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "449",
    type: "Main",
    name: "Battle Armor",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman k.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `Reduce Wonder Woman's engaged Henchman or Villain's Damage by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "450",
    type: "Main",
    name: "Bracelets of Submission",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman e.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2 cards. <span class="line-gap"></span> Wonder Woman can Retreat without taking Damage this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "451",
    type: "Main",
    name: "Agent of Freedom",
    hero: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman/Wonder Woman j.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `CHOOSE: Draw a card. <span class="line-gap"></span> OR <span class="line-gap"></span> Rescue all captured Bystanders.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "861",
    type: "Main",
    name: "I Am Batman",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/I Am Batman.jpg`,
    perDeck: "1",
    damage: "5",
    abilitiesText: [
      {
        text: `Draw 2 cards. <span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span> OPTIONAL: Discard X Cards.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "862",
    type: "Main",
    name: "I Am The Night",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/I Am The Night.jpg`,
    perDeck: "2",
    damage: "4",
    abilitiesText: [
      {
        text: `After using this card, Batman can Travel an additional time this turn, but only to Gotham. <span class="line-gap"></span> If Discarded: KO a Henchman or Villain in Gotham.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "863",
    type: "Main",
    name: "I Am Vengeance",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/I Am Vengeance.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `Increase this card's Damage by 1 for every KO'd Hero. <span class="line-gap"></span> If Discarded: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "864",
    type: "Main",
    name: "Caped Crusader",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Caped Crusader.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Draw 2 cards, then discard a card. <span class="line-gap"></span><span class="line-gap"></span> If Discarded: Deal 2 damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "865",
    type: "Main",
    name: "Just Getting Started",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Just Getting Started.jpg`,
    perDeck: "1",
    damage: "2",
    abilitiesText: [
      {
        text: `OPTIONAL: Discard 1 and Batman regains 2 HP. <span class="line-gap"></span> If Discarded: Draw 2.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "866",
    type: "Main",
    name: "Legacy",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Legacy.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `CHOOSE: Increase this card's Damage by 1 for every active [ICON:Bat] Hero. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw a card for every active [ICON:Bat] Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "867",
    type: "Main",
    name: "Master of Fear",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Master of Fear.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `A Henchman or Villain Damaged by this card cannot move until the end of Batman's next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "868",
    type: "Main",
    name: "The Most Dangerous Man in the World",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Most Dangerous Man.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2 cards. <span class="line-gap"></span> OPTIONAL: Discard X Cards. <span class="line-gap"></span> Increase this card's Damage by 1 for every card Batman discarded this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "869",
    type: "Main",
    name: "Secret Weapon",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Secret Weapon.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `You may draw from the Enemies and Allies Pile. <span class="line-gap"></span> If Discarded: Look at the top 3 cards of the Enemies and Allies Pile. Activate or KO your choice of the revealed cards.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "870",
    type: "Main",
    name: "Partners in...?",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Partners In.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw a card. <span class="line-gap"></span><span class="line-gap"></span> Reveal the top card of the Villain Deck. You may KO it.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "871",
    type: "Main",
    name: "Dynamic Duo",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Dynamic Duo.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw a card and gain a Sidekick. <span class="line-gap"></span><span class="line-gap"></span> Increase this card's Damage by 1 for every active [ICON:Bat] and [ICON:Justice] Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "872",
    type: "Main",
    name: "Gotham Defender",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Gotham Defender.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2 cards, then discard a card. <span class="line-gap"></span><span class="line-gap"></span> OPTIONAL: Deal 2 Damage to a Henchman or Villain in Gotham.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
  {
    id: "873",
    type: "Main",
    name: "Alone No Longer",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/No Longer Alone.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Select 1 other active Teammate; they take an additional turn after yours. The Villain Deck is not drawn from on this turn. <span class="line-gap"></span> If Batman has no active Teammates: Draw 2 cards.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `B`
      }
    ],
    abilitiesEffects: [
      {
        effect: `b`
      }
    ]
  },
]

// Starting ID for a deck: startID=(deckNumber−1)×cardsPerDeck+1