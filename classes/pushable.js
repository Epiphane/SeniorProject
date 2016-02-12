ClassManager.create('Pushable', function(game) {
   return Class.create(Classes.Triggerable, {
		itemName: 'shield_4',
		className: 'Pushable',

		act: function(something) {
			// Fun stuff
			console.log("Act received... " + something);
		}
 	});
});
