/*
 * The Player class keeps track of the character stats and animates and moves
 * the character sprite.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('NPC', function(game) {
   return Class.create(Classes['Character'], {
      initialize: function(x, y) {
         Classes.Character.call(this, x, y);
         this.isKillable = false;
      },
      getDialog: function() {
      },
      say: function() {
      },

      // Check if the player just tried to move onto me
      canMoveOntoMe: function(collider) {
         if (collider instanceof Classes['Player']) {
            this.say();
         }

         return false;
      },
   });
});