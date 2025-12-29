const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/fc271a8062837c99e1c991fb0aa263eb7ffc54d1/Public/Images/Card%20Assets/Enemies";

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
                text: `I Have No Rival!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `setHeroDTtoXforX(current,1,1)`
            }
        ]
    },
    {
        id: "4252",
        name: "Maxwell Lord",
        image: `${cardArtFolder}/maxwellLord.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All [ICON:Wonder] Heroes take double Damage until the end of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Stabbed in the back`
            }
        ],
        abilitiesEffects: [
            {
                effect: `doubleDamageAgainst(wonder,next)`
            }
        ]
    },
    {
        id: "4253",
        name: "Composite Superman",
        image: `${cardArtFolder}/compositeSuperman.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero loses 1 random Icon Ability use.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Your Power is Mine`
            }
        ],
        abilitiesEffects: [
            {
                effect: `loseIconUse(1,random)`
            }
        ]
    },
    {
        id: "4254",
        name: "Major Force",
        image: `${cardArtFolder}/majorForce.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Every Hero's Maximum HP is reduced by 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Eat Rads!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `lowerMaxHP(1,all)`
            }
        ]
    },
    {
        id: "4255",
        name: "El Diablo",
        image: `${cardArtFolder}/elDiablo.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes take 2 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Burn, Pendejos!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageHero(2,all)`
            }
        ]
    },
    {
        id: "4256",
        name: "Amazo",
        image: `${cardArtFolder}/amazo.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The Overlord gains 25 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Priority Alpha`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageOverlord(-25)`
            }
        ]
    },
    {
        id: "4257",
        name: "Black Spider",
        image: `${cardArtFolder}/blackSpider.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Henchmen in Star and Coast cities become immune to Damage until the start of your Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Covering Fire!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `protect(henchmen,["Star","Coast"])`
            }
        ]
    },
    {
        id: "4258",
        name: "Lady Shiva",
        image: `${cardArtFolder}/ladyShiva.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO one card from your Hero's hand or discard pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Disarmed!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `koCards(1,["hand","discard"])`
            }
        ]
    },
    {
        id: "4259",
        name: "Bronze Tiger",
        image: `${cardArtFolder}/bronzeTiger.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The leftmost engaged Hero takes 1 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `From Behind!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageHero(1,leftmostEngaged)`
            }
        ]
    },
    {
        id: "4260",
        name: "Hugo Strange",
        image: `${cardArtFolder}/hugoStrange.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 3 from the Villain Deck.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let the animals out to play`
            }
        ],
        abilitiesEffects: [
            {
                effect: `rallyNextHenchVillains(3)`
            }
        ]
    },
    {
        id: "4261",
        name: "Killer Moth",
        image: `${cardArtFolder}/killerMoth.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Move all unengaged Henchmen and Villains forward one space.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `C'mon guys!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `shoveVillain(allUnengaged,-2)`
            }
        ]
    },
    {
        id: "4262",
        name: "Dr Psycho",
        image: `${cardArtFolder}/drPsycho.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero cannot Retreat until the end of their next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Stay and Fight!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableRetreat(current,next)`
            }
        ]
    },
    {
        id: "4263",
        name: "Dr Alchemy",
        image: `${cardArtFolder}/drAlchemy.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero deals half Damage until the end of their next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Countered!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `halfDamage(current,next)`
            }
        ]
    },
    {
        id: "4264",
        name: "The Thinker",
        image: `${cardArtFolder}/theThinker.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes can only draw 1 card on their next turns.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Think Fast!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableExtraDraw(all,next)`
            }
        ]
    },
    {
        id: "4265",
        name: "Volcana",
        image: `${cardArtFolder}/volcana.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero takes 3 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `She's Hot!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageHero(3,current)`
            }
        ]
    },
    {
        id: "4266",
        name: "Orca",
        image: `${cardArtFolder}/orca.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Heroes in Coastal Cities take 1 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Snippy!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageHero(1,coastal)`
            }
        ]
    },
    {
        id: "4267",
        name: "Catman",
        image: `${cardArtFolder}/catman.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Until the end of your Hero's next turn, all Heroes can only Travel once per turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Sabotage!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableExtraTravel(all,next)`
            }
        ]
    },
    {
        id: "4268",
        name: "Wotan",
        image: `${cardArtFolder}/wotan.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Until the end of your Hero's next turn, no Heroes can use their Icon abilities.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Suppression Spell!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableIconAbilities(all,next)`
            }
        ]
    },
    {
        id: "4269",
        name: "Solaris",
        image: `${cardArtFolder}/solaris.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All [ICON:Super] Heroes deal half Damage until the end of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Red Sun!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `halfDamage(Super,next)`
            }
        ]
    },
    {
        id: "4270",
        name: "Doubledown",
        image: `${cardArtFolder}/doubledown.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes' discard piles are shuffled into their decks.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `No stacking!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `shuffleHeroDeck(all)`
            }
        ]
    },
]