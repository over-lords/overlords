const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/fc271a8062837c99e1c991fb0aa263eb7ffc54d1/Public/Images/Card%20Assets";

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
        text: `Increase this card's Damage by 3 for every KO'd Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Increase card's damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: `increaseCardDamage(3*findKOdHeroes)`
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
        text: `CHOOSE: This card deals 8 Damage. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Choose`
      },
      {
        text: `Increase Damage to 8`
      },
      {
        text: `Draw 1`
      }
    ],
    abilitiesEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`
      },
      {
        type: `chooseOption(1)`,
        effect: `setCardDamageTo(8)`
      },
      {
        type: `chooseOption(2)`,
        effect: `draw(1)`
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
        text: `CHOOSE: KO a Henchman or Villain, and if you do, this card deals no Damage and you take the KO'd Henchman or Villain's Damage. <span class="line-gap"></span> OR <span class="line-gap"></span> After using this card, Superman's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Choose`
      },
      {
        text: `KO Henchman or Villain`
      },
      {
        text: `Increase Travel Budget`
      }
    ],
    abilitiesEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`
      },
      {
        type: `chooseOption(1)`,
        effect: [`setCardDamageTo(0)`,`damageFoe(999,any)`,`damageHero(lastDamagedFoe,current,ignoreDT)`]
      },
      {
        type: `chooseOption(2)`,
        effect: `travelPlus(1)`
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
        text: `If Superman is at, or below, 5 HP: Increase this card's Damage by 3.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Increase Card Damage by 3`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `atXorLessHP(5)`,
        effect: [`increaseCardDamage(3)`]
      },
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
        text: `[ICON:Bat]: Draw 2. <span class="line-gap"></span> [ICON:Wonder]: Increase this card’s Damage by 3. <span class="line-gap"></span> [ICON:Bat] + [ICON:Wonder]: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 2`
      },
      {
        text: `Increase Card Damage by 3`
      },
      {
        text: `Draw from the Enemies and Allies Deck`
      },
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `activeHero(Bat)`,
        effect: [`draw(2)`]
      },
      {
        type: `quick`,
        condition: `activeHero(Wonder)`,
        effect: [`increaseCardDamage(3)`]
      },
      {
        type: `optional`,
        condition: [`activeHero(Bat)`,`activeHero(Wonder)`],
        effect: [`enemyDraw(1)`]
      },
    ]
  },
  {
    id: "206",
    type: "Main",
    name: "Head of the Family",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Family.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Gain a Sidekick. <span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span> [ICON:Super]: Draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Gain a Sidekick`
      },
      {
        text: `Draw 1`
      },
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: [`gainSidekick(1)`]
      },
      {
        type: `quick`,
        condition: [`activeHero(Super)`],
        effect: [`draw(1)`]
      },
    ]
  },
  {
    id: "207",
    type: "Main",
    name: "Freeze Breath",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Freeze Breath.jpg`,
    perDeck: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Freeze the Henchman or Villain damaged by this card until the end of Superman's next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Freeze Damaged Foe`
      }
    ],
    abilitiesEffects: [
      {
        condition: `afterDamage`,
        effect: `freezeVillain(lastDamagedFoe,next)`
      }
    ]
  },
  {
    id: "208",
    type: "Main",
    name: "Beacon of Hope",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Beacon.jpg`,
    perDeck: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `All other active Heroes draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Everyone Else Draws`
      }
    ],
    abilitiesEffects: [
      {
        effect: `draw(1,allOtherHeroes)`
      }
    ]
  },
  {
    id: "209",
    type: "Main",
    name: "Heat Vision",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/Heat Vision.jpg`,
    perDeck: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Deal 3 Damage to an adjacent Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Choose your Target`
      },
      {
        text: `Damage the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        effect: `damageFoe(3,adjacentFoes)`
      },
      {
        condition: `facingOverlord`,
        effect: `damageOverlord(3)`
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
        text: `Choose`
      },
      {
        text: `Rescue a Bystander`
      },
      {
        text: `KO a foe with a Bystander`
      }
    ],
    abilitiesEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`
      },
      {
        type: `chooseOption(1)`,
        effect: [`rescueBystander(1)`]
      },
      {
        type: `chooseOption(2)`,
        effect: [`damageFoe(999,anyWithBystander)`]
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
    id: "221",
    type: "Main",
    name: "Green Lantern's Light",
    hero: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan/Green Lantern Light.jpg`,
    perDeck: "1",
    damage: "5",
    abilitiesText: [
      {
        text: `All other Henchmen and Villains take 3 Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Airstrike!`
      }
    ],
    abilitiesEffects: [
      {
        effect: `damageFoe(3,allOthers)`
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
        text: `I'm Not Afraid`
      }
    ],
    abilitiesEffects: [
      {
        effect: `disableVillainDraw(1)`
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
        text: `OPTIONAL : Draw from the E&A. <span class="line-gap"></span> If Discarded: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw from the E&A`
      },
      {
        text: `Taste this Will!`
      },
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        effect: [`enemyDraw(1)`]
      },
      {
        type: `quick`,
        condition: `ifDiscarded`,
        effect: `damageOverlord(3)`
      },
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
        text: `Freeze Damaged Foe`
      }
    ],
    abilitiesEffects: [
      {
        condition: `afterDamage`,
        effect: `freezeVillain(lastDamagedFoe,next)`
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
        text: `Draw 2, then Discard 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'm sorry...`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: [`draw(2)`,`discard(1)`]
      },
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
        text: `Draw 1. <span class="line-gap"></span> OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 1`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        effect: `draw(1)`
      },
      {
        type: `optional`,
        effect: [`enemyDraw(1)`]
      },
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
        text: `Increase this card's Damage by 1 for every other active [ICON:Justice] Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Meet my Wingmen`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: [`increaseCardDamage(getActiveTeamCount(Justice))`]
      },
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
        text: `Increase Green Lantern's Damage Threshold to 3 until the end of his next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Armor Up!`
      }
    ],
    abilitiesEffects: [
      {
        effect: `setHeroDTtoX(current,3,nextEnd)`
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
        text: `Boom! Boom! Boom!`
      }
    ],
    abilitiesEffects: [
      {
        effect: `damageFoeMulti(1,3,any)`
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
        text: `Lock a Henchman or Villain in their City until the end of Green Lantern's next turn, and also reduce their Damage to 0 permanently.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Sit Tight.`
      }
    ],
    abilitiesEffects: [
      {
        effect: [`freezeVillain(any,next)`,`disableVillain(lastFrozen,next)`]
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
        text: `Gain a Sidekick. <span class="line-gap"></span> [ICON:Lantern]: Increase this card's Damage by 2.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Welcome to the Corps`
      },
      {
        text: `Nice Assist!`
      }
    ],
    abilitiesEffects: [
      {
        effect: `gainSidekick(1)`
      },
      {
        type: `quick`,
        condition: [`activeHero(Lantern)`],
        effect: [`increaseCardDamage(2)`]
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
        text: `CHOOSE: Deal 5 Damage to the Overlord. <span class="line-gap"></span> OR <span class="line-gap"></span> KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Choose`
      },
      {
        text: `Deal 5 Damage to the Overlord`
      },
      {
        text: `KO all Henchmen`
      }
    ],
    abilitiesEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`
      },
      {
        type: `chooseOption(1)`,
        effect: [`damageOverlord(5)`]
      },
      {
        type: `chooseOption(2)`,
        effect: [`damageFoe(999,allHenchmen)`]
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
        text: `After taking this card's Damage, push Wonder Woman's engaged foe up to 5 spaces right, stopping if they contact another Henchman or Villain. <span class="line-gap"></span> CHOOSE: Wonder Woman can follow them. <span class="line-gap"></span> OR <span class="line-gap"></span> Retreat to Headquarters.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Shove Foe Back`
      },
      {
        text: `Choose`
      },
      {
        text: `Followed Shoved Foe`
      },
      {
        text: `Retreat to Headquarters`
      }
    ],
    abilitiesEffects: [
      {
        condition: `afterDamage`,
        effect: `shoveVillain(lastDamagedFoe,10)`
      },
      {
        condition: [`afterDamage`,`onlyOnShove`],
        type: `chooseOption`,
        effect: `chooseYourEffect`
      },
      {
        condition: `afterDamage`,
        type: `chooseOption(1)`,
        effect: [`travelTo(lastShovedVillainDestination)`]
      },
      {
        condition: `afterDamage`,
        type: `chooseOption(2)`,
        effect: [`retreatHeroToHQ()`]
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
        text: `At the end of Wonder Woman's turn, if she takes Damage from a Henchman or Villain, they take 3 Damage in return.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Damage Attacker`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damagedAtTurnEnd`,
        effect: [`damageFoe(3,lastDamageCauser)`]
      },
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
        text: `Increase this card's Damage`
      }
    ],
    abilitiesEffects: [
      {
        effect: `increaseCardDamage(getTravelUsed)`
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
        text: `Increase this card's Damage by 1 for every 1 HP Wonder Woman has lost.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Increase this card's Damage`
      }
    ],
    abilitiesEffects: [
      {
        effect: `increaseCardDamage(getHeroDamage)`
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
        text: `Freeze the Henchman or Villain damaged by this card until the end of Wonder Woman's next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Freeze Damaged Foe`
      }
    ],
    abilitiesEffects: [
      {
        condition: `afterDamage`,
        effect: `freezeVillain(lastDamagedFoe,next)`
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
        text: `CHOOSE: Increase this card's Damage by 1 for every other active [ICON:Wonder] Hero. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw 1 for every KO'd [ICON:Wonder] Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Choose`
      },
      {
        text: `Increase this card's Damage`
      },
      {
        text: `Draw card(s)`
      }
    ],
    abilitiesEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`
      },
      {
        type: `chooseOption(1)`,
        effect: [`increaseCardDamage(getActiveTeamCount(Wonder))`]
      },
      {
        type: `chooseOption(2)`,
        effect: [`draw(getKOdTeamCount(Wonder))`]
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
        text: `If Wonder Woman is at, or below, 5 HP: Deal 5 damage to the Overlord. <span class="line-gap"></span> Otherwise: Draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Deal 5 Damage or Draw 1`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `atXorLessHP(5)`,
        effect: `damageOverlord(5)`
      },
      {
        type: `quick`,
        condition: `atXorGreaterHP(6)`,
        effect: `draw(1)`
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
        text: `Wonder Woman's engaged foe gains Curse 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Give Foe Curse 1`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `afterDamage`,
        effect: `giveVillainPassive(curse(1),lastDamagedFoe)`
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
        text: `Draw 2. <span class="line-gap"></span> Wonder Woman can Withdraw once this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 2`
      },
      {
        text: `Withdraw`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: `draw(2)`
      },
      {
        type: `quick`,
        condition: `afterDamage`,
        effect: `giveHeroPassive(retreatHeroToHQ(1))`
      },
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
        text: `CHOOSE: Draw 1. <span class="line-gap"></span> OR <span class="line-gap"></span> Rescue all captured Bystanders.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Choose`
      },
      {
        text: `Draw 1`
      },
      {
        text: `Rescue all captured Bystanders`
      }
    ],
    abilitiesEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`
      },
      {
        type: `chooseOption(1)`,
        effect: [`draw(1)`]
      },
      {
        type: `chooseOption(2)`,
        effect: [`rescueCapturedBystander(all)`]
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
        text: `After damaging them, move Flash's engaged Henchman or Villain right one space. <span class="line-gap"></span> CHOOSE: Flash can follow them. <span class="line-gap"></span> OR <span class="line-gap"></span> Retreat to Headquarters.`
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
        text: `OPTIONAL : Draw from the E&A.`
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
        text: `OPTIONAL : This card deals no Damage, and next turn all of Flash's cards gain +1 Damage.`
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
        text: `Retrieve up to 2 from Flash's discard pile.`
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
        text: `Draw 1. <span class="line-gap"></span><span class="line-gap"></span> Each time Flash KO's a Henchman or Villain this turn, he can Rescue a Bystander.`
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
        text: `Draw 1 and Rescue a Bystander.`
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
        text: `Draw 2. Flash can only use them against Henchmen and Villains that other Heroes are engaged against. He does not need to Travel to do so.`
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
        text: `Draw 2. <span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span> OPTIONAL : Discard X.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 2`
      },
      {
        text: `Discard any number of cards`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: `draw(2)`
      },
      {
        type: `quick`,
        effect: `giveHeroPassive(discardCardsAtWill())`
      },
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
        text: `Return to Gotham`
      },
      {
        text: `If Discarded`
      },
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: `giveHeroPassive(atWillTravelTo(11))`
      },
      {
        type: `quick`,
        condition: `ifDiscarded`,
        effect: `damageFoe(999,10)`
      },
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
        text: `Increase card's damage`
      },
      {
        text: `If Discarded`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: `increaseCardDamage(findKOdHeroes)`
      },
      {
        type: `quick`,
        condition: `ifDiscarded`,
        effect: `damageOverlord(3)`
      },
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
        text: `Draw 2, then Discard 1. <span class="line-gap"></span><span class="line-gap"></span> If Discarded: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 2, Discard 1`
      },
      {
        text: `If Discarded`
      },
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: [`draw(2)`,`discard(1)`]
      },
      {
        type: `quick`,
        condition: `ifDiscarded`,
        effect: `damageOverlord(2)`
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
        text: `OPTIONAL : Discard 1 and Batman regains 2 HP. <span class="line-gap"></span> If Discarded: Draw 2.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Discard 1 to regain 2 HP`
      },
      {
        text: `If Discarded`
      },
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        effect: [`discard(1)`,`regainLife(2)`]
      },
      {
        type: `quick`,
        condition: `ifDiscarded`,
        effect: `draw(2)`
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
        text: `CHOOSE: Increase this card's Damage by 1 for every other active [ICON:Bat] Hero. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw 1 for every other active [ICON:Bat] Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Choose`
      },
      {
        text: `Increase this card's Damage`
      },
      {
        text: `Draw card(s)`
      }
    ],
    abilitiesEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`
      },
      {
        type: `chooseOption(1)`,
        effect: [`increaseCardDamage(getActiveTeamCount(Bat))`]
      },
      {
        type: `chooseOption(2)`,
        effect: [`draw(getActiveTeamCount(Bat))`]
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
        text: `Freeze the Henchman or Villain damaged by this card until the end of Batman's next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Freeze Damaged Foe`
      }
    ],
    abilitiesEffects: [
      {
        condition: `afterDamage`,
        effect: `freezeVillain(lastDamagedFoe,next)`
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
        text: `Draw 2. <span class="line-gap"></span> OPTIONAL : Discard X. <span class="line-gap"></span> Increase this card's Damage by 1 for every card Batman discarded this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 2`
      },
      {
        text: `Discard any number of cards`
      },
      {
        text: `Increase this card's Damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: `draw(2)`
      },
      {
        type: `quick`,
        effect: `giveHeroPassive(discardCardsAtWill())`
      },
      {
        type: `quick`,
        effect: `increaseCardDamage(getCardsDiscarded)`
      },
    ]
  },
  {
    id: "1069",
    type: "Main",
    name: "Secret Weapon",
    hero: "Batman",
    image: `${cardArtFolder}/Batman/Secret Weapon.jpg`,
    perDeck: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `OPTIONAL : Draw from the E&A. <span class="line-gap"></span> If Discarded: Scan 3 from E&A. <span class="line-gap"></span> CHOOSE: Activate. <span class="line-gap"></span> OR <span class="line-gap"></span> KO your choice of the revealed cards.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw from the Enemies and Allies Deck`
      },
      {
        text: `If Discarded`
      },
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        effect: [`enemyDraw(1)`]
      },
      {
        type: `quick`,
        condition: `ifDiscarded`,
        effect: [`scanDeck(enemy,3)`,`applyScanEffects(activate,ko)`]
      },
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
        text: `Draw 1. <span class="line-gap"></span><span class="line-gap"></span> Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 1`
      },
      {
        text: `Scan 1 from the Villain Deck`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: `draw(1)`
      },
      {
        type: `quick`,
        effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`]
      },
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
        text: `Draw 1 and Gain a Sidekick. <span class="line-gap"></span><span class="line-gap"></span> Increase this card's Damage by 1 for every other active [ICON:Bat] and [ICON:Justice] Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 1 and Gain a Sidekick`
      },
      {
        text: `Increase this card's Damage`
      },
      {
        text: `Increase this card's Damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: [`draw(1)`,`gainSidekick(1)`]
      },
      {
        type: `quick`,
        effect: [`increaseCardDamage(getActiveTeamCount(Bat))`]
      },
      {
        type: `quick`,
        effect: [`increaseCardDamage(getActiveTeamCount(Justice))`]
      },
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
        text: `Draw 2, then Discard 1. <span class="line-gap"></span><span class="line-gap"></span> Deal 2 Damage to a Henchman or Villain in Gotham.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 2, Discard 1`
      },
      {
        text: `Damage a Henchman or Villain in Gotham`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        effect: [`draw(2)`,`discard(1)`]
      },
      {
        type: `quick`,
        effect: `damageFoe(2,10)`
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
        text: `Give another Hero an extra turn`
      },
      {
        text: `No Teammates? Draw 2`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: [`confirmActiveTeammates`],
        effect: `giveTeammateExtraTurn()`
      },
      {
        type: `quick`,
        condition: [`confirmNoActiveTeammates`],
        effect: `draw(2)`
      },
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
        text: `Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the top card of the Villain Deck.`
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
        text: `Scan 3 from Cyborg's deck. <span class="line-gap"></span> OPTIONAL : Draw 2 and KO the third.`
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
        text: `Play the next Ally from the E&A.`
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
        text: `Draw 1 and increase Cyborg's Damage Threshold by 1 until the start of his next turn.`
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
        text: `Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
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
        text: `Gain a Sidekick. <span class="line-gap"></span> Increase this card's Damage by 1 for every other active [ICON:Titans] Hero.`
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
        text: `Draw 1. <span class="line-gap"></span> Increase this card's Damage by 1 for every KO'd Hero.`
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
        text: `CHOOSE: Draw 1 and Rescue a Bystander. <span class="line-gap"></span> OR <span class="line-gap"></span> KO a Henchman or Villain that has a captured Bystander.`
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
        text: `OPTIONAL : Draw from the E&A. <span class="line-gap"></span> [ICON:Flash]: OPTIONAL : Discard a card and increase this card's Damage by 2.`
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
