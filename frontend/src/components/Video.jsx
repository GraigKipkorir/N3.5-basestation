import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Map from './Map';
import logo from '../assets/nakuja_logo.png'

function Video({ url }) {
	console.log('video', url);
	const image = useRef(null);
	let [stream,setStream] = useState(true);

	useEffect(() => {
		gsap.to(image.current, {
			rotation: '+=360',
			scale: 0.5,
			repeat: -1,
			yoyo: true,
			duration: 0.7,
			ease: 'power2.inOut',
		});
	}, []);
	

	return (
		<>
		<div className="w-full h-[297px] md:h-[603px] lg:h-[500px] bg-black flex justify-center items-center">
					<div ref={image}>
						<img
							alt="logo"
							src={logo}
							width="90"
							height="80"
						/>
					</div>
				</div>
		</>
	);
}

export default Video;
