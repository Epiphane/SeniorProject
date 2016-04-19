ClassManager.create('Potion', function(game) {
   return Class.create(Classes.Triggerable, {
      className: 'Potion',
      itemName: 'potion',
      didMoveOntoMe: function(collider, room) {
         if (collider instanceof Classes['Player']) {
            collider.potions ++;
            room.removeItemAt(this.position.x, this.position.y);
         }
      }
   });
});

var PotionUse = new Choice.Aggregate({
   next: function(player) {
      var player = player || game.currentScene.player;

      if (!player) {
         console.error('Trying to log a potion use when there\'s no player');
         return;
      }
      else {
         this.log(player.health / player.max_health);
      }
   }
});