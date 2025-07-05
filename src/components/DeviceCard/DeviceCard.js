// src/components/DeviceCard/DeviceCard.js
import React, { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useNavigate } from 'react-router-dom';
import styles from './DeviceCard.module.css';

export default function DeviceCard({ device, loading }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = e => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // ➡️ Navega a /devices/:id al hacer click en cualquier parte de la card
  const goToDetails = () => {
    navigate(`/devices/${device.device_id}`);
  };

  // Señal actual y colores
  const level = device.signalLevel ?? 3;
  const wifiColors = ['#ccc', '#999', '#666', '#333', '#111', '#000'];
  const wifiColor = wifiColors[Math.min(level, 5)];

  return (
    <Card elevation={2} className={styles.card}>
      <CardActionArea onClick={goToDetails} className={styles.actionArea}>
        <CardHeader
          avatar={
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color={device.online ? 'success' : 'default'}
            >
              <Avatar className={styles.headerAvatar}>
                {device.device_id.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
          }
          action={
            <>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => { handleMenuClose(); /* otras acciones */ }}>
                  Renombrar
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); /* otras acciones */ }}>
                  Reiniciar
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); /* otras acciones */ }}>
                  Eliminar
                </MenuItem>
              </Menu>
            </>
          }
          title={device.device_id}
          subheader={`RPI: ${device.raspi_id}`}
          titleTypographyProps={{
            variant: 'h6',
            noWrap: true,
            sx: {
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }
          }}
          sx={{
            '& .MuiCardHeader-subheader': { color: 'text.secondary' }
          }}
        />

        <CardContent className={styles.content}>
          <Typography variant="body2" gutterBottom>
            <strong>Tipo:</strong> {device.type}
          </Typography>

          <Typography variant="caption" display="flex" alignItems="center" gutterBottom>
            <WifiIcon fontSize="small" sx={{ color: wifiColor, mr: 0.5 }} />
            Señal: {level}/5
          </Typography>

          {device.signalHistory && (
            <div className={styles.sparklineContainer}>
              <Sparklines
                data={device.signalHistory}
                limit={10}
                width={100}
                height={20}
                margin={4}
              >
                <SparklinesLine
                  color={wifiColor}
                  style={{ strokeWidth: 2, fill: 'none' }}
                />
              </Sparklines>
            </div>
          )}

          <Typography variant="body2">
            Dig In: {device.digital_inputs} · Dig Out: {device.digital_outputs}
          </Typography>
          <Typography variant="body2">
            An In: {device.analog_inputs} · An Out: {device.analog_outputs}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions className={styles.footer}>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
          {new Date(device.registered_at).toLocaleDateString()}
        </Typography>
      </CardActions>
    </Card>
  );
}
