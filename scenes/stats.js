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

      theta += arc;
   });
   chart.image = surface;

   entities.push(chart);

   // Create legend

   return entities;
}

/*
 * So this is where Enchant gets weird. Refer to utils/singleton.js to see more...
 */
Scenes.Stats = Singletonify(function(game) {
   var Stats = new Scene();
   Stats.backgroundColor = "black";
   
   // Initialize exit preferences

   Stats.addChild(Utils.createLabel('Exit preference: ', 100, 120, {width: 600}));
   pieChart(100, 150, 100, RoomFirstExitPreference.values()).forEach(function(child) {
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
});