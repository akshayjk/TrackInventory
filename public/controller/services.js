(function () {

    "use strict";

    var App = angular.module("App.services", []);

    App.value('version', '0.1');

    App.factory('Auth', ['$http', function ($http, $scope) {
        return {
            verifyEmail:function(email){
                console.log("email in service " + email)
                var url = '/auth/verify?email='+email;
                var VerifyReq = {method: 'GET', url: url};
                return $http(VerifyReq);
            },
            registerAccount:function(password, token){
                var url =  "/auth/registerAccount?token=" + token;
              var regAcc = {method:'POST', url:url, data:{password:password}};
                return $http(regAcc);
            },
            login: function (data) {
                var LoginReq = {method: 'POST', url: '/auth/login', data: data};
                return $http(LoginReq);
            },
            createAccount : function(data){
                var createAcc = {method: 'POST', url: '/auth/account', data: data};
                return $http(createAcc);
            },
            getAccounts:function(data){
                var getAcc = {method: 'GET', url: '/auth/account'};
                return $http(getAcc);
            },
            getFranchiseList : function(){
                var getFranList = {method: 'GET', url: '/auth/FranchiseList'};
                return $http(getFranList);
            },
            deleteAccount:function(data){
                var deleteAccUrl = '/auth/account?FranchiseId=';
                var url = deleteAccUrl + data;
                var deleteAcc ={method: 'DELETE', url: url};
                return $http(deleteAcc);
            }
        }
    }]);

    App.factory('PlaceOrder', ['$http', function ($http, $scope) {
        var ModalMessage ="";
        return {
            inventoryHealth:function(){
                var SendCodeReq = {method: 'GET', url: '/order/health'};
                return $http(SendCodeReq);
            },
            placeOrder: function (data) {
                console.log("initiated the request");
                var SendCodeReq = {method: 'POST', url: '/order/orders', data: data};
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
                var urlInitial = "/order/orders" + data;
                var getOrdersReq = {method: 'GET', url: urlInitial};
                return  $http(getOrdersReq);
            },
            changeOrderStatus: function(orderId, data){
                var urlInit = "/order/orders"
                var url = urlInit + "?OrderId=" + orderId;
                var changeOrderStatusReq = {method: 'PUT', url: url, data:data};
                return $http(changeOrderStatusReq);
            },
            getVisibleKits:function(){
                 var url = "/inventory/visibleKits";
                var visibleKits = {method: 'GET', url: url};
                return $http(visibleKits)
            }
        }
    }]);

    App.factory('Downloads', ['$http', function($http){

        return {
            downloadFile:function(data){
                var downloadUrl = "/download/downloadFile";

               //downloadUrl = downloadUrl + "type="+data.type + frm + to + FranId;
               var downloadReq = {method : "GET", url:downloadUrl, params:data};
               return $http(downloadReq);
            }
        }
    }]);

    App.factory('Inventory', ['$http', function($http){
        return{
            getStatus:function(){
                var getStatusReq = {method : "GET", url:"/inventory/status"};
                return $http(getStatusReq);
            },
            addItem:function(data){
                var addItemReq ={method : "POST", url:"/inventory/item", data:data};
                return $http(addItemReq);
            },
            updateItem:function(data){
                var updateItem = {method : "PUT", url:"/inventory/item", data:data};
                return $http(updateItem);
            },
            deleteItem:function(data){
                var deleteItemReq ={method : "DELETE", url:"/inventory/item", data:data};
                return $http(deleteItemReq);
            },
            addKit : function(data){
                var createKitReq ={method : "POST", url:"/inventory/kit", data:data};
                return $http(createKitReq);
            },
            getKits : function(){
                var getKitReq ={method : "GET", url:"/inventory/kit"};
                return $http(getKitReq);
            },
            updateKit: function(data){
                var updateKitReq ={method : "PUT", url:"/inventory/kit", data:data};
                return $http(updateKitReq);
            },
            deleteKit : function(data){
                var deleteKitReq ={method : "DELETE", url:"/inventory/kit", data:data};
                return $http(deleteKitReq);
            }
        }
    }])



}());