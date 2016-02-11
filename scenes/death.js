/*
 * The ur dead state of the game.
 */

/*
 * So this is where Enchant gets weird. Refer to utils/singleton.js to see more...
 */
Scenes.Death = Singletonify(function(game) {
   var Death = new Scene();
   Death.backgroundColor = "black";
   Death.bgm = new buzz.sound("assets/sounds/gameover.mp3");
   Death.bgm.play();
   
   var labels = [
      Utils.createLabel('YOU HAVE DIED', 50, 50, { font: '28px serif' }),
      Utils.createLabel('Press space to return to menu', 50, C.GAME_HEIGHT - 50, { font: '14px sans-serif' }),
   ];

   labels.forEach(function(label) {
      Death.addChild(label);
   });
   
   Death.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = game.assets['assets/sounds/select2.wav'].clone();
         newSound.play();

         // Return to title screen
         game.popScene();
         Death.bgm.stop();
      }
   });

   return Death;
});