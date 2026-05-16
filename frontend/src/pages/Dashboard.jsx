import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import HealthChart from '../components/charts/HealthChart';
import LiveMap from '../components/maps/LiveMap';
import AlertModal from '../components/alerts/AlertModal';
import WatchConnect from '../components/bluetooth/WatchConnect';

const Dashboard = () => {
    const [vitals, setVitals] = useState({
        heartRate: 75,
        spO2: 98,
        temperature: 36.5,
        fallDetected: false,
        gps: { latitude: 28.6139, longitude: 77.2090 },
        timestamp: new Date().toISOString()
    });
    const [history, setHistory] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('Apple'); // Default to Apple

    useEffect(() => {
        // Get real location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setVitals(prev => ({
                    ...prev,
                    gps: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                }));
            }, (err) => {
                console.warn('Geolocation failed:', err.message);
            });
        }
    }, []);

    useEffect(() => {
        socket.on('vitalsUpdate', (data) => {
            console.log('Received vitals update:', data);
            
            // Robust handling for both formats: {log, alerts} or just log
            const logData = data.log || data;
            const alertsData = data.alerts || [];
            
            setVitals(logData);

            // Update history (keep last 20)
            setHistory((prev) => {
                const newHistory = [...prev, logData];
                if (newHistory.length > 20) {
                    return newHistory.slice(newHistory.length - 20);
                }
                return newHistory;
            });

            // Handle alerts
            if (alertsData && alertsData.length > 0) {
                setCurrentAlert(alertsData[0]); // Show the first alert
                setIsAlertOpen(true);
            }
        });

        return () => {
            socket.off('vitalsUpdate');
        };
    }, []);

    const handleCloseAlert = () => {
        setIsAlertOpen(false);
    };

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-cyan-400">Emergency Health Monitor</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="text-gray-400 text-sm uppercase font-bold">Supported Devices:</span>
                        <span 
                            onClick={() => setSelectedBrand('Noise')}
                            className={`${selectedBrand === 'Noise' ? 'bg-cyan-600 border-cyan-400' : 'bg-gray-800 border-gray-700'} text-white text-sm px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 hover:border-cyan-500 transition-colors cursor-pointer`}
                        >
                            Noise
                        </span>
                        <span 
                            onClick={() => setSelectedBrand('Apple')}
                            className={`${selectedBrand === 'Apple' ? 'bg-white text-black border-white' : 'bg-gray-800 text-white border-gray-700'} text-sm px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 hover:border-white transition-colors cursor-pointer`}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05 1.88-3.08 1.88-.98 0-1.28-.58-2.45-.58-1.17 0-1.53.56-2.43.58-1.05.02-2.22-1-3.18-1.92-2.12-2.01-3.65-5.69-3.65-8.73 0-4.83 2.97-7.38 5.75-7.38 1.48 0 2.68.85 3.5.85.78 0 2.15-.9 3.75-.9 1.35 0 3.12.52 4.18 1.95-3.32 1.85-2.75 6.08.55 7.33-1.1 2.53-2.43 5.02-3.94 6.9zM12.03 4.35c.75-1.02 1.25-2.45 1.1-3.85-1.18.05-2.6 0-3.4 1.15-.7.83-1.2 2.18-1.05 3.52 1.32.1 2.55-.5 3.35-1.35z"/></svg>
                            Apple
                        </span>
                        <span 
                            onClick={() => setSelectedBrand('Samsung')}
                            className={`${selectedBrand === 'Samsung' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-blue-900/30 text-blue-400 border-blue-800/50'} text-sm px-3 py-1.5 rounded-lg border font-bold hover:border-blue-500 transition-colors cursor-pointer`}
                        >
                            SAMSUNG
                        </span>
                        <span 
                            onClick={() => setSelectedBrand('Boult')}
                            className={`${selectedBrand === 'Boult' ? 'bg-orange-600 border-orange-400' : 'bg-gray-800 border-gray-700'} text-white text-sm px-3 py-1.5 rounded-lg border font-semibold hover:border-cyan-500 transition-colors cursor-pointer`}
                        >
                            Boult
                        </span>
                        <span 
                            onClick={() => setSelectedBrand('boAt')}
                            className={`${selectedBrand === 'boAt' ? 'bg-teal-600 border-teal-400 text-white' : 'bg-teal-900/30 text-teal-400 border-teal-800/50'} text-sm px-3 py-1.5 rounded-lg border font-bold hover:border-teal-500 transition-colors cursor-pointer`}
                        >
                            boAt
                        </span>
                        <span 
                            onClick={() => setSelectedBrand('Whoop')}
                            className={`${selectedBrand === 'Whoop' ? 'bg-red-600 border-red-400 text-white' : 'bg-red-900/30 text-red-400 border-red-800/50'} text-sm px-3 py-1.5 rounded-lg border font-semibold hover:border-red-500 transition-colors cursor-pointer`}
                        >
                            Whoop
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <WatchConnect />
                    <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        <span className="text-gray-300 text-sm font-medium">Live Connection</span>
                    </div>
                </div>
            </header>

            {/* Emergency Banner */}
            {isAlertOpen && currentAlert && (
                <div className="bg-red-600/90 backdrop-blur-sm text-white p-4 rounded-xl mb-6 flex justify-between items-center border border-red-500 shadow-lg shadow-red-900/20">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-bold mr-2">EMERGENCY:</span> {currentAlert.message}
                    </div>
                    <button
                        onClick={handleCloseAlert}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-lg transition-colors text-sm font-semibold"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {vitals ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Vitals Cards */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Heart Rate */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-red-500 transition-colors cursor-pointer">
                            <div className="flex justify-between items-center">
                                <h2 className="text-gray-400 text-sm uppercase font-semibold">Heart Rate</h2>
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                            </div>
                            <p className="text-5xl font-bold text-red-500 mt-2">{vitals.heartRate} <span className="text-lg text-gray-500 font-normal">bpm</span></p>
                        </div>

                        {/* SpO2 */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-cyan-500 transition-colors cursor-pointer">
                            <div className="flex justify-between items-center">
                                <h2 className="text-gray-400 text-sm uppercase font-semibold">SpO2</h2>
                                <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
                            </div>
                            <p className="text-5xl font-bold text-cyan-500 mt-2">{vitals.spO2} <span className="text-lg text-gray-500 font-normal">%</span></p>
                        </div>

                        {/* Temperature */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors cursor-pointer">
                            <div className="flex justify-between items-center">
                                <h2 className="text-gray-400 text-sm uppercase font-semibold">Temperature</h2>
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v6.758a3.001 3.001 0 102 0V3a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            </div>
                            <p className="text-5xl font-bold text-yellow-500 mt-2">{vitals.temperature} <span className="text-lg text-gray-500 font-normal">°C</span></p>
                        </div>

                        {/* Fall Detection */}
                        <div className={`bg-gray-800 p-6 rounded-xl border transition-colors cursor-pointer ${vitals.fallDetected ? 'border-red-600 animate-pulse' : 'border-gray-700 hover:border-green-500'}`}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-gray-400 text-sm uppercase font-semibold">Fall Status</h2>
                                <svg className={`w-5 h-5 ${vitals.fallDetected ? 'text-red-500' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            </div>
                            <p className={`text-3xl font-bold mt-2 ${vitals.fallDetected ? 'text-red-600' : 'text-green-500'}`}>
                                {vitals.fallDetected ? 'FALL DETECTED' : 'Normal'}
                            </p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                        <HealthChart data={history} title="Heart Rate Trend" dataKey="heartRate" color="#ef4444" />
                        <HealthChart data={history} title="SpO2 Trend" dataKey="spO2" color="#06b6d4" />
                    </div>

                    {/* Map & Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <LiveMap position={vitals.gps} vitals={vitals} />

                        {/* Device Info */}
                        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                            <h3 className="text-gray-400 text-sm uppercase font-semibold mb-3">Device Information</h3>
                            <div className="space-y-2 text-sm">
                                <p className="flex justify-between"><span className="text-gray-500">Connected Device:</span> <span className="font-bold text-cyan-400">{selectedBrand} Watch</span></p>
                                <p className="flex justify-between"><span className="text-gray-500">Device ID:</span> <span className="font-mono text-white">ESP32_WEARABLE_01</span></p>
                                <p className="flex justify-between"><span className="text-gray-500">Status:</span> <span className="text-green-500 font-semibold">Active</span></p>
                                <p className="flex justify-between"><span className="text-gray-500">Last Updated:</span> <span className="text-white">{new Date(vitals.timestamp).toLocaleTimeString()}</span></p>
                            </div>
                        </div>

                        {/* Compatible Brands */}
                        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                            <h3 className="text-gray-400 text-sm uppercase font-semibold mb-3">Compatible Brands</h3>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="flex items-center bg-gray-900/50 p-2.5 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
                                    <span className="text-white font-medium">Noise</span>
                                </div>
                                <div className="flex items-center bg-gray-900/50 p-2.5 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
                                    <span className="text-white font-medium">Apple Watch</span>
                                </div>
                                <div className="flex items-center bg-gray-900/50 p-2.5 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
                                    <span className="text-white font-medium">Samsung Galaxy</span>
                                </div>
                                <div className="flex items-center bg-gray-900/50 p-2.5 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
                                    <span className="text-white font-medium">Boult</span>
                                </div>
                                <div className="flex items-center bg-gray-900/50 p-2.5 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
                                    <span className="text-white font-medium">boAt</span>
                                </div>
                                <div className="flex items-center bg-gray-900/50 p-2.5 rounded-lg border border-gray-700 hover:border-cyan-500 transition-colors">
                                    <span className="text-white font-medium">Whoop</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-96 bg-gray-800 rounded-xl border border-gray-700">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-gray-400 text-lg">Initializing connection and waiting for data...</p>
                        <p className="text-gray-600 text-sm mt-2">Make sure the simulator is running.</p>
                    </div>
                </div>
            )}

            {/* Alert Modal */}
            <AlertModal isOpen={isAlertOpen} onClose={handleCloseAlert} alert={currentAlert} />
        </div>
    );
};

export default Dashboard;
