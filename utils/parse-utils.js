/* Sets up Parse and has some helper functions for the database */
(function(window) {
   /* Holds all of our helper functions */
   var ParseUtils = window.ParseUtils = {};

   /* Get Parse up and running */
   ParseUtils.setup = function() {
      Parse.initialize("adaptive-database");
      Parse.serverURL = 'https://adaptive-database.herokuapp.com/parse'
   }

   window.currentGame = null;

   window.ParseEvent = Parse.Object.extend("Event");
   window.ParseGame = Parse.Object.extend("Game", {
      initialize: function(attrs, options) {
         attrs = attrs || {};
         attrs.user_placeholder = user_obj;
         attrs.dungeons_completed = 0;
      }
   });
   window.ParseDungeon = Parse.Object.extend("Dungeon", {
      initialize: function(attrs, options) {
         attrs = attrs || {};
         attrs.game = window.currentGame;
         attrs.level = window.currentGame.get('dungeons_completed');
         attrs.roomsExplored = 0;
      }
   });
   window.ParseRoom = Parse.Object.extend("Room", {
      defaults: {
         timesVisited: 0,
         actionsTaken: 0,
         genocide: false,
         height: C.MAP_SIZE - 8,
         width: C.MAP_SIZE - 6,
         depth: 0,
         orderVisited: -1,
         dungeon: null
      },
      initialize: function(attrs, options) {
         for (var key in this.defaults) {
            attrs[key] = attrs[key] || this.defaults[key];
         }
         attrs.game = window.currentGame;
      }
   });
   window.ParseNPC = Parse.Object.extend("NPC", {
      initialize: function(attrs, options) {
         attrs.numInteractions = 0;
         attrs.damageDealtToPlayer = 0;
      }
   })

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