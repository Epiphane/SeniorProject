/*
 * The title state of the game.
 */

/*
 * So this is where Enchant gets weird. Refer to utils/singleton.js to see more...
 */
Scenes.Title = Singletonify(function(game) {
   var Title = new Scene();
   Title.backgroundColor = 'black';
   Title.bgm = game.assets["assets/sounds/menu.mp3"].clone();

   // Main Menu Labels
   var title        = Utils.createLabel('PEARL OF THE WORLD', 0, 150, { font: '32px sans-serif', align: 'center' });
   var instructions = Utils.createLabel('Up/Down to navigate, Space to select', 20, C.GAME_HEIGHT - 50, { font: '12px sans-serif' });
   Title.addChild(title);
   Title.addChild(instructions);
   Title.bgm.play();

   // Menu options
   var opts = { font: '14px sans-serif', color: 'white', align: 'center' };
   var selection = 0;
   var options = [
      { label: Utils.createLabel('New Game', 0, 240, opts), action: Scenes.Game },
      { label: Utils.createLabel('Controls', 0, 270, opts), action: Scenes.Controls },
      { label: Utils.createLabel('Credits', 0, 300, opts), action: Scenes.Credits },
   ];

   options.forEach(function(option) {
      Title.addChild(option.label);
   });

   function moveCursor(dy) {
      options[selection].label.color = 'white' // Deselect current option
      
      selection += dy;
      if (selection < 0) selection += options.length;
      if (selection >= options.length) selection -= options.length;

      options[selection].label.color = 'red' // Select new option
   }

   moveCursor(0); // Select "New Game" by default

   // Set up key listeners
   Title.addEventListener(enchant.Event.INPUT_START, function() {
      if (game.input.up || game.input.down) {
         // Move cursor up or down
         moveCursor(game.input.up ? -1 : 1);

         // Play annoying sound
         newSound = game.assets['assets/sounds/select1.wav'].clone();
         newSound.play();
      }
      else if (game.input.select) {
         // Call the "action" callback
         var result = options[selection].action(game);

         if (result instanceof Scene) {
            if (selection === 0) {
               Title.bgm.stop();
            }
            game.pushScene(result);
         }
      }
   });

   return Title;
});
