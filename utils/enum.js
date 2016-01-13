/* This allows for a basic Enum implementation */

window.Enum = function Enum(options) {
   if (arguments.length > 1) {
      // Convert `arguments` to an array
      options = Array.prototype.slice.call(arguments);
   }

   if (options instanceof Array) {
      var temp = {};

      for (var ndx in options) {
         temp[options[ndx]] = parseInt(ndx, 10);
      }

      options = temp;
   }

   return Object.freeze(options);
}