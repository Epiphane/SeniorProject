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
      'sign', 'adventurer', 'strongman', 'badSign'
   ]);

	// Adventurer (npc1)
	// A young lost adventurer. Usually in trouble. Notices strength of the player.
	Story.adventurer = {
		story: [
         	[
                [["Oh... hi.", "You're really in a pickle right now, aren't ya?", "How'd you find yourself in the most dangerous dungeon in Squarr?", "Well, nevermind that. You should try to find a way out."],["Don't let me keep you any longer. I'll be fine"]],
                [["Are you a knight?", "Are you strong?", "Are you a hero?", "... can you save my dumb friends that went deeper into this dungeon?"], ["Don't tell our parent's we're here!"]],
                [["I'm sure you've noticed by now that enemies only act when you move.", "That's why I'm not moving an inch from this spot!"], ["Don't just stand there!", "... or do. I'm not judging."]],
                [["You really like swiging that thing around, huh?", "When I'm playing knight, I'm always invincible, so you can't hurt me.", "Don't you wish you were as cool as me?"], ["* You try telling him to get somewhere safe, but he ignores you and continues making a 'whooshing' sound and swinging around a stick."]]
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
                [["A lot of people come to this place to try and prove themselves.", "This dungeon, Aralynne's Lair, is said to be a living and breathing organism.", "Some say it follows the laws of nature like a wild animal.", "... it adapts. It kills. It survives."], ["I never should have taken that dare."]],
                [["Why are you breathing so loudly?", "... that's not you?"], ["..."]],
                [["I've seen her.", "You don't stand a chance."]],
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
                [["Having fun? Is this too easy for you? Too hard?", "Not that it matters. We'll meet soon enough."], ["* It's a blank sign."]],
                [["Health ahead!"], ["Just kidding."]],
                [["Some enemies don't always move every time you do.", "Use this to your advantage!"]]
            ]
		]
	};

	// A buff dude that somehow found his way into our little dungeon. 
	// TODO: Changes his personality based on kills/attack power
	Story.strongman = {
		story: [
			[
				[["Hey small fry. I have some advice for ya.", "SCRAM!"], ["Hahahahaha"]],

			]
		]
	}

	Story.dialog = new Object();

	Story.dialog[Story.NPC_CHARACTERS.adventurer] = Story.adventurer;
    Story.dialog[Story.NPC_CHARACTERS.sign] = Story.sign;

	Story.getLine = function(character, trait, story) {
		// TODO: Get trait info from Choice.js and based on top traits randomly choose dialog.
      var lines = Story.dialog[character][trait][story].length;
      var line = chance.integer({min:0, max:lines-1});
		return Story.dialog[character][trait][story][line];
	}
}

