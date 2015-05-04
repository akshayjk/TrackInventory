//Downloads

var fs = require('fs');
var json2csv = require('json2csv');
var path = require('path');


var responseHandler = require('./ResponseHandler.js');
var dataBase = require('./DbOperations.js');

function Downloads() {

}

Downloads.prototype.downloadFile = function (req, res, body) {
    //Fetches data from DB depending on the filters and converts into csv file and sends to client
    var ObjectStructure = {
        filters: [
            {
                Filter: "Date",
                from: "",
                to: ""
            },
            {
                Filter: "Franchise",
                FranchiseId: "Franchise1"
            }
        ],
        type: "student"
    }
    //Analyse Download type
    //Can be Students, Orders Or can be Inventory log File
    getCollection(req, res, body, function (options) {
        addFilters(req, res, body, function (Query) {
            options.Query = Query;
            console.log("options " + JSON.stringify(options));

            new dataBase().get(options, function (err, data) {
                if (!err) {
                    if (data.length > 0) {
                        var dataKeys = Object.keys(data[0]);
                        for(var i=0;i<dataKeys.length;i++){

                            console.log("datakey " + dataKeys[i] + " type ")
                            if(typeof(data[0][dataKeys[i]])=="object"){
                                console.log("removing " + dataKeys[i]);
                                dataKeys.splice(i,1);
                            }
                        }
                        json2csv({data: data, fields: dataKeys}, function (err, csv) {
                            if (!err) {
                                console.log("data was converted successfully.");
                                console.log("current directory " + __dirname);
                                var dir = __dirname;

                                fs.exists('./Downloads', function (exists) {
                                    console.log("directory exists");
                                    if (exists) {
                                        var dateObj = new Date();
                                        var hours = dateObj.getHours();
                                        var minutes = dateObj.getMinutes();
                                        var ampm = hours >= 12 ? 'pm' : 'am';
                                        hours = hours % 12;
                                        hours = hours ? hours : 12; // the hour '0' should be '12'
                                        var date = dateObj.getDate().toString() +'-' +dateObj.getMonth().toString() + '-'+ dateObj.getFullYear().toString()+"_" +hours +'_' + minutes+"_" +ampm;


                                        console.log(__dirname);
                                        console.log(" name " + req.query.type + "_" + date + '.csv')
                                        fs.writeFile(path.join(__dirname, '/Downloads/' + req.query.type + "_" + date + '.csv'), csv, function (err) {
                                            if (err) {
                                                console.log("error", err);
                                                new responseHandler().sendResponse(req, res, "error", "error occurred while creating the document. Please try after some time.", 500);
                                            } else {
                                                console.log("info", "File generated successfully. " + req.query.type + "_" + date + '.csv')
                                                res.download(path.join(__dirname, "/Downloads/" +req.query.type + "_" + date + '.csv'));
                                            }
                                        });
                                    } else {
                                        console.log("folder doesnt exist")
                                        console.log(path.join(__dirname+ "/Downloads"));
                                        fs.mkdir(path.join(__dirname + "/Downloads"), function (err) {
                                            var dateObj = new Date();
                                            var hours = dateObj.getHours();
                                            var minutes = dateObj.getMinutes();
                                            var ampm = hours >= 12 ? 'pm' : 'am';
                                            hours = hours % 12;
                                            hours = hours ? hours : 12; // the hour '0' should be '12'
                                            var date = dateObj.getDate().toString() +'-' +dateObj.getMonth().toString() + '-'+ dateObj.getFullYear().toString()+"_" +hours +'_' + minutes+"_" +ampm;

                                            console.log("writing into " + path.join(__dirname + '/Downloads') +'/' + req.query.type + "_" + date + '.csv');
                                            fs.writeFile(path.join(__dirname,'/Downloads/' + req.query.type + "_" + date + '.csv'), csv, function (err) {
                                                if (err) {
                                                    console.log("error", err);
                                                    new responseHandler().sendResponse(req, res, "error", "error occurred while creating the document. Please try after some time.", 500);
                                                } else {
                                                    console.log("info", "File generated successfully. " + req.query.type + "_" + date + '.csv')
                                                    res.download(path.join(__dirname, "/Downloads/" + req.query.type+ "_" + date + '.csv'));
                                                }
                                            });
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        new responseHandler().sendResponse(req, res, "error", "No data found for given type.")
                    }
                } else {
                    new responseHandler().sendResponse(req, res, "error", "Error occurred while querying Database " + JSON.stringify(err), 500)
                }
            })
        })
    })

    //Analyze Filters
    function getCollection(req, res, body, callback) {
        console.log(JSON.stringify(body));
        console.log("query params"+  JSON.stringify(req.query));
        if (req.query.type != undefined && (req.query.type.toUpperCase() == "STUDENTS" || req.query.type.toUpperCase() == "ORDERS")) {
            var options = {};
            switch (req.query.type.toUpperCase()) {
                case "STUDENTS":
                    options.collection = "students";
                    callback(options);
                    break;
                case "ORDERS":
                    options.collection = "orders";
                    callback(options);
                    break;
                default :
                    console.log("No Collection was chosen");
                    new responseHandler().sendResponse(req, res, "error", "download type can't be empty.", 403);
            }
        } else {
            new responseHandler().sendResponse(req, res, "error", "download type is not recognized", 403);
        }
    }

    function addFilters(req, res, body, callback) {
        var Query = {};
        var frm = new Date(req.query.fromDate);
        var to = new Date(req.query.toDate);
        console.log("frm " + JSON.stringify(frm) + " to " + JSON.stringify(to));
        if (frm &&frm != "Invalid Date") {
            Query.ModifiedOn = {
                $gte: frm
            }
        } else if (to&&to != "Invalid Date") {
            Query.ModifiedOn = {
                $lte: to
            }
        }

        if(req.query.FranchiseId!=undefined){
            Query.FranchiseId=req.query.FranchiseId;
        }
        callback(Query);
    }


};

module.exports = Downloads;
