import React, { useEffect, useMemo } from 'react';
import { Grid, Paper, Typography, Box, useTheme, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';

// Módulos e Iconos
import GuestListModule from '../modules/GuestList/GuestListModule';
import { NotregulableLoadingCircle } from '../components/Decorations/LoadingCircle';
import AnalyticsModule from '../modules/Analytics/AnalyticsModule' 
import {Notifications} from '@mui/icons-material'
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import { GuestManagement } from '../modules/Admin/GuestMAnagement';
import StatCard from '../components/StatCard';
import MessagesModule from '../modules/Messages/MessagesModule';
import RoseDevider from '../components/Decorations/roseDivider';

const Dashboard = () => {
    const theme = useTheme();
    const { invitados } = useSelector((state) => state.admin);
    const { mensajes } = useSelector((state) => state.mensajes);
    const [loadingData, setLoadingData] = React.useState(true);
    const [onHover, setOnHover] = React.useState(false);


    // 1. ELIMINACIÓN DE LA VIOLACIÓN (Cálculo en Memoria)
    // En lugar de useEffect + setState, usamos useMemo.
    // Esto calcula los valores DURANTE el renderizado de forma eficiente.
    const stats = useMemo(() => {
        let confirmed = 0;
        let total = 0;

        invitados.forEach((familia) => {
            if (familia.miembros) {
                familia.miembros.forEach((miembro) => {
                    total++;
                    if (miembro.willAssist === 'Confirmado') {
                        confirmed++;
                    }
                });
            }
        });

        return { confirmed, total };
    }, [invitados, mensajes]); // Solo se recalcula si la lista de invitados en Redux cambia.

    // 2. Control de carga (Simulado para estética)
    React.useEffect(() => {
        const timer = setTimeout(() => setLoadingData(false), 2000);
        return () => clearTimeout(timer);
    }, [ loadingData]);
   
    return (
        <Box sx={{ width: '100%' }}>
          
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
                            <AnalyticsModule />
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
                        display: { lg: 'flex' },
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        sx={{
                            p: 2,
                            minHeight: '400px',
                            m: 1,
                            width: '100%',
                            borderTop: `6px solid ${theme.palette.primary.main}`,
                        }}
                    >
                        <Typography variant='adminH6' gutterBottom>
                            Mensajes de Invitados
                        </Typography>
                        <RoseDevider />
                        <MessagesModule />
                    </Paper>
                </Grid>

                {/* SECCIÓN INFERIOR: Lista de Invitados */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 2,
                            minHeight: '400px',
                            minWidth: '450px',
                            position: 'relative',
                            m: 1,
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
                                totalGuests={stats.total}
                            />
                        </Box>

                        <RoseDevider />
                        <GuestListModule />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
