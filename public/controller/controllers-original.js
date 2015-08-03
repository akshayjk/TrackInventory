(function () {

    "use strict";

    var App = angular.module("App.controllers", []);

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

    App.controller("AdminController", ["$scope", "$location", "PlaceOrder", function ($scope, $location, PlaceOrder) {

        $scope.UniformCosts = {
            "1": 10,
            "2": 20,
            "3": 30,
            "4": 40,
            "5": 50
        };
        $scope.KitCost = 500;




        $scope.getOrders = function () {
            PlaceOrder.getOrders().success(function (getOrderResponse, getOrderStatus) {

                $scope.dummyOrders = getOrderResponse.pending;
                $scope.dispatched = getOrderResponse.dispatched;
                $scope.completed = getOrderResponse.completed;

            }).error(function (getOrderErrResponse, getOrderErrResponseStatus) {
                $scope.dummyOrders = [];
                $scope.dispatched = [];
                $scope.completed = [];
                console.log(getOrderErrResponse);
            });
        };

        $scope.getOrders();


        $scope.listView = false;
        $scope.orderView = true;
        $scope.OrderNo = 0;
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
            return  hours + ':' + minutes + ' ' + ampm + " " + dateStr + "/" + monthStr + '/' + yrStr;
        };
        $scope.getName = function (name) {
            if (!name)
                return "No Name"
            var minLength = 10 < name.length ? 10 : name.length;
            var extra = 10 < name.length ? "..." : "";
            return name.substring(0, minLength) + extra;
        }

        $scope.dispatchOrder = function (OrderIndex) {

            PlaceOrder.changeOrderStatus($scope.dummyOrders[OrderIndex].OrderId, "DISPATCHED").success(function (chOrdRes, chOrdStat) {
                $scope.dummyOrders[OrderIndex].Status = "DISPATCHED";
                $scope.dispatched.push($scope.dummyOrders[OrderIndex]);
                $scope.dummyOrders.splice(OrderIndex, 1);
                $scope.listView = toggle($scope.listView);
                $scope.orderView = toggle($scope.orderView);
            }).error(function () {
                console.log("Some error has occurred");
            })

        }

    }]);

    App.controller("Inventory", ["$scope", 'Inventory', function ($scope, Inventory) {

        $scope.setVariables = function(Category,dataArray){
            $scope["set"+Category+"Model"]=[];
            $scope["input"+Category+"Model"] = [];
            $scope["view"+Category+"Change"]=[];
            $scope["get"+Category+"Total"]= [];
            dataArray.forEach(function(dat){
                $scope["set"+Category+"Model"].push(0);
                $scope["input"+Category+"Model"].push(0);
                $scope["view"+Category+"Change"].push(false);
                $scope["get"+Category+"Total"].push(0);
            });
            console.log("Calc " + JSON.stringify($scope["view"+Category+"Change"]))
        };

        $scope.addItem ={};
        $scope.getStatus =function(){
            Inventory.getStatus().success(function(statRes, statCode){
                console.log("stat " + JSON.stringify(statRes));
                $scope.InventoryData = statRes;
                $scope.setVariables("Books",$scope.InventoryData["Books"]);
                $scope.setVariables("Uniforms",$scope.InventoryData["Uniforms"]);
                $scope.setVariables("Common",$scope.InventoryData["Common"]);

            }).error(function(){

            })
        };
        $scope.toggle = function(data){
            data = !data;
        };
        $scope.getStatus();
        $scope.saveButton=function(Category,itemNo){
            var tempUpdateObject = {};
            tempUpdateObject[Category] = $scope.InventoryData[Category][itemNo];
            tempUpdateObject[Category].Quantity = $scope["get"+Category+"Total"][itemNo];
            console.log(JSON.stringify(tempUpdateObject));
            Inventory.updateItem(tempUpdateObject).success(function(updRes, updCode){
                console.log(JSON.stringify(updRes));
                $scope.InventoryData[Category][itemNo].Quantity = $scope["get"+Category+"Total"][itemNo];
                $scope["view"+Category+"Change"][itemNo]=false;
                $scope["input"+Category+"Model"][itemNo]=0;
            }).error(function(updErrRes, updErrCode){
                console.log(JSON.stringify(updErrRes));
            })
        };

        $scope.addMore = function(Category){
            if(!$scope.addItem.Name || !$scope.addItem.Quantity){
                console.log("Something is missing !")
            }else{
                var tempAddItem ={};
                tempAddItem[Category]=$scope.addItem;
                console.log(JSON.stringify(tempAddItem))
                Inventory.addItem(tempAddItem).success(function(addRes, addStat){
                    console.log(JSON.stringify(addRes));
                    $scope.InventoryData[Category].push($scope.addItem);
                    $scope.addItem ={};
                    $scope.setVariables(Category, $scope.InventoryData[Category]);

                }).error(function(addErrRes, addErrStat){
                    console.log(JSON.stringify(addErrRes))
                })
            }


        }
        $scope.deleteItem = function(Category, itemNo){
            var tempDeleteObject = {};
            tempDeleteObject[Category] = $scope.InventoryData[Category][itemNo];
            console.log(JSON.stringify(tempDeleteObject))
            Inventory.deleteItem(tempDeleteObject).success(function(delRes, delSta){
                console.log("delete res " + JSON.stringify(delRes));
                $scope.InventoryData[Category].splice(itemNo,1);
                $scope.setVariables(Category, $scope.InventoryData[Category]);
            })

        }
        $scope.calculateChange = function(Category, index){
            console.log($scope["set"+Category+"Model"][index])
            if(!$scope["set"+Category+"Model"][index]){
                //Add Action
                if($scope["input"+Category+"Model"][index]==undefined){
                    $scope["get"+Category+"Total"][index] = $scope.InventoryData[Category][index].Quantity +0;
                }else{
                    $scope["get"+Category+"Total"][index] = $scope.InventoryData[Category][index].Quantity + $scope["input"+Category+"Model"][index];
                }

            }else{
                //reset action
                if($scope["input"+Category+"Model"][index]==undefined){
                    $scope["get"+Category+"Total"][index] = 0;
                }else{
                    $scope["get"+Category+"Total"][index] = $scope["input"+Category+"Model"][index];
                }

            }
            $scope["view"+Category+"Change"][index]=true;
        };


    }]);

    App.controller("Messages", ['$scope', function ($scope) {

        $scope.Messages = [
            {
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
                    }
                ]
            },
            {
                "FranchiseName": "Mumbai School",
                "FranchiseId": "RR25454",
                "ModifiedOn": "2015-04-18T19:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "We have a problem with order Id 5442545. We recieved one CD lesser"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-18T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            },
            {
                "FranchiseName": "Dummy School 1",
                "FranchiseId": "RR25455",
                "ModifiedOn": "2015-04-13T19:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "We have a problem with order Id 5442545. We recieved one CD lesser"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-13T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-13T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            },
            {
                "FranchiseName": "Mumbai School 2",
                "FranchiseId": "RR25456",
                "ModifiedOn": "2015-04-18T19:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "We have a problem with order Id 5442545. We recieved one CD lesser"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-18T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            },
            {
                "FranchiseName": "Kolkata School 3",
                "FranchiseId": "RR25457",
                "ModifiedOn": "2015-04-18T19:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "We have a problem with order Id 5442545. We recieved one CD lesser"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-18T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            },
            {
                "FranchiseName": "Pune School",
                "FranchiseId": "RR25458",
                "ModifiedOn": "2015-04-18T19:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "We have a problem with order Id 5442545. We recieved one CD lesser"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-18T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            },
            {
                "FranchiseName": "Chennai School",
                "FranchiseId": "RR25459",
                "ModifiedOn": "2015-04-18T19:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "We have a problem with order Id 5442545. We recieved one CD lesser"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-18T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            },
            {
                "FranchiseName": "asdas School",
                "FranchiseId": "RR25460",
                "ModifiedOn": "2015-04-18T19:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "We have a problem with order Id 5442545. We recieved one CD lesser"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-18T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            }
        ];

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
            return  hours + ':' + minutes + ' ' + ampm + " " + dateStr + "/" + monthStr + '/' + yrStr;
        };
        $scope.CurrentMessage = $scope.Messages[0].Messages;
        $scope.setMessage = function (msgValue) {
            $scope.CurrentMessage = $scope.Messages[msgValue].Messages;
            var id = $scope.Messages[msgValue].FranchiseId;
            $('#' + id).addClass('clickedMessageFr');
            $scope.Messages.forEach(function (Msg) {
                if (Msg.FranchiseId != id) {
                    $('#' + Msg.FranchiseId).removeClass('clickedMessageFr');
                }
            })

        };

        $scope.clickValue = false;
        $scope.appliedClass = function () {

        }
    }]);

    App.controller("Accounts", ['$scope', 'Auth', function ($scope, Auth) {

        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        $scope.UniformSize = {
            "1": 10,
            "2": 20,
            "3": 30,
            "4": 40
        };
        $scope.RoleRadioModel = 0;
        $scope.KitCost = 500;
        $scope.getAccounts = function () {
            Auth.getAccounts().success(function (AccRes) {
                $scope.Accounts = AccRes;
            }).error(function (errRes) {
                console.log(errRes);
            })
        };
        $scope.getAccounts();
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
            return  hours + ':' + minutes + ' ' + ampm + " " + dateStr + "/" + monthStr + '/' + yrStr;
        };
        $scope.AccountFilter = ['FRANCHISE', 'ADMIN'];
        $scope.AccFilterDef = $scope.AccountFilter[0];
        $scope.AccountDet = {};
        $scope.alertMsg = {view: 0};
        $scope.createAccount = function () {
            $scope.AccountDet.Role = $scope.AccountFilter[$scope.RoleRadioModel];
            if (!$scope.RoleRadioModel) {
                $scope.AccountDet.FranchiseDetails = {};
                $scope.AccountDet.FranchiseDetails.UniformCosts = $scope.UniformSize;
                $scope.AccountDet.FranchiseDetails.KitCost = $scope.KitCost;
            }
            ;

            console.log("Final Object " + JSON.stringify($scope.AccountDet));
            Auth.createAccount($scope.AccountDet).success(function () {
                $scope.alertMsg = {
                    type: 'success',
                    Msg: "Account created Successfully.",
                    view: 1
                };
                $scope.AccountDet = {};
                $scope.getAccounts();

            }).error(function (errMsg) {

                $scope.alertMsg = {
                    type: 'danger',
                    Msg: errMsg.errorMessage,
                    view: 1
                }
            })

        };
        $scope.clearAlert = function () {
            $scope.alertMsg = {view: 0};
            console.log("Clicked")
        };
        $scope.deleteAccount = function (index) {
            console.log("index " + $scope.Accounts[index].FranchiseId);
            Auth.deleteAccount($scope.Accounts[index].FranchiseId).success(function (accRes) {
                console.log("res " + JSON.stringify(accRes));
                $scope.alertMsg = {
                    type: 'success',
                    Msg: accRes.Message,
                    view: 1
                };
                $scope.getAccounts();
            }).error(function (errRes) {
                console.log("err res " + errRes);
            })
        }

    }]);

    App.controller("DownloadsController", ["$scope", "Auth", "Downloads", function ($scope, Auth, Downloads) {

        $scope.ClassOptions = ["PlayGroup", "Nursery", "LKG", "UKG"];
        $scope.FranchiseNameList=[];


        $scope.getFranchiseList = function () {
            Auth.getFranchiseList().success(function (AccRes) {
                console.log(JSON.stringify(AccRes));
                $scope.FranchiseNameList = AccRes;
                $scope.FranchiseNameList.splice(0,0,{"FranchiseId":null, "FranchiseName":"None"});
                $scope.FranchiseName = $scope.FranchiseNameList[0];
                console.log('List here ' + JSON.stringify($scope.FranchiseNameList));
            }).error(function (errRes) {
                console.log("error while getting Accounts Info")
            });


        };
        $scope.getFranchiseList();

        //console.log(" value " + $scope.FranchiseName)
        $scope.downloadObject = {};
        $scope.downloadObject.FranchiseId = this.FranchiseNameOb;
        $scope.onChangeSelected = function(){
            console.log("double " + JSON.stringify($scope.FranchiseName))

            $scope.downloadObject.FranchiseId = this.FranchiseNameOb;
            console.log("selected")
            console.log($scope.downloadObject);
        }
        $scope.downloadType = ["Students", "Orders"];
        $scope.downloadFile = function(){
            $scope.downloadObject.type = this.type;
            console.log($scope.downloadObject);
            Downloads.downloadFile($scope.downloadObject).success(function(downRes, downStatus){
                console.log("successfully Downloaded");
                /*var blob = new Blob([downRes], {type: "application/csv"});
                 var objectUrl = URL.createObjectURL(blob);*/
                var objectUrl = "/download/downloadFile?type="+$scope.downloadObject.type;
                if($scope.downloadObject.fromDate){
                    objectUrl = objectUrl + "&fromDate=" + $scope.downloadObject.fromDate;
                }
                if($scope.downloadObject.toDate){
                    objectUrl = objectUrl + "&toDate=" + $scope.downloadObject.toDate;
                }
                if($scope.downloadObject.FranchiseId){
                    objectUrl = objectUrl + "&FranchiseId=" + $scope.downloadObject.FranchiseId;
                }
                window.open(objectUrl);
                //saveAs(blob, "SomeName.csv")
            }).error(function(){
                console.log("error")
            })
        }

    }]);


}());