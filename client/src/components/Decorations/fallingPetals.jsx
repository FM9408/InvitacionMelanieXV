import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

// 1. Definir la animación de caída y balanceo con MUI keyframes
const caerYBalancear = keyframes`
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(50px) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(110vh) translateX(-20px) rotate(360deg);
    opacity: 0;
  }
`;

const PetalosEfecto = ({ rutaPng, cantidad }) => {
  // Generar datos aleatorios para cada pétalo de forma segura
  const petalos = useMemo(() => {
    return Array.from({ length: cantidad }).map((_, i) => ({
      id: i,
      left: `${Math.floor(Math.random() * 100)}%`,        // Posición horizontal
      size: `${Math.floor(Math.random() * 15 + 15)}px`,   // Tamaño entre 15px y 30px
      delay: `${Math.floor(Math.random() * 8)}s`,         // Retraso de inicio aleatorio
      duration: `${Math.floor(Math.random() * 6 + 6)}s`,   // Velocidad de caída (6s a 12s)
    }));
  }, [cantidad]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Permite hacer clic en los botones de abajo
        overflow: 'hidden',
        zIndex: 9999, // Por encima de todo el contenido de MUI
      }}
    >
      {petalos.map((p) => (
        <Box
          key={p.id}
          component="img"
          src={rutaPng}
          alt="pétalo"
          sx={{
            position: 'absolute',
            left: p.left,
            width: p.size,
            height: 'auto',
            opacity: 0,
            animation: `${caerYBalancear} ${p.duration} linear infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </Box>
  );
};

export default PetalosEfecto;
