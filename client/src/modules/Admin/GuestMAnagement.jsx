import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchInvitados } from '../../store/slices/adminSlice';
import { IconButton } from '@mui/material';
import { AddaFamily } from '../../store/slices/familiesSlice';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import FamilyModal from '../../components/FamilyModal/FamilyModal';
import { string } from 'prop-types';
// import { registrarFamilia } from '../../api/invitationsApi'; // Tu función de Axios

function HandleBottonIcon(mode) {
    if (mode === 'Añadir') {
        return <AddIcon />;
    } else if (mode === 'Mensaje') {
        return <EmailIcon />;
    } else {
        return <CheckCircleIcon />;
    }
}

export const GuestManagement = ({ mode, totalGuests }) => {
    // 1. El estado para controlar el modal
    const dispatch = useDispatch();
    const [icon, setIcon] = useState(HandleBottonIcon(mode));
    const [error, setError] = useState({
        state: false,
        message: '',
    });
    const [modalConfig, setModalConfig] = useState({
        open: false,
        mode: mode,
        data: null,
    });
    React.useEffect(() => {
        setIcon(HandleBottonIcon(mode));
    }, [mode]);

    function saveAndRfresh(data) {
        try {
            dispatch(AddaFamily(data));
        } catch (error) {
            setError(error);
        }
        setModalConfig({ ...modalConfig, open: false, data: null });
    }
    const handleClose = () =>
        setModalConfig({ ...modalConfig, open: false, data: null });

    const handleSave = async (data) => {
        // Aquí mandas los datos a PostgreSQL
        try {
            // await registrarFamilia(data);
            mode === 'Añadir' ?
                saveAndRfresh(data)
                // Refresca la lista de invitados después de agregar una familia
            :   console.log('Modo no implementado aún');
            handleClose();
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    return (
        <div>
            <IconButton
                onClick={() =>
                    setModalConfig({ open: true, mode: mode, data: null })
                }
                disabled={totalGuests !== 150 ? false : true} // Ejemplo: desactivar si ya hay 10 invitados
            >
                {icon}
            </IconButton>

            {/* 2. El componente se coloca aquí, al final del JSX */}
            <FamilyModal
                open={modalConfig.open}
                mode={modalConfig.mode}
                onError={error}
                key={modalConfig.mode}
                initialData={modalConfig.data}
                onClose={handleClose}
                onSave={handleSave}
            />
        </div>
    );
};

GuestManagement.propTypes = {
    mode: string.isRequired,
};
