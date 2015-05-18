/**
 * Created by Akshay on 04-05-2015.
 */

(function () {

    "use strict";

    var App = angular.module("App.AdminControllers", []);

    App.controller("LogOutCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        $scope.FranchiseName = $scope.userDetails.FranchiseName;
        $scope.logOut = function () {
            delete sessionStorage.userDetails;
            $window.location.href = '/Login';
            //$location.path('/Login')
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
        $scope.listView = [false, false, false];
        $scope.orderView = [true, true, true];
        $scope.OrderNo = [0,0,0];
        $scope.showOrder = function (index, viewIndex) {
            $scope.listView[viewIndex] = toggle($scope.listView[viewIndex]);
            $scope.orderView[viewIndex] = toggle($scope.orderView[viewIndex]);
            if (index != undefined) {
                $scope.OrderNo[viewIndex] = index;
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
        $scope.getStatus = function(name){
            var splitStr = name.substring(1,name.length).toLowerCase();
            return name[0] + splitStr;
        }
        $scope.dispatchOrder = function (OrderIndex) {

            PlaceOrder.changeOrderStatus($scope.dummyOrders[OrderIndex].OrderId, "DISPATCHED").success(function (chOrdRes, chOrdStat) {
                $scope.dummyOrders[OrderIndex].Status = "DISPATCHED";
                $scope.dispatched.splice(0,0,$scope.dummyOrders[OrderIndex]);
                $scope.dummyOrders.splice(OrderIndex, 1);
                $scope.listView[0] = toggle($scope.listView[0]);
                $scope.orderView[0] = toggle($scope.orderView[0]);
                $scope.successMessage = "Successfully dispatched."
                $('#OrderResponseModal').modal('show');
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
        };

        $scope.addItem ={};
        $scope.getStatus =function(){
            Inventory.getStatus().success(function(statRes, statCode){
                $scope.InventoryData = statRes;
                $scope.setVariables("Books",$scope.InventoryData["Books"]);
                $scope.setVariables("Uniforms",$scope.InventoryData["Uniforms"]);
                $scope.setVariables("Common",$scope.InventoryData["Common"]);
                $scope.ItemOptions = JSON.parse(JSON.stringify($scope.InventoryData.Books)).concat(JSON.parse(JSON.stringify($scope.InventoryData.Uniforms)), JSON.parse(JSON.stringify($scope.InventoryData.Common)));

            }).error(function(){

            })
        };
        $scope.getKits = function(){
            Inventory.getKits().success(function(getKitRes, getKitStat){
                $scope.Kits = getKitRes;
            }).error(function(gtKtEr, gtKtErStat){
                console.log(JSON.stringify(gtKtEr))
            })
        };
        $scope.getKits();
        $scope.toggle = function(data){
            data = !data;
        };
        $scope.getStatus();
        $scope.saveButton=function(Category,itemNo){
            var tempUpdateObject = {};
            tempUpdateObject= JSON.parse(JSON.stringify($scope.InventoryData[Category][itemNo]));
            tempUpdateObject.Quantity = $scope["get"+Category+"Total"][itemNo];
            Inventory.updateItem(tempUpdateObject).success(function(updRes, updCode){
                $scope.InventoryData[Category][itemNo].Quantity = $scope["get"+Category+"Total"][itemNo];
                $scope["view"+Category+"Change"][itemNo]=false;
                $scope["input"+Category+"Model"][itemNo]=0;
            }).error(function(updErrRes, updErrCode){
                console.log(JSON.stringify(updErrRes));
            })
        };
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
        $scope.addMore = function(Category){
            if(!$scope.addItem.Name || !$scope.addItem.Quantity){
            }else{
                var tempAddItem ={};
                tempAddItem[Category]=$scope.addItem;
                $scope.addItem.Category = Category;
                console.log("add Item " + JSON.stringify($scope.addItem));
                Inventory.addItem($scope.addItem).success(function(addRes, addStat){
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
            Inventory.deleteItem(tempDeleteObject).success(function(delRes, delSta){
                $scope.InventoryData[Category].splice(itemNo,1);
                $scope.setVariables(Category, $scope.InventoryData[Category]);
            })

        }
        $scope.calculateChange = function(Category, index){
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
        $scope.KitView = false;

        $scope.buildKit =0;
        $scope.viewKit=function(index){
            $scope.KitView = true;
            $scope.currentKit = JSON.parse(JSON.stringify($scope.Kits[index]));
            $scope.toggle($scope.buildKit);
        };
        $scope.ItemSelected = {};
        $scope.builtKit=[];
        $scope.builtKitShow = eval($scope.builtKit.length>0);
        console.log($scope.builtKitShow);
        $scope.addToKit = function(){
                var tempItem = JSON.parse(JSON.stringify($scope.ItemSelected.selected));
                delete tempItem.Quantity;
                delete tempItem.CreatedOn;
                delete tempItem.ModifiedOn;
                $scope.builtKit.push(tempItem);
                $scope.ItemSelected.selected.Units = undefined;
                console.log("array " + JSON.stringify($scope.builtKit))
                $scope.ItemSelected = {};

        };
        $scope.EditAddItem = function(){
            delete $scope.ItemSelected.selected.CreatedOn;
            delete $scope.ItemSelected.selected.ModifiedOn;
            delete $scope.ItemSelected.selected.Quantity;
            delete $scope.ItemSelected.selected['$$hashKey'];
            $scope.currentKit.Kit.push($scope.ItemSelected.selected);
        };
        $scope.saveEditedKit = function(){
            console.log(JSON.stringify($scope.currentKit));
            Inventory.updateKit($scope.currentKit).success(function(updtKitRes, updtKitStat){
                $scope.Kits = updtKitRes;

            }).error(function(errRes, errStat){
                console.log(JSON.stringify(errRes))
            })

        };
        $scope.deleteKit = function(index){
            var deleteKit ={};
            deleteKit.KitId=$scope.Kits[index].KitId;
            Inventory.deleteKit(deleteKit).success(function(delRes, delStat){
                console.log(JSON.stringify(delRes));
                $scope.Kits.splice(index, 1);
                $scope.successMessage=delRes.Message;
                $('#responseModal').modal('show');
            }).error(function(delErRes, delErStat){
                console.log(JSON.stringify(delErRes));
            })
        }
        $scope.removeItemKitEdit = function(index){
            $scope.currentKit.Kit.splice(index,1);
        }
        $scope.saveKit = function(name){
            if(name!=undefined){
                var KitData = {};
                KitData.Name = name;
                KitData.Kit = $scope.builtKit;
                Inventory.addKit(KitData).success(function(addRes, addStat){
                    console.log("res " + JSON.stringify(addRes));
                    $scope.builtKit =[];
                    KitData={};
                    $scope.Kits = addRes;
                    $scope.successMessage="Kit Added Successfully.";
                    $scope.buildKit =0;
                    $('#responseModal').modal('show');

                }).error(function(adKtErRes, adKtStat){
                    console.log("err add Kit " + JSON.stringify(adKtErRes))
                })
            }

        };
        $scope.addToKitButton = $scope.ItemSelected.selected!=undefined?true:false;
        $scope.removeItem = function(Numb){
            $scope.builtKit.splice(Numb,1);
            console.log(JSON.stringify($scope.builtKit))
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
        };
        $scope.deleteAccount = function (index) {
            Auth.deleteAccount($scope.Accounts[index].FranchiseId).success(function (accRes) {
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
                $scope.FranchiseNameList = AccRes;
                $scope.FranchiseNameList.splice(0,0,{"FranchiseId":null, "FranchiseName":"None"});
                $scope.FranchiseName = $scope.FranchiseNameList[0];
            }).error(function (errRes) {
                console.log("error while getting Accounts Info")
            });


        };
        $scope.getFranchiseList();

        $scope.downloadObject = {};
        $scope.downloadObject.FranchiseId = this.FranchiseNameOb;
        $scope.onChangeSelected = function(){
            $scope.downloadObject.FranchiseId = this.FranchiseNameOb;
        }
        $scope.downloadType = ["Students", "Orders"];
        $scope.downloadFile = function(){
            $scope.downloadObject.type = this.type;
            Downloads.downloadFile($scope.downloadObject).success(function(downRes, downStatus){

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