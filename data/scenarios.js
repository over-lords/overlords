const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/4c0f2468199e5fcd6ee3a996f5803d11a9c9d981/Public/Images/Card%20Assets/Misc";

// ids 5201-5400

export const scenarios = [
    {
        id: "5201",
        name: "Kid Stuff",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `All [ICON:Justice] Heroes deal half Damage.`
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
                effect: `halfDamage(Justice)`
            }
        ]
    },
    {
        id: "5202",
        name: "Enemy Telepath",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `Heroes cannot Scan.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Stop Cheating!`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                effect: `disableScan()`
            }
        ]
    },
    {
        id: "5203",
        name: "Knightfall",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `All [ICON:Bat] Heroes take 1 Damage at the end of their turns.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `You Will Break!`
            }
        ],
        abilitiesEffects: [
            {
                type: `quick`,
                condition: `teamHeroEndTurn(Bat)`,
                effect: `damageHero(1,current,ignoreDT)`
            }
        ]
    },
    {
        id: "5204",
        name: "Flashpoint",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `[ICON:Flash] Heroes have their Damage Thresholds reduced to 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `You Can't Save Everyone!`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                effect: `setHeroDTtoX(Flash,1,permanent,5204)`
            }
        ]
    },
    {
        id: "5205",
        name: "Public Enemies",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `Draw from the E&A once at the start of every turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Raise the bounty!`
            }
        ],
        abilitiesEffects: [
            {
                type: `quick`,
                condition: `turnStart`,
                effect: `enemyDraw(1)`
            }
        ]
    },
    {
        id: "5206",
        name: "Brainiac Attacks",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `At the end of every turn, KO a Bystander.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Bottle them, one by one.`
            }
        ],
        abilitiesEffects: [
            {
                type: `quick`,
                condition: `turnEnd`,
                effect: `koBystander(1)`
            }
        ]
    },
    {
        id: "5207",
        name: "Kryptonite Meteor",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `All [ICON:Super] Heroes deal half Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Time's Nearly Up!`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                effect: `halfDamage(Super)`
            }
        ]
    },
    {
        id: "5208",
        name: "Boiling Oceans",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `[ICON:Aqua] Heroes gain no benefits from being in Coastal Cities.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `The Water's On Fire.`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                effect: `disableCoastalBonus(Aqua)`
            }
        ]
    },
    {
        id: "5209",
        name: "Broken Trust",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `All [ICON:Wonder] Heroes cannot be Blocked.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Stabbed in the Back.`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                effect: `disableProtectOn(Wonder)`
            }
        ]
    },
    {
        id: "5210",
        name: "Judas Contract",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `[ICON:Titans] Heroes gain no benefits from Teammates.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Who Can We Trust?`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                effect: `disableTeamBonus(Titans)`
            }
        ]
    },
    {
        id: "5211",
        name: "Sinestro Corps War",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "false",
        hp: "10",
        abilitiesText: [
            {
                text: `[ICON:Lantern] Heroes take double Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Beware your fears made into light!`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                effect: `doubleDamageAgainst(Lantern,permanent,5211)`
            }
        ]
    },
    {
        id: "5212",
        name: "League of Killers",
        image: `${cardArtFolder}/Scenario.jpg`,
        type: "Scenario",
        doNotShow: "true",
        hp: "10",
        abilitiesText: [
            {
                text: `[ICON:Squad] and [ICON:Legion] Heroes take double Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `They've gone Mad!`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                effect: [`doubleDamageAgainst(Squad,permanent)`,`doubleDamageAgainst(Legion,permanent)`]
            }
        ]
    },
]