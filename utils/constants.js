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

   Constants.ROOM_TYPES = Enum([
      'store', 'treasure', 'enemy', 'npc', 'boss'
   ]);

   spriteToTile = function(row, col) {
      return row * 30 + col;
   };

   Constants.MAP_TILES = Enum({
      floor: spriteToTile(7,9),
      wall_top_left_corner: spriteToTile(0, 17),
      wall: spriteToTile(0, 18),
      wall_top_right_corner: spriteToTile(0, 19),
      wall_bottom_left_corner: spriteToTile(2, 17),
      wall_bottom_right_corner: spriteToTile(2, 19),
      exit: spriteToTile(11,22),
      wall_left: spriteToTile(1,17),
      wall_right: spriteToTile(1,19),
   });

   Constants.Items = Enum([
      'empty', 'potion', 'dagger', 'chest_closed', 'chest_open', 'key_normal',
      'key_special', 'orb', 'sword', 'sword_ice', 'sword_earth',
      'sword_light', 'sword_fire', 'sword_dark', 'sword_what',
      'shield_1', 'shielf_2', 'shield_3', 'shield_4', 'shield_5', 'shield_6',
      'shield_7'
   ]);

   Constants.GAME_WIDTH = 640;
   Constants.GAME_HEIGHT = 640;
   Constants.MAP_WIDTH = C.GAME_WIDTH / C.TILE_SIZE;
   Constants.MAP_HEIGHT = C.GAME_HEIGHT / C.TILE_SIZE;

   /* HUD constants */
   Constants.HEART_PADDING = 35;
   Constants.HUD_TILESIZE = 50;
   Constants.HUD = Enum(['heart_full', 'heart_half', 'heart_empty', 'frame']);

   /* Set up key bindings for the game */
   var keys = {
      65: 'left',
      68: 'right',
      87: 'up',
      83: 'down',
      // 74: 'attackLeft',
      // 76: 'attackRight',
      // 73: 'attackUp',
      // 75: 'attackDown',
      // 77: 'swapItem',
      // 78: 'usePotion',
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

   // TIL: Object.freeze makes it impossible to change this object later
   Object.freeze(Constants);
})(window);