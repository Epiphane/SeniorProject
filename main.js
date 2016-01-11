enchant();

var GRID = 32;
var WINDOW = GRID * 17;

var ROOM_WID_INIT = 11; /* Room Dimensions */
var ROOM_HIG_INIT = 9;
var ROOM_WID_MAX = 17;
var ROOM_HIG_MAX = 15;
var ROOM_WID_MIN = 7;
var ROOM_HIG_MIN = 7;

var NORTH = 8;    /* Tile numbers for the different exits */
var SOUTH = 9;
var EAST = 10;
var WEST = 11;
var DOWN = 4;
var UP = 5;
var NEXT_LEVEL = 7;
var GAME_EXIT = 12;
var PIT = 13;

var P_UP = 3;     /* Directions for the player */
var P_DOWN = 0;
var P_LEFT = 1;
var P_RIGHT = 2;

var CHEST_CLOSED = 2;   /* Frame numbers for items and chests */
var CHEST_OPEN = 3;
var POTION = 0;
var KEY = 4
var ORB = 6;

var NO_ABILITY = 1;     /* Constants for sword abilities */
var ICE_ABILITY = 2;
var POISON_ABILITY = 3;

var ENEMIES = 3;   /* Index of the EnemyGroup child in the scene */

/* These variables keep track of the current room's info. These are updated
 * when the room changes */
var map;
var curScene;

var player;
var sceneList = Array();
var minRooms;
var exitPlaced = false; // Keeps track if the exit portal has been placed in the level

var speech; // Keeps track of the game's state for dialogue

/* Generic function that creates a label */
var createLabel = function(text, x, y, font, color) {
   var newLabel = new Label();
   newLabel.text = text;
   newLabel.x = x;
   newLabel.y = y;
   newLabel.font = typeof(font) !== "undefined" ? font : "14px sans-serif";
   newLabel.color = typeof(color) !== "undefined" ? color : "white";
   return newLabel;
};

/*
 * The SpeechAct class triggers events and text boxes for dialogue.
 */
SpeechAct = Class.create({
   initialize: function() {
      this.textBox = null;
      this.textTimer = 0;
      this.time = 0;
   },
   
   /* If there is an event, display a text box with dialogue for a certain amount of time */
   triggerEvent: function() {
      // getDialogue(metrics, player); // *** Call speech act function here. Should return a string ***
      if (0) { // Change this to "if text is returned" i.e. "text is not an empty string"
         this.time = 5;
         this.textBox = new TextBox(player.y/GRID); 
         this.textBox.customText("Some important event happened!<br> <br>Fill in dialogue here!");
         curScene.addChild(this.textBox);
            
         clearInterval(this.textTimer);
         this.textTimer = setTimeout(function() {
            curScene.removeChild(speech.textBox);
            speech.textBox = null;
         }, this.time * 1000);
      }
   },
   
   /* Remove the event dialogue if leaving the room before it's over */
   removeTextBox: function() {
      if (this.textBox != null) {
         curScene.removeChild(this.textBox);
         this.textBox = null;
         clearInterval(this.textTimer);
      }
   }
});

/* 
 * The Hud class displays the player's stats (health, # of potions, weapons) 
 * on the bottom of the screen
 */
Hud = Class.create(Group, {
   initialize: function() {
      Group.call(this);
      var hudX = 80;
      var hudY = game.height - GRID*2;
      
      this.weaponBox = new Sprite(36, 36);
      this.weaponBox.image = game.assets["assets/images/hud.png"];
      this.weaponBox.x = hudX + 148;
      this.weaponBox.y = game.height - GRID*2 + 8;
      
      this.shieldBox = new Sprite(36, 36);
      this.shieldBox.image = game.assets["assets/images/hud.png"];
      this.shieldBox.x = hudX + 262;
      this.shieldBox.y = game.height - GRID*2 + 8;
      
      this.stats1 = createLabel("Health: " + player.health + "/" + player.maxHealth + "<br>" +
                                "Health Potions x " + player.numPotions + "<br>" +
                                "Keys x " + player.numKeys, hudX + 5, hudY + 5, "14px sans-serif");
      
      this.weapon = new Sprite(GRID, GRID);
      this.weapon.image = game.assets["assets/images/items.png"];
      this.weapon.frame = player.sword;
      this.weapon.x = hudX + 150;
      this.weapon.y = hudY + 10;
      
      this.shield = new Sprite(GRID, GRID);
      this.shield.image = game.assets["assets/images/items.png"];
      this.shield.frame = player.shield;
      this.shield.x = hudX + 264;
      this.shield.y = hudY + 10;
      
      this.weaponStats = createLabel("Atk: <br>Def: <br>Effect: ", 
                                     hudX + 190, hudY + 10, "10px sans-serif");
      this.shieldStats = createLabel("Def: " + player.defShield,
                                     hudX + 304, hudY + 10, "10px sans-serif");
      
      this.orb = new Sprite(GRID, GRID);
      this.orb.image = game.assets["assets/images/items.png"];
      this.orb.frame = -1;
      this.orb.x = hudX + 340;
      this.orb.y = game.height - GRID*2 + 10;
      
      this.addChild(this.weaponBox);
      this.addChild(this.shieldBox);
      this.addChild(this.stats1);
      this.addChild(this.weapon);
      this.addChild(this.shield);
      this.addChild(this.weaponStats);
      this.addChild(this.shieldStats);
      this.addChild(this.orb);
   },
   
   onenterframe: function() {
      this.stats1.text = "Health: " + player.health + "/" + player.maxHealth + "<br>" +
                        "Health Potions x " + player.numPotions + "<br>" +
                        "Keys x " + player.numKeys;
      this.weapon.frame = player.sword;
      this.shield.frame = player.shield;  

      var effectStr;
      if (player.sword == 8)
         effectStr = "Freeze";
      else if (player.sword == 9)
         effectStr = "Atk spd x0.67";
      else if (player.sword == 10)
         effectStr = "Walk spd x2";
      else if (player.sword == 12)
         effectStr = "Poison";
      else if (player.sword == 13)
         effectStr = "Atk spd x1.25";
      else
         effectStr = "None";
         
      this.weaponStats.text = "Atk: " + player.strength + "<br>" + 
                              "Def: " + player.defSword + "<br>" +
                              "Effect: <br> " + effectStr;
      this.shieldStats.text = "Def: " + player.defShield;
      
      if (player.hasOrb)
         this.orb.frame = ORB;
      else
         this.orb.frame = -1;
   }
});

/* 
 * The TextBox class is used to display information and dialogue to the player.
 * Parameters:
 *    playerY = the Y position of the player, in number of tiles.
 */
