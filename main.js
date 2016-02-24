enchant();

var WINDOW = 600;

/* Set up the core game */
window.onload = function() {
   game = new Game(C.GAME_SIZE, C.GAME_SIZE);
   game.fps = 60;
   game.rootScene.backgroundColor = "black";

   // Set up assets and key bindings for the game
   Constants.preloadAssets(game);
   Constants.bindKeys(game);
   ClassManager.initialize(game);
   EM.init(game);
   
   game.onload = function() {
      game.pushScene(Scenes.Title(game));
   };
      
   /*
    * Initializes a new level and creates the first room 
    * Parameters:
    *    levelType = Specifies the type of level to create:
    *                0 -> first level
    *                1 -> normal level
    *                2 -> conclusion room
    */
   game.initLevel = function(levelType) {
   }
   
   /* 
    * Changes the scene to a different room. If the room already exists, the
    * corresponding scene will be used. If the room has not been visited,
    * a new room and scene will be created and used.
    * Parameters:
    *    dir = The direction the player moves in to get to the new room 
    */
   game.changeRoom = function(dir) {
      var nextScene = curScene;
      var nextRoom;
      var isNewRoom = false;
      var toCheck;
      var count;
      
      curScene.removeChild(player);
      speech.removeTextBox();
      
      if ((dir == NORTH && map.North == true) || (dir == SOUTH && map.South == true) ||
          (dir == EAST && map.East == true) || (dir == WEST && map.West == true) ||
          (dir == UP && map.Up == true) || (dir == DOWN && map.Down == true)) {
         if (dir == NORTH)
            nextRoom = new Room(dir, curScene, map.xRoom, map.yRoom+1, map.zRoom);
         else if (dir == SOUTH)
            nextRoom = new Room(dir, curScene, map.xRoom, map.yRoom-1, map.zRoom);
         else if (dir == EAST)
            nextRoom = new Room(dir, curScene, map.xRoom+1, map.yRoom, map.zRoom);
         else if (dir == WEST)
            nextRoom = new Room(dir, curScene, map.xRoom-1, map.yRoom, map.zRoom);
         else if (dir == UP)
            nextRoom = new Room(dir, curScene, map.xRoom, map.yRoom, map.zRoom+1);
         else
            nextRoom = new Room(dir, curScene, map.xRoom, map.yRoom, map.zRoom-1);
            
         nextScene = new Scene();
         nextScene.backgroundColor = "black";
         nextScene.addChild(nextRoom);
         nextScene.addChild(new Hud());
         nextScene.addChild(nextRoom.chests);
         nextScene.addChild(nextRoom.items);
         nextScene.addChild(new EnemyGroup(metrics.getMaxEnemies(), nextRoom, dir));

         /* Check other rooms for map consistency */
         for (count = 0; count < sceneList.length; count++) {
            toCheck = sceneList[count].firstChild;
            if (toCheck.xRoom == nextRoom.xRoom && toCheck.yRoom == nextRoom.yRoom+1 &&
                toCheck.zRoom == nextRoom.zRoom) { /* Existing room to the north */
               if (toCheck.South == true) {
                  nextRoom.North = sceneList[count];
                  nextRoom.editTile(nextRoom.wallN, (ROOM_WID_MAX-1)/2, NORTH);
                  nextRoom.editCollision(nextRoom.wallN, (ROOM_WID_MAX-1)/2, 0);
                  if (nextRoom.tiles[nextRoom.wallN+1][(ROOM_WID_MAX-1)/2] == 1 || 
                      nextRoom.tiles[nextRoom.wallN+1][(ROOM_WID_MAX-1)/2] == 2) {
                     nextRoom.editTile(nextRoom.wallN+1, (ROOM_WID_MAX-1)/2, 0);
                     nextRoom.editCollision(nextRoom.wallN+1, (ROOM_WID_MAX-1)/2, 0);
                  }
                  toCheck.South = nextScene;
               }
               else {
                  nextRoom.North = false;
                  if (nextRoom.tiles[nextRoom.wallN+1][(ROOM_WID_MAX-1)/2] == 1 || 
                      nextRoom.tiles[nextRoom.wallN+1][(ROOM_WID_MAX-1)/2] == 2)
                     nextRoom.editTile(nextRoom.wallN, (ROOM_WID_MAX-1)/2, 1)
                  else
                     nextRoom.editTile(nextRoom.wallN, (ROOM_WID_MAX-1)/2, 2)
                  nextRoom.editCollision(nextRoom.wallN, (ROOM_WID_MAX-1)/2, 1);
               }
            }
            if (toCheck.xRoom == nextRoom.xRoom && toCheck.yRoom == nextRoom.yRoom-1 &&
                toCheck.zRoom == nextRoom.zRoom) { /* Existing room to the south */
               if (toCheck.North == true) {
                  nextRoom.South = sceneList[count];
                  nextRoom.editTile(nextRoom.wallS, (ROOM_WID_MAX-1)/2, SOUTH);
                  nextRoom.editCollision(nextRoom.wallS, (ROOM_WID_MAX-1)/2, 0);
                  if (nextRoom.tiles[nextRoom.wallS-1][(ROOM_WID_MAX-1)/2] == 1 || 
                      nextRoom.tiles[nextRoom.wallS-1][(ROOM_WID_MAX-1)/2] == 2) {
                     nextRoom.editTile(nextRoom.wallS-1, (ROOM_WID_MAX-1)/2, 0);
                     nextRoom.editCollision(nextRoom.wallS-1, (ROOM_WID_MAX-1)/2, 0);
                  }
                  toCheck.North = nextScene;
               }
               else {
                  nextRoom.South = false;
                  nextRoom.editTile(nextRoom.wallS, (ROOM_WID_MAX-1)/2, 1)
                  nextRoom.editCollision(nextRoom.wallS, (ROOM_WID_MAX-1)/2, 1);
               }
            }
            if (toCheck.xRoom == nextRoom.xRoom+1 && toCheck.yRoom == nextRoom.yRoom &&
                toCheck.zRoom == nextRoom.zRoom) { /* Existing room to the east */
               if (toCheck.West == true) {
                  nextRoom.East = sceneList[count];
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2, nextRoom.wallE, EAST);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2 - 1, nextRoom.wallE, 2);
                  nextRoom.editCollision((ROOM_HIG_MAX-1)/2, nextRoom.wallE, 0);
                  if (nextRoom.tiles[(ROOM_HIG_MAX-1)/2][nextRoom.wallE-1] == 1 || 
                      nextRoom.tiles[(ROOM_HIG_MAX-1)/2][nextRoom.wallE-1] == 2) {
                     nextRoom.editTile((ROOM_HIG_MAX-1)/2, nextRoom.wallE-1, 0);
                     nextRoom.editCollision((ROOM_HIG_MAX-1)/2, nextRoom.wallE-1, 0);
                  }
                  toCheck.West = nextScene;
               }
               else {
                  nextRoom.East = false;
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2, nextRoom.wallE, 1)
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2 - 1, nextRoom.wallE, 1)
                  nextRoom.editCollision((ROOM_HIG_MAX-1)/2, nextRoom.wallE, 1);
               }
            }
            if (toCheck.xRoom == nextRoom.xRoom-1 && toCheck.yRoom == nextRoom.yRoom &&
                toCheck.zRoom == nextRoom.zRoom) { /* Existing room to the west */
               if (toCheck.East == true) {
                  nextRoom.West = sceneList[count];
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2, nextRoom.wallW, WEST)
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2 - 1, nextRoom.wallW, 2)
                  nextRoom.editCollision((ROOM_HIG_MAX-1)/2, nextRoom.wallW, 0);
                  if (nextRoom.tiles[(ROOM_HIG_MAX-1)/2][nextRoom.wallW+1] == 1 || 
                      nextRoom.tiles[(ROOM_HIG_MAX-1)/2][nextRoom.wallW+1] == 2) {
                     nextRoom.editTile((ROOM_HIG_MAX-1)/2, nextRoom.wallW+1, 0);
                     nextRoom.editCollision((ROOM_HIG_MAX-1)/2, nextRoom.wallW+1, 0);
                  }
                  toCheck.East = nextScene;
               }
               else {
                  nextRoom.West = false;
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2, nextRoom.wallW, 1)
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2 - 1, nextRoom.wallW, 1)
                  nextRoom.editCollision((ROOM_HIG_MAX-1)/2, nextRoom.wallW, 1);
               }
            }
            if (toCheck.xRoom == nextRoom.xRoom && toCheck.yRoom == nextRoom.yRoom &&
                toCheck.zRoom == nextRoom.zRoom+1) { /* Existing room above */
               if (toCheck.Down == true) {
                  nextRoom.resetRoom();
                  nextRoom.Up = sceneList[count];
                  
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2, (ROOM_WID_MAX-1)/2, UP);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2-1, (ROOM_WID_MAX-1)/2, 1);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2-1, (ROOM_WID_MAX-1)/2+1, 1);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2, (ROOM_WID_MAX-1)/2+1, 1);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2+1, (ROOM_WID_MAX-1)/2+1, 2);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2+1, (ROOM_WID_MAX-1)/2, 2);
                  
                  nextScene.removeChild(nextScene.lastChild);
                  nextRoom.populateRoom();
                  nextScene.addChild(new EnemyGroup(metrics.getMaxEnemies(), nextRoom, dir));
                  toCheck.Down = nextScene;
                  
                  if (dir != DOWN)
                     metrics.totalStairs--;
               }
               else {
                  nextRoom.Up = false;
                  if (nextRoom.Down == false && nextRoom.tiles[(ROOM_HIG_MAX-1)/2][(ROOM_WID_MAX-1)/2] != NEXT_LEVEL) {
                     nextRoom.editTile((ROOM_HIG_MAX-1)/2, (ROOM_WID_MAX-1)/2, 0);
                     nextRoom.editTile((ROOM_HIG_MAX-1)/2-1, (ROOM_WID_MAX-1)/2, 2);
                     nextRoom.editCollision((ROOM_HIG_MAX-1)/2, (ROOM_WID_MAX-1)/2, 0);
                     metrics.totalStairs--;
                  }
               }
            }
            if (toCheck.xRoom == nextRoom.xRoom && toCheck.yRoom == nextRoom.yRoom &&
                toCheck.zRoom == nextRoom.zRoom-1) { /* Existing room below */
               if (toCheck.Up == true) {
                  nextRoom.resetRoom();
                  nextRoom.Down = sceneList[count];
                     
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2, (ROOM_WID_MAX-1)/2, DOWN);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2-1, (ROOM_WID_MAX-1)/2, 2);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2-1, (ROOM_WID_MAX-1)/2-1, 1);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2, (ROOM_WID_MAX-1)/2-1, 1);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2+1, (ROOM_WID_MAX-1)/2-1, 2);
                  nextRoom.editTile((ROOM_HIG_MAX-1)/2+1, (ROOM_WID_MAX-1)/2, 2);
                  
                  nextScene.removeChild(nextScene.lastChild);
                  nextRoom.populateRoom();
                  nextScene.addChild(new EnemyGroup(metrics.getMaxEnemies(), nextRoom, dir));
                  toCheck.Up = nextScene;
                  
                  if (dir != UP)
                     metrics.totalStairs--;
               }
               else {
                  nextRoom.Down = false;
                  if (nextRoom.Up == false && nextRoom.tiles[(ROOM_HIG_MAX-1)/2][(ROOM_WID_MAX-1)/2] != NEXT_LEVEL) {
                     nextRoom.editTile((ROOM_HIG_MAX-1)/2, (ROOM_WID_MAX-1)/2, 0);
                     nextRoom.editCollision((ROOM_HIG_MAX-1)/2, (ROOM_WID_MAX-1)/2, 0);
                     metrics.totalStairs--;
                  }
               }
            }
         }
         
         sceneList.push(nextScene);
         isNewRoom = true;
         metrics.roomsVisited++;
         console.log("New Room #" + sceneList.length);
      }
      
      if (dir == NORTH) {
         if (!isNewRoom) {
            nextScene = map.North;
            nextRoom = nextScene.firstChild;
            console.log("Is old Room");
         }
         player.x = GRID * (ROOM_WID_MAX-1)/2;
         player.y = GRID * (nextRoom.wallS-1);
      }
      else if (dir == SOUTH) {
         if (!isNewRoom) {
            nextScene = map.South;
            nextRoom = nextScene.firstChild;
            console.log("Is old Room");
         }
         player.x = GRID * (ROOM_WID_MAX-1)/2;
         player.y = GRID * (nextRoom.wallN+1);
      }
      else if (dir == EAST) {
         if (!isNewRoom) {
            nextScene = map.East;
            nextRoom = nextScene.firstChild;
            console.log("Is old Room");
         }
         player.x = GRID * (nextRoom.wallW+1);
         player.y = GRID * (ROOM_HIG_MAX-1)/2;
      }
      else if (dir == WEST) {
         if (!isNewRoom) {
            nextScene = map.West;
            nextRoom = nextScene.firstChild;
            console.log("Is old Room");
         }
         player.x = GRID * (nextRoom.wallE-1);
         player.y = GRID * (ROOM_HIG_MAX-1)/2;
      }
      else if (dir == UP) {
         if (!isNewRoom) {
            nextScene = map.Up;
            nextRoom = nextScene.firstChild;
            console.log("Is old Room");
         }
         if (!map.stairsUsed && !nextRoom.stairsUsed) {
            map.stairsUsed = nextRoom.stairsUsed = true;
            metrics.stairsTaken++;
         }
         player.x = GRID * ((ROOM_WID_MAX-1)/2 + 1);
         player.y = GRID * (ROOM_HIG_MAX-1)/2;
         player.direction = P_RIGHT;
      }
      else if (dir == DOWN) {
         if (!isNewRoom) {
            nextScene = map.Down;
            nextRoom = nextScene.firstChild;
            console.log("Is old Room");
         }
         if (!map.stairsUsed && !nextRoom.stairsUsed) {
            map.stairsUsed = nextRoom.stairsUsed = true;
            metrics.stairsTaken++;
         }
         player.x = GRID * ((ROOM_WID_MAX-1)/2 - 1);
         player.y = GRID * (ROOM_HIG_MAX-1)/2;
         player.direction = P_LEFT;
      }
      
      nextScene.addChild(player);
      game.replaceScene(nextScene);
      curScene = nextScene;
      map = nextRoom;
      
      speech.triggerEvent();
      
      metrics.doorsEntered++;     
   }, 
   
   /* 
    * Adjusts the player's stats according to what item was picked up.
    * Parameters:
    *    item = frame number of the item that was picked up
    */
   game.processPickup = function(item) {
      var newSound = game.assets['assets/sounds/swap.wav'].clone();
      
      if (item != -1 || player.hasOrb)
         newSound.play();
   
      if (item == POTION) {
         map.items.tiles[player.y/GRID][player.x/GRID] = -1;
         player.numPotions++;
      }
      else if (item == KEY) {
         map.items.tiles[player.y/GRID][player.x/GRID] = -1;
         player.numKeys++;
      }
      else if (item == ORB) {
         map.items.tiles[player.y/GRID][player.x/GRID] = -1;
         player.hasOrb = true;
         metrics.takeOrb();
      }
      else if (item == -1 && player.hasOrb) {
         map.items.tiles[player.y/GRID][player.x/GRID] = ORB;
         player.hasOrb = false;
         metrics.dropOrb();
      }
      else if (item == 7) {   // Normal sword
         player.strength = 7;
         player.defSword = 0;
         player.walkSpeed = 4;
         player.swingSpeedMult = 1;
         player.maxHealth = 100;
         player.ability = NO_ABILITY;
      }
      else if (item == 8) {   // Ice sword
         player.strength = 7;
         player.defSword = 0;
         player.walkSpeed = 4;
         player.swingSpeedMult = 1;
         player.maxHealth = 75;
         player.ability = ICE_ABILITY;
      }
      else if (item == 9) {   // Earth sword
         player.strength = 7;
         player.defSword = 3;
         player.walkSpeed = 4;
         player.swingSpeedMult = 1.5;
         player.maxHealth = 100;
         player.ability = NO_ABILITY;
      }
      else if (item == 10) {  // Light sword
         player.strength = 3;
         player.defSword = 0;
         player.walkSpeed = 8;
         player.swingSpeedMult = 1;
         player.maxHealth = 100;
         player.ability = NO_ABILITY;
      }
      else if (item == 11) {  // Fire sword
         player.strength = 10;
         player.defSword = -2;
         player.walkSpeed = 4;
         player.swingSpeedMult = 1;
         player.maxHealth = 90;
         player.ability = NO_ABILITY;
      }
      else if (item == 12) {  // Poison sword
         player.strength = 2;
         player.defSword = 0;
         player.walkSpeed = 4;
         player.swingSpeedMult = 1;
         player.maxHealth = 100;
         player.ability = POISON_ABILITY;
      }
      else if (item == 13) {  // Water sword
         player.strength = 3;
         player.defSword = 0;
         player.walkSpeed = 4;
         player.swingSpeedMult = 0.8;
         player.maxHealth = 110;
         player.ability = NO_ABILITY;
      }
      else if (item == 14)    // Shields
         player.defShield = 1;
      else if (item == 15)
         player.defShield = 2;
      else if (item == 16)
         player.defShield = 3;
      else if (item == 17)
         player.defShield = 4;
      else if (item == 18)
         player.defShield = 5;
      else if (item == 19)
         player.defShield = 6;
      else if (item == 20)
         player.defShield = 7;
         
      if (player.health > player.maxHealth)
         player.health = player.maxHealth;
         
      if (item >= 7 && item < 14) {
         map.items.tiles[player.y/GRID][player.x/GRID] = player.sword == 1 ? -1 : player.sword;
         player.sword = item;
      }
      else if (item >= 14 && item < 21) {
         map.items.tiles[player.y/GRID][player.x/GRID] = player.shield;
         player.shield = item;
      }
      
      player.defense = player.defSword + player.defShield;
      
      map.items.loadData(map.items.tiles);
   }, 
   
   /*
    * Returns true or false if the sword or shield broke. The chance of an item
    * breaking depends on how long the player has held the orb.
    * Parameters:
    *    item = the frame of the item that could break
    */
   game.itemBreak = function (item) {
      var didBreak = false;
      var newSound;
      
      if (Math.random() < metrics.getBreakChance() && item >= 7 && item < 21) {
         didBreak = true;
         newSound = game.assets['assets/sounds/shatter.wav'].clone();
         newSound.play();
         
         if (item < 14) {  // Sword
            player.strength = 3;
            player.defSword = 0;
            player.walkSpeed = 4;
            player.swingSpeedMult = 1;
            player.maxHealth = 100;
            player.ability = NO_ABILITY;
            player.sword = 1;
         }
         else {   // Shield
            player.defShield = 0;
            player.shield = -1;
         }
         
         player.defense = player.defSword + player.defShield;
      }
      
      return didBreak;
   }
   
   /*
    * Returns the frame of a random item (change constants to vary probability)
    * Currently, key = 40%, potion = 24%, sword = 18%, shield = 18%.
    * Increase the chance of a key to 70% if the player hasn't seen the orb and
    * doesn't have any keys.
    * Parameters:
    *    wantOrb = true if there is a possibility of returning the orb
    */
   game.getRandomItem = function(wantOrb) {
      var itemFrame;
      var orbChance = metrics.getOrbChance();
      var randomNum = Math.random();
      
      if (wantOrb && !player.seenOrb && Math.random() < orbChance) {
         itemFrame = ORB;
         player.seenOrb = true;
      }
      else if (!player.seenOrb && orbChance >= 1 && player.numKeys == 0 && randomNum < 0.7) {
         itemFrame = KEY;
         metrics.totalKeys++;
      }
      else if (randomNum < 0.4) {
         itemFrame = KEY;
         metrics.totalKeys++;
      }
      else if (randomNum < 0.64)
         itemFrame = POTION;
      else
         itemFrame = Math.floor(Math.random() * 14) + 7;
                              
      return itemFrame;
   },
   
   /*
    * Returns a random damage value based on the strength of the attacker and
    * the defense of the defender.
    * Parameters:
    *    str = strength stat of the attacker
    *    def = defense stat of the defender
    *    accuracy = chance that the attacker will hit (0-1)
    */
   game.getDamage = function(str, def, accuracy) {
      var dmg = 0;
      var range = str/2 < 3 ? 3 : str/2;
      if (Math.random() < accuracy) {
         if (str > def)
            dmg = str + Math.floor(Math.random() * range) - def;
         else 
            dmg = Math.floor(Math.random() * range/2) + 1;
      }
      return dmg;
   },
   
   /* 
    * End the current level and display the metrics.
    * Parameters:
    *    endType = An int specifying how the level was ended:
    *              0 -> The player reached the end of a normal level
    *              1 -> The player died
    *              2 -> The player completed the game successfully
    *              3 -> The player completed the game unsuccessfully and must go through another level
    */
   game.endLevel = function(endType) {
      // if (//aud.isPlaying()) 
         //aud.togglePause();
   
      metrics.calculateAverages();
      metrics.endLevel();
   
      var results = new Scene();
      results.backgroundColor = "black"
      
      var title;
      if (endType == 1)
         title = Utils.createLabel("GAME OVER", 0, 50, "28px sans-serif");
      else if (endType == 2)
         title = Utils.createLabel("YOU'VE ESCAPED THE DUNGEON", 0, 50, "28px sans-serif");
      else
         title = Utils.createLabel("LEVEL COMPLETE", 0, 50, "28px sans-serif");
      
      var metricLabel = Utils.createLabel("Attack: " + metrics.str + "<br>" +
                                    "Change in Attack: " + (metrics.str-metrics.strAtStart) + "<br>" +
                                    "Defense: " + metrics.def + "<br>" +
                                    "Change in Defense: " + (metrics.def-metrics.defAtStart) + "<br>" +
                                    "Damage dealt: " + metrics.dmgDealt + "<br>" +
                                    "Damage taken: " + metrics.dmgTaken + "<br>" +
                                    "Slugs killed: " + metrics.strongEnemyKills + " / " + metrics.totalStrongEnemies + "<br>" +
                                    "Bats killed: " + metrics.fastEnemyKills + " / " + metrics.totalFastEnemies + "<br>" +
                                    "Accuracy: " + metrics.accuracy * 100 + "%" + "<br>" +
                                    "Potions used: " + metrics.potionsUsed + "<br>" +
                                    "Max health: " + metrics.maxHealth + "<br>" +
                                    "Min health: " + metrics.minHealth + "<br>" +
                                    "Rooms visited: " + metrics.roomsVisited + "<br>" +
                                    "Doors entered: " + metrics.doorsEntered + "<br>" +
                                    "Staircases taken: " + metrics.stairsTaken + " / " + metrics.totalStairs + "<br>" +
                                    "Steps taken: " + metrics.stepsTaken + "<br>" +
                                    "Total time (seconds): " + metrics.time + "<br>"  +
                                    " <br> <br>" +
                                    "Press space to continue",
                                    0, 110, "12px sans-serif");
                                    
      title.width = metricLabel.width = WINDOW;
      title.textAlign = metricLabel.textAlign = "center";
      
      results.addChild(title);
      results.addChild(metricLabel);
      
      results.addEventListener(Event.INPUT_START, function() {
         if (game.input.select) {
            var newSound = game.assets['assets/sounds/select2.wav'].clone();
            newSound.play();
            curScene = null;
            map = null;
            sceneList.splice(0, sceneList.length);
            
            if (endType == 1 || endType == 2)   /* Go back to the main menu */
               game.popScene();
            else if (endType != 3 && metrics.isEndReached())    /* Create the concluding room */
               game.initLevel(2);
            else                                /* Create a normal level */
               game.initLevel(1);
         }
      });
      
      game.replaceScene(results);
   }
   
   game.start();
};


