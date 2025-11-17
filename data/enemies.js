const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Enemies";

// ids 4251-4550

export const enemies = [
    {
        id: "4251",
        name: "Rival",
        image: `${cardArtFolder}/Rival.png`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero's Damage Threshold is reduced to 1 until the start of their next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Slowdown!`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `dtToXForX(1,1)`
            }
        ]
    },
]