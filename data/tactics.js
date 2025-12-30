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
    doNotShow: "false",
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
        effect: [`koCapturedBystander(all)`,`foeCaptureBystander(8,2)`]
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
  {
    id: "5402",
    name: "Welcome to Hell",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
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
        effect: [`enemyDraw(2)`,`villainDraw(1)`]
      }
    ]
  },
  {
    id: "5403",
    name: "Kryptonian Strength Enhancer",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `The first time each turn the Overlord is Damaged, the Hero that dealt the Damage takes 1 in return. <span class="line-gap"></span>
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
        condition: `overlordFirstAttackPerTurn`,
        uses: `999`,
        shared: `no`,
        effect: `damageHero(1,current,ignoreDT)`
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
        effect: `damageOverlord(-10)`
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
        type: `passive`,
        condition: `henchmanEntered()`,
        uses: `0`,
        shared: `no`,
        effect: `henchEntryBonusHp(1)`
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
    ]
  },
  {
    id: "5405",
    name: "Computer Virus",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
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
        text: `Fried...`
      }
    ],
    abilitiesEffects: [
      {
        type: `passive`,
        condition: `none`,
        uses: `0`,
        shared: `no`,
        effect: `disableScan()`
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
        effect: `koTopHeroCard(1,all)`
      }
    ]
  },
  {
    id: "5406",
    name: "Coming of Apokalips",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
    limitEaA: "no",
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Might of the Overlord: Draw from the E&A. <span class="line-gap"></span> 
                  Also, the current turn Hero must CHOOSE: KO 1 Bystander. <span class="line-gap"></span> 
                    OR <span class="line-gap"></span> 
                  Destroy the Rightmost City. <span class="line-gap"></span><span class="line-gap"></span>

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
      },
      {
        text: `KO a Bystander`
      },
      {
        text: `Destroy a City`
      }
    ],
    mightEffects: [
      {
        type: `might`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
        effect: [`enemyDraw(1)`]
      },
      {
        type: `chooseOption`,
        effect: `chooseYourEffect`,
        condition: `might`,
        uses: `999`,
        shared: `no`,
      },
      {
          type: `chooseOption(1)`,
          effect: [`koBystander(1)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`destroyCity(1)`]
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
    id: "5407",
    name: "Overwhelming Might",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Might of the Overlord: Draw 3 Henchmen or Villains from the Villain Deck.`
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
        effect: `rallyNextHenchVillains(3)`
      }
    ]
  },
  {
    id: "5408",
    name: "Welcome to the Madhouse",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
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
        effect: `damageHero(engagedFoeDamage,all)`
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
        text: `All Villains gain Charge 1. <span class="line-gap"></span>
                Might of the Overlord: Draw 3 Henchmen or Villains from the Villain Deck.`
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
        effect: `villainGainCharge(1)`
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
        effect: `rallyNextHenchVillains(3)`
      }
    ]
  },
  {
    id: "5410",
    name: "In Blackest Night",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
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
        effect: `reviveKodFoe(1)`
      }
    ]
  },
  {
    id: "5411",
    name: "Systematic Destruction",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Might of the Overlord: The current Hero must CHOOSE : KO the top card of their deck. OR KO the top card of their discard pile.`
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
        text: `Choose!`
      },
      {
        text: `KO top of deck`
      },
      {
        text: `KO top of discard`
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
          effect: [`koTopHeroCard(1,current)`]
      },
      {
          type: `chooseOption(2)`,
          effect: [`koTopHeroDiscard(1,current)`]
      },
    ],
  },
  {
    id: "5412",
    name: "Forever Evil",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
    doNotShow: "false",
    limitEaA: ["no"],
    multiTacticReq: "yes",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `When you KO a Henchman: OPTIONAL : Ignore their Reward and deal their Damage to another Henchman, Villain, or the Overlord. <span class="line-gap"></span>
              Might of the Overlord: All Heroes take Damage equal to the number of rescued Bystanders. <span class="line-gap"></span>
              You must run a second Tactic alongside this one.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore this Henchman's Reward to Damage the Overlord`
      }
    ],
    abilitiesEffects: [
      {
        type: `optional`,
        condition: `kodHenchman()`,
        uses: `999`,
        shared: `no`,
        effect: `ignoreRewardDamageOverlord(henchmanDamage)`
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
        effect: [`damageHero(rescuedBystandersCount,all)`]
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
              Bonus Heroes Win Condition: You win when 10 Bystanders have been KO'd. <span class="line-gap"></span>
              You must run a second Tactic alongside this one.`
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
        text: `When you Rescue a Bystander, deal 1 Damage to a Henchman or Villain. When a Bystander is KO'd, all Heroes take 1 Damage. <span class="line-gap"></span>
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
        effect: `damageFoe(1,any)`
      },
      {
        type: `quick`,
        condition: `bystanderKod()`,
        uses: `999`,
        shared: `no`,
        effect: `damageHero(1,all,ignoreDT)`
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
        text: `Required: A maximum of 10 Henchmen, 20 Villains, 5 Bystanders, 6 Mights of the Overlord, 3 Scenarios, and a minimum of 2 Tactics and 2 Overlords. <span class="line-gap"></span>
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
        effect: [`damageHero(999,random,ignoreDT)`]
      }
    ]
  },
]