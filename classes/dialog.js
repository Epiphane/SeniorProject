/*
 * The dialog class controls the displaying and dismissal of dialog boxes
 */
ClassManager.create('Dialog', function(game) {
   var dialogPadding = 15;
   var textWidth = 430;
   var bottomPadding = 130;
   var pressEx = 530;
   var pressEy = 588
   return Class.create(Group, {
      initialize: function(speaker) {
         Group.call(this);
         this.portrait = new Classes.Portrait(speaker);
         this.textbox = new Classes.Textbox();
         this.addChild(this.textbox);
         this.addChild(this.portrait);
         this.active = false;
         this.timer = 100;
         this.instance = 0;
         this.label = Utils.createLabel("", C.HUD_PADDING+this.portrait.width+dialogPadding, C.GAME_SIZE-C.HUD_PADDING-bottomPadding-dialogPadding, {font: '12px Pokemon GB'});
         this.label.width = textWidth;
         this.addChild(this.label);
      },
      say: function(words) {
         this.words = words;
         this.label.text = words[this.instance];

         this.advanceTextLabel = Utils.createLabel("Press E", pressEx,pressEy, {font: '10px Pokemon GB'});
         this.advanceButton = false;
         this.addChild(this.advanceTextLabel);
         this.show();

         if (Story.needsToGivePotion) {
            game.currentScene.player.potions++;
            Story.needsToGivePotion = false;
         }
      },
      setExpression: function(sprite) {
         this.portrait.image = game.assets["assets/images/"+sprite];
      },
      advance: function() {
         this.instance = Math.min(this.instance+1, this.words.length);
         if (this.instance == this.words.length) {
            this.hide();
            this.instance = 0;
         }
         else {
            this.label.text = this.words[this.instance];
         }
      },
      hide: function() {
         this.active = false;
         game.currentScene.removeChild(this);
         this.removeChild(this.advanceTextLabel);
      },
      show: function() {
         this.active = true;
         game.currentScene.addChild(this);
      },
      isActive: function() {
         return this.active;
      },
      onenterframe: function() {
         this.timer = this.timer - 1;
         if (this.timer <= 0) {
            this.timer = 100;
            this.addChild(this.advanceTextLabel);
         }
         else if (this.timer < 50) {
            this.removeChild(this.advanceTextLabel);
         }
      }
   });
});

// For the portrait
ClassManager.create('Portrait', function(game) {
   return Class.create(Sprite, {
      initialize: function(sprite) {
         Sprite.call(this, 100,100);
         this.sprite = sprite || "portrait.png";
         this.image = game.assets["assets/images/"+this.sprite];
         this.x = C.HUD_PADDING;
         this.y = C.GAME_SIZE-C.HUD_PADDING*2-this.height;
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
         this.x = C.HUD_PADDING/2;
         this.y = C.GAME_SIZE-C.HUD_PADDING/2-this.height;
      }
   });
});