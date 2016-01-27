/* 
 * The DungeonGenerator class randomly generates a dungeon with lots of parameters
 */
ClassManager.create('DungeonGenerator', function(game) {
   return Class.create(Object, {
      initialize: function() {
         this.linearity = 1;
         this.numRooms = 10;
         this.roomsCreated = 0;
         this.unexploredRooms = 0;
         this.difficulty = 1;

         this.defaults = {
            height: C.MAP_HEIGHT - 4,
            width: C.MAP_WIDTH - 4,
         };
      },
      /*
       * Generate a new dungeon, that will contain room connections and information
       */
      createDungeon: function() {
         return this.nextRoom(null);
      },
      /**
       * Get the next room for the dungeon
       */
      nextRoom: function(from, direction) {
         var width = this.defaults.width;
         var height = this.defaults.height;
         var nextRoom = new Classes['Room'](width, height);

         var roomBounds = { min: 1, max: 4 };
         // Make sure we don't add too many rooms!
         if (this.numRooms - this.roomsCreated < 4) {
            roomBounds.max = this.numRooms - this.roomsCreated;
         }

         // If this new room is the only one you haven't explored,
         // then we don't want to make a dead end.
         if (this.unexploredRooms === 1) {
            roomBounds.min = 2;
         }

         // Random number of exits
         var numExits = chance.integer(roomBounds);

         if (from) {
            var dir = Utils.to.direction(direction);
            direction = Utils.to.P_DIR(dir[0] * -1, dir[1] * -1);

            nextRoom.neighbors[direction] = from;
            numExits --;
            this.unexploredRooms --;
         }

         // Iterate through the 4 possibilities of door directions
         for (var dir = 0; dir < 4; dir ++) {
            // There is a numExits / (dir + 1) chance we add a new exit here
            // This makes it equal e.g. 1/4, 1/3, 1/2, 1/1 chances stack up
            console.log(dir, 'likelihood', 100 * numExits / (4 - dir));
            if (chance.bool({ likelihood: 100 * numExits / (4 - dir) }) && direction !== dir) {
               this.roomsCreated ++;
               this.unexploredRooms ++;
               nextRoom.neighbors[dir] = true;
               numExits --;
            }
         }

         var generator = new RoomGenerator();
         if (chance.bool({ likelihood: 50 })) generator = new CombatRoomGenerator();
         return generator.fillRoom(nextRoom, { /* params */ });
      }

   });
});