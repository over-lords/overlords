const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Villains";

export const villains = [
    {
    id: "1",
    name: "Faora",
    image: `${cardArtFolder}/Faora.jpg`,
    type: "Villain",
    hero: "Superman",
    hp: "16",
    damage: "2",
    abilitiesText: [
      {
        text: `Charge 1 <span class="line-gap"></span> Reward: Deal 2 Damage to the Overlord.`
      }
    ],
    abilitiesNamePrint: [
        {
            text: `Charge!`
        },
        {
            text: `Reward!`
        }
        ],
    abilitiesEffects: [
      {
        type: `uponEntry`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `charge(1)`
      },
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `damageOverlord(2)`
      }
    ]
  },
]