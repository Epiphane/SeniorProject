/**
 * WaitingEnemy is a type of enemy that only takes action every, say, two turns
 * That way the player can stagger actions to win fights more easily, but we can
 * also punish the player more
 */
ClassManager.create('WaitingEnemy', function(game) {
   return Class.create(Classes['Enemy'], {
      cooldown: 1,

      initialize: function() {
         // Call super constructor
         Classes.Enemy.prototype.initialize.apply(this, arguments);

         this.waiting = chance.integer({ min: 0, max: this.cooldown });
      },

      everyTurn: function() {
         // move every "cooldown" turn
         if (this.waiting > 0) {
            this.waiting --;
            return false;
         }

         this.waiting = this.cooldown;
         return this.act.apply(this, arguments);
      }
   });
});
