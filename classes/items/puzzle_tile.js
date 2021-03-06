var TILE_UNPRESSED = 0; 
var TILE_PRESSED = 1;
var TILE_BAD = 2;

ClassManager.create('PuzzleTile', function(game) {
   return Class.create(Classes.Item, {
      //className: 'PuzzleTile',
      itemName: 'puzzleTile',

      canMoveOntoMe: function() {
         return true;
      },

      initialize: function() {
         Classes.Item.call(this);
         this.image = game.assets["assets/images/puzzle_initial.png"];
         this.frame = 0;
         this.state = TILE_UNPRESSED;
      },

      // Check if all the tiles are green. If so, drop 'em a potion
      checkPuzzle: function(room) {
         if (room.puzzleTiles) {
            var winner = true;

            room.puzzleTiles.forEach(function(tile) {
               if (tile.state != TILE_PRESSED) {
                  winner = false;
               }
            });

            if (winner) {
               room.addItemAt(room.prize || new Classes.Potion(), 0, 0);
               room.puzzleWon = true;
               PuzzlesSolved.next();

               this.beatPuzzle(room);
            }
         }
      },

      // I just got stepped on!
      didMoveOntoMe: function(collider, room) {
         if (collider instanceof Classes['Player'] ||
             collider instanceof Classes['Pushable']  ) {

             switch (this.state) {
               case TILE_UNPRESSED:
                  this.state = TILE_PRESSED;
                  this.image = game.assets["assets/images/u did it.png"];
                  this.checkPuzzle(room);

                  var newSound = new buzz.sound('assets/sounds/puzzle_presstile.wav');
                  newSound.play();
                  break;
               case TILE_PRESSED:
                  this.state = TILE_BAD;
                  this.image = game.assets["assets/images/U MESSED UP LOL.png"];
                  this.failedPuzzle(room);

                  var newSound = new buzz.sound('assets/sounds/puzzle_presstile.wav');
                  newSound.play();

                  if (!room.logged_failure) {
                     room.logged_failure = true;
                     PuzzlesFailed.next();
                  }
                  break;
               default:
                  // nothin'
                  break;
             }

         }
      },

      failedPuzzle: function(room) {
         var tiles_to_destroy = room.puzzleTiles;
         setTimeout(function() {
            for (var i = tiles_to_destroy.length - 1; i >= 0; i--) {
               tiles_to_destroy[i].image = game.assets["assets/images/U MESSED UP LOL faded.png"];
               tiles_to_destroy[i].state = TILE_BAD;
            }

            var newSound = new buzz.sound('assets/sounds/puzzle_failed.wav');
            newSound.play();
         }, 400);
      },

      beatPuzzle: function(room) {
         var tiles_to_win = room.puzzleTiles;
         setTimeout(function() {
            for (var i = tiles_to_win.length - 1; i >= 0; i--) {
               tiles_to_win[i].image = game.assets["assets/images/u did it and its over.png"];
               tiles_to_win[i].state = TILE_BAD;
            }

            var newSound = new buzz.sound('assets/sounds/puzzle_won.wav');
            newSound.play();
         }, 200);
      },

      everyTurn: function() {
         //  chill
      }
    });
});
