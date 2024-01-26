/**
 * simulate data sent from esp32
 * Data sent includes : time_log,id,ax,ay,az,gx,gy,gz,AGL,altitude,velocity,pressure,latitude,longitude,time,state
*/
// Create a client instance
const mqtt = require('paho-mqtt');
const readline = require('readline');
const fs = require('fs');
global.WebSocket = require('ws');

client = new mqtt.Client("127.0.0.1", 1883, "simulator");
 
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
 
// connect the client
client.connect({onSuccess:onConnect});

//generate procedural data
startingCor = [-1.0953775626377544, 37.01223403257954];
states=['PRE_FLIGHT_GROUND_STATE','POWERED_FLIGHT_STATE','BALLISTIC_DESCENT_STATE']
startingAlt = 100;
highestThrust = 3000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let filePath = "../drone_logs/drone1.csv"
// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  //read from csv
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  rl.on('line', (line) => {
    const columns = line.split(',');
    console.log(columns[1])
    message = new mqtt.Message(columns.slice(2).join(','));
    message.destinationName = "simulation";
    client.send(message);
    for(let i = 0; i < 99999999; i++){
      Math.sqrt(i);
    }
   });
}
 
// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}
 
// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}