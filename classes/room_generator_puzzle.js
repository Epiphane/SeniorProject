/* 
 * The PuzzleRoomGenerator class randomly creates a puzzle room
 */
(function(window) {
   var defaults = {};

   window.PuzzleRoomGenerator = Class.create(RoomGenerator, {
      populateRoom: function(room) {
         // Add boulders and switches to the room
         this.addCharacter(room, new Classes.Slime(), 2, 3);

         this.addCharacter(room, new Classes.Pushable(), -3, -3);
         this.addCharacter(room, new Classes.Pushable(), -3, -2);
         this.addCharacter(room, new Classes.Pushable(), -3, -1);
         this.addCharacter(room, new Classes.Pushable(), -5, -2);
         this.addCharacter(room, new Classes.Pushable(), -5, -3);
         this.addCharacter(room, new Classes.Pushable(), -5, -1);
         this.addCharacter(room, new Classes.Pushable(), -5, 0);
         this.addCharacter(room, new Classes.Pushable(), -5, 1);
         this.addCharacter(room, new Classes.Pushable(), -3, 2);
         this.addCharacter(room, new Classes.Pushable(), -3, 3);

         this.addItem(room, new Classes.Sword(), -2, -3);
      }
   });
})(window);
