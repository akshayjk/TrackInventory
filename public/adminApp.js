/**
 * Created by Akshay on 04-05-2015.
 */

(function () {

    "use strict";

    var App = angular.module("App", [
        "App.AdminControllers",
        "App.services",
        "App.directives",
        "App.filters",
        "ngRoute",
        "ngResource",
        "ui.bootstrap",
        "ui.select",
        "ngSanitize"
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