TextBox = Class.create(Group, {
   initialize: function(playerY) {
      Group.call(this);
      
      this.sprite = new Sprite(GRID * ROOM_WID_INIT, 50);
      this.sprite.image = game.assets["assets/images/dialogue.png"];
      this.sprite.originX = this.sprite.originY = 0;
      this.sprite.scaleX = this.sprite.scaleY = 1.5;
      this.sprite.x = WINDOW/2 - this.sprite.width * this.sprite.scaleX / 2;
      this.sprite.y = playerY < ROOM_HIG_MAX/4 ? game.height - GRID*2 - 50 * this.sprite.scaleY : 0;
      
      this.desc = createLabel("", this.sprite.x + 17, this.sprite.y + 15, "14px sans-serif");
      this.desc.textAlign = "center";
      this.desc.width = WINDOW - 55;
      
      this.addChild(this.sprite);
      this.addChild(this.desc);
   },
   
   changeText: function(itemNum) {
      if (itemNum == ORB)
         this.desc.text = "Pearl of the World<br> <br>It seems to possess some sort of mystical power..."
      else if (itemNum == 7)
         this.desc.text = "Steel sword<br> <br>Attack: 7";
      else if (itemNum == 8)
         this.desc.text = "Sword of Ice<br> <br>Attack: 7, Health -25, Slows enemies on hit";
      else if (itemNum == 9)
         this.desc.text = "Sword of Earth<br> <br>Attack: 7, Defense: 3, Attack Speed x0.67";
      else if (itemNum == 10)
         this.desc.text = "Sword of Light<br> <br>Attack: 3, Walking Speed x2";
      else if (itemNum == 11)
         this.desc.text = "Sword of Fire<br> <br>Attack: 10, Defense: -2, Health -10";
      else if (itemNum == 12)
         this.desc.text = "Sword of Poison<br> <br>Attack: 2, Poisons enemies on hit";
      else if (itemNum == 13)
         this.desc.text = "Sword of Water<br> <br>Attack: 3, Attack Speed x1.25, Health +10";
      else if (itemNum == 14)
         this.desc.text = "Toy Shield<br> <br>Defense: 1";
      else if (itemNum == 15)
         this.desc.text = "Wooden Shield<br> <br>Defense: 2";
      else if (itemNum == 16)
         this.desc.text = "Battle Paddle<br> <br>Defense: 3";
      else if (itemNum == 17)
         this.desc.text = "The Protector<br> <br>Defense: 4";
      else if (itemNum == 18)
         this.desc.text = "War Door<br> <br>Defense: 5";
      else if (itemNum == 19)
         this.desc.text = "Splendid Screen<br> <br>Defense: 6";
      else if (itemNum == 20)
         this.desc.text = "Divine Defender<br> <br>Defense: 7";
   },
   
   customText: function(str) {
      this.desc.text = str;
   }
});

/*
 * The Player class keeps track of the character stats and animates and moves
 * the character sprite.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
Player = Class.create(Sprite, {
   initialize: function(x, y) {
      Sprite.call(this, 32, 32);
      this.image = game.assets["assets/images/player.png"];
      this.x = x; /* Relative to the whole map, not the window */
      this.y = y;
      this.frame = 0;
      
      this.isMoving = false;
      this.direction = P_DOWN;
      this.walk = 1;
      this.isAttacking = false;
      this.attackCounter = 0;
      this.cooldown = 0;
      
      /* Character stats */
      this.sword = 1;
      this.strength = 3;
      this.shield = -1;
      this.defense = this.defSword = this.defShield = 0;
      this.health = 100;
      this.maxHealth = 100;
      this.numPotions = 0;
      this.numKeys = 1;
      
      /* Character stats only altered by swords */
      this.walkSpeed = 4;
      this.swingSpeedMult = 1;
      this.ability = NO_ABILITY;
      
      /* Variable to keep track if the player is holding the pearl/orb */
      this.hasOrb = false;
      this.seenOrb = false;
      
      /* Text box associated with the player */
      this.currentText = null;
   },
   
   onenterframe: function() {
      if (!this.isAttacking)
         this.move();
      if (!this.isMoving)
         this.attack();
      if (!this.isAttacking && !this.isMoving) {
         this.checkTextBox();
         this.checkItem();
         this.checkChest();
      }
         
      /* Update music based on misfortune */
      if (this.age % (game.fps*3) == 0)
         aud.adaptPattern(metrics.getAudStress(), metrics.getAudEnergy());
   },
   
   /* Add a text box if the player is standing on an item */
   checkTextBox: function() {
      var tileContents = map.items.checkTile(this.x, this.y);
      var nextToPit = map.checkTile(this.x + GRID, this.y) == PIT ||
                      map.checkTile(this.x - GRID, this.y) == PIT ||
                      map.checkTile(this.x, this.y + GRID) == PIT ||
                      map.checkTile(this.x, this.y - GRID) == PIT;
      var nextToExit = map.checkTile(this.x, this.y + GRID) == GAME_EXIT;
      
      if (speech.textBox == null) {
         if (this.currentText != null && tileContents < 0 && !(nextToPit && player.hasOrb) && !nextToExit) {
            curScene.removeChild(this.currentText);
            this.currentText = null;
         }
         /* Related to being next to a tile */
         else if (nextToPit && player.hasOrb) {
            if (this.currentText == null) {
               this.currentText = new TextBox(this.y/GRID);
               curScene.addChild(this.currentText);
            }
            this.currentText.customText("Throw the pearl in the pit?<br> <br> Press M to throw the pearl in the pit");
         }
         else if (nextToExit) {
            if (this.currentText == null) {
               this.currentText = new TextBox(this.y/GRID);
               curScene.addChild(this.currentText);
            }
            if (player.hasOrb)
               this.currentText.customText("Proceed to leave with the pearl");
            else
               this.currentText.customText("Proceed to leave without the pearl");
         }
         /* Related to items the player is standing on */
         else if (tileContents >= 7 && tileContents < 21 || tileContents == ORB) {
            if (this.currentText == null) {
               this.currentText = new TextBox(this.y/GRID);
               curScene.addChild(this.currentText);
            }
            this.currentText.changeText(tileContents);
         }
      }
   },
   
   /* Process item pickups */
   checkItem: function() {
      var tileContents = map.items.checkTile(this.x, this.y);
      
      if (this.cooldown == 0 && game.input.swapItem && !map.pitRoom || tileContents == POTION || tileContents == KEY) {
         game.processPickup(tileContents);
         metrics.str = player.strength;
         metrics.def = player.defense;
         metrics.potionsHeld = player.numPotions;
         this.cooldown = 5;
      }
      else if (this.cooldown == 0 && game.input.usePotion && player.numPotions > 0 && 
               player.health != player.maxHealth) {
         player.numPotions--;
         player.health = player.health+20 > player.maxHealth ? player.maxHealth : player.health+20;
         
         metrics.potionsUsed++;
         metrics.potionsHeld = player.numPotions;
         if (player.health > metrics.maxHealth)
            metrics.maxHealth = player.health;
            
         this.cooldown = 5;
      }
      else if (map.pitRoom && game.input.swapItem && player.hasOrb &&
               (map.checkTile(this.x + GRID, this.y) == PIT ||
               map.checkTile(this.x - GRID, this.y) == PIT ||
               map.checkTile(this.x, this.y + GRID) == PIT ||
               map.checkTile(this.x, this.y - GRID) == PIT)) {
         var newSound = game.assets['assets/sounds/swap.wav'].clone();
         newSound.play();
         player.hasOrb = false;        
      }
      else if (this.cooldown > 0)
         this.cooldown--;
   },
   
   checkChest: function() {
      if (game.input.select && player.numKeys > 0) {
         if (player.direction == P_UP && map.chests.checkTile(this.x, this.y-GRID) == CHEST_CLOSED) {
            map.chests.tiles[(this.y-GRID)/GRID][this.x/GRID] = CHEST_OPEN;
            map.editCollision((this.y-GRID)/GRID, this.x/GRID, 0);
            map.items.tiles[(this.y-GRID)/GRID][this.x/GRID] = game.getRandomItem(true);
            player.numKeys--;
            metrics.totalKeys--;
            metrics.totalChests--;
         }
         else if (player.direction == P_DOWN && map.chests.checkTile(this.x, this.y+GRID) == CHEST_CLOSED) {
            map.chests.tiles[(this.y+GRID)/GRID][this.x/GRID] = CHEST_OPEN;
            map.editCollision((this.y+GRID)/GRID, this.x/GRID, 0);
            map.items.tiles[(this.y+GRID)/GRID][this.x/GRID] = game.getRandomItem(true);
            player.numKeys--;
            metrics.totalKeys--;
            metrics.totalChests--;
         }
         else if (player.direction == P_LEFT && map.chests.checkTile(this.x-GRID, this.y) == CHEST_CLOSED) {
            map.chests.tiles[this.y/GRID][(this.x-GRID)/GRID] = CHEST_OPEN;
            map.editCollision(this.y/GRID, (this.x-GRID)/GRID, 0);
            map.items.tiles[this.y/GRID][(this.x-GRID)/GRID] = game.getRandomItem(true);
            player.numKeys--;
            metrics.totalKeys--;
            metrics.totalChests--;
         }
         else if (player.direction == P_RIGHT && map.chests.checkTile(this.x+GRID, this.y) == CHEST_CLOSED) {
            map.chests.tiles[this.y/GRID][(this.x+GRID)/GRID] = CHEST_OPEN;
            map.editCollision(this.y/GRID, (this.x+GRID)/GRID, 0);
            map.items.tiles[this.y/GRID][(this.x+GRID)/GRID] = game.getRandomItem(true);
            player.numKeys--;
            metrics.totalKeys--;
            metrics.totalChests--;
         }
         
         map.chests.loadData(map.chests.tiles);
         map.items.loadData(map.items.tiles);
      }
   },
   
   attack: function() {   
      var swingSound;
      if (!this.isAttacking) {
         swingSound = game.assets['assets/sounds/sword_swing.wav'].clone()
         if (game.input.attackLeft) {
            swingSound.play();
            this.direction = P_LEFT;
            this.isAttacking = true;
         }
         else if (game.input.attackRight) {
            swingSound.play();
            this.direction = P_RIGHT;
            this.isAttacking = true;
         }
         else if (game.input.attackUp) {
            swingSound.play();
            this.direction = P_UP;
            this.isAttacking = true;
         }
         else if (game.input.attackDown) {
            swingSound.play();
            this.direction = P_DOWN;
            this.isAttacking = true;
         }
      }

      if (this.isAttacking) {
         this.frame = this.direction * 9 + 6 + (this.attackCounter > 2 ? 2 : this.attackCounter);
         if (++this.attackCounter > metrics.getPlayerAttackSpeed() * this.swingSpeedMult) {
            this.attackCounter = 0;
            this.isAttacking = false;
         }
      }
   },
   
   move: function() {
      this.frame = this.direction * 9 + (this.walk == 3 ? 1 : this.walk);
      if (this.isMoving) {
         this.moveBy(this.vx, this.vy);
         
         if (!(game.frame % 2)) {
            this.walk++;
            this.walk %= 4;
         }
         if ((this.vx && (this.x) % this.width == 0) || (this.vy && this.y % this.height == 0)) { /* 32x32 grid */
            this.isMoving = false;
            metrics.stepsTaken++;

            /* Check if player went through a door */
            var dir = map.checkTile(this.x, this.y);
            if (dir == NORTH || dir == SOUTH || dir == EAST || dir == WEST || dir == UP || dir == DOWN)
               game.changeRoom(dir);
            else if (dir == NEXT_LEVEL && player.hasOrb)    /* End the level */
               game.endLevel(0);
            else if (dir == GAME_EXIT && !player.hasOrb)    /* End the game */
               game.endLevel(2);
            else if (dir == GAME_EXIT && player.hasOrb)     /* Send the player through another level */
               game.endLevel(3);
         }
      } 
      else {
         this.vx = this.vy = 0;
         if (game.input.left) {
            this.direction = P_LEFT;
            if (!map.hitTest(this.x + this.width/2 - GRID, this.y))
               this.vx = -this.walkSpeed;
         } 
         else if (game.input.right) {
            this.direction = P_RIGHT;
            if (!map.hitTest(this.x + this.width/2 + GRID, this.y))
               this.vx = this.walkSpeed;
         } 
         else if (game.input.up) {
            this.direction = P_UP;
            if (!map.hitTest(this.x, this.y + this.height/2 - GRID))
               this.vy = -this.walkSpeed;
         }
         else if (game.input.down) {
            this.direction = P_DOWN;
            if (!map.hitTest(this.x, this.y + this.height/2 + GRID))
               this.vy = this.walkSpeed;
         }
         else {
            this.walk = 1;
         }
         if (this.vx || this.vy) {
            var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
            var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
            if (0 <= x && x < map.width && 0 <= y && y < map.height) {
               this.isMoving = true;
               arguments.callee.call(this);
            }
         }
      }
   },
   
   takeDamage: function(dmg) {
      var hitSound = game.assets['assets/sounds/grunt.wav'].clone();
      this.health -= dmg;
      if (dmg > 0)
         hitSound.play();
      if (this.health <= 0) {
         metrics.dmgTaken += dmg + this.health;
         metrics.minHealth = 0;
         this.health = 0;
         game.endLevel(1);
      }
      else {
         metrics.dmgTaken += dmg;
         if (player.health < metrics.minHealth)
            metrics.minHealth = player.health;
      }
      
      game.itemBreak(player.shield);
   }
});

