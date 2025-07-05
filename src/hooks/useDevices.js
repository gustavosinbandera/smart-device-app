// src/hooks/useDevices.js
import { useEffect, useState } from 'react';
import { fetchDevices } from '../services/api';

/**
 * Genera un historial de señal de longitud `length` a partir de un nivel inicial.
 * Los valores varían suavemente entre 0 y 5.
 */
function generateSignalHistory(initialLevel, length = 100) {
  const history = [];
  let current = initialLevel;
  for (let i = 0; i < length; i++) {
    // delta en {-1, 0, +1}
    const delta = Math.floor(Math.random() * 3) - 1;
    current = Math.max(0, Math.min(5, current + delta));
    history.push(current);
  }
  return history;
}

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('id_token'); // mantenemos id_token
    if (!token) {
      setError('No se encontró id_token en localStorage.');
      setLoading(false);
      return;
    }

    fetchDevices(token)
      .then(data => {
        // Aseguramos array y enriquecemos con signalHistory
        const arr = Array.isArray(data) ? data : [];
        const enriched = arr.map(device => {
          // si ya trae signalHistory, lo respetamos
          if (Array.isArray(device.signalHistory) && device.signalHistory.length) {
            return device;
          }
          // obtenemos nivel actual o usamos 3 por defecto
          const level =
            typeof device.signalLevel === 'number' ? device.signalLevel : 3;
          return {
            ...device,
            signalHistory: generateSignalHistory(level, 10),
          };
        });
        setDevices(enriched);
      })
      .catch(err => {
        console.error('Error en useDevices:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { devices, loading, error };
}
