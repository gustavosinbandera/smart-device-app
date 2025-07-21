// src/services/deviceService.js
export async function updateDeviceAliases(deviceId, gpio, aliases) {
  const token = localStorage.getItem('id_token');
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/devices/${deviceId}/gpio/${gpio}/aliases`,
    {
      method: 'PUT',                   // o PATCH si prefieres
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ aliases })  // ['bombillo', 'luz cocina']
    }
  );
  if (!res.ok) throw new Error((await res.json()).message);
}
