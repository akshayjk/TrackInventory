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
        if (!err&&data.length>0) {
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
        new dataBase().insert(options, function(err, insertData){
            if(!err){
                var response = {};
                response.success = true;
                response.Message = "Item added successfully.";
                new responseHandler().sendResponse(req, res, "success", response, 200);
            }else{
                new responseHandler().sendResponse(req, res, "error", "Error while adding new element in " + body.type, 500);
            }
        })
    } else {
        new responseHandler().sendResponse(req, res, "error", "Incorrect Parameters passed.", 403);
    }
}

Inventory.prototype.updateItem = function (req, res, body) {
    console.log("send Body " + JSON.stringify(body))
    if (body.ItemId!=undefined&&body.Name != undefined && body.Quantity != undefined && (body.Category.toUpperCase() == "BOOKS" || body.Category.toUpperCase() == "UNIFORMS" || body.Category.toUpperCase() == "COMMON")) {

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

Inventory.prototype.addKit = function(req, res, body){

    checkKitValidity(body, function(validKitBody){
        body.Category = "KIT";
        body.KitId = "KIT" + new Date().getTime().toString();
        var options ={
            collection:"INVENTORY",
            insertObject : body
        };

        new dataBase().insert(options, function(err, result){
            if(!err){
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

Inventory.prototype.getKits = function(req, res, body){

    var options ={
        collection:"INVENTORY",
        Query :{Category:"KIT"}
    }

    new dataBase().get(options, function(err, kitData){
        if(!err){

            new responseHandler().sendResponse(req, res, "success", kitData, 200);

        }else{
            new responseHandler().sendResponse(req, res, "error", "error while getting Kits.", 500);
        }
    })
}

Inventory.prototype.updateKit = function(req, res, body){


    if(body.KitId!=undefined){

        var options = {
            collection :'INVENTORY',
            Query :{KitId:body.KitId},
            updateObject :{Kit:body.Kit,Name:body.Name}
        };

        new dataBase().update(options, function(err, updateResult){
            if(!err){
                 /*var response={
                    success:true,
                    Message:"Kit updated successfully."
                };

                new responseHandler().sendResponse(req, res, "success", response, 200);*/
                new Inventory().getKits(req, res, body);

            }else{
                new responseHandler().sendResponse(req, res, "error", "error while updating Kits.", 500);
            }
        })


    }else{
        new responseHandler().sendResponse(req, res, "error", "Incorrect params", 403)
    }


}

Inventory.prototype.deleteKit = function(req, res, body){
    if(body.KitId!=undefined){
        var options = {
            collection:'INVENTORY',
            Query:{KitId:body.KitId}
        }
        new dataBase().delete(options,function(err, result){
            if(!err){
                var response = {};
                response.success = true;
                response.Message = "Kit deleted successfully.";
                new responseHandler().sendResponse(req, res, "success", response, 200);
            }
        })

    }else{
        new responseHandler().sendResponse(req, res, "error", "Incorrect Parameters passed.", 403);
    }
}

function checkKitValidity(kitBody, Callback){

    if(kitBody.Name!=undefined){
        for(var i=0; i<kitBody.Kit.length; i++){
            if(kitBody.Kit[i].ItemId==undefined || kitBody.Kit[i].Units==undefined){
                new responseHandler().sendResponse(req, res, "error", "Incorrect params", 403);
                break;
            }
        }
        Callback(kitBody);
    }else{
        new responseHandler().sendResponse(req, res, "error", "Incorrect params", 403)
    }
}



Inventory.prototype.getLogFile = function () {
    //gets the Log file for the Inventory operations
}

module.exports = Inventory;