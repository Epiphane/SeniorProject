/*
 * The controls state of the game.
 */

/*
 * So this is where Enchant gets weird. Refer to title.js to see more...
 */
(function(Scenes) {
   var Controls = null; // This is the singleton instance

   Scenes.Controls = function(game) {
      // Return Controls screen if it exists
      if (Controls) return Controls;

      Controls = new Scene();
      Controls.backgroundColor = "black";
      
      var labels = [
         Utils.createLabel('CONTROLS', 50, 50, { font: '28px sans-serif' }),
         Utils.createLabel('W,A,S,D - Move/Attack<br> <br>' +
                           'N - Use health potion<br> <br>' +
                           'M - Swap item, drop or pick up pearl<br> <br>' +
                           'Space - Unlock chest', 50, 110, { font: '14px sans-serif' }),
         Utils.createLabel('Press space to return to menu', 50, GAME_HEIGHT - 50, { font: '14px sans-serif' }),
      ];

      labels.forEach(function(label) {
         Controls.addChild(label);
      });
      
      Controls.addEventListener(Event.INPUT_START, function() {
         if (game.input.select) {
            var newSound = game.assets['assets/sounds/select2.wav'].clone();
            newSound.play();

            // Return to title screen
            game.popScene();
         }
      });

      return Controls;
   };
})(window.Scenes);
