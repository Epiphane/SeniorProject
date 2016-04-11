/*
 * The credits state of the game.
 */

/*
 * So this is where Enchant gets weird. Refer to utils/singleton.js to see more...
 */
Scenes.Stats = Singletonify(function(game) {
   var Stats = new Scene();
   Stats.backgroundColor = "black";
   
   var labels = [
      Utils.createLabel('CREDITS', 50, 50, { font: '16px Pokemon GB', width:100 }),
      Utils.createLabel('Inital Code, sprites, and sfx by Cameron Thibodeaux, 2014<br> <br>' +
                        'Senior Project by Max Linsenbard, Thomas Steinke, and Elliot Fiske.', 50, 300, { font: '10px Pokemon GB', width:600}),
      Utils.createLabel('Press space to return to menu', 50, C.GAME_SIZE-50, { font: '12px Pokemon GB', width:600 }),
   ];

   labels.forEach(function(label) {
      Stats.addChild(label);
   });
   
   Stats.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = new buzz.sound('assets/sounds/select2.wav');
         newSound.play();

         // Return to title screen
         game.popScene();
      }
   });

   return Stats;
});