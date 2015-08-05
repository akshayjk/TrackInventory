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
        var response;
        if(typeof(resMsg)=="object"){
            response=JSON.stringify(resMsg)
        }else{
            var responseMessage ={}
            responseMessage.success=true;
            responseMessage.Message = resMsg;
            response = JSON.stringify(responseMessage)
        }
        res.send(response)
    }else if(type=="error"){
        if(typeof(resMsg)=="object")
            resMsg = JSON.stringify(resMsg);
        var response ={
            success:false,
            errorMessage:resMsg
        };

        res.send(JSON.stringify(response));
    }

};

module.exports = ResponseHandler;