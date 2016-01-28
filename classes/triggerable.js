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
            player.health = Math.min(player.health + 4, player.max_health);
            game.assets["assets/sounds/powerup.mp3"].clone().play();
         }
      }
   ].forEach(function(item) {
      ClassManager.create(item.className, function(game) {
         return Class.create(Classes.Triggerable, item);
      });
   });
})();
