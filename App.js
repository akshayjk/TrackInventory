(function() {

  "use strict";

  var App = angular.module("App", [
    "App.controllers",
    "App.services",
    "App.directives",
    "App.filters",
    "ngRoute",
    "ngResource",
    "ngStorage"
  ]);

  App.config(function ($routeProvider) {
    $routeProvider
      .when('/franchise', {
           templateUrl: 'views/FranchiseMain.html'
      })
      .when('/view2', {
           templateUrl: 'view/view2.html'
      })
      .otherwise({redirectTo : 'view1'});
  });

}());