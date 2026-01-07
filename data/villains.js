const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/53939d4e3bbbf5562112f72ab03614ddea0122a3/Public/Images/Card%20Assets/Villains";

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
                Might of the Overlord: Draw 2 from the Villain Deck. <span class="line-gap"></span><span class="line-gap"></span> 
                  Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
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
        text: `Teleport <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
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
        text: `Teleport <span class="line-gap"></span> 
               The first time each turn a Hero uses a card to damage Shadow Thief, they take 1 Damage (ignoring their Damage Thresholds). <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw 3, and Travel to engage the Overlord.`
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
               Might of the Overlord: All Heroes lose a random Icon Ability use. <span class="line-gap"></span> 
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
               Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
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
               Might of the Overlord: Resurrect the first 2 KO'd Henchmen. <span class="line-gap"></span><span class="line-gap"></span> 
               If your Hero ends their turn engaged with Two-Face, there is a 50% chance they take 2 Damage. <span class="line-gap"></span> 
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
               OPTIONAL : KO the revealed card.`
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
               Might of the Overlord: All Henchmen gain 3 HP. <span class="line-gap"></span><span class="line-gap"></span> 
               If your Hero ends their turn engaged with Hush, KO the top card of their deck. <span class="line-gap"></span> 
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
               Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
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
    hero: "Justice League",
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
    name: "Ghoul",
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
  {
    id: "5724",
    name: "Pied Piper",
    image: `${cardArtFolder}/piedPiper.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `At the start of each turn, Pied Piper captures a Bystander.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Come my Pretties!`
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
    id: "5725",
    name: "The Top",
    image: `${cardArtFolder}/theTop.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "6",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               The first time each turn a Hero uses a card to damage The Top, they take 1 Damage (ignoring their Damage Thresholds). <span class="line-gap"></span> 
               Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Guess You're On Bottom, Because I'm...`
      },
      {
        text: `Oops! Confused?`
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
        type: `optional`,
        condition: `uponDefeat`,
        effect: [`freezeVillain(any)`]
      }
    ]
  },
  {
    id: "5726",
    name: "Trickster",
    image: `${cardArtFolder}/theTrickster.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "2",
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
        effect: `damageOverlord(1)`
      }
    ]
  },
  {
    id: "5727",
    name: "Black Flash",
    image: `${cardArtFolder}/blackFlash.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Flash",
    hp: "20",
    damage: "0",
    abilitiesText: [
      {
        text: `If an [ICON:Flash] Hero ends their turn engaged with the Black Flash, they take 3 Damage (ignoring their Damage Threshold). <span class="line-gap"></span> 
               Reward: Deal 7 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        effect: `damageHero(3,current,ignoreDT)`
      },
      {
        condition: `uponDefeat`,
        effect: [`damageOverlord(7)`]
      }
    ]
  },
  {
    id: "5728",
    name: "Inertia",
    image: `${cardArtFolder}/inertia.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "12",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'll Make You Pay!`
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
    id: "5729",
    name: "Girder",
    image: `${cardArtFolder}/girder.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "15",
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
    id: "5730",
    name: "Killer Frost",
    image: `${cardArtFolder}/killerFrost.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "13",
    damage: "2",
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
    id: "5731",
    name: "Heat Wave",
    image: `${cardArtFolder}/heatWave.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "7",
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
    id: "5732",
    name: "Captain Boomerang",
    image: `${cardArtFolder}/captainBoomerang.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "5",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: Deal 2 Damage to the Overlord, and OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "5733",
    name: "Reverse Flash",
    image: `${cardArtFolder}/reverseFlash.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "15",
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
    id: "5734",
    name: "King Shark",
    image: `${cardArtFolder}/kingShark.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "14",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord, and OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Nom Nom!`
      },
      {
        text: `Reward!`
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
        condition: `uponDefeat`,
        effect: ["damageOverlord(3)"]
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "5735",
    name: "Captain Cold",
    image: `${cardArtFolder}/captainCold.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: Freeze all Henchmen and Villains, then draw 2 from the Villain Deck. <span class="line-gap"></span> 
               Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'm the Leader!`
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
        effect: `freezeVillain(any)`
      }
    ],
    mightNamePrint: [
      {
          text: `Okay... I'll Play Fair, Not!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`freezeVillain(all)`,`villainDraw(2)`]
      }
    ],
  },
  {
    id: "5736",
    name: "Zoom",
    image: `${cardArtFolder}/zoom.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Deal 4 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Try Harder!`
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
        effect: ["damageOverlord(4)"]
      }
    ]
  },
  {
    id: "5737",
    name: "Tar Pit",
    image: `${cardArtFolder}/tarPit.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "14",
    damage: "1",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
               Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Mmm, Goopy!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `hasClash`
      },
      {
        condition: `uponDefeat`,
        effect: ["damageOverlord(2)"]
      }
    ]
  },
  {
    id: "5738",
    name: "Golden Glider",
    image: `${cardArtFolder}/goldenGlider.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `We Need to Move!`
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
        effect: ["damageOverlord(2)"]
      }
    ]
  },
  {
    id: "5739",
    name: "The Turtle",
    image: `${cardArtFolder}/theTurtle.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "7",
    damage: "1",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging The Turtle. <span class="line-gap"></span>
               Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Please, Stay a While!`
      },
      {
        text: `Slow Down!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `hasClash`
      },
      {
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
        condition: `uponDefeat`,
        effect: ["damageOverlord(2)"]
      }
    ]
  },
  {
    id: "5740",
    name: "Rainbow Raider",
    image: `${cardArtFolder}/rainbowRaider.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Flash",
    hp: "6",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: CHOOSE: Draw 2. <span class="line-gap"></span> OR <span class="line-gap"></span> Play the next Ally from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
          text: `Choose Reward!`
      },
      {
          text: `Draw 2`
      },
      {
          text: `Play the next Ally card`
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
          effect: [`draw(2)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`enemyDraw(1,nextAlly)`]
      }
    ]
  },
  {
    id: "5741",
    name: "Lyssa Drak",
    image: `${cardArtFolder}/lyssaDrak.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `[ICON:Lantern] Heroes deal half Damage against Lyssa Drak. <span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Know What You Fear`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `halveIncomingDamageFrom(Lantern)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
      }
    ]
  },
  {
    id: "5742",
    name: "Atrocitus",
    image: `${cardArtFolder}/atrocitus.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "22",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 3 <span class="line-gap"></span> 
               Might of the Overlord: All Heroes take 3 Damage (ignoring their Damage Thresholds). <span class="line-gap"></span><span class="line-gap"></span> 
               Teleport <span class="line-gap"></span> 
               Reward: Deal 6 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `We'll Burn You All!`
      },
      {
        text: `I Am Rage!`
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
        effect: `damageOverlord(6)`
      }
    ],
    mightNamePrint: [
      {
          text: `Welcome to Hell!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`damageHero(3,all,ignoreDT)`]
      }
    ],
  },
  {
    id: "5743",
    name: "Soranik Sinestro",
    image: `${cardArtFolder}/soranikSinestro.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: All Heroes take 2 Damage (ignoring their Damage Thresholds). <span class="line-gap"></span><span class="line-gap"></span> 
               Teleport <span class="line-gap"></span> 
               Reward: CHOOSE : Draw 2.  OR  Skip the next 2 Villain Deck draws.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `For My Father!`
      },
      {
        text: `Let us Continue!`
      },
      {
          text: `Choose Reward!`
      },
      {
          text: `Draw 2`
      },
      {
          text: `Skip 2 Villain Deck Draws`
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
          type: `chooseOption`,
          effect: `chooseYourEffect`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`draw(2)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`disableVillainDraw(2)`]
      }
    ],
    mightNamePrint: [
      {
          text: `2 More Lashings!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`damageHero(2,all,ignoreDT)`]
      }
    ],
  },
  {
    id: "5744",
    name: "Krona",
    image: `${cardArtFolder}/krona.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Heed my Words!`
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
        effect: `damageOverlord(3)`
      }
    ]
  },
  {
    id: "5745",
    name: "Multiplex",
    image: `${cardArtFolder}/multiplex.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Flash",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `Stop drawing from the Villain Deck. <span class="line-gap"></span> 
               Each turn, the rightmost copy of Multiplex makes another immediately in the space to his left. In order to defeat Multiplex, all copies must be defeated. <span class="line-gap"></span>
               Reward: Deal 7 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Wait! I got this.`
      },
      {
        text: `How about Another?`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        condition: `passive`,
        effect: `disableVillainDraw()`
      },
      {
        condition: `isRightmostFoe`,
        effect: `rallyCopies(1)`
      },
      {
        condition: `uponDefeat`,
        effect: `damageOverlord(7)`
      }
    ]
  },
  {
    id: "5746",
    name: "Zilius Zox",
    image: `${cardArtFolder}/ziliusZox.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "14",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Lemme at 'em!`
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
    id: "5747",
    name: "Bleez",
    image: `${cardArtFolder}/bleez.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Deal 2 Damage to all Henchmen and Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Rip Out Your Heart!`
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
        effect: [`damageFoe(2,all)`]
      }
    ]
  },
  {
    id: "5748",
    name: "Arkillo",
    image: `${cardArtFolder}/arkillo.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `[ICON:Lantern] Heroes deal half Damage against Arkillo. <span class="line-gap"></span><span class="line-gap"></span><span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Come Here Little One...`
      },
      {
        text: `Your Fear Looks Tasty...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `halveIncomingDamageFrom(Lantern)`
      },
      {
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2)`
      }
    ]
  },
  {
    id: "5749",
    name: "Ravager",
    image: `${cardArtFolder}/ravagerRose.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "6",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Draw 2, and OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      },
      {
        text: `Draw from the E&A`
      }
    ],
    abilitiesEffects: [
      {
        condition: `uponDefeat`,
        effect: ["draw(2)"]
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "5750",
    name: "Jericho",
    image: `${cardArtFolder}/jericho.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "7",
    damage: "1",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: Draw 2.`
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
        effect: `draw(2)`
      }
    ]
  },
  {
    id: "5751",
    name: "Gizmo",
    image: `${cardArtFolder}/gizmo.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `Gizmo regains all lost HP at the end of each turn. <span class="line-gap"></span> Reward: Draw 2 and regain 1 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Fix Fix Fix!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEnd`,
        effect: `damageFoe(-5,getCurrentCityIndex)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`draw(2)`,`regainLife(1)`]
      }
    ]
  },
  {
    id: "5752",
    name: "Cinderblock",
    image: `${cardArtFolder}/cinderblock.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "12",
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
    id: "5753",
    name: "Dr Sivana",
    image: `${cardArtFolder}/drSivana.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "4",
    damage: "1",
    abilitiesText: [
      {
        text: `If your Hero ends their turn engaged with Dr Sivana, draw 1 from the Villain Deck. <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Brought Friends!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        effect: `villainDraw(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`damageOverlord(3)`]
      }
    ]
  },
  {
    id: "5754",
    name: "The Brain",
    image: `${cardArtFolder}/theBrain.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "8",
    damage: "1",
    abilitiesText: [
      {
        text: `If your Hero ends their turn engaged with The Brain, draw 1 from the Villain Deck. <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Destroy Them!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        effect: `villainDraw(1)`
      },
      {
        condition: `uponDefeat`,
        effect: [`damageOverlord(3)`]
      }
    ]
  },
  {
    id: "5755",
    name: "Monsieur Mallah",
    image: `${cardArtFolder}/monsieurMallah.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "7",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Increase your Hero's Travel Budget by 1 for this turn.`
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
        effect: [`travelPlus(1)`]
      }
    ]
  },
  {
    id: "5756",
    name: "Jinx",
    image: `${cardArtFolder}/jinx.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Teen Titan",
    hp: "8",
    damage: "1",
    abilitiesText: [
      {
        text: `All cards against Jinx have a 50% chance of failing to work. <span class="line-gap"></span> 
               Reward: Don't draw from the Villain Deck next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Just Not Your Day, Is It?`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `isAttacked`,
        effect: `applyVariableCardSuccess(0.5)`
      },
      {
        condition: `uponDefeat`,
        effect: [`disableVillainDraw(1)`]
      }
    ]
  },
  {
    id: "5757",
    name: "Shimmer",
    image: `${cardArtFolder}/shimmer.jpg`,
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
    id: "5758",
    name: "Sportsmaster",
    image: `${cardArtFolder}/sportsmaster.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "9",
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
    id: "5759",
    name: "Match",
    image: `${cardArtFolder}/match.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "16",
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
    id: "5760",
    name: "Mammoth",
    image: `${cardArtFolder}/mammoth.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "14",
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
    id: "5761",
    name: "Black Beetle",
    image: `${cardArtFolder}/blackBeetle.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `For the Reach!`
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
    id: "5762",
    name: "Klarion",
    image: `${cardArtFolder}/klarion.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 3 <span class="line-gap"></span> 
                Might of the Overlord: Draw 2 from the Villain Deck. <span class="line-gap"></span><span class="line-gap"></span> 
                  Reward: Shove all unengaged foes as far right as possible.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Oooh, Goodie!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(3)`
      },
      {
        condition: `uponDefeat`,
        effect: `shoveVillain(allUnengaged,10)`
      }
    ],
    mightNamePrint: [
      {
          text: `Let's Play!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`villainDraw(2)`]
      }
    ],
  },
  {
    id: "5763",
    name: "Queen Bee",
    image: `${cardArtFolder}/queenBee.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: KO the top card of each Hero's discard pile. <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Learn Your Place!`
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
          text: `Target Their Weaknesses!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`koTopHeroDiscard(1,all)`]
      }
    ],
  },
  {
    id: "5764",
    name: "Cheshire",
    image: `${cardArtFolder}/Cheshire.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "6",
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
    id: "5765",
    name: "Appelaxian Golem",
    image: `${cardArtFolder}/Appelaxian Golem.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Kreee!`
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
    id: "5766",
    name: "King Kobra",
    image: `${cardArtFolder}/kingKobra.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "13",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: Play the next 2 Henchmen from the Villain Deck. <span class="line-gap"></span> 
               Reward: KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Sometimes a God Must Stoop to Conquer!`
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
        effect: `damageFoe(999,allHenchmen)`
      }
    ],
    mightNamePrint: [
      {
          text: `Kill Them Already!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`rallyNextHenchVillains(2,henchmenOnly)`]
      }
    ],
  },
  {
    id: "5767",
    name: "Terror Twins",
    image: `${cardArtFolder}/terrorTwins.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Teen Titan",
    hp: "8",
    damage: "2",
    abilitiesText: [
      {
        text: `Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
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
        effect: ["draw(2)","travelPlus(1)"]
      }
    ]
  },
  {
    id: "5768",
    name: "Count Vertigo",
    image: `${cardArtFolder}/countVertigo.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Arrow",
    hp: "11",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
               Might of the Overlord: Restore all Henchmen to full HP. <span class="line-gap"></span> 
               Reward: KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ascend to my Throne, At Last!`
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
        effect: `damageFoe(999,allHenchmen)`
      }
    ],
    mightNamePrint: [
      {
          text: `Men, To Arms!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`damageFoe(-5,allHenchmen)`]
      }
    ],
  },
  {
    id: "5769",
    name: "Shade",
    image: `${cardArtFolder}/shade.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "7",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'll Just Be on my Way...`
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
    id: "5770",
    name: "Imperiex-Prime",
    image: `${cardArtFolder}/imperiexPrime.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "50",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 3 <span class="line-gap"></span> 
               Might of the Overlord: Destroy the Rightmost City and play the next Enemy from the E&A. <span class="line-gap"></span><span class="line-gap"></span> 
               Teleport <span class="line-gap"></span> 
               Reward: Deal 10 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Behold! Your Death has Arrived!`
      },
      {
        text: `Accept Your Fate!`
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
          effect: `damageOverlord(10)`,
          condition: `uponDefeat`
      }
    ],
    mightNamePrint: [
      {
          text: `Another Universe Falls!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`destroyCity(1)`,`enemyDraw(1,nextEnemy)`]
      }
    ],
  },
  {
    id: "5771",
    name: "Black Adam",
    image: `${cardArtFolder}/blackAdam.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "24",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
                Might of the Overlord: Play 2 Enemies from the E&A. <span class="line-gap"></span><span class="line-gap"></span> 
                  Charge 1 <span class="line-gap"></span> 
                    Reward: Play the next 2 Allies from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Shazam!`
      },
      {
        text: `All Is Right!`
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
        effect: `takeover(2)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `enemyDraw(2,nextAlly)`
      }
    ],
    mightNamePrint: [
      {
          text: `Shazam!`
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
    id: "5772",
    name: "General Eiling",
    image: `${cardArtFolder}/generalEiling.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Bring me Superman!`
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
    id: "5773",
    name: "Dr Light",
    image: `${cardArtFolder}/drLight.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "11",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Don't draw from the Villain Deck next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Behold! The Worst Day of Your Life.`
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
        effect: `disableVillainDraw(1)`
      }
    ]
  },
  {
    id: "5774",
    name: "Felix Faust",
    image: `${cardArtFolder}/felixFaust.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Justice League",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Draw 2, and OPTIONAL : KO the revealed card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `You Will All Serve Me!`
      },
      {
        text: `Reward!`
      },
      {
        text: `KO the top card of the Villain Deck`
      }
    ],
    abilitiesEffects: [
      {
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        condition: `uponDefeat`,
        effect: `draw(2)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: [`koTopVillainDeck(1)`]
      }
    ]
  },
  {
    id: "5775",
    name: "Power Ring",
    image: `${cardArtFolder}/powerRing.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Crime Syndicate",
    hp: "19",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               If you end your turn engaged with Power Ring, he takes 1 Damage. <span class="line-gap"></span> 
               Reward: Your Hero's DT becomes 3 until the end of their next turn, and deal 2 Damage to a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Know My Fear!`
      },
      {
        text: `So Afraid...`
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
        condition: `turnEndEngaged`,
        effect: `damageFoe(1,getCurrentCityIndex)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`setHeroDTtoX(current,3,nextEnd)`,`damageFoe(2,any)`]
      }
    ]
  },
  {
    id: "5776",
    name: "Superwoman",
    image: `${cardArtFolder}/superwoman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Crime Syndicate",
    hp: "22",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 3 <span class="line-gap"></span> 
               Might of the Overlord: Deal 2 Damage to all Heroes (ignoring their Damage Thresholds). <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging Superman. <span class="line-gap"></span> 
               Reward: KO a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Think I'll Keep You...`
      },
      {
        text: `Where Do You Think You're Going?`
      },
      {
          text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `takeover(3)`
      },
      {
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
          type: `quick`,
          condition: `uponDefeat`,
          effect: [`damageFoe(999,any)`]
      },
    ],
    mightNamePrint: [
      {
          text: `No One Can Stop Me!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`damageHero(2,all,ignoreDT)`]
      }
    ],
  },
  {
    id: "5777",
    name: "Owlman",
    image: `${cardArtFolder}/owlman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Crime Syndicate",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: All Heroes lose a random Icon Ability use. <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging Owlman. <span class="line-gap"></span> 
               Reward: Your Hero regains up to 2 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Nothing Matters...`
      },
      {
        text: `Where Do You Think You're Going?`
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
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
          effect: `regainLife(2)`,
          condition: `uponDefeat`
      }
    ],
    mightNamePrint: [
      {
          text: `I Am The Abyss...`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`loseIconUse(1,random,all)`]
      }
    ],
  },
  {
    id: "5778",
    name: "Johnny Quick",
    image: `${cardArtFolder}/johnnyQuick.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Crime Syndicate",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Didn't See That Coming?`
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
    id: "5779",
    name: "Atomica",
    image: `${cardArtFolder}/atomica.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Crime Syndicate",
    hp: "13",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               The first time each turn a Hero uses a card to damage Atomica, they take 1 Damage (ignoring their Damage Thresholds). <span class="line-gap"></span> 
               Reward: Regain 1 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Hiya, Guys!`
      },
      {
        text: `Oops! That was Supposed to Kill You!`
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
        effect: [`regainLife(1)`]
      }
    ]
  },
  {
    id: "5780",
    name: "Devastation",
    image: `${cardArtFolder}/Devastation.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Wonder Woman",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Bring It!`
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
    id: "5781",
    name: "Deathstorm",
    image: `${cardArtFolder}/deathstorm.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Crime Syndicate",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               The first time each turn a Hero uses a card to damage Deathstorm, KO the top card of their deck. <span class="line-gap"></span> 
               Reward: Draw 2, and increase your Hero's Travel Budget by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Hrngg...`
      },
      {
        text: `Wait! Where's My Pants?`
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
        effect: `koHeroTopCard(1,current)`
      },
      {
        condition: `uponDefeat`,
        effect: [`draw(2)`,`travelPlus(1)`]
      }
    ]
  },
  {
    id: "5782",
    name: "Grid",
    image: `${cardArtFolder}/grid.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Crime Syndicate",
    hp: "18",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               While engaged against Grid, your Hero's Icon Abilities are disabled. <span class="line-gap"></span> 
               Reward: Draw 1, and increase your Hero's Travel Budget by 1 for this turn. <span class="line-gap"></span> 
               Also, Scan 1 from the Villain Deck. OPTIONAL : KO the revealed card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Grid Online`
      },
      {
        text: `You - on the other hand - are Offline.`
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
        type: `passive`,
        effect: `disableIconAbilitiesAgainst()`
      },
      {
        condition: `uponDefeat`,
        effect: [`draw(1)`,`travelPlus(1)`,`scanDeck(villain,1)`,`applyScanEffects(ko)`]
      }
    ]
  },
  {
    id: "5783",
    name: "Onomatopoeia",
    image: `${cardArtFolder}/onomatopoeia.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Arrow",
    hp: "7",
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
          effect: `draw(1)`,
          condition: `uponDefeat`
      }
    ]
  },
  {
    id: "5784",
    name: "The Drowned",
    image: `${cardArtFolder}/drowned.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Dark Knight",
    hp: "30",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging The Drowned. <span class="line-gap"></span> 
               Reward: Deal 2 Damage to all Henchmen and Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Drown!`
      },
      {
        text: `I'm Not Trapped With You`
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
        effect: `disableRetreatAgainst()`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageFoe(2,all)`
      }
    ]
  },
  {
    id: "5785",
    name: "The Murder Machine",
    image: `${cardArtFolder}/murderMachine.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Dark Knight",
    hp: "30",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span><span class="line-gap"></span> 
               Heroes cannot use their Icon Abilities when engaging The Murder Machine. <span class="line-gap"></span> 
               Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Thank You, Alfred...`
      },
      {
        text: `Fell For It Again`
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
        type: `passive`,
        effect: `disableIconAbilitiesAgainst()`
      },
      {
        condition: `uponDefeat`,
        effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`]
      }
    ]
  },
  {
    id: "5786",
    name: "The Red Death",
    image: `${cardArtFolder}/redDeath.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Dark Knight",
    hp: "30",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging The Red Death. <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'll Be Quick About It...`
      },
      {
        text: `You're All Mine Now`
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
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
        condition: `uponDefeat`,
        effect: ["draw(2)","travelPlus(1)"]
      }
    ]
  },
  {
    id: "5787",
    name: "The Dawnbreaker",
    image: `${cardArtFolder}/dawnbreaker.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Dark Knight",
    hp: "30",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               All Heroes deal half Damage against The Dawnbreaker. <span class="line-gap"></span> 
               Reward: All Heroes regain up to 2 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Everyone Fears Something...`
      },
      {
        text: `Lights Out.`
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
        type: `passive`,
        effect: `halveIncomingDamageFrom(all)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `regainLife(2,all)`
      }
    ]
  },
  {
    id: "5788",
    name: "The Devastator",
    image: `${cardArtFolder}/devastator.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Dark Knight",
    hp: "30",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Clash <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging The Devastator. <span class="line-gap"></span> 
               Reward: Deal 10 Damage to the Overlord.`
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
        text: `I Will Win!`
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
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(10)`
      }
    ]
  },
  {
    id: "5789",
    name: "The Merciless",
    image: `${cardArtFolder}/merciless.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Dark Knight",
    hp: "30",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging The Merciless. <span class="line-gap"></span> 
               When The Merciless Damages a Hero, that Hero, and all others, takes 1 additional Damage (ignoring their Damage Thresholds). <span class="line-gap"></span> 
               Reward: Deal 10 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `I Will Win!`
      },
      {
        text: `You Will All Pay!`
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
        effect: `disableRetreatAgainst()`
      },
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        effect: `damageHero(1,all,ignoreDT)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(10)`
      }
    ]
  },
  {
    id: "5790",
    name: "Scar",
    image: `${cardArtFolder}/scar.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "15",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: Play the first 2 KO'd Henchmen or Villains. <span class="line-gap"></span> 
               Reward: KO a Henchman.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `The Dead Shall Rise!`
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
        condition: `uponDefeat`,
        effect: `damageFoe(999,anyHenchman)`
      }
    ],
    mightNamePrint: [
      {
          text: `Consume Your Fear! Devour Your Hope!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`reviveKodFoe(2)`]
      }
    ],
  },
  {
    id: "5791",
    name: "Black Hand",
    image: `${cardArtFolder}/blackHand.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "13",
    damage: "2",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: Play the first 2 KO'd Henchmen or Villains. <span class="line-gap"></span> 
               Reward: Permanently KO 3 KO'd Henchmen or Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `William Hand, Rise!`
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
        condition: `uponDefeat`,
        effect: `koFromKO(3)`
      }
    ],
    mightNamePrint: [
      {
          text: `Fallen Soldiers, Rise Again!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`reviveKodFoe(2)`]
      }
    ],
  },
  {
    id: "5792",
    name: "Greed",
    image: `${cardArtFolder}/greed.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Deadly Sin",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `If your Hero ends their turn engaged with Greed, KO the top card of their discard pile. <span class="line-gap"></span> 
               Reward: Restore 2 KO'd Action Cards to your discard pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Mine Mine Mine!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        effect: `koTopHeroDiscard(1,current)`
      },
      {
        condition: `uponDefeat`,
        effect: [`restoreKOdHeroCards(2,current)`]
      }
    ]
  },
  {
    id: "5793",
    name: "Envy",
    image: `${cardArtFolder}/envy.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Deadly Sin",
    hp: "10",
    damage: "0",
    abilitiesText: [
      {
        text: `At the end of a turn in which Envy took Damage, increase his Damage by 1. <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Will Have That!`
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
        effect: [`draw(2)`,`travelPlus(1)`]
      }
    ]
  },
  {
    id: "5794",
    name: "Lust",
    image: `${cardArtFolder}/lust.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Deadly Sin",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `If your Hero ends their turn engaged with Lust, there is a 50% chance they take an additional 1 Damage (ignoring their Damage Threshold). <span class="line-gap"></span> 
               Reward: Regain 1 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Come Closer...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        chance: 0.5,
        effect: `damageHero(1,current,ignoreDT)`
      },
      {
        condition: `uponDefeat`,
        effect: [`regainLife(1)`]
      }
    ]
  },
  {
    id: "5795",
    name: "Gluttony",
    image: `${cardArtFolder}/gluttony.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Deadly Sin",
    hp: "14",
    damage: "1",
    abilitiesText: [
      {
        text: `At the end of a turn in which Gluttony took Damage, increase his Damage by 1. If your Hero ends their turn engaged with Gluttony, KO the top card of their discard pile. <span class="line-gap"></span> 
               Reward: Draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Mmmm, Tasty!`
      },
      {
        text: `Glug, Glug, amirite?`
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
        condition: `turnEndEngaged`,
        effect: `koTopHeroDiscard(1,current)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`draw(1)`]
      }
    ]
  },
  {
    id: "5796",
    name: "Sloth",
    image: `${cardArtFolder}/sloth.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Deadly Sin",
    hp: "14",
    damage: "1",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
               Reward: Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Stay a While...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`freezeVillain(any)`]
      }
    ]
  },
  {
    id: "5797",
    name: "Wrath",
    image: `${cardArtFolder}/wrath.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Deadly Sin",
    hp: "16",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Get Angry!`
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
    id: "5798",
    name: "Fake Kid Flash",
    image: `${cardArtFolder}/fakeKidFlash.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Fake Titan",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Let's See If You Can Keep Up!`
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
    id: "5799",
    name: "Fake Wonder Girl",
    image: `${cardArtFolder}/fakeWonderGirl.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Fake Titan",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `We're Just As Strong As You!`
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
    id: "5800",
    name: "Fake Aqualad",
    image: `${cardArtFolder}/fakeAqualad.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Fake Titan",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Crashing Down!`
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
    id: "5801",
    name: "Fake Speedy",
    image: `${cardArtFolder}/fakeSpeedy.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Fake Titan",
    hp: "9",
    damage: "1",
    abilitiesText: [
      {
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 1 Damage (ignoring their Damage Threshold). <span class="line-gap"></span> 
               Reward: Deal 1 Damage to up to 2 Henchmen or Villains.`
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
        effect: `damageHero(1,random,ignoreDT)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageFoeMulti(1,2,any)`
      }
    ]
  },
  {
    id: "5802",
    name: "Fake Omen",
    image: `${cardArtFolder}/fakeOmen.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Fake Titan",
    hp: "7",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
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
        effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`]
      }
    ]
  },
  {
    id: "5803",
    name: "Fake Robin",
    image: `${cardArtFolder}/fakeRobin.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Fake Titan",
    hp: "8",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Draw 1, and deal 1 Damage to a Henchman or Villain.`
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
        effect: [`draw(1)`,`damageFoe(1,any)`]
      }
    ]
  },
  {
    id: "5804",
    name: "Cyborg Captain Cold",
    image: `${cardArtFolder}/cyborgCaptainCold.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Brother Eye",
    hp: "11",
    damage: "2",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
               Reward: Freeze a Henchman or Villain.`
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
        effect: `hasClash`
      },
      {
        condition: `uponDefeat`,
        effect: `freezeVillain(any)`
      }
    ]
  },
  {
    id: "5805",
    name: "Cyborg Booster Gold",
    image: `${cardArtFolder}/cyborgBoosterGold.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Brother Eye",
    hp: "14",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> Reward: Draw 1, and OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Eye See You!`
      },
      {
        text: `Reward!`
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
        condition: `uponDefeat`,
        effect: `draw(1)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "5806",
    name: "Cyborg Frankenstein",
    image: `${cardArtFolder}/cyborgFrankenstein.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Brother Eye",
    hp: "18",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: KO a Henchman or Villain, and OPTIONAL : Draw from the E&A.`
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
        condition: `uponDefeat`,
        effect: [`damageFoe(999,any)`]
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "5807",
    name: "Cyborg Green Lantern (John Stewart)",
    image: `${cardArtFolder}/cyborgGreenLantern.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Brother Eye",
    hp: "17",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Draw 1 and increase your Hero's Damage Threshold by 1 until the end of their next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `No One Escapes My Sight!`
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
        effect: [`draw(1)`,`increaseHeroDT(currentHero,1,endNextTurn)`]
      }
    ]
  },
  {
    id: "5808",
    name: "Cyborg Batman",
    image: `${cardArtFolder}/cyborgBatman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Brother Eye",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat or use Icon Abilities when engaging Batman. <span class="line-gap"></span> 
               Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Where Do You Think You're Going?`
      },
      {
        text: `What Do You Think You're Doing?`
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
        effect: `disableIconAbilitiesAgainst()`
      },
      {
          effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`],
          condition: `uponDefeat`
      }
    ]
  },
  {
    id: "5809",
    name: "Cyborg Wonder Woman",
    image: `${cardArtFolder}/cyborgWonderWoman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Brother Eye",
    hp: "16",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Eye Am All-Powerful!`
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
    id: "5810",
    name: "Cyborg Superman",
    image: `${cardArtFolder}/cyborgSupermanEye.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Brother Eye",
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
        text: `You Will Soon be Ceased!`
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
        effect: `damageFoe(999,any)`
      }
    ]
  },
  {
    id: "5811",
    name: "Black Lantern Captain Boomerang",
    image: `${cardArtFolder}/blackLanternCaptainBoomerang.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "6",
    damage: "1",
    abilitiesText: [
      {
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 1 Damage. <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Heads Up!`
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
    id: "5812",
    name: "Black Lantern Elongated Man",
    image: `${cardArtFolder}/blackLanternElongatedMan.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "7",
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
    id: "5813",
    name: "Black Lantern Hawk",
    image: `${cardArtFolder}/blackLanternHawk.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "8",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 1 Damage to the Overlord and KO a Henchman.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Why'd You Get All Quiet?`
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
        effect: [`damageOverlord(1)`,`damageFoe(999,anyHenchman)`]
      }
    ]
  },
  {
    id: "5814",
    name: "Black Lantern Blue Beetle (Ted Kord)",
    image: `${cardArtFolder}/blackLanternBlueBeetle.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Regain up to 2 HP.`
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
        effect: `regainLife(2)`
      }
    ]
  },
  {
    id: "5815",
    name: "Black Lantern Green Arrow",
    image: `${cardArtFolder}/blackLanternGreenArrow.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Heroes engaged with Green Arrow cannot use their Icon Abilities. <span class="line-gap"></span> 
                Reward: Draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `C'mon Pretty Bird...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `disableIconAbilitiesAgainst()`
      },
      {
        condition: `uponDefeat`,
        effect: `draw(1)`
      }
    ]
  },
  {
    id: "5816",
    name: "Black Lantern Batman",
    image: `${cardArtFolder}/blackLanternBatman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Heroes engaged with Batman cannot use their Icon Abilities. <span class="line-gap"></span> 
                Reward: Draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Hrkaa...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `disableIconAbilitiesAgainst()`
      },
      {
        condition: `uponDefeat`,
        effect: `draw(1)`
      }
    ]
  },
  {
    id: "5817",
    name: "Black Lantern Terra",
    image: `${cardArtFolder}/blackLanternTerra.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "12",
    damage: "2",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
                Reward: Restore a Destroyed City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Gar... It's Me...`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `hasClash`
      },
      {
        condition: `uponDefeat`,
        effect: `restoreCity(1)`
      }
    ]
  },
  {
    id: "5818",
    name: "Black Lantern Hawkman and Hawkwoman",
    image: `${cardArtFolder}/blackLanternHawkmanAndHawkwoman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "24",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
                Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Guess We're Back Again!`
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
        effect: [`draw(1)`,`travelPlus(1)`]
      }
    ]
  },
  {
    id: "5819",
    name: "Black Lantern Vibe",
    image: `${cardArtFolder}/blackLanternVibe.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "9",
    damage: "2",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
                Reward: Restore a Destroyed City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Radical`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `hasClash`
      },
      {
        condition: `uponDefeat`,
        effect: `restoreCity(1)`
      }
    ]
  },
  {
    id: "5820",
    name: "Black Lantern Titans",
    image: `${cardArtFolder}/blackLanternTitans.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
                 Heroes cannot Retreat when engaging The Titans. <span class="line-gap"></span> 
                   Reward: Draw 2, and increase your Hero's Travel Budget by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Titans, Go!`
      },
      {
        text: `Together Again!`
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
        effect: `disableRetreatAgainst()`
      },
      {
        condition: `uponDefeat`,
        effect: [`draw(2)`,`travelPlus(1)`]
      }
    ],
  },
  {
    id: "5821",
    name: "Black Lantern Professor Zoom",
    image: `${cardArtFolder}/blackLanternProfessorZoom.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Draw 2, and increase your Hero's Travel Budget by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Barry!`
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
        effect: [`draw(2)`,`travelPlus(1)`]
      }
    ],
  },
  {
    id: "5822",
    name: "Black Lantern Aquaman",
    image: `${cardArtFolder}/blackLanternAquaman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: KO a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Behold, a King is Risen!`
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
    ],
  },
  {
    id: "5823",
    name: "Black Lantern Firestorm",
    image: `${cardArtFolder}/blackLanternFirestorm.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "19",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               The first time each turn your Hero deals Damage to Firestorm, KO the top card of their deck. If your Hero ends their turn engaged with Firestorm, KO the top card of their discard pile. <span class="line-gap"></span> 
               Reward: Restore all KO'd cards in your Hero's discard pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'll Eat Your Heart!`
      },
      {
        text: `NaCl`
      },
      {
        text: `Yummy`
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
        effect: `koHeroTopCard(1,current)`
      },
      {
        type: `quick`,
        condition: `turnEndEngaged`,
        effect: `koTopHeroDiscard(1,current)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`restoreKOdHeroCards(50,current)`]
      }
    ]
  },
  {
    id: "5824",
    name: "Black Lantern Wonder Woman",
    image: `${cardArtFolder}/blackLanternWonderWoman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 5 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Your Love Won't Save You!`
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
        effect: [`damageOverlord(5)`]
      }
    ],
  },
  {
    id: "5825",
    name: "Black Lantern Martian Manhunter",
    image: `${cardArtFolder}/blackLanternMartianManhunter.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "18",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Freeze and give Curse 3 to a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Give In!`
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
        effect: [`freezeVillain(any)`,`giveVillainPassive(curse(3),lastFrozen)`]
      }
    ],
  },
  {
    id: "5826",
    name: "Black Lantern Superman",
    image: `${cardArtFolder}/blackLanternSuperman.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "22",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Deal 7 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `You Can't Win!`
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
        effect: [`damageOverlord(7)`]
      }
    ],
  },
  {
    id: "5827",
    name: "Black Lantern Superboy-Prime",
    image: `${cardArtFolder}/blackLanternSuperboyPrime.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "27",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               If your Hero ends their turn engaged with Superboy-Prime, draw from the E&A. <span class="line-gap"></span> 
               Reward: Deal 5 Damage to the Overlord and play the next Ally from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `What's Happening?!`
      },
      {
        text: `Multiversal Upheaval`
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
        condition: `turnEndEngaged`,
        effect: `enemyDraw(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`damageOverlord(5)`,`enemyDraw(1,nextAlly)`]
      }
    ]
  },
  {
    id: "5828",
    name: "Black Lantern Spectre",
    image: `${cardArtFolder}/blackLanternSpectre.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "30",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Clash <span class="line-gap"></span> 
               Reward: Restore all Destroyed Cities.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I am Death's Vengeance!`
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
        condition: `onEntry`,
        effect: `teleport`
      },
      {
        type: `passive`,
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`restoreCity(6)`]
      }
    ]
  },
  {
    id: "5829",
    name: "Black Lantern Anti-Monitor",
    image: `${cardArtFolder}/blackLanternAntiMonitor.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Blackest Night",
    hp: "50",
    damage: "3",
    abilitiesText: [
      {
        text: `Clash <span class="line-gap"></span> 
               Reward: KO all Henchmen and Villains.`
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
        effect: `hasClash`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`damageFoe(999,all)`]
      }
    ]
  },
  {
    id: "5830",
    name: "Batman Beyond",
    image: `${cardArtFolder}/batmanBeyond.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat when engaging Batman Beyond. <span class="line-gap"></span> 
               Reward: CHOOSE: KO a Henchman or Villain OR Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Where Do You Think You're Going?`
      },
      {
          text: `Choose Reward!`
      },
      {
          text: `KO a Foe`
      },
      {
          text: `Freeze a Foe`
      },
    ],
    abilitiesEffects: [
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
          effect: [`damageFoe(999,any)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`freezeVillain(any)`]
      },
    ]
  },
  {
    id: "5831",
    name: "Green Lantern (John Stewart)",
    image: `${cardArtFolder}/johnStewart.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "16",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Your Hero's DT becomes 3 until the end of their next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Light 'em Up!`
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
    id: "5832",
    name: "Red Lantern (Guy Gardner)",
    image: `${cardArtFolder}/guyGardner.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "15",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Deal 1 Damage to all Henchmen, Villains, and the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Hraaa!`
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
        effect: [`damageFoe(1,all)`,`damageOverlord(1)`]
      }
    ]
  },
  {
    id: "5832",
    name: "White Lantern (Kyle Rayner)",
    image: `${cardArtFolder}/whiteLantern.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "25",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Restore all KO'd Heroes to 3 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Don't Make This Harder!`
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
        effect: [`resurrectHero(all,3)`]
      }
    ]
  },
  {
    id: "5833",
    name: "Hawkman",
    image: `${cardArtFolder}/hawkman.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "14",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: 
               Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Fall!`
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
    id: "5834",
    name: "Green Arrow",
    image: `${cardArtFolder}/greenArrow.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "11",
    damage: "2",
    abilitiesText: [
      {
        text: `Heroes engaged with Green Arrow cannot use their Icon Abilities. <span class="line-gap"></span> 
                Reward: Draw 2.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `They're Under My Protection!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `disableIconAbilitiesAgainst()`
      },
      {
        condition: `uponDefeat`,
        effect: `draw(2)`
      }
    ]
  },
  {
    id: "5835",
    name: "Aqualad",
    image: `${cardArtFolder}/aqualad.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Aqualad's Damage increases to 3 whilst he is in a Coastal City. <span class="line-gap"></span> 
                 Reward: Deal 7 Damage to a Henchman or Villain in a Coastal City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Man, I Love Fish! - Aqualad, probably`
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
        effect: `damageFoe(7,anyCoastal)`
      }
    ],
  },
  {
    id: "5836",
    name: "Tempest",
    image: `${cardArtFolder}/tempest.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "18",
    damage: "2",
    abilitiesText: [
      {
        text: `Tempest's Damage increases to 3 whilst he is in a Coastal City. <span class="line-gap"></span> 
                 Reward: Deal 1 Damage to all Henchmen and Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Man, I Love Fish! - Tempest, probably`
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
        effect: `damageFoe(1,all)`
      }
    ],
  },
  {
    id: "5837",
    name: "Mera",
    image: `${cardArtFolder}/mera.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "18",
    damage: "2",
    abilitiesText: [
      {
        text: `Mera's Damage increases to 3 whilst she is in a Coastal City. <span class="line-gap"></span> 
                 Reward: Deal 2 Damage to all Henchmen and Villains.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Man, I Love Fish! - Mera, probably`
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
        effect: `damageFoe(2,all)`
      }
    ],
  },
  {
    id: "5838",
    name: "Lobo",
    image: `${cardArtFolder}/lobo.png`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "22",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 9 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Frag It!`
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
        effect: `damageOverlord(9)`
      }
    ]
  },
  {
    id: "5839",
    name: "Supergirl",
    image: `${cardArtFolder}/supergirl.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "22",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 4 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Hey Ugly!`
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
        effect: `damageOverlord(4)`
      }
    ]
  },
  {
    id: "5840",
    name: "Superboy",
    image: `${cardArtFolder}/superboy.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Draw 2, and increase your Hero's Travel Budget by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `My Turn!`
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
        effect: [`draw(2)`,`travelPlus(1)`]
      }
    ]
  },
  {
    id: "5841",
    name: "Beast Boy",
    image: `${cardArtFolder}/beastBoy.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "13",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Add 1 card from your Hero's deck to your hand.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Animal Style!`
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
        effect: [`add(1,current)`]
      }
    ]
  },
  {
    id: "5842",
    name: "Blue Beetle",
    image: `${cardArtFolder}/blueBeetle.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Clash <span class="line-gap"></span> 
               Heroes cannot Retreat when engaging Blue Beetle. <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
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
        text: `Bug, Keep Them Here!`
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
        effect: `hasClash`
      },
      {
        type: `passive`,
        effect: `disableRetreatAgainst()`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(3)`
      }
    ]
  },
  {
    id: "5843",
    name: "Jason Blood",
    image: `${cardArtFolder}/jasonBlood.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "5",
    damage: "1",
    abilitiesText: [
      {
        text: `If Jason Blood escapes, Etrigan enters the board. <span class="line-gap"></span> 
               Reward: Draw 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Gone gone, the form of man!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `onEscape`,
        effect: `drawSpecificVillain(5708)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`draw(1)`]
      }
    ]
  },
  {
    id: "5844",
    name: "Lex Luthor",
    image: `${cardArtFolder}/lexLuthor.png`,
    type: "Villain",
    doNotShow: "false",
    hero: "Superman",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: All Heroes lose a random Icon Ability use. <span class="line-gap"></span> 
               Reward: KO a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Must I Do Everything Myself?`
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
          effect: `damageFoe(999,any)`,
          condition: `uponDefeat`
      }
    ],
    mightNamePrint: [
      {
          text: `Metropolis is Mine!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`loseIconUse(1,random,all)`]
      }
    ],
  },
  {
    id: "5845",
    name: "Miss Martian",
    image: `${cardArtFolder}/missMartian.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "17",
    damage: "2",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span><span class="line-gap"></span> 
               Reward: Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO the revealed card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Surrender!`
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
    id: "5846",
    name: "Nightwing",
    image: `${cardArtFolder}/nightwing.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "11",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Flying High!`
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
        effect: [`damageOverlord(2)`]
      }
    ]
  },
  {
    id: "5847",
    name: "Red Hood",
    image: `${cardArtFolder}/redHood.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "12",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Coming Through!`
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
        effect: [`damageOverlord(3)`]
      }
    ]
  },
  {
    id: "5848",
    name: "Starfire",
    image: `${cardArtFolder}/starfire.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "17",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Deal 7 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Yield!`
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
        effect: [`damageOverlord(7)`]
      }
    ]
  },
  {
    id: "5849",
    name: "Wonder Girl",
    image: `${cardArtFolder}/wonderGirl.png`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "20",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Deal 2 Damage to the Overlord and Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Just Give Up!`
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
        effect: [`damageOverlord(2)`,`freezeVillain(any)`]
      }
    ]
  },
  {
    id: "5850",
    name: "Sinestro",
    image: `${cardArtFolder}/sinestro.jpg`,
    type: "Villain",
    doNotShow: "false",
    hero: "Green Lantern",
    hp: "18",
    damage: "3",
    abilitiesText: [
      {
        text: `Takeover 2 <span class="line-gap"></span> 
               Might of the Overlord: KO the top card of every Hero's deck. <span class="line-gap"></span> 
               Teleport <span class="line-gap"></span> 
               Reward: KO all Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Can Practically Taste Your Fear...`
      },
      {
        text: `Give In To Your Fears!`
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
        effect: `takeover(2)`
      },
      {
          effect: `damageFoe(999,allHenchmen)`,
          condition: `uponDefeat`
      }
    ],
    mightNamePrint: [
      {
          text: `Sinestro's Might!`
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
    id: "5851",
    name: "Red Robin",
    image: `${cardArtFolder}/redRobin.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "10",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Draw 1, and your Hero's Travel Budget permanently increases by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I'll Scout Ahead!`
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
        effect: [`draw(1)`,`travelPlus(1,permanent)`]
      }
    ]
  },
  {
    id: "5852",
    name: "Arsenal",
    image: `${cardArtFolder}/arsenal.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "12",
    damage: "2",
    abilitiesText: [
      {
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 2 Damage. <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
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
        effect: `damageHero(2,random)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: `enemyDraw(1)`
      }
    ]
  },
  {
    id: "5853",
    name: "Artemis",
    image: `${cardArtFolder}/artemis.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "10",
    damage: "2",
    abilitiesText: [
      {
        text: `If unengaged at the end of a Hero's turn, a random Hero will take 1 Damage. <span class="line-gap"></span> 
               Reward: OPTIONAL : Draw from the E&A.`
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
    id: "5854",
    name: "Kid Flash",
    image: `${cardArtFolder}/kidFlash.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "12",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 2 <span class="line-gap"></span> 
               Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Totally Crash`
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
    id: "5855",
    name: "Batgirl",
    image: `${cardArtFolder}/batgirl.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "14",
    damage: "2",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat when engaging Batgirl. <span class="line-gap"></span> 
               Reward: CHOOSE: KO a Henchman or Villain in Gotham OR Freeze a Henchman or Villain.`
      }
    ],
    abilitiesNamePrint: [
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
    ]
  },
  {
    id: "5856",
    name: "Donna Troy",
    image: `${cardArtFolder}/donnaTroy.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "21",
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
    id: "5857",
    name: "Vixen",
    image: `${cardArtFolder}/vixen.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> 
               Reward: Add 1 card from your Hero's deck to your hand.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Speed of a Cheetah!`
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
        effect: [`add(1,current)`]
      }
    ]
  },
  {
    id: "5858",
    name: "Raven",
    image: `${cardArtFolder}/raven.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "20",
    damage: "3",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span> 
               Reward: Draw 1, and your Hero's Travel Budget permanently increases by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Azarath, Metrion, Zinthos!`
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
        effect: [`draw(1)`,`travelPlus(1,permanent)`]
      }
    ]
  },
  {
    id: "5859",
    name: "Omen",
    image: `${cardArtFolder}/omen.jpg`,
    type: "Villain",
    doNotShow: "true",
    hero: "Legion of Doom",
    hp: "13",
    damage: "1",
    abilitiesText: [
      {
        text: `Teleport <span class="line-gap"></span><span class="line-gap"></span> 
               Reward: Scan 2 from the Villain Deck. <span class="line-gap"></span> OPTIONAL : KO your choice of the revealed cards.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Know Your Moves Before You Do!`
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
        effect: [`scanDeck(villain,2)`,`applyScanEffects(ko,closeAfter(2))`]
      }
    ]
  },
]