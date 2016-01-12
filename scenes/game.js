/*
 * The Game state! Yay!
 */

(function(Scenes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.backgroundColor = "black";
      
      var labels = [
         Utils.createLabel('This is the game', 50, 50, { font: '28px sans-serif' }),
      ];

      labels.forEach(function(label) {
         Game.addChild(label);
      });
      
      Game.addEventListener(Event.INPUT_START, function() {
         if (game.input.select) {
            var newSound = game.assets['assets/sounds/select2.wav'].clone();
            newSound.play();

            // Return to title screen
            game.popScene();
         }
      });

      return Game;
   };
})(window.Scenes);
