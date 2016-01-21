/* 
 * A sprite representing an item
 */
ClassManager.create('Item', function(game) {
   // Create the base class
   return Class.create(Sprite, {
      itemName: 'empty',
      initialize: function() {
         Sprite.call(this, 32, 32);
         this.image = game.assets["assets/images/items.png"];

         // Initialize this item's picture
         this.frame = C.Items[this.itemName];

         this.position = { x: -1, y: -1 };
      },
   });
});