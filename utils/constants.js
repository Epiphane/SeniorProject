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

   Constants.ROOM_TYPES = Enum([
      'random', 'store', 'treasure', 'weapon', 'armor', 'combat', 'npc', 'boss', 'puzzle', 'sign'
   ]);

   var spriteToTile = function(row, col) {
      return row * 29 + col;
   };

   Constants.BG_TILES = Enum({
      empty: -1,
      floor: spriteToTile(12, 18),
      floor_blocked: spriteToTile(12, 16),
      wall: spriteToTile(12, 17),
      stairs: spriteToTile(12, 20)
   });

   Constants.FG_TILES = Enum({
      empty: -1,
      wall_face_left:               spriteToTile(4, 8),
      wall_face:                    spriteToTile(4, 9),
      wall_face_right:              spriteToTile(4, 10),
      wall_face_end:                spriteToTile(4, 11),
      wall_top_horiz_left:          spriteToTile(0, 9),
      wall_top_horiz:               spriteToTile(0, 10),
      wall_top_horiz_right:         spriteToTile(0, 11),
      wall_top_vert_top:            spriteToTile(0, 8),
      wall_top_vert:                spriteToTile(1, 11),
      wall_top_vert_bottom:         spriteToTile(1, 8),
      wall_top_top_left_corner:     spriteToTile(0, 12),
      wall_top_top_right_corner:    spriteToTile(0, 13),
      wall_top_bottom_left_corner:  spriteToTile(1, 12),
      wall_top_bottom_right_corner: spriteToTile(1, 13),
   });

   Constants.FG_BLOCKS = [
      spriteToTile(5, 5),
      spriteToTile(5, 6),
      spriteToTile(5, 7),
      spriteToTile(6, 5),
      spriteToTile(6, 6),
      spriteToTile(6, 7),
   ];

   Constants.Items = Enum([
      'empty', 'potion', 'dagger', 'chest_closed', 'chest_open', 'key_normal',
      'key_special', 'orb', 'sword', 'sword_ice', 'sword_earth',
      'sword_light', 'sword_fire', 'sword_dark', 'sword_what',
      'shield_1', 'shield_2', 'shield_3', 'shield_4', 'shield_5', 'shield_6',
      'shield_7','sign'
   ]);

   Constants.Weapons = Object.freeze(['Sword', 'IceSword', 'EarthSword', 'LightSword', 'FireSword', 'DarkSword']);
   Constants.Armors = Object.freeze(['Shield', 'Buckler', 'Wooden War Door', 'Iron Buckler', 'Steel War Door', 'Knights Shield', 'Legendary Shield']);

   Constants.GAME_SIZE = 640;
   Constants.MAP_SIZE = C.GAME_SIZE / C.TILE_SIZE;

   /* HUD constants */
   Constants.HEART_PADDING = 35;
   Constants.HUD_TILESIZE = 50;
   Constants.HUD_PADDING = 38;
   Constants.HUD = Enum(['heart_full', 'heart_half', 'heart_empty', 'frame']);

   /* Set up key bindings for the game */
   var keys = {
      65: 'left',
      68: 'right',
      87: 'up',
      83: 'down',
      69: 'interact',
      // 74: 'attackLeft',
      // 76: 'attackRight',
      // 73: 'attackUp',
      // 75: 'attackDown',
      77: 'mute',
      70: 'usePotion',
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
      "map2.png",
      "player.png",
      "hud.png",
      "items.png",
      "boss1.png",
      "final_boss.png",
      "monster1.gif",
      "monster2.gif",
      "monster1slow.gif",
      "monster2slow.gif",
      "monster1poison.gif",
      "monster2poison.gif",
      "dialog.png",
      "muted.png",
      "unmuted.png",
      "boulder.png",
      "door.png",
      "puzzle_initial.png",
      "u did it.png",
      "U MESSED UP LOL.png",
      "textbox.png",
      "portrait.png",
      "sign_portrait.png",
      "sign.png",
      "npc1.png",
      "npc2.png",
      "portrait2.png",
      "npc3.png",
      "portrait3.png"
   ];
   
   Constants.preloadAssets = function(game) {
      var assets = [];
      // Collect all assets into one array
      images.forEach(function(filename) {
         assets.push('assets/images/' + filename);
      });

      // Call game.preload with a variable number of arguments
      // aka game.preload(a, b, c, ...);
      game.preload.apply(game, assets);
   };

   // TIL: Object.freeze makes it impossible to change this object later
   Object.freeze(Constants);
})(window);