/*
 * The Character class keeps track of a sprite, that can move. SURPRISE!
 *  It handles the walk animation, collisions and direction stuff.
 *
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Character', function(game) {
   return Class.create(Classes.Entity, {
      walkSpeed: 1 / 12,

      // Contains a switch (if any) that the player is currently standing on.
      currentSwitch: null,

      initialize: function(x, y) {
         Sprite.call(this, C.TILE_SIZE, C.TILE_SIZE);

         // This is the position in game coordinates
         this.position = { x: x || 0, y: y || 0 };
         this.snapToPosition();

         /* The REAL 'frame' property, actually used by the Sprite class to set the sprite's frame. */
         this.frame = 0;

         this.direction = C.P_DIR.DOWN;

         /* How far is this sprite into its walk/attack cycle? (in terms of frames) */
         this.walkOffset = 1;

         /* Attack cycle in "pseudo-frames" */
         this.attackOffset = 0;

         this.health = this.initial_health;
         this.max_health = this.initial_health;

         this.attack = this.initial_attack;
         this.defense = this.initial_defense;

         this.total_attacks_made = 0;
         this.total_attacks_taken = 0;
         this.engaged_with_player = false;
      },

      destroy: function() {
         if (this.AttacksMade) {
            this.AttacksMade.log(this.total_attacks_made);
         }

         if (this.engaged_with_player && this.AttacksTaken) {
            this.AttacksTaken.log(this.total_attacks_taken);
         }

         if (this.Engaged) {
            this.Engaged.log(this.engaged_with_player);
         }
      },

      /**
       * Immediately move this character to their target position,
       *  bypassing the walk animation.
       */
      snapToPosition: function() {
         this.x = Utils.to.screen(this.position.x);
         this.y = Utils.to.screen(this.position.y);
      },

      initial_health: 10,
      initial_attack: 0,
      initial_defense: 0,

      isDead: function() {
         return this.health <= 0;
      },

      /*
       * Attempt to make a move (or attack) in the specified direction
       */
      action: function(dx, dy, gameScene, room) {
         var destinationX = this.position.x + dx;
         var destinationY = this.position.y + dy;

         this.direction = Utils.to.P_DIR(dx, dy);

         if (room.tryMovingToTile(destinationX, destinationY, this)) {
            this.position.x = destinationX;
            this.position.y = destinationY;
            room.didMoveToTile(destinationX, destinationY, this);
         }
      },

      isAnimating: function() {
         return this.isMoving() || this.isAttacking();
      },

      /*
       * Is this sprite moving?
       *
       * Returns true if the player's screen position matches that of the game position (scaled)
       */
      isMoving: function() {
         return !this.isAttacking() && !(this.x === Utils.to.screen(this.position.x) && this.y === Utils.to.screen(this.position.y));
      },

      /*
       * Is this sprite attacking?
       *
       * Returns true if the player is in the middle of an attack animation
       */
      isAttacking: function() {
         return this.attackOffset !== 0;
      },

      getAttack: function() {
         return this.attack;
      },

      getDefense: function() {
         return this.defense;
      },

      damage: function(victim) {
          return Math.max(this.getAttack() - victim.getDefense(), 1);
      },

      /**
       * Do an attack in a certain direction
       */
      doAttack: function(victim) {
         this.attackOffset = 1;

         this.total_attacks_made ++;
         victim.total_attacks_taken ++;
         victim.health -= this.damage(victim);
      },

      // Run the walking animation if you need to move
      onenterframe: function() {
         if (this.isAttacking()) {
            var dir = Utils.to.direction(this.direction);

            this.moveBy(dir[0], dir[1]);
         }
         else if (this.isMoving()) {
            var walkSpeed = this.walkSpeed * C.TILE_SIZE;

            var dx = Utils.to.screen(this.position.x) - this.x;
            var dy = Utils.to.screen(this.position.y) - this.y;
            if (dx >  walkSpeed) dx =  walkSpeed;
            if (dy >  walkSpeed) dy =  walkSpeed;
            if (dx < -walkSpeed) dx = -walkSpeed;
            if (dy < -walkSpeed) dy = -walkSpeed;

            this.moveBy(dx, dy);
         }

         this.updateSpriteFrame();
      },

      /* Animation info for walking */
      walkAnimSpeed: 8,
      walkStartFrame: 0,
      walkEndFrame: 0,

      /* Animation info for attacking */
      attackAnimSpeed: 8,
      attackStartFrame: 0,
      attackEndFrame: 0,
      attackLength: 3,

      /*
       * If the sprite has different rows for each direction,
       * you can add specialized code here.
       */
      getDirectionFrame: function() {
         return 0;
      },

      doAI: function() {
        // for when you need AI
      },

      // DON'T TREAD ON ME
      canMoveOntoMe: function(collider, room) {
         return false;
      },

      updateSpriteFrame: function() {
         if (this.isMoving()) {
            // Animate through the enemy's walk cycle every three frames
            if (game.frame % this.walkAnimSpeed === 0) {
               var walkCycleLength = this.walkEndFrame - this.walkStartFrame;
               this.walkOffset = ++this.walkOffset % walkCycleLength;
            }

            this.frame = this.walkStartFrame + this.walkOffset;
         }
         else if (this.isAttacking()) {
            if (game.frame % this.attackAnimSpeed === 0) {
               this.attackOffset = ++this.attackOffset % this.attackLength;
            }

            var attackCycleLength = this.attackEndFrame - this.attackStartFrame;
            var attackFrame = this.attackOffset % attackCycleLength;
            this.frame = this.attackStartFrame + attackFrame;
         }
         else {
            this.frame = this.walkStartFrame;
         }

         this.frame += this.getDirectionFrame();
      },

   });
});
