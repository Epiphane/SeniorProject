/*
 * The credits state of the game.
 */

/*
 * So this is where Enchant gets weird. Refer to utils/singleton.js to see more...
 */
Scenes.Credits = Singletonify(function(game) {
   var Credits = new Scene();
   Credits.backgroundColor = "black";
   
   var labels = [
      Utils.createLabel('CREDITS', 50, 50, { font: '28px sans-serif' }),
      Utils.createLabel('Inital Code, sprites, and sfx by Cameron Thibodeaux, 2014<br> <br>' +
                        'Senior Project by Max Linsenbard, Thomas Steinke, and Elliot Fiske.', 50, 110, { font: '14px sans-serif' }),
      Utils.createLabel('Press space to return to menu', 50, C.GAME_HEIGHT - 50, { font: '14px sans-serif' }),
   ];

   labels.forEach(function(label) {
      Credits.addChild(label);
   });
   
   Credits.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = game.assets['assets/sounds/select2.wav'].clone();
         newSound.play();

         // Return to title screen
         game.popScene();
      }
   });

   return Credits;
});