const cardArtFolder = "https://github.com/over-lords/overlords/blob/4e213a0cf96a96c6b365623c3065a9f3af7caece/Public/Images/Card%20Assets"

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