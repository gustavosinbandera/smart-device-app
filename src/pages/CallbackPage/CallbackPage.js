// src/pages/CallbackPage.js
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, LinearProgress, Button, useTheme } from '@mui/material';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { useNavigate } from 'react-router-dom';

export default function CallbackPage() {
  const totalDuration = 3000;
  const [progress, setProgress]       = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError]             = useState(null);
  const [fadeOut, setFadeOut]         = useState(false);

  const fetchDone  = useRef(false);
  const fetchError = useRef(false);
  const isMounted  = useRef(true);
  const startTime  = useRef(Date.now());
  const navigate   = useNavigate();
  const theme      = useTheme();

  // 1️⃣ Intercambio de tokens
  useEffect(() => {
    isMounted.current = true;
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code   = params.get('code');
      if (!code) {
        navigate('/', { replace: true });
        return;
      }
      try {
        const clientId    = '2co3iuoo5nm8fs8t6vjblau23s';
        const redirectUri = window.location.hostname === 'localhost'
          ? 'http://localhost:3000/callback'
          : 'https://app.domoticore.co/callback';
        const tokenUrl    =
          'https://smart-device-demo-domain.auth.us-east-1.amazoncognito.com/oauth2/token';

        //console.log('📤 Token request → redirect_uri:', redirectUri);

        const body = new URLSearchParams({
          grant_type:   'authorization_code',
          client_id:    clientId,
          code,
          redirect_uri: redirectUri
        });

        //console.log('📤 POST to:', tokenUrl, 'body:', body.toString());

        const res = await fetch(tokenUrl, {
          method:  'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:    body.toString()
        });

        const data = await res.json();
        //console.error('TOKEN RESPONSE status:', res.status);
        //console.error('TOKEN RESPONSE body:', JSON.stringify(data, null, 2));

        if (data.error) throw new Error(data.error_description || 'Error en token');

        localStorage.setItem('id_token', data.id_token);
        localStorage.setItem('access_token', data.access_token);
        fetchDone.current = true;
      } catch (err) {
        console.error('❌ Error en login callback:', err);
        fetchError.current = true;
      }
    })();

    return () => {
      isMounted.current = false;
    };
  }, [navigate]);

  // 2️⃣ Animación de la barra
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const pct     = Math.min((elapsed / totalDuration) * 100, 100);
      if (isMounted.current) setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setShowWelcome(false);
        if (fetchDone.current) {
          setFadeOut(true);
          setTimeout(() => navigate('/devices', { replace: true }), 500);
        } else if (fetchError.current) {
          setError('❌ No fue posible iniciar sesión.');
        }
      }
    };
    requestAnimationFrame(tick);
  }, [navigate]);

  // 3️⃣ UI de error
  if (error) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          color: 'text.primary',
          p: 2,
          textAlign: 'center',
          transition: 'opacity 500ms',
          opacity: fadeOut ? 0 : 1
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Box>
    );
  }

  // 4️⃣ UI de carga
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        px: 2,
        textAlign: 'center',
        transition: 'opacity 500ms',
        opacity: fadeOut ? 0 : 1
      }}
    >
      {showWelcome && (
        <>
          <HomeWorkIcon
            sx={{
              fontSize: 64,
              color: theme.palette.common.white,
              mb: 2
            }}
          />
          <Typography variant="h4" gutterBottom color="text.primary">
            ¡Bienvenido de nuevo!
          </Typography>
        </>
      )}

      {progress < 100 && (
        <Box sx={{ width: '60%', maxWidth: 400, mt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: theme.palette.grey[700],
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
}
