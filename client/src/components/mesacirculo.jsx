import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const fraseAnimation = {
        '@keyframes fadeFrase': {
            '0%': { opacity: 0, transform: 'translateY(-100px)'},
            '20%': { opacity: 0 },    // Aparece suavemente en el primer 5% del tiempo
            '40%': { opacity: 0, transform: 'translateY(-100px)'},   // Se mantiene visible hasta el 20% (~0.8s)
        '60%': { opacity: 1, transform: 'translateY(0px)'},
        '80%': {opacity: 1, transform: 'translateY(0px)'},// Se desvanece suavemente al llegar al 25% (1s)
            '100%': { opacity: 0, transform: 'translateY(100px)'},  // Permanece oculto el resto del ciclo (3s restantes)
        },
        animation: 'fadeFrase 15s ease-in-out infinite',
};
    const invitadosAnimation = {
        '@keyframes fadeInvitados': {
            '0%': { opacity: 1, transform: 'translateY(0px)'},
            '20%': { opacity: 1 },    // Aparece suavemente en el primer 5% del tiempo
            '40%': { opacity: 1, transform: 'translateY(0px)'},   // Se mantiene visible hasta el 20% (~0.8s)
        '60%': { opacity: 0, transform: 'translateY(100px)'},
        '80%': {opacity: 0, transform: 'translateY(-100px)'},// Se desvanece suavemente al llegar al 25% (1s)
            '100%': { opacity: 1, transform: 'translateY(0px)'},   // Se mantiene visible el resto del ciclo
        },
        animation: 'fadeInvitados 15s ease-in-out infinite',
    };

const MesaCirculo = React.memo(({ numero, count, navigate, }) => (
    <Box
        onClick={() => navigate(`/admin/asignar-mesa/${numero}`)}
       
        sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'secondary.main',
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden',
            alignItems: 'center',
            cursor: "pointer",
            transition: 'all 0.2s ease',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 15px #D4AF37',
            },
            userSelect: "none" ,
            border: '2px solid #D4AF37',
        }}
    >
        
        <Box sx={{ ...invitadosAnimation, position: "absolute",  }} >
                <Typography 
                variant='body1'
                
                    sx={{ color: 'white', fontWeight: 'bold',}}
                >
                    Mesa {numero}
                </Typography>
            <Typography
                
                    variant='h3'
                    sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.8rem' }}
                >
                    {count} invitados
                </Typography>
            </Box>
        
        
            <Box  sx={{...fraseAnimation, position:"absolute"}}>
                {count === 10 && (
                <Typography

                        variant='body1'
                        sx={{ color: 'white', fontWeight: 'bold'}}
                    >
                        Esta Mesa está llena
                    </Typography>
                )}
                {count < 10 && count > 0 && (
                <Typography
                   
                        variant='body1'
                        sx={{ color: 'white', fontWeight: 'bold'}}
                    >
                        Esta mesa tiene {10 - count} asientos libres
                    </Typography>
                )}
                {count === 0 && (
                <Typography
                   
                        variant='body1'
                        sx={{ color: 'white', fontWeight: 'bold'}}
                    >
                        Esta mesa está vacía
                    </Typography>
                )}
            </Box>
        
    </Box>
));

export default MesaCirculo;
