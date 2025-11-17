const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/1104a8d417845a2e5764fddb16bf194889a19668/Public/Images/Card%20Assets/Villains";

// ids 5601-7000

export const villains = [
  {
    id: "5601",
    name: "Faora",
    image: `${cardArtFolder}/Faora.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `onEntry`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `charge(1)`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `damageOverlord(2)`
      }
    ]
  },
  {
    id: "5602",
    name: "Blight",
    image: `${cardArtFolder}/Blight.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: KO 2 Bystanders. <span class="line-gap"></span> 
               Reward: You may draw from the Enemies and Allies Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `enaDraw(1,0)`
      }
    ]
  },
  {
    id: "5603",
    name: "Ravager",
    image: `${cardArtFolder}/Ravager (Grant).jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "6",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: CHOOSE: Draw a card. <span class="line-gap"></span> OR <span class="line-gap"></span> Deal 2 Damage to a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5604",
    name: "Peacemaker",
    image: `${cardArtFolder}/Peacemaker.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "3",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: You may draw from the Enemies and Allies Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `enaDraw(1,0)`
      }
    ]
  },
  {
    id: "5605",
    name: "Metallo",
    image: `${cardArtFolder}/metallo.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `[ICON:Super] Heroes deal half Damage against Metallo. <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5606",
    name: "Ultra-Humanite",
    image: `${cardArtFolder}/ultraHumanite.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> Might of the Overlord: Draw 2 cards from the Villain Deck. <span class="line-gap"></span><span class="line-gap"></span> Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL: KO the top card of the Villain Deck.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5607",
    name: "Parasite",
    image: `${cardArtFolder}/parasite.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "15",
    damage: "1",
    abilitiesText: [
      {
        text: `At the end of a turn in which Parasite took Damage, increase his Damage by 1. <span class="line-gap"></span> Reward: Deal 3 Damage to up to 2 Henchmen or Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5608",
    name: "Silver Banshee",
    image: `${cardArtFolder}/silverBanshee.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `Glide <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5609",
    name: "Toyman",
    image: `${cardArtFolder}/toyman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: OPTIONAL: Draw from the Enemies and Allies Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5610",
    name: "Hector Hammond",
    image: `${cardArtFolder}/hectorHammond.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Heroes engaged with Hector Hammond cannot use their Icon Abilities. <span class="line-gap"></span> Reward: OPTIONAL: Draw from the Enemies and Allies Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5611",
    name: "Livewire",
    image: `${cardArtFolder}/livewire.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Glide <span class="line-gap"></span> Reward: OPTIONAL: Draw from the Enemies and Allies Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5612",
    name: "Cyborg Superman",
    image: `${cardArtFolder}/cyborgSuperman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "18",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: OPTIONAL: Draw from the Enemies and Allies Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5613",
    name: "Atomic Skull",
    image: `${cardArtFolder}/atomicSkull.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5614",
    name: "Firefly",
    image: `${cardArtFolder}/firefly.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "7",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1, Glide <span class="line-gap"></span> Reward: Increase your Hero's Travel Budget by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5615",
    name: "Black Mask",
    image: `${cardArtFolder}/blackMask.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "3",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> Might of the Overlord: Play the Henchmen and Villains amongst the next 5 cards in the Villain Deck. <span class="line-gap"></span><span class="line-gap"></span> Reward: KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5616",
    name: "Man-Bat",
    image: `${cardArtFolder}/manBat.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `Glide <span class="line-gap"></span> Reward: Draw a card and increase your Hero's Travel Budget by 1 for this turn only.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5617",
    name: "Deadshot",
    image: `${cardArtFolder}/deadshot.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 2 Damage. <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5618",
    name: "Deathstroke",
    image: `${cardArtFolder}/deathstroke.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Deathstroke cannot be damaged by the same card more than once. <span class="line-gap"></span> Reward: Deal 4 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
]