import { useState, useEffect } from 'react';

export function useRaspberryPis() {
  const [raspberries, setRaspberries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchRaspberries = async () => {
      try {
        const idToken = localStorage.getItem('id_token');
        if (!idToken) throw new Error('Token no encontrado');

        const res = await fetch(`${process.env.REACT_APP_API_URL}/raspberry-pis`, {
          headers: {
            Authorization: idToken
          }
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Error al obtener Raspberry Pis');
        }

        const data = await res.json();
        setRaspberries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRaspberries();
  }, []);

  return { raspberries, loading, error };
}
