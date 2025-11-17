const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/fc271a8062837c99e1c991fb0aa263eb7ffc54d1/Public/Images/Card%20Assets/Allies";

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