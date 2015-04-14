/**
 * Created by 290494 on 8/20/2014.
 */

// Node Modules
var express = require('express'),
app = express(),
fs = require('fs');
    mongoose = require('mongoose');
    

// Establishing one time database connection
mongoose.connect("mongodb://127.0.0.1:27017/WebSite");
var db = mongoose.connection,
dataSchema,
dataModel,
eventLogModel;

db.on("error", function (err) {
    winston.log("error", "DB connection error - " + err)
});

db.once("open", function () {
    var dataSchema = new mongoose.Schema({"name":String, "surname" :String, "company":String}, { strict: false });   
    
    dataModel = mongoose.model("TestCollection", dataSchema); 
    
});


app.post("/uploadLink", function (req, res){
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {

        var postData = body;
        postData = JSON.parse(postData);            

        var insertDataModel = new dataModel(postData);
        insertDataModel.save(function (err, insertResult) {
         if (err) {
             console.log("error", "Error occurred during OPSYS insertion - " + err);
         }
         else {
            console.log("Data Entered " + insertResult);
        }
        
    });
    });
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({"Message":"Success"}));
})

app.listen(3000);
