/**
 * Created by Akshay on 04-05-2015.
 */
(function () {

    "use strict";
    var App = angular.module("App.LoginControllers", []);

    App.controller("LoginController", ["$scope", '$location', '$window', 'Auth', function ($scope, $location, $window, Auth) {

        $scope.loginForm = {};
        $scope.register ={};
        $scope.loginError = "";
        $scope.signIn = true;
        $scope.verifyEmailId = false;
        $scope.regPass = false;
        $scope.verification = function(){
            $scope.signIn = false;
            $scope.verifyEmailId = true;

        }
        $scope.verifyEmail = function(emailId){
            if(emailId!=undefined){
                Auth.verifyEmail(emailId).success(function(res, stat){
                    $scope.signIn=false;
                    $scope.verifyEmailId = false;
                    $scope.regPass= true;
                    $scope.userToken = res.token;
                }).error(function(res, status){
                    if(typeof(res)=='string'){
                        $scope.loginError = res;
                    }else{
                        $scope.loginError = res.errorMessage;
                    }

                })
            }else{
                $scope.loginError = "Email is required !";
            }

        }

        $scope.registerMember=function(pass){
            if(pass){
                if(pass>10){
                    $scope.loginError ="Password length is more than 10 characters."
                }else{
                    Auth.registerAccount(pass,$scope.userToken).success(function(res, stat){
                        $scope.loginError = res.message;
                        $scope.signIn=true;
                        $scope.verifyEmailId = false;
                        $scope.regPass= false;
                    }).error(function(res, erStat){
                        $scope.loginError = res;
                    })
                }
            }else{
            $scope.loginError = "Password is necessary !"
            }
        }

        $scope.login = function () {
            if($scope.loginForm.username!=undefined && $scope.loginForm.password!=undefined){
                Auth.login(JSON.stringify($scope.loginForm)).success(function (LoginResponse, LoginStatus, LoginHeaders) {
                    sessionStorage.userDetails = angular.toJson(LoginResponse);
                    $scope.loginError = "";
                    if (LoginResponse.Role == "ADMIN"||LoginResponse.Role == "OWNER") {
                        $window.location.href = '../views/Admin.html';
                        //$window.location.href = '../views/Admin.html';
                    } else if (LoginResponse.Role == "FRANCHISE") {
                        $window.location.href = '../views/Franchise.html';
                    }
                }).error(function (LoginResponse, LoginStatus, LoginHeaders) {
                    $scope.loginError = LoginResponse.errorMessage;
                })
            }else{
                $scope.loginError = "Username and password are required !";
            }


        }
        $scope.loginNew = function(){
        }
    }]);

}());