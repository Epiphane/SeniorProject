/*
 * Functions for preloading assets and keyboard mappings
 */

(function(window) {
   /* Holds all of our helper functions */
   var Constants = window.Constants = window.C = {};

   /* Game constants */
   Constants.P_DIR = Enum('DOWN', 'LEFT', 'RIGHT', 'UP');
   Constants.P_WALK_ANIM_LEN = 9;
   
   Constants.TILE_SIZE = 32;
   Constants.TILES = Enum([
      'floor', 'wall', 'wall2', 'empty', 'stair_down', 'stair_up',
      'stair_wall', 'portal', 'floor2', 'floor3', 'floor4', 'floor5',
      'glow_yellow', 'fissure', 'glow_green', 'glow_yellow2'
   ]);

   Constants.GAME_WIDTH = 640;
   Constants.GAME_HEIGHT = 640;
   Constants.MAP_WIDTH = C.GAME_WIDTH / C.TILE_SIZE;
   Constants.MAP_HEIGHT = C.GAME_HEIGHT / C.TILE_SIZE;

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

   /* Enemy enum and all the assets that correspond to the enum. */
   Constants.enemyType = Enum("slime", "bat");

   // TIL: Object.freeze makes it impossible to change this object later
   Object.freeze(Constants);
})(window);