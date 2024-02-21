import { useRef,useEffect,useState } from 'react';
import MQTT from 'paho-mqtt'
import './App.css'
import LineChart from './components/lineChart';
import Video from './components/Video';
import Model from './components/model';
import Countdown from './components/countdown';
import Telemetry from './components/telemetry';
import Map from './components/Map';
import setting from './assets/setting.svg';
import{MQTT_SERVER, MIN_DELAY_BETWEEN_MESSAGES, WEBSOCKET_PORT} from './components/defs.js'


function App() {
	let altitudeChartRef = useRef();
	let velocityChartRef = useRef();
	let accelerationChartRef = useRef();

	let toRadians = (angle) => {
		return angle * (Math.PI / 180);
	}

	let [altitude,setAltitude] = useState(0);//raw altitude
	let [agl,setAGL] = useState(0);//filtered altitude
	let [gx,setGx] = useState(toRadians(0));
	let [gy,setGy] = useState(toRadians(180));
	let [gz,setGz] = useState(toRadians(0));
	let [latitude,setLatitude] = useState(-1.0953775626377544);
	let [longitude,setLongitude] = useState(37.01223403257954);
	let [state,setState] = useState(0);
	let [stream,setStream] = useState(true);
	let [apogee, setApogee] = useState(0);
	let [error, setError] = useState(null);
	let [isLoading, setIsLoading] = useState(true);


	let previousAltitude = 0;

	
	let client = new MQTT.Client(
		MQTT_SERVER, 
		WEBSOCKET_PORT, 
		`dashboard-${((new Date()).getTime()).toString().slice(4)}`
	);
	
	// Called when client connects
	let onConnect = () => {
		console.log("connected");
		client.subscribe("esp32/message");
		setIsLoading(false);
		document.getElementById('connected').innerHTML = "MQTT connected";
	};
	// Connect the client
	client.connect({
		onSuccess:onConnect,
		keepAliveInterval: 3600,
	});

	// Called when the client loses its connection
	let onConnectionLost = (responseObject) => {
		if (responseObject.errorCode !== 0) {
			setError("Connection lost:" + responseObject.errorMessage);
		}	
	};
	
	// Called when a message arrives
	let lastMessageTime = 0;
	let onMessageArrived = (message) => {
		// {"timestamp":1230235,"altitude":1528.444,"temperature":29.200,"ax":-1.470,"ay":0.192,"az":10.542,"gx":-0.069,"gy":-0.034,"gz":0.002,
		// "filtered_s":1525.102,"filtered_v":-2.150,"filtered_a":-0.623,"state":0,"longitude":0.00000000,"latitude":0.00000000}
		// console.log("onMessageArrived:");

		let currentTime = Date.now();
		if(currentTime - lastMessageTime >= MIN_DELAY_BETWEEN_MESSAGES) {
			try {
				let newData = JSON.parse(message.payloadString)
				let time = Date.now();
	
				// console.log(newData);
			
				if(parseInt(newData.altitude)>previousAltitude) 
					setApogee(newData.altitude);
	
				previousAltitude = newData.filtered_s;
	
				// console.log(`Previous ALT == ${typeof(previousAltitude)}`)
				// console.log(`Previous ALT == ${previousAltitude}`)
	
				setAltitude(newData.altitude);
				setAGL(newData.filtered_s);
				setGx(newData.gx);
				setGy(newData.gy);
				setGz(newData.gz);
				setLatitude(newData.latitude);
				setLongitude(newData.longitude);
				setState(newData.state);
	
				updateCharts(time, newData);
				lastMessageTime = currentTime;
	
			} catch (error) {
				setError('Error parsing message');
			}
		}
			
	}

	const updateCharts = (time, newData) => {
		// Update altitude chart
		altitudeChartRef.current.data.datasets[0].data.push({ x: time, y: newData.altitude });
		altitudeChartRef.current.data.datasets[1].data.push({ x: time, y: newData.filtered_s });
		altitudeChartRef.current.update('quiet');

		// Update velocity chart
		velocityChartRef.current.data.datasets[0].data.push({ x: time, y: newData.filtered_v });
		velocityChartRef.current.update('quiet');

		// Update acceleration chart
		accelerationChartRef.current.data.datasets[0].data.push({ x: time, y: newData.ax }); // ax
		accelerationChartRef.current.data.datasets[1].data.push({ x: time, y: newData.ay });
		accelerationChartRef.current.data.datasets[2].data.push({ x: time, y: newData.az });
		accelerationChartRef.current.data.datasets[3].data.push({ x: time, y: newData.filtered_a });
		accelerationChartRef.current.update('quiet');
	};

	useEffect(() => {
		// Set callback handlers
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;
		
		return () => {
			client.disconnect();
		};
	}, []);



  	return (
		<div className="lg:max-h-screen max-w-screen overflow-hidden">
			<main className="p-2">
				{isLoading ? (
						<div className="loader-container">
							<div className='loader'>Loading...</div>
						</div>
					) : error ? (
						<div className="loader-container">
							<div className='loader'>Error: {error}</div>
						</div>
					) : (
						<>
						<div id='connected' className="text-sm lg:text-base text-center">
							MQTT not connected
						</div>
						<div className="text-xs lg:text-base md:w-2/3 mx-auto font-bold flex flex-wrap justify-between">
							<span className=' text-3xl'>
							T{true?'-':'+'} <Countdown target="April 27, 2024 13:00:00"/>
							</span>
							<span>State:
								{[
									'PRE_FLIGHT',
									'POWERED_FLIGHT',
									'APOGEE',
									'BALLISTIC_DESCENT',
									'PARACHUTE_DESCENT',
									'POST_FLIGHT'
									][parseInt(state)]} 
							</span>
							<span>AGL: {agl}m</span>
							<span>APOGEE: {apogee}m</span>
							<button onClick={e=>{document.getElementById('settings').style.visibility='visible'}}><img src={setting} className=""/></button>
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-3">
							<div>
								<div className='choice'>
									<button id={stream? 'active' : ''} onClick={(e) => {setStream(true)}}>
										Live Stream
									</button>
									<button id={stream? '' : 'active'} onClick={(e) => {setStream(false)}}>
										Map
									</button>
								</div>
								{
								stream?
								<Video/>
								:
								<Map position={[latitude,longitude]}/>
								}
							</div>
							{/* <Telemetry /> */}
							<div className="lg:order-first w-full lg:w-12/12 lg:col-span-2">
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
						</>
				)}
			</main>
		</div>
  	)
}

export default App;
