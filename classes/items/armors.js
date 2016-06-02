/* 
 * A sprite representing an item
 */
ClassManager.create('Armor', function(game) {
   // Create the base class
   return Class.create(Classes.Item, {
      defense: 0,

      didMoveOntoMe: function(collider, room) {
         if (collider instanceof Classes['Player']) {
            room.removeItemAt(this.position.x, this.position.y);
            if (collider.armor) {
               room.addItemAt(collider.armor, this.position.x, this.position.y);
            }
            collider.armor = this;
         }
      },
   });
});

/*
 * The item implementations themselves
 */
(function() {
   var levelDef = [1, 2, 3, 4, 5, 6, 7];
   for (var i = 0; i < 7; i ++) {
      (function(i) {
         ClassManager.create(C.Armors[i], function(game) {
            return Class.create(Classes.Armor, {
               className: C.Armors[i],
               itemName: 'shield_' + (i + 1),
               defense: levelDef[i]
            });
         });
      })(i);
   }
})();
