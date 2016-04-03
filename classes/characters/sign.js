/**
  * Represents a readable sign with one dialog
  * parameters:
  *      x: x-location to be spawned at
  *      y: y-location to be spawned at
  */
ClassManager.create('Sign', function(game) {
	return Class.create(Classes['NPC'], {
		initialize: function(dialog) {
         Classes['NPC'].call(this,0,0);
         this.image = game.assets["assets/images/sign.png"];
         this.dialog = dialog;
         this.portrait = "sign_portrait.png";
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