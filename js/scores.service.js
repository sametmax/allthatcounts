
counterApp.factory('scoresService', function () {

  var service = {};

  /* Scoresheet factory */
  service.makeScoresheet = function (name) {
    var players = {};

    players.list = [];
    players.total_created = 0;
    players.turn_count = 0;

    /* Remove a player */
    players.remove = function (i) {
      players.list.remove(i);
    };

    /* Bring a new player to the game */
    players.add = function () {
      players.total_created += 1;
      players.list.push(players.createPlayer());
    };

    players.newTurn = function () {
      players.turn_count++;
      for (var i = 0; i < players.list.length; i++) {
        players.list[i].scores.push('');
      }
    };

    players.createPlayer = function () {
      var initscores = [];

      for (var i = 0; i < players.turn_count; i++)
        initscores.push('');

      var player = {
          "name": name + " " + players.total_created,
          "scores": initscores,

          "_total": function () {
            var sum = 0;
            for (var i = 0; i < player.scores.length; i++) {
                sum += +player.scores[i];
            }

            return sum;
          }
      };


      /* Define properties for total
       * in a browser compatible way.
       */
      /* __defineGetter__ is deprecated */
      if ('__defineGetter__' in player) {
        player.__defineGetter__("total", function () {
          return player._total();
        });
      } else {
        Object.defineProperty(player, "total", {
            writable: false,
            enumerable: true,
            get: function () {
              return player._total();
            }
        });
      }

      return player;

    };

    return players;

  };

  return service;

});