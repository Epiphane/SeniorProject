/*
 * The Metrics function object keeps track of the player metrics that can be
 * used to determine the player's play style and create a new room/level
 * based on that play style.
 */
var metrics = new function() {
   this.gameInit = function() {
      this.numLevel = 1;
      this.totLevels = 5;
      this.prevOrbTimeRatio = 0;
      this.prevStrongKilledRatio = 1;
      this.prevFastKilledRatio = 1;
      this.prevStairsTakenRatio = 0;
   }

   /*
    * Initializes the metrics at the beginning of each level.
    * Parameters:
    *    playerStr = initial strength stat of the player
    *    playerDef = initial defense stat of the player
    *    playerHealth = initial health of the player
    *    numPotions = initial number of health potions held by the player
    */
   this.levelInit = function(playerStr, playerDef, playerHealth, numPotions, numKeys) {
      /* Raw data metrics that should be collected during gameplay */
      this.str = playerStr;
      this.strAtStart = playerStr;
      this.def = playerDef;
      this.defAtStart = playerDef;
      this.dmgDealt = 0;
      this.dmgTaken = 0;
      this.enemyHits = 0;
      this.enemyMisses = 0;
      this.fastEnemyEncounters = 0;    // NEEDED?
      this.fastEnemyKills = 0;         // NEEDED
      this.totalFastEnemies = 0;       // NEEDED
      this.strongEnemyEncounters = 0;  // NEEDED?
      this.strongEnemyKills = 0;       // NEEDED
      this.totalStrongEnemies = 0;     // NEEDED
      this.totalKeys = numKeys;        // NEEDED
      this.totalChests = 0;            // NEEDED
      this.potionsHeld = numPotions;
      this.potionsUsed = 0;
      this.maxHealth = playerHealth;
      this.minHealth = playerHealth;
      this.roomsVisited = 1;           // NEEDED
      this.stairsTaken = 0;             // NEEDED
      this.totalStairs = 0;            // NEEDED
      this.doorsEntered = 0;  
      this.stepsTaken = 0;  
      
      /* Average/other metrics that should not be altered manually */
      this.time = 0;                      // NEEDED?
      this.timeWithOrb = 0;               // NEEDED
      this.timePerRoom = 0;
      this.dmgDealtPerRoom = 0;
      this.dmgTakenPerRoom = 0;
      this.dmgDealtPerEnemy = 0;
      this.dmgTakenPerEnemy = 0;
      this.dmgDealtPerEncounter = 0;
      this.dmgTakenPerEncounter = 0;
      this.enemiesFoughtRatio = 0;
      this.killedToEncounteredRatio = 0;
      this.hitsPerKill = 0;
      this.accuracy = 0;
      this.stepsPerRoom = 0;
      
      /* The misfortune variable determines how well things go for the player. It increases as the
         player holds the orb and decreases as the player is not holding the orb (0-1) */
      this.misfortune = 0;
      this.delta = 0.01;
      
      this.clock = setInterval(function() {
         ++metrics.time;
      }, 1000);
   }
   
   /* Starts to slowly increase misfortune. Call when the player picks up the orb */
   this.takeOrb = function() {
      clearInterval(this.clockOrb);
      this.clockOrb = setInterval(function() {
         ++metrics.timeWithOrb;
         if (metrics.misfortune < 1) {
            metrics.delta = Math.max(metrics.misfortune * 0.075, 0.01); // 42 seconds from min to max misfortune
            if (metrics.misfortune + metrics.delta < 1)
               metrics.misfortune += metrics.delta;
            else
               metrics.misfortune = 1;
         }
      }, 1000);
   }
   
   /* Starts to slowly decrease misfortune. Call when the player drops the orb */
   this.dropOrb = function() {
      clearInterval(this.clockOrb);
      this.clockOrb = setInterval(function() {
         if (metrics.misfortune > 0) {
            metrics.delta = Math.max(metrics.misfortune * 0.075, 0.01); // 42 seconds from max to min misfortune
            if (metrics.misfortune - metrics.delta > 0)
               metrics.misfortune -= metrics.delta;
            else
               metrics.misfortune = 0;
         }
      }, 1000);
   }
   
   /* ======================================================================= */
   /* Below are the functions that return modified values based on misfortune */
   /* ======================================================================= */
   
   /* Returns the interpolated enemy sight radius (# of tiles) */
   this.getSightRadius = function() {
      var min = 3;      /* Default Value */
      var max = 14;
      return Math.floor((max-min) * this.misfortune + min);
   }
   
   /* Returns the interpolated enemy accuracy (0-1) */
   this.getEnemyAccuracy = function() {
      var min = 0.8;    /* Default Value */
      var max = 1;
      return (max-min) * this.misfortune + min;
   }
   
   /* Returns the interpolated player accuracy (0-1) */
   this.getPlayerAccuracy = function() {
      var min = 0.75;
      var max = 0.9;    /* Default Value */
      return (max-min) * (1-this.misfortune) + min;
   }
   
   /* Returns the interpolated sword/shield break chance (0-1) */
   this.getBreakChance = function() {
      var min = 0.01;   /* Default Value */
      var max = 0.1;
      return (max-min) * this.misfortune + min;
   }
   
   /* Returns the interpolated player attack speed (# of frames) */
   this.getPlayerAttackSpeed = function() {
      var min = 5;      /* Default Value */
      var max = 9;
      return Math.floor((max-min) * this.misfortune + min);
   }
   
   /* Returns the interpolated chance that an enemy will drop an item (0-1) */
   this.getEnemyDropChance = function() {
      var min = 0.15;
      var max = 0.25;   /* Default Value */
      return (max-min) * (1-this.misfortune) + min;
   }
   
   /* Returns the interpolated stress value for AUD music generator */
   this.getAudStress = function() {
      var min = 0.3;    /* Default Value */
      var max = 0.9;
      return (max-min) * this.misfortune + min;
   }
   
   /* Returns the interpolated energy value for AUD music generator */
   this.getAudEnergy = function() {
      var min = 0.2;    /* Default Value */
      var max = 0.8;
      return (max-min) * this.misfortune + min;
   }
   /* ======================================================================= */
   /* Below are the functions that return modified values based on (previous) */
   /* level averages                                                          */
   /* ======================================================================= */
   
   /* Returns the minimum number of rooms for a level */
   this.getMinRooms = function() {
      var min = 10;  /* Default Value */
      var max = 20;
      return Math.floor((max-min) * this.prevOrbTimeRatio + min);
   }
   
   /* Returns the room width and height within the given ranges. The values are
      retuned as an Array object with width as the first element and height as
      the second element. */
   this.getRoomDimensions = function(minWidth, maxWidth, minHeight, maxHeight) {
      var dims = Array(2);
      var width, height;
      
      /* Calculate the largest possible W/H difference and take a percentage of 
         that based on previous level metrics */
      var chance = (this.prevOrbTimeRatio + (1 - this.prevFastKilledRatio)) / 2;
      var diff = Math.round(chance * (Math.min(maxWidth, maxHeight) - Math.max(minWidth, minHeight)));

      do {
         width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
         height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
         if (width % 2 == 0)
            width += Math.random() < 0.5 ? 1 : -1;
         if (height % 2 == 0)
            height += Math.random() < 0.5 ? 1 : -1;
      } while (Math.abs(width - height) < diff);
      
      dims[0] = width;
      dims[1] = height;
      return dims;
   }
   
   /* Returns the maximum number of exits for a room */
   this.getMaxExits = function() {
      min = 1;
      max = 4;    /* Default Value */
      return Math.round((max-min) * (1 - this.prevOrbTimeRatio) + min);
   }
   
   /* Returns the maximum amount of enemies for a room */
   this.getMaxEnemies = function() {
      var min = 5;   /* Default Value */
      var max = 10;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevFastKilledRatio) + (1 - this.prevStrongKilledRatio)) / 3;
      return Math.round(chance * (max-min) + min);
   }
   
   /* Returns the likelihood of a new enemy being a fast enemy */
   this.getFastEnemyChance = function() {
      var min = 0.5; /* Default Value */
      var max = 0.8;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevFastKilledRatio)) / 2;
      return chance * (max-min) + min;
   }
   
   /* These functions return the strong enemy stats */
   this.getStrongEnemyHealth = function() {
      var min = 20;
      var max = 25;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevStrongKilledRatio)) / 2;
      return Math.round(chance * (max-min) + min);
   }
   
   this.getStrongEnemyAttack = function() {
      var min = 5;
      var max = 6;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevStrongKilledRatio)) / 2;
      return Math.round(chance * (max-min) + min);
   }
   
   this.getStrongEnemyDefense = function() {
      var min = 1;
      var max = 3;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevStrongKilledRatio)) / 2;
      return Math.round(chance * (max-min) + min);
   }
   
   /* These functions return the fast enemy stats (they don't really do much now) */
   this.getFastEnemyHealth = function() {
      var min = 15;
      var max = 15;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevStrongKilledRatio)) / 2;
      return Math.round(chance * (max-min) + min);
   }
   
   this.getFastEnemyAttack = function() {
      var min = 3;
      var max = 3;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevStrongKilledRatio)) / 2;
      return Math.round(chance * (max-min) + min);
   }
   
   this.getFastEnemyDefense = function() {
      var min = 0;
      var max = 0;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevStrongKilledRatio)) / 2;
      return Math.round(chance * (max-min) + min);
   }
   
   /* Returns the probability of a wall being placed on any given tile. (0-1). 
      The chance is less for the first level. */
   this.getObstacleChance = function() {
      this.calculateAverages();
      var min = 0.05;
      var max = 0.45;
      var chance = (this.prevOrbTimeRatio + (1 - this.prevFastKilledRatio) + (1 - this.prevStrongKilledRatio)) / 3;
      return Math.min(1, chance * (max-min) + min);
   }
   
   /* Returns the probability of a staircase appearing in a room */
   this.getStairChance = function() {
      var mid = 0.45;
      var range = 0.4;
      var diff = this.prevOrbTimeRatio * (1 - this.prevStairsTakenRatio - 0.5) * range / 0.5
      return mid + diff;
   }
   
   /* ======================================================================= */
   
   /* Returns the likelihood of a room tile having an item. It increases if the
      player still needs to find the orb and has no keys */
   this.getRoomItemChance = function(seenOrb, numKeys) {
      var chance = 0.01;
      var max = 0.025;
      if (!seenOrb && numKeys == 0 && this.getOrbChance() >= 1)
         chance = max;
      return chance;
   }
   
   /* Returns the likelihood of a room tile having a chest */
   this.getRoomChestChance = function() {
      var chance = 0.02;
      return chance;
   }
   
   /* Returns the chance that the orb will appear in a chest. It has the highest
      chance after the player has gone through 1/3 of the level. */
   this.getOrbChance = function() {
      var latest = Math.ceil(this.getMinRooms() / 3);
      return Math.min(1, this.roomsVisited/latest);
   }
   
   /* Returns a boolean indicating if the player has no means of getting the orb
      by the end of the level. If true, must make orb available without a key or chest */
   this.needEmergencyOrb = function() {
      var needed = false;
      if (this.totalKeys == 0 || this.totalChests == 0)
         needed = true;
      return needed;
   }
   
   /* Returns true if the player got through all the levels. Call after this.endLevel */
   this.isEndReached = function() {
      var reachedEnd = false;
      if (this.numLevel > this.totLevels)
         reachedEnd = true;
      return reachedEnd;
   }
   
   /*
    * Calculate the metrics for averages based on the raw data collected.
    */
   this.calculateAverages = function() {
      var totEncounters = this.strongEnemyEncounters + this.fastEnemyEncounters;
      var totKills = this.strongEnemyKills + this.fastEnemyKills;
      var totEnemies = this.totalStrongEnemies + this.totalFastEnemies;
   
      this.dmgDealtPerRoom = Math.round(this.dmgDealt / this.roomsVisited * 10) / 10;
      this.dmgTakenPerRoom = Math.round(this.dmgTaken / this.roomsVisited * 10) / 10;
      this.dmgDealtPerEnemy = Math.round(this.dmgDealt / totEnemies * 10) / 10;
      this.dmgTakenPerEnemy = Math.round(this.dmgTaken / totEnemies * 10) / 10;
      if (totEncounters == 0) {
         this.dmgDealtPerEncounter = 0;
         this.dmgTakenPerEncounter = 0;
         this.killedToEncounteredRatio = 0;
      }
      else {
         this.dmgDealtPerEncounter = Math.round(this.dmgDealt / totEncounters * 10) / 10;
         this.dmgTakenPerEncounter = Math.round(this.dmgTaken / totEncounters * 10) / 10;
         this.killedToEncounteredRatio = Math.round(totKills / totEncounters * 100) / 100;
      }
      this.enemiesFoughtRatio = Math.round(totEncounters / totEnemies * 100)/ 100;
      this.hitsPerKill = totKills == 0 ? 0 : Math.round(this.enemyHits / totKills * 10) / 10;
      this.accuracy = this.enemyHits == 0 && this.enemyMisses == 0 ? 0 : Math.round(this.enemyHits / (this.enemyHits + this.enemyMisses) * 100) / 100;
      this.timePerRoom = Math.round(this.time / this.roomsVisited * 10) / 10;
      this.stepsPerRoom = Math.round(this.stepsTaken / this.roomsVisited * 10) / 10;
   }

   /*
    * End the level: stop the clocks and print the metric values to the console.
    */
   this.endLevel = function() {
      clearInterval(this.clock);
      clearInterval(this.clockOrb);
      
      var maxTime = 120;   /* The cap orb-held-time to prevent dramatic changes */
      /* If the no strong enemies, fast enemies, or stairs were seen in the level,
       * set the ratio to 1/2 by default */
      if (this.totalStrongEnemies == 0) {
         this.totalStrongEnemies = 2;
         this.strongEnemyKills = 1;
      }
      if (this.totalFastEnemies == 0) {
         this.totalFastEnemies = 2;
         this.fastEnemyKills = 1;
      }
      if (this.totalStairs == 0) {
         this.totalStairs = 2;
         this.stairsTaken = 1;
      }
      this.prevOrbTimeRatio = Math.min(this.timeWithOrb, maxTime) / maxTime;
      this.prevStrongKilledRatio = this.strongEnemyKills / this.totalStrongEnemies;
      this.prevFastKilledRatio = this.fastEnemyKills / this.totalFastEnemies;
      this.prevStairsTakenRatio = this.stairsTaken / this.totalStairs;
      
      this.numLevel++;
      if (this.prevOrbTimeRatio > 0.7 && this.totLevels < 7 && !this.isEndReached())
         this.totLevels++;
      else if (this.prevOrbTimeRatio < 0.3 && this.totLevels > 3 && !this.isEndReached())
         this.totLevels--;
      
      console.log("---LEVEL METRICS---");
//       console.log("Strength: " + this.str);
//       console.log("Strength change: " + (this.str-this.strAtStart));
//       console.log("Defense: " + this.def);
//       console.log("Defense change: " + (this.def-this.defAtStart));
//       console.log("Damage dealt: " + this.dmgDealt);
//       console.log("Damage taken: " + this.dmgTaken);
      console.log("Strong Enemies:");
      console.log("   Encounters: " + this.strongEnemyEncounters);
      console.log("   Kills: " + this.strongEnemyKills);
      console.log("   Total: " + this.totalStrongEnemies);
      console.log("Fast Enemies:");
      console.log("   Encounters: " + this.fastEnemyEncounters);
      console.log("   Kills: " + this.fastEnemyKills);
      console.log("   Total: " + this.totalFastEnemies);
      console.log("Enemy hits: " + this.enemyHits);
      console.log("Enemy misses: " + this.enemyMisses);
//       console.log("Potions held: " + this.potionsHeld);
//       console.log("Potions used: " + this.potionsUsed);
//       console.log("Max health: " + this.maxHealth);
//       console.log("Min health: " + this.minHealth);
//       console.log("Avg health: " + this.avgHealth);
//       console.log("Rooms visited: " + this.roomsVisited);
//       console.log("Steps taken: " + this.stepsTaken);
      console.log("Total time (seconds): " + this.time);
      console.log("Time with orb (seconds): " + this.timeWithOrb);
      console.log("Misfortune: " + this.misfortune);
      console.log("---LEVEL AVERAGES---");
//       console.log("Damage dealt per Room: " + this.dmgDealtPerRoom);
//       console.log("Damage taken per Room: " + this.dmgTakenPerRoom);
//       console.log("Damage dealt per Enemy: " + this.dmgDealtPerEnemy);
//       console.log("Damage taken per Enemy: " + this.dmgTakenPerEnemy);
//       console.log("Damage dealt per Encounter: " + this.dmgDealtPerEncounter);
//       console.log("Damage taken per Encounter: " + this.dmgTakenPerEncounter);
//       console.log("Percentage of enemies fought: " + this.enemiesFoughtRatio * 100 + "%");
//       console.log("Percentage of encountered enemies killed: " + this.killedToEncounteredRatio * 100 + "%");
//       console.log("Sword hits per kill: " + this.hitsPerKill);
//       console.log("Accuracy: " + this.accuracy * 100 + "%");
//       console.log("Time per Room: " + this.timePerRoom);
//       console.log("Steps per Room: " + this.stepsPerRoom);
      console.log("Orb time ratio: " + this.prevOrbTimeRatio);
      console.log("Fast enemies killed to encountered ratio: " + this.prevFastKilledRatio);
      console.log("Strong enemies killed to encountered ratio: " + this.prevStrongKilledRatio);
      console.log("Stairs taken to total stairs ratio: " + this.prevStairsTakenRatio);
   }

};