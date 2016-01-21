/*
 * The Character class keeps track of a sprite, that can move. SURPRISE!
 *  It handles the walk animation, collisions and direction stuff.
 *
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Character', function(game) {
   return Class.create(Sprite, {
      walkSpeed: 1 / 12,

      initialize: function(x, y) {
         Sprite.call(this, C.TILE_SIZE, C.TILE_SIZE);

         // This is the position in screen coordinates
         this.x = x * C.TILE_SIZE;
         this.y = y * C.TILE_SIZE;

         // This is the position in game coordinates
         this.position = { x: x, y: y };

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
      },

      initial_health: 10,
      initial_attack: 0,

      isDead: function() {
         return this.health <= 0;
      },

      /*
       * Attempt to make a move (or attack) in the specified direction
       */
      action: function(dir_x, dir_y) {
         this.direction = Utils.to.P_DIR(dir_x, dir_y);

         return this.tryMove(dir_x, dir_y);
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
         return !this.isAttacking() && !(this.x === this.position.x * C.TILE_SIZE && this.y === this.position.y * C.TILE_SIZE);
      },

      /*
       * Is this sprite attacking?
       * 
       * Returns true if the player is in the middle of an attack animation
       */
      isAttacking: function() {
         return this.attackOffset !== 0;
      },

      /*
       * Attempt to move in a direction
       *
       * return: whether or not move is successful
       */
      tryMove: function(dx, dy) {
         if (game.currentScene.currentRoom.isWalkable(this.position.x + dx, this.position.y + dy)) {
            this.position.x += dx;
            this.position.y += dy;

            return true;
         }
        
         return false;
      },

      getAttack: function() {
         return this.attack;
      },

      /**
       * Do an attack in a certain direction
       */
      doAttack: function(victim, dx, dy) {
         this.attackOffset = 1;

         victim.health -= this.getAttack(victim);
      },
      
      // Run the walking animation if you need to move
      onenterframe: function() {
         if (this.isAttacking()) {
            var dir = Utils.to.direction(this.direction);

            this.moveBy(dir[0], dir[1]);
         }
         else if (this.isMoving()) {
            var walkSpeed = this.walkSpeed * C.TILE_SIZE;

            var dx = this.position.x * C.TILE_SIZE - this.x;
            var dy = this.position.y * C.TILE_SIZE - this.y;
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