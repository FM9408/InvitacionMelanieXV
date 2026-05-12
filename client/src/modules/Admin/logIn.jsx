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

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(credentials.email, credentials.password);
            globalThis.localStorage.setItem('user', JSON.stringify(user));
            handleClose();
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
        
        // Aquí iría tu lógica de Firebase o API
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight="bold">Ingresar</Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <RoseDevider />

                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                    <TextField
                        fullWidth
                        label="Correo Electrónico"
                        name="email"
                        variant="outlined"
                        margin="normal"
                        required
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        margin="normal"
                        required
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        Iniciar Sesión
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default LoginModal;