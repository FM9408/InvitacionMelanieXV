import React, { useState } from 'react';
import { Button } from '@mui/material';
import LoginModal from '../modules/Admin/logIn';

const AdminLogInButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button 
                variant="outlined" 
                onClick={() => setOpen(true)}
                sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
                Acceso de administrador
            </Button>

            <LoginModal 
                open={open} 
                handleClose={() => setOpen(false)} 
            />
        </>
    );
};



export default AdminLogInButton;