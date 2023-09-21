const mqtt = require('paho-mqtt');
global.WebSocket = require('ws');
let fs = require('fs');

function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}-${hours}:${minutes}:${seconds},`;
}
client = new mqtt.Client("127.0.0.1", 1883, "logger");
 
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
 
// connect the client
client.connect({onSuccess:onConnect});

//create logging file name based on epoch
let date = new Date();
let epoch = date.getTime();
let filename = 'logs.csv';

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("n3/telemetry");
    filename = 'logs/log_'+epoch.toString().slice(6)+'.csv';
}
   
// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    // console.log("onMessageArrived:");
    try{
        fs.appendFile(filename,getCurrentTimestamp()+message.payloadString,(e)=>{
            if(e){
                console.log(e);
            }
            console.log(message.payloadString);
        });
    } catch(err){
        console.log(err);
    }
}