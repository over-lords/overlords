const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/c0f0e43b31e3dc2e16f3e616d8c970849c114d3e/Public/Images/Card%20Assets/HeroCards"

export const heroes = [
  {
    id: "1",
    name: "Superman",
    image: `${cardArtFolder}/Superman.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "blue",
    teams: ["Super","Justice League"],
    hp: "18",
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
        type: `quick`,
        condition: `damageSelf`,
        uses: `3`,
        shared: `yes`,
        effect: `ignoreDamage`
      },
      {
        type: `quick`,
        condition: `damageOther`,
        uses: `3`,
        shared: `yes`,
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
        text: `3/Game: Once per turn, Deal 2 Damage to all Henchmen and Villains in Cities.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Deal 2 Damage to all Henchmen and Villains`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageVillain(all,2)`
      }
    ]
  },
  {
    id: "3",
    name: "Martian Manhunter",
    image: `${cardArtFolder}/Martian Manhunter.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "red",
    teams: ["Martian","Justice League"],
    hp: "15",
    damageThreshold: "3",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Martian Manhunter can ignore taking Damage, after he cannot deal Damage until the end of his next turn. <span class="line-gap"></span> If Martian Manhunter is at Headquarters, all other Heroes within the Headquarters cannot take Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore the Damage`
      },
      {
        text: `Protect others at Base`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `3`,
        shared: `no`,
        effect: `ignoreDamageSleepHero`
      },
      {
        type: `passive`,
        condition: `in(Headquarters)`,
        uses: `0`,
        shared: `no`,
        effect: `nearbyProtected(Headquarters)`
      }
    ]
  },
  {
    id: "4",
    name: "Shazam",
    image: `${cardArtFolder}/Shazam.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "red",
    teams: ["Shazam","Justice League"],
    hp: "14",
    damageThreshold: "3",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, deal 10 Damage to a Henchman or Villain, after this Hero cannot deal Damage until the end of his next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Damage Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageOneVillainSleepHero(10)`
      }
    ]
  },
  {
    id: "5",
    name: "Hawkwoman",
    image: `${cardArtFolder}/Hawkwoman.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "orange",
    teams: ["Hawk","Justice League"],
    hp: "13",
    damageThreshold: "1",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, if Hawkwoman reduces a Henchman or Villain to 2 or less HP, she can KO it. <span class="line-gap"></span> If Hawkman is active, increase this card's Damage Threshold by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `KO Henchman or Villain`
      },
      {
        text: `Hawkman DT Bonus`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damagedVillain(2)`,
        uses: `3`,
        shared: `no`,
        effect: `koDamagedVillain`
      },
      {
        type: `passive`,
        condition: `isActive(Hawkman)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDTby1ifHawkmanActive`
      }
    ]
  },
  {
    id: "6",
    name: "Black Canary",
    image: `${cardArtFolder}/Black Canary.png`,
    type: "Hero",
    category: "Guardian",
    color: "green",
    teams: ["Arrow","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `3/Game: At the start of your turn, after your initial Travel (if performed) but before your draw selection, deal 10 Damage to the Henchman, Villain, or Overlord that you are facing, afterwards Black Canary cannot deal Damage until the start of her next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Damage Opposing Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `startAfterTravel`,
        uses: `3`,
        shared: `no`,
        effect: `damageOppSleepHero(10)`
      }
    ]
  },
  {
    id: "7",
    name: "Mera",
    image: `${cardArtFolder}/Mera.png`,
    type: "Hero",
    category: "Guardian",
    color: "green",
    teams: ["Aqua","Justice League"],
    hp: "14",
    damageThreshold: "1",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Mera's Damage Threshold is increased by 1 whilst she is in a Coastal City. <span class="line-gap"></span> 3/Game: Once per turn, double the Damage of another Hero's card used while their Target is within a Coastal City. <span class="line-gap"></span> If this Hero is KO'd, KO the Henchman or Villain she was facing.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Double card's Damage`
      },
      {
        text: `Increase Damage Threshold by 1 in Coastal City`
      },
      {
        text: `Was defeated`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `allyAttacks(Coastal)`,
        uses: `3`,
        shared: `no`,
        effect: `doubleAllysDamage`
      },
      {
        type: `passive`,
        condition: `in(Coastal)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamageThreshold(1)`
      },
      {
        type: `quick`,
        condition: `wasKOd`,
        uses: `0`,
        shared: `no`,
        effect: `koOPP`
      }
    ]
  },
  {
    id: "8",
    name: "Red Lantern (Guy Gardner)",
    image: `${cardArtFolder}/Guy Gardner.png`,
    type: "Hero",
    category: "Guardian",
    color: "red",
    teams: ["Green Lantern","Justice League"],
    hp: "13",
    damageThreshold: "1",
    retreat: "5",
    travel: "3",
    abilitiesText: [
      {
        text: `2/Game: Once per turn, Deal 6 Damage to any one Henchmen or Villain in a City. <span class="line-gap"></span> 3/Game: Once per turn, KO the top 4 cards of your deck to regain 4 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Deal 6 Damage to one Henchmen or Villain`
      },
      {
        text: `KO the top 4 cards of your Deck to Regain 4 HP`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `damageVillain(Choice(Any),6)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `koFromTopRegainHP(4,4)`
      }
    ]
  },
  {
    id: "9",
    name: "Donna Troy",
    image: `${cardArtFolder}/Donna Troy.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "ivory",
    teams: ["Wonder","Titans"],
    hp: "14",
    damageThreshold: "3",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: After damaging them, Lock a Henchman or Villain in their City, after she can Retreat without rolling.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Lock them in the City`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `hasDamagedVillain`,
        uses: `3`,
        shared: `no`,
        effect: `lockVillain(999)`
      },
      {
        type: `quick`,
        condition: `usedOtherFaceAbility`,
        uses: `999`,
        shared: `no`,
        effect: `retreatFree`
      }
    ]
  },
  {
    id: "10",
    name: "Starfire",
    image: `${cardArtFolder}/Starfire.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "orange",
    teams: ["Titans"],
    hp: "14",
    damageThreshold: "3",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `All Henchmen and Villains damaged by Starfire during her turn take 1 additional Damage at the end of her turns. <span class="line-gap"></span> 3/Game: Once per turn, move all unengaged Henchmen and Villains as far right as possible.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Burn them`
      },
      {
        text: `Move all unengaged to the right`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `endTurn`,
        uses: `0`,
        shared: `no`,
        effect: `burnDamaged(1)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `moveUnengagedRight(Max)`
      }
    ]
  },
  {
    id: "11",
    name: "Beast Boy",
    image: `${cardArtFolder}/Beast Boy.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "green",
    teams: ["Titans"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `5/Game: Discard 1, Draw 1. <span class="line-gap"></span> 1/Game: Discard 1, Retrieve 1 from Beast Boy's discard pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Discard 1, Draw 1`
      },
      {
        text: `Discard 1, Retrieve 1`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `5`,
        shared: `no`,
        effect: `discardXdrawX(1,1)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `discardXretrieveX(1,1)`
      }
    ]
  },
  {
    id: "12",
    name: "Superboy",
    image: `${cardArtFolder}/Superboy.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "red",
    teams: ["Super","Titans"],
    hp: "15",
    damageThreshold: "3",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `Superboy can use his cards to Damage the Henchmen and Villains in Adjacent Cities, however the additional effects of those cards are negated. <span class="line-gap"></span> 2/Game: Superman can ignore taking Damage, or he can Protect another Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Use cards against Adjacent Henchmen and Villains`
      },
      {
        text: `Ignore the Damage`
      },
      {
        text: `Protect another Hero`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `useCardsVsAdjacentNegateEffects`
      },
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `3`,
        shared: `yes`,
        effect: `ignoreDamage`
      },
      {
        type: `quick`,
        condition: `damageOther`,
        uses: `3`,
        shared: `yes`,
        effect: `protectHero`
      }
    ]
  },
  {
    id: "13",
    name: "Swamp Thing",
    image: `${cardArtFolder}/Swamp Thing.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "green",
    teams: ["Dark"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `As Swamp Thing leaves a City, he can leave behind an unused card. Unused cards trigger and act as if played against the next Henchman or Villain that enters that City. <span class="line-gap"></span> 1/Game: Restore a Destroyed City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Leave a card`
      },
      {
        text: `Restore Destroyed City`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `leaveCity`,
        uses: `999`,
        shared: `no`,
        effect: `leaveCard`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `restoreDestroyedCity`
      }
    ]
  },
  {
    id: "14",
    name: "Jason Blood",
    image: `${cardArtFolder}/Jason Blood.jpeg`,
    type: "Hero",
    category: "Guardian",
    color: "DarkRed",
    teams: ["Dark"],
    hp: "9",
    damageThreshold: "1",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `1/Game: Return a Henchman or Villain in a City to the top of the Villain Deck. <span class="line-gap"></span> If Jason Blood is reduced to 4 or fewer HP, he transforms into Etrigan.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Return Henchman or Villain`
      },
      {
        text: `Become Etrigan`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `returnVillain`
      },
      {
        type: `passive`,
        condition: `reducedHP(4)`,
        uses: `0`,
        shared: `no`,
        effect: `transformHero(Etrigan)`
      }
    ]
  },
  {
    id: "15",
    name: "Etrigan",
    image: `${cardArtFolder}/Etrigan.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "yellow",
    teams: ["Dark"],
    hp: "9",
    damageThreshold: "2",
    retreat: "5",
    travel: "2",
    abilitiesText: [
      {
        text: `This is not a selectable Hero. Jason Blood transforms into Etrigan at low HP. <span class="line-gap"></span> 3/Game: Once per turn, Deal 5 Damage to any one Henchmen or Villain in a City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Deal 5 Damage to one Henchmen or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageVillain(Choice(Any),5)`
      }
    ]
  },
  {
    id: "16",
    name: "Lobo",
    image: `${cardArtFolder}/Lobo.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "ivory",
    teams: ["Lobo"],
    hp: "15",
    damageThreshold: "3",
    retreat: "5",
    travel: "1",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> 3/Game: If Lobo Damages a Villain, he can regain the Damage amount as HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Regain HP equal to Damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `quick`,
        condition: `hasDamagedVillain`,
        uses: `3`,
        shared: `no`,
        effect: `regainHPEqualToDamage`
      }
    ]
  },
  {
    id: "18",
    name: "King Shark",
    image: `${cardArtFolder}/King Shark.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "aqua",
    teams: ["Squad"],
    hp: "15",
    damageThreshold: "3",
    retreat: "5",
    travel: "1",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> King Shark's damaging Action Cards deal 1 additional Damage whilst he is in a Coastal City. <span class="line-gap"></span> 1/Game: Deal 5 Damage to a Henchman or Villain in either Coastal City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Increase 1+ Damage Cards while on Coast`
      },
      {
        text: `Damage Coastal Villain by 2`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `passive`,
        condition: `in(Coastal)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `damageVillain(Choice(Coastal),5)`
      }
    ]
  },
  {
    id: "19",
    name: "Reverse Flash",
    image: `${cardArtFolder}/Reverse Flash.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "yellow",
    teams: ["Flash","Squad","Legion"],
    hp: "11",
    damageThreshold: "2",
    retreat: "3",
    travel: "3",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> Reverse Flash's damaging Action Cards deal 1 additional Damage equal to the number of times he has Traveled that turn. <span class="line-gap"></span> 3/Game: At the start of this Hero's turn, you can retrieve a card from Reverse Flash's discard pile instead of selecting a card from the deck.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Skip Selection, Retrieve 1`
      },
      {
        text: `Increase 1+ Damage Cards By 1 Per Travel`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `quick`,
        condition: `wouldDrawAtStart`,
        uses: `3`,
        shared: `no`,
        effect: `skipSelectionRetrieve1`
      },
      {
        type: `passive`,
        condition: `Travel`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      }
    ]
  },
  {
    id: "20",
    name: "Lex Luthor",
    image: `${cardArtFolder}/Lex Luthor.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "blue",
    teams: ["Legion","Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `Once per turn, if Lex Luthor reduces a Henchman or Villain to 1 HP, he can KO it. <span class="line-gap"></span> 3/Game: KO the top 3 cards of Lex Luthor's deck, after KO the Henchman or Villain that Lex Luthor is in a City with, no one gains their Upon Victory effect.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `KO Damaged Foe`
      },
      {
        text: `KO your cards to KO a Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damagedVillain(1)`,
        uses: `999`,
        shared: `no`,
        effect: `koDamagedVillain`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `koTopXKOFoe(3)`
      }
    ]
  },
  {
    id: "21",
    name: "Giganta",
    image: `${cardArtFolder}/Giganta.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "yellow",
    teams: ["Legion","Squad"],
    hp: "12",
    damageThreshold: "2",
    retreat: "5",
    travel: "2",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> If Giganta is at to 6 or less HP, increase the Damage of her cards by 1. <span class="line-gap"></span> Giganta can use her cards to Damage the Henchmen and Villains in Adjacent Cities, however the additional effects of those cards are negated. <span class="line-gap"></span> 2/Game: Once per turn, knock the Henchman or Villain Giganta is fighting as far right as possible, she can then follow them or Retreat.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Power up at half HP`
      },
      {
        text: `Use cards against Adjacent Henchmen and Villains`
      },
      {
        text: `Move Engaged Foe to the Right`
      },
      {
        text: `Follow or Retreat`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `passive`,
        condition: `isBelowHP(7)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      },
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `useCardsVsAdjacentNegateEffects`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `yes`,
        effect: `moveEngagedRight(Max)`
      },
      {
        type: `quick`,
        condition: `usedSharedEffect`,
        uses: `2`,
        shared: `yes`,
        effect: `followOrRetreat`
      }
    ]
  },
  {
    id: "23",
    name: "Wonder Woman",
    image: `${cardArtFolder}/Wonder Woman.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Wonder","Justice League"],
    hp: "13",
    damageThreshold: "3",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `2/Game: Once per turn, Lock any Henchman or Villain in their City. <span class="line-gap"></span> 1/Game: Double the Damage of a card, and if you do, ignore any additional effects it has.`
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
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `lockVillain(999)`
      },
      {
        type: `quick`,
        condition: `useDamageCard`,
        uses: `1`,
        shared: `no`,
        effect: `ignoreTextDoubleDamage`
      }
    ]
  },
  {
    id: "24",
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
        text: `Flash's damaging Action Cards deal 1 additional Damage equal to the number of times he has Traveled that turn. <span class="line-gap"></span> 2/Game: At the start of this Hero's turn, you can draw 2 instead of selecting a card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Skip Selection, Draw 2`
      },
      {
        text: `Increase 1+ Damage Cards By 1 Per Travel`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `wouldDrawAtStart`,
        uses: `2`,
        shared: `no`,
        effect: `skipSelectionDraw2`
      },
      {
        type: `passive`,
        condition: `Travel`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      }
    ]
  },
  {
    id: "25",
    name: "Aquaman",
    image: `${cardArtFolder}/Aquaman.jpg`,
    type: "Hero",
    category: "Striker",
    color: "orange",
    teams: ["Aqua","Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Aquaman's damaging Action Cards deal 1 additional Damage whilst he is in a Coastal City. <span class="line-gap"></span> 3/Game: Once per turn, you can deal 2 Damage to a Henchman or Villain in either Coastal City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Increase 1+ Damage Cards while on Coast`
      },
      {
        text: `Damage Coastal Villain by 2`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `in(Coastal)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageVillain(Choice(Coastal),2)`
      }
    ]
  },
  {
    id: "26",
    name: "Hawkman",
    image: `${cardArtFolder}/Hawkman.jpg`,
    type: "Hero",
    category: "Striker",
    color: "orange",
    teams: ["Hawk","Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `2/Game: Hawkman can ignore taking Damage, after he draws 1 card. <span class="line-gap"></span> If Hawkwoman is active, Hawkman's damaging Action Cards deal 1 additional Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore Damage, then Draw 1`
      },
      {
        text: `Increase Damage by 1 If Hawkwoman Active`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `2`,
        shared: `no`,
        effect: `ignoreDamageDraw1`
      },
      {
        type: `passive`,
        condition: `isActive(Hawkwoman)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      }
    ]
  },
  {
    id: "27",
    name: "Supergirl",
    image: `${cardArtFolder}/Supergirl.jpg`,
    type: "Hero",
    category: "Striker",
    color: "blue",
    teams: ["Super","Justice League"],
    hp: "14",
    damageThreshold: "3",
    retreat: "3",
    travel: "3",
    abilitiesText: [
      {
        text: `2/Game: Supergirl can ignore taking Damage, or she can Protect another Hero. <span class="line-gap"></span> 1/Game: Rescue the Captured Bystanders from any one Henchman or Villain in a City and deal 2 Damage to the capturing card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore the Damage`
      },
      {
        text: `Protect another Hero`
      },
      {
        text: `Rescue Bystander and Damage Capturer`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `2`,
        shared: `yes`,
        effect: `ignoreDamage`
      },
      {
        type: `quick`,
        condition: `damageOther`,
        uses: `2`,
        shared: `yes`,
        effect: `protectHero`
      },
      {
        type: `standard`,
        condition: `villainHasBystander`,
        uses: `1`,
        shared: `no`,
        effect: `rescueBystanderDamageCapturer(2)`
      }
    ]
  },
  {
    id: "28",
    name: "Firestorm",
    image: `${cardArtFolder}/Firestorm.jpg`,
    type: "Hero",
    category: "Striker",
    color: "orange",
    teams: ["Justice League"],
    hp: "14",
    damageThreshold: "1",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, you can shuffle any number of cards from your hand back into your deck, then draw the same number.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Shuffle Cards and Redraw`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `shuffleChoiceCardsRedraw`
      }
    ]
  },
  {
    id: "29",
    name: "Vixen",
    image: `${cardArtFolder}/Vixen.jpg`,
    type: "Hero",
    category: "Striker",
    color: "goldenrod",
    teams: ["Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: After playing from the Villain Deck, but before deciding where Vixen will act, you can increase this Hero's draw selection pool to 5 options, and choose before moving.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw early, and with more choices`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `afterVillainBeforeTravel`,
        uses: `3`,
        shared: `no`,
        effect: `extendView(self,5)`
      }
    ],
  },
  {
    id: "30",
    name: "White Lantern",
    image: `${cardArtFolder}/White Lantern.jpg`,
    type: "Hero",
    category: "Striker",
    color: "ivory",
    teams: ["Green Lantern","Justice League"],
    hp: "15",
    damageThreshold: "3",
    retreat: "3",
    travel: "3",
    abilitiesText: [
      {
        text: `1/Game: Return a KO'd Hero to full HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Restore a KO'd Hero`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `resurrectHero`
      }
    ]
  },
  {
    id: "31",
    name: "Red Hood",
    image: `${cardArtFolder}/Red Hood.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Bat","Titans"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> 3/Game: Once per turn, KO any one Henchman in a City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `KO a Henchman`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `koHenchman`
      }
    ]
  },
  {
    id: "32",
    name: "Arsenal",
    image: `${cardArtFolder}/Arsenal.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Arrow","Titans"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Arsenal can use his cards to Damage the Henchmen and Villains in Adjacent Cities, however the additional effects of those cards are negated. <span class="line-gap"></span> 3/Game: Arsenal can use any number of cards to Damage the Overlord without Traveling, however the additional effects of those cards are negated.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Use cards against Adjacent Henchmen and Villains`
      },
      {
        text: `Attack the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `useCardsVsAdjacentNegateEffects`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `attackOverlordNoTravelNegateEffects`
      }
    ]
  },
  {
    id: "33",
    name: "Tempest",
    image: `${cardArtFolder}/Tempest.jpg`,
    type: "Hero",
    category: "Striker",
    color: "blue",
    teams: ["Aqua","Titans"],
    hp: "12",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Tempest's Damage Threshold increases by 1, and his damaging Action Cards deal 1 additional Damage, whilst he is in a Coastal City. <span class="line-gap"></span> 1/Game: KO a Henchman, or Villain with 4 or less HP, in either Coastal City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `KO Coastal Henchmen or Villain`
      },
      {
        text: `Increase 1+ Damage Cards while on Coast`
      },
      {
        text: `Increase Damage Threshold +1 while on Coast`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `in(Coastal)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      },
      {
        type: `passive`,
        condition: `in(Coastal)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamageThreshold(1)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `koVillain(Choice(Coastal))`
      }
    ]
  },
  {
    id: "34",
    name: "Miss Martian",
    image: `${cardArtFolder}/Miss Martian.jpg`,
    type: "Hero",
    category: "Striker",
    color: "green",
    teams: ["Martian","Titans"],
    hp: "12",
    damageThreshold: "2",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `Once per turn, you can look at the top card of the Villain Deck. <span class="line-gap"></span> 1/Game: At the start of her turn, before her travel or draw, Miss Martian can deal 3 Damage to all Henchmen, Villains, and the Overlord, and also prevent the Villain Deck from being drawn from next turn. After, Miss Martian cannot deal damage until after the end of her next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Check the Villain Deck`
      },
      {
        text: `Clear the field`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `999`,
        shared: `yes`,
        effect: `revealTop(Villain)`
      },
      {
        type: `quick`,
        condition: `beforeTravel`,
        uses: `1`,
        shared: `no`,
        effect: `damageVillain(all,3),damageOverlord(3),preventVillainDeckDraw,sleepHero(2)`
      }
    ]
  },
  {
    id: "35",
    name: "Wonder Girl",
    image: `${cardArtFolder}/Wonder Girl.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Wonder","Titans"],
    hp: "12",
    damageThreshold: "3",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `Villains deal 1 additional Damage to this Hero. Henchmen cannot Damage this Hero. <span class="line-gap"></span> 3/Game: Wonder Girl can ignore taking Damage, or she can Protect another Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Takes 1 Extra from Villains`
      },
      {
        text: `Henchmen do nothing`
      },
      {
        text: `Ignore the Damage`
      },
      {
        text: `Protect another Hero`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `villainAttacks`,
        uses: `0`,
        shared: `no`,
        effect: `tempIncreaseVillainDamage(1)`
      },
      {
        type: `passive`,
        condition: `henchmanAttacks`,
        uses: `0`,
        shared: `no`,
        effect: `tempDecreaseVillainDamage(3)`
      },
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `3`,
        shared: `yes`,
        effect: `ignoreDamage`
      },
      {
        type: `quick`,
        condition: `damageOther`,
        uses: `3`,
        shared: `yes`,
        effect: `protectHero`
      }
    ]
  },
  {
    id: "36",
    name: "Blue Beetle",
    image: `${cardArtFolder}/Blue Beetle.jpg`,
    type: "Hero",
    category: "Striker",
    color: "blue",
    teams: ["Titans"],
    hp: "11",
    damageThreshold: "3",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `1/Game: Deal 10 Damage to any one Henchmen or Villain in a City. <span class="line-gap"></span> 1/Game: At the start of a turn, prevent the Villain Deck from being drawn from. <span class="line-gap"></span> 1/Game: Lock any Henchman or Villain in their City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Deal 10 Damage to one Henchmen or Villain`
      },
      {
        text: `Prevent Villain Deck draw`
      },
      {
        text: `Lock a Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `10`,
        shared: `no`,
        effect: `damageVillain(Choice(Any),10)`
      },
      {
        type: `quick`,
        condition: `villainDeckWouldDraw`,
        uses: `1`,
        shared: `no`,
        effect: `skipVillainDeckDraw`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `lockVillain(999)`
      }
    ]
  },
  {
    id: "37",
    name: "Batwoman",
    image: `${cardArtFolder}/Batwoman.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Bat"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Without another active Bat on her Team, increase Batwoman's damaging cards' Damage by 1 and she Permanent KO's. <span class="line-gap"></span> With another active Bat on her team 3/Game: After playing from the Villain Deck, but before deciding where Batwoman will act, you can increase this Hero's draw selection pool to 4 options, and choose before moving.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Draw early, and with more choices`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `isNotActive(Bat)`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `passive`,
        condition: `isNotActive(Bat)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      },
      {
        type: `quick`,
        condition: `isActive(Bat),afterVillainBeforeTravel`,
        uses: `3`,
        shared: `no`,
        effect: `extendView(self,4)`
      }
    ]
  },
  {
    id: "38",
    name: "Batman Beyond",
    image: `${cardArtFolder}/Batman Beyond.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Bat"],
    hp: "14",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Batman Beyond deals double Damage against Henchmen and Villains in Gotham. <span class="line-gap"></span> 2/Game: Negate the activation of a Might of the Overlord. <span class="line-gap"></span> Without another active Bat on his team, Batman Beyond takes half a Villain's Damage when entering a City, and also takes only half Damage if a retreat roll fails.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Double Damage In Gotham`
      },
      {
        text: `Negate the Might of the Overlord from activating`
      },
      {
        text: `Bat-Less Enter Damage`
      },
      {
        text: `Bat-Less Exit Damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `in(Gotham)`,
        uses: `0`,
        shared: `no`,
        effect: `doubleDamage`
      },
      {
        type: `quick`,
        condition: `activated(Might)`,
        uses: `2`,
        shared: `no`,
        effect: `negate(Might)`
      },
      {
        type: `passive`,
        condition: `entersCityWith(Villain)`,
        uses: `0`,
        shared: `no`,
        effect: `takesDamage(halfVillainDamage)`
      },
      {
        type: `passive`,
        condition: `failsRetreatFromCityWith(Villain)`,
        uses: `0`,
        shared: `no`,
        effect: `preventRetreatDamage,takesDamage(halfVillainDamage)`
      }
    ]
  },
  {
    id: "39",
    name: "John Constantine",
    image: `${cardArtFolder}/Constantine.jpg`,
    type: "Hero",
    category: "Striker",
    color: "purple",
    teams: ["Dark"],
    hp: "9",
    damageThreshold: "2",
    retreat: "2",
    travel: "1",
    abilitiesText: [
      {
        text: `1/Game: If he is KO'd, you can KO the top 5 cards of Constantine's deck and restore him to 9 HP, then deal 5 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Check the Villain Deck`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `isKOd`,
        uses: `1`,
        shared: `no`,
        effect: `restoreSelf(9)`
      },
      {
        type: `quick`,
        condition: `usedOtherFaceAbility`,
        uses: `1`,
        shared: `no`,
        effect: `damageOverlord(5)`
      }
    ]
  },
  {
    id: "40",
    name: "Deadshot",
    image: `${cardArtFolder}/Deadshot.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Squad"],
    hp: "11",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> Deadshot can use his cards to Damage the Henchmen and Villains in Adjacent Cities, however the additional effects of those cards are negated. <span class="line-gap"></span> 3/Game: Once per turn, deal 3 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Use cards against Adjacent Henchmen and Villains`
      },
      {
        text: `Damage the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `useCardsVsAdjacentNegateEffects`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageOverlord(3)`
      }
    ]
  },
  {
    id: "41",
    name: "Killer Frost",
    image: `${cardArtFolder}/Killer Frost.jpg`,
    type: "Hero",
    category: "Striker",
    color: "blue",
    teams: ["Squad","Legion","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> When Killer Frost engages a Henchman or Villain in a City, they stop moving across the board. <span class="line-gap"></span> 3/Game: Once per turn, Lock any Henchman or Villain in their City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Stop moving when engaged`
      },
      {
        text: `Lock a Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `stopMovingWhenEngaged`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `lockVillain(999)`
      }
    ]
  },
  {
    id: "42",
    name: "Black Manta",
    image: `${cardArtFolder}/Black Manta.jpg`,
    type: "Hero",
    category: "Striker",
    color: "red",
    teams: ["Aqua","Squad","Legion"],
    hp: "13",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> Black Manta's Damage Threshold increases by 1 whilst he is in a Coastal City. <span class="line-gap"></span> 2/Game: Deal 2 Damage to a Henchman or Villain in either Coastal City, and if you do, they are Locked there.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Increase Damage Threshold by 1 while on Coast`
      },
      {
        text: `Damage Coastal Villain for 2 and Lock them`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `passive`,
        condition: `in(Coastal)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamageThreshold(1)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `damageVillainLock(Coastal,2)`
      }
    ]
  },
  {
    id: "43",
    name: "Sinestro",
    image: `${cardArtFolder}/Sinestro.jpg`,
    type: "Hero",
    category: "Striker",
    color: "yellow",
    teams: ["Green Lantern","Legion"],
    hp: "14",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> 3/Game: Once per turn, Reduce any one Henchman or Villain's Damage to 0 until the end of Sinestro's next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Reduce Henchman or Villain's Damage to 0`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `reduceVillainDamage(3)`
      }
    ]
  },
  {
    id: "44",
    name: "Batman",
    image: `${cardArtFolder}/Batman.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Bat","Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `Batman deals double Damage against Henchmen and Villains in Gotham. <span class="line-gap"></span> 2/Game: After playing from the Villain Deck, but before deciding where Batman will act, you can increase this Hero's draw selection pool to 4 options, and choose before moving. <span class="line-gap"></span> 3/Game: Without rolling, Batman can retreat and take no Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Retreat without rolling`
      },
      {
        text: `Double Damage In Gotham`
      },
      {
        text: `Draw early, and with more choices`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `retreatFree`
      },
      {
        type: `passive`,
        condition: `in(Gotham)`,
        uses: `0`,
        shared: `no`,
        effect: `doubleDamage`
      },
      {
        type: `quick`,
        condition: `afterVillainBeforeTravel`,
        uses: `2`,
        shared: `no`,
        effect: `extendView(self,4)`
      }
    ]
  },
  {
    id: "45",
    name: "Cyborg",
    image: `${cardArtFolder}/Cyborg.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "red",
    teams: ["Titans","Justice League"],
    hp: "12",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `2/Game: At the start of a turn, prevent the Villain Deck from being drawn from. <span class="line-gap"></span> 1/Game: Without rolling, Cyborg can retreat and take no Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Retreat without rolling`
      },
      {
        text: `Prevent Villain Deck draw`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `retreatFree`
      },
      {
        type: `quick`,
        condition: `villainDeckWouldDraw`,
        uses: `2`,
        shared: `no`,
        effect: `skipVillainDeckDraw`
      }
    ]
  },
  {
    id: "46",
    name: "Green Arrow",
    image: `${cardArtFolder}/Green Arrow.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Arrow","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Green Arrow can use his cards to Damage the Henchmen and Villains in Adjacent Cities, however the additional effects of those cards are negated. <span class="line-gap"></span> 3/Game: Green Arrow can use any number of cards to Damage the Overlord without Traveling, however the additional effects of those cards are negated.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Use cards against Adjacent Henchmen and Villains`
      },
      {
        text: `Attack the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `useCardsVsAdjacentNegateEffects`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `attackOverlordNoTravelNegateEffects`
      }
    ]
  },
  {
    id: "47",
    name: "Green Lantern (John Stewart)",
    image: `${cardArtFolder}/John Stewart.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "green",
    teams: ["Green Lantern","Justice League"],
    hp: "14",
    damageThreshold: "3",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Once per turn, Green Lantern can increase his, or another Hero's, Damage Threshold by 2 until the start of his next turn.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Raise Your Damage Threshold`
      },
      {
        text: `Raise an Ally's Damage Threshold`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `yes`,
        effect: `dtPlus(2)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `yes`,
        effect: `allydtPlus(2)`
      }
    ]
  },
  {
    id: "48",
    name: "Robin",
    image: `${cardArtFolder}/Robin.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Bat","Titans"],
    hp: "10",
    damageThreshold: "1",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `Robin deals double Damage against Henchmen and Villains in Gotham. <span class="line-gap"></span> 3/Game: Once per turn, deal 2 Damage to any one Henchman or Villain in a City.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Double Damage In Gotham`
      },
      {
        text: `Deal 2 Damage to one Henchmen or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `in(Gotham)`,
        uses: `0`,
        shared: `no`,
        effect: `doubleDamage`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `damageVillain(Choice(Any),2)`
      }
    ]
  },
  {
    id: "49",
    name: "Nightwing",
    image: `${cardArtFolder}/Nightwing.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "blue",
    teams: ["Bat","Titans"],
    hp: "10",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `Nightwing's damaging Action Cards deal 1 additional Damage for each of his active Teammates. <span class="line-gap"></span> 3/Game: Once per turn, double the Damage of another Hero's card.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Increase Damage by 1 per Teammate`
      },
      {
        text: `Double another Hero's Damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `getTeammatesActive`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      },
      {
        type: `quick`,
        condition: `allyAttacks(Any)`,
        uses: `3`,
        shared: `no`,
        effect: `doubleAllysDamage`
      }
    ]
  },
  {
    id: "50",
    name: "Batgirl",
    image: `${cardArtFolder}/Batgirl.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "purple",
    teams: ["Bat","Titans"],
    hp: "9",
    damageThreshold: "3",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `3/Game: Reveal the top 3 cards of the Villain Deck, you can KO one of them. <span class="line-gap"></span> 3/Game: Before they draw, increase a Hero's draw selection pool to 4 options.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reveal 3 from the Villain Deck`
      },
      {
        text: `Allow to Preview 4`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `revealVillainTopKO(3,1)`
      },
      {
        type: `quick`,
        condition: `anotherHeroWouldDraw`,
        uses: `3`,
        shared: `no`,
        effect: `extendView(choice(any),4)`
      }
    ]
  },
  {
    id: "51",
    name: "Red Robin",
    image: `${cardArtFolder}/Red Robin.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "red",
    teams: ["Bat","Titans"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `3/Game: Red Robin can Travel an additional time, after he draws 1. <span class="line-gap"></span> 2/Game: KO an active Scenario.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Travel Once More`
      },
      {
        text: `KO a Scenario`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `travelThenDraw(any,1)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `KO(Choice(Scenario))`
      }
    ]
  },
  {
    id: "52",
    name: "Flash (Wally West)",
    image: `${cardArtFolder}/Wally West.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "red",
    teams: ["Flash","Titans"],
    hp: "11",
    damageThreshold: "3",
    retreat: "2",
    travel: "3",
    abilitiesText: [
      {
        text: `2/Game: Rescue the Captured Bystanders from any one Henchman or Villain in a City and deal 1 Damage to the capturing card. <span class="line-gap"></span> 2/Game: Reduce any one Henchman or Villain's Damage by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reduce Henchman or Villain's Damage`
      },
      {
        text: `Rescue Bystander`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `reduceVillainDamage(Choice(Any),1)`
      },
      {
        type: `standard`,
        condition: `villainHasBystander`,
        uses: `2`,
        shared: `no`,
        effect: `rescueBystanderDamageCapturer(1)`
      }
    ]
  },
  {
    id: "53",
    name: "Raven",
    image: `${cardArtFolder}/Raven.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "purple",
    teams: ["Titans"],
    hp: "10",
    damageThreshold: "2",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `5/Game: Once per turn, move Raven, or another Hero, to any other location without rolling to retreat. <span class="line-gap"></span> If Raven is at 5 or less HP, her damaging cards deal 1 additional Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Move Raven`
      },
      {
        text: `Move another Hero`
      },
      {
        text: `Increase Damage`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `5`,
        shared: `yes`,
        effect: `move(self)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `5`,
        shared: `yes`,
        effect: `move(Hero)`
      },
      {
        type: `passive`,
        condition: `isAtOrBelow(5)`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      }
    ]
  },
  {
    id: "54",
    name: "Aqualad",
    image: `${cardArtFolder}/Aqualad.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "orange",
    teams: ["Aqua","Titans"],
    hp: "11",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `If Aqualad is in a Coastal City, or would leave a Coastal City, he can choose to Travel to the other Coastal City (if occupied) instead. <span class="line-gap"></span> 2/Game: Deal 1 Damage to any one Henchman or Villain in a City, and if you do, Lock them there.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Travel to other Coastal City`
      },
      {
        text: `Travel to other Coastal City`
      },
      {
        text: `Damage and Lock a Henchman or Villain`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `in(Coastal)`,
        uses: `999`,
        shared: `yes`,
        effect: `travel(Any(Coastal))`
      },
      {
        type: `quick`,
        condition: `wouldRetreat,in(Coastal)`,
        uses: `999`,
        shared: `yes`,
        effect: `travel(Any(Coastal))`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `damageVillainLock(Choice,1)`
      }
    ]
  },
  {
    id: "55",
    name: "Artemis",
    image: `${cardArtFolder}/Artemis.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "lightgreen",
    teams: ["Arrow","Titans"],
    hp: "9",
    damageThreshold: "2",
    retreat: "4",
    travel: "1",
    abilitiesText: [
      {
        text: `Artemis can use her cards to Damage the Henchmen and Villains in Adjacent Cities, however the additional effects of those cards are negated. <span class="line-gap"></span> 2/Game: Discard 2, add 1 card from your deck to your hand.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Use cards against Adjacent Henchmen and Villains`
      },
      {
        text: `Discard 2, Add any 1 card`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `useCardsVsAdjacentNegateEffects`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `discardXaddX(2,1)`
      }
    ]
  },
  {
    id: "56",
    name: "Omen",
    image: `${cardArtFolder}/Omen.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "green",
    teams: ["Titans"],
    hp: "9",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `Once per turn, you can look at the top card of either Omen's Deck, or the Villain Deck. <span class="line-gap"></span> 2/Game: Once per turn, KO the top card of the Villain Deck.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Check Omen's Deck`
      },
      {
        text: `Check the Villain Deck`
      },
      {
        text: `KO the top card of the Villain Deck`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `999`,
        shared: `yes`,
        effect: `revealTop(Self)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `999`,
        shared: `yes`,
        effect: `revealTop(Villain)`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `koTop(Villain)`
      }
    ]
  },
  {
    id: "57",
    name: "Kid Flash",
    image: `${cardArtFolder}/Kid Flash.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Flash","Titans"],
    hp: "9",
    damageThreshold: "2",
    retreat: "3",
    travel: "3",
    abilitiesText: [
      {
        text: `Kid Flash's damaging Action Cards deal 1 additional Damage equal to the number of times he has Traveled that turn. <span class="line-gap"></span> 2/Game: At the start of this Hero's turn, before Traveling, you can reduce your Travel Budget by 1 and KO any one Henchman.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Lose a Travel, KO a Henchman`
      },
      {
        text: `Increase 1+ Damage Cards By 1 Per Travel`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `beforeDraw`,
        uses: `2`,
        shared: `no`,
        effect: `reduceTravelKOHenchman`
      },
      {
        type: `passive`,
        condition: `Travel`,
        uses: `0`,
        shared: `no`,
        effect: `increaseDamage(1)`
      }
    ]
  },
  {
    id: "58",
    name: "Dr Fate",
    image: `${cardArtFolder}/Dr Fate.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Dark","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "1",
    travel: "3",
    abilitiesText: [
      {
        text: `1/Game: Reveal the top card of the Villain Deck, you may KO it.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reveal and possibly KO the top card of the Villain Deck`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `revealTop(Villain)`
      },
      {
        type: `quick`,
        condition: `usedOtherFaceAbility`,
        uses: `1`,
        shared: `no`,
        effect: `koTop(Villain)`
      }
    ]
  },
  {
    id: "59",
    name: "Zatanna",
    image: `${cardArtFolder}/Zatanna.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "ivory",
    teams: ["Dark","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "4",
    travel: "2",
    abilitiesText: [
      {
        text: `1/Game: Zatanna can use each of the following effects. <span class="line-gap"></span> Tropelet: Zatanna can Travel or Retreat once without rolling. <span class="line-gap"></span> Dleihs: Zatanna can ignore taking Damage. <span class="line-gap"></span> Nrub: Deal 3 Damage to all Henchmen, Villains, and the Overlord. `
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Travel or Retreat without Rolling`
      },
      {
        text: `Ignoring an attack`
      },
      {
        text: `Deal 3 Damage to all Henchmen, Villains, and the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `travel(Choice)`
      },
      {
        type: `quick`,
        condition: `damageSelf`,
        uses: `1`,
        shared: `no`,
        effect: `ignoreDamage`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `damageVillain(all,3)`
      }
    ]
  },
  {
    id: "60",
    name: "Deadman",
    image: `${cardArtFolder}/Deadman.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "ivory",
    teams: ["Dark"],
    hp: "0",
    damageThreshold: "0",
    retreat: "0",
    travel: "0",
    abilitiesText: [
      {
        text: `Deadman can take over Henchmen, Villains, and other Heroes 
              in order to deal damage. He can use the Heroes to take regular 
              turns, and the Henchmen and Villains to move up to one city 
              over (on top of his chosen foe) and into the Hero space to deal 
              his host’s damage twice to the Henchman or Villain in that city. 
              If he possesses a Henchman or Villain with Bystanders, he can 
              omit one of his two attacks to release them all.
              <span class="line-gap"></span>
              At the end of his turn, he must leave his host. If they were left 
              in a city, they take damage as normal, and if it was a Henchman 
              or Villain that he possessed, and they were not KO'd from the 
              damage, they then slide to the closest city to the left and 
              resume their evil acts. If his villanous host was KO’d, 
              then he gains their Upon Defeat effect.
              <span class="line-gap"></span>
              Deadman cannot win games, if he is the last Hero, 
              then Evil Wins.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `fukt`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `beforeTravel`,
        uses: `999`,
        shared: `no`,
        effect: `deadman`
      }
    ]
  },
  {
    id: "61",
    name: "Harley Quinn",
    image: `${cardArtFolder}/Harley Quinn.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "red",
    teams: ["Squad","Bat"],
    hp: "9",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> If Harley Retreats, the Henchman or Villain left behind takes 1 Damage. <span class="line-gap"></span> 2/Game: Without rolling, Harley Quinn can retreat and take no Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Retreat without rolling`
      },
      {
        text: `Burn on retreat`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `2`,
        shared: `no`,
        effect: `retreatFree`
      },
      {
        type: `passive`,
        condition: `retreats`,
        uses: `0`,
        shared: `no`,
        effect: `burnRemaining(1)`
      }
    ]
  },
  {
    id: "62",
    name: "Captain Boomerang",
    image: `${cardArtFolder}/Captain Boomerang.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "blue",
    teams: ["Squad","Rogues"],
    hp: "10",
    damageThreshold: "2",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `Permanent KO. <span class="line-gap"></span> One Henchmen or Villain of your choice that was damaged by Captain Boomerang during his turn takes 1 additional Damage at the end of his turn. <span class="line-gap"></span> 3/Game: Captain Boomerang can use any number of cards to Damage the Overlord without Traveling, however the additional effects of those cards are negated.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Permanently KO's all Henchmen and Villains`
      },
      {
        text: `Attack the Overlord`
      },
      {
        text: `Burn one`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `permanentKODefeated`
      },
      {
        type: `standard`,
        condition: `none`,
        uses: `3`,
        shared: `no`,
        effect: `attackOverlordNoTravelNegateEffects`
      },
      {
        type: `passive`,
        condition: `endTurn`,
        uses: `0`,
        shared: `no`,
        effect: `burnDamaged(choice(any),1)`
      }
    ]
  },
]