
counterApp.factory('versusService', function(timersService, $interval, audioService){

  var timers = timersService.makeTimers("Timer");
  timers.add();
  timers.add();

  var versus = {
    "timerA": timers.list[0],
    "timerB": timers.list[1],
    "timers": timers,
    "runningTimer": null,
    "isPaused": false,
    "mode": "auto",
    "isStarted": false,
    "currentTimer": function(){return timers.list[versus.runningTimer];},
    "startA": function(){
      versus.timerB.stop();
      versus.timerA.countDown();
      versus.runningTimer = 0;
      versus.isStarted = true;
      versus.isPaused = false;
    },
    "startB": function(){
      versus.timerA.stop();
      versus.timerB.countDown();
      versus.runningTimer = 1;
      versus.isStarted = true;
      versus.isPaused = false;
    },
    "pause": function(){
      versus.currentTimer().stop();
      versus.isPaused = true;
    },
    "resume": function(){
      versus.currentTimer().countDown();
      versus.isPaused = false;
    },
    "reset": function(){
      versus.timerA.stop();
      versus.timerB.stop();
      versus.timerA.reset();
      versus.timerB.reset();
      versus.isPaused = false;
      versus.isStarted = false;
      versus.runningTimer = null;
    },
    "switch": function(){

      if (!versus.isStarted){
        versus.startA();
      } else {
        if (versus.isPaused){
          versus.resume();
        }

        versus.currentTimer().stop();
        audioService.alert();
        if (versus.mode != "stack"){
          versus.currentTimer().reset();
        }
        versus.runningTimer = versus.runningTimer ? 0: 1;
        versus.currentTimer().countDown();
      }
    },
    "togglePause": function(){
      if (!versus.isStarted){
        versus.startA();
      } else {
        if (versus.isPaused)
          versus.resume();
        else
          versus.pause();
      }
    },
  };

  versus.timerA.onZero = versus.timerB.onZero = function(){
    if (versus.mode == "auto"){
      versus.switch();
    }
    audioService.alert();
  };

  return versus;

});
