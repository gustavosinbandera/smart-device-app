// src/LoginPage.js
import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    const domain = 'https://smart-device-demo-domain.auth.us-east-1.amazoncognito.com';
    const clientId = '4u8sh6fefm0meln5k4gbsvg9iu';
    const redirectUri = 'http://localhost:3000/callback';
    const responseType = 'code';

    const url = `${domain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Bienvenido a Smart IoT</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Iniciar Sesión con Cognito
      </button>
    </div>
  );
};

export default LoginPage;
