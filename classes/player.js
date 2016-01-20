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

      walkAnimSpeed: 4,
      walkStartFrame: 1,
      walkEndFrame: 4,

      getDirectionFrame: function() {
         return 9 * this.direction;
      },

   });
});