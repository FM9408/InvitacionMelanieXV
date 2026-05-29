import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    useTheme,
    Grid,
    IconButton,
    Popover,
    Paper,
    Menu,
    MenuItem,
    useMediaQuery,
    alpha,
} from '@mui/material';
import {
    Restaurant,
    Dashboard,
    Church,
    Logout,
    Notifications,
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { setFamilias } from '../store/slices/familiesSlice';
import { auth } from '../config/firebase/auth';
import { socket } from '../hooks/ioSockets/socket';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import LoadingPageFlower from '../pages/loadingPage';
import { setConfirmationNotifications } from '../store/slices/invitationSlice';
import {
    setMensajes,
    setMessagesNotifications,
} from '../store/slices/mensajesSlice';
import { getNotifications, setNotifications } from '../store/slices/adminSlice';
import TiempoTranscurrido from './tiempo transcurrido';

const buttonsArray = [
    {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: <Dashboard sx={{ fontSize: '1.5rem', mr: -2 }} />,
    },
    {
        name: 'Mesas',
        href: '/admin/mesas',
        icon: <Restaurant sx={{ fontSize: '1.5rem', mr: -2 }} />,
    },
    {
        name: 'Memorial',
        href: '/inMemoriam',
        icon: <Church sx={{ fontSize: '1.5rem', mr: -2 }} />,
    },
    {
        name: 'Salir',
        onClick: async () =>
            await auth
                .signOut()
                .then(() => {
                    auth.updateCurrentUser(null);
                })
                .finally(() => {
                   
                    socket.emit('adminLoggedOut', socket.id);
                    globalThis.location.href = '/';
                })
                .catch((error) => document.dispatchEvent('error', error)),
        icon: <Logout sx={{ fontSize: '1.5rem', mr: -2 }} />,
    },
];

const ButtonAnimation = ({ children }) => {
    const [timer, setTimer] = React.useState(2000);

    const colors = {
        champagne: '#D4AF37',
        ivory: '#F9F6EE',
        deepGold: '#B28D42',
    };

    React.useEffect(() => {
        const timerInterval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 100);
            } else {
                clearInterval(timerInterval);
            }
        }, 100);
    }, [timer]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: `${100 / buttonsArray.length}%`,
            }}
        >
            <motion.div
                animate={{
                    // Movimiento lateral suave (tipo péndulo)
                    x: [-10, 60, 60],
                    rotateZ: [0, 30, 45],

                    // Transición de color elegante
                    color: [colors.ivory, colors.champagne, colors.deepGold],

                    // Filtro de resplandor que pulsa suavemente
                    filter: [
                        `drop-shadow(0px 0px 8px ${colors.deepGold}60)`,
                        `drop-shadow(0px 0px 20px ${colors.champagne}80)`,
                        `drop-shadow(0px 0px 8px ${colors.deepGold}60)`,
                    ],
                }}
                transition={{
                    duration: 6,
                    delay: 1, // Más lento para que sea elegante
                    ease: 'easeInOut', // Suaviza el inicio y el fin del movimiento
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 5000,
                }}
                style={{
                    fontSize: 70,
                    display: 'flex',
                    cursor: 'pointer',
                }}
            >
                {children}
            </motion.div>
        </Box>
    );
};

// ... (Todo el resto de tus componentes e instrucciones iniciales permanecen igual)