/* 
 * The Room class creates the layout of each dungeon room 
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
Room = Class.create(Map, {
   initialize: function(dir, scene, x, y, z) {
      if (dir == null) {
         this.roomWidth = ROOM_WID_INIT;
         this.roomHeight = ROOM_HIG_INIT;
      }
      else {
         var dimensions;
         if (metrics.numLevel == 1)
            dimensions = metrics.getRoomDimensions(ROOM_WID_INIT, ROOM_WID_MAX, ROOM_HIG_INIT, ROOM_HIG_MAX);
         else
            dimensions = metrics.getRoomDimensions(ROOM_WID_MIN, ROOM_WID_MAX, ROOM_HIG_MIN, ROOM_HIG_MAX);
         this.roomWidth = dimensions[0];
         this.roomHeight = dimensions[1];
      }
      
      Map.call(this, GRID, GRID);
      this.image = game.assets["assets/images/map.png"];
      this.tiles = new Array(ROOM_HIG_MAX);
      this.collision = new Array(ROOM_HIG_MAX);
      
      this.items = new Map(GRID, GRID);
      this.items.image = game.assets["assets/images/items.png"];
      this.items.tiles = new Array(ROOM_HIG_MAX);
      
      this.chests = new Map(GRID, GRID);
      this.chests.image = game.assets["assets/images/items.png"];
      this.chests.tiles = new Array(ROOM_HIG_MAX);
      
      /* Row and column numbers for the four walls */
      this.wallN = (ROOM_HIG_MAX-this.roomHeight)/2;
      this.wallS = (ROOM_HIG_MAX-this.roomHeight)/2 + this.roomHeight - 1;
      this.wallW = (ROOM_WID_MAX-this.roomWidth)/2;
      this.wallE = (ROOM_WID_MAX-this.roomWidth)/2 + this.roomWidth - 1;
      
      /* Set base tiles (floor and walls) */
      var countRow, countCol;
      for (countRow = 0; countRow < ROOM_HIG_MAX; countRow++) {
         this.tiles[countRow] = new Array(ROOM_WID_MAX);
         this.collision[countRow] = new Array(ROOM_WID_MAX);
         this.items.tiles[countRow] = new Array(ROOM_WID_MAX);
         this.chests.tiles[countRow] = new Array(ROOM_WID_MAX);
         for (countCol = 0; countCol < ROOM_WID_MAX; countCol++) {
            if (countRow >= this.wallN && countRow <= this.wallS && countCol >= this.wallW && countCol <= this.wallE) {
               this.tiles[countRow][countCol] = 0;
               this.items.tiles[countRow][countCol] = -1;
               this.chests.tiles[countRow][countCol] = -1;
               if (countRow == this.wallN)
                  this.tiles[countRow][countCol] = 2;
               if (countRow == this.wallS || countCol == this.wallW || countCol == this.wallE)
                  this.tiles[countRow][countCol] = 1;
            }
         }
      }
      /* Add exits and obstacles to the room */
      this.findExits(dir, scene);
      this.populateRoom();

      /* These three fields keep track of the map topology */
      this.xRoom = x;
      this.yRoom = y;
      this.zRoom = z;
      
      /* Used to determine allowed player actions for the room with the pit */
      this.pitRoom = false;
      
      /* Metric helpers */
      this.stairsUsed = false;
   },
   
   /* Change the collision data of one tile. col and row are tile indexes, not pixels. */
   editCollision: function(row, col, newVal) {
      if (col >= 0 && col < ROOM_WID_MAX && row >= 0 && row < ROOM_HIG_MAX) {
         this.collision[row][col] = newVal;
         this.collisionData = this.collision;
      }
   },
   
   /* Change the frame of one tile. col and row are tile indexes, not pixels. */
   editTile: function(row, col, newVal) {
      if (col >= 0 && col < ROOM_WID_MAX && row >= 0 && row < ROOM_HIG_MAX) {
         this.tiles[row][col] = newVal;
         this.loadData(this.tiles);
      }
   },
   
   /* Removes all walls and items in a room */
   resetRoom: function() {
      var countRow, countCol;
      for (countRow = this.wallN; countRow < this.wallS; countRow++) {
         for (countCol = this.wallW+1; countCol < this.wallE; countCol++) {
            if (countRow == this.wallN && this.tiles[countRow][countCol] == 1)
               this.tiles[countRow][countCol] = 2;
            else if (countRow != this.wallN) {
               this.tiles[countRow][countCol] = 0;
               this.items.tiles[countRow][countCol] = -1;
               this.chests.tiles[countRow][countCol] = -1;
               this.collision[countRow][countCol] = 0;
            }
         }
      }
      
      this.loadData(this.tiles);
      this.collisionData = this.collision;
      this.items.loadData(this.items.tiles);
      this.chests.loadData(this.chests.tiles);
   },
   
   /* Fixes the wall sprites to maintain a consistent look */
   fixObstacleBlocks: function() {
      var countRow, countCol;
      for (countRow = this.wallN+1; countRow <= this.wallS; countRow++) {
         for (countCol = this.wallW; countCol <= this.wallE; countCol++) {
            if (this.tiles[countRow-1][countCol] == 2 && 
                (this.tiles[countRow][countCol] == 1 || this.tiles[countRow][countCol] == 2))
               this.tiles[countRow-1][countCol] = 1;
            else if (this.tiles[countRow-1][countCol] == 1 && this.tiles[countRow][countCol] == 0)
               this.tiles[countRow-1][countCol] = 2;
         }
      }
   },
   
   /* Randomly create room exits, making sure doors connect. */
   findExits: function(dir, scene) {
      var exits = Array();
      var index;
      
      this.North = Math.floor(Math.random() * 3) > 0 ? true : false;
      this.South = Math.floor(Math.random() * 3) > 0 ? true : false;
      this.East = Math.floor(Math.random() * 3) > 0 ? true : false;
      this.West = Math.floor(Math.random() * 3) > 0 ? true : false;
      this.Up = this.Down = false;
      if (Math.random() < metrics.getStairChance() && sceneList.length > 1) {
         if (Math.floor(Math.random() * 2) == 0)
            this.Up = true;
         else
            this.Down = true;
      }
      
      if (!this.North && !this.South && !this.East && !this.West)
         this.North = true;
      
      if (!this.North && this.South && !this.East && !this.West && dir == NORTH)
         this.North = true;
      else if (this.North && !this.South && !this.East && !this.West && dir == SOUTH)
         this.South = true;
      else if (!this.North && !this.South && !this.East && this.West && dir == EAST)
         this.East = true;
      else if (!this.North && !this.South && this.East && !this.West && dir == WEST)
         this.West = true;
      
      /* Get the right amount of exits */
      if (this.North && dir != SOUTH)
         exits.push(NORTH);
      if (this.South && dir != NORTH)
         exits.push(SOUTH);
      if (this.East && dir != WEST)
         exits.push(EAST);
      if (this.West && dir != EAST)
         exits.push(WEST);
      
      while (exits.length > metrics.getMaxExits()) {
         index = Math.floor(Math.random() * exits.length);
         if (exits[index] == NORTH)
            this.North = false;
         else if (exits[index] == SOUTH)
            this.South = false;
         else if (exits[index] == EAST)
            this.East = false;
         else if (exits[index] == WEST)
            this.West = false;
         exits.splice(index, 1);
      }
      
      /* If base number of rooms visited, make all new rooms dead ends */
      if (sceneList.length > minRooms && exitPlaced == true)
         this.North = this.South = this.East = this.West = false;
      else if (sceneList.length >= minRooms && exitPlaced == false && dir != UP && dir != DOWN) {
         this.tiles[(ROOM_HIG_MAX-1)/2][(ROOM_WID_MAX-1)/2] = NEXT_LEVEL;
         this.Up = this.Down = false;
         exitPlaced = true;
      }
            
      /* Create the exits on the map */
      if (this.North == true || dir == SOUTH) {
         this.tiles[this.wallN][(ROOM_WID_MAX-1)/2] = NORTH;
         if (dir == SOUTH) 
            this.North = scene;
      }
      if (this.South == true || dir == NORTH) {
         this.tiles[this.wallS][(ROOM_WID_MAX-1)/2] = SOUTH;
         if (dir == NORTH)
            this.South = scene;
      }
      if (this.East == true || dir == WEST) {
         this.tiles[(ROOM_HIG_MAX-1)/2][this.wallE] = EAST;
         this.tiles[(ROOM_HIG_MAX-1)/2 - 1][this.wallE] = 2;
         if (dir == WEST)
            this.East = scene;
      }
      if (this.West == true || dir == EAST) {
         this.tiles[(ROOM_HIG_MAX-1)/2][this.wallW] = WEST;
         this.tiles[(ROOM_HIG_MAX-1)/2 - 1][this.wallW] = 2;
         if (dir == EAST)
            this.West = scene;
      }
      if ((this.Up == true && dir != UP) || dir == DOWN) {
         this.tiles[(ROOM_HIG_MAX-1)/2][(ROOM_WID_MAX-1)/2] = UP;
         this.tiles[(ROOM_HIG_MAX-1)/2-1][(ROOM_WID_MAX-1)/2] = 1;
         this.tiles[(ROOM_HIG_MAX-1)/2-1][(ROOM_WID_MAX-1)/2+1] = 1;
         this.tiles[(ROOM_HIG_MAX-1)/2][(ROOM_WID_MAX-1)/2+1] = 1;
         this.tiles[(ROOM_HIG_MAX-1)/2+1][(ROOM_WID_MAX-1)/2+1] = 2;
         this.tiles[(ROOM_HIG_MAX-1)/2+1][(ROOM_WID_MAX-1)/2] = 2;
         if (dir == DOWN) {
            this.Up = scene;
            this.Down = false;
         }
         else
            metrics.totalStairs++;
      }
      if ((this.Down == true && dir != DOWN) || dir == UP) {
         this.tiles[(ROOM_HIG_MAX-1)/2][(ROOM_WID_MAX-1)/2] = DOWN;
         this.tiles[(ROOM_HIG_MAX-1)/2-1][(ROOM_WID_MAX-1)/2] = 2;
         this.tiles[(ROOM_HIG_MAX-1)/2-1][(ROOM_WID_MAX-1)/2-1] = 1;
         this.tiles[(ROOM_HIG_MAX-1)/2][(ROOM_WID_MAX-1)/2-1] = 1;
         this.tiles[(ROOM_HIG_MAX-1)/2+1][(ROOM_WID_MAX-1)/2-1] = 2;
         this.tiles[(ROOM_HIG_MAX-1)/2+1][(ROOM_WID_MAX-1)/2] = 2;
         if (dir == UP) {
            this.Down = scene;
            this.Up = false;
         }
         else
            metrics.totalStairs++;
      }
      
      this.loadData(this.tiles);
   }, 
   
   /* Fills the room with walls, chests, and items and sets collision accordingly */
   populateRoom: function() {
      var countRow, countCol;
      var isPath, startX, startY, endX, endY;
      var exitCoords = Array();
      var pathFinder = new EasyStar.js();
      var retry = {Value: false, Attempts: 0};
      var tempTiles = Array(ROOM_HIG_MAX);
      var placeholder = 3; // Arbitrary placeholder tile not used in rooms for chest placement
   
      var obstacleChance = metrics.getObstacleChance();
      var chestChance = metrics.getRoomChestChance();
   
      pathFinder.setAcceptableTiles([0, NEXT_LEVEL, NORTH, SOUTH, EAST, WEST, UP, DOWN]);
      do {
         retry.Value = false;

         /* Populate the map with walls and chests */
         for (countRow = 0; countRow < ROOM_HIG_MAX; countRow++) {
            tempTiles[countRow] = Array(ROOM_WID_MAX);
            for (countCol = 0; countCol < ROOM_WID_MAX; countCol++) {
               tempTiles[countRow][countCol] = this.tiles[countRow][countCol];
               if (tempTiles[countRow][countCol] == 0 && Math.random() < obstacleChance)
                  tempTiles[countRow][countCol] = 2;
               else if (tempTiles[countRow][countCol] == 0 && Math.random() < chestChance)
                  tempTiles[countRow][countCol] = placeholder; 
               if (countRow > 0 && tempTiles[countRow-1][countCol] == 2 &&
                   (tempTiles[countRow][countCol] == 1 || tempTiles[countRow][countCol] == 2))
                  tempTiles[countRow-1][countCol] = 1;
            }
         }
      
         pathFinder.setGrid(tempTiles);

         /* Establishing the tiles that can't be blocked*/
         if (this.North != false) {
            exitCoords.push((ROOM_WID_MAX-1)/2);
            exitCoords.push(this.wallN);
         }
         if (this.South != false) {
            exitCoords.push((ROOM_WID_MAX-1)/2);
            exitCoords.push(this.wallS);
         }
         if (this.East != false) {
            exitCoords.push(this.wallE);
            exitCoords.push((ROOM_HIG_MAX-1)/2);
         }
         if (this.West != false) {
            exitCoords.push(this.wallW);
            exitCoords.push((ROOM_HIG_MAX-1)/2);
         }
         if (this.Up != false) {
            exitCoords.push((ROOM_WID_MAX-1)/2);
            exitCoords.push((ROOM_HIG_MAX-1)/2);
            exitCoords.push(this.wallE - 1);
            exitCoords.push((ROOM_HIG_MAX-1)/2);
         }
         if (this.Down != false) {
            exitCoords.push((ROOM_WID_MAX-1)/2);
            exitCoords.push((ROOM_HIG_MAX-1)/2);
            exitCoords.push(this.wallW + 1);
            exitCoords.push((ROOM_HIG_MAX-1)/2);
         }
         if (exitCoords.length <= 2 || sceneList.length == minRooms || sceneList.length == 0) {
            exitCoords.push((ROOM_WID_MAX-1)/2);
            exitCoords.push((ROOM_HIG_MAX-1)/2);
         }
      
         /* Make sure there is a path to each exit */
         startX = exitCoords.shift();
         startY = exitCoords.shift();
               
         while (exitCoords.length > 0) {
            endX = exitCoords.shift();
            endY = exitCoords.shift();
            /* The callback makes the loop run again if the open paths weren't found */
            pathFinder.findPath(startX, startY, endX, endY, function(path) {
               if (path == null)
                  retry.Value = true;
            });
            pathFinder.calculate();
         }
         exitCoords.length = 0;
      
         if (++retry.Attempts % 5 == 0)
            obstacleChance *= 0.9;
      } while (retry.Value && retry.Attempts < 50);
   
      /* Only set the walls and chests if it didn't time out */
      if (retry.Attempts < 50)
         this.tiles = tempTiles;
   
      /* Put chests, items, and collision in the room */
      for (countRow = this.wallN; countRow <= this.wallS; countRow++) {
         for (countCol = this.wallW; countCol <= this.wallE; countCol++) {
            this.tiles[countRow][countCol] = tempTiles[countRow][countCol];
            this.collision[countRow][countCol] = 0;
            if (this.tiles[countRow][countCol] == 0 && Math.random() < metrics.getRoomItemChance(player.seenOrb, player.numKeys)) {
               if (exitPlaced && !player.seenOrb && metrics.needEmergencyOrb())
                  this.items.tiles[countRow][countCol] = game.getRandomItem(true);
               else
                  this.items.tiles[countRow][countCol] = game.getRandomItem(false);
            }
            else if (this.tiles[countRow][countCol] == placeholder) {
               this.tiles[countRow][countCol] = 0;
               this.chests.tiles[countRow][countCol] = CHEST_CLOSED;
               this.collision[countRow][countCol] = 1;
               metrics.totalChests++;
            }
            else if (this.tiles[countRow][countCol] == 1 || this.tiles[countRow][countCol] == 2)
               this.collision[countRow][countCol] = 1;
         }
      }
      
      this.loadData(this.tiles);
      this.items.loadData(this.items.tiles);
      this.chests.loadData(this.chests.tiles);
      this.collisionData = this.collision;
   },

   /* Initialize the first room of the game */
   createFirstRoom: function() {
      this.resetRoom();
            
      this.items.tiles[5][6] = 8;
      this.items.tiles[5][8] = 9;
      this.items.tiles[5][10] = 10;
      this.items.tiles[7][6] = 7;
      this.items.tiles[9][6] = 11;
      this.items.tiles[9][8] = 12;
      this.items.tiles[9][10] = 13;
      
      this.loadData(this.tiles);
      this.collisionData = this.collision;
      this.items.loadData(this.items.tiles);
      this.chests.loadData(this.chests.tiles);
      
      metrics.totalChests = 0;
      metrics.totalKeys = player.numKeys;
   },
   
   /* Initialize the room with the pit */
   createLastRoom: function() {
      var countRow, countCol;
   
      for (countRow = this.wallN; countRow < this.wallS; countRow++) {
         for (countCol = this.wallW; countCol <= this.wallE; countCol++) {
            if (countRow == this.wallN) {
               this.tiles[countRow][countCol] = 2;
               this.collision[countRow][countCol] = 1;
            }
            if (countCol == this.wallW || countCol == this.wallE) {
               this.tiles[countRow][countCol] = 1;
               this.collision[countRow][countCol] = 1;
            }
            if (countRow != this.wallN && countCol != this.wallW && countCol != this.wallE) {
               this.tiles[countRow][countCol] = 0;
               this.items.tiles[countRow][countCol] = -1;
               this.chests.tiles[countRow][countCol] = -1;
               this.collision[countRow][countCol] = 0;
            }
         }
      }
      
      this.tiles[this.wallS][(ROOM_WID_MAX-1)/2] = GAME_EXIT;
      this.collision[this.wallS][(ROOM_WID_MAX-1)/2] = 0;
      
      this.tiles[this.wallN+2][(ROOM_WID_MAX-1)/2] = PIT;
      this.collision[this.wallN+2][(ROOM_WID_MAX-1)/2] = 1;
      
      this.loadData(this.tiles);
      this.collisionData = this.collision;
      this.items.loadData(this.items.tiles);
      this.chests.loadData(this.chests.tiles);
      
      this.pitRoom = true;
   }
   
});

