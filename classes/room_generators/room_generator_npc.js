/* 
 * The ItemRoomGenerator class randomly creates a room centered around combat
 */
(function(window) {
   var defaults = {};

   window.NPCRoomGenerator = Class.create(RoomGenerator, {
      createFloor: function(params) {
         var background = RoomGenerator.prototype.createFloor.apply(this, arguments);

         this.setTile(background,  1,  1, C.BG_TILES.floor_blocked);
         this.setTile(background,  1, -1, C.BG_TILES.floor_blocked);
         this.setTile(background, -1, -1, C.BG_TILES.floor_blocked);
         this.setTile(background, -1,  1, C.BG_TILES.floor_blocked);

         return background;
      },

      populateRoom: function(room) {
         // Add enemies and items to room
         var npc = new Classes.Adventurer();
         npc.dialog.push(["Oh...", "Hello.", "You look mighty strong there, what with that nice shiny armor and sword."]);
         npc.dialog.push(["Please don't hurt me, mister!"]);
         this.addItem(room, npc, 0, 0);
      }
   });
})(window);
