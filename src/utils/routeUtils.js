import openrouteservice from 'openrouteservice-js';

const directions = new openrouteservice.Directions({
  api_key: process.env.REACT_APP_ORS_API_KEY, // debes definir esto en tu .env
});

/**
 * Calcula una ruta real por calles entre los puntos indicados
 * @param {Array} coordinates - Array de coordenadas [lon, lat], mínimo dos
 * @returns {Promise<Array>} - Coordenadas de la ruta calculada
 */
export async function getRouteByStreets(coordinates) {
  try {
    const result = await directions.calculate({
      coordinates,
      profile: 'foot-walking', // o 'driving-car', 'cycling-regular', etc.
      format: 'geojson',
    });

    const routeCoords = result.features[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]); // invertimos para Leaflet
    return routeCoords;
  } catch (err) {
    console.error('Error al calcular ruta ORS:', err);
    return [];
  }
}
