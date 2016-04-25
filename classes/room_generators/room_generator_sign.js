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
         var dialog = []
         dialog.push(["\"Those who walk without purpose or thought seek only defeat and pain.\""]);
         var sign = new Classes.Sign(dialog);
         this.addItem(room, sign, 2, 2);
      }
   });
})(window);
