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
      initial_health: 10,
      attack_range: 1,

      initialize: function(x, y) {
         Classes.Character.call(this, x, y);

         this.image = game.assets["assets/images/" + this.sprite];
         this.damagePlayerSound = game.assets['assets/sounds/grunt.wav'].clone();
      },

      doAI: function() {
         if (Utils.cellDistance(this.position, game.currentScene.player.position) <= this.attack_range) {
            // Monster is next door, do monster attack
            this.doAttack(game.currentScene.player);
            this.damagePlayerSound.play();
            return;
         }

         var targetPosition = game.currentScene.player.position;
         var pathingTarget = astar(game, game.currentScene.currentRoom.tiles, this.position, targetPosition);

         if (pathingTarget) { 
            this.action(pathingTarget.pos.x - this.position.x, pathingTarget.pos.y - this.position.y);
         }
         else {
            console.warn("WEIRD: A* returned, null, is the player unreachable from the enemy? OH NO!");
         }
      },
   });
});

ClassManager.create('Bat', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster2.gif",
      attack_range: 2,
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_attack: 1,
      initial_health: 5,
   });
});

ClassManager.create('Slime', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster1.gif",
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_health: 15,

      initialize: function() {
         // Call super constructor
         Classes.Enemy.prototype.initialize.apply(this, arguments);

         this.waiting = chance.bool({ likelihood: 50 });
      },

      doAI: function() {
         // move every other turn
         if (this.waiting) {
            this.waiting = false;
            return;
         }

         this.waiting = true;
         return Classes['Enemy'].prototype.doAI.apply(this, arguments);
      }
   });
});

ClassManager.create('Boss', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "boss1.png",
      walkStartFrame: 3,
      walkEndFrame:   5
   });
});