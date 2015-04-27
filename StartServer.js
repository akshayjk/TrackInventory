/**
 * Created by 290494 on 8/20/2014.
 */

// Node Modules
var express = require('express'),
    app = express(),
    fs = require('fs');

//App Modules
var dataBase = require('./services/DbOperations.js');
var processOrder = require('./services/processOrders.js');

app.use(express.static(__dirname + '/public'));

app.get('/Login', function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.post('/LoginService', function (req, res) {
    console.log("received Login Request")
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {

        var cred = JSON.parse(body);
        if (cred.username == "admin" && cred.password == "admin") {
            var response = {
                "FranchiseName": "Admin",
                "FranchiseId": "SER6465465",
                "Role": "Admin"
            }
            res.status(200);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        } else if (cred.username == "abc") {
            var response = {
                "FranchiseName": "Franchise1",
                "FranchiseId": "SER6465466",
                "Role": "Franchise",
                "FranchiseDetails": {
                    "UniformCosts": {
                        "1": 10,
                        "2": 20,
                        "3": 30,
                        "4": 40,
                        "5": 50
                    },
                    "KitCost":500
                }

            };
            res.status(200);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        } else {
            var response = {
                "success": false,
                "errorMessage": "Invalid username or password"
            };
            res.status(403);
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        }
    });
})

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
            Query: {"FranchiseId": franchiseID}
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
        console.log("received body data " + body)
        body = JSON.parse(body);
        /*new processOrder().placeOrder(body, req, res);*/
        var response ={
            success : true,
            Message :"Order has been placed."
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.send(JSON.stringify(response));
    });
});

app.put('/Order', function (req, res) {
    console.log("Request received for order completion");
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        body = JSON.parse(body);
        var OrderId = req.query.orderId;
        var Status = body.Status;
        if (OrderId != undefined && Status != undefined) {
            new processOrder().completeOrder(OrderId, Status, req, res);
        } else {
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify({"success": false, "Message": "Missing Status or OrderID"}));
        }

    });
});

app.listen(3000);
