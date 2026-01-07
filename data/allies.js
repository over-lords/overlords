const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/6d6f64d594f27ea404661c3ad5d3017261d37a71/Public/Images/Card%20Assets/Allies";

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
                effect: `protectHero(nextAttack,current)`
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
                effect: `protectHero(nextAttack,current)`
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
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `damageFoe(999,0)`
            },
            {
                type: `chooseOption(2)`,
                effect: `damageOverlord(3)`
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
                text: `Double your Hero's Damage until the end of their next turn.`
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
                text: `Increase all active [ICON:Bat] Heroes' Damage Thresholds to 3 until the start of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Protect my favorites.`
            }
        ],
        abilitiesEffects: [
            {
                effect: `setHeroDTtoX(Bat,3,next)`
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
                text: `Every Hero retrieves 1 random card from their discard pile.`
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
                effect: `doubleDamageAgainstVillain(overlord,next)`
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
                text: `All Heroes draw 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I've got an idea!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `draw(1,all)`
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
                effect: `add(1,current)`
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
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `damageOverlord(3)`
            },
            {
                type: `chooseOption(2)`,
                effect: `freezeVillain(any)`
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
                effect: `shoveVillain(allUnengaged,10)`
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
                effect: [`draw(1)`,`travelPlus(1)`]
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
                effect: [`draw(1)`,`regainLife(1)`]
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
                effect: [`scanDeck(villain,1)`,`applyScanEffects(ko)`]
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
                text: `The next time you would fail a Retreat Roll, you instead succeed.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Almost Didn't Make It!`
            }
        ],
        abilitiesEffects: [
            {
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
                effect: `reduceTo(1,all)`
            }
        ]
    },
    {
        id: "4581",
        name: "Katana",
        image: `${cardArtFolder}/katana.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO a card from your discard pile, then CHOOSE: KO a Henchman or Villain. <span class="line-gap"></span> OR <span class="line-gap"></span> Deal 7 Damage to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Soultaker!`
            },
            {
                text: `The top card of your discard pile was just KO'd. Now, CHOOSE :`
            },
            {
                text: `KO a Henchman or Villain`
            },
            {
                text: `Deal 7 Damage to the Overlord`
            }
        ],
        abilitiesEffects: [
            {
                effect: `koTopHeroDiscard(current)`
            },
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `damageFoe(999,any)`
            },
            {
                type: `chooseOption(2)`,
                effect: `damageOverlord(7)`
            }
        ]
    },
    {
        id: "4582",
        name: "Ragman",
        image: `${cardArtFolder}/ragman.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Freeze a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `All Wrapped Up`
            }
        ],
        abilitiesEffects: [
            {
                effect: `freezeVillain(any)`
            }
        ]
    },
    {
        id: "4583",
        name: "Gods and Monsters",
        image: `${cardArtFolder}/godsAndMonsters.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Permanently KO a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Justice Our Way`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(999,any)`,`koFromKO(1,latest)`]
            }
        ]
    },
    {
        id: "4584",
        name: "Kingdom Come",
        image: `${cardArtFolder}/kingdomCome.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `End all temporary dampeners immediately.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `We're Needed Again`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`endAllTemporaryDampeners()`]
            }
        ]
    },
    {
        id: "4585",
        name: "Metal Men",
        image: `${cardArtFolder}/metalMen.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Increase all Heroes' Damage Thresholds by 1 permanently.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Metal Men, Unite!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`increaseHeroDT(all,1,permanent)`]
            }
        ]
    },
    {
        id: "4586",
        name: "Solovar",
        image: `${cardArtFolder}/solovar.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Scan 3 from the Villain Deck. <span class="line-gap"></span> OPTIONAL: You can KO one revealed card.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Inside Man, er, Monkey`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`scanDeck(villain,3)`,`applyScanEffects(ko,closeAfter(1))`]
            }
        ]
    },
    {
        id: "4587",
        name: "Bluebird",
        image: `${cardArtFolder}/bluebird.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 3 Damage to a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Need a hand?`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(3,any)`]
            }
        ]
    },
    {
        id: "4588",
        name: "Animal Man",
        image: `${cardArtFolder}/animalMan.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Retrieve your Hero's entire discard pile. Your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let's See How They Like It`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`heroRetrieveFromDiscard(40,current)`,`travelPlus(1)`]
            }
        ]
    },
    {
        id: "4589",
        name: "S.T.R.I.P.E.",
        image: `${cardArtFolder}/stripe.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE: Increase your Hero's Damage Threshold by 2 until the end of their next turn. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `Increase DT by 2`
            },
            {
                text: `Draw 1`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `increaseHeroDT(currentHero,2,endNextTurn)`
            },
            {
                type: `chooseOption(2)`,
                effect: `draw(1)`
            }
        ]
    },
    {
        id: "4590",
        name: "The Question",
        image: `${cardArtFolder}/question.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Scan 3 from the Villain Deck. <span class="line-gap"></span> OPTIONAL: You can KO up to two revealed cards.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Knew It`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`scanDeck(villain,3)`,`applyScanEffects(ko,closeAfter(2))`]
            }
        ]
    },
    {
        id: "4591",
        name: "Obsidian",
        image: `${cardArtFolder}/obsidian.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Block all Damage your Hero would take until the end of their next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Become Shadow`
            }
        ],
        abilitiesEffects: [
            {
                effect: `protectHero(restOfTurn,current,next)`
            }
        ]
    },
    {
        id: "4592",
        name: "OMAC",
        image: `${cardArtFolder}/omac.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Bring It On!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoe(999,any)`
            }
        ]
    },
    {
        id: "4593",
        name: "Starman",
        image: `${cardArtFolder}/starman.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `A random Hero becomes immune to Damage until the end of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Follow My Light`
            }
        ],
        abilitiesEffects: [
            {
                effect: `protectHero(restOfTurn,random,next)`
            }
        ]
    },
    {
        id: "4594",
        name: "Huntress",
        image: `${cardArtFolder}/huntress.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Double your Hero's Damage until the end of their next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Double Up!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `doubleDamage(current,next)`
            }
        ]
    },
    {
        id: "4595",
        name: "Flash (Jay Garrick)",
        image: `${cardArtFolder}/flashJayGarrick.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Increase your Hero's Travel Budget by 1 permanently.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `On Your Feet, Son!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `travelPlus(1,permanent)`
            }
        ]
    },
    {
        id: "4596",
        name: "Johnny Quick",
        image: `${cardArtFolder}/johnnyQuick.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero can Withdraw once this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `No Shame in a Regroup`
            }
        ],
        abilitiesEffects: [
            {
                effect: `giveHeroPassive(retreatHeroToHQ(1))`
            }
        ]
    },
    {
        id: "4597",
        name: "Jesse Quick",
        image: `${cardArtFolder}/jesseQuick.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Of Liberty and Luck`
            }
        ],
        abilitiesEffects: [
            {
                effect: ["draw(1)","travelPlus(1)"]
            }
        ]
    },
    {
        id: "4598",
        name: "The Creeper",
        image: `${cardArtFolder}/creeper.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Freeze a Henchman or Villain. Damage against them is doubled.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Smile!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`freezeVillain(any)`,`doubleDamageAgainstVillain(lastFrozen,permanent)`]
            }
        ]
    },
    {
        id: "4599",
        name: "Highfather",
        image: `${cardArtFolder}/highfather.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE: KO a Henchman. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `KO a Henchman`
            },
            {
                text: `Draw 1`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `damageFoe(999,anyHenchman)`
            },
            {
                type: `chooseOption(2)`,
                effect: `draw(1)`
            }
        ]
    },
    {
        id: "4600",
        name: "Batwing",
        image: `${cardArtFolder}/batwing.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Coming In Hot!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`draw(2)`,`travelPlus(1)`]
            }
        ]
    },
    {
        id: "4601",
        name: "Legion of Superheroes",
        image: `${cardArtFolder}/legionOfSuperheroes.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes Draw 1 and all Henchmen and Villains take 1 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `We Are Legion!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`draw(1,all)`,`damageFoe(1,all)`]
            }
        ]
    },
    {
        id: "4602",
        name: "The Ray",
        image: `${cardArtFolder}/theRay.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 10 Damage to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Light of a Dying World`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageOverlord(10)`]
            }
        ]
    },
    {
        id: "4603",
        name: "Hawk and Dove",
        image: `${cardArtFolder}/hawkAndDove.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero takes an additional turn after this one. (The Villain Deck is not drawn from)`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Yeah! Teamwork!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`giveCurrentHeroExtraTurn()`]
            }
        ]
    },
    {
        id: "4604",
        name: "Vibe",
        image: `${cardArtFolder}/vibe.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Shove all unengaged Henchmen and Villains as far right as possible. Then, destroy the Rightmost City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Worldbreaker`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`shoveVillain(allUnengaged,10)`,`destroyCity(1)`]
            }
        ]
    },
    {
        id: "4605",
        name: "Indigo-1",
        image: `${cardArtFolder}/indigo1.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Knockback all Henchmen.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Nok.`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`knockback(allHenchmen)`]
            }
        ]
    },
    {
        id: "4606",
        name: "Wildcat",
        image: `${cardArtFolder}/wildcat.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero regains 2 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `That All You Got?`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`regainLife(2)`]
            }
        ]
    },
    {
        id: "4607",
        name: "Green Lantern (Alan Scott)",
        image: `${cardArtFolder}/greenLanternAlanScott.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Increase your Hero's Damage Threshold by 2 until the end of this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Star Heart, Protect Them!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`increaseHeroDT(current,2,next)`]
            }
        ]
    },
    {
        id: "4608",
        name: "Metron",
        image: `${cardArtFolder}/metron.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE: Scan 3 from the Villain Deck and KO your choice of the revealed cards. <span class="line-gap"></span> OR <span class="line-gap"></span> Scan 3 from your Hero's deck and draw 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose!`
            },
            {
                text: `Scan the Villain Deck`
            },
            {
                text: `Scan your Hero's Deck`
            },
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: [`scanDeck(villain,3)`,`applyScanEffects(ko,closeAfter(3))`]
            },
            {
                type: `chooseOption(2)`,
                effect: [`scanDeck(self,3)`,`applyScanEffects(draw,closeAfter(1))`]
            }
        ]
    },
    {
        id: "4609",
        name: "Elongated Man",
        image: `${cardArtFolder}/elongatedMan.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Freeze a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let's Take a Breather`
            }
        ],
        abilitiesEffects: [
            {
                effect: `freezeVillain(any)`
            }
        ]
    },
    {
        id: "4610",
        name: "Spoiler",
        image: `${cardArtFolder}/spoiler.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO a Might of the Overlord card from the Villain Deck.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Oops! Spoilers...`
            }
        ],
        abilitiesEffects: [
            {
                effect: `koMightFromVD(1)`
            }
        ]
    },
    {
        id: "4611",
        name: "Black Lightning",
        image: `${cardArtFolder}/blackLightning.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Don't draw from the Villain Deck next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `You're Finished`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableVillainDraw(1)`
            }
        ]
    },
    {
        id: "4612",
        name: "The Atom",
        image: `${cardArtFolder}/theAtom.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Halve a Henchman or Villain's current HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Take Someone Your Own Size`
            }
        ],
        abilitiesEffects: [
            {
                effect: `halveVillainHP(any)`
            }
        ]
    },
    {
        id: "4613",
        name: "Orion",
        image: `${cardArtFolder}/orion.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE: Restore a Destroyed City. <span class="line-gap"></span> OR <span class="line-gap"></span> Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `Restore a Destroyed City`
            },
            {
                text: `Draw 1, and Increase Travel`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `restoreCity(1)`
            },
            {
                type: `chooseOption(2)`,
                effect: [`draw(1)`,`travelPlus(1)`]
            }
        ]
    },
    {
        id: "4614",
        name: "Hour Man",
        image: `${cardArtFolder}/hourMan.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero takes an additional turn after this one. (The Villain Deck is not drawn from)`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Need More Time!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`giveCurrentHeroExtraTurn()`]
            }
        ]
    },
    {
        id: "4615",
        name: "Osiris",
        image: `${cardArtFolder}/osiris.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Combine the Damage of all active Henchmen and Villains and deal that to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Black Adam!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageOverlord(getSumVillainDamage)`]
            }
        ]
    },
    {
        id: "4616",
        name: "Grifter",
        image: `${cardArtFolder}/grifter.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 2 Damage to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Save My World!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageOverlord(2)`]
            }
        ]
    },
    {
        id: "4617",
        name: "Bat-Cow",
        image: `${cardArtFolder}/batCow.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Freeze a Henchman or Villain, reduce their Damage to 0, and negate all of their abilities.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Moo!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`freezeVillain(any,permanent)`,`disableVillain(lastFrozen,permanent)`]
            }
        ]
    },
    {
        id: "4618",
        name: "Bumblebee",
        image: `${cardArtFolder}/bumblebee.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 1, and your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Got My Wings!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`draw(1)`,`travelPlus(1)`]
            }
        ]
    },
    {
        id: "4619",
        name: "Jade",
        image: `${cardArtFolder}/jade.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE: Increase your Hero's Damage Threshold by 1 permanently. <span class="line-gap"></span> OR <span class="line-gap"></span> Increase your Hero's Travel Budget by 1 permanently.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `Increase Damage Threshold`
            },
            {
                text: `Increase Travel Budget`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `increaseHeroDT(current,1,permanent)`
            },
            {
                type: `chooseOption(2)`,
                effect: `travelPlus(1,permanent)`
            }
        ]
    },
    {
        id: "4620",
        name: "B'wana Beast",
        image: `${cardArtFolder}/bwanaBeast.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO a Henchman.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Buhaha!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(999,anyHenchman)`]
            }
        ]
    },
    {
        id: "4621",
        name: "Dr Light",
        image: `${cardArtFolder}/drLight.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 1 Damage to all Henchmen and Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Photovoltaic Blast!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(1,all)`]
            }
        ]
    },
    {
        id: "4622",
        name: "Apollo",
        image: `${cardArtFolder}/apollo.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes' Travel Budgets increase by 1 permanently.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Light Trail`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`travelPlus(all,1,permanent)`]
            }
        ]
    },
    {
        id: "4623",
        name: "Red Devil",
        image: `${cardArtFolder}/redDevil.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Spread 10 Damage between Henchmen and Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Like This Pain?`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoeMulti(1,10,any)`
            }
        ]
    },
    {
        id: "4624",
        name: "Wolf",
        image: `${cardArtFolder}/wolf.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Freeze a Henchman or Villain and give them Curse 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Awoo!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`freezeVillain(any)`,`giveVillainPassive(curse(1),lastFrozen)`]
            }
        ]
    },
    {
        id: "4625",
        name: "Wild Dog",
        image: `${cardArtFolder}/wildDog.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Freeze the leftmost Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `No Running Now`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`freezeVillain(leftmost)`]
            }
        ]
    },
    {
        id: "4626",
        name: "Crimson Fox",
        image: `${cardArtFolder}/crimsonFox.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Freeze all Henchmen.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Now, Strike!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`freezeVillain(allHenchmen)`]
            }
        ]
    },
    {
        id: "4627",
        name: "Detective Chimp",
        image: `${cardArtFolder}/detectiveChimp.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 3, and your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I've Found a Clue!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`draw(3)`,`travelPlus(1)`]
            }
        ]
    },
    {
        id: "4628",
        name: "Kilowog",
        image: `${cardArtFolder}/kilowog.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero regains up to 4 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `On Your Feet, Poozer!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`regainLife(4)`]
            }
        ]
    },
    {
        id: "4629",
        name: "Icon",
        image: `${cardArtFolder}/icon.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 5 Damage to up to 3 Henchmen or Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let's Go!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoeMulti(5,3,any)`]
            }
        ]
    },
    {
        id: "4630",
        name: "Max Mercury",
        image: `${cardArtFolder}/maxMercury.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 2, and your Hero's Travel Budget increases by 1 for this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Here One Minute...`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`draw(2)`,`travelPlus(1)`]
            }
        ]
    },
    {
        id: "4631",
        name: "Aquagirl",
        image: `${cardArtFolder}/aquagirl.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero can Travel to Star and Gotham City at will this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Coast to Coast`
            }
        ],
        abilitiesEffects: [
            {
                effect: `giveHeroPassive(atWillTravelTo(1))`
            },
            {
                effect: `giveHeroPassive(atWillTravelTo(11))`
            }
        ]
    },
    {
        id: "4632",
        name: "Thunderbolt",
        image: `${cardArtFolder}/thunderbolt.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `OPTIONAL : KO the top card of the Villain Deck.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `KO the top card of the Villain Deck`
            }
        ],
        abilitiesEffects: [
            {
                type: `optional`,
                effect: `koTopVillainDeck(1)`
            }
        ]
    },
    {
        id: "4633",
        name: "Connor Hawke",
        image: `${cardArtFolder}/connorHawke.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Rescue a Bystander and Deal 1 Damage to a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Rescue Bystander, Damage Foe`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`rescueBystander(1)`,`damageFoe(1,any)`]
            }
        ]
    },
    {
        id: "4634",
        name: "Black Condor",
        image: `${cardArtFolder}/blackCondor.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 2 Damage to up to 2 Henchmen or Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let's Soar!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoeMulti(2,2,any)`]
            }
        ]
    },
    {
        id: "4635",
        name: "Shado",
        image: `${cardArtFolder}/shado.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Henchmen and Villains with captured Bystanders take 2 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Steady Shot`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(2,allWithBystander)`]
            }
        ]
    },
    {
        id: "4636",
        name: "Rocket",
        image: `${cardArtFolder}/rocket.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Increase your Hero's Travel Budget by 1 permanently.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let's Jet!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `travelPlus(1,permanent)`
            }
        ]
    },
    {
        id: "4637",
        name: "Longshadow",
        image: `${cardArtFolder}/longshadow.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Block the next Damage your Hero would take.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Spirit Guardian`
            }
        ],
        abilitiesEffects: [
            {
                effect: `protectHero(nextAttack,current)`
            }
        ]
    },
    {
        id: "4638",
        name: "Lightray",
        image: `${cardArtFolder}/lightray.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Increase your Hero's Travel Budget by 2 permanently.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Light of New Genesis`
            }
        ],
        abilitiesEffects: [
            {
                effect: `travelPlus(2,permanent)`
            }
        ]
    },
    {
        id: "4639",
        name: "Phantom Stranger",
        image: `${cardArtFolder}/phantomStranger.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Resurrect all KO'd Heroes to 2 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `My Work is Done`
            }
        ],
        abilitiesEffects: [
            {
                effect: `resurrectHero(all,2)`
            }
        ]
    },
    {
        id: "4640",
        name: "Amethyst",
        image: `${cardArtFolder}/amethyst.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 2 Damage to a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Hraaa!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoe(2,any)`
            }
        ]
    },
    {
        id: "4641",
        name: "Lagoon Boy",
        image: `${cardArtFolder}/Lagoon Boy.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Block the next Damage your Hero would take.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Spirit Guardian`
            }
        ],
        abilitiesEffects: [
            {
                effect: `protectHero(nextAttack,current)`
            }
        ]
    },
    {
        id: "4642",
        name: "Power Girl",
        image: `${cardArtFolder}/Power Girl.png`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 2, and KO a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `My Fists are Up Here!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`draw(2)`,`damageFoe(999,any)`]
            }
        ]
    },
    {
        id: "4643",
        name: "Green Lantern (Simon Baz)",
        image: `${cardArtFolder}/Simon Baz.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 5 Damage to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Who Needs Constructs?`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageOverlord(5)`]
            }
        ]
    },
    {
        id: "4644",
        name: "Green Lantern (Jessica Cruz)",
        image: `${cardArtFolder}/Jessica Cruz.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 2, your Damage Threshold increases by 1 until the end of this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `No More Fear`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`draw(2)`,`increaseHeroDT(current,1,next)`]
            }
        ]
    },
    {
        id: "4645",
        name: "Plastic Man",
        image: `${cardArtFolder}/Plastic Man.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Freeze a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Oooh, You're in a Pickle`
            }
        ],
        abilitiesEffects: [
            {
                effect: `freezeVillain(any)`
            }
        ]
    },
    {
        id: "4646",
        name: "Speedy",
        image: `${cardArtFolder}/Speedy.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 2 Damage to up to 2 Henchmen or Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Two Birds, One Arrow`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoeMulti(2,2,any)`]
            }
        ]
    },
    {
        id: "4647",
        name: "Geo-Force",
        image: `${cardArtFolder}/geoForce.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE: Restore a Destroyed City. <span class="line-gap"></span> OR <span class="line-gap"></span> KO a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `Restore a Destroyed City`
            },
            {
                text: `KO a Foe`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `restoreCity(1)`
            },
            {
                type: `chooseOption(2)`,
                effect: [`damageFoe(999,any)`]
            }
        ]
    },
    {
        id: "4648",
        name: "Flashpoint Batman",
        image: `${cardArtFolder}/flashpointBatman.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Don't draw from the Villain Deck next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I'm Not as Nice`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableVillainDraw(1)`
            }
        ]
    },
    {
        id: "4649",
        name: "Nubia",
        image: `${cardArtFolder}/Nubia.png`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 4 Damage to a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `The Name is Wonder Woman`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageFoe(4,any)`
            }
        ]
    },
    {
        id: "4650",
        name: "Col Rick Flag",
        image: `${cardArtFolder}/colRickFlag.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Draw 1. <span class="line-gap"></span><span class="line-gap"></span> All [ICON:Squad] Heroes draw an additional 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Squad! Form Up!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `draw(1)`
            },
            {
                effect: `draw(1,allOtherHeroes(Squad))`
            }
        ]
    },
    {
        id: "4651",
        name: "White Lantern Deadman",
        image: `${cardArtFolder}/whiteLanternDeadman.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Permanently KO all Henchmen and Villains in the KO'd Pile and all Heroes gain 3 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Live.`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`koFromKO(999)`,`regainLife(3,all)`]
            }
        ]
    },
    {
        id: "4652",
        name: "White Lantern Anti-Monitor",
        image: `${cardArtFolder}/whiteLanternAntiMonitor.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Permanently KO all Henchmen and Villains in the KO'd Pile and deal 5 Damage to all Henchmen and Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Live.`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`koFromKO(999)`,`damageFoe(5,all)`]
            }
        ]
    },
    {
        id: "4653",
        name: "White Lantern Swamp Thing",
        image: `${cardArtFolder}/whiteLanternSwampThing.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Permanently KO all Henchmen and Villains in the KO'd Pile and deal 10 Damage to the Overlord.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Live.`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`koFromKO(999)`,`damageOverlord(10)`]
            }
        ]
    },
    {
        id: "4654",
        name: "GCPD Batman",
        image: `${cardArtFolder}/GCPD Batman.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO the Henchman or Villain in Gotham.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `You're Under Arrest`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(999,10)`]
            }
        ]
    },
    {
        id: "4655",
        name: "Deadman",
        image: `${cardArtFolder}/deadman.jpg`,
        type: "Ally",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Knockback a Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I'm Gonna Take Over for a Second...`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`knockback(any)`]
            }
        ]
    },
]