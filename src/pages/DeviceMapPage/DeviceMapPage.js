// src/pages/DeviceMapPage/DeviceMapPage.js
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './DeviceMapPage.module.css';

const carIconUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACvElEQVRYR+2WT4hNYRjGv+csNhYWIaItTkxMrKSRSJAkLTWE8ktpl2VHLZc9EaCwtJiYZzTGdk1DkQcsIS1snXyaAQNKQ9QiCl+KiAwMrmwy+3PO/M+9/n5ztdx8RYM/hR2gq63VswGOwMroLS9OrEAhQmvD5qt3Sc7AzuAhODqbGJ4LVRV4uEeAfIYoZ60M1p4GuwDdgKDnpXyY3dt9cDpoFhYH7yGAFi84b8LPsDlz9AgY2+wqUpYAC3Fz8MYdPHFAAeEHDM+Hylr8CxRwrwBZoTOLkUSJ+H+Rlmz34NT4Mp1X9nFwHMJ0I3XLpI0oP3A1k+7vKwqfxcYTf66MFU/Olt6X9wG5wGslM2T5Sh0XQGuL4K2VlfRQCI3k+LSTH7xuD06LfuTT93CCl3QNV9UMd5AW+VrAAXcy+QgEvUtGo8VYSwrOpbXAaNUjAy0cZ0ML5ZtaGaI9Bi81VZbB7kAOLfpFAIaV5ybAqLK2UanivHfxVw2cVXeZ3WeEahvTkePTOuYwFeZbqpJ5qI35dDIXX2m8EkAJiG3hrM7+7fdk2FgNGKoKwTXOw6kZ0E5U2doUXbtsndTkbUs6mcsl20rCWoY7GaY9Nf3piNvDRkKLPKh1s6SR0+PiEA8m3Uo0FfU6M7JBBL1SpND3bI0fRSsFCLtGtxAbKKFl7NnH81e8ZJD2QWzYb1ceL3lzk9k9X8qfhPZJmuRUXcnxFAAAAAElFTkSuQmCC';

const carIcon = new L.Icon({
  iconUrl: carIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function AutoPan({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.panTo(position);
  }, [position, map]);
  return null;
}

const DeviceMapPage = () => {
  const [route, setRoute] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const sampleRoute = [
    [-34.605685, -58.381559],
    [-34.605000, -58.382500],
    [-34.604000, -58.383000],
    [-34.603000, -58.384000],
    [-34.602000, -58.385000],
    [-34.601000, -58.386000],
    [-34.600000, -58.387000],
    [-34.599000, -58.388000],
    [-34.598000, -58.389000],
    [-34.597000, -58.390000]
  ];

  useEffect(() => {
    setRoute(sampleRoute);
    setPosition(sampleRoute[0]);
    setCurrentIndex(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying || route.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= route.length) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prev;
        }
        setPosition(route[next]);
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, route]);

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleRestart = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex(0);
    setPosition(route[0]);
    setIsPlaying(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button onClick={handlePlayPause}>{isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}</button>
        <button onClick={handleRestart}>🔄 Reiniciar</button>
      </div>

      <MapContainer
        center={[-34.605685, -58.381559]}
        zoom={15}
        zoomControl={true}
        scrollWheelZoom={true}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {route.length > 0 && <Polyline positions={route} color='blue' />}
        {position && (
          <>
            <Marker position={position} icon={carIcon} />
            <AutoPan position={position} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default DeviceMapPage;
