const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/0cbdcd8b5a28b55d0e3be3bb2ceb9f1e00e3825a/Public/Images/Card%20Assets/Overlords";

export const overlords = [
    {
    id: "1",
    name: "Darkseid",
    image: `${cardArtFolder}/Darkseid.jpg`,
    type: "Overlord",
    level: "3",
    hp: "150",
    doNotShow: "false",
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
    id: "2",
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
        condition: `startGame`,
        uses: `1`,
        shared: `no`,
        effect: `gainLife(3*bat)`
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
    evilWinsNamePrint: [
      {
        text: `Bonus Round!`
      }
    ],
    evilWinsEffects: [
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
    id: "3",
    name: "Psimon",
    image: `${cardArtFolder}/Psimon.jpg`,
    type: "Overlord",
    level: "2",
    hp: "55",
    doNotShow: "false",
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
    evilWinsNamePrint: [
      {
        text: `No Peeking!`
      }
    ],
    evilWinsEffects: [
      {
        type: `passive`,
        condition: `heroKOd`,
        uses: `0`,
        shared: `no`,
        effect: `disableScan()`
      }
    ]
  },
]