// src/components/GenericCard/GenericCard.js
import React from 'react';
import {
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import styles from '../DeviceCard/DeviceCard.module.css';

export default function GenericCard({ title, icon, description, footerText, footerIcon, onClick }) {
  return (
    <Card elevation={2} className={styles.card}>
      <CardActionArea onClick={onClick} className={styles.actionArea}>
        <CardHeader
          avatar={
            <Avatar className={styles.headerAvatar}>
              {icon}
            </Avatar>
          }
          title={title}
          titleTypographyProps={{
            variant: 'h6',
            noWrap: true,
            sx: {
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }
          }}
        />
        <CardContent className={styles.content}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {description}
        </Typography>
            <div style={{ flex: 1 }}></div> {/* espacio vertical */}
        </CardContent>
      </CardActionArea>

      {(footerText || footerIcon) && (
        <CardActions className={styles.footer} sx={{ justifyContent: 'space-between' }}>
          <Typography variant="caption">{footerText}</Typography>
          {footerIcon && (
            <Tooltip title="Acción">
              <IconButton size="small" onClick={onClick}>
                {footerIcon}
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      )}
    </Card>
  );
}
