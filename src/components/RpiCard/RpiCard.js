// src/components/RpiCard/RpiCard.js
import React from 'react';
import { Card, CardHeader, CardContent, Typography, IconButton } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import WifiIcon from '@mui/icons-material/Wifi';
import styles from './RpiCard.module.css';

export default function RpiCard({ raspi }) {
  return (
    <Card elevation={2} className={styles.card}>
      <CardHeader
        avatar={<StorageIcon color="primary" />}
        action={
          <IconButton size="small">
            <WifiIcon />
          </IconButton>
        }
        title={raspi.raspi_id}
        subheader={`Dispositivos conectados: ${raspi.count}`}
      />
      <CardContent className={styles.content}>
        <Typography variant="body2">
          Total de dispositivos: <strong>{raspi.count}</strong>
        </Typography>
      </CardContent>
    </Card>
  );
}
