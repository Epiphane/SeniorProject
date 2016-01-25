/* Sets up Parse and has some helper functions for the database */
(function(window) {
   /* Holds all of our helper functions */
   var ParseUtils = window.ParseUtils = {};

   /* Get Parse up and running */
   ParseUtils.setup = function() {
      Parse.initialize("Z2FidZhAynqODZbhl3ldlBIAPqJv8dr4IHXKrjXE", "nagyQeZe8nZ0nundayOg57KUzomLIiUtl1LO33BE");
   }

   /* Keeps track of the objects from Parse that we're currently messing with */
   ParseUtils.liveObjects = {};

})(window);

ParseUtils.setup();