/**
 * Created by Akshay on 8/2/2015.
 */

var define = require('./Define.js');
var mandrill = require('mandrill-api/mandrill');
var mailgunJs = require('mailgun-js');
var MailComposer = require("mailcomposer").MailComposer;
var fs = require('fs');


function sendEmail(options){
    var options = options || {};
    this.options = options;
    this.subject = options.subject || "Welcome to Little Einsteins";
    this.emailTemplate = options.emailTemplate!=undefined? define[options.emailTemplate]:define.WelcomeTemplate;
    this.receivers = options.receivers;
    this.sender = options.sender || define.emailSender;
    this.mandrillKey = define.mandrill_key;
    this.mailgunKey = define.mailgun_key;
    this.mailgunDomain = define.mailgun_domain;
    this.fromName = options.fromName || define.emailAppearanceName;
}

sendEmail.prototype.send = function(recieverName){
    switch(define.emailService.toLowerCase()){
        case "mandrill":
            new sendEmail(this.options).sendByMandrill(recieverName);
            break;
        case "mailgun":
            new sendEmail(this.options).sendByMailgun(recieverName);
            break;
    }

}

sendEmail.prototype.sendByMandrill = function(recieverName){
    var m = new mandrill.Mandrill(this.mandrillKey);
    var htmlEmail = fs.readFileSync(__dirname + this.emailTemplate, {encoding: 'utf8'});
    //var parentName = "Satish Kumar"
    //htmlEmail = htmlEmail.toString();
    //console.log("type is " + typeof(htmlEmail))
    //console.log("search" +  htmlEmail.search('NameOfParent'))
    htmlEmail = htmlEmail.replace('{{receiverName}}', recieverName);
    if(this.options.emailTemplate=="Registration_PasswordReset"){
        htmlEmail = htmlEmail.replace('{{FranchiseId}}', this.username);
        htmlEmail = htmlEmail.replace('{{FranchisePassword}}', this.password);

    }

    var params = {
        "message": {
            "from_email":this.sender,
            "from_name":this.fromName,
            "to":[{"email":this.receivers}],
            "subject": this.subject,
            "html": htmlEmail
        }
    };
    console.log("Email params " + JSON.stringify(params))
    function sendTheMail() {
    // Send the email!
        m.messages.send(params, function(res) {
            console.log(res);
        }, function(err) {
            console.log(err);
        });
    };

    sendTheMail();

}

sendEmail.prototype.sendByMailgun = function(recieverName){

    var mailgun = mailgunJs({ apiKey: this.mailgunKey, domain: this.mailgunDomain });
    var htmlEmail = fs.readFileSync(this.emailTemplate);
    var parentName = recieverName;
    htmlEmail = htmlEmail.toString();
    console.log("type is " + typeof(htmlEmail))
    console.log("search" +  htmlEmail.search('NameOfParent'))
    htmlEmail = htmlEmail.replace('NameOfParent', parentName);
    if(this.options.emailTemplate=="Registration_PasswordReset"){
        htmlEmail = htmlEmail.replace('NameOfParent', parentName);
    }
    //htmlEmail = htmlEmail.replace('MailDataTobeReplacedHere', welComeData);

    var mailcomposer = new MailComposer();

    mailcomposer.setMessageOption({
        from: this.sender,
        to: 'akshayjk10@gmail.com',
        subject: this.subject,
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
    });
}

module.exports = sendEmail;

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




