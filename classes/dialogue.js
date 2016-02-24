/*
 * The Dialogue class controls the displaying and dismissal of dialogue boxes
 */
ClassManager.create('Dialogue', function(game) {
   return Class.create(Sprite, {
      initialize: function(textDictionary) {
         Sprite.call(this, 600, 200);
         this.text = textDictionary || {};
         this.image = game.assets["assets/images/textbox.png"];
         this.x = 19;
         this.y = C.GAME_SIZE-19;
      },
   });
});