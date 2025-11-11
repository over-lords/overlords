const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Overlords";

export const overlords = [
    {
    id: "1",
    name: "Darkseid",
    image: `${cardArtFolder}/Darkseid.jpg`,
    type: "Overlord",
    level: "3",
    hp: "150",
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
]