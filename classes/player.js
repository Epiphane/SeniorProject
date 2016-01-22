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
      walkStartFrame: 0,
      walkEndFrame: 3,

      attackAnimSpeed: 4,
      attackStartFrame: 6,
      attackEndFrame: 9,

      initial_attack: 5,

      getDirectionFrame: function() {
         return 9 * this.direction;
      },

      getAttack: function() {
         return this.attack + (this.weapon ? this.weapon.attack : 0);
      },

      action: function(dx, dy) {
         var room = game.currentScene.currentRoom;
         // Try to move between rooms first
         if (this.position.x + dx < 0) {
            game.currentScene.setRoom(room.getNeighbor(C.P_DIR.LEFT));
            this.position.x = C.MAP_WIDTH - 1;
            this.x = Utils.to.screen(C.MAP_WIDTH);

            return true;
         }
         else if (this.position.y + dy < 0) {
            game.currentScene.setRoom(room.getNeighbor(C.P_DIR.UP));
            this.position.y = C.MAP_HEIGHT - 1;
            this.y = Utils.to.screen(C.MAP_HEIGHT);

            return true;
         }
         else if (this.position.x + dx > C.MAP_WIDTH - 1) {
            game.currentScene.setRoom(room.getNeighbor(C.P_DIR.RIGHT));
            this.position.x = 0;
            this.x = Utils.to.screen(-1);

            return true;
         }
         else if (this.position.y + dy > C.MAP_HEIGHT - 1) {
            game.currentScene.setRoom(room.getNeighbor(C.P_DIR.DOWN));
            this.position.y = 0;
            this.y = Utils.to.screen(-1);

            return true;
         }

         // Otherwise just move around 'n stuff
         var moved = Classes['Character'].prototype.action.apply(this, arguments);
         if (moved) {
            // Pick up items
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
               this.doAttack(enemy, dx, dy);
            }
         }
      },

   });
});