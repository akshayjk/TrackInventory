/**
 * Created by Akshay on 18-04-2015.
 */

var mongodb = require('mongodb')
    , MongoClient = mongodb.MongoClient,
    define = require('./Define.js');

var db;

function DBLayer() {

}

DBLayer.prototype.connect = function(){

    console.log("Connecting ...")
    MongoClient.connect(define.mongoUrl, function (err, database) {
        if (!err) {
            console.log("Connection successful");
            db = database;
        } else {
            console.log("error while connecting to db")
        }
    });

};


DBLayer.prototype.get = function (options, callback) {
    if (options.QuerySelect == undefined) {
        options.QuerySelect = {
            _id: 0
        }
    } else {
        options.QuerySelect._id = 0;
    }

    if(options.sortObject){
        if(!options.sortLimit){
            options.sortLimit = 20;
        }

        db.collection(options.collection).find(options.Query, options.QuerySelect).sort(options.sortObject).limit(options.sortLimit).toArray(function (err, data) {
            if (err) {
                console.log("error while querying " + JSON.stringify(options))
                callback(err, null);
            }else{
                callback(err, data);
            }

        });
    }else{
        db.collection(options.collection).find(options.Query, options.QuerySelect).toArray(function (err, data) {
            if (err) {
                console.log("error while querying " + JSON.stringify(options))
                callback(err, null);
            }else{
                callback(err, data);
            }

        });
    }


}

DBLayer.prototype.insert = function (options, callback) {
    if (options.insertObject != undefined) {
        var dataToInsert = JSON.parse(JSON.stringify(options.insertObject));
        var CreatedOn = new Date();
        var ModifiedOn = new Date();
        console.log(" type is array ? " + Array.isArray(dataToInsert))
        if(Array.isArray(dataToInsert)){
            console.log("here is array " + JSON.stringify(dataToInsert) );
            dataToInsert.forEach(function(dataObj){
                dataObj.CreatedOn = CreatedOn;
                dataObj.ModifiedOn = ModifiedOn;
            })
        }else{
            dataToInsert.CreatedOn = CreatedOn;
            dataToInsert.ModifiedOn = ModifiedOn;
        }

        db.collection(options.collection).insert(dataToInsert, {}, function (err, result) {
            console.log("result " + result)
        });
        callback(null, {"success": true})
    } else {
        console.log("Insert Object cant be empty")
        callback({"errorCode": 100}, null);
    }

}

DBLayer.prototype.update = function(options, callback){
    if(options.updateObject!=undefined){
        options.updateObject.ModifiedOn = new Date();
        db.collection(options.collection).updateOne(options.Query, {$set:options.updateObject}, function(err, result){
            if(!err){
                console.log("Updated order status " + result);
                callback(null, result);
            }else{
                console.log("error while updating " + err);
                callback(err, null)
            }
        })
    }
}

DBLayer.prototype.updateWithOperator = function(options, callback){
    if(options.updateObject!=undefined){
        db.collection(options.collection).updateOne(options.Query, options.updateObject, function(err, result){
            if(!err){
                console.log("Updated order status " + result);
                callback(null, result);
            }else{
                console.log("error while updating " + err);
                callback(err, null)
            }
        })
    }
}

DBLayer.prototype.delete = function(options, callback){

    db.collection(options.collection).remove(options.Query, function(err, result){
        if(!err){
            console.log("deleted result " + result);
            callback(null, result);
        }else{
            console.log("error while deleting " + err);
            callback(err, null)
        }
    });
}

module.exports = DBLayer;