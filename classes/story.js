/* 
 * story.js
 * Class that will hold the dialog for NPCs in the game.
 */

var Story = window.Story = {};

Story.init = function(game) {
	// Dialog Entries
	// Each NPC will have a dialog object with all their dialog entires in them. The top level of the object will contain
	// key words that dictate the context we want for the dialog. These contexts contain nested arrays with all the dialog options.
	// Based on the story/dungeon progression (TBD) an index value will be chosen from 0(start)-3(endgame) to pull dialog from. 
	// There, a few random choices of dialog are available and will be selected using Choice.js.
    
    // Controls how deep into the story a player is
    Story.phase = 0;
    Story.needsToGivePotion = false;

   Story.NPC_CHARACTERS = Enum([
      'sign', 'adventurer', 'strongman', 'mystic', 'aralynne', 'medic'
   ]);

   Story.CUSTOM_CHARACTERS = [
       Story.NPC_CHARACTERS.adventurer,
       Story.NPC_CHARACTERS.strongman,
       Story.NPC_CHARACTERS.mystic,
       Story.NPC_CHARACTERS.medic
   ];

	// Adventurer (npc1)
	// A young lost adventurer. Victim of multiple personalities.
	Story.adventurer = {
		story: [
         	[
                [["Oh... hi.", "You're really in a pickle right now, aren't ya?", "How'd you find yourself in the most dangerous dungeon in Squarr?", "Well, nevermind that. You should try to find a way out."],["Don't let me keep you any longer. I'll be fine"]],
                [["Are you a knight?", "Are you strong?", "Are you a hero?", "... can you save my dumb friends that went deeper into this dungeon?"], ["Don't tell our parents that we're here!"]],
                [["I feel like humans were never meant to come here.", "What did these monsters ever do to make us want to kill them?", "Don't they just seem scared to you?"], ["Maybe you should leave."]],
                [["I'm sure you've noticed by now that enemies only act when you move.", "That's why I'm not moving an inch from this spot!"], ["Don't just stand there!", "... or do. I'm not judging."]],
                [["You really like swiging that thing around, huh?", "You'd be good friends with the leader of Squarr.", "He loves practicing his swordplay and fighting monsters.", "... though its never much of a fight - he usually beats them in 1 hit."], ["I need to think about something else now."]]
         	],
         	[
                [["Why are you looking at me like I shouldn't be here?", "Just because I don't have a weapon doesn't mean I'm not tough!"], ["Grrrr!"]],
                [["You look like you've seen some sh-, err, stuff.", "I'm not sure about this, but the way you're going, things're not gonna get easier.", "But hey, what do I know."], ["Good luck."]],
                [["...", "If I don't move they can't get me.", "But if I don't move I can't get out."], ["... Please make it safe for me to leave."]],
                [["I hear there's some crazy strong monster at the deepest part of this dungeon.", "Just thinking about it gives me the chills! Brrr!"], ["Maybe I'm just cold."]],
                [["I keep thinking I'm on the right track, but there's just no exit.", "'Just pretend its a maze' they say.", "But this... 'place'... it's no maze."], ["I just want to go home."]]
         	],
      		[
                [["I bet you're wondering how I made it this far.", "Me too."], ["* They just shrug."]],
                [["I ran as fast as I could through all these rooms, but I stopped to take a break.", "Now I'm sure to be eaten if I leave this spot."], ["I hope you beat up all the bad guys so I can escape."]],
                [["A lot of people come to this place to try and prove themselves.", "This dungeon, Aralynne's Lair, is said to be a living and breathing organism.", "It follows the laws of nature like a wild animal.", "... it adapts. It kills. It survives."], ["I never should have taken that dare."]],
                [["Why are you breathing so loudly?", "... that's not you?"], ["..."]],
                [["I've seen her.", "Aralynne.", "You don't stand a chance."]],
      		]
		]
	};

	// Regular old sign... or is it? Useful mainly for tips.
	Story.sign = {
		story: [
			[
				[["'Only those with no will to live should enter. You will not leave this place alive.'"]],
                [["The monsters here attack in an odd way.", "They only approach when you move.", "Learn their patterns to survive."]],
                [["I know how to kill you."], ["* It's a blank sign."]],
                [["You may find equipment from those who ventured before you on your adventure.", "Manage your items wisely."]]
			],
            [
                [["* This sign seems handmade. You can barely make out the words.", "'no amount of training will prepare you for -'", "* The rest is illegible."]],
                [["An old sign. It reads:", "'BEWARE: These areas are for monsters only. Humans are not allowed and will be asked to leave on sight.'"]],
                [["Health ahead!"], ["Just kidding."]],
                [["Some enemies don't always move at the same time you do.", "Use this to your advantage!"]]
            ],
            [
                [["* The sign is dusty and is covered in strange markings, but you can make out some text.", "'Co e and pl y with  e!'"]],
                [["* 'Aralynne's House' is written in fancy, faded lettering."]],
                [["* You can make out an image that shows a human face with a red 'X' over it.", "* It appears you're not welcome here."]],
            ]
		]
	};

	// A buff dude that somehow found his way into our little dungeon. 
	// TODO: Changes his personality based on kills/attack power
	Story.strongman = {
		story: [
			[
				[["Hey small fry. I have some advice for ya.", "SCRAM!"], ["Ha ha ha ha ha!"]],
                [["Did I come here on a dare?", "HA!", "Do I look like some weenie who needs encouraging to go out and fight some monsters?", "... I don't right?"], ["* He just flexes and weakly grins to himself."]],
                [["I didn't realize how cold dungeons were.", "It makes me really regret not bringing a coat."], ["Brrr..."]],
                [["You look strong enough. Wanna fight?", "Yes!?", "No?", "... are you gonna answer?"], ["..."]],
                [["Woah there pardner, watch where you're going around here.", "Some dummy laid traps and puzzles around and you don't want to be stepping in them.", "That's why I'm just standing here. A trap stuck me to the ground!"], ["This sucks!"]],
			],
            [
                [["Yo!", "You're a fighter too?", "I can tell because you're holding a sword.", "Let's be buddies!"], ["Yooo!"]],
                [["Greetings.", "I wish no harm to you, but the head of this dungeon's master belongs only to me.", "Do not get in my way."], ["* They just stare at you, emotionless."]],
                [["My bro told me there's a beautiful treasure in this place.", "I thought he was wrong until I laid my eyes on you.", "... was that a good pick-up line?"], ["I was just practicing on you! I swear!"]],
                [["I followed a lost adventurer through a passageway, but when I entered the next room he was gone.", "Is he a ninja? Am I just crazy?", "... or is this place constantly changing?"], ["How did you get here?"]]
            ],
            [
                [["I can't go much longer.", "I'm out of health potions and got beat up pretty bad earlier.", "... don't worry about me though. I'll be fine."], ["Go get 'em."]],
                [["The last monster in this room didn't have the same look in its eyes as the others.", "It looked so afraid, but I'm afraid too.", "... I should've let it go."], ["I'm such a coward."]],
                [["No matter what I can't seem to get a leg up on these things.", "It's like they're learning how I fight without them ever seeing me before.", "15 years of training for nothing..."], ["Sigh,,,"]],
                [["Aralynne. She rules this dungeon.", "... but anyone with a real sense of this place will tell you that she IS the dungeon.", "Believe what you will, just be cautious with every decision you make."], ["* He just stares at the ground."]],
                [["Squarr didn't used to have dungeons. Monsters lived with humans at one point in time.", "But somewhere along the line they became aggressive towards us and had to be stopped.", "So we banished those that surrendered to dungeons.", "Aralynne... The first dungeon master.", "She will fall to my blade."], ["I will avenge my master!"]]
            ]
		]
	};

    // A odd figure that you cannot make out to be either human or monster.
    Story.mystic = {
        story: [
            [
                [["* It just stares into your soul."]],
                [["The queen of this place is not to be trifled with.", "She is always watching."], ["We are always watching."]],
                [["Do you wish to prove yourself?", "Do you seek strength?", "Are you looking for answers?", "Desiring a challenege?"], ["Maybe you ARE in the right place..."]],
            ],
            [
                [["You can wipe away death all you want.", "The blood stains more than just your armor."], ["You're just like the rest."]],
                [["This is someone's home.", "Her name is Aralynne.", "She doesn't take visitors. At least, not ones like you"], ["Hmmph."]],
                [["* It's humming a strange frequency that seems to vibrate throughout the dungeon."]],
            ],
            [
                [["...", "...", "Please don't hurt her.", "We need her to live... we need The Cycle to live."], ["* It's holding a defensive stance."]],
                [["* It is watching your every move, even after you leave the room."]],
                [["Aralynne, our protector, has been getting weaker. More humans have been reaching her chambers and battling her.", "She just sends them back to the dungeon entrance instead of killing them.", "But she can't do this forever."], ["Are you here to help, or..."]],
                [["Squarr did not always have dungeons. Monsters lived alongside humans at one point in time.", "But somewhere along the line humans became aggressive towards monsters and battle broke out.", "Surviving monsters were banished to dungeons.", "Aralynne... The first dungeon dweller.", "Her death means the end of the Cycle."], ["I wish only for peace."]]
            ]
        ]
    };

    Story.aralynne = {
        good_intro: [
            [
                [["So you've made it.", "I felt your presence as soon as you entered my lair.", "So what brings you here?", "I know it wasn't genocide, your actions show that much.", "But you couldn't have gotten here without spilling blood.", "Still, you're different from the others.", "You have an energy I haven't sensed in a human in a very long time.","... I have something to ask of you.", "I've been fending off humans for centuries, trying as hard as I can to keep the monsters here safe.", "However, my strength is getting weaker with each human I encounter.", "I do not kill them, but simply teleport them to another maze and erase their memory of seeing me.", "The other monsters call this The Cycle.", "If I can't maintain The Cycle, then theres nothing stopping humans from traversing my dungeon and killing everything.", "I give you a choice.", "You can fight me and end The Cycle. That will mark the end of monsters living in Squarr.", "Or, you can stay as my guardian and fend off attackers. You slay them, I regain energy, and monsters stay safe.", "In exchange I use my magic for your gain. Wealth, power, perfect health. It's yours.", "Fight me, or take this amulet and be my guardian. The choice is yours."], ["Fight me, or take this amulet. Those are your choices."]]
            ]
        ],
        evil_intro_and_ending: [
            [
                [["You.", "I feared something like you would finally come this way.", "Do you just wish for my death?", "Was banishment to this dungeon not enough?", "Or are you just here to kill the lesser species?", "Regardless, you will not win.", "You think this is the first time we've met, but you're mistaken.", "You are now part of The Cycle. You will repeat this dungeon, your massacres, our meeting... until you die.", "Or maybe I'll die first.", "Nonetheless, I bid you farewell until we meet again.", "AVAK ANASU NOSALISE! TO PURGATORY WITH YOU!"]] //Everything go black here, game restarts soon after.
            ]
        ],
        good_ending: [
            [
                [["So it shall be.", "You will now become one of my children, a guardian to my lair.", "The transformation will be painful at first, but you will get used to it.", "Welcome home."]]
            ]
        ],
        bad_ending: [
            [
                [["The Cycle... is done...", "You will live with your decision, human... and it will curse you until your death."]]
            ]
        ]
    }

	Story.dialog = new Object();

	Story.dialog[Story.NPC_CHARACTERS.adventurer] = Story.adventurer;
    Story.dialog[Story.NPC_CHARACTERS.sign] = Story.sign;
    Story.dialog[Story.NPC_CHARACTERS.strongman] = Story.strongman;
    Story.dialog[Story.NPC_CHARACTERS.mystic] = Story.mystic;
    Story.dialog[Story.NPC_CHARACTERS.aralynne] = Story.aralynne;

	Story.getLine = function(character) {
        var lines = Story.dialog[character]["story"][Story.phase].length;
        var line = chance.integer({min:0, max:lines-1});
        return Story.dialog[character]["story"][Story.phase][line];
	}

    Story.getAralynneLine = function(trait) {
        return Story.dialog[NPC_CHARACTERS.aralynne][trait][0][0];
    }

    Story.calculatePhase = function() {
        if(curr_level / global_difficulty.length < 0.33) {
            Story.phase = 0;
        }
        else if (curr_level / global_difficulty.length < 0.66) {
            Story.phase = 1;
        }
        else {
            Story.phase = 2;
        }
    }

    // Custom dialog for preferred room direction
    Story.roomDirectionDialog = function(character) {
        console.log(RoomFirstExitPreference.value().option);
        var direction = RoomFirstExitPreference.value().option;
        var dialog = [];

        if (character == Story.NPC_CHARACTERS.adventurer) {
            dialog = [["These rooms sometimes have so many exits.", "But you seem to really like going " + direction + ", don't ya?", "You look surprised that I know that.", "We learn a lot things about what people choose to do down here."], ["Don't make a bad decision."]];
        }
        else if (character == Story.NPC_CHARACTERS.strongman) {
            dialog = [["Up...", "Down...", "Left...", "Right...","You can go any of those directions in nearly any room.","But you just seem to go " + direction + "."], ["See you on the " + direction + "-side soon."]];
        }
        else {
            dialog = [["You will go "+ direction +" the next chance you have."], ["We're all counting on it."]];
        }

        return dialog;
    }

    // Custom dialog for percentages of enemies engaged
    Story.enemyEngagedDialog = function(character) {
        var willKillBats = Classes.Bat.prototype.Engaged.value().option;
        var willKillSlimes = Classes.Slime.prototype.Engaged.value().option;
        var willKillAll = willKillBats && willKillSlimes;
        var willKillNone = !willKillBats && !willKillSlimes;

        var dialog = [];
        var subDialog = [];

        if (character == Story.NPC_CHARACTERS.adventurer) {
            // Want to address player killing Nothing or Everything first
            if (willKillNone) {
                dialog = [["You're clad in armor and have a sword, but you haven't slain anything?", "You gotta learn to swing that blade if you're gonna survive."], ["Go get 'em!"]];
            }
            else if (willKillAll) {
                dialog = [["It's gotten really quiet in this part of the dungeon.", "... is that your fault?"], ["It's even creepier now."]];
            }
            else {
                subDialog.push("Seems you've gotten to meet some of the wildlife around here.");
                if (willKillBats)
                    subDialog.push("Those bats seem like they're no match for you.");
                else
                    subDialog.push("You gotta watch out for those bats though.");

                if (willKillSlimes)
                    subDialog.push("And you cut through those slimes like butter.");
                else
                    subDialog.push("And those slimes can ambush you, even if they move slow.");
                
                subDialog.push("Also, the boss of each floor might not look strong, but they have tricks up their sleeves.");
                dialog.push(subDialog);
                dialog.push(["Good luck out there."]);
            }
        }
        else if (character == Story.NPC_CHARACTERS.strongman) {
            // Want to address player killing Nothing or Everything first
            if (willKillNone) {
                dialog = [["What kind of weenie comes to a place like this and doesn't hurt a fly?"], ["FUHUHUHU!"]];
            }
            else if (willKillAll) {
                dialog = [["I was all ready to kick some monster butt down here, but there's nothing left."], ["Is that your fault?"]];
            }
            else {
                subDialog.push("Let me give you the lowdown on what you're in for down here.");
                if (willKillBats)
                    subDialog.push("You've met the bats. They're cake.");
                else
                    subDialog.push("The bats here are fast, but weak.");

                if (willKillSlimes)
                    subDialog.push("And the slimes, as you know, are slow and come in packs.");
                else
                    subDialog.push("And I hate those slimes. They all attack you at once. Not fair!");
                
                subDialog.push("Finally, the bosses here are tricky. Just watch out for 'em");
                dialog.push(subDialog);
                dialog.push(["I feel like I'm forgetting one more... Eh, you'll be fine."]);
            }
        }
        else {
            // Want to address player killing Nothing or Everything first
            if (willKillNone) {
                dialog = [["You are surprisingly non-violent, human.", "If you wish to stay down here, then I fear that trend may end."], ["It is your choice to make."]];
            }
            else if (willKillAll) {
                dialog = [["Disgusting.", "You reek of death.", "You eminate hate."], ["Aralynne will have her revenge."]];
            }
            else {
                dialog = [["So. Your blade has seen blood.", "There's much more where that came from."], ["Prepare to die."]];
            }
        }

        return dialog;
    }

    // Custom dialog for overall movement in the dungeon
    Story.movementDialog = function(character) {

    }

    // Custom dialog for potion usage. Chance to add potion to player's inventory
    Story.potionUseDialog = function(character) {
        var avgPotionHP = PotionUse.value();
        var player = game.currentScene.player;
        var dialog = []

        if ((avgPotionHP == 0 && player.potions == 0) || (player.health <= avgPotionHP)) {
            dialog = [["My friend, you seem in need of assistance.", "Please let me help.", "Take my last potion and perservere."], ["Good tidings, friend."]];
            Story.needsToGivePotion = true;
        }
        else {
            dialog = [["I have given all I can to the wounded in this dungeon.", "I'm sorry I have failed you when you needed it most."],["Please forgive me in this life, and <br>I'll make it up to you in the next."]];
        }

        return dialog;
    }

    // Custom dialog for number of times an NPC has been interacted with
    Story.npcInteractionsDialog = function(character) {

    }

    // Custom dialog for player deaths
    Story.playerDeathsDialog = function(character) {

    }

    // Custom dialog for puzzles completed/failed
    Story.puzzleDialog = function(character) {

    }

    Story.CUSTOM_DIALOGS = [
        Story.roomDirectionDialog,
        Story.enemyEngagedDialog,
        Story.potionUseDialog
    ];
}

