ClassManager.create('Pushable', function(game) {
   return Class.create(Classes.Triggerable, {
		itemName: 'shield_4',
		className: 'Pushable',
		fixedInPlace: true,

        committingToday: true,

		act: function(something) {
			// Fun stuff
			console.log("Act received... " + something);
		},

		// Check if it's valid to push a boulder in a direction
		canPushInDirection: function(dx, dy, room) {
			console.log("push me around will ya? " + room);
		}
 	});
});
