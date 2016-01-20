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

         for (var r = 0; r < C.MAP_WIDTH; r ++) {
            var tile = C.TILES.floor;
            if (r === 0) tile = C.TILES.wall2;
            if (r === C.MAP_HEIGHT - 1) tile = C.TILES.wall;

            room.tiles.push( 
               C.TILES.wall +
               new Array(C.MAP_WIDTH - 1).join(tile) +
               C.TILES.wall
            );
         }

         room.loadData(room.tiles);

         // TOOD - Add variable for adding exits
         var chance = new Chance();
         



         return room;

      }
   });
});