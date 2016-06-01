var BOSS_STATE_IDLE = 0;
var BOSS_STATE_IN_PUZZLE = 1;

ClassManager.create('FinalBoss', function(game) {
   return Class.create(Classes['Boss'], {
      sprite: "final_boss.png",
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_health: 15,
      initial_attack: 2,
      cooldown: 2,

      attack_state: BOSS_STATE_IDLE,

      clear_puzzle_tiles: function() {
         var room = game.currentScene.currentRoom;

         for (var i = room.items.length - 1; i >= 0; i--) {
            var item = room.items[i];
            if (item.bossPuzzleSpawned) {
               room.removeItemAt(item.position.x, item.position.y);
            }
         }

         room.puzzleTiles = [];
      },

      won_puzzle: function() {
         this.clear_puzzle_tiles();
         this.attack_state = BOSS_STATE_IDLE;
         this.special = 8;
      },

      failed_puzzle: function() {
         this.clear_puzzle_tiles();
         this.attack_state = BOSS_STATE_IDLE;
         this.special = 8;
         
         game.currentScene.player.health -= 1;
      },

      createPuzzleRoom: function(currentRoom) {
         // TODO: Choose a puzzle the user has failed at before
         var nastyPuzzle = med_puzzle1;

         currentRoom.puzzleTiles = [];

         for (var x = 0; x < nastyPuzzle.cols; x++) {
            for (var y = 0; y < nastyPuzzle.rows; y++) {
               var map_x = x + nastyPuzzle.offset_x;
               var map_y = y + nastyPuzzle.offset_y;

               switch(nastyPuzzle.data[y * nastyPuzzle.cols + x]) {
                  case "#": // terrain
                     currentRoom.addItemAt(new Classes.BossPuzzleWall(), map_x, map_y);
                     break;
                  case "o": // Puzzle tile
                     var new_tile = new Classes.BossPuzzleTile(this);
                     currentRoom.addItemAt(new_tile, map_x, map_y);
                     currentRoom.puzzleTiles.push(new_tile);
                     break;
                  case ".": // NOTHING
                     break;
                  default:
                     console.warn("HEY NOW, you're an all star, you passed " + nastyPuzzle.data[y * nastyPuzzle.cols + x] + " as a puzzle tile but it's not valid, now, get your game on, go play");
                     break;
               }
            }  
         }

         this.special = 24;
      },

      act: function() {
         Classes['Boss'].prototype.act.apply(this, arguments);

         if (this.special > 0) {
            this.special --;
            return;
         }

         this.special = 8;

         var currentRoom = game.currentScene.currentRoom;

         switch (this.attack_state) {
            case BOSS_STATE_IDLE:
               // Choose a random special attack. For now, just spawn the puzzle room.
               this.createPuzzleRoom(currentRoom);
               break;
            case BOSS_STATE_IN_PUZZLE:
               // The player didn't finish the puzzle in time! PUNISHMENT TIME
               this.failed_puzzle();
               break;
            default:
               console.warn("Unknown boss state " + this.attack_state);
               break;
         }

         /*currentRoom.addCharacter(new Classes['Bat'](),  Math.floor(currentRoom.width / 2) - 2,  Math.floor(currentRoom.height / 2) - 2);
         currentRoom.addCharacter(new Classes['Bat'](), -Math.floor(currentRoom.width / 2) + 2,  Math.floor(currentRoom.height / 2) - 2);
         currentRoom.addCharacter(new Classes['Bat'](),  Math.floor(ccurrentRoom.width / 2) - 2, -Math.floor(currentRoom.height / 2) + 2);
         currentRoom.addCharacter(new Classes['Bat'](), -Math.floor(currentRoom.width / 2) + 2, -Math.floor(currentRoom.height / 2) + 2);*/
      }
   });
});