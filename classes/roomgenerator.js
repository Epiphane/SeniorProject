/* 
 * The RoomGenerator class randomly assigns specified amounts  
 * Parameters:
 *    dir = The direction that the player went to get to this room
 *    scene = The scene of the room that should be stored as the previous room
 *    x, y, z = Coordinates of this room in relation to the first room of the level
 */
ClassManager.create('RoomGenerator', function(game) {
   return Class.create(Map, {
      initialize: function() {
         game.rooms = [];
      }
      /*
       * Given a roomType enum and a diffculty (be it a number or later, 
       * a metric attached to a player) generates and instantiates a new room.
       */
      setRoom: function(roomType, difficulty) {
         // TODO figure out where difficulty works in
         
      }
   });
});