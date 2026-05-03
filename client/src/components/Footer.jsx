import { Box, Typography } from '@mui/material'

const Footer = () => (
    <Box
        component='footer'
        sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            textAlign: 'center',
            borderTop: '1px solid #eee'
        }}
    >
        <Typography variant='body2' color='text.secondary'>
            © {new Date().getFullYear()} - Gestión de Eventos | En memoria de
            Gonzalo y Magda
        </Typography>
    </Box>
)

export default Footer
