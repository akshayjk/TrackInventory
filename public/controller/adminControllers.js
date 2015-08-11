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

    App.controller("AdminController", ["$scope", "$location", "$modal","PlaceOrder","$window", function ($scope, $location, $modal, PlaceOrder, $window) {
        $scope.StartCheck=function(){

            try{
                JSON.parse(sessionStorage.userDetails)
            }catch(e){
                $window.location.href = '/Login';
            }

            if(JSON.parse(sessionStorage.userDetails).FranchiseId==undefined){
                $window.location.href = '/Login';
            }
        };
        $scope.StartCheck();
        $scope.UniformCosts = {
            "1": 10,
            "2": 20,
            "3": 30,
            "4": 40,
            "5": 50
        };

        $scope.getNotificationItems = function(){
            PlaceOrder.inventoryHealth().success(function(res, stat){
                $scope.NotificationItems = res;
            }).error(function(errRes, Stat){
            })
        }
        $scope.getNotificationItems();
        $scope.viewNot = true;
        $scope.checkClick = function(id){
            var MenuBar =['MenuInv','MenuAcc','MenuOrder','MenuMsg', 'MenuDwn']
            MenuBar.forEach(function(eleId){
                $('#'+eleId).removeClass('active');
            })
            $('#'+id).addClass('active');
            var screenSizes ={
                xs: 480,
                sm: 768,
                md: 992,
                lg: 1200
            }
            if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
                $("body").removeClass('sidebar-open');
            }
        }

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
            });
        };
        $scope.getOrders();
        $scope.listView = [false, false, false];
        $scope.orderView = [true, true, true];
        $scope.OrderNo = [0, 0, 0];
        $scope.showOrder = function (index, viewIndex) {

            $scope.orderList = false;
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
            return hours + ':' + minutes + ' ' + ampm + " " + dateStr + "/" + monthStr + '/' + yrStr;
        };
        $scope.getName = function (name) {
            if (!name)
                return "No Name"
            var minLength = 10 < name.length ? 10 : name.length;
            var extra = 10 < name.length ? "..." : "";
            return name.substring(0, minLength) + extra;
        }
        $scope.getStatus = function (name) {
            var splitStr = name.substring(1, name.length).toLowerCase();
            return name[0] + splitStr;
        }

        $scope.CourierName = '';
        $scope.TrackingID = '';
        $scope.animation = true;
        $scope.DispatchForm = {}

        $scope.dispatchOrder = function (OrderIndex) {

            PlaceOrder.changeOrderStatus($scope.dummyOrders[OrderIndex].OrderId, {
                Status: "DISPATCHED",
                CourierName: $scope.CourierName,
                TrackingID: $scope.TrackingID
            }).success(function (chOrdRes, chOrdStat) {
                $scope.dummyOrders[OrderIndex].Status = "DISPATCHED";
                $scope.dispatched.splice(0, 0, $scope.dummyOrders[OrderIndex]);
                $scope.dummyOrders.splice(OrderIndex, 1);
                $scope.listView[0] = toggle($scope.listView[0]);
                $scope.orderView[0] = toggle($scope.orderView[0]);
                $scope.successMessage = "Successfully dispatched."
                /*//$('#OrderResponseModal').modal('show');
                 $('#dispatchResponseModal').modal('hide');
                 $("#dispatchResponseModal").on("hide", function() {    // remove the event listeners when the dialog is dismissed
                 $("#dispatchResponseModal a.btn").off("click");
                 });
                 //$('#dispatchResponseModal').modal('show');*/
            }).error(function (errRes,errStat) {
                bootbox.dialog({
                    message: errRes.errorMessage,
                    title: "Failure !",
                    buttons: {
                        main: {
                            label: "Cancel",
                            className: "btn-default",
                            callback: function() {
                                console.log("Modal dismissed");
                            }
                        }
                    }
                });
            })

        }

        //..........................................New Desing extra Vars ........................................................
        //$scope.orderList = true;
        $scope.dispatchModal = function () {
            var modalInstance = $modal.open({
                animation: $scope.animations,
                templateUrl: 'dispatchConfirmationModal.html',
                controller: 'dispatchConfirmationModalCtrl',
                resolve:{
                    summary:function(){
                        return $scope.dummyOrders[$scope.OrderNo[0]].Summary;
                    }
                }
            });

            modalInstance.result.then(function (form) {
                $scope.CourierName = form.CourierName;
                $scope.TrackingID = form.TrackingID;
                $scope.dispatchOrder($scope.OrderNo[0])
            }, function () {
            });
        }

    }]);

    App.controller("dispatchConfirmationModalCtrl",["$scope","$modalInstance",function($scope, $modalInstance, summary){
        $scope.summary = summary;
        $scope.form = {};
        $scope.ok = function () {
            $modalInstance.close($scope.form);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])

    App.controller("Inventory", ["$scope", 'Inventory', function ($scope, Inventory) {

        $scope.setVariables = function (Category, dataArray) {
            $scope["set" + Category + "Model"] = [];
            $scope["input" + Category + "Model"] = [];
            $scope["view" + Category + "Change"] = [];
            $scope["get" + Category + "Total"] = [];
            dataArray.forEach(function (dat) {
                $scope["set" + Category + "Model"].push(0);
                $scope["input" + Category + "Model"].push(0);
                $scope["view" + Category + "Change"].push(false);
                $scope["get" + Category + "Total"].push(0);
            });
        };

        $scope.addItem = {};
        $scope.getStatus = function () {
            Inventory.getStatus().success(function (statRes, statCode) {
                $scope.InventoryData = statRes;
                $scope.setVariables("Books", $scope.InventoryData["Books"]);
                $scope.setVariables("Uniforms", $scope.InventoryData["Uniforms"]);
                $scope.setVariables("Common", $scope.InventoryData["Common"]);
                $scope.ItemOptions = JSON.parse(JSON.stringify($scope.InventoryData.Books)).concat(JSON.parse(JSON.stringify($scope.InventoryData.Uniforms)), JSON.parse(JSON.stringify($scope.InventoryData.Common)));
               // $scope.setInvTabHeight();
            }).error(function () {

            })
        };
        $scope.getKits = function () {
            Inventory.getKits().success(function (getKitRes, getKitStat) {
                $scope.Kits = getKitRes;
            }).error(function (gtKtEr, gtKtErStat) {
            })
        };
        $scope.getKits();
        $scope.toggle = function (data) {
            data = !data;
        };
        $scope.getStatus();
        $scope.saveButton = function (Category, itemNo) {
            var tempUpdateObject = {};
            tempUpdateObject = JSON.parse(JSON.stringify($scope.InventoryData[Category][itemNo]));
            tempUpdateObject.Quantity = $scope["get" + Category + "Total"][itemNo];
            $scope.loadingSave = true;
            Inventory.updateItem(tempUpdateObject).success(function (updRes, updCode) {
                $scope.InventoryData[Category][itemNo].Quantity = $scope["get" + Category + "Total"][itemNo];
                $scope["view" + Category + "Change"][itemNo] = false;
                $scope["input" + Category + "Model"][itemNo] = 0;
                $scope.loadingSave = false;

            }).error(function (updErrRes, updErrCode) {
            })
        };

        $scope.saveButtonTest = function(){
            $scope.loading = true;
            setTimeout(function(){
                $scope.loading = false;
            }, 2000)
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


        $scope.addMore = function (Category, Tags) {
            if (!$scope.addItem.Name || !$scope.addItem.Quantity) {
            } else {
                var tempAddItem = {};
                tempAddItem[Category] = $scope.addItem;
                $scope.addItem.Category = Category;
                if(Tags!=undefined){
                    $scope.addItem.Tags = Tags;
                }
                $scope.loading = true;
                    Inventory.addItem($scope.addItem).success(function (addRes, addStat) {
                        $scope.InventoryData[Category].push(addRes.Item[0]);
                        $scope.ItemOptions.push(addRes.Item[0]);
                        $scope.addItem = {};
                        $scope.setVariables(Category, $scope.InventoryData[Category]);
                        $('#InventoryTabWrapper').height(function(){
                            var ht = $('#'+Category).height();
                            return ht + 150;
                        })
                        $scope.loading = false;

                    }).error(function (addErrRes, addErrStat) {
                    })


            }


        }


        $scope.deleteKitConfirm = function(kitNo){
            bootbox.dialog({
                message: "Are you sure you want to delete the kit ?",
                title: "Confirm Delete",
                buttons: {
                    danger: {
                        label: "Delete",
                        className: "btn-danger",
                        callback: function() {
                            $scope.deleteKit(kitNo)
                        }
                    },
                    main: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function() {
                            console.log("Modal dismissed");
                        }
                    }
                }
            });
        }
        $scope.deleteItemConfirm = function(Category,itemNo){
            bootbox.dialog({
                message: "Are you sure ?",
                title: "Confirm Delete",
                buttons: {
                    danger: {
                        label: "Delete",
                        className: "btn-danger",
                        callback: function() {
                            $scope.deleteItem(Category, itemNo)
                        }
                    },
                    main: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function() {
                            console.log("Modal dismissed");
                        }
                    }
                }
            });
        }
        $scope.deleteItem = function (Category, itemNo) {
            var tempDeleteObject = {};
            tempDeleteObject[Category] = $scope.InventoryData[Category][itemNo];
            Inventory.deleteItem(tempDeleteObject).success(function (delRes, delSta) {
                $scope.InventoryData[Category].splice(itemNo, 1);
                $scope.setVariables(Category, $scope.InventoryData[Category]);
                $('#InventoryTabWrapper').height(function(){
                    return $('#'+Category).height()+ 50;
                })
            })

        }
        $scope.calculateChange = function (Category, index) {
            if (!$scope["set" + Category + "Model"][index]) {
                //Add Action
                if ($scope["input" + Category + "Model"][index] == undefined) {
                    $scope["get" + Category + "Total"][index] = $scope.InventoryData[Category][index].Quantity + 0;
                } else {
                    $scope["get" + Category + "Total"][index] = $scope.InventoryData[Category][index].Quantity + $scope["input" + Category + "Model"][index];
                }

            } else {
                //reset action
                if ($scope["input" + Category + "Model"][index] == undefined) {
                    $scope["get" + Category + "Total"][index] = 0;
                } else {
                    $scope["get" + Category + "Total"][index] = $scope["input" + Category + "Model"][index];
                }

            }
            $scope["view" + Category + "Change"][index] = true;
        };
        $scope.KitView = false;

        $scope.buildKit = 0;
        $scope.viewKit = function (index) {
            $scope.KitView = true;
            $scope.currentKit = JSON.parse(JSON.stringify($scope.Kits[index]));
            $scope.toggle($scope.buildKit);
        };
        $scope.ItemSelected = {};
        $scope.builtKit = [];
        $scope.builtKitShow = eval($scope.builtKit.length > 0);
        $scope.addToKit = function () {
            var tempItem = JSON.parse(JSON.stringify($scope.ItemSelected.selected));
            delete tempItem.Quantity;
            delete tempItem.CreatedOn;
            delete tempItem.ModifiedOn;
            $scope.builtKit.push(tempItem);
            $scope.ItemSelected.selected.Units = undefined;
            $scope.ItemSelected = {};

        };
        $scope.EditAddItem = function () {
            delete $scope.ItemSelected.selected.CreatedOn;
            delete $scope.ItemSelected.selected.ModifiedOn;
            delete $scope.ItemSelected.selected.Quantity;
            delete $scope.ItemSelected.selected['$$hashKey'];
            $scope.currentKit.Kit.push($scope.ItemSelected.selected);
        };
        $scope.saveEditedKit = function () {
            Inventory.updateKit($scope.currentKit).success(function (updtKitRes, updtKitStat) {
                $scope.Kits = updtKitRes;

            }).error(function (errRes, errStat) {
            })

        };
        $scope.deleteKitConfirm = function(index){
            bootbox.dialog({
                message: "Are you sure ?",
                title: "Confirm Delete",
                buttons: {
                    danger: {
                        label: "Delete",
                        className: "btn-danger",
                        callback: function() {
                            $scope.deleteKit(index)
                        }
                    },
                    main: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function() {
                            console.log("Modal dismissed");
                        }
                    }
                }
            });
        }
        $scope.deleteKit = function (index) {
            var deleteKit = {};
            deleteKit.KitId = $scope.Kits[index].KitId;
            Inventory.deleteKit(deleteKit).success(function (delRes, delStat) {
                $scope.Kits.splice(index, 1);
                $scope.successMessage = delRes.Message;
                $('#responseModal').modal('show');
            }).error(function (delErRes, delErStat) {
            })
        }
        $scope.removeItemKitEdit = function (index) {
            $scope.currentKit.Kit.splice(index, 1);
        }
        $scope.saveKit = function (name, kitVisibility) {
            if (name != undefined) {
                var KitData = {};
                KitData.Name = name;
                KitData.Kit = $scope.builtKit;
                KitData.Tags = kitVisibility;
                Inventory.addKit(KitData).success(function (addRes, addStat) {
                    $scope.builtKit = [];
                    KitData = {};
                    $scope.Kits = addRes;
                    $scope.successMessage = "Kit Added Successfully.";
                    $scope.buildKit = 0;
                    $('#responseModal').modal('show');
                }).error(function (adKtErRes, adKtStat) {
                })
            }
        };
        $scope.addToKitButton = $scope.ItemSelected.selected != undefined ? true : false;
        $scope.removeItem = function (Numb) {
            $scope.builtKit.splice(Numb, 1);
        };

        $scope.Tags =["Visible", "Hidden"];
        $scope.kitOption = $scope.Tags[1];

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
        $scope.trimLastMessage = function(Numb){
            var msg = $scope.Messages[Numb].Messages[$scope.Messages[Numb].Messages.length-1].Message;
            var maxLt = 20>msg.length?20:msg.length;

            return msg.substring(0,maxLt)+ "...";
        }
        $scope.toggleContactPanel = function(){

            var ContactList = $('#ContactList').attr('class')
            var chat = $('#chatPanel').attr('class');
            var footer = $('#chat-footer').attr('class');
            function toggleHiddenClass(List, id){
                if(List.indexOf('hidden-xs')!=-1){
                    $('#'+id).removeClass('hidden-xs');
                }else {
                    $('#'+id).addClass('hidden-xs');
                }
            }

           toggleHiddenClass(ContactList, "ContactList");
            toggleHiddenClass(chat, "chatPanel");
            toggleHiddenClass(footer, "chat-footer");
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
            $scope.toggleContactPanel();

        };

        $scope.clickValue = false;
        $scope.appliedClass = function () {

        }
    }]);

    App.controller("Accounts", ['$scope', 'Auth', 'FileUploader', function ($scope, Auth, FileUploader) {

        $scope.radioModel = 'show';
        $scope.alertMsg = {view: 0};
        //*****************************************************************************************

        var uploader = $scope.uploader = new FileUploader({
            url: '/upload?operation=accounts'
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            $scope.alertMsg = {
                type: 'success',
                Msg: response.Message,
                view: 1
            }
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
            var errorMessage="Error while uploading file.";
            if(response.errorMessage){
                errorMessage = response.errorMessage;
            }
            $scope.alertMsg = {
                type: 'danger',
                Msg: errorMessage,
                view: 1
            }
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

        //*****************************************************************************************






        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        //$scope.UniformSize = $scope.userDetails.UniformsList;

        $scope.RoleRadioModel = 0;
        $scope.KitCost = 500;
        $scope.getAccounts = function () {
            Auth.getAccounts().success(function (AccRes) {
                $scope.Accounts = AccRes.accounts;
                $scope.UniformSize = AccRes.UniformsList;
            }).error(function (errRes) {
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
            return hours + ':' + minutes + ' ' + ampm + " " + dateStr + "/" + monthStr + '/' + yrStr;
        };
        $scope.AccountFilter = ['FRANCHISE', 'ADMIN'];
        $scope.AccFilterDef = $scope.AccountFilter[0];
        $scope.AccountDet = {};

        $scope.createAccount = function () {
            $scope.AccountDet.Role = $scope.AccountFilter[$scope.RoleRadioModel];
            if ($scope.RoleRadioModel) {
                $scope.AccountDet.FranchiseDetails = {};
                $scope.AccountDet.FranchiseDetails.UniformCosts = $scope.UniformSize;
                $scope.AccountDet.FranchiseDetails.KitCost = $scope.KitCost;
                for(var i =0;i<$scope.userDetails.FranchiseDetails.UniformCosts.length;i++){
                    if($scope.userDetails.FranchiseDetails.UniformCosts[i]==undefined){
                        $scope.alertMsg = {
                            type: 'danger',
                            Msg: "Set Uniform Costs for this Franchise",
                            view: 1
                        }
                        break;
                    }
                }
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
            }else{
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
            }



        };
        $scope.clearAlert = function () {
            $scope.alertMsg = {view: 0};
        };
        $scope.deleteConfirm = function(index){
            bootbox.dialog({
                message: "Are you sure ?",
                title: "Confirm Delete",
                buttons: {
                    main: {
                        label: "Cancel",
                        className: "btn-default",
                        callback: function() {
                            console.log("Modal Dismissed");
                        }
                    },
                    danger: {
                        label: "Delete",
                        className: "btn-danger",
                        callback: function() {
                            $scope.deleteAccount(index);
                        }
                    }

                }
            });
        }
        $scope.deleteAccount = function (Account) {
            Auth.deleteAccount(Account.FranchiseId).success(function (accRes) {
                $scope.alertMsg = {
                    type: 'success',
                    Msg: accRes.Message,
                    view: 1
                };
                $scope.AccountView = !$scope.AccountView;
                $scope.getAccounts();
            }).error(function (errRes) {
            })
        }
        $scope.getName = function(name){
            var index = 15>name.length?name.length:15;
            return name.substring(0,index);
        }
        $scope.AccountView = true;
        $scope.showAccount = function(item){
            $scope.AccountNumber = item;
            $scope.AccountView = !$scope.AccountView;
            //$scope.AccountNumber.index = index;
        }

    }]);

    App.controller("Downloads", ["$scope", "Auth", "Downloads", function ($scope, Auth, Downloads) {

        //$scope.kitOptions = ["PlayGroup", "Nursery", "LKG", "UKG"];
        $scope.StatusOptions = ["ALL","PENDING","DISPATCHED","COMPLETED"];
        $scope.StatusOption =$scope.StatusOptions[0];
        $scope.FranchiseNameList = [];
        $scope.FranchiseSelected = {};
        $scope.getKitOptions = function(){
            Downloads.getKitOptions().success(function(res, resStat){
                $scope.kitOptions = res;
                $scope.kitOption = $scope.kitOptions[0]
            }).error(function(errRes, errStat){
                $scope.kitOptions = ["PlayGroup", "Nursery", "LKG", "UKG"];
                $scope.kitOption = $scope.kitOption[0]
            })
        }
        $scope.getKitOptions();

        $scope.getFranchiseList = function () {
            Auth.getFranchiseList().success(function (AccRes) {
                $scope.FranchiseNameList = AccRes;
                //$scope.FranchiseNameList.splice(0, 0, {"FranchiseId": null, "FranchiseName": "None"});
                //$scope.FranchiseName = $scope.FranchiseNameList[0];
            }).error(function (errRes) {
            });


        };
        $scope.getFranchiseList();

        $scope.downloadObject = {};
        $scope.downloadObject.FranchiseId = this.FranchiseNameOb;
        $scope.onChangeSelected = function () {
            $scope.downloadObject.FranchiseId = this.FranchiseNameOb;
        }
        $scope.downloadType = ["Students", "Orders"];
        $scope.downloadFiles = function(type, TypeObject,Franchise,Status,Class){
            var queryString ='';
            if(type=="order"){
                queryString='/download/downloadFile?type=Orders&';
            }else if(type=="student"){
                queryString ='/download/downloadFile?type=Students&'
            }
            if(TypeObject.fromDate!=null && TypeObject.fromDate!=undefined){
                queryString += "fromDate="+TypeObject.fromDate+"&"
            }
            if(TypeObject.toDate!=null && TypeObject.toDate!=undefined){
                queryString += "toDate="+TypeObject.fromDate + "&"
            }
            if(Status!=null && Status!=undefined && Status!="ALL"){
                queryString += "status="+Status + "&"
            }
            if(Class!=null&&Class!=undefined){
                queryString +="KitId="+Class.KitId+'&';
            }
            if(Franchise!=undefined&&Franchise!=null){
                queryString +="FranchiseId=" + Franchise.FranchiseId;
            }
            window.open(queryString);


        }

        $scope.downloadFile = function () {
            $scope.downloadObject.type = this.type;
            Downloads.downloadFile($scope.downloadObject).success(function (downRes, downStatus) {

                var objectUrl = "/download/downloadFile?type=" + $scope.downloadObject.type;
                if ($scope.downloadObject.fromDate) {
                    objectUrl = objectUrl + "&fromDate=" + $scope.downloadObject.fromDate;
                }
                if ($scope.downloadObject.toDate) {
                    objectUrl = objectUrl + "&toDate=" + $scope.downloadObject.toDate;
                }
                if ($scope.downloadObject.FranchiseId) {
                    objectUrl = objectUrl + "&FranchiseId=" + $scope.downloadObject.FranchiseId;
                }
                window.open(objectUrl);
                //saveAs(blob, "SomeName.csv")
            }).error(function () {
            })
        }

    }]);

}());