import React from 'react'
import { Typography, Box, Container } from '@mui/material'
import { useTheme } from '@emotion/react'
import { socket } from '../../hooks/ioSockets/socket'
import {useSelector } from 'react-redux'
import { CardMensaje } from '../../components/CardMensaje'


const MessagesModule = () => {
    const theme = useTheme()
  
    const { mensajes, loadingMensajes } = useSelector((state) => state.mensajes)
    

   

    return (
        <Container sx={{ overflowY: 'clip', overflowX: 'auto' }}>
            <Box
                sx={{
                    width: '100%',
                    overflowX: 'auto', // Scroll horizontal para las tarjetas
                    display: 'flex',
                    pb: 2, // Espacio para que el scroll no tape las tarjetas
                    '&::-webkit-scrollbar': { height: '8px' }, // Scroll horizontal delgado
                    '&::-webkit-scrollbar-thumb': {
                        background: theme.palette.secondary.main,
                        borderRadius: '10px'
                    }
                }}
            >
                {mensajes.length === 0 && !loadingMensajes ? (
                    <Typography sx={{ p: 2 }}>Aún no hay mensajes</Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                                gap: 2,
                            width: '100%',
                            p: 1
                        }}
                    >
                        {mensajes.map((m) => (
                            <CardMensaje key={m.id} m={m} theme={theme} />
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    )
}

export default MessagesModule
