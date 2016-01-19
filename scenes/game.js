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

      Game.addChild(new Classes.HUD(Game.player));

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
