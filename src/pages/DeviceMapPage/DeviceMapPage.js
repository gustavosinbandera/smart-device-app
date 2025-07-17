import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './DeviceMapPage.module.css';
import { getRouteFromOpenRouteService } from '../../services/openRouteService';

// Icono del auto
const carIconUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACvElEQVRYR+2WT4hNYRjGv+csNhYWIaItTkxMrKSRSJAkLTWE8ktpl2VHLZc9EaCwtJiYZzTGdk1DkQcsIS1snXyaAQNKQ9QiCl+KiAwMrmwy+3PO/M+9/n5ztdx8RYM/hR2gq63VswGOwMroLS9OrEAhQmvD5qt3Sc7AzuAhODqbGJ4LVRV4uEeAfIYoZ60M1p4GuwDdgKDnpXyY3dt9cDpoFhYH7yGAFi84b8LPsDlz9AgY2+wqUpYAC3Fz8MYdPHFAAeEHDM+Hylr8CxRwrwBZoTOLkUSJ+H+Rlmz34NT4Mp1X9nFwHMJ0I3XLpI0oP3A1k+7vKwqfxcYTf66MFU/Olt6X9wG5wGslM2T5Sh0XQGuL4K2VlfRQCI3k+LSTH7xuD06LfuTT93CCl3QNV9UMd5AW+VrAAXcy+QgEvUtGo8VYSwrOpbXAaNUjAy0cZ0ML5ZtaGaI9Bi81VZbB7kAOLfpFAIaV5ybAqLK2UanivHfxVw2cVXeZ3WeEahvTkePTOuYwFeZbqpJ5qI35dDIXX2m8EkAJiG3hrM7+7fdk2FgNGKoKwTXOw6kZ0E5U2doUXbtsndTkbUs6mcsl20rCWoY7GaY9Nf3piNvDRkKLPKh1s6SR0+PiEA8m3Uo0FfU6M7JBBL1SpND3bI0fRSsFCLtGtxAbKKFl7NnH81e8ZJD2QWzYb1ceL3lzk9k9X8qfhPZJmuRUXcnxFAAAAAElFTkSuQmCC';

const carIcon = new L.Icon({
  iconUrl: carIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function AutoPan({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.panTo(position);
    }
  }, [position, map]);
  return null;
}

const DeviceMapPage = () => {
  const [route, setRoute] = useState([]);
  const [position, setPosition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const origin = [-34.605685, -58.381559]; // Obelisco
  const destination = [-34.599722, -58.373056]; // Plaza de Mayo

  // Obtener ruta real usando OpenRouteService
  useEffect(() => {
    async function fetchRoute() {
      try {
        const data = await getRouteFromOpenRouteService([origin, destination]);
        const leafletCoords = data.map(([lon, lat]) => [lat, lon]);
        setRoute(leafletCoords);
        setPosition(leafletCoords[0]);
      } catch (err) {
        console.error('Error al obtener la ruta:', err);
      }
    }
    fetchRoute();
  }, []);

  // Animación del auto
  useEffect(() => {
    if (!isPlaying || route.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= route.length) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prevIndex;
        }
        setPosition(route[nextIndex]);
        return nextIndex;
      });
    }, 700);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, route]);

  const handlePlay = () => {
    if (currentIndex < route.length - 1) {
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex(0);
    if (route.length > 0) {
      setPosition(route[0]);
    }
    setIsPlaying(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button onClick={handlePlay} disabled={isPlaying}>▶️ Play</button>
        <button onClick={handleRestart}>🔁 Restart</button>
      </div>

      <MapContainer
        center={origin}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={true}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {route.length > 0 && (
          <Polyline positions={route} color='blue' />
        )}

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
