/**
 * Created by Akshay on 04-05-2015.
 */
(function () {

    "use strict";

    var App = angular.module("App.LoginControllers", []);

    App.controller("LoginController", ["$scope", '$location', '$window', 'Auth', function ($scope, $location, $window, Auth) {
        /*$scope.aVariable = 'anExampleValueWithinScope';
         $scope.valueFromService = UtilSrvc.helloWorld("User");*/
        $scope.loginForm = {};
        $scope.loginError = "";
        $scope.login = function () {
            console.log($scope.loginForm);
            Auth.login(JSON.stringify($scope.loginForm)).success(function (LoginResponse, LoginStatus, LoginHeaders) {
                console.log("login response " + LoginResponse);
                sessionStorage.userDetails = angular.toJson(LoginResponse);
                $scope.loginError = "";
                if (LoginResponse.Role == "ADMIN") {
                    $window.location.href = '../views/AdminMain.html';
                    //$window.location.href = '../views/starterTest.html';
                } else if (LoginResponse.Role == "FRANCHISE") {
                    $window.location.href = '../views/FranchiseMain.html';
                }
            }).error(function (LoginResponse, LoginStatus, LoginHeaders) {
                console.log(LoginResponse.errorMessage)
                $scope.loginError = LoginResponse.errorMessage;
            })

        }
    }]);

}());