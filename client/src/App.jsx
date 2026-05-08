import React from 'react';
import AppRouter from './routes/AppRouter';
import { socket } from './hooks/ioSockets/socket';
import UserContext  from './hooks/Contexts/UserContext';
import { useTheme, Box } from '@mui/material';
import { setMensajes } from './store/slices/mensajesSlice';
import { fetchInvitados } from './store/slices/adminSlice';
import './App.css';
import dashboardBackground from './assets/images/dashboardBackground.png'
import { ThemeContext } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';

function App() {
    const storage = globalThis.localStorage;
    const theme = useTheme();
    const dispatch = useDispatch();
    const { loadingMensajes } = useSelector((state) => state.mensajes);
    const { invitados, loadingAdmin } = useSelector((state) => state.admin);
    const { isAdmin } = useSelector((state) => state.auth);
    const [currentUser, setCurrentUser] = React.useState({});

    React.useEffect(() => {
        console.log(import.meta.env);

        socket.on('newFamilyCreated', () => {
            dispatch(fetchInvitados());
        });
        socket.on('newConfirmation', () => {
            dispatch(fetchInvitados());
        });
        socket.on('newMensajeCreado', (mensaje) => {
            dispatch(setMensajes(mensaje));
        });

        if (storage.getItem('user')) {
            setCurrentUser({
                visited: JSON.parse(storage.getItem('visited')),
                user: JSON.parse(storage.getItem('user')),
                isAdmin: isAdmin,
            });
        }
        if (storage.getItem('visited')) {
            const user = JSON.parse(storage.getItem('user'));

            // if (isAdmin === false) {
            //     navigate(`/user/${user.id}/dashboard`)
            // } else {
            //     navigate('/admin/dashboard')
            // }
        }

        return () => {
            if (invitados.length === 0 && loadingAdmin) {
                dispatch(fetchInvitados());
            }
            if (invitados.length !== 0 && loadingMensajes) {
                invitados.forEach((familia) => {
                    familia.mensajes.forEach((mensaje) => {
                        dispatch(setMensajes({
                            apellido: familia.apellido,
                            ...mensaje
                        }));
                    });
                });
            }
            socket.connect();
        };
    }, [invitados]);

    return (
        <UserContext.Provider value={currentUser}>
            <ThemeContext.Provider value={theme}>
                <Box
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                       
                        width: '100%',
                        '&::-webkit-scrollbar': { height: '8px' }, // Scroll horizontal delgado
                        '&::-webkit-scrollbar-thumb': {
                            background: theme.palette.secondary.main,
                            borderRadius: '10px',
                        },
                    }}
                >
                    <AppRouter />
                </Box>
            </ThemeContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
