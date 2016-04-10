ClassManager.create('Pushable', function(game) {
   return Class.create(Classes.Character, {
      itemName: 'shield_4',
      className: 'Pushable',


      initialize: function(x, y) {
         Classes.Character.call(this, x, y);
         this.image = game.assets["assets/images/boulder.png"];
      },

      // Check if it's valid to push a boulder in a direction
      canMoveOntoMe: function(collider, room) {
         if (collider instanceof Classes['Player'] ||
             collider instanceof Classes['Pushable']  ) {

            // Get character direction, also steal their direction
            this.direction = collider.direction;
            var dir = Utils.to.direction(collider.direction);
            var dx = dir[0];
            var dy = dir[1];

            var canPush = room.tryMovingToTile(this.position.x + dx, this.position.y + dy, this);
            return canPush;
         }

         return false;
      },

      // I just got pushed!
      didMoveOntoMe: function(collider, room) {
         if (collider == this) return;

         if (collider instanceof Classes['Player'] ||
             collider instanceof Classes['Pushable']  ) {

            // Get pusher direction
            this.direction = collider.direction;
            var dir = Utils.to.direction(collider.direction);
            var dx = dir[0];
            var dy = dir[1];

            this.position.x += dx;
            this.position.y += dy;
            room.didMoveToTile(this.position.x, this.position.y, this);
         }
      },

      everyTurn: function() {
         // Boulders don't have much in the way of intelligence
      }
    });
});
