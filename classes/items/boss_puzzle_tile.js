ClassManager.create('BossPuzzleTile', function(game) {
   return Class.create(Classes.PuzzleTile, {
      bossPuzzleSpawned: true,
      creator: null,

      initialize: function(boss) {
         Classes.PuzzleTile.call(this);
         this.creator = boss;
      },

      // Check if all the tiles are green. If so, release them!
      checkPuzzle: function(room) {
         if (room.puzzleTiles) {
            var winner = true;

            room.puzzleTiles.forEach(function(tile) {
               if (tile.state != TILE_PRESSED) {
                  winner = false;
               }
            });

            if (winner) {
               this.creator.won_puzzle();
            }
         }
      },

      failedPuzzle: function(room) {
         Classes.PuzzleTile.prototype.failedPuzzle.apply(this, arguments);
         this.creator.failed_puzzle();
      }
    });
});
