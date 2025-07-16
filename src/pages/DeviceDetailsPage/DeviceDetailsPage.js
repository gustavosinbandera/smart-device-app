// src/pages/DeviceDetailsPage/DeviceDetailsPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { useDeviceDetails } from '../../hooks/useDeviceDetails'; // ⬅ nuevo hook

export default function DeviceDetailsPage() {
  const { deviceId } = useParams();
  const { device, loading, error } = useDeviceDetails(deviceId); // ⬅ usa el hook correcto

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando detalles…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">❌ {error}</Alert>
        <Button component={Link} to="/devices" sx={{ mt: 2 }}>
          ← Volver a dispositivos
        </Button>
      </Box>
    );
  }

  if (!device) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">No se encontró el dispositivo "{deviceId}"</Alert>
        <Button component={Link} to="/devices" sx={{ mt: 2 }}>
          ← Volver a dispositivos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Configurar aliases — {device.device_id}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Tipo de dispositivo: {device.type} — Registrado el: {new Date(device.registered_at).toLocaleString()}
      </Typography>

      {device.aliases.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          No hay aliases configurados aún. Puedes agregarlos abajo.
        </Alert>
      )}

      <Grid container spacing={2}>
        {device.aliases.map(aliasRow => {
          const label = `${aliasRow.gpio.toUpperCase()} — ${aliasRow.direction?.toUpperCase() || 'UNKNOWN'} ${aliasRow.type?.toUpperCase() || ''}`;
          const value = Array.isArray(aliasRow.aliases)
            ? aliasRow.aliases.join(', ')
            : '';

          return (
            <Grid item xs={12} sm={6} key={aliasRow.gpio}>
              <TextField
                fullWidth
                label={label}
                value={value}
                disabled
              />
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          component={Link}
          to={`/devices/${deviceId}/edit`}
        >
          Editar aliases
        </Button>
        <Button component={Link} to="/devices">
          ← Volver
        </Button>
      </Box>
    </Box>
  );
}
