(function() {
  'use strict';

  angular.module('app.landingPage')

  .controller('LandingPageController', ['$scope','SERVER_URL', '$http', '$interval', '$timeout', LandingPageController]);

  function LandingPageController($scope, url, $http, $interval, $timeout) {
    var vm = this;
    vm.state = "";
    vm.requestOutput = url;
    vm.color = "";
    vm.playerName = "";
    vm.winner = "";
    vm.didRegister = false;
    vm.didWin = false;
    vm.puzzle = null;
    var timer = undefined;
    var pattern = [400, 100, 200, 100, 200, 100, 400, 100, 400, 500, 400, 100, 400, 100];
    var patternIndex = 0 ;

    function handleGameUpdate(data)
    {
        if (vm.state !== 'inProgress' && data.state === 'inProgress') {
            startTimer();
        }
        vm.state = data.state;
        vm.puzzle = data.activePuzzle;
        vm.didWin = data.winner === vm.color;
    }

    function startTimer() {
        vm.timeLeft = 60;
        timer = $interval(function() {
            vm.timeLeft--;
            if (vm.timeLeft <= 0)
            {
                vm.state = 'init';
                $interval.cancel(timer);
            }
          }, 1000);
    }
    
    vm.playPattern = function() {
        patternIndex = 0;
        vm.patternOn = true;
        nextStepInPattern();
    };

    function nextStepInPattern() {
        $timeout(function() {
            //console.log(patternIndex, vm.patternOn);
            vm.patternOn = !vm.patternOn;
            if(patternIndex < pattern.length) {
                patternIndex++;
                nextStepInPattern();    
            } else {
                vm.patternOn = false;
                patternIndex = 0;
            }
        }, pattern[patternIndex]);
    }
    
    var requestGameUpdate = _.throttle(function()
    {
        $http.get(url+"game/1").then(function(response)
        {
            if(response.status===200)
            {
                handleGameUpdate(response.data);
            }
            else
            {
                requestGameUpdate();
            }
        }, requestGameUpdate);
    },2000);
    
    vm.start = function()
    {
        console.log(vm.color);
        vm.state = "inProgress";
        $http.put(url+"game/1", {state:"inProgress"}).then(requestGameUpdate);
    }
    vm.reset = function()
    {
        vm.state = "init";
        vm.didRegister = false;
        $http.put(url+"game/1", {state:"init"}).then(requestGameUpdate);
    }
    vm.register = function()
    {
        if(vm.didRegister){return;}
        vm.didRegister = true;
        $http.post(url+"game/1/players", {name:vm.playerName, color:vm.color}).then(requestGameUpdate);
    }
    vm.foundBox = function()
    {
        $http.post(url+"game/1/puzzle").then(requestGameUpdate);
    }
    
    setInterval(requestGameUpdate, 2000);
  }
})();
