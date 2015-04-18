/**
 * Created by Akshay on 18-04-2015.
 */

var mongodb = require('mongodb')
    , MongoClient = mongodb.MongoClient,
    define = require('./Define.js');

var db;

MongoClient.connect(define.mongoUrl, function (err, database) {
    if (!err) {
        db = database;
    } else {
        console.log("error while connecting to db")
    }
});

function DBLayer() {

}

DBLayer.prototype.get = function (options, callback) {
    if (options.QuerySelect == undefined) {
        options.QuerySelect = {
            _id: 0
        }
    } else {
        options.QuerySelect._id = 0;
    }
    db.collection(options.collection).find(options.Query, options.QuerySelect).toArray(function (err, data) {
        if (err) {
            console.log("Error has occurred while querying " + JSON.stringify(options))
        }
        callback(err, data);
    });
}

DBLayer.prototype.insert = function (options, callback) {
    if (options.insertObject != undefined) {
        var dataToInsert = JSON.parse(JSON.stringify(options.insertObject));
        dataToInsert.CreateOn = new Date();
        dataToInsert.ModifiedOn = new Date();
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
                console.log("errr while updating " + err);
                callback(err, null)
            }
        })
    }
}

module.exports = DBLayer;