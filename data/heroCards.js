const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/bf4e1e581d01f61d19b3eeb43d02e6093696eb8e/Public/Images/Card%20Assets";

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
    id: "21",
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
    id: "22",
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
    id: "23",
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
    id: "24",
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
    id: "25",
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
    id: "26",
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
    id: "27",
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
    id: "28",
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
    id: "29",
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
    id: "30",
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
    id: "31",
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
    id: "461",
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
    id: "462",
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
    id: "463",
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
    id: "464",
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
    id: "465",
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
    id: "466",
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
    id: "467",
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
    id: "468",
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
    id: "469",
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
    id: "470",
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
    id: "471",
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
    id: "472",
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
  {
    id: "881",
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
    id: "882",
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
    id: "883",
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
    id: "884",
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
    id: "885",
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
    id: "886",
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
    id: "887",
    type: "Main",
    name: "Faster Than a Locomotive",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally f.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `Reveal the top card of the Villain Deck. <span class="line-gap"></span> OPTIONAL: KO the revealed card.`
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
    id: "888",
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
    id: "889",
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
    id: "890",
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
    id: "891",
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
    id: "892",
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
    id: "893",
    type: "Main",
    name: "Rewrite Creation",
    hero: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West/Wally Rewrite the Multiverse.jpg`,
    perDeck: "1",
    damage: "0",
    abilitiesText: [
      {
        text: `Every Hero can look at the top 3 cards of their decks and draw 1 of them.`
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
    id: "894",
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
    id: "895",
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

// Starting ID for a deck: startID=(deckNumber−1)×cardsPerDeck+1