/*
 * The EnemyGroup class keeps track of all of the enemies in a single room.
 * Parameters:
 *    maxEnemies = The maximum amount of enemies to be in the room
 *    room = A Room object to check for collisions
 *    dir = The direction the player had to go to get to this room
 */
EnemyGroup = Class.create(Group, {
   initialize: function(maxEnemies, room, dir) {
      Group.call(this);
      this.numEnemies = 0;
      
      var count, x, y, timeout, valid;
      for (count = 0; count < maxEnemies; count++) {
         if (Math.floor(Math.random() * 2) == 0) {                                                                   //***VARY***
            timeout = 50;
            valid = true;
            do {
               x = GRID * (Math.floor(Math.random() * (room.roomWidth-2)) + room.wallW + 1);
               y = GRID * (Math.floor(Math.random() * (room.roomHeight-2)) + room.wallN + 1);
               if (room.checkTile(x, y) != 0)
                  valid = false;
               else if (room.collision[y/GRID][x/GRID] != 0)
                  valid = false;
               else if (dir == NORTH && room.checkTile(x, y+GRID) == SOUTH)
                  valid = false;
               else if (dir == SOUTH && room.checkTile(x, y-GRID) == NORTH)
                  valid = false;
               else if (dir == EAST && room.checkTile(x-GRID, y) == WEST)
                  valid = false;
               else if (dir == WEST && room.checkTile(x+GRID, y) == EAST)
                  valid = false;
               else if (dir == UP && room.checkTile(x-GRID, y) == DOWN)
                  valid = false;
               else if (dir == DOWN && room.checkTile(x+GRID, y) == UP)
                  valid = false;
               else if (x % GRID != 0 || y % GRID != 0)
                  valid = false;
            } while (--timeout > 0 && !valid);
            
            if (timeout > 0) {
               /* Determine which enemy type to place */
               if (Math.random() < metrics.getFastEnemyChance()) {
                  this.addChild(new Enemy(x, y, room, "monster2.gif"));
                  metrics.totalFastEnemies++;
               }
               else {
                  this.addChild(new Enemy(x, y, room, "monster1.gif"));
                  metrics.totalStrongEnemies++;
               }
               
               this.numEnemies++;
            }               
         }
      } 
      this.numAlive = this.numEnemies;
   },
   
   removeEnemy: function(toRemove) {
      this.removeChild(toRemove);
      this.numAlive--;
   }

});


