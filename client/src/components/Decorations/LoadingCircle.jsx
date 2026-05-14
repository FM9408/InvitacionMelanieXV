import React from 'react';
import { CircularProgress, Box, useTheme, Paper } from '@mui/material';
import { keyframes } from '@mui/system';
import rose from '../../assets/images/rose.png';
import { useSelector } from 'react-redux';

const roseTransformation = keyframes`
  0% { transform: rotate(0deg) scale(0);}
  25% { transform: rotate(90deg) scale(1); }
  50% { transform: rotate(180deg) scale(.5); 
  } /* Añadí scale para mantener consistencia */
  75% { transform: rotate(270deg) scale(1); }
  100% { transform: rotate(360deg) scale(0);
  }
`;

function GradientCircularProgress ({ progress, theme }) {
    
   


    return (
        <React.Fragment>
            <svg width={0} height={0}>
                <defs>
                    {/* Usamos un gradiente lineal con varios puntos de parada 
        que simulan la transición circular */}
                    <linearGradient
                        id='my_gradient'
                        x1='50%'
                        y1='0%'
                        x2='50%'
                        y2='100%'
                    >
                        <stop
                            offset='0%'
                            stopColor={theme.palette.primary.dark}
                        />{' '}
                        {/* Color 1: Inicio (Arriba) */}
                        <stop
                            offset='50%'
                            stopColor={theme.palette.primary.main}
                        />{' '}
                        {/* Color 2: Medio (Abajo) */}
                        <stop
                            offset='100%'
                            stopColor={theme.palette.primary.light}
                        />{' '}
                        {/* Color 3: Final (Vuelta arriba) */}
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress
                size='200px'
                variant='determinate'
                value={progress}
                aria-label='Loading…'
                sx={{
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                        // Aplicamos el gradiente cónico directamente al trazo
                        stroke: 'url(#my_gradient)', // Referencia al SVG si usas polyfill
                        // O mejor aún, usamos este truco de CSS:
                        background: 'conic-gradient(#ff0000, #ffff00, #00ff00)',
                        // Pero para CircularProgress lo ideal es usar un SVG Mask o definirlo así:
                    },
                    // La forma más compatible y limpia en MUI:
                    svg: {
                        filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.1))', // Opcional: suaviza bordes
                    },
                }}
            />
        </React.Fragment>
    );
}

export const LoadingCircle = ({ setProgress, progress }) => {
    const theme = useTheme();
 

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) =>
                prevProgress >= 100 ? 0 : prevProgress + 10
            );
        }, 500);
        return () => {
            clearInterval(timer);
        };
    }, [setProgress, progress]);

    return (
        <Box
            sx={{
                witdh: '250px',
                justifyContent: 'center',
                alignItems: 'center',
                height: '250px',
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <GradientCircularProgress
                        theme={theme}
                        progress={progress}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '30%',
                        animation: `${roseTransformation} 8s linear infinite`,
                        fontSize: '1.5rem',
                    }}
                >
                    <img
                        src={rose}
                        alt='Loading...'
                        style={{ width: '75px', height: '100px' }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export function NotregulableLoadingCircle () {
     const { images } = useSelector((state) => state.images);   
    return (
        <Paper
            sx={{
                position: 'relative',
                display: 'flex',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                p: .5,                
            }}
        >
            <Box
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    display: 'flex',
                    width: '200px',
                    backgroundColor: '#0000',
                }}
            >
                <Box>
                    <CircularProgress
                        size='150px'
                        variant='indeterminate'
                        aria-label='Loading…'
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '15%',
                        transition: 'left .7s linear',
                        animation: `${roseTransformation} 3s linear infinite`,
                        fontSize: '1.5rem',
                    }}
                >
                    <img
                        src={rose}
                        alt='Loading...'
                        style={{ width: '3em', height: '4em' }}
                    />
                </Box>
            </Box>
        </Paper>
    );
}
