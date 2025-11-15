const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/f8dae46835c412a717cf9c82b648d9ff51235d72/Public/Images/Card%20Assets";

// ids 0 + 201-4200
// Starting ID for a deck: startID=(deckNumber−1)×cardsPerDeck+201

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
    id: "201",
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
    id: "202",
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
    id: "203",
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
    id: "204",
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
    id: "205",
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
    id: "206",
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
    id: "207",
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
    id: "208",
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
    id: "209",
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
    id: "210",
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
    id: "211",
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
    id: "221",
    type: "Main",
    name: "Green Lantern's Light",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Light.jpg`,
    perDeck: "1",
    damage: "5",
    abilitiesText: [
      {
        text: `All other Henchmen and Villains take 2 Damage.`
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
    id: "222",
    type: "Main",
    name: "Beware My Power",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern No Evil Shall Escape My Sight.jpg`,
    perDeck: "2",
    damage: "4",
    abilitiesText: [
      {
        text: `Don't draw from the Villain Deck next turn.`
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
    id: "223",
    type: "Main",
    name: "Let Those Who Worship Evil's Might",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Let Those Who Worship Evils Might.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `You must draw from the Enemies and Allies Pile. <span class="line-gap"></span> If Discarded: Deal 3 Damage to the Overlord.`
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
    id: "224",
    type: "Main",
    name: "No Evil Shall Escape My Sight",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Beware My Power.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `A Henchman or Villain Damaged by this card cannot move until the end of Green Lantern's next turn.`
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
    id: "225",
    type: "Main",
    name: "In Blackest Night",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern In Blackest Night.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Draw 2 cards, then Discard 1.`
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
    id: "226",
    type: "Main",
    name: "In Brightest Day",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern In Brightest Day.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Draw a card. <span class="line-gap"></span> You may also draw from the Enemies and Allies Pile.`
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
    id: "227",
    type: "Main",
    name: "Founding Member",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Founding Member.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Increase this card's Damage by 1 for every active [ICON:Justice] Hero.`
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
    id: "228",
    type: "Main",
    name: "Unwavering Will",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Strong Will.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `Increase Green Lantern's Damage Threshold by 1 until the end of this turn.`
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
    id: "229",
    type: "Main",
    name: "Barrage",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Barrage.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Deal 1 Damage to up to 3 Henchmen or Villains.`
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
    id: "230",
    type: "Main",
    name: "Space Cop",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Space Cop.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Lock a Henchman or Villain in their City and reduce their Damage to 0 until the start of Green Lantern's next turn.`
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
    id: "231",
    type: "Main",
    name: "Leader of the Corps",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Leader of the Corps.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Gain a Sidekick. <span class="line-gap"></span> [ICON:Lantern]: Increase this card's Damage by 1.`
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
    id: "641",
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
    id: "642",
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
    id: "643",
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
    id: "644",
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
    id: "645",
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
    id: "646",
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
    id: "647",
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
    id: "648",
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
    id: "649",
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
    id: "650",
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
    id: "651",
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
    id: "661",
    type: "Main",
    name: "Infinite Mass Punch",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Infinite Mass Punch.jpg`,
    perDeck: "1",
    damage: "4",
    abilitiesText: [
      {
        text: `If Flash has traveled this turn, this card's Damage gains another +1.`
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
    id: "662",
    type: "Main",
    name: "Speed of Light",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Around the World.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `After damaging them, shove Flash's engaged Henchman or Villain back one space. <span class="line-gap"></span> CHOOSE: Flash can follow them. <span class="line-gap"></span> OR <span class="line-gap"></span> Retreat to Headquarters.`
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
    id: "663",
    type: "Main",
    name: "Fastest Man Alive?",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Fastest.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `You may draw from the Enemies and Allies Pile.`
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
    id: "664",
    type: "Main",
    name: "Speed Force Storm",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Flash Family.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Gain a Sidekick. <span class="line-gap"></span> [ICON:Flash]: Increase this card's Damage by 1.`
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
    id: "665",
    type: "Main",
    name: "Analyze All Possibilities",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Pull of the Speed Force.jpg`,
    perDeck: "1",
    damage: "2",
    abilitiesText: [
      {
        text: `OPTIONAL: This card deals no Damage, and next turn all of Flash's cards gain +1 Damage.`
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
    id: "666",
    type: "Main",
    name: "Transcend Time and Space",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Trancend.jpg`,
    perDeck: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Retrieve up to 2 cards from Flash's discard pile.`
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
    id: "667",
    type: "Main",
    name: "Back in a Flash",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Perception.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `Draw a card. <span class="line-gap"></span><span class="line-gap"></span> Each time Flash KO's a Henchman or Villain this turn, he can rescue a Bystander.`
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
    id: "668",
    type: "Main",
    name: "Cyclone",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/FlashWhirlwind.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `A Henchman or Villain Damaged by this card cannot move until the end of Flash's next turn.`
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
    id: "669",
    type: "Main",
    name: "Creator of the Speed Force",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Creator.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Every Hero draws a card.`
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
    id: "670",
    type: "Main",
    name: "Bullet Time",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Bullet Time.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Once, before the start of Flash's next turn, he can prevent himself or another Hero from taking Damage.`
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
    id: "671",
    type: "Main",
    name: "Save a Life",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/Real Love.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw a card and rescue a Bystander.`
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
    id: "672",
    type: "Main",
    name: "In the Nick of Time",
    hero: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen/BA.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2 cards. Flash can only use them against Henchmen and Villains that other Heroes are engaged against. He does not need to Travel to do so.`
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
    id: "1061",
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
    id: "1062",
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
    id: "1063",
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
    id: "1064",
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
    id: "1065",
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
    id: "1066",
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
    id: "1067",
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
    id: "1068",
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
    id: "1069",
    type: "Main",
    name: "Secret Weapon",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Secret Weapon.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `You may draw from the Enemies and Allies Pile. <span class="line-gap"></span> If Discarded: Scan 3 from the Enemies and Allies Pile. <span class="line-gap"></span> CHOOSE: Activate. <span class="line-gap"></span> OR <span class="line-gap"></span> KO your choice of the revealed cards.`
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
    id: "1070",
    type: "Main",
    name: "Partners in...?",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Partners In.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw a card. <span class="line-gap"></span><span class="line-gap"></span> Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL: KO the revealed card.`
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
    id: "1071",
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
    id: "1072",
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
    id: "1073",
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
  {
    id: "1081",
    type: "Main",
    name: "Booyah!",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/booyah.jpg`,
    perDeck: "1",
    damage: "5",
    abilitiesText: [
      {
        text: `After dealing Damage with this card, KO all Henchmen and Villains at 2 or less HP.`
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
    id: "1082",
    type: "Main",
    name: "Plasma Cannon",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/plasmaCannon.jpg`,
    perDeck: "2",
    damage: "4",
    abilitiesText: [
      {
        text: `Henchmen and Villains in adjacent Cities take 1 Damage.`
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
    id: "1083",
    type: "Main",
    name: "Apokaliptian Power",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/apokaliptianPower.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `Scan 1 from Cyborg's deck. If it deals Damage, draw it.`
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
    id: "1084",
    type: "Main",
    name: "Human Instinct",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/humanInstinct.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL: KO the top card of the Villain Deck.`
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
    id: "1086",
    type: "Main",
    name: "Rapid Self-Modification",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/rapidSelfModification.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Scan 3 from Cyborg's deck. <span class="line-gap"></span> OPTIONAL: Draw 2 and KO the third.`
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
    id: "1087",
    type: "Main",
    name: "Victory or Nothing",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/victoryOrNothing.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `At the end of Cyborg's turn, if he takes Damage from a Villain, they take 2 Damage in return.`
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
    id: "1088",
    type: "Main",
    name: "Robot Vision",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/robotVision.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `Play the next Ally from the Enemies and Allies Pile.`
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
    id: "1089",
    type: "Main",
    name: "Half Man, Half Machine",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/Cold Heart.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Scan 5 from Cyborg's deck. <span class="line-gap"></span> Draw 1 and return the rest in an order of your choice.`
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
    id: "1090",
    type: "Main",
    name: "Self-Repair",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/selfRepair.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `CHOOSE: If Cyborg takes Damage this turn, he regains 3 HP afterwards. <span class="line-gap"></span> OR <span class="line-gap"></span> If Cyborg takes Damage this turn, draw 3 random cards at the start of Cyborg's next turn.`
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
    id: "1091",
    type: "Main",
    name: "Tougher Than Most",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/tougherThanMost.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw a card and increase Cyborg's Damage Threshold by 1 until the start of his next turn.`
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
    id: "1092",
    type: "Main",
    name: "Hack the System",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/hackTheSystem.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Retrieve up to 2 cards from Cyborg's discard pile. For every card not retrieved, draw 1.`
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
    id: "1093",
    type: "Main",
    name: "Power of the People",
    hero: "Cyborg",
    image: `${cardArtFolder}/Cyborg/powerOfThePeople.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2 cards. <span class="line-gap"></span> Increase this card's Damage by 1 for every rescued Bystander.`
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
    id: "1221",
    type: "Main",
    name: "Faster Than Light",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally g.jpg`,
    perDeck: "1",
    damage: "5",
    abilitiesText: [
      {
        text: `All leftover Damage from this card is dealt to the Overlord.`
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
    id: "1222",
    type: "Main",
    name: "At One with the Speed Force",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally h.jpg`,
    perDeck: "2",
    damage: "4",
    abilitiesText: [
      {
        text: `All other Henchmen and Villains take 1 Damage.`
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
    id: "1223",
    type: "Main",
    name: "Pure Momentum",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Flash (Wally) Pure Momentum.jpg`,
    perDeck: "2",
    damage: "3",
    abilitiesText: [
      {
        text: `Increase this card's Damage by 1 for every time Flash has traveled this turn.`
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
    id: "1224",
    type: "Main",
    name: "Reunited",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally e.jpg`,
    perDeck: "1",
    damage: "2",
    abilitiesText: [
      {
        text: `Select 1 other active Teammate; they take an additional turn after yours. The Villain Deck is not drawn from on this turn. <span class="line-gap"></span> If Flash has no active Teammates: Draw 2 cards.`
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
    id: "1225",
    type: "Main",
    name: "Eternity of Waiting",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally Speedforce Runs Through Him.jpg`,
    perDeck: "1",
    damage: "2",
    abilitiesText: [
      {
        text: `Increase this card's Damage equal to the HP Flash has lost.`
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
    id: "1226",
    type: "Main",
    name: "Next Generation",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally c.jpg`,
    perDeck: "1",
    damage: "2",
    abilitiesText: [
      {
        text: `All other active [ICON:Titans] Heroes draw 2 cards.`
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
    id: "1227",
    type: "Main",
    name: "Faster Than a Locomotive",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally f.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL: KO the revealed card.`
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
    id: "1228",
    type: "Main",
    name: "Good 'ol Days",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally Old Times.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Gain a Sidekick. <span class="line-gap"></span> Increase this card's Damage by 1 for every active [ICON:Titans] Hero.`
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
    id: "1229",
    type: "Main",
    name: "Lost in the Speed Force",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally Lost in the Speedforce 2.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw a card. <span class="line-gap"></span> Increase this card's Damage by 1 for every KO'd Hero.`
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
    id: "1230",
    type: "Main",
    name: "Love that Transcends Death",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally Linda Park.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `CHOOSE: Draw a card and rescue a Bystander. <span class="line-gap"></span> OR <span class="line-gap"></span> KO a Henchman or Villain that has a captured Bystander.`
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
    id: "1231",
    type: "Main",
    name: "Vibrational Frequency",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Flash (Wally) Vibrational Frequency.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Once, before the start of Flash's next turn, he can prevent himself or another Hero from taking Damage.`
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
    id: "1232",
    type: "Main",
    name: "Out of Place",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally No Identity.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `You may draw from the Enemies and Allies Pile. <span class="line-gap"></span> [ICON:Flash]: OPTIONAL: Discard a card and increase this card's Damage by 2.`
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
    id: "1233",
    type: "Main",
    name: "Rewrite Creation",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally Rewrite the Multiverse.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Every Hero can Scan 3 from their decks and draw 1 of them.`
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
    id: "1234",
    type: "Main",
    name: "Flash Time",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Flash (Wally) Perception.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `The next damaging card played has its Damage doubled.`
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
    id: "1235",
    type: "Main",
    name: "Escape the Speed Force",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally trapped.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2 cards. <span class="line-gap"></span> Flash can Travel an unlimited number of times this turn.`
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