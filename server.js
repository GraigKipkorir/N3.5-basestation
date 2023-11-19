import express from 'express';
import path from 'path';
import { WebSocketServer } from 'ws';

const app = express();
const port = 8081;

// sendFile will go here
app.use(express.static(path.join(__dirname,'frontend', 'dist')));

app.listen(port,()=>{
    console.log('Server started at http://localhost:' + port);
});

let wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received image');
	});
});