/* 
 * The ItemRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.WeaponRoomGenerator = Class.create(RoomGenerator, {
      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         this.setTile(background,  1,  1, C.BG_TILES.floor_blocked);
         this.setTile(background,  1, -1, C.BG_TILES.floor_blocked);
         this.setTile(background, -1, -1, C.BG_TILES.floor_blocked);
         this.setTile(background, -1,  1, C.BG_TILES.floor_blocked);

         return background;
      },

      populateRoom: function(room) {
         var weapon = chance.pick(C.Weapons);
         this.addItem(room, new Classes[weapon](), 0, 0);
      }
   });
})(window);
