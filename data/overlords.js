const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/6ebc15357d16a80c9937473ba9dea35b69bacd4e/Public/Images/Card%20Assets/Overlords";

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
               Bonus Feature: If there are 3 or more active [ICON:Bat] Heroes at the start of the game, Joker implements this feature. At the end of every 
               Hero's turn, they must CHOOSE: KO the top card of their discard pile. OR Take 2 Damage.`
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
               Might of the Overlord: Draw 3 Henchmen or Villains from the Villain Deck. <span class="line-gap"></span>
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
        effect: `rallyNextHenchVillains(5)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `1/Game: Resurrect Ra's Al Ghul to full HP after he is KO'd. <span class="line-gap"></span>
               Might of the Overlord: All Villains regain up to 5 HP. <span class="line-gap"></span>
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
        effect: `healVillain(all,5)`
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
        condition: [`used_abilitiesEffects(1)`,`foeEscapes`],
        uses: `999`,
        shared: `no`,
        effect: `gainMaxHP`
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
    doNotShow: "true",
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
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `gameStart`,
        uses: `1`,
        shared: `no`,
        effect: `damageHero(1,Aqua)`
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
        condition: `cityOccupied(coastal)`,
        uses: `999`,
        shared: `no`,
        effect: `damageHero(3,coastal)`
      },
      {
        type: `might`,
        condition: `cityEmpty(coastal)`,
        uses: `999`,
        shared: `no`,
        effect: `destroyCity(1)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Nowhere to Run!`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `isCityDestroyed(10)`,
        effect: `increaseRetreat(all,1)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `At the start of the game, Kadabra's Hit Points are increased by 3 for every active [ICON:Titans] Hero. <span class="line-gap"></span>
               Might of the Overlord: All Henchmen and Villains Charge 2. <span class="line-gap"></span>
               Bonus Feature: If there are 3, or more, [ICON:Titans] Heroes at the start of the game: Cards cannot be KO'd from the Villain Deck.`
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
        condition: `gameStart`,
        uses: `999`,
        shared: `no`,
        effect: `gainLife(3*count(Titans))`
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
        effect: `advanceFoe(all,2)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Play Fair!`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `3TitansGameStart`,
        uses: `0`,
        shared: `no`,
        effect: `disableVillainDeckKO`
      }
    ]
  },
  {
    id: "5009",
    name: "Ultraman",
    image: `${cardArtFolder}/Ultraman.jpg`,
    type: "Overlord",
    level: "3",
    hp: "100",
    doNotShow: "true",
    abilitiesText: [
      {
        text: `At the end of a Hero's turn, if they engaged Ultraman, they take 1 Damage (ignoring their Damage Threshold). <span class="line-gap"></span>
               Might of the Overlord: Ultraman enters the map as a 20 HP, 3 Damage Villain with Charge 1. If he is reduced to 0 HP, he is sent 
               back to the Overlord space and his HP is reduced by 20. If he is not reduced to 0 HP before he reaches the end of the board, all Heroes take 3 Damage. <span class="line-gap"></span>
               Bonus Feature: If Ultraman KO's a Hero: He Gains 10 HP. `
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Let Me Enlighten You`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `turnEndWasAttacked`,
        uses: `999`,
        shared: `no`,
        effect: `damageAttacker(1)`
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
        effect: `enterMapAs(5638)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Take What's Yours!`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `overlordKoHero`,
        uses: `0`,
        shared: `no`,
        effect: `healOverlord(10)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `If Enchantress KO's a Bystander: She gains 5 HP. <span class="line-gap"></span>
               Might of the Overlord: The Leftmost Villain escapes (Takeover is ignored). <span class="line-gap"></span>
               Bonus Feature: Once per turn, if a Hero damages Enchantress, they gain 1 Corruption Counter. If a Hero reaches 3 counters: KO the top card of their deck and reset their counters.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `That Hit The Spot...`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `overlordKoBystander`,
        uses: `999`,
        shared: `no`,
        effect: `gainLife(5)`
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
        effect: `instantEscape(leftmost)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Bittersweet Corruption!`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `firstTimePerTurnIsAttacked`,
        uses: `999`,
        shared: `no`,
        effect: `attackerGainCorruptionCounter(1)`
      }
    ]
  },
  {
    id: "5011",
    name: "Huge Strange",
    image: `${cardArtFolder}/hugoStrange.jpg`,
    type: "Overlord",
    level: "1",
    hp: "35",
    doNotShow: "true",
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
        condition: `firstTimePerTurnIsAttacked`,
        uses: `999`,
        shared: `no`,
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `doubleDouble(leftmost,henchman)`
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
    id: "5012",
    name: "Amanda Waller",
    image: `${cardArtFolder}/amandaWaller.jpg`,
    type: "Overlord",
    level: "2",
    hp: "50",
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Each time a Villain is KO'd by a Hero, there is a 1 in 6 chance that Hero takes 5 Damage, and a 1 in 6 chance that Hero regains up to 5 HP. <span class="line-gap"></span> 
               Might of the Overlord: Play the first 3 KO'd Henchmen.<span class="line-gap"></span> 
               Bonus Feature: Once per turn, if a [ICON:Squad] Hero damages Amanda Waller, there is a 1 in 6 chance they take 10 Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Was that one of ours?`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `kodVillain`,
        uses: `999`,
        shared: `no`,
        effect: `healOrHurt(current,5)`
      }
    ],
    mightNamePrint: [
      {
          text: `Endless Operatives.`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `resurrectHenchmen(3)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Remember, Convict.`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `OPTisDamagedBy(Squad)`,
        uses: `999`,
        shared: `no`,
        effect: `possibleDamageAttacker(10)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Vandal Savage cannot be reduced to 0 HP before every Player has rescued at least 1 Bystander and KO'd at least 1 Henchman or Villain. <span class="line-gap"></span> 
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
        condition: `playerHasNotKodOrRescued`,
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
        condition: `heroKod()`,
        uses: `999`,
        shared: `no`,
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Decrease [ICON:Lantern] Heroes' Damage Thresholds by 1 (to a minimum of 1). <span class="line-gap"></span>
               Might of the Overlord: All Villains gain 5 HP. <span class="line-gap"></span>
               Bonus Feature: If a [ICON:Lantern] Hero is KO'd, Sinestro regains 10 HP.`
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
        condition: `gameStart`,
        uses: `1`,
        shared: `no`,
        effect: `lowerDT(Lantern,1)`
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
        effect: `villainGainLife(all,5)`
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
        effect: `healOverlord(10)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Decrease [ICON:Flash] Heroes' Damage Thresholds by 1 (to a minimum of 1). <span class="line-gap"></span>
               Might of the Overlord: All Henchmen and Villains Charge 2. <span class="line-gap"></span>
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
        condition: `gameStart`,
        uses: `1`,
        shared: `no`,
        effect: `lowerDT(Flash,1)`
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
        effect: `advanceFoe(all,2)`
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
        effect: `damageHealthiestHero(2)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `All Villains with Charge advance an extra space when entering the board. <span class="line-gap"></span>
               Might of the Overlord: Reduce all Henchmen and Villains' HP by half and double their Damage. <span class="line-gap"></span>
               Bonus Feature: The first time Alexander Luthor would be reduced to 0 HP, he is instead reduced to only 1. Then, end the turn of the Hero who damaged him and deal 5 Damage to all Heroes.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Behold, my Made Men!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `chargeVillainDrawn`,
        uses: `999`,
        shared: `no`,
        effect: `extraCharge(1)`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `reduceAllFoesByHalfDoubleDamage`
      }
    ],
    bonusNamePrint: [
      {
        text: `I Will Not End Like This!`
      }
    ],
    bonusEffects: [
      {
        type: `quick`,
        condition: `wouldBeKod`,
        uses: `1`,
        shared: `no`,
        effect: [`surviveAt(1)`,`endHeroTurn`,`damageHero(5,all)`]
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat. <span class="line-gap"></span>
               Might of the Overlord: Subtract 1 random Icon Ability use from each Hero. <span class="line-gap"></span>
               Bonus Feature: After the first Hero Blocks, future uses of Block come with the requirement that the Blocking Hero must KO the top 2 cards of their deck in order to use the effect.`
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
        uses: `0`,
        shared: `no`,
        effect: `disableRetreat(all)`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `reduceIconEffectUseBy(all,random,1)`
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
        uses: `0`,
        shared: `no`,
        effect: `appendKO2CardsToBlock`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `The first time each turn, before a Hero damages Ultimate Amazo, he regains 5 HP. <span class="line-gap"></span>
               Might of the Overlord: Increase all Villains' Damages by 1 and deal 1 Damage to all Heroes. <span class="line-gap"></span>
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
        condition: `firstTimePerTurnIsAttacked`,
        uses: `999`,
        shared: `no`,
        effect: `healOverlord(5)`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`powerVillain(all,1)`,`damageHero(1,all)`]
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
        uses: `999`,
        shared: `no`,
        effect: `healOverlord(20)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Starro regains 5 HP for every Bystander he KO's. <span class="line-gap"></span>
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
        effect: `healOverlord(5)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Ares starts the game with an extra 5 HP per Hero. <span class="line-gap"></span>
               Might of the Overlord: Draw 5 from the Villain Deck (ignore additional Mights of the Overlord drawn by this effect). Double the HP of all Villains played by this effect. <span class="line-gap"></span>
               Bonus Feature: After the first Hero is KO'd: Draw an extra card from the E&A whenever it is drawn from. `
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Lord of War!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `gameStart`,
        uses: `1`,
        shared: `no`,
        effect: `overlordGainLife(5*countActiveHeroes)`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`drawVillainIgnoreMights(5)`,`doubleDrawnVillainsHP`]
      }
    ],
    bonusNamePrint: [
      {
        text: `Bonus Round!`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `heroKOd`,
        uses: `0`,
        shared: `no`,
        effect: `drawExtraEaA`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `Heroes cannot Retreat. <span class="line-gap"></span>
               Might of the Overlord: Subtract 1 random Icon Ability use from each Hero. <span class="line-gap"></span>
               Bonus Feature: After the first Hero Blocks, future uses of Block come with the requirement that the Blocking Hero must KO the top 2 cards of their deck in order to use the effect.`
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
        uses: `0`,
        shared: `no`,
        effect: `disableRetreat(all)`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `reduceIconEffectUseBy(all,random,1)`
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
        uses: `0`,
        shared: `no`,
        effect: `appendKO2CardsToBlock`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `KO'd Heroes are brought back as Villains. <span class="line-gap"></span>
               Might of the Overlord: Draw 3 from the Villain Deck. <span class="line-gap"></span>
               Bonus Feature: When a Villain-Turned Hero is KO'd, they are permanently KO'd.`
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
        condition: `heroKOd`,
        uses: `0`,
        shared: `no`,
        effect: `returnHeroAsVillain`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `villainDraw(3)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Complete Subjugation`
      }
    ],
    bonusEffects: [
      {
        type: `passive`,
        condition: `villainousHeroKOd`,
        uses: `0`,
        shared: `no`,
        effect: `permanentlyKOhero`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `All Villains gain Teleport. <span class="line-gap"></span>
               When Brainiac is reduced to 60/40/20 HP: Restore a Destroyed City. <span class="line-gap"></span>
               Might of the Overlord: Destroy the Rightmost City. <span class="line-gap"></span>
               Bonus Feature: When a City is Destroyed, Brainiac regains 10 HP.`
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
        condition: `villainDrawn`,
        uses: `0`,
        shared: `no`,
        effect: `villainTeleports`
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
        effect: `destroyCity(rightmost)`
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
        effect: `healOverlord(10)`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `KO'd Heroes are brought back as Villains. <span class="line-gap"></span>
               Might of the Overlord: Play KO'd Henchmen and Villains equal to the number of active Heroes. <span class="line-gap"></span>
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
        condition: `heroKOd`,
        uses: `0`,
        shared: `no`,
        effect: `returnHeroAsVillain`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `resurrectKOdHenchVillains(countActiveHeroes)`
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
        condition: `bystanderKOd`,
        uses: `999`,
        shared: `no`,
        effect: `spawnBystanderZombie`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `The game begins with Gotham already destroyed. <span class="line-gap"></span>
               Might of the Overlord: Of the top 5 cards of the E&A, KO the Allies and play the Enemies. <span class="line-gap"></span>
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
        condition: `gameStart`,
        uses: `1`,
        shared: `no`,
        effect: `destroyCity`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `drawFromEnemyKoAllies(5)`
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
        uses: `0`,
        shared: `no`,
        effect: `disableRestoration`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `If a Bystander is drawn on an empty board, they enter the map as a 1 HP, 1 Damage Henchman. KO'ing them with 2 or less Damage is the only way to rescue them. <span class="line-gap"></span>
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
        condition: `bystanderDrawnOnEmpty`,
        uses: `999`,
        shared: `no`,
        effect: `spawnBystanderHenchman`
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
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `reverseBoardPositions`
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
