/* 
 * The ItemRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.StartRoomGenerator = Class.create(RoomGenerator, {
      populateRoom: function(room) {
         // Add enemies and items to room
         this.addCharacter(room, new Classes.Sign(), 0, -2);
      }
   });
})(window);
