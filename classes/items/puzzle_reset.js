ClassManager.create('PuzzleReset', function(game) {
   return Class.create(Classes.Item, {
      itemName: 'puzzleReset',

      canMoveOntoMe: function() {
         return true;
      },

      initialize: function() {
         Classes.Item.call(this);
         this.image = game.assets["assets/images/you suck try again.png"];
         this.frame = 0;
      },

      // I just got stepped on!
      didMoveOntoMe: function(collider, room) {
         if (!room.puzzleWon) {
            room.puzzleTiles.forEach(function(tile) {
               tile.state = TILE_UNPRESSED;
               tile.image = game.assets["assets/images/puzzle_initial.png"];
            });
            
            var newSound = new buzz.sound('assets/sounds/puzzle_failed.wav');
            newSound.play();
         }
      }
    });
});
