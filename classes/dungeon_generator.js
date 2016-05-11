/* 
 * The DungeonGenerator class randomly generates a dungeon with lots of parameters
 */
ClassManager.create('DungeonGenerator', function(game) {
   return Class.create(Object, {
      initialize: function(numRooms) {
         this.linearity = 1;
         this.numRooms = numRooms || 10;
         this.roomsCreated = 0;
         this.unexploredRooms = 0;
         this.hasCreatedBossRoom = false;
         this.difficulty = 1;

         this.roomTypes = this.generateRoomTypes();

         this.parseObj = new ParseDungeon({});
         this.parseObj.set('numRooms', this.numRooms);

         this.rooms = [];

         this.parseObj.save();
      },

      destroy: function() {
         while (this.rooms.length > 0) {
            this.rooms.shift().destroy();
         }
      },

      generateRoomTypes: function() {
         var roomTypes = [];

         // 1 boss room
         roomTypes.push(C.ROOM_TYPES.boss);
         roomTypes.push(C.ROOM_TYPES.store);
         roomTypes.push(C.ROOM_TYPES.weapon);
         roomTypes.push(C.ROOM_TYPES.armor);
         roomTypes.push(C.ROOM_TYPES.puzzle);

         // 3 treasure rooms
         for (var i = 0; i < 2; i ++)
            roomTypes.push(C.ROOM_TYPES.treasure);

         while (roomTypes.length < this.numRooms)
            roomTypes.push(C.ROOM_TYPES.combat);

         return chance.shuffle(roomTypes);
      },

      /*
       * Generate a new dungeon, that will contain room connections and information
       */
      createDungeon: function() {
         return this.nextRoom(null);
      },

      isDeadEndRoom: function(roomType) {
         return (roomType === C.ROOM_TYPES.boss);
      },

      /**
       * Decide what type of room the next one should be
       */
      nextRoomType: function(direction, deadEnd) {
         var ndxToPick = 0;
         if (this.numRooms - this.roomsCreated > 1) {
            while (this.unexploredRooms === 1 && this.isDeadEndRoom(this.roomTypes[ndxToPick])) {
               ndxToPick ++;
            }
         }

         var ret = this.roomTypes[ndxToPick];
         this.roomTypes.splice(ndxToPick, 1);
         return ret;
      },

      /**
       * Get the next room for the dungeon
       */
      nextRoom: function(from, direction) {
         var generator = new RoomGenerator();

         var order = this.parseObj.get('roomsExplored');
         this.parseObj.set('roomsExplored', order + 1);
         this.parseObj.save();

         var parseObj = null;
         if (from) {
            parseObj = from.neighbors[direction];
         }
         else {
            parseObj = new ParseRoom({
               type: C.ROOM_TYPES.random,
               dungeon: this.parseObj
            });
         }
         var roomType = parseObj.get('type');
         parseObj.set('orderVisited', order);
         parseObj.save();

         var numExitBounds = { min: 1, max: 4 };
         // Make sure we don't add too many rooms!
         if (this.numRooms - this.roomsCreated < 4) {
            numExitBounds.max = this.numRooms - this.roomsCreated;
         }

         // If this new room is the only one you haven't explored,
         // then we don't want to make a dead end.
         if (this.unexploredRooms === 1 && this.numRooms - this.roomsCreated > 1) {
            numExitBounds.min = 2;
         }

         // Random number of exits
         try {
            var numExits = chance.integer(numExitBounds);
         }
         catch(e) {
            console.error('Error bounds:', numExitBounds);
         }

         // First define the room type
         switch (roomType) {
            case C.ROOM_TYPES.random:
               break;
            case C.ROOM_TYPES.puzzle:
               generator = new PuzzleRoomGenerator();
               break;
            case C.ROOM_TYPES.store:
               break;
            case C.ROOM_TYPES.treasure:
               generator = new ItemRoomGenerator();
               break;
            case C.ROOM_TYPES.weapon:
               generator = new WeaponRoomGenerator();
               break;
            case C.ROOM_TYPES.armor:
               generator = new ArmorRoomGenerator();
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
            var makeExit = false;
            try {
               makeExit = chance.bool({ likelihood: Math.min(100 * numExits / (4 - dir), 100) });
            }
            catch (e) {
               console.error('Error bounds:', { likelihood: Math.min(100 * numExits / (4 - dir), 100) });
            }
            if (makeExit && direction !== dir) {
               numExits --;

               // Decide what type of room our neighbor is
               nextRoom.neighbors[dir] = new ParseRoom({
                  type: this.nextRoomType(dir),
                  dungeon: this.parseObj,
                  depth: parseObj.get('depth') + 1
               });
               nextRoom.neighbors[dir].save();
               
               // If a room is a dead end (like a boss room), consider it "explored"
               // That way the dungeon will not try to path through it.
               if (this.isDeadEndRoom(nextRoom.neighbors[dir].get('type'))) {
                  this.unexploredRooms --;
               }
            }
         }
         
         var room = generator.fillRoom(nextRoom, {
            parent: direction
         });
         this.rooms.push(room);
         return room;
      }

   });
});

function mockDungeon() {
   var generator = new Classes.DungeonGenerator();

   var minx = 0, maxx = 0;
   var miny = 0, maxy = 0;
   var rooms = [];
   function addRoom(r, x, y) {
      if (!rooms[y]) rooms[y] = [];
      if (!rooms[y][x]) rooms[y][x] = [];
      rooms[y][x].push(r);
      roomStack.push({ room: r, x: x, y: y });

      if (minx > x) minx = x;   
      if (miny > y) miny = y;
      if (maxx < x) maxx = x;   
      if (maxy < y) maxy = y;   
   }

   var roomStack = [];
   addRoom(generator.createDungeon(), 0, 0);
   while (roomStack.length > 0) {
      var room = roomStack.shift();

      for (var d in C.P_DIR) {
         var direction = C.P_DIR[d];
         if (!!room.room.neighbors[direction] && !(room.room.neighbors[direction] instanceof Classes['Room'])) {
            var r = generator.nextRoom(room.room, direction);
            var dir = Utils.to.direction(direction);
            room.room.neighbors[direction] = r;
            addRoom(r, room.x + dir[0], room.y + dir[1]);
         }
      }
   }

   var types = {};
   var legend = [];
   function addType(value, letter) {
      types[C.ROOM_TYPES[value]] = letter;
      legend.push(letter + ': ' + value); 
   }

   addType('start', 'x');
   addType('random', 'r');
   addType('puzzle', 'p');
   addType('store', 's');
   addType('treasure', 't');
   addType('weapon', 'w');
   addType('armor', 'a');
   addType('combat', 'c');
   addType('npc', 'n');
   addType('boss', 'b');

   console.log(legend.join('\n'));
   for (var y = miny; y <= maxy; y ++) {
      var str = [];
      for (var x = minx; x <= maxx; x ++) {
         if (!!rooms[y][x]) {
            var type = '.';
            type = types[rooms[y][x][0].type];
            if (x === 0 && y === 0) 
               type = 'x';

            var extra = rooms[y][x].length > 1 ? '*' : ' ';

            str.push('[' + type + '' + extra + ']');
         }
         else {
            str.push('    ');
         }
      }
      console.log(str.join(' '));
   }

   return rooms;
}