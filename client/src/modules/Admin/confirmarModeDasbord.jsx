import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';



function ConfirmarModeDashboard ({ familyData, datos, willAssist, wontAssist, assistHandler, dontAssistHandler }) {
    
  
    
  

    return (
        <Box>
            <Typography variant='h6' gutterBottom>
                {familyData.nombreFamilia}
            </Typography>
            {datos?.miembros.map((inv) => (
                <Box
                    key={inv.id}
                    sx={{
                        display: 'flex',
                        width: `${100}%`,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography
                        sx={{ width: `${100 / 3}%` }}
                        variant='invitadoName'
                    >
                        {inv.nombreCompleto}
                    </Typography>

                    <Button
                        color='success'
                        startIcon={<CheckCircle />}
                        variant={
                           willAssist.includes(inv.id) && !wontAssist.includes(inv.id) || inv.willAssist === 'Confirmado' && !wontAssist.includes(inv.id) ? 'contained' : 'text'
                        }
                        onClick={() => {
                            assistHandler(inv);
                        }}
                        sx={{
                            width: `${100 / 3}%`,
                            pointerEvents:
                                willAssist.includes(inv.id) ? 'none' : 'auto',
                        }}
                    >
                        <Typography variant='subtitle1'>Asiste</Typography>
                    </Button>
                    <Button
                        variant={
                            wontAssist.includes(inv.id) && !willAssist.includes(inv.id) || inv.willAssist === 'Rechazada' && !willAssist.includes(inv.id) ? 'contained' : 'text'
                        }
                        onClick={() => {
                            dontAssistHandler(inv);
                        }}
                        sx={{
                            width: `${100 / 3}%`,
                            pointerEvents:
                                wontAssist.includes(inv.id) ? 'none' : 'auto',
                        }}
                        color='error'
                        startIcon={<Cancel />}
                    >
                        <Typography variant='subtitle1'>No asiste</Typography>
                    </Button>
                </Box>
            ))}
        </Box>
    );
}


export default ConfirmarModeDashboard;