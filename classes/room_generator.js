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
   var wallTiles = window.tiles = {};

   RoomGenerator.defaults = {
      width: C.MAP_WIDTH - 4,
      height: C.MAP_HEIGHT - 4
   };

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

         return wallTiles[wallTileScore] || C.FG_TILES.empty;
      }

      window.g = function() { return tileFor.apply(this, arguments); }

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

      params.height2 = Math.ceil(params.height / 2);
      params.width2  = Math.ceil(params.width / 2);

      var background = [];
      var foreground = [];

      // Generate basic room (go from -width/2 to width/2 to center it)
      for (var r = -C.MAP_HEIGHT / 2; r < C.MAP_HEIGHT / 2; r++) {
         // Background (floor)
         var bg_row = [];
         for (var c = -C.MAP_WIDTH / 2; c < C.MAP_WIDTH / 2; c ++) {
            // Outside the room (only applies if params.width is less than MAP_WIDTH)
            if (r < -params.height2 || r >= params.height2 || c < -params.width2 || c >= params.width2) {
               bg_row.push(C.BG_TILES.empty);
            }
            // Doorways
            else if (r <= 0 - params.height2 || r === params.height2 - 1 || c === -params.width2 || c === params.width2 - 1) {
               bg_row.push(C.BG_TILES.floor_blocked);
            }
            else {
               bg_row.push(C.BG_TILES.floor);
            }
         }
         background.push(bg_row);

         // Foreground (walls)
         var fg_row = [];
         for (var c = 1; c < C.MAP_WIDTH - 1; c ++) {
            fg_row.push(C.FG_TILES.empty);
         }
         foreground.push(fg_row);
      }

      var center = { x: Math.floor(C.MAP_WIDTH / 2), y: Math.floor(C.MAP_HEIGHT / 2) };
      var TOP = 0 - params.height2;
      var BOT = params.height2 - 1;
      var LEFT = 0 - params.width2;
      var RGHT = params.width2 - 1;
      function setTile(tileset, x, y, val) {
         y += center.y;
         x += center.x;
         if (tileset[y] && tileset[y][x] != undefined) {
            tileset[y][x] = val;
         }
      }
      function setFG(x, y, val) { setTile(foreground, x, y, val); }
      function setBG(x, y, val) { setTile(background, x, y, val); }

      // Create the actual wall!
      // for (var x = LEFT; x <= RGHT; x ++) {
      //    setFG(x, TOP,     C.FG_TILES.wall_top_horiz);
      //    setFG(x, TOP + 1, C.FG_TILES.wall_face);
      //    setFG(x, BOT,     C.FG_TILES.wall_top_horiz);
      //    setFG(x, BOT + 1, C.FG_TILES.wall_face);
      // }
      // for (var y = TOP; y <= BOT; y ++) {
      //    setFG(LEFT, y, C.FG_TILES.wall_top_vert);
      //    setFG(RGHT, y, C.FG_TILES.wall_top_vert);
      // }

      // // Corners of the wall
      // setFG(LEFT, TOP, C.FG_TILES.wall_top_top_left_corner);
      // setFG(LEFT, BOT, C.FG_TILES.wall_top_bottom_left_corner);
      // setFG(RGHT, TOP, C.FG_TILES.wall_top_top_right_corner);
      // setFG(RGHT, BOT, C.FG_TILES.wall_top_bottom_right_corner);

      // // Add exits
      if (room.neighbors[C.P_DIR.LEFT]) {
         setBG(LEFT, 0, C.BG_TILES.floor);
         setBG(LEFT, 1, C.BG_TILES.floor);
         // setFG(LEFT,-2, C.FG_TILES.wall_top_vert_bottom);
         // setFG(LEFT,-1, C.FG_TILES.wall_face_end);
         // setFG(LEFT, 0, C.FG_TILES.empty);
         // setFG(LEFT, 1, C.FG_TILES.wall_top_vert_top);
      }
      if (room.neighbors[C.P_DIR.RIGHT]) {
         setBG(RGHT, 0, C.BG_TILES.floor);
         setBG(RGHT, 1, C.BG_TILES.floor);
         // setFG(RGHT,-2, C.FG_TILES.wall_top_vert_bottom);
         // setFG(RGHT,-1, C.FG_TILES.wall_face_end);
         // setFG(RGHT, 0, C.FG_TILES.empty);
         // setFG(RGHT, 1, C.FG_TILES.wall_top_vert_top);
      }
      if (room.neighbors[C.P_DIR.UP]) {
         setBG( 0, TOP, C.BG_TILES.floor);
         setBG( 0, TOP + 1, C.BG_TILES.floor);

         // setFG(-1, TOP, C.FG_TILES.wall_top_horiz_right);
         // setFG( 1, TOP, C.FG_TILES.wall_top_horiz_left);
         // setFG( 0, TOP, C.FG_TILES.empty);
         // setFG(-1, TOP + 1, C.FG_TILES.wall_face_right);
         // setFG( 0, TOP + 1, C.FG_TILES.empty);
         // setFG( 1, TOP + 1, C.FG_TILES.wall_face_left);
      }
      if (room.neighbors[C.P_DIR.DOWN]) {
         setBG( 0, BOT, C.BG_TILES.floor);
         // setBG( 0, BOT + 1, C.BG_TILES.floor);
         
         // setFG(-1, BOT, C.FG_TILES.wall_top_horiz_right);
         // setFG( 1, BOT, C.FG_TILES.wall_top_horiz_left);
         // setFG( 0, BOT, C.FG_TILES.empty);
         // setFG(-1, BOT + 1, C.FG_TILES.wall_face_right);
         // setFG( 0, BOT + 1, C.FG_TILES.empty);
         // setFG( 1, BOT + 1, C.FG_TILES.wall_face_left);
      }

      // Add in the walls
      foreground = RoomGenerator.createWalls(background);

      // Load the tiles
      room.tiles = background;
      room.foreground = foreground;
      room.loadData();

      // Add enemies and items to room
      room.addCharacter(new Classes.Slime(15, 15));
      room.addCharacter(new Classes.Bat(17, 15));

      room.addItemAt(new Classes.Sword(), 4, 6);

      return room;
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
         0, 0, 0,
         0, 0, 0
      ],
      wall_face: [
         2, 2, 2,
         1, 0, 1,
         1, 1, 1
      ],
      wall_face_left: [
         0, 2, 2,
         0, 0, 0,
         0, 0, 0
      ],
      wall_face_end: [
         0, 2, 0,
         0, 0, 0,
         0, 0, 0
      ],
      wall_top_horiz_left: [
         0, 0, 0,
         0, 2, 2,
         0, 0, 0
      ],
      wall_top_horiz: [
         1, 0, 1,
         2, 2, 2,
         1, 0, 1
      ],
      wall_top_horiz_right: [
         0, 0, 0,
         2, 2, 0,
         0, 0, 0
      ],
      wall_top_vert_top: [
         0, 0, 0,
         0, 2, 0,
         1, 2, 1
      ],
      wall_top_vert: [
         1, 2, 1,
         0, 2, 0,
         1, 2, 1
      ],
      wall_top_vert_bottom: [
         0, 2, 0,
         0, 2, 0,
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
