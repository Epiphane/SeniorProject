/*
 * Enchant is a fun little guy. There's a way to create classes
 * in enchant, which is the following:
 *
 * var MyClass = Class.create(superclass, {
 *    extra stuff...
 * });
 *
 * HOWEVER! There are a few problems:
 *    1. You can't load assets unless you have the game object
 *       solution: put it in the same file as the game
 *       
 *    2. Now all the classes are in a 2000 line main file
 *       solution: make the files a function that takes the game as a parameter
 *
 *    3. NOW you have to remember to add a function call to even LOAD the class!
 *       GAHHHH
 *       solution: Class manager!
 *
 * The class manager is your one way stop to making classes. In order to use it,
 * simple do the following:
 * 
 * ClassManager.create('MyClass', function(game) {
 *    return Class.create(...);
 * });
 *
 * This will assign the Classes.MyClass variable.
 */
window.ClassManager = {};
window.Classes = {};

// Scoping...
(function() {
   var game = null;
   var initializers = {};

   ClassManager.create = function(name, initialize) {
      if (game) Classes[name] = initialize(game);
      else {
         initializers[name] = initialize;
      }
   };

   ClassManager.initialize = function(g) {
      game = g;

      for (var className in initializers) {
         Classes[className] = initializers[className](game);
         delete initializers[className];
      }

      Object.freeze(Classes);
   };

})();