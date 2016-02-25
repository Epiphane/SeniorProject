ClassManager.create('Bat', function(game) {
   return Class.create(Classes['Enemy'], {
      sprite: "monster2.gif",
      // attack_range: 2,
      walkStartFrame: 3,
      walkEndFrame:   5,
      initial_attack: 1,
      initial_health: 1,
   });
});