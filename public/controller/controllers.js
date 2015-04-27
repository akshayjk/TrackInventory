(function () {

    "use strict";

    var App = angular.module("App.controllers", []);

    App.controller("LoginController", ["$scope", '$location', '$window', 'LoginService', function ($scope, $location, $window, LoginService) {
        /*$scope.aVariable = 'anExampleValueWithinScope';
         $scope.valueFromService = UtilSrvc.helloWorld("User");*/
        $scope.loginForm = {};
        $scope.loginError ="";
        $scope.login = function () {
            console.log($scope.loginForm);
            LoginService.login(JSON.stringify($scope.loginForm)).success(function(LoginResponse, LoginStatus, LoginHeaders){
                    console.log("login response " + LoginResponse);
                sessionStorage.userDetails = angular.toJson(LoginResponse);
                $scope.loginError = "";
                if(LoginResponse.Role=="Admin"){
                        $window.location.href = '../views/AdminMain.html';
                    }else if(LoginResponse.Role=="Franchise"){
                        $window.location.href = '../views/FranchiseMain.html';
                    }
            }).error(function(LoginResponse, LoginStatus, LoginHeaders){
                console.log(LoginResponse.errorMessage)
                $scope.loginError = LoginResponse.errorMessage;
            })

        }
    }]);

    App.controller("LogOutCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

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
        $scope.Maths = 40;
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
            console.log("Place order was clicked");
            PlaceOrder.placeOrder($scope.OrderForm).success(function(poResponse, poStatus){
                console.log(" po response " + poResponse.Message);
                $scope.OrderForm = {};
                $scope.StudentObject = {};
                $scope.Students = [];
                $scope.TotalAmount=0;
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


            }).error(function(poErResponse, poResStatus){
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

    App.controller('ModalInstanceCtrl', ['$scope','$modalInstance', 'PlaceOrder', function ($scope, $modalInstance, PlaceOrder) {

        $scope.ModMsg = PlaceOrder.getModalMessage();

        $scope.ok = function () {
            $('#StudentTab').attr('class', 'active');
            $('#OrderTab').attr('class', 'disabled disabledTab');
            $('#PaymentTab').attr('class','disabled disabledTab')
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
        function getOrders(){
            $scope.Orders = PlaceOrder.getOrders($scope.userDetails.FranchiseId).success(function(getOrderResponse, getOrderStatus){
                $scope.Orders = getOrderResponse.pending;
                $scope.dispatched = getOrderResponse.dispatched;
                $scope.completed = getOrderResponse.completed;
            }).error()
        };

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

        PlaceOrder.getOrders().success(function(getOrderResponse, getOrderStatus){

            $scope.dummyOrders = getOrderResponse.pending;
            $scope.dispatched = getOrderResponse.dispatched;
            $scope.completed = getOrderResponse.completed;

        }).error(function(getOrderErrResponse, getOrderErrResponseStatus){
            $scope.dummyOrders =[];
            $scope.dispatched = [];
            $scope.completed = [];
            console.log(getOrderErrResponse);
        });


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
            var dateStr = new Date(dateObj).toDateString();
            return dateStr;

        }

        $scope.dispatchOrder = function (OrderIndex) {

            PlaceOrder.changeOrderStatus($scope.dummyOrders[OrderIndex].OrderId, "DISPATCHED").success(function(chOrdRes, chOrdStat){
                $scope.dummyOrders[OrderIndex].Status = "DISPATCHED";
                $scope.dispatched.push($scope.dummyOrders[OrderIndex]);
                $scope.dummyOrders.splice(OrderIndex, 1);
                $scope.listView = toggle($scope.listView);
                $scope.orderView = toggle($scope.orderView);
            }).error(function(){
                console.log("Some error has occurred");
            })

        }

    }]);

    App.controller("Inventory", ["$scope", function ($scope) {

        $scope.AddInventoryData = {
            "KitContent" :{
                "Diary" : 0,
                "School bag" : 0,
                "Paint without Brush school kit" : 0,
                "Id card and pouch":0,
                "Evaluation Report" : 0
            },
            "Books":{
                "Manners and Etttiquettes" : 0,
                "Alphabet and Phonics Level 1 ": 0,
                "Alphabet and Phonics Level 2" : 0,
                "Premaths Level 2" :0,

                "Premaths Level 3":0,
                "Premaths Level 4":0,


                "Social Studies Level 2":0,
                "Social Studies Level 3":0,
                "Social Studies Level 4":0,


                "Science Level 2":0,
                "Science Level 3":0,
                "Science Level 4":0,


                "Scribble and write":0,
                "practice writing capital letters" : 0,
                "line and curves 3" : 0,
                "lines and curves 4":0,


                "Drawing&colouring for the young a" : 0,
                "drawing and activity a":0,


                "Little Enthusiast CDs":0,
                "Little Explorers CDs":0


            },
            "Uniforms" :{

                "Uniform Size 2":0,
                "Uniform Size 3":0,
                "Uniform Size 5":0,
                "Uniform Size 7":0,


                "Socks Size 2" : 0,
                "Socks Size 4": 0

            }
        };

        $scope.InventoryData = {
            "KitContent" :{
                "Diary" : 160,
                "School bag" : 85,
                "Paint without Brush school kit" : 94,
                "Id card and pouch":76,
                "Evaluation Report" : 100
            },
            "Books":{
                "Manners and Etttiquettes" : 20,
                "Alphabet and Phonics Level 1 ": 45,
                "Alphabet and Phonics Level 2" : 80,
                "Premaths Level 2" :60,

                "Premaths Level 3":49,
                "Premaths Level 4":67,


                "Social Studies Level 2":60,
                "Social Studies Level 3":49,
                "Social Studies Level 4":67,


                "Science Level 2":60,
                "Science Level 3":49,
                "Science Level 4":67,


                "Scribble and write":45,
                "practice writing capital letters" : 50,
                "line and curves 3" : 34,
                "lines and curves 4":67,


                "Drawing&colouring for the young a" : 56,
                "drawing and activity a":70,


                "Little Enthusiast CDs":49,
                "Little Explorers CDs":50


            },
            "Uniforms" :{

                "Uniform Size 2":30,
                "Uniform Size 3":40,
                "Uniform Size 5":50,
                "Uniform Size 7":40,


                "Socks Size 2" : 30,
                "Socks Size 4": 45

            }
        };
        $scope.Maths = "this is maths";
        $('#addInv').hide();
        $('#EditInvDet').hide();
        //console.log("Inventory"+InventoryData.KitContent.Diary.value)

        $scope.invEdit = function(){
            //    $('#addInv').removeClass("disabled");

            $('#EditInvDet').show();
            $('#InvDet').hide();
        }


        $scope.invAdd = function(){
            $('#addInv').show();
            $('#InvDet').hide();


        }
        $scope.editAdd = function(){

            $('#EditInvDet').hide();
            $('#InvDet').show();
            console.log($scope.InventoryData.Books['Premaths Level 4'])


        }
        $scope.updateAdd = function(){
            $('#addInv').hide();

            $('#InvDet').show();
            console.log($scope.AddInventoryData.Books['Premaths Level 4'])


        }
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
            return  hours + ':' + minutes + ' ' + ampm + " " + dateStr + "/" + monthStr + '/'+ yrStr;
        };
        $scope.CurrentMessage = $scope.Messages[0].Messages;
        $scope.setMessage = function (msgValue) {
            $scope.CurrentMessage = $scope.Messages[msgValue].Messages;
            var id =  $scope.Messages[msgValue].FranchiseId;
            $('#' +id).addClass('clickedMessageFr');
            $scope.Messages.forEach(function(Msg){
                if(Msg.FranchiseId!=id){
                    $('#' + Msg.FranchiseId).removeClass('clickedMessageFr');
                }
            })

        };

        $scope.clickValue = false;
        $scope.appliedClass = function () {

        }
    }]);

    App.controller("Accounts", ['$scope', function($scope){

        $scope.Accounts = [
            {
                "FranchiseName": "Kolkata School",
                "CreatedOn": "2015-04-18T19:37:04.211Z",
                "FranchiseId": "RYT5653",
                "Role": "Franchise",
                "Address": "Some Address here "
            },
            {
                "FranchiseName": "Mumbai School",
                "CreatedOn": "2015-04-18T19:37:04.211Z",
                "FranchiseId": "RYT5654",
                "Role": "Franchise",
                "Address": "Some Address here "
            },
            {
                "FranchiseName": "Admin 2",
                "CreatedOn": "2015-04-18T19:37:04.211Z",
                "FranchiseId": "RYT5655",
                "Role": "Admin",
                "Address": "Some Address here "
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
            return dateStr + "/" + monthStr + '/'+ yrStr + " " + hours + ':' + minutes + ' ' + ampm;
        };
        $scope.AccountFilter = ['Franchise', 'Admin'];
        $scope.AccFilterDef = $scope.AccountFilter[0];
    }]);

    App.controller("DownloadsController", ["$scope",  function ($scope) {

        $scope.ClassOptions = ["PlayGroup", "Nursery", "LKG", "UKG"];

        $scope.FranchiseNameList = ["Kolkata School", "Dummy School 1", "Mumbai School 2", "Kolkata School 3", "Pune School"];

        $scope.OrderNameList = ["Pending", "Ordered", "Dispatched", "All"];

        console.log("order",+$scope.OrderNameList[0]);

        console.log("franchise",+$scope.FranchiseNameList[0]);
        $scope.OrderFilterDef = $scope.OrderNameList[0];

        $scope.FranchiseFilterDef = $scope.FranchiseNameList[0];
    }]);


}());