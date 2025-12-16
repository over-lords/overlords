const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Misc";

// ids 5401-5600 + 7001 (for MOTO)

export const tactics = [
  {
    id: "8001",
    name: "Countdown - 1",
    doNotShow: "true",
    type: "Countdown",
    number: 1,
  },
  {
    id: "8002",
    name: "Countdown - 2",
    doNotShow: "true",
    type: "Countdown",
    number: 2,
  },
  {
    id: "8003",
    name: "Countdown - 3",
    doNotShow: "true",
    type: "Countdown",
    number: 3,
  },
  {
    id: "8004",
    name: "Countdown - 4",
    doNotShow: "true",
    type: "Countdown",
    number: 4,
  },
  {
    id: "8005",
    name: "Countdown - 5",
    doNotShow: "true",
    type: "Countdown",
    number: 5,
  },
  {
    id: "8006",
    name: "Countdown - 6",
    doNotShow: "true",
    type: "Countdown",
    number: 6,
  },
  {
    id: "7001",
    name: "Might of the Overlord",
    image: `${cardArtFolder}/Might of the Overlord.jpg`,
    doNotShow: "true",
    type: "Might",
  },
  {
    id: "5401",
    name: "Metropolis Bank Robbery",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: "no",
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Might of the Overlord: KO all captured Bystanders. Then, if there is a Villain in Metropolis, they capture 2 Bystanders. <span class="line-gap"></span>
              Bonus Evil Wins Condition: Evil Wins when 10 Bystanders have been KO'd.`
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
        effect: `none`
      }
    ],
    mightNamePrint: [
      {
        text: `Boom! Boom! Boom!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `koAllBystandersCapture(metropolis,2)`
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
    id: "5402",
    name: "Welcome to Hell",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: ["allEnemies","min(30)"],
    multiTacticReq: "yes",
    multiOverlordReq: "yes",
    abilitiesText: [
      {
        text: `Required: 2+ Overlords, 2 Tactics, Enemies-Only (30 minimum). <span class="line-gap"></span>
              Might of the Overlord: Draw 2 from the E&A, and once from the Villain Deck.`
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
        effect: `none`
      }
    ],
    mightNamePrint: [
      {
        text: `There's More?!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`enemiesDraw(2)`,`villainDraw(1)`]
      }
    ],
    evilWinsNamePrint: [
      {
        text: `none`
      }
    ],
    evilWinsEffects: [
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
    id: "5403",
    name: "Kryptonian Strength Enhancer",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `The Overlord is immune to Damage that would reduce them to 0 HP while there is an active Henchman or Villain. <span class="line-gap"></span>
               Might of the Overlord: The Overlord gains 10 HP.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Unlimited Power!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `wouldTakeDamageWhileCityOccupied()`,
        uses: `999`,
        shared: `no`,
        effect: `ignoreDamage()`
      }
    ],
    mightNamePrint: [
      {
        text: `I'm Just Getting Started!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `overlordGainLife(10)`
      }
    ],
    evilWinsNamePrint: [
      {
        text: `none`
      }
    ],
    evilWinsEffects: [
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
    id: "5404",
    name: "We Are Legion",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Henchmen enter the map with 1 additional HP. <span class="line-gap"></span>
               Might of the Overlord: Play the next Henchman or Villain from the Villain Deck.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Intergang's Going Public.`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `henchmanRallied`,
        uses: `999`,
        shared: `no`,
        effect: `henchGainLife(1,lastRallied)`
      }
    ],
    mightNamePrint: [
      {
        text: `We Need Backup!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`rallyNextHenchVillains(1)`]
      }
    ],
    evilWinsNamePrint: [
      {
        text: `none`
      }
    ],
    evilWinsEffects: [
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
    id: "5405",
    name: "Computer Virus",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: "no",
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `No Heroes can Scan. <span class="line-gap"></span>
                Might of the Overlord: KO the top card of every Heroes' deck.`
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
        effect: `none`
      }
    ],
    mightNamePrint: [
      {
        text: `Brzzt! Deletion Successful!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `koTopHeroCard(all,1)`
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
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `evilWins`
      }
    ]
  },
  {
    id: "5406",
    name: "Coming of Apokalips",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: "no",
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Might of the Overlord: Draw from the E&A. <span class="line-gap"></span> Also, the current turn Hero must CHOOSE: KO 1 Bystander. <span class="line-gap"></span> OR <span class="line-gap"></span> Destroy the Rightmost City. <span class="line-gap"></span><span class="line-gap"></span>
              Bonus Evil Wins Condition: Evil Wins when 10 Bystanders have been KO'd.`
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
        effect: `none`
      }
    ],
    mightNamePrint: [
      {
        text: `Additional Chaos!`
      },
      {
        text: `Choose!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`enemiesDraw(1)`]
      },
      {
        type: `choose()`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`koBystander(1)`,`destroyNextCity()`]
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
    id: "5407",
    name: "Overwhelming Might",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Might of the Overlord: Draw 5 from the Villain Deck (ignore additional Mights of the Overlord drawn by this effect).`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      }
    ],
    mightNamePrint: [
      {
        text: `Why did you say that?!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `drawVillainIgnoreMights(5)`
      }
    ],
    evilWinsNamePrint: [
      {
        text: `none`
      }
    ],
    evilWinsEffects: [
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
    id: "5408",
    name: "Welcome to the Madhouse",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: "no",
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `KO'd Heroes enter the board as Villains. <span class="line-gap"></span>
                Might of the Overlord: Engaged Heroes take their foe's Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Welcome Home!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `heroKod()`,
        uses: `0`,
        shared: `no`,
        effect: `returnHeroAsVillain()`
      }
    ],
    mightNamePrint: [
      {
        text: `On My Command!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `heroTakeFoeDamage(all)`
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
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `evilWins`
      }
    ]
  },
  {
    id: "5409",
    name: "Thanagar Strikes",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: "no",
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `All Villains gain Glide. <span class="line-gap"></span>
                Might of the Overlord: Draw 3 from the Villain Deck (ignore additional Mights of the Overlord drawn by this effect).`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Have Some Wings!`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `villainDrawn()`,
        uses: `0`,
        shared: `no`,
        effect: `villainGainGlide()`
      }
    ],
    mightNamePrint: [
      {
        text: `Drop Ship Approaching!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `drawVillainIgnoreMights(3)`
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
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `evilWins`
      }
    ]
  },
  {
    id: "5410",
    name: "In Blackest Night",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: "no",
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `KO'd Heroes enter the board as Villains. <span class="line-gap"></span>
                Might of the Overlord: Revive the first KO'd Henchman or Villain.`
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
        uses: `0`,
        shared: `no`,
        effect: `returnHeroAsVillain()`
      }
    ],
    mightNamePrint: [
      {
        text: `Emotion Detected!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `reviveKodFoe(first)`
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
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `evilWins`
      }
    ]
  },
  {
    id: "5411",
    name: "Systematic Destruction",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Might of the Overlord: All Heroes must KO a card from either their Hand or discard pile.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `none`
      }
    ],
    abilitiesEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      }
    ],
    mightNamePrint: [
      {
        text: `Zap!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: `koCardFromHandORDiscard(1)`
      }
    ],
    evilWinsNamePrint: [
      {
        text: `none`
      }
    ],
    evilWinsEffects: [
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
    id: "5412",
    name: "Forever Evil",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: ["no"],
    multiTacticReq: "yes",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `When you KO a Henchman: OPTIONAL: Ignore their Reward and deal their Damage to another Henchman, Villain, or the Overlord. <span class="line-gap"></span>
              Might of the Overlord: All Heroes take Damage equal to the number of rescued Bystanders.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Throw the goons!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `kodHenchman()`,
        uses: `999`,
        shared: `no`,
        effect: `ignoreRewardDamageOverlord(henchmanDamage())`
      }
    ],
    mightNamePrint: [
      {
        text: `Disguised Bystanders!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`damageHero(all,rescuedBystandersCount())`]
      }
    ],
    evilWinsNamePrint: [
      {
        text: `none`
      }
    ],
    evilWinsEffects: [
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
    id: "5413",
    name: "Year of the Villain",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: ["no"],
    multiTacticReq: "yes",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `OPTIONAL: When you rescue a Bystander, KO them (doing so means you do not gain their benefits). <span class="line-gap"></span>
              Bonus Heroes Win Condition: You win when 10 Bystanders have been KO'd.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `I Don't Have Time for This!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `rescueBystander()`,
        uses: `999`,
        shared: `no`,
        effect: `koRescuedBystander()`
      }
    ],
    mightNamePrint: [
      {
        text: `none`
      }
    ],
    mightEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `999`,
        shared: `no`,
        effect: [`none`]
      }
    ],
    heroWinsNamePrint: [
      {
        text: `We Did It Gang!`
      }
    ],
    heroWinsEffects: [
      {
        type: `heroWins`,
        condition: `bystandersKOD(10)`,
        uses: `1`,
        shared: `no`,
        effect: `heroWins`
      }
    ]
  },
  {
    id: "5414",
    name: "A League of our Own",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `When you rescue a Bystander, deal 1 Damage to a Henchman, Villain, or the Overlord. When a Bystander is KO'd, all Heroes take 2 Damage. <span class="line-gap"></span>
              Might of the Overlord: Draw 3 from the E&A.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `One for All! All for One!`
      },
      {
        text: `One for All! All for One!`
      }
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `bystanderRescued()`,
        uses: `999`,
        shared: `no`,
        effect: `damageAnyBaddie(1)`
      },
      {
        type: `quick`,
        condition: `bystanderKod()`,
        uses: `999`,
        shared: `no`,
        effect: `damageHero(all,2)`
      },
    ],
    mightNamePrint: [
      {
        text: `There's So Many!`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`enemyDraw(3)`]
      }
    ],
    evilWinsNamePrint: [
      {
        text: `none`
      }
    ],
    evilWinsEffects: [
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
    id: "5415",
    name: "Down Low, Too Slow",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "true",
    limitVillainDeck: ["hench(10)","villain(20)","bystander(5)","might(6)","scenario(3)"],
    limitEaA: ["no"],
    multiTacticReq: "yes",
    multiOverlordReq: "yes",
    abilitiesText: [
      {
        text: `Required: A maximum of 10 Henchmen, 20 Villains, 5 Bystanders, 6 Mights of the Overlord, and 3 Scenarios. <span class="line-gap"></span>
                Double the Damage of all Villains. <span class="line-gap"></span>
                  All Heroes gain a 1/Game Icon Ability: On their turn, KO a Henchman or Villain. <span class="line-gap"></span>
                    Might of the Overlord: KO a Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Hit them Fast and Hard!`
      },
      {
        text: `Supercharged!`
      },
    ],
    abilitiesEffects: [
      {
        type: `quick`,
        condition: `villainDrawn()`,
        uses: `999`,
        shared: `no`,
        effect: `doubleVillainDamage()`
      },
      {
        type: `quick`,
        condition: `gameStart()`,
        uses: `1`,
        shared: `no`,
        effect: `grantInstantKOToAll()`
      }
    ],
    mightNamePrint: [
      {
        text: `One by One.`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`koHero(1)`]
      }
    ],
    evilWinsNamePrint: [
      {
        text: `none`
      }
    ],
    evilWinsEffects: [
      {
        type: `none`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `none`
      }
    ]
  },
]