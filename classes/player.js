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

         this.potions = 0;
      },

      walkAnimSpeed: 4,
      walkStartFrame: 0,
      walkEndFrame: 3,

      attackAnimSpeed: 4,
      attackStartFrame: 6,
      attackEndFrame: 9,

      initial_attack: 1,
      initial_defense: 0,

      getDirectionFrame: function() {
         return 9 * this.direction;
      },

      getAttack: function() {
         return this.attack + (this.weapon ? this.weapon.attack : 0);
      },

      getDefense: function() {
         return this.defense + (this.armor ? this.armor.defense : 0);
      },

      doAttack: function(victim) {
         Classes['Character'].prototype.doAttack.apply(this, arguments);
         victim.engaged_with_player = true;

         if (this.weapon) {
            this.weapon.onHit(victim);
         }
      },

      // Try to move the character by the specified dx and dy.
      action: function(dx, dy, gameScene, room) {
         var destinationX = this.position.x + dx;
         var destinationY = this.position.y + dy;

         // Try to move between rooms first
         if (room.isExit(destinationX, destinationY) &&
             room.tryMovingToTile(destinationX, destinationY, this)) {
            this.direction = Utils.to.P_DIR(dx, dy);
            gameScene.moveRooms(this.direction);
            return;
         }

         if (room.isStaircase(destinationX, destinationY)) {
            gameScene.descend();
            return;
         }

         // Set character rotation and tell the room we're moving
         Classes['Character'].prototype.action.apply(this, arguments);
      },

   });
});
