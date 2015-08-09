(function () {

    "use strict";

    var App = angular.module("App", [
        "App.FranchiseControllers",
        "App.services",
        "ngRoute",
        "ngResource",
        "ui.bootstrap",
        "angularFileUpload"
    ]);

    App.config(function ($routeProvider) {
        $routeProvider
            .when('/Orders', {
                templateUrl: '/views/FranchiseOrders.html'
            })
            .when('/Query', {
                templateUrl: '/views/Query.html'
            })
            .when('/PreviousOrders', {
                templateUrl: '/views/PreOrders.html'
            })
            .when('/uploadOrders', {
                templateUrl: '/views/UploadOrders.html'
            })
            .otherwise({redirectTo: '/Orders'});
    });

}());