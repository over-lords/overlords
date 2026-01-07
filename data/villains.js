const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/183eccc00ae1c98d86ec3676a9b859c01dd0b4e2/Public/Images/Card%20Assets/Villains";

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
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `My Life, For Zod!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
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
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Move Over!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Neo-Gotham is Mine!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`koBystander(2)`]
      }
    ],
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
        text: `Reward: CHOOSE: Draw 1. <span class="line-gap"></span> OR <span class="line-gap"></span> Deal 2 Damage to a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
          text: `Choose Reward!`
      },
      {
          text: `Draw 1`
      },
      {
          text: `Deal 2 Damage to a Henchman or Villain`
      }
  ],
  abilitiesEffects: [
      {
          type: `chooseOption`,
          effect: `chooseYourEffect`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`draw(1)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`damageFoe(2,any)`]
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
        text: `[ICON:Super] Heroes deal half Damage against Metallo. <span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Kryptonite Heart`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `halveIncomingDamageFrom(Super)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
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
        text: `Takeover 1 <span class="line-gap"></span> 
                Might of the Overlord: Draw 2 cards from the Villain Deck. <span class="line-gap"></span><span class="line-gap"></span> 
                  Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the top card of the Villain Deck.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Behold My Monkey Brain!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`]
      }
    ],
    mightNamePrint: [
      {
          text: `Society of Super Villains, Attack!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`villainDraw(2)`]
      }
    ],
  },
  {
    id: "5607",
    name: "Parasite",
    image: `${cardArtFolder}/parasite.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "11",
    damage: "1",
    abilitiesText: [
      {
        text: `At the end of a turn in which Parasite took Damage, increase his Damage by 1. <span class="line-gap"></span> 
               Reward: Deal 3 Damage to up to 2 Henchmen or Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `That Felt Good...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndWasDamaged`,
        effect: `increaseVillainDamage(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageFoeMulti(3,2,any)`
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
        effect: `damageOverlord(2)`
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
        text: `Heroes engaged with Hector Hammond cannot use their Icon Abilities. <span class="line-gap"></span> 
                Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Calculated for that`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `disableIconAbilitiesAgainst()`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
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
        text: `Teleport <span class="line-gap"></span> Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Blam!`
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
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
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
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
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
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(3)`
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
        text: `Charge 1 <span class="line-gap"></span> Reward: Your Hero's Travel Budget increases by 1.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `travelPlus(1,permanent)`
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
        text: `Takeover 1 <span class="line-gap"></span>
                Might of the Overlord: Play the next 2 Henchmen or Villains from the Villain Deck. <span class="line-gap"></span><span class="line-gap"></span> 
                  Reward: KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'm In Charge Now!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageFoe(999,allHenchmen)`
      }
    ],
    mightNamePrint: [
      {
          text: `Get 'em Boys!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`rallyNextHenchVillains(2)`]
      }
    ],
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
        type: `uponDefeat`,
        condition: `uponDefeat`,
        effect: ["draw(1)","travelPlus(1)"]
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
        text: `Bang!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndNotEngaged`,
        effect: `damageHero(2,random)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
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
        text: `I Learn`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damaged`,
        effect: `logDamageCheckDamage()`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(4)`
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
    hp: "8",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Freeze a Henchman or Villain until the end of your Hero's next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Mirrors Everywhere`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `freezeVillain(any,next)`
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
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 2 Damage. <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Zap!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndNotEngaged`,
        effect: `damageHero(2,random)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
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
        text: `Charge!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(3)`
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
        text: `Charge!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
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
        text: `Charge 1 <span class="line-gap"></span> Reward: CHOOSE: Draw a card. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Choose Reward!`
      },
      {
          text: `Draw 1`
      },
      {
          text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
          type: `chooseOption`,
          effect: `chooseYourEffect`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`draw(1)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`enemyDraw(1)`]
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
        text: `Teleport <span class="line-gap"></span> Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `In Your Dreams!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `freezeVillain(any)`
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
        text: `Charge 1 <span class="line-gap"></span> If Giganta makes it to Keystone City: Double her remaining HP. <span class="line-gap"></span> Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Time to Grow!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `travelsTo(4)`,
        uses: `1`,
        effect: `doubleVillainLife()`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
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
        text: `Takeover 2 <span class="line-gap"></span> 
                Might of the Overlord: KO all captured Bystanders. <span class="line-gap"></span> 
                  Reward: Deal 2 Damage to all Henchmen and Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Born to Rule!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageFoe(2,all)`
      }
    ],
    mightNamePrint: [
      {
          text: `Get Angry!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`koCapturedBystander(all)`]
      }
    ],
  },
  {
    id: "5627",
    name: "Doomsday",
    image: `${cardArtFolder}/doomsday.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "30",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Clash <span class="line-gap"></span> Reward: Deal 5 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Clash!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(5)`
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
        text: `Takeover 1 <span class="line-gap"></span> 
                Might of the Overlord: KO the top card of every Hero's discard pile. <span class="line-gap"></span><span class="line-gap"></span> 
                  Charge 1 <span class="line-gap"></span> 
                    Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `I Am Your Downfall!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(3)`
      }
    ],
    mightNamePrint: [
      {
          text: `I Will Break You!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`koTopHeroDiscard(all)`]
      }
    ],
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
        text: `Clash <span class="line-gap"></span> Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Clash!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
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
        text: `Eject <span class="line-gap"></span> Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Get Out!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasEject`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: ["draw(1)","travelPlus(1)"]
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
        text: `Charge 1 <span class="line-gap"></span> Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Whoops!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: ["draw(1)","travelPlus(1)"]
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
        text: `Teleport <span class="line-gap"></span> Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Spotted!`
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
        type: `quick`,
        condition: `uponDefeat`,
        effect: ["draw(2)","travelPlus(1)"]
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
        text: `Charge 1 <span class="line-gap"></span><span class="line-gap"></span> Reward: CHOOSE: Restore a Destroyed City. <span class="line-gap"></span> OR <span class="line-gap"></span> Deal 5 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Choose Reward!`
      },
      {
          text: `Restore a City`
      },
      {
          text: `Damage the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
          type: `chooseOption`,
          effect: `chooseYourEffect`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`restoreCity(1)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`damageOverlord(5)`]
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
        text: `Teleport <span class="line-gap"></span> The first time each turn a Hero uses a card to damage Shadow Thief, they take 1 Damage (ignoring their Damage Thresholds). <span class="line-gap"></span> Reward: OPTIONAL : Draw 3, and Travel to engage the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Making my Exit!`
      },
      {
        text: `Caught Off-Guard!`
      },
      {
        text: `Reward! Draw 3 and Travel to the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `firstAttackPerTurn`,
        effect: `damageHero(1,current,ignoreDT)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: [`draw(3)`,`travelTo(Overlord)`]
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
        text: `Magnetic Repulsion`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: [`halveIncomingDamageFrom(Bat)`,`halveIncomingDamageFrom(Arrow)`,`halveIncomingDamageFrom(Hawk)`]
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2*getOverlordLevel)`
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
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: Play the next 2 Enemies from the E&A. <span class="line-gap"></span><span class="line-gap"></span> 
               Teleport <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Where'd She Go?`
      },
      {
        text: `My Reign Begins!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(3)`
      }
    ],
    mightNamePrint: [
      {
          text: `You're Mine Now!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`enemyDraw(2,nextEnemy)`]
      }
    ],
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
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 1 Damage. <span class="line-gap"></span> Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Got You!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndNotEngaged`,
        effect: `damageHero(1,random)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "5638",
    name: "Ultraman",
    image: `${cardArtFolder}/../Overlords/ultraman.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Justice League",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 20 Damage to the Overlord. <span class="line-gap"></span> 
               If Ultraman Escapes: Deal 3 Damage to all Heroes (ignoring their Damage Thresholds).`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Reward!`
      },
      {
        text: `Got Away!`
      }
    ],
    abilitiesEffects: [
      {
        type: `onEntry`,
        condition: `none`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(20)`
      },
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `damageHero(3,all,ignoreDT)`
      }
    ]
  },
  {
    id: "5639",
    name: "Batman",
    image: `${cardArtFolder}/batman.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: All Heroes lose a random Icon Ability use. If a Hero has none to lose, they take 3 Damage. <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging Batman. <span class="line-gap"></span> 
               Reward: CHOOSE: KO a Henchman or Villain in Gotham OR Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Must I Do Everything Myself?`
      },
      {
        text: `Where Do You Think You're Going?`
      },
      {
          text: `Choose Reward!`
      },
      {
          text: `KO a Foe in Gotham`
      },
      {
          text: `Freeze any Foe`
      },
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
          type: `chooseOption`,
          effect: `chooseYourEffect`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`damageFoe(999,10)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`freezeVillain(any)`]
      },
    ],
    mightNamePrint: [
      {
          text: `Gotham is Mine!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`loseIconUse(1,random,all)`]
      }
    ],
  },
  {
    id: "5640",
    name: "Superman",
    image: `${cardArtFolder}/superman.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "25",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Deal 5 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Up, Up, and Away!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(2)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(5)`
      }
    ]
  },
  {
    id: "5641",
    name: "Wonder Woman",
    image: `${cardArtFolder}/wonderWoman.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "22",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Freeze a Henchman or Villain.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `freezeVillain(any)`
      }
    ]
  },
  {
    id: "5642",
    name: "Green Lantern (Hal Jordan)",
    image: `${cardArtFolder}/greenLanternHal.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "20",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Your Hero's DT becomes 3 until the end of their next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `My Sector`
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
        type: `quick`,
        condition: `uponDefeat`,
        effect: `setHeroDTtoX(current,3,nextEnd)`
      }
    ]
  },
  {
    id: "5643",
    name: "Flash (Barry Allen)",
    image: `${cardArtFolder}/flashBarry.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `In a Flash!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(2)`
      },
      {
        condition: `uponDefeat`,
        effect: ["draw(2)","travelPlus(1)"]
      }
    ]
  },
  {
    id: "5644",
    name: "The Key",
    image: `${cardArtFolder}/theKey.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
                Might of the Overlord: Destroy the Rightmost City. <span class="line-gap"></span> 
                  Teleport <span class="line-gap"></span> 
                    Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'll Just Let Myself In`
      },
      {
        text: `You Left the Door Open`
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
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `freezeVillain(any)`
      }
    ],
    mightNamePrint: [
      {
          text: `Ha! That Was Easy!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`destroyCity(1)`]
      }
    ],
  },
  {
    id: "5645",
    name: "Mongul",
    image: `${cardArtFolder}/mongul.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "25",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 3 <span class="line-gap"></span> 
                Might of the Overlord: Destroy the Rightmost City. <span class="line-gap"></span> 
                  Charge 1 <span class="line-gap"></span> 
                    Reward: Deal 5 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Come For Superman!`
      },
      {
        text: `Kneel!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(3)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(5)`
      }
    ],
    mightNamePrint: [
      {
          text: `You're Pathetic!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`destroyCity(1)`]
      }
    ],
  },
  {
    id: "5646",
    name: "Star Sapphire",
    image: `${cardArtFolder}/starSapphire.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "15",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
                 Heroes cannot Retreat when engaging Star Sapphire. <span class="line-gap"></span> 
                   Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `You Look Lovely...`
      },
      {
        text: `Where Do You Think You're Going?`
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
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ],
  },
  {
    id: "5647",
    name: "Ma'alefa'ak",
    image: `${cardArtFolder}/maAlefaAk.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
                   Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Boo...`
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
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ],
  },
  {
    id: "5648",
    name: "Black Manta",
    image: `${cardArtFolder}/blackManta.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Aquaman",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
                Might of the Overlord: All Heroes take 2 Damage (ignoring their Damage Thresholds). <span class="line-gap"></span><span class="line-gap"></span> 
                  Charge 1 <span class="line-gap"></span> 
                    Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Manta Troops, Advance!`
      },
      {
        text: `Prepare for Slaughter!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Gut You!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`damageHero(2,all,ignoreDT)`]
      }
    ],
  },
  {
    id: "5649",
    name: "Floronic Man",
    image: `${cardArtFolder}/floronicMan.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "11",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
                 If unengaged at the end of a Hero's turn, Floronic Man regains up to 3 HP. <span class="line-gap"></span> 
                   Reward: Your Hero's Damage Threshold increases by 1 until the end of their next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Travel the Green`
      },
      {
        text: `Recharging`
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
        type: `quick`,
        condition: `turnEndNotEngaged`,
        effect: `damageFoe(-3,current)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `increaseHeroDT(currentHero,1,endNextTurn)`
      }
    ],
  },
  {
    id: "5650",
    name: "Siren",
    image: `${cardArtFolder}/siren.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Aquaman",
    hp: "8",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: KO a Henchman or Villain in either Coastal City.`
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
        effect: `damageFoe(999,anyCoastal)`
      }
    ]
  },
  {
    id: "5651",
    name: "Harm",
    image: `${cardArtFolder}/harmNew.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "4",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Deal 1 Damage to a Henchman or Villain.`
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
        effect: `damageFoe(1,any)`
      }
    ]
  },
  {
    id: "5652",
    name: "Icicle Jr",
    image: `${cardArtFolder}/icicleJr.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "6",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Freeze a Henchman or Villain.`
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
        effect: `freezeVillain(any)`
      }
    ]
  },
  {
    id: "5653",
    name: "Mr Twister",
    image: `${cardArtFolder}/misterTwister.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "9",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: Shove a Henchman or Villain up to 5 spaces right.`
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
        effect: `shoveVillain(any,10)`
      }
    ]
  },
  {
    id: "5654",
    name: "Flash (Wally West)",
    image: `${cardArtFolder}/flashWallyWest.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Draw 1, and your Hero's Travel Budget increases by 1 permanently.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Wait for It...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(2)`
      },
      {
        condition: `uponDefeat`,
        effect: ["draw(1)","travelPlus(1,permanent)"]
      }
    ]
  },
  {
    id: "5655",
    name: "Black Canary",
    image: `${cardArtFolder}/blackCanary.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "11",
    damage: "2",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat when engaging Black Canary. <span class="line-gap"></span> 
                 Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `We Weren't Done Dancing`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ],
  },
  {
    id: "5656",
    name: "Cyborg",
    image: `${cardArtFolder}/cyborg.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span><span class="line-gap"></span> 
               Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the top card of the Villain Deck.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Fatherbox? Analyze.`
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
        effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`]
      }
    ]
  },
  {
    id: "5657",
    name: "Aquaman",
    image: `${cardArtFolder}/aquaman.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "20",
    damage: "2",
    abilitiesText: [
      {
        text: `Aquaman's Damage increases to 3 whilst he is in a Coastal City. <span class="line-gap"></span> 
                 Reward: Deal 10 Damage to a Henchman or Villain in a Coastal City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Man, I Love Fish! - Aquaman, probably`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `checkVillainCity(coastal)`,
        effect: `increaseVillainDamage(1)`
      },
      {
        condition: `uponDefeat`,
        effect: `damageFoe(10,anyCoastal)`
      }
    ],
  },
  {
    id: "5658",
    name: "Lashina",
    image: `${cardArtFolder}/lashina.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Clash <span class="line-gap"></span> Reward: Freeze a Henchman or Villain until the end of your next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Clash!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `freezeVillain(any,next)`
      }
    ]
  },
  {
    id: "5659",
    name: "Gilotina",
    image: `${cardArtFolder}/gilotina.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "12",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: Double your Damage for the rest of this turn.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `doubleDamage(current,current)`
      }
    ]
  },
  {
    id: "5660",
    name: "Mad Harriet",
    image: `${cardArtFolder}/madHarriet.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
      }
    ]
  },
  {
    id: "5661",
    name: "Stompa",
    image: `${cardArtFolder}/stompa.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Clash <span class="line-gap"></span> Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Clash!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: ["draw(1)","travelPlus(1)"]
      }
    ]
  },
  {
    id: "5662",
    name: "Desaad",
    image: `${cardArtFolder}/desaad.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "9",
    damage: "1",
    abilitiesText: [
      {
        text: `At the start of every turn, the Overlord gains 5 HP. <span class="line-gap"></span> Reward: Deal 5 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Here, my Master...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        effect: `damageOverlord(-5)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(5)`
      }
    ]
  },
  {
    id: "5663",
    name: "Grail",
    image: `${cardArtFolder}/grail.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "27",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
                Might of the Overlord: KO the top card of every Hero's deck. <span class="line-gap"></span> 
                  Reward: Scan 3 from the Villain Deck. OPTIONAL : KO any of the revealed cards.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Like Father, Like Daughter!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`scanDeck(villain,3)`,`applyScanEffects(ko,closeAfter(3))`]
      }
    ],
    mightNamePrint: [
      {
          text: `Cut Out Your Heart!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`koTopHeroCard(1,all)`]
      }
    ],
  },
  {
    id: "5664",
    name: "Steppenwolf",
    image: `${cardArtFolder}/steppenwolf.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "20",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
                Reward: CHOOSE : Restore a Destroyed City. <span class="line-gap"></span> 
                OR <span class="line-gap"></span> 
                Regain up to 3 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Choose Reward!`
      },
      {
          text: `Restore a City`
      },
      {
          text: `Regain 3 HP`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
          type: `chooseOption`,
          effect: `chooseYourEffect`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`restoreCity(1)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`regainLife(3)`]
      }
    ]
  },
  {
    id: "5665",
    name: "Granny Goodness",
    image: `${cardArtFolder}/grannyGoodness.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Apokalips",
    hp: "15",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
                Might of the Overlord: Destroy the Rightmost City. <span class="line-gap"></span> 
                  Reward: CHOOSE : Restore a Destroyed City. <span class="line-gap"></span> 
                  OR <span class="line-gap"></span> 
                  Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `My, My! You've Been Naughty!`
      },
      {
        text: `Choose Reward!`
      },
      {
          text: `Restore a City`
      },
      {
          text: `Draw 1 and Gain Travel`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
          type: `chooseOption`,
          effect: `chooseYourEffect`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`restoreCity(1)`]
      },
      {
          type: `chooseOption(2)`,
          effect: ["draw(1)","travelPlus(1)"]
      }
    ],
    mightNamePrint: [
      {
          text: `Let Granny Teach You`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`destroyCity(1)`]
      }
    ],
  },
  {
    id: "5666",
    name: "Gentleman Ghost",
    image: `${cardArtFolder}/gentlemanGhost.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               The first time each turn a Hero uses a card to damage Gentleman Ghost, they take 1 Damage (ignoring their Damage Thresholds). <span class="line-gap"></span> 
               Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `You Nearly Got Me!`
      },
      {
        text: `Get Back!`
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
        type: `quick`,
        condition: `firstAttackPerTurn`,
        effect: `damageHero(1,current,ignoreDT)`
      },
      {
        condition: `uponDefeat`,
        effect: [`draw(1)`,`travelPlus(1)`]
      }
    ]
  },
  {
    id: "5667",
    name: "Mad Hatter",
    image: `${cardArtFolder}/madHatter.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `At the start of each turn, Mad Hatter captures a Bystander.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `My Dear Alice...`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        effect: `foeCaptureBystander(getCurrentCityIndex,1)`
      }
    ]
  },
  {
    id: "5668",
    name: "Riddler",
    image: `${cardArtFolder}/riddler.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: Draw 2 from the Villain Deck. <span class="line-gap"></span> 
               Reward: Deal 1 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Think I'll Ask the Questions...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        condition: `uponDefeat`,
        effect: `damageOverlord(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Shouldn't Have Done That`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`rallyNextHenchVillains(2)`]
      }
    ],
  },
  {
    id: "5669",
    name: "Harley Quinn",
    image: `${cardArtFolder}/harleyQuinn.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "3",
    damage: "1",
    abilitiesText: [
      {
        text: `If Harley Quinn makes it out of Gotham, play a Might of the Overlord. <span class="line-gap"></span> Reward: KO a Might of the Overlord from the Villain Deck.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Got The Thing, Mista J!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `leavesCity(10)`,
        effect: `drawSpecificVillain(7001)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `koMightFromVD(1)`
      }
    ]
  },
  {
    id: "5670",
    name: "Victor Zsasz",
    image: `${cardArtFolder}/victorZsasz.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "3",
    damage: "1",
    abilitiesText: [
      {
        text: `At the start of each turn, Victor Zsasz captures a Bystander. At the end of each turn, Victor Zsasz KO's all Bystanders he has. <span class="line-gap"></span> Reward: Rescue all captured Bystanders.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `The Zombie is Mine to Liberate!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        effect: [`koCapturedBystander(getCurrentCityIndex)`,`foeCaptureBystander(getCurrentCityIndex,1)`]
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `rescueCapturedBystander(all)`
      }
    ]
  },
  {
    id: "5671",
    name: "Vigilante",
    image: `${cardArtFolder}/vigilante.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "3",
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
    id: "5672",
    name: "Mutant Leader",
    image: `${cardArtFolder}/mutantLeader.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "5",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: Resurrect the first 2 KO'd Henchmen. <span class="line-gap"></span> 
               Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `My Town Now, Old Man!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`draw(1)`,`travelPlus(1)`]
      }
    ],
    mightNamePrint: [
      {
          text: `Gotham is Mine!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`reviveKodFoe(2,henchmenOnly)`]
      }
    ],
  },
  {
    id: "5673",
    name: "Phantasm",
    image: `${cardArtFolder}/phantasm.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "8",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
                 Heroes cannot Retreat when engaging Phantasm. <span class="line-gap"></span> 
                   Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Your Time Has Come`
      },
      {
        text: `Where Do You Think You're Going?`
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
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ],
  },
  {
    id: "5674",
    name: "The Penguin",
    image: `${cardArtFolder}/penguin.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "2",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: Play the next Enemy from the E&A. <span class="line-gap"></span> 
               Reward: Play the next Ally from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Birds of a Feather`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`enemyDraw(1,nextAlly)`]
      }
    ],
    mightNamePrint: [
      {
          text: `Let's See How They Like That!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`enemyDraw(1,nextEnemy)`]
      }
    ],
  },
  {
    id: "5675",
    name: "Two-Face",
    image: `${cardArtFolder}/twoFace.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "2",
    damage: "0",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               If your Hero ends their turn engaged with Two-Face, there is a 50% chance they take 2 Damage. <span class="line-gap"></span> 
               Might of the Overlord: Resurrect the first 2 KO'd Henchmen. <span class="line-gap"></span> 
               Reward: KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `We Never Liked You`
      },
      {
        text: `We Play Fair`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        chance: 0.5,
        effect: `damageHero(2,current)`
      },
      {
        condition: `uponDefeat`,
        effect: [`damageFoe(999,allHenchmen)`]
      }
    ],
    mightNamePrint: [
      {
          text: `Trouble Comes in Twos`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`reviveKodFoe(2,henchmenOnly)`]
      }
    ],
  },
  {
    id: "5676",
    name: "Scarecrow",
    image: `${cardArtFolder}/scarecrow.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "3",
    damage: "1",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging Scarecrow. <span class="line-gap"></span> 
               Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `You Can't Run from Your Fears!`
      },
      {
        text: `Clash!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `freezeVillain(any)`
      }
    ]
  },
  {
    id: "5677",
    name: "Psycho Pirate",
    image: `${cardArtFolder}/psychoPirate.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "4",
    damage: "0",
    abilitiesText: [
      {
        text: `At the start of each turn, one of six random effects will occur. <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Emotional Mayhem!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        effect: `randomEffect(damageHero(2,current),koBystander(1),halfDamage(current,next),damageOverlord(2),draw(1),travelPlus(1))`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`draw(2)`,`travelPlus(1)`]
      }
    ]
  },
  {
    id: "5678",
    name: "Copperhead",
    image: `${cardArtFolder}/copperhead.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "4",
    damage: "1",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
               Reward: Freeze a Henchman or Villain until the end of your Hero's next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Clash!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `freezeVillain(any,next)`
      }
    ]
  },
  {
    id: "5679",
    name: "Talia Al Ghul",
    image: `${cardArtFolder}/taliaAlGhul.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "7",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: Resurrect 1 KO'd Henchman for every active Hero. <span class="line-gap"></span> 
               Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> 
               OPTIONAL : KO the top card of the Villain Deck.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Daughter of the Demon`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`]
      }
    ],
    mightNamePrint: [
      {
          text: `The League is Endless, Beloved`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`reviveKodFoe(getActiveTeamCount(all),henchmenOnly)`]
      }
    ],
  },
  {
    id: "5680",
    name: "KGBeast",
    image: `${cardArtFolder}/kgBeast.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "4",
    damage: "1",
    abilitiesText: [
      {
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 1 Damage. <span class="line-gap"></span> Reward: Deal 1 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Nyet!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndNotEngaged`,
        effect: `damageHero(1,random)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(1)`
      }
    ]
  },
  {
    id: "5681",
    name: "Poison Ivy",
    image: `${cardArtFolder}/poisonIvy.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Reduce incoming Damage to Poison Ivy by 1. <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `We Go Way Back...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `reduceIncomingDamageBy(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(3)`
      }
    ]
  },
  {
    id: "5682",
    name: "Clock King",
    image: `${cardArtFolder}/clockKing.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Deal the current hour in Damage to the Overlord.`
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
        effect: `damageOverlord(getCurrentHour)`
      }
    ]
  },
  {
    id: "5683",
    name: "Hush",
    image: `${cardArtFolder}/hush.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "9",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               If your Hero ends their turn engaged with Hush, KO the top card of their deck. <span class="line-gap"></span> 
               Might of the Overlord: All Henchmen gain 3 HP. <span class="line-gap"></span> 
               Reward: Restore up to 2 KO'd cards from your Hero's discard pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Hush Now...`
      },
      {
        text: `Our Little Secret`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(1)`
      },
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        effect: `koHeroTopCard(1,current)`
      },
      {
        condition: `uponDefeat`,
        effect: [`restoreKOdHeroCards(2,current)`]
      }
    ],
    mightNamePrint: [
      {
          text: `Stir Things Up`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`damageFoe(-3,allHenchmen)`]
      }
    ],
  },
  {
    id: "5684",
    name: "Prometheus",
    image: `${cardArtFolder}/prometheus.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `Prometheus cannot be damaged by the same card more than once. <span class="line-gap"></span> Reward: Rescue 2 Bystanders.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I've Studied You`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damaged`,
        effect: `logDamageCheckDamage()`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `rescueBystander(2)`
      }
    ]
  },
  {
    id: "5685",
    name: "Mr Freeze",
    image: `${cardArtFolder}/mrFreeze.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "11",
    damage: "1",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Clash!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash`
      },
      {
        condition: `uponDefeat`,
        effect: `freezeVillain(any)`
      }
    ]
  },
  {
    id: "5686",
    name: "Azrael",
    image: `${cardArtFolder}/azrael.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: OPTIONAL : Play the next Ally from the E&A.`
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
        effect: `enemyDraw(1,nextAlly)`
      }
    ]
  },
  {
    id: "5687",
    name: "Killer Croc",
    image: `${cardArtFolder}/killerCroc.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "13",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the top card of the Villain Deck.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`]
      }
    ]
  },
  {
    id: "5688",
    name: "Solomon Grundy",
    image: `${cardArtFolder}/solomonGrundy.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: [`enemyDraw(1)`]
      }
    ]
  },
  {
    id: "5689",
    name: "Everyman",
    image: `${cardArtFolder}/everyman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `On entry, Everyman's HP and Damage shift to match whatever foe is directly left of him on the board. <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Just Gonna Borrow This`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: [`setCurrentHP(getNextCurrentHP)`,`setCurrentDamage(getNextCurrentDamage)`]
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: [`enemyDraw(1)`]
      }
    ]
  },
  {
    id: "5690",
    name: "Talon",
    image: `${cardArtFolder}/talon.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "6",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Deal 1 Damage to the Overlord and 1 Damage to a Henchman or Villain.`
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
        effect: [`damageOverlord(1)`,`damageFoe(1,any)`]
      }
    ]
  },
  {
    id: "5691",
    name: "Blackfire",
    image: `${cardArtFolder}/Blackfire.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: [`enemyDraw(1)`]
      }
    ]
  },
  {
    id: "5692",
    name: "Upside-Down Man",
    image: `${cardArtFolder}/upsideDownMan.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League Dark",
    hp: "18",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 3 <span class="line-gap"></span> 
               Might of the Overlord: Play the next Villain from the Villain Deck. <span class="line-gap"></span><span class="line-gap"></span> 
               Teleport <span class="line-gap"></span> 
               Reward: Don't draw from the Villain Deck next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `What a Wonderful Surprise!`
      },
      {
        text: `Now You're Just Like Me!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(3)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `disableVillainDraw(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Hehehe!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`rallyNextHenchVillains(1,villainsOnly)`]
      }
    ],
  },
  {
    id: "5693",
    name: "Mr Bloom",
    image: `${cardArtFolder}/mrBloom.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: KO 2 Bystanders. <span class="line-gap"></span><span class="line-gap"></span> 
               Reward: Freeze all Henchmen and Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Enjoy the Bliss!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `freezeVillain(all)`
      }
    ],
    mightNamePrint: [
      {
          text: `See? They Love It!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`koBystander(2)`]
      }
    ],
  },
  {
    id: "5694",
    name: "Oblivion",
    image: `${cardArtFolder}/oblivion.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "21",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 3 Damage to up to 2 Henchmen or Villains.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`damageFoeMulti(3,2,any)`]
      }
    ]
  },
  {
    id: "5695",
    name: "Hyperclan",
    image: `${cardArtFolder}/Hyperclan.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: KO a Bystander. <span class="line-gap"></span><span class="line-gap"></span> 
               Charge 1 <span class="line-gap"></span> 
               Reward: KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Planet's Ours Now!`
      },
      {
        text: `Charge!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageFoe(999,allHenchmen)`
      }
    ],
    mightNamePrint: [
      {
          text: `They Will Serve Us!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`koBystander(1)`]
      }
    ],
  },
  {
    id: "5696",
    name: "The Elite",
    image: `${cardArtFolder}/theElite.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: Destroy the Rightmost City. <span class="line-gap"></span><span class="line-gap"></span> 
               Teleport <span class="line-gap"></span> 
               Reward: Draw 3, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Truth and Justice? That's Rubbish.`
      },
      {
        text: `Bonnie!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`draw(3)`,`travelPlus(1)`]
      }
    ],
    mightNamePrint: [
      {
          text: `They'll Come Around`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`destroyCity(1)`]
      }
    ],
  },
  {
    id: "5697",
    name: "Detective Chimp",
    image: `${cardArtFolder}/detectiveChimp.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "9",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: KO 2 Mights of the Overlord from the Villain Deck.`
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
        effect: `koMightFromVD(2)`
      }
    ]
  },
  {
    id: "5698",
    name: "Frankenstein",
    image: `${cardArtFolder}/frankenstein.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "18",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: KO a Henchman or Villain.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`damageFoe(999,any)`]
      }
    ]
  },
  {
    id: "5699",
    name: "Orchid",
    image: `${cardArtFolder}/orchid.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Teleport the leftmost foe to the rightmost unoccupied City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `The House is Always Near`
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
        effect: `teleportFoeElsewhere(leftmost,rightmost)`
      }
    ]
  },
  {
    id: "5700",
    name: "Amethyst",
    image: `${cardArtFolder}/amethyst.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Restore all of your KO'd Action Cards.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`restoreKOdHeroCards(40,current)`]
      }
    ]
  },
  {
    id: "5701",
    name: "Hawkwoman",
    image: `${cardArtFolder}/hawkwoman.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: 
               Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Haaaa!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: ["draw(1)","travelPlus(1)"]
      }
    ]
  },
  {
    id: "5702",
    name: "Shazam",
    image: `${cardArtFolder}/shazam.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "24",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Deal 10 Damage to up to 2 Henchmen or Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Shazam!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(2)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`damageFoeMulti(10,2,any)`]
      }
    ]
  },
  {
    id: "5703",
    name: "Firestorm",
    image: `${cardArtFolder}/firestorm.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Add 1 card from your Hero's deck to your hand.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Power of the Matrix!`
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
        effect: `add(1,current)`
      }
    ]
  },
  {
    id: "5704",
    name: "Martian Manhunter",
    image: `${cardArtFolder}/martianManhunter.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Do Not Resist!`
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
        effect: `freezeVillain(any)`
      }
    ]
  },
  {
    id: "5705",
    name: "Dr Fate",
    image: `${cardArtFolder}/drFate.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "19",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Scan 3 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO 1 revealed card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `It Is Fate!`
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
        effect: [`scanDeck(villain,3)`,`applyScanEffects(ko,closeAfter(1))`]
      }
    ]
  },
  {
    id: "5706",
    name: "Constantine",
    image: `${cardArtFolder}/constantine.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "13",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Permanently KO up to 5 random Henchmen or Villains from the KO'd Pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Let's Just Make This Quick`
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
        effect: `koFromKO(5)`
      }
    ]
  },
  {
    id: "5707",
    name: "Zatanna",
    image: `${cardArtFolder}/zatanna.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "13",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: All Heroes regain 1 random Icon Ability use.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `!tropelet`
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
        effect: `gainIconUse(all,1,random)`
      }
    ]
  },
  {
    id: "5708",
    name: "Etrigan",
    image: `${cardArtFolder}/etrigan.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "25",
    damage: "3",
    abilitiesText: [
      {
        text: `Reward: CHOOSE : Deal 10 Damage to a Henchman or Villain. <span class="line-gap"></span> 
               OR <span class="line-gap"></span> 
               Deal 10 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Choose Reward!`
      },
      {
          text: `Damage a Foe`
      },
      {
          text: `Damage the Overlord`
      }
    ],
    abilitiesEffects: [
      {
          type: `chooseOption`,
          effect: `chooseYourEffect`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`damageFoe(10,any)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`damageOverlord(10)`]
      }
    ]
  },
  {
    id: "5709",
    name: "Swamp Thing",
    image: `${cardArtFolder}/swampThing.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "25",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Clash <span class="line-gap"></span> 
               Reward: Deal 5 Damage to up to 2 Henchmen or Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `You Harm the Green!`
      },
      {
        text: `Clash!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`damageFoeMulti(5,2,any)`]
      }
    ]
  },
  {
    id: "5710",
    name: "Robin",
    image: `${cardArtFolder}/robin.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "11",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I've Been Spotted!`
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
        effect: [`draw(1)`,`travelPlus(1)`]
      }
    ]
  },
  {
    id: "5711",
    name: "Bizarro",
    image: `${cardArtFolder}/bizarro.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Bizarro's Here to Save the Day!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "5712",
    name: "General Zod",
    image: `${cardArtFolder}/generalZod.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "23",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 3 <span class="line-gap"></span> 
               Might of the Overlord: KO the top card of every Hero's deck. <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Am Krypton's Savior!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(3)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Kneel Before Zod!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`koHeroTopCard(1,all)`]
      }
    ],
  },
  {
    id: "5713",
    name: "Mr Mxyzptlk",
    image: `${cardArtFolder}/mrMxyzptlik.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Mr Mxyzptlk's HP and Damage are set to random values each time he enters the board. <span class="line-gap"></span> 
               Reward: Play the next Ally from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Now Dance, Little Man!`
      },
      {
        text: `I'll Give 'em a Wallop!`
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
        type: `quick`,
        condition: `onEntry`,
        effect: [`setCurrentHP(randomNumber(3,18))`,`setCurrentDamage(randomNumber(1,5))`]
      },
      {
        condition: `uponDefeat`,
        effect: [`enemyDraw(1,nextAlly)`]
      }
    ]
  },
  {
    id: "5714",
    name: "Reign",
    image: `${cardArtFolder}/Reign.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "17",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: KO 2 Bystanders. <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Want a Real Fight!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(2)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Bring It On!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`koBystander(2)`]
      }
    ],
  },
  {
    id: "5715",
    name: "Shriek",
    image: `${cardArtFolder}/Shriek.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "8",
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
        effect: `damageOverlord(2)`
      }
    ]
  },
  {
    id: "5716",
    name: "Inque",
    image: `${cardArtFolder}/Inque.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "14",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Freeze a Henchman or Villain.`
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
        effect: `freezeVillain(any)`
      }
    ]
  },
  {
    id: "5717",
    name: "Curare",
    image: `${cardArtFolder}/Curare.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "9",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: Deal 3 Damage to the Overlord.`
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
        effect: `damageOverlord(3)`
      }
    ]
  },
  {
    id: "5718",
    name: "Spellbinder",
    image: `${cardArtFolder}/Spellbinder.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `At the end of a turn in which Spellbinder took Damage, increase his Damage by 1. <span class="line-gap"></span> 
               Reward: Deal 1 Damage to all Henchmen and Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Must Push Deeper`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndWasDamaged`,
        effect: `increaseVillainDamage(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageFoe(1,all)`
      }
    ]
  },
  {
    id: "5719",
    name: "Vigilante",
    image: `${cardArtFolder}/Ghoul.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "3",
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
    id: "5720",
    name: "Dee Dee",
    image: `${cardArtFolder}/deeDee.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "4",
    damage: "2",
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
    id: "5721",
    name: "Woof",
    image: `${cardArtFolder}/Woof.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "7",
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
      }
    ]
  },
  {
    id: "5722",
    name: "Bonk",
    image: `${cardArtFolder}/Bonk.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "6",
    damage: "1",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Draw 1.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `draw(1)`
      }
    ]
  },
  {
    id: "5723",
    name: "Chucko",
    image: `${cardArtFolder}/Chucko.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Batman Beyond",
    hp: "3",
    damage: "1",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 1 Damage to the Overlord.`
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
        type: `quick`,
        condition: `onEntry`,
        effect: `charge(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(1)`
      }
    ]
  },
]


