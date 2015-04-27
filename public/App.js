(function () {

    "use strict";

    var App = angular.module("App", [
        "App.controllers",
        "App.services",
        "App.directives",
        "App.filters",
        "ngRoute",
        "ngResource",
        "ui.bootstrap"
    ]);

    App.config(function ($routeProvider) {
        $routeProvider
            .when('/Orders', {
                templateUrl: '/views/Orders.html'
            })
            .when('/Query', {
                templateUrl: 'views/Query.html'
            })
            .when('/PreviousOrders', {
                templateUrl: '/views/PreOrders.html'
            })
            .otherwise({redirectTo: '/Orders'});
    });

}());