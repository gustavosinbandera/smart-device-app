import React, { useEffect, useState, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader
} from '@react-google-maps/api';
import styles from './DeviceMapPage.module.css';

const BASE_POINT = { lat: 4.5321, lng: -75.6811 }; // Armenia, Quindío

function DeviceMapPage() {
  const [directions, setDirections] = useState(null);
  const [position, setPosition] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedFactor, setSpeedFactor] = useState(5); // 5x - 20x
  const [heading, setHeading] = useState(0); // dirección en grados
  const intervalRef = useRef(null);

  const speed = 4000 / speedFactor;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const generarPuntoAleatorio = () => {
    const deltaLat = (Math.random() - 0.5) * 0.01;
    const deltaLng = (Math.random() - 0.5) * 0.01;
    return { lat: BASE_POINT.lat + deltaLat, lng: BASE_POINT.lng + deltaLng };
  };

  const calcularHeading = (from, to) => {
    const rad = Math.atan2(to.lng - from.lng, to.lat - from.lat);
    return (rad * 180) / Math.PI; // en grados
  };

  const obtenerRutaGoogle = () => {
    const origin = position || BASE_POINT;
    const destino = generarPuntoAleatorio();

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination: destino,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          const steps = result.routes[0].legs[0].steps.flatMap((step) =>
            step.path.map((latLng) => ({
              lat: latLng.lat(),
              lng: latLng.lng()
            }))
          );

          setRouteCoords(steps);
          setPosition(steps[0]);
          setIndex(0);
        } else {
          console.error('Error obteniendo ruta:', result);
        }
      }
    );
  };

  useEffect(() => {
    if (isLoaded) obtenerRutaGoogle();
  }, [isLoaded]);

  useEffect(() => {
    if (!isPlaying || routeCoords.length === 0) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= routeCoords.length) {
          clearInterval(intervalRef.current);
          obtenerRutaGoogle();
          return 0;
        }

        const current = routeCoords[prev];
        const nextPoint = routeCoords[next];
        const angle = calcularHeading(current, nextPoint);

        setHeading(angle);
        setPosition(nextPoint);

        return next;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [routeCoords, isPlaying, speed]);

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleRestart = () => {
    if (routeCoords.length > 0) {
      setPosition(routeCoords[0]);
      setIndex(0);
    }
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  const rotatedCarIcon = {
    path: 'M 0 -2 L 1 0 L 0 2 L -1 0 Z',
    fillColor: '#ff0000',
    fillOpacity: 1,
    scale: 5,
    strokeWeight: 1,
    rotation: heading
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button onClick={handlePlayPause}>
          {isPlaying ? '⏸️ Pausar' : '▶️ Iniciar'}
        </button>
        <button onClick={handleRestart}>🔁 Reiniciar</button>
        <div className={styles.slider}>
          <label>Velocidad:</label>
          <input
            type="range"
            min="5"
            max="20"
            step="1"
            value={speedFactor}
            onChange={(e) => setSpeedFactor(Number(e.target.value))}
          />
          <span>{speedFactor}x</span>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100vh' }}
        center={position || BASE_POINT}
        zoom={15}
        options={{ disableDefaultUI: false }}
      >
        {position && (
          <Marker position={position} icon={rotatedCarIcon} />
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: true }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

export default DeviceMapPage;
