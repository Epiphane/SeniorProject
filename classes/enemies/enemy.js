/*
 * The Player class keeps track of an enemy's stats and their movement/attack AI
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Enemy', function(game) {
   return Class.create(Classes['Character'], {
      sprite: '',
      initial_attack: 1,
      initial_health: 2,
      attack_range: 1,
      boss: false,

      initialize: function(x, y) {
         Classes.Character.call(this, x, y);

         this.image = game.assets["assets/images/" + this.sprite];
         this.sfxDamage = new buzz.sound('assets/sounds/grunt.wav');
      },

      everyTurn: function() {
         return this.act();
      },

      isBoss: function() { return this.boss; },

      canMoveOntoMe: function(collider, room) {
         if (collider instanceof Classes['Player']) {
            collider.sfxAttack.play(); // If you're the player...
            collider.doAttack(this);   //  ATTACK ME
         }

         return false;
      },

      act: function() {
         if (Utils.cellDistance(this.position, game.currentScene.player.position) <= this.attack_range) {
            // Monster is next door, do monster attack
            var damage = this.damage(game.currentScene.player);
            this.damageDealtToPlayer += damage;

            this.doAttack(game.currentScene.player);
            this.sfxDamage.play();
            return;
         }

         var targetPosition = game.currentScene.player.position;
         var pathingTarget = astar(game, game.currentScene.currentRoom.tiles, this, targetPosition);

         if (pathingTarget) { 
            this.action(pathingTarget.pos.x - this.position.x, pathingTarget.pos.y - this.position.y, 
                        game.currentScene, game.currentScene.currentRoom);
         }
         else {
            console.warn("WEIRD: A* returned, null, is the player unreachable from the enemy? OH NO!");
         }

         return true;
      }
   });
});