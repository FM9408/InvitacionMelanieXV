import React from "react";
import Box from '@mui/material/Box'
import Typography from "@mui/material/Typography";


const MesaCirculo = React.memo(({ numero, count, navigate }) => (
        <Box
            onClick={() => navigate(`/admin/asignar-mesa/${numero}`)}
            sx={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                bgcolor: 'secondary.main',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'scale(1.05)', boxShadow: '0 0 15px #D4AF37' },
                border: '2px solid #D4AF37',
            }}
        >
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                Mesa {numero}
            </Typography>
            <Typography variant="h3" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.8rem' }}>
                {count} invitados
            </Typography>
        </Box>
));
    




export default MesaCirculo;