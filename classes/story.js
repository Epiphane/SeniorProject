// Story Ideas / Concepts
/*
 * Premise:
 * * The player finds themselves in a dungeon with a bunch of monsters. The first instinct of course is to fight them off and proceed.
 * * However, as the player progresses, cryptic signage starts telling the player that they're not alone and that they're creating a monster
 * * (wording based on kill-count). Player begins finding rooms filled with just monster corpses, signs appear with wording written in blood, and altogether
 * * weird stuff starts to happen. The final dungeon is completely empty, music stops, all enemies, signs, and NPCs are dead. In the boss room, the player
 * * finds a sprite exactly like himself. Depending on some values 3 outcomes can occur: 1. Basically Genocide Flowey ending 
 * * (if you've killed everything without dying), 2. (monologue then fight), 3. Player is slaughtered by "dark" version of self. The ultimate thing
 * * is to realize your actions are being monitored, replicated, and enhanced by this shadow version of you.
 *
 * Delivery:
 * * Player comes into contact with various NPCs and Signs throughout the dungeon crawl. Depending on the designer's input, each dungeon layer will go from
 * * Helping the player navigate and fight to being oddly cryptic hints that the player isnt the only one excavating the dungeon. 
 * * NPCs become more afraid of the player as time passes, and custom rooms can be shown with the NPCs barricading themselves behind walls (need to
 * * figure out how we can still have the player talk to them, or put a sign in front of the barricade).
 *
 * Adaptive Integration:
 * * Here's a suggestion for how things are altered based on adaption values:
 * * * Dialogue: 
 * * * * Dialogue options for NPCs will be decided by a mixture of decision trees, starting with kills as the highest branch. Then, enemy choice, 
 * * * * health, and items carried.
 * * * Enemies:
 * * * * Enemies will spawn in increasing number depending on the player's skill and kill count. If enemies are left alive, it could be 
 * * * * interpreted as the player wanting to avoid them, so they should be made more numerous if the difficulty is to rise in the next dungeon.
 * * * Signs:
 * * * * Signs will appear less often as the player progresses. Early signs should hint at gameplay help, dungeoneering tips, and a few 
 * * * * signs of encouragement to clear the dungeon. Possible cryptic signs like "I saw that." or "We're becoming more alike." should appear at times,
 * * * * with the first interaction being the text and 2nd being "* There's nothing written on the sign." + variants.
 * * * Bosses:
 * * * * I want to entertain the idea of having the player be able to walk past the first boss if they kill nothing. We should figure out a way to have
 * * * * dialog appear when a player enters the room so bosses can comment on the player about this other shade that has been creeping through the dungeon.
 * * * * I also like the idea of enhanced/weakened bosses based on adaptive curves and using story elements to explain these. e.g. "dude just came through
 * * * * and gave this thing to make me buff, now ur gonna die" or "Back for more? Too bad im already weak blah blah you wont get satisfaction from 
 * * * * 1-shotting me u miserable creature." and then u 1-shot him yey. Final boss could be really fun to work with. I was thinking he would alter
 * * * * your WSAD setup and teleport you around so you'd get confused with which person you were (since you and dark you would have very similar sprite)
 */

var Story = window.Story = {};

Story.init = function(game) {
	// Dialog Entries
	// Each NPC will have a dialog object with all their dialog entires in them. The top level of the object will contain
	// key words that dictate the context we want for the dialog. These contexts contain nested arrays with all the dialog options.
	// Based on the story/dungeon progression (TBD) an index value will be chosen from 0(start)-3(endgame) to pull dialog from. 
	// There, a few random choices of dialog are available and will be selected using Choice.js.

   Story.NPC_CHARACTERS = Enum([
      'sign', 'adventurer', 'badSign'
   ]);

	// Adventurer (npc1)
	// A young lost adventurer. Usually in trouble. Notices strength of the player.
	Story.adventurer = {
		kills: [
         [
			   [["You seem to be handling yourself just fine."],["Don't you have something better to do?"]],
			   [["Don't get too comfortable down here.", "Things are changing constantly."], ["Careful, now."]]
         ]
		]
	};

	Story.dialog = new Object();

	Story.dialog[Story.NPC_CHARACTERS.adventurer] = Story.adventurer;

	Story.getLine = function(character, trait, story) {
		// TODO: Get trait info from Choice.js and based on top traits randomly choose dialog.
      var lines = Story.dialog[character][trait][story].length;
      var line = chance.integer({min:0, max:lines-1});
		return Story.dialog[character][trait][story][line];
	}
}

