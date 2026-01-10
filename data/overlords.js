const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/3e6e12abe969ab0e61d6721ec3f0ad18d6f8e960/Public/Images/Card%20Assets/Overlords";

// ids 5001-5200

export const overlords = [
  {
    id: "5001",
    name: "Darkseid",
    image: `${cardArtFolder}/Darkseid.jpg`,
    type: "Overlord",
    level: "3",
    hp: "150",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `At the end of a Hero's turn, if they dealt Damage to Darkseid, they take 1 Damage (ignoring their Damage Threshold). <span class="line-gap"></span>
               Might of the Overlord: CHOOSE : KO 2 Bystanders OR KO the top 2 cards of your Hero's discard pile. <span class="line-gap"></span>
               Bonus Evil Wins Condition: Evil Wins when 10 Bystanders have been KO'd. `
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Omega Overload`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndWasAttacked`,
        uses: `999`,
        shared: `no`,
        effect: `damageHero(1,current,ignoreDT)`
      }
    ],
    mightNamePrint: [
      {
          text: `Either they burn, or you do!`
      },
      {
          text: `KO 2 Bystanders`
      },
      {
          text: `KO 2 cards from your discard pile`
      }
    ],
    mightEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
      },
      {
          type: `chooseOption(1)`,
          effect: [`koBystander(2)`]
      },
      {
          type: `chooseOption(2)`,
          effect: `koTopHeroDiscard(2,current)`
      },
    ],
    evilWinsNamePrint: [
      {
        text: `Evil Wins!`
      }
    ],
    evilWinsEffects: [
      {
        type: `evilWins`,
        condition: `bystandersKOD(10)`,
        effect: `evilWins()`
      }
    ]
  },
  {
    id: "5002",
    name: "Joker",
    image: `${cardArtFolder}/Joker.jpg`,
    type: "Overlord",
    level: "1",
    hp: "40",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `At the start of the game, Joker's Hit Points are increased by 3 for every active [ICON:Bat] Hero. <span class="line-gap"></span>
               Might of the Overlord: Draw 1 card from the Villain Deck for every active Hero. <span class="line-gap"></span>
               Bonus Feature: If there are 3 or more active [ICON:Bat] Heroes at the start of the game, Joker implements this feature. At the end of every Hero's turn, they must CHOOSE: KO the top card of their discard pile. OR Take 2 Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Filled with Glee`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        uses: `1`,
        effect: `damageOverlord(-3*getActiveTeamCount(Bat))`
      }
    ],
    mightNamePrint: [
      {
          text: `Fiesta Time!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `villainDraw(getActiveTeamCount(all))`
      }
    ],
    bonusNamePrint: [
      {
        text: `Bonus Round!`
      },
      {
        text: `KO a card from your discard pile`
      },
      {
        text: `Take 2 Damage`
      }
    ],
    bonusEffects: [
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`,
        condition: [`turnEnd`,`isGreaterThanX(3,getActiveTeamCount(Bat))`],
        uses: `999`,
        shared: `no`,
      },
      {
          type: `chooseOption(1)`,
          effect: [`koTopHeroDiscard(current)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`damageHero(2,current)`]
      },
    ]
  },
  {
    id: "5003",
    name: "Psimon",
    image: `${cardArtFolder}/Psimon.jpg`,
    type: "Overlord",
    level: "2",
    hp: "55",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `If a Hero is KO'd: Next turn do not draw from the Villain Deck, that Hero enters as a Villain. <span class="line-gap"></span>
               Might of the Overlord: Draw 3 Henchmen from the Villain Deck. <span class="line-gap"></span>
               Bonus Feature: After the first Hero is KO'd, Psimon implements this feature. Heroes cannot Scan.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `You're Mine Now!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `heroKOd`,
        uses: `999`,
        shared: `no`,
        effect: `returnHeroAsVillain()`
      }
    ],
    mightNamePrint: [
      {
          text: `More Reinforcements!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `rallyNextHenchVillains(3,henchmenOnly)`
      }
    ],
    bonusNamePrint: [
      {
        text: `No Peeking!`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `heroKOd`,
        uses: `0`,
        shared: `no`,
        effect: `disableScan()`
      }
    ]
  },
  {
    id: "5004",
    name: "Lex Luthor (Power Armor)",
    image: `${cardArtFolder}/Lex Luthor Power Armor.jpg`,
    type: "Overlord",
    level: "2",
    hp: "35",
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Might of the Overlord: Draw once from the Villain Deck and all active [ICON:Super] Heroes take 3 Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `na`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `na`
      }
    ],
    mightNamePrint: [
      {
          text: `You'll Regret That!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`villainDraw(1)`,`damageHero(3,Super)`]
      }
    ],
    bonusNamePrint: [
      {
        text: `none`
      }
    ],
    bonusEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
  {
    id: "5005",
    name: "Lex Luthor",
    image: `${cardArtFolder}/Lex Luthor.jpg`,
    type: "Overlord",
    level: "1",
    hp: "15",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `Might of the Overlord: Play the next Enemy from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `na`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `na`
      }
    ],
    mightNamePrint: [
      {
          text: `My Wallet's Bigger!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `enemyDraw(1,nextEnemy)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Are the backup plans ready?`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `gameStart`,
        uses: `1`,
        shared: `no`,
        effect: `addNextOverlord(5004)`
      }
    ]
  },
  {
    id: "5006",
    name: "Ra's Al Ghul",
    image: `${cardArtFolder}/rasAlGhul.jpg`,
    type: "Overlord",
    level: "1",
    hp: "25",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `1/Game: Resurrect Ra's Al Ghul to full HP after he is KO'd. <span class="line-gap"></span>
               Might of the Overlord: All Henchmen and Villains regain up to 5 HP. <span class="line-gap"></span>
               Bonus Feature: After being resurrected: Whenever a Henchman or Villain escapes, add their Maximum HP to Ra's when they escape.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Lazarus Rebirth!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `overlordReducedToHP(0)`,
        uses: `1`,
        shared: `no`,
        effect: `damageOverlord(-25)`
      }
    ],
    mightNamePrint: [
      {
          text: `Rejoice!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `damageFoe(-5,all)`
      }
    ],
    bonusNamePrint: [
      {
        text: `I Need Your Life Force!`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: [`used_abilitiesEffects(0)`,`foeEscapes`],
        uses: `999`,
        shared: `no`,
        effect: `gainMaxHPonFoeEscape()`
      }
    ]
  },
  {
    id: "5007",
    name: "Ocean Master",
    image: `${cardArtFolder}/oceanMaster.jpg`,
    type: "Overlord",
    level: "1",
    hp: "50",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `[ICON:Aqua] Heroes start the game with 1 less HP. <span class="line-gap"></span>
               Might of the Overlord: Deal 3 Damage to all Heroes in Coastal Cities. If there are none, Destroy the Rightmost City. <span class="line-gap"></span>
               Bonus Feature: After Gotham is destroyed, all Heroes' Retreat Requirements increase by 1.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Royal Birthright!`
      },
      {
        text: `Nowhere to Run!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        uses: `1`,
        shared: `no`,
        effect: `damageHero(1,Aqua,ignoreDT)`
      },
      {
        type: `passive`,
        condition: `isCityDestroyed(10)`,
        effect: `increaseRetreat(all,1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Our World Crashing Down Upon Theirs!`
      },
      {
          text: `Our World Crashing Down Upon Theirs!`
      },
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `cityOccupiedByHero(coastal)`,
        uses: `999`,
        shared: `no`,
        effect: `damageHero(3,coastal)`
      },
      {
        type: `might`,
        condition: `cityEmptyOfHero(coastal)`,
        uses: `999`,
        shared: `no`,
        effect: `destroyCity(1)`
      }
    ]
  },
  {
    id: "5008",
    name: "Kadabra",
    image: `${cardArtFolder}/kadabra.jpg`,
    type: "Overlord",
    level: "1",
    hp: "45",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `At the start of the game, Kadabra's Hit Points are increased by 3 for every active [ICON:Titans] Hero. <span class="line-gap"></span>
               Might of the Overlord: All unengaged Henchmen and Villains Charge 2. <span class="line-gap"></span>
               Bonus Feature: If there are 3, or more, [ICON:Titans] Heroes at the start of the game: No Heroes can Scan.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Renewed Vigor!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        uses: `1`,
        shared: `no`,
        effect: `damageOverlord(-3*getActiveTeamCount(Titans))`
      }
    ],
    mightNamePrint: [
      {
          text: `Abra Kadabra!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `shoveVillain(allUnengaged,-4)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Play Fair!`
      }
    ],
    bonusEffects: [
      {
        condition: `isGreaterThanX(3,getActiveTeamCount(Titans))`,
        type: `passive`,
        effect: `disableScan()`
      }
    ]
  },
  {
    id: "5009",
    name: "Ultraman",
    image: `${cardArtFolder}/ultraman.jpg`,
    type: "Overlord",
    level: "3",
    hp: "100",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `At the end of a Hero's turn, if they engaged Ultraman, they take 1 Damage (ignoring their Damage Threshold). <span class="line-gap"></span>
               Might of the Overlord: Ultraman enters the map as a 20 HP, 3 Damage Villain with Charge 1. If he is reduced to 0 HP, he is sent back to the Overlord space and his HP is reduced by 20. If he is not reduced to 0 HP before he reaches the end of the board, all Heroes take 3 Damage. <span class="line-gap"></span>
               Bonus Feature: When a Hero is KO'd, Ultraman gains 10 HP. `
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Let Me Enlighten You`
      },
      {
        text: `Take What's Yours!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndWasAttacked`,
        effect: `damageHero(1,current,ignoreDT)`
      },
      {
        type: `quick`,
        condition: `heroKod`,
        effect: `damageOverlord(-10)`
      }
    ],
    mightNamePrint: [
      {
          text: `Don't Make Me Come Down There!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `drawSpecificVillain(5638)`
      }
    ]
  },
  {
    id: "5010",
    name: "Enchantress",
    image: `${cardArtFolder}/enchantress.jpg`,
    type: "Overlord",
    level: "3",
    hp: "70",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `If Enchantress KO's a Bystander: She gains 5 HP. <span class="line-gap"></span>
               Might of the Overlord: The Leftmost Villain escapes (Takeover is ignored). <span class="line-gap"></span>
               Bonus Feature: Once per turn, if a Hero damages Enchantress, they gain 1 Corruption Counter. If a Hero reaches 3 counters: KO the top card of their deck and reset their counters to 0.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `That Hit The Spot...`
      },
      {
        text: `Bittersweet Corruption!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `overlordKosBystander`,
        uses: `999`,
        shared: `no`,
        effect: `damageOverlord(-5)`
      },
      {
        type: `quick`,
        condition: `firstAttackPerTurn`,
        uses: `999`,
        shared: `no`,
        effect: `attackerGainCorruptionCounter(1)` //koTopHeroCard(1,current)
      }
    ],
    mightNamePrint: [
      {
          text: `To Me!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `shoveVillain(leftmostVillain,-10)`
      }
    ]
  },
  {
    id: "5011",
    name: "Hugo Strange",
    image: `${cardArtFolder}/hugeStrangeNew.jpg`,
    type: "Overlord",
    level: "1",
    hp: "35",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `The first time each turn Hugo Strange is damaged, draw 1 from the Villain Deck. <span class="line-gap"></span>
               Might of the Overlord: Double the current HP and Damage of the Leftmost Henchman.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I am in control.`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `firstAttackPerTurn`,
        effect: `villainDraw(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Monster Men, Rise!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `doubleVillainHPandDamage(leftmost,Henchman)`
      }
    ]
  },
  {
    id: "5012",
    name: "Amanda Waller",
    image: `${cardArtFolder}/amandaWaller.jpg`,
    type: "Overlord",
    level: "2",
    hp: "50",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `Each time a Villain is KO'd by a Hero, that Hero may either take 5 Damage or gain 5 HP. <span class="line-gap"></span> 
               Might of the Overlord: Resurrect the first 2 KO'd Henchmen. <span class="line-gap"></span> 
               Bonus Feature: The first time each turn a [ICON:Squad] Hero Damages Amanda Waller, there is a chance they take 10 Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Was that one of ours?`
      },
      {
        text: `Remember, Convict... I Own You.`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `villainKOd`,
        chance: 0.4,
        effect: `randomEffect(damageHero(5,lastHeroDamager),regainLife(5,lastHeroDamager))`
      },
      {
        type: `quick`,
        condition: [`firstAttackPerTurn`,`isDamagedBy(Squad)`],
        chance: 0.16,
        effect: `damageHero(10,current)`
      }
    ],
    mightNamePrint: [
      {
          text: `I Have Endless Operatives`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `reviveKodFoe(2,henchmenOnly)`
      }
    ]
  },
  {
    id: "5013",
    name: "Vandal Savage",
    image: `${cardArtFolder}/vandalSavage.jpg`,
    type: "Overlord",
    level: "2",
    hp: "60",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `Vandal Savage cannot be KO'd while there is a Captured Bystander on the board. <span class="line-gap"></span> 
               Might of the Overlord: Draw 2 cards from the Villain Deck and 1 from the E&A.<span class="line-gap"></span> 
               Bonus Feature: After the first Hero is KO'd: If a Henchman or Villain is retreated from: They regain 5 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `You're Not Done Yet.`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `capturedBystanderActive`,
        effect: `guardOverlord()`
      }
    ],
    mightNamePrint: [
      {
          text: `Millenia's Old Empire`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`villainDraw(2)`,`enemyDraw(1)`]
      }
    ],
    bonusNamePrint: [
      {
        text: `Loyalty Rewarded`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `heroKod`,
        effect: `healAbandonedFoe(5)`
      }
    ]
  },
  {
    id: "5014",
    name: "Sinestro",
    image: `${cardArtFolder}/sinestro.jpg`,
    type: "Overlord",
    level: "2",
    hp: "70",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `Decrease [ICON:Lantern] Heroes' Damage Thresholds by 1 (to a minimum of 1). <span class="line-gap"></span>
               Might of the Overlord: All Henchmen and Villains regain up to 5 HP. <span class="line-gap"></span>
               Bonus Feature: If a [ICON:Lantern] Hero is KO'd, Sinestro gains 10 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Be Afraid!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        uses: `1`,
        effect: `decreaseHeroDT(Lantern,1,permanent)`
      }
    ],
    mightNamePrint: [
      {
          text: `Welcome to the Sinestro Corps!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `damageFoe(-5,all)`
      }
    ],
    bonusNamePrint: [
      {
        text: `That Felt Great!`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `heroKod(Lantern)`,
        uses: `999`,
        shared: `no`,
        effect: `damageOverlord(-10)`
      }
    ]
  },
  {
    id: "5015",
    name: "Professor Zoom",
    image: `${cardArtFolder}/professorZoom.jpg`,
    type: "Overlord",
    level: "2",
    hp: "70",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `Decrease [ICON:Flash] Heroes' Damage Thresholds by 1 (to a minimum of 1). <span class="line-gap"></span>
               Might of the Overlord: All unengaged Henchmen and Villains Charge 2. <span class="line-gap"></span>
               Bonus Feature: If a [ICON:Flash] Hero is KO'd, the Hero with the most remaining HP takes 2 Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Slow You Down!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        uses: `1`,
        effect: `decreaseHeroDT(Flash,1,permanent)`
      }
    ],
    mightNamePrint: [
      {
          text: `Let Loose the Lightning!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `shoveVillain(allUnengaged,-4)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Time to Celebrate!`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `heroKod(Flash)`,
        uses: `999`,
        shared: `no`,
        effect: `damageHero(2,highestHP)`
      }
    ]
  },
  {
    id: "5016",
    name: "Gorilla Grodd",
    image: `${cardArtFolder}/gorillaGrodd.jpg`,
    type: "Overlord",
    level: "2",
    hp: "65",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `No Heroes can Scan. <span class="line-gap"></span>
               Might of the Overlord: Draw 3 Henchmen from the Villain Deck. <span class="line-gap"></span>
               Bonus Evil Wins Condition: Evil Wins when 15 Bystanders have been KO'd.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Telepathic Oversight`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        effect: `disableScan()`
      }
    ],
    mightNamePrint: [
      {
          text: `General Grodd!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `rallyNextHenchVillains(3,henchmenOnly)`
      }
    ],
    evilWinsNamePrint: [
      {
        text: `Evil Wins!`
      }
    ],
    evilWinsEffects: [
      {
        type: `evilWins`,
        condition: `bystandersKOD(15)`,
        effect: `evilWins()`
      }
    ]
  },
  {
    id: "5017",
    name: "Alexander Luthor",
    image: `${cardArtFolder}/alexanderLuthor.jpg`,
    type: "Overlord",
    level: "3",
    hp: "90",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `All Villains gain Charge 1. <span class="line-gap"></span>
               Might of the Overlord: Reduce all Henchmen and Villains' current HP by half and double their current Damage. <span class="line-gap"></span>
               Bonus Feature: The first time Alexander Luthor would be reduced to 0 HP, he is instead reduced to only 1. Then, end the turn of the Hero who damaged him and deal 5 Damage to all Heroes.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Behold, my Made Men!`
      },
      {
        text: `I Will Not End Like This!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `villainDrawn()`,
        effect: `villainGainCharge(1)`
      },
      {
        type: `quick`,
        condition: `overlordReducedToHP(0)`,
        uses: `1`,
        effect: [`damageOverlord(-1)`,`clickEndTurn()`,`damageHero(5,all)`]
      }
    ],
    mightNamePrint: [
      {
          text: `Get In There!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `halveVillainHPDoubleDamage(all)`
      }
    ]
  },
  {
    id: "5018",
    name: "Batman",
    image: `${cardArtFolder}/batman.jpg`,
    type: "Overlord",
    level: "2",
    hp: "80",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat. <span class="line-gap"></span>
               Might of the Overlord: Subtract 1 random Icon Ability use from each Hero. <span class="line-gap"></span>
               Bonus Feature: After the first Hero Blocks, future uses of Block come with the requirement that the Blocking Hero has the top 2 cards of their deck KO'd in order to use the effect.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Nowhere to Run!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `gameStart`,
        effect: `disableRetreat()`
      }
    ],
    mightNamePrint: [
      {
          text: `Contingency Plans`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `loseIconUse(all,1,random)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Observe and Adapt`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `heroBlocks`,
        effect: `appendToBlock(koTopHeroCard(2,current))`
      }
    ]
  },
  {
    id: "5019",
    name: "Ultimate Amazo",
    image: `${cardArtFolder}/ultimateAmazo.jpg`,
    type: "Overlord",
    level: "3",
    hp: "120",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `The first time each turn after Amazo takes Damage, he then regains 5 HP. <span class="line-gap"></span>
               Might of the Overlord: Increase all Villains' Damages by 1 and deal 1 Damage to all Heroes (ignoring their Damage Thresholds). <span class="line-gap"></span>
               Bonus Feature: When a Hero is KO'd, Amazo regains 20 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ever-Evolving!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `firstAttackPerTurn`,
        effect: `overlordRegainLife(5)`
      }
    ],
    mightNamePrint: [
      {
          text: `I've Studied You Long Enough`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`increaseVillainDamage(1,all)`,`damageHero(1,all,ignoreDT)`]
      }
    ],
    bonusNamePrint: [
      {
        text: `Observe and Adapt`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `heroKod`,
        effect: `overlordRegainLife(20)`
      }
    ]
  },
  {
    id: "5020",
    name: "Starro",
    image: `${cardArtFolder}/starro.jpg`,
    type: "Overlord",
    level: "2",
    hp: "85",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `If Starro KO's a Bystander: They gain 5 HP. <span class="line-gap"></span>
               Might of the Overlord: KO all captured Bystanders. <span class="line-gap"></span>
               Bonus Evil Wins Condition: Evil Wins when 15 Bystanders have been KO'd.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `More of Myself`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `overlordKosBystander`,
        uses: `999`,
        shared: `no`,
        effect: `damageOverlord(-5)`
      }
    ],
    mightNamePrint: [
      {
          text: `Rapid Expansion!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `koCapturedBystander(all)`
      }
    ],
    evilWinsNamePrint: [
      {
        text: `Evil Wins!`
      }
    ],
    evilWinsEffects: [
      {
        type: `evilWins`,
        condition: `bystandersKOD(15)`,
        effect: `evilWins()`
      }
    ]
  },
  {
    id: "5021",
    name: "Ares",
    image: `${cardArtFolder}/ares.jpg`,
    type: "Overlord",
    level: "2",
    hp: "70",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `Ares starts the game with an extra 5 HP per Hero. <span class="line-gap"></span>
               Might of the Overlord: Draw 3 Henchmen or Villains from the Villain Deck. Then, double all active Villains' HP. <span class="line-gap"></span>
               Bonus Feature: After the first Hero is KO'd: Draw an extra card from the E&A whenever it is drawn from. `
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Lord of War!`
      },
      {
        text: `Bonus Round!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        uses: `1`,
        effect: `damageOverlord(-5*getActiveTeamCount(all))`
      },
      {
        type: `passive`,
        condition: `heroKOd`,
        effect: `enaDrawsExtra()`
      }
    ],
    mightNamePrint: [
      {
          text: `Dogs of War!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: [`rallyNextHenchVillains(3)`,`doubleVillainLife(all)`]
      }
    ]
  },
  {
    id: "5022",
    name: "The Batman Who Laughs",
    image: `${cardArtFolder}/batmanWhoLaughs.jpg`,
    type: "Overlord",
    level: "3",
    hp: "75",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat. <span class="line-gap"></span>
               Might of the Overlord: Subtract 1 random Icon Ability use from each Hero. <span class="line-gap"></span>
               Bonus Feature: After the first Hero Blocks, future uses of Block come with the requirement that the Blocking Hero has the top 2 cards of their deck KO'd in order to use the effect.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Nowhere to Run!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `gameStart`,
        effect: `disableRetreat()`
      }
    ],
    mightNamePrint: [
      {
          text: `Contingency Plans`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `loseIconUse(all,1,random)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Observe and Adapt`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `heroBlocks`,
        effect: `appendToBlock(koTopHeroCard(2,current))`
      }
    ]
  },
  {
    id: "5023",
    name: "Brother Eye",
    image: `${cardArtFolder}/brotherEye.jpg`,
    type: "Overlord",
    level: "3",
    hp: "90",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `KO'd Heroes are brought back as Villains. <span class="line-gap"></span>
               Might of the Overlord: Draw 2 Henchmen or Villains from the Villain Deck. `
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Eye Am Reborn!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `heroKod()`,
        effect: `returnHeroAsVillain(cyborg)`
      }
    ],
    mightNamePrint: [
      {
          text: `Send in the Next Wave`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `rallyNextHenchVillains(2)`
      }
    ]
  },
  {
    id: "5024",
    name: "Brainiac",
    image: `${cardArtFolder}/brainiac.jpg`,
    type: "Overlord",
    level: "3",
    hp: "80",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `All Villains gain Teleport. <span class="line-gap"></span>
               When Brainiac is reduced to 60/40/20 HP: Restore a Destroyed City. <span class="line-gap"></span>
               Might of the Overlord: Destroy the Rightmost City. <span class="line-gap"></span>
               Bonus Feature: When a City is Destroyed, Brainiac gains 10 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Teleporters Online!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `villainDrawn()`,
        effect: `villainTeleports()`
      }
    ],
    mightNamePrint: [
      {
          text: `Join My Collection!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `destroyCity(1)`
      }
    ],
    bonusNamePrint: [
      {
        text: `No! Give that back!`
      },
      {
        text: `For the Collection!`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `overlordReducedByXFromMax(20)`,
        uses: `999`,
        shared: `no`,
        effect: `restoreCity(1)`
      },
      {
        type: `quick`,
        condition: `cityDestroyed`,
        uses: `999`,
        shared: `no`,
        effect: `damageOverlord(-10)`
      }
    ]
  },
  {
    id: "5025",
    name: "Nekron",
    image: `${cardArtFolder}/nekron.jpg`,
    type: "Overlord",
    level: "3",
    hp: "110",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `KO'd Heroes are brought back as Villains. <span class="line-gap"></span>
               Might of the Overlord: Resurrect the first 2 KO'd Henchmen or Villains. <span class="line-gap"></span>
               Bonus Feature: KO'd Bystanders enter the board as 1 HP, 1 Damage Henchmen.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Rise!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `heroKod()`,
        effect: `returnHeroAsVillain(blackLantern)`
      }
    ],
    mightNamePrint: [
      {
          text: `Welcome to the Black Lantern Corps!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `reviveKodFoe(2)`
      }
    ],
    bonusNamePrint: [
      {
        text: `The Living Are Dead Yet To Soar!`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `bystanderKOd()`,
        effect: `drawSpecificVillain(4871)`
      }
    ]
  },
  {
    id: "5026",
    name: "Anti-Monitor",
    image: `${cardArtFolder}/antiMonitor.jpg`,
    type: "Overlord",
    level: "3",
    hp: "150",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `The game begins with Gotham already destroyed. <span class="line-gap"></span>
               Might of the Overlord: Play the next 3 Enemies from the E&A. <span class="line-gap"></span>
               Bonus Feature: Cities cannot be restored.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Explosive Introduction!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnStart`,
        uses: `1`,
        effect: `destroyCity(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `The Worst of the Multiverse!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `enemyDraw(3,nextEnemy)`
      }
    ],
    bonusNamePrint: [
      {
        text: `I Am Finality!`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `gameStart`,
        effect: `disableCityRestoration()`
      }
    ]
  },
  {
    id: "5027",
    name: "Trigon",
    image: `${cardArtFolder}/trigon.jpg`,
    type: "Overlord",
    level: "3",
    hp: "95",
    doNotShow: "false",
    abilitiesText: [
      {
        text: `KO'd Bystanders return as possessed Henchmen. <span class="line-gap"></span>
               Might of the Overlord: Reverse the positions of all cards on the board. <span class="line-gap"></span>
               Bonus Evil Wins Condition: Evil Wins when 10 Bystanders have been KO'd. `
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Seduction of the Innocent`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `bystanderKOd()`,
        effect: `drawSpecificVillain(4872)`
      }
    ],
    mightNamePrint: [
      {
          text: `Time for a Change!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        effect: `reverseBoardPositions()`
      }
    ],
    evilWinsNamePrint: [
      {
        text: `Evil Wins!`
      }
    ],
    evilWinsEffects: [
      {
        type: `evilWins`,
        condition: `bystandersKOD(10)`,
        effect: `evilWins()`
      }
    ]
  },
]