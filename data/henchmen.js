const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/fc271a8062837c99e1c991fb0aa263eb7ffc54d1/Public/Images/Card%20Assets/Henchmen";

// ids 4851-5000

export const henchmen = [
  {
    id: "4851",
    name: "Joker Gang",
    image: `${cardArtFolder}/Joker Gang.jpg`,
    type: "Henchman",
    doNotShow: "false",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Rescue a Bystander.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `rescueBystander(1,random)`
      }
    ]
  },
  {
    id: "4852",
    name: "Mobsters",
    image: `${cardArtFolder}/Mobsters.jpg`,
    type: "Henchman",
    doNotShow: "false",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Draw a card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `draw(1)`
      }
    ]
  },
  {
    id: "4853",
    name: "Parademons",
    image: `${cardArtFolder}/Parademons.jpg`,
    type: "Henchman",
    doNotShow: "false",
    hp: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span>
               Reward: Your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Boomtube`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        uses: `1`,
        shared: `no`,
        effect: `teleport(random)`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `draw(1)`
      }
    ]
  },
  {
    id: "4854",
    name: "Brainiac Drones",
    image: `${cardArtFolder}/Braniac Drones.jpg`,
    type: "Henchman",
    doNotShow: "false",
    hp: "3",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span>
               If your Hero is KO'd by a Brainiac Drone: Next turn do not draw from the Villain Deck, your Hero enters as a Villain. <span class="line-gap"></span>
               Reward: OPTIONAL: Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Dropship`
      },
      {
        text: `Become my thrall`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        uses: `1`,
        shared: `no`,
        effect: `teleport(random)`
      },
      {
        type: `quick`,
        condition: `KOHero`,
        uses: `999`,
        shared: `no`,
        effect: `returnHeroAsVillain`
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
    id: "4855",
    name: "Hive Soldiers",
    image: `${cardArtFolder}/hiveSoldiers.jpg`,
    type: "Henchman",
    doNotShow: "false",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: OPTIONAL: Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
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
    id: "4856",
    name: "Demons",
    image: `${cardArtFolder}/Demons.jpg`,
    type: "Henchman",
    doNotShow: "false",
    hp: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span>
               Reward: OPTIONAL: Knockback.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `From Hell they Come!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        uses: `1`,
        shared: `no`,
        effect: `teleport(random)`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `returnHenchOrVillain(1)`
      }
    ]
  },
  {
    id: "4857",
    name: "Manhunters",
    image: `${cardArtFolder}/Manhunters.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "3",
    damage: "3",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat when engaging Manhunters. <span class="line-gap"></span>
               Reward: Your Hero regains 1 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `No Man Escapes the Manhunters!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `isEngaged()`,
        uses: `0`,
        shared: `no`,
        effect: `disableRetreat()`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `regainLife(1)`
      }
    ]
  },
]