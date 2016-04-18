/* 
 * A sprite representing an item
 */
ClassManager.create('Triggerable', function(game) {
   // Create the base class
   return Class.create(Classes.Item, {
      didMoveOntoMe: function(collider) {},

      // Don't let the dirty enemies step on my precious items
      canMoveOntoMe: function(collider) {
         if (collider instanceof Classes['Enemy']) {
            return false;
         }
         return true;
      }
   });
});

/*
 * The item implementations themselves
 */
(function() {
   [
      // TODO: THIS, OR WHATEVER
      {
         className: 'DoorSwitch',
         itemName: 'org',
         fixedInPlace: true,

         // What door will this switch open when pressed?
         attachedDoor: null,

         didMoveOntoMe: function(collider) {
            attachedDoor.switchChanged(this, true);
         }
      },

   ].forEach(function(item) {
      ClassManager.create(item.className, function(game) {
         return Class.create(Classes.Triggerable, item);
      });
   });
})();


