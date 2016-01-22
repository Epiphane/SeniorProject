/*
 * The Player class keeps track of an enemy's stats and their movement/attack AI
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Enemy', function(game) {
   return Class.create(Classes['Character'], {
      sprite: '',
      initial_attack: 1,

      initialize: function(x, y) {
         Classes['Character'].call(this, x, y);

         this.image = game.assets["assets/images/" + this.sprite];
      },

      doAI: function() {
         var targetPosition = game.currentScene.player.position;

         /* TODO: do A* pathfinding or something here */
         var pathingDirection = C.P_DIR.UP;
         var diffX = this.position.x - targetPosition.x;
         var diffY = this.position.y - targetPosition.y;

         if (Math.abs(diffX) > Math.abs(diffY)) { // Target is either LEFT or RIGHT from us
            pathingDirection = (diffX < 0) ? C.P_DIR.RIGHT : C.P_DIR.LEFT;
         }
         else { // Target is either UP or DOWN
            pathingDirection = (diffY < 0) ? C.P_DIR.DOWN : C.P_DIR.UP;  
         }

         this.action.apply(this, Utils.to.direction(pathingDirection));
      },

      action: function(dx, dy) {
         var moved = Classes['Character'].prototype.action.apply(this, arguments);

         var room = game.currentScene.currentRoom;
         if (!moved) {
            var enemy = room.getCharacterAt(this.position.x + dx, this.position.y + dy);

            if (enemy instanceof Classes['Player']) {
               this.doAttack(enemy, dx, dy);
            }
         }
      }
   });
});

ClassManager.create('Bat', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster1.gif",
      walkStartFrame: 3,
      walkEndFrame:   5,
   });
});

ClassManager.create('Slime', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster2.gif",
      walkStartFrame: 3,
      walkEndFrame:   5
   });
});