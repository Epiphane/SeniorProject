/*
 * The Player class keeps track of the character stats and animates and moves
 * the character sprite.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Player', function(game) {
   return Class.create(Classes['MovingSprite'], {
      initialize: function(x, y) {
         Classes['MovingSprite'].call(this, x, y);
         this.image = game.assets["assets/images/player.png"]; 

         this.isAttacking = false;
         this.attackCounter = 0;
         this.cooldown = 0;
      },

      /*
       * Determines whether the player can move again
       */
      waiting: function() {
         return !this.isMoving();
      },
      
      // Run the walking animation if you need to move
      onenterframe: function() {
         this.frame = this.direction * C.P_WALK_ANIM_LEN + this.walkOffset;

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
               this.walkOffset = ++this.walkOffset % 3;
            }
         }
         else {
            // Reset animation
            this.walkOffset = 1;
         }
      }
   });
});