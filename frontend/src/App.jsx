import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MobileWatch from './pages/MobileWatch';
import { BluetoothProvider } from './components/bluetooth/BluetoothContext';

function App() {
  return (
    <BluetoothProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mobile-watch" element={<MobileWatch />} />
          </Routes>
        </div>
      </Router>
    </BluetoothProvider>
  );
}

export default App;
