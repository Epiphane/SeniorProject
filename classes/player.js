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

         this.health = this.max_health = 8;
         this.health -= 3;
      },

      // Set the player's sprite to the direction it's facing, and advance its walk cycle
      updateSpriteFrame: function() {
         if (this.isMoving()) {
            // Animate (3 frame animation) every two frames            
            if (game.frame % 4 === 0) {
               this.walkOffset = ++this.walkOffset % 3;
            }

         }
         else {
            this.walkOffset = 1;
         }
         this.frame = this.direction * C.P_WALK_ANIM_LEN + this.walkOffset;
      },

   });
});