import React, { createContext, useState } from 'react';
import axios from 'axios';

export const BluetoothContext = createContext();

const DUMMY_USER_ID = '6643c5685eb5423bbc457d16';

export const BluetoothProvider = ({ children }) => {
    const [device, setDevice] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [heartRate, setHeartRate] = useState(null);
    const [error, setError] = useState(null);

    const parseHeartRate = (value) => {
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        let index = 1;
        if (rate16Bits) {
            const hr = value.getUint16(index, true);
            return hr;
        } else {
            const hr = value.getUint8(index);
            return hr;
        }
    };

    const sendVitalsToBackend = async (hr) => {
        // Try to get real location from browser
        navigator.geolocation.getCurrentPosition(async (position) => {
            const gps = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            
            try {
                await axios.post('http://10.0.0.13:5000/api/health/data', {
                    userId: DUMMY_USER_ID,
                    heartRate: hr,
                    spO2: 98,
                    temperature: 36.6,
                    fallDetected: false,
                    gps: gps
                });
                console.log('[BLE] Sent HR and Real GPS to backend:', hr);
            } catch (error) {
                console.error('[BLE] Error sending data to backend:', error.message);
            }
        }, async (err) => {
            console.warn('Geolocation failed or denied, using fallback location:', err.message);
            // Fallback to hardcoded location if GPS fails
            try {
                await axios.post('http://10.0.0.13:5000/api/health/data', {
                    userId: DUMMY_USER_ID,
                    heartRate: hr,
                    spO2: 98,
                    temperature: 36.6,
                    fallDetected: false,
                    gps: {
                        latitude: 28.6139,
                        longitude: 77.2090
                    }
                });
            } catch (error) {
                console.error('[BLE] Error sending fallback data:', error.message);
            }
        });
    };

    const connectDevice = async () => {
        try {
            setError(null);
            if (!navigator.bluetooth) {
                throw new Error('Web Bluetooth API is unsupported in this browser. Use Chrome or Edge.');
            }

            const selectedDevice = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['battery_service', 'heart_rate']
            });

            const server = await selectedDevice.gatt.connect();
            setDevice(selectedDevice);
            setIsConnected(true);

            let servicesFound = 0;

            // Read Battery Level
            try {
                const service = await server.getPrimaryService('battery_service');
                const characteristic = await service.getCharacteristic('battery_level');
                const value = await characteristic.readValue();
                setBatteryLevel(value.getUint8(0));
                servicesFound++;

                characteristic.addEventListener('characteristicvaluechanged', (event) => {
                    setBatteryLevel(event.target.value.getUint8(0));
                });
                await characteristic.startNotifications();
            } catch (err) {
                console.warn('Battery service not available:', err.message);
            }

            // Read Heart Rate
            try {
                const service = await server.getPrimaryService('heart_rate');
                const characteristic = await service.getCharacteristic('heart_rate_measurement');
                servicesFound++;
                
                characteristic.addEventListener('characteristicvaluechanged', (event) => {
                    const hr = parseHeartRate(event.target.value);
                    setHeartRate(hr);
                    sendVitalsToBackend(hr); // Send to backend!
                });
                await characteristic.startNotifications();
            } catch (err) {
                console.warn('Heart rate service not available:', err.message);
            }

            if (servicesFound === 0) {
                setError('Connected, but device does not expose Heart Rate or Battery services.');
            }

            // Handle Disconnection
            selectedDevice.addEventListener('gattserverdisconnected', () => {
                setIsConnected(false);
                setDevice(null);
                setBatteryLevel(null);
                setHeartRate(null);
            });

        } catch (err) {
            setError(err.message);
            console.error('Bluetooth connection failed:', err);
        }
    };

    const disconnectDevice = () => {
        if (device && device.gatt.connected) {
            device.gatt.disconnect();
        }
        setIsConnected(false);
        setDevice(null);
        setBatteryLevel(null);
        setHeartRate(null);
    };

    return (
        <BluetoothContext.Provider value={{ device, isConnected, batteryLevel, heartRate, error, connectDevice, disconnectDevice }}>
            {children}
        </BluetoothContext.Provider>
    );
};
