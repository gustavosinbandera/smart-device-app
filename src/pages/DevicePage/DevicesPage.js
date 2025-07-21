import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import DeviceCard from '../../components/DeviceCard/DeviceCard';
import GenericCard from '../../components/GenericCard/GenericCard';
import { useDevices } from '../../hooks/useDevices';
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import styles from './DevicesPage.module.css';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

export default function DevicesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { devices, loading, error } = useDevices();

  const [navValue, setNavValue] = useState('devices');
  useEffect(() => {
    if (location.pathname.startsWith('/devices')) setNavValue('devices');
    else if (location.pathname === '/' || location.pathname === '/home') setNavValue('home');
    else if (location.pathname.startsWith('/settings')) setNavValue('settings');
  }, [location.pathname]);

  const handleNavChange = (_, val) => {
    setNavValue(val);
    if (val === 'home') navigate('/');
    if (val === 'devices') navigate('/devices');
    if (val === 'settings') navigate('/settings');
  };

  const [pageMenuAnchor, setPageMenuAnchor] = useState(null);
  const openPageMenu = e => setPageMenuAnchor(e.currentTarget);
  const closePageMenu = () => setPageMenuAnchor(null);

  const esp32RowRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startDrag = (event, ref) => {
    event.preventDefault();
    isDown.current = true;
    ref.current.classList.add(styles.activeRow);
    const pageX = event.touches ? event.touches[0].pageX : event.pageX;
    startX.current = pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const endDrag = ref => {
    isDown.current = false;
    ref.current.classList.remove(styles.activeRow);
  };

  const onDrag = (event, ref) => {
    if (!isDown.current) return;
    event.preventDefault();
    const pageX = event.touches ? event.touches[0].pageX : event.pageX;
    const walk = (pageX - ref.current.offsetLeft - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <Box className={styles.root}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Inicio</Typography>

          <IconButton color="inherit" onClick={openPageMenu}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={pageMenuAnchor}
            open={Boolean(pageMenuAnchor)}
            onClose={closePageMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => { closePageMenu(); }}>Configuración</MenuItem>
            <MenuItem onClick={() => { closePageMenu(); }}>Ayuda</MenuItem>
          </Menu>

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
            className={styles.scrollRow}>
            {devices.map(device => (
              <Box key={device.device_id} className={styles.cardWrapper}>
                <DeviceCard device={device} />
              </Box>
            ))}
          </Box>
        )}

        {/* Nueva sección de Opciones */}
        <Typography variant="h5" className={styles.sectionTitle}>Opciones</Typography>
        <Box className={styles.scrollRow}>
          <Box className={styles.cardWrapper}>
            <GenericCard
              title="Mapa General"
              icon={<MapIcon style={{ color: 'white' }} />}
              onClick={() => navigate('/mapa-general')}
            />
          </Box>

          <Box className={styles.cardWrapper}>
            <GenericCard
              title="Reportes"
              icon={<AssessmentIcon />}
              onClick={() => navigate('/reportes')}
            />
          </Box>

          <Box className={styles.cardWrapper}>
            <GenericCard
              title="Control"
              icon={<ToggleOnIcon />}
              onClick={() => navigate('/control')}
            />
          </Box>


        </Box>
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
          borderTop: '1px solid rgba(255,255,255,0.12)',
          backgroundColor: 'background.paper'
        }}
      >
        <BottomNavigationAction label="Inicio" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Dispositivos" value="devices" icon={<DevicesIcon />} />
        <BottomNavigationAction label="Ajustes" value="settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box>
  );
}
