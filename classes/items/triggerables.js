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
            player.sfxPowerup.play();
         }
      },

      {
         className: 'DoorSwitch',
         itemName: 'org',
         fixedInPlace: true,

         // What door will this switch open when pressed?
         attachedDoor: null,

         act: function(character) {
            attachedDoor.switchChanged(this, true);
            // character.
         }
      },

   ].forEach(function(item) {
      ClassManager.create(item.className, function(game) {
         return Class.create(Classes.Triggerable, item);
      });
   });
})();


