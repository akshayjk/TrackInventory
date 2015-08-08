/**
 * Created by Akshay on 8/3/2015.
 */

var accounts = require('./Authentication.js');
var orders = require('./processOrders.js');
var requestData = require('../services/Util.js');

function BulkOperations(){

}

BulkOperations.prototype.findOperation = function(req, res, fileJSON){
    if(req.query.operation=="accounts"){
        new accounts().createBulkAccount(req, res, fileJSON)
    }else if(req.query.operation=="orders"){
        console.log("getting post body ")

            new orders().uploadBulkOrders(req, res, fileJSON);


    }else{
        res.status(404);
        res.setHeader("Content-Type", "application/json");
        var response={
            success:false,
            errorMessage:"Operation not supported."
        }
        res.send(JSON.stringify(response))
    }

}


module.exports = BulkOperations;