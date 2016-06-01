// This creates some temp terrain so that we can make a temp
//  puzzle in the final boss room!
ClassManager.create('BossPuzzleWall', function(game) {
   return Class.create(Classes.Item, {
      bossPuzzleSpawned: true,

      initialize: function() {
         Classes.Item.call(this);
         this.image = game.assets["assets/images/boulder.png"];
         this.frame = 0;
      },

      canMoveOntoMe: function() {
         return false;
      },
    });
});
