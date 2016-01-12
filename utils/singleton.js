/*
 * So this is where Enchant gets weird. You can't initialize a scene
 * until you already have a game instance up and running. HOWEVER,
 * there are a couple issues:
 *  - This instance is async, so we'd have to have some weird hook system
 *    to keep track of when the game is loaded
 *  - Since the title state is pretty static we don't want to create it
 *    over and over.
 *
 * SOLUTION: I made a "singleton"-y thing, so that you call Scenes.MyScene(game)
 *    and that will give you the MyScene Scene.
 */

/**
 * At that point every state looked like this:
 *    var MyState = null;
 *
 *    Scenes.MyState = function(game) {
 *       if (MyState) return MyState;
 * 
 *       ... 
 *    };
 *
 * So at that point I wanted to save myself some time. Ergo...
 */

window.Singletonify = function(initialize) {
   var singleton = null;

   return function(/* args... */) {
      if (!singleton) {
         singleton = initialize.apply(null, arguments);
      }

      return singleton;
   }
}