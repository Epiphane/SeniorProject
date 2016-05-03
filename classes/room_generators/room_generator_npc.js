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
         // TODO: Replace all 0's with actual story level (0-2)
         // We want 2 npcs per room.
         var npc1 = new Classes.Adventurer(Story.getLine(Story.NPC_CHARACTERS.adventurer, "story", 0));
         var npc2 = new Classes.Strongman(Story.getLine(Story.NPC_CHARACTERS.strongman, "story", 0));

         // 1/4 chance to have mystic npc appear.
         if (chance.bool({likelihood : 25})) {
            npc2 = new Classes.Mystic(Story.getLine(Story.NPC_CHARACTERS.mystic, "story", 0));
         }

         this.addItem(room, npc1, 0, -1);
         this.addItem(room, npc2, 0, 1);
      }
   });
})(window);
