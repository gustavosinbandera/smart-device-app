import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './DeviceMapPage.module.css';
import { getRouteFromOpenRouteService } from '../../services/openRouteService';

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
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const BASE_POINT = [-34.605685, -58.381559]; // Obelisco

  const generarPuntoAleatorio = () => {
    const deltaLat = (Math.random() - 0.5) * 0.01;
    const deltaLng = (Math.random() - 0.5) * 0.01;
    return [BASE_POINT[0] + deltaLat, BASE_POINT[1] + deltaLng];
  };

  const obtenerNuevaRuta = async () => {
    try {
      const destino = generarPuntoAleatorio();
      const nuevaRuta = await getRouteFromOpenRouteService([BASE_POINT, destino]);
      const rutaConvertida = nuevaRuta.map(([lon, lat]) => [lat, lon]);
      setRoute(rutaConvertida);
      setPosition(rutaConvertida[0]);
      setIndex(0);
    } catch (err) {
      console.error('Error al obtener ruta:', err.message);
    }
  };

  useEffect(() => {
    obtenerNuevaRuta();
  }, []);

  useEffect(() => {
    if (!isPlaying || route.length === 0) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= route.length) {
          clearInterval(intervalRef.current);
          obtenerNuevaRuta(); // Obtener nueva ruta al final
          return 0;
        }
        setPosition(route[next]);
        return next;
      });
    }, 800);

    return () => clearInterval(intervalRef.current);
  }, [route, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    if (route.length > 0) {
      setPosition(route[0]);
      setIndex(0);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button onClick={handlePlayPause}>{isPlaying ? '⏸️ Pausar' : '▶️ Iniciar'}</button>
        <button onClick={handleRestart}>🔁 Reiniciar</button>
      </div>

      <MapContainer
        center={BASE_POINT}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={true}
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
