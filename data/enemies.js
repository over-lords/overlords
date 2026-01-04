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
                effect: `setHeroDTtoX(current,1,next)`
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
                effect: `doubleDamageAgainst(Wonder,next)`
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
                effect: `loseIconUse(current,1,random)`
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
                text: `All Heroes take 2 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Eat Rads!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageHero(2,all,ignoreDT)`
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
                text: `All Heroes take 1 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Burn, Pendejos!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageHero(1,all,ignoreDT)`
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
                effect: `protectFoe(henchmen,[0,2],next)`
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
                text: `KO the top card of every Hero's discard pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Disarmed!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `koTopHeroDiscard(all)`
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
                effect: `damageHero(1,leftmostEngaged,ignoreDT)`
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
    {
        id: "4271",
        name: "Bizarro League",
        image: `${cardArtFolder}/bizarroLeague.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Henchmen are KO'd and all unengaged Villains advance up to 5 spaces.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Me am great hero!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoe(999,allHenchmen)`
            },
            {
                effect: `shoveVillain(allUnengaged,-10)`
            }
        ]
    },
    {
        id: "4272",
        name: "Savitar",
        image: `${cardArtFolder}/savitar.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All [ICON:Flash] Heroes have their Damage Thresholds reduced by 1 until the end of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Siphon your Speed!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `decreaseHeroDT(Flash,1,next)`
            },
        ]
    },
    {
        id: "4273",
        name: "Parallax",
        image: `${cardArtFolder}/parallax.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All [ICON:Lantern] Heroes deal half Damage until the end of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Am Fear!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `halfDamage(Lantern,next)`
            }
        ]
    },
    {
        id: "4274",
        name: "Artemiz",
        image: `${cardArtFolder}/artemiz.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes take 3 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `As You Command!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageHero(3,all)`
            }
        ]
    },
    {
        id: "4275",
        name: "The Rot",
        image: `${cardArtFolder}/theRot.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Destroy the Rightmost City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Consume All!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `destroyCity(1)`
            }
        ]
    },
    {
        id: "4276",
        name: "Court of Owls",
        image: `${cardArtFolder}/courtOfOwls.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Villains are restored to full HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Cheers!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoe(-999,allVillains)`
            }
        ]
    },
    {
        id: "4277",
        name: "Professor Pyg",
        image: `${cardArtFolder}/professorPyg.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Villains capture 2 Bystanders.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `From Me to You!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `foeCaptureBystander(allVillains,2)`
            }
        ]
    },
    {
        id: "4278",
        name: "Godspeed",
        image: `${cardArtFolder}/godspeed.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 1 from the Villain Deck for each active [ICON:Flash] Hero.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Glad You Could Make It`
            }
        ],
        abilitiesEffects: [
            {
                effect: `villainDraw(getActiveTeamCount(Flash))`
            }
        ]
    },
    {
        id: "4279",
        name: "Overcorps",
        image: `${cardArtFolder}/overcorps.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Henchmen and Villains regain up to 2 HP, and if there is a Hero in Metropolis they take 3 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Submit!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(-2,all)`,`damageHeroAtCity(9,3)`]
            }
        ]
    },
    {
        id: "4280",
        name: "Justice Lords",
        image: `${cardArtFolder}/justiceLords.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero takes 3 Damage, but if they were engaged with a foe in a City, that foe is KO'd.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `You're Welcome.`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(3,current)`,`damageFoe(999,current)`]
            }
        ]
    },
]

// A: ambush bug, anarky, angle man, anton arcane, arkham knight
// B: black racer, blacksmith, blood league, brimstone, brother blood, brother grimm
// C: calendar man, chemo, chronos, cluemaster, cobalt blue, condiment king, cupid
// D: deacon blackfire, despero, dex starr, dr phosphorus, dr poison
// E: eclipso, eradicator
// F: fatal five, flamingo, flashpoint wonder woman, flashpoint aquaman
// H: hades
// I: icicle
// J: joker's daughter, justice lords
// K: kilg%re
// L: larfleeze
// M: magenta, magog, major disaster, maxie zeus, monocle, murmur
// N: neutron, new reichsmen, nightshade, non
// O: overcorps
// P: peekaboo, penny plunderer, plastique, plunder, polka dot man, professor ivo
// Q: qwardian weaponers
// R: ratcatcher, red son, red X, relic, richard dragon, royal flush gang, rupture
// S: slipknot, superboy prime
// T: to morrow, tattooed man, telos, terra, the mist, the ventriloquist, tweedle dee and dum
// W: white canary
// Z: zebra man