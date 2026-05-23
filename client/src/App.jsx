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
        return familias;
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

    React.useMemo(() => {
        socket.connect();
        socket.io.connect();

        socket.on('newConnection', async () => {
            try {
                await invitadosFetch({ dispatch });
                await mensajesFetch({ dispatch });
                dispatch(setFamilias(invitados));
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('newMensajeCreado', (data) => {
            if (familias.length > 0) {
                const familiaFind = familias.find(
                    (familia) => familia.id === data.familia_Id
                );

                dispatch(
                    setMensajes({
                        ...data,
                        apellido: familiaFind.apellido,
                    })
                );
                dispatch(
                    setMessagesNotifications(
                        `¡La familia ${familiaFind.apellido} ha enviado un mensaje!`
                    )
                );
            }
        });

        socket.on('newMensajeEliminado', (data) => {
            dispatch(setMensajes(mensajes.filter((m) => m.id !== data.id)));
        });
        socket.on('newFamilyCreated', () => {
           
            invitadosFetch({ dispatch });
        });
        socket.on('newMesaAsignada', (data) => {
            console.log(data);
        });
        socket.on('newFamilyModified', async () => {
            await invitadosFetch({ dispatch });
        });

        socket.on('newConfirmation', async () => {
            await invitadosFetch({ dispatch });
            // dispatch(setUser(invitado));
            // dispatch(setInvitado(invitado));
            // const familiaFind = familias.find(familia => familia.id === invitado.familiaId);
            // const familiasStored = familias.filter(familia => familia.id !== invitado.familiaId);
            // familiaFind.miembros.forEach(miembro => {
            //     if (miembro.id === invitado.id) {
            //         miembro.willAssist = invitado.willAssist;
            //         miembro.confirmationDate = invitado.confirmationDate;
            //     }
            // });
            // familiasStored.push(familiaFind);
            // dispatch(setFamilias(familiasStored));
            // // dispatch(setConfirmationNotifications(`${invitado.nombreCompleto} ha confirmado su asistencia}`));
            // await invitadosFetch({dispatch})
        });
    }, [dispatch, familias, mensajes, invitados]);
    // 1. CONTROL DE PERSISTENCIA REAL

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                
                dispatch(setAdmin(true));
            } else {
                dispatch(setAdmin(false))
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
            }
        };
        loadAssets();
    }, [dispatch]); // Solo se

    useMemo(() => {
        renderMesasData({ dispatch, familias });
    }, [dispatch, familias]);

    useEffect(() => {
        if (familias.length !== invitados.length) {
            dispatch(setFamilias(invitados));
        }
        if (!isAdmin && globalThis.location.pathname.startsWith("/admin")) {
            navigate("/")
        } else if (isAdmin && globalThis.location.pathname === "/" ) {
            navigate("/admin/dashboard")
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

    if (isAuthChecking) return null;
    return (
        <UserContext.Provider value={user.user}>
            <ThemeContext.Provider value={theme}>
                <Box sx={boxStyles}>
                    <Alert
                        severity='error'
                        sx={{
                            height: error.error ? '10%' : 0,
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
