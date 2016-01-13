/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.backgroundColor = "black";
      
      player = new Classes.Player(2, 2);
      Game.addChild(player);
      var map = new Classes.Room();
         
      Game.addChild(map);
      Game.addChild(player);      
      
      return Game;
   };
})(window.Scenes, window.Classes);
