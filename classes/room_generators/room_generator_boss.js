/* 
 * The BossRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.BossRoomGenerator = Class.create(RoomGenerator, {
      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         return background;
      },

      populateRoom: function(room) {
         // Add enemies and items to room
         this.addCharacter(room, new Classes.SimpleBoss(), 2, 3);
      }
   });
})(window);
