ClassManager.create('Pushable', function(game) {
   return Class.create(Classes.Character, {
		itemName: 'shield_4',
		className: 'Pushable',


      initialize: function(x, y) {
         Classes.Character.call(this, x, y);
         this.image = game.assets["assets/images/monster1slow.gif"];
      },

		act: function(something) {
			// Fun stuff
			console.log("Act received... " + something);

			
		},

		// Check if it's valid to push a boulder in a direction
		tryPushInDirection: function(dx, dy, room) {
			var canPush = room.isPlayerWalkable(this.position.x + dx, this.position.y + dy, dx, dy);

   		if (canPush) {
				this.position.x += dx;
				this.position.y += dy;
   		}
			
			return canPush;
		},

		doAI: function() {
			// Boulders don't have much in the way of intelligence
		}
 	});
});
