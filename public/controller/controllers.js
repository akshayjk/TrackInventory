(function () {

    "use strict";

    var App = angular.module("App.controllers", []);

    App.controller("LoginController", ["$scope", '$location', '$window', function ($scope, $location, $window) {
        /*$scope.aVariable = 'anExampleValueWithinScope';
         $scope.valueFromService = UtilSrvc.helloWorld("User");*/
        $scope.loginForm = {};
        $scope.login = function () {
            console.log($scope.loginForm);
            if($scope.loginForm.username=="admin"){
                $window.location.href = '../views/AdminMain.html';
            }else{
                $window.location.href = '../views/FranchiseMain.html';
            }

        }
    }]);

    App.controller("LogOutCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

        function ComeOn(){
            console.log("here is the problem")
        }
        ComeOn();

        $scope.logOut = function () {
            console.log("Logging out");
            $window.location.href = '/Login';
            //$location.path('/Login')
        }
    }]);

    App.controller("OrderForm", ["$scope", "$location", function ($scope, $location) {

        $scope.ready = function(){
            $('#PaymentTab').attr('class', 'disabled disabledTab');
            $('#OrderTab').attr('class', 'disabled disabledTab');
        }

        $scope.ready();
        $scope.navActive = function(Name){
            $('#' + Name).attr('class', 'active');
            var Tabs = ["Orders", "PreviousOrders", "Query"]
            Tabs.forEach(function(tab){
                if(tab!=Name){
                    $('#' + tab).removeClass('active');
                }
            });
            $location.path('/' + Name)
        }

        $scope.UniformCosts =
        {
            "1": 10,
            "2": 20,
            "3": 30,
            "4": 40,
            "5": 50
        }
        $scope.KitCost = 500;

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

        $scope.setUniformQty = function(){
            if($scope.StudentObject.UniformQty==undefined){
                $scope.StudentObject.UniformQty =1;
            }
        };
        $scope.setUniformQty();
        $scope.setUniformSizeFinal = function (Numb) {
            $scope.Students[Numb].UniformSize = $scope.UniformArray[Numb];
        }
        $scope.ClassOptions = ["PlayGroup", "Nursery", "LKG", "UKG"];
        $scope.Class = $scope.ClassOptions[0];
        $scope.setTotalCost = function () {
            console.log("kit cost " + $scope.KitCost + "  " + $scope.UniformCosts[$scope.getUniformSize()] * $scope.getUniformQty())
            $scope.TotalCost = $scope.KitCost + $scope.UniformCosts[$scope.getUniformSize()] * $scope.getUniformQty();
        }
        $scope.setTotalCost();
        $scope.getFinalCost = function(){

            var FinalCost = 0;
            $scope.Students.forEach(function(student){
                console.log("student " + $scope.UniformCosts[student.UniformSize] + "  " +  $scope.UniformQty);
                FinalCost+= $scope.KitCost + $scope.UniformCosts[student.UniformSize] * student.UniformQty;
            });
            return FinalCost
        }
        $scope.setClass = function () {

            $scope.StudentObject.Class = $scope.Class;
            $scope.setTotalCost();
            console.log("Class name : " + $scope.StudentObject.Class);
        };

        $scope.getWelComeKitClass = function(){
            if($scope.StudentObject.Class!=undefined){
                return $scope.StudentObject.Class;
            }else{
                return $scope.Class;
            }
        }

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

        }
        $scope.placeOrder = function () {
            $scope.OrderForm.Students = $scope.Students;
            console.log(JSON.stringify($scope.OrderForm))
        };




    }]);

    App.controller("PrevOrders", ["$scope", "$location", function ($scope, $location) {

        $scope.Orders =[
            {
                "Students": [
                    {
                        "NameOfStudent": "Akshay6",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    },
                    {
                        "NameOfStudent": "Akshay7",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    }
                ],
                "FranchiseId": "35465464",
                "Status": "Ordered",
                "TotalAmount": 654354.55,
                "ModeOfPayment": "Cash",
                "TransactionID": "RR88283553",
                "Address": "Some detailed address here ",
                "OrderId": "4641429367824201",
                "CreateOn": "2015-04-18T14:37:04.211Z",
                "ModifiedOn": "2015-04-18T14:37:04.211Z"
            },
            {
                "Students": [
                    {
                        "NameOfStudent": "Akshay6",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    },
                    {
                        "NameOfStudent": "Akshay7",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 10,
                        "UniformQty": 2
                    }
                ],
                "FranchiseId": "35465464",
                "Status": "Ordered",
                "TotalAmount": 654354.55,
                "ModeOfPayment": "Cash",
                "TransactionID": "RR88283553",
                "Address": "Some detailed address here ",
                "OrderId": "4641429367906931",
                "CreateOn": "2015-04-18T14:38:26.943Z",
                "ModifiedOn": "2015-04-18T14:38:26.943Z"
            }
        ]
        $scope.getDate = function(Obj){
            var str = new Date(Obj).toString();
            return str.substring(0, str.length-30)
        }
    }]);

    App.controller("AdminController", ["$scope", "$location", function($scope, $location){

        $scope.UniformCosts = {
            "1": 10,
            "2": 20,
            "3": 30,
            "4": 40,
            "5": 50
        };
        $scope.KitCost = 500;
        $scope.dummyOrders = [
            {
                "Students": [
                    {
                        "NameOfStudent": "Akshay6",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 2,
                        "UniformQty": 2,
                        "Class":"PlayGroup"

                    },
                    {
                        "NameOfStudent": "Akshay7",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 1,
                        "UniformQty": 2,
                        "Class":"PlayGroup"
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 3,
                        "UniformQty": 2,
                        "Class":"UKG"
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 2,
                        "UniformQty": 2,
                        "Class":"UKG"
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 1,
                        "UniformQty": 2,
                        "Class":"UKG"
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 4,
                        "UniformQty": 2,
                        "Class":"UKG"
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 4,
                        "UniformQty": 2,
                        "Class":"UKG"
                    }
                ],
                "FranchiseId": "Kolkata School",
                "Status": "Ordered",
                "TotalAmount": 654354.55,
                "ModeOfPayment": "Cash",
                "TransactionID": "RR88283553",
                "Address": "Some detailed address here ",
                "OrderId": "4641429367824201",
                "CreateOn": "2015-04-18T14:37:04.211Z",
                "ModifiedOn": "2015-04-18T14:37:04.211Z"
            },
            {
                "Students": [
                    {
                        "NameOfStudent": "Akshay6",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 5,
                        "UniformQty": 2,
                        "Class":"PlayGroup"
                    },
                    {
                        "NameOfStudent": "Akshay7",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 1,
                        "UniformQty": 2,
                        "Class":"SKG"
                    },
                    {
                        "NameOfStudent": "Akshay8",
                        "RegistrationNumber": "AG887425",
                        "UniformSize": 2,
                        "UniformQty": 2,
                        "Class":"Nursery"
                    }
                ],
                "FranchiseId": "Mumbai School",
                "Status": "Ordered",
                "TotalAmount": 654354.55,
                "ModeOfPayment": "Cash",
                "TransactionID": "RR88283553",
                "Address": "Some detailed address here ",
                "OrderId": "4641429367906931",
                "CreateOn": "2015-04-18T14:38:26.943Z",
                "ModifiedOn": "2015-04-18T14:38:26.943Z"
            }
        ];
        $scope.dispatched = [{
            "Students": [

                {
                    "NameOfStudent": "Akshay8",
                    "RegistrationNumber": "AG887425",
                    "UniformSize": 2,
                    "UniformQty": 2,
                    "Class":"UKG"
                },
                {
                    "NameOfStudent": "Akshay8",
                    "RegistrationNumber": "AG887425",
                    "UniformSize": 1,
                    "UniformQty": 2,
                    "Class":"UKG"
                },
                {
                    "NameOfStudent": "Akshay8",
                    "RegistrationNumber": "AG887425",
                    "UniformSize": 4,
                    "UniformQty": 2,
                    "Class":"UKG"
                },
                {
                    "NameOfStudent": "Akshay8",
                    "RegistrationNumber": "AG887425",
                    "UniformSize": 4,
                    "UniformQty": 2,
                    "Class":"UKG"
                }
            ],
            "FranchiseId": "Kolkata School",
            "Status": "Dispatched",
            "TotalAmount": 654354.55,
            "ModeOfPayment": "Cash",
            "TransactionID": "RR88283553",
            "Address": "Some detailed address here ",
            "OrderId": "46414234537824201",
            "CreateOn": "2015-04-18T14:37:04.211Z",
            "ModifiedOn": "2015-04-18T14:37:04.211Z"
        }];
        $scope.listView = false;
        $scope.orderView = true;
        $scope.OrderNo =0;
        $scope.showOrder = function(index){
            $scope.listView = toggle($scope.listView);
            $scope.orderView = toggle($scope.orderView);
            if(index!=undefined){
                $scope.OrderNo = index;
            }
        };

        function toggle(data){
            console.log("1st " + data)
            if(data){
                return false;

            }else if(data==false){
                return true;

            }
        }
        $scope.getDate = function(dateObj){
            var dateStr = new Date(dateObj).toDateString();
            console.log(dateStr + " "  + dateStr.length);
            return dateStr;

        }

        $scope.dispatchOrder = function(OrderIndex){
            $scope.dummyOrders[OrderIndex].Status ="Dispatched"
            $scope.dispatched.push($scope.dummyOrders[OrderIndex]);
            $scope.dummyOrders.splice(OrderIndex, 1);
            $scope.listView = toggle($scope.listView);
            $scope.orderView = toggle($scope.orderView);
        }

    }]);

    App.controller("Inventory",["$scope", function($scope){

        $scope.InventoryData = {
            "Kit Content" :{
                "Diary" : 160,
                "School bag" : 85,
                "Paint without Brush school kit" : 94,
                "Id card and pouch":76,
                "Evaluation Report" : 100
            },
            "Books":{
                "Manners and Etttiquettes" : 20,
                "Alphabet and Phonics":{
                    "Level 1": 45,
                    "Level 2":80
                },
                "Premaths" :{
                    "Level 2":60,
                    "Level 3":49,
                    "Level 4":67
                },
                "Social Studies":{
                    "Level 2":60,
                    "Level 3":49,
                    "Level 4":67
                },
                "Science" :{
                    "Level 2":60,
                    "Level 3":49,
                    "Level 4":67
                },
                "Writing":{
                    "Scribble and write":45,
                    "practice writing capital letters" : 50,
                    "line and curves 3" : 34,
                    "lines and curves 4":67
                },
                "Colouring":{
                    "Drawing&colouring for the young a" : 56,
                    "drawing and activity a":""
                },
                "CDs":{
                    "Little Enthusiast":49,
                    "Little Explorers":50
                }

            },
            "Uniforms" :{
                "Uniform":{
                    "Size 2":30,
                    "Size 3":40,
                    "Size 5":50,
                    "Size 7":40
                },
                "Socks":{
                    "Size 2" : 30,
                    "Size 4": 45
                }
            }
        }

    }])
}());