import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { IconButton, Tooltip, Zoom } from '@mui/material';
import PropTypes from 'prop-types';

// Iconos
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';

// Componentes y Slices
import FamilyModal from '../../components/FamilyModal/FamilyModal';
import { AddaFamily } from '../../store/slices/familiesSlice';
import { setError } from '../../store/slices/mensajesSlice';

/**
 * Hook personalizado interno para manejar la lógica de iconos
 * de forma limpia y eficiente.
 */
const getIconByMode = (mode) => {
    switch (mode) {
        case 'Añadir': return <AddIcon />;
        case 'Mensaje': return <EmailIcon />;
        default: return <CheckCircleIcon />;
    }
};

export const GuestManagement = ({ mode, totalGuests }) => {
    const dispatch = useDispatch();
    const familias = useSelector(state => state.familias)
    
    
    // Estado para el modal
    const [modalOpen, setModalOpen] = useState(false);
    
    // Memoizamos el icono para que no se recalcule innecesariamente
    const icon = useMemo(() => getIconByMode(mode), [mode]);

    // Límite de invitados (ejemplo basado en tu lógica anterior)
    const isLimitReached = totalGuests >= 150;
    
    // --- Manejadores de Eventos ---
    
    const handleOpen = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setModalOpen(false);
    }, []);

    /**
     * Proceso de guardado perfeccionista:
     * 1. Lanza la acción asíncrona a Redux (que debe impactar la DB).
     * 2. No necesitamos refrescar localmente manualmente si el socket
     * en App.jsx ya escucha 'newFamilyCreated' para disparar fetchInvitados.
     */
    const handleSave = async (data) => {
        try {
            if (mode === 'Añadir') {
                // Suponiendo que AddaFamily es un thunk que hace el POST
                await dispatch(AddaFamily(data)).unwrap();
                
                // Opcional: Solo si el socket tarda mucho en responder
                // dispatch(fetchInvitados());
                
            
            } 
            handleClose();
        } catch (err) {
            dispatch(setError({ hasError: true, message: err.message }))
            setTimeout(() => dispatch(setError({ hasError: false, message: '' }), 5000))
            // Aquí podrías disparar un Snackbar/Alerta de error
        }
    };
    React.useEffect(() => {

    }, [modalOpen, familias])

    return (
        <>
            <Tooltip 
                title={isLimitReached ? "Límite de invitados alcanzado" : `${mode} Familia`}
                slots={{transition: Zoom}}
                arrow
            >
                <span> {/* Span necesario para mostrar tooltip en botones deshabilitados */}
                    <IconButton
                        color="primary"
                        onClick={handleOpen}
                        disabled={isLimitReached && mode === 'Añadir'}
                        sx={{
                            backgroundColor: 'background.paper',
                            boxShadow: 1,
                            '&:hover': { backgroundColor: 'action.hover' }
                        }}
                    >
                        {icon}
                    </IconButton>
                </span>
            </Tooltip>

            {modalOpen && (
                <FamilyModal
                    open={modalOpen}
                    mode={mode}
                    onClose={handleClose}
                    onSave={handleSave}
                    // Pasamos solo los datos necesarios para evitar re-renders
                    key={`${mode}-modal`} 
                />
            )}
        </>
    );
};

GuestManagement.propTypes = {
    mode: PropTypes.oneOf(['Añadir', 'Mensaje', 'Confirmar']).isRequired,
    totalGuests: PropTypes.number
};

GuestManagement.defaultProps = {
    totalGuests: 0
};