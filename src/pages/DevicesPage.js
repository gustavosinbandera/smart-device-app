// src/pages/DevicesPage.js
import React, { useEffect, useState } from 'react';

function DevicesPage() {
  const [devices, setDevices] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('id_token'); // ✅ Usa access_token, no id_token

    if (!token) {
      setError('No se encontró token de acceso.');
      return;
    }

    fetch('https://4koo6afax7.execute-api.us-east-1.amazonaws.com/Prod/devices', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
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
    <div>
      <h1>Dispositivos</h1>
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      {devices ? (
        <pre>{JSON.stringify(devices, null, 2)}</pre>
      ) : (
        <p>Cargando dispositivos...</p>
      )}
    </div>
  );
}

export default DevicesPage;
