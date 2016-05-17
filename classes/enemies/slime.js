ClassManager.create('Slime', function(game) {
   return Class.create(Classes['WaitingEnemy'], {
      sprite: "monster1.gif",
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_health: 3,

      Engaged: new Choice.Preference({ Choice: Choice.Boolean }),
      DamageDealt: new Choice.Aggregate(),
      DamageTaken: new Choice.Aggregate(),
   });
});