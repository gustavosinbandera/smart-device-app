// // src/LoginPage.js
// import React from 'react';

// const LoginPage = () => {
//   const handleLogin = () => {
//     const domain     = 'smart-device-demo-domain.auth.us-east-1.amazoncognito.com';
//     const clientId   = '2co3iuoo5nm8fs8t6vjblau23s';
//     const redirectUri = window.location.hostname === 'localhost'
//     ? 'http://localhost:3000/callback'
//     : 'https://app.domoticore.co/callback';
//     const responseType = 'code';

//    const url = `https://${domain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
//     window.location.href = url;
//   };

//   console.log('Cognito domain:', process.env.REACT_APP_COGNITO_DOMAIN);
// console.log('Client ID:',   process.env.REACT_APP_COGNITO_CLIENT_ID);

//   return (
//     <div style={{ textAlign: 'center', marginTop: '100px' }}>
//       <h1>Bienvenido a Smart IoT</h1>
//       <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
//         Iniciar Sesión con Cognito
//       </button>
//     </div>
//   );
// };

// export default LoginPage;



// src/LoginPage.js
import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    const domain = 'https://smart-device-demo-domain.auth.us-east-1.amazoncognito.com';
    const clientId = '2co3iuoo5nm8fs8t6vjblau23s';
    const redirectUri = 'https://app.domoticore.co/callback';
    const responseType = 'code';

    const url = `${domain}/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    console.log("**************************************");
    console.log("LOGIN URL:", url);
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