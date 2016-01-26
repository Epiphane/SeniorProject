/* 
 * A sprite representing an item
 */
ClassManager.create('Triggerable', function(game) {
   // Create the base class
   return Class.create(Classes.Item, {
      act: function() {}
      
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
         act: function(player) {
            player.health = player.health >= (player.max_health-4) ? player.max_health : player.health + player.healing;
         }
      }
   ].forEach(function(item) {
      ClassManager.create(item.className, function(game) {
         return Class.create(Classes.Triggerable, item);
      });
   });
})();
