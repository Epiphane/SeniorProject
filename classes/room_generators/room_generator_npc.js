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
         // Hoo boy, ok.
         // Firstly - we want custom dialog to appear only sometimes. (20%)
         if (chance.bool({likelihood : 20})) {
            var customDialog = chance.pick(Story.CUSTOM_DIALOGS, 1);
            var character = chance.pick(Story.CUSTOM_CHARACTERS, 1);
            var npc3 = null;

            //Yes this is gross but its the easiest way right now
            if (customDialog == Story.potionUseDialog) {
               npc3 = new Classes.Medic(customDialog(character));
            }
            else if (character == Story.NPC_CHARACTERS.adventurer)
               npc3 = new Classes.Adventurer(customDialog(character));
            else if (character == Story.NPC_CHARACTERS.strongman)
               npc3 = new Classes.Strongman(customDialog(character));
            else
               npc3 = new Classes.Mystic(customDialog(character));

            this.addItem(room, npc3, 1,0);
         }

         var npc1 = new Classes.Adventurer(Story.getLine(Story.NPC_CHARACTERS.adventurer));
         var npc2 = new Classes.Strongman(Story.getLine(Story.NPC_CHARACTERS.strongman));

         // 1/4 chance to have mystic npc appear.
         if (chance.bool({likelihood : 25})) {
            npc2 = new Classes.Mystic(Story.getLine(Story.NPC_CHARACTERS.mystic));
         }

         this.addItem(room, npc1, 0, -1);
         this.addItem(room, npc2, 0, 1);
      }
   });
})(window);
