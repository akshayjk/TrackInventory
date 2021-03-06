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
        Query: {Category: "BOOKS"}
    };

    new dataBase().get(options, function (err, data) {
        if (!err) {
            console.log(JSON.stringify(data))
            responseObject.Books = data;
            options.Query.Category = "UNIFORMS";
            new dataBase().get(options, function (err, uniData) {
                if (!err) {
                    console.log("uniforms " + JSON.stringify(uniData));
                    responseObject.Uniforms = uniData;
                    options.Query.Category = "COMMON";
                    new dataBase().get(options, function (err, comData) {
                        if (!err) {
                            console.log("common " + JSON.stringify(comData));
                            responseObject.Common = comData;
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
    console.log("body here " + JSON.stringify(body))

    if (body.Name != undefined && body.Quantity != undefined && (body.Category.toUpperCase() == "BOOKS" || body.Category.toUpperCase() == "UNIFORMS" || body.Category.toUpperCase() == "COMMON")) {
        body.Category = body.Category.toUpperCase();
        body.ItemId = body.Category + new Date().getTime().toString();
        var options = {
            collection: "INVENTORY",
            insertObject: body
        };
        console.log(JSON.stringify(body));
        new dataBase().insert(options, function (err, insertData) {
            if (!err) {
                var response = {};
                response.success = true;
                response.Message = "Item added successfully.";
                var options = {
                    collection: "INVENTORY",
                    Query: {ItemId: body.ItemId}
                }

                new dataBase().get(options, function (err, item) {
                    if (!err) {
                        response.Item = item;
                        new responseHandler().sendResponse(req, res, "success", response, 200);
                    } else {
                        new responseHandler().sendResponse(req, res, "error", "Error while adding new element in " + body.type, 500);
                    }
                })


            } else {
                new responseHandler().sendResponse(req, res, "error", "Error while adding new element in " + body.type, 500);
            }
        })
    } else {
        new responseHandler().sendResponse(req, res, "error", "Incorrect Parameters passed.", 403);
    }
}

Inventory.prototype.updateItem = function (req, res, body) {
    console.log("send Body " + JSON.stringify(body))
    if (body.ItemId != undefined && body.Name != undefined && body.Quantity != undefined && (body.Category.toUpperCase() == "BOOKS" || body.Category.toUpperCase() == "UNIFORMS" || body.Category.toUpperCase() == "COMMON")) {

        var options = {
            collection: "INVENTORY",
            Query: {ItemId: body.ItemId},
            updateObject: {Quantity: body.Quantity}
        };
        console.log("Here " + JSON.stringify(options))
        new dataBase().update(options, function (err, result) {
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
            Query: {ItemId: body[type].ItemId}
        };
        console.log(JSON.stringify(options))

        new dataBase().delete(options, function (err, result) {
            if (!err) {
                console.log(JSON.stringify(result));
                var response = {
                    success: true,
                    Message: "Item deleted successfully."
                };
                new responseHandler().sendResponse(req, res, "success", response, 200);
            } else {
                new responseHandler().sendResponse(req, res, "error", "error while removing item.", 500);
            }
        })

        /* new dataBase().updateWithOperator(options, function(err, result){
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
         })*/
    }
}

Inventory.prototype.addKit = function (req, res, body) {

    checkKitValidity(body, function (validKitBody) {
        body.Category = "KIT";
        body.KitId = "KIT" + new Date().getTime().toString();
        var options = {
            collection: "INVENTORY",
            insertObject: body
        };

        new dataBase().insert(options, function (err, result) {
            if (!err) {
                /*var response={
                 success:true,
                 Message:"Kit added successfully."
                 };
                 new responseHandler().sendResponse(req, res, "success", response, 200);*/
                new Inventory().getKits(req, res, body);
            }
        })

    })

}

Inventory.prototype.getKits = function (req, res, body) {

    var options = {
        collection: "INVENTORY",
        Query: {Category: "KIT"}
    }

    new dataBase().get(options, function (err, kitData) {
        if (!err) {
            var count = 0;
            getKitLimitValue(kitData, count, function (kitArray) {

                new responseHandler().sendResponse(req, res, "success", kitArray, 200);
            })
        } else {
            new responseHandler().sendResponse(req, res, "error", "error while getting Kits.", 500);
        }
    })
}

Inventory.prototype.updateKit = function (req, res, body) {


    if (body.KitId != undefined) {

        var options = {
            collection: 'INVENTORY',
            Query: {KitId: body.KitId},
            updateObject: {Kit: body.Kit, Name: body.Name}
        };

        new dataBase().update(options, function (err, updateResult) {
            if (!err) {
                /*var response={
                 success:true,
                 Message:"Kit updated successfully."
                 };

                 new responseHandler().sendResponse(req, res, "success", response, 200);*/
                new Inventory().getKits(req, res, body);

            } else {
                new responseHandler().sendResponse(req, res, "error", "error while updating Kits.", 500);
            }
        })


    } else {
        new responseHandler().sendResponse(req, res, "error", "Incorrect params", 403)
    }


}

Inventory.prototype.deleteKit = function (req, res, body) {
    if (body.KitId != undefined) {
        var options = {
            collection: 'INVENTORY',
            Query: {KitId: body.KitId}
        }
        new dataBase().delete(options, function (err, result) {
            if (!err) {
                var response = {};
                response.success = true;
                response.Message = "Kit deleted successfully.";
                new responseHandler().sendResponse(req, res, "success", response, 200);
            }
        })

    } else {
        new responseHandler().sendResponse(req, res, "error", "Incorrect Parameters passed.", 403);
    }
}

function checkKitValidity(kitBody, Callback) {

    if (kitBody.Name != undefined) {
        for (var i = 0; i < kitBody.Kit.length; i++) {
            if (kitBody.Kit[i].ItemId == undefined || kitBody.Kit[i].Units == undefined) {
                new responseHandler().sendResponse(req, res, "error", "Incorrect params", 403);
                break;
            }
        }
        Callback(kitBody);
    } else {
        new responseHandler().sendResponse(req, res, "error", "Incorrect params", 403)
    }
}

function getKitLimitValue(kitArr, count, callback) {
    if (count < kitArr.length) {
        var items = [];
        for (var i = 0; i < kitArr[count].Kit.length; i++) {
            items.push({ItemId: kitArr[count].Kit[i].ItemId});
        }
        //sorting the KIT
        function compare(a, b) {
            if (a.Name < b.Name)
                return -1;
            if (a.Name > b.Name)
                return 1;
            return 0;
        }

        kitArr[count].Kit = kitArr[count].Kit.sort(compare);
        console.log("sorted kit array " + JSON.stringify(kitArr[count].Kit))
        var options = {
            collection: "INVENTORY",
            Query: {$or: items},
            QuerySelect: {Quantity: 1, ItemId: 1, Name: 1, _id: 0},
            sortObject: {Name: 1}
        };
        var min = {};

        new dataBase().get(options, function (err, data) {
            console.log(" kit items " + JSON.stringify(data));
            if (!err) {
                kitArr[count].Limit = {};
                kitArr[count].Limit.Quantity = 0;
                kitArr[count].Limit.Name = '';

                var countLimit = 0;
                console.log("KIT here " + JSON.stringify(kitArr))
                addLimit(data, countLimit, count, kitArr, function () {
                    console.log("completed addlimit received Kit Array" + JSON.stringify(kitArr));
                    count++;
                    getKitLimitValue(kitArr, count, callback);
                })
            } else {
                new responseHandler().sendResponse(req, res, "error", "error while compiling Kit Data.", 500);
            }
        });

    } else {
        callback(kitArr);
    }
}

function addLimit(dataArr, countLimit, count, kitArr, callback) {
    console.log("in the add limit function " + JSON.stringify(kitArr[count].Limit))
    console.log("the data array item " + JSON.stringify(dataArr[countLimit]))
    console.log("the kit item " + JSON.stringify(kitArr[count].Kit[countLimit]))
    if (dataArr[countLimit] != undefined) {
        kitArr[count].Kit[countLimit].Quantity = dataArr[countLimit].Quantity;
    }
    if (countLimit == 0 && dataArr.length > 0) {
        kitArr[count].Limit.Quantity = Math.floor(dataArr[countLimit].Quantity / kitArr[count].Kit[countLimit].Units);
        kitArr[count].Limit.Name = dataArr[countLimit].Name;
    }
    if (countLimit < dataArr.length) {
        console.log("in the comparison function ")

        console.log("the calculations " + Math.floor(dataArr[countLimit].Quantity / kitArr[count].Kit[countLimit].Units) + " limit qty now " + kitArr[count].Limit.Quantity)
        if (Math.floor(dataArr[countLimit].Quantity / kitArr[count].Kit[countLimit].Units) < kitArr[count].Limit.Quantity) {
            console.log("received #################################################################")
            kitArr[count].Limit.Quantity = Math.floor(dataArr[countLimit].Quantity / kitArr[count].Kit[countLimit].Units);
            console.log("the name " + dataArr[countLimit].Name)
            kitArr[count].Limit.Name = dataArr[countLimit].Name;
            countLimit++;
            addLimit(dataArr, countLimit, count, kitArr, callback);
        } else {
            countLimit++;
            addLimit(dataArr, countLimit, count, kitArr, callback);
        }
    } else {
        console.log("hitting callback " + JSON.stringify(kitArr[count]));
        callback()
    }
}

Inventory.prototype.getVisibleKits = function (req, res, body) {
    var kitOptions = {
        collection: "INVENTORY",
        Query: {Category: "KIT", Tags: "Visible"},
        QuerySelect: {Name: 1, KitId: 1}
    }
    new dataBase().get(kitOptions, function (err, kitData) {
        if(!err){
            new responseHandler().sendResponse(req, res, "success", kitData, 200);
        }else{
            new responseHandler().sendResponse(req, res, "error", "error while compiling Kit Data.", 500);
        }

    })
}

Inventory.prototype.getLogFile = function () {
    //gets the Log file for the Inventory operations
}

module.exports = Inventory;