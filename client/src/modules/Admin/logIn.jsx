import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../../config/firebase/auth';
import RoseDevider from '../../components/Decorations/roseDivider'; // Usando tu divisor original

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    borderTop: '6px solid #b7863b', // Color dorado/tudor de tu app
    outline: 'none',
};

const LoginModal = ({ open, handleClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = React.useState({
        email: {
            hasError: false,
            message: ""
        },
        password: {
            hasError: false,
            message: ""
        }
    });
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        login(credentials.email, credentials.password).then((user) => {
            globalThis.sessionStorage.setItem('user', JSON.stringify(user));
        }).catch((err) => {
            
            const cleanTimeout =setTimeout(() => {
                setError({
                    email: {
                        hasError: false,
                        message: ""
                    },
                    password: {
                        hasError: false,
                        message: ""
                    }
                });
            }, 3000)
            switch (err.message) {
                case 'Contraseña incorrecta':
                    setError({
                        email: {
                            hasError: false,
                            message: ""
                        },
                        password: {
                            hasError: true,
                            message: "Contraseña incorrecta"
                        }
                    });
                   return () => clearTimeout(cleanTimeout);
                case 'Email incorrecto':
                    setError({
                        password: {
                            hasError: false,
                            message: ""
                        },
                        email: {
                            hasError: true,
                            message: "Email incorrecto"
                        }
                    });
                    return () => clearTimeout(cleanTimeout);
                default:
                    console.error(error);
                    break;

            }

           
        }).finally(() => {
            setCredentials({ email: '', password: '' });
        })
    }
            
        

                // if (error.code === 'auth/user-not-found') {
                //     setError({
                //         email: {
                            
                //             hasError: true,
                //             message: 'Ese usario no existe',
                //         }
                        
                //     });
                // }
                // if (error.code === 'auth/wrong-password') {
                //     setError({
                        
                //             hasError: true,
                //             message: 'Contraseña incorrecta',
                        
                //     });
                // }
       
   
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box display='flex' justifyContent='Center' alignItems='center'>
                    <Typography variant='h2' fontWeight='bold'>
                        ¡Bienvenido de nuevo!
                    </Typography>
                    <IconButton
                        sx={{ position: 'absolute', right: '5%', top: '5%' }}
                        onClick={handleClose}
                        size='small'
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <RoseDevider />

                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <TextField
                        fullWidth
                        label='Correo Electrónico'
                        name='email'
                        color={error.email.hasError ? "error" : "primary"}
                        error={error.email.hasError}
                        helperText={error.email.message ? error.email.message : null}
                        value={credentials.email}
                        type='email'
                        variant='outlined'
                        margin='normal'
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label='Contraseña'
                        name='password'
                        color={error.password.hasError ? "error" : "primary"}
                        value={credentials.password}
                        error={error.password.hasError}
                        helperText={error.password.message ? error.password.message : null}
                        type={showPassword ? 'text' : 'password'}
                        variant='outlined'
                        margin='normal'
                        required
                        onChange={handleChange}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            edge='end'
                                        >
                                            {showPassword ?
                                                <VisibilityOff />
                                            :   <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Button
                        fullWidth
                        type='submit'
                        variant='contained'
                        color='primary'
                        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        <Typography variant='button'>Iniciar Sesión</Typography>
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default LoginModal;
