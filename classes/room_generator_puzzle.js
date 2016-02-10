/* 
 * The PuzzleRoomGenerator class randomly creates a puzzle room
 */
(function(window) {
   var defaults = {};

   window.PuzzleRoomGenerator = Class.create(RoomGenerator, {
      populateRoom: function(room) {
         // Add boulders and switches to the room
         this.addCharacter(room, new Classes.Slime(), 2, 3);
         room.addItemAt(new Classes.Pushable(), 4, 4);
      }
   });
})(window);
