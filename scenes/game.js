/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.backgroundColor = "black";
      
      Game.player = new Classes.Player(2, 2);
      Game.enemy1 = new Classes.Enemy(5, 5, C.enemyType.slime)
      Game.enemy2 = new Classes.Enemy(7, 5, C.enemyType.bat)
      Game.currentRoom = new Classes.Room();
         
      Game.addChild(Game.currentRoom);
      Game.addChild(Game.player);

      Game.addChild(Game.enemy1);
      Game.addChild(Game.enemy2);

      Game.enemies = [Game.enemy1, Game.enemy2];

      Game.addChild(new Classes.HUD(Game.player));

      // Checks if any entity is still moving
      Game.waitingOnMovement = function() {
         if (Game.player.isMoving()) return true;
         for (var ndx = 0; ndx < Game.enemies.length; ndx++) {
            if (Game.enemies[ndx].isMoving()) return true;
         }

         return false;
      }

      Game.onenterframe = function() {
         if (!Game.waitingOnMovement()) {
            if (game.input.left) {
               Game.action(C.P_DIR.LEFT);
            }
            else if (game.input.right) {
               Game.action(C.P_DIR.RIGHT);
            }
            else if (game.input.up) {
               Game.action(C.P_DIR.UP);
            }
            else if (game.input.down) {
               Game.action(C.P_DIR.DOWN);
            }
         }
      }

      Game.action = function(direction) {
         Game.player.action(direction);
         Game.enemies.forEach(function(enemy) {
            enemy.doAI();
         });
      }
      
      return Game;
   };


})(window.Scenes, window.Classes);
