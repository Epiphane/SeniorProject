/*
 * The Player class keeps track of the character stats and animates and moves
 * the character sprite.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('NPC', function(game) {
   return Class.create(Classes['Character'], {
      sprite: '',

      initialize: function(x, y) {
         Classes.Character.call(this, x, y);
         this.isKillable = false;
         this.dialogInstance = 0;

         if (this.sprite) {
            this.image = game.assets["assets/images/" + this.sprite];
         }
      },
      getDialog: function() {
      },
      say: function() {
      },

      // Check if the player just tried to move onto me
      canMoveOntoMe: function(collider, room) {
         if (collider instanceof Classes['Player']) {
            //this.parseObj.increment('numInteractions');
            //this.parseObj.save();
            this.say();
         }

         return false;
      },
   });
});