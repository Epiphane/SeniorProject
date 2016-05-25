/**
 * This is the rest of senior project.
 * While Choice was about keeping track of the player's preferences,
 * Difficulty manager is where we want to use that data for
 * designing a difficulty curve.
 * 
 * In the difficulty manager, we will keep track of the difficulty curve,
 * and make any necessary changes to the game in order to keep up with
 * that.
 * 
 * This will probably be in the form of callbacks I guess?
 * We have some work to do, but it shouldn't be that...DIFFICULT.
 *
 * HA. H...a....I need help.
 *
 * DifficultyManager pretends that the curve is on an X-Y graph, so you
 * set the curve and then call setX/moveX when you want to change your position
 * on the curve (so that it doesn't have to be strictly level-based).
 * 
 */

var DifficultyManager = (function() {
   var DifficultyManager = {};
   
   var curve = function() { return 0 };
   var x = 0;

   var callbacks = [];

   DifficultyManager.setCurve = function(_curve) {
      curve = _curve;

      // Make it a function
      if (curve instanceof Array) {
         curve = function(x) {
            return _curve[Math.floor(x)];
         };
      }

      this.triggerChange();
   };

   DifficultyManager.setX = function(_x) {
      x = _x; 
      this.triggerChange();
   };
   DifficultyManager.moveX = function(_x) {
      this.setX(x + _x);
   };

   DifficultyManager.getDifficulty = function() {
      return curve(x);
   };

   DifficultyManager.triggerChange = function() {
      var difficulty = this.getDifficulty();
      callbacks.forEach(function(cb) {
         cb(difficulty);
      });
   };

   DifficultyManager.onChange = function(callback) {
      callbacks.push(callback);

      callback(this.getDifficulty());
   };

   return DifficultyManager;
})();