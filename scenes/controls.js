/*
 * The controls state of the game.
 */

/*
 * So this is where Enchant gets weird. Refer to utils/singleton.js to see more...
 */
Scenes.Controls = Singletonify(function(game) {
   var Controls = new Scene();
   Controls.backgroundColor = "black";
   
   var labels = [
      Utils.createLabel('CONTROLS', 50, 50, { font: '28px sans-serif' }),
      Utils.createLabel('W,A,S,D - Move/Attack<br> <br>' +
                        'E - Interact<br> <br>' +
                        'M - Mute<br> <br>' +
                        'F - Use potion<br>', 50, 110, { font: '14px sans-serif' }),
      Utils.createLabel('Press space to return to menu', 50, C.GAME_SIZE - 50, { font: '14px sans-serif' }),
   ];

   labels.forEach(function(label) {
      Controls.addChild(label);
   });
   
   Controls.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = new buzz.sound('assets/sounds/select2.wav');
         newSound.play();

         // Return to title screen
         game.popScene();
      }
   });

   return Controls;
});
