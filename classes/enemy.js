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
      boss: false,

      initialize: function(x, y) {
         Classes.Character.call(this, x, y);

         this.image = game.assets["assets/images/" + this.sprite];
         this.sfxDamage = new buzz.sound('assets/sounds/grunt.wav');
      },

      doAI: function() {
         return this.act();
      },

      isBoss: function() { return this.boss; },

      act: function() {
         if (Utils.cellDistance(this.position, game.currentScene.player.position) <= this.attack_range) {
            // Monster is next door, do monster attack
            this.doAttack(game.currentScene.player);
            this.sfxDamage.play();
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

         return true;
      }
   });
});

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

      doAI: function() {
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

ClassManager.create('Bat', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster2.gif",
      // attack_range: 2,
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_attack: 1,
      initial_health: 5,
   });
});

ClassManager.create('Slime', function(game) {
   return Class.create(Classes['WaitingEnemy'], {
      sprite: "monster1.gif",
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_health: 15,
   });
});

ClassManager.create('Boss', function(game) {
   return Class.create(Classes['Enemy'], {

      initialize: function() {
         // Call super constructor
         Classes.Enemy.prototype.initialize.apply(this, arguments);

         this.special = 4;
         this.waiting = 2;
      },

      doAI: function() {
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

ClassManager.create('SimpleBoss', function(game) {
   return Class.create(Classes['Boss'], {
      sprite: "boss1.png",
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_health: 40,
      cooldown: 2,

      act: function() {
         Classes['Boss'].prototype.act.apply(this, arguments);

         if (this.special > 0) {
            this.special --;
            return;
         }

         this.special = 8;

         // Spawn an enemy somewhere!
         var currentRoom = game.currentScene.currentRoom;
         currentRoom.addCharacter(new Classes['Bat'](),  Math.floor(currentRoom.width / 2) - 2,  Math.floor(currentRoom.height / 2) - 2);
         currentRoom.addCharacter(new Classes['Bat'](), -Math.floor(currentRoom.width / 2) + 2,  Math.floor(currentRoom.height / 2) - 2);
         currentRoom.addCharacter(new Classes['Bat'](),  Math.floor(currentRoom.width / 2) - 2, -Math.floor(currentRoom.height / 2) + 2);
         currentRoom.addCharacter(new Classes['Bat'](), -Math.floor(currentRoom.width / 2) + 2, -Math.floor(currentRoom.height / 2) + 2);
      }
   });
});