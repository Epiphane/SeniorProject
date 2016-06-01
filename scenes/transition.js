/*
 * The credits state of the game.
 */

Scenes.Transition = function(level) {
   var Transition = new Scene();
   Transition.backgroundColor = "black";
   
   // Initialize typical labels
   var labels = [
      Utils.createLabel('You finished level ' + level + '!', 50, 50, { font: '16px Pokemon GB', width:400 }),
      Utils.createLabel('The walls rumble and you feel strange.', 50, 80, { font: '12px Pokemon GB', width:600 }),
      Utils.createLabel('...The dungeon is evolving.', 50, 110, { font: '12px Pokemon GB', width:600 }),
      Utils.createLabel('Press space to descend', 50, C.GAME_SIZE-50, { font: '12px Pokemon GB', width:600 })
   ];

   labels.forEach(function(label) {
      Transition.addChild(label);
   });

   // Tell player about the "changes"
   var nChanges = 0;
   function addChange(description) {
      Transition.addChild(Utils.createLabel(description, 50, 200 + (nChanges++) * 25, { font: '12px Pokemon GB', width:600 }))
   }

   while (Scenes.Transition.recentChanges.length > 0) {
      addChange(Scenes.Transition.recentChanges.shift());
   }

   Transition.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = new buzz.sound('assets/sounds/select2.wav');
         newSound.play();

         // Return to previous screen
         game.popScene();
      }
   });

   return Transition;
};

Scenes.Transition.recentChanges = [];
Scenes.Transition.logChange = function(description) {
   Scenes.Transition.recentChanges.push(description);
}

Scenes.Transition.clearChanges = function() {
   Scenes.Transition.recentChanges = [];
}