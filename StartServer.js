/**
 * Created by 290494 on 8/20/2014.
 */

// Node Modules
var express = require('express'),
    app = express(),
    fs = require('fs');

//App Modules
var dataBase = require('./DbOperations.js');
var processOrder = require('./processOrders.js');

app.get('/Order', function (req, res) {
    console.log("received get order")
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var franchiseID = req.query.franchiseID;
        var options = {
            collection: "orders",
            Query: {"FranchiseId":franchiseID}
        };

        new dataBase().get(options, function (err, data) {
            if (!err) {
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(data));
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify(err));
            }
        })
    });
});

app.post('/Order', function (req, res) {
    console.log("Order request received");
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        body = JSON.parse(body);
        new processOrder().placeOrder(body, req, res);
    });
});

app.put('/Order', function(req, res){
    console.log("Request received for order completion");
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        body = JSON.parse(body);
        var OrderId = req.query.orderId;
        var Status = body.Status;
        if(OrderId!=undefined && Status!=undefined){
            new processOrder().completeOrder(OrderId, Status, req, res);
        }else{
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({"success": false, "Message": "Missing Status or OrderID"}));
        }

    });
});

app.listen(3000);
