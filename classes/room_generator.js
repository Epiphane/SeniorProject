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
         // Background (floor)
         var bg_row = [];
         for (var c = 0; c < C.MAP_WIDTH; c ++) {
            if (r <= 1 || r === C.MAP_HEIGHT - 1 ||
                c === 0 || c === C.MAP_WIDTH - 1)
               bg_row.push(C.BG_TILES.floor_blocked);
            else
               bg_row.push(C.BG_TILES.floor);
         }
         background.push(bg_row);

         // Foreground (walls)
         var fg_row = [];
         for (var c = 1; c < C.MAP_WIDTH - 1; c ++) {
            fg_row.push(C.MAP_TILES.empty);
         }
         foreground.push(fg_row);
      }

      // Create the actual wall!
      for (var c = 1; c < C.MAP_WIDTH - 1; c ++) {
         foreground[0][c] = C.FG_TILES.wall_top_horiz;
         foreground[1][c] = C.FG_TILES.wall_face;
         foreground[C.MAP_HEIGHT - 1][c] = C.FG_TILES.wall_top_horiz;
      }
      for (var r = 1; r < C.MAP_HEIGHT - 1; r ++) {
         foreground[r][0] = C.FG_TILES.wall_top_vert;
         foreground[r][C.MAP_WIDTH - 1] = C.FG_TILES.wall_top_vert;
      }

      // Corners of the wall
      foreground[0][0] = C.FG_TILES.wall_top_top_left_corner;
      foreground[0][C.MAP_WIDTH - 1] = C.FG_TILES.wall_top_top_right_corner;
      foreground[C.MAP_HEIGHT - 1][0] = C.FG_TILES.wall_top_bottom_left_corner;
      foreground[C.MAP_HEIGHT - 1][C.MAP_WIDTH - 1] = C.FG_TILES.wall_top_bottom_right_corner;

      // Add exits
      var exit_y = Math.floor(C.MAP_HEIGHT / 2) - 1;
      var exit_x = Math.floor(C.MAP_WIDTH / 2);
      if (room.neighbors[C.P_DIR.LEFT]) {
         background[exit_y][0] = C.BG_TILES.floor;
         foreground[exit_y - 2][0] = C.FG_TILES.wall_top_vert_bottom;
         foreground[exit_y - 1][0] = C.FG_TILES.wall_face_end;
         foreground[exit_y + 1][0] = C.FG_TILES.wall_top_vert_top;
         foreground[exit_y][0] = C.FG_TILES.empty;
      }
      if (room.neighbors[C.P_DIR.RIGHT]) {
         background[exit_y][C.MAP_WIDTH - 1] = C.BG_TILES.floor;
         foreground[exit_y - 2][C.MAP_WIDTH - 1] = C.FG_TILES.wall_top_vert_bottom;
         foreground[exit_y - 1][C.MAP_WIDTH - 1] = C.FG_TILES.wall_face_end;
         foreground[exit_y + 1][C.MAP_WIDTH - 1] = C.FG_TILES.wall_top_vert_top;
         foreground[exit_y][C.MAP_WIDTH - 1] = C.FG_TILES.empty;
      }
      if (room.neighbors[C.P_DIR.UP]) {
         background[0][exit_x] = C.BG_TILES.floor;
         background[1][exit_x] = C.BG_TILES.floor;
         foreground[0][exit_x] = C.FG_TILES.empty;
         foreground[0][exit_x - 1] = C.FG_TILES.wall_top_horiz_right;
         foreground[0][exit_x + 1] = C.FG_TILES.wall_top_horiz_left;
         foreground[1][exit_x] = C.FG_TILES.empty;
         foreground[1][exit_x - 1] = C.FG_TILES.wall_face_right;
         foreground[1][exit_x + 1] = C.FG_TILES.wall_face_left;
      }
      if (room.neighbors[C.P_DIR.DOWN]) {
         background[C.MAP_HEIGHT - 1][exit_x] = C.BG_TILES.floor;
         foreground[C.MAP_HEIGHT - 1][exit_x] = C.FG_TILES.empty;
         foreground[C.MAP_HEIGHT - 1][exit_x - 1] = C.FG_TILES.wall_top_horiz_right;
         foreground[C.MAP_HEIGHT - 1][exit_x + 1] = C.FG_TILES.wall_top_horiz_left;
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
