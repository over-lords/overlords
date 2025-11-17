const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Misc";

// ids 5401-5600 + 7001 (for MOTO)

export const tactics = [
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
    limitEaA: ["allEnemies","min(30)"],
    multiTacticReq: "yes",
    multiOverlordReq: "yes",
    abilitiesText: [
      {
        text: `Required: 2+ Overlords, 2 Tactics, Enemies-Only (30 minimum). <span class="line-gap"></span>
              Might of the Overlord: Draw twice from the Enemies and Allies Pile, and once from the Villain Deck.`
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
        effect: `enemiesDraw(2),villainDraw(1)`
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
    limitEaA: ["no"],
    multiTacticReq: "no",
    multiOverlordReq: "no",
    abilitiesText: [
      {
        text: `Henchmen enter the map with 1 additional HP. <span class="line-gap"></span>
               Might of the Overlord: Play the next 2 Henchmen or Villains from the Villain Deck.`
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
        condition: `henchmenRallied()`,
        uses: `999`,
        shared: `no`,
        effect: `ralliedHenchGainLife(1)`
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
        effect: `rallyNextHenchVillains(2)`
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