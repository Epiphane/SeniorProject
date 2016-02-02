ClassManager.create('Pushable', function(game) {
   return Class.create(Classes.Item, {
		initialize: function(x, y) {
			Sprite.call(this, C.TILE_SIZE, C.TILE_SIZE);
			this.itemName = 'shield_4'
		},
 	});
});

life is pain