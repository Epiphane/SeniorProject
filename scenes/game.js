/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.dialogueManager = new Classes.Dialogue();
      Game.backgroundColor = "black";
      Game.bgm = new buzz.sound("assets/sounds/dungeon.mp3", {loop:true});
      var muteTimer = 20;

      // Create a new game object
      window.currentGame = new ParseGame();
      window.currentGame.save();

      // Not sure where else to put this
      Game.moveRooms = function(dir) {
         Game.setRoom(Game.currentRoom.getNeighbor(dir));

         Game.currentRoom.movePlayerToDoorway(Game.player, Utils.to.opposite(dir));
      };

      Game.descend = function() {
         if (game.currentRoom) {
            window.currentGame.set('dungeons_completed', window.currentGame.get('dungeons_completed') + 1);
            window.currentGame.save();
         }

         // Create first room
         Game.player.position.x = Game.player.position.y = 0;
         Game.player.snapToPosition();
         Game.dungeonGenerator = new Classes.DungeonGenerator();
         Game.setRoom(Game.dungeonGenerator.createDungeon());
      };

      Game.setRoom = function(room) {
         // Remove old room
         if (Game.currentRoom) {
            Game.currentRoom.onExit();
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

      Game.bgm.play();
      Game.descend();

      // Checks if any entity is still moving
      var actionCooldown = 0;
      Game.waitingOnMovement = function() {
         if (Game.player.isAnimating()) return true;
         if (Game.currentRoom.isAnimating()) return true;
         if (Game.dialogueManager.isActive()) return true;

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
         }
         if (game.input.mute && muteTimer<=0) {
            buzz.all().toggleMute();
            muteTimer = 20;
         }
         if (game.input.interact && muteTimer<=0) {
            if (Game.dialogueManager.isActive()) {
               Game.dialogueManager.advance();
               muteTimer = 5;
            }
         }
         muteTimer = Math.max(muteTimer-1, 0);

      }

      Game.action = function(dir_x, dir_y) {
         Game.player.action(dir_x, dir_y, Game, Game.currentRoom);
         Game.currentRoom.action();

         actionCooldown = 0.1;

         if (Game.player.isDead()) {
            game.popScene();
            game.pushScene(Scenes.Death(game));
            Game.bgm.stop();
         }
      }
      
      return Game;
   };


})(window.Scenes, window.Classes);
