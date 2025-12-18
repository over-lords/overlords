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
                effect: `damageOverlord(10)`
            }
        ]
    },
    {
        id: "4552",
        name: "Steel",
        image: `${cardArtFolder}/steel.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Block the next Damage your Hero would take.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `In His Image!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `protectHero(1,current)`
            }
        ]
    },
    {
        id: "4553",
        name: "Commander Steel",
        image: `${cardArtFolder}/commanderSteel.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Block the next Damage your Hero would take.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Unbreakable!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `protectHero(1,current)`
            }
        ]
    },
    {
        id: "4554",
        name: "Atom Smasher",
        image: `${cardArtFolder}/atomSmasher.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE: KO a Henchman or Villain in Star City. <span class="line-gap"></span> OR <span class="line-gap"></span> Deal 3 Damage to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `KO a Foe in Star City`
            },
            {
                text: `Damage the Overlord`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`
            },
            {
                type: `chooseOption(1)`,
                effect: [`koFoeIn(0)`]
            },
            {
                type: `chooseOption(2)`,
                effect: [`damageOverlord(3)`]
            }
        ]
    },
    {
        id: "4555",
        name: "Stargirl",
        image: `${cardArtFolder}/stargirl.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Double your Hero's Damage on their next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Assist!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `doubleDamage(current,next)`
            }
        ]
    },
    {
        id: "4556",
        name: "Adam Strange",
        image: `${cardArtFolder}/adamStrange.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Jetpack!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`draw(1)`,`travelPlus(1)`]
            }
        ]
    },
    {
        id: "4557",
        name: "Sandman",
        image: `${cardArtFolder}/sandman.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Don't draw from the Villain Deck next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Shhhhh...`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableVillainDraw(1)`
            }
        ]
    },
    {
        id: "4558",
        name: "Midnighter",
        image: `${cardArtFolder}/midnighter.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 1 Damage to all Henchmen and Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Heed my Authority.`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoe(1,all)`
            }
        ]
    },
    {
        id: "4559",
        name: "Bat-Mite",
        image: `${cardArtFolder}/batmite.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Increase all active [ICON:Bat] Heroes' Damage Thresholds by 1 until the end of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Protect my favorites.`
            }
        ],
        abilitiesEffects: [
            {
                effect: `increaseHeroDT(bat,1,next)`
            }
        ]
    },
    {
        id: "4560",
        name: "Saint Walker",
        image: `${cardArtFolder}/saintWalker.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Every Hero can retrieve 1 card from their discard piles.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Hold Onto Hope!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `heroRetrieveFromDiscard(1,all)`
            }
        ]
    },
    {
        id: "4561",
        name: "Aztec",
        image: `${cardArtFolder}/aztec.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Until the end of this Hero's next turn, double all Damage against the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Light Him Up!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `doubleDamageAgainst(overlord,next)`
            }
        ]
    },
    {
        id: "4562",
        name: "Spectre",
        image: `${cardArtFolder}/spectre.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO all Henchmen and Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Am Wrath!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoe(999,all)`
            }
        ]
    },
    {
        id: "4563",
        name: "Captain Atom",
        image: `${cardArtFolder}/captainAtom.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 5 Damage to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Burning Bright!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageOverlord(5)`
            }
        ]
    },
    {
        id: "4564",
        name: "Static",
        image: `${cardArtFolder}/static.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Increase all Heroes' Travel Budgets by 1 on their next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Boosted!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `travelPlus(1,allHeroes)`
            }
        ]
    },
    {
        id: "4565",
        name: "Mr Terrific",
        image: `${cardArtFolder}/mrTerrific.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes draw an extra card at the start of their next turns.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I've got an idea!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `drawExtraAtStart(all,1)`
            }
        ]
    },
    {
        id: "4566",
        name: "Metamorpho",
        image: `${cardArtFolder}/metamorpho.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Add 1 card from your Hero's deck to your hand.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Try this!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `add(1,any)`
            }
        ]
    },
    {
        id: "4567",
        name: "Jonah Hex",
        image: `${cardArtFolder}/jonahHex.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Reduce a Henchman or Villain to 1 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Kneecapped!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `reduceTo(1,any)`
            }
        ]
    },
    {
        id: "4568",
        name: "Fire and Ice",
        image: `${cardArtFolder}/fireAndIce.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE: Deal 3 Damage to the Overlord. <span class="line-gap"></span> OR <span class="line-gap"></span> Lock a Henchman or Villain in their City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose!`
            },
            {
                text: `Damage the Overlord`
            },
            {
                text: `Freeze one`
            },
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`
            },
            {
                type: `chooseOption(1)`,
                effect: [`damageOverlord(3)`]
            },
            {
                type: `chooseOption(2)`,
                effect: [`lockVillain(any)`]
            }
        ]
    },
    {
        id: "4569",
        name: "Booster Gold",
        image: `${cardArtFolder}/boosterGold.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Return all KO'd Action Cards to their Hero's discard piles.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Rewind Time!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `restoreKOdHeroCards(all)`
            }
        ]
    },
    {
        id: "4570",
        name: "Blue Beetle",
        image: `${cardArtFolder}/blueBeetle.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes regain 1 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Brought Armor!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `regainLife(1,all)`
            }
        ]
    },
    {
        id: "4571",
        name: "Red Tornado",
        image: `${cardArtFolder}/redTornado.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Push all unengaged Henchmen and Villains as far right as possible.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Alone Command the Storms!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `shoveVillain(all,-99)`
            }
        ]
    },
    {
        id: "4572",
        name: "Orphan",
        image: `${cardArtFolder}/orphan.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Reduce a Henchman or Villain's Damage to 0 and negate all of their abilities.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Silent as the Night.`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableVillain(any)`
            }
        ]
    },
    {
        id: "4573",
        name: "Vigilante",
        image: `${cardArtFolder}/vigilante.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Giddy Up!`
            }
        ],
        abilitiesEffects: [
            {
                effect: ["draw(1)","travelPlus(1)"]
            }
        ]
    },
    {
        id: "4574",
        name: "Shining Knight",
        image: `${cardArtFolder}/shiningKnight.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 1, and your Hero regains 1 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `To Glory!`
            }
        ],
        abilitiesEffects: [
            {
                effect: ["draw(1)","regainLife(1)"]
            }
        ]
    },
    {
        id: "4575",
        name: "Krypto",
        image: `${cardArtFolder}/krypto.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Double the Damage of the next card this Hero uses.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Ruff!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `doubleDamage(current,nextCardOnly)`
            }
        ]
    },
    {
        id: "4576",
        name: "Dr Mid-Nite",
        image: `${cardArtFolder}/drMidNite.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Scan 1 from the Villain Deck. <span class="line-gap"></span> OPTIONAL: You can KO the top card of the Villain Deck.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Watching from above.`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`scanDeck(villain,1)`,`applyKoCancel(scanned(villain))`]
            }
        ]
    },
    {
        id: "4577",
        name: "Guardian",
        image: `${cardArtFolder}/guardian.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Rescue 2 Bystanders.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I've got you!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `rescueBystander(2)`
            }
        ]
    },
    {
        id: "4578",
        name: "Blue Devil",
        image: `${cardArtFolder}/blueDevil.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 10 Damage to a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Eat This!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoe(10,any)`
            }
        ]
    },
    {
        id: "4579",
        name: "Mister Miracle",
        image: `${cardArtFolder}/Mister Miracle.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The next time you fail a Retreat Roll, you can choose to succeed instead.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Almost Didn't Make It!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `succeedNextFailedRetreat`
            }
        ]
    },
    {
        id: "4580",
        name: "Big Barda",
        image: `${cardArtFolder}/barda.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Reduce all Henchmen and Villains to 1 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Ha! You call this a challenge?!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `reduceTo(1,all)`
            }
        ]
    },
]