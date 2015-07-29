/**
 * Created by Akshay on 18-04-2015.
 */

var dataBase = require('./DbOperations.js');
var define = require('./Define.js');
var responseHandler = require('./ResponseHandler.js')


function ProcessOrder() {

}

ProcessOrder.prototype.getOrders = function (req, res, body) {
    //Fetches Orders
    console.log("request for get Orders");

    var query;
    var franchiseID = req.query.FranchiseId;
    if (!franchiseID) {
        query = {Status: "PENDING"};
    } else {
        query = {"FranchiseId": franchiseID, "Status": "PENDING"}
    }
    var options = {
        collection: "orders",
        Query: query,
        sortObject: {ModifiedOn: -1}
    };
    //todo put the date params for the recent order fetch
    var responseObject = {};
    new dataBase().get(options, function (err, dataPending) {
        if (!err) {
            responseObject.pending = dataPending;
            console.log("responseObject pending " + JSON.stringify(responseObject));
            options.Query.Status = "DISPATCHED";
            new dataBase().get(options, function (err, dataDispatched) {
                if (!err) {
                    responseObject.dispatched = dataDispatched;
                    console.log("response Objetc dispatched " + JSON.stringify(responseObject))
                    options.Query.Status = "COMPLETED";
                    new dataBase().get(options, function (err, dataCompleted) {
                        if (!err) {
                            responseObject.completed = dataCompleted;
                            console.log("response Objetc completed " + JSON.stringify(responseObject))
                            new responseHandler().sendResponse(req, res, "success", responseObject, 200);
                        } else {
                            new responseHandler().sendResponse(req, res, "error", err, 500);
                        }
                    })
                } else {
                    new responseHandler().sendResponse(req, res, "error", err, 500);
                }
            });

        } else {
            new responseHandler().sendResponse(req, res, "error", err, 500);
        }
    })
}

ProcessOrder.prototype.placeOrder = function (req, res, orderObject) {

    console.log("In order function");
    console.log("Initial Check");
    /*orderObject.Students.forEach(function(stud){
     if((!stud.NameOfStudent || stud.NameOfStudent=="" || stud.NameOfStudent==null)||(!stud.Age || stud.Age=="" || stud.Age==null)||(!stud.Age || stud.Age=="" || stud.Age==null)){

     }
     })*/

    var orderId = generateOrderId(orderObject.FranchiseId);
    orderObject.OrderId = orderId;
    console.log("Order received " + JSON.stringify(orderObject))
    //Update students collection
    var Students = orderObject.Students;
    Students.forEach(function (kid) {
        kid.OrderId = orderId;
        kid.FranchiseId = orderObject.FranchiseId;
        kid.FranchiseName = orderObject.FranchiseName;
    })
    var studentOptions = {
        collection: define.studentsCollection,
        insertObject: Students
    };
    new dataBase().insert(studentOptions, function (err, result) {
        if (!err) {
            console.log("Students inserted for order Id " + orderObject.OrderId);
            var StudentArray = [];
            var Summary = {
                Kits: {
                    "PlayGroup": 0,
                    "Nursery": 0,
                    "UKG": 0,
                    "LKG": 0
                },
                Uniforms: {
                    "2": 0,
                    "3": 0,
                    "5": 0,
                    "7": 0
                }
            };
            for (var i = 0; i < Students.length; i++) {
                var tempObj = {};
                tempObj.NameOfStudent = Students[i].NameOfStudent;
                tempObj.RegistrationNumber = Students[i].RegistrationNumber;
                tempObj.UniformSize = Students[i].UniformSize;
                tempObj.UniformQty = Students[i].UniformQty;
                tempObj.Class = Students[i].Class;
                Summary.Kits[Students[i].Class]++;
                Summary.Uniforms[Students[i].UniformSize.UniformSize]++;
                StudentArray.push(tempObj);
            }
            orderObject.Students = StudentArray;
            orderObject.Status = "PENDING";
            orderObject.Summary = Summary;
            console.log("Order Collection format " + JSON.stringify(orderObject));

            var OrderOptions = {
                collection: define.ordersCollection,
                insertObject: orderObject
            };

            new dataBase().insert(OrderOptions, function (err, result) {
                if (!err) {
                    console.log("Order inserted for order ID " + orderObject.OrderId);
                    //todo Inventory database manipulation based on the Orders
                    //todo Send Emails to the Parents of all Students

                    var response = {};
                    response.success = true;
                    response.orderId = orderObject.OrderId;
                    response.Message = "Order Successfully placed. Order Id is " + orderObject.OrderId;
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(response));
                } else {
                    console.log("error while inserting Order data " + err);
                    res.setHeader("Content-Type", "application/json");
                    res.send(JSON.stringify(err));
                }
            })
        } else {
            console.log("error while inserting Students data " + err);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(err));
        }
    })
    console.log("Student collection format " + JSON.stringify(studentOptions));

};

