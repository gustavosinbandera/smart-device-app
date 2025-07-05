// src/components/DeviceCard/DeviceCard.js
import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  IconButton
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import WifiIcon from '@mui/icons-material/Wifi';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function DeviceCard({ device }) {
  return (
    <Card elevation={2}>
      <CardHeader
        avatar={<Avatar><MemoryIcon /></Avatar>}
        action={
          <IconButton size="small">
            <WifiIcon />
          </IconButton>
        }
        // Ahora muestra primero el ESP32 y luego la Raspberry Pi
        title={device.device_id}
        subheader={`Raspberry Pi: ${device.raspi_id}`}
      />
      <CardContent>
        {/* Tipo de dispositivo */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Tipo:</strong> {device.type}
        </Typography>

        {/* Entradas / Salidas */}
        <Typography variant="body2">
          <strong>Dig. In:</strong> {device.digital_inputs} ·{' '}
          <strong>Dig. Out:</strong> {device.digital_outputs}
        </Typography>
        <Typography variant="body2">
          <strong>An. In:</strong> {device.analog_inputs} ·{' '}
          <strong>An. Out:</strong> {device.analog_outputs}
        </Typography>

        {/* Fecha de registro */}
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
