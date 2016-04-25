/* 
 * The NPCRoomGenerator class randomly creates a room centered around an NPC
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
         // TODO: Get dialog from story.js
         var dialog = []
         dialog.push(["Oh...", "Hello.", "You look mighty strong there, what with that nice shiny armor and sword."]);
         dialog.push(["Please don't hurt me, mister!"]);
         var npc = new Classes.Adventurer(dialog);
         this.addItem(room, npc, 0, 1);
      }
   });
})(window);
