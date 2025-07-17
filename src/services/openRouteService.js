// src/services/openRouteService.js
export async function getRouteFromOpenRouteService(points) {
  const apiKey = process.env.REACT_APP_ORS_API_KEY;
  if (!apiKey) throw new Error('Falta la API KEY de OpenRouteService');

  const coordinates = points.map(([lat, lon]) => [lon, lat]); // ORS usa [lon, lat]

  const body = {
    coordinates,
    format: 'geojson',
  };

  const response = await fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Error ORS:', errText);
    throw new Error('Error al obtener ruta ORS');
  }

  const data = await response.json();

  const route = data.features[0].geometry.coordinates; // [lon, lat]
  return route;
}
