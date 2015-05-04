/**
 * Created by Akshay on 27-04-2015.
 */


//Application Modules
var responseHandler = require('./ResponseHandler.js');
var dataBase = require('./DbOperations.js');

function Authentication() {

}

Authentication.prototype.login = function (req, res, body) {
    // Validates the credentials and responds back with necessary information
    if (body.username != undefined && body.password != undefined) {

        var options = {
            collection: "AUTH",
            Query: {FranchiseId: body.username, Password: body.password},
            QuerySelect: {CreatedOn: 0, Password: 0, ModifiedOn: 0}
        };
        new dataBase().get(options, function (err, data) {
            console.log("Login data " + JSON.stringify(data));
            if (!err) {
                if (data.length > 0) {

                    if (data[0].Role == "ADMIN") {
                        new responseHandler().sendResponse(req, res, "success", data[0], 200);
                    } else {
                        //Get the Franchise Data
                        var options = {
                            collection: "USER",
                            Query: {FranchiseId: data[0].FranchiseId},
                            QuerySelect: {CreatedOn: 0, ModifiedOn: 0}
                        };
                        new dataBase().get(options, function (err, FranchiseData) {
                            if (!err) {
                                new responseHandler().sendResponse(req, res, "success", FranchiseData[0], 200);
                            } else {
                                new responseHandler().sendResponse(req, res, "error", "Error while fetching data " + JSON.stringify(err), 500);
                            }
                        })
                    }
                } else {
                    new responseHandler().sendResponse(req, res, "error", "Invalid username or password", 403);
                }
            } else {
                new responseHandler().sendResponse(req, res, "error", "Error while fetching data " + JSON.stringify(err), 500);
            }
        })
    } else {
        new responseHandler().sendResponse(req, res, "error", "Invalid username or password", 403);
    }


};

Authentication.prototype.logOut = function(req,res, body){
    //Expires the auth token and sends response
};

Authentication.prototype.createAccount = function (req, res, body) {
    //Creates a new account
    //todo from token get the Role -- This service is authorized only to admin
    //Check for the Role and username :
    console.log("create Account request " + JSON.stringify(body));
    if (body.FranchiseId == undefined || body.Role == undefined || body.FranchiseName == undefined || body.Password == undefined) {
        new responseHandler().sendResponse(req, res, "error", "Franchise Id, Role, Password and Franchise Name are required !", 403);
    } else {
        if (body.Role.toUpperCase() == "ADMIN" || body.Role.toUpperCase() == "FRANCHISE") {
            //Check Complete
            var options = {
                collection: "AUTH",
                Query: {FranchiseId: body.FranchiseId}
            };
            new dataBase().get(options, function (err, data) {
                if (!err) {
                    if (data.length == 0) {
                        //Username/FranchiseId is available
                        delete options.Query;
                        //Adding to Auth Collection for login
                        var AuthInsertobject = {};
                        AuthInsertobject.FranchiseId = body.FranchiseId;
                        AuthInsertobject.Password = body.Password;
                        AuthInsertobject.Role = body.Role;
                        AuthInsertobject.FranchiseName = body.FranchiseName;
                        options.insertObject = AuthInsertobject;
                        new dataBase().insert(options, function (err, authResult) {
                            if (!err) {
                                delete body.Password;
                                var userObject = {
                                    collection: "USER"
                                };
                                if (body.Role.toUpperCase() == "ADMIN") {
                                    userObject.insertObject = body;
                                } else {
                                    if (body.FranchiseDetails == undefined) {
                                        body.FranchiseDetails = {"UniformCosts": {"1": 10, "2": 20, "3": 30, "4": 40, "5": 50}, "KitCost": 500};
                                        userObject.insertObject = body;
                                    } else {
                                        userObject.insertObject = body;
                                    }
                                }
                                new dataBase().insert(userObject, function (err, result) {
                                    if (!err) {
                                        var response = {
                                            success: true,
                                            Message: "User added successfully."
                                        };
                                        new responseHandler().sendResponse(req, res, "success", response, 200);
                                    } else {
                                        new responseHandler().sendResponse(req, res, "error", "Error while inserting data +" + JSON.stringify(err), 500)
                                    }
                                })
                            } else {
                                new responseHandler().sendResponse(req, res, "error", "Error while inserting data " + JSON.stringify(err), 500);
                            }
                        })

                    } else {
                        new responseHandler().sendResponse(req, res, "error", "Email already registered. Please try with different email address.", 500)
                    }
                } else {
                    new responseHandler().sendResponse(req, res, "error", "Error while fetching from Database +" + JSON.stringify(err), 500)
                }
            })
        } else {

            new responseHandler().sendResponse(req, res, "error", "Role not supported !", 403);
        }

    }

};

