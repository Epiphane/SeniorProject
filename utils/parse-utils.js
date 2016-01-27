/* Sets up Parse and has some helper functions for the database */
(function(window) {
   /* Holds all of our helper functions */
   var ParseUtils = window.ParseUtils = {};

   /* Get Parse up and running */
   ParseUtils.setup = function() {
      Parse.initialize("Z2FidZhAynqODZbhl3ldlBIAPqJv8dr4IHXKrjXE", "nagyQeZe8nZ0nundayOg57KUzomLIiUtl1LO33BE");
   }

   window.ParseEvent = Parse.Object.extend("Event");

})(window);

ParseUtils.setup();

// Eventually, set up user. For now, generate a random string and pretend it's my user ID.
var user_obj = localStorage.getItem("user_id");
if (!user_obj) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    user_obj = text;
    localStorage.setItem("user_id", user_obj);
}