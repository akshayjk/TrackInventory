var dataBase = require('./DbOperations.js');
var define = require('./Define.js');
var responseHandler = require('./ResponseHandler.js')

function Inventory() {

}

Inventory.prototype.getStatus = function (req, res, body) {
    //Gets the Current Status of the Inventory
    var responseObject = {};
    var options = {
        collection: "INVENTORY",
        Query: {Category: "BOOKS"},
        QuerySelect: {ItemArray: 1}
    };

    new dataBase().get(options, function (err, data) {
        if (!err) {
            console.log(JSON.stringify(data))
            responseObject.Books = data[0].ItemArray;
            options.Query.Category = "UNIFORMS";
            new dataBase().get(options, function (err, uniData) {
                if (!err) {
                    console.log("uniforms " + JSON.stringify(uniData));
                    responseObject.Uniforms = uniData[0].ItemArray;
                    options.Query.Category = "COMMON";
                    new dataBase().get(options, function (err, comData) {
                        if (!err) {
                            console.log("common " + JSON.stringify(comData));
                            responseObject.Common = comData[0].ItemArray;
                            new responseHandler().sendResponse(req, res, "success", responseObject, 200);
                        } else {
                            new responseHandler().sendResponse(req, res, "error", "Error while fetching common data.", 500);
                        }
                    })
                } else {
                    new responseHandler().sendResponse(req, res, "error", "Error while fetching Uniforms' data.", 500);
                }
            })

        } else {
            new responseHandler().sendResponse(req, res, "error", "Error while fetching books.", 500);
        }
    })
};

Inventory.prototype.addItem = function (req, res, body) {
    //adds items to current Inventory
    var type = Object.keys(body)[0];
    if (type != undefined && body[type].Name != undefined && body[type].Quantity != undefined && (type.toUpperCase() == "BOOKS" || type.toUpperCase() == "UNIFORMS" || type.toUpperCase() == "COMMON")) {

        var options = {
            collection: "INVENTORY",
            Query: {Category: type.toUpperCase()},
            updateObject: {$addToSet: {ItemArray: body[type]}}
        };
        new dataBase().updateWithOperator(options, function (err, result) {
            if (!err) {
                var stat = JSON.parse(JSON.stringify(result)).nModified;
                if(stat==0){
                    var response = {};
                    response.success = false;
                    response.Message = "Item already exists";
                    new responseHandler().sendResponse(req, res, "success", response, 403)
                }else{
                    var response = {};
                    response.success = true;
                    response.Message = "Item added successfully.";
                    new responseHandler().sendResponse(req, res, "success", response, 200);
                }

            } else {
                new responseHandler().sendResponse(req, res, "error", "Error while adding new element in " + body.type, 500);
            }
        })
    } else {
        new responseHandler().sendResponse(req, res, "error", "Incorrect Parameters passed.", 403);
    }
}

Inventory.prototype.updateItem = function (req, res, body) {
    //Updates the Inventory
    //
    var type = Object.keys(body)[0]
    if (type != undefined && body[type].Name != undefined && body[type].Quantity != undefined && (type.toUpperCase() == "BOOKS" || type.toUpperCase() == "UNIFORMS" || type.toUpperCase() == "COMMON")) {
        var options = {
            collection: "INVENTORY",
            Query: {Category: type.toUpperCase(), "ItemArray.Name": body[type].Name},
            updateObject: {$set:{"ItemArray.$.Quantity": body[type].Quantity}}
        };

        new dataBase().updateWithOperator(options, function (err, result) {
            if (!err) {
                console.log(JSON.stringify(result));
                new Inventory().getStatus(req, res, body);
            } else {
                console.log("error while updating inventory data " + err);
                new responseHandler().sendResponse(req, res, "error", "error while updating inventory data.", 500)
            }
        })
    } else {
        new responseHandler().sendResponse(req, res, "error", "Incorrect Parameters passed.", 403);

    }

//body[type].Name
}

Inventory.prototype.deleteItem = function (req, res, body) {
    //deletes the item
    var type = Object.keys(body)[0];
    console.log("type " + type)
    if (type != undefined && body[type].Name != undefined && body[type].Quantity != undefined && (type.toUpperCase() == "BOOKS" || type.toUpperCase() == "UNIFORMS" || type.toUpperCase() == "COMMON")) {
        var options = {
            collection: "INVENTORY",
            Query: {Category: type.toUpperCase()},
            updateObject:{$pull:{ItemArray:{"Name":body[type].Name}}}
        };
        console.log(JSON.stringify(options))
        new dataBase().updateWithOperator(options, function(err, result){
            if(!err){
                console.log(JSON.stringify(result));
                var response={
                    success:true,
                    Message:"Item deleted successfully."
                };
                new responseHandler().sendResponse(req, res, "success", response, 200);
            }else{
                new responseHandler().sendResponse(req, res, "error", "error while removing item.", 500);
            }
        })
    }
}

Inventory.prototype.getLogFile = function () {
    //gets the Log file for the Inventory operations
}

module.exports = Inventory;