Authentication.prototype.getAccounts = function (req, res, body) {
    //gets most recent 20 Account details
    //todo from token get the Role -- This service is authorized only to admin
    var options ={
        collection:"USER",
        Query:{},
        QuerySelect:{Password:0}
    }
    new dataBase().get(options, function(err, data){
        if(!err){
            new responseHandler().sendResponse(req, res, "success", data, 200);
        }else{
            new responseHandler().sendResponse(req, res, "error", "Error while inserting data +" + JSON.stringify(err), 500);
        }

    })
};

Authentication.prototype.getFranchiseNameList = function(req, res, body){

    var options = {
        collection:"USER",
        Query:{Role:"FRANCHISE"},
        QuerySelect:{_id:0, FranchiseName:1, FranchiseId:1}
    }
    new dataBase().get(options, function(err, data){
        if(!err){
            new responseHandler().sendResponse(req, res, "success", data, 200);
        }else{
            new responseHandler().sendResponse(req, res, "error", "Error while fetching from Database +" + JSON.stringify(err), 500)
        }
    })
}

Authentication.prototype.updatePassword = function (req, res, body) {
    //Matches with previous password and updates to new One
    //todo This user has permission to only change the password of his own account
    if(body.Password!=undefined){

        var options ={
            collection:"AUTH",
            Query:{FranchiseId:req.query.FranchiseId},
            QuerySelect:{Password:1}
        }

        new dataBase().get(options, function(err, data){
            if(!err){
                if(data[0].Password==body.OldPassword){
                    options.updateObject = {Password:body.Password}
                    new dataBase().update(options, function(err, updateResult){
                        console.log("update result " + updateResult);
                        var response={
                            success:true,
                            Message:"Password Successfully updated."
                        };
                        new responseHandler().sendResponse(req, res, "success", response, 200);
                    })
                }else{
                    new responseHandler().sendResponse(req, res, "error", "Old password doesn't match", 403)
                }
            }else{
                new responseHandler().sendResponse(req, res, "error", "Error while fetching data +" + JSON.stringify(err), 500);
            }

        })
    }

};

Authentication.prototype.updateAccount = function(req, res, body){
    //For updating the costs of goods
    //todo check with the token -- this service is only accessible to admin

};

Authentication.prototype.deleteAccount = function (req, res, body) {
    //Deletes the account
    //todo from token get the Role -- This service is authorized only to admin
    if(req.query.FranchiseId!=undefined){

        var options={
            collection:"AUTH",
            Query:{FranchiseId:req.query.FranchiseId}
        }
        new dataBase().delete(options, function(err, result){
            if(!err){
                options.collection="USER";
                new dataBase().delete(options, function(err, delResult){
                    if(!err){
                        console.log("Account deleted successfully.");
                        var response ={
                            success:true,
                            Message:"Account deleted Successfully."
                        };
                        new responseHandler().sendResponse(req, res, "success",response, 200);
                    }else{
                        new responseHandler().sendResponse(req, res, "error", "Error while deleting data " + JSON.stringify(err), 500);
                    }
                })
            }else{
                new responseHandler().sendResponse(req, res, "error", "Error while deleting data " + JSON.stringify(err), 500);
            }
        })

    }else{
        new responseHandler().sendResponse(req, res, "error", "Franchise Id can't be empty", 403);
    }

}


module.exports = Authentication;