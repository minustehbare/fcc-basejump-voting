var app = angular.module('pollsApp', []);
var pollsController = app.controller('PollsController', ['$scope', '$http', function($scope, $http) {
  $scope.pollQuestionError = function() {
    return $scope.newPollForm.pollQuestion.$touched &&
      $scope.newPollForm.pollQuestion.$invalid;
  }

  $scope.optionFormError = function(i) {
    var f = $scope.pollOptionsForm['optionForm_' + i];
    return f.$dirty && f.$invalid;
  }

  $scope.pollOptionsError = function() {
    for (var i = 0; i < 2; i++) {
      var f = $scope.pollOptionsForm['optionForm_' + i];
      if (f && f.$dirty && f.$invalid) {
        return true;
      }
    }

    return false;
  }

  $scope.optionPlaceholder = function(i) {
    var text = 'Optional';

    if (i === 0) {
      text = 'To be';
    }
    else if (i === 1) {
      text = 'Not to be';
    }

    return text;
  }

  $scope.clearOption = function(i) {
    $scope.newPoll.options[i].value = null;
    $scope.adjustOptions();
  }

  $scope.adjustOptions = function() {
    var options = $scope.newPoll.options;

    //provide an additional field that is optional if all options filled
    if (options.every(function(elem) { return elem.value; })) {
      $scope.addOptional();
      return;
    }

    //consolidate options
    for(var i = 0; i < options.length - 1; i++) {
      var a = options[i];
      
      //skip if the option has a value
      if (a.value) {
        continue;
      }

      //option has no value
      //find the next option with a value and swap them
      for (var j = i + 1; j < options.length; j++) {
        var b = options[j];

        if (b.value) {
          a.value = b.value;
          b.value = null;
          break;
        }
      }
    }

    options = options.reduce(function(prev, elem, index) {
      //keep first two required options and any non-null optional option
      if (elem.value || index <= 1) {
        prev.push(elem);
      }

      return prev;
    }, []);

    $scope.newPoll.options = options;
    
    if (options[0].value && options[1].value) {
      $scope.addOptional();
    }

    return;
  }

  $scope.newPoll = {
    'question': null,
    'options': [
      { 'value': null },
      { 'value': null }
    ]
  };

  $scope.addOptional = function() {
    $scope.newPoll.options.push({
      'value': null
    });
  };

  this.createPoll = function() {
    if ($scope.newPollForm.$invalid) {
      return;
    }

    var poll = {
      'question': $scope.newPoll.question,
      'options': $scope.newPoll.options.reduce(function(prev, elem) {
        elem.value !== null ? prev.push(elem.value) : null;
        return prev;
      }, [])
    };

    $http({
      'method': 'POST',
      'url': '/polls',
      'data': { 'newPoll': poll },
      'headers': { 'Content-Type': 'application/json' }
    })
    .success(function(data) {
      console.log("hey, it posted!");
      console.log(data);
    })
    .error(function(data) {
      console.log("uh oh, something went wrong");
      console.log(data);
    });

    console.log(poll);
  }
}]);