ProcessOrder.prototype.changeOrderStatus = function (req, res, body) {
    var Status = body.Status;
    console.log("body " + JSON.stringify(body))
    //todo order Id validation
    //todo order cycle validation
    if (Status.toLowerCase() == "completed" || Status.toLowerCase() == "dispatched") {
        switch (status.toLowerCase()) {
            case "dispatched":
                dispatchOrder(req, res, body);
                break;
            case "completed":
                completeOrder(req, res);

        }


    } else {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({"success": false, "Message": "Status not supported"}));
    }

};

function completeOrder(req, res) {
    var OrderId = req.query.OrderId;
    var orderCompleteOption = {
        collection: define.ordersCollection,
        Query: {OrderId: OrderId},
        updateObject: {Status: "COMPLETED"}
    };
    new dataBase().update(orderCompleteOption, function (err, result) {
        if (!err) {
            console.log("Success in update");
            var response = {};
            response.success = true;
            response.Status = "COMPLETED";
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        }
    })
}


function dispatchOrder(req, res, body, OrderId) {
    var OrderId = req.query.OrderId;
    var options = {
        collection: "orders",
        Query: {OrderId: OrderId},
        QuerySelect:{Summary:1}
    }
    new dataBase().get(options, function (err, order) {
        //what kits need to be reduced
    })
    new dataBase().bulkInsert(options, function (bulkInsert) {
        bulkInsert.find({"PACKAGE TRACKING NUMBER": packageTrackingNumber, "STATUS": {$ne: "DELIVERED"}}).upsert().updateOne(insertionData);
    })
}

function ReduceKitItems(kitId, kitNumbers, bulkInsert) {
    var options = {
        collection: 'INVENTORY',
        Query: {KitId: kitId},
        QuerySelect: {Kit: 1}
    };
    var items = [];

    new dataBase().get(options, function (err, data) {
        if (!err) {

            var mappedKitItems = {}
            for (var i = 0; i < data[0].Kit.length; i++) {
                var kitItem = data[0].Kit[i];
                var kitItemId = kitItem.ItemId;
                mappedKitItems[kitItemId] = kitItem;
            }

            data.forEach(function (arrEle) {
                items.push(arrEle.ItemId);
            })

            var options = {
                collection: 'INVENTORY',
                Query: {ItemId: {$in: items}},
                QuerySelect: {ItemId: 1, Quantity: 1}
            }

            new dataBase().get(options, function (err, itemData) {
                var mappedObj = {}
                for (var i = 0; i < itemData.length; i++) {
                    var item = itemData[i];
                    var ItemId = item.ItemId;
                    mappedObj[ItemId] = item;
                }
                for (var j = 0; j < itemData.length; j++) {
                    var modifiedQuantity = mappedObj[itemData[j].ItemId].Quantity - mappedKitItems[itemData[j].ItemId].Units * kitNumbers;
                    bulkInsert.find({ItemId: itemData[j].ItemId}).upsert().updateOne({$set: {Quantity: modifiedQuantity}});
                }

            })
        } else {

        }
    })
}

function generateOrderId(franchiseID) {

    var pre = franchiseID.substring(0, 3).toUpperCase();
    var post = new Date().getTime().toString();
    return pre + post;
}


module.exports = ProcessOrder;