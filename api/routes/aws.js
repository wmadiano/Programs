const express = require('express');
const router = express.Router();



/*
router.get('/', (req, res, next) =>{
    sendEmail('wmadiano@gmail.com','zwmadiano@globe.com.ph','Sent from AWS','<p>hello1</p><p>hello 2</p>');
    res.status(200).json({
        message: 'Handling GET request to /aws'
    });
});
*/

/*
sample parameter
{
	"name": "windtoner",
	"price": "29.23"
}
*/

/*

router.post('/', (req, res, next) =>{
    const aws = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subj,
        body: req.body.body,
    };

    sendEmail(aws.from,aws.to,aws.subject,aws.body);
    res.status(201).json({
        message: 'Email Sent',
        output: res.message
    });
});

*/


router.post('/', (req, res, next) =>{
    const par = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subj,
        body: req.body.body,
    };


    var AWS = require('aws-sdk');
    AWS.config.region = 'us-west-2';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-west-2:e4061540-65bb-475b-9c9f-8ef35f214873'
    });
    
    var ses = new AWS.SES();
    
    // send to list
    var toArr = par.to.split(';');
    
    // this must relate to a verified SES account
    //var from = 'wmadiano@gmail.com';
    
    // this sends the email
    // @todo - add HTML version
    var params = {
        Destination: {
         BccAddresses: [
         ], 
         CcAddresses: [
         ], 
         ToAddresses: toArr
        }, 
        Message: {
         Body: {
          Html: {
           Charset: "UTF-8", 
           Data: par.body
          }, 
          Text: {
           Charset: "UTF-8", 
           Data: ""
          }
         }, 
         Subject: {
          Charset: "UTF-8", 
          Data: par.subject
         }
        }, 
        ReplyToAddresses: [
        ], 
        Source: par.from
       };
    
       ses.sendEmail(params, function(err, data) {
        if (err){
            console.log(err, err.stack); // an error occurred
            res.status(500).json({
                message: 'error',
                details: err.stack
            });
        }
        else{
            console.log(data);
            res.status(201).json({
                message: 'Sent',
                details: data.MessageId
            });
        
        }           // successful response
        /*
        data = {
         MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
        }
        */
      });
});


module.exports = router;