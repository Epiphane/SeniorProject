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
         var randomDirection = Utils.getRandomInt(C.P_DIR.DOWN, C.P_DIR.UP);
         this.action(randomDirection);
      },

      updateSpriteFrame: function() {
         if (this.isMoving()) {
            // Animate through the enemy's walk cycle every three frames            
            if (game.frame % 8 === 0) {
               var walkCycleLength = this.enemyType.walkEndFrame - this.enemyType.walkStartFrame;
               this.walkOffset = ++this.walkOffset % walkCycleLength;
            }

            this.frame = this.enemyType.walkStartFrame + this.walkOffset;
         }
         else {
            this.frame = this.enemyType.walkStartFrame;
         }
      },
   });
});