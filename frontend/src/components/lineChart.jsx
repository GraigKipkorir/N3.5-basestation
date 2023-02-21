import { useState, useEffect, forwardRef,memo } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	StreamingPlugin
);

let LineChart = forwardRef( (props,ref) => {
    let ylabel;
    let dataset = [{}];   

    switch(props.type){
        case 'altitude':
            ylabel = 'Altitude (m)';
            dataset = [
				{
					id: 1,
					label: 'filtered altitude',
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
					borderColor: 'rgb(255, 99, 132)',
					data: [],
					borderWidth: 2,
					pointRadius: 2,
				},
				{
					id: 2,
					label: 'raw altitude',
					backgroundColor: 'rgba(54, 162, 235, 0.5)',
					borderColor: 'rgb(54, 162, 235)',
					data: [],
					pointRadius: 2,
				},
			];
            break;
        case 'velocity':
            ylabel = 'Velocity (m/s)';
            dataset = [
				{
					id: 1,
					label: 'filtered velocity',
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
					borderColor: 'rgb(255, 99, 132)',
					data: [],
				},
			];
            break;
        case 'acceleration':
            ylabel = 'Acceleration (m/s^2)';
            dataset = [
				{
					id: 1,
					label: 'filtered acceleration',
					backgroundColor: 'rgba(255, 99, 132, 0.5)',
					borderColor: 'rgb(255, 99, 132)',
					data: [],
				},
				{
					id: 2,
					label: 'ax',
					backgroundColor: 'rgba(54, 162, 235, 0.5)',
					borderColor: 'rgb(54, 162, 235)',
					data: [],
				},
				{
					id: 3,
					label: 'ay',
					borderColor: 'rgb(255,165,0)',
					backgroundColor: 'rgb(255,165,0,0.1)',
					data: [],
				},
				{
					id: 4,
					label: 'az',
					borderColor: 'rgb(60,186,159)',
					backgroundColor: 'rgb(60,186,159,0.1)',
					data: [],
				},
			];
            break;
        case 'gyroscope':
            ylabel = 'Gyroscope (rad/s)';
            break;
        default:
            ylabel = 'Altitude (m)';
    }

    const data = {
        datasets: dataset,
    };
  const options = {
		datasets: {
			line: {
				borderWidth: 1,
				pointRadius: 1,
			},
		},
		scales: {
			x: {
				type: 'realtime',
				realtime: {
					// 	delay: 2000,
					// pause: false,
					// ttl: 60000,
					// duration: 20000,
					// frameRate: 30,
				},
				ticks: {
					font: {
						size: 12,
						weight: 'bolder',
					},
					color: '#000',
				},
				title: {
					display: true,
					text: 'Time',
					font: {
						size: 18,
						weight: 'bolder',
					},
					color: '#000',
				},
			},
			y: {
				ticks: {
					font: {
						size: 15,
						weight: 'bolder',
					},
					color: '#000',
				},
				title: {
					display: true,
					text: ylabel,
					font: {
						size: 18,
						weight: 'bolder',
					},
					color: '#000',
				},
			},
		},
		plugins: {
			legend: {
				position: 'top',
				align: 'end',
			},
			title: {
				display: false,
				text: 'Telemetry Graph',
			},
		},
	};
    return(<Line ref={ref} data={data} options={options} />);
})
export default memo(LineChart);