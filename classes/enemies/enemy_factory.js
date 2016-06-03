/*
 * This is just because aggregating stuff is a pain in the butt,
 * so now we can just leave it up to EnemyFactory.create!
 */
var EnemyFactory = {};

EnemyFactory.create = function(name, superclass_name, definition) {
   ClassManager.create(name, function(game) {
      definition = definition || {};

      // Choices
      var Engaged = definition.Engaged = new Choice.Preference({ Choice: Choice.Boolean });
      var AttacksMade = definition.AttacksMade = new Choice.Aggregate();
      var AttacksTaken = definition.AttacksTaken = new Choice.Aggregate();

      // Enemy class object
      var EnemyClass = Class.create(Classes[superclass_name], definition);

      // Initial parameters for tweaking
      // Let's suppose that these stats are supposed to apply when
      // difficulty == 0.1 (since that's the "base")
      var initial_attack = EnemyClass.prototype.initial_attack;
      var initial_defense = EnemyClass.prototype.initial_defense;
      var initial_health = EnemyClass.prototype.initial_health;

      // We're doing it boysssss
      DifficultyManager.onChange(function(newDifficulty) {
         // If this enemy gets to attack often, let's raise their attack 
         var average_attacks = Math.max(AttacksMade.value(), 1);
         var attack = Math.round(initial_attack * average_attacks * (newDifficulty * 2 + 0.8));
         console.log(initial_attack, average_attacks, attack);

         if (attack !== EnemyClass.prototype.initial_attack) {
            var change = (attack > EnemyClass.prototype.initial_attack ? 'stronger' : 'weaker');
            Scenes.Transition.logChange(name + ' is getting ' + change);

            EnemyClass.prototype.initial_attack = attack;
         }
      
         // If this enemy gets attacked often, let's increase their health
         // Thought: if you avoid every enemy, give it 1/3 the health
         //          if you attack them all, give them 5/3 the health
         var avoidanceRatio = Engaged.valueOf(false);
         var health = Math.ceil(initial_health * (1.33 * avoidanceRatio + 0.33) * (newDifficulty * 2 + 0.8));
         if (health !== EnemyClass.prototype.initial_health) {
            var change = (health > EnemyClass.prototype.initial_health ? 'tougher' : 'less tough');
            Scenes.Transition.logChange(name + ' is getting ' + change);
            
            EnemyClass.prototype.initial_health = health;
         }
      });

      return EnemyClass;
   });
};