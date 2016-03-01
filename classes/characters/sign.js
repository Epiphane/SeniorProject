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
         this.dialogue = dialog;
         this.portrait = "sign_portrait.png";
         this.dialogueInstance = 0;
      },
      getDialogue: function() {
         this.dialogueInstance = Math.min(this.dialogueInstance+1, this.dialogue.length);
         return this.dialogue[this.dialogueInstance-1];
      },
      say: function() {
         game.currentScene.dialogueManager.setExpression(this.portrait);
         game.currentScene.dialogueManager.say(this.getDialogue());
      },
	});
});