const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Bystanders";

// ids 4201-4250

export const bystanders = [
    {
        id: "4201",
        name: "Bystander",
        image: `${cardArtFolder}/Bystander.jpg`,
        type: "Bystander"
    },
    {
        id: "4202",
        name: "Undercover Bystander",
        image: `${cardArtFolder}/Undercover.jpg`,
        type: "Bystander",
        abilitiesText: [
            {
                text: `Draw 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Draw 1`
            }
        ],
        abilitiesEffects: [
            {
                effect: `draw(1)`
            }
        ]
    },
    {
        id: "4203",
        name: "Captured Argus Agent",
        image: `${cardArtFolder}/Argus Agent.jpg`,
        type: "Bystander",
        abilitiesText: [
            {
                text: `OPTIONAL : Draw from the E&A.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Draw from the E&A`
            }
        ],
        abilitiesEffects: [
            {
                type: `optional`,
                effect: `enemyDraw(1)`
            }
        ]
    },
    {
        id: "4204",
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
                text: `Regain 2 HP`
            }
        ],
        abilitiesEffects: [
            {
                effect: `regainLife(2)`
            }
        ]
    },
    {
        id: "4205",
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
                text: `Gain a Sidekick`
            }
        ],
        abilitiesEffects: [
            {
                effect: `gainSidekick(1)`
            }
        ]
    },
]