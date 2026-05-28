import React, { useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../hooks/ioSockets/socket';
import { fetchInvitados, getNotifications, setInvitados } from '../store/slices/adminSlice.js';
import {
    setMensajes,
    setError,
    fetchMensajes,
} from '../store/slices/mensajesSlice';
import { setFamilias } from '../store/slices/familiesSlice';
// Módulos e Iconos
import GuestListModule from '../modules/GuestList/GuestListModule';
import { NotregulableLoadingCircle } from '../components/Decorations/LoadingCircle';
import AnalyticsModule from '../modules/Analytics/AnalyticsModule';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import { setMesasData } from '../store/slices/mesasSlice.js';
import { GuestManagement } from '../modules/Admin/GuestMAnagement';
import StatCard from '../components/StatCard';
import MessagesModule from '../modules/Messages/MessagesModule';
import RoseDevider from '../components/Decorations/roseDivider';

const Dashboard = () => {
    const theme = useTheme();
    const { familias } = useSelector((state) => state.familias);
    const { mensajes } = useSelector((state) => state.mensajes);
    const { invitados } = useSelector((state) => state.admin);

    const dispatch = useDispatch();
    const [loadingData, setLoadingData] = React.useState(true);
    // 1. ELIMINACIÓN DE LA VIOLACIÓN (Cálculo en Memoria)
    // En lugar de useEffect + setState, usamos useMemo.
    // Esto calcula los valores DURANTE el renderizado de forma eficiente.
    const renderMesasData = React.useCallback(() => {
        dispatch(setMesasData(familias));
    }, [dispatch, familias])  

    React.useEffect(() => {
        dispatch(fetchMensajes());
        dispatch(getNotifications())
        dispatch(fetchInvitados());
    }, [dispatch]);
    
    useEffect(() => {
        dispatch(setFamilias(invitados));
        return () => renderMesasData(invitados);
    }, [dispatch, invitados, renderMesasData]);
    // 2. Control de carga (Simulado para estética)
    const stats = useMemo(() => {
        let confirmed = 0;
        let total = 0;

        for (const familia of familias) {
            if (familia.miembros) {
                for (const miembro of familia.miembros) {
                    if (miembro.willAssist === 'Confirmado') {
                        confirmed++;
                    }
                    total++;
                }
            }
        }

        return { confirmed, total };
    }, [familias]); // Solo se recalcula si la lista de invitados en Redux cambia.
    React.useEffect(() => {
        const timer = setTimeout(() => setLoadingData(false), 2000);

        socket.on('newFamilyCreated', (familia) => {
            try {
                dispatch(setInvitados([...familias, familia]));
            
                dispatch(setFamilias([...familias, familia]));
            } catch (error) {
                setError({ error: true, message: error.message });
                const errorTimeout = setTimeout(() => {
                    setError({ error: false, message: '' });
                    clearTimeout(errorTimeout);
                }, 5000);
                return;
            }
        });
        socket.on('newConfirmation', (data) => {
            try {
                
                const invitados = dispatch(setInvitados(data));
                dispatch(setFamilias(invitados.payload));
            } catch (error) {
                setError({ error: true, message: error.message });
            }
        });
        socket.on('newInvitationViewed', (familiaId) => {
   
         
                const familiesFilter = familias.filter(
                    (f) => f.id !== familiaId
            );
                const findFamily = familias.find((f) => f.id === familiaId);
            const modifiedFamily = {...findFamily,
                hasViewed: true
            }
                
                dispatch(setInvitados([...familiesFilter, modifiedFamily]));
                
                dispatch(setFamilias([...familiesFilter, modifiedFamily]));
            
        });
        socket.on('newFamilyModified', (familia) => {
            try {
                const restFamilies = familias.filter(
                    (f) => f.id !== familia.id
                );
                dispatch(setInvitados([...restFamilies, familia]));
                dispatch(setFamilias([...restFamilies, familia]));
            } catch (error) {
                setError({ error: true, message: error.message });
                setTimeout(() => setError({ error: false, message: '' }), 5000);
            }
        });
        socket.on('newFamilyDeleted', (familia) => {
            const familiasFilter =  familias.filter(
                (f) => f.id !== familia.id
            );
            dispatch(setInvitados(familiasFilter));
            dispatch(setFamilias(familiasFilter));

        })
      
        socket.on('newMensajeEliminado', (mensajeEliminado) => {
            try {
                // Filtramos el array completo
                const nuevosMensajes = mensajes.filter(
                    (m) => m.id !== mensajeEliminado.id
                );

                // IMPORTANTE: Despachamos el ARRAY completo para actualizar Redux de un solo golpe
                // Asegúrate de que tu acción reciba el array. Si 'setMensajes' es para añadir uno solo,
                // usa la acción correspondiente de tu slice para guardar el array limpio (ej: setAllMensajes o inicializar).
                dispatch(setMensajes(nuevosMensajes));
            } catch (error) {
                dispatch(setError({ error: true, message: error.message }));
                setTimeout(
                    () => dispatch(setError({ error: false, message: '' })),
                    5000
                );
            }
        });
        socket.on("newMensajeCreado", (mensaje) => {
            
            try {
                dispatch(setMensajes([...mensajes, mensaje]));
            } catch (error) {
                dispatch(setError({ error: true, message: error.message }));
            }
        })

        return () => {

            socket.off('newMensajeEliminado');
            socket.off('newInvitationViewed');
            socket.off('newConfirmation');
            socket.off('newMensajeCreado');
            socket.off('newFamilyCreated');
            socket.off('newMesaAsignada');
            socket.off('newFamilyModified');
            clearTimeout(timer);
        };
    }, [dispatch, mensajes, familias]); // Quitamos las dependencias locales redundantes

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Grid
                container
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: { md: 'column' },
                }}
            >
                {/* SECCIÓN SUPERIOR: Stats y Analytics */}
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        width: '100%',
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md={12}
                        sx={{
                            display: { xs: 'block', md: 'inline-flex' },
                            justifyContent: 'space-between',
                            width: { xs: '100%', md: '50%' },
                            alignItems: 'center',
                        }}
                    >
                        {/* STAT CARDS - Usando los valores de 'stats' directamente */}
                        <Grid
                            item
                            sx={{ width: { xs: '100%', md: '33%' }, mr: 1 }}
                        >
                            {loadingData ?
                                <NotregulableLoadingCircle />
                            :   <StatCard
                                    title='Total'
                                    value={stats.total}
                                    icon={PeopleIcon}
                                />
                            }
                        </Grid>
                        <Grid
                            item
                            sx={{ width: { xs: '100%', md: '33%' }, mr: 1 }}
                        >
                            {loadingData ?
                                <NotregulableLoadingCircle />
                            :   <StatCard
                                    title='Confirmados'
                                    value={`${stats.confirmed}/${stats.total}`}
                                    icon={CheckCircleIcon}
                                />
                            }
                        </Grid>
                        <Grid item sx={{ width: { xs: '100%', md: '33%' } }}>
                            {loadingData ?
                                <NotregulableLoadingCircle />
                            :   <StatCard
                                    title='Mensajes'
                                    value={mensajes.length}
                                    icon={EmailIcon}
                                />
                            }
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        sx={{
                            display: 'inline',
                            width: { xs: '100%', md: '50%' },
                            mt: 1,
                        }}
                    >
                        <Paper>
                            <AnalyticsModule invitados={familias} />
                        </Paper>
                    </Grid>
                </Grid>

                {/* SECCIÓN MEDIA: Mensajes */}
                <Grid
                    item
                    xs={12}
                    md={8}
                    sx={{
                        width: '100%',
                       
                    }}
                >
                    <Paper
                        sx={{
                            minHeight: '400px',
                            mt: 1,
                            overflow:"visible",
                            minWidth: '100%',
                            borderTop: `6px solid ${theme.palette.primary.main}`,
                        }}
                    >
                        <Typography variant='adminH6' gutterBottom>
                            Mensajes de Invitados
                        </Typography>
                        <RoseDevider />
                        <Box >
                             <MessagesModule mensajesState={mensajes} />
                       </Box>
                    </Paper>
                </Grid>

                {/* SECCIÓN INFERIOR: Lista de Invitados */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            minHeight: '400px',
                            minWidth: '100%',
                            position: 'relative',
                            mt: 1,
                            borderTop: `6px solid ${theme.palette.primary.main}`,
                        }}
                    >
                        <Typography
                            variant='adminH6'
                            sx={{
                                display: 'inline-flex',
                                width: '80%',
                                justifyContent: 'center',
                            }}
                            gutterBottom
                        >
                            Lista de Invitados
                        </Typography>

                        <Box
                            sx={{
                                position: 'absolute',
                                right: '10%',
                                top: '2%',
                            }}
                        >
                            <GuestManagement
                                mode='Añadir'
                                totalGuests={stats.confirmed}
                            />
                        </Box>

                        <RoseDevider />
                        <GuestListModule invitados={familias} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
