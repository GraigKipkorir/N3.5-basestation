import { useRef,useEffect,useState } from 'react';
import MQTT from 'paho-mqtt'
import './App.css'
import LineChart from './components/lineChart';
import Video from './components/Video';
import Model from './components/model';

function App() {
	let altitudeChartRef = useRef();
	let velocityChartRef = useRef();
	let accelerationChartRef = useRef();

	let [altitude,setAltitude] = useState(0);//filterd altitude
	let [gx,setGx] = useState(0);
	let [gy,setGy] = useState(0);
	let [gz,setGz] = useState(0);
	let [latitude,setLatitude] = useState(0);
	let [longitude,setLongitude] = useState(0);
	let [state,setState] = useState(0);
	let [temperature,setTemperature] = useState(0);
	let [connectionStatus,setConnectionStatus] = useState('disconnected');
	
	let client = new MQTT.Client("127.0.0.1", 1884, "dashboard");

	// called when the client loses its connection
	let onConnectionLost = (responseObject) => {
		if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:"+responseObject.errorMessage);
		}
	}
	
	// called when a message arrives
	let onMessageArrived = (message) => {
		console.log("onMessageArrived:");
		let newData = JSON.parse(message.payloadString);
		// let newData = message.payloadString.split(',');
		console.log(newData);
		let time = Date.now();
		setAltitude(newData['altitude']);
		// setGx(newData[8]);
		// setGy(newData[9]);
		// setGz(newData[10]);
		// setLatitude(newData[11]);
		// setLongitude(newData[12]);
		// setState(newData[13]);
		// setTemperature(newData[14]);
		altitudeChartRef.current.data.datasets[0].data.push({x: time, y:newData['altitude']});
		// altitudeChartRef.current.data.datasets[1].data.push({x: time, y:newData[1]});
		altitudeChartRef.current.update('quiet');
		//
		velocityChartRef.current.data.datasets[0].data.push({x: time, y:newData['velocity']});
		velocityChartRef.current.update('quiet');
		//
		accelerationChartRef.current.data.datasets[0].data.push({x: time, y:newData['y-acceleration']});
		// accelerationChartRef.current.data.datasets[1].data.push({x: time, y:newData[5]});
		// accelerationChartRef.current.data.datasets[2].data.push({x: time, y:newData[6]});
		// accelerationChartRef.current.data.datasets[3].data.push({x: time, y:newData[7]});
		accelerationChartRef.current.update('quiet');
	}

	//called when client connects
	let onConnect = () => {
		console.log("connected");
		client.subscribe("esp32");
	}
	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	// connect the client
	client.connect({
		onSuccess:onConnect,
		keepAliveInterval: 3600,
	});

  return (
		<div className="lg:max-h-screen max-w-screen overflow-hidden">
			<main className="p-2">
				<div className="text-sm lg:text-base text-center">
					The WebSocket is currently {connectionStatus}
				</div>
				<div className="text-xs lg:text-base md:w-2/3 mx-auto font-bold flex flex-wrap justify-between">
					<span>
						Timestamp:{' '}
					</span>
					<span>State:{state} </span>
					<span>Altitude: {altitude}</span>
					<span>Longitude:{longitude} </span>
					<span>Latitude: {latitude} </span>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3">
					<div>
						<Video
							url={'http://192.168.0.103:81/stream'}
						/>
					</div>
					<div className="lg:order-first w-full lg:w-10/12 lg:col-span-2">
						<Model/>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3">
					<div className="w-full lg:w-11/12">
						<LineChart ref={altitudeChartRef} type="altitude" />
					</div>
					<div className="w-full lg:w-11/12">
						<LineChart ref={velocityChartRef} type="velocity" />
					</div>
					<div className="w-full lg:w-11/12">
						<LineChart	ref={accelerationChartRef}	type="acceleration"/>
					</div>
				</div>
			</main>
		</div>
  )
}

export default App
