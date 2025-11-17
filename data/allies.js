const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Allies";

// ids 4551-4850

export const allies = [
    {
        id: "4551",
        name: "Frankenstein",
        image: `${cardArtFolder}/Frankenstein.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 10 Damage to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Die!`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `damageOverlord(10)`
            }
        ]
    },
]