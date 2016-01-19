/* 
 * The HUD class manages all the things we show on top of the game, including:
 *
 * - Hearts
 * - Currently Equipped Item
 */
ClassManager.create('HUD', function(game) {
   return Class.create(Group, {
      initialize: function(player) {
         Group.call(this);

         if (!player) throw 'Player is required for the HUD';

         this.player = player;

         this.hearts = [];
         while (this.hearts.length < player.max_health / 2) {
            this.addHeart();
         }

         var weaponFrame = new Classes.HUD_Frame();
         weaponFrame.x = weaponFrame.y = 38;
         this.addChild(weaponFrame);

         var armorFrame = new Classes.HUD_Frame();
         armorFrame.x = 38;
         armorFrame.y = 38 + C.TILE_SIZE * 2;
         this.addChild(armorFrame);

         this.weapon = new Classes.Item();
         this.weapon.x = this.weapon.y = 47;
         this.addChild(this.weapon);

         this.armor = new Classes.Item();
         this.armor.x = 47;
         this.armor.y = 47 + C.TILE_SIZE * 2;
         this.addChild(this.armor);
      },

      addHeart: function() {
         var heart = new Classes.HUD_Object();
         this.hearts.push(heart);
         this.addChild(heart);

         heart.x = C.GAME_WIDTH - C.HEART_PADDING - this.hearts.length * heart.width;
         heart.y = C.HEART_PADDING;
      },

      onenterframe: function() {
         if (this.player.weapon) {
            this.weapon.frame = C.Items[this.player.weapon.itemName];
         }

         if (this.player.armor) {
            this.armor.frame = C.Items[this.player.armor.itemName];
         }

         while (this.hearts.length > this.player.max_health / 2) {
            this.removeChild(this.hearts.pop());
         }
         while (this.hearts.length < this.player.max_health / 2) {
            this.addHeart();
         }

         for (var i = 1; i <= this.hearts.length; i ++) {
            var heart = this.hearts[this.hearts.length - i];
            heart.frame = Math.max(Math.min(2 * i - this.player.health, 2), 0);

         }
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
