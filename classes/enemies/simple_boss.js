ClassManager.create('SimpleBoss', function(game) {
   return Class.create(Classes['Boss'], {
      sprite: "boss1.png",
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_health: 80,
      cooldown: 2,

      act: function() {
         Classes['Boss'].prototype.act.apply(this, arguments);

         if (this.special > 0) {
            this.special --;
            return;
         }

         this.special = 8;

         // Spawn an enemy somewhere!
         var currentRoom = game.currentScene.currentRoom;
         currentRoom.addCharacter(new Classes['Bat'](),  Math.floor(currentRoom.width / 2) - 2,  Math.floor(currentRoom.height / 2) - 2);
         currentRoom.addCharacter(new Classes['Bat'](), -Math.floor(currentRoom.width / 2) + 2,  Math.floor(currentRoom.height / 2) - 2);
         currentRoom.addCharacter(new Classes['Bat'](),  Math.floor(currentRoom.width / 2) - 2, -Math.floor(currentRoom.height / 2) + 2);
         currentRoom.addCharacter(new Classes['Bat'](), -Math.floor(currentRoom.width / 2) + 2, -Math.floor(currentRoom.height / 2) + 2);
      }
   });
});