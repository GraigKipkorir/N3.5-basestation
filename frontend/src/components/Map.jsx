import {useEffect, useState, useRef} from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

export default function Map({position}){
    let markerRef = useRef(null);
    useEffect(()=>{
        if(markerRef.current && position){
            markerRef.current.setLatLng(position);
        }
    },[position]);

    return(
        <div>
            <h3>Map</h3>
            <MapContainer style={{height:"500px"}} center={position} zoom={15} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a> contributors'
                    url="http://[::]:8080/styles/basic-preview/{z}/{x}/{y}.png"
                />
                {position && <Marker ref={markerRef} position={position}/>}
            </MapContainer>
        </div>
    )
}