/**
  * Represents an adventurer (npc1) sprite with one dialog
  */
ClassManager.create('Medic', function(game) {
	return Class.create(Classes['NPC'], {
    sprite: 'medic.png',

		initialize: function(dialog) {
         Classes['NPC'].call(this,0,0);
         this.dialog = dialog;
         this.portrait = "portrait.png";
      },
      getDialog: function() {
         this.dialogInstance = Math.min(this.dialogInstance+1, this.dialog.length);
         return this.dialog[this.dialogInstance-1];
      },
      say: function() {
         game.currentScene.dialogManager.setExpression(this.portrait);
         game.currentScene.dialogManager.say(this.getDialog());
      },
	});
});