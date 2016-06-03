/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.dialogManager = new Classes.Dialog();
      Game.backgroundColor = "black";
      Game.bgm = new buzz.sound("assets/sounds/dungeon.mp3", {loop:true});
      Game.bgm2 = new buzz.sound("assets/sounds/dungeon2.mp3", {loop:true});
      var muteTimer = 20;
      var level = 1;

      // Not sure where else to put this
      Game.moveRooms = function(dir) {
         Game.setRoom(Game.currentRoom.getNeighbor(dir), dir);

         Game.currentRoom.movePlayerToDoorway(Game.player, Utils.to.opposite(dir));
      };

      Game.descend = function() {
         if (Game.dungeonGenerator) {
            Game.dungeonGenerator.destroy();

            DifficultyManager.moveX(1);
            game.pushScene(new Scenes.Transition(level ++));
         }

         // Create first room
         Game.player.position.x = Game.player.position.y = 0;
         Game.player.snapToPosition();
         if (DifficultyManager.getDifficulty() >= 0.6) {
            Game.bgm.stop();
            Game.bgm = Game.bgm2;
            Game.bgm.play();
         }
         Game.dungeonGenerator = new Classes.DungeonGenerator();
         Game.setRoom(Game.dungeonGenerator.createDungeon());
      };

      Game.setRoom = function(room, dir) {
         // Remove old room
         if (Game.currentRoom) {
            Game.currentRoom.onExit(dir);
            Game.currentRoom.removeChild(Game.player);
            Game.currentRoom.removeChild(Game.HUD);
            Game.removeChild(Game.currentRoom);
         }

         // Add new room
         Game.currentRoom = room;
         Game.addChild(Game.currentRoom);
         Game.currentRoom.addToScene(Game.player);
         Game.currentRoom.addChild(Game.HUD);
         Game.currentRoom.onEnter();
      };

      Game.player = new Classes.Player(0, 0);
      Game.HUD = new Classes.HUD(Game.player);

      // Start the game
      curr_level=0;
      // Have to reset music if we got over 0.6 diff last game cuz reasons.
      Game.bgm = new buzz.sound("assets/sounds/dungeon.mp3", {loop:true});
      Game.descend();
      Game.bgm.play();

      // Checks if any entity is still moving
      var actionCooldown = 0;
      Game.waitingOnMovement = function() {
         if (Game.player.isAnimating()) return true;
         if (Game.currentRoom.isAnimating()) return true;
         if (Game.dialogManager.isActive()) return true;

         if (actionCooldown > 0) return true;

         return false;
      }

      Game.onenterframe = function() {
         if (actionCooldown > 0) actionCooldown -= 1 / 60;

         if (!Game.waitingOnMovement()) {
            if (game.input.left) {
               Game.action(-1, 0);
            }
            else if (game.input.right) {
               Game.action(1, 0);
            }
            else if (game.input.up) {
               Game.action(0, -1);
            }
            else if (game.input.down) {
               Game.action(0, 1);
            }
            else if (game.input.usePotion && Game.player.potions > 0) {
               // Log the action
               PotionUse.next(Game.player);

               Game.player.health = Math.min(Game.player.health + 4, Game.player.max_health);
               Game.player.potions --;
               Game.player.sfxPowerup.play();
               Game.action(0, 0);
            }
         }
         if (game.input.mute && muteTimer<=0) {
            buzz.all().toggleMute();
            muteTimer = 20;
         }
         if (game.input.interact) {
            if (!Game.dialogManager.advanceButton && Game.dialogManager.isActive()) {
               Game.dialogManager.advanceButton = true;
               Game.dialogManager.advance();
            }
         }
         else {
            Game.dialogManager.advanceButton = false;
         }
         muteTimer = Math.max(muteTimer-1, 0);
      }

      Game.action = function(dir_x, dir_y) {
         if (dir_y != 0 || dir_x != 0) {
            Game.player.action(dir_x, dir_y, Game, Game.currentRoom);
         }

         Game.currentRoom.action();

         actionCooldown = 0.1;

         if (Game.player.isDead()) {
            game.popScene();
            buzz.all().stop();
            game.pushScene(Scenes.Death(game));
         }
      }
      
      return Game;
   };


})(window.Scenes, window.Classes);
