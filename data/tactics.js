const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Misc";

export const tactics = [
    {
    id: "1",
    name: "Metropolis Bank Robbery",
    image: `${cardArtFolder}/Tactic.jpg`,
    type: "Tactic",
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
]