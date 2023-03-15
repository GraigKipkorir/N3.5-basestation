/**
 * simulate data sent from esp32
 * Data sent includes :
 *  - timestamp
 *  - altitude
 *  - filterd altitude, velocity, & accelaration
 *  - ax,ay,az
 *  - gx,gy,gz
 *  - latitude & longitude
 *  - state
 *  - temperature
 */
// Create a client instance
const mqtt = require('paho-mqtt');
const readline = require('readline');
const fs = require('fs');
global.WebSocket = require('ws');

client = new mqtt.Client("127.0.0.1", 1884, "simulator");
 
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

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  //read from csv
  let fileStream = fs.createReadStream('tanafull.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  while (false) {
    rl.on('line', (input) => {
      message = new mqtt.Message(input);
      message.destinationName = "esp32";
      client.send(message);
      console.log(`Sent: ${input}`);
      sleep(1000);
    });
  }
  // client.subscribe("esp32");
  //{y-acceleration:200.00, velocity:127.99, altitude:132.23, pressure: 1013.23}
  //123456789,1214.23,1201.45,230.45,12.23,1.03,0.23,12.00,4.55,3.21,1.97,-1.0953775626377544, 37.01223403257954,PRE_FLIGHT_GROUND_STATE,44.999
  message = new mqtt.Message("{\"y-acceleration\":200.00, \"velocity\":127.99, \"altitude\":132.23, \"pressure\": 1013.23}");
  message.destinationName = "esp32";
  setInterval(() => {client.send(message)}, 100);
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