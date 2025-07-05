// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage           from './pages/LoginPage/LoginPage';
import CallbackPage        from './pages/CallbackPage/CallbackPage';
import DeviceDetailsPage   from './pages/DeviceDetailsPage/DeviceDetailsPage';
import DevicesPage         from './pages/DevicePage/DevicesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<LoginPage />} />
        <Route path="/callback"       element={<CallbackPage />} />
        <Route path="/devices"        element={<DevicesPage />} />
        <Route path="/devices/:deviceId" element={<DeviceDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
