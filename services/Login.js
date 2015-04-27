/**
 * Created by Akshay on 27-04-2015.
 */


//Application Modules
var responseHandler = require('./ResponseHandler.js')

function Authentication(){

}

Authentication.prototype.login = function(req, res, body){
    // Validates the credentials and responds back with necessary information
    if (body.username == "admin" && body.password == "admin") {
        var response = {
            "FranchiseName": "Admin",
            "FranchiseId": "SER6465465",
            "Role": "Admin"
        };
        new responseHandler().sendResponse(req, res, response, 200);
    } else if (body.username == "abc") {
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
        new responseHandler().sendResponse(req, res, response, 200);
    } else {
        var response = {
            "success": false,
            "errorMessage": "Invalid username or password"
        };
        new responseHandler().sendResponse(req, res, response, 403);
    }
};

module.exports = Authentication;