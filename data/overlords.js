const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/fc271a8062837c99e1c991fb0aa263eb7ffc54d1/Public/Images/Card%20Assets/Overlords";

// ids 5001-5200

export const overlords = [
  {
    id: "5001",
    name: "Darkseid",
    image: `${cardArtFolder}/Darkseid.jpg`,
    type: "Overlord",
    level: "3",
    hp: "150",
    doNotShow: "true",
    abilitiesText: [
      {
        text: `At the end of a Hero's turn, if they engaged Darkseid, they take 1 Damage (ignoring their Damage Threshold). <span class="line-gap"></span>
               Might of the Overlord: KO 2 Bystanders unless a Hero KO's 2 random cards from their discard pile. <span class="line-gap"></span>
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
        effect: `damageAttacker(1)`
      }
    ],
    mightNamePrint: [
      {
          text: `Either they burn, or you do!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `askToKOorKOBystanders(2)`
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
        uses: `1`,
        shared: `no`,
        effect: `evilWins`
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
    doNotShow: "true",
    abilitiesText: [
      {
        text: `At the start of the game, Joker's Hit Points are increased by 3 for every active [ICON:Bat] Hero. <span class="line-gap"></span>
               Might of the Overlord: Draw 1 card from the Villain Deck for every active Hero. <span class="line-gap"></span>
               Bonus Feature: If there are 3 or more active [ICON:Bat] Heroes at the start of the game, Joker implements this feature. At the end of every 
               Hero's turn, they must KO a card from their discard pile or take 2 Damage.`
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
        condition: `gameStart()`,
        uses: `1`,
        shared: `no`,
        effect: `gainLife(3*count(Bat))`
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
        effect: `villainDraw(1*active)`
      }
    ],
    bonusNamePrint: [
      {
        text: `Bonus Round!`
      }
    ],
    bonusEffects: [
      {
        type: `endTurn`,
        condition: `batActive(3)`,
        uses: `999`,
        shared: `no`,
        effect: `koCardorTakeDamage(2)`
      }
    ]
  },
  {
    id: "5003",
    name: "Psimon",
    image: `${cardArtFolder}/Psimon.jpg`,
    type: "Overlord",
    level: "2",
    hp: "55",
    doNotShow: "true",
    abilitiesText: [
      {
        text: `If a Hero is KO'd: Next turn do not draw from the Villain Deck, that Hero enters as a Villain. <span class="line-gap"></span>
               Might of the Overlord: Of the next 5 cards in the Villain Deck, play all of the Henchmen and Villains. <span class="line-gap"></span>
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
        effect: `returnHeroAsVillain`
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
        effect: `villainPlay(5,hench+villains)`
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
        text: `Might of the Overlord: Draw once from the Villain Deck and all active [ICON:Super] Heroes take 2 Damage.`
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
        effect: `villainDraw(1),damage(2,Super)`
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
        text: `Might of the Overlord: Play the next Enemy from the Enemies and Allies Pile.`
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
        effect: `drawEnemy(1)`
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
        condition: `gameStart()`,
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
        effect: `healOverlord(25)`
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
        condition: [`used_abilitiesEffects(1)`,`foeEscapes()`],
        uses: `999`,
        shared: `no`,
        effect: `gainMaxHP()`
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
        condition: `gameStart()`,
        uses: `1`,
        shared: `no`,
        effect: `damageHero(aqua,1)`
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
        effect: `damageHero(coastal,3)`
      },
      {
        type: `might`,
        condition: `cityEmpty(coastal)`,
        uses: `999`,
        shared: `no`,
        effect: `destroyNextCity()`
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
        condition: `gothamDestroyed()`,
        uses: `0`,
        shared: `no`,
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
        condition: `gameStart()`,
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
        condition: `3TitansGameStart()`,
        uses: `0`,
        shared: `no`,
        effect: `disableVillainDeckKO()`
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
               Might of the Overlord: Ultraman enters the map as a 20 HP, 3 Damage Villain with Charge 1 and Glide. If he is reduced to 0 HP, he is sent 
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
        condition: `overlordKoHero()`,
        uses: `0`,
        shared: `no`,
        effect: `healOverlord(10)`
      }
    ]
  },
]