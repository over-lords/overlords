const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/27fdaee3cb8bbf3a20a8da4ea38ba8b8598557ce/Public/Images/Card%20Assets/Villains";

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
    doNotShow: "true",
    hero: "Batman Beyond",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: KO 2 Bystanders. <span class="line-gap"></span> 
               Reward: OPTIONAL: Draw from the Enemies and Allies Pile.`
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
    doNotShow: "true",
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
  {
    id: "5619",
    name: "Mirror Master",
    image: `${cardArtFolder}/mirrorMaster.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Lock a Henchman or Villain until the end of your Hero's next turn.`
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
    id: "5620",
    name: "Weather Wizard",
    image: `${cardArtFolder}/weatherWizard.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `Glide <span class="line-gap"></span> If unengaged at the end of a Hero's turn, a random Hero will take 2 Damage. <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
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
    id: "5621",
    name: "Blockbuster",
    image: `${cardArtFolder}/blockBusterAlt.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: Deal 3 Damage to the Overlord.`
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
    id: "5622",
    name: "First Born",
    image: `${cardArtFolder}/firstBorn.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Wonder Woman",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
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
    id: "5623",
    name: "Cheetah",
    image: `${cardArtFolder}/cheetah.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Wonder Woman",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: CHOOSE: Draw a card. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw from the Enemies and Allies Pile.`
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
    id: "5624",
    name: "Dr Destiny",
    image: `${cardArtFolder}/drDestiny.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Lock a Henchman or Villain in their City.`
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
    id: "5625",
    name: "Giganta",
    image: `${cardArtFolder}/giganta.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Wonder Woman",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> If Giganta makes it to Keystone City, double her remaining HP. <span class="line-gap"></span> Reward: OPTIONAL: Draw from the Enemies and Allies Pile.`
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
    id: "5626",
    name: "Circe",
    image: `${cardArtFolder}/circe.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Wonder Woman",
    hp: "20",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> Might of the Overlord: KO all captured Bystanders. <span class="line-gap"></span> Reward: Deal 1 Damage to all Henchmen and Villains.`
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
    id: "5627",
    name: "Doomsday",
    image: `${cardArtFolder}/doomsday.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "50",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Clash <span class="line-gap"></span> Reward: Deal 5 Damage to the Overlord.`
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
    id: "5628",
    name: "Bane",
    image: `${cardArtFolder}/bane.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> Might of the Overlord: KO the top card of every Hero's discard pile. <span class="line-gap"></span><span class="line-gap"></span> Charge 1 <span class="line-gap"></span> Reward: Deal 3 Damage to the Overlord.`
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
    id: "5629",
    name: "Clayface",
    image: `${cardArtFolder}/clayface.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "14",
    damage: "1",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> Reward: OPTIONAL: Draw from the Enemies and Allies Pile.`
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
    id: "5630",
    name: "Electrocutioner",
    image: `${cardArtFolder}/electrocutioner.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Eject <span class="line-gap"></span> Reward: Draw a card, your Hero can Travel an extra time this turn.`
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
    id: "5631",
    name: "Kite Man",
    image: `${cardArtFolder}/kiteMan.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Glide <span class="line-gap"></span> Reward: Draw a card, your Hero can Travel an extra time this turn.`
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
    id: "5632",
    name: "Catwoman",
    image: `${cardArtFolder}/catwoman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "8",
    damage: "1",
    abilitiesText: [
      {
        text: `Glide <span class="line-gap"></span> Reward: Draw 2 cards, your Hero can Travel an extra time this turn.`
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
    id: "5633",
    name: "Kalibak",
    image: `${cardArtFolder}/kalibak.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "20",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: CHOOSE: Restore a Destroyed City or Deal 5 Damage to the Overlord.`
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
    id: "5634",
    name: "Shadow Thief",
    image: `${cardArtFolder}/shadowThief.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `Glide <span class="line-gap"></span> The first time each turn a Hero uses a card to damage Shadow Thief, they take 1 Damage. <span class="line-gap"></span> Reward: OPTIONAL: Draw 3 cards and Travel to engage the Overlord.`
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
    id: "5635",
    name: "Dr Polaris",
    image: `${cardArtFolder}/drPolaris.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "7",
    damage: "1",
    abilitiesText: [
      {
        text: `[ICON:Bat], [ICON:Arrow], and [ICON:Hawk] Heroes deal half Damage against Dr Polaris. <span class="line-gap"></span> Reward: Deal 2x the Overlord's Level back to them as Damage.`
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
    id: "5636",
    name: "Enchantress",
    image: `${cardArtFolder}/enchantress.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> Might of the Overlord: Play the next 2 Enemies from the Enemies and Allies Pile. <span class="line-gap"></span><span class="line-gap"></span> Teleport <span class="line-gap"></span> Reward: Deal 3 Damage to the Overlord.`
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
    id: "5637",
    name: "Dark Archer",
    image: `${cardArtFolder}/darkArcher.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Arrow",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 1 Damage. <span class="line-gap"></span> Reward: OPTIONAL: Draw from the Enemies and Allies Pile.`
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