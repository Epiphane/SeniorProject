/*
 * The Game state! Yay!
 */

(function(Scenes, Classes) {
   Scenes.Game = function(game) {
      var Game = new Scene();
      Game.backgroundColor = "black";
      
      player = new Classes.Player(10, 10);
      Game.addChild(player);      
      return Game;
      map = new Room(null, null, 0, 0, 0);
      speech = new SpeechAct();
         
      metrics.levelInit(player.strength, player.defense, player.health, player.numPotions, player.numKeys);
      minRooms = metrics.getMinRooms();
      console.log("Min Rooms: " + minRooms);
         
      Game.addChild(map);
      Game.addChild(new Hud());
      Game.addChild(map.chests);
      Game.addChild(map.items);
      Game.addChild(new EnemyGroup(0, map, UP));
      Game.addChild(player);      
      sceneList.push(Game);
      player.age = 0;
      exitPlaced = false;
      
      if (levelType == 0) {
         game.pushScene(Game);
         map.createFirstRoom();
      }
      else {
         game.replaceScene(Game);
         player.x = GRID*(ROOM_WID_MAX-1)/2;
         player.y = GRID*(ROOM_HIG_MAX-1)/2;
         player.direction = P_DOWN;
         if (levelType == 1)
            player.hasOrb = player.seenOrb = false;
         else if (levelType == 2) {
            map.createLastRoom();
            player.hasOrb = player.seenOrb = true;
         }
      }
      
      speech.triggerEvent();
   };
})(window.Scenes, window.Classes);
