/**
 * Created by Akshay on 27-04-2015.
 */


//Application Modules
var responseHandler = require('./ResponseHandler.js');
var dataBase = require('./DbOperations.js');

function Authentication() {

}


Authentication.prototype.verify = function(req, res, body){
    var FranchiseId = req.query.email;
    var options = {
        collection:"AUTH",
        Query:{FranchiseId:FranchiseId}
    }

    new dataBase().get(options, function(err, data){
        if(!err){
            console.log("data from auth .. " + JSON.stringify(data))
            if(data.length>0){
                //Person has already registered
                new responseHandler().sendResponse(req, res, "error", "Account with this email Id has already been registered. Please contact administrator to retrieve your password.", 403)
            }else{
                var userOptions = {
                    collection :"USER",
                    Query:{FranchiseId:FranchiseId}
                }
                new dataBase().get(userOptions, function(err, userData){
                    if(!err){
                        if(userData.length>0){
                            //user exists
                            var response ={};
                            var userToken = new Buffer(new Date().getTime().toString()).toString('base64') ;
                            var setToken = {
                                collection :"USER",
                                Query:{FranchiseId:FranchiseId},
                                updateObject:{UserToken:userToken}
                            }
                            new dataBase().update(setToken, function(err, setData){
                                if(!err){
                                    var response = {}
                                    response.status = "success";
                                    response.token = userToken;
                                    new responseHandler().sendResponse(req, res, "success", response, 200);
                                }else{
                                    new responseHandler().sendResponse(req, res, "error", "Error while updating database. Please try after sometime.", 500)
                                }
                            })
                        }else{
                            //User doesnt exists in the database
                            new responseHandler().sendResponse(req, res, "error", "User doesn't exist in the database. Please contact administrator.", 403)
                        }

                    }
                })
            }
        }
    })
}

