// src/pages/DevicesPage/DevicesPage.js
import React, { useState, useMemo } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress } from '@mui/material';
import DeviceCard from '../../components/DeviceCard/DeviceCard';
import { useDevices } from '../../hooks/useDevices';
import styles from './DevicesPage.module.css';

export default function DevicesPage() {
  const { devices, loading, error } = useDevices();
  const [view, setView] = useState('esp32'); // 'esp32' | 'raspi'

  // Construimos la lista de Raspberry Pis únicas
  const raspberries = useMemo(() => {
    if (!devices) return [];
    const uniqIds = Array.from(new Set(devices.map(d => d.raspi_id)));
    return uniqIds.map(id => ({
      raspi_id: id,
      count: devices.filter(d => d.raspi_id === id).length,
    }));
  }, [devices]);

  // Seleccionamos qué renderizar
  const itemsToRender = view === 'esp32' ? devices : raspberries;

  return (
    <Box className={styles.root} sx={{ minHeight: '100vh' }}>
      <Box sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Dispositivos
        </Typography>

        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            ❌ {error}
          </Alert>
        )}

        {!loading && !error && devices.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay dispositivos registrados.
          </Alert>
        )}

        {/* Selector de vista */}
        {!loading && !error && devices.length > 0 && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="view-label">Ver como</InputLabel>
            <Select
              labelId="view-label"
              value={view}
              label="Ver como"
              onChange={e => setView(e.target.value)}
            >
              <MenuItem value="esp32">ESP32</MenuItem>
              <MenuItem value="raspi">Raspberry Pi</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Grid de tarjetas */}
        {!loading && !error && itemsToRender.length > 0 && (
          <Grid container spacing={3}>
            {view === 'esp32' &&
              devices.map(device => (
                <Grid item xs={12} sm={6} md={4} key={device.device_id}>
                  <DeviceCard device={device} />
                </Grid>
              ))}

            {view === 'raspi' &&
              raspberries.map(rpi => (
                <Grid item xs={12} sm={6} md={4} key={rpi.raspi_id}>
                  <Box
                    sx={{
                      border: '1px solid #ddd',
                      borderRadius: 2,
                      p: 2,
                      boxShadow: 1,
                      height: '100%',
                    }}
                  >
                    <Typography variant="h6">{rpi.raspi_id}</Typography>
                    <Typography variant="body2">
                      Dispositivos conectados: {rpi.count}
                    </Typography>
                  </Box>
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
