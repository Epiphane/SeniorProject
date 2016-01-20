/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      var RoomGen = new Classes.RoomGenerator();
      Game.backgroundColor = "black";
      
      Game.player = new Classes.Player(2, 2);
      Game.currentRoom = RoomGen.getNewRoom('enemy', 1);
         
      Game.addChild(Game.currentRoom);
      Game.addChild(Game.player);

      Game.onenterframe = function() {
         if (Game.player.waiting()) {
            if (game.input.left) {
               Game.player.action(C.P_DIR.LEFT);
            }
            else if (game.input.right) {
               Game.player.action(C.P_DIR.RIGHT);
            }
            else if (game.input.up) {
               Game.player.action(C.P_DIR.UP);
            }
            else if (game.input.down) {
               Game.player.action(C.P_DIR.DOWN);
            }
         }
      }
      
      return Game;
   };
})(window.Scenes, window.Classes);
