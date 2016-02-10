/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.backgroundColor = "black";
      // Really don't know why clone is needed
      // but the game flips out without it
      Game.bgm = new buzz.sound("assets/sounds/dungeon.mp3", {loop:true});

      Game.moveRooms = function(dir) {
         Game.setRoom(Game.currentRoom.getNeighbor(dir));

         Game.currentRoom.movePlayerToDoorway(Game.player, Utils.to.opposite(dir));
      };

      Game.setRoom = function(room) {
         // Remove old room
         if (Game.currentRoom) {
            Game.currentRoom.removeChild(Game.player);
            Game.currentRoom.removeChild(Game.HUD);
            Game.removeChild(Game.currentRoom);
         }

         // Add new room
         Game.currentRoom = room;
         Game.addChild(Game.currentRoom);
         Game.currentRoom.addToScene(Game.player);
         Game.currentRoom.addChild(Game.HUD);
      };

      Game.player = new Classes.Player(Math.floor(C.MAP_WIDTH / 2), Math.floor(C.MAP_HEIGHT / 2));
      Game.HUD = new Classes.HUD(Game.player);

      // Create first room
      Game.dungeonGenerator = new Classes.DungeonGenerator();
      Game.setRoom(Game.dungeonGenerator.createDungeon());
      Game.bgm.play();

      // Checks if any entity is still moving
      var actionCooldown = 0;
      Game.waitingOnMovement = function() {
         if (Game.player.isAnimating()) return true;
         if (Game.currentRoom.isAnimating()) return true;

         if (actionCooldown > 0) return true;

         return false;
      }

      Game.onenterframe = function() {
         // Enchant doesn't support looping... what garbage
         // Have to loop bgm manually
         if (Game.bgm.currentTime >= Game.bgm.duration ) {
            Game.bgm.play();
         }

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
      }

      Game.action = function(dir_x, dir_y) {
         Game.player.action(dir_x, dir_y, Game, Game.currentRoom);
         Game.currentRoom.action();

         actionCooldown = 0.3;

         if (Game.player.isDead()) {
            game.popScene();
            game.pushScene(Scenes.Death(game));
            Game.bgm.stop();
         }
      }
      
      return Game;
   };


})(window.Scenes, window.Classes);
