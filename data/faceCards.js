const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/801247aebf7fe092c9e3a4fbc7549a90e231131d/Public/Images/Card%20Assets/HeroCards"

export const heroes = [
  {
    id: "1",
    name: "Superman",
    image: `${cardArtFolder}/Superman.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "blue",
    teams: ["Super","Justice League"],
    hp: "18",
    damageThreshold: "3",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Superman can ignore taking Damage, or he can Protect another Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore the Damage`
      },
      {
        text: `Protect another Hero`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `3`,
        shared: `yes`,
        effect: `ignoreDamage`
      },
      {
        type: `quick`,
        condition: `damageOther`,
        uses: `3`,
        shared: `yes`,
        effect: `protectHero`
      }
    ]
  },
  {
    id: "2",
    name: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/Hal Jordan.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "green",
    teams: ["Green Lantern","Justice League"],
    hp: "16",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, Deal 2 Damage to all Henchmen and Villains in Cities.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Deal 2 Damage to all Henchmen and Villains`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageVillain(all,2)`
      }
    ]
  },
  {
    id: "3",
    name: "Martian Manhunter",
    image: `${cardArtFolder}/Martian Manhunter.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "red",
    teams: ["Martian","Justice League"],
    hp: "15",
    damageThreshold: "3",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Martian Manhunter can ignore taking Damage, after he cannot deal Damage until the end of his next turn. <span class="line-gap"></span> If Martian Manhunter is at Headquarters, all other Heroes within the Headquarters cannot take Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore the Damage`
      },
      {
        text: `Protect others at Base`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `3`,
        shared: `no`,
        effect: `ignoreDamageSleepHero`
      },
      {
        type: `passive`,
        condition: `in(Headquarters)`,
        uses: `0`,
        shared: `no`,
        effect: `nearbyProtected(Headquarters)`
      }
    ]
  },
  {
    id: "4",
    name: "Shazam",
    image: `${cardArtFolder}/Shazam.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "red",
    teams: ["Shazam","Justice League"],
    hp: "14",
    damageThreshold: "3",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, deal 10 Damage to a Henchman or Villain, after this Hero cannot deal Damage until the end of his next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Damage Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageOneVillainSleepHero(10)`
      }
    ]
  },
  {
    id: "5",
    name: "Hawkwoman",
    image: `${cardArtFolder}/Hawkwoman.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "orange",
    teams: ["Hawk","Justice League"],
    hp: "13",
    damageThreshold: "1",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, if Hawkwoman reduces a Henchman or Villain to 2 or less HP, she can KO it. <span class="line-gap"></span> If Hawkman is active, increase this card's Damage Threshold by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `KO Henchman or Villain`
      },
      {
        text: `Hawkman DT Bonus`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damagedVillain(2)`,
        uses: `3`,
        shared: `no`,
        effect: `koDamagedVillain`
      },
      {
        type: `passive`,
        condition: `isActive(Hawkman)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDTby1ifHawkmanActive`
      }
    ]
  },
  {
    id: "6",
    name: "Black Canary",
    image: `${cardArtFolder}/Black Canary.png`,
    type: "Hero",
    category: "Guardian",
    color: "green",
    teams: ["Arrow","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `3/Game: At the start of your turn, after your initial Travel (if performed) but before your draw selection, deal 10 Damage to the Henchman, Villain, or Overlord that you are facing, afterwards Black Canary cannot deal Damage until the start of her next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Damage Opposing Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `startAfterTravel`,
        uses: `3`,
        shared: `no`,
        effect: `damageOppSleepHero(10)`
      }
    ]
  },
  {
    id: "7",
    name: "Mera",
    image: `${cardArtFolder}/Mera.png`,
    type: "Hero",
    category: "Guardian",
    color: "green",
    teams: ["Aqua","Justice League"],
    hp: "14",
    damageThreshold: "1",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Mera's Damage Threshold is increased by 1 whilst she is in a Coastal City. <span class="line-gap"></span> 3/Game: Once per turn, double the Damage of another Hero's card used while their Target is within a Coastal City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Double card's Damage`
      },
      {
        text: `Increase Damage Threshold by 1 in Coastal City`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `allyAttacks(Coastal)`,
        uses: `3`,
        shared: `no`,
        effect: `doubleAllysDamage`
      },
      {
        type: `passive`,
        condition: `in(Coastal)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamageThreshold(1)`
      }
    ]
  },
  {
    id: "8",
    name: "Red Lantern (Guy Gardner)",
    image: `${cardArtFolder}/Guy Gardner.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "red",
    teams: ["Green Lantern","Justice League"],
    hp: "13",
    damageThreshold: "1",
    retreat: "5",
    travel: "3",
    abilitiesText: [
      {
        text: `2/Game: Once per turn, Deal 6 Damage to any one Henchmen or Villain in a City. <span class="line-gap"></span> 3/Game: Once per turn, KO the top 4 cards of your deck to regain 4 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Deal 6 Damage to one Henchmen or Villain`
      },
      {
        text: `KO the top 4 cards of your Deck to Regain 4 HP`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `damageVillain(Choice(Any),6)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `koFromTopRegainHP(4,4)`
      }
    ]
  },
  {
    id: "22",
    name: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Wonder","Justice League"],
    hp: "12",
    damageThreshold: "3",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `2/Game: Once per turn, Lock any Henchman or Villain in their City. <span class="line-gap"></span> 1/Game: Double the Damage of a card, and if you do, ignore any additional effects it has.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Lock a Henchman or Villain`
      },
      {
        text: `Ignore the Text, Double the Damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `lockVillain`
      },
      {
        type: `quick`,
        condition: `useDamageCard`,
        uses: `1`,
        shared: `no`,
        effect: `ignoreTextDoubleDamage`
      }
    ]
  },
  {
    id: "23",
    name: "Flash (Barry Allen)",
    image: `${cardArtFolder}/Barry Allen.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Flash","Justice League"],
    hp: "9",
    damageThreshold: "3",
    retreat: "3",
    travel: "3",
    abilitiesText: [
      {
        text: `Flash's damaging Action Cards deal 1 additional Damage equal to the number of times he has Traveled that turn. <span class="line-gap"></span> 2/Game: At the start of this Hero's turn, you can draw 2 instead of selecting a card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Skip Selection, Draw 2`
      },
      {
        text: `Increase 1+ Damage Cards By 1 Per Travel`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `wouldDrawAtStart`,
        uses: `2`,
        shared: `no`,
        effect: `skipSelectionDraw2`
      },
      {
        type: `passive`,
        condition: `Travel`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      }
    ]
  },
  {
    id: "24",
    name: "Aquaman",
    image: `${cardArtFolder}/Aquaman.jpg`,
    type: "Hero",
    category: "Striker",
    color: "orange",
    teams: ["Aqua","Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Aquaman's damaging Action Cards deal 1 additional Damage whilst he is in a Coastal City. <span class="line-gap"></span> 3/Game: Once per turn, you can deal 2 Damage to a Henchman or Villain in either Coastal City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Damage Coastal Villain by 2`
      },
      {
        text: `Increase 1+ Damage Cards while on Coast`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `in(Coastal)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageVillain(Choice(Coastal),2)`
      }
    ]
  },
  {
    id: "25",
    name: "Hawkman",
    image: `${cardArtFolder}/Hawkman.jpg`,
    type: "Hero",
    category: "Striker",
    color: "orange",
    teams: ["Hawk","Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `2/Game: Hawkman can ignore taking Damage, after he draws 1 card. <span class="line-gap"></span> If Hawkwoman is active, Hawkman's damaging Action Cards deal 1 additional Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore Damage, then Draw 1`
      },
      {
        text: `Increase Damage by 1 If Hawkwoman Active`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `2`,
        shared: `no`,
        effect: `ignoreDamageDraw1`
      },
      {
        type: `passive`,
        condition: `isActive(Hawkwoman)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      }
    ]
  },
  {
    id: "26",
    name: "Supergirl",
    image: `${cardArtFolder}/Supergirl.jpg`,
    type: "Hero",
    category: "Striker",
    color: "blue",
    teams: ["Super","Justice League"],
    hp: "14",
    damageThreshold: "3",
    retreat: "3",
    travel: "3",
    abilitiesText: [
      {
        text: `2/Game: Supergirl can ignore taking Damage, or she can Protect another Hero. <span class="line-gap"></span> 1/Game: Supergirl can Rescue a Captured Bystander and deal 2 Damage to the capturing Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore the Damage`
      },
      {
        text: `Protect another Hero`
      },
      {
        text: `Rescue Bystander and Damage Capturer`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `2`,
        shared: `yes`,
        effect: `ignoreDamage`
      },
      {
        type: `quick`,
        condition: `damageOther`,
        uses: `2`,
        shared: `yes`,
        effect: `protectHero`
      },
      {
        type: `standard`,
        condition: `villainHasBystander`,
        uses: `1`,
        shared: `no`,
        effect: `rescueBystanderDamageCapturer(2)`
      }
    ]
  },
  {
    id: "27",
    name: "Firestorm",
    image: `${cardArtFolder}/Firestorm.jpg`,
    type: "Hero",
    category: "Striker",
    color: "orange",
    teams: ["Justice League"],
    hp: "14",
    damageThreshold: "1",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, you can shuffle any number of cards from your hand back into your deck, then draw the same number.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Shuffle Cards and Redraw`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `shuffleChoiceCardsRedraw`
      }
    ]
  },
  {
    id: "28",
    name: "White Lantern",
    image: `${cardArtFolder}/White Lantern.jpg`,
    type: "Hero",
    category: "Striker",
    color: "white",
    teams: ["Green Lantern","Justice League"],
    hp: "15",
    damageThreshold: "3",
    retreat: "3",
    travel: "3",
    abilitiesText: [
      {
        text: `1/Game: Return a KO'd Hero to full HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Restore a KO'd Hero`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `resurrectHero`
      }
    ]
  },
  {
    id: "29",
    name: "Red Hood",
    image: `${cardArtFolder}/Red Hood.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Bat","Titans"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Permanent KO <span class="line-gap"></span> 3/Game: Once per turn, KO any one Henchman in a City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `KO a Henchman`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `koHenchman`
      }
    ]
  },
  {
    id: "43",
    name: "Batman",
    image: `${cardArtFolder}/Batman.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Bat","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `Batman deals double Damage against Henchmen and Villains in Gotham. <span class="line-gap"></span> 3/Game: Without rolling, Batman can retreat and take no Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Retreat without rolling`
      },
      {
        text: `Double Damage In Gotham`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `retreatFree`
      },
      {
        type: `passive`,
        condition: `in(Gotham)`,
        uses: `0`,
        shared: `no`,
        effect: `doubleDamage`
      }
    ]
  },
  {
    id: "44",
    name: "Cyborg",
    image: `${cardArtFolder}/Cyborg.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "red",
    teams: ["Titans","Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `2/Game: At the start of a turn, prevent the Villain Deck from being drawn from. <span class="line-gap"></span> 1/Game: Without rolling, Cyborg can retreat and take no Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Retreat without rolling`
      },
      {
        text: `Prevent Villain Deck draw`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `retreatFree`
      },
      {
        type: `quick`,
        condition: `villainDeckWouldDraw`,
        uses: `2`,
        shared: `no`,
        effect: `skipVillainDeckDraw`
      }
    ]
  },
  {
    id: "45",
    name: "Green Arrow",
    image: `${cardArtFolder}/Green Arrow.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Arrow","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Green Arrow can use his cards to Damage the Henchmen and Villains in Adjacent Cities, however the additional effects of those cards are negated. <span class="line-gap"></span> 3/Game: Green Arrow can use any number of cards to Damage the Overlord without Traveling, however the additional effects of those cards are negated.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Use cards against Adjacent Henchmen and Villains`
      },
      {
        text: `Attack the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `useCardsVsAdjacentNegateEffects`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `attackOverlordNoTravelNegateEffects`
      }
    ]
  },
  {
    id: "46",
    name: "Green Lantern (John Stewart)",
    image: `${cardArtFolder}/John Stewart.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "green",
    teams: ["Green Lantern","Justice League"],
    hp: "14",
    damageThreshold: "3",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, Green Lantern can increase his, or another Hero's, Damage Threshold by 2 until the start of his next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Raise Your Damage Threshold`
      },
      {
        text: `Raise an Ally's Damage Threshold`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `yes`,
        effect: `dtPlus(2)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `yes`,
        effect: `allydtPlus(2)`
      }
    ]
  },
  {
    id: "47",
    name: "Robin",
    image: `${cardArtFolder}/Robin.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Bat","Titans"],
    hp: "10",
    damageThreshold: "1",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `Robin deals double Damage against Henchmen and Villains in Gotham. <span class="line-gap"></span> 3/Game: Once per turn, deal 3 Damage to any one Henchman or Villain in a City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Double Damage In Gotham`
      },
      {
        text: `Deal 3 Damage to one Henchmen or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `in(Gotham)`,
        uses: `0`,
        shared: `no`,
        effect: `doubleDamage`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageVillain(Choice(Any),3)`
      }
    ]
  },
  {
    id: "48",
    name: "Nightwing",
    image: `${cardArtFolder}/Nightwing.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "blue",
    teams: ["Bat","Titans"],
    hp: "10",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `Nightwing's damaging Action Cards deal 1 additional Damage for each of his active Teammates. <span class="line-gap"></span> 3/Game: Once per turn, double the Damage of another Hero's card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Increase Damage by 1 per Teammate`
      },
      {
        text: `Double another Hero's Damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `getTeammatesActive`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      },
      {
        type: `quick`,
        condition: `allyAttacks(Any)`,
        uses: `3`,
        shared: `no`,
        effect: `doubleAllysDamage`
      }
    ]
  },
  {
    id: "49",
    name: "Batgirl",
    image: `${cardArtFolder}/Batgirl.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "purple",
    teams: ["Bat","Titans"],
    hp: "9",
    damageThreshold: "3",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `3/Game: Reveal the top 3 cards of the Villain Deck, you can KO one of them.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reveal 3 from the Villain Deck`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `revealVillainTopKO(3,1)`
      }
    ]
  },
  {
    id: "50",
    name: "Red Robin",
    image: `${cardArtFolder}/Red Robin.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "red",
    teams: ["Bat","Titans"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `3/Game: Red Robin can Travel an additional time. <span class="line-gap"></span> 3/Game: Once per turn, draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Travel Once More`
      },
      {
        text: `Draw 1`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `travel(any)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `draw(1)`
      }
    ]
  },
  {
    id: "51",
    name: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "white",
    teams: ["Flash","Titans"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `3/Game: Red Robin can Travel an additional time. <span class="line-gap"></span> 3/Game: Once per turn, draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Travel Once More`
      },
      {
        text: `Draw 1`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `travel(any)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `draw(1)`
      }
    ]
  }
]