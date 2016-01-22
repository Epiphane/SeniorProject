/* 
 * The Room class creates the layout of each dungeon room 
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
ClassManager.create('Dungeon', function(game) {
   return Class.create(Group, {
      initialize: function() {
         Group.call(this);
      
         var initialRoom = null;
      }
   });
});