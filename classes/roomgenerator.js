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

         // Generate basic room
         for (var r = 0; r < C.MAP_WIDTH; r++) {
            var tile = C.TILES.floor;
            if (r === 0) tile = C.TILES.wall2;
            if (r === C.MAP_HEIGHT - 1) tile = C.TILES.wall;

            var row = [];
            row.push(C.TILES.wall);
            for (var a = 1; a < C.MAP_WIDTH-1; a++) {
               row.push(tile);
            }
            row.push(C.TILES.wall);

            room.tiles.push(row);
         }

         // TOOD - Add variable for adding exits
         var chance = new Chance();
         var exitCol = chance.natural({min:1, max:C.MAP_WIDTH-2});

         room.tiles[0][exitCol] = C.TILES.empty;

         // Adding random fissures for spookiness
         for (var i = 1; i<C.MAP_WIDTH-1; i++) {
            for (var j = 1; j<C.MAP_HEIGHT-1; j++) {
               if (chance.bool({likelihood:5})) {
                  room.tiles[i][j] = C.TILES.fissure;
               }
            }
         }

         // Load the tiles
         room.loadData(room.tiles);

         // Add enemies and items to room
         room.addCharacter(new Classes.Slime(15, 15));
         room.addCharacter(new Classes.Bat(17, 15));

         room.addItemAt(new Classes.Sword(), 4, 6);

         return room;

      }
   });
});