/*
 * The Player class keeps track of an enemy's stats and their movement/attack AI
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Enemy', function(game) {
   return Class.create(Classes['Character'], {
      sprite: '',

      initialize: function(x, y) {
         Classes['Character'].call(this, x, y);

         this.image = game.assets["assets/images/" + this.sprite];
      },

      doAI: function() {
         var randomDirection = Utils.getRandomInt(C.P_DIR.DOWN, C.P_DIR.UP);
         this.action(randomDirection);
      }
   });
});

ClassManager.create('Bat', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster1.gif",
      walkStartFrame: 3,
      walkEndFrame:   5
   });
});

ClassManager.create('Slime', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster2.gif",
      walkStartFrame: 3,
      walkEndFrame:   5
   });
});