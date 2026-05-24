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
import { useSelector, useDispatch } from 'react-redux';
import {
   
    Save,
    Send,
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
import { setUser } from '../../store/slices/authSlice';

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
    const { familias } = useSelector((state) => state.familias.familias);
const dispatch  = useDispatch();
    const { user } = useSelector((state) => state.auth);
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
    // 1. Redirección si no hay miembros en confirmación
    if (mode === 'Confirmar' && datos.miembros.length === 0) {
        navigate('/');
    }
    
    // 2. Cargar los datos de edición AL ENTRAR (No en el return)
    if (mode === 'Editar' && initialData) {
        setFamilyData({
            nombreFamilia: initialData.apellido,
            invitados: initialData.miembros,
            id: initialData.id
        });
    }
    
    // Eliminamos el return ruidoso para evitar el bucle infinito
}, [initialData, open, mode, datos.miembros.length, navigate]);
    // Manejadores para el modo Registro
    const addMember = () => {
        setFamilyData({
            ...familyData,
            invitados: [...familyData.invitados, { nombre: '' }],
        });
    };

const assistHandler = (miembro) => {
    // 1. Lo removemos del array de los que NO asisten si es que estaba ahí
    setWontAssist(wontAssist.filter((member) => member !== miembro.id));
    
    // 2. Lo agregamos al array de los que SÍ asisten, evitando duplicados de ID de forma limpia
    setWillAssist((prev) => {
        if (prev.includes(miembro.id)) return prev;
        return [...prev, miembro.id];
    });
};

const dontAssistHandler = (miembro) => {
    // 1. Lo removemos del array de los que SÍ asisten si es que estaba ahí
    setWillAssist(willAssist.filter((member) => member !== miembro.id));
    
    // 2. Lo agregamos al array de los que NO asisten de forma segura
    setWontAssist((prev) => {
        if (prev.includes(miembro.id)) return prev;
        return [...prev, miembro.id];
    });
};

    const onHoverHandler = () => {
        setHovered(360);
    };
    const onLeaveHandler = () => {
        setHovered(0);
    };

   
    function confirmationHandler() {
        setConfirmation(willAssist, wontAssist);
        navigate(`/user/${datos.id}/dashboard`);
        const miembrosActualizados = user.miembros.map((miembro) => {
            if (willAssist.includes(miembro.id)) {
                return { ...miembro, willAssist: "Confirmado" }; // Ajusta si tu BD usa otro string
            }
            if (wontAssist.includes(miembro.id)) {
                return { ...miembro, willAssist: "Rechazada" };
            }
            return miembro;
        });

        // 4. Estructuramos el nuevo objeto de usuario idéntico al original pero con los cambios
        const usuarioActualizado = { 
            ...user, 
            miembros: miembrosActualizados 
        };

        // ====================================================
        // ¡LA FUNCIÓN QUE BUSCABAS PARA EL sessionStorage!
        // ====================================================
        globalThis.sessionStorage.setItem('user', JSON.stringify(usuarioActualizado));

        // 5. Actualizamos Redux en memoria para que el Dashboard cambie al instante sin recargar
        dispatch(setUser(usuarioActualizado));
        onClose();
    }

    const updateMemberAdd = (index, value) => {
        if (value === '') return;
        const newMembers = familyData.invitados.map((item, i) => {
            if (i === index) {
                return { ...item, nombre: value };
            }
            return item;
        });
        setFamilyData({ ...familyData, invitados: newMembers });
    }


    const updateMember = ({ index, value }) => {
        
    if(value === "") return;
    
    // Mapeamos el array y creamos un objeto totalmente nuevo para el índice modificado
    const newMembers = familyData.invitados.map((item, i) => {
        if (i === index) {
            return { ...item, nombre: value }; // Copia el objeto de forma segura y pisa el nombre
        }
        return item;
    });

    setFamilyData({ ...familyData, invitados: newMembers });
};
  
    const removeMember = (index) => {
        const newMembers = familyData.invitados.filter((_, i) => i !== index);
        setFamilyData({ ...familyData, invitados: newMembers });
    };

    const disableHandler  = React.useMemo(() => {
        for (const invitado of familyData.invitados) {
            if (invitado.nombre === '') {
                return true;
            }
        }
        return false;
    },[familyData.invitados])
    





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
                   <AñadirModeDashboard addMember={addMember} familyData={familyData} removeMember={removeMember}setFamilyData={setFamilyData}updateMember={updateMemberAdd}/>
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
                   <EditModeDashBoard addMember={addMember} familyData={familyData} setFamilyData={setFamilyData} updateMember={updateMember} onSave={onSave} onClose={onClose}/>
                )}
            </DialogContent>

            <DialogActions>
                {mode === 'Añadir' ||
                    (mode === 'Editar' && (
                        <Button onClick={onClose} sx={{ width: '30%', textAlign: 'center', backgroundColor:theme.palette.error.main}}><Typography color={theme.palette.common.white} variant='button'>Cancelar</Typography></Button>
                    ))}
                {mode === 'Confirmar' && !globalThis.location.pathname.endsWith("/dashboard") && (
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
                        sx={{ width: globalThis.location.pathname.endsWith("/dashboard") ? '100%' :'70%' }}
                       
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
                                                mode === 'Buscar' ?
                                                search.length === 0 
                                               : mode === 'Editar' ? 
                                                     disableHandler  
                                                        : false
                                               
                                            
                                                
                                            }
                                            fullWidth
                                            variant='contained'
                                            startIcon={
                                                mode === 'Buscar' ?
                                                    <PersonSearch />
                                                    : <Save />
                                            }
                                            onClick={() => {
                                                if (mode === 'Buscar') {
                                                    onSave(search);

                                                    onClose();
                                                } else if (
                                                    mode === 'Confirmar') {
                                                    confirmationHandler();
                                                    onClose();
                                                }
                                            
                                                else if (mode === "Editar") { 

                                                        onSave(familyData)
                                                    onClose()
                                        
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
                                                    : mode === "Editar" ?
                                                        'Guardar Cambios'
                                                        : null
                                            }
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