// A: appelaxian golem, arkillo, atomica, atrocitus
// B: black adam, black beetle, black flash, bleez, black hand, black lanterns: anti-monitor, aquaman, batman, blue beetle, captain boomerang, elongated man, firestorm, green arrow, hawk, hawkman and hawkwoman, martian manhunter, professor zoom, spectre, superboy prime, superman, terra, titans, vibe, wonder woman
// C: captain boomerang, captain cold, cheshire, cinderblock, count vertigo, cyborg: batman, booster gold, captain cold, frankenstein, green lantern, supermanEye, wonder woman
// D: dawnbreaker, deathstorm, devastation, devastator, dr light, drowned, dr sivana
// E: envy
// F: felix faust, fake titans: aqualad, kid flash, omen, wonder girl, robin, speedy
// G: general eiling, girder, gizmo, gluttony, golden glider, greed, grid
// H: heatwave
// I: imperiex prime, inertia
// J: jericho, jinx, johnny quick
// K: killer frost, king kobra, king shark, klarion, krona
// L: lust, lyssa drak
// M: mammoth, match, merciless, mister twister, monsieur mallah, multiplex, murder machine
// O: owlman
// P: pied piper, power ring
// Q: queen bee
// R: rainbow raider, ravager (rose), red death, reverse flash
// S: scar, shade, shimmer, siren, sloth, soranik sinestro, sportsmaster, superwoman
// T: tar pit, terror twins, the brain, the top, the trickster, the turtle
// W: wrath
// Z: zilius zox, zoom


// HEROES AS VILLAINS
// A: aqualad, arsenal, artemis
// B: batgirl, batmanBeyond, beastBoy, blueBeetle
// D: donnaTroy
// G: greenArrow, johnStewart
// H: hawkman
// J: jasonBlood
// K: kidFlash
// L: lobo, lexLuthor
// M: mera, missMartian
// N: nightwing
// O: omen
// R: redHood, redRobin, guyGardner, raven
// S: supergirl, superboy, starfire, sinestro
// T: tempest
// V: vixen
// W: wonderGirl, whiteLantern

// VD MODIFIER CARDS - New card type?
// D: deadman
// G: gcpd batman
// W: white lanterns: anti-monitor, deadman, swamp thing