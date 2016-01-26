/* 
 * The CombatRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.CombatRoomGenerator = Class.create(RoomGenerator, {
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
