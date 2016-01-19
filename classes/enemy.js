/*
 * The Player class keeps track of an enemy's stats and their movement/attack AI
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 *    type = what type the enemy is
 */
ClassManager.create('Enemy', function(game) {
   return Class.create(Classes['MovingSprite'], {
      initialize: function(x, y, type) {
         Classes['MovingSprite'].call(this, x, y);

         this.enemyType = type;
         this.image = game.assets["assets/images/" + type.sprite];

         /* Enemies only move when the player moves. */
         this.waitingForPlayer = false;
      },
      
      onenterframe: function() {
         this.doAI();
         this.move();
      },

      /*
       * Attempt to move in a direction
       */
      tryMove: function(dx, dy) {
         if (game.currentScene.currentRoom.isWalkable(this.position.x + dx, this.position.y + dy)) {
            this.position.x += dx;
            this.position.y += dy;
         }
      },

      doAI: function() {
         // TODO: move trigger to the central enemy-logic-thing.
         if (!game.currentScene.player.waiting()) {
            var randomDirection = Utils.getRandomInt(C.P_DIR.DOWN, C.P_DIR.UP);
            this.action(randomDirection);
         }
      },

      move: function() {
         if (this.isMoving()) {
            // Animate (3 frame animation) every two frames            
            if (game.frame % 2) {
               this.walkOffset = ++this.walkOffset % 3;
            }

            var dx = this.position.x * C.TILE_SIZE - this.x;
            var dy = this.position.y * C.TILE_SIZE - this.y;

            this.moveBy(dx, dy);
         }
         else {
            this.walkOffset = 1;
         }
      },
   });
});