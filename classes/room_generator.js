/* 
 * The RoomGenerator class randomly assigns specified amounts  
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
(function(window) {
   var RoomGenerator = window.RoomGenerator = {};

   // Populated later on down...
   var wallTiles = {};

   RoomGenerator.defaults = {};

   RoomGenerator.createRoom = function(params) {
      return this.fillRoom(new Classes['Room'](), params);
   };

   /**
    * Create a bunch'a walls dynamically
    */
   RoomGenerator.createWalls = function(floor) {
      var foreground = [];
      for (var r = 0; r < C.MAP_HEIGHT; r ++)
         foreground.push(new Array(C.MAP_WIDTH));

      function isWalkable(x, y) {
         return (floor[y] && floor[y][x] !== C.BG_TILES.floor_blocked);
      }

      function tileFor(x, y) {
         var wallTileScore = 0;
         if (!isWalkable(x - 1, y + 0)) wallTileScore += 1 << 0;
         if (!isWalkable(x + 0, y + 0)) wallTileScore += 1 << 1;
         if (!isWalkable(x + 1, y + 0)) wallTileScore += 1 << 2;
         if (!isWalkable(x - 1, y + 1)) wallTileScore += 1 << 3;
         if (!isWalkable(x + 0, y + 1)) wallTileScore += 1 << 4;
         if (!isWalkable(x + 1, y + 1)) wallTileScore += 1 << 5;
         if (!isWalkable(x - 1, y + 2)) wallTileScore += 1 << 6;
         if (!isWalkable(x + 0, y + 2)) wallTileScore += 1 << 7;
         if (!isWalkable(x + 1, y + 2)) wallTileScore += 1 << 8;

         if (!wallTiles[wallTileScore] && floor[y][x] === C.BG_TILES.floor_blocked) {
            console.log('Nothing found for this config:');
            console.log((wallTileScore & 1) ? 1 : 0, (wallTileScore & 2) ? 1 : 0, (wallTileScore & 4) ? 1 : 0)
            console.log((wallTileScore & 8) ? 1 : 0, (wallTileScore & 16) ? 1 : 0, (wallTileScore & 32) ? 1 : 0)
            console.log((wallTileScore & 64) ? 1 : 0, (wallTileScore & 128) ? 1 : 0, (wallTileScore & 256) ? 1 : 0)
         }

         return wallTiles[wallTileScore] || C.FG_TILES.empty;
      }

      // Compute tile types
      for (var y = 0; y < C.MAP_HEIGHT; y ++) {
         for (var x = 0; x < C.MAP_WIDTH; x ++) {
            foreground[y][x] = tileFor(x, y);
         }
      }      

      return foreground;
   };

   RoomGenerator.fillRoom = function(room, params) {
      // Add default parameters
      params = params || {};
      for (var prop in RoomGenerator.defaults) {
         params[prop] = params[prop] || RoomGenerator.defaults[prop];
      }

      var height_2 = Math.ceil(room.height / 2);
      var width_2  = Math.ceil(room.width / 2);

      var background = [];

      // Generate basic room (go from -width/2 to width/2 to center it)
      for (var r = -C.MAP_HEIGHT / 2; r < C.MAP_HEIGHT / 2; r++) {
         var bg_row = [];
         for (var c = -C.MAP_WIDTH / 2; c < C.MAP_WIDTH / 2; c ++) {
            // Outside the room (only applies if params.width is less than MAP_WIDTH)
            if (r < -height_2 || r >= height_2 || c < -width_2 || c >= width_2) {
               bg_row.push(C.BG_TILES.empty);
            }
            // Doorways
            else if (r <= 0 - height_2 || r === height_2 - 1 || c === -width_2 || c === width_2 - 1) {
               bg_row.push(C.BG_TILES.floor_blocked);
            }
            else {
               bg_row.push(C.BG_TILES.floor);
            }
         }
         background.push(bg_row);
      }

      var center = { x: Math.floor(C.MAP_WIDTH / 2), y: Math.floor(C.MAP_HEIGHT / 2) };
      var TOP = 0 - height_2;
      var BOT = height_2 - 1;
      var LEFT = 0 - width_2;
      var RGHT = width_2 - 1;
      function setBG(x, y, val) {
         y += center.y;
         x += center.x;
         if (background[y] && background[y][x] != undefined) {
            background[y][x] = val;
         }
      }

      // // Add exits
      if (room.neighbors[C.P_DIR.LEFT]) {
         setBG(LEFT    , 0, C.BG_TILES.floor);
         setBG(LEFT    , 1, C.BG_TILES.floor);
         setBG(LEFT - 1,-1, C.BG_TILES.floor_blocked);
         setBG(LEFT - 1, 0, C.BG_TILES.floor);
         setBG(LEFT - 1, 1, C.BG_TILES.floor);
         setBG(LEFT - 1, 2, C.BG_TILES.floor_blocked);
      }
      if (room.neighbors[C.P_DIR.RIGHT]) {
         setBG(RGHT    , 0, C.BG_TILES.floor);
         setBG(RGHT    , 1, C.BG_TILES.floor);
         setBG(RGHT + 1,-1, C.BG_TILES.floor_blocked);
         setBG(RGHT + 1, 0, C.BG_TILES.floor);
         setBG(RGHT + 1, 1, C.BG_TILES.floor);
         setBG(RGHT + 1, 2, C.BG_TILES.floor_blocked);
      }
      if (room.neighbors[C.P_DIR.UP]) {
         setBG( 0, TOP,     C.BG_TILES.floor);
         setBG( 0, TOP + 1, C.BG_TILES.floor);
         setBG(-1, TOP - 1, C.BG_TILES.floor_blocked);
         setBG( 0, TOP - 1, C.BG_TILES.floor);
         setBG( 0, TOP - 2, C.BG_TILES.floor);
         setBG( 1, TOP - 1, C.BG_TILES.floor_blocked);
      }
      if (room.neighbors[C.P_DIR.DOWN]) {
         setBG( 0, BOT,     C.BG_TILES.floor);
         setBG(-1, BOT + 1, C.BG_TILES.floor_blocked);
         setBG( 0, BOT + 1, C.BG_TILES.floor);
         setBG( 1, BOT + 1, C.BG_TILES.floor_blocked);
      }

      // Add in the walls
      foreground = RoomGenerator.createWalls(background);

      // Load the tiles
      room.tiles = background;
      room.foreground = foreground;
      room.loadData();

      this.populateRoom(room);

      return room;
   };

   RoomGenerator.addCharacter = function(room, character, x, y) {
      x += Math.floor(C.MAP_WIDTH / 2);
      y += Math.floor(C.MAP_HEIGHT / 2);

      character.position.x = x;
      character.position.y = y;
      character.snapToPosition();

      room.addCharacter(character);
   };

   RoomGenerator.addItem = function(room, item, x, y) {
      x += Math.floor(C.MAP_WIDTH / 2);
      y += Math.floor(C.MAP_HEIGHT / 2);

      room.addItemAt(item, x, y);
   };

   RoomGenerator.populateRoom = function(room) {
      // Add enemies and items to room
      this.addCharacter(room, new Classes.Slime(), 2, 3);
      this.addCharacter(room, new Classes.Bat(), 1, 2);

      this.addItem(room, new Classes.Sword(), -2, -3);
   };

   /**
    * Register all the different wall tiles
    *
    * @param config - 3x3 array with 2's signifying blocked floor
    *                 and 0's resembling open floor
    *                 1 resembles not caring about whether it's floor or not
    * @param tile - tile to put there
    */
   function registerWallTile(tile, config) {
      var wallTileScore = 0;
      var variants = [];
      for (var i = 0; i < 9; i ++) {
         if (config[i] === 2) {
            wallTileScore += 1 << i;
         }
         // 1 means it can be 2 or 0
         // Add it to variants so we can put in both options later
         else if (config[i] === 1) {
            variants.push(i);
         }
      }

      // Now we combine the variants in any order to add every possible score
      for (var variation = 0; variation < (1 << variants.length); variation ++) {
         var plusScore = 0;
         for (var i = 0; i < variants.length; i ++) {
            // If variation has a 1 at this bit, we want to use that variant as a 2
            if (variation & (1 << i)) {
               plusScore += 1 << variants[i];
            }
         }

         wallTiles[wallTileScore + plusScore] = tile;
      }
   };

   var configs = {
      wall_face_right: [
         2, 2, 0,
         1, 0, 1,
         1, 1, 1
      ],
      wall_face: [
         2, 2, 2,
         1, 0, 1,
         1, 1, 1
      ],
      wall_face_left: [
         0, 2, 2,
         0, 0, 1,
         1, 1, 1
      ],
      wall_face_end: [
         0, 2, 0,
         1, 0, 1,
         1, 1, 1
      ],
      wall_top_horiz_left: [
         0, 0, 1,
         0, 2, 2,
         0, 0, 1
      ],
      wall_top_horiz: [
         1, 0, 1,
         2, 2, 2,
         1, 0, 1
      ],
      wall_top_horiz_right: [
         1, 0, 0,
         2, 2, 0,
         1, 0, 0
      ],
      wall_top_vert_top: [
         0, 0, 0,
         0, 2, 0,
         1, 2, 1
      ],
      wall_top_vert: [
         1, 2, 1,
         1, 2, 1,
         1, 2, 1
      ],
      wall_top_vert_bottom: [
         1, 2, 1,
         1, 2, 1,
         0, 0, 0
      ],
      wall_top_top_left_corner: [
         0, 0, 0,
         0, 2, 2,
         0, 2, 0
      ],
      wall_top_top_right_corner: [
         0, 0, 0,
         2, 2, 0,
         0, 2, 0
      ],
      wall_top_bottom_left_corner: [
         0, 2, 0,
         0, 2, 2,
         0, 0, 0
      ],
      wall_top_bottom_right_corner: [
         0, 2, 0,
         2, 2, 0,
         0, 0, 0
      ]
   };

   for (var tile in configs) {
      registerWallTile(C.FG_TILES[tile], configs[tile]);
   }
})(window);
