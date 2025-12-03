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
    doNotShow: "true",
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
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
          text: `Damage a Henchman or Villain`
      }
  ],
  abilitiesEffects: [
      {
          type: `chooseOption()`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`draw(1)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`damageVillain(any,2)`]
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
        text: `Reward!`
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
        text: `[ICON:Super] Heroes deal half Damage against Metallo. <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
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
        condition: `none`,
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
        type: `uponDefeat`,
        effect: [`scanDeck(villain,1)`,`applyKoCancel(scanned(villain))`]
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
        text: `At the end of a turn in which Parasite took Damage, increase his Damage by 1. <span class="line-gap"></span> Reward: Deal 3 Damage to up to 2 Henchmen or Villains.`
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
        condition: `turnEndWasDamaged()`,
        effect: `increaseVillainDamage(1)`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: [`damageVillain(any,3)`,`damageVillain(any,3)`]
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
        text: `Glide`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasGlide()`
      },
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
        text: `Reward!`
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
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
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
        text: `Glide <span class="line-gap"></span> Reward: OPTIONAL : Draw from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Glide`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasGlide()`
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
    damage: "2",
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
        text: `Charge 1, Glide <span class="line-gap"></span> Reward: Your Hero's Travel Budget increases by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Glide`
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
        effect: `hasGlide()`
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
    doNotShow: "true",
    hero: "Batman",
    hp: "3",
    damage: "1",
    abilitiesText: [
      {
        text: `Takeover 1 <span class="line-gap"></span> 
                Might of the Overlord: Play the Henchmen and Villains amongst the next 5 cards in the Villain Deck. <span class="line-gap"></span><span class="line-gap"></span> 
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
        effect: `koVillain(henchman,all)`
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
        effect: [`drawOnlyHenchVillains(5)`]
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
        text: `Glide <span class="line-gap"></span> Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Glide`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasGlide()`
      },
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
        effect: `damageHero(random,2)`
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
        type: `passive`,
        condition: `damaged`,
        effect: `logDamageCheckDamage`
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
        effect: `lockVillain(any,1)`
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
        text: `Glide`
      },
      {
        text: `Zap!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasGlide()`
      },
      {
        type: `quick`,
        condition: `turnEndNotEngaged`,
        effect: `damageHero(random,2)`
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
          type: `chooseOption()`,
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
        effect: `lockVillain(any,999)`
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
        condition: `travelsTo(Keystone)`,
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
        effect: `damageVillain(all,2)`
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
        effect: `hasClash()`
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
        text: `I Am Your Downfall!`
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
        effect: `takeover(1)`
      },
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
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasClash()`
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
        effect: `hasEject()`
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
        text: `Glide <span class="line-gap"></span> Reward: Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Glide`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasGlide()`
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
        text: `Glide <span class="line-gap"></span> Reward: Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Glide`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasGlide()`
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
          type: `chooseOption()`,
          condition: `uponDefeat`
      },
      {
          type: `chooseOption(1)`,
          effect: [`restoreCity()`]
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
        text: `Glide <span class="line-gap"></span> The first time each turn a Hero uses a card to damage Shadow Thief, they take 1 Damage. <span class="line-gap"></span> Reward: OPTIONAL : Draw 3, and Travel to engage the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Glide`
      },
      {
        text: `Caught Off-Guard!`
      },
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        effect: `hasGlide()`
      },
      {
        type: `passive`,
        condition: `firstAttackPerTurn()`,
        effect: `damageAttacker(1)`
      },
      {
        type: `optional`,
        condition: `uponDefeat`,
        effect: ["draw(3)","travelTo(Overlord)"]
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
        condition: `none`,
        effect: [`halfDamage(Bat)`,`halfDamage(Arrow)`,`halfDamage(Hawk)`]
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(2*getOverlordLevel())`
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
        text: `Takeover 2 <span class="line-gap"></span> Might of the Overlord: Play the next 2 Enemies from the E&A. <span class="line-gap"></span><span class="line-gap"></span> Teleport <span class="line-gap"></span> Reward: Deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Where Did She Go?`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`drawEnemy(2)`]
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
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndNotEngaged`,
        effect: `damageHero(random,1)`
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
        text: `Charge 1, Glide <span class="line-gap"></span> 
               Reward: Deal 20 Damage to the Overlord. <span class="line-gap"></span> 
               If Ultraman Escapes: Deal 3 Damage to all Heroes.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Charge!`
      },
      {
        text: `Glide`
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
        type: `passive`,
        condition: `none`,
        effect: `hasGlide()`
      },
      {
        type: `quick`,
        condition: `uponDefeat`,
        effect: `damageOverlord(20)`
      },
      {
        type: `quick`,
        condition: `onEscape`,
        uses: `999`,
        effect: `damageHero(all,3)`
      }
    ]
  },
]