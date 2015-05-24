
var dataBase = require('./DbOperations.js');
var responseHandler = require('./responseHandler.js');

var MessageArray = [
            {
                "FranchiseName": "Kolkata School",
                "FranchiseId": "RR25453",
                "ModifiedOn": "2015-04-18T18:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-18T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            },
            {
                "FranchiseName": "Mumbai School",
                "FranchiseId": "RR25454",
                "ModifiedOn": "2015-04-18T19:37:04.211Z",
                "Messages": [
                    {
                        "sender": "akshay",
                        "sent on": "2015-04-18T14:37:04.211Z",
                        "Message": "We have a problem with order Id 5442545. We recieved one CD lesser"
                    },
                    {
                        "sender": "admin",
                        "sent on": "2015-04-18T18:37:04.211Z",
                        "Message": "We will look into the issue"
                    }
                ]
            }
        ];


function Messages(){

}

Messages.prototype.getAllMessageChains = function(req, res, body){
	//Fetches 20 most recent Message chains and depending on the request will keep on fetching remaining message chains
    var options = {
        collection:'MESSAGES',
        Query:{},
        QurySelect:{$slice:{Messages:3}},
        sortObject:{ModifiedOn:-1},
        sortLimit:20
    }

    new dataBase().get(options, function(err, data){
        if(!err){

            new responseHandler().sendResponse(req, res, "success", data, 200);
        }else{
            new responseHandler().sendResponse(req, res, "error", "error while fetching messages", 500);
        }

    })
}

Messages.prototype.getMessageChain = function(){
	//Fetches a particular message chain
}

Messages.prototype.getMessages = function(){
	//Fetches 20 Most recent Messages in a message chain and depending on the request will keep on fetching remaining messages
}

Message.prototype.sendMessage = function(req, res, body){
	//Deliveres a message to client
    //check if the message chain exists


    //sending a message first time
    if(body.role!=undefined){

        if(body.role.toUpperCase()=="ADMIN"){

        }
    }
}