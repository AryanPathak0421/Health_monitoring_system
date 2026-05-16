import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveMap = ({ position, vitals }) => {
    if (!position || !position.latitude || !position.longitude) {
        return (
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 h-80 flex items-center justify-center">
                <p className="text-gray-400">Waiting for GPS data...</p>
            </div>
        );
    }

    const center = [position.latitude, position.longitude];

    return (
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm uppercase font-semibold mb-4">Live Location</h3>
            <div className="h-80 rounded-lg overflow-hidden">
                <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={center}>
                        <Popup>
                            <div className="text-gray-900">
                                <h4 className="font-bold">Patient Location</h4>
                                <p>HR: {vitals?.heartRate} bpm</p>
                                <p>SpO2: {vitals?.spO2}%</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default LiveMap;
