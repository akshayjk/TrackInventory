/**
 * Created by Akshay on 18-04-2015.
 */

var dataBase = require('./DbOperations.js');
var define = require('./Define.js');
var responseHandler = require('./ResponseHandler.js');
var sendMail = require('./SendEmail.js');


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
                Kits: {},
                UniformSize: {}
            }


            for (var i = 0; i < Students.length; i++) {
                var tempObj = {};
                tempObj.NameOfStudent = Students[i].NameOfStudent;
                tempObj.RegistrationNumber = Students[i].RegistrationNumber;
                tempObj.UniformSize = Students[i].UniformSize;
                tempObj.UniformQty = Students[i].UniformQty;
                tempObj.Class = Students[i].Class;
                if (Summary.Kits[Students[i].Class.KitId] == undefined) {
                    Summary.Kits[Students[i].Class.KitId] = Students[i].Class;
                    Summary.Kits[Students[i].Class.KitId].Quantity = 1;
                } else {
                    Summary.Kits[Students[i].Class.KitId].Quantity++;
                }

                if (Summary.UniformSize[Students[i].UniformSize.ItemId] == undefined) {
                    Summary.UniformSize[Students[i].UniformSize.ItemId] = Students[i].UniformSize;
                    Summary.UniformSize[Students[i].UniformSize.ItemId].Quantity = 1;
                } else {
                    Summary.UniformSize[Students[i].UniformSize.ItemId].Quantity++;
                }
                /*Summary.Kits[Students[i].Class]++;
                 Summary.Uniforms[Students[i].UniformSize.UniformSize]++;*/
                StudentArray.push(tempObj);
            }
            orderObject.Students = StudentArray;
            orderObject.Status = "PENDING";
            //orderObject.Summary = Summary;
            var kitLength = Object.keys(Summary.Kits);
            var tempArray = [];
            kitLength.forEach(function (kit) {
                tempArray.push(Summary.Kits[kit]);
            });
            Summary.Kits = tempArray;
            tempArray = []
            var UniformLength = Object.keys(Summary.UniformSize);
            UniformLength.forEach(function (uniform) {
                tempArray.push(Summary.UniformSize[uniform]);
            })
            Summary.UniformSize = tempArray;
            tempArray = [];
            console.log("Final Summary thing " + JSON.stringify(Summary));
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
        switch (Status.toLowerCase()) {
            case "dispatched":
                new ProcessOrder().dispatchOrder(req, res, body);
                break;
            case "completed":
                completeOrder(req, res);
                break;
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


ProcessOrder.prototype.dispatchOrder = function (req, res, body, OrderId) {
    var OrderId = req.query.OrderId;
    var options = {
        collection: "orders",
        Query: {OrderId: OrderId},
        QuerySelect: {Summary: 1}
    }
    new dataBase().get(options, function (err, order) {
        //what items need to be reduced
        if(!err&&order.length>0){
            console.log("the order to be changed " + JSON.stringify(order));
            new dataBase().bulkInsert({collection: "INVENTORY"}, function (bulkInsert) {
                reduceKitItems(req, res, 0, order[0].Summary, bulkInsert, function(req, res, Summary, bulkInsert){
                    reduceUniforms(req, res, Summary, bulkInsert, function(){
                        //Done correctly
                        //Send confirmation emails
                        sendConfirmationMails(OrderId);
                        res.setHeader("Content-Type", "application/json");
                        res.send(JSON.stringify({"success": true, "Message": "Order dispatched successfully"}));
                    });
                });
            });
        }else{
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({"success": true, "Message": "No such order found"}));
        }
    })

}

function mapArrayToObject(Arr,objKey){
    var mappedKitItems = {}
    for (var i = 0; i < Arr.length; i++) {
        var ArrEle = Arr[i];
        var key = ArrEle[objKey];
        //items.push(kitItem.ItemId)
        mappedKitItems[key] = ArrEle;
    }
    return mappedKitItems;
}

