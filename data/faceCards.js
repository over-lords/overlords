const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/ef40d6d3bababb0283cbc4eb516c761c629812bf/Public/Images/Card%20Assets/HeroCards"

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
        text: `3/Game: Once per turn, on his turn, Green Lantern can increase his, or another Hero's, Damage Threshold by 2 until the start of his next turn.`
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
        text: `2/Game: Once per turn, on her turn, Wonder Woman can Lock a Henchman or Villain in a City. <span class="line-gap"></span> 1/Game: Wonder Woman can ignore the text effects of a card to double its Damage.`
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
        text: `2/Game: At the start of his turn, Flash can draw 2 instead of selecting a card. <span class="line-gap"></span> 2/Game: Once per turn, on his turn, Flash can play a card from his discard pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Skip Selection, Draw 2`
      },
      {
        text: `Play a card from discard`
      }
    ],
    abilitiesEffects: [
      {
        effect: `skipSelectionDraw2`
      },
      {
        effect: `playFromDiscard(1,all)`
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
  }
]