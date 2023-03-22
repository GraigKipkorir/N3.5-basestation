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
	
	let client = new MQTT.Client("192.168.0.108", 1885, "dashboard");

	// called when the client loses its connection
	let onConnectionLost = (responseObject) => {
		if (responseObject.errorCode !== 0) {
		console.log("onConnectionLost:"+responseObject.errorMessage);
		}
	}
	
	// called when a message arrives
	let onMessageArrived = (message) => {
		//0: "Timestamp"1: "Altitude"2: "ax"3: "ay"4: "az"5: "gx"6: "gy"7: "gz"8: "filtered_s"9: "filtered_v"10: "filtered_a"
		console.log("onMessageArrived:");
		// let newData = JSON.parse(message.payloadString);
		let newData = message.payloadString.split(',');
		console.log(newData);
		let time = Date.now();
		setAltitude(newData[1]);
		setGx(newData[5]);
		setGy(newData[6]);
		setGz(newData[7]);
		// setLatitude(newData[11]);
		// setLongitude(newData[12]);
		// setState(newData[13]);
		// setTemperature(newData[14]);
		altitudeChartRef.current.data.datasets[0].data.push({x: time, y:newData[10]});
		altitudeChartRef.current.data.datasets[1].data.push({x: time, y:newData[1]});
		altitudeChartRef.current.update('quiet');
		//
		velocityChartRef.current.data.datasets[0].data.push({x: time, y:newData[9]});
		velocityChartRef.current.update('quiet');
		//
		accelerationChartRef.current.data.datasets[0].data.push({x: time, y:newData[10]});//filterd_a
		accelerationChartRef.current.data.datasets[1].data.push({x: time, y:newData[3]});
		accelerationChartRef.current.data.datasets[2].data.push({x: time, y:newData[4]});
		accelerationChartRef.current.data.datasets[3].data.push({x: time, y:newData[5]});
		accelerationChartRef.current.update('quiet');
	}

	//called when client connects
	let onConnect = () => {
		console.log("connected");
		client.subscribe("ESP32/Connect/Success");
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
						<Model x={gx} y={gy} z={gz} />
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
