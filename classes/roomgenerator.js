/* 
 * The RoomGenerator class randomly assigns specified amounts  
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
ClassManager.create('RoomGenerator', function(game) {
   return Class.create(Map, {
      initialize: function() {},
      /*
       * Given a roomType enum and a diffculty (be it a number or later, 
       * a metric attached to a player) generates and instantiates a new room.
       */
      getNewRoom: function(roomType, difficulty) {
         var room = new Classes.Room();
         var row_tiles = new Array(C.MAP_WIDTH);
         room.tiles.push()

         var row_tiles = new Array(C.MAP_WIDTH);

         // TOP ROW
         row_tiles[0] = C.MAP_TILES.wall_top_left_corner;
         for (c = 1;c < C.MAP_WIDTH - 1; c++) {
            row_tiles[c] = C.MAP_TILES.wall;
         }
         row_tiles[C.MAP_WIDTH-1] = C.MAP_TILES.wall_top_right_corner;

         room.tiles.push(row_tiles);

         // MIDDLE ROW


         // BOTTOM ROW
         for (var r = 0; r < C.MAP_WIDTH; r ++) {
            var tile = C.TILES.floor;
            if (r === 0) tile = C.TILES.wall2;
            if (r === C.MAP_HEIGHT - 1) tile = C.TILES.wall;

            this.tiles[r] = 
               C.TILES.wall + // Wall on the left...
               new Array(C.MAP_WIDTH - 1).join(tile) + // floor in between (C.MAP_WIDTH - 2 floors)
               C.TILES.wall; // Wall on the right.
         }

         this.loadData(this.tiles);

         }
      }
   });
});