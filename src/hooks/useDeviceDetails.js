// src/hooks/useDeviceDetails.js
import { useEffect, useState } from 'react';

export function useDeviceDetails(deviceId) {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deviceId) return;

    const token = localStorage.getItem('id_token');
    if (!token) {
      setError('No se encontró id_token en localStorage.');
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/devices/${deviceId}`, {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Formato inesperado de datos');
        }

        // ⚠️ Filtrar cuidadosamente para evitar items sin sk
        const metadata = data.find(item => item?.sk === '#METADATA#');

        const aliases = data
          .filter(item => item && typeof item.sk === 'string' && item.sk.startsWith('GPIO#'))
          .map(item => ({
            gpio: item.gpio,
            aliases: item.aliases || [],
            direction: item.direction || '',
            type: item.type || ''
          }));

        if (!metadata) {
          throw new Error('No se encontró metadata del dispositivo');
        }

        setDevice({ ...metadata, aliases });
      })
      .catch(err => {
        console.error('Error en useDeviceDetails:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [deviceId]);

  return { device, loading, error };
}
