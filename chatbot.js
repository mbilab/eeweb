const fs = require('fs')
const bodyParser = require('body-parser')
const express = require('express')
const app = express().use(bodyParser.json())
const opt = require('./option.json')
const https = require('https')
const request = require('request')

const httpsOpt = {
  ca: fs.readFileSync('./ssl/ca_bundle.crt'),
  cert: fs.readFileSync('./ssl/certificate.crt'),
  key: fs.readFileSync('./ssl/private.key')
}


https.createServer(httpsOpt, app).listen(opt.chat_port, () => { console.log(`listen on ${opt.chat_port}`) })

  
app.post('/webhook', (req, res) => {  
   
    let body = req.body

    //Checks this is an event from a page subscription
    if (body.object === 'page') {
      
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
      
        // Gets the message. entry.messaging is an array, but will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0]
        console.log(webhook_event)

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id
        //console.log('Sender PSID: ' + sender_psid)

				// Check if the event is a message or postback and
  			if (webhook_event.message)
    			handleMessage(sender_psid, webhook_event.message)        
      
      })

    
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED')
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404)
    }
    
})

app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = 'token'
    
  // Parse the query params
  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)      
    }
  }
})

function sendTextMessage(sender, text) {
  
  const page_token = opt.page_token
  
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:page_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  });
}

function handleMessage(sender_psid, received_message){

  let response

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}".`
    }
  }  
  
  // Sends the response message
  callSendAPI(sender_psid, response)

}

function callSendAPI(sender_psid, response){
  
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
	
	// Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": opt.page_token },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err)
    }
  })

}


//podcast testing

let subscriber = JSON.parse(fs.readFileSync('./sender.json','utf-8'))
let subscriber_id = subscriber.sender_id
let _message = {"text": "news!!!"}

console.log(subscriber_id)
callSendAPI(subscriber_id, _message)
  
