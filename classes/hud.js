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
         weaponFrame.x = weaponFrame.y = C.HUD_PADDING;
         this.addChild(weaponFrame);

         this.weaponBonus = Utils.createLabel('', 64, weaponFrame.y + 30, { font: '14px serif' });
         this.addChild(this.weaponBonus);

         var armorFrame = new Classes.HUD_Frame();
         armorFrame.x = C.HUD_PADDING;
         armorFrame.y = C.HUD_PADDING + C.TILE_SIZE * 2;
         this.addChild(armorFrame);

         this.armorBonus = Utils.createLabel('', 64, armorFrame.y + 30, { font: '14px serif' });
         this.addChild(this.armorBonus);

         var potionsFrame = new Classes.HUD_Frame();
         potionsFrame.x = C.HUD_PADDING;
         potionsFrame.y = C.HUD_PADDING + C.TILE_SIZE * 4;
         this.addChild(potionsFrame);

         this.weapon = new Classes.Item();
         this.weapon.x = this.weapon.y = 47;
         this.addChild(this.weapon);

         this.armor = new Classes.Item();
         this.armor.x = 47;
         this.armor.y = 47 + C.TILE_SIZE * 2;
         this.addChild(this.armor);
      
         var potions = new Classes.Potion();
         potions.x = 47;
         potions.y = 47 + C.TILE_SIZE * 4;
         this.addChild(potions);

         this.potions = Utils.createLabel('0', 75, 41 + C.TILE_SIZE * 4, { font: '14px serif' });
         this.potionHelp = Utils.createLabel('F', 75, 69 + C.TILE_SIZE*4, { font:'14px serif'});
         this.addChild(this.potions);
         this.addChild(this.potionHelp);
      },

      addHeart: function() {
         var heart = new Classes.HUD_Object();
         this.hearts.push(heart);
         this.addChild(heart);

         heart.x = C.GAME_SIZE - C.HEART_PADDING - this.hearts.length * heart.width;
         heart.y = C.HEART_PADDING;
      },

      onenterframe: function() {
         if (this.player.weapon) {
            this.weapon.frame = C.Items[this.player.weapon.itemName];
            this.weaponBonus.text = '+ ' + this.player.weapon.attack;
         }
         else {
            this.weaponBonus.text = '';
         }

         if (this.player.armor) {
            this.armor.frame = C.Items[this.player.armor.itemName];
            this.armorBonus.text = '+ ' + this.player.armor.defense;
         }
         else {
            this.armorBonus.text = '';
         }

         while (this.hearts.length > this.player.max_health / 2) {
            this.removeChild(this.hearts.pop());
         }
         while (this.hearts.length < this.player.max_health / 2) {
            this.addHeart();
         }

         for (var i = 1; i <= this.hearts.length; i ++) {
            // Gross code don't look at it
            var heart = this.hearts[this.hearts.length - i];
            heart.frame = Math.max(Math.min(2 * i - this.player.health, 2), 0);
         }

         this.potions.text = '' + this.player.potions;
      }
   });
});

ClassManager.create('HUD_Object', function(game) {
   return Class.create(Sprite, {
      initialize: function() {
         Sprite.call(this, C.HUD_TILESIZE, C.HUD_TILESIZE);
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
