/**
 * A boss is a special kind of enemy. In particular it does a lot
 * of the same functionality as the waitingEnemy (can be set to 1
 * for no delay), but also has a `boss` field so the game knows
 * it's special. After killing a boss 2 things happen:
 *  - All enemies in the room are killed
 *  - An exit appears to the next dungeon
 */
ClassManager.create('Boss', function(game) {
   return Class.create(Classes['Enemy'], {

      initialize: function() {
         // Call super constructor
         Classes.Enemy.prototype.initialize.apply(this, arguments);

         this.special = 4;
         this.waiting = 2;
      },

      everyTurn: function() {
         // move every "cooldown" turn
         if (this.waiting > 0) {
            this.waiting --;
            return false;
         }

         this.waiting = this.cooldown;
         return this.act.apply(this, arguments);
      },

      initial_health: 40,
      boss: true
   });
});
