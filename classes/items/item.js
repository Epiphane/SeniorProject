/*
 * A sprite representing an item
 */
ClassManager.create('Item', function(game) {
   // Create the base class
   return Class.create(Classes.Entity, {
      itemName: 'empty',
      initialize: function() {
         Sprite.call(this, 32, 32);
         this.image = game.assets["assets/images/items.png"];

         // Initialize this item's picture
         this.frame = C.Items[this.itemName];

         this.position = { x: -1, y: -1 };
      },

      setPosition: function(x, y) {
         this.position.x = x;
         this.x = Utils.to.screen(this.position.x);
         this.y = Utils.to.screen(this.position.y);
      },
   });
});

/*
 * Defines something you can pick up
 */
ClassManager.create('Pickups', function(game) {
   return Class.create(Classes.Item, {

      canMoveOntoMe: function(collider) {
         if (collider instanceof Classes.Player) {
            return true;
         }

         // Enemies can't walk over pickups
         return false;
      },

      didMoveOntoMe: function(collider) {
         if (collider instanceof Classes.Player) {
            // Do pickup stuff
         }
      }
   });
});
