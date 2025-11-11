const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Misc";

export const scenarios = [
    {
        id: "1",
        name: "Kid Stuff",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        hp: "10",
        abilitiesText: [
        {
            text: `All [ICON:Justice] Heroes deal half damage.`
        }
        ],
        abilitiesNamePrint: [
            {
                text: `I Hate Magic.`
            }
            ],
        abilitiesEffects: [
        {
            type: `passive`,
            condition: `is(Justice)`,
            uses: `0`,
            shared: `no`,
            effect: `halfDamage`
        }
        ]
    },
]