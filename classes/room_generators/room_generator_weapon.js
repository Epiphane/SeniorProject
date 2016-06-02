/* 
 * The ItemRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.WeaponRoomGenerator = Class.create(PuzzleRoomGenerator, {
      createFloor: function(params) {
         var background = PuzzleRoomGenerator.prototype.createFloor.apply(this, arguments);

         this.setTile(background,  0,  0, C.BG_TILES.prize_weapon);

         return background;
      },

      populateRoom: function(room) {
         PuzzleRoomGenerator.prototype.populateRoom.apply(this, arguments);

         var weapon = chance.pick(C.Weapons);
         // this.addItem(room, new Classes[weapon](), 0, 0);
         room.prize = new Classes[weapon]();
      }
   });
})(window);
