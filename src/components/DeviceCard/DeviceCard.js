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
  MenuItem,
  useTheme
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useNavigate } from 'react-router-dom';
import styles from './DeviceCard.module.css';

export default function DeviceCard({ device }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = e => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const goToDetails = () => {
    navigate(`/devices/${device.device_id}`);
  };

  const level = device.signalLevel ?? 3;

  const wifiColors = [
    theme.palette.grey[600],
    theme.palette.grey[500],
    theme.palette.grey[400],
    theme.palette.grey[300],
    theme.palette.grey[200],
    theme.palette.common.white
  ];
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
                <MenuItem onClick={() => { handleMenuClose(); }}>Renombrar</MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); }}>Reiniciar</MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); }}>Eliminar</MenuItem>
              </Menu>
            </>
          }
          title={device.device_id}
          subheader={`Tipo: ${device.type || 'ESP32'}`}
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
          <Typography variant="caption" display="flex" alignItems="center" gutterBottom>
            <WifiIcon fontSize="small" sx={{ color: wifiColor, mr: 0.5 }} />
            Señal: {level}/5
          </Typography>

          {device.signalHistory && (
            <div className={styles.sparklineContainer}>
              <Sparklines data={device.signalHistory} limit={10} width={100} height={20} margin={4}>
                <SparklinesLine color={wifiColor} style={{ strokeWidth: 2, fill: 'none' }} />
              </Sparklines>
            </div>
          )}

          <Typography variant="body2">
            Entradas: D {device.digital_inputs} · A {device.analog_inputs}
          </Typography>
          <Typography variant="body2">
            Salidas: D {device.digital_outputs} · A {device.analog_outputs}
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
