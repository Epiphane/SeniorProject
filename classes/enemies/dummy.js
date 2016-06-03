/*
 * The Dummy class doesn't fight back
 */
ClassManager.create('Dummy', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster2-rip.gif",
      initial_health: 100,
      act: function() {
      }
   });
});