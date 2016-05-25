/*
 * The credits state of the game.
 */

Scenes.BetweenLevels = function() {
   var BetweenLevels = new Scene();
   BetweenLevels.backgroundColor = "black";
   BetweenLevels.stats = true;
   
   // Initialize exit preferences
   BetweenLevels.addChild(Utils.createLabel('Exit preference: ', 100, 120, {width: 600}));
   pieChart(100, 150, 100, RoomFirstExitPreference.values({
      except: ['Return']
   })).forEach(function(child) {
      BetweenLevels.addChild(child);
   });

   // Initialize exit preferences
   BetweenLevels.addChild(Utils.createLabel('Do you fight bats? ', 100, 320, {width: 600}));
   pieChart(100, 350, 100, Classes.Bat.prototype.Engaged.values()).forEach(function(child) {
      BetweenLevels.addChild(child);
   });
   BetweenLevels.addChild(Utils.createLabel('Do you fight slimes? ', 300, 320, {width: 600}));
   pieChart(300, 350, 100, Classes.Slime.prototype.Engaged.values()).forEach(function(child) {
      BetweenLevels.addChild(child);
   });

   // Initialize typical labels
   var labels = [
      Utils.createLabel('Statistics', 50, 50, { font: '16px Pokemon GB', width:400 }),
      Utils.createLabel('Press space to go back', 50, C.GAME_SIZE-50, { font: '12px Pokemon GB', width:600 })
   ];

   labels.forEach(function(label) {
      BetweenLevels.addChild(label);
   });
   
   BetweenLevels.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = new buzz.sound('assets/sounds/select2.wav');
         newSound.play();

         // Return to previous screen
         game.popScene();
      }
   });

   return Stats;
};