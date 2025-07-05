// src/components/Loader/Loader.js
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <CircularProgress />
    </div>
  );
}
