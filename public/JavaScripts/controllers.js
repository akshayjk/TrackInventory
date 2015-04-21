/**
 * Created by Akshay on 20-04-2015.
 */


//var LEControllers = angular.module('LEControllers', []);

LeWebApp.controller('LoginController', ['$scope', '$location', function ($scope) {
/* $scope.master = {};
    $scope.date = function (dateValue) {
        return new Date(dateValue).toLocaleDateString();
    }
    $scope.tableData = [
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
            "FranchiseId": "Suleman Kolkata",
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
            "FranchiseId": "Some guy in Delhi",
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

    $scope.update = function (user) {
        $scope.master = angular.copy(user);
    };

    $scope.reset = function () {
        $scope.user = angular.copy($scope.master);
    };

    $scope.reset();*/
    $scope.loginForm ={};
    $scope.login = function(credentials){
        console.log(credentials);
        $location.path('/franchise');
    }
}]);


