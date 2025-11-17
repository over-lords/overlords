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
    {
        id: "4552",
        name: "Steel",
        image: `${cardArtFolder}/steel.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The next time this Hero would take Damage, it is ignored.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Unbreakable!`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `protectHero(current,next)`
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
                text: `The next time this Hero would take Damage, it is ignored.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Unbreakable!`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `protectHero(current,next)`
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
                text: `CHOOSE!`
            },
            {
                text: `KO One.`
            },
            {
                text: `Damage Overlord.`
            },
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `choose()`
            },
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `koVillain(star)`
            },
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `damageOverlord(3)`
            },
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `doubleDamage(current,1)`
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
                text: `Draw a card, your Hero can travel an extra time this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Jetpack!`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: ["draw(1)","travelPlus(1)"]
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `damageVillains(all,1)`
            }
        ]
    },
    {
        id: "4559",
        name: "Bat-Mite",
        image: `${cardArtFolder}/batMite.jpg`,
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `increaseDT(bat,1,1)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `allRetrieve(1)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `doubleDamageVs(overlord,1)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `koVillains(all)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `increaseTravel(all,1,1)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `add(any,1)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `reduceTo(any,1,1)`
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
                text: `CHOOSE!`
            },
            {
                text: `Damage Overlord.`
            },
            {
                text: `Lock One.`
            },
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `choose()`
            },
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `damageOverlord(3)`
            },
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `lockVillain(any,1)`
            },
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `heroRegainHP(all,1)`
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
                text: `Shove all unengaged Henchmen and Villains as far right as possible.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Alone Command the Storms!`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `shoveVillains(all,-99)`
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
                text: `Reduce a Henchman or Villain's Damage to 1 and negate all of their abilities.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Silent as the Night.`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `disableVillain(any,1)`
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
                text: `Draw a card, your Hero can travel an extra time this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Giddy Up!`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `drawAndTravel(1,1)`
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
                text: `Draw a card, your Hero regains 1 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `To Glory!`
            }
        ],
        abilitiesEffects: [
            {
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `drawAndRegainHP(1,1)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `doubleNextCardDamage()`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `revealAndKONextVillain()`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `rescueBystanders(2)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `damageVillains(any,10)`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `succeedNextFailedRetreat()`
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
                type: `standard`,
                condition: `none`,
                uses: `1`,
                shared: `no`,
                effect: `reduceVillainsTo1(all)`
            }
        ]
    },
]