Authentication.prototype.register = function(req, res, body){
    var token = req.query.token;
    console.log("token here " + token)
    if(token){
        var checkUser = {
            collection:"USER",
            Query:{UserToken:token},
            QuerySelect:{Role:1, FranchiseName:1, FranchiseId:1}
        }

        new dataBase().get(checkUser, function(err, data){
            if(!err){
                if(data.length>0){
                    var createAuth ={};
                    createAuth.FranchiseId = data[0].FranchiseId;
                    createAuth.FranchiseName = data[0].FranchiseName;
                    createAuth.Role = data[0].Role;
                    createAuth.Password = body.password;

                    var authOptions = {
                        collection:"AUTH",
                        insertObject: createAuth
                    }

                    new dataBase().insert(authOptions, function(err, dataResult){
                        if(!err){
                            //Account registered successfully
                            var response ={};
                            response.status = "success"
                            response.message = "User registered successfully. Please Login to proceed."
                            new responseHandler().sendResponse(req, res, "success", response, 200);
                        }
                    })
                }else{
                    //user token doesn't exists
                    new responseHandler().sendResponse(req, res, "error", "User Token doesn't exist. Please try registering again ", 403)
                }
            }
        })
    }else{
        new responseHandler().sendResponse(req, res, "error", "User Token is missing. Please try again.", 403)
    }


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
                                /*var kitOptions = {
                                 collection:"INVENTORY",
                                 Query:{Category:"KIT",Tags:"Visible"},
                                 QuerySelect:{Name:1,KitId:1}
                                 }
                                 new dataBase().get(kitOptions,function(err, kitData){
                                 FranchiseData[0].FranchiseDetails.Kits = kitData;
                                 new responseHandler().sendResponse(req, res, "success", FranchiseData[0], 200);
                                 })*/
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

Authentication.prototype.logOut = function (req, res, body) {
    //Expires the auth token and sends response
};

Authentication.prototype.createAccount = function (req, res, body) {
    //Creates a new account
    //todo from token get the Role -- This service is authorized only to admin
    //Check for the Role and username :
    console.log("create Account request " + JSON.stringify(body));
    if (body.FranchiseId == undefined || body.Role == undefined || body.FranchiseName == undefined) {
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
                        options.collection ="USER"
                        //Adding to Auth Collection for login
                        var AuthInsertobject = {};
                        AuthInsertobject.FranchiseId = body.FranchiseId;
                        AuthInsertobject.Role = body.Role;
                        AuthInsertobject.FranchiseName = body.FranchiseName;
                        AuthInsertobject.FranchiseDetails = body.FranchiseDetails;
                        options.insertObject = AuthInsertobject;
                        new dataBase().insert(options, function (err, result) {
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
    var options = {
        collection: "USER",
        Query: {},
        QuerySelect: {Password: 0}
    }
    new dataBase().get(options, function (err, data) {
        if (!err) {
            var uniformOptions = {
                collection: "INVENTORY",
                Query: {Category: "UNIFORMS", Tags: "Visible"},
                QuerySelect: {Name: 1, ItemId: 1}
            }
            new dataBase().get(uniformOptions, function (err, UniformsData) {
                if (!err) {
                    var response = {}
                    response.accounts = data;
                    response.UniformsList = UniformsData;
                    data[0].UniformsList = UniformsData;
                    console.log("Login data " + JSON.stringify(data));
                    new responseHandler().sendResponse(req, res, "success", response, 200);
                }
            })
            //new responseHandler().sendResponse(req, res, "success", data, 200);
        } else {
            new responseHandler().sendResponse(req, res, "error", "Error while inserting data +" + JSON.stringify(err), 500);
        }

    })
};

Authentication.prototype.getFranchiseNameList = function (req, res, body) {

    var options = {
        collection: "USER",
        Query: {Role: "FRANCHISE"},
        QuerySelect: {_id: 0, FranchiseName: 1, FranchiseId: 1}
    }
    new dataBase().get(options, function (err, data) {
        if (!err) {
            new responseHandler().sendResponse(req, res, "success", data, 200);
        } else {
            new responseHandler().sendResponse(req, res, "error", "Error while fetching from Database +" + JSON.stringify(err), 500)
        }
    })
}

Authentication.prototype.updatePassword = function (req, res, body) {
    //Matches with previous password and updates to new One
    //todo This user has permission to only change the password of his own account
    if (body.Password != undefined) {

        var options = {
            collection: "AUTH",
            Query: {FranchiseId: req.query.FranchiseId},
            QuerySelect: {Password: 1}
        }

        new dataBase().get(options, function (err, data) {
            if (!err) {
                if (data[0].Password == body.OldPassword) {
                    options.updateObject = {Password: body.Password}
                    new dataBase().update(options, function (err, updateResult) {
                        console.log("update result " + updateResult);
                        var response = {
                            success: true,
                            Message: "Password Successfully updated."
                        };
                        new responseHandler().sendResponse(req, res, "success", response, 200);
                    })
                } else {
                    new responseHandler().sendResponse(req, res, "error", "Old password doesn't match", 403)
                }
            } else {
                new responseHandler().sendResponse(req, res, "error", "Error while fetching data +" + JSON.stringify(err), 500);
            }

        })
    }

};

Authentication.prototype.updateAccount = function (req, res, body) {
    //For updating the costs of goods
    //todo check with the token -- this service is only accessible to admin

    var options = {
        collection: "USER",
        Query: {FranchiseId: body.FranchiseId},
        updateObject: {$set: {FranchiseDetails: body.FranchiseDetails}}
    }

    new dataBase().update(options, function (err, data) {
        if (!err) {
            new responseHandler().sendResponse(req, res, "success", "user details successfully updated.", 200);

        } else {
            new responseHandler().sendResponse(req, res, "error", "error while updating the user account details", 500);
        }
    })

};

Authentication.prototype.deleteAccount = function (req, res, body) {
    //Deletes the account
    //todo from token get the Role -- This service is authorized only to admin
    if (req.query.FranchiseId != undefined) {

        var options = {
            collection: "AUTH",
            Query: {FranchiseId: req.query.FranchiseId}
        }
        new dataBase().delete(options, function (err, result) {
            if (!err) {
                options.collection = "USER";
                new dataBase().delete(options, function (err, delResult) {
                    if (!err) {
                        console.log("Account deleted successfully.");
                        var response = {
                            success: true,
                            Message: "Account deleted Successfully."
                        };
                        new responseHandler().sendResponse(req, res, "success", response, 200);
                    } else {
                        new responseHandler().sendResponse(req, res, "error", "Error while deleting data " + JSON.stringify(err), 500);
                    }
                })
            } else {
                new responseHandler().sendResponse(req, res, "error", "Error while deleting data " + JSON.stringify(err), 500);
            }
        })

    } else {
        new responseHandler().sendResponse(req, res, "error", "Franchise Id can't be empty", 403);
    }

}

Authentication.prototype.createBulkAccount = function (req, res, fileJSON) {

    console.log("creating new users")
    var options = {
        collection: "USER"
    };
    var FranchiseDetails = {
        "UniformCosts": [
            {
                "Name": "size small",
                "ItemId": "UNIFORMS1436239742141",
                "cost": 100
            },
            {
                "Name": "size medium",
                "ItemId": "UNIFORMS1436239759941",
                "cost": 200
            },
            {
                "Name": "size large",
                "ItemId": "UNIFORMS1436239774476",
                "cost": 300
            }
        ],
        "KitCost": 500
    }
    for (var i = 0; i < fileJSON.length; i++) {
        if (i == fileJSON.length - 1) {
            createNewUser(fileJSON[i], FranchiseDetails);
            new responseHandler().sendResponse(req, res, "success","Accounts added successfully", 200)
        } else {
            createNewUser(fileJSON[i], FranchiseDetails);
        }
    }
    function createNewUser(userObj, FranchiseDetails) {
        var FranchiseDet = JSON.parse(JSON.stringify(FranchiseDetails))
        FranchiseDet.UniformCosts[0].cost = parseInt(userObj.small);
        FranchiseDet.UniformCosts[1].cost = parseInt(userObj.medium);
        FranchiseDet.UniformCosts[2].cost = parseInt(userObj.large);
        FranchiseDet.KitCost = parseInt(userObj.KitCost);
        userObj.Role = userObj.Role.toUpperCase();
        delete userObj.small;
        delete userObj.medium;
        delete userObj.large;
        delete userObj.KitCost;
        userObj.FranchiseDetails = FranchiseDet;
        options.insertObject = userObj;
        var findUserOptions={
            collection:"USER",
            Query:{FranchiseId:userObj.FranchiseId}
        }
        new dataBase().get(findUserOptions, function(err, data){
            if(!err){
                if(data.length>0){
                    console.log("user exists ")
                }else{
                    console.log("user doesnt exist");
                    var options = {
                        collection: "USER",
                        insertObject:userObj
                    };
                    console.log("options for creating user " + JSON.stringify(options))
                    new dataBase().insert(options, function (err, insertResult) {
                        if (!err) {
                            console.log("user created")
                        } else {
                            console.log("the error while creating bulk user.")
                        }

                    })
                }
            }else{
                //new responseHandler().sendResponse(req, res, "error","error while fetching the user data", 500)
                console.log("Error while querying the db");
            }
        })

    }
}


module.exports = Authentication;