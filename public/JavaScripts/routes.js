/**
 * Created by Akshay on 20-04-2015.
 */
var LeWebApp = angular.module('LEWebApp',[]).config(['$routeProvider', '$httpProvider',function ($routeProvider) {

    $routeProvider.when('/login', {templateUrl: '../views/login.html', controller: 'LoginController'})
        .when('/franchise', {templateUrl: '../../views/FranchiseMain.html', controller: 'FranchiseController'})
        .otherwise({redirectTo: '/login'});

}]);


