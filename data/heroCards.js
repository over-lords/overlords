const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets";

export const heroCards = [
  {
    id: "0",
    name: "Sidekick",
    image: `${cardArtFolder}/Misc/Sidekick.jpg`,
    damage: "0",
    abilitiesText: [
      {
        text: `Draw 2.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Draw 2`
      }
    ],
    abilitiesEffects: [
      {
        effect: `draw(2)`
      }
    ]
  },
  {
    id: "1",
    name: "World of Cardboard",
    hero: "Superman",
    image: `${cardArtFolder}/Superman/World Made of Cardboard.jpg`,
    perDeck: "1",
    damage: "5",
    abilitiesText: [
      {
        text: `For every KO'd Hero this card deals 1 additional Damage.`
      }
    ],
    abilitiesNamePrint: [
      {
        text: `Boost card damage`
      }
    ],
    abilitiesEffects: [
      {
        effect: `boostCardDamage(findKOdHeroes)`
      }
    ]
  }
]