import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import logo from '../assets/nakuja_logo.png'

let url="ws://127.0.0.1:8080";
let socket = {};

export default function Video() {
	console.log('video', url);
	let autoReconnect;

	const image = useRef(null);
	let [stream,setStream] = useState(false);
	let [frame, setFrame] = useState("");

	let animate = ()=>{
		gsap.to(image.current, {
			rotation: '+=360',
			scale: 0.5,
			repeat: -1,
			yoyo: true,
			duration: 0.7,
			ease: 'power2.inOut',
		});
	}
	useEffect(() => {
		animate();
		socket = new WebSocket(url);
		socket.onopen = () => {
            setStream(true);
			console.log("Socket connected");
			clearInterval(autoReconnect);
        }
		socket.onclose = ()=>{
			setStream(false);
			console.log("Lost Socket");
			autoReconnect = setInterval(()=>{
				socket = new WebSocket(url);
			}, 3000);
		}
		socket.onmessage = e => {
			console.log("new frame");
			let jpeg = URL.createObjectURL(new Blob([e.data], { type: 'image/jpeg' }));
			setFrame(jpeg);
		}
	}, []);
	useEffect(()=>{animate()},[stream]);

	return (
		<>
			<div className="w-full h-[297px] md:h-[603px] lg:h-[500px] bg-black flex justify-center items-center">
				{
					!stream && 
					<div ref={image}>
						<img
							alt="logo"
							src={logo}
							width="90"
							height="80"
						/>
					</div>
				}
				{
					stream && 
					<img className='text-white w-full h-full' src={frame} alt="streaming..." />
				}
			</div>
		</>
	);
}
