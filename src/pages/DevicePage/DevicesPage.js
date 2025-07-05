import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
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
  const [navValue, setNavValue] = useState('devices');
  const [selectedId, setSelectedId] = useState(null);

  // refs para scroll y drag
  const esp32RowRef = useRef(null);
  const rpiRowRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (location.pathname.startsWith('/devices')) setNavValue('devices');
    else if (location.pathname === '/' || location.pathname === '/home') setNavValue('home');
    else if (location.pathname.startsWith('/settings')) setNavValue('settings');
  }, [location.pathname]);

  const raspberries = useMemo(() => {
    if (!devices) return [];
    const uniq = [...new Set(devices.map(d => d.raspi_id))];
    return uniq.map(id => ({
      raspi_id: id,
      count: devices.filter(d => d.raspi_id === id).length
    }));
  }, [devices]);

  const handleNavChange = (_, val) => {
    setNavValue(val);
    if (val === 'home') navigate('/');
    if (val === 'devices') navigate('/devices');
    if (val === 'settings') navigate('/settings');
  };

  // Handlers de drag-to-scroll, con limpieza de selección
  const startDrag = (e, ref) => {
    e.preventDefault();
    isDown.current = true;
    ref.current.classList.add(styles.activeRow);
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
    setSelectedId(null); // al iniciar drag limpio selección
  };
  const endDrag = (ref) => {
    isDown.current = false;
    ref.current.classList.remove(styles.activeRow);
  };
  const onDrag = (e, ref) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <Box className={styles.root}>
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Inicio</Typography>
          <IconButton color="inherit"><AddIcon /></IconButton>
          <IconButton color="inherit"><NotificationsIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Box className={styles.container} sx={{ pb: 10 }}>
        <Typography variant="h5" className={styles.sectionTitle}>Mis ESP32</Typography>
        {loading && <Loader />}
        {error && <Alert severity="error">❌ {error}</Alert>}
        {!loading && !error && devices.length === 0 && (
          <Alert severity="info">No hay ESP32 registrados.</Alert>
        )}
        {!loading && !error && devices.length > 0 && (
          <Box
            ref={esp32RowRef}
            className={styles.scrollRow}
            onMouseDown={e => startDrag(e, esp32RowRef)}
            onMouseUp={() => endDrag(esp32RowRef)}
            onMouseLeave={() => endDrag(esp32RowRef)}
            onMouseMove={e => onDrag(e, esp32RowRef)}
            onTouchStart={e => startDrag(e.touches[0], esp32RowRef)}
            onTouchEnd={() => endDrag(esp32RowRef)}
            onTouchMove={e => onDrag(e.touches[0], esp32RowRef)}
          >
            {devices.map(device => (
              <Box
                key={device.device_id}
                className={`${styles.cardWrapper} ${selectedId === device.device_id ? styles.cardWrapperSelected : ''}`}
                onMouseDown={() => setSelectedId(device.device_id)}
                onMouseUp={() => setSelectedId(null)}
              >
                <DeviceCard device={device} />
              </Box>
            ))}
          </Box>
        )}

        <Typography variant="h5" className={styles.sectionTitle} sx={{ mt: 4 }}>Mis Raspberry Pi</Typography>
        {!loading && !error && raspberries.length === 0 && (
          <Alert severity="info">No hay Raspberry Pi registradas.</Alert>
        )}
        {!loading && !error && raspberries.length > 0 && (
          <Box
            ref={rpiRowRef}
            className={styles.scrollRow}
            onMouseDown={e => startDrag(e, rpiRowRef)}
            onMouseUp={() => endDrag(rpiRowRef)}
            onMouseLeave={() => endDrag(rpiRowRef)}
            onMouseMove={e => onDrag(e, rpiRowRef)}
            onTouchStart={e => startDrag(e.touches[0], rpiRowRef)}
            onTouchEnd={() => endDrag(rpiRowRef)}
            onTouchMove={e => onDrag(e.touches[0], rpiRowRef)}
          >
            {raspberries.map(rpi => (
              <Box
                key={rpi.raspi_id}
                className={`${styles.cardWrapper} ${selectedId === rpi.raspi_id ? styles.cardWrapperSelected : ''}`}
                onMouseDown={() => setSelectedId(rpi.raspi_id)}
                onMouseUp={() => setSelectedId(null)}
              >
                <RpiCard raspi={rpi} />
              </Box>
            ))}
          </Box>
        )}
      </Box>

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
        <BottomNavigationAction label="Inicio" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Dispositivos" value="devices" icon={<DevicesIcon />} />
        <BottomNavigationAction label="Ajustes" value="settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
}
