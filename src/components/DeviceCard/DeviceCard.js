// src/components/DeviceCard/DeviceCard.js
import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';

export default function DeviceCard({ device }) {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate(`/devices/${device.device_id}`);
  };

  return (
    <Card elevation={2}>
      <CardHeader
        // Avatar pasa a ser el botón de configuración
        avatar={
          <IconButton size="small" onClick={goToDetails}>
            <SettingsIcon />
          </IconButton>
        }
        // Solo el wifi queda como acción a la derecha
        action={
          <IconButton size="small">
            <WifiIcon />
          </IconButton>
        }
        title={device.device_id}
        subheader={`Raspberry Pi: ${device.raspi_id}`}
      />
      <CardContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Tipo:</strong> {device.type}
        </Typography>
        <Typography variant="body2">
          <strong>Dig. In:</strong> {device.digital_inputs} ·{' '}
          <strong>Dig. Out:</strong> {device.digital_outputs}
        </Typography>
        <Typography variant="body2">
          <strong>An. In:</strong> {device.analog_inputs} ·{' '}
          <strong>An. Out:</strong> {device.analog_outputs}
        </Typography>
        <Typography
          variant="caption"
          sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
        >
          <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
          {new Date(device.registered_at).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
