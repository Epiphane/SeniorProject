/*
 * Functions for preloading assets and keyboard mappings
 */

(function(window) {
   /* Holds all of our helper functions */
   var Constants = window.Constants = {};

   /* Set up key bindings for the game */
   var keys = {
      65: 'left',
      68: 'right',
      87: 'up',
      83: 'down',
      74: 'attackLeft',
      76: 'attackRight',
      73: 'attackUp',
      75: 'attackDown',
      77: 'swapItem',
      78: 'usePotion',
      32: 'select'
   };
   Constants.bindKeys = function(game) {
      // Iterate through all key-value pairs
      for (var ascii in keys) {
         game.keybind(ascii, keys[ascii]);
      };
   };

   /* Preloading assets */
   var images = [
      "map.png",
      "player.png",
      "hud.png",
      "items.png",
      "monster1.gif",
      "monster2.gif",
      "monster1slow.gif",
      "monster2slow.gif",
      "monster1poison.gif",
      "monster2poison.gif",
      "dialogue.png"
   ];

   var sounds = [
      "sword_swing.wav",
      "grunt.wav",
      "swap.wav",
      "shatter.wav",
      "select1.wav",
      "select2.wav"
   ];
   Constants.preloadAssets = function(game) {
      var assets = [];
      // Collect all assets into one array
      images.forEach(function(filename) {
         assets.push('assets/images/' + filename);
      });
      sounds.forEach(function(filename) {
         assets.push('assets/sounds/' + filename);
      });

      // Call game.preload with a variable number of arguments
      // aka game.preload(a, b, c, ...);
      game.preload.apply(game, assets);
   };
})(window);