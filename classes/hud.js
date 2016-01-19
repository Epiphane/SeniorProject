/* 
 * The HUD class manages all the things we show on top of the game, including:
 *
 * - Hearts
 * - Currently Equipped Item
 */
ClassManager.create('HUD', function(game) {
   return Class.create(Group, {
      initialize: function() {
         Group.call(this);

         this.hearts = [];
         for (var i = 0; i < 4; i ++) {
            var heart = new Classes.HUD_Object();
            heart.y = 35;
            heart.x = C.GAME_WIDTH - 35 - (i + 1) * heart.width;

            this.addChild(heart);
            this.hearts.push(heart);
         }

         this.hearts[0].frame = 2;
         this.hearts[1].frame = 1;

         this.weaponFrame = new Classes.HUD_Frame();
         this.weaponFrame.x = this.weaponFrame.y = 38;
         this.addChild(this.weaponFrame);

         this.weapon = new Classes.Item();
         this.weapon.frame = C.Items['sword'];
         this.weapon.x = this.weapon.y = 47;
         this.addChild(this.weapon);
      }
   });
});

ClassManager.create('HUD_Object', function(game) {
   return Class.create(Sprite, {
      initialize: function() {
         Sprite.call(this, 50, 50);
         this.image = game.assets["assets/images/hud.png"];
      },
   });
});

ClassManager.create('HUD_Frame', function(game) {
   return Class.create(Classes.HUD_Object, {
      initialize: function() {
         Classes.HUD_Object.call(this);

         this.frame = C.HUD['frame'];
      },
   });
});
