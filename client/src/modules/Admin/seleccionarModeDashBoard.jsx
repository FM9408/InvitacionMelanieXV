import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

function SeleccionarModeDashBoard({ invitadosList, onSave }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {invitadosList.map((familia) => {
                return (
                    <Box
                        key={familia.id}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography variant='invitadoName'>
                            {familia.apellido}
                        </Typography>
                        <Box>
                            <Button
                                color='success'
                                startIcon={<CheckCircle />}
                                onClick={() => onSave(familia)}
                            >
                                Seleccionar
                            </Button>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

export default SeleccionarModeDashBoard;
