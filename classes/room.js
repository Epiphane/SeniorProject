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

         this.tiles = new Array(C.MAP_HEIGHT);
         for (var r = 0; r < C.MAP_WIDTH; r ++) {
            var tile = C.TILES.floor;
            if (r === 0) tile = C.TILES.wall2;
            if (r === C.MAP_HEIGHT - 1) tile = C.TILES.wall;

            this.tiles[r] = 
               C.TILES.wall + // Wall on the left...
               new Array(C.MAP_WIDTH - 1).join(tile) + // floor in between (C.MAP_WIDTH - 2 floors)
               C.TILES.wall; // Wall on the right.
         }

         this.loadData(this.tiles);
      }
   });
});