/*
 * The Player class keeps track of the character stats and animates and moves
 * the character sprite.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Player', function(game) {
   return Class.create(Sprite, {
      initialize: function(x, y) {
         Sprite.call(this, C.TILE_SIZE, C.TILE_SIZE);
         this.image = game.assets["assets/images/player.png"];

         // This is the position in screen coordinates
         this.x = x * C.TILE_SIZE;
         this.y = y * C.TILE_SIZE;

         // This is the position in game coordinates
         this.position = { x: x, y: y };

         this.frame = 0;
         
         this.direction = C.P_DIR.DOWN;
         this.walk = 1;
         this.isAttacking = false;
         this.attackCounter = 0;
         this.cooldown = 0;

         this.health = this.max_health = 8;
         this.health -= 3

         this.walkSpeed = (1 / 8) * C.TILE_SIZE; // Move this many pixels at a time
      },

      /*
       * Determines whether you can move again
       */
      waiting: function() {
         return !this.isMoving();
      },

      /*
       * Attempt to make a move (or attack) in the specified direction
       */
      action: function(direction) {
         this.direction = direction;
         switch (direction) {
            case C.P_DIR.LEFT:
               this.tryMove(-1, 0);
               break;
            case C.P_DIR.RIGHT:
               this.tryMove(1, 0);
               break;
            case C.P_DIR.UP:
               this.tryMove(0, -1);
               break;
            case C.P_DIR.DOWN:
               this.tryMove(0, 1);
               break;
            default:
               console.error('Direction not recognized:', direction);
         }
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

      /*
       * Is the player moving?
       * 
       * Returns true if the player's screen position matches that of the game position (scaled)
       */
      isMoving: function() {
         return !(this.x === this.position.x * C.TILE_SIZE && this.y === this.position.y * C.TILE_SIZE);
      },
      
      // Run the walking animation if you need to move
      onenterframe: function() {
         this.frame = this.direction * C.P_WALK_ANIM_LEN + this.walk;

         if (this.isMoving()) {
            var dx = this.position.x * C.TILE_SIZE - this.x;
            var dy = this.position.y * C.TILE_SIZE - this.y;
            if (dx >  this.walkSpeed) dx =  this.walkSpeed;
            if (dy >  this.walkSpeed) dy =  this.walkSpeed;
            if (dx < -this.walkSpeed) dx = -this.walkSpeed;
            if (dy < -this.walkSpeed) dy = -this.walkSpeed;

            this.moveBy(dx, dy);

            // Animate (3 frame animation) every two frames            
            if (game.frame % 2) {
               this.walk = ++this.walk % 3;
            }
         }
         else {
            // Reset animation
            this.walk = 1;
         }
      }
   });
});