/* 
 * The Enemy class keeps track of an enemy's stats and responds to the player's
 * actions. It consists of a sprite and a label displaying the enemy's HP.
 * This class assumes that all enemy types have the same animation frames.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 *    room = the Room object to add the enemies to
 *    type = name of the image file to use for the sprite
 */
Enemy = Class.create(Group, {
   initialize: function(x, y, room, type) {
      Group.call(this);
      
      this.type = type;
      
      this.sprite = new Sprite(GRID, GRID);
      this.sprite.image = game.assets["assets/images/" + type];
      this.sprite.x = x;
      this.sprite.y = y;
      this.sprite.frame = [2, 2, 3, 3, 4, 4, 3, 3];
      room.editCollision(this.sprite.y/GRID, this.sprite.x/GRID, 2);
      
      /* Enemy stats (speed must evenly divide the grid length) */
      if (type == "monster1.gif") {
         this.health = this.maxHealth = metrics.getStrongEnemyHealth();
         this.strength = metrics.getStrongEnemyAttack();
         this.defense = metrics.getStrongEnemyDefense();  
         this.turnTimeMax = 32;
         this.speed = 4;
         this.hpDisplay = createLabel(this.health + "/" + this.maxHealth, this.sprite.x, 
                                   this.sprite.y, "10px sans-serif", "rgb(200,200,200)");
      }
      else if (type == "monster2.gif") {
         this.health = this.maxHealth = metrics.getFastEnemyHealth();                                                                                
         this.strength = metrics.getFastEnemyAttack();
         this.defense = metrics.getFastEnemyDefense();   
         this.turnTimeMax = 15;
         this.speed = 8;
         this.hpDisplay = createLabel(this.health + "/" + this.maxHealth, this.sprite.x, 
                                   this.sprite.y+20, "10px sans-serif", "rgb(200,200,200)");
      }
      
      /* Real time movement fields */
      this.turnTime = Math.floor(Math.random() * this.turnTimeMax/2);
      this.isMoving = false;
      this.dx = this.dy = 0;
      
      /* Add sprite and label to group */
      this.addChild(this.sprite);
      this.addChild(this.hpDisplay);

      /* Initialize A* object, used in onTurn to locate the player and move */
      this.pathFinder = new EasyStar.js();
      this.pathFinder.setAcceptableTiles([0]);

      /* Sword effect fields */
      this.effect = NO_ABILITY;
      this.effectTimer = 0;
      this.poisonTimer = 0;

      /* Metric helper fields */
      this.hadEncounter = false;
      this.didDamage = false;
   },
   
   onenterframe: function() {
      if (this.parentNode.parentNode == curScene) { /* Preventing action after the scene has changed */
         if (this.isMoving) {
            this.sprite.x += this.dx;
            this.hpDisplay.x += this.dx;
            this.sprite.y += this.dy;
            this.hpDisplay.y += this.dy;
            if (this.sprite.x % GRID == 0 && this.sprite.y % GRID == 0) {
               if (this.dx == this.speed)
                  map.editCollision(this.sprite.y/GRID, this.sprite.x/GRID - 1, 0);
               else if (this.dx == -this.speed)
                  map.editCollision(this.sprite.y/GRID, this.sprite.x/GRID + 1, 0);
               else if (this.dy == this.speed)
                  map.editCollision(this.sprite.y/GRID - 1, this.sprite.x/GRID, 0);
               else if (this.dy == -this.speed)
                  map.editCollision(this.sprite.y/GRID + 1, this.sprite.x/GRID, 0);
               this.dx = this.dy = 0;
               this.isMoving = false;
            }
         }
         else if (this.health >= 0) {    
            if (this.effect != NO_ABILITY) {
               if (--this.effectTimer == 0) {
                  if (this.effect == ICE_ABILITY) {
                     this.speed *= 2;
                     this.turnTimeMax -= 10;
                  }
                  this.sprite.image = game.assets["assets/images/" + this.type];
                  this.sprite.frame = [2, 2, 3, 3, 4, 4, 3, 3];
                  this.effect = NO_ABILITY;
               }
               else if (this.effect == POISON_ABILITY && --this.poisonTimer == 0) {
                  this.health -= 1;
                  this.poisonTimer = game.fps;
               }
            }
            
            this.turnTime++;
            this.checkHit();
            this.hpDisplay.text = this.health + "/" + this.maxHealth;
            if (this.turnTime >= this.turnTimeMax && player.isMoving == false) {
               this.onTurn();
               this.turnTime -= this.turnTimeMax;
            }
         }
   
         /* On death */
         if (this.health <= 0 && this.sprite.opacity != 0) {
            this.health = -1;
            this.sprite.frame = this.sprite.opacity > 0.8 ? 1 : 0;
            this.sprite.opacity = (this.sprite.opacity - 0.04).toFixed(2);
            this.hpDisplay.opacity = (this.hpDisplay.opacity - 0.04).toFixed(2);
            if (this.sprite.opacity == 0) {
               map.editCollision(this.sprite.y/GRID, this.sprite.x/GRID, 0);
               if (Math.random() < metrics.getEnemyDropChance() && 
                   map.items.tiles[this.sprite.y/GRID][this.sprite.x/GRID] == -1) {
                  map.items.tiles[this.sprite.y/GRID][this.sprite.x/GRID] = game.getRandomItem(false);
                  map.items.loadData(map.items.tiles);
               }
               this.parentNode.removeEnemy(this);
            }
         }
      }
   },
   
   onTurn: function() {
      var pathFound = {nextx: null, nexty: null};
      var randomDir;
      
      if (this.parentNode.parentNode != curScene) 
         return;
            
      /* If the player is in range of the enemy's sight, try to find a path to the player */
      if (this.sprite.within(player, GRID * metrics.getSightRadius()) && this.health > 0) {                                                      //***VARY***
         this.pathFinder.setGrid(map.collision);
         this.pathFinder.findPath(this.sprite.x/GRID, this.sprite.y/GRID, player.x/GRID, player.y/GRID, function(path) {
            if (path != null && path.length > 1) {
               pathFound.nextx = path[1].x;
               pathFound.nexty = path[1].y;
            }
         });
         this.pathFinder.calculate();         
      
         if (pathFound.nextx != null && pathFound.nexty != null) {   
            /* If the enemy is next to the player, attack */
            if (pathFound.nextx == player.x/GRID && pathFound.nexty == player.y/GRID) {
               if (this.sprite.x > player.x)
                  this.sprite.scaleX = 1;
               else if (this.sprite.x < player.x)
                  this.sprite.scaleX = -1;
                  
               if (!this.didDamage) {
                  player.takeDamage(game.getDamage(this.strength, player.defense, 1));
                  this.didDamage = true;
               }
               else
                  player.takeDamage(game.getDamage(this.strength, player.defense, metrics.getEnemyAccuracy()));
                  
               if (!this.hadEncounter) {
                  if (this.type == "monster1.gif")
                     metrics.strongEnemyEncounters++;
                  else if (this.type == "monster2.gif")
                     metrics.fastEnemyEncounters++;
                  this.hadEncounter = true;
               }
            }
            /* Otherwise, move towards player */
            else {
               this.isMoving = true;
               if (this.sprite.x < pathFound.nextx * GRID) {
                  this.dx = this.speed;
                  map.editCollision(this.sprite.y/GRID, this.sprite.x/GRID + 1, 2);
               }
               else if (this.sprite.x > pathFound.nextx * GRID) {
                  this.dx = -this.speed;
                  map.editCollision(this.sprite.y/GRID, this.sprite.x/GRID - 1, 2);
               }
               else if (this.sprite.y < pathFound.nexty * GRID) {
                  this.dy = this.speed;
                  map.editCollision(this.sprite.y/GRID + 1, this.sprite.x/GRID, 2);
               }
               else if (this.sprite.y > pathFound.nexty * GRID) {
                  this.dy = -this.speed;
                  map.editCollision(this.sprite.y/GRID - 1, this.sprite.x/GRID, 2);
               }
               
               if (this.dx < 0 || (this.dx == 0 && this.sprite.x > player.x))
                  this.sprite.scaleX = 1;
               else if (this.dx > 0 || (this.dx == 0 && this.sprite.x < player.x))
                  this.sprite.scaleX = -1;
            }
         }
      }
      /* Otherwise wander around */
      else if (this.health > 0) {   
         randomDir = Math.floor(Math.random() * 4);
         if (randomDir == 0 && map.collision[this.sprite.y/GRID-1][this.sprite.x/GRID] == 0 &&
             map.tiles[this.sprite.y/GRID-1][this.sprite.x/GRID] == 0) {   /* North */
               this.dy = -this.speed;
               this.isMoving = true;
               map.editCollision(this.sprite.y/GRID - 1, this.sprite.x/GRID, 2);
         }
         else if (randomDir == 1 && map.collision[this.sprite.y/GRID+1][this.sprite.x/GRID] == 0 &&
                  map.tiles[this.sprite.y/GRID+1][this.sprite.x/GRID] == 0) {    /* South */
               this.dy = this.speed;
               this.isMoving = true;
               map.editCollision(this.sprite.y/GRID + 1, this.sprite.x/GRID, 2);
         }
         else if (randomDir == 2 && map.collision[this.sprite.y/GRID][this.sprite.x/GRID-1] == 0 &&
                  map.tiles[this.sprite.y/GRID][this.sprite.x/GRID-1] == 0) {    /* West */
            this.dx = -this.speed;
            this.isMoving = true;
            map.editCollision(this.sprite.y/GRID, this.sprite.x/GRID - 1, 2);
            this.sprite.scaleX = 1;
         }
         else if (randomDir == 3 && map.collision[this.sprite.y/GRID][this.sprite.x/GRID+1] == 0 &&
                  map.tiles[this.sprite.y/GRID][this.sprite.x/GRID+1] == 0) {    /* East */
            this.dx = this.speed;
            this.isMoving = true;
            map.editCollision(this.sprite.y/GRID, this.sprite.x/GRID + 1, 2);
            this.sprite.scaleX = -1;
         }
      }
   },
   
   checkHit: function() {
      var dmg = -1;
      if (player.attackCounter == 1 && this.sprite.within(player, GRID*3/2)) {
         if ((player.direction == P_LEFT && this.sprite.x == player.x-GRID && this.sprite.y == player.y) ||
             (player.direction == P_RIGHT && this.sprite.x == player.x+GRID && this.sprite.y == player.y) ||
             (player.direction == P_UP && this.sprite.x == player.x && this.sprite.y == player.y-GRID) ||
             (player.direction == P_DOWN && this.sprite.x == player.x && this.sprite.y == player.y+GRID)) {
            dmg = game.getDamage(player.strength, this.defense, metrics.getPlayerAccuracy());
            this.health -= dmg
            
            if (player.ability == ICE_ABILITY) {
               if (this.effect == NO_ABILITY) {
                  this.sprite.frame = [2, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 3];
                  this.speed /= 2;
               }
               this.effect = ICE_ABILITY;
               this.effectTimer = game.fps * 5;
               this.turnTimeMax += 10;
               if (this.type == "monster1.gif")
                  this.sprite.image = game.assets["assets/images/monster1slow.gif"];
               else if (this.type == "monster2.gif")
                  this.sprite.image = game.assets["assets/images/monster2slow.gif"];
            }
            else if (player.ability == POISON_ABILITY) {
               this.effect = POISON_ABILITY;
               this.poisonTimer = game.fps;
               this.effectTimer = game.fps * 6;
               if (this.type == "monster1.gif")
                  this.sprite.image = game.assets["assets/images/monster1poison.gif"];
               else if (this.type == "monster2.gif")
                  this.sprite.image = game.assets["assets/images/monster2poison.gif"];
            }
            
            game.itemBreak(player.sword);
            
            if (dmg == 0) 
               metrics.enemyMisses++;
            else
               metrics.enemyHits++;
            if (!this.hadEncounter) {
               if (this.type == "monster1.gif")
                  metrics.strongEnemyEncounters++;
               else if (this.type == "monster2.gif")
                  metrics.fastEnemyEncounters++;
               this.hadEncounter = true;
            }
         }  
      }
      
      if (this.health <= 0) {
         metrics.dmgDealt += dmg + this.health;
         this.health = 0;
         if (this.type == "monster1.gif")
            metrics.strongEnemyKills++;
         else if (this.type == "monster2.gif")
            metrics.fastEnemyKills++;
      }
      else if (dmg != -1) {
         metrics.dmgDealt += dmg;
      }
   }
});

