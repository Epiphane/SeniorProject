/* 
 * The RoomGenerator class randomly assigns specified amounts  
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
(function(window) {
   // Populated later on down...
   var wallTiles = {};

   var defaults = {};
   window.RoomGenerator = Class.create(Object, {
      createRoom: function(params) {
         return this.fillRoom(new Classes['Room'](), params);
      },

      /**
       * Create a bunch'a walls dynamically
       */
      createWalls: function(floor) {
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
      },

      setTile: function(tiles, x, y, val) {
         var center = { x: Math.floor(C.MAP_WIDTH / 2), y: Math.floor(C.MAP_HEIGHT / 2) };

         y += center.y;
         x += center.x;
         if (tiles[y] && tiles[y][x] != undefined) {
            tiles[y][x] = val;
         }
      },

      createFloor: function(params) {
         var background = [];

         // Generate basic room (go from -width/2 to width/2 to center it)
         for (var r = -C.MAP_HEIGHT / 2; r < C.MAP_HEIGHT / 2; r++) {
            var bg_row = [];
            for (var c = -C.MAP_WIDTH / 2; c < C.MAP_WIDTH / 2; c ++) {
               // Outside the room (only applies if params.width is less than MAP_WIDTH)
               if (r < -params.height_2 || r >= params.height_2 || c < -params.width_2 || c >= params.width_2) {
                  bg_row.push(C.BG_TILES.empty);
               }
               // Doorways
               else if (r <= 0 - params.height_2 || r === params.height_2 - 1 || c === -params.width_2 || c === params.width_2 - 1) {
                  bg_row.push(C.BG_TILES.floor_blocked);
               }
               else {
                  bg_row.push(C.BG_TILES.floor);
               }
            }
            background.push(bg_row);
         }

         return background;
      },

      fillRoom: function(room, params) {
         // Add default parameters
         params = params || {};
         for (var prop in defaults) {
            params[prop] = params[prop] || defaults[prop];
         }

         params.height = room.height;
         params.width = room.width;
         params.height_2 = Math.ceil(params.height / 2);
         params.width_2  = Math.ceil(params.width / 2);
         params.TOP  = 0 - params.height_2;
         params.BOT  = params.height_2 - 1;
         params.LEFT = 0 - params.width_2;
         params.RGHT = params.width_2 - 1;

         // Create the floor first
         background = this.createFloor(params);

         // Add exits
         if (room.neighbors[C.P_DIR.LEFT]) {
            this.setTile(background, params.LEFT    , 0, C.BG_TILES.floor);
            this.setTile(background, params.LEFT - 1,-1, C.BG_TILES.floor_blocked);
            this.setTile(background, params.LEFT - 1, 0, C.BG_TILES.floor);
            this.setTile(background, params.LEFT - 1, 1, C.BG_TILES.floor_blocked);
         }
         if (room.neighbors[C.P_DIR.RIGHT]) {
            this.setTile(background, params.RGHT    , 0, C.BG_TILES.floor);
            this.setTile(background, params.RGHT + 1,-1, C.BG_TILES.floor_blocked);
            this.setTile(background, params.RGHT + 1, 0, C.BG_TILES.floor);
            this.setTile(background, params.RGHT + 1, 1, C.BG_TILES.floor_blocked);
         }
         if (room.neighbors[C.P_DIR.UP]) {
            this.setTile(background,  0, params.TOP,     C.BG_TILES.floor);
            this.setTile(background,  0, params.TOP + 1, C.BG_TILES.floor);
            this.setTile(background, -1, params.TOP - 1, C.BG_TILES.floor_blocked);
            this.setTile(background,  0, params.TOP - 1, C.BG_TILES.floor);
            this.setTile(background,  1, params.TOP - 1, C.BG_TILES.floor_blocked);
         }
         if (room.neighbors[C.P_DIR.DOWN]) {
            this.setTile(background,  0, params.BOT,     C.BG_TILES.floor);
            this.setTile(background, -1, params.BOT + 1, C.BG_TILES.floor_blocked);
            this.setTile(background,  0, params.BOT + 1, C.BG_TILES.floor);
            this.setTile(background,  1, params.BOT + 1, C.BG_TILES.floor_blocked);
         }

         // Add in the walls
         foreground = this.createWalls(background);

         // Load the tiles
         room.tiles = background;
         room.foreground = foreground;
         room.loadData();

         this.populateRoom(room);

         return room;
      },

      addCharacter: function(room, character, x, y) {
         x += Math.floor(C.MAP_WIDTH / 2);
         y += Math.floor(C.MAP_HEIGHT / 2);

         character.position.x = x;
         character.position.y = y;
         character.snapToPosition();

         room.addCharacter(character);
      },

      addItem: function(room, item, x, y) {
         x += Math.floor(C.MAP_WIDTH / 2);
         y += Math.floor(C.MAP_HEIGHT / 2);

         room.addItemAt(item, x, y);
      },

      populateRoom: function(room) {
         // Add enemies and items to room
         this.addCharacter(room, new Classes.Slime(), 2, 3);
         this.addCharacter(room, new Classes.Bat(), 1, 2);

         this.addItem(room, new Classes.Sword(), -2, -3);
         this.addItem(room, new Classes.Potion(), -2, 2);
      }
   });

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
         0, 2, 1
      ],
      wall_top_top_right_corner: [
         0, 0, 0,
         2, 2, 0,
         1, 2, 0
      ],
      wall_top_bottom_left_corner: [
         0, 2, 1,
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
