//will send the response

function ResponseHandler(){

}

ResponseHandler.prototype.sendResponse = function(req, res, type, resMsg, StatusCode){
	//Sends the response message and response code
	if(!StatusCode)
		StatusCode = 200;
	res.status(StatusCode);
	res.setHeader("Content-Type", "application/json");

    if(type=="success"){
        res.send(JSON.stringify(resMsg))
    }else if(type=="error"){

        if(typeof(resMsg)=="obejct")
            resMsg = JSON.stringify(resMsg);
        var response ={
            success:false,
            errorMessage:resMsg
        };

        res.send(JSON.stringify(response));
    }

};

module.exports = ResponseHandler;