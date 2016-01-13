/*
 * The Player class keeps track of the character stats and animates and moves
 * the character sprite.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Player', function(game) {
   return Class.create(Sprite, {
      initialize: function(x, y) {
         Sprite.call(this, C.TILE_SIZE, C.TILE_SIZE);
         this.image = game.assets["assets/images/player.png"];
         this.x = x * C.TILE_SIZE; /* Relative to the whole map, not the window */
         this.y = y * C.TILE_SIZE;
         this.frame = 0;
         
         this.isMoving = false;
         this.direction = C.P_DIR.DOWN;
         this.walk = 1;
         this.isAttacking = false;
         this.attackCounter = 0;
         this.cooldown = 0;

         this.walkSpeed = 8;
      },
      
      onenterframe: function() {
         this.move();
      },
      
      move: function() {
         this.frame = this.direction * 9 + (this.walk == 3 ? 1 : this.walk);
         if (this.isMoving) {
            this.moveBy(this.vx, this.vy);
            
            if (!(game.frame % 2)) {
               this.walk++;
               this.walk %= 4;
            }
            if ((this.vx && (this.x) % this.width == 0) || (this.vy && this.y % this.height == 0)) { /* 32x32 grid */
               this.isMoving = false;
            }
         }

         if (!this.isMoving) {
            this.vx = this.vy = 0;
            if (game.input.left) {
               this.direction = C.P_DIR.LEFT;
               this.vx = -this.walkSpeed;
            } 
            else if (game.input.right) {
               this.direction = C.P_DIR.RIGHT;
               this.vx = this.walkSpeed;
            } 
            else if (game.input.up) {
               this.direction = C.P_DIR.UP;
               this.vy = -this.walkSpeed;
            }
            else if (game.input.down) {
               this.direction = C.P_DIR.DOWN;
               this.vy = this.walkSpeed;
            }
            else {
               this.walk = 1;
            }
            if (this.vx || this.vy) {
               var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
               var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
               this.isMoving = true;
               // arguments.callee.call(this);
            }
         }
      }
   });
});