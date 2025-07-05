export async function fetchDevices(idToken) {
  const res = await fetch(
    'https://4koo6afax7.execute-api.us-east-1.amazonaws.com/Prod/devices',
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}