/*
 * The Entity class is the superclass to any object that appears in-game (except terrain).
 *  All objects have different interactions for when an enemy or character run into them.
 */
ClassManager.create('Entity', function(game) {
   return Class.create(Sprite, {
      // This method tells whether or not a given entity can move
      //  onto its tile.
      //
      // Returns FALSE if 'collider' should NOT move into my square
      // Returns TRUE  if 'collider' SHOULD move into my square.
      canMoveOntoMe: function(collider) {
         return true;
      },

      // Called when the 'collider' entity moved onto my tile.
      didMoveOntoMe: function(collider) {

      },

      // Called every turn.
      everyTurn: function() {
         
      },

   });
});
