// src/pages/DevicesPage/DevicesPage.js
import React from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Grid 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeviceCard from '../../components/DeviceCard/DeviceCard';
import { useDevices } from '../../hooks/useDevices';
import Loader from '../../components/Loader/Loader';
import Alert from '@mui/material/Alert';
import styles from './DevicePage.module.css';

export default function DevicesPage() {
  const { devices, loading, error } = useDevices();

  return (
    <Box className={styles.root}>
      {/* AppBar fija */}
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inicio
          </Typography>
          <IconButton color="inherit"><AddIcon /></IconButton>
          <IconButton color="inherit"><NotificationsIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {loading && <Loader />}

        {error && <Alert severity="error">❌ {error}</Alert>}

        {!loading && !error && devices.length === 0 && (
          <Alert severity="info">No hay dispositivos registrados.</Alert>
        )}

        {!loading && !error && devices.length > 0 && (
          <Grid container spacing={2}>
            {devices.map(device => (
              <Grid item xs={12} sm={6} md={4} key={device.device_id}>
                <DeviceCard device={device} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
