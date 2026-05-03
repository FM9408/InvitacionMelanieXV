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
} from '@mui/material';
import React from 'react';
import { LoadingCircle } from '../../components/Decorations/LoadingCircle';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInvitados, deleteFamilia } from '../../store/slices/adminSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FamilyModal from '../../components/FamilyModal/FamilyModal';

// const guests = [
//   { id: 1, nombre: 'Familia Medina', pases: 4, estado: 'Confirmado' },
//   { id: 2, nombre: 'Juan Pérez', pases: 2, estado: 'Pendiente' },
//   { id: 3, nombre: 'Dra. Magda', pases: 1, estado: 'Cancelado' },
// ];

// const getChipColor = (status) => {
//     if (
//         status === 'Confirmado' ||
//         status === 'Aprobado' ||
//         status === 'Confirmada'
//     )
//         return 'success';
//     if (status === 'Pendiente') return 'warning';
//     return 'error';
// };

const GuestListModule = () => {
    let [guests, setGuests] = React.useState([]);
    const [progress, setProgress] = React.useState(0);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalData, setModalData] = React.useState({});
    const dispatch = useDispatch();
    let { invitados, loadingAdmin } = useSelector((state) => state.admin);
    const [loadingInfo, setLoadingInfo] = React.useState(true);

    function editModal(id) {
        setModalData(invitados.find((familia) => familia.id === id));
        setModalOpen(true);
    }

    React.useEffect(() => {
        if (guests.length === 0 || guests.length !== invitados.length) {
            setLoadingInfo(true);
            setGuests(invitados);
        } else {
            setTimeout(() => {
                setProgress(100);
                setLoadingInfo(false);
            }, 4000);
        }
    }, [progress, guests.length, loadingAdmin]);
    function deleteHandler(id) {
        dispatch(deleteFamilia(id));
        setTimeout(() => {
            dispatch(fetchInvitados());
        }, 500);
    }

    return (
        <Box>
            {loadingInfo ?
                <Box
                    sx={{
                        width: '100%',
                        alignItems: 'center',
                        height: 'max-content',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '2rem',
                        borderRadius: '8px',
                    }}
                >
                    <LoadingCircle
                        progress={progress}
                        setProgress={setProgress}
                    />
                </Box>
            :   <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Familia</TableCell>
                                <TableCell align='center'>Pases</TableCell>
                                <TableCell align='center'>Estado</TableCell>
                                <TableCell align='center'>Miembros</TableCell>
                                <TableCell align='right'>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {guests.map((guest) => (
                                <TableRow key={guest.id}>
                                    <TableCell
                                        fontWeight='500'
                                        sx={{
                                            maxWidth: {
                                                xs: '100px',
                                                md: '200px',
                                            },
                                            overflow: 'auto',
                                            textOverflow: 'ellipsis',
                                            overflowWrap: 'break-word',
                                            transition: 'all .2s ease-in-out ',
                                        }}
                                    >
                                        {guest.apellido}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {guest.pases}
                                    </TableCell>
                                    <TableCell align='center'>
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
                                            size='small'
                                            variant='outlined'
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Grid
                                            container
                                            justifyContent={'space-around'}
                                        >
                                            {guest.miembros.map((member) => (
                                                <Grid item key={member.id}>
                                                    <Chip
                                                        label={member.nombre}
                                                        size='small'
                                                        variant='filled'
                                                        color={
                                                            (
                                                                member.willAssist ===
                                                                'Confirmado'
                                                            ) ?
                                                                'success'
                                                            : (
                                                                member.willAssist ===
                                                                'Pendiente'
                                                            ) ?
                                                                'warning'
                                                            :   'error'
                                                        }
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TableCell>
                                    <TableCell align='right'>
                                        {guest.isAccepted !== 'Cancelado' && (
                                            <Box>
                                                <IconButton
                                                    onClick={() =>
                                                        editModal(guest.id)
                                                    }
                                                    size='small'
                                                >
                                                    <EditIcon fontSize='small' />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() =>
                                                        deleteHandler(guest.id)
                                                    }
                                                    size='small'
                                                    color='error'
                                                >
                                                    <DeleteIcon fontSize='small' />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            {modalOpen && (
                <FamilyModal
                    initialData={modalData}
                    onClose={() => setModalOpen(false)}
                    open={modalOpen}
                    mode={'Editar'}
                />
            )}
        </Box>
    );
};

export default GuestListModule;
