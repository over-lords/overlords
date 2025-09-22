const cardArtFolder = "https://github.com/over-lords/overlords/blob/4e213a0cf96a96c6b365623c3065a9f3af7caece/Public/Images/Card%20Assets/HeroCards"

export const heroes = [
  {
    id: "1",
    name: "Superman",
    image: `${cardArtFolder}/Superman.jpg`,
    type: "Hero",
    category: "Guardian",
    color: "blue",
    teams: ["Super","Justice League"],
    hp: "15",
    damageThreshold: "3",
    retreat: "3",
    travel: "2",
    abilitiesText: [
      {
        text: `3/Game: Superman can ignore taking Damage, or he can Protect another Hero.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Ignore Damage`
      },
      {
        text: `Protect Hero`
      }
    ],
    abilitiesEffects: [
      {
        effect: ignoreDamage
      },
      {
        effect: protectHero
      }
    ]
  }
]