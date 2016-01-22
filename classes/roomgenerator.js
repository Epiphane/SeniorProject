/* 
 * The RoomGenerator class randomly assigns specified amounts  
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
ClassManager.create('RoomGenerator', function(game) {
   return Class.create(Group, {
      initialize: function() {

      },
      /*
       * Given a roomType enum and a diffculty (be it a number or later, 
       * a metric attached to a player) generates and instantiates a new room.
       */
      getNewRoom: function(roomType, difficulty) {
         var room = new Classes.Room();

         var background = [];
         var foreground = [];

         // Generate basic room
         for (var r = 0; r < C.MAP_HEIGHT; r++) {
            var top_or_bottom_row = (r === 0 || r === C.MAP_HEIGHT - 1);

            var tile = C.MAP_TILES.floor;
            if (top_or_bottom_row) tile = C.MAP_TILES.wall;

            // Background (floor)
            var bg_row = [];
            for (var c = 0; c < C.MAP_WIDTH; c ++) {
               bg_row.push(tile);
            }

            background.push(bg_row);

            // Foreground
            var fg_row = [];
            fg_row.push(top_or_bottom_row ? C.MAP_TILES.empty : C.MAP_TILES.wall_left);
            for (var a = 1; a < C.MAP_WIDTH-1; a++) {
               fg_row.push(C.MAP_TILES.empty);
            }
            fg_row.push(top_or_bottom_row ? C.MAP_TILES.empty : C.MAP_TILES.wall_right);

            foreground.push(fg_row);
         }

         // Corners and exits
         background[0][0] = C.MAP_TILES.wall_top_left_corner;
         background[0][C.MAP_WIDTH - 1] = C.MAP_TILES.wall_top_right_corner;
         background[C.MAP_HEIGHT - 1][0] = C.MAP_TILES.wall_bottom_left_corner;
         background[C.MAP_HEIGHT - 1][C.MAP_WIDTH - 1] = C.MAP_TILES.wall_bottom_right_corner;

         // TOOD - Add variable for adding exits
         var chance = new Chance();
         var exitCol = chance.natural({min:2, max:C.MAP_WIDTH - 3});

         background[0][exitCol - 1] = C.MAP_TILES.wall_bottom_right_corner;
         background[0][exitCol]     = C.MAP_TILES.floor;
         background[0][exitCol + 1] = C.MAP_TILES.wall_bottom_left_corner;

         // Adding random fissures for spookiness
         for (var i = 1; i<C.MAP_HEIGHT-1; i++) {
            for (var j = 1; j<C.MAP_HEIGHT-1; j++) {
               if (chance.bool({likelihood:5})) {
                  background[i][j] = C.MAP_TILES.fissure;
               }
            }
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

      }
   });
});