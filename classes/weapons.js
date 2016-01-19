/* 
 * A sprite representing an item
 */
ClassManager.create('Weapon', function(game) {
   // Create the base class
   return Class.create(Classes.Item, {
      attack: 0
   });
});

/*
 * The item implementations themselves
 */
(function() {
   [
      {
         className: 'Sword',
         itemName: 'sword',
         attack: 5
      }
   ].forEach(function(item) {
      ClassManager.create(item.className, function(game) {
         return Class.create(Classes.Weapon, item);
      });
   });
})();
