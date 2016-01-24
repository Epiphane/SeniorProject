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
      },
      printLayout: function(layout) {
         for (var r = 0; r < layout.length; r ++) {
            var str = '';
            for (var c = 0; c < layout[r].length; c ++) {
               str += layout[r][c] ? 'x' : ' ';
            }

            console.log(str);
         }
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
         var nextRoom = new Classes['Room']();

         var roomBounds = { min: 1, max: 4 };
         if (this.numRooms - this.roomsCreated < 4) {
            roomBounds.max = this.numRooms - this.roomsCreated;
         }

         if (this.unexploredRooms === 1) {
            roomBounds.min = 2;
         }

         console.log("roomBounds: ",roomBounds.min,roomBounds.max);
         var numExits = chance.integer(roomBounds);

         if (from) {
            var dir = Utils.to.direction(direction);
            direction = Utils.to.P_DIR(dir[0] * -1, dir[1] * -1);

            nextRoom.neighbors[direction] = from;
            numExits --;
            this.unexploredRooms --;
         }

         console.log("numExits: " + numExits);

         if (numExits > 0 || (chance.bool({ likelihood: 100 * numExits / 4 }) && direction !== C.P_DIR.UP)) {
            this.roomsCreated ++;
            this.unexploredRooms ++;
            nextRoom.neighbors[C.P_DIR.UP] = true;
            numExits --;
         }
         if (numExits > 0 || (chance.bool({ likelihood: 100 * numExits / 3 }) && direction !== C.P_DIR.LEFT)) {
            this.roomsCreated ++;
            this.unexploredRooms ++;
            nextRoom.neighbors[C.P_DIR.LEFT] = true;
            numExits --;
         }
         if (numExits > 0 || (chance.bool({ likelihood: 100 * numExits / 2 }) && direction !== C.P_DIR.RIGHT)) {
            this.roomsCreated ++;
            this.unexploredRooms ++;
            nextRoom.neighbors[C.P_DIR.RIGHT] = true;
            numExits --;
         }
         if (numExits > 0 || (chance.bool({ likelihood: 100 * numExits }) && direction !== C.P_DIR.DOWN)) {
            this.roomsCreated ++;
            this.unexploredRooms ++;
            nextRoom.neighbors[C.P_DIR.DOWN] = true;
            numExits --;
         }

         return RoomGenerator.fillRoom(nextRoom, { /* params */ });
      }

   });
});