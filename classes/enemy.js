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
         this.frame = this.animationFrame;
         if (this.isMoving) {
            this.moveBy(this.vx * C.TILE_SIZE, this.vy * C.TILE_SIZE);

            // Animate every four frames            
            if (game.frame % 4) {
               this.animationFrame = ++this.animationFrame % 3;
            }

            if ((this.vx && this.x % this.width == 0) || (this.vy && this.y % this.height == 0)) { /* 32x32 grid */
               this.isMoving = false;
            } 
         }
      },

      move: function() {
         if (this.isMoving()) {

         }
         else {
            this.walk
         }
      },
   });
});