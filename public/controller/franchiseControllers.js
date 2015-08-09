(function () {

    "use strict";

    var App = angular.module("App.FranchiseControllers", []);

    App.controller("LogOutCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {

        $scope.FranchiseName = $scope.userDetails.FranchiseName;
        $scope.logOut = function () {
            delete sessionStorage.userDetails;
            $window.location.href = '/Login';
            //$location.path('/Login')
        }
    }]);

    App.controller("GeneralContent", ["$scope", function ($scope) {
        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        $scope.checkClick = function (id) {
            var MenuBar = ['MenuOrd', 'MenuPre', 'MenuQry', 'MenuUpload']
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

        $scope.getVisibleKits = function () {
            PlaceOrder.getVisibleKits().success(function (visibleKits, status) {
                $scope.ClassOptions = visibleKits;
                $scope.Class = $scope.ClassOptions[0];
            }).error(function (errKit, errStat) {
                console.log("err in getting Kits " + errKit)
            });
        };
        $scope.getVisibleKits();
        $scope.userDetails = JSON.parse(sessionStorage.userDetails);

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

        $scope.setUniformSizeFinal = function (Numb, UniformSize) {
            $scope.Students[Numb].UniformSize = UniformSize;
        };
        //$scope.ClassOptions = $scope.userDetails.FranchiseDetails.Kits//["PlayGroup", "Nursery", "LKG", "UKG"];

        $scope.PaymentOptions = [
            {"Name": "Cash", "Code": 101},
            {"Name": "Account Transfer", "Code": 102}
        ];
        $scope.Mode = $scope.PaymentOptions[0];
        $scope.CalculateHere = $scope.KitCost + $scope.UniformSize.UniformCost;
        $scope.TotalCost = $scope.KitCost + $scope.UniformSize.UniformCost;

        $scope.getFinalCost = function () {

            var FinalCost = 0;
            $scope.Students.forEach(function (student) {
                FinalCost += $scope.KitCost + student.UniformSize.cost * student.UniformQty;
            });
            $scope.TotalAmount = FinalCost;
            return FinalCost
        };
        $scope.setClass = function () {
            $scope.StudentObject.Class = $scope.Class;
            $scope.setTotalCost();
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
            $scope.StudentObject = {}
        };
        $scope.addMore = function () {

            if ($scope.Students.length > 0) {
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

                $scope.Students.push($scope.StudentObject);
            }

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
                } else {
                    $scope.makeOrder();
                }
            } else {
                $scope.makeOrder();
            }
        };

        $scope.makeOrder = function () {
            PlaceOrder.placeOrder($scope.OrderForm).success(function (poResponse, poStatus) {
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
                    $scope.formHide = false;
                    $scope.formButtons = true;
                    $scope.studentsTab = false;
                    $scope.paymentTab = true;
                }, function () {

                });


            }).error(function (poErResponse, poResStatus) {
                PlaceOrder.setModalMessage(poErResponse.errorMessage);
                PlaceOrder.setModalMessage("error in placing order");
                var modalInstance = $modal.open({
                    templateUrl: 'Modal.html',
                    controller: 'ModalInstanceCtrl'
                });
                modalInstance.result.then(function () {
                    $scope.formHide = false;
                    $scope.formButtons = true;
                }, function () {
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
        $scope.UniformCosts = $scope.userDetails.FranchiseDetails.UniformCosts;
        $scope.KitCost = $scope.userDetails.FranchiseDetails.KitCost;
        $scope.listView = [false, false];
        $scope.orderView = [true, true];

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

        $scope.getTotalAmount = function (students) {
            var amount = 0;
            if (students) {
                students.forEach(function (student) {
                    amount = amount + student.UniformSize.cost * student.UniformQty + $scope.KitCost;
                });
            }

            return amount;
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

    App.controller("uploadOrders", ["$scope", "FileUploader", function ($scope, FileUploader) {

        $scope.userDetails = JSON.parse(sessionStorage.userDetails);
        $scope.ErrorMessage =[];
        $scope.radioModel = 'show';
        $scope.alertMsg = {view: 0};
        $scope.clearAlert = function () {
            $scope.alertMsg = {view: 0};
            $scope.ErrorMessage =[];
        };
        //*****************************************************************************************

        var uploader = $scope.uploader = new FileUploader({
            url: '/upload?operation=orders&FranchiseId='+$scope.userDetails.FranchiseId+'&FranchiseName='+$scope.userDetails.FranchiseName,
            data:{FranchiseId:$scope.userDetails,FranchiseName:$scope.FranchiseName}
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
            //console.info('onSuccessItem', fileItem, response, status, headers);
            $scope.alertMsg = {
                type: 'success',
                Msg: response.Message,
                view: 1
            };
            $scope.ErrorMessage = response.ErrorObject;
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            //console.info('onErrorItem', fileItem, response, status, headers);
            var errorMessage="Error while uploading file.";
            if(response.errorMessage){
                errorMessage = response.errorMessage;
            }
            $scope.alertMsg = {
                type: 'danger',
                Msg: errorMessage,
                view: 1
            };
            $scope.ErrorMessage = response.ErrorObject;
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

        //console.info('uploader', uploader);

        //*****************************************************************************************

    }])


}());