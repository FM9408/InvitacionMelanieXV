import React from 'react';
import AppRouter from './routes/AppRouter';
import { useTheme, Box, Container } from '@mui/material';
import { setMensajes } from './store/slices/mensajesSlice';
import { fetchInvitados } from './store/slices/adminSlice';
import './App.css';
import { ThemeContext } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();
    const scrollTimeout = React.useRef(null);
    const theme = useTheme();
    const dispatch = useDispatch();
    const { loadingMensajes } = useSelector((state) => state.mensajes);
    const { invitados, loadingAdmin } = useSelector((state) => state.admin);
    const UserContext = React.createContext();
    const [currentUser, setCurrentUser] = React.useState({});

    React.useEffect(() => {
        if (location.pathname.includes('/user/')) {
            document.body.classList.remove('scrolling');
            return;
        }

        const handleScroll = () => {
            // Añadimos la clase al elemento raíz (html)
            document.documentElement.classList.add('scrolling');

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

            scrollTimeout.current = setTimeout(() => {
                document.documentElement.classList.remove('scrolling');
            }, 1000);
        };
        window.addEventListener('scroll', handleScroll);

        if (invitados.length === 0 && loadingAdmin) {
            dispatch(fetchInvitados());
        }

        if (invitados.length !== 0 && loadingMensajes) {
            let mensajesArray = [];
            invitados.forEach((familia) => {
                familia.mensajes.forEach((mensaje) => {
                    mensajesArray.push({
                        ...mensaje,
                        familia: familia.apellido,
                    });
                });
            });
            dispatch(setMensajes(mensajesArray));
        }
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [invitados, location.pathname]);

    return (
        <UserContext.Provider value={currentUser}>
            <ThemeContext.Provider value={theme}>
                <Box
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.default,
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
