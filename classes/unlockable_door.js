
// Represents a door that has a bunch of switches attached, that
//  only opens when all the swithces are pressed
ClassManager.create('UnlockableDoor', function(game) {
   return Class.create(Classes.Item, {
		itemName: 'shield_3',
		className: 'UnlockableDoor',

		connectedSwitches: [],
		impassible: true,

		act: function(who_cares) {
			// Maybe later, it'll highlight the switches you need to press
			console.log("Act received... " + who_cares);
		},

		switchChanged: function(changedSwitch, isPressed) {
			var shouldOpen = true;
			connectedSwitches.forEach(function(currSwitch) {
				if (currSwitch == changedSwitch) {
					currSwitch.pressed = isPressed;
				}

				if (!currSwitch.pressed) {
					shouldOpen = false;
				}
			});

			if (shouldOpen) {
				impassible = false;
				console.log("Door is open...");
				this.image = game.assets["assets/images/boulder.png"];
			}
			else {
				impassible = true;
				console.log("Door is closed!");
				this.image = game.assets["assets/images/door.png"];
			}
		},
		
		doAI: function() {
			// Doors don't have much in the way of intelligence
		}
 	});
});
