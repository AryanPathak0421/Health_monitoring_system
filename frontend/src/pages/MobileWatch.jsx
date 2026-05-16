import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MobileWatch = () => {
    const [heartRate, setHeartRate] = useState(72);
    const [spO2, setSpO2] = useState(98);
    const [temperature, setTemperature] = useState(36.6);
    const [gps, setGps] = useState({ latitude: null, longitude: null });
    const [fallDetected, setFallDetected] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const DUMMY_USER_ID = '6643c5685eb5423bbc457d16'; // Using the same dummy ID

    useEffect(() => {
        // Get Real GPS Location
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setGps({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => console.error('GPS Error:', error),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    useEffect(() => {
        // Real Motion Detection (Fall Simulation)
        const handleMotion = (event) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;
            
            const totalAcc = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
            
            // If acceleration spikes (e.g., phone is shaken or dropped)
            if (totalAcc > 25) { 
                setFallDetected(true);
                // Vibrate device
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
                // Reset after 3 seconds
                setTimeout(() => setFallDetected(false), 3000);
            }
        };

        window.addEventListener('devicemotion', handleMotion);
        return () => window.removeEventListener('devicemotion', handleMotion);
    }, []);

    const sendData = async (forceEmergency = false) => {
        setIsSending(true);
        try {
            await axios.post('http://10.0.0.13:5000/api/health/data', {
                userId: DUMMY_USER_ID,
                heartRate: forceEmergency ? 130 : heartRate,
                spO2: forceEmergency ? 85 : spO2,
                temperature: forceEmergency ? 39.5 : temperature,
                fallDetected: forceEmergency ? true : fallDetected,
                gps: gps.latitude ? gps : { latitude: 28.6139, longitude: 77.2090 } // Fallback to Delhi if GPS fails
            });
            console.log('Watch data sent successfully');
        } catch (error) {
            console.error('Failed to send watch data:', error.message);
        }
        setTimeout(() => setIsSending(false), 500);
    };

    // Auto-send data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => sendData(false), 5000);
        return () => clearInterval(interval);
    }, [heartRate, spO2, temperature, fallDetected, gps]);

    const triggerSOS = () => {
        sendData(true);
        // Vibrate device
        if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500]);
        }
        alert('SOS Alert Sent to Caregivers!');
    };

    return (
        <div className="bg-gray-950 min-h-screen flex items-center justify-center p-4">
            <div className="bg-gray-900 w-full max-w-sm rounded-[3rem] border-8 border-gray-800 p-6 shadow-2xl relative overflow-hidden">
                {/* Watch Bezel Accent */}
                <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-[2.8rem] pointer-events-none"></div>

                <div className="text-center mb-4">
                    <h1 className="text-sm uppercase tracking-widest text-gray-500 font-bold">Smartwatch Mode</h1>
                    <div className="flex items-center justify-center mt-1">
                        <span className={`w-2 h-2 rounded-full mr-2 ${isSending ? 'bg-cyan-500 animate-pulse' : 'bg-green-500'}`}></span>
                        <span className="text-xs text-gray-400">{isSending ? 'Transmitting...' : 'Sensor Active'}</span>
                    </div>
                </div>

                {/* Vitals Display (Simulated with Sliders for Demo) */}
                <div className="space-y-3">
                    {/* Heart Rate */}
                    <div className="bg-gray-800/50 p-3 rounded-2xl border border-gray-700">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400 uppercase">Heart Rate</span>
                            <span className="text-2xl font-bold text-red-500">{heartRate} <span className="text-xs font-normal">BPM</span></span>
                        </div>
                        <input 
                            type="range" min="40" max="150" value={heartRate} 
                            onChange={(e) => setHeartRate(Number(e.target.value))}
                            className="w-full accent-red-500"
                        />
                    </div>

                    {/* SpO2 */}
                    <div className="bg-gray-800/50 p-3 rounded-2xl border border-gray-700">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-400 uppercase">Oxygen (SpO2)</span>
                            <span className="text-2xl font-bold text-cyan-500">{spO2}<span className="text-xs font-normal">%</span></span>
                        </div>
                        <input 
                            type="range" min="80" max="100" value={spO2} 
                            onChange={(e) => setSpO2(Number(e.target.value))}
                            className="w-full accent-cyan-500"
                        />
                    </div>
                </div>

                {/* Real Sensor Status */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className={`p-3 rounded-xl text-center text-xs font-bold border ${fallDetected ? 'bg-red-600/20 border-red-600 text-red-500 animate-pulse' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}>
                        {fallDetected ? 'FALL DETECTED' : 'MOTION OK'}
                    </div>
                    <div className="p-3 bg-gray-800/50 border border-gray-700 text-gray-400 rounded-xl text-center text-xs font-bold">
                        GPS: {gps.latitude ? 'LOCKED' : 'SEARCHING'}
                    </div>
                </div>

                {/* SOS Button */}
                <button
                    onClick={triggerSOS}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl mt-4 transition-colors text-lg shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    SOS BUTTON
                </button>
                
                <p className="text-center text-gray-600 text-xs mt-3">Shake phone to simulate fall</p>
            </div>
        </div>
    );
};

export default MobileWatch;
