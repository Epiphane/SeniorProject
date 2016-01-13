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

            window.g = this.tiles;
         this.loadData(this.tiles);
      },
      
      /* Change the frame of one tile. col and row are tile indexes, not pixels. */
      editTile: function(row, col, newVal) {
         if (col >= 0 && col < ROOM_WID_MAX && row >= 0 && row < ROOM_HIG_MAX) {
            this.tiles[row][col] = newVal;
            this.loadData(this.tiles);
         }
      },
      
      /* Removes all walls and items in a room */
      resetRoom: function() {
         var countRow, countCol;
         for (countRow = this.wallN; countRow < this.wallS; countRow++) {
            for (countCol = this.wallW+1; countCol < this.wallE; countCol++) {
               if (countRow == this.wallN && this.tiles[countRow][countCol] == 1)
                  this.tiles[countRow][countCol] = 2;
               else if (countRow != this.wallN) {
                  this.tiles[countRow][countCol] = 0;
                  this.items.tiles[countRow][countCol] = -1;
                  this.chests.tiles[countRow][countCol] = -1;
                  this.collision[countRow][countCol] = 0;
               }
            }
         }
         
         this.loadData(this.tiles);
         this.collisionData = this.collision;
         this.items.loadData(this.items.tiles);
         this.chests.loadData(this.chests.tiles);
      }
   });
});