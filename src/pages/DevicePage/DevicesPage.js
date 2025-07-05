// src/pages/DevicesPage/DevicesPage.js
import React, { useState, useMemo } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeviceCard from '../../components/DeviceCard/DeviceCard';
import { useDevices } from '../../hooks/useDevices';
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import styles from './DevicesPage.module.css';

export default function DevicesPage() {
  const { devices, loading, error } = useDevices();
  const [view, setView] = useState('esp32'); // 'esp32' | 'raspi'

  // Para la vista de Raspberry, extraemos IDs únicos
  const raspberries = useMemo(() => {
    if (!devices) return [];
    const uniq = Array.from(new Set(devices.map(d => d.raspi_id)));
    return uniq.map(id => ({
      raspi_id: id,
      count: devices.filter(d => d.raspi_id === id).length
    }));
  }, [devices]);

  // Datos que renderizamos según la vista
  const itemsToRender = view === 'esp32' ? devices : raspberries;

  return (
    <Box className={styles.root}>
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inicio
          </Typography>
          <IconButton color="inherit"><AddIcon /></IconButton>
          <IconButton color="inherit"><NotificationsIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Box className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          Dispositivos
        </Typography>

        {loading && <Loader />}

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
          <FormControl fullWidth className={styles.selectControl}>
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

        {/* Grid de cards */}
        {!loading && !error && itemsToRender.length > 0 && (
          <Grid container spacing={3}>
            {view === 'esp32' &&
              itemsToRender.map(device => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={device.device_id}
                  className={styles.gridItem}
                >
                  <DeviceCard device={device} />
                </Grid>
              ))}

            {view === 'raspi' &&
              itemsToRender.map(rpi => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={rpi.raspi_id}
                  className={styles.gridItem}
                >
                  <Box
                    sx={{
                      border: '1px solid #ddd',
                      borderRadius: 2,
                      p: 2,
                      boxShadow: 1,
                      height: '100%'
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
