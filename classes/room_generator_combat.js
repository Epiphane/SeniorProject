/* 
 * The CombatRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.CombatRoomGenerator = Class.create(RoomGenerator, {
      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         for (var y = -params.height_2 + 1; y < params.height_2 - 1; y ++) {
            for (var x = -params.width_2 + 1; x < params.width_2 - 1; x ++) {
               // if (chance.bool({ likelihood: 14 })) this.setTile(background, x, y, C.BG_TILES.floor_blocked);
            }  
         }

         return background;
      },

      populateRoom: function(room) {
         // Add enemies and items to room
         this.addCharacter(room, new Classes.Slime(), 2, 3);
         this.addCharacter(room, new Classes.Slime(), 3, 3);
         this.addCharacter(room, new Classes.Slime(), 4, 3);
         this.addCharacter(room, new Classes.Slime(), 5, 3);
         this.addCharacter(room, new Classes.Bat(), 1, 2);
      }
   });
})(window);
