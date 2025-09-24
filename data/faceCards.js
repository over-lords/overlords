const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/49138e68bd3eb2e56994a4803effdc51d7b1edc7/Public/Images/Card%20Assets/HeroCards"

export const heroes = [
  {
    id: "1",
    name: "Superman",
    image: `${cardArtFolder}/Superman.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "blue",
    teams: ["Super","Justice League"],
    hp: "15",
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
        effect: `ignoreDamage`
      },
      {
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
        text: `Deal 3 Damage to all Henchmen and Villains`
      }
    ],
    abilitiesEffects: [
      {
        effect: `damageVillains(3)`
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
        text: `3/Game: Martian Manhunter can ignore taking Damage, after he cannot deal Damage until the end of his next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore the Damage`
      }
    ],
    abilitiesEffects: [
      {
        effect: `ignoreDamageSleepHero`
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
        text: `3/Game: Once per turn, if Hawkwoman reduces a Henchman or Villain to 2 or less HP, she can instantly KO it. <span class="line-gap"></span> If Hawkman is active, increase this card's Damage Threshold by 1.`
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
        effect: `koDamagedVillain`
      },
      {
        effect: `increaseDTby1ifHawkmanActive`
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
        effect: `lockVillain`
      },
      {
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
        effect: `skipSelectionDraw2`
      },
      {
        effect: `increaseDamageCardPerTravel(1)`
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
        effect: `increaseDamageInCoastal(1)`
      },
      {
        effect: `chooseAndDamageCoastalVillain(2)`
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
        effect: `ignoreDamageDraw1`
      },
      {
        effect: `increaseDamageifHawkwomanActive(1)`
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
        effect: `ignoreDamage`
      },
      {
        effect: `protectHero`
      },
      {
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
        effect: `shuffleChoiceCardsRedraw`
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
        effect: `retreatFree`
      },
      {
        effect: `passiveDoubleAllDamage(Gotham)`
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
        effect: `retreatFree`
      },
      {
        effect: `skipVillainDeckDraw`
      }
    ]
  },
  {
    id: "45",
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
        text: `3/Game: Once per turn, on his turn, Green Lantern can increase his, or another Hero's, Damage Threshold by 2 until the start of his next turn.`
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
        effect: `dtPlus(2)`
      },
      {
        effect: `allydtPlus(2)`
      }
    ]
  }
]