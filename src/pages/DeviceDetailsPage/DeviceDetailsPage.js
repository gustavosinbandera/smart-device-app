import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  IconButton,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import MemoryIcon from '@mui/icons-material/Memory';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { useDeviceDetails } from '../../hooks/useDeviceDetails';

export default function DeviceDetailsPage() {
  const { deviceId } = useParams();
  const { device, loading, error } = useDeviceDetails(deviceId);
  const theme = useTheme();

  const [selectedGpio, setSelectedGpio] = useState('');
  const [aliasList, setAliasList] = useState([]);

  useEffect(() => {
    if (device && device.aliases.length > 0) {
      setSelectedGpio(device.aliases[0].gpio);
    }
  }, [device]);

  useEffect(() => {
    if (device && selectedGpio) {
      const gpioObj = device.aliases.find(item => item.gpio === selectedGpio);
      if (gpioObj) {
        setAliasList(gpioObj.aliases);
      }
    }
  }, [selectedGpio, device]);

  const handleAliasChange = (index, value) => {
    const updated = [...aliasList];
    updated[index] = value;
    setAliasList(updated);
  };

  const addAlias = () => setAliasList([...aliasList, '']);
  const removeAlias = (index) => {
    const updated = [...aliasList];
    updated.splice(index, 1);
    setAliasList(updated);
  };

  const currentGpioInfo = device?.aliases.find(a => a.gpio === selectedGpio) || {};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Configurar GPIO — {device?.device_id}
      </Typography>

      {loading && <Typography>Cargando...</Typography>}
      {error && <Typography color="error">❌ {error}</Typography>}
      {!device && !loading && <Typography>No se encontró el dispositivo.</Typography>}

      {device && (
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3
          }}
        >
          {/* LADO IZQUIERDO */}
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Seleccionar GPIO</InputLabel>
              <Select
                label="Seleccionar GPIO"
                value={selectedGpio}
                onChange={(e) => setSelectedGpio(e.target.value)}
              >
                {device.aliases.map((a) => (
                  <MenuItem key={a.gpio} value={a.gpio}>
                    {a.gpio}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
                pr: 1,
                mb: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                p: 2
              }}
            >
              {aliasList.map((alias, index) => (
                <Grid container spacing={1} alignItems="center" key={index} sx={{ mb: 1 }}>
                  <Grid item xs>
                    <TextField
                      fullWidth
                      label={`Alias ${index + 1}`}
                      value={alias}
                      onChange={(e) => handleAliasChange(index, e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <IconButton color="error" onClick={() => removeAlias(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button onClick={addAlias} variant="outlined" size="small">
                + Agregar alias
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary">
                Guardar cambios
              </Button>
              <Button component={Link} to="/devices" sx={{ ml: 2 }}>
                ← Volver
              </Button>
            </Box>
          </Box>

          {/* LADO DERECHO — Estado actual */}
          <Box
            sx={{
              flex: 1,
              minWidth: 250,
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
              p: 3,
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'text.primary'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Estado actual del GPIO
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <MemoryIcon sx={{ mr: 1 }} />
              <Typography>
                <strong>Dirección:</strong> {currentGpioInfo.direction || '—'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SwapHorizIcon sx={{ mr: 1 }} />
              <Typography>
                <strong>Tipo:</strong> {currentGpioInfo.type || '—'}
              </Typography>
            </Box>

            {currentGpioInfo.type === 'digital' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FlashOnIcon sx={{ mr: 1 }} />
                <Typography>
                  <strong>Estado:</strong>{' '}
                  {currentGpioInfo.state === true ? 'Encendido' : 'Apagado'}
                </Typography>
              </Box>
            )}

            {currentGpioInfo.type === 'analog' && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DeviceThermostatIcon sx={{ mr: 1 }} />
                  <Typography>
                    <strong>Lectura:</strong> {currentGpioInfo.sensor_value ?? '—'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography sx={{ ml: 4 }}>
                    <strong>Unidad:</strong> {currentGpioInfo.unit || '—'}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
