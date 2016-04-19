/**
 * Hello yes, this is the senior project.
 * I am choice, your friendly options associate.
 * 
 * Here in Choice JS, we try to make your game creation experience
 * as easy as possible by allowing you to re-balance and modify
 * the game based on your players' choices! For example:
 *
 * What enemies absolutely ruin your player?
 * When does your player use potions
 * How does your player explore the dungeon?
 *
 * Try not to kill anyone!
 *
 * Best Wishes,
 *    Peeve Thunderton, 
 *    Ph.D Choice Associate
 *    CEO @ Unnamed, Inc
 *    "Just choose already!"
 */

var Choice = (function() {
   var Choice = {};

   /* Utility functions allow you to extend objects with new properties (subclass style) */
   /* Credit to Underscore.js */
   var combine = function(obj) {
      for (var index = 1; index < arguments.length; index++) {
         var source = arguments[index];
         for (var key in source) {
            obj[key] = source[key];
         }
      }
   };

   /* Credit to Backbone.js */
   var extend = function(protoProps, staticProps) {
      var parent  = this;
      var child;

      if (protoProps.constructor !== protoProps.__proto__.constructor)
         child = protoProps.constructor;
      else
         child = function() { return parent.apply(this, arguments); };

      combine(child, parent, staticProps || {});

      var Surrogate = function(){ this.constructor = child; };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;

      if (protoProps)
         combine(child.prototype, protoProps);

      child.prototype.__super__ = parent.prototype;

      return child;
   };

   var Class = function() {
      this.initialize.apply(this, arguments);
   };
   Class.prototype.initialize = function() {};
   Class.extend = extend;

   /**
    * A measurement is a discrete data point, used to keep track
    * Of quantitative data.
    * 
    * The default measurement is a numerical value.
    */
   var Measurement = Choice.Measurement = Class.extend({
      initialize: function(value) {
         this.value = value;
      },
      // Useful if you want to extend Measurement to include more information
      val: function() { 
         return this.value; 
      }
   });

   /**
    * Keeps track of an aggregate measurement of one (numerical) value
    * 
    * Uses exponential smoothing by default, unless alpha (default: 0.7) is set to 0:
    * avg = alpha * old_avg + (1 - alpha) * new_data
    * 
    * Large alpha means that the average stays relatively constant,
    * while a small alpha means the average will fluctuate frequently.
    */
   var Aggregate = Choice.Aggregate = Class.extend({
      // What kind of measurement we're keeping track of
      MeasurementClass: Measurement,
      defaultAlpha: 0.7,

      initialize: function(options) {
         // Defaults
         options = options || {};
         options.Measurement = options.Measurement || this.MeasurementClass;
         options.alpha = options.alpha || this.defaultAlpha;

         // Initialize measurements (maybe we won't want to keep this always...)
         this.measurements = [];

         this.currentAverage = 0;
         this.alpha = options.alpha;
         if (this.alpha < 0) {
            throw 'Alpha may not be less than 0';
         }
         else if (this.alpha > 1) {
            throw 'Alpha may not be greater than 1';
         }
      
         // In case we want to override the default MeasurementClass
         this.Measurement = options.Measurement;

         // Next function for measurements
         this.next = options.next || this.next;
      },
      log: function(value) {
         if (!(value instanceof Measurement)) {
            value = new this.Measurement(value);
         }

         this.measurements.push(value);
         
         // Set initial value
         if (this.measurements.length === 1) {
            this.currentAverage = value.val();
         }

         if (this.alpha === 0) {
            this.currentAverage *= this.measurements.length - 1;
            this.currentAverage += value.val();
            this.currentAverage /= this.measurements.length;
         }
         else {
            this.currentAverage *= this.alpha;
            this.currentAverage += value.val() * (1 - this.alpha);
         }
      },
      next: function() {
         throw 'Next is not implemented';
      },
      average: function() {
         return this.currentAverage;
      }
   });

   return Choice;
})();