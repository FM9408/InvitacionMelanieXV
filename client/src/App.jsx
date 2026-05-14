import React, {  useEffect, useMemo, useState } from 'react';
import AppRouter from './routes/AppRouter';
import { onAuthStateChanged } from 'firebase/auth';
import { getimages } from './config/firebase/storage';
import { auth } from './config/firebase/auth';
import { socket } from './hooks/ioSockets/socket';
import UserContext from './hooks/Contexts/UserContext';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { setImages } from './store/slices/imagesSlice';
import { setMensajes, fetchMensajes, setMessagesNotifications } from './store/slices/mensajesSlice.jsx';
import { fetchInvitados } from './store/slices/adminSlice';
import { setFamilias } from './store/slices/familiesSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin, setUser } from './store/slices/authSlice';
import { ThemeContext } from '@emotion/react';
import {useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { setConfirmationNotifications } from './store/slices/invitationSlice.js';




function App() {
    const { mensajes,   } = useSelector(
        (state) => state.mensajes
    );
   
    const { invitados } = useSelector((state) => state.admin)
    const {user, isAdmin} = useSelector((state) => state.auth)
    const { familias } = useSelector((state) => state.familias);
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [background, setBackground] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    
    React.useMemo(() => {
        socket.connect();
        socket.io.connect();

    
        socket.on('newConnection', () => {
            dispatch(fetchInvitados());
            dispatch(fetchMensajes());
            dispatch(setFamilias(invitados));
            console.log(familias);
        });
        
        socket.on('newMensajeCreado', (data) => {
            if (familias.length > 0) {
                const familiaFind = familias.find(familia => familia.id === data.familia_Id);
                   
                dispatch(setMensajes({
                    ...data,
                    apellido: familiaFind.apellido,
                }));
                dispatch(setMessagesNotifications(`¡La familia ${familiaFind.apellido} ha enviado un mensaje!`));
            
                
            }
        })
             
        socket.on('newMensajeEliminado', (data) => {
        
            dispatch(setMensajes(mensajes.filter((m) => m.id !== data.id)));
        });
        socket.on('newFamilyCreated', (data) => {
            dispatch(setFamilias([...familias, data]));
        });
        socket.on("newMesaAsignada", (data) => {
            console.log(data)
        });
        
        socket.on('newConfirmation', (invitado) => {
            const familiaFind = familias.find(familia => familia.id === invitado.familiaId);
            const familiasStored = familias.filter(familia => familia.id !== invitado.familiaId);
            familiaFind.miembros.forEach(miembro => {
                if (miembro.id === invitado.id) {
                    miembro.willAssist = invitado.willAssist;
                    miembro.confirmationDate = invitado.confirmationDate;
                }
            });
            familiasStored.push(familiaFind);
            dispatch(setFamilias(familiasStored));
            dispatch(setConfirmationNotifications(`${invitado.nombreCompleto} ha confirmado su asistencia}`));
        
        });
    },[dispatch, familias, mensajes,])
    // 1. CONTROL DE PERSISTENCIA REAL


   


    useEffect(() => {
        const storedUser = globalThis.localStorage.getItem('user');
        const parsedUser = JSON.parse(storedUser);
        
       
    
        // Al montar, verificamos si hay un usuario en sesión activa
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                
                dispatch(setAdmin(true));
               
               
                if (globalThis.location.pathname === "/") {
                    navigate('/admin/dashboard');
                }
            } else if (parsedUser.id) {
                
                dispatch(setAdmin(false));
                dispatch(setUser(storedUser));
               navigate
            }
                
            else if (!userAuth || !user.id && !parsedUser.id && !isAdmin && location.pathname.startsWith("/admin")) { 
                navigate("/")
            } 


            setIsAuthChecking(false); // Ya terminamos de verificar
        });
       
        return () => unsubscribe();
    }, [dispatch, isAdmin, navigate, user.id, location.pathname]);
    
    // 2. CARGA DE DATA E IMÁGENES
    useEffect(() => {
        
    
        const loadAssets = async () => {
            try {
                const imagesObject = await getimages();
                dispatch(setImages(imagesObject));
                if (imagesObject.dashboardBackground) {
                    setBackground(imagesObject.dashboardBackground);
                }
            } catch (err) {
                console.error('Error cargando imágenes de Firebase:', err);
            }
        };
        return () => {
            loadAssets();
            
            
        };
    }, [familias, mensajes, invitados, dispatch])
    
    useEffect(() => {
        
        if (familias.length !== invitados.length) {
            dispatch(setFamilias(invitados));
        }
    },[familias, invitados, dispatch,])

    const boxStyles = useMemo(
        () => ({
            minHeight: '100vh',
            backgroundColor:
                location.pathname === '/inMemoriam' ?
                    '#000'
                :   theme.palette.background.default,
            backgroundImage:
                location.pathname === '/inMemoriam' ?
                    'none'
                :   `url(${background})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
        }),
        [location.pathname, theme, background]
    );

    // Mientras verifica la sesión, mostramos un estado vacío para evitar saltos de página
    if (isAuthChecking) return null;

    return (
        <UserContext.Provider value={user.user}>
            <ThemeContext.Provider value={theme}>
                <Box sx={boxStyles}>
                    <AppRouter />
                </Box>
            </ThemeContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
