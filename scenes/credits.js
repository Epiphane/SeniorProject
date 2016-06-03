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
      Utils.createLabel('CREDITS', 50, 50, { font: '16px Pokemon GB', width:100 }),
      Utils.createLabel('The Cycle, by:<br> <br>Max Linsenbard<br>Thomas Steinke<br>Elliot Fiske<br> <br>' +
                        'Initial assets by Cameron Thibodeaux.<br> <br>', 50, 300, { font: '11px Pokemon GB', width:600}),
      Utils.createLabel('Press space to return to menu', 50, C.GAME_SIZE-50, { font: '12px Pokemon GB', width:600 }),
   ];

   labels.forEach(function(label) {
      Credits.addChild(label);
   });
   
   Credits.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = new buzz.sound('assets/sounds/select2.wav');
         newSound.play();

         // Return to title screen
         game.popScene();
      }
   });

   return Credits;
});