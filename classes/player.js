/*
 * The Player class keeps track of the character stats and animates and moves
 * the character sprite.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Player', function(game) {
   return Class.create(Classes['Character'], {
      walkSpeed: 1 / 12,

      initialize: function(x, y) {
         Classes['Character'].call(this, x, y);
         this.image = game.assets["assets/images/player.png"]; 

         this.attackCounter = 0;
         this.cooldown = 0;

         this.health = this.max_health = 8;
         this.health -= 3;
      
         this.weapon = null;
         this.armor = null;
      },

      walkAnimSpeed: 4,
      walkStartFrame: 1,
      walkEndFrame: 4,

      attackAnimSpeed: 4,
      attackStartFrame: 7,
      attackEndFrame: 9,

      getDirectionFrame: function() {
         return 9 * this.direction;
      },

      action: function(dx, dy) {
         var moved = Classes['Character'].prototype.action.apply(this, arguments);

         var room = game.currentScene.currentRoom;
         if (moved) {
            var item = room.getItemAt(this.position.x, this.position.y);
            if (item !== null) {
               // Grab item!
               room.removeItemAt(this.position.x, this.position.y);

               if (item instanceof Classes['Weapon']) {
                  // Swap out my weapon
                  room.addItemAt(this.weapon, this.position.x, this.position.y);
                  this.weapon = item;
               }
               else if (item instanceof Classes['Armor']) {
                  // Swap out my armor
                  room.addItemAt(this.armor, this.position.x, this.position.y);
                  this.armor = item;
               }
            }
         }
         else {
            var enemy = room.getCharacterAt(this.position.x + dx, this.position.y + dy);

            if (enemy instanceof Classes['Enemy']) {
               console.log('Found enemy!');

               this.attack(dx, dy);
            }
         }
      },

   });
});