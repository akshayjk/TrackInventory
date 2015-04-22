(function () {

    "use strict";

    var App = angular.module("App.controllers", []);

    App.controller("LoginController", ["$scope", '$location', '$window', function ($scope, $location, $window) {
        /*$scope.aVariable = 'anExampleValueWithinScope';
         $scope.valueFromService = UtilSrvc.helloWorld("User");*/
        $scope.loginForm = {};
        $scope.login = function () {
            console.log($scope.loginForm);
            $window.location.href = '../LEWebSite-master/views/FranchiseMain.html';
        }
    }]);

    App.controller("LogOutCtrl", ["$scope", "$window", function ($scope, $window) {
        $scope.logOut = function () {
            console.log("Logging out");
            $window.location.href = '../Login.html'
        }
    }]);

    App.controller("OrderForm", ["$scope", function ($scope) {

        $scope.UniformCosts =
        {
            "1": 10,
            "2": 20,
            "3": 30,
            "4": 40,
            "5": 50
        }
        $scope.KitCost = {
            "PlayGroup": 100,
            "Nursery": 200,
            "LKG": 300,
            "UKG": 400
        };

        $scope.formHide = false;
        $scope.formButtons = true;
        $scope.OrderForm = {};
        $scope.StudentObject = {};
        $scope.Students = [];
        $scope.UniformOptions = [1, 2, 3, 4, 5];
        $scope.UniformSize = $scope.UniformOptions[0];
        $scope.Qty = 1;
        $scope.UniformArray = [];
        $scope.getUniformQty = function () {
            if ($scope.StudentObject.UniformQty != undefined) {
                return $scope.StudentObject.UniformQty
            } else {
                return 1;
            }
        };

        $scope.getUniformSize = function () {
            if ($scope.StudentObject.UniformSize != undefined) {
                return $scope.StudentObject.UniformSize
            } else {
                return 1;
            }
        };
        $scope.getStudentClass = function () {
            if ($scope.StudentObject.Class != undefined) {
                return $scope.StudentObject.Class;
            } else {
                return "PlayGroup";
            }
        };

        $scope.setUniformSize = function () {

            $scope.StudentObject.UniformSize = $scope.UniformSize;
            $scope.setTotalCost();
            $scope.UniformArray.push($scope.UniformSize);
            console.log("Uniform Size : " + $scope.StudentObject.UniformSize);
        };
        $scope.setUniformSizeFinal = function (Numb) {
            $scope.Students[Numb].UniformSize = $scope.UniformArray[Numb];
        }
        $scope.ClassOptions = ["PlayGroup", "Nursery", "LKG", "UKG"];
        $scope.Class = $scope.ClassOptions[0];
        $scope.setTotalCost = function () {
            console.log("kit cost " + $scope.KitCost[$scope.getStudentClass()] + "  " + $scope.UniformCosts[$scope.getUniformSize()] * $scope.getUniformQty())
            $scope.TotalCost = $scope.KitCost[$scope.getStudentClass()] + $scope.UniformCosts[$scope.getUniformSize()] * $scope.getUniformQty();
        }
        $scope.setTotalCost();

        $scope.setClass = function () {

            $scope.StudentObject.Class = $scope.Class;
            $scope.setTotalCost();
            console.log("Class name : " + $scope.StudentObject.Class);
        };

        $scope.setFormCancel = function () {

            if ($scope.Students.length > 0) {
                $scope.formCancel = false;
            } else {
                $scope.formCancel = true;
            }

        }

        $scope.setFormCancel();
        $scope.addStudents = function () {

            if ($scope.StudentObject.Class == undefined) {
                $scope.StudentObject.Class = $scope.ClassOptions[0];
            }
            if ($scope.StudentObject.UniformSize == undefined) {
                $scope.StudentObject.UniformSize = $scope.UniformOptions[0];
                $scope.UniformArray.push($scope.UniformOptions[0]);
            }
            $scope.formHide = true;
            $scope.formButtons = false;
            $('#OrderTab').attr('class', 'active');
            $('#StudentTab').attr('class', 'disabled disabledTab');
            $('#orange').show();
            $('#red').hide();

            $scope.Students.push($scope.StudentObject);
            console.log(JSON.stringify($scope.Students));
            $scope.StudentObject = {}
        };
        $scope.addMore = function () {

            if ($scope.Students.length > 0) {
                console.log("setting cancel hide false")
                $scope.formCancel = false;
            } else {
                $scope.formCancel = true;
            }


            $('#StudentTab').attr('class', 'active');
            $('#OrderTab').attr('class', 'disabled disabledTab');
            $('#orange').hide();
            $('#red').show();
            $scope.formHide = false;
            $scope.formButtons = true;

        }
        $scope.stdCancel = function () {
            $('#OrderTab').attr('class', 'active');
            $('#StudentTab').attr('class', 'disabled disabledTab');
            $('#orange').show();
            $('#red').hide();
            $scope.formButtons = false;
        }
        $scope.getNext = function () {
            $('#Next').attr('class', 'btn btn-primary NextButton');
            $('#addMore').attr('class', 'btn btn-primary disabled')
        };
        $scope.next = function () {


            if (Object.keys($scope.StudentObject).length > 0) {
                if ($scope.StudentObject.Class == undefined) {
                    $scope.StudentObject.Class = $scope.ClassOptions[0];
                }
                if ($scope.StudentObject.UniformSize == undefined) {
                    $scope.StudentObject.UniformSize = $scope.UniformOptions[0];
                    $scope.UniformArray.push($scope.UniformOptions[0]);
                }

                console.log("uniform added " + JSON.stringify($scope.UniformArray))
                $scope.Students.push($scope.StudentObject);
            }

            console.log(JSON.stringify($scope.Students));
            $scope.StudentObject = {}

        }
        $scope.placeOrder = function () {
            $scope.OrderForm.Students = $scope.Students;
            console.log(JSON.stringify($scope.OrderForm))
        };




    }]);

}());