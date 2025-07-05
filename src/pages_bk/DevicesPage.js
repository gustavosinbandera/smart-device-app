// src/pages/DevicesPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';

export default function DevicesPage() {
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

    fetch('https://4koo6afax7.execute-api.us-east-1.amazonaws.com/Prod/devices', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setDevices(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dispositivos
      </Typography>

      {loading && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          ❌ {error}
        </Alert>
      )}

      {!loading && !error && devices.length === 0 && (
        <Alert severity="info" sx={{ mt: 4 }}>
          No hay dispositivos registrados.
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {devices.map(device => (
          <Grid item key={device.device_id} xs={12} sm={6} md={4}>
            <Card elevation={3}>
              <CardHeader
                title={device.device_id}
                subheader={device.type}
              />
              <CardContent>
                <Typography variant="body2">
                  <strong>Raspberry Pi:</strong> {device.raspi_id}
                </Typography>
                <Typography variant="body2">
                  <strong>Entradas digitales:</strong> {device.digital_inputs}
                </Typography>
                <Typography variant="body2">
                  <strong>Salidas digitales:</strong> {device.digital_outputs}
                </Typography>
                <Typography variant="body2">
                  <strong>Entradas analógicas:</strong> {device.analog_inputs}
                </Typography>
                <Typography variant="body2">
                  <strong>Salidas analógicas:</strong> {device.analog_outputs}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Registrado en:</strong>{' '}
                  {new Date(device.registered_at).toLocaleString('es-CO')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
