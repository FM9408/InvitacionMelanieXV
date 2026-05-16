import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
   
    deleteMensajeofDB,
} from '../store/slices/mensajesSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Proptypes from 'prop-types';

export function CardMensaje ({ m }) {
    const [sender, setSender] = React.useState("")
    const {familias} = useSelector((state) => state.familias)
    const theme = useTheme();
    const dispatch = useDispatch();
    async function deleteHandle() {
        try {
            dispatch(deleteMensajeofDB(m.id));
        } catch (error) {
            console.error(error);
        }
    }
    React.useEffect(() => {
        if (m.apellido === "" || !m.apellido) {
            const familia = familias.find((f) => f.id === m.familia_Id);
            setSender(familia.apellido)
        }
    }, []);

    return (
        <Box
            key={m.id}
            sx={{
                flex: '0 0 auto', // Evita que la tarjeta se encoja
                width: { xs: '280px', sm: '320px' }, // Tamaño perfecto para lectura
                minHeight: '250px', // Altura uniforme
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                backgroundColor: theme.palette.background.paper,
                border: `2px solid ${theme.palette.secondary.main}`,
                boxShadow: `8px 8px 0px 0px ${theme.palette.secondary.dark}`, // Sombra sólida tipo "brutalista"
                p: 2,
                borderRadius: '8px',
            }}
        >
            <IconButton
                size='small'
                color='error'
                sx={{ position: 'absolute', top: 5, right: 5 }}
                onClick={() => deleteHandle()}
            >
                <DeleteIcon fontSize='small' />
            </IconButton>

            <Box
                sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <Typography
                    variant='adminH4'
                    sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: 'bold',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        pb: 1,
                        mb: 2,
                        textAlign: 'center',
                    }}
                >
                    Familia {sender} 
                </Typography>

                <Typography
                    sx={{
                        fontStyle: 'italic',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        flexGrow: 1,
                        overflowY: 'auto',
                        maxHeight: '120px', // Limita el texto largo sin romper la tarjeta
                        pr: 1,
                        fontFamily: 'Roboto, sans-serif',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                    }}
                >
                    "{m.mensaje}"
                </Typography>

                <Typography
                    variant='adminCaption'
                    sx={{
                        mt: 2,
                        color: theme.palette.text.secondary,
                        textAlign: 'right',
                        fontWeight: 'bold',
                    }}
                >
                    {m.enviadoHace < 60 ?
                        `Hace ${m.enviadoHace} min`
                    :   `Hace ${Math.floor(m.enviadoHace / 60)} hrs`}
                </Typography>
            </Box>
        </Box>
    );
}

CardMensaje.propTypes = {
    m: Proptypes.shape({
        id: Proptypes.number.isRequired,
        apellido: Proptypes.string.isRequired,
        mensaje: Proptypes.string.isRequired,
        enviadoHace: Proptypes.number.isRequired,
    }).isRequired,
};



