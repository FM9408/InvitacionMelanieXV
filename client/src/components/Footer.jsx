import { Box, Typography, useTheme } from '@mui/material'

const Footer = () => {
    const theme = useTheme()
    return (
        <Box
            component='footer'
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                textAlign: 'center',
                borderTop: '1px solid #eee',
                backgroundColor: theme.palette.secondary.dark
        }}
        >
            <Typography variant='body2' color={theme.palette.common.white}>
                © {new Date().getFullYear()} - Gestión de Eventos | Pagina creada por Felipe Medina
            </Typography>
        </Box>
    );
}

export default Footer
