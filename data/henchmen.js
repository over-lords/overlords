const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/26041c780776ad7892fec859925d782b27042611/Public/Images/Card%20Assets/Henchmen";

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
        condition: `uponDefeat`,
        effect: `rescueBystander(1)`
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
        condition: `uponDefeat`,
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
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        condition: `uponDefeat`,
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
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        condition: `KOHero`,
        effect: `returnHeroAsVillain`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
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
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        condition: `uponDefeat`,
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
        text: `Return a Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `knockback(any)`
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
        condition: `isEngaged`,
        effect: `disableRetreat`
      },
      {
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        text: `Permanently KO a KO'd Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        condition: `uponDefeat`,
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
        condition: `KOHero`,
        effect: `returnHeroAsVillain`
      },
      {
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        condition: `uponDefeat`,
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
        text: `KO the top card of your Deck to deal 5 Damage to the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `koTopHeroCardDamageOverlord(1,5)`
      }
    ]
  },
]