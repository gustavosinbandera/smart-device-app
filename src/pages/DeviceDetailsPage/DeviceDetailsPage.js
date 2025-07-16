import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { useDeviceDetails } from '../../hooks/useDeviceDetails';

export default function DeviceDetailsPage() {
  const { deviceId } = useParams();
  const { device, loading, error } = useDeviceDetails(deviceId);

  const [editableAliases, setEditableAliases] = useState([]);

  useEffect(() => {
    if (device?.aliases) {
      // Clonar los aliases para edición
      setEditableAliases(device.aliases.map(alias => ({
        gpio: alias.gpio,
        aliases: [...alias.aliases]
      })));
    }
  }, [device]);

  const handleGpioChange = (index, newGpio) => {
    const updated = [...editableAliases];
    updated[index].gpio = newGpio;
    setEditableAliases(updated);
  };

  const handleAliasChange = (index, aliasIndex, newValue) => {
    const updated = [...editableAliases];
    updated[index].aliases[aliasIndex] = newValue;
    setEditableAliases(updated);
  };

  const handleAddAlias = (index) => {
    const updated = [...editableAliases];
    updated[index].aliases.push('');
    setEditableAliases(updated);
  };

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
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Configurar aliases — {device.device_id}
      </Typography>
      <Typography variant="subtitle2" gutterBottom sx={{ mb: 3 }}>
        {device.name || 'ESP32 sin nombre asignado'}
      </Typography>

      {editableAliases.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          No hay aliases configurados aún. Puedes agregarlos abajo.
        </Alert>
      )}

      <Grid container spacing={2}>
        {editableAliases.map((row, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Configuración de GPIO #{index + 1}
              </Typography>

              <TextField
                select
                label="GPIO"
                value={row.gpio}
                onChange={(e) => handleGpioChange(index, e.target.value)}
                fullWidth
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                <option value="">Selecciona un GPIO</option>
                {[...Array(40).keys()].map(i => (
                  <option key={i} value={`gpio-${i}`}>{`gpio-${i}`}</option>
                ))}
              </TextField>

              {row.aliases.map((alias, aliasIndex) => (
                <TextField
                  key={aliasIndex}
                  label={`Alias #${aliasIndex + 1}`}
                  value={alias}
                  onChange={(e) => handleAliasChange(index, aliasIndex, e.target.value)}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              ))}

              <Button
                onClick={() => handleAddAlias(index)}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                ➕ Agregar alias
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled
        >
          💾 Guardar cambios
        </Button>
        <Button component={Link} to="/devices">
          ← Volver
        </Button>
      </Box>
    </Box>
  );
}
