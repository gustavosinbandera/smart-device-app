import { useEffect, useState } from 'react';

export default function useGpsHistory(deviceId) {
  const [gpsPoints, setGpsPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🛰️ [useGpsHistory] Iniciando carga de historial GPS...");

    if (!deviceId) return;

    const token = localStorage.getItem('id_token');
    if (!token) {
      console.warn('Token no encontrado en localStorage');
      setLoading(false);
      return;
    }

    const start = new Date(Date.now() - 1000 * 60 * 60).toISOString(); // última hora
    const end = new Date().toISOString();

    fetch(`${process.env.REACT_APP_API_URL}/get-gps-history?device_id=${deviceId}&start=${start}&end=${end}`, {
      headers: {
        Authorization: token
      }
    })
      .then(res => {
        console.log('[useGpsHistory] Respuesta cruda:', res);
        if (!res.ok) throw new Error('Error al obtener datos GPS');
        return res.json();
      })
      .then(data => {
        console.log('[useGpsHistory] Datos recibidos:', data);
        const points = data.map(p => ({
          latitude: p.lat,
          longitude: p.lon
        }));
        setGpsPoints(points);
      })
      .catch(err => {
        console.error('[useGpsHistory] Error:', err);
      })
      .finally(() => setLoading(false));
  }, [deviceId]);

  return { gpsPoints, loading };
}
