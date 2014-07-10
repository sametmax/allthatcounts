
counterApp.factory('scoresService', function () {

  var service = {};

  /* Scoresheet factory */
  service.makeScoresheet = function (name) {
    var players = {};

    players.list = [];
    players.total_created = 0;
    players.turn_count = 0;
    players.goal = 100;
    players.match = 'off';
    players.mode = 'add'

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

    players.rank = function (index) {
      var over = 0;
      var under = 0;
      var equal = 0;

      var ref = players.list[index].total;

      /* Count those over and under the ref player */
      for (var i=0; i < players.list.length; i++) {
        if (i == index) continue;

        var score = players.list[i].total;

        if      (score < ref) under += 1;
        else if (score > ref) over  += 1;
        else                  equal += 1;
      }

      /* Depending on the mode and the match, we consider scores above or under the ref to
       * make up the rank
       */
      var rank;
      if ((players.mode == 'add' && (players.match == 'win' || players.match == 'off')) ||
          (players.mode == 'substract' && players.match == 'lose'))
        rank = over + 1;
      else if ((players.mode == 'add' && players.match == 'lose') ||
          (players.mode == 'substract' && (players.match == 'win' || players.match == 'off')))
        rank = under + 1

      // Get ordinal
      // From: https://github.com/jdpedrie/angularjs-ordinal-filter
      var s = ["th", "st", "nd", "rd"];
      var v = rank % 100;

      return (equal > 0 ? 'equal ' : '') + rank + ( s[(v - 20) % 10] || s[v] || s[0]);
    };

    players.createPlayer = function () {
      var initscores = [];

      for (var i = 0; i < players.turn_count; i++)
        initscores.push('');

      var player = {
          "name": name + " " + players.total_created,
          "scores": initscores,

          /** Check if the player lost **/
          "_lost": function () {
            if (players.match == 'win') {
              return false;
            } else if (players.match == 'lose') {
              return player._total() >= players.goal;
            }
          },

          /** Check if the player won **/
          "_won": function () {
            if (players.match == 'win') {
              return player._total() >= players.goal;
            } else if (players.match == 'lose') {
              return false;
            }
          },

          /** Get the player's score **/
          "_total": function () {
            var sum = 0;

            // In adding mode, just sum the scores
            if (players.mode == 'add') {
              for (var i = 0; i < player.scores.length; i++) {
                  sum += +player.scores[i];
              }

            // In substract mode, substract all scores from the first
            } else if (players.mode == 'substract') {
              sum = player.scores[0] || 0;
              for (var i = 1; i < player.scores.length; i++) {
                  sum -= +player.scores[i];
              }
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
        player.__defineGetter__("won", function () {
          return player._won();
        });
        player.__defineGetter__("lost", function () {
          return player._lost();
        });
      } else {
        Object.defineProperty(player, "total", {
          writable: false,
          enumerable: true,
          get: function () {
            return player._total();
          }
        });
        Object.defineProperty(player, "won", {
          writable: false,
          get: function () {
            return player._won();
          }
        });
        Object.defineProperty(player, "lost", {
          writable: false,
          get: function () {
            return player._lost();
          }
        });
      }

      return player;

    };

    return players;

  };

  return service;

});