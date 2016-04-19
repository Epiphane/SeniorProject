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
    * Super generic choice class. See below for more specific implementations.
    */
   var ChoiceClass = Choice.Choice = Class.extend({
      initialize: function(value) {
         this.value = value;
      }
   });

   /**
    * A quantitative measurement is a discrete data point, used to keep track
    * Of quantitative data.
    * 
    * The default quantitative measurement is a numerical value.
    */
   var Quantitative = Choice.Quantitative = ChoiceClass.extend({
      val: function() { 
         return this.value; 
      }
   });

   /**
    * A qualitative measurement is a choice between different options (A or B)
    * that cannot be averaged like Quantitative measurements
    */
   var Qualitative = Choice.Qualitative = ChoiceClass.extend({
      initialize: function(value) {
         if (typeof(value) === 'string') {
            value = this.constructor.options.indexOf(value);
         }

         ChoiceClass.prototype.initialize.call(this, value);
      },
      index: function() {
         return this.value;
      },
      val: function() {
         return this.constructor.options[this.value];
      }
   }, {
      // An array of Strings for each option
      options: []
   });

   /**
    * Keeps track of all of a player's choices on a specific topic
    */
   var Decisions = Choice.Decisions = Class.extend({
      ChoiceConstructor: null,

      initialize: function(options) {
         options = options || {};
         this.Choice = options.Choice || this.ChoiceConstructor;

         // Initialize memory (maybe we won't want to keep this always...)
         this.decisions = [];

         // Next function for measurements
         this.next = options.next || this.next;
      },

      log: function(value) {
         // Create a choice object with the info
         if (!(value instanceof ChoiceClass)) {
            value = new this.Choice(value);
         }

         this.decisions.push(value);

         return value;
      },

      next: function() {
         throw 'Next is not implemented';
      },

      value: function() {
         throw 'Value is not implemented!';
      }
   });

   /**
    * Keeps track of an aggregate measurement of one Quantitative value
    * 
    * Uses exponential smoothing by default, unless alpha (default: 0.7) is set to 0:
    * avg = alpha * old_avg + (1 - alpha) * new_data
    * 
    * Large alpha means that the average stays relatively constant,
    * while a small alpha means the average will fluctuate frequently.
    */
   var Aggregate = Choice.Aggregate = Decisions.extend({
      // What kind of measurement we're keeping track of
      ChoiceConstructor: Quantitative,
      defaultAlpha: 0.7,

      initialize: function(options) {
         // Parent initialize
         Decisions.prototype.initialize.apply(this, arguments);

         // Defaults
         options = options || {};
         options.alpha = options.alpha || this.defaultAlpha;

         this.currentAverage = 0;
         this.alpha = options.alpha;
         if (this.alpha < 0) {
            throw 'Alpha may not be less than 0';
         }
         else if (this.alpha > 1) {
            throw 'Alpha may not be greater than 1';
         }

         // Next function for measurements
         this.next = options.next || this.next;
      },

      log: function(value) {
         // log returns the value to make sure it's a Choice subclass
         value = Decisions.prototype.log.apply(this, arguments);
         
         // Set initial value
         if (this.measurements.length === 1) {
            this.currentAverage = value.val();
         }

         // Compute average
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

      value: function() {
         return this.currentAverage;
      }
   });

   /**
    * Tracks a Qualitative set of choices, which can't be represented
    * as an average. Instead, value() returns the most favored choice
    * and a value specifying how much the player prefers that choice.
    *
    * Preference is calculated as follows:
    * 1. Every option is given an initial preference of 1/(# options)
    * 2. When a new choice is made, all options' preference is multiplied by (# options - 1)/(# options)
    *       (e.g. if there are 4 choices and the player chooses #1, then the
    *             preference of the other three is multiplied by 0.75)
    * 3. Then, the new option gains 0.25 points of favor
    */
   var Preference = Choice.Preference = Decisions.extend({
      ChoiceConstructor: Qualitative,
      defaultAlpha: 0.25,

      initialize: function(options) {
         // Initialize the parent
         Decisions.prototype.initialize.apply(this, arguments);

         // Defaults
         options = options || {};
         options.alpha = options.alpha || this.defaultAlpha;

         this.preferences = [];

         var initialPreference = 1 / this.Choice.options.length;
         for (var i = 0; i < this.Choice.options.length; i ++) {
            this.preferences.push(initialPreference);
         }

         this.alpha = options.alpha;
         if (this.alpha < 0)
            throw 'Alpha may not be less than 0';
         else if (this.alpha > 1)
            throw 'Alpha may not be greater than 1';
      },

      log: function(value) {
         // log returns the value to make sure it's a Choice subclass
         value = Decisions.prototype.log.apply(this, arguments);

         var delta = this.alpha;
         var dilution = 1 - delta;
         this.preferences.forEach(function(pref, index, array) {
            array[index] = pref * dilution;

            if (value.index() === index) {
               array[index] += delta;
            }
         });
      },

      value: function() {
         var self = this;
         var max = { value: null, preference: 0 };

         this.preferences.forEach(function(value, index) {
            if (value > max.preference) {
               max.value = self.Choice.options[index];
               max.preference = value;
            }
         });

         return max;
      }
   });

   return Choice;
})();