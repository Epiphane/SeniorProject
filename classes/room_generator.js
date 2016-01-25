/* 
 * The RoomGenerator class randomly assigns specified amounts  
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
(function(window) {
   var RoomGenerator = window.RoomGenerator = {};

   RoomGenerator.defaults = {
      width: C.MAP_WIDTH - 4,
      height: C.MAP_HEIGHT - 4
   };

   RoomGenerator.createRoom = function(params) {
      return this.fillRoom(new Classes['Room'](), params);
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
            else if (r <= 1 - params.height2 || r === params.height2 - 1 || c === -params.width2 || c === params.width2 - 1) {
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
            fg_row.push(C.MAP_TILES.empty);
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
      for (var x = LEFT; x <= RGHT; x ++) {
         setFG(x, TOP,     C.FG_TILES.wall_top_horiz);
         setFG(x, TOP + 1, C.FG_TILES.wall_face);
         setFG(x, BOT,     C.FG_TILES.wall_top_horiz);
         setFG(x, BOT + 1, C.FG_TILES.wall_face);
      }
      for (var y = TOP; y <= BOT; y ++) {
         setFG(LEFT, y, C.FG_TILES.wall_top_vert);
         setFG(RGHT, y, C.FG_TILES.wall_top_vert);
      }

      // // Corners of the wall
      setFG(LEFT, TOP, C.FG_TILES.wall_top_top_left_corner);
      setFG(LEFT, BOT, C.FG_TILES.wall_top_bottom_left_corner);
      setFG(RGHT, TOP, C.FG_TILES.wall_top_top_right_corner);
      setFG(RGHT, BOT, C.FG_TILES.wall_top_bottom_right_corner);

      // // Add exits
      if (room.neighbors[C.P_DIR.LEFT]) {
         setBG(LEFT, 0, C.BG_TILES.floor);
         setFG(LEFT,-2, C.FG_TILES.wall_top_vert_bottom);
         setFG(LEFT,-1, C.FG_TILES.wall_face_end);
         setFG(LEFT, 0, C.FG_TILES.empty);
         setFG(LEFT, 1, C.FG_TILES.wall_top_vert_top);
      }
      if (room.neighbors[C.P_DIR.RIGHT]) {
         setBG(RGHT, 0, C.BG_TILES.floor);
         setFG(RGHT,-2, C.FG_TILES.wall_top_vert_bottom);
         setFG(RGHT,-1, C.FG_TILES.wall_face_end);
         setFG(RGHT, 0, C.FG_TILES.empty);
         setFG(RGHT, 1, C.FG_TILES.wall_top_vert_top);
      }
      if (room.neighbors[C.P_DIR.UP]) {
         setBG( 0, TOP, C.BG_TILES.floor);
         setBG( 0, TOP + 1, C.BG_TILES.floor);

         setFG(-1, TOP, C.FG_TILES.wall_top_horiz_right);
         setFG( 1, TOP, C.FG_TILES.wall_top_horiz_left);
         setFG( 0, TOP, C.FG_TILES.empty);
         setFG(-1, TOP + 1, C.FG_TILES.wall_face_right);
         setFG( 0, TOP + 1, C.FG_TILES.empty);
         setFG( 1, TOP + 1, C.FG_TILES.wall_face_left);
      }
      if (room.neighbors[C.P_DIR.DOWN]) {
         setBG( 0, BOT, C.BG_TILES.floor);
         setBG( 0, BOT + 1, C.BG_TILES.floor);
         
         setFG(-1, BOT, C.FG_TILES.wall_top_horiz_right);
         setFG( 1, BOT, C.FG_TILES.wall_top_horiz_left);
         setFG( 0, BOT, C.FG_TILES.empty);
         setFG(-1, BOT + 1, C.FG_TILES.wall_face_right);
         setFG( 0, BOT + 1, C.FG_TILES.empty);
         setFG( 1, BOT + 1, C.FG_TILES.wall_face_left);
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
