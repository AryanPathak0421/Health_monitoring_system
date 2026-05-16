import React from 'react';
import { useBluetooth } from './useBluetooth';

const WatchConnect = () => {
    const { device, isConnected, batteryLevel, error, connectDevice, disconnectDevice } = useBluetooth();

    return (
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-colors shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider">Device Connectivity</h3>
                    <p className="text-white font-semibold mt-0.5">Galaxy Watch</p>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${isConnected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </div>
            </div>

            {isConnected && device ? (
                <div className="space-y-3">
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-xl mb-3">
                            <p className="text-red-500 text-xs">{error}</p>
                        </div>
                    )}
                    <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700">
                        <p className="text-sm flex justify-between"><span className="text-gray-500">Name:</span> <span className="text-white font-mono">{device.name || 'Unknown Device'}</span></p>
                        {batteryLevel !== null && (
                            <p className="text-sm flex justify-between mt-1"><span className="text-gray-500">Battery:</span> <span className="text-cyan-500 font-bold">{batteryLevel}%</span></p>
                        )}
                    </div>
                    
                    <button
                        onClick={disconnectDevice}
                        className="w-full bg-gray-700 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm focus:outline-none"
                    >
                        Disconnect Device
                    </button>
                </div>
            ) : (
                <div>
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/50 p-3 rounded-xl mb-3">
                            <p className="text-red-500 text-xs">{error}</p>
                        </div>
                    )}
                    
                    <button
                        onClick={connectDevice}
                        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Scan & Connect Watch
                    </button>
                </div>
            )}
            
            <p className="text-center text-gray-600 text-xs mt-3">Requires Chrome/Edge and HTTPS/Localhost</p>
        </div>
    );
};

export default WatchConnect;
