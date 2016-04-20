// Choice tracker
var RoomFirstExitPreference = new Choice.Preference({
   Choice: Choice.Qualitative.extend({
      options: [
         Utils.to.P_DIR_STR(C.P_DIR.LEFT), 
         Utils.to.P_DIR_STR(C.P_DIR.UP), 
         Utils.to.P_DIR_STR(C.P_DIR.RIGHT), 
         Utils.to.P_DIR_STR(C.P_DIR.DOWN),
         'Return'
      ]
   })
});

/*
 * The Room class creates the layout of each dungeon room
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
ClassManager.create('Room', function(game) {
   return Class.create(Group, {
      initialize: function(parseObj) {
         Group.call(this);

         this.parseObj = parseObj || {};

         this.roomType = C.ROOM_TYPES.random;

         this.map = new Map(C.TILE_SIZE, C.TILE_SIZE);
         this.map.image = game.assets["assets/images/map2.png"];

         this.floor = new Map(C.TILE_SIZE, C.TILE_SIZE);
         this.floor.image = game.assets["assets/images/map2.png"];

         this.width  = parseObj.get('width')  || C.MAP_SIZE;
         this.height = parseObj.get('height') || C.MAP_SIZE;

         this.right = Math.floor(this.width / 2);
         this.left = -this.right;
         this.bottom = Math.floor(this.height / 2);
         this.top = -this.bottom;

         this.addChild(this.floor);
         this.addChild(this.map);

         this.tiles = [];
         this.foreground = [];

         this.items = [];
         this.characters = [];

         this.neighbors = [false, false, false, false];

         this.exits = [];
         this.hasExitedYet = false;
      },

      onEnter: function() {
         this.parseObj.increment('timesVisited');

         EM.log('dungeon', 'visit', this.parseObj.get('timesVisited'), {
            roomType: this.type,
            isEmpty: this.items.length === 0 && this.characters.length === 0
         });
      },

      onExit: function(direction) {
         EM.log('duration', 'actionsTakenInRoom', this.parseObj.actionsTaken, {
            roomType: this.type,
            playerHealth: game.currentScene.player,
            genocide: this.parseObj.get('genocide')
         });

         if (!this.hasExitedYet) {
            if (this.parent === direction) {
               RoomFirstExitPreference.log('Return');
            }
            else {
               RoomFirstExitPreference.log(Utils.to.P_DIR_STR(direction), this.exits);
            }
            this.hasExitedYet = true;
         }
      },

      getNeighbor: function(direction) {
         if (this.neighbors[direction] === false) {
            return null;
         }
         else if (this.neighbors[direction] instanceof Classes['Room']) {
            return this.neighbors[direction];
         }
         else {
            // Generate a new room here
            return this.neighbors[direction] = game.currentScene.dungeonGenerator.nextRoom(this, direction);
         }
      },

      loadData: function() {
         this.floor.loadData(this.tiles);

         if (this.foreground.length) {
            this.map.loadData(this.foreground);
         }
      },

      setTile: function(tiles, x, y, val) {
         // Tileset-ify
         x += Math.floor(C.MAP_SIZE / 2);
         y += Math.floor(C.MAP_SIZE / 2);

         tiles[y][x] = val;
      },

      setBackground: function(x, y, tile) {
         this.setTile(this.tiles, x, y, tile);
         this.floor.loadData(this.tiles);
      },

      setForeground: function(x, y, tile) {
         this.setTile(this.foreground, x, y, tile);
         this.map.loadData(this.foreground);
      },

      addToScene: function(node) {
         this.insertBefore(node, this.map);
      },

      addCharacter: function(character, x, y) {
         if (x && y) {
            character.position.x = x;
            character.position.y = y;
            character.snapToPosition();
         }

         this.characters.push(character);
         this.addToScene(character);

         this.parseObj.set('genocide', false);

         if (character.parseObj) {
            console.warn('We should never need this line so the code is untested YOLO');
            character.parseObj.set('room', this.parseObj);
         }
         else {
            character.parseObj = new ParseNPC({ 
               room: this.parseObj,
               sprite: character.sprite
            });
         }
         this.parseObj.save().then(function() {
            character.parseObj.save();
         });
      },

      /**
       * Put the player in a specific doorway,
       * as if they had just come from that direction.
       *
       * @param {P_DIR}
       */
      movePlayerToDoorway: function(player, direction) {
         switch (direction) {
            case C.P_DIR.UP:
               player.position.y = this.top - 1;
               player.position.x = 0;
               player.snapToPosition();
               break;
            case C.P_DIR.DOWN:
               player.position.y = this.bottom;
               player.position.x = 0;
               player.snapToPosition();
               break;
            case C.P_DIR.LEFT:
               player.position.y = 0;
               player.position.x = this.left - 1;
               player.snapToPosition();
               break;
            case C.P_DIR.RIGHT:
               player.position.y = 0;
               player.position.x = this.right;
               player.snapToPosition();
               break;
         }
      },

      /**
       * Determine whether a coordinate is an exit of the room.
       * Used by the player to determine whether to leave the room.
       */
      isExit: function(x, y) {
         return x < this.left || x >= this.right || y < this.top || y >= this.bottom;
      },

      /**
       * General case. Checks if there's a wall or another character before we walk on a tile.
       */
      isWalkable: function(x, y) {
         if (this.getCharacterAt(x, y) !== null) {
            return false;
         }

         // Convert to tilesetness
         x += Math.floor(C.MAP_SIZE / 2);
         y += Math.floor(C.MAP_SIZE / 2);

         if (this.tiles[y][x] !== C.BG_TILES.floor && this.tiles[y][x] !== C.BG_TILES.empty) {
            return false;
         }

         var itemInSquare = this.getItemAt(x, y);
         if (itemInSquare && itemInSquare.impassible) {
            return false;
         }

         return true;
      },

      /**
       * Returns FALSE if there's terrain blocking the spot at (x, y)
       * Returns TRUE otherwise.
       */
      checkTerrain: function(x, y) {
         x += Math.floor(C.MAP_SIZE / 2);
         y += Math.floor(C.MAP_SIZE / 2);

         if (this.tiles[y][x] !== C.BG_TILES.floor && this.tiles[y][x] !== C.BG_TILES.empty) {
            return false;
         }

         return true;
      },

      /**
       * Attempts to move the entity "mover" to the specified
       *  x and y. Runs the "canMoveOntoMe" function for
       *  everybody in that square to determine what to do.
       *
       * Returns TRUE if "mover" can move there.
       * Returns FALSE otherwise.
       */
      tryMovingToTile: function(x, y, mover) {
         if (!this.checkTerrain(x, y)) {
            return false;
         }

         var canMove = true;

         // Check items in tile
         var that = this;
         this.getItemAt(x, y).forEach(function(item) {
            canMove &= item.canMoveOntoMe(mover, that);
         });

         // Check characters in tile
         var characterInSquare = this.getCharacterAt(x, y);
         if (characterInSquare) {
            canMove &= characterInSquare.canMoveOntoMe(mover, that);
         }

         return canMove;
      },

      /*
       * Somebody moved somewhere. Let the current occupants of the cell know
       *  about this.
       */
      didMoveToTile: function(x, y, mover) {
         // Alert items in tile
         var that = this;
         this.getItemAt(x, y).forEach(function(item) {
            item.didMoveOntoMe(mover, that);
         });

         // Alert characters in tile
         var characterInSquare = this.getCharacterAt(x, y);
         if (characterInSquare) {
            characterInSquare.didMoveOntoMe(mover, that);
         }
      },

      isStaircase: function(x, y) {
         // Convert to tilesetness
         x += Math.floor(C.MAP_SIZE / 2);
         y += Math.floor(C.MAP_SIZE / 2);

         return this.tiles[y][x] === C.BG_TILES.stairs;
      },

      getCharacterAt: function(x, y) {
         for (var i = this.characters.length - 1; i >= 0; i--) {
            var character = this.characters[i];
            if (character.position.x === x && character.position.y === y) {
               return character;
            }
         }

         var player = game.currentScene.player;
         if (player.position.x === x && player.position.y === y) {
            return player;
         }

         return null;
      },

      addItemAt: function(item, x, y) {
         if (!item) return;

         item.position = { x: x, y: y };
         item.x = Utils.to.screen(x);
         item.y = Utils.to.screen(y);

         this.items.push(item);
         this.addChild(item);
      },

      removeItemAt: function(x, y) {
         for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i];
            if (item.position.x === x && item.position.y === y) {
               this.removeChild(item);
               this.items.splice(i, 1);

               return;
            }
         }
      },

      getItemAt: function(x, y) {
         var result = [];

         for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i];
            if (item.position.x === x && item.position.y === y) {
               result.push(item);
            }
         }

         return result;
      },

      action: function() {
         this.parseObj.increment('actionsTaken');

         for (var i = this.characters.length - 1; i >= 0; i--) {
            var character = this.characters[i];

            if (character.isDead()) {
               if (character.isBoss()) {
                  // Kill all characters
                  while (this.characters.length > 0) {
                     this.removeChild(this.characters.shift());
                  }

                  this.setBackground(0, 0, C.BG_TILES.stairs);
               }
               else {
                  this.characters.splice(i, 1);
                  this.removeChild(character);
               }

               // TODO: We should see if the player has killed all non-violent
               // characters, not just all characters
               if (this.characters.length === 0) {
                  this.parseObj.set('genocide', true);
               }

               // Log the murder
               EM.log("combat", "murder", character.sprite);
            }
            else {
               character.everyTurn();
            }
         };

         for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i];

            item.everyTurn();
         }
      },

      isAnimating: function() {
         for (var i = this.characters.length - 1; i >= 0; i--) {
            if (this.characters[i].isAnimating()) {
               return true;
            }
         }

         return false;
      }
   });
});
