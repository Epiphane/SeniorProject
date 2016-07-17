/* 
 * The CombatRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.CombatRoomGenerator = Class.create(RoomGenerator, {
      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         this.setTile(background,  3,  2, C.BG_TILES.floor_blocked);
         this.setTile(background,  3, -2, C.BG_TILES.floor_blocked);
         this.setTile(background, -3, -2, C.BG_TILES.floor_blocked);
         this.setTile(background, -3,  2, C.BG_TILES.floor_blocked);

         return background;
      },

      addSlime: function(room, engagement, x, y) {
         var fightSlimes = Classes.Slime.prototype.Engaged.valueOf(false) + DifficultyManager.getDifficulty();
         if (fightSlimes >= engagement) {
            this.addCharacter(room, new Classes.Slime(), x, y);
         }
      },

      addBat: function(room, engagement, x, y) {
         var fightBats = Classes.Bat.prototype.Engaged.valueOf(false) + DifficultyManager.getDifficulty();
         if (fightBats >= engagement) {
            this.addCharacter(room, new Classes.Bat(), x, y);
         }
      },

      populateRoom: function(room) {
         // Add enemies and items to room
         this.addBat(room, 0, 1, 2);
         this.addBat(room, 0.4, 1, 1);
         this.addBat(room, 0.8, 0, 0);
         this.addBat(room, 1.2, -1, -1);

         this.addSlime(room, 0, 2, 3);
         this.addSlime(room, 0.5, 3, 3);
         this.addSlime(room, 0.7, -2, -2);
         this.addSlime(room, 0.9, -2, 0);
         this.addSlime(room, 1.1, -3, -3);
         this.addSlime(room, 1.3, 2, -3);
         this.addSlime(room, 1.5, -2, 2);
      }
   });
})(window);
