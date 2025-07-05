// src/hooks/useDevices.js
import { useEffect, useState } from 'react';
import { fetchDevices } from '../services/api';

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
      .then(data => setDevices(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { devices, loading, error };
}
