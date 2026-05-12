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
} from '@mui/material';
import {
    Restaurant,
    Dashboard,
    Church,
    Logout,
    Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { socket } from '../hooks/ioSockets/socket';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

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
        href: '/',
        icon: <Logout sx={{ fontSize: '1.5rem', mr: -2 }} />,
    },
];

const AppBarButtons = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = globalThis.location.pathname.toString().split('/')[2];
    const [isLocation, setIsLocation] = React.useState(false);

    React.useEffect(() => {
        setIsLocation(location);
    }, [isLocation, location]);

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
                            sx={{ display: 'flex', alignItems: 'center' }}
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
                                onClick={() => navigate(button.href)}
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
    const [onHover, setOnHover] = React.useState(false);
    const { confirmationNotifications } = useSelector(
        (state) => state.invitado
    );
    const { notifications } = useSelector((state) => state.mensajes);
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const notificationsRef = React.useRef(null);


    function handlePopoverOpen(event) {
        setAnchorEl(event.currentTarget);
        setOnHover(true);
    }
    function handlePopoverClose() {
        setAnchorEl(null);
        setOnHover(false);
    }
    
    const notificationsArray = React.useMemo(() => {
        return notifications.concat(confirmationNotifications);
    }, [notifications, confirmationNotifications]);

    React.useEffect(() => {
        socket.on('newMensajeCreado', (data) => {
            setOnHover(true);
            handlePopoverOpen({ currentTarget: notificationsRef.current });
           setTimeout(() => handlePopoverClose(), 3000)
        });
        return () => {
            socket.off('newMensajeCreado');
        }
    }, [notifications, confirmationNotifications, notificationsArray]);

    return (
        <AppBar variant='admin'>
            <Toolbar sx={{ width: '100%' }}>
                <AppBarButtons />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                        top: 1,
                        right: 1,
                    }}
                >
                    <IconButton
                        aria-owns={onHover ? 'mouse-over-popup' : undefined}
                        size='large'
                        ref={notificationsRef}
                        onPointerOver={(e) => {
                            handlePopoverOpen(e);
                        }}
                        onPointerOut={() => {
                            handlePopoverClose();
                        }}
                        sx={{
                            color:
                                !onHover ?
                                    theme.palette.primary.main
                                :   theme.palette.primary.dark,
                            transition: 'color 1s ease-in-out',
                        }}
                    >
                        <Notifications />
                    </IconButton>
                    <Popover
                        id='mouse-over-popover'
                        sx={{ pointerEvents: 'none' }}
                        open={onHover}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                    >
                        {notificationsArray.length > 0 ?
                            <Grid container spacing={2} direction={'column'}>
                                {notifications.map((notification, i) => {
                                    return (
                                        <Grid item key={i}>
                                            <Paper sx={{ p: 1, m: 1 }}>
                                                <Typography>
                                                    {notification}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        :   <Paper>
                                <Typography>No hay notificaciones</Typography>
                            </Paper>
                        }
                    </Popover>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
