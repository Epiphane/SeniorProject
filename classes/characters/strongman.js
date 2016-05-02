/**
  * Represents a strongman (npc2) sprite with one dialog
  */
ClassManager.create('Strongman', function(game) {
	return Class.create(Classes['NPC'], {
    sprite: 'npc2.png',

		initialize: function(dialog) {
         Classes['NPC'].call(this,0,0);
         this.dialog = dialog;
         this.portrait = "portrait2.png";
         this.dialogInstance = 0;
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