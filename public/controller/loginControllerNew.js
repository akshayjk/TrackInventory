/**
 * Created by Akshay on 04-05-2015.
 */
(function () {

    "use strict";
    console.log("files being loaded")
    var App = angular.module("App.LoginControllers", []);

    App.controller("LoginController", ["$scope", '$location', '$window', 'Auth', function ($scope, $location, $window, Auth) {
        /*$scope.aVariable = 'anExampleValueWithinScope';
         $scope.valueFromService = UtilSrvc.helloWorld("User");*/
        console.log("here again")
        $scope.loginForm = {};
        $scope.loginError = "";
        $scope.login = function () {
            console.log($scope.loginForm);
            if($scope.loginForm.username!=undefined && $scope.loginForm.password!=undefined){
                Auth.login(JSON.stringify($scope.loginForm)).success(function (LoginResponse, LoginStatus, LoginHeaders) {
                    console.log("login response " + LoginResponse);
                    sessionStorage.userDetails = angular.toJson(LoginResponse);
                    console.log("console " + JSON.stringify(LoginResponse))
                    $scope.loginError = "";
                    if (LoginResponse.Role == "ADMIN") {
                        $window.location.href = '../views/starterTest.html';
                        //$window.location.href = '../views/starterTest.html';
                    } else if (LoginResponse.Role == "FRANCHISE") {
                        $window.location.href = '../views/Franchise.html';
                    }
                }).error(function (LoginResponse, LoginStatus, LoginHeaders) {
                    console.log(LoginResponse.errorMessage)
                    $scope.loginError = LoginResponse.errorMessage;
                })
            }else{
                console.log("error here ")
                $scope.loginError = "Username and password are required !";
            }


        }
        $scope.loginNew = function(){
            console.log(JSON.stringify($scope.loginForm))
        }
    }]);

}());