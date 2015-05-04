(function () {

    "use strict";

    var App = angular.module("App.FranchiseControllers", []);

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
                } else if (LoginResponse.Role == "FRANCHISE") {
                    $window.location.href = '../views/FranchiseMain.html';
                }
            }).error(function (LoginResponse, LoginStatus, LoginHeaders) {
                console.log(LoginResponse.errorMessage)
                $scope.loginError = LoginResponse.errorMessage;
            })

        }
    }]);

    App.controller("LogOutCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        $scope.FranchiseName = $scope.userDetails.FranchiseName;
        $scope.logOut = function () {
            console.log("Logging out");
            delete sessionStorage.userDetails;
            $window.location.href = '/Login';
            //$location.path('/Login')
        }
    }]);

    App.controller("OrderForm", ["$scope", "$location", "$modal", "PlaceOrder", function ($scope, $location, $modal, PlaceOrder) {

        $scope.ready = function () {
            $('#PaymentTab').attr('class', 'disabled disabledTab');
            $('#OrderTab').attr('class', 'disabled disabledTab');
            console.log(" session Storage " + typeof(sessionStorage.userDetails))
        };
        $scope.ready();
        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        $scope.UniformCosts = $scope.userDetails.FranchiseDetails.UniformCosts;
        $scope.KitCost = $scope.userDetails.FranchiseDetails.KitCost;
        $scope.formHide = false;
        $scope.formButtons = true;
        $scope.OrderForm = {};
        $scope.StudentObject = {};
        $scope.Students = [];
        $scope.UniformOptions = Object.keys($scope.UniformCosts);
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
        $scope.setUniformQty = function () {
            if ($scope.StudentObject.UniformQty == undefined) {
                $scope.StudentObject.UniformQty = 1;
            }
        };
        $scope.setUniformQty();
        $scope.setUniformSizeFinal = function (Numb) {
            $scope.Students[Numb].UniformSize = $scope.UniformArray[Numb];
        };
        $scope.ClassOptions = ["PlayGroup", "Nursery", "LKG", "UKG"];
        $scope.Class = $scope.ClassOptions[0];
        $scope.setTotalCost = function () {
            console.log("kit cost " + $scope.KitCost + "  " + $scope.UniformCosts[$scope.getUniformSize()] * $scope.getUniformQty())
            $scope.TotalCost = $scope.KitCost + $scope.UniformCosts[$scope.getUniformSize()] * $scope.getUniformQty();
        };
        $scope.setTotalCost();
        $scope.getFinalCost = function () {

            var FinalCost = 0;
            $scope.Students.forEach(function (student) {
                console.log("student " + $scope.UniformCosts[student.UniformSize] + "  " + $scope.UniformQty);
                FinalCost += $scope.KitCost + $scope.UniformCosts[student.UniformSize] * student.UniformQty;
            });
            $scope.TotalAmount = FinalCost;
            return FinalCost
        };
        $scope.setClass = function () {

            $scope.StudentObject.Class = $scope.Class;
            $scope.setTotalCost();
            console.log("Class name : " + $scope.StudentObject.Class);
        };
        $scope.getWelComeKitClass = function () {
            if ($scope.StudentObject.Class != undefined) {
                return $scope.StudentObject.Class;
            } else {
                return $scope.Class;
            }
        };
        $scope.setFormCancel = function () {

            if ($scope.Students.length > 0) {
                $scope.formCancel = false;
            } else {
                $scope.formCancel = true;
            }
        };
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

        };
        $scope.stdCancel = function () {
            $('#OrderTab').attr('class', 'active');
            $('#StudentTab').attr('class', 'disabled disabledTab');
            $('#orange').show();
            $('#red').hide();
            $scope.formButtons = false;
        };
        $scope.confirmOrder = function () {
            $('#OrderTab').attr('class', 'disabled disabledTab');
            $('#PaymentTab').attr('class', 'active');
            $('#yellow').show();
            $('#orange').hide();
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

        };
        $scope.placeOrder = function () {
            $scope.OrderForm.Students = $scope.Students;
            $scope.OrderForm.FranchiseId = $scope.userDetails.FranchiseId;
            $scope.OrderForm.FranchiseName = $scope.userDetails.FranchiseName;
            $scope.OrderForm.TotalAmount = $scope.TotalAmount;
            console.log(JSON.stringify($scope.OrderForm));
            PlaceOrder.placeOrder($scope.OrderForm).success(function (poResponse, poStatus) {
                console.log(" po response " + poResponse.Message);
                $scope.OrderForm = {};
                $scope.StudentObject = {};
                $scope.Students = [];
                $scope.TotalAmount = 0;
                $scope.$broadcast('orderPlaced', [1, 2, 3]);
                PlaceOrder.setModalMessage(poResponse.Message);
                var modalInstance = $modal.open({
                    templateUrl: 'Modal.html',
                    controller: 'ModalInstanceCtrl'

                });

                modalInstance.result.then(function () {
                    console.log("executed");
                    $scope.formHide = false;
                    $scope.formButtons = true;
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });


            }).error(function (poErResponse, poResStatus) {
                console.log("err po " + poErResponse);
                PlaceOrder.setModalMessage(poErResponse.errorMessage);
                PlaceOrder.setModalMessage("error in placing order");
                var modalInstance = $modal.open({
                    templateUrl: 'Modal.html',
                    controller: 'ModalInstanceCtrl'
                });

                modalInstance.result.then(function () {
                    $scope.formHide = false;
                    $scope.formButtons = true;
                    console.log("executed")
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            })
        };


    }]);

    App.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'PlaceOrder', function ($scope, $modalInstance, PlaceOrder) {

        $scope.ModMsg = PlaceOrder.getModalMessage();

        $scope.ok = function () {
            $('#StudentTab').attr('class', 'active');
            $('#OrderTab').attr('class', 'disabled disabledTab');
            $('#PaymentTab').attr('class', 'disabled disabledTab')
            $('#yellow').hide();
            $('#red').show();

            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

    App.controller("PrevOrders", ["$scope", "$location", "PlaceOrder", function ($scope, $location, PlaceOrder) {

        $scope.userDetails = $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        function getOrders() {

            console.log("Getting previous orders")
            $scope.Orders = PlaceOrder.getOrders($scope.userDetails.FranchiseId).success(function (getOrderResponse, getOrderStatus) {
                $scope.Orders = getOrderResponse.pending;
                $scope.dispatched = getOrderResponse.dispatched;
                $scope.completed = getOrderResponse.completed;
            }).error()
        };
        $scope.refreshOrders = function () {

        }
        getOrders();
        $scope.getDate = function (Obj) {
            var str = new Date(Obj).toString();
            return str.substring(0, str.length - 30)
        };

        $scope.listView = false;
        $scope.orderView = true;

        $scope.showOrder = function (index) {
            $scope.listView = toggle($scope.listView);
            $scope.orderView = toggle($scope.orderView);
            if (index != undefined) {
                $scope.OrderNo = index;
            }
        };

        function toggle(data) {
            if (data) {
                return false;

            } else if (data == false) {
                return true;

            }
        }

    }]);

}());