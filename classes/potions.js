/* 
 * A sprite representing an item
 */
ClassManager.create('Potion', function(game) {
   // Create the base class
   return Class.create(Classes.Item, {
      healing: 0
   });
});

/*
 * The item implementations themselves
 */
(function() {
   [
      {
         className: 'Potion',
         itemName: 'potion',
         healing: 4
      }
   ].forEach(function(item) {
      ClassManager.create(item.className, function(game) {
         return Class.create(Classes.Potion, item);
      });
   });
})();
