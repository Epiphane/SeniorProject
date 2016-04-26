var puzzle1 = {
   rows: 5,
   cols: 6,
   offset_x: -6,
   offset_y: -4,

   data: [
      0, 0, 2, 1, 2, 0,
      0, 2, 2, 1, 2, 2,
      0, 1, 1, 1, 1, 1,
      0, 2, 1, 1, 2, 0,
      0, 0, 2, 1, 0, 0,
   ]
};

/* 
 * The PuzzleRoomGenerator class randomly creates a puzzle room
 */
(function(window) {
   var defaults = {};



   window.PuzzleRoomGenerator = Class.create(RoomGenerator, {
      addPuzzleTile: function(room, x, y) {
         var new_tile = new Classes.PuzzleTile();
         room.puzzleTiles.push(new_tile);
         room.addItemAt(new_tile, x, y);
      },

      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         for (var x = 0; x < puzzle1.cols; x++) {
            for (var y = 0; y < puzzle1.rows; y++) {
               switch(puzzle1.data[y * puzzle1.cols + x]) {
                  case 2: // terrain
                     this.setTile(background,  x + puzzle1.offset_x,  y + puzzle1.offset_y, C.BG_TILES.floor_blocked);
                     break;
                  default:
                     // nothing
                     break;
               }
            }  
         }

         return background;
      },

      genPuzzle: function(room, puzzle) {

         for (var x = 0; x < puzzle.cols; x++) {
            for (var y = 0; y < puzzle.rows; y++) {
               switch(puzzle.data[y * puzzle.cols + x]) {
                  case 2: // terrain
                     this.setTile(background,  x + puzzle.offset_x,  y + puzzle.offset_y, C.BG_TILES.floor_blocked);
                     break;
                  case 1: // Puzzle tile
                     this.addPuzzleTile(room, x + puzzle.offset_x, y + puzzle.offset_y);
                     break;
                  case 0: // NOTHING
                     break;
                  default:
                     console.warn("HEY NOW, you're an all star, you passed " + puzzle.data[y * puzzle.cols + x] + " as a puzzle tile but it's not valid, now, get your game on, go play");
                     break;
               }
            }  
         }
      },

      populateRoom: function(room) {
         room.puzzleTiles = [];

         // this.addItem(room, new Classes.PuzzleTile(), 0, 0);

         this.genPuzzle(room, puzzle1);
      }
   });
})(window);
