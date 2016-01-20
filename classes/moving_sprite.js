/*
 * The MovingSprite class keeps track of a sprite, that can move. SURPRISE!
 *  It handles the walk animation, collisions and direction stuff.
 *
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('MovingSprite', function(game) {
   return Class.create(Sprite, {
      initialize: function(x, y) {
         Sprite.call(this, C.TILE_SIZE, C.TILE_SIZE);

         // This is the position in screen coordinates
         this.x = x * C.TILE_SIZE;
         this.y = y * C.TILE_SIZE;

         // This is the position in game coordinates
         this.position = { x: x, y: y };

         /* The REAL 'frame' property, actually used by the Sprite class to set the sprite's frame. */
         this.frame = 0;
         
         this.direction = C.P_DIR.DOWN;

         /* How far is this sprite into its walk cycle? */
         this.walkOffset = 1;
         this.walkSpeed = (1 / 12) * C.TILE_SIZE; // Move this many pixels at a time
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
       * Is this sprite moving?
       * 
       * Returns true if the player's screen position matches that of the game position (scaled)
       */
      isMoving: function() {
         return !(this.x === this.position.x * C.TILE_SIZE && this.y === this.position.y * C.TILE_SIZE);
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
      
      // Run the walking animation if you need to move
      onenterframe: function() {
         if (this.isMoving()) {
            var dx = this.position.x * C.TILE_SIZE - this.x;
            var dy = this.position.y * C.TILE_SIZE - this.y;
            if (dx >  this.walkSpeed) dx =  this.walkSpeed;
            if (dy >  this.walkSpeed) dy =  this.walkSpeed;
            if (dx < -this.walkSpeed) dx = -this.walkSpeed;
            if (dy < -this.walkSpeed) dy = -this.walkSpeed;

            this.moveBy(dx, dy);
         }

         this.updateSpriteFrame();
      }


   });
});