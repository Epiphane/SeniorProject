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
         this.hasCreatedBossRoom = false;
         this.difficulty = 1;
      },
      /*
       * Generate a new dungeon, that will contain room connections and information
       */
      createDungeon: function() {
         return this.nextRoom(null);
      },

      /**
       * Decide what type of room the next one should be
       */
      nextRoomType: function(direction) {
         var roomsRemaining = this.numRooms - this.roomsCreated;

         if (!this.hasCreatedBossRoom) {
            if (roomsRemaining === 1 || (this.unexploredRooms > 1 && chance.bool({ likelihood: 20 }))) {
               this.hasCreatedBossRoom = true;
               return C.ROOM_TYPES.boss;
            }
         }

         if (chance.bool({ likelihood: 33 })) {
            return C.ROOM_TYPES.combat;
         }

         if (chance.bool({ likelihood: 50 })) {
            return C.ROOM_TYPES.treasure;
         }

         return C.ROOM_TYPES.random;
      },

      /**
       * Get the next room for the dungeon
       */
      nextRoom: function(from, direction) {
         var generator = new RoomGenerator();
         
         var parseObj = null;
         if (from) {
            parseObj = from.neighbors[direction];
         }
         else {
            parseObj = new ParseRoom({
               type: C.ROOM_TYPES.random
            });
         }
         var roomType = parseObj.get('type');

         var numExitBounds = { min: 1, max: 4 };
         // Make sure we don't add too many rooms!
         if (this.numRooms - this.roomsCreated < 4) {
            numExitBounds.max = this.numRooms - this.roomsCreated;
         }

         // If this new room is the only one you haven't explored,
         // then we don't want to make a dead end.
         if (this.unexploredRooms === 1) {
            numExitBounds.min = 2;
         }

         // Random number of exits
         var numExits = chance.integer(numExitBounds);

         // First define the room type
         switch (roomType) {
            case C.ROOM_TYPES.random:
               break;
            case C.ROOM_TYPES.store:
               break;
            case C.ROOM_TYPES.treasure:
               generator = new ItemRoomGenerator();
               break;
            case C.ROOM_TYPES.combat:
               generator = new CombatRoomGenerator();
               break;
            case C.ROOM_TYPES.npc:
               break;
            case C.ROOM_TYPES.boss:
               generator = new BossRoomGenerator();
               numExits  = 1;
               break;
         }

         var nextRoom = generator.createEmptyRoom(parseObj);
         nextRoom.type = roomType;

         if (from) {
            // Place an exit to our source room
            direction = Utils.to.opposite(direction);

            nextRoom.neighbors[direction] = from;
            numExits --;
            this.unexploredRooms --;
         }

         this.roomsCreated += numExits;
         this.unexploredRooms += numExits;
         // Iterate through the 4 possibilities of door directions
         for (var dir = 0; dir < 4; dir ++) {
            // There is a numExits / (dir + 1) chance we add a new exit here
            // This makes it equal e.g. 1/4, 1/3, 1/2, 1/1 chances stack up
            if (chance.bool({ likelihood: Math.min(100 * numExits / (4 - dir), 100) }) && direction !== dir) {
               numExits --;

               // Decide what type of room our neighbor is
               nextRoom.neighbors[dir] = new ParseRoom({
                  type: this.nextRoomType(dir)
               });
               nextRoom.neighbors[dir].save();
            }
         }

         generator = new PuzzleRoomGenerator();
         
         return generator.fillRoom(nextRoom, { /* params */ });
      }

   });
});