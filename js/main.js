"use strict";

/* Controllers */
// Array Remove - By John Resig (MIT Licensed)
// Because JS doesn't have THAT
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// Integer Division. Yeah, js doesn't have that either.
function intDiv(a, b) {
  var result = a / b;
  return result >= 0 ? Math.floor(result) : Math.ceil(result);
}

/* Add the properties from the first object to the second */
function mergeObj(from, to){
  for (var attrname in to) {
    from[attrname] = to[attrname];
  }
}

var counterApp = angular.module('counterApp', ['ui.bootstrap']);


/**
Make any element scrollable, with 2 callbacks available for
when scrolling up and down.

E.G :

<input type="text" wheelable
       onwheelup="callbackForWheelUp()"
       onwheelup="callbackForWheelDown()"
       maxlength="8">

Scrolling on the element prevent general page scrolling.
*/
counterApp.directive('wheelable', function() {
  var directive = {
      scope: {
          'onWheelUp': '&onwheelup',
          'onWheelDown': '&onwheeldown'
      }
  };

  directive.restrict = 'A';

  var isScrollingUp = function(e) {
    if (e.originalEvent) {e = e.originalEvent;}
    //pick correct delta variable depending on event
    var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
    return (e.detail || delta > 0);
  };

  directive.link = function($scope, element, attributes) {
      element.bind('mousewheel wheel', function(e) {
        if (isScrollingUp(e))
          $scope.$apply($scope.onWheelUp());
        else
           $scope.$apply($scope.onWheelDown());
        e.preventDefault();
      });

  };

  return directive;
});

/**
* Clicking on an input tag with this directive,
* will select the text inside.
*/
counterApp.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});

/**
* A generic confirmation for risky actions.
* Usage: Add attributes: ng-really-message="Are you sure"? ng-really-click="takeAction()" function
* From : https://gist.github.com/asafge/7430497
*/
counterApp.directive('ngReallyClick', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
      var message = attrs.ngReallyMessage;
      if (message && confirm(message)) {
        scope.$apply(attrs.ngReallyClick);
      }
    });
    }
  };
}]);

/**
* Project entry point.
*/
counterApp.controller('TabsCtrl', function($scope, countersService, timersService, versusService, $document, configurationService) {

  $scope.counters = countersService;
  $scope.timers = timersService.makeTimers("Count down");
  $scope.chronos = timersService.makeTimers("Chrono");
  $scope.versus = versusService;
  $scope.config = configurationService;

  $scope.counters.add();
  $scope.timers.add();
  $scope.chronos.add();

  $scope.tab = "countdown";
  $scope.selectTab = function(name){$scope.tab = name;};

  /*
    I don't know where to put this.

    It catches the keybord events in the versus tab so you can switch and
    toggle pause without using the mouse.
  */
  $document.bind('keydown', function (evt) {
    if ($scope.tab === 'versus'){
      if (evt.which === 32)  { // space
        $scope.versus.togglePause();
      }
      if (evt.which === 17 || evt.which === 225 || evt.which === 223) { // CTRL
        $scope.versus.switch();
      }
    }
  });

});


