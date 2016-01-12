/*
 * The Player class keeps track of the character stats and animates and moves
 * the character sprite.
 * Parameters:
 *    x = x coordinate of the sprite
 *    y = y coordinate of the sprite
 */
ClassManager.create('Player', function(game) {
   return Class.create(Sprite, {
      initialize: function(x, y) {
         Sprite.call(this, 32, 32);
         this.image = game.assets["assets/images/player.png"];
         this.x = x; /* Relative to the whole map, not the window */
         this.y = y;
         this.frame = 0;
         
         return;

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
         // if (this.age % (game.fps*3) == 0)
            //aud.adaptPattern(metrics.getAudStress(), metrics.getAudEnergy());
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
});