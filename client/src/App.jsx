import React, { useEffect, useMemo, useState } from 'react';
import AppRouter from './routes/AppRouter';
import { onAuthStateChanged } from 'firebase/auth';
import { getimages } from './config/firebase/storage';
import { auth } from './config/firebase/auth';
import { socket } from './hooks/ioSockets/socket';
import UserContext from './hooks/Contexts/UserContext';
import { Alert, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { setImages } from './store/slices/imagesSlice';
import {
    setMensajes,
    fetchMensajes,
    setMessagesNotifications,
} from './store/slices/mensajesSlice.jsx';
import { fetchInvitados } from './store/slices/adminSlice';
import { setFamilias } from './store/slices/familiesSlice.js';
import { setMesasData } from './store/slices/mesasSlice';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin } from './store/slices/authSlice';
import { ThemeContext } from '@emotion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

export const renderMesasData = ({ dispatch, familias }) => {
    // Procesamiento en un solo ciclo (O(n))
    dispatch(setMesasData(familias));
};

export const invitadosFetch = async ({ dispatch }) => {
    try {
        const familias = await dispatch(fetchInvitados());
        return familias.payload;
    } catch (error) {
        throw new Error(error);
    }
};
const mensajesFetch = async ({ dispatch }) => {
    try {
        const mensajes = await dispatch(fetchMensajes());
        return mensajes;
    } catch (error) {
        throw new Error(error);
    }
};

function App() {
    const { mensajes } = useSelector((state) => state.mensajes);

    const dispatch = useDispatch();
    const { user, isAdmin } = useSelector((state) => state.auth);
    const { familias } = useSelector((state) => state.familias);
    const [background, setBackground] = useState('');

    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [error, setError] = React.useState({
        error: false,
        message: '',
    });

    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { invitados } = useSelector((state) => state.admin);

  // ✅ CORRECCIÓN DEFINITIVA: Sockets migrados a useEffect con limpieza de eventos
    useEffect(() => {
        socket.connect();
        socket.io.connect();

        socket.on('newConnection', async () => {
            try {
                const familiasData = await invitadosFetch({ dispatch });
                await mensajesFetch({ dispatch });
                // Usamos la data devuelta por la promesa en lugar del estado externo 'invitados'
                if (familiasData) {
                    dispatch(setFamilias(familiasData));
                }
            } catch (error) {
                setError({ error: true, message: error.message });
                setTimeout(() => setError({ error: false, message: "" }), 5000);
            }
        });

        socket.on('newMensajeCreado', (data) => {
            // Usamos un callback funcional o validación interna para evitar depender de 'familias' en el scope externo
            if (data) {
                dispatch(setMensajes(data));
                dispatch(setMessagesNotifications(`¡Has recibido un nuevo mensaje!`));
            }
        });

        socket.on('newMensajeEliminado', async () => {
            try {
                const mensajes = await mensajesFetch({ dispatch });
                if (mensajes) {
                    mensajes.forEach(m => dispatch(setMensajes(m)));
                }
            } catch (error) {
                setError({ error: true, message: error.message });
                setTimeout(() => setError({ error: false, message: "" }), 5000);
            }
        });

        socket.on('newFamilyCreated', async () => {
            try {
                await invitadosFetch({ dispatch });
            } catch (error) {
                setError({ error: true, message: error.message });
                setTimeout(() => setError({ error: false, message: "" }), 5000);
            }
        });

        socket.on('newMesaAsignada', (data) => {
            console.log("Mesa asignada vía socket:", data);
        });

        socket.on('newFamilyModified', async () => {
            try {
                await invitadosFetch({ dispatch });
            } catch (error) {
                setError({ error: true, message: error.message });
                setTimeout(() => setError({ error: false, message: "" }), 5000);
            }
        });

        socket.on('newConfirmation', async () => {
            await invitadosFetch({ dispatch });
        });

        // FUNCIÓN DE LIMPIEZA: Apaga los listeners viejos cuando el componente cambie o se desmonte
        return () => {
            socket.off('newConnection');
            socket.off('newMensajeCreado');
            socket.off('newMensajeEliminado');
            socket.off('newFamilyCreated');
            socket.off('newMesaAsignada');
            socket.off('newFamilyModified');
            socket.off('newConfirmation');
            socket.disconnect();
        };
    }, [dispatch]); // Arreglo limpio: Solo depende de dispatch

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                dispatch(setAdmin(true));
            } else {
                dispatch(setAdmin(false));
            }
            setIsAuthChecking(false);
        });
        return () => unsubscribe();
    }, [dispatch]);

    // 2. CARGA DE DATA E IMÁGENES
    useEffect(() => {
        const loadAssets = async () => {
            try {
                const imagesObject = await getimages();
                dispatch(setImages(imagesObject));
                if (imagesObject.dashboardBackground)
                    setBackground(imagesObject.dashboardBackground);
            } catch (err) {
                setError({
                    error: true,
                    message: err.message,
                });
                const errorTimeOut = setTimeout(() => {
                    setError({
                        error: false,
                        message: '',
                    });
                    clearTimeout(errorTimeOut);
                }, 5000);
            }
        };
        loadAssets();
    }, [dispatch]); // Solo se

   // ✅ CORRECCIÓN
useEffect(() => {
    renderMesasData({ dispatch, familias });
}, [dispatch, familias]);

    useEffect(() => {
        if (familias.length !== invitados.length) {
            dispatch(setFamilias(invitados));
        }
        if (!isAdmin && globalThis.location.pathname.startsWith('/admin')) {
            navigate('/');
        } else if (isAdmin && globalThis.location.pathname === '/') {
            navigate('/admin/dashboard');
        }
    }, [
        familias,
        dispatch,
        invitados,
        isAdmin,
        mensajes.length,
        error,
        navigate,
    ]);

    const boxStyles = useMemo(
        () => ({
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            backgroundImage:
                location.pathname === '/inMemoriam' ?
                    'none'
                :   `url(${background})`,
            backgroundSize: 'cover',
            display: 'flex',
            flexDirection: 'column',
        }),
        [location.pathname, background]
    );
    document.addEventListener('error', (error) => {
        setError({
            error: true,
            message: error.message,
        });
        const errorTimeOuted = setTimeout(() => {
            setError({
                error: false,
                message: '',
            });
            clearTimeout(errorTimeOuted);
        }, 5000);
    });
    if (isAuthChecking) return null;
    return (
        <UserContext.Provider value={user.user}>
            <ThemeContext.Provider value={theme}>
                <Box sx={boxStyles}>
                    <Alert
                        severity='error'
                        sx={{
                            minHeight: error.error ? '10%' : 0,
                            position: 'absolute',
                            top: error.error ? 0 : '-100%',
                            width: '100%',
                            zIndex: error.error ? 9999 : -9999,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'all 5s linear',
                        }}
                    >
                        <Typography variant='h1'>{error.message}</Typography>
                    </Alert>

                    <AppRouter />
                </Box>
            </ThemeContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
