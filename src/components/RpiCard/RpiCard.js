// src/components/RpiCard/RpiCard.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import WifiIcon from '@mui/icons-material/Wifi';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './RpiCard.module.css';

export default function RpiCard({ raspi }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const drag = useRef(false);

  const openMenu = e => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);

  const goToDetails = () => {
    navigate(`/raspis/${raspi.raspi_id}`);
  };

  // Señal 0–5  
  const level = raspi.signalLevel ?? 4;
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
      <CardActionArea
        className={styles.actionArea}
        onClick={e => {
          if (!drag.current) goToDetails();
          drag.current = false;
        }}
        onMouseDown={() => { drag.current = false; }}
        onMouseMove={() => { drag.current = true; }}
        onTouchStart={() => { drag.current = false; }}
        onTouchMove={() => { drag.current = true; }}
      >
        <CardHeader
          avatar={
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color={raspi.online ? 'success' : 'default'}
            >
              <Avatar className={styles.avatar}>
                <StorageIcon />
              </Avatar>
            </Badge>
          }
          action={
            <>
              <IconButton size="small" onClick={openMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => { closeMenu(); goToDetails(); }}>
                  Ver detalles
                </MenuItem>
                <MenuItem onClick={closeMenu}>Reiniciar RPi</MenuItem>
              </Menu>
            </>
          }
          title={raspi.raspi_id}
          subheader={`Conectados: ${raspi.count}`}
          titleTypographyProps={{
            variant: 'h6',
            noWrap: true,
            sx: {
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }
          }}
          sx={{ '& .MuiCardHeader-subheader': { color: 'text.secondary' } }}
        />

        <CardContent className={styles.content}>
          <Typography variant="caption" display="flex" alignItems="center" gutterBottom>
            <WifiIcon fontSize="small" sx={{ color: wifiColor, mr: 0.5 }} />
            Señal: {level}/5
          </Typography>
          <Typography variant="body2">
            <strong>Total dispositivos:</strong> {raspi.count}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
