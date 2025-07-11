export async function fetchDevices(idToken) {
  const res = await fetch(
    'https://e59h4jmoee.execute-api.us-east-1.amazonaws.com/Prod/devices',
    {
      headers: { Authorization: `Bearer ${idToken}` },
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}