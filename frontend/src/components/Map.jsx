import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

export default function Map(){
    return(
        <div>
            <h3>Map</h3>
            <MapContainer style={{height:"500px"}} center={[-1.091176, 37.011073]} zoom={15} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href=\"https://www.maptiler.com/copyright/\" target=\"_blank\">&copy; MapTiler</a> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a> contributors'
                    url="http://[::]:8080/styles/basic-preview/{z}/{x}/{y}.png"
                />
                <Marker position={[-1.091176, 37.011073]}>
                    <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}