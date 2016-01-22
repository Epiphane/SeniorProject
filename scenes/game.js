/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.backgroundColor = "black";

      Game.dungeonGenerator = new Classes.DungeonGenerator();
      Game.currentRoom = Game.dungeonGenerator.createDungeon();
      Game.addChild(Game.currentRoom);

      Game.setRoom = function(room) {
         Game.removeChild(Game.currentRoom);
         Game.currentRoom = room;
         Game.insertBefore(Game.currentRoom, Game.player);
      };

      Game.player = new Classes.Player(12, 2);         
      Game.addChild(Game.player);

      Game.addChild(new Classes.HUD(Game.player));

      // Checks if any entity is still moving
      var actionCooldown = 0;
      Game.waitingOnMovement = function() {
         if (Game.player.isAnimating()) return true;
         if (Game.currentRoom.isAnimating()) return true;

         if (actionCooldown > 0) return true;

         return false;
      }

      Game.onenterframe = function() {
         if (actionCooldown > 0) actionCooldown -= 1 / 60;

         if (!Game.waitingOnMovement()) {
            if (game.input.left) {
               Game.action(-1, 0);
            }
            else if (game.input.right) {
               Game.action(1, 0);
            }
            else if (game.input.up) {
               Game.action(0, -1);
            }
            else if (game.input.down) {
               Game.action(0, 1);
            }
         }
      }

      Game.action = function(dir_x, dir_y) {
         Game.player.action(dir_x, dir_y);
         Game.currentRoom.action();

         actionCooldown = 0.3;

         if (Game.player.isDead()) {
            game.popScene();
            game.pushScene(Scenes.Death(game));
         }
      }
      
      return Game;
   };


})(window.Scenes, window.Classes);
