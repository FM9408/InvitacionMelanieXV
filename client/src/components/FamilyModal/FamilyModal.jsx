import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Typography,
    Box,
    useTheme,
    Container,
    Grid,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AdminLogInButton from '../logInButton';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Add,
    Delete,
    Save,
    Send,
    CheckCircle,
    Cancel,
    PersonSearch,
} from '@mui/icons-material';
import { bool, string, object, func } from 'prop-types';
import { setConfirmation } from '../../hooks/database';
import SeleccionarModoDashboard from "../../modules/Admin/seleccionarModeDashBoard"
import RoseDevider from '../Decorations/roseDivider';
import EditModeDashBoard from '../../modules/Admin/editModeDashboard';
import BuscarModeDashBoard from '../../modules/Admin/buscarModeDashboard';
import ConfirmarModeDashboard from '../../modules/Admin/confirmarModeDasbord';
import AñadirModeDashboard from '../../modules/Admin/añadirModeDashboard';

const FamilyModal = ({
    open,
    onClose,
    mode,
    initialData,
    onSave,
    onError,
    invitadosList,
    setHasOpened,
}) => {
    const { datos } = useSelector((state) => state.invitado);
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(0);
    const [willAssist, setWillAssist] = useState([]);
    const [wontAssist, setWontAssist] = useState([]);
    const [search, setSearch] = useState('');
    const theme = useTheme();
    const [familyData, setFamilyData] = useState({
        nombreFamilia: '',
        invitados: [{ nombre: '' }],
        //mensaje: ''
    });

    // Resetear o cargar datos al abrir
    useEffect(() => {
        if (mode === 'Confirmar' && datos.miembros.length === 0) {
            navigate('/');
        }
        return () => {
            if (mode === 'Editar') {
                setFamilyData({
                    nombreFamilia: initialData.apellido,
                    invitados: initialData.miembros,
                });
            }
        };
    }, [initialData, open, mode, datos.miembros.length, navigate]);

    // Manejadores para el modo Registro
    const addMember = () => {
        setFamilyData({
            ...familyData,
            invitados: [...familyData.invitados, { nombre: '' }],
        });
    };

    const assistHandler = (miembro) => {
        setWontAssist(wontAssist.filter((member) => member !== miembro.id));
        const arrayHandler = willAssist.filter(
            (member) => member === miembro.id
        );
        setWillAssist(arrayHandler);
        setWillAssist([...willAssist, miembro.id]);
    };

    const onHoverHandler = () => {
        setHovered(360);
    };
    const onLeaveHandler = () => {
        setHovered(0);
    };

    const dontAssistHandler = (miembro) => {
        setWillAssist(willAssist.filter((member) => member !== miembro.id));
        const arrayHandler = wontAssist.filter(
            (member) => member === miembro.id
        );
        setWontAssist(arrayHandler);
        setWontAssist([...wontAssist, miembro.id]);
    };
    function confirmationHandler() {
        setConfirmation(willAssist, wontAssist);
        navigate(`/user/${datos.id}/dashboard`);
        onClose();
    }

    const updateMember = (index, value) => {
        const newMembers = [...familyData.invitados];
        newMembers[index].nombre = value;
        setFamilyData({ ...familyData, invitados: newMembers });
    };
    const setDisablehandler = () => {
        const bool =
            datos.miembros.length === willAssist.length + wontAssist.length;

        return !bool;
    };
    const removeMember = (index) => {
        const newMembers = familyData.invitados.filter((_, i) => i !== index);
        setFamilyData({ ...familyData, invitados: newMembers });
    };

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (
                    mode !== 'Añadir' ||
                    mode !== 'Editar' ||
                    reason !== 'backdropClick'
                ) {
                    onClose();
                }
            }}
            fullWidth
            maxWidth='sm'
            sx={{ backdropFilter: 'blur(10px)', width:"100%" }}
        >
            <DialogTitle
                sx={{ width: '100%', textAlign: 'center', overflow: 'clip' }}
            >
                {mode === 'Añadir' && 'Registrar Nueva Familia'}
                {mode === 'Editar' && (
                    <Box
                        sx={{ mb: -5, width: '100%', textAlign: 'center' }}
                    >
                        <Typography
                            variant='SearchFont'
                            gutterBottom
                            sx={{
                                textShadow: `1px -1px 0 ${theme.palette.secondary.main}}`,
                                color: `${theme.palette.primary.main}`,
                            }}
                        >
                            Editar Familia
                        </Typography>
                    </Box>
                )}
                {mode === 'Confirmar' && (
                    <Container
                        sx={{ mb: -5, width: '100%', textAlign: 'center' }}
                    >
                        <Typography
                            variant='SearchFont'
                            gutterBottom
                            sx={{
                                textShadow: `1px -1px 0 ${theme.palette.secondary.main}}`,
                                color: `${theme.palette.primary.main}`,
                            }}
                        >
                            ¿Quienes nos acompañarán?
                        </Typography>
                    </Container>
                )}
                {mode === 'Seleccionar' && (
                    <Container
                        sx={{ mb: -5, textAlign: 'center', width: '100%' }}
                    >
                        <Typography
                            variant='SearchFont'
                            gutterBottom
                            sx={{
                                textShadow: `1px -1px 0 ${theme.palette.secondary.main}}`,
                                color: `${theme.palette.primary.main}`,
                            }}
                        >
                            Confirma tus apellidos
                        </Typography>
                    </Container>
                )}
                {mode === 'Buscar' && (
                    <Container sx={{ mb: -5 }}>
                        <Typography
                            variant='SearchFont'
                            gutterBottom
                            sx={{
                                textShadow: `1px -1px 0 ${theme.palette.secondary.main}}`,
                                color: `${theme.palette.primary.main}`,
                                width:"100%"
                            }}
                        >
                            Por favor introduce tu apellido o tu nombre
                        </Typography>
                    </Container>
                )}
                {mode === 'Mensaje' && (
                    <Container sx={{ mb: -5 }}>
                        <Typography variant='SearchFont' gutterBottom>
                            Envia una dedicatoria a la cumpleañera
                        </Typography>
                    </Container>
                )}
            </DialogTitle>
            <RoseDevider />
            <DialogContent>
                {/* MODO REGISTRO: Apellido y lista de miembros */}
                {mode === 'Añadir' && (
                   <AñadirModeDashboard addMember={addMember} familyData={familyData} removeMember={removeMember}setFamilyData={setFamilyData}updateMember={updateMember}º/>
                )}

                {/* MODO CONFIRMACIÓN: Checkbox o botones para cada uno */}
                {mode === 'Confirmar' && (
                    <ConfirmarModeDashboard  assistHandler={assistHandler} datos={datos} dontAssistHandler={dontAssistHandler} familyData={familyData} willAssist={willAssist} wontAssist={wontAssist} />
                )}

                {/* MODO MENSAJE: Textarea para dedicatoria */}

                {mode === 'Buscar' && (
                   <BuscarModeDashBoard onClose={onClose} onError={onError} onSave={onSave} search={search} setSearch={setSearch}  />
                )}
                {mode === 'Seleccionar' && (
                   <SeleccionarModoDashboard invitadosList={invitadosList} onSave={onSave} />
                )}
                {mode === 'Editar' && (
                   <EditModeDashBoard addMember={addMember} familyData={familyData} setFamilyData={setFamilyData} onSave={onSave} onClose={onClose}/>
                )}
            </DialogContent>

            <DialogActions>
                {mode === 'Añadir' ||
                    (mode === 'Editar' && (
                        <Button onClick={onClose}>Cancelar</Button>
                    ))}
                {mode === 'Confirmar' && (
                    <Box
                        onMouseEnter={onHoverHandler}
                        onMouseLeave={onLeaveHandler}
                        sx={{ width: '30%' }}
                    >
                        <Button
                            onClick={() => {
                                onClose();
                                dispatchEvent(new Event('restartInvitation'));
                                globalThis.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                });

                                setHasOpened(false);
                            }}
                            variant='contained'
                            sx={{ width: '100%' }}
                            startIcon={
                                <RestartAltIcon
                                    sx={{
                                        transition: 'transform 1s linear',
                                        transform: `rotate(${hovered}deg)`,
                                    }}
                                />
                            }
                        >
                            <Typography variant='button'>
                                Ver de nuevo
                            </Typography>
                        </Button>
                    </Box>
                )}
                {mode === 'Confirmar' ?
                    <Button
                        variant='contained'
                        sx={{ width: '70%' }}
                        disabled={setDisablehandler()}
                        onClick={() => {
                            confirmationHandler();
                            onClose();
                        }}
                    >
                        <Typography variant='button'>
                            Enviar confirmación
                        </Typography>
                    </Button>
                :   <Box sx={{ width: '100%' }}>
                        {mode !== 'Seleccionar' && (
                            <Box>
                                <Grid container direction='row'>
                                    <Grid item sx={{ width: globalThis.location.pathname.includes('/admin') ? '100%' :'70%' }}>
                                        <Button
                                            disabled={
                                                search.length === 0 &&
                                                mode === 'Buscar'
                                            }
                                            fullWidth
                                            variant='contained'
                                            startIcon={
                                                mode === 'Buscar' ?
                                                    <PersonSearch />
                                                :   <Save />
                                            }
                                            onClick={() => {
                                                if (mode === 'Buscar') {
                                                    onSave(search);

                                                    onClose();
                                                } else if (
                                                    mode === 'Confirmar'
                                                ) {
                                                    confirmationHandler();
                                                    onClose();
                                                } else {
                                                    setFamilyData({
                                                        nombreFamilia: '',
                                                        invitados: [
                                                            { nombre: '' },
                                                        ],
                                                    });
                                                    onSave(familyData);
                                                    onClose();
                                                }
                                            }}
                                            sx={{ width: '100%' }}
                                        >
                                            {mode === 'Añadir' ?
                                                'Guardar Familia'
                                            : mode === 'Buscar' ?
                                                'Buscar'
                                            :   'Enviar'}
                                        </Button>
                                    </Grid>
                                    <Grid item sx={{ width: '30%' }}>
                                        {mode === 'Buscar' && (
                                            <AdminLogInButton />
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                }
            </DialogActions>
        </Dialog>
    );
};

export default FamilyModal;

FamilyModal.propTypes = {
    open: bool.isRequired,
    onClose: func.isRequired,
    mode: string.isRequired,
    initialData: object,
    onSave: func.isRequired,
    onError: func.isRequired,
    invitadosList: object,
    setHasOpened: func.isRequired,
};
