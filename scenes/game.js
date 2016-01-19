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
      
      return Game;
   };
})(window.Scenes, window.Classes);
