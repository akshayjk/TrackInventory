(function() {

  "use strict";

  var App = angular.module("App.controllers", []);

  App.controller("LoginController", ["$scope", '$location', function ($scope, $location, UtilSrvc){
    /*$scope.aVariable = 'anExampleValueWithinScope';
    $scope.valueFromService = UtilSrvc.helloWorld("User");*/
      $scope.loginForm ={};
      $scope.login = function(credentials){
          console.log(credentials);
          $location.path('/franchise');
      }
  }]);

  App.controller("MyCtrl2", ["$scope", function($scope){
      // if you have many controllers, it's better to separate them into files
  }]);

}());