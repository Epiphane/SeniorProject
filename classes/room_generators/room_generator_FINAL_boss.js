/* 
 * The FinalBossRoomGenerator class is the final showdown room! of ultimate destiny.
 */
(function(window) {
   var defaults = {};

   window.FinalBossRoomGenerator = Class.create(RoomGenerator, {
      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         return background;
      },

      populateRoom: function(room) {
         // Add enemies and items to room
         this.addCharacter(room, new Classes.FinalBoss(), 2, 3);
      }
   });
})(window);
