/* 
 * A sprite representing an item
 */
ClassManager.create('Item', function(game) {
   // Create the base class
   return Class.create(Sprite, {
      itemName: '',
      initialize: function(itemName) {
         Sprite.call(this, 32, 32);
         this.image = game.assets["assets/images/items.png"];

         this.itemName = itemName || this.itemName || '';
         if (this.itemName) {
            // Initialize this item's picture
            this.frame = C.Items[this.itemName];
         }
      },
   });
});