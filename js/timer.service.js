
counterApp.factory('timersService', function($interval, audioService){

  var service = {};

  /* Timer list factory used for count down and chronos*/
  service.makeTimers = function(name) {
    var timers = {};

    timers.list = [];
    timers.total_created = 0;
    timers.laps = false;

    /* Remove stop a timer and remove it */
    timers.remove = function(i){
      timers.list[i].stop();
      timers.list.remove(i);
    };

    /* Add a new timer to the list, with an initial value
    * (default is 0).
    */
    timers.add = function() {
      timers.total_created += 1;
      timers.list.push(timers.createTimer());
    };

    timers.createTimer = function(onZero){

      var timer = {
          "name": name + " " + timers.total_created,
          "value": 0,
          "initialValue": 0,
          "isRunning": false,
          "overlapValue": 0,
          "laps":[],
          "onZero": onZero || audioService.alert,

          /* hour/min/sec getters and setters */
          "_hours": function(val){
            if (typeof val !== "undefined" && val >= 0) {
              var hours = (timer._hours() * 3600);
              timer.value = timer.value - hours + (3600 * val);
              timer.initialValue = timer.value;
              timer.overlapValue = 0;
            }

            return intDiv(timer.value, 3600);
          },
          "_minutes": function(val){
            if (typeof val !== "undefined" && val >= 0) {
              var minutes = (timer._minutes() * 60);
              timer.value = timer.value - minutes + (val * 60);
              timer.initialValue = timer.value;
              timer.overlapValue = 0;
            }
            return intDiv(timer.value % 3600, 60);
          },
          "_seconds": function(val){
            if (typeof val !== "undefined" && val >= 0) {
              timer.value = timer.value - timer._seconds() + val;
              timer.initialValue = timer.value;
              timer.overlapValue = 0;
            }
            return Math.floor(timer.value % 60);
          },

          /* overlap hour/min/sec getters */
          "over_hours": function(val){
            return Math.abs(intDiv(timer.overlapValue, 3600));
          },
          "over_minutes": function(){
            return Math.abs(intDiv(timer.overlapValue % 3600, 60));
          },
          "over_seconds": function(){
            return Math.abs(Math.floor(timer.overlapValue % 60));
          },

          /* Methods to start and stop counting up / down */
          "countUp": function(){
            timer.stop();
            timer.isRunning = $interval(function(){
              if (timer.overlapValue >= 0) {
                timer.value += 1;
              } {
                timer.overlapValue += 1;
              }
            }, 1000);
            return timer;
          },
          "countDown": function(){
            timer.stop();
            timer.isRunning = $interval(function(){

              if (timer.value > 0){
                timer.value -= 1;
              } else {
                timer.overlapValue -= 1;
              }

              if (!timer.value && !timer.overlapValue){
                timer.onZero();
              }

            }, 1000);
            return timer;
          },
          "stop": function(){
            if (timer.isRunning){
                $interval.cancel(timer.isRunning);
                timer.isRunning = false;
            }
            return timer;
          },
          "toZero": function(){
            timer.initialValue = 0;
            timer.overlapValue = 0;
            timer.value = 0;
            timer.laps = [];
          },
          "reset": function(){
            timer.overlapValue = 0;
            timer.value = timer.initialValue;
            timer.laps = [];
          },
          "restart": function(){
            timer.reset();
            timer.countDown();
          },

          /* Add a timer as a lap value */
          "addLap": function(){
            var lap = timers.createTimer();
            lap.value = timer.value;
            timer.laps.push(lap);
          }


      };


      /* Define properties for hour/min/sec getters/setters
      * in a browser compatible way.
      */
      /* __defineGetter__ is deprecated */
      if ('__defineGetter__' in timer) {
        timer.__defineGetter__("hours", function() {
          return timer._hours();
        });
        timer.__defineGetter__("minutes", function() {
          return timer._minutes();
        });
        timer.__defineGetter__("seconds", function() {
          return timer._seconds();
        });
        timer.__defineSetter__("hours", function(val) {
          timer._hours(val);
        });
        timer.__defineSetter__("minutes", function(val) {
          timer._minutes(val);
        });
        timer.__defineSetter__("seconds", function(val) {
          timer._seconds(val);
        });
      } else {
        Object.defineProperty(timer, "hours", {
            writable: true,
            enumerable: true,
            get: function() {
              return timer._hours();
            },
            set: function(val) {
              timer._hours(val);
            }
        });
        Object.defineProperty(timer, "minutes", {
            writable: true,
            enumerable: true,
            get: function() {
              return timer._minutes();
            },
            set: function(val) {
              timer._minutes(val);
            }
        });
        Object.defineProperty(timer, "seconds", {
            writable: true,
            enumerable: true,
            get: function() {
              return timer._seconds();
            },
            set: function(val) {
              timer._seconds(val);
            }
        });

      }

      return timer;

    };

    return timers;

  };

  return service;

});