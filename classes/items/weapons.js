/* 
 * A sprite representing an item
 */
ClassManager.create('Weapon', function(game) {
   // Create the base class
   return Class.create(Classes.Item, {
      attack: 0,
      onHit: function(enemy) {
         /* ... */
      }
   });
});

/*
 * The item implementations themselves
 */
(function() {
   var LVL_1 = 1;
   var LVL_2 = 1;
   [
      {
         className: 'Sword',
         itemName: 'sword',
         attack: LVL_1
      },
      {
         className: 'IceSword',
         itemName: 'sword_ice',
         attack: LVL_2,
         onHit: function(enemy) {
            /* ... */
         }
      },
      {
         className: 'EarthSword',
         itemName: 'sword_earth',
         attack: LVL_2,
         onHit: function(enemy) {
            /* ... */
         }
      },
      {
         className: 'LightSword',
         itemName: 'sword_light',
         attack: LVL_2,
         onHit: function(enemy) {
            /* ... */
         }
      },
      {
         className: 'FireSword',
         itemName: 'sword_fire',
         attack: LVL_2,
         onHit: function(enemy) {
            /* ... */
         }
      },
      {
         className: 'DarkSword',
         itemName: 'sword_dark',
         attack: LVL_2,
         onHit: function(enemy) {
            /* ... */
         }
      }
   ].forEach(function(item) {
      if (C.Weapons.indexOf(item.className) < 0) {
         console.warn('Item ' + item.className + ' not in the constant table');
      }
      ClassManager.create(item.className, function(game) {
         return Class.create(Classes.Weapon, item);
      });
   });
})();