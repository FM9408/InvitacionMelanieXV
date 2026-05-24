import React, { Suspense, useState } from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import petalPNG from '../assets/images/cherryBlossom.png';
import confettiPng from '../assets/images/confeti.png';
import gifts from '../assets/images/gifts.png';
import PetalosEfecto from '../components/Decorations/fallingPetals.jsx';
import RoseDevider from '../components/Decorations/roseDivider';
import {
    Restaurant as UtensilsIcon,
    Message as MessageIcon,
    Map as MapIcon,
    Place as PlaceIcon,
    Church,
    Celebration,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import AlertaAsistencia from '../modules/alertModal.jsx';
import { sendMensaje } from '../store/slices/mensajesSlice.jsx';
import { useNavigate } from 'react-router-dom';
import FamilyModal from '../components/FamilyModal/FamilyModal.jsx';
import { setUser } from '../store/slices/authSlice.js';

const mensajes = [
    'No olvides escribir tus buenos deseos para la quinceañera en la sección de mensajes!',
    '¿No sabes donde es el evento? ¡Puedes verlo en la sección de mapas!',
    '¡No olvides tu regalo!🎁🎁🎁🎁',
    '¡Recuerda que la fiesta es para celebrar a la quinceañera, así que trae tu mejor actitud!',
    '¡No olvides revisar tu mesa asignada en la sección de mesas!',
    '¡No olvides confirmar! Si no confirmas no podremos asignarte mesa para el evento'
];

const effects = [petalPNG, confettiPng, gifts];
function setEffectHandle() {
    const index = Math.floor(Math.random() * effects.length);
    return index;
}

const GuestDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    // Estado para controlar qué mensaje del array estático se muestra
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    // Estado booleano que controla si la alerta está visible en pantalla o guardada arriba
    const [showAlert, setShowAlert] = useState(false);

    const [isMesaAssign, setIsMesaAssign] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const [modalOpen, setModalOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [alertOpen, setALertOpen] = React.useState(false);
    const [miembros, setMiembros] = React.useState([]);
    // Estado para los miembros
    const [effct, setEffct] = React.useState('');
    
    // Estado para el mensaje
    const [mensaje, setMensaje] = useState('');
    
    const [info, setInfo] = useState({
        id: '',
        nombre: '',
        mesa: '',
    });
    
    
    
   
    React.useEffect(() => {
        // Función recursiva con timeouts dinámicos para manejar los tiempos asimétricos
        const runSequence = () => {
            // 1. Muestra la alerta de inmediato
            setShowAlert(true);

            // 2. A los 3 segundos, la oculta subiéndola
            setTimeout(() => {
                setShowAlert(false);

                // 3. Espera los 15 segundos oculta (18 segundos en total desde el inicio)
                // antes de cambiar al siguiente mensaje y reiniciar la secuencia
                setTimeout(() => {
                    setCurrentMsgIndex(
                        (prevIndex) => (prevIndex + 1) % mensajes.length
                    );
                    runSequence();
                }, 15000);
            }, 5000);
        };

        // Arranca la secuencia al montar el componente
        runSequence();

        // Limpieza por si el componente se desmonta
        return () => {
            setShowAlert(false);
        };
    }, []);

    const handleEscribirMensaje = (e) => {
        setMensaje(e.target.value); // Aquí dispararías tu evento (ej. con el emitter o socket que definas)
    };
    const handleEnviarMensaje = async () => {
        if (mensaje === '') return;
        const data = { ...info, mensaje: mensaje };

        try {
            dispatch(sendMensaje(data));
        } catch (error) {
            console.error(error);
        }

        setMensaje('');
    };
    const storagedUser = globalThis.sessionStorage.getItem('user')
    const parsedUser = JSON.parse(storagedUser);
    const id = parsedUser?.id;

  React.useEffect(() => {
    if (parsedUser) {
        if (!user?.id || user.id !== id) {
            dispatch(setUser(parsedUser));
        }
    }
}, [parsedUser, dispatch, id, user?.id]);
    React.useEffect(() => {
        const confirmaciones = miembros.map((miembro) => miembro.willAssist)
        const apellido = user?.apellido;
        const mesa = user?.mesa;

       
        setInfo({
            nombre: apellido,
            mesa: mesa,
            id: id,
        });

        setEffct(effects[setEffectHandle()]);
        // SOLUCIÓN: Sincronizar el estado local cada vez que el "user" de Redux mute
        const invitados = user?.miembros || [];
        setMiembros(invitados);

        // Control de mesas asignadas basado en el objeto actualizado
        let asignada = true;
        invitados.forEach((member) => {
            if (member.mesa === 0) {
                asignada = false;
            }
        });
        setIsMesaAssign(asignada);
       
        const interval = setInterval(() => {
            // ... tu lógica de intervalos de mensajes
            setEffct(effects[setEffectHandle()]);
        }, 20000);
        setALertOpen(confirmaciones.includes('Confirmada'))
        return () => { 
            clearInterval(interval);
        };
        // Agregamos user.miembros a las dependencias para que el efecto se ejecute al cambiar los datos
    }, [
      
        
        hasOpened,
        modalOpen,
        user,
      
        effct,
        
    ]);

    return (
        <Box sx={{ height: 'fit-content', width: '100%' }}>
            <Box sx={{ position: 'relative', p: 2 }}>
                <PetalosEfecto rutaPng={effct} cantidad={80} />
                <Alert
                    severity='info'
                    icon={false} // Estilo banner limpio, ideal para las sugerencias
                    sx={{
                        position: 'fixed',
                        left: '50%',
                        width: '90%',
                        maxWidth: '650px',
                        zIndex: 9999, // Asegura que quede por encima de todo el contenido al bajar
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #D4AF37',
                        boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
                        borderRadius: 3,
                        p: 2,
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '60px',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',

                        // POSICIONAMIENTO DINÁMICO:
                        // Si showAlert es true, baja a 20px de la parte superior.
                        // Si es false, se esconde hacia arriba completamente fuera del viewport.
                        top: 0,
                        transform:
                            showAlert ?
                                'translate(-50%, 20px)'
                            :   'translate(-50%, -150%)',
                        opacity: showAlert ? 1 : 0,

                        // Transición fluida para la entrada y salida de la pantalla
                        transition:
                            'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease-in-out',
                    }}
                >
                    <Typography
                        variant='body1'
                        sx={{
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {mensajes[currentMsgIndex]}
                    </Typography>
                </Alert>
                <Container sx={{ mb: 4, width: '100%' }}>
                    {/* Bienvenida */}
                    <Grid container spacing={2} direction={'column'}>
                        <Grid
                            item
                            xs={12}
                            md={2}
                            sx={{
                                minHeight: '100%',
                                my: 0.7,
                                p: 1,
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    mb: 3,
                                    textAlign: 'center',
                                    bgcolor: '#fcfaf5',
                                    borderRadius: 4,
                                    width: '100%',
                                    boxShadow: `2px 3px 5px ${theme.palette.secondary.main}}`,
                                }}
                            >
                                <Typography
                                    variant='h3'
                                    component='h1'
                                    gutterBottom
                                    sx={{ fontFamily: 'serif', my: -1 }}
                                >
                                    ¡Un gusto saber de ustedes, familia{' '}
                                    {info.nombre}!
                                </Typography>
                                <RoseDevider />
                                <Typography
                                    variant='body1'
                                    color={theme.palette.secondary.dark}
                                    sx={{ my: -1 }}
                                >
                                    Es un honor contar con tu presencia en este
                                    día tan especial.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={2}
                            sx={{
                                minHeight: '100%',
                                my: 0.7,
                                p: 1,
                            }}
                        >
                            <Paper elevation={0} sx={{ width: '100%', p: 1 }}>
                                <Typography variant='h4'>
                                    Los esperamos el día 27 de Junio del 2026.
                                </Typography>
                                <RoseDevider />
                                <Grid container direction={'row'}>
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{
                                            minHeight: '100%',
                                            my: 0.7,
                                            p: 1,
                                            width: '50%',
                                        }}
                                    >
                                        <Grid
                                            container
                                            direction={'column'}
                                            sx={{ width: '100%' }}
                                        >
                                            <Grid item>
                                                <Grid container direction='row'>
                                                    <Grid
                                                        item
                                                        sx={{
                                                            width: '50%',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'flex-end',
                                                        }}
                                                    >
                                                        <Church
                                                            sx={{
                                                                fontSize:
                                                                    '2.7rem',
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        sx={{
                                                            width: '50%',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'flex-start',
                                                        }}
                                                    >
                                                        <Typography variant='h3'>
                                                            Misa
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='h2'>
                                                    18:00 hrs
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{
                                            minHeight: '100%',
                                            my: 0.7,
                                            p: 1,
                                            width: '50%',
                                        }}
                                    >
                                        <Grid container direction={'column'}>
                                            <Grid item>
                                                <Grid container direction='row'>
                                                    <Grid
                                                        item
                                                        sx={{
                                                            width: '50%',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'flex-end',
                                                        }}
                                                    >
                                                        <Celebration
                                                            sx={{
                                                                fontSize:
                                                                    '2.7rem',
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        sx={{
                                                            width: '50%',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'flex-start',
                                                            maxHeight: '2.7em',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant='h3'
                                                            sx={{
                                                                maxHeight:
                                                                    '2.7em',
                                                            }}
                                                        >
                                                            Recepcion y banquete
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='h2'>
                                                    19:00 hrs
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={2}
                            sx={{
                                minHeight: '100%',
                                my: 0.7,
                                p: 1,
                            }}
                        >
                            <Grid
                                container
                                sx={{ width: '100%', overflow: 'hidden', p: 1 }}
                            >
                                {/* Sección Mesa */}
                                <Grid
                                    item
                                    xs={12}
                                    md={2}
                                    sx={{
                                        width: {
                                            xs: '100%',
                                            lg: `${100 / 3}%`,
                                        },
                                        minHeight: '100%',
                                        my: 0.7,
                                        p: 1,
                                    }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 4,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: `2px 3px 5px ${theme.palette.secondary.main}}`,
                                        }}
                                    >
                                        <CardContent
                                            sx={{ textAlign: 'center' }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'flex-end',
                                                        width: 'fit-content',
                                                    }}
                                                >
                                                    <UtensilsIcon
                                                        sx={{
                                                            fontSize: 30,
                                                            color: theme.palette
                                                                .secondary.main,
                                                            mb: 1,
                                                            mx: '-1%',
                                                        }}
                                                    />
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        width: '70%',
                                                    }}
                                                >
                                                    <Typography
                                                        variant='h4'
                                                        color={
                                                            theme.palette
                                                                .secondary.main
                                                        }
                                                        sx={{ width: '100%' }}
                                                    >
                                                        Mesas asignadas
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <RoseDevider />
                                            <Box>
                                                {isMesaAssign ?
                                                    <Box>
                                                        {miembros.map(
                                                            (invitado) => {
                                                                return (
                                                                    <Box
                                                                        key={
                                                                            invitado.id
                                                                        }
                                                                    >
                                                                        {invitado.willAssist !==
                                                                            'Rechazada' && (
                                                                            <Typography
                                                                                variant='body1'
                                                                                sx={{
                                                                                    width: '100%',
                                                                                }}
                                                                            >
                                                                                {
                                                                                    invitado.nombreCompleto
                                                                                }{' '}
                                                                                mesa:{' '}
                                                                                {(
                                                                                    invitado.mesa ===
                                                                                    0
                                                                                ) ?
                                                                                    'Aún no se te asigna una mesa'
                                                                                :   invitado.mesa
                                                                                }
                                                                            </Typography>
                                                                        )}
                                                                        
                                                                    </Box>
                                                                );
                                                            }
                                                        )}
                                                    </Box>
                                                :   <Box>
                                                        <Typography
                                                            variant='body1'
                                                            sx={{
                                                                width: '100%',
                                                            }}
                                                        >
                                                            Aún no se te ha
                                                            asignado una mesa
                                                        </Typography>
                                                    </Box>
                                                }
                                            </Box>
                                            <Typography
                                                variant='body2'
                                                color={
                                                    theme.palette.secondary.dark
                                                }
                                            >
                                                Busca este número en el plano a
                                                la entrada del salón.
                                            </Typography>
                                            <Box>
                                                <Button
                                                    variant='contained'
                                                    onClick={() => {
                                                        setModalOpen(true);
                                                    }}
                                                >
                                                    Cambiar Confirmaciones
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Sección Mensaje */}
                                <Grid
                                    item
                                    xs={12}
                                    md={2}
                                    sx={{
                                        width: {
                                            xs: '100%',
                                            lg: `${100 / 3}%`,
                                        },
                                        my: 0.7,
                                        minHeight: '100%',
                                        p: 1,
                                    }}
                                >
                                    <Card
                                        sx={{
                                            minHeight: '100%',
                                            borderRadius: 4,
                                            boxShadow: `2px 3px 5px ${theme.palette.secondary.main}}`,
                                        }}
                                    >
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 2,
                                                }}
                                            >
                                                <MessageIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: '#b28d42',
                                                    }}
                                                />
                                                <Typography variant='h6'>
                                                    Escribe una dedicatoria
                                                </Typography>
                                            </Box>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                variant='outlined'
                                                placeholder='Escribe aquí tus buenos deseos para la quinceañera'
                                                value={mensaje}
                                                onChange={(e) =>
                                                    handleEscribirMensaje(e)
                                                }
                                                sx={{ mb: 1 }}
                                            />
                                            <Button
                                                fullWidth
                                                variant='contained'
                                                size='large'
                                                onClick={() =>
                                                    handleEnviarMensaje()
                                                }
                                                sx={{
                                                    bgcolor: '#b28d42',
                                                    '&:hover': {
                                                        bgcolor: '#8e6f32',
                                                    },
                                                }}
                                            >
                                                Enviar Mensaje
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Sección Mapas */}
                                <Grid
                                    item
                                    xs={12}
                                    md={2}
                                    sx={{
                                        width: {
                                            xs: '100%',
                                            lg: `${100 / 3}%`,
                                        },
                                        minHeight: '100%',
                                        my: 0.7,
                                        pb: '1%',
                                    }}
                                >
                                    <Card
                                        sx={{
                                            borderRadius: 4,
                                            width: '100%',
                                            m: 1,
                                            minHeight: '100%',
                                            boxShadow: `2px 3px 5px ${theme.palette.secondary.main}}`,
                                        }}
                                    >
                                        <CardContent sx={{ width: '100%' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: -3,
                                                }}
                                            >
                                                <MapIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: '#b28d42',
                                                    }}
                                                />
                                                <Typography variant='h6'>
                                                    Ubicaciones
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <RoseDevider />
                                            </Box>
                                            <Grid
                                                container
                                                spacing={4}
                                                sx={{ mt: -3 }}
                                            >
                                                {/* Iglesia */}
                                                <Grid
                                                    sx={{
                                                        width: {
                                                            xs: '100%',
                                                            md: '45%',
                                                        },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                    item
                                                    xs={12}
                                                    md={6}
                                                >
                                                    <Typography
                                                        variant='subtitle1'
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <PlaceIcon
                                                            fontSize='small'
                                                            sx={{ mr: 0.5 }}
                                                        />{' '}
                                                        Ceremonia Religiosa
                                                    </Typography>
                                                    <Box
                                                        component={'iframe'}
                                                        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.9287204968323!2d-99.10466559999999!3d19.3288991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce01f77d0c3acb%3A0xd1b0c4560746b0d8!2sParroquia%20de%20San%20Andr%C3%A9s%20Ap%C3%B3stol!5e0!3m2!1ses-419!2smx!4v1778192588775!5m2!1ses-419!2smx'
                                                        sx={{
                                                            width: '100%',
                                                            height: '80%',
                                                            bgcolor: '#e0e0e0',
                                                            borderRadius: 2,
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant='body2'
                                                            color='text.secondary'
                                                        >
                                                            Espacio para Iframe
                                                            de Google Maps
                                                            (Iglesia)
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                {/* Salón */}
                                                <Grid
                                                    sx={{
                                                        width: {
                                                            xs: '100%',
                                                            md: '45%',
                                                        },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                    item
                                                    xs={12}
                                                    md={6}
                                                >
                                                    <Typography
                                                        variant='subtitle1'
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <PlaceIcon
                                                            fontSize='small'
                                                            sx={{ mr: 0.5 }}
                                                        />{' '}
                                                        Recepción y Banquete
                                                    </Typography>
                                                    <Box
                                                        component={'iframe'}
                                                        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.9994699003587!2d-99.09924989999999!3d19.3258293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85ce021da8a58193%3A0x489345e7e866ef19!2sJardin%20De%20Eventos%20Azarel!5e0!3m2!1ses-419!2smx!4v1778192391690!5m2!1ses-419!2smx'
                                                        sx={{
                                                            width: '100%',
                                                            height: '80%',
                                                            bgcolor: '#e0e0e0',
                                                            borderRadius: 2,
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant='body2'
                                                            color='text.secondary'
                                                        >
                                                            Espacio para Iframe
                                                            de Google Maps
                                                            (Salón)
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container gap={1} direction={{ xs: 'column', md: 'row'}} sx={{ width: '100%', justifyItems: 'center', alignItems: 'center'}}>
                        <Grid item
                            sx={{
                                
                                justifyContent: 'center',
                                width: {
                                    xs: '100%',
                                    md: `32.5%`,
                                },
                            }}
                        >
                             <Button
                                onClick={() => navigate(`/inMemoriam`)}
                                variant='contained'
                                size='large'
                                 sx={{
                                    backgroundColor: `${theme.palette.common.black}`,
                                    width: "100%",
                                    borderColor: theme.palette.primary.light,
                                    borderWidth: .2,
                                     borderStyle: 'solid',
                                    boxShadow: `2px 3px 5px ${theme.palette.secondary.main}}`,
                                }}
                            >
                                <Typography color='white'> Memorial</Typography>
                            </Button>
                        </Grid>
                        <Grid item
                            sx={{
                                
                                justifyContent: 'center',
                               width: {
                                    xs: '100%',
                                    md: `32.5%`,
                                },
                            }}
                        >
                            <Button
                                onClick={() => navigate(`/user/${id}`)}
                                variant='contained'
                                size='large'
                                sx={{
                                    backgroundColor: `${theme.palette.common.black}`,
                                    width: "100%",
                                    borderColor: theme.palette.primary.light,
                                    borderWidth: .2,
                                    borderStyle: 'solid',
                                     boxShadow: `2px 3px 5px ${theme.palette.secondary.main}}`,
                                }}
                            >
                                <Typography color='white'>
                                    Ver invitación de nuevo
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item
                            sx={{
                                width: {
                                    xs: '100%',
                                    md: `${100 / 3}%`,
                                },
                               
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                variant='contained'
                                size='large'
                                 sx={{
                                    backgroundColor: `${theme.palette.common.black}`,
                                    width: "100%",
                                    borderColor: theme.palette.primary.light,
                                    borderWidth: .2,
                                     borderStyle: 'solid',
                                     boxShadow: `2px 3px 5px ${theme.palette.secondary.main}}`,
                                    
                                }}
                                onClick={() => {
                                    globalThis.sessionStorage.clear()
                                    dispatch(setUser({
                                        id:""
                                    }));
                                    navigate('/');
                                }}
                            >
                                <Typography color='white'>Salir</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <FamilyModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
                mode='Confirmar'
                setHasOpened={setHasOpened}
            />
            <AlertaAsistencia
                tieneConfirmacion={alertOpen}
                setModalOpen={setModalOpen}
                onClose={() => {
                    setALertOpen(false);
                }}
            />
        </Box>
    );
};

export default GuestDashboard;
