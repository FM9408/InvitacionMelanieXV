import React from 'react';
import { Typography, Box, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import { CardMensaje } from '../../components/CardMensaje';

const MessagesModule = ({ mensajesState = [] }) => {
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.up('md'));


    return (
        <Box sx={{ overflowY: 'clip', mx:2, overflow:"visible"}}>
            <Box
                sx={{
                    width: '100%',
                    overflowX: 'auto', // Scroll horizontal para las tarjetas
                   mx:-1,
                  
                    
                   // Espacio para que el scroll no tape las tarjetas
                    '&::-webkit-scrollbar': { height: '8px' }, // Scroll horizontal delgado
                    '&::-webkit-scrollbar-thumb': {
                        background: theme.palette.secondary.main,
                        borderRadius: '10px',
                    },
                }}
            >
                {mensajesState.length === 0 ?
                    <Typography sx={{ p: 2 }}>Aún no hay mensajes</Typography>
                :   <Box
                        sx={{
                            display: 'inline-flex',
                             justifyContent: md ? "center" : "flex-start",
                            flexDirection: 'row',
                            gap: 2,
                            overflow:"visible",
                            width: '100%',
                        
                            mx:-1
                         
                        }}
                    >
                        {mensajesState.map((m) => (
                            <CardMensaje key={m.id} m={m} theme={theme} />
                        ))}
                    </Box>
                }
            </Box>
        </Box>
    );
};

export default MessagesModule;
