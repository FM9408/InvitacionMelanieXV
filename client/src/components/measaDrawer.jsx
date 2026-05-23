import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import propTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';

const MesasDrawer = ({ onDrop, sinMesa, mesaId }) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
        <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, 0, mesaId)}
            sx={{
                // En móvil se acopla al flujo abajo, en PC se queda fijo a la izquierda
                width: isMobile ? "100%" : "35%",
                height: isMobile ? "35vh" : "100vh",
                p: 2,
                bgcolor: '#fafafa',
                borderRight: isMobile ? 'none' : '1px solid #ddd',
                borderTop: isMobile ? '1px solid #ddd' : 'none',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}
        >
            <IconButton onClick={() => navigate(-1)} sx={{ mb: isMobile ? 0.5 : 2, alignSelf: 'flex-start' }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                Invitados Pendientes
            </Typography>
            <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {sinMesa.map((inv) => (
                    <ListItem
                        key={inv.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('invitadoId', inv.id)}
                        sx={{
                            bgcolor: 'white',
                            mb: 1,
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'grab',
                            '&:active': { cursor: 'grabbing' }
                        }}
                    >
                        <ListItemText primary={inv.nombreCompleto} secondary={inv.familiaNombre} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

MesasDrawer.propTypes = {
    onDrop: propTypes.func.isRequired,
    sinMesa: propTypes.array.isRequired,
    mesaId: propTypes.number
};

export default MesasDrawer;