// src/pages/CallbackPage.js
import React, { useEffect, useState } from 'react';

function CallbackPage() {
  const [message, setMessage] = useState('Procesando inicio de sesión...');
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    if (!code) {
      setMessage('❌ No se recibió ningún código de autorización.');
      return;
    }

    const clientId = '4u8sh6fefm0meln5k4gbsvg9iu';
    const redirectUri = 'http://localhost:3000/callback';
    const tokenUrl = 'https://smart-device-demo-domain.auth.us-east-1.amazoncognito.com/oauth2/token';

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri
    });

    fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage(`❌ Error: ${data.error_description || data.error}`);
        } else {
          setMessage('✅ Tokens recibidos correctamente.');
          setTokens(data);
          localStorage.setItem('id_token', data.id_token);
          localStorage.setItem('access_token', data.access_token); // ✅ ESTA LÍNEA ES CLAVE
          // Redirigir después de unos segundos
          setTimeout(() => {
            window.location.href = '/devices';
          }, 3000);
        }
      })
      .catch(err => {
        console.error(err);
        setMessage(`❌ Error de red o fetch: ${err.message}`);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>{message}</h2>
      {tokens && (
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
          {JSON.stringify(tokens, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default CallbackPage;
