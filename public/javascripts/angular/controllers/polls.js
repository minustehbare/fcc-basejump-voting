angular.module('pollsApp', [])
.controller('PollsController', ['$scope', '$http', '$log', function($scope, $http, $log) {
  var vm = this;

  vm.pollQuestionError = function() {
    return $scope.newPollForm.pollQuestion.$touched &&
      $scope.newPollForm.pollQuestion.$invalid;
  };

  vm.optionFormError = function(i) {
    var f = $scope.pollOptionsForm['optionForm_' + i];
    return f.$dirty && f.$invalid;
  };

  vm.pollOptionsError = function() {
    for (var i = 0; i < 2; i++) {
      var f = $scope.pollOptionsForm['optionForm_' + i];
      if (f && f.$dirty && f.$invalid) {
        return true;
      }
    }

    return false;
  };

  vm.optionPlaceholder = function(i) {
    var text = 'Optional';

    if (i === 0) {
      text = 'To be';
    } else if (i === 1) {
      text = 'Not to be';
    }

    return text;
  };

  vm.clearOption = function(i) {
    vm.newPoll.options[i].value = null;
    vm.adjustOptions();
  };

  vm.adjustOptions = function() {
    // provide an additional field that is optional if all options filled
    if (vm.newPoll.options.every(function(elem) { return elem.value; })) {
      vm.addOptional();
      return;
    }

    // consolidate options
    for (var i = 0; i < vm.newPoll.options.length - 1; i++) {
      var a = vm.newPoll.options[i];

      // skip if the option has a value
      if (a.value) {
        continue;
      }

      // option has no value
      // find the next option with a value and swap them
      for (var j = i + 1; j < vm.newPoll.options.length; j++) {
        var b = vm.newPoll.options[j];

        if (b.value) {
          a.value = b.value;
          b.value = null;
          break;
        }
      }
    }

    // keep first two required options and any non-null optional option
    vm.newPoll.options = vm.newPoll.options.reduce(function(prev, elem, index) {
      if (elem.value || index <= 1) {
        prev.push(elem);
      }

      return prev;
    }, []);

    if (vm.newPoll.options[0].value && vm.newPoll.options[1].value) {
      vm.addOptional();
    }

    return;
  };

  vm.newPoll = {
    'question': null,
    'options': [
      { 'value': null },
      { 'value': null }
    ]
  };

  vm.addOptional = function() {
    vm.newPoll.options.push({
      'value': null
    });
  };

  vm.createPoll = function() {
    if ($scope.newPollForm.$invalid) {
      return;
    }

    var poll = {
      'question': vm.newPoll.question,
      'options': vm.newPoll.options.reduce(function(prev, elem) {
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
      $log.info(data);
    })
    .error(function(err) {
      $log.error(err);
    });
  };
}]);
