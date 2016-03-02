/*
 * The Entity class is the superclass to any object that appears in-game (except terrain).
 *  All objects have different interactions for when an enemy or character run into them.
 */
ClassManager.create('Entity', function(game) {
   return Class.create(Sprite, {
      // This method defines what this entity will do when another
      //  entity tries to move into its square.
      //
      // Returns FALSE if 'collider' should NOT move into my square
      // Returns TRUE  if 'collider' SHOULD move into my square.
      checkRunningIntoMe: function(collider) {
         return true;
      },

   });
});