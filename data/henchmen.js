const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Henchmen";

export const henchmen = [
    {
    id: "1",
    name: "Joker Gang",
    image: `${cardArtFolder}/Joker Gang.jpg`,
    type: "Henchman",
    hp: "1",
    damage: "1",
    abilitiesText: [
      {
        text: `Reward: Rescue a Bystander.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Reward!`
      }
    ],
    abilitiesEffects: [
      {
        type: `uponDefeat`,
        condition: `none`,
        uses: `1`,
        shared: `no`,
        effect: `rescueBystander(1,random)`
      }
    ]
  },
]