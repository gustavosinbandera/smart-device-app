import { useEffect, useState } from 'react';
import { fetchDevices } from '../services/api';

/**
 * Genera un historial de señal de longitud `length` a partir de un nivel inicial.
 */
function generateSignalHistory(initialLevel, length = 100) {
  const history = [];
  let current = initialLevel;
  for (let i = 0; i < length; i++) {
    const delta = Math.floor(Math.random() * 3) - 1; // {-1, 0, +1}
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
    const token = localStorage.getItem('id_token');
    if (!token) {
      setError('No se encontró id_token en localStorage.');
      setLoading(false);
      return;
    }

    fetchDevices(token)
      .then(data => {
        const raw = Array.isArray(data) ? data : [];

        const enriched = raw.map(device => {
          const level = typeof device.signalLevel === 'number' ? device.signalLevel : 3;

          // Puedes agregar aquí estadísticas si quieres, como número de GPIOs por tipo
          const digital_inputs = device.aliases?.filter(a => a.direction === 'input' && a.type === 'digital').length || 0;
          const digital_outputs = device.aliases?.filter(a => a.direction === 'output' && a.type === 'digital').length || 0;
          const analog_inputs = device.aliases?.filter(a => a.direction === 'input' && a.type === 'analog').length || 0;
          const analog_outputs = device.aliases?.filter(a => a.direction === 'output' && a.type === 'analog').length || 0;

          return {
            ...device,
            digital_inputs,
            digital_outputs,
            analog_inputs,
            analog_outputs,
            signalHistory: generateSignalHistory(level, 10)
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
