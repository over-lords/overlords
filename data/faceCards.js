const cardArtFolder = "https://github.com/over-lords/overlords/blob/bbb15a0a42b04bbc0028b975ae8270a7923c47b1/Public/Images/Card%20Assets/HeroCards"

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
        text: `Ignore the Damage`
      },
      {
        text: `Protect another Hero`
      }
    ],
    abilitiesEffects: [
      {
        effect: `ignoreDamage`
      },
      {
        effect: `protectHero`
      }
    ]
  },
  {
    id: "43",
    name: "Batman",
    image: `${cardArtFolder}/Batman.jpg`,
    type: "Hero",
    category: "Tactician",
    color: "yellow",
    teams: ["Bat","Justice League"],
    hp: "10",
    damageThreshold: "2",
    retreat: "3",
    travel: "1",
    abilitiesText: [
      {
        text: `Batman deals double Damage against Henchmen and Villains in Gotham <span class="line-gap"></span> 3/Game: Without rolling, Batman can retreat and take no Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Retreat without rolling`
      },
      {
        text: `Double Damage In Gotham`
      }
    ],
    abilitiesEffects: [
      {
        effect: `retreatFree`
      },
      {
        effect: `passiveDoubleAllDamage(Gotham)`
      }
    ]
  }
]