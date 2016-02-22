ClassManager.create('Pushable', function(game) {
   return Class.create(Classes.Triggerable, {
		itemName: 'shield_4',
		className: 'Pushable',
		fixedInPlace: true,

		act: function(something) {
			// Fun stuff
			console.log("Act received... " + something);

			
		},

		// Check if it's valid to push a boulder in a direction
		tryPushInDirection: function(dx, dy, room) {
			var canPush = room.isPlayerWalkable(this.position.x + dx, this.position.y + dy, dx, dy);

   		if (canPush) {
				room.removeItemAt(this.position.x, this.position.y);

				this.position.x += dx;
				this.position.y += dy;

				room.addItemAt(this, this.position.x, this.position.y);
   		}
			
			return canPush;
		}
 	});
});
