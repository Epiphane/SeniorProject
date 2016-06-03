/* 
 * The SignRoomGenerator class randomly creates a room centered around a 
 */
(function(window) {
   var defaults = {};

   window.SignRoomGenerator = Class.create(RoomGenerator, {
      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         return background;
      },

      populateRoom: function(room) {
         var sign = new Classes.Sign(Story.getLine(Story.NPC_CHARACTERS.sign, "story", 0));
         this.addItem(room, sign, 0, 0);
      }
   });
})(window);
