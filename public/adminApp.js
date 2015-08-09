/**
 * Created by Akshay on 04-05-2015.
 */

(function () {

    "use strict";

    var App = angular.module("App", [
        "App.AdminControllers",
        "App.services",
        "ngRoute",
        "ngResource",
        "ui.bootstrap",
        "ui.select",
        "ngSanitize",
        "angular-ladda",
        "angularFileUpload"
    ]);

    App.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/Orders', {
                templateUrl: '/views/Orders.html'
            })
            .when('/Accounts', {
                templateUrl: '/views/Accounts.html'
            })
            .when('/Inventory', {
                templateUrl: '/views/Inventory.html'
            })
            .when('/Messages', {
                templateUrl: '/views/Messages.html'
            })
            .when('/Downloads', {
                templateUrl: '/views/Downloads.html'
            })
            .otherwise({redirectTo: '/Orders'});
        $locationProvider.html5Mode(false);

    }]);

}());