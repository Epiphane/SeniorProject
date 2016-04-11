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
      Utils.createLabel('Statistics', 50, 50, { font: '16px Pokemon GB', width:400 }),
      Utils.createLabel('Press space to go back', 50, C.GAME_SIZE-50, { font: '12px Pokemon GB', width:600 }),
   ];

   labels.forEach(function(label) {
      Stats.addChild(label);
   });
   
   Stats.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = new buzz.sound('assets/sounds/select2.wav');
         newSound.play();

         // Return to previous screen
         game.popScene();
      }
   });

   return Stats;
});