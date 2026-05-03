import { Box, Button, Container } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <Container
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: 4
            }}
        >
            <Box
                component='img'
                src='https://illustrations.popsy.co/gray/falling.svg' // Puedes cambiar esta URL por tu imagen local o preferida
                alt='404 Not Found'
                sx={{
                    width: '100%',
                    maxWidth: { xs: 300, md: 500 },
                    height: 'auto'
                }}
            />

            <Button
                variant='contained'
                component={Link}
                to='/'
                size='large'
                sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                }}
            >
                Volver al Inicio
            </Button>
        </Container>
    )
}

export default NotFound