const AppBarButtons = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = globalThis.location.pathname.toString().split('/')[2];
    const [isLocation, setIsLocation] = React.useState(false);

    // Estado local para forzar la pantalla de carga síncronamente en el hilo principal
    const [loadingRoute, setLoadingRoute] = React.useState(false);

    React.useEffect(() => {
        setIsLocation(location);
    }, [isLocation, location]);

    const handleAdminNavigation = (href) => {
        // 1. Si ya estamos en esa ruta, no hacemos nada
        if (globalThis.location.pathname === href) return;

        // 2. Pintamos la pantalla de carga de inmediato bloqueando el DOM
        setLoadingRoute(true);

        // 3. Ejecutamos el cambio de ruta de forma diferida para dar tiempo a que el Loader se renderice
        setTimeout(() => {
            navigate(href);
            // Quitamos el loader local un momento después
            setLoadingRoute(false);
        }, 50);
    };

    // Si se activó la navegación, montamos el LoadingPage encima de todo de forma síncrona
    if (loadingRoute) {
        return <LoadingPageFlower />;
        // NOTA: Si tienes el componente <LoadingPage /> exportado o accesible, impórtalo al inicio de Appbar.jsx y bájalo aquí:
        // return <LoadingPage />;
    }

    return (
        <Grid container gap={1}>
            {buttonsArray.map((button) => {
                return (
                    <Grid
                        item
                        key={button.name}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 1,
                        }}
                    >
                        <Grid
                            item
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                width: `${100 / buttonsArray.length}%`,
                            }}
                        >
                            {isLocation === button.name.toLocaleLowerCase() ?
                                <ButtonAnimation>{button.icon}</ButtonAnimation>
                            :   button.icon}
                        </Grid>
                        <Grid
                            item
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Button
                                key={button.name}
                                onClick={
                                    button.onClick ?
                                        button.onClick
                                    :   () => handleAdminNavigation(button.href) // Usamos el nuevo manejador
                                }
                                variant='text'
                                color={theme.palette.secondary.main}
                            >
                                {button.name}
                            </Button>
                        </Grid>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default function Appbar() {
    const theme = useTheme();
    const [loadingRoute, setLoadingRoute] = React.useState(false);
    const [isLocation, setIsLocation] = React.useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // --- NUEVO ESTADO PARA EL MENÚ MÓVIL ---
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    // Funciones para abrir y cerrar el menú móvil
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleAdminNavigation = (href) => {
        // 1. Si ya estamos en esa ruta, no hacemos nada
        if (globalThis.location.pathname === href) return;

        // 2. Pintamos la pantalla de carga de inmediato bloqueando el DOM
        setLoadingRoute(true);

        // 3. Ejecutamos el cambio de ruta de forma diferida para dar tiempo a que el Loader se renderice
        setTimeout(() => {
            navigate(href);
            // Quitamos el loader local un momento después
            setLoadingRoute(false);
        }, 50);
    };
    const navigate = useNavigate();

    React.useEffect(() => {
        setIsLocation(location);
        handleCloseNavMenu();
    }, [isLocation, location, isMobile]);
    // Si se activó la navegación, montamos el LoadingPage encima de todo de forma síncrona
    if (loadingRoute) {
        return <LoadingPageFlower />;
        // NOTA: Si tienes el componente <LoadingPage /> exportado o accesible, impórtalo al inicio de Appbar.jsx y bájalo aquí:
        // return <LoadingPage />;
    }

    return (
        <AppBar variant='admin' sx={{ width: '100%', zIndex: 999999 }}>
            <Toolbar sx={{ width: '100%' }}>
                {isMobile ?
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            size='large'
                            aria-label='menu de navegación'
                            aria-controls='menu-appbar'
                            aria-haspopup='true'
                            onClick={(e) => handleOpenNavMenu(e)}
                            color='inherit' // O el color de tu tema, ej: theme.palette.secondary.main
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id='menu-appbar'
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={() => handleCloseNavMenu()}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {buttonsArray.map((button) => (
                                <MenuItem
                                    key={button.name}
                                    onClick={
                                        button.onClick ?
                                            button.onClick
                                        :   () => {
                                                handleCloseNavMenu();
                                                handleAdminNavigation(
                                                    button.href
                                                );
                                            }
                                    }
                                >{
                                        globalThis.location.pathname.startsWith(`/admin/${button.name.toLowerCase()}`)? null : 
                                            <Grid container direction={'row'} spacing={1} sx={{ width: '100%' , p:1, alignItems:"center", justifyContent:"space-around", gap:1}}>
                                                <Grid item
                                        sx={{
                                            mr: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {button.icon}
                                    </Grid>
                                                <Grid item>
                                                    <Typography textAlign='center'>
                                        {button.name}
                                    </Typography>
                                    </Grid>
                                    </Grid>
                                }
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                :   <Box>
                        <AppBarButtons />
                    </Box>
                }
                <NotificationIcon />
            </Toolbar>
        </AppBar>
    );
}

const NotificationIcon = () => {
    const [onHover, setOnHover] = React.useState(false);
    const dispatch = useDispatch();
    const { familias } = useSelector((state) => state.familias);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const notificationsRef = React.useRef(null);
   
    const { notifications } = useSelector((state) => state.admin);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setOnHover(true);
    };
    

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setOnHover(false);
    };
    const theme = useTheme();

    React.useEffect(() => {
        socket.on("newNotification", (data) => {
           setAnchorEl(notificationsRef.current);
           setOnHover(true)
            dispatch(setNotifications([...notifications, data]))
            setTimeout(() => {
                setAnchorEl(null);
                setOnHover(false);
            }, 5000);
        });
        return () => {
            socket.off("newNotification");
        }
        
       
    }, [dispatch, familias,notifications]);
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'absolute',
                top: 1,
                right: 1,
                width: `${100 / buttonsArray.length}%`,
            }}
        >
            <IconButton
                onPointerOver={(e) => {
                    handlePopoverOpen(e);
                }}
                onClick={(e) => {
                    handlePopoverOpen(e);
                }}
              
             id='mouse-over-popover'
                aria-label='notificaciones'
                aria-haspopup={true}
                size='large'
                ref={notificationsRef}
                
                sx={{
                    color:
                        !onHover ?
                            theme.palette.primary.main
                        :   theme.palette.primary.dark,
                    transition: 'color .1s linear',
                }}
            >
                <Notifications />
            </IconButton>
            <Popover
                disableScrollLock={true}
                aria-describedby={'mouse-over-popover'}
                aria-controls={'mouse-over-popover'}
                aria-hidden={!onHover}
                sx={{ }}
                open={onHover}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                onMouseLeave={handlePopoverClose}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
               
               
            >
                <Box   onPointerLeave={handlePopoverClose}  sx={{p:2, maxHeight:"200px", maxWidth:"500px", overflowY:"auto", display:"flex", flexDirection:"column", gap:.25}}>
                     {notifications.length > 0 ?
                    <Grid container spacing={.1} direction={'column'}>
                        {notifications.map((notification, i) => {
                            return (
                                <Grid item key={notification.id}>
                                            <Paper sx={{ mt:1, m: .1, pt:.5, boxShadow:`2px 3px 5px ${theme.palette.secondary.main}`, border: `2px solid ${theme.palette.primary.dark}`, backgroundColor:`${alpha(theme.palette.primary.light, 0.05)}` }}>
                                    <Grid container direction={'row'} spacing={2} >
                                        <Grid item>
                                                <Typography variant="body1" color={`${theme.palette.primary.main}`} sx={{WebkitTextStroke: `.2px ${theme.palette.primary.dark}`,textShadow: `-1px -1px 5px ${theme.palette.primary.light}`, mx: 2, my: .5, width: "100%", display: "flex", alignItems: "baseline", justifyContent: "flex-start"
                                                }} >{notification.mensaje}</Typography>
                                        </Grid>
                                            <Grid item sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap:1, width:"100%"}}>
                                                <TiempoTranscurrido fechaIso={notification.fecha} kind={"notification"} />
                                        </Grid>
                                    </Grid>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                :   <Paper>
                        <Typography>No hay notificaciones</Typography>
                    </Paper>
                }
               </Box>
            </Popover>
        </Box>
    );
};
