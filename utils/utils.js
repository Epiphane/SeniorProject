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

      label.width = GAME_WIDTH; // No wrapping

      return label;
   }
})(window);