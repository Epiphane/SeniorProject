/* 
 * The PuzzleRoomGenerator class randomly creates a puzzle room
 */
(function(window) {
   var defaults = {};

   window.PuzzleRoomGenerator = Class.create(RoomGenerator, {
      populateRoom: function(room) {
         // Add boulders and switches to the room
         room.addItemAt(new Classes.Pushable(), 4, 4);
      }
   });
})(window);
