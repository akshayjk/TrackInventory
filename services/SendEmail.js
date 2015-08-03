/**
 * Created by Akshay on 8/2/2015.
 */

var define = require('./Define.js');
var mandrill = require('mandrill-api/mandrill');
var mailgunJs = require('mailgun-js');
var MailComposer = require("mailcomposer").MailComposer;
var fs = require('fs');


function sendEmail(options){
    var options = options || {}
    this.subject = options.subject || "Welcome to Little Einsteins";
    this.emailTemplate = options.emailTemplate || define.WelcomeTemplate;
    this.receivers = options.receivers;
    this.sender = options.sender || define.emailSender;
    this.mandrillKey = define.mandrill_key;
    this.mailgunKey = define.mailgun_key;
    this.mailgunDomain = define.mailgun_domain;
    this.fromName = options.fromName || define.emailAppearanceName;
}

sendEmail.prototype.sendByMandrill = function(){
    var m = new mandrill.Mandrill(this.mandrillKey);
    var htmlEmail = fs.readFileSync(this.emailTemplate);
    var parentName = "Satish Kumar"
    htmlEmail = htmlEmail.toString();
    console.log("type is " + typeof(htmlEmail))
    console.log("search" +  htmlEmail.search('NameOfParent'))
    htmlEmail = htmlEmail.replace('NameOfParent', parentName);

    var params = {
        "message": {
            "from_email":this.sender,
            "from_name":this.fromName,
            "to":[{"email":"akshayjkul10@yahoo.co.in"}],
            "subject": this.subject,
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

}

sendEmail.prototype.sendByMailgun = function(){

    var mailgun = mailgunJs({ apiKey: this.mailgunKey, domain: this.mailgunDomain });
    var htmlEmail = fs.readFileSync(this.emailTemplate);
    var parentName = "Satish Kumar"
    htmlEmail = htmlEmail.toString();
    console.log("type is " + typeof(htmlEmail))
    console.log("search" +  htmlEmail.search('NameOfParent'))
    htmlEmail = htmlEmail.replace('NameOfParent', parentName);
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



