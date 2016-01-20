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
         // TODO: Change this to === when tiles is a 2D array for greater accuracy!
         return this.tiles[y][x] == C.TILES.floor;
      }
   });
});