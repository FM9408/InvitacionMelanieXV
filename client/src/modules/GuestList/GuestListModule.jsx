import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Grid,
    Box,
    Tooltip,
    Paper,
} from '@mui/material';

// Iconos
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Contexto y Slices
import { LoadingCircle } from '../../components/Decorations/LoadingCircle';
import {
    deleteFamilia,
    deleteFamiliaLocal,
    setCurrentUser,
} from '../../store/slices/adminSlice';
import { actualizarFamilia } from '../../store/slices/familiesSlice';
import FamilyModal from '../../components/FamilyModal/FamilyModal';

const GuestListModule = () => {
    const dispatch = useDispatch();

    // Selectores de Redux
    const { invitados,} = useSelector((state) => state.admin);
const familias = useSelector(state => state.familias)
    // Estados locales
    const [progress, setProgress] = useState(0);
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [modalConfig, setModalConfig] = useState({ open: false, data: null });

    // --- Lógica de Carga Inicial ---
    React.useEffect(() => {
        // Si ya tenemos invitados, no necesitamos mostrar el loading de 4 segundos
        if (invitados.length > 0) {
            setLoadingInfo(false);
            return;
        }

        // Solo si está vacío, esperamos
        const timer = setTimeout(() => setLoadingInfo(false), 2000);
        return () => {
            clearTimeout(timer);
        };
    }, [invitados, loadingInfo, setLoadingInfo, familias]); // NO dependas de 'progress' aquí

    // --- Manejadores de Acciones ---
    const handleEdit = (familia) => {
        dispatch(setCurrentUser(invitados.find(family => family.id === familia.id)))
        
     
            setTimeout(() => {
                setModalConfig({ open: true, data: familia });
            }, 1000);
        
        
    };

    const handleDelete = (id) => {
        // Confirmación simple antes de borrar (Perfeccionismo)
        if (globalThis.confirm('¿Estás seguro de eliminar esta familia?')) {
            dispatch(deleteFamilia(id));
            dispatch(deleteFamiliaLocal(id));
            // No es necesario fetchInvitados aquí si tu backend emite un socket
            // que App.jsx ya escucha para refrescar la lista.
        }
    };

    // Función para determinar el color del chip de asistencia
    const getAssistColor = (status) => {
        switch (status) {
            case 'Confirmado':
                return 'success';
            case 'Pendiente':
                return 'warning';
            default:
                return 'error';
        }
    };
   const saveEdition = async (familyData) => {
        
        try {
            const data = dispatch(actualizarFamilia(familyData))
            setModalConfig({ open: false, data: null });
            setProgress(0);
        } catch (error) {
            throw new Error(error);
        }

    }
    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            {loadingInfo ?
                <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                    <LoadingCircle
                        progress={progress}
                        setProgress={setProgress}
                    />
                </Box>
            :   <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ maxHeight: '70vh', width: '100%'}}
                >
                    <Table stickyHeader size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Familia
                                </TableCell>
                                <TableCell
                                    align='center'
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Pases
                                </TableCell>
                                <TableCell
                                    align='center'
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Vista
                                </TableCell>
                                <TableCell
                                    align='center'
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Miembros
                                </TableCell>
                                <TableCell
                                    align='right'
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Acciones
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invitados.map((guest) => (
                                <TableRow key={guest.id} hover>
                                    <TableCell
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '2.4rem',
                                            maxWidth: `${100 / 4}%`,
                                        }}
                                    >
                                        {guest.apellido}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {guest.pases}
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{ maxWidth: `${100 / 4}%` }}
                                    >
                                        <Chip
                                            label={
                                                guest.hasViewed ? 'Vista' : (
                                                    'No vista'
                                                )
                                            }
                                            color={
                                                guest.hasViewed ? 'success' : (
                                                    'error'
                                                )
                                            }
                                            size='medium'
                                            variant='filled'
                                            sx={{ fontSize: '1.3rem' }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        align='center'
                                        sx={{ maxWidth: `${100 / 4}%` }}
                                    >
                                        <Grid
                                            container
                                            spacing={0.5}
                                            justifyContent='center'
                                        >
                                            {guest.miembros.map((member) => (
                                                <Grid
                                                    item
                                                    key={member.id}
                                                    sx={{ maxWidth: '100%' }}
                                                >
                                                    <Tooltip
                                                        title={`${member.nombre}: ${member.willAssist}`}
                                                    >
                                                        <Chip
                                                            label={
                                                                member.nombre
                                                            }
                                                            size='small'
                                                            color={getAssistColor(
                                                                member.willAssist
                                                            )}
                                                            sx={{
                                                                fontSize:
                                                                    '1.7rem',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TableCell>
                                    <TableCell
                                        align='right'
                                        sx={{ maxWidth: `${100 / 4}%` }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    handleEdit(guest)
                                                }
                                                size='small'
                                                color='primary'
                                            >
                                                <EditIcon fontSize='small' />
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleDelete(guest.id)
                                                }
                                                size='small'
                                                color='error'
                                            >
                                                <DeleteIcon fontSize='small' />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            {/* Modal de Edición */}
            {modalConfig.open && (
                <FamilyModal
                    initialData={modalConfig.data}
                    onClose={() => setModalConfig({ open: false, data: null })}
                    onSave={saveEdition }
                    open={modalConfig.open}
                    mode='Editar'
                />
            )}
        </Box>
    );
};

export default GuestListModule;
