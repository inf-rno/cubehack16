(function() {
  'use strict';

  angular.module('app.landingPage')

  .controller('LandingPageController', ['$scope','SERVER_URL', '$http', LandingPageController]);

  LandingPageController.$inject = ['$scope'];

  function LandingPageController($scope, url, $http) {
    var vm = this;
    vm.state = "";
    vm.requestOutput = url;
    vm.color = "";
    vm.playerName = "";
    vm.winner = "";
    vm.didRegister = false;
    vm.didWin = false;

    function handleGameUpdate(data)
    {
        vm.state = data.state;
        vm.didWin = data.winner === vm.color;
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
    
    setInterval(requestGameUpdate, 2000);
  }
})();
