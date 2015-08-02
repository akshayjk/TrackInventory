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

        $scope.FranchiseName = $scope.userDetails.FranchiseName;
        $scope.logOut = function () {
            console.log("Logging out");
            delete sessionStorage.userDetails;
            $window.location.href = '/Login';
            //$location.path('/Login')
        }
    }]);

    App.controller("GeneralContent", ["$scope", function ($scope) {
        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        $scope.checkClick = function (id) {
            var MenuBar = ['MenuOrd', 'MenuPre', 'MenuQry']
            console.log("Menu click");
            MenuBar.forEach(function (eleId) {
                $('#' + eleId).removeClass('active');
            })
            $('#' + id).addClass('active');
            var screenSizes = {
                xs: 480,
                sm: 768,
                md: 992,
                lg: 1200
            }
            if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
                $("body").removeClass('sidebar-open');
            }
        }
    }])

    App.controller("OrderForm", ["$scope", "$location", "$modal", "PlaceOrder", function ($scope, $location, $modal, PlaceOrder) {

        $scope.getVisibleKits =function(){
            PlaceOrder.getVisibleKits().success(function(visibleKits, status){
                console.log("Classoptions initiated")
                $scope.ClassOptions = visibleKits;
                $scope.Class = $scope.ClassOptions[0];
            }).error(function(errKit,errStat){
                console.log("err in getting response " + errKit)
            });
        };
        $scope.getVisibleKits();
        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
       /* $scope.UniformCosts =[
            {UniformSize: 2, UniformCost: 10},
            {UniformSize: 3, UniformCost: 20},
            {UniformSize: 5, UniformCost: 30},
            {UniformSize: 7, UniformCost: 40}
        ] */
        $scope.UniformCosts = $scope.userDetails.FranchiseDetails.UniformCosts;
        $scope.KitCost = $scope.userDetails.FranchiseDetails.KitCost;
        $scope.formHide = false;
        $scope.formButtons = true;
        $scope.OrderForm = {};
        $scope.StudentObject = {};
        $scope.Students = [];
        $scope.UniformOptions = $scope.UniformCosts;
        $scope.UniformSize = $scope.UniformOptions[0];
        $scope.Qty = 1;
        $scope.UniformArray = [];
        $scope.getUniformQty = function () {
            if ($scope.StudentObject.UniformQty != undefined) {
                return $scope.StudentObject.UniformQty
            } else {
                return $scope.UniformCosts[0].UniformSize;
            }
        };
        /*$scope.getUniformSize = function () {
         if ($scope.StudentObject.UniformSize != undefined) {
         return $scope.StudentObject.UniformSize
         } else {
         return $scope.UniformCosts[0];
         }
         };*/
        $scope.getStudentClass = function () {
            if ($scope.StudentObject.Class != undefined) {
                return $scope.StudentObject.Class;
            } else {
                return "PlayGroup";
            }
        };
        /*$scope.setUniformSize = function () {
         console.log("here " + JSON.stringify($scope.UniformSize))
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
         $scope.setUniformQty();*/
        $scope.setUniformSizeFinal = function (Numb, UniformSize) {
            $scope.Students[Numb].UniformSize = UniformSize;
        };
        console.log("got the Classoptions " + JSON.stringify($scope.ClassOptions))
        //$scope.ClassOptions = $scope.userDetails.FranchiseDetails.Kits//["PlayGroup", "Nursery", "LKG", "UKG"];

        $scope.PaymentOptions = [
            {"Name": "Cash", "Code": 101},
            {"Name": "Account Transfer", "Code": 102}
        ];
        $scope.Mode = $scope.PaymentOptions[0];
        $scope.CalculateHere = $scope.KitCost + $scope.UniformSize.UniformCost;
        $scope.TotalCost = $scope.KitCost + $scope.UniformSize.UniformCost;
        /*$scope.setTotalCost = function () {
         console.log("kit cost " + $scope.KitCost + "  " + $scope.UniformSize + " " +  $scope.getUniformQty())
         $scope.TotalCost = $scope.KitCost + $scope.UniformSize.UniformCost * $scope.getUniformQty();
         };*/
        // $scope.setTotalCost();
        $scope.getFinalCost = function () {

            var FinalCost = 0;
            $scope.Students.forEach(function (student) {
                console.log("student Here the total cost place" + $scope.UniformSize + "  " + $scope.UniformQty);
                FinalCost += $scope.KitCost + student.UniformSize.cost * student.UniformQty;
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
        $scope.studentsTab = false;
        $scope.orderSummary = true;
        $scope.paymentTab = true;
        $scope.addStudents = function (Class, UniformSize, UniformQuantity) {
            var Total = $scope.KitCost + UniformSize.UniformCost * UniformQuantity;
            console.log("Class " + Class + "size " + UniformSize + " Qty " + UniformQuantity + " Total " + Total)
            $scope.StudentObject.Class = Class;
            $scope.StudentObject.UniformSize = UniformSize;
            $scope.StudentObject.UniformQty = UniformQuantity;
            $scope.UniformArray.push(UniformSize);
            if ($scope.StudentObject.Class == undefined) {
                $scope.StudentObject.Class = $scope.ClassOptions[0];
            }
            if ($scope.StudentObject.UniformSize == undefined) {
                $scope.StudentObject.UniformSize = $scope.UniformOptions[0].UniformSize;
                $scope.UniformArray.push($scope.UniformOptions[0].UniformSize);
            }
            $scope.formHide = true;
            $scope.formButtons = false;
            $scope.orderSummary = false;
            $scope.studentsTab = true;
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

            $scope.studentsTab = false;
            $scope.orderSummary = true;
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
            $scope.studentsTab = true;
            $scope.orderSummary = false;
            $scope.formButtons = false;
        };
        $scope.confirmOrder = function () {
            $('#OrderTab').attr('class', 'disabled disabledTab');
            $('#PaymentTab').attr('class', 'active');
            $('#yellow').show();
            $('#orange').hide();
            $scope.orderSummary = true;
            $scope.paymentTab = false;
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
        $scope.findMode = function (Mode) {
            if (Mode.toUpperCase() != "CASH") {
                return true;
            }
            return false;
        }
        $scope.alertMsg = {view: 0};
        $scope.clearAlert = function () {
            $scope.alertMsg = {view: 0};
        };
        $scope.placeOrder = function (Mode) {
            $scope.OrderForm.Students = $scope.Students;
            $scope.OrderForm.FranchiseId = $scope.userDetails.FranchiseId;
            $scope.OrderForm.FranchiseName = $scope.userDetails.FranchiseName;
            $scope.OrderForm.TotalAmount = $scope.TotalAmount;
            $scope.OrderForm.ModeOfPayment = Mode.Name;

            if (Mode.Code == 102) {
                if ($scope.OrderForm.BankName == undefined || $scope.OrderForm.TransactionID == undefined) {
                    $scope.alertMsg = {
                        type: 'danger',
                        Msg: "Bank Details are necessary for Account Transfer option.",
                        view: 1
                    }
                }else{
                    $scope.makeOrder();
                }
            } else {
                $scope.makeOrder();
            }
        };

        $scope.makeOrder = function(){
            console.log("Order details are here " + JSON.stringify($scope.OrderForm));
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
                    $scope.studentsTab = false;
                    $scope.paymentTab = true;
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
        }
        $scope.getKitNumber = function (kitId) {
            var numb = 0;
            $scope.Students.forEach(function (stud) {
                if (stud.Class.KitId == kitId)
                    numb++;
            })
            return numb;
        }
        $scope.getUniformNumber = function (name) {
            var numb = 0;
            $scope.Students.forEach(function (stud) {
                if (stud.UniformSize == name)
                    numb += stud.UniformQty;
            })
            return numb;
        };

        $scope.ready = function () {
            $('#outerWrapper').height(function () {
                var a = $('#studentForm').height() + 750;
                console.log("setting height " + a)
                return a;
            })
        };
        $scope.ready();

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
            PlaceOrder.getOrders($scope.userDetails.FranchiseId).success(function (getOrderResponse, getOrderStatus) {
                $scope.Orders = getOrderResponse.pending;
                $scope.dispatched = getOrderResponse.dispatched;
                $scope.completed = getOrderResponse.completed;
            }).error()
        };
        $scope.refreshOrders = function () {
            getOrders();
        }
        getOrders();
        $scope.getDate = function (Obj) {
            var str = new Date(Obj).toString();
            return str.substring(0, str.length - 30)
        };
        $scope.UniformCosts =$scope.userDetails.FranchiseDetails.UniformCosts;
        $scope.KitCost = $scope.userDetails.FranchiseDetails.KitCost;
        $scope.listView = [false, false];
        $scope.orderView = [true, true];
        $scope.getTotalAmount = function(students){
            var amount=0;
            students.forEach(function(student){
               amount = amount + student.UniformSize.cost*student.UniformQty + $scope.KitCost;
            });
            return amount;
        }
        $scope.showOrder = function (No, index) {
            $scope.listView[No] = toggle($scope.listView[No]);
            $scope.orderView[No] = toggle($scope.orderView[No]);
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

    App.controller("Messages", ["$scope", function ($scope) {

        $scope.Messages = {
            "FranchiseName": "Kolkata School",
            "FranchiseId": "RR25453",
            "ModifiedOn": "2015-04-18T18:37:04.211Z",
            "Messages": [
                {
                    "sender": "akshay",
                    "sent on": "2015-04-18T14:37:04.211Z",
                    "Message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                },
                {
                    "sender": "admin",
                    "sent on": "2015-04-18T18:37:04.211Z",
                    "Message": "We will look into the issue"
                },
                {
                    "sender": "akshay",
                    "sent on": "2015-04-18T14:37:04.211Z",
                    "Message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                },
                {
                    "sender": "admin",
                    "sent on": "2015-04-18T18:37:04.211Z",
                    "Message": "We will look into the issue"
                },
                {
                    "sender": "akshay",
                    "sent on": "2015-04-18T14:37:04.211Z",
                    "Message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                },
                {
                    "sender": "admin",
                    "sent on": "2015-04-18T18:37:04.211Z",
                    "Message": "We will look into the issue"
                },
                {
                    "sender": "akshay",
                    "sent on": "2015-04-18T14:37:04.211Z",
                    "Message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                },
                {
                    "sender": "admin",
                    "sent on": "2015-04-18T18:37:04.211Z",
                    "Message": "We will look into the issue"
                }
            ]
        }
        $scope.getDate = function (dateObj) {
            var dateStr = new Date(dateObj).getDate().toString();
            var monthStr = new Date(dateObj).getMonth().toString();
            var yrStr = new Date(dateObj).getFullYear().toString();
            var date = new Date(dateObj);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm + " " + dateStr + "/" + monthStr + '/' + yrStr;
        };

    }])
}());