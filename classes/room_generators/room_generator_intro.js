/* 
 * The ItemRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.IntroRoomGenerator = Class.create(RoomGenerator, {
      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         this.setTile(background,  0, -1, C.BG_TILES.up_arrow);
         this.setTile(background,  0,  1, C.BG_TILES.down_arrow);
         this.setTile(background, -1,  0, C.BG_TILES.left_arrow);
         this.setTile(background,  1,  0, C.BG_TILES.right_arrow);

         this.setTile(background,  3, -3, C.BG_TILES.attack_arrow);

         return background;
      },

      populateRoom: function(room) {
         this.addCharacter(room, new Classes.Dummy(), 3, -4);
      }
   });
})(window);
