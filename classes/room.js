/* 
 * The Room class creates the layout of each dungeon room 
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
ClassManager.create('Room', function(game) {
   return Class.create(Group, {
      initialize: function() {
         Group.call(this);

         this.map = new Map(C.TILE_SIZE, C.TILE_SIZE);
         this.map.image = game.assets["assets/images/map.png"];

         this.addChild(this.map);

         this.tiles = [];
         this.items = [];
         this.characters = [];
      },

      loadData: function(data) {
         this.map.loadData(data);
      },

      addCharacter: function(character) {
         this.characters.push(character);
         this.addChild(character);
      },

      isWalkable: function(x, y) {
         // TODO: Change this to !== when tiles is a 2D array for greater accuracy!
         if (this.tiles[y][x] != C.TILES.floor && this.tiles[y][x] != C.TILES.empty) {
            return false;
         }

         if (this.getCharacterAt(x, y) !== null) {
            return false;
         }

         return true;
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
         item.x = x * C.TILE_SIZE;
         item.y = y * C.TILE_SIZE;
         
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
         for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i];
            if (item.position.x === x && item.position.y === y) {
               return item;
            }
         }

         return null;
      },

      action: function() {
         for (var i = this.characters.length - 1; i >= 0; i--) {
            var character = this.characters[i];

            if (character.isDead()) {
               this.characters.splice(i, 1);
               this.removeChild(character);
            }
            else {
               character.doAI();
            }
         };
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