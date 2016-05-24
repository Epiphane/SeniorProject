var easy_puzzle1 = {
   rows: 4,
   cols: 4,
   offset_x: -4,
   offset_y: -4,

   data: "#oo#oooooooo#oo#"
};

var med_puzzle1 = {
   rows: 5,
   cols: 5,
   offset_x: -5,
   offset_y: -4,

   data: ".#o#.\
##o##\
ooooo\
#oo#.\
.#o.."
};

var med_puzzle2 = {
   rows: 7,
   cols: 6,
   offset_x: -6,
   offset_y: -4,

   data: ".####.\
#oooo#\
#oooo#\
#oooo#\
.##oo#\
.oooo.\
.####."
};

var hard_puzzle1 = {
   rows: 11,
   cols: 10,
   offset_x: -5,
   offset_y: -5,

   data: "#ooooo#oo#\
#ooo#o#oo#\
#o###o#oo#\
#o###o#oo#\
.oooo.ooo.\
#ooo#.#oo#\
#o#ooo#oo#\
#o######o#\
#oooooooo#"
};

var hard_puzzle2 = {
   rows: 10,
   cols: 12,
   offset_x: -6,
   offset_y: -5,
data: ".....o......\
.....#......\
.....o......\
o#o######o#o\
...#....o...\
...#....#...\
...oo####...\
#o##....o...\
...o....#...\
...#....#..."
};

var hard_puzzle3 = {
   rows: 6,
   cols: 6,
   offset_x: -3,
   offset_y: -3,
data: "oooooo\
oo#ooo\
oooooo\
ooo.#o\
o#oooo\
oooooo"
};

var med_puzzles = [med_puzzle1, med_puzzle2];
var hard_puzzles = [hard_puzzle3];
var all_puzzles = [easy_puzzle1, med_puzzle1, med_puzzle2, hard_puzzle1, hard_puzzle2, hard_puzzle3];

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

      currPuzzle: null,

      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         this.currPuzzle = chance.pick(all_puzzles, 1);

         for (var x = 0; x < this.currPuzzle.cols; x++) {
            for (var y = 0; y < this.currPuzzle.rows; y++) {
               switch(this.currPuzzle.data[y * this.currPuzzle.cols + x]) {
                  case "#": // terrain
                     this.setTile(background,  x + this.currPuzzle.offset_x,  y + this.currPuzzle.offset_y, C.BG_TILES.floor_blocked);
                     break;
                  default:
                     // nothing
                     break;
               }
            }  
         }

         return background;
      },

      genPuzzle: function(room) {
         for (var x = 0; x < this.currPuzzle.cols; x++) {
            for (var y = 0; y < this.currPuzzle.rows; y++) {
               switch(this.currPuzzle.data[y * this.currPuzzle.cols + x]) {
                  case "#": // terrain
                     this.setTile(background,  x + this.currPuzzle.offset_x,  y + this.currPuzzle.offset_y, C.BG_TILES.floor_blocked);
                     break;
                  case "o": // Puzzle tile
                     this.addPuzzleTile(room, x + this.currPuzzle.offset_x, y + this.currPuzzle.offset_y);
                     break;
                  case ".": // NOTHING
                     break;
                  default:
                     console.warn("HEY NOW, you're an all star, you passed " + this.currPuzzle.data[y * this.currPuzzle.cols + x] + " as a puzzle tile but it's not valid, now, get your game on, go play");
                     break;
               }
            }  
         }
      },

      populateRoom: function(room) {
         room.puzzleTiles = [];

         this.genPuzzle(room);
      }
   });
})(window);

// How many turns the player has spent in a puzzle room (relevant...?)
var TurnSpentPuzzle = new Choice.Aggregate({
   totalTurns: 0,

   next: function() {
      this.log(this.totalTurns++);
   }
});



// How many times the player has successfully finished a puzzle
var PuzzlesSolved = new Choice.Aggregate({
   totalSolved: 0,

   next: function() {
      this.log(this.totalSolved++);
   }
});

// How many times the player has triggered an X to appear
var PuzzlesFailed = new Choice.Aggregate({
   totalFailed: 0,

   next: function() {
      this.log(this.totalFailed++);
   }
});

var PuzzleWin = new Choice.Preference({
   Choice: Choice.Qualitative.extend({
      options: [
         true, false
      ]
   })
});