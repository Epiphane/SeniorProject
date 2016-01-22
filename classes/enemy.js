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
         if (Utils.cellDistance(this.position, game.currentScene.player.position) == 1) {
            // Monster is next door, do monster attack
            console.log("I'M ATTACKIN U BOSS");
         }

         var targetPosition = game.currentScene.player.position;
         var pathingTarget = astar(game, game.currentScene.currentRoom.tiles, this.position, targetPosition);

         if (pathingTarget) { 
            this.action(pathingTarget.pos.x - this.position.x, pathingTarget.pos.y - this.position.y);
         }

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