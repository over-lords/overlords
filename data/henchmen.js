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
        type: `quick`,
        condition: `uponDefeat`,
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
        text: `Reward: Draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
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
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: ["travelPlus(1)"]
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
               Reward: OPTIONAL : Draw from the E&A.`
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
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `KOHero`,
        uses: `999`,
        shared: `no`,
        effect: `returnHeroAsVillain`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `enemyDraw(1)`
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
        text: `Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `enemyDraw(1)`
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
               Reward: OPTIONAL : Knockback.`
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
        effect: `teleport`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
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
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `regainLife(1)`
      }
    ]
  },
  {
    id: "4858",
    name: "Gorilla Soldiers",
    image: `${cardArtFolder}/gorillaSoldiers.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Deal 1 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `damageOverlord(1)`
      }
    ]
  },
  {
    id: "4859",
    name: "Black Lanterns",
    image: `${cardArtFolder}/blackLanterns.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "3",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span>
               Reward: Permanently KO a Henchman or Villain in the KO Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Death From Above!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry()`,
        uses: `0`,
        shared: `no`,
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `koFromKO(1)`
      }
    ]
  },
  {
    id: "4860",
    name: "League of Assassins Ninjas",
    image: `${cardArtFolder}/leagueOfAssassinsNinjas.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Your Hero regains 1 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `regainLife(1)`
      }
    ]
  },
  {
    id: "4861",
    name: "Creatures of Legend",
    image: `${cardArtFolder}/creaturesOfLegend3.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `damageOverlord(2)`
      }
    ]
  },
  {
    id: "4862",
    name: "Atlantean Deserters",
    image: `${cardArtFolder}/atlanteanDeserters.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Draw 2.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `draw(2)`
      }
    ]
  },
  {
    id: "4863",
    name: "Sinestro Corps",
    image: `${cardArtFolder}/sinestroCorps.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "4864",
    name: "Omac Drones",
    image: `${cardArtFolder}/omacDrones.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "3",
    damage: "3",
    abilitiesText: [
      {
        text: `If your Hero is KO'd by an Omac Drone: Next turn do not draw from the Villain Deck, your Hero enters as a Villain. <span class="line-gap"></span>
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Eye Am Reborn!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `KOHero`,
        uses: `999`,
        shared: `no`,
        effect: `returnHeroAsVillain`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: ["draw(2)","travelPlus(1)"]
      }
    ]
  },
  {
    id: "4865",
    name: "Arkham Guards",
    image: `${cardArtFolder}/arkhamGuards.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Draw 1, it is used against the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `drawUseOverlord(1)`
      }
    ]
  },
  {
    id: "4866",
    name: "Argus Security",
    image: `${cardArtFolder}/argusSecurity.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: Scan 1 from the Villain Deck, it is not drawn next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `revealAndStopVillainDraw(1)`
      }
    ]
  },
  {
    id: "4867",
    name: "Enhanced Enforcer",
    image: `${cardArtFolder}/enhancedEnforcer.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "3",
    damage: "3",
    abilitiesText: [
      {
        text: `Reward: Scan 3 from the Villain Deck, KO all revealed Might of the Overlords.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `scanKoMights(3)`
      }
    ]
  },
  {
    id: "4868",
    name: "Police Officers",
    image: `${cardArtFolder}/policeOfficers.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: ["draw(1)","travelPlus(1)"]
      }
    ]
  },
  {
    id: "4869",
    name: "Watchtower Security",
    image: `${cardArtFolder}/watchtowerSecurity.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "2",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: Rescue 2 Bystanders.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `rescueBystander(2)`
      }
    ]
  },
  {
    id: "4870",
    name: "Minor Hero",
    image: `${cardArtFolder}/minorHero.jpg`,
    type: "Henchman",
    doNotShow: "true",
    hp: "3",
    damage: "3",
    abilitiesText: [
      {
        text: `Reward: OPTIONAL : KO the top card of your Hero's deck and deal 5 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        condition: `uponDefeat`,
        uses: `1`,
        shared: `no`,
        effect: `koTopHeroCardDamageOverlord(1,5)`
      }
    ]
  },
]