/*
 * The Dialogue class controls the displaying and dismissal of dialogue boxes
 */
ClassManager.create('Dialogue', function(game) {
   return Class.create(Group, {
      initialize: function(textDictionary) {
         Group.call(this);

         this.text = textDictionary || {};
         this.labels = [];
         this.portrait = new Classes.Portrait();
         this.textbox = new Classes.Textbox();
         this.addChild(this.textbox);
         this.addChild(this.portrait);

         // TODO: add actual text display
         // For label adding, they need to be offset by C.HUD_FRAME+100 in X
         // Y offset tbd
      },
   });
});

// For the portrait
ClassManager.create('Portrait', function(game) {
   return Class.create(Sprite, {
      initialize: function(sprite) {
         Sprite.call(this, 100,100);
         this.sprite = sprite || "portrait.png";
         this.image = game.assets["assets/images/"+this.sprite];
         this.x = C.HUD_FRAME;
         this.y = C.GAME_SIZE-C.HUD_FRAME*2-this.height;
         // TODO add animation support
      }
   });
});

// For the textbox
ClassManager.create('Textbox', function(game) {
   return Class.create(Sprite, {
      initialize: function() {
         Sprite.call(this, 600, 200);
         this.image = game.assets["assets/images/textbox.png"];
         this.x = C.HUD_FRAME/2;
         this.y = C.GAME_SIZE-C.HUD_FRAME/2-this.height;
      }
   });
});