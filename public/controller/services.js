(function () {

    "use strict";

    var App = angular.module("App.services", []);

    App.value('version', '0.1');

    App.factory('LoginService', ['$http', function ($http, $scope) {
        return {
            login: function (data) {
                var LoginReq = {method: 'POST', url: 'http://localhost:3000/auth/login', data: data};
                return $http(LoginReq);
            }
        }
    }]);

    App.factory('PlaceOrder', ['$http', function ($http, $scope) {
        var ModalMessage ="";
        return {
            placeOrder: function (data) {
                console.log("initiated the request");
                var SendCodeReq = {method: 'POST', url: 'http://localhost:3000/order/orders', data: data};
                return $http(SendCodeReq);
            },
            setModalMessage:function(data){
                ModalMessage = data;
            },
            getModalMessage:function(){
                return ModalMessage;
            },
            getOrders: function(data){
                if(!data){
                    data = "";
                }else{
                    data = "?FranchiseId=" + data;
                }
                var urlInitial = "http://localhost:3000/order/orders" + data;
                var getOrdersReq = {method: 'GET', url: urlInitial};
                return  $http(getOrdersReq);
            },
            changeOrderStatus: function(orderId, Status){
                var urlInit = "http://localhost:3000/order/orders"
                var url = urlInit + "?OrderId=" + orderId;
                var putData ={};
                putData.Status = Status;
                var changeOrderStatusReq = {method: 'PUT', url: url, data:putData};
                return $http(changeOrderStatusReq);
            }
        }
    }]);


}());