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
         this.sfxAttack = new buzz.sound('assets/sounds/sword_swing.wav');
         this.sfxPowerup = new buzz.sound('assets/sounds/powerup.mp3');

         this.attackCounter = 0;
         this.cooldown = 0;

         this.health = this.max_health = 8;
      
         this.weapon = null;
         this.armor = null;
      },

      walkAnimSpeed: 4,
      walkStartFrame: 0,
      walkEndFrame: 3,

      attackAnimSpeed: 4,
      attackStartFrame: 6,
      attackEndFrame: 9,

      initial_attack: 1,

      getDirectionFrame: function() {
         return 9 * this.direction;
      },

      getAttack: function() {
         return this.attack + (this.weapon ? this.weapon.attack : 0);
      },

      getDefense: function() {
         return this.defense + (this.armor ? this.armor.defense : 0);
      },

      doAttack: function(victim, dx, dy) {
         Classes['Character'].prototype.doAttack.apply(this, arguments);

         if (this.weapon) {
            this.weapon.onHit(victim);
         }
      },

      action: function(dx, dy, gameScene, room) {
         // Try to move between rooms first
         if (room.isExit(this.position.x + dx, this.position.y + dy)) {
            this.direction = Utils.to.P_DIR(dx, dy);
            gameScene.moveRooms(this.direction);
            // this.position.x += dx;
            // this.position.y += dy;
         }

         if (room.isStaircase(this.position.x + dx, this.position.y + dy)) {
            gameScene.descend();
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
               else if (item instanceof Classes['Triggerable']) {
                  item.act(this);
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
               this.sfxAttack.play();
               this.doAttack(enemy, dx, dy);
            }
            else if(enemy instanceof Classes['NPC']) {
               enemy.showDialogue();
            }
         }
      },

   });
});