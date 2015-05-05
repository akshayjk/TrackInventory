/*var mandrill = require('node-mandrill')('5N4xzHAOdPQZ_wYnih4sSA');

mandrill('/messages/send', {
    message: {
        to: [{email: 'akshayjk10@gmail.com', name: 'Akshay Kulkarni'}],
        from_email: 'akshayjkul10@yahoo.co.in',
        subject: "Hey, what's up?",
        text: "Hello, I sent this message using mandrill in Node JS."
    }
}, function(error, response)
{
    //uh oh, there was an error
    if (error) console.log( JSON.stringify(error) );

    //everything's good, lets see what mandrill said
    else console.log(response);
});*/


// Create a function to log the response from the Mandrill API
/*function log(obj) {
    $('#response').text(JSON.stringify(obj));
}
*/
// create a new instance of the Mandrill class with your API key

var mandrill = require('mandrill-api/mandrill');
var m = new mandrill.Mandrill('5N4xzHAOdPQZ_wYnih4sSA');

var fs = require('fs');
var htmlEmail = fs.readFileSync('./index.html');
var welComeData = "An Order of welcome kit and 2 uniforms of size x has been placed for your child. <br/> <br/>"
var parentName = "Satish Kumar"
htmlEmail = htmlEmail.toString();
console.log("type is " + typeof(htmlEmail))
console.log("search" +  htmlEmail.search('NameOfParentHere'))
htmlEmail = htmlEmail.replace('NameOfParentHere', parentName);
htmlEmail = htmlEmail.replace('MailDataTobeReplacedHere', welComeData);
// create a variable for the API call parameters
var params = {
    "message": {
        "from_email":"admin@littleeinstein.co.in",
        "from_name":"Little Einstein Preschool",    
        "to":[{"email":"akshayjkul10@yahoo.co.in"}],
        "subject": "Order Confirmation - Your Order has been placed successfuly",
        "text": "Testing with the HTML rendering",
        "html": htmlEmail
    }
};

function sendTheMail() {
// Send the email!

    m.messages.send(params, function(res) {
        console.log(res);
    }, function(err) {
        console.log(err);
    });
};

sendTheMail();



//var Mailgun = require('mailgun-js');
//init express


/*var api_key = 'key-fda05f03f2000743665533a688939127';


var domain = 'sandboxe37c4edf5e3f4df6beeb7bb39a591946.mailgun.org';


var from_who = 'postmaster@sandboxe37c4edf5e3f4df6beeb7bb39a591946.mailgun.org';


//We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
var mailgun = new Mailgun({apiKey: api_key, domain: domain});

var data = {
    //Specify email data
    from: from_who,
    //The email to contact
    to: "akshayjk10@gmail.com",
    //Subject and text data  
    subject: 'Hello from Mailgun',
    html: "<divstyle='width:70%; background-color:black; padding:10%'><divstyle='color:white;'>ThisisatestTemplate</div></div>"
}

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {

            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page 
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            
            console.log(body);
        }
    });*/


/*var domain = 'sandboxe37c4edf5e3f4df6beeb7bb39a591946.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: "key-fda05f03f2000743665533a688939127", domain: domain });
var fs = require('fs');
var htmlEmail = fs.readFileSync('./LE_Email.html');
var welComeData = "An Order of welcome kit and 2 uniforms of size x has been placed for your child. <br/> <br/>"
var parentName = "Satish Kumar"
htmlEmail = htmlEmail.toString();
console.log("type is " + typeof(htmlEmail))
console.log("search" +  htmlEmail.search('NameOfParentHere'))
htmlEmail = htmlEmail.replace('NameOfParentHere', parentName);
htmlEmail = htmlEmail.replace('MailDataTobeReplacedHere', welComeData);
var MailComposer = require("mailcomposer").MailComposer;
var mailcomposer = new MailComposer();
    
mailcomposer.setMessageOption({
  from: 'postmaster@sandboxe37c4edf5e3f4df6beeb7bb39a591946.mailgun.org',
  to: 'akshayjk10@gmail.com',
  subject: 'Order Confirmation - Your order has been placed successfuly.',
  body: 'Test email text',
  html: htmlEmail
});
 
mailcomposer.buildMessage(function(mailBuildError, messageSource) {
 
    var dataToSend = {
        to: 'akshayjk10@gmail.com',
        message: messageSource
    };
 
    mailgun.messages().sendMime(dataToSend, function (sendError, body) {
        if (sendError) {
            console.log(sendError);
            return;
        }else{
            console.log(body);
        }
    });
});*/