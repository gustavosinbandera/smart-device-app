// src/pages/DevicesPage/DevicesPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  MenuItem,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import SettingsIcon from '@mui/icons-material/Settings';
import DeviceCard from '../../components/DeviceCard/DeviceCard';
import RpiCard from '../../components/RpiCard/RpiCard';
import { useDevices } from '../../hooks/useDevices';
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import styles from './DevicesPage.module.css';

export default function DevicesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { devices, loading, error } = useDevices();
  const [view, setView] = useState('esp32');           // 'esp32' | 'raspi'
  const [navValue, setNavValue] = useState('devices'); // controla el tab activo

  // Mantener navValue en sync con la ruta
  useEffect(() => {
    if (location.pathname.startsWith('/devices')) {
      setNavValue('devices');
    } else if (location.pathname === '/' || location.pathname === '/home') {
      setNavValue('home');
    } else if (location.pathname.startsWith('/settings')) {
      setNavValue('settings');
    }
  }, [location.pathname]);

  const raspberries = useMemo(() => {
    if (!devices) return [];
    const uniq = Array.from(new Set(devices.map(d => d.raspi_id)));
    return uniq.map(id => ({
      raspi_id: id,
      count: devices.filter(d => d.raspi_id === id).length
    }));
  }, [devices]);

  const itemsToRender = view === 'esp32' ? devices : raspberries;

  const handleNavChange = (e, val) => {
    setNavValue(val);
    if (val === 'home') navigate('/');
    if (val === 'devices') navigate('/devices');
    if (val === 'settings') navigate('/settings');
  };

  return (
    <Box className={styles.root}>
      {/* AppBar superior */}
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inicio
          </Typography>
          <IconButton color="inherit"><AddIcon /></IconButton>
          <IconButton color="inherit"><NotificationsIcon /></IconButton>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Box className={styles.container} sx={{ pb: 10 /* espacio para bottom nav */ }}>
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
                  <RpiCard raspi={rpi} />
                </Grid>
              ))}
          </Grid>
        )}
      </Box>

      {/* Bottom Navigation fija */}
      <BottomNavigation
        showLabels
        value={navValue}
        onChange={handleNavChange}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: '1px solid #ddd',
          backgroundColor: '#fff'
        }}
      >
        <BottomNavigationAction
          label="Inicio"
          value="home"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="Dispositivos"
          value="devices"
          icon={<DevicesIcon />}
        />
        <BottomNavigationAction
          label="Ajustes"
          value="settings"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
