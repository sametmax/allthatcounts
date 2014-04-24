
counterApp.factory('audioService', function(){
  var service = {
    "player": document.getElementsByTagName("audio")[0],
    "alert": function(){service.player.play();}
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

    var service = {
      'version': 'v1',
      'get': function(key){
        return JSON.parse(localStorage.getItem(service.version + '#' + key));
      },
      'set': function(key, value){
        return localStorage.setItem(service.version + '#' + key,
                                    JSON.stringify(value));
      }
    };



    getLocalStorageKeys: function() {
      var version = 'zerobinV0.1';
      var keys = [];
      for (var key in localStorage) {
        if (key.indexOf(version) !== -1) {
          keys.push(key);
        }
      }
      keys.sort();
      keys.reverse();
      return keys;
    },
    getFormatedDate: function (date) {
      date = date || new Date();
      return ((date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear());
    },

    getFormatedTime: function (date) {
      date = date || new Date();
      var h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return h + ":" + m + ":" + s;
    },


    /** Store the paste of a URL in local storate, with a storage format
      version prefix and the paste date as the key */
    storePaste: function (url, date) {

      date = date || new Date();
      date = (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + zerobin.getFormatedTime(date));

      var keys = zerobin.getLocalStorageKeys();

      if (localStorage.length > 19) {
        void localStorage.removeItem(keys[19]);
      }

      localStorage.setItem('zerobinV' + zerobin.version + "#" + date, url);
    },

  /** Return a list of the previous paste url with the creation date
      If the paste is from today, date format should be "at hh:ss",
      else it should be "the mm-dd-yyy"
  */
    getPreviousPastes: function () {
      var pastes = [],
        keys = zerobin.getLocalStorageKeys(),
        today = zerobin.getFormatedDate();

      $.each(keys, function (i, key) {
        var pasteDateTime = key.replace(/^[^#]+#/, '');
        var displayDate = pasteDateTime.match(/^(\d+)-(\d+)-(\d+)\s/);
        displayDate = displayDate[2] + '-' + displayDate[3] + '-' + displayDate[1];
        var prefix = 'the ';
        if (displayDate === today) {
          displayDate = pasteDateTime.split(' ')[1];
          prefix = 'at ';
        }
        pastes.push({
          displayDate: displayDate,
          prefix: prefix,
          link: localStorage.getItem(key)
        });
      });

      return pastes;
    },
});

