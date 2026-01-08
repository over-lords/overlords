const cardArtFolder = "https://raw.githubusercontent.com/over-lords/overlords/be08944d1790d0aef828c2efa05386f6438bd3a4/Public/Images/Card%20Assets/Enemies";

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
                text: `All Heroes take 2 Damage (ignoring their Damage Thresholds).`
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
                text: `All Heroes take 1 Damage (ignoring their Damage Thresholds).`
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
                text: `The leftmost engaged Hero takes 1 Damage (ignoring their Damage Threshold).`
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
                text: `Draw 3 Henchmen from the Villain Deck.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let the animals out to play`
            }
        ],
        abilitiesEffects: [
            {
                effect: `rallyNextHenchVillains(3,henchmenOnly)`
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
                effect: `villainDraw(getActiveTeamCount(Flash,full))`
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
    {
        id: "4281",
        name: "Ambush Bug",
        image: `${cardArtFolder}/ambushBug.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO all cards in your Hero's discard pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Boo! Did I getcha?`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`koTopHeroDiscard(40,current)`]
            }
        ]
    },
    {
        id: "4282",
        name: "Anarky",
        image: `${cardArtFolder}/anarky.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Through the start of this Hero's next turn, all Villains drawn gain Teleport`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let's Make Some Noise!`
            }
        ],
        abilitiesEffects: [
            {
                type: `passive`,
                condition: `villainDrawn()`,
                effect: `villainTeleports(turn)`
            }
        ]
    },
    {
        id: "4283",
        name: "Angle Man",
        image: `${cardArtFolder}/angleMan.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Shove all unengaged Henchmen and Villains as far left as possible.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let's Try Another Angle`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`shoveVillain(allUnengaged,-10)`]
            }
        ]
    },
    {
        id: "4284",
        name: "Anton Arcane",
        image: `${cardArtFolder}/antonArcane.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Remove all temporary Icon Abilities from play.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Soon, All Will End`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`dismissTempPassives(all)`]
            }
        ]
    },
    {
        id: "4285",
        name: "Arkham Knight",
        image: `${cardArtFolder}/arkhamKnight.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Double the HP and Damage of the Henchman or Villain in Gotham.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let's Make this Interesting`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`doubleVillainHPandDamage(10)`]
            }
        ]
    },
    {
        id: "4286",
        name: "Black Racer",
        image: `${cardArtFolder}/blackRacer.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 2 Damage to all [ICON:Flash] Heroes (ignoring their Damage Thresholds).`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `The End`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(2,Flash,ignoreDT)`]
            }
        ]
    },
    {
        id: "4287",
        name: "Blacksmith",
        image: `${cardArtFolder}/blacksmith.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The leftmost Villain gains 10 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Will Remake You!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`giveVillainHP(10,leftmostVillain)`]
            }
        ]
    },
    {
        id: "4288",
        name: "Blood League",
        image: `${cardArtFolder}/bloodLeague.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes in cities take 2 Damage (ignoring their Damage Thresholds).`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `We Thirst`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(2,allEngaged,ignoreDT)`]
            }
        ]
    },
    {
        id: "4289",
        name: "Brimstone",
        image: `${cardArtFolder}/brimstone.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Destroy the Rightmost City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Things Just Got Worse`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`destroyCity(1)`]
            }
        ]
    },
    {
        id: "4290",
        name: "Brother Blood",
        image: `${cardArtFolder}/brotherBlood.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Resurrect the first KO'd Henchman or Villain.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `For I Am Blood`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`reviveKodFoe(1)`]
            }
        ]
    },
    {
        id: "4291",
        name: "Brother Grimm",
        image: `${cardArtFolder}/brotherGrimm.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Until the end of your Hero's next turn, all Heroes can only Travel once per turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `This is how My Story Ends!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableExtraTravel(all,next)`
            }
        ]
    },
    {
        id: "4292",
        name: "Calendar Man",
        image: `${cardArtFolder}/calendarMan.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Evenly split a number of Damage equal to the current month's number amongst all Heroes.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Time Marches Forwards`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(getDividedMonth,all)`]
            }
        ]
    },
    {
        id: "4293",
        name: "Chemo",
        image: `${cardArtFolder}/chemo.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE : KO the top 3 cards of your Deck.  OR  Destroy the Rightmost City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `KO 3 Cards`
            },
            {
                text: `Destroy a City`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `koTopHeroCard(3,current)`
            },
            {
                type: `chooseOption(2)`,
                effect: `destroyCity(1)`
            }
        ]
    },
    {
        id: "4294",
        name: "Chronos",
        image: `${cardArtFolder}/chronos.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Resurrect the first 3 KO'd Henchmen.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `You'll Love Me Next Time!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`reviveKodFoe(3,henchmenOnly)`]
            }
        ]
    },
    {
        id: "4295",
        name: "Cluemaster",
        image: `${cardArtFolder}/Cluemaster.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Heal all Henchmen to full HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Must Not've Gotten my Clue`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(-5,allHenchmen)`]
            }
        ]
    },
    {
        id: "4296",
        name: "Cobalt Blue",
        image: `${cardArtFolder}/cobaltBlue.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero's Damage Threshold is reduced by 2 until the end of this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Faster Than You!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`decreaseHeroDT(currentHero,2,currentTurn)`]
            }
        ]
    },
    {
        id: "4297",
        name: "Condiment King",
        image: `${cardArtFolder}/condimentKing.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero cannot Retreat this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Splat!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`disableRetreat(current,current)`]
            }
        ]
    },
    {
        id: "4298",
        name: "Cupid",
        image: `${cardArtFolder}/cupid.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Until the end of this Hero's next turn, all Heroes gain no benefits from Teammates.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Shot to the Heart`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`disableTeamBonus(all,nextRound)`]
            }
        ]
    },
    {
        id: "4299",
        name: "Deacon Blackfire",
        image: `${cardArtFolder}/deaconBlackfire.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO all captured Bystanders.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Let Us Begin`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`koCapturedBystander(all)`]
            }
        ]
    },
    {
        id: "4300",
        name: "Despero",
        image: `${cardArtFolder}/despero.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Discard your entire hand.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I See All!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`discard(getHandCount)`]
            }
        ]
    },
    {
        id: "4301",
        name: "Dex Starr",
        image: `${cardArtFolder}/dexStarr.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero takes 2 Damage. All other Heroes take 1 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Good Kitty...`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(current,2)`,`damageHero(notCurrent,1)`]
            }
        ]
    },
    {
        id: "4302",
        name: "Dr Phosphorus",
        image: `${cardArtFolder}/drPhosphorus.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero takes 3 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Have You Ever Seen a Skeleton?`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(3,current)`]
            }
        ]
    },
    {
        id: "4303",
        name: "Dr Poison",
        image: `${cardArtFolder}/drPoison.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Henchmen, Villains, and Heroes take 1 Damage (ignoring their Damage Thresholds).`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Time for Your Medicine`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(1,all)`,`damageHero(1,all,ignoreDT)`]
            }
        ]
    },
    {
        id: "4304",
        name: "Eclipso",
        image: `${cardArtFolder}/eclipso.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes in cities take 3 Damage (ignoring their Damage Thresholds).`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Live for This!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(3,allEngaged,ignoreDT)`]
            }
        ]
    },
    {
        id: "4305",
        name: "Eradicator",
        image: `${cardArtFolder}/eradicator.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The leftmost Villain gains 10 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Time for your Eradication!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`giveVillainHP(10,leftmostVillain)`]
            }
        ]
    },
    {
        id: "4306",
        name: "Fatal Five",
        image: `${cardArtFolder}/fatalFive.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO the top 5 cards of your Hero's discard pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Oh, You Messed Up...`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`koTopHeroDiscard(5,current)`]
            }
        ]
    },
    {
        id: "4307",
        name: "Flamingo",
        image: `${cardArtFolder}/flamingo.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Play the next 2 Enemies from the E&A.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `We're Getting Fancy Today`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`enemyDraw(2,nextEnemy)`]
            }
        ]
    },
    {
        id: "4308",
        name: "Flashpoint Wonder Woman",
        image: `${cardArtFolder}/Flashpoint Wonder Woman.png`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes take 2 Damage (ignoring their Damage Thresholds).`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Amazons! Attack!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(2,all,ignoreDT)`]
            }
        ]
    },
    {
        id: "4309",
        name: "Flashpoint Aquaman",
        image: `${cardArtFolder}/flashpointAquaman.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Destroy the Rightmost City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Die, Surface Dwellers!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`destroyCity(1)`]
            }
        ]
    },
    {
        id: "4310",
        name: "Hades",
        image: `${cardArtFolder}/hades.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Resurrect the first 3 KO'd Henchmen or Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Just to Spite You`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`reviveKodFoe(3)`]
            }
        ]
    },
    {
        id: "4311",
        name: "Icicle",
        image: `${cardArtFolder}/icicle.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Heroes can only draw 1 card on their next turns.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Everybody, Freeze!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableExtraDraw(all,next)`
            }
        ]
    },
    {
        id: "4312",
        name: "Joker's Daughter",
        image: `${cardArtFolder}/jokersDaughter.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The Overlord gains 10 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Just How You Like It`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageOverlord(-10)`]
            }
        ]
    },
    {
        id: "4313",
        name: "Kilg%re",
        image: `${cardArtFolder}/kilgore.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `No Heroes can Scan until the end of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `We're Locked Out!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`disableScan(next)`]
            }
        ]
    },
    {
        id: "4314",
        name: "Larfleeze",
        image: `${cardArtFolder}/larfleeze.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero loses 1 random Icon Ability use.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Mine! Mine! Mine!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`loseIconUse(current,1,random)`]
            }
        ]
    },
    {
        id: "4315",
        name: "Magenta",
        image: `${cardArtFolder}/magenta.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero's Damage Threshold is reduced by 1 until the end of this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Master of Magnetism`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`decreaseHeroDT(currentHero,1,currentTurn)`]
            }
        ]
    },
    {
        id: "4316",
        name: "Magog",
        image: `${cardArtFolder}/magog.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Shove all unengaged Henchmen and Villains one space left. Then, draw once from the Villain Deck.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Am Deliverance!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`shoveVillain(allUnengaged,-2)`,`villainDraw(1)`]
            }
        ]
    },
    {
        id: "4317",
        name: "Major Disaster",
        image: `${cardArtFolder}/majorDisaster.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All engaged Heroes take 2 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `"Time for a Disaster, a Major Disaster." - Major Disaster, Probably`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(2,allEngaged)`]
            }
        ]
    },
    {
        id: "4318",
        name: "Maxie Zeus",
        image: `${cardArtFolder}/maxieZeus.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 2 Damage to all cards in the Rightmost City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I am a God!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHeroAtCity(rightCoastal,2)`,`damageFoe(rightCoastal,2)`]
            }
        ]
    },
    {
        id: "4319",
        name: "Monocle",
        image: `${cardArtFolder}/monocle.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Reveal the top card of the Villain Deck.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Oh, My! I Do Say!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`setRevealedTopCardTrue()`]
            }
        ]
    },
    {
        id: "4320",
        name: "Murmur",
        image: `${cardArtFolder}/murmur.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Until the end of your Hero's turn, they cannot use their Icon abilities.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Must Silence You...`
            }
        ],
        abilitiesEffects: [
            {
                effect: `disableIconAbilities(current,current)`
            }
        ]
    },
    {
        id: "4321",
        name: "Neutron",
        image: `${cardArtFolder}/neutron.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Heroes in Central and Keystone Cities take 2 Damage (ignoring their Damage Thresholds).`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Burn!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHeroAtCity(7,2,ignoreDT)`,`damageHeroAtCity(5,2,ignoreDT)`]
            }
        ]
    },
    {
        id: "4322",
        name: "New Reichsmen",
        image: `${cardArtFolder}/newReichsmen.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Villains gain 3 HP and the Overlord gains 5.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Übermensch Reign Supreme`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(-3,allVillains)`,`damageOverlord(-5)`]
            }
        ]
    },
    {
        id: "4323",
        name: "Nightshade",
        image: `${cardArtFolder}/nightshade.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `No Heroes can Scan until the end of this Hero's next turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Lights Out!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`disableScan(next)`]
            }
        ]
    },
    {
        id: "4324",
        name: "Non",
        image: `${cardArtFolder}/non.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero takes 4 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I'm Going to Crush You Now.`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(current,4)`]
            }
        ]
    },
    {
        id: "4325",
        name: "Peek-a-Boo",
        image: `${cardArtFolder}/peekABoo.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The rightmost Villain Teleports.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Nope! Over Here!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`teleportFoeElsewhere(rightmost)`]
            }
        ]
    },
    {
        id: "4326",
        name: "Penny Plunderer",
        image: `${cardArtFolder}/pennyPlunderer.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Send the top card of your Hero's deck to their discard pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Get Plundered!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`mill(1,current)`]
            }
        ]
    },
    {
        id: "4327",
        name: "Plastique",
        image: `${cardArtFolder}/plastique.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE : Destroy the Rightmost City. <span class="line-gap"></span> OR <span class="line-gap"></span> Shove all unengaged Henchmen and Villains as far left as possible.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `Destroy a City`
            },
            {
                text: `Shove all unengaged foes left`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `destroyCity(1)`
            },
            {
                type: `chooseOption(2)`,
                effect: `shoveVillain(allUnengaged,-10)`
            }
        ]
    },
    {
        id: "4328",
        name: "Plunder",
        image: `${cardArtFolder}/plunder.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Send the top 2 cards of your Hero's deck to their discard pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `What's Yours is Mine`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`mill(2,current)`]
            }
        ]
    },
    {
        id: "4329",
        name: "Polka Dot Man",
        image: `${cardArtFolder}/polkaDotMan.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The rightmost Henchman or Villain teleports to Star City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `In One Spot, Out Another!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`teleportFoeElsewhere(rightmost,0)`]
            }
        ]
    },
    {
        id: "4330",
        name: "Professor Ivo",
        image: `${cardArtFolder}/professorIvo.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The Overlord gains 25 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Can Always Make Another`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageOverlord(-25)`
            }
        ]
    },
    {
        id: "4331",
        name: "Qwardian Weaponers",
        image: `${cardArtFolder}/qwardianWeaponers.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All Villains and the Overlord gain 5 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Legendary for a Reason`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageFoe(-5,allVillains)`,`damageOverlord(-5)`]
            }
        ]
    },
    {
        id: "4332",
        name: "Ratcatcher",
        image: `${cardArtFolder}/ratcatcher.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Play the next Henchman from the Villain Deck.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Lowly, but Deadly`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`rallyNextHenchVillains(1,henchmenOnly)`]
            }
        ]
    },
    {
        id: "4333",
        name: "Red Son",
        image: `${cardArtFolder}/redSon.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 5 Damage to the Hero in Gotham (if any).`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Hardly Impressed`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHeroAtCity(11,5)`]
            }
        ]
    },
    {
        id: "4334",
        name: "Red X",
        image: `${cardArtFolder}/redX.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO your Hero's entire discard pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Just Try to Catch Me`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`koTopHeroDiscard(40,current)`]
            }
        ]
    },
    {
        id: "4335",
        name: "Relic",
        image: `${cardArtFolder}/relic.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero's Damage Threshold is reduced to 1 until the end of this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `They Will Be Mine`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`decreaseHeroDT(currentHero,5,currentTurn)`]
            }
        ]
    },
    {
        id: "4336",
        name: "Richard Dragon",
        image: `${cardArtFolder}/richardDragon.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `All active Henchmen and Villains Capture a Bystander.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Here's How This is Gonna Go`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`foeCaptureBystander(all,1)`]
            }
        ]
    },
    {
        id: "4337",
        name: "Royal Flush Gang",
        image: `${cardArtFolder}/royalFlushGang.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Of the next 5 cards in the Villain Deck, play all of the Villains.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Read 'em and Weep`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`takeNextHenchVillainsFromDeck(5,villainsOnly)`]
            }
        ]
    },
    {
        id: "4338",
        name: "Rupture",
        image: `${cardArtFolder}/rupture.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE : KO the top 3 cards of your Hero's deck. <span class="line-gap"></span> OR <span class="line-gap"></span> Destroy the Rightmost City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `KO top 3 Cards`
            },
            {
                text: `Destroy a City`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `koTopHeroCard(3,current)`
            },
            {
                type: `chooseOption(2)`,
                effect: `destroyCity(1)`
            }
        ]
    },
    {
        id: "4339",
        name: "Slipknot",
        image: `${cardArtFolder}/slipknot.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero cannot Retreat this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Yes, I Can Climb Anything`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`disableRetreat(current,current)`]
            }
        ]
    },
    {
        id: "4340",
        name: "Superboy Prime",
        image: `${cardArtFolder}/superboyPrime.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `KO a random Hero.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I'm the Hero Now.`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(999,random,ignoreDT)`]
            }
        ]
    },
    {
        id: "4341",
        name: "T.O. Morrow",
        image: `${cardArtFolder}/T.O. Morrow.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The Overlord gains 15 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `The Son Was Lost...`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageOverlord(-15)`
            }
        ]
    },
    {
        id: "4342",
        name: "Tattooed Man",
        image: `${cardArtFolder}/tattooedMan.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero's Damage Threshold is reduced by 1 until the end of this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Your Armor Means Nothing!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`decreaseHeroDT(currentHero,1,currentTurn)`]
            }
        ]
    },
    {
        id: "4343",
        name: "Telos",
        image: `${cardArtFolder}/telos.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `The Overlord gains 50 HP.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `You Are Needed!`
            }
        ],
        abilitiesEffects: [
            {
                effect: `damageOverlord(-50)`
            }
        ]
    },
    {
        id: "4344",
        name: "Terra",
        image: `${cardArtFolder}/terra.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `CHOOSE : Your Hero takes 3 Damage (ignoring their Damage Threshold).  OR  Destroy the Rightmost City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Choose`
            },
            {
                text: `Take 3 Damage`
            },
            {
                text: `Destroy a City`
            }
        ],
        abilitiesEffects: [
            {
                type: `chooseOption`,
                effect: `chooseYourEffect`,
            },
            {
                type: `chooseOption(1)`,
                effect: `damageHero(3,current,ignoreDT)`
            },
            {
                type: `chooseOption(2)`,
                effect: `destroyCity(1)`
            }
        ]
    },
    {
        id: "4345",
        name: "The Mist",
        image: `${cardArtFolder}/theMist.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Deal 3 Damage to all cards in Central City.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Am Poison!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHeroAtCity(7,3)`,`damageFoe(3,6)`]
            }
        ]
    },
    {
        id: "4346",
        name: "The Ventriloquist",
        image: `${cardArtFolder}/theVentriloquist.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Send the top 3 cards of your Hero's deck to their discard pile.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Get 'em, Mr Scarface!`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`mill(3,current)`]
            }
        ]
    },
    {
        id: "4347",
        name: "Tweedle-Dee and Tweedle-Dum",
        image: `${cardArtFolder}/tweedleDeeAndTweedleDum.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero takes 2 Damage.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `I Don't- I Don't Know...`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`damageHero(2,current)`]
            }
        ]
    },
    {
        id: "4348",
        name: "White Canary",
        image: `${cardArtFolder}/whiteCanary.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Increase all Villains' Damage by 1.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `Compliments from the Shadows`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`increaseVillainDamage(1,all)`]
            }
        ]
    },
    {
        id: "4349",
        name: "Zebra Man",
        image: `${cardArtFolder}/zebraMan.jpg`,
        type: "Enemy",
        doNotShow: "false",
        abilitiesText: [
            {
                text: `Your Hero cannot Retreat this turn.`
            }
        ],
        abilitiesNamePrint: [
            {
                text: `All I See is Black and White`
            }
        ],
        abilitiesEffects: [
            {
                effect: [`disableRetreat(current,current)`]
            }
        ]
    },
]