/*
 * Utility functions
 */

(function(window) {
   /* Holds all of our helper functions */
   var Utils = window.Utils = {};

   /**
    * Create a label to display text.
    *
    * Options for the opts argument: font, color, align
    */
   Utils.createLabel  = function(text, x, y, opts) {
      opts = opts || {}; // This treats {} as the default value for opts, so that its optional

      var label       = new Label();
          label.text  = text;
          label.x     = x;
          label.y     = y;
          label.font  = opts.font || '14px sans-serif'; // That way font is optional...
          label.color = opts.color || 'white';          // And color too!
      label.textAlign = opts.align || 'left';

      label.width = C.GAME_WIDTH; // No wrapping

      return label;
   }

   /**
   * Get a random floating point number between `min` and `max`.
   * 
   * @param {number} min - min number
   * @param {number} max - max number
   * @return {float} a random floating point number
   */
  Utils.getRandom = function (min, max) {
      return Math.random() * (max - min) + min;
  }

   /**
    * Get a random integer between `min` and `max`.
    * 
    * @param {number} min - min number
    * @param {number} max - max number
    * @return {int} a random integer
    */
   Utils.getRandomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
   }

   // Conversions
   Utils.to = {};

   /**
    * Get a direction enum given dir_x and dir_y.
    *
    * @param {numbet} dir_x - either -1, 0, or 1
    * @param {number} dir_y - either -1, 0, or 1
    * @return {int} P_DIR enum
    */
   Utils.to.P_DIR = function(dir_x, dir_y) {
      if (dir_x === -1) return C.P_DIR.LEFT;
      if (dir_x ===  1) return C.P_DIR.RIGHT;
      if (dir_y === -1) return C.P_DIR.UP;
      if (dir_y ===  1) return C.P_DIR.DOWN;

      console.error('Not a valid direction:', dir_x, dir_y);
      return -1;
   };

   /**
    * Get a dir_x and dir_y from a P_DIR enum
    *
    * @param {int} P_DIR enum
    * @return {array} an array of the [x, y] direction
    */
   Utils.to.direction = function(dir) {
      if (dir === C.P_DIR.LEFT ) return [-1,  0];
      if (dir === C.P_DIR.RIGHT) return [ 1,  0];
      if (dir === C.P_DIR.UP   ) return [ 0, -1];
      if (dir === C.P_DIR.DOWN ) return [ 0,  1];
   }
})(window);