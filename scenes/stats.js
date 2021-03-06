/*
 * The credits state of the game.
 */
function pieChart(x, y, w, vals) {
   var entities = [];
   var colors = ['#5DA5DA','#FAA43A','#60BD68','#F17CB0','#B2912F','#B276B2','#DECF3F','#F15854','#4D4D4D'];

   w = Math.floor(w / 2);

   var total = 0;
   vals.forEach(function(val) { total += val.value; });

   var chart = new Sprite(w * 2 + 40, w * 2);
   chart.x = x;
   chart.y = y;
   var surface = new Surface(w * 2 + 40, w * 2);
   var theta = 0;
   vals.forEach(function(value, index) {
      surface.context.fillStyle = colors[index];
      surface.context.beginPath();
      surface.context.moveTo(w, w);

      var arc = Math.PI * 2 * (value.value / total);
      surface.context.arc(w, w, w, theta, theta + arc, false);
      surface.context.fill();

      surface.context.beginPath();
      surface.context.moveTo(w * 2 + 20, index * 20 + 10);

      surface.context.arc(w * 2 + 20, index * 20 + 10, 8, 0, Math.PI * 2, false);
      surface.context.fill();

      entities.push(Utils.createLabel(value.option, x + w * 2 + 40, y + index * 20 + 10, { font: '12px Pokemon GB' }))

      surface.context.font = '8px Pokemon GB';
      surface.context.fillStyle = 'black';

      var x_center = w * (1 + Math.cos(theta + arc / 2) / 2) - 5;
      var y_center = w * (1 + Math.sin(theta + arc / 2) / 2);
      surface.context.fillText(value.picks + '/' + value.offerings, x_center, y_center);

      theta += arc;
   });
   chart.image = surface;

   entities.push(chart);

   // Create legend

   return entities;
}

Scenes.Stats = function() {
   var Stats = new Scene();
   Stats.backgroundColor = "black";
   Stats.stats = true;
   
   // Initialize exit preferences
   Stats.addChild(Utils.createLabel('Exit preference: ', 100, 120, {width: 600}));
   pieChart(100, 150, 100, RoomFirstExitPreference.values({
      except: ['Return']
   })).forEach(function(child) {
      Stats.addChild(child);
   });

   // Initialize exit preferences
   Stats.addChild(Utils.createLabel('Do you fight bats? ', 100, 320, {width: 600}));
   pieChart(100, 350, 100, Classes.Bat.prototype.Engaged.values()).forEach(function(child) {
      Stats.addChild(child);
   });
   Stats.addChild(Utils.createLabel('Do you fight slimes? ', 300, 320, {width: 600}));
   pieChart(300, 350, 100, Classes.Slime.prototype.Engaged.values()).forEach(function(child) {
      Stats.addChild(child);
   });

   // Initialize typical labels
   var labels = [
      Utils.createLabel('Statistics', 50, 50, { font: '16px Pokemon GB', width:400 }),
      Utils.createLabel('Press space to go back', 50, C.GAME_SIZE-50, { font: '12px Pokemon GB', width:600 })
   ];

   labels.forEach(function(label) {
      Stats.addChild(label);
   });
   
   Stats.addEventListener(Event.INPUT_START, function() {
      if (game.input.select) {
         var newSound = new buzz.sound('assets/sounds/select2.wav');
         newSound.play();

         // Return to previous screen
         game.popScene();
      }
   });

   return Stats;
};