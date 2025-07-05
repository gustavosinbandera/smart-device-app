// src/pages/DevicesPage.js
import React, { useEffect, useState } from 'react';

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '24px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '16px',
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

function DevicesPage() {
  const [devices, setDevices] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // o 'id_token' si prefieres

    if (!token) {
      setError('No se encontró token de acceso.');
      return;
    }

    fetch('https://4koo6afax7.execute-api.us-east-1.amazonaws.com/Prod/devices', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setDevices(data);
      })
      .catch(err => {
        console.error('❌ Error al obtener dispositivos:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <h1>Dispositivos</h1>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {!devices && !error && <p>Cargando dispositivos...</p>}

      {devices && devices.length === 0 && <p>No hay dispositivos registrados.</p>}

      {devices && devices.length > 0 && (
        <div style={gridStyle}>
          {devices.map(device => (
            <div key={device.device_id} style={cardStyle}>
              <h2 style={{ marginTop: 0 }}>{device.device_id}</h2>
              <p><strong>Tipo:</strong> {device.type}</p>
              <p><strong>Raspberry Pi:</strong> {device.raspi_id}</p>
              <p><strong>Entradas digitales:</strong> {device.digital_inputs}</p>
              <p><strong>Salidas digitales:</strong> {device.digital_outputs}</p>
              <p><strong>Entradas analógicas:</strong> {device.analog_inputs}</p>
              <p><strong>Salidas analógicas:</strong> {device.analog_outputs}</p>
              <p><strong>Registrado en:</strong> {new Date(device.registered_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DevicesPage;