function reduceKitItems(req, res, count, Summary, bulkInsert, callback) {
    console.log(" count " + count +" here in the reduce Inventory Items " + JSON.stringify(Summary) )
    if(count<Summary.Kits.length){
        var options = {
            collection: 'INVENTORY',
            Query: {KitId: Summary.Kits[count].KitId,Category:"KIT"},
            QuerySelect: {Kit: 1}
        };
        var items = [];
        console.log("options for the Innvetory " + JSON.stringify(options))
        new dataBase().get(options, function (err, data) {
            if (!err) {
                console.log("data here " + JSON.stringify(data) + "Another kit thinng ");

                var mappedKitItems = {}
                for (var i = 0; i < data[0].Kit.length; i++) {
                    var kitItem = data[0].Kit[i];
                    var kitItemId = kitItem.ItemId;
                    console.log(kitItem.ItemId + " detect null "  + JSON.stringify(kitItem))
                    items.push(kitItem.ItemId)
                    mappedKitItems[kitItemId] = kitItem;
                }
                console.log("at the end " + JSON.stringify(items))

                var options = {
                    collection: 'INVENTORY',
                    Query: {ItemId: {$in: items}},
                    QuerySelect: {ItemId: 1, Quantity: 1}
                }
                console.log("option with items " + JSON.stringify(options))
                new dataBase().get(options, function (err, itemData) {
                    var mappedObj = {}
                    for (var i = 0; i < itemData.length; i++) {
                        var item = itemData[i];
                        var ItemId = item.ItemId;
                        mappedObj[ItemId] = item;
                    }
                    console.log("mapped obj " + JSON.stringify(mappedObj));
                    console.log("mapped Kit Items " + JSON.stringify(mappedKitItems));
                    console.log("the kit being operated " + JSON.stringify(Summary.Kits[count]));
                    for (var j = 0; j < itemData.length; j++) {
                     var modifiedQuantity = mappedObj[itemData[j].ItemId].Quantity - mappedKitItems[itemData[j].ItemId].Units * Summary.Kits[count].Quantity;
                     bulkInsert.find({ItemId: itemData[j].ItemId}).upsert().updateOne({$set: {Quantity: modifiedQuantity}});
                     }
                    count++;
                    reduceKitItems(req, res, count,Summary,bulkInsert);
                })

                /*res.setHeader("Content-Type", "application/json");
                 res.send(JSON.stringify({"success": true, "Message": "Something happened"}));*/
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify({"success": true, "Message": "Something Not happened"}));
            }
        })

    }else{
        //Kits are ended
        console.log("process compleye and ");
        bulkInsert.execute(function (err, result) {
            if (err) {
                console.log("error while bulk Insert")
            } else {
                console.log("bulkInsert successful");
                console.log("nInserted " + result.nInserted);
                console.log("nUpserted " + result.nUpserted);
                console.log("nMatched " + result.nMatched);
                console.log("nModified " + result.nModified);

                console.log("proceeding for the Uniforms reduction ")
                new dataBase().bulkInsert({collection: "INVENTORY"}, function (bulkInsert) {
                    reduceUniforms(req, res, Summary, bulkInsert);
                });
            }
        });

    }




}

function reduceUniforms(req, res, Summary, bulkInsert, callback){

    var items =[]
    for(var i =0;i<Summary.UniformSize.length;i++){
        items.push(Summary.UniformSize[i].ItemId);
    }
    var mappedOrderObj = mapArrayToObject(Summary.UniformSize,"ItemId")
    var options = {
        collection: 'INVENTORY',
        Query: {ItemId: {$in: items}},
        QuerySelect: {ItemId: 1, Quantity: 1}
    }
    console.log("options in uniforms " + JSON.stringify(options))
    new dataBase().get(options, function(err, data){
        if(!err){
            console.log("here the uniforms " + JSON.stringify(data))
            var mappedDbObj = mapArrayToObject(data,"ItemId");
            console.log("mapped req, order obj " + JSON.stringify(mappedOrderObj));
            console.log("mapped db obj " + JSON.stringify(mappedDbObj))

            for (var j = 0; j < data.length; j++) {
                if(j==data.length-1){
                    var modifiedQuantity = mappedDbObj[data[j].ItemId].Quantity - mappedOrderObj[data[j].ItemId].Quantity;
                    bulkInsert.find({ItemId: data[j].ItemId}).upsert().updateOne({$set: {Quantity: modifiedQuantity}});
                    bulkInsert.execute(function (err, result) {
                        if (err) {
                            console.log("error while bulk Insert")
                        } else {
                            console.log("bulkInsert successful");
                            console.log("nInserted " + result.nInserted);
                            console.log("nUpserted " + result.nUpserted);
                            console.log("nMatched " + result.nMatched);
                            console.log("nModified " + result.nModified);

                            console.log("proceeding for the Uniforms reduction ");
                            callback();
                            /*res.setHeader("Content-Type", "application/json");
                            res.send(JSON.stringify({"success": true, "Message": "done correctly"}));*/
                        }
                    });
                }else{
                    var theObj = mappedOrderObj[data[j].ItemId];
                    console.log("the obj " + JSON.stringify(theObj) + Object.keys(theObj));
                    console.log("here " +data[j].ItemId + " mapped orde " + JSON.stringify(mappedOrderObj[data[j].ItemId]) +" the quant "+ mappedOrderObj[data[j].ItemId].Quantity)
                    console.log("before reducing " + mappedDbObj[data[j].ItemId].Quantity + " and " + mappedOrderObj[data[j].ItemId].Quantity);
                    var modifiedQuantity = (mappedDbObj[data[j].ItemId].Quantity - mappedOrderObj[data[j].ItemId].Quantity);
                    bulkInsert.find({ItemId: data[j].ItemId}).upsert().updateOne({$set: {Quantity: modifiedQuantity}});
                }


            }

        }
    })


}

function generateOrderId(franchiseID) {

    var pre = franchiseID.substring(0, 3).toUpperCase();
    var post = new Date().getTime().toString();
    return pre + post;
}

function sendConfirmationMails(OrderId){

    var options ={
        collection :"students",
        Query :{OrderId :OrderId},
        QuerySelect :{}
    }
}



module.exports = ProcessOrder;