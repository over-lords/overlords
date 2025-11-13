const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/82b59b48f07f4daed14ea431943467732b842350/Public/Images/Card%20Assets/Henchmen";

export const henchmen = [
  {
    id: "1",
    name: "Joker Gang",
    image: `${cardArtFolder}/Joker Gang.jpg`,
    type: "Henchman",
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
    id: "2",
    name: "Mobsters",
    image: `${cardArtFolder}/Mobsters.jpg`,
    type: "Henchman",
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
    id: "3",
    name: "Parademons",
    image: `${cardArtFolder}/Parademons.jpg`,
    type: "Henchman",
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
    id: "4",
    name: "Brainiac Drones",
    image: `${cardArtFolder}/Braniac Drones.jpg`,
    type: "Henchman",
    hp: "3",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span>
               If your Hero is KO'd by a Brainiac Drone: Next turn do not draw from the Villain Deck, your Hero enters as a Villain. <span class="line-gap"></span>
               Reward: You may draw from the Enemies and Allies Pile.`
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
    id: "5",
    name: "Hive Soldiers",
    image: `${cardArtFolder}/hiveSoldiers.jpg`,
    type: "Henchman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: You may draw from the Enemies and Allies Pile.`
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
    id: "6",
    name: "Demons",
    image: `${cardArtFolder}/Demons.jpg`,
    type: "Henchman",
    hp: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span>
               Reward: You may return an active Henchman or Villain to the Villain Deck.`
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
    id: "7",
    name: "Manhunters",
    image: `${cardArtFolder}/Manhunters.jpg`,
    type: "Henchman",
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