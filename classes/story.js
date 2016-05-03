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

   Story.NPC_CHARACTERS = Enum([
      'sign', 'adventurer', 'strongman', 'mystic'
   ]);

	// Adventurer (npc1)
	// A young lost adventurer. Victim of multiple personalities.
	Story.adventurer = {
		story: [
         	[
                [["Oh... hi.", "You're really in a pickle right now, aren't ya?", "How'd you find yourself in the most dangerous dungeon in Squarr?", "Well, nevermind that. You should try to find a way out."],["Don't let me keep you any longer. I'll be fine"]],
                [["Are you a knight?", "Are you strong?", "Are you a hero?", "... can you save my dumb friends that went deeper into this dungeon?"], ["Don't tell our parents that we're here!"]],
                [["I feel like humans were never meant to come here.", "What did these monsters ever do to make us want to kill them?", "Don't they just seem scared to you?"], ["Maybe you should leave."]],
                [["I'm sure you've noticed by now that enemies only act when you move.", "That's why I'm not moving an inch from this spot!"], ["Don't just stand there!", "... or do. I'm not judging."]],
                [["You really like swiging that thing around, huh?", "When I'm playing knight, I'm always invincible, so you can't hurt me.", "Don't you wish you were as cool as me?"], ["* You try telling him to get somewhere safe, but he ignores you and makes a 'whooshing' sound while swinging around a stick."]]
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
                [["* This sign seems handmade. You can barely make out the words.", "'no amount of training will prepare you for -'", "* The writing trails off into scribbles."]],
                [["Having fun? Is this too easy for you? Too hard?", "You should have never come here."], ["* It's a blank sign."]],
                [["Health ahead!"], ["Just kidding."]],
                [["Some enemies don't always move act time you do.", "Use this to your advantage!"]]
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
				[["Hey small fry. I have some advice for ya.", "SCRAM!"], ["Hahahahaha"]],
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
                [["Squarr didn't used to have dungeons. Monsters lived with humans at one point in time.", "But somewhere along the line they became aggressive towards us and had to be stopped.", "So we banished those that surrendered to dungeons.", "Aralynne... The first dungeon master.", "She will fall to my blade."], ["I will avenge my master"]]
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
                [["...", "...", "I suppose it cannot be helped."], ["* Its silent."]],
                [["* Its watching your every move. Even after you leave the room."]],
                [["Aralynne has been getting weaker. More humans have been reaching her chambers and battling her.", "She just sends them back to the dungeon entrance instead of killing them.", "But she can't do this forever."], ["Stay determined."]],
                [["Squarr did not always have dungeons. Monsters lived alongside humans at one point in time.", "But somewhere along the line humans became aggressive towards monsters and battle broke out.", "Surviving monsters were banished to dungeons.", "Aralynne... The first dungeon dweller.", "Her death means the end of the Cycle."], ["I wish only for peace."]]
            ]
        ]
    };

	Story.dialog = new Object();

	Story.dialog[Story.NPC_CHARACTERS.adventurer] = Story.adventurer;
    Story.dialog[Story.NPC_CHARACTERS.sign] = Story.sign;
    Story.dialog[Story.NPC_CHARACTERS.strongman] = Story.strongman;
    Story.dialog[Story.NPC_CHARACTERS.mystic] = Story.mystic;

	Story.getLine = function(character, trait, story) {
		// TODO: Get trait info from Choice.js and based on top traits randomly choose dialog.
      var lines = Story.dialog[character][trait][story].length;
      var line = chance.integer({min:0, max:lines-1});
		return Story.dialog[character][trait][story][line];
	}
}

