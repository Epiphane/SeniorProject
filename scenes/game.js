/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.backgroundColor = "black";
      
      var RoomGen = new Classes.RoomGenerator();
      Game.currentRoom = RoomGen.getNewRoom('enemy', 1);
      
      Game.player = new Classes.Player(2, 2);
         
      Game.addChild(Game.currentRoom);
      Game.addChild(Game.player);

      Game.addChild(new Classes.HUD(Game.player));

      // Checks if any entity is still moving
      var actionCooldown = 0;
      Game.waitingOnMovement = function() {
         if (Game.player.isMoving()) return true;
         if (Game.currentRoom.isAnimating()) return true;

         if (actionCooldown > 0) return true;

         return false;
      }

      Game.onenterframe = function() {
         if (actionCooldown > 0) actionCooldown -= 1 / 60;

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
         Game.currentRoom.action();

         actionCooldown = 0.3;
      }
      
      return Game;
   };


})(window.Scenes, window.Classes);
