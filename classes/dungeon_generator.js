/* 
 * The DungeonGenerator class randomly generates a dungeon with lots of parameters
 */
ClassManager.create('DungeonGenerator', function(game) {
   return Class.create(Object, {
      initialize: function() {
         this.linearity = 1;
         this.difficulty = 1;
      },
      /*
       * Generate a new dungeon, that will contain room connections and information
       */
      createDungeon: function() {
         var roomsCreated = 1;
         var firstRoom = RoomGenerator.createRoom({ /* params */ });
         var walker = firstRoom;

         while (roomsCreated < 10) {
            var newRoom = RoomGenerator.createRoom({ /* params */ });

            walker.addNeighbor(C.P_DIR.UP, newRoom);
            newRoom.addNeighbor(C.P_DIR.DOWN, walker);
            roomsCreated ++;

            walker = newRoom;
         }

         return firstRoom;
      }
   });
});