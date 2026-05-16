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
import { useSelector, useDispatch, } from 'react-redux';
import { setAdmin, setUser } from './store/slices/authSlice';
import { ThemeContext } from '@emotion/react';
import {useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { setConfirmationNotifications } from './store/slices/invitationSlice.js';



const invitadosFetch = (async ({ dispatch }) => {
    try {
        const familias = await dispatch(fetchInvitados());
        return familias;
    } catch (error) {
        console.log(error)
    }
})
const mensajesFetch = (async ({ dispatch }) => {
    try {
        const mensajes = await dispatch(fetchMensajes());
        return mensajes;
    } catch (error) {
        console.log(error)
    }
})

function App() {
    const { mensajes,   } = useSelector(
        (state) => state.mensajes
    );
   
  const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { familias } = useSelector((state) => state.familias);
    const [background, setBackground] = useState('');
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const theme = useTheme();
   const navigate =useNavigate()
    const location = useLocation();
    const { invitados } = useSelector((state) => state.admin);

React.useMemo(() => {
        socket.connect();
        socket.io.connect();

    
        socket.on('newConnection', () => {
            dispatch(fetchInvitados());
            dispatch(fetchMensajes());
            dispatch(setFamilias(invitados));
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
    },[dispatch, familias, mensajes, invitados])


   useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                if (!location.pathname.startsWith('/admin'))  { navigate('/admin/dashboard') }
                dispatch(setAdmin(true));
                
            } else {
                dispatch(setAdmin(false));
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser?.id) dispatch(setUser(storedUser));
                if (location.pathname.startsWith("/admin")) {
                    navigate("/")
                }
                if (location.pathname.startsWith("/user")) {
                    navigate(`user/${storedUser.id}/dashboard`)
                }
               
            }
            setIsAuthChecking(false);
        });
        return () => unsubscribe();
    }, [dispatch, setAdmin, location.pathname]);
    
    // 2. CARGA DE DATA E IMÁGENES
    useEffect(() => {
        const loadAssets = async () => {
            try {
                const imagesObject = await getimages();
                dispatch(setImages(imagesObject));
                if (imagesObject.dashboardBackground) setBackground(imagesObject.dashboardBackground);
            } catch (err) {
                console.error('Error en Storage:', err);
            }
        };
        loadAssets();
    }, [dispatch]); // Solo se
    useEffect(() => {
        
       
        if (invitados.length === 0) {
            invitadosFetch({ dispatch })
            
        }
        if (mensajes.length === 0) {
            mensajesFetch({ dispatch })

        }
        if (familias.length !== invitados.length) {
            dispatch(setFamilias(invitados));
        }
    },[familias, dispatch,invitados, mensajes])

   const boxStyles = useMemo(() => ({
        minHeight: '100vh',
        backgroundImage: location.pathname === '/inMemoriam' ? 'none' : `url(${background})`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
    }), [location.pathname, background]);

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
