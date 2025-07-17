import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import useGpsHistory from '../../hooks/useGpsHistory';
import { getRouteByStreets } from '../../utils/routeUtils';
import Loader from '../../components/Loader/Loader';
import 'leaflet/dist/leaflet.css';

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const DeviceMapPage = () => {
  const { deviceId } = useParams();
  const { gpsPoints, loading } = useGpsHistory(deviceId);
  const [route, setRoute] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Calcular la ruta una vez cargados los puntos
  useEffect(() => {
    if (!loading && gpsPoints.length >= 2) {
      const coordinates = gpsPoints.map(p => [p.longitude, p.latitude]);
      getRouteByStreets(coordinates).then(r => {
        setRoute(r);
        setCurrentIndex(0);
        setIsPlaying(false);
        clearInterval(intervalRef.current);
      });
    }
  }, [loading, gpsPoints]);

  // Playback animado
  useEffect(() => {
    if (isPlaying && route.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev < route.length - 1) return prev + 1;
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prev;
        });
      }, 300); // Velocidad del playback
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, route]);

  const handlePlay = () => {
    if (currentIndex >= route.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  if (loading) return <Loader />;
  if (!gpsPoints || gpsPoints.length === 0) return <div>No hay datos GPS.</div>;

  const firstPoint = gpsPoints[0];

  return (
    <div>
      <h2 style={{ color: 'white' }}>Ruta del dispositivo: {deviceId}</h2>

      {/* Controles de Playback */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handlePlay} disabled={isPlaying}>▶️ Reproducir</button>
        <button onClick={handlePause} disabled={!isPlaying}>⏸️ Pausar</button>
        <button onClick={handleReset}>🔄 Reiniciar</button>
      </div>

      <MapContainer
        center={[firstPoint.latitude, firstPoint.longitude]}
        zoom={16}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {route.length > 0 && <Polyline positions={route} color="blue" />}

        {route.length > 0 && currentIndex < route.length && (
          <Marker
            position={[route[currentIndex][1], route[currentIndex][0]]}
            icon={carIcon}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default DeviceMapPage;
