/* 
 * The Room class creates the layout of each dungeon room 
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
ClassManager.create('Room', function(game) {
   return Class.create(Map, {
      initialize: function() {
         Map.call(this, C.TILE_SIZE, C.TILE_SIZE);
         this.image = game.assets["assets/images/map.png"];

         this.tiles = [];
      },

      isWalkable: function(x, y) {
         // TODO: Change this to !== when tiles is a 2D array for greater accuracy!
         if (this.tiles[y][x] != C.TILES.floor && this.tiles[y][x] != C.TILES.empty) {
            return false;
         }

         for (var i = this.characters.length - 1; i >= 0; i--) {
            if (this.characters[i].position.x === x &&
                this.characters[i].position.y === y) {
               return false;
            }
         };

         if (game.currentScene.player.position.x === x &&
             game.currentScene.player.position.y === y) {
            return false;
         }

         return true;
      },

      action: function() {
         this.characters.forEach(function(character) {
            character.doAI();
         });
      }
   });
});