(function () {

    "use strict";

    var App = angular.module("App.services", []);

    App.value('version', '0.1');

    App.factory('LoginService', ['$http', function ($http, $scope) {
        return {
            login: function (data) {
                var SendCodeReq = {method: 'POST', url: 'http://localhost:3000/LoginService', data: data};
                return $http(SendCodeReq);
            }
        }
    }]);

    App.factory('PlaceOrder', ['$http', function ($http, $scope) {
        var ModalMessage ="";
        return {
            placeOrder: function (data) {
                console.log("initiated the request");
                var SendCodeReq = {method: 'POST', url: 'http://localhost:3000/Order', data: data};
                return $http(SendCodeReq);
            },
            setModalMessage:function(data){
                ModalMessage = data;
            },
            getModalMessage:function(){
                return ModalMessage;
            }
        }
    }]);


}());