/**
 * Created by Akshay on 18-04-2015.
 */

var dbLayer = require('./DbOperations.js');
var define = require('./Define.js');
function ProcessOrder() {

}

ProcessOrder.prototype.placeOrder = function (orderObject, req, res) {

    console.log("In order function")
    var orderId = generateOrderId(orderObject.FranchiseId);
    orderObject.OrderId = orderId;

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
    new dbLayer().insert(studentOptions, function (err, result) {
        if (!err) {
            console.log("Students inserted for order Id " + orderObject.OrderId);
            var StudentArray = [];
            for (var i = 0; i < Students.length; i++) {
                var tempObj = {};
                tempObj.NameOfStudent = Students[i].NameOfStudent;
                tempObj.RegistrationNumber = Students[i].RegistrationNumber;
                tempObj.UniformSize = Students[i].UniformSize;
                tempObj.UniformQty = Students[i].UniformQty;
                StudentArray.push(tempObj);
            }
            orderObject.Students = StudentArray;
            orderObject.Status = "ORDERED";
            console.log("Order Collection format " + JSON.stringify(orderObject));

            var OrderOptions = {
                collection: define.ordersCollection,
                insertObject: orderObject
            };

            new dbLayer().insert(OrderOptions, function (err, result) {
                if (!err) {
                    console.log("Order inserted for order ID " + orderObject.OrderId);
                    var response = {}
                    response.success = true;
                    response.orderId = orderObject.OrderId;
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

ProcessOrder.prototype.completeOrder = function (OrderId, Status, req, res) {

    if (Status.toLowerCase() == "completed" || Status.toLowerCase() == "dispatched") {
        var orderCompleteOption = {
            collection: define.ordersCollection,
            Query: {OrderId: OrderId},
            updateObject: {Status: Status.toUpperCase()}
        }
        new dbLayer().update(orderCompleteOption, function (err, result) {
            if (!err) {
                console.log("Success in update");
                var response ={};
                response.success = true;
                response.Status = Status;
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(response));
            }
        })
    } else {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({"success": false, "Message": "Status not supported"}));
    }

};

function generateOrderId(franchiseID) {

    var pre = franchiseID.substring(franchiseID.length - 3, franchiseID.length);
    var post = new Date().getTime().toString();
    return pre + post;
}


module.exports = ProcessOrder;