/* On window load */
window.onload = function() {
   game = new Game(WINDOW, WINDOW);
   game.fps = 16;
   game.rootScene.backgroundColor = "black";
   game.preload("assets/images/map.png",
                "assets/images/player.png",
                "assets/images/hud.png",
                "assets/images/items.png",
                "assets/images/monster1.gif",
                "assets/images/monster2.gif",
                "assets/images/monster1slow.gif",
                "assets/images/monster2slow.gif",
                "assets/images/monster1poison.gif",
                "assets/images/monster2poison.gif",
                "assets/images/dialogue.png",
                "assets/sounds/sword_swing.wav",
                "assets/sounds/grunt.wav",
                "assets/sounds/swap.wav",
                "assets/sounds/shatter.wav",
                "assets/sounds/select1.wav",
                "assets/sounds/select2.wav");
                
   /* Bind keys (the numbers are ASCII values of the keys) */
   game.keybind(65, 'left');
   game.keybind(68, 'right');
   game.keybind(87, 'up');
   game.keybind(83, 'down');
   game.keybind(74, 'attackLeft');
   game.keybind(76, 'attackRight');
   game.keybind(73, 'attackUp');
   game.keybind(75, 'attackDown');
   game.keybind(77, 'swapItem');
   game.keybind(78, 'usePotion');
   game.keybind(32, 'select');
   
   game.onload = function() {
      /* Creating Main Menu */
      var title = createLabel("PEARL OF THE WORLD", 0, 150, "32px sans-serif");
      var newGame = createLabel("New Game", 0, 240, "14px sans-serif", "red");
      var controls = createLabel("Controls", 0, 270, "14px sans-serif");
      var credits = createLabel("Credits", 0, 300, "14px sans-serif");
      var instructions = createLabel("WASD to navigate, Space to select", 20, WINDOW - 30, "12px sans-serif");
      
      title.textAlign = newGame.textAlign = controls.textAlign = credits.textAlign = "center";
      title.width = newGame.width = controls.width = credits.width = WINDOW;
      
      game.rootScene.addChild(title);
      game.rootScene.addChild(newGame);
      game.rootScene.addChild(controls);
      game.rootScene.addChild(credits);
      game.rootScene.addChild(instructions);
      
      /* Creating the controls screen */
      var controlsScene = new Scene();
      controlsScene.backgroundColor = "black";
      
      var controlsTitle = createLabel("CONTROLS", 50, 50, "28px sans-serif");
      var controlsDetails = createLabel("W,A,S,D - Move<br> <br>" +
                                        "I,J,K,L - Attack<br> <br>" +
                                        "N - Use health potion<br> <br>" +
                                        "M - Swap item, drop or pick up pearl<br> <br>" +
                                        "Space - Unlock chest",
                                        50, 110, "14px sans-serif");
      var controlsToMenu = createLabel("Press space to return to menu", 50, WINDOW-50, "14px sans-serif");
      
      controlsScene.addChild(controlsTitle);
      controlsScene.addChild(controlsDetails);
      controlsScene.addChild(controlsToMenu);
      
      controlsScene.addEventListener(Event.INPUT_START, function() {
         if (game.input.select) {
            var newSound = game.assets['assets/sounds/select2.wav'].clone();
            newSound.play();
            game.popScene();
         }
      });
      
      /* Creating the credits screen */
      var creditsScene = new Scene();
      creditsScene.backgroundColor = "black";
      
      var creditsTitle = createLabel("CREDITS", 50, 50, "28px sans-serif");
      var creditsDetails = createLabel("Senior Project by Cameron Thibodeaux, 2014" + "<br> <br>" +
                                       "AUD.js Procedural Music Generator - Timothey Adam",
                                       50, 110, "14px sans-serif");
      var creditsToMenu = createLabel("Press space to return to menu", 50, WINDOW-50, "14px sans-serif");
      
      creditsTitle.width = creditsDetails.width = WINDOW;
      
      creditsScene.addChild(creditsTitle);
      creditsScene.addChild(creditsDetails);
      creditsScene.addChild(creditsToMenu);
      
      creditsScene.addEventListener(Event.INPUT_START, function() {
         if (game.input.select) {
            var newSound = game.assets['assets/sounds/select2.wav'].clone();
            newSound.play();
            game.popScene();
         }
      });
      
      /* Adding event listeners */
      game.rootScene.addEventListener(Event.INPUT_START, function() {
         var newSound;
      
         if (game.input.select) {
            newSound = game.assets['assets/sounds/select2.wav'].clone();
            newSound.play();
            if (newGame.color == "red")
               game.initLevel(0);
            else if (controls.color == "red")
               game.pushScene(controlsScene);
            else if (credits.color == "red") 
               game.pushScene(creditsScene);
         }
         else if (game.input.up || game.input.left) {
            newSound = game.assets['assets/sounds/select1.wav'].clone();
            newSound.play();
            if (newGame.color == "red") {
               newGame.color = "white";
               credits.color = "red";
            }
            else if (controls.color == "red") {
               controls.color = "white";
               newGame.color = "red";
            }
            else if (credits.color == "red") {
               credits.color = "white";
               controls.color = "red";
            }
         }
         else if (game.input.down || game.input.right) {
            newSound = game.assets['assets/sounds/select1.wav'].clone();
            newSound.play();
            if (newGame.color == "red") {
               newGame.color = "white";
               controls.color = "red";
            }
            else if (controls.color == "red") {
               controls.color = "white";
               credits.color = "red";
            }
            else if (credits.color == "red") {
               credits.color = "white";
               newGame.color = "red";
            }
         }
      });
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
      var audStress, audEnergy;
      
      curScene = new Scene();
      curScene.backgroundColor = "black";
      
      if (levelType == 0) {
         metrics.gameInit();
         player = new Player(GRID*(ROOM_WID_MAX-1)/2, GRID*(ROOM_HIG_MAX-1)/2);
         map = new Room(null, null, 0, 0, 0);
         speech = new SpeechAct();
      }
      else if (levelType == 1)
         map = new Room(0, null, 0, 0, 0);
      else
         map = new Room(null, null, 0, 0, 0);
         
      if (levelType != 2) {
         metrics.levelInit(player.strength, player.defense, player.health, player.numPotions, player.numKeys);
         minRooms = metrics.getMinRooms();
         console.log("Min Rooms: " + minRooms);
      }
      
      audStress = metrics.getAudStress();
      audEnergy = metrics.getAudEnergy();
      if (levelType == 2)
         audStress = audEnergy = 0.1;
      aud.generatePattern(audStress, audEnergy, 4, 4, Math.floor(Math.random() * 10000));
      aud.setVolume(0.5);
      aud.togglePlay();
         
      curScene.addChild(map);
      curScene.addChild(new Hud());
      curScene.addChild(map.chests);
      curScene.addChild(map.items);
      curScene.addChild(new EnemyGroup(0, map, UP));
      curScene.addChild(player);      
      sceneList.push(curScene);
      player.age = 0;
      exitPlaced = false;
      
      if (levelType == 0) {
         game.pushScene(curScene);
         map.createFirstRoom();
      }
      else {
         game.replaceScene(curScene);
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
      if (aud.isPlaying()) 
         aud.togglePause();
   
      metrics.calculateAverages();
      metrics.endLevel();
   
      var results = new Scene();
      results.backgroundColor = "black"
      
      var title;
      if (endType == 1)
         title = createLabel("GAME OVER", 0, 50, "28px sans-serif");
      else if (endType == 2)
         title = createLabel("YOU'VE ESCAPED THE DUNGEON", 0, 50, "28px sans-serif");
      else
         title = createLabel("LEVEL COMPLETE", 0, 50, "28px sans-serif");
      
      var metricLabel = createLabel("Attack: " + metrics.str + "<br>" +
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


