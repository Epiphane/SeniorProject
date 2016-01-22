/*
 * Allows data to be tracked from anywhere in the source by calling various
 * logging methods. These logs will be combined into a larger object that
 * can sent to and restored from a Parse database
 */

(function(window) {
	/* Holds all logging functions */
	var EventManager = window.EventManager = window.EM = {};

	EM.EVENT_TYPE = Enum([
		'stats',	// For events relating to the player (increases/losses)
					// EX: health loss, atk up, def down, etc.
		'duration', // For events relating to time spent on something
					// EX: time to "complete" room (puzzle, killing, enemies)
		'movement', // For events relating to movement of player
					// EX: movement speed (avg. spaces moved per min?)
		'items',	// For events relating to using*/picking up/dropping items
					// *using an item during a fight is a combat event
		'combat',   // For events relating to anything happening during combat
					// EX: player lands hit, uses item, etc.
		'npc',      // For events relating to NPCs or other non-killable things
					// EX: player talks to NPC x times
		'puzzle',	// For events relating to puzzles
					// EX: player doesn't interact with puzzle
		'boss',		// For events relating to bosses
					// EX: player hits boss, player dies to boss
		'test',		// Self explanatory
	]);

	EM.events = new Object();
	EM.events[EM.EVENT_TYPE.stats] = new Object();
	EM.events[EM.EVENT_TYPE.duration] = new Object();
	EM.events[EM.EVENT_TYPE.movement] = new Object();
	EM.events[EM.EVENT_TYPE.items] = new Object();
	EM.events[EM.EVENT_TYPE.combat] = new Object();
	EM.events[EM.EVENT_TYPE.npc] = new Object();
	EM.events[EM.EVENT_TYPE.puzzle] = new Object();
	EM.events[EM.EVENT_TYPE.boss] = new Object();
	EM.events[EM.EVENT_TYPE.test] = new Object();

	/* Initializing Methods */

	EM.initialize = function() {
		// TODO - Implement me
		// Grab Parse data and fill in EM.<type>Events objects
	};

	EM.saveAll = function() {
		// TODO - Implement me
		// Sends all the data saved in EM.<type>Events objects to Parse DB
	};

	/* Logging methods */
	// Logging works like so:
	// EM.log(game, <EM.EVENT_TYPE.x>, "specific_event", value);
	// The "specific_event" acts as a subcategory within the initial event type

	EM.log = function(game, eventType, key, value) {
		// TODO - add game variable influence calculations

		console.log(EM.events);
		if (EM.events[eventType] !== undefined) {

			var eventObject = EM.events[eventType];

			if (eventObject[key] === undefined) {
				eventObject[key] = value;
			}
			else {
				eventObject[key] = eventObject[key] + value;
			}

			console.log("New Event value: " + EM.events[eventType][key]);
		}
		else {
			console.log("Event Type" + eventType + " does not exist.");
		}
	};
})(window);