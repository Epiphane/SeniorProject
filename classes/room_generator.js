/* 
 * The RoomGenerator class randomly assigns specified amounts  
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
(function(window) {
   var RoomGenerator = window.RoomGenerator = {};

   RoomGenerator.createRoom = function(params) {
      return this.fillRoom(new Classes['Room'](), params);
   };

   RoomGenerator.fillRoom = function(room, params) {
      var background = [];
      var foreground = [];

      // Generate basic room
      for (var r = 0; r < C.MAP_HEIGHT; r++) {
         var top_or_bottom_row = (r === 0 || r === C.MAP_HEIGHT - 1);

         var tile = C.MAP_TILES.floor;
         if (top_or_bottom_row) tile = C.MAP_TILES.wall;

         // Background (floor)
         var bg_row = [];
         bg_row.push(C.MAP_TILES.stone);
         for (var c = 1; c < C.MAP_WIDTH - 1; c ++) {
            bg_row.push(tile);
         }
         bg_row.push(C.MAP_TILES.stone);

         background.push(bg_row);

         // Foreground
         var fg_row = [];
         fg_row.push(C.MAP_TILES.empty);
         fg_row.push(top_or_bottom_row ? C.MAP_TILES.empty : C.MAP_TILES.wall_left);
         for (var a = 2; a < C.MAP_WIDTH - 2; a++) {
            fg_row.push(C.MAP_TILES.empty);
         }
         fg_row.push(top_or_bottom_row ? C.MAP_TILES.empty : C.MAP_TILES.wall_right);
         fg_row.push(C.MAP_TILES.empty);

         foreground.push(fg_row);
      }

      // Corners of the wall
      background[0][1] = C.MAP_TILES.wall_top_left_corner;
      background[0][C.MAP_WIDTH - 2] = C.MAP_TILES.wall_top_right_corner;
      background[C.MAP_HEIGHT - 1][1] = C.MAP_TILES.wall_bottom_left_corner;
      background[C.MAP_HEIGHT - 1][C.MAP_WIDTH - 2] = C.MAP_TILES.wall_bottom_right_corner;

      // Adding random fissures for spookiness
      for (var i = 1; i<C.MAP_HEIGHT-1; i++) {
         for (var j = 1; j<C.MAP_HEIGHT-1; j++) {
            if (chance.bool({likelihood:5})) {
               background[i][j] = C.MAP_TILES.fissure;
            }
         }
      }

      // Add exits
      if (room.neighbors[C.P_DIR.LEFT]) {
         background[C.MAP_HEIGHT / 2    ][0] = C.MAP_TILES.floor;
         background[C.MAP_HEIGHT / 2 - 1][0] = C.MAP_TILES.wall_bottom_right_corner;
         background[C.MAP_HEIGHT / 2 + 1][0] = C.MAP_TILES.wall_top_right_corner;
         foreground[C.MAP_HEIGHT / 2][1] = C.MAP_TILES.empty;
      }
      if (room.neighbors[C.P_DIR.RIGHT]) {
         background[C.MAP_HEIGHT / 2    ][C.MAP_WIDTH - 1] = C.MAP_TILES.floor;
         background[C.MAP_HEIGHT / 2 - 1][C.MAP_WIDTH - 1] = C.MAP_TILES.wall_bottom_left_corner;
         background[C.MAP_HEIGHT / 2 + 1][C.MAP_WIDTH - 1] = C.MAP_TILES.wall_top_left_corner;
         foreground[C.MAP_HEIGHT / 2][C.MAP_WIDTH - 2] = C.MAP_TILES.empty;
      }
      if (room.neighbors[C.P_DIR.UP]) {
         background[0][C.MAP_WIDTH / 2    ] = C.MAP_TILES.floor;
         background[0][C.MAP_WIDTH / 2 - 1] = C.MAP_TILES.wall_bottom_right_corner;
         background[0][C.MAP_WIDTH / 2 + 1] = C.MAP_TILES.wall_bottom_left_corner;
         foreground[1][C.MAP_WIDTH / 2] = C.MAP_TILES.empty;
      }
      if (room.neighbors[C.P_DIR.DOWN]) {
         background[C.MAP_HEIGHT - 1][C.MAP_WIDTH / 2    ] = C.MAP_TILES.floor;
         background[C.MAP_HEIGHT - 1][C.MAP_WIDTH / 2 - 1] = C.MAP_TILES.wall_top_right_corner;
         background[C.MAP_HEIGHT - 1][C.MAP_WIDTH / 2 + 1] = C.MAP_TILES.wall_top_left_corner;
         foreground[C.MAP_HEIGHT - 2][C.MAP_WIDTH / 2] = C.MAP_TILES.empty;
      }

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
})(window);
