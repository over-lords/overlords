const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Bystanders";

export const bystanders = [
    {
        id: "1",
        name: "Bystander",
        image: `${cardArtFolder}/Bystander.jpg`,
        type: "Bystander"
    },
    {
        id: "2",
        name: "Undercover Bystander",
        image: `${cardArtFolder}/Undercover.jpg`,
        type: "Bystander",
        abilitiesText: [
            {
                text: `Draw a card.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Draw a card.`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `draw(1)`
            }
        ]
    },
    {
        id: "3",
        name: "Captured Argus Agent",
        image: `${cardArtFolder}/Argus Agent.jpg`,
        type: "Bystander",
        abilitiesText: [
            {
                text: `You may draw from the Enemies and Allies Pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `You may draw from the Enemies and Allies Pile.`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `drawEaA(1)`
            }
        ]
    },
    {
        id: "4",
        name: "Medic",
        image: `${cardArtFolder}/Medic.jpg`,
        type: "Bystander",
        abilitiesText: [
            {
                text: `Regain 2 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Regain 2 HP.`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `gainLife(2)`
            }
        ]
    },
    {
        id: "5",
        name: "Captured Sidekick",
        image: `${cardArtFolder}/Sidekick.jpg`,
        type: "Bystander",
        abilitiesText: [
            {
                text: `Gain a Sidekick.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Gain a Sidekick.`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `gainSidekick(1)`
            }
        ]
    },
]