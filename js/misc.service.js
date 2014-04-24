
counterApp.factory('audioService', function(){
  var service = {
    "player": document.getElementsByTagName("audio")[0],
    "alert": function(){
      service.player.pause();
      service.player.currentTime = 0;
      service.player.play();
    }
  };

  return service;
});

counterApp.factory('countersService', function(){

  var counters = {};

  counters.list = [];
  counters.total_created = 0;

  /* Add a new counter to the list */
  counters.add = function() {

    counters.total_created += 1;

    var counter = {
        "name": "Counter " + counters.total_created,
        "value": 0,
    };

    counters.list.push(counter);
  };

  return counters;

});


counterApp.factory('storageService', function(){

    return {
      'version': 'v1',
      'get': function(key){
        return JSON.parse(localStorage.getItem(service.version + '#' + key));
      },
      'set': function(key, value){
        return localStorage.setItem(service.version + '#' + key,
                                    JSON.stringify(value));
      